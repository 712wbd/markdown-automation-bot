import { TemplateConfig } from '@/types';

export const githubReadmeTemplate: TemplateConfig = {
  id: 'github-readme',
  name: 'GitHub README.md',
  description: '專業的 GitHub 專案 README 文件模板，包含專案介紹、安裝說明、使用範例等完整內容',
  category: 'github',
  tags: ['github', 'readme', 'documentation', 'project'],
  fields: [
    {
      name: 'projectName',
      label: '專案名稱',
      type: 'text',
      required: true,
      placeholder: 'My Awesome Project',
      validation: { minLength: 1, maxLength: 100 },
    },
    {
      name: 'description',
      label: '專案簡介',
      type: 'textarea',
      required: true,
      placeholder: '這是一個...',
      validation: { minLength: 10, maxLength: 500 },
    },
    {
      name: 'badges',
      label: 'Badges (可選)',
      type: 'array',
      required: false,
      placeholder: '[![npm](https://img.shields.io/npm/v/package.svg)](...)',
    },
    {
      name: 'features',
      label: '主要功能',
      type: 'array',
      required: true,
      validation: { minItems: 1 },
    },
    {
      name: 'installation',
      label: '安裝指令',
      type: 'code',
      required: true,
      language: 'bash',
      placeholder: 'npm install package-name',
    },
    {
      name: 'usageExample',
      label: '使用範例',
      type: 'code',
      required: true,
      language: 'javascript',
    },
    {
      name: 'apiDocs',
      label: 'API 文檔連結 (可選)',
      type: 'url',
      required: false,
    },
    {
      name: 'contributing',
      label: '貢獻指南 (可選)',
      type: 'text',
      required: false,
    },
    {
      name: 'license',
      label: '授權協議',
      type: 'select',
      required: true,
      options: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Other'],
      defaultValue: 'MIT',
    },
    {
      name: 'author',
      label: '作者',
      type: 'text',
      required: true,
    },
    {
      name: 'repository',
      label: 'GitHub Repository URL',
      type: 'url',
      required: false,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{projectName}}

{% if badges %}
{% for badge in badges %}
{{badge}}
{% endfor %}
{% endif %}

{{description}}`,
    },
    {
      id: 'features',
      title: 'Features',
      order: 2,
      required: true,
      content: `## ✨ Features

{% for feature in features %}
- {{feature}}
{% endfor %}`,
    },
    {
      id: 'installation',
      title: 'Installation',
      order: 3,
      required: true,
      content: `## 📦 Installation

\`\`\`bash
{{installation}}
\`\`\``,
    },
    {
      id: 'usage',
      title: 'Usage',
      order: 4,
      required: true,
      content: `## 🚀 Usage

\`\`\`javascript
{{usageExample}}
\`\`\``,
    },
    {
      id: 'api',
      title: 'API Documentation',
      order: 5,
      required: false,
      condition: 'apiDocs',
      content: `## 📚 API Documentation

For detailed API documentation, please visit: [{{apiDocs}}]({{apiDocs}})`,
    },
    {
      id: 'contributing',
      title: 'Contributing',
      order: 6,
      required: false,
      condition: 'contributing',
      content: `## 🤝 Contributing

{{contributing}}

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.`,
    },
    {
      id: 'license',
      title: 'License',
      order: 7,
      required: true,
      content: `## 📄 License

This project is licensed under the {{license}} License - see the [LICENSE](LICENSE) file for details.`,
    },
    {
      id: 'author',
      title: 'Author',
      order: 8,
      required: true,
      content: `## 👤 Author

**{{author}}**

{% if repository %}
- GitHub: [{{repository}}]({{repository}})
{% endif %}`,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'markdown',
    encoding: 'utf-8',
  },
};

