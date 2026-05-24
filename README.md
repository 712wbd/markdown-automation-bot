# 🤖 MarkdownBot Pro

**企業級 Markdown 自動化生成機器人** - 智能模板引擎 + 多場景支援 + CLI 互動界面

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ 核心功能

MarkdownBot Pro 是一個功能強大的 Markdown 文件自動化生成工具，專為需要頻繁創建各類文檔的開發者和團隊設計。

### 🎯 主要特性

- **智能模板引擎**: 支援變量替換、條件渲染、循環處理的高級模板系統
- **14+ 內建模板**: 涵蓋 GitHub、技術文檔、API 文檔、學習筆記、博客文章等多種場景
- **自動檔名規範化**: 自動處理特殊字元、長度限制、重複檔名
- **Markdown 語法驗證**: 即時檢測語法錯誤，確保生成的文件符合標準
- **互動式 CLI**: 友善的命令列界面，支援多種操作模式
- **批量生成**: 一次性生成多個文件，提高工作效率
- **自定義模板**: 支援導入和創建自定義模板
- **完整的測試覆蓋**: 包含單元測試和邊界測試，確保穩定性

## 📦 安裝

### 系統要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安裝方式

```bash
npm install -g markdownbot-pro

mdbot --version
```

或在專案中本地安裝：

```bash
npm install markdownbot-pro --save-dev

npx mdbot --help
```

## 🚀 快速開始

### 1. 查看可用模板

```bash
mdbot list

mdbot info github-readme
```

### 2. 互動式生成文件

```bash
mdbot generate --interactive

mdbot gen -i
```

### 3. 快速生成 (指定模板)

```bash
mdbot generate --template github-readme --output ./docs

mdbot gen -t github-contributing -o ./
```

### 4. 驗證 Markdown 文件

```bash
mdbot validate ./README.md

mdbot validate ./docs/*.md
```

### 5. 搜索模板

```bash
mdbot search "github"

mdbot search "api"
```

## 📚 支援的模板類別

### GitHub 相關模板

- **README.md** (`github-readme`): 專業的專案 README 文件
- **CONTRIBUTING.md** (`github-contributing`): 開源專案貢獻指南
- **Issue 模板** (`github-issue-bug`): Bug 回報 Issue 模板
- **Pull Request 模板** (`github-pr`): PR 描述模板
- **CHANGELOG.md** (`github-changelog`): 版本變更記錄

### 技術文檔模板

- **技術設計文檔** (`tech-design-doc`): 系統架構與技術方案設計
- **API 文檔** (`api-documentation`): RESTful API 文檔
- **教程** (`tutorial`): 技術教程與使用指南
- **會議記錄** (`meeting-notes`): 會議紀錄模板
- **專案提案** (`project-proposal`): 專案規劃與提案文檔

### 學習與寫作模板

- **學習筆記** (`learning-notes`): 學習內容記錄
- **部落格文章** (`blog-post`): 技術博客文章
- **技術文章** (`technical-article`): 深度技術解析文章
- **研究筆記** (`research-notes`): 研究過程與實驗記錄

## 💻 CLI 命令參考

### `generate` / `gen` / `g`

生成 Markdown 文件

```bash
mdbot generate [options]

Options:
  -t, --template <id>     模板 ID
  -c, --category <cat>    模板類別
  -o, --output <path>     輸出目錄 (預設: 當前目錄)
  -f, --filename <name>   輸出檔名
  --no-validate          跳過 Markdown 語法驗證
  --no-backup            不備份現有文件
  --dry-run              預覽輸出不寫入文件
  -i, --interactive      互動模式
```

### `list` / `ls`

列出所有可用模板

```bash
mdbot list [options]

Options:
  -c, --category <cat>   依類別篩選
  -t, --tag <tag>        依標籤篩選
  --json                 JSON 格式輸出
```

### `info`

顯示模板詳細資訊

```bash
mdbot info <template-id>

範例:
  mdbot info github-readme
  mdbot info api-documentation
```

### `validate`

驗證 Markdown 文件語法

```bash
mdbot validate <file>

範例:
  mdbot validate ./README.md
  mdbot validate ./docs/*.md
```

### `batch`

批量生成多個文件

```bash
mdbot batch <config-file> [options]

Options:
  -o, --output <path>    輸出目錄

範例:
  mdbot batch ./batch-config.json
```

### `search`

搜索模板

```bash
mdbot search <query>

範例:
  mdbot search "github"
  mdbot search "api"
```

### `categories` / `cat`

列出所有模板類別

```bash
mdbot categories
```

### `stats`

顯示模板統計資訊

```bash
mdbot stats
```

### `init`

初始化 MarkdownBot 配置

```bash
mdbot init [options]

Options:
  -d, --dir <path>    初始化目錄 (預設: 當前目錄)
```

## 🔧 程式化使用 (API)

### 基本用法

```typescript
import MarkdownBot from 'markdownbot-pro';

const bot = new MarkdownBot();

const result = await bot.generate({
  templateId: 'github-readme',
  title: 'My Awesome Project',
  fields: {
    projectName: 'My Awesome Project',
    description: 'A revolutionary tool for...',
    features: ['Fast', 'Reliable', 'Easy to use'],
    installation: 'npm install my-project',
    usageExample: 'import { myFunction } from "my-project";',
    license: 'MIT',
    author: 'John Doe',
  },
  outputPath: './docs',
});

if (result.success) {
  console.log(`File generated: ${result.filePath}`);
} else {
  console.error('Errors:', result.errors);
}
```

