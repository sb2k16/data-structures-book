# Contributing to Data Structures and Algorithms Book

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the Data Structures and Algorithms book.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/sb2k16/data-structures-book/issues) page
- Provide a clear description of the issue
- Include steps to reproduce if applicable
- Use appropriate labels

### Suggesting Enhancements
- Open an issue with the "enhancement" label
- Describe the proposed change
- Explain why it would be beneficial
- Provide examples if applicable

### Contributing Code
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Code Style Guidelines

### C++ Code Style
- Use C++17 or later features
- Follow modern C++ best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Include time and space complexity analysis

### Markdown Style
- Use clear headings and structure
- Include code examples with syntax highlighting
- Add diagrams where helpful
- Keep line length reasonable (80-100 characters)

### File Naming
- Use lowercase with hyphens for markdown files
- Use descriptive names for code files
- Include appropriate file extensions

## 🎯 Areas for Contribution

### High Priority
- [ ] More "watch it run" visualizations (e.g. B-tree split, more graph algorithms)
- [ ] Additional language tabs on prose snippets that are still C++-only
- [ ] Clearer explanations and more practice problems
- [ ] Bug fixes in code, benchmarks, or diagrams

### Medium Priority
- [ ] Add unit tests
- [ ] Improve documentation
- [ ] Add performance benchmarks
- [ ] Create interactive examples
- [ ] Add video explanations

### Low Priority
- [ ] Translation to other languages
- [ ] Mobile-friendly formatting
- [ ] Additional problem sets
- [ ] Advanced topics

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code compiles without warnings
- [ ] All tests pass (if applicable)
- [ ] Documentation is updated
- [ ] Changes are properly formatted
- [ ] Commit messages are descriptive

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] Added new tests
- [ ] Updated existing tests
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 🚀 Getting Started

### Development Setup
1. Clone your fork: `git clone https://github.com/YOUR_USERNAME/data-structures-book.git`
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes
5. Commit: `git commit -m 'Add your feature'`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Local Development
- The site is in `web/`: `cd web && npm install && npm run dev`
- Run `npm run build` before opening a PR to confirm it still builds
- Prose code snippets in the chapters are C++/Python/Java/Go — keep the four in sync when you edit one
- Verify markdown/MDX rendering locally

## 📚 Resources

### Documentation
- [C++ Reference](https://en.cppreference.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown](https://guides.github.com/features/mastering-markdown/)

### Tools
- Code editor with C++ support
- Markdown preview tool
- Git client
- C++ compiler (GCC, Clang, or MSVC)

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Individual chapter acknowledgments
- Release notes

## 📞 Support

If you have questions about contributing:
- Open an issue with the "question" label
- Join discussions in [GitHub Discussions](https://github.com/sb2k16/data-structures-book/discussions)
- Check existing issues and pull requests

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Data Structures and Algorithms book! 🎉