export const githubContributingTemplate: TemplateConfig = {
  id: 'github-contributing',
  name: 'CONTRIBUTING.md',
  description: '標準的開源專案貢獻指南，說明如何參與專案開發',
  category: 'github',
  tags: ['github', 'contributing', 'open-source', 'guidelines'],
  fields: [
    {
      name: 'projectName',
      label: '專案名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'codeOfConduct',
      label: '行為準則連結',
      type: 'url',
      required: false,
      defaultValue: 'CODE_OF_CONDUCT.md',
    },
    {
      name: 'issueProcess',
      label: 'Issue 提交流程',
      type: 'textarea',
      required: false,
    },
    {
      name: 'prProcess',
      label: 'Pull Request 流程',
      type: 'textarea',
      required: false,
    },
    {
      name: 'codingStandards',
      label: '編碼規範',
      type: 'array',
      required: false,
    },
    {
      name: 'testRequirements',
      label: '測試要求',
      type: 'textarea',
      required: false,
    },
    {
      name: 'setupInstructions',
      label: '開發環境設置',
      type: 'code',
      required: true,
      language: 'bash',
    },
  ],
  sections: [
    {
      id: 'intro',
      title: 'Introduction',
      order: 1,
      required: true,
      content: `# Contributing to {{projectName}}

First off, thank you for considering contributing to {{projectName}}! It's people like you that make {{projectName}} such a great tool.

{% if codeOfConduct %}
## Code of Conduct

This project and everyone participating in it is governed by the [{{projectName}} Code of Conduct]({{codeOfConduct}}). By participating, you are expected to uphold this code.
{% endif %}`,
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      order: 2,
      required: true,
      content: `## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn
- Git

### Setting Up Development Environment

\`\`\`bash
{{setupInstructions}}
\`\`\``,
    },
    {
      id: 'how-to-contribute',
      title: 'How to Contribute',
      order: 3,
      required: true,
      content: `## How Can I Contribute?

### Reporting Bugs

{% if issueProcess %}
{{issueProcess}}
{% else %}
Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected to see**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, etc.)
{% endif %}

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**`,
    },
    {
      id: 'pull-requests',
      title: 'Pull Requests',
      order: 4,
      required: true,
      content: `## Pull Request Process

{% if prProcess %}
{{prProcess}}
{% else %}
1. Fork the repository and create your branch from \`main\`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a clear and descriptive commit message
6. Submit your pull request with a comprehensive description

### Pull Request Guidelines

- **Keep pull requests focused** - One feature or bug fix per PR
- **Write tests** - All new features should include tests
- **Update documentation** - Update README.md and other docs as needed
- **Follow the code style** - Maintain consistency with existing code
- **Write clear commit messages** - Use present tense ("Add feature" not "Added feature")
{% endif %}`,
    },
    {
      id: 'coding-standards',
      title: 'Coding Standards',
      order: 5,
      required: false,
      condition: 'codingStandards',
      content: `## Coding Standards

{% for standard in codingStandards %}
- {{standard}}
{% endfor %}`,
    },
    {
      id: 'testing',
      title: 'Testing',
      order: 6,
      required: false,
      condition: 'testRequirements',
      content: `## Testing Requirements

{{testRequirements}}`,
    },
    {
      id: 'community',
      title: 'Community',
      order: 7,
      required: true,
      content: `## Community

### Getting Help

If you have questions, you can:
- Open an issue with the question label
- Join our community chat
- Check the documentation

### Recognition

Contributors will be recognized in our README.md file.

Thank you for your contributions! 🎉`,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'markdown',
    encoding: 'utf-8',
  },
};

export const githubIssueTemplate: TemplateConfig = {
  id: 'github-issue-bug',
  name: 'GitHub Issue Template (Bug Report)',
  description: 'Bug 回報的 Issue 模板，幫助使用者提供完整的問題資訊',
  category: 'github',
  tags: ['github', 'issue', 'bug', 'template'],
  fields: [
    {
      name: 'issueTitle',
      label: 'Issue 標題',
      type: 'text',
      required: true,
      placeholder: '[Bug] Brief description of the issue',
    },
    {
      name: 'description',
      label: '問題描述',
      type: 'textarea',
      required: true,
      placeholder: 'A clear and concise description of what the bug is.',
    },
    {
      name: 'stepsToReproduce',
      label: '重現步驟',
      type: 'array',
      required: true,
    },
    {
      name: 'expectedBehavior',
      label: '預期行為',
      type: 'textarea',
      required: true,
    },
    {
      name: 'actualBehavior',
      label: '實際行為',
      type: 'textarea',
      required: true,
    },
    {
      name: 'environment',
      label: '環境資訊',
      type: 'object',
      required: true,
      properties: {
        os: { type: 'text', label: 'Operating System' },
        nodeVersion: { type: 'text', label: 'Node.js Version' },
        packageVersion: { type: 'text', label: 'Package Version' },
      },
    },
    {
      name: 'screenshots',
      label: '截圖 (可選)',
      type: 'array',
      required: false,
    },
    {
      name: 'additionalContext',
      label: '額外資訊',
      type: 'textarea',
      required: false,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{issueTitle}}`,
    },
    {
      id: 'description',
      title: 'Description',
      order: 2,
      required: true,
      content: `## 🐛 Bug Description

{{description}}`,
    },
    {
      id: 'reproduction',
      title: 'Steps to Reproduce',
      order: 3,
      required: true,
      content: `## 📝 Steps to Reproduce

{% for step in stepsToReproduce %}
{{loop.index1}}. {{step}}
{% endfor %}`,
    },
    {
      id: 'expected',
      title: 'Expected Behavior',
      order: 4,
      required: true,
      content: `## ✅ Expected Behavior

{{expectedBehavior}}`,
    },
    {
      id: 'actual',
      title: 'Actual Behavior',
      order: 5,
      required: true,
      content: `## ❌ Actual Behavior

{{actualBehavior}}`,
    },
    {
      id: 'environment',
      title: 'Environment',
      order: 6,
      required: true,
      content: `## 💻 Environment

- **OS**: {{environment.os}}
- **Node.js Version**: {{environment.nodeVersion}}
- **Package Version**: {{environment.packageVersion}}`,
    },
    {
      id: 'screenshots',
      title: 'Screenshots',
      order: 7,
      required: false,
      condition: 'screenshots',
      content: `## 📸 Screenshots

{% for screenshot in screenshots %}
![Screenshot]({{screenshot}})
{% endfor %}`,
    },
    {
      id: 'additional',
      title: 'Additional Context',
      order: 8,
      required: false,
      condition: 'additionalContext',
      content: `## 📋 Additional Context

{{additionalContext}}`,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'markdown',
    encoding: 'utf-8',
  },
};

export const githubPullRequestTemplate: TemplateConfig = {
  id: 'github-pr',
  name: 'GitHub Pull Request Template',
  description: 'Pull Request 模板，確保 PR 包含所有必要資訊',
  category: 'github',
  tags: ['github', 'pull-request', 'pr', 'template'],
  fields: [
    {
      name: 'prTitle',
      label: 'PR 標題',
      type: 'text',
      required: true,
      placeholder: 'feat: Add new feature',
    },
    {
      name: 'prType',
      label: 'PR 類型',
      type: 'select',
      required: true,
      options: ['Feature', 'Bug Fix', 'Documentation', 'Refactoring', 'Performance', 'Test', 'Chore'],
    },
    {
      name: 'description',
      label: '變更描述',
      type: 'textarea',
      required: true,
    },
    {
      name: 'motivation',
      label: '動機與背景',
      type: 'textarea',
      required: true,
    },
    {
      name: 'changes',
      label: '主要變更',
      type: 'array',
      required: true,
    },
    {
      name: 'breakingChanges',
      label: 'Breaking Changes (可選)',
      type: 'array',
      required: false,
    },
    {
      name: 'relatedIssues',
      label: '相關 Issues',
      type: 'array',
      required: false,
      placeholder: '#123, #456',
    },
    {
      name: 'testCoverage',
      label: '測試覆蓋',
      type: 'textarea',
      required: true,
    },
    {
      name: 'checklist',
      label: 'Checklist',
      type: 'checklist',
      required: true,
      items: [
        'Code follows the project style guidelines',
        'Self-review of code completed',
        'Code commented in hard-to-understand areas',
        'Documentation updated',
        'Tests added/updated',
        'All tests passing',
        'No new warnings generated',
      ],
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{prTitle}}

## Type: {{prType}}`,
    },
    {
      id: 'description',
      title: 'Description',
      order: 2,
      required: true,
      content: `## 📝 Description

{{description}}`,
    },
    {
      id: 'motivation',
      title: 'Motivation',
      order: 3,
      required: true,
      content: `## 💡 Motivation and Context

{{motivation}}`,
    },
    {
      id: 'changes',
      title: 'Changes',
      order: 4,
      required: true,
      content: `## 🔄 Changes Made

{% for change in changes %}
- {{change}}
{% endfor %}`,
    },
    {
      id: 'breaking',
      title: 'Breaking Changes',
      order: 5,
      required: false,
      condition: 'breakingChanges',
      content: `## ⚠️ Breaking Changes

{% for change in breakingChanges %}
- {{change}}
{% endfor %}`,
    },
    {
      id: 'related',
      title: 'Related Issues',
      order: 6,
      required: false,
      condition: 'relatedIssues',
      content: `## 🔗 Related Issues

{% for issue in relatedIssues %}
Closes {{issue}}
{% endfor %}`,
    },
    {
      id: 'testing',
      title: 'Testing',
      order: 7,
      required: true,
      content: `## 🧪 Testing

{{testCoverage}}`,
    },
    {
      id: 'checklist',
      title: 'Checklist',
      order: 8,
      required: true,
      content: `## ✅ Checklist

{% for item in checklist %}
- [ ] {{item}}
{% endfor %}`,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'markdown',
    encoding: 'utf-8',
  },
};

export const githubChangelogTemplate: TemplateConfig = {
  id: 'github-changelog',
  name: 'CHANGELOG.md',
  description: '標準的 CHANGELOG 文件模板，遵循 Keep a Changelog 格式',
  category: 'github',
  tags: ['github', 'changelog', 'versioning', 'releases'],
  fields: [
    {
      name: 'projectName',
      label: '專案名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'releases',
      label: '版本發布記錄',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        version: { type: 'text', label: 'Version' },
        date: { type: 'date', label: 'Release Date' },
        added: { type: 'array', label: 'Added Features' },
        changed: { type: 'array', label: 'Changed' },
        deprecated: { type: 'array', label: 'Deprecated' },
        removed: { type: 'array', label: 'Removed' },
        fixed: { type: 'array', label: 'Fixed' },
        security: { type: 'array', label: 'Security' },
      },
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# Changelog

All notable changes to {{projectName}} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`,
    },
    {
      id: 'releases',
      title: 'Releases',
      order: 2,
      required: true,
      repeat: {
        items: 'releases',
        as: 'release',
      },
      content: `## [{{release.version}}] - {{release.date}}

{% if release.added %}
### Added
{% for item in release.added %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.changed %}
### Changed
{% for item in release.changed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.deprecated %}
### Deprecated
{% for item in release.deprecated %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.removed %}
### Removed
{% for item in release.removed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.fixed %}
### Fixed
{% for item in release.fixed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.security %}
### Security
{% for item in release.security %}
- {{item}}
{% endfor %}
{% endif %}`,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot',
    createdAt: new Date(),
    updatedAt: new Date(),
    language: 'markdown',
    encoding: 'utf-8',
  },
};

export const githubTemplates = [
  githubReadmeTemplate,
  githubContributingTemplate,
  githubIssueTemplate,
  githubPullRequestTemplate,
  githubChangelogTemplate,
];
