# Contributing to Drafts Auto-Tagging Script

Thank you for your interest in contributing to the Drafts Auto-Tagging Script! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Drafts version
   - Device/OS version
   - Error messages
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Enhancements

1. **Check existing feature requests** in issues
2. **Describe the enhancement** in detail
3. **Explain the use case** and benefits
4. **Consider backwards compatibility**

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test thoroughly** with your own Drafts setup
5. **Update documentation** if needed
6. **Submit a pull request**

## 📋 Development Setup

### Prerequisites

- Drafts app (iOS/iPadOS/macOS)
- Anthropic API account for testing
- Basic JavaScript knowledge
- Understanding of Drafts scripting

### Local Development

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/drafts-auto-tagging.git
   ```

2. Create a test configuration:
   ```bash
   cp config.sample.js config.test.js
   # Edit config.test.js with your test API key
   ```

3. Add config.test.js to .gitignore to prevent accidental commits

### Testing Guidelines

- **Test with small batches first** (5-10 drafts)
- **Verify tag generation quality** for different content types
- **Check error handling** with invalid inputs
- **Test multi-folder scenarios**
- **Verify cost calculations** are accurate

## 🎯 Coding Standards

### JavaScript Style

- Use **const/let** instead of var
- **Meaningful variable names** (no single letters except loops)
- **Clear function names** that describe what they do
- **Comments** for complex logic
- **Error handling** for all async operations

### Code Structure

```javascript
// ========================================
// Section Headers like this
// ========================================

/**
 * Function documentation
 * @param {Object} draft - The draft object
 * @returns {Promise<Array>} Generated tags
 */
async function generateTags(draft) {
    // Implementation
}
```

### Security Guidelines

- **Never commit API keys** or credentials
- **Use placeholder values** in examples
- **Sanitize user inputs** when processing
- **Follow principle of least privilege**

## 📝 Documentation Standards

### Code Documentation

- **Document all functions** with JSDoc format
- **Explain complex algorithms** with inline comments
- **Keep comments up to date** with code changes

### README Updates

- **Update feature lists** when adding functionality
- **Update installation steps** if process changes
- **Keep examples current** and working
- **Update cost estimates** if pricing changes

## 🧪 Testing Requirements

### Before Submitting PRs

- [ ] **Test with real Drafts data**
- [ ] **Verify error handling works**
- [ ] **Check cost calculations**
- [ ] **Test configuration options**
- [ ] **Ensure backwards compatibility**
- [ ] **Update documentation**

### Test Cases to Consider

1. **Empty drafts** - How does the script handle drafts with no content?
2. **Long content** - Does the 1200 character limit work correctly?
3. **Special characters** - Japanese text, emojis, formatting
4. **API errors** - Network issues, rate limits, authentication
5. **Edge cases** - Drafts with existing tags, corrupted data

## 🏷️ Tag Generation Quality

### Good Tags Characteristics

- **2-10 characters** in Japanese
- **Relevant to content** (not generic)
- **Searchable terms** (common vocabulary)
- **Diverse categories** (topic, type, purpose)

### Testing Tag Quality

```javascript
// Example test cases
const testCases = [
    {
        content: "Meeting notes about Q4 planning...",
        expectedTags: ["会議", "計画", "四半期"],
        avoidTags: ["メモ", "文書"] // too generic
    }
];
```

## 📋 Pull Request Process

### PR Checklist

- [ ] **Descriptive title** summarizing the change
- [ ] **Detailed description** of what and why
- [ ] **Link to related issue** (if applicable)
- [ ] **Screenshots** for UI changes
- [ ] **Test results** with real data
- [ ] **Documentation updates** included

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested with small batch (5-10 drafts)
- [ ] Tested error scenarios
- [ ] Verified cost calculations

## Related Issues
Fixes #123
```

## 🎖️ Recognition

Contributors will be:
- **Listed in README.md** (if desired)
- **Mentioned in release notes** for significant contributions
- **Thanked** in commit messages

## ❓ Questions?

- **Open an issue** for questions about contributing
- **Check existing discussions** for common topics
- **Be patient** - maintainers are volunteers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make this project better! 🙏