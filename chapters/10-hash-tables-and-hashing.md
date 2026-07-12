# Chapter 10: Hash Tables and Hashing

Every other lookup structure in this book *searches*. A sorted array bisects, a balanced tree walks down its levels, a linked list scans from the front. A hash table does something categorically different: it **computes** where the key belongs and goes straight there. Run the key through a hash function, reduce the result modulo the table size, and that arithmetic *is* the address — no comparisons, no traversal, no levels. One function call and one array index. That is why a hash table is `O(1)` average for insert, search, and delete, and it is the fastest general-purpose lookup structure we have.

The price is total: a hash table throws away all ordering. [Chapter 13](13-searching-algorithms.md) made the case that your search algorithm is decided the moment you pick your container, and the hash table is the container you pick when you will do many lookups by exact key and never need "the smallest," "the next one after this," or "everything between X and Y." Scatter keys across an array by their hash and those questions stop having answers — you cannot iterate in order because there is no order to iterate. If you need ordering plus fast lookup, that is what a [balanced tree](06-trees-and-binary-trees.md) and its `O(log n)` are for. If you need only membership and value-by-key, the hash table wins, and it wins by a wide margin.

Two things decide whether a real hash table delivers on the `O(1)` promise: the **hash function**, which must scatter keys uniformly and cheaply, and **collision resolution**, which decides what happens when two keys land on the same slot. The second turns out to be a cache-locality decision as much as an algorithmic one — and that is where hash tables get genuinely interesting on real hardware.

## What makes a hash function good

A hash function maps a key of arbitrary size to a fixed-width integer, and a good one has three properties. It is **deterministic** — the same key always produces the same hash, or nothing works. It is **fast** — a handful of arithmetic operations, `O(1)` in the key's size. And it **distributes uniformly** — every bucket equally likely, so a one-bit change in the key produces a large, unpredictable change in the output (the *avalanche* effect). Uniformity is the property that carries the whole structure: the `O(1)` promise assumes keys spread evenly, and a hash function that clumps them into a few buckets quietly turns your table back into a linked list.

For integers, the crudest hash is `key % tableSize` — the division method. It works only when the low bits of your keys are themselves well-mixed; keys sharing a common factor with the table size collide catastrophically, which is the classic argument for prime table sizes. For strings, the workhorse is a **polynomial rolling hash**: treat the characters as digits in base `b` and evaluate with Horner's method.

```cpp
std::size_t hashString(const std::string& key, std::size_t tableSize) {
    std::size_t h = 0;
    for (unsigned char c : key)
        h = h * 31 + c;          // base-31 polynomial, Horner's method
    return h % tableSize;
}
```

The multiplier 31 is the constant Java's `String.hashCode` uses: odd, prime, and cheap to compute as `(h << 5) - h`. Production hashes such as **FNV-1a** and **MurmurHash** are the same idea with stronger mixing:

```cpp
std::size_t hashFNV1a(const std::string& key) {
    std::size_t h = 14695981039346656037ULL;   // 64-bit offset basis
    for (unsigned char c : key) {
        h ^= c;
        h *= 1099511628211ULL;                  // 64-bit FNV prime
    }
    return h;                                    // caller reduces mod table size
}
```

Notice FNV-1a returns the full-width hash and leaves the `% tableSize` to the caller. That split is deliberate: the hash function's job is to *mix*, the table's job is to *reduce*. Keeping them separate lets one good hash serve any table size.

To key a table on your own type, specialize `std::hash` and provide `operator==`. The one rule that matters: **combine all the members** — never lean on a single field, or every key that shares it collides.

```cpp
struct Person {
    std::string name;
    int age;
    bool operator==(const Person& o) const {
        return name == o.name && age == o.age;
    }
};

template <>
struct std::hash<Person> {
    std::size_t operator()(const Person& p) const {
        std::size_t h = std::hash<std::string>{}(p.name);
        h ^= std::hash<int>{}(p.age) + 0x9e3779b9 + (h << 6) + (h >> 2);
        return h;                               // boost::hash_combine mixing
    }
};
```

