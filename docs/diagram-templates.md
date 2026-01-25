# Diagram Templates for Data Structures Book

This document provides reusable Mermaid diagram templates for different types of visualizations used throughout the book.

## Table of Contents
1. [Tree Diagrams](#tree-diagrams)
2. [Graph Diagrams](#graph-diagrams)
3. [Flowcharts](#flowcharts)
4. [Sequence Diagrams](#sequence-diagrams)
5. [State Diagrams](#state-diagrams)
6. [Memory Layout Diagrams](#memory-layout-diagrams)
7. [Algorithm Step-by-Step](#algorithm-step-by-step)

## Tree Diagrams

### Binary Tree (Basic)
````markdown
```mermaid
graph TD
    A[Root] --> B[Left Child]
    A --> C[Right Child]
    B --> D
    B --> E
    C --> F
    C --> G
```
````

### Binary Search Tree (BST)
````markdown
```mermaid
graph TD
    5[5] --> 3[3]
    5 --> 7[7]
    3 --> 2[2]
    3 --> 4[4]
    7 --> 6[6]
    7 --> 8[8]
    
    style 5 fill:#90EE90,stroke:#333,stroke-width:2px
    style 3 fill:#FFB6C1,stroke:#333,stroke-width:2px
    style 7 fill:#87CEEB,stroke:#333,stroke-width:2px
```
````

### Tree Traversal (Preorder, Inorder, Postorder)
````markdown
```mermaid
graph TD
    A[A] --> B[B]
    A --> C[C]
    B --> D[D]
    B --> E[E]
    
    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style B fill:#FFB6C1,stroke:#333,stroke-width:2px
    style C fill:#87CEEB,stroke:#333,stroke-width:2px
    style D fill:#DDA0DD,stroke:#333,stroke-width:2px
    style E fill:#DDA0DD,stroke:#333,stroke-width:2px
```
````

## Graph Diagrams

### Undirected Graph
````markdown
```mermaid
graph LR
    A --- B
    A --- C
    B --- D
    C --- D
    D --- E
```
````

### Directed Graph (Digraph)
````markdown
```mermaid
graph LR
    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    E --> A
```
````

### Weighted Graph
````markdown
```mermaid
graph LR
    A[Start] -->|5| B
    A -->|3| C
    B -->|2| D
    C -->|4| D
    D -->|1| E[End]
```
````

### Graph with Visited/Unvisited States
````markdown
```mermaid
graph TD
    A[Start: visited] --> B[unvisited]
    A --> C[unvisited]
    B --> D[unvisited]
    C --> D
    
    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style B fill:#FFE4E1,stroke:#333,stroke-width:2px
    style C fill:#FFE4E1,stroke:#333,stroke-width:2px
    style D fill:#E6E6FA,stroke:#333,stroke-width:2px
```
````

### DFS Traversal Visualization
````markdown
```mermaid
graph TD
    A[Start: A<br/>visited] 
    A --> B
    A --> C
    B --> D
    B --> E
    C --> F
    
    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style B fill:#FFB6C1,stroke:#333,stroke-width:2px
    style C fill:#FFE4E1,stroke:#333,stroke-width:2px
    style D fill:#E6E6FA,stroke:#333,stroke-width:2px
    style E fill:#E6E6FA,stroke:#333,stroke-width:2px
    style F fill:#E6E6FA,stroke:#333,stroke-width:2px
```
````

### BFS Level-by-Level
````markdown
```mermaid
graph TD
    A[Level 0: A] --> B[Level 1: B]
    A --> C[Level 1: C]
    B --> D[Level 2: D]
    B --> E[Level 2: E]
    C --> F[Level 2: F]
    
    style A fill:#90EE90,stroke:#333,stroke-width:3px
    style B fill:#FFB6C1,stroke:#333,stroke-width:2px
    style C fill:#FFB6C1,stroke:#333,stroke-width:2px
    style D fill:#87CEEB,stroke:#333,stroke-width:2px
    style E fill:#87CEEB,stroke:#333,stroke-width:2px
    style F fill:#87CEEB,stroke:#333,stroke-width:2px
```
````

## Flowcharts

### Algorithm Flowchart (General)
````markdown
```mermaid
flowchart TD
    Start([Start]) --> Init[Initialize]
    Init --> Condition{Check Condition}
    Condition -->|Yes| Process[Process Data]
    Condition -->|No| End([End])
    Process --> Update[Update State]
    Update --> Condition
```
````

### Dijkstra's Algorithm Flowchart
````markdown
```mermaid
flowchart TD
    Start([Start]) --> Init[Initialize distances<br/>dist[start] = 0]
    Init --> PQ[Add start to priority queue]
    PQ --> Select[Select node with min distance]
    Select --> Check{All nodes visited?}
    Check -->|No| Update[Update distances to neighbors]
    Update --> PQ
    Check -->|Yes| End([End])
```
````

### Sorting Algorithm Flowchart
````markdown
```mermaid
flowchart TD
    Start([Start]) --> Input[Input: Array]
    Input --> Loop1[For i = 0 to n-1]
    Loop1 --> Loop2[For j = 0 to n-i-1]
    Loop2 --> Compare{arr[j] > arr[j+1]?}
    Compare -->|Yes| Swap[Swap arr[j] and arr[j+1]]
    Compare -->|No| Next
    Swap --> Next[Next iteration]
    Next --> Check{All iterations done?}
    Check -->|No| Loop2
    Check -->|Yes| End([End: Sorted Array])
```
````

## Sequence Diagrams

### Algorithm Execution Sequence
````markdown
```mermaid
sequenceDiagram
    participant A as Algorithm
    participant DS as Data Structure
    participant Q as Queue/Stack
    
    A->>DS: Initialize
    A->>Q: Push/Pop operations
    Q->>DS: Access elements
    DS-->>A: Return result
    A->>A: Process result
```
````

### DFS Execution Sequence
````markdown
```mermaid
sequenceDiagram
    participant DFS as DFS Algorithm
    participant Stack as Stack
    participant Graph as Graph
    
    DFS->>Stack: Push start node
    loop While stack not empty
        DFS->>Stack: Pop node
        DFS->>Graph: Get neighbors
        DFS->>Stack: Push unvisited neighbors
    end
    DFS->>DFS: Return traversal order
```
````

## State Diagrams

### Data Structure State Transitions
````markdown
```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> Inserting: insert()
    Inserting --> NonEmpty: element added
    NonEmpty --> Inserting: insert()
    NonEmpty --> Deleting: delete()
    Deleting --> NonEmpty: element removed
    Deleting --> Empty: last element removed
    NonEmpty --> [*]
    Empty --> [*]
```
````

### Algorithm State Machine
````markdown
```mermaid
stateDiagram-v2
    [*] --> Initialized
    Initialized --> Processing: start()
    Processing --> Updating: update state
    Updating --> Processing: continue
    Processing --> Completed: all done
    Completed --> [*]
    Processing --> Error: exception
    Error --> [*]
```
````

## Memory Layout Diagrams

### Array Memory Layout
````markdown
```mermaid
graph LR
    subgraph Memory["Memory Layout"]
        A[Index 0<br/>Value: 10<br/>Address: 0x1000]
        B[Index 1<br/>Value: 20<br/>Address: 0x1004]
        C[Index 2<br/>Value: 30<br/>Address: 0x1008]
        D[Index 3<br/>Value: 40<br/>Address: 0x100C]
    end
    
    A --> B
    B --> C
    C --> D
```
````

### Linked List Memory Layout
````markdown
```mermaid
graph LR
    A[Node 1<br/>Data: 10<br/>Next: 0x2000] --> B[Node 2<br/>Data: 20<br/>Next: 0x3000]
    B --> C[Node 3<br/>Data: 30<br/>Next: NULL]
    
    style A fill:#90EE90
    style B fill:#FFB6C1
    style C fill:#87CEEB
```
````

## Algorithm Step-by-Step

### Step-by-Step with States
````markdown
```mermaid
graph TD
    subgraph Step1["Step 1: Initial State"]
        A1[Node A: unvisited]
        B1[Node B: unvisited]
    end
    
    subgraph Step2["Step 2: After Processing"]
        A2[Node A: visited]
        B2[Node B: processing]
    end
    
    Step1 --> Step2
    
    style A1 fill:#FFE4E1
    style B1 fill:#FFE4E1
    style A2 fill:#90EE90
    style B2 fill:#FFB6C1
```
````

### Distance Updates (Dijkstra's)
````markdown
```mermaid
graph TD
    Start[Start: dist=0] --> A[A: dist=∞ → 5]
    Start --> B[B: dist=∞ → 3]
    A --> C[C: dist=∞ → 8]
    B --> C
    B --> D[D: dist=∞ → 6]
    
    style Start fill:#90EE90,stroke:#333,stroke-width:3px
    style A fill:#FFB6C1,stroke:#333,stroke-width:2px
    style B fill:#FFB6C1,stroke:#333,stroke-width:2px
    style C fill:#E6E6FA,stroke:#333,stroke-width:2px
    style D fill:#E6E6FA,stroke:#333,stroke-width:2px
```
````

## Color Coding Guide

### Standard Color Scheme
- **Green (#90EE90)**: Visited/Processed/Completed
- **Pink (#FFB6C1)**: Currently Processing/Active
- **Light Blue (#87CEEB)**: Next to Process/Queued
- **Lavender (#E6E6FA)**: Unvisited/Unprocessed
- **Light Pink (#FFE4E1)**: Initial/Default State

### Usage Examples
```markdown
# Visited node
style A fill:#90EE90,stroke:#333,stroke-width:3px

# Currently processing
style B fill:#FFB6C1,stroke:#333,stroke-width:2px

# Next in queue
style C fill:#87CEEB,stroke:#333,stroke-width:2px

# Unvisited
style D fill:#E6E6FA,stroke:#333,stroke-width:2px
```

## Tips for Creating Diagrams

1. **Keep it Simple**: Don't overcrowd diagrams with too much information
2. **Use Colors Consistently**: Follow the color coding guide
3. **Add Labels**: Use node labels to show state information
4. **Show Progression**: Use multiple diagrams for step-by-step algorithms
5. **Test Rendering**: Always check how diagrams render on GitHub

## Tools for Diagram Creation

- **Mermaid Live Editor**: https://mermaid.live/ (for testing)
- **GitHub**: Native Mermaid support in Markdown
- **VS Code**: Mermaid preview extensions
- **Pandoc**: For PDF generation with Mermaid support






