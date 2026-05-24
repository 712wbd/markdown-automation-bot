import { TemplateConfig } from '../types';

export const businessPlanTemplate: TemplateConfig = {
  id: 'business-plan',
  name: 'Business Plan',
  description: '完整的商業計劃書模板，包含執行摘要、市場分析、財務預測等',
  category: 'project',
  tags: ['business', 'plan', 'startup', 'strategy'],
  fields: [
    {
      name: 'companyName',
      label: '公司名稱',
      type: 'text',
      required: true,
      description: '您的公司或專案名稱',
    },
    {
      name: 'executiveSummary',
      label: '執行摘要',
      type: 'textarea',
      required: true,
      description: '簡要描述業務概況',
    },
    {
      name: 'mission',
      label: '使命宣言',
      type: 'textarea',
      required: true,
      description: '公司的使命和願景',
    },
    {
      name: 'products',
      label: '產品/服務',
      type: 'array',
      required: true,
      description: '主要產品或服務列表',
    },
    {
      name: 'targetMarket',
      label: '目標市場',
      type: 'textarea',
      required: true,
      description: '目標客戶群體描述',
    },
    {
      name: 'marketSize',
      label: '市場規模',
      type: 'text',
      required: false,
      description: '潛在市場規模估算',
    },
    {
      name: 'competitors',
      label: '競爭對手',
      type: 'array',
      required: true,
      description: '主要競爭對手列表',
    },
    {
      name: 'competitiveAdvantage',
      label: '競爭優勢',
      type: 'textarea',
      required: true,
      description: '您的獨特賣點和競爭優勢',
    },
    {
      name: 'revenueModel',
      label: '收入模式',
      type: 'textarea',
      required: true,
      description: '如何產生收入',
    },
    {
      name: 'fundingRequired',
      label: '所需資金',
      type: 'text',
      required: false,
      description: '啟動或擴展所需資金',
    },
    {
      name: 'teamMembers',
      label: '團隊成員',
      type: 'array',
      required: true,
      description: '核心團隊成員',
    },
    {
      name: 'milestones',
      label: '里程碑',
      type: 'array',
      required: true,
      description: '關鍵里程碑和時間表',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# {{companyName}} - 商業計劃書\n\n> 日期：{{currentDate}}',
      required: true,
      order: 1,
    },
    {
      id: 'executive-summary',
      name: '執行摘要',
      content: `## 執行摘要

{{executiveSummary}}`,
      required: true,
      order: 2,
    },
    {
      id: 'mission',
      name: '使命願景',
      content: `## 使命與願景

{{mission}}`,
      required: true,
      order: 3,
    },
    {
      id: 'products',
      name: '產品服務',
      content: `## 產品與服務

{% for product in products %}
- **{{product}}**
{% endfor %}`,
      required: true,
      order: 4,
    },
    {
      id: 'market-analysis',
      name: '市場分析',
      content: `## 市場分析

### 目標市場

{{targetMarket}}

{% if marketSize %}
### 市場規模

{{marketSize}}
{% endif %}`,
      required: true,
      order: 5,
    },
    {
      id: 'competitive-analysis',
      name: '競爭分析',
      content: `## 競爭分析

### 主要競爭對手

{% for competitor in competitors %}
- {{competitor}}
{% endfor %}

### 我們的競爭優勢

{{competitiveAdvantage}}`,
      required: true,
      order: 6,
    },
    {
      id: 'business-model',
      name: '商業模式',
      content: `## 商業模式

### 收入模式

{{revenueModel}}

{% if fundingRequired %}
### 資金需求

{{fundingRequired}}
{% endif %}`,
      required: true,
      order: 7,
    },
    {
      id: 'team',
      name: '團隊',
      content: `## 團隊

{% for member in teamMembers %}
- {{member}}
{% endfor %}`,
      required: true,
      order: 8,
    },
    {
      id: 'milestones',
      name: '里程碑',
      content: `## 發展里程碑

{% for milestone in milestones %}
- {{milestone}}
{% endfor %}`,
      required: true,
      order: 9,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const productSpecTemplate: TemplateConfig = {
  id: 'product-spec',
  name: 'Product Specification',
  description: '產品規格文檔模板，詳細描述產品功能、需求和技術規格',
  category: 'documentation',
  tags: ['product', 'specification', 'requirements', 'features'],
  fields: [
    {
      name: 'productName',
      label: '產品名稱',
      type: 'text',
      required: true,
      description: '產品的正式名稱',
    },
    {
      name: 'version',
      label: '版本',
      type: 'text',
      required: true,
      description: '產品版本號',
    },
    {
      name: 'overview',
      label: '產品概述',
      type: 'textarea',
      required: true,
      description: '產品的總體描述',
    },
    {
      name: 'targetUsers',
      label: '目標用戶',
      type: 'textarea',
      required: true,
      description: '產品的目標用戶群體',
    },
    {
      name: 'userStories',
      label: '用戶故事',
      type: 'array',
      required: true,
      description: '主要用戶故事列表',
    },
    {
      name: 'functionalRequirements',
      label: '功能需求',
      type: 'array',
      required: true,
      description: '功能需求列表',
    },
    {
      name: 'nonFunctionalRequirements',
      label: '非功能需求',
      type: 'array',
      required: true,
      description: '性能、安全等非功能需求',
    },
    {
      name: 'userInterface',
      label: 'UI/UX 設計',
      type: 'textarea',
      required: false,
      description: 'UI/UX 設計說明',
    },
    {
      name: 'technicalStack',
      label: '技術棧',
      type: 'array',
      required: false,
      description: '使用的技術和工具',
    },
    {
      name: 'dependencies',
      label: '依賴項',
      type: 'array',
      required: false,
      description: '外部依賴和集成',
    },
    {
      name: 'constraints',
      label: '約束條件',
      type: 'array',
      required: false,
      description: '技術或業務約束',
    },
    {
      name: 'timeline',
      label: '時間表',
      type: 'textarea',
      required: false,
      description: '開發時間表',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# {{productName}} - 產品規格文檔\n\n**版本**: {{version}}  \n**日期**: {{currentDate}}',
      required: true,
      order: 1,
    },
    {
      id: 'overview',
      name: '概述',
      content: `## 產品概述

{{overview}}`,
      required: true,
      order: 2,
    },
    {
      id: 'target-users',
      name: '目標用戶',
      content: `## 目標用戶

{{targetUsers}}`,
      required: true,
      order: 3,
    },
    {
      id: 'user-stories',
      name: '用戶故事',
      content: `## 用戶故事

{% for story in userStories %}
- {{story}}
{% endfor %}`,
      required: true,
      order: 4,
    },
    {
      id: 'functional-requirements',
      name: '功能需求',
      content: `## 功能需求

{% for requirement in functionalRequirements %}
- {{requirement}}
{% endfor %}`,
      required: true,
      order: 5,
    },
    {
      id: 'non-functional-requirements',
      name: '非功能需求',
      content: `## 非功能需求

{% for requirement in nonFunctionalRequirements %}
- {{requirement}}
{% endfor %}`,
      required: true,
      order: 6,
    },
    {
      id: 'ui-ux',
      name: 'UI/UX',
      content: `{% if userInterface %}
## UI/UX 設計

{{userInterface}}
{% endif %}`,
      required: false,
      order: 7,
    },
    {
      id: 'technical',
      name: '技術規格',
      content: `{% if technicalStack %}
## 技術棧

{% for tech in technicalStack %}
- {{tech}}
{% endfor %}
{% endif %}

{% if dependencies %}
## 依賴項

{% for dep in dependencies %}
- {{dep}}
{% endfor %}
{% endif %}

{% if constraints %}
## 約束條件

{% for constraint in constraints %}
- {{constraint}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 8,
    },
    {
      id: 'timeline',
      name: '時間表',
      content: `{% if timeline %}
## 開發時間表

{{timeline}}
{% endif %}`,
      required: false,
      order: 9,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const releaseNotesTemplate: TemplateConfig = {
  id: 'release-notes',
  name: 'Release Notes',
  description: '版本發布說明模板，記錄新功能、改進和修復',
  category: 'github',
  tags: ['release', 'notes', 'changelog', 'version'],
  fields: [
    {
      name: 'productName',
      label: '產品名稱',
      type: 'text',
      required: true,
      description: '產品名稱',
    },
    {
      name: 'version',
      label: '版本號',
      type: 'text',
      required: true,
      description: '發布版本號',
    },
    {
      name: 'releaseDate',
      label: '發布日期',
      type: 'date',
      required: true,
      description: '版本發布日期',
    },
    {
      name: 'summary',
      label: '發布摘要',
      type: 'textarea',
      required: true,
      description: '此版本的主要更新概述',
    },
    {
      name: 'newFeatures',
      label: '新功能',
      type: 'array',
      required: false,
      description: '新增功能列表',
    },
    {
      name: 'improvements',
      label: '改進項',
      type: 'array',
      required: false,
      description: '功能改進列表',
    },
    {
      name: 'bugFixes',
      label: 'Bug 修復',
      type: 'array',
      required: false,
      description: '修復的問題列表',
    },
    {
      name: 'breakingChanges',
      label: '破壞性變更',
      type: 'array',
      required: false,
      description: '可能影響現有功能的變更',
    },
    {
      name: 'deprecations',
      label: '棄用項',
      type: 'array',
      required: false,
      description: '即將棄用的功能',
    },
    {
      name: 'knownIssues',
      label: '已知問題',
      type: 'array',
      required: false,
      description: '當前已知的問題',
    },
    {
      name: 'upgradeNotes',
      label: '升級說明',
      type: 'textarea',
      required: false,
      description: '升級指南和注意事項',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# {{productName}} {{version}} - Release Notes\n\n📅 **Release Date**: {{releaseDate}}',
      required: true,
      order: 1,
    },
    {
      id: 'summary',
      name: '摘要',
      content: `## 📋 Summary

{{summary}}`,
      required: true,
      order: 2,
    },
    {
      id: 'new-features',
      name: '新功能',
      content: `{% if newFeatures %}
## ✨ New Features

{% for feature in newFeatures %}
- {{feature}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 3,
    },
    {
      id: 'improvements',
      name: '改進',
      content: `{% if improvements %}
## 🚀 Improvements

{% for improvement in improvements %}
- {{improvement}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 4,
    },
    {
      id: 'bug-fixes',
      name: 'Bug修復',
      content: `{% if bugFixes %}
## 🐛 Bug Fixes

{% for fix in bugFixes %}
- {{fix}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 5,
    },
    {
      id: 'breaking-changes',
      name: '破壞性變更',
      content: `{% if breakingChanges %}
## ⚠️ Breaking Changes

{% for change in breakingChanges %}
- {{change}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 6,
    },
    {
      id: 'deprecations',
      name: '棄用項',
      content: `{% if deprecations %}
## 🗑️ Deprecations

{% for deprecation in deprecations %}
- {{deprecation}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 7,
    },
    {
      id: 'known-issues',
      name: '已知問題',
      content: `{% if knownIssues %}
## 🔍 Known Issues

{% for issue in knownIssues %}
- {{issue}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 8,
    },
    {
      id: 'upgrade-notes',
      name: '升級說明',
      content: `{% if upgradeNotes %}
## 📦 Upgrade Notes

{{upgradeNotes}}
{% endif %}`,
      required: false,
      order: 9,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const architectureDocTemplate: TemplateConfig = {
  id: 'architecture-doc',
  name: 'Architecture Documentation',
  description: '軟件架構文檔模板，描述系統架構、組件和設計決策',
  category: 'technical',
  tags: ['architecture', 'design', 'system', 'technical'],
  fields: [
    {
      name: 'systemName',
      label: '系統名稱',
      type: 'text',
      required: true,
      description: '系統或項目名稱',
    },
    {
      name: 'overview',
      label: '系統概述',
      type: 'textarea',
      required: true,
      description: '系統的總體描述',
    },
    {
      name: 'architectureStyle',
      label: '架構風格',
      type: 'text',
      required: true,
      description: '如：微服務、單體、事件驅動等',
    },
    {
      name: 'components',
      label: '核心組件',
      type: 'array',
      required: true,
      description: '系統的主要組件',
    },
    {
      name: 'dataFlow',
      label: '數據流',
      type: 'textarea',
      required: true,
      description: '描述數據如何在系統中流動',
    },
    {
      name: 'technologies',
      label: '技術棧',
      type: 'array',
      required: true,
      description: '使用的技術和工具',
    },
    {
      name: 'designPatterns',
      label: '設計模式',
      type: 'array',
      required: false,
      description: '應用的設計模式',
    },
    {
      name: 'securityConsiderations',
      label: '安全考量',
      type: 'textarea',
      required: false,
      description: '安全相關的設計決策',
    },
    {
      name: 'scalability',
      label: '可擴展性',
      type: 'textarea',
      required: false,
      description: '系統如何擴展',
    },
    {
      name: 'deployment',
      label: '部署架構',
      type: 'textarea',
      required: false,
      description: '部署策略和環境',
    },
    {
      name: 'monitoring',
      label: '監控方案',
      type: 'textarea',
      required: false,
      description: '監控和日誌策略',
    },
    {
      name: 'decisionLog',
      label: '架構決策',
      type: 'array',
      required: false,
      description: '重要的架構決策記錄',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# {{systemName}} - Architecture Documentation\n\n📐 **Last Updated**: {{currentDate}}',
      required: true,
      order: 1,
    },
    {
      id: 'overview',
      name: '概述',
      content: `## System Overview

{{overview}}

**Architecture Style**: {{architectureStyle}}`,
      required: true,
      order: 2,
    },
    {
      id: 'components',
      name: '組件',
      content: `## Core Components

{% for component in components %}
- **{{component}}**
{% endfor %}`,
      required: true,
      order: 3,
    },
    {
      id: 'data-flow',
      name: '數據流',
      content: `## Data Flow

{{dataFlow}}`,
      required: true,
      order: 4,
    },
    {
      id: 'technology-stack',
      name: '技術棧',
      content: `## Technology Stack

{% for tech in technologies %}
- {{tech}}
{% endfor %}`,
      required: true,
      order: 5,
    },
    {
      id: 'design-patterns',
      name: '設計模式',
      content: `{% if designPatterns %}
## Design Patterns

{% for pattern in designPatterns %}
- {{pattern}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 6,
    },
    {
      id: 'quality-attributes',
      name: '質量屬性',
      content: `{% if securityConsiderations %}
## Security

{{securityConsiderations}}
{% endif %}

{% if scalability %}
## Scalability

{{scalability}}
{% endif %}`,
      required: false,
      order: 7,
    },
    {
      id: 'deployment',
      name: '部署',
      content: `{% if deployment %}
## Deployment Architecture

{{deployment}}
{% endif %}

{% if monitoring %}
## Monitoring & Observability

{{monitoring}}
{% endif %}`,
      required: false,
      order: 8,
    },
    {
      id: 'decisions',
      name: '架構決策',
      content: `{% if decisionLog %}
## Architecture Decision Records

{% for decision in decisionLog %}
- {{decision}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 9,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const securityPolicyTemplate: TemplateConfig = {
  id: 'security-policy',
  name: 'Security Policy (SECURITY.md)',
  description: 'GitHub 安全政策文檔，說明如何報告安全漏洞',
  category: 'github',
  tags: ['security', 'policy', 'vulnerability', 'github'],
  fields: [
    {
      name: 'projectName',
      label: '項目名稱',
      type: 'text',
      required: true,
      description: '項目名稱',
    },
    {
      name: 'supportedVersions',
      label: '支持的版本',
      type: 'array',
      required: true,
      description: '當前支持的版本列表',
    },
    {
      name: 'reportingEmail',
      label: '報告郵箱',
      type: 'email',
      required: true,
      description: '接收安全報告的郵箱',
    },
    {
      name: 'responseTime',
      label: '響應時間',
      type: 'text',
      required: false,
      description: '預期響應時間',
      defaultValue: '48 hours',
    },
    {
      name: 'reportingProcess',
      label: '報告流程',
      type: 'textarea',
      required: false,
      description: '詳細的報告流程說明',
    },
    {
      name: 'securityMeasures',
      label: '安全措施',
      type: 'array',
      required: false,
      description: '項目採用的安全措施',
    },
    {
      name: 'disclosurePolicy',
      label: '披露政策',
      type: 'textarea',
      required: false,
      description: '漏洞披露政策',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# Security Policy\n\n## {{projectName}} Security',
      required: true,
      order: 1,
    },
    {
      id: 'supported-versions',
      name: '支持版本',
      content: `## Supported Versions

The following versions are currently being supported with security updates:

{% for version in supportedVersions %}
- {{version}}
{% endfor %}`,
      required: true,
      order: 2,
    },
    {
      id: 'reporting',
      name: '報告漏洞',
      content: `## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it to us privately.

**Email**: {{reportingEmail}}  
**Response Time**: {{responseTime}}

{% if reportingProcess %}
### Reporting Process

{{reportingProcess}}
{% else %}
### Reporting Process

1. **DO NOT** create a public issue
2. Email us at {{reportingEmail}} with details:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Wait for our response within {{responseTime}}
4. Work with us on a fix
5. Allow us time to release a patch before public disclosure
{% endif %}`,
      required: true,
      order: 3,
    },
    {
      id: 'security-measures',
      name: '安全措施',
      content: `{% if securityMeasures %}
## Security Measures

We implement the following security measures:

{% for measure in securityMeasures %}
- {{measure}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 4,
    },
    {
      id: 'disclosure-policy',
      name: '披露政策',
      content: `{% if disclosurePolicy %}
## Disclosure Policy

{{disclosurePolicy}}
{% else %}
## Disclosure Policy

- We will acknowledge receipt of your vulnerability report within {{responseTime}}
- We will provide an estimated timeline for a fix
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a patch is released
- We appreciate responsible disclosure and will credit reporters (unless you prefer to remain anonymous)
{% endif %}`,
      required: false,
      order: 5,
    },
    {
      id: 'thanks',
      name: '致謝',
      content: `## Hall of Fame

We would like to thank the following security researchers for their responsible disclosure:

*[List will be updated as vulnerabilities are reported and fixed]*`,
      required: false,
      order: 6,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const userGuideTemplate: TemplateConfig = {
  id: 'user-guide',
  name: 'User Guide',
  description: '完整的用戶手冊模板，適用於產品或軟件的用戶指南',
  category: 'documentation',
  tags: ['user', 'guide', 'manual', 'documentation', 'help'],
  fields: [
    {
      name: 'productName',
      label: '產品名稱',
      type: 'text',
      required: true,
      description: '產品名稱',
    },
    {
      name: 'version',
      label: '版本',
      type: 'text',
      required: true,
      description: '文檔版本',
    },
    {
      name: 'introduction',
      label: '簡介',
      type: 'textarea',
      required: true,
      description: '產品簡介',
    },
    {
      name: 'targetAudience',
      label: '目標讀者',
      type: 'text',
      required: false,
      description: '本指南的目標讀者',
    },
    {
      name: 'gettingStarted',
      label: '快速開始',
      type: 'textarea',
      required: true,
      description: '快速入門指南',
    },
    {
      name: 'features',
      label: '功能列表',
      type: 'array',
      required: true,
      description: '主要功能列表',
    },
    {
      name: 'stepByStepGuides',
      label: '分步教程',
      type: 'array',
      required: false,
      description: '常見任務的分步指南',
    },
    {
      name: 'troubleshooting',
      label: '故障排除',
      type: 'array',
      required: false,
      description: '常見問題和解決方案',
    },
    {
      name: 'faq',
      label: '常見問題',
      type: 'array',
      required: false,
      description: '常見問題解答',
    },
    {
      name: 'supportContact',
      label: '支持聯繫',
      type: 'text',
      required: false,
      description: '技術支持聯繫方式',
    },
    {
      name: 'additionalResources',
      label: '其他資源',
      type: 'array',
      required: false,
      description: '額外的資源鏈接',
    },
  ],
  sections: [
    {
      id: 'header',
      name: '標題',
      content: '# {{productName}} User Guide\n\n**Version**: {{version}}  \n**Last Updated**: {{currentDate}}',
      required: true,
      order: 1,
    },
    {
      id: 'introduction',
      name: '簡介',
      content: `## Introduction

{{introduction}}

{% if targetAudience %}
**Target Audience**: {{targetAudience}}
{% endif %}`,
      required: true,
      order: 2,
    },
    {
      id: 'getting-started',
      name: '快速開始',
      content: `## Getting Started

{{gettingStarted}}`,
      required: true,
      order: 3,
    },
    {
      id: 'features',
      name: '功能',
      content: `## Features

{% for feature in features %}
### {{feature}}

[Detailed description of {{feature}}]

{% endfor %}`,
      required: true,
      order: 4,
    },
    {
      id: 'step-by-step',
      name: '分步教程',
      content: `{% if stepByStepGuides %}
## Step-by-Step Guides

{% for guide in stepByStepGuides %}
### {{guide}}

[Step-by-step instructions for {{guide}}]

{% endfor %}
{% endif %}`,
      required: false,
      order: 5,
    },
    {
      id: 'troubleshooting',
      name: '故障排除',
      content: `{% if troubleshooting %}
## Troubleshooting

{% for issue in troubleshooting %}
### {{issue}}

[Solution for {{issue}}]

{% endfor %}
{% endif %}`,
      required: false,
      order: 6,
    },
    {
      id: 'faq',
      name: '常見問題',
      content: `{% if faq %}
## Frequently Asked Questions

{% for question in faq %}
**Q: {{question}}**

A: [Answer to {{question}}]

{% endfor %}
{% endif %}`,
      required: false,
      order: 7,
    },
    {
      id: 'support',
      name: '支持',
      content: `## Support

{% if supportContact %}
Need help? Contact us: {{supportContact}}
{% else %}
For assistance, please refer to our support documentation or contact your administrator.
{% endif %}

{% if additionalResources %}
## Additional Resources

{% for resource in additionalResources %}
- {{resource}}
{% endfor %}
{% endif %}`,
      required: false,
      order: 8,
    },
  ],
  metadata: {
    version: '1.0.0',
    author: 'MarkdownBot Team',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const businessTemplates = [
  businessPlanTemplate,
  productSpecTemplate,
  releaseNotesTemplate,
  architectureDocTemplate,
  securityPolicyTemplate,
  userGuideTemplate,
];