That `0x9e3779b9` shuffle (from Boost's `hash_combine`) earns its keep. The naive `h1 ^ (h2 << 1)` throws away bits and makes `{name:"A", age:B}` collide with `{name:"B", age:A}` far too readily; the mixing step decorrelates the fields.

One caveat separates a *fast* hash from a *secure* one. If an attacker can choose your keys — HTTP headers, JSON fields, usernames — they can craft thousands that all hash to one bucket, collapsing your `O(1)` table into an `O(n)` one. That is a real denial-of-service vector, the "hash flooding" attack that hit web frameworks in the early 2010s. The fix is a **keyed** hash such as SipHash, seeded with a per-process random value the attacker cannot observe, which is exactly why modern languages randomize their default string hashing. Reach for it only when keys are adversarial; for trusted internal keys it is wasted cycles.

## Collisions are inevitable — the question is where they live

No matter how good the hash, collisions come early. By the pigeonhole principle any table holding more keys than it has slots must collide, and the birthday paradox guarantees collisions long before that — with a good hash and just `√m` keys you already expect one. So collision resolution is not an edge case; it is the machinery a hash table runs on constantly. The two dominant strategies, **separate chaining** and **open addressing**, are usually contrasted on a complexity footnote, but the difference that actually matters on hardware is physical: *where the colliding elements sit in memory.*

### Separate chaining

In separate chaining each bucket owns a linked list of every entry that hashed to it. A collision just appends a node.

```cpp
#include <vector>
#include <list>
#include <optional>

template <typename K, typename V>
class ChainedHashMap {
    struct Entry { K key; V value; };
    std::vector<std::list<Entry>> buckets;
    std::size_t count = 0;
    static constexpr double kMaxLoad = 0.75;

    std::size_t bucketOf(const K& key) const {
        return std::hash<K>{}(key) % buckets.size();
    }

    void rehash(std::size_t newSize) {
        std::vector<std::list<Entry>> grown(newSize);
        for (auto& bucket : buckets)
            for (auto& e : bucket)
                grown[std::hash<K>{}(e.key) % newSize].push_back(std::move(e));
        buckets = std::move(grown);
    }

public:
    explicit ChainedHashMap(std::size_t initial = 16) : buckets(initial) {}

    void insert(const K& key, const V& value) {
        auto& chain = buckets[bucketOf(key)];
        for (auto& e : chain)
            if (e.key == key) { e.value = value; return; }   // update in place
        chain.push_back({key, value});
        if (++count > kMaxLoad * buckets.size())
            rehash(buckets.size() * 2);
    }

    std::optional<V> find(const K& key) const {
        for (const auto& e : buckets[bucketOf(key)])
            if (e.key == key) return e.value;
        return std::nullopt;
    }

    bool erase(const K& key) {
        auto& chain = buckets[bucketOf(key)];
        for (auto it = chain.begin(); it != chain.end(); ++it)
            if (it->key == key) { chain.erase(it); --count; return true; }
        return false;
    }

    std::size_t size() const { return count; }
    double loadFactor() const { return double(count) / buckets.size(); }
};
```

Chaining is simple, absorbs any number of collisions without ever "filling up," and makes deletion trivial — unlink a node and you are done. Its cost is systemic and physical: every node is a separate heap allocation reached by following a pointer. Walking a chain of length three means three loads from three unrelated addresses, and on real hardware each of those is a likely **cache miss** costing 100–300 cycles while the CPU stalls. The bucket array is contiguous and cache-friendly; the chains hanging off it are scattered across the heap and are anything but. Worst case is still `O(n)` when every key lands in one bucket. (Java 8's `HashMap` mitigates the tail by upgrading a bucket from a list to a balanced tree once it grows past eight entries, capping a degenerate bucket at `O(log n)`.)

### Open addressing

Open addressing takes the opposite bet: there are no external lists at all. Every entry lives directly in the table array, and when a key's home slot is taken, you **probe** — walk to the next slot by a fixed rule until you find the key or an empty slot. The simplest rule, **linear probing**, just steps forward one slot at a time, wrapping around the end.

```cpp
#include <vector>
#include <optional>

template <typename K, typename V>
class OpenHashMap {
    enum class State { Empty, Occupied, Deleted };
    struct Slot { K key; V value; State state = State::Empty; };

    std::vector<Slot> slots;
    std::size_t count = 0;
    static constexpr double kMaxLoad = 0.5;

    std::size_t home(const K& key) const {
        return std::hash<K>{}(key) % slots.size();
    }

    void rehash(std::size_t newSize) {
        std::vector<Slot> old = std::move(slots);
        slots = std::vector<Slot>(newSize);
        count = 0;
        for (auto& s : old)
            if (s.state == State::Occupied)
                insert(s.key, s.value);          // reinserts skip tombstones
    }

public:
    explicit OpenHashMap(std::size_t initial = 16) : slots(initial) {}

    void insert(const K& key, const V& value) {
        if (count + 1 > kMaxLoad * slots.size())
            rehash(slots.size() * 2);

        std::size_t i = home(key);
        std::size_t firstDeleted = slots.size();          // sentinel: none seen
        for (std::size_t probes = 0; probes < slots.size(); ++probes) {
            Slot& s = slots[i];
            if (s.state == State::Empty) {                // key is absent; place it
                Slot& dst = (firstDeleted != slots.size()) ? slots[firstDeleted] : s;
                dst = {key, value, State::Occupied};
                ++count;
                return;
            }
            if (s.state == State::Occupied && s.key == key) {
                s.value = value;                          // update in place
                return;
            }
            if (s.state == State::Deleted && firstDeleted == slots.size())
                firstDeleted = i;                         // reuse the first tombstone
            i = (i + 1) % slots.size();                   // wrap around
        }
    }

    std::optional<V> find(const K& key) const {
        std::size_t i = home(key);
        for (std::size_t probes = 0; probes < slots.size(); ++probes) {
            const Slot& s = slots[i];
            if (s.state == State::Empty) return std::nullopt;   // a gap ends the run
            if (s.state == State::Occupied && s.key == key) return s.value;
            i = (i + 1) % slots.size();
        }
        return std::nullopt;
    }

    bool erase(const K& key) {
        std::size_t i = home(key);
        for (std::size_t probes = 0; probes < slots.size(); ++probes) {
            Slot& s = slots[i];
            if (s.state == State::Empty) return false;
            if (s.state == State::Occupied && s.key == key) {
                s.state = State::Deleted;                 // tombstone, never Empty
                --count;
                return true;
            }
            i = (i + 1) % slots.size();
        }
        return false;
    }
};
```

Two details here are where hand-rolled open addressing usually goes wrong. First, **deletion cannot clear a slot to `Empty`.** A probe stops the moment it sees an empty slot, so blanking a slot in the middle of a probe run severs every key that was placed past it — they become unreachable. The fix is the tombstone: mark the slot `Deleted`, which `find` skips over and `insert` is allowed to reuse. Second, **`insert` must reuse the first tombstone it passes** while still scanning ahead for the real key, so that a delete-then-reinsert cycle doesn't leave the table littered with dead slots. Tombstones do accumulate over a delete-heavy workload and degrade probing, which is why a rehash — which drops them — periodically earns its cost.

## Collision resolution is a cache-locality decision

Now the payoff. Chaining and open addressing have the *same* average complexity, `O(1)`, and if Big-O were the whole story you would pick based on taste. It is not the whole story, because the two schemes touch memory in opposite ways, and on modern hardware the memory-access pattern dominates everything else. This is the [Chapter 2](02-complexity-analysis.md) constant-factor lesson in its sharpest form.

Look at the layouts. Chaining keeps a contiguous bucket array, but the entries live in nodes scattered across the heap:

```
Separate chaining
┌─────┬─────┬─────┬─────┐
│ B0  │ B1  │ B2  │ B3  │   ← contiguous bucket array
└──┬──┴─────┴──┬──┴──┬──┘
   ▼           ▼     ▼
  [A]         [M]   [P]      ← nodes scattered across the heap
   ▼           ▼            (each hop is a probable cache miss)
  [B]         [N]
```

Open addressing stores everything in one flat array, so a probe sequence walks *adjacent memory*:

```
Open addressing (linear probing)
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ [A] │ [B] │ [X] │ [C] │ [Y] │ [M] │ [N] │ [P] │   ← one contiguous array
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
  └──────── 8 × 8-byte slots ≈ one 64-byte cache line ───────┘
```

When linear probing steps from slot 5 to slot 6 to slot 7, those slots are usually in the **same cache line** the CPU already fetched — and the hardware prefetcher, seeing a sequential walk, streams the next line in before you ask. Chaining's every pointer hop is a jump to an unrelated address the prefetcher cannot predict. The numbers that fall out of this are not subtle:

| Per operation | Separate chaining | Linear probing |
|---|---|---|
| Cache misses | 2–5 | 0–1 |
| Memory per element | ~32 bytes (data + 2 pointers) | ~8 bytes (data + status) |
| Typical latency (cache-resident) | ~50–100 cycles | ~5–20 cycles |
| L1 hit rate | ~60–70% | ~90–95% |

This is the whole reason the fastest hash tables in production — Google's `absl::flat_hash_map`, `boost::unordered_flat_map`, Rust's `hashbrown` (the standard library `HashMap`) — are all **open-addressed**, storing entries inline in a flat array. They accept open addressing's awkwardness (tombstones, mandatory rehashing, sensitivity to load factor) to buy the one thing that matters most on real hardware: a lookup that touches one cache line instead of chasing a linked list across memory. Chaining survives where its own strengths dominate — frequent deletion, very large values you would rather not move on every rehash, or an unknown and possibly adversarial key distribution — and it is what `std::unordered_map` is effectively required to use, for reasons the standard-library section returns to. But when you are optimizing for speed, open addressing is the default, and the argument for it is a cache-line argument, not a complexity one.

Two refinements exist for open addressing's one real weakness — linear probing's **primary clustering**, where a run of occupied slots grows and swallows more colliding keys, lengthening probes. **Quadratic probing** jumps by `1, 4, 9, …` slots instead of `1, 2, 3, …`, breaking up long runs (at the cost of giving up some cache locality and requiring a prime table size so the probes reach every slot). **Double hashing** computes the step size from a *second* hash of the key, `step = 1 + hash₂(k) mod (m−1)`, so two keys that collide at their home slot immediately diverge — the best distribution of the three, at the cost of a second hash and worse locality than a straight scan.

| | Linear probing | Quadratic probing | Double hashing |
|---|---|---|---|
| Clustering | Primary | Secondary (milder) | Minimal |
| Cache locality | Best | Good | Moderate |
| Hash functions | 1 | 1 | 2 |
| Table size | any | prime preferred | prime required |

In practice, linear probing with a good hash and a modest load factor beats the fancier sequences on most workloads precisely because it is the most cache-friendly — the theoretical clustering is a smaller tax than the extra cache misses of jumping around. Measure before you reach for double hashing.

## Load factor governs everything

The single number that controls a hash table's behavior is the **load factor** `α = n / m`, the ratio of stored elements to slots. It is the dial behind every performance claim in this chapter. For open addressing the expected number of probes for a successful lookup is about `1 / (1 − α)`: at `α = 0.5` that is two probes, at `0.9` it is ten, and as `α → 1` it goes to infinity — the table melts down as it fills. Chaining degrades more gently (average chain length is just `α`) but degrades all the same. This is why the implementations above cap the load factor — 0.75 for chaining, a more conservative 0.5 for open addressing — and grow the table when the cap is hit.

Growing means **rehashing**: allocate a larger array (conventionally 2×), recompute every key's position for the new size, and reinsert all of it. Rehashing is what keeps insertion `O(1)` *amortized* — the `O(n)` cost of a rebuild is spread across the `n` cheap inserts that triggered it — but "amortized" hides a sharp edge. Any single insert can be the one that triggers the rebuild, and that insert stalls for `O(n)`.

The stall is worse than the complexity suggests, because of *where* the work lands. Reinserting reads the old table sequentially (cache-friendly) but writes into the new table at hash-scattered positions (cache-hostile), and those random writes dominate. For a million-element table the arithmetic is stark:

| Phase of one rehash (1M elements) | Cycles | Time @ 3 GHz |
|---|---|---|
| Allocate the new table | ~100,000 | ~33 µs |
| Recompute 1M hashes | ~20,000,000 | ~6.7 ms |
| Redistribute (random writes) | ~75,000,000 | ~25 ms |
| Free the old table | ~10,000 | ~3 µs |
| **Total** | **~95,000,000** | **~32 ms** |

That one insert costs roughly six orders of magnitude more than a normal cache-hit insert, and during the rebuild both tables coexist, so peak memory is ~3× steady state. This is a genuine production failure mode: a table sized for the average case that periodically freezes on the tail. The defenses, in order of effectiveness: **pre-size** with `reserve(expected_count)` to skip rehashing entirely when you know the size ahead of time; **incremental rehashing** (migrate a fixed slice of elements per operation, trading a little steady-state throughput for no spikes — this is how Redis avoids stalling on resize); and **load-factor tuning** to balance space against how often you rebuild. When a hash table is your bottleneck, the cause is almost always one of three things: a poor hash function clustering keys (switch to FNV-1a or MurmurHash), too-frequent rehashing (pre-size or rehash incrementally), or a table larger than cache thrashing on every access (shard it, or use a cache-conscious layout).

## Compute, don't search — now across a fleet of machines

The "compute the location instead of searching for it" idea does not stop at a single array. Its most important large-scale form is **consistent hashing**, the technique that lets a distributed system route a key to one machine out of hundreds without a lookup table and without reshuffling everything when the fleet changes size.

Start with the obvious approach and watch it fail. To spread keys over `k` servers you might write `server = hash(key) % k`. It works until `k` changes. Add one server — go from 3 to 4 — and the modulus changes for *almost every key*: roughly `(k−1)/k` of them now map to a different server. In a distributed cache that means a near-total cache miss storm; in a sharded database it means migrating most of your data. The `%` operator couples every key's location to the total server count, so changing the count relocates nearly everything.

Consistent hashing breaks that coupling. Map both keys and servers onto the same circular hash space — a ring from `0` to `2³²−1`. A key belongs to the first server found walking clockwise from the key's position. Add or remove a server and only the keys in the *one arc* between it and its neighbor move; every other key stays exactly where it was.

```cpp
#include <map>
#include <string>
#include <cstdint>

class ConsistentHashRing {
    std::map<std::uint32_t, std::string> ring;      // hash position -> server
    int virtualNodes;

    std::uint32_t hashOf(const std::string& s) const {
        return static_cast<std::uint32_t>(std::hash<std::string>{}(s));
    }

public:
    explicit ConsistentHashRing(int vnodes = 100) : virtualNodes(vnodes) {}

    void addServer(const std::string& server) {
        for (int i = 0; i < virtualNodes; ++i)
            ring[hashOf(server + "#" + std::to_string(i))] = server;
    }

    void removeServer(const std::string& server) {
        for (int i = 0; i < virtualNodes; ++i)
            ring.erase(hashOf(server + "#" + std::to_string(i)));
    }

    std::string serverFor(const std::string& key) const {
        if (ring.empty()) return "";
        auto it = ring.lower_bound(hashOf(key));     // first node clockwise
        if (it == ring.end()) it = ring.begin();     // wrap around the ring
        return it->second;
    }
};
```

Two design points make this practical. The `std::map` is an ordered tree, so `serverFor` is `O(log n)` — technically it *searches*, but over the handful of ring positions, not the enormous key space, and the routing decision is still a pure computation with no coordination between machines. And each physical server is placed at many **virtual nodes** (`server#0`, `server#1`, … — 100 in the constructor above). Without them, three servers might carve the ring into wildly unequal arcs and load would skew badly; scattering 100 points per server smooths the distribution and, when a server dies, spreads its share across all the survivors instead of dumping it on one unlucky neighbor.

This is not a toy. Consistent hashing is how [Redis Cluster](11-graphs.md) and Memcached spread keys across nodes, how OpenSearch and Elasticsearch route documents to shards, how CDNs pick an edge server, and how Amazon's Dynamo and its descendants partition data. It is the same reasoning that opened the chapter — *don't search for the location, compute it* — scaled from one process's array up to a datacenter's worth of machines. [Chapter 1](01-introduction.md) framed the book's arc as ending back at hashing running a distributed database; this is that landing.

A narrower specialization worth knowing is **perfect hashing**: when the key set is *static and known in advance* — reserved keywords in a compiler, a fixed table of country codes — you can construct a collision-free hash offline that guarantees `O(1)` *worst-case* lookup, not just average. A common construction hashes into buckets, then gives each bucket of `k` keys a second-level table of size `k²` (large enough to be collision-free with good probability). The trade is rigidity: add a key and you rebuild. Tools like `gperf` generate exactly these for fixed keyword sets.

## Hash tables in your daily code

Most of the time you will not implement any of this — you will reach for `std::unordered_map` or `std::unordered_set` and let the standard library carry the machinery. Their headline pattern is membership-or-lookup in one probe, which quietly powers a huge share of everyday algorithms. Frequency counting collapses to a single pass:

```cpp
std::unordered_map<std::string, int> frequency(const std::vector<std::string>& words) {
    std::unordered_map<std::string, int> freq;
    for (const auto& w : words) ++freq[w];      // operator[] default-constructs to 0
    return freq;
}
```

And the canonical example of trading memory for time — Two Sum in `O(n)` instead of `O(n²)` — is just "remember what you've seen" in a hash map:

```cpp
std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;          // value -> index
    for (int i = 0; i < (int)nums.size(); ++i) {
        auto it = seen.find(target - nums[i]);
        if (it != seen.end()) return {it->second, i};
        seen[nums[i]] = i;
    }
    return {};
}
```

The same move — hash-set membership to deduplicate, hash-map grouping to bucket by a computed key, a hash map fronting a linked list to build an LRU cache — recurs across the whole problem catalog. Whenever a brute-force solution scans a collection looking for a matching element, a hash table usually removes the inner loop.

One thing to know about `std::unordered_map` specifically: the standard effectively mandates **separate chaining**, because it guarantees reference and pointer stability (a reference to an element stays valid across inserts) and bucket-level iteration, which an open-addressed table that relocates elements on rehash cannot provide. That guarantee is why `std::unordered_map` is measurably slower than the open-addressed `flat_hash_map` family — you are paying for stability you often don't need. When map performance genuinely matters and you don't require reference stability, an open-addressed third-party map is frequently a 2–3× win for the reasons the cache-locality section laid out.

## Engineering judgment

- **Reach for a hash table when lookups by exact key dominate and you never need order.** If you need range queries, min/max, ordered iteration, or bounded *worst-case* latency, use a [balanced tree](06-trees-and-binary-trees.md) instead — a hash table's `O(n)` worst case is real, even if rare.
- **Pre-size when you can.** `reserve(expected_count)` is the single highest-leverage line you can add: it turns a series of `O(n)` rehash stalls into none.
- **Default to open addressing for speed, chaining for flexibility.** Open addressing wins on cache locality; chaining wins on cheap deletion, reference stability, and tolerating an unknown key distribution.
- **Keep the load factor honest.** ~0.75 for chaining, ~0.5 for open addressing. It is the dial that governs everything else.
- **Randomize the hash if keys are attacker-controlled.** Otherwise hash flooding is a live DoS.
- **For concurrency, don't hand-roll.** A shared table needs the *entire* insert, erase, and rehash to be atomic, because a half-updated bucket chain or a mid-flight table swap is exactly what another thread must never observe. A single mutex is correct but serializes everything; **striped locking** (a small fixed pool of locks, keyed by `hash(key) % stripes`) is the usual compromise, and `std::shared_mutex` helps read-heavy workloads. But the right default is to guard `std::unordered_map` with external synchronization or use a proven concurrent map — lock-free hash tables are genuinely research-grade and not something to invent under deadline. See [Chapter 3.5](03.5-concurrency-fundamentals.md) for the invariant-based reasoning behind why partial updates corrupt the structure.

## Interview checklist

**Say this, not that.** The shallow answer is "a hash table is `O(1)` because it uses a hash function." The deep one: "a hash table *computes* a key's location instead of searching for it, giving `O(1)` average at the cost of all ordering — and which collision-resolution scheme you choose is really a cache-locality decision, which is why the fastest tables are open-addressed."

**The questions you'll actually get**
- *Why is the worst case `O(n)`, and how do you defend against it?* All keys colliding into one bucket; defend with a good (or keyed) hash and by keeping the load factor bounded.
- *Chaining vs. open addressing — when each?* The cache-locality trade above, plus chaining's cheap deletes and reference stability against open addressing's speed and compactness.
- *Why does deletion in open addressing need tombstones?* Clearing a slot to empty severs every key probed past it.
- *How is insertion `O(1)` if rehashing is `O(n)`?* Amortization — spread the rebuild across the inserts that caused it — and the follow-up is the latency spike that amortization hides.
- *How would you shard a cache across servers?* Consistent hashing with virtual nodes; be ready to explain why plain `hash % k` remaps almost everything on a resize.

**Common mistakes:** clearing instead of tombstoning on delete; writing `(lo + hi)`-style probe arithmetic that overflows or forgets to wrap; assuming worst-case `O(1)`; using `hash % k` for distributed routing; and hand-rolling a concurrent or lock-free table instead of reaching for a proven one.

## Summary

A hash table computes a key's address instead of searching for it — one hash, one modulo, one array access — and that is the whole source of its `O(1)` average speed and of everything it gives up, which is order. Two decisions determine whether the promise holds: a hash function that is deterministic, fast, and uniform (and keyed, if keys are hostile); and collision resolution, where the choice between separate chaining and open addressing is best understood as a cache-locality decision, since open addressing probes one contiguous cache line while chaining chases pointers across the heap — the reason the fastest production tables are open-addressed. The load factor is the dial behind all of it, and rehashing is the amortized `O(1)` mechanism that hides a real `O(n)` latency spike you pre-size to avoid. Scale the same "compute, don't search" idea from one array to a fleet of machines and you get consistent hashing, which routes keys across Redis, OpenSearch, and CDN nodes while a resize disturbs only a sliver of the data — the book's opening arc landing exactly where it promised, back at hashing, now running a distributed system. Next we turn to [graphs](11-graphs.md), where relationships rather than lookups take center stage.