### 批量生成

```typescript
const inputs = [
  {
    templateId: 'github-readme',
    title: 'README',
    fields: { /* ... */ },
    outputPath: './docs',
  },
  {
    templateId: 'github-contributing',
    title: 'CONTRIBUTING',
    fields: { /* ... */ },
    outputPath: './docs',
  },
];

const results = await bot.generateBatch(inputs);
console.log(`Generated ${results.filter(r => r.success).length} files`);
```

### 驗證 Markdown

```typescript
const content = '# My Document\n\n...';
const validation = bot.validateMarkdown(content);

if (!validation.valid) {
  console.error('Syntax errors:', validation.errors);
}
```

## 📖 創建自定義模板

### 模板結構

```yaml
id: my-custom-template
name: My Custom Template
description: A custom template for...
category: custom
tags:
  - custom
  - example
fields:
  - name: title
    label: Document Title
    type: text
    required: true
  - name: author
    label: Author Name
    type: text
    required: true
  - name: sections
    label: Content Sections
    type: array
    required: true
sections:
  - id: header
    title: Header
    order: 1
    required: true
    content: |
      # {{title}}
      
      **Author**: {{author}}
      **Date**: {{date}}
  - id: content
    title: Main Content
    order: 2
    required: true
    content: |
      {% for section in sections %}
      ## {{section.heading}}
      
      {{section.content}}
      {% endfor %}
metadata:
  version: 1.0.0
  author: Your Name
  language: markdown
```

### 導入自定義模板

```bash
mdbot import-template ./my-template.yaml

mdbot generate -t my-custom-template -i
```

## 🧪 測試

### 執行測試

```bash
npm run test

npm run test:watch

npm run test:coverage
```

### 測試覆蓋率

項目包含完整的測試套件，涵蓋：

- ✅ 模板引擎測試 (變量、條件、循環、幫助函數)
- ✅ 文件系統管理測試 (檔名規範化、路徑驗證、備份)
- ✅ 輸入解析與驗證測試
- ✅ Markdown 語法驗證測試
- ✅ 邊界情況與錯誤處理測試

## 🏗️ 專案架構

```
markdownbot-pro/
├── src/
│   ├── core/               # 核心引擎
│   │   ├── TemplateEngine.ts      # 模板引擎
│   │   ├── TemplateLibrary.ts     # 模板庫管理
│   │   ├── InputParser.ts         # 需求解析器
│   │   └── FileGenerator.ts       # 文件生成器
│   ├── templates/          # 內建模板
│   │   ├── github.ts              # GitHub 模板
│   │   ├── documentation.ts       # 文檔模板
│   │   ├── learning.ts            # 學習模板
│   │   └── index.ts               # 模板索引
│   ├── utils/              # 工具類
│   │   ├── logger.ts              # 日誌系統
│   │   └── fileSystem.ts          # 文件系統管理
│   ├── types/              # TypeScript 類型定義
│   │   └── index.ts
│   ├── __tests__/          # 測試文件
│   │   ├── TemplateEngine.test.ts
│   │   └── FileSystemManager.test.ts
│   ├── cli.ts              # CLI 命令界面
│   └── index.ts            # 主入口
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

## 🤝 貢獻指南

我們歡迎任何形式的貢獻！

### 如何貢獻

1. Fork 本專案
2. 創建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

### 開發指南

```bash
git clone https://github.com/yourusername/markdownbot-pro.git
cd markdownbot-pro

npm install

npm run dev

npm run build

npm run test
```

### 編碼規範

- 使用 TypeScript 嚴格模式
- 遵循 ESLint 和 Prettier 配置
- 所有新功能必須包含測試
- 保持代碼簡潔和可讀性

## 📄 授權協議

本專案採用 MIT 授權協議 - 詳見 [LICENSE](LICENSE) 文件

## 👥 作者

**MarkdownBot Team**

- GitHub: [@markdownbot](https://github.com/markdownbot)

## 🙏 致謝

感謝以下開源項目：

- [TypeScript](https://www.typescriptlang.org/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/)
- [Marked](https://github.com/markedjs/marked)
- [Vitest](https://vitest.dev/)
- [Chalk](https://github.com/chalk/chalk)

## 📮 聯絡方式

如有問題或建議，請：

- 開啟 [Issue](https://github.com/markdownbot/markdownbot-pro/issues)
- 發送郵件至 support@markdownbot.io
- 加入我們的 [Discord 社群](https://discord.gg/markdownbot)

## 🗺️ 路線圖

### v1.1.0 (計劃中)

- [ ] 支援更多模板語言 (Jinja2, Mustache)
- [ ] Web UI 界面
- [ ] 模板市場
- [ ] AI 輔助模板生成

### v1.2.0 (計劃中)

- [ ] 多語言支援 (i18n)
- [ ] Git 整合 (自動 commit 和 push)
- [ ] CI/CD 整合
- [ ] Docker 支援

## ⭐ Star History

如果這個專案對你有幫助，請給我們一個 Star！

---

**Made with ❤️ by the MarkdownBot Team**
