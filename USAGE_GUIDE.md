# MarkdownBot Pro 使用指南

本指南提供詳細的使用說明和常見場景示例，幫助您快速上手 MarkdownBot Pro。

## 目錄

- [安裝與設置](#安裝與設置)
- [基本使用](#基本使用)
- [進階功能](#進階功能)
- [常見場景](#常見場景)
- [最佳實踐](#最佳實踐)
- [故障排除](#故障排除)

## 安裝與設置

### 全域安裝

```bash
npm install -g markdownbot-pro

mdbot --version
```

### 專案內安裝

```bash
cd your-project
npm install markdownbot-pro --save-dev

npx mdbot --help
```

### 驗證安裝

```bash
mdbot list
mdbot stats
```

## 基本使用

### 1. 查看所有可用模板

```bash
mdbot list

mdbot list --category github

mdbot list --tag documentation
```

### 2. 查看模板詳細資訊

```bash
mdbot info github-readme

mdbot info api-documentation

mdbot info learning-notes
```

### 3. 互動式生成文件

最簡單的方式是使用互動模式：

```bash
mdbot generate --interactive
```

系統會引導您：
1. 選擇模板
2. 填寫必填欄位
3. 填寫選填欄位
4. 指定輸出路徑和檔名
5. 預覽或直接生成

### 4. 快速生成模式

如果您已經知道要使用的模板：

```bash
mdbot gen -t github-readme -i

mdbot gen -t api-documentation -o ./docs -i
```

## 進階功能

### 批量生成多個文件

創建批量配置文件 `batch-config.json`：

```json
{
  "inputs": [
    {
      "templateId": "github-readme",
      "title": "My Project",
      "fields": {
        "projectName": "My Awesome Project",
        "description": "A revolutionary tool",
        "features": ["Fast", "Reliable", "Easy"],
        "installation": "npm install my-project",
        "usageExample": "import { fn } from 'my-project';",
        "license": "MIT",
        "author": "John Doe"
      },
      "outputPath": "./docs",
      "filename": "README.md"
    },
    {
      "templateId": "github-contributing",
      "title": "Contributing Guidelines",
      "fields": {
        "projectName": "My Awesome Project",
        "setupInstructions": "npm install && npm run dev",
        "codingStandards": [
          "Use TypeScript",
          "Follow ESLint rules",
          "Write tests for new features"
        ]
      },
      "outputPath": "./docs",
      "filename": "CONTRIBUTING.md"
    }
  ]
}
```

執行批量生成：

```bash
mdbot batch ./batch-config.json

mdbot batch ./batch-config.json -o ./output
```

### Markdown 語法驗證

驗證現有的 Markdown 文件：

```bash
mdbot validate ./README.md

mdbot validate ./docs/API.md
```

### 搜索模板

快速找到需要的模板：

```bash
mdbot search "github"

mdbot search "api"

mdbot search "learning"
```

### 預覽模式

在不生成文件的情況下預覽輸出：

```bash
mdbot gen -t github-readme -i --dry-run
```

### 不驗證模式

跳過 Markdown 語法驗證（提高生成速度）：

```bash
mdbot gen -t blog-post -i --no-validate
```

### 不備份模式

覆寫現有文件時不創建備份：

```bash
mdbot gen -t learning-notes -i --no-backup
```

## 常見場景

### 場景 1: 創建 GitHub 專案文檔

```bash
cd your-project

mdbot init

mdbot gen -t github-readme -i

mdbot gen -t github-contributing -i

mdbot gen -t github-changelog -i
```

這將創建完整的 GitHub 專案文檔套件：
- README.md
- CONTRIBUTING.md
- CHANGELOG.md

### 場景 2: 撰寫技術博客文章

```bash
mkdir blog-posts

mdbot gen -t blog-post -i -o ./blog-posts

mdbot validate ./blog-posts/my-article.md
```

### 場景 3: 記錄學習筆記

```bash
mkdir learning-notes

mdbot gen -t learning-notes -i -o ./learning-notes

cd learning-notes
mdbot list
```

### 場景 4: 創建 API 文檔

```bash
mkdir api-docs

mdbot gen -t api-documentation -i -o ./api-docs

mdbot gen -t tech-design-doc -i -o ./api-docs
```

### 場景 5: 會議記錄

```bash
mkdir meetings

mdbot gen -t meeting-notes -i -o ./meetings

cat ./meetings/2024-01-15-sprint-planning.md
```

### 場景 6: 研究筆記

```bash
mkdir research

mdbot gen -t research-notes -i -o ./research

mdbot gen -t technical-article -i -o ./research
```

## 程式化使用

### 基本範例

```typescript
import MarkdownBot from 'markdownbot-pro';

const bot = new MarkdownBot();

async function generateReadme() {
  const result = await bot.generate({
    templateId: 'github-readme',
    title: 'My Project',
    fields: {
      projectName: 'My Awesome Project',
      description: 'A revolutionary tool for developers',
      features: [
        'Lightning fast performance',
        'Easy to use API',
        'Comprehensive documentation'
      ],
      installation: 'npm install my-project',
      usageExample: `
import { createApp } from 'my-project';

const app = createApp({
  port: 3000
});

app.start();
      `,
      license: 'MIT',
      author: 'John Doe',
      repository: 'https://github.com/johndoe/my-project'
    },
    outputPath: './docs',
  });

  if (result.success) {
    console.log('✅ README generated:', result.filePath);
    console.log('📊 File size:', result.metadata.fileSize, 'bytes');
    console.log('📄 Line count:', result.metadata.lineCount);
  } else {
    console.error('❌ Generation failed:');
    result.errors.forEach(err => console.error('  -', err));
  }
}

generateReadme();
```

### 批量生成範例

```typescript
import MarkdownBot from 'markdownbot-pro';

const bot = new MarkdownBot();

async function generateDocs() {
  const inputs = [
    {
      templateId: 'github-readme',
      title: 'README',
      fields: { /* ... */ },
      outputPath: './docs'
    },
    {
      templateId: 'github-contributing',
      title: 'CONTRIBUTING',
      fields: { /* ... */ },
      outputPath: './docs'
    },
    {
      templateId: 'api-documentation',
      title: 'API Reference',
      fields: { /* ... */ },
      outputPath: './docs/api'
    }
  ];

  const results = await bot.generateBatch(inputs);

  const success = results.filter(r => r.success).length;
  const failed = results.length - success;

  console.log(`✅ ${success} files generated successfully`);
  console.log(`❌ ${failed} files failed`);

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`  ✓ ${result.filePath}`);
    } else {
      console.log(`  ✗ Failed: ${inputs[index].title}`);
      result.errors.forEach(err => console.log(`    - ${err}`));
    }
  });
}

generateDocs();
```

### 驗證範例

```typescript
import MarkdownBot from 'markdownbot-pro';
import * as fs from 'fs';

const bot = new MarkdownBot();

async function validateMarkdownFiles(directory: string) {
  const files = fs.readdirSync(directory)
    .filter(f => f.endsWith('.md'));

  for (const file of files) {
    const content = fs.readFileSync(`${directory}/${file}`, 'utf-8');
    const validation = bot.validateMarkdown(content);

    console.log(`\nValidating ${file}:`);
    
    if (validation.valid) {
      console.log('  ✅ Valid');
    } else {
      console.log('  ❌ Invalid');
      validation.errors.forEach(err => {
        console.log(`    Error: ${err}`);
      });
    }

    if (validation.warnings.length > 0) {
      console.log('  ⚠️  Warnings:');
      validation.warnings.forEach(warn => {
        console.log(`    - ${warn}`);
      });
    }
  }
}

validateMarkdownFiles('./docs');
```

## 最佳實踐

### 1. 使用模板類別篩選

當有多個模板時，使用類別篩選可以快速找到合適的模板：

```bash
mdbot list --category github

mdbot list --category documentation

mdbot list --category learning
```

### 2. 善用搜索功能

使用關鍵字搜索比瀏覽列表更高效：

```bash
mdbot search "readme"

mdbot search "notes"

mdbot search "api"
```

### 3. 預覽後再生成

對於重要文檔，先使用 `--dry-run` 預覽：

```bash
mdbot gen -t github-readme -i --dry-run

mdbot gen -t blog-post -i --dry-run
```

### 4. 批量操作提高效率

需要生成多個相似文件時，使用批量配置：

```bash
mdbot batch ./batch-config.json
```

### 5. 定期驗證文檔

在提交前驗證所有 Markdown 文件：

```bash
mdbot validate ./docs/*.md

find . -name "*.md" -exec mdbot validate {} \;
```

### 6. 使用 .mdbotrc 配置

在專案根目錄創建 `.mdbotrc.json`：

```json
{
  "projectName": "My Project",
  "author": "John Doe",
  "defaultOutputPath": "./docs",
  "templates": ["github-readme", "github-contributing", "api-documentation"],
  "backup": true,
  "validate": true
}
```

## 故障排除

### 問題 1: 找不到模板

**症狀**: `Template not found: xxx`

**解決方案**:
```bash
mdbot list

mdbot search "關鍵字"

mdbot info <template-id>
```

### 問題 2: 檔案已存在錯誤

**症狀**: `File already exists and overwrite is false`

**解決方案**:
```bash
mdbot gen -t xxx -i --overwrite

mdbot gen -t xxx -i --no-backup
```

### 問題 3: Markdown 語法錯誤

**症狀**: 生成的文件有語法問題

**解決方案**:
```bash
mdbot validate ./file.md

mdbot gen -t xxx -i --validate
```

### 問題 4: 欄位驗證失敗

**症狀**: `Field validation failed: xxx`

**解決方案**:
```bash
mdbot info <template-id>

mdbot gen -t xxx --interactive
```

### 問題 5: 路徑錯誤

**症狀**: 文件生成到錯誤位置

**解決方案**:
```bash
mdbot gen -t xxx -o ./correct-path -i

mdbot gen -t xxx -f custom-filename.md -i
```

## 進階技巧

### 自定義輸出路徑結構

```bash
mkdir -p ./docs/{github,api,guides}

mdbot gen -t github-readme -o ./docs/github -i

mdbot gen -t api-documentation -o ./docs/api -i

mdbot gen -t tutorial -o ./docs/guides -i
```

### 整合到 npm scripts

在 `package.json` 中添加：

```json
{
  "scripts": {
    "docs:readme": "mdbot gen -t github-readme -i",
    "docs:api": "mdbot gen -t api-documentation -o ./docs/api -i",
    "docs:validate": "mdbot validate ./docs/*.md",
    "docs:all": "mdbot batch ./docs-config.json"
  }
}
```

使用：

```bash
npm run docs:readme

npm run docs:validate

npm run docs:all
```

### Git Hook 整合

在 `.git/hooks/pre-commit` 中添加：

```bash
#!/bin/bash

echo "Validating Markdown files..."
mdbot validate ./docs/*.md

if [ $? -ne 0 ]; then
  echo "Markdown validation failed!"
  exit 1
fi

echo "Markdown validation passed!"
```

### CI/CD 整合

在 GitHub Actions 中使用：

```yaml
name: Validate Docs

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install MarkdownBot
        run: npm install -g markdownbot-pro
      
      - name: Validate Markdown files
        run: mdbot validate ./docs/*.md
```

## 總結

MarkdownBot Pro 提供了強大而靈活的 Markdown 文件生成能力。通過本指南，您應該能夠：

✅ 安裝和設置 MarkdownBot Pro
✅ 使用互動模式快速生成文件
✅ 批量處理多個文件
✅ 驗證 Markdown 語法
✅ 整合到開發工作流程
✅ 解決常見問題

如需更多幫助，請參閱：
- [README.md](./README.md) - 完整文檔
- [GitHub Issues](https://github.com/markdownbot/markdownbot-pro/issues) - 問題回報
- [Discord 社群](https://discord.gg/markdownbot) - 社群支援

Happy documenting! 📝✨
