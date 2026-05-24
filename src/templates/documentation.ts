import { TemplateConfig } from '@/types';

export const technicalDesignDocTemplate: TemplateConfig = {
  id: 'tech-design-doc',
  name: 'Technical Design Document',
  description: '技術設計文檔模板，用於系統架構與技術方案設計',
  category: 'documentation',
  tags: ['technical', 'design', 'architecture', 'documentation'],
  fields: [
    {
      name: 'projectName',
      label: '專案名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'version',
      label: '文檔版本',
      type: 'text',
      required: true,
      defaultValue: '1.0',
    },
    {
      name: 'authors',
      label: '作者',
      type: 'array',
      required: true,
    },
    {
      name: 'overview',
      label: '專案概述',
      type: 'textarea',
      required: true,
    },
    {
      name: 'objectives',
      label: '設計目標',
      type: 'array',
      required: true,
    },
    {
      name: 'requirements',
      label: '需求分析',
      type: 'array',
      required: true,
    },
    {
      name: 'architecture',
      label: '系統架構',
      type: 'textarea',
      required: true,
    },
    {
      name: 'components',
      label: '核心元件',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        name: { type: 'text', label: 'Component Name' },
        description: { type: 'textarea', label: 'Description' },
        responsibilities: { type: 'array', label: 'Responsibilities' },
      },
    },
    {
      name: 'techStack',
      label: '技術棧',
      type: 'object',
      required: true,
      properties: {
        frontend: { type: 'array', label: 'Frontend Technologies' },
        backend: { type: 'array', label: 'Backend Technologies' },
        database: { type: 'array', label: 'Database' },
        infrastructure: { type: 'array', label: 'Infrastructure' },
      },
    },
    {
      name: 'dataModel',
      label: '數據模型',
      type: 'textarea',
      required: false,
    },
    {
      name: 'apiDesign',
      label: 'API 設計',
      type: 'textarea',
      required: false,
    },
    {
      name: 'security',
      label: '安全考量',
      type: 'array',
      required: false,
    },
    {
      name: 'performance',
      label: '性能優化',
      type: 'array',
      required: false,
    },
    {
      name: 'deployment',
      label: '部署策略',
      type: 'textarea',
      required: false,
    },
    {
      name: 'risks',
      label: '風險評估',
      type: 'array',
      required: false,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# Technical Design Document: {{projectName}}

**Version**: {{version}}  
**Date**: {{date}}  
**Authors**: {{join(authors, ", ")}}

---`,
    },
    {
      id: 'overview',
      title: 'Overview',
      order: 2,
      required: true,
      content: `## 1. Overview

{{overview}}`,
    },
    {
      id: 'objectives',
      title: 'Design Objectives',
      order: 3,
      required: true,
      content: `## 2. Design Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`,
    },
    {
      id: 'requirements',
      title: 'Requirements Analysis',
      order: 4,
      required: true,
      content: `## 3. Requirements Analysis

{% for requirement in requirements %}
- {{requirement}}
{% endfor %}`,
    },
    {
      id: 'architecture',
      title: 'System Architecture',
      order: 5,
      required: true,
      content: `## 4. System Architecture

{{architecture}}`,
    },
    {
      id: 'components',
      title: 'Core Components',
      order: 6,
      required: true,
      content: `## 5. Core Components

{% for component in components %}
### 5.{{loop.index1}}. {{component.name}}

**Description**: {{component.description}}

**Responsibilities**:
{% for responsibility in component.responsibilities %}
- {{responsibility}}
{% endfor %}

{% endfor %}`,
    },
    {
      id: 'techStack',
      title: 'Technology Stack',
      order: 7,
      required: true,
      content: `## 6. Technology Stack

### Frontend
{% for tech in techStack.frontend %}
- {{tech}}
{% endfor %}

### Backend
{% for tech in techStack.backend %}
- {{tech}}
{% endfor %}

### Database
{% for tech in techStack.database %}
- {{tech}}
{% endfor %}

### Infrastructure
{% for tech in techStack.infrastructure %}
- {{tech}}
{% endfor %}`,
    },
    {
      id: 'dataModel',
      title: 'Data Model',
      order: 8,
      required: false,
      condition: 'dataModel',
      content: `## 7. Data Model

{{dataModel}}`,
    },
    {
      id: 'apiDesign',
      title: 'API Design',
      order: 9,
      required: false,
      condition: 'apiDesign',
      content: `## 8. API Design

{{apiDesign}}`,
    },
    {
      id: 'security',
      title: 'Security Considerations',
      order: 10,
      required: false,
      condition: 'security',
      content: `## 9. Security Considerations

{% for item in security %}
- {{item}}
{% endfor %}`,
    },
    {
      id: 'performance',
      title: 'Performance Optimization',
      order: 11,
      required: false,
      condition: 'performance',
      content: `## 10. Performance Optimization

{% for item in performance %}
- {{item}}
{% endfor %}`,
    },
    {
      id: 'deployment',
      title: 'Deployment Strategy',
      order: 12,
      required: false,
      condition: 'deployment',
      content: `## 11. Deployment Strategy

{{deployment}}`,
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      order: 13,
      required: false,
      condition: 'risks',
      content: `## 12. Risk Assessment

{% for risk in risks %}
- {{risk}}
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

export const apiDocumentationTemplate: TemplateConfig = {
  id: 'api-documentation',
  name: 'API Documentation',
  description: 'RESTful API 文檔模板，包含端點說明、請求/響應範例',
  category: 'api',
  tags: ['api', 'rest', 'documentation', 'endpoints'],
  fields: [
    {
      name: 'apiName',
      label: 'API 名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'version',
      label: 'API 版本',
      type: 'text',
      required: true,
      defaultValue: 'v1',
    },
    {
      name: 'baseUrl',
      label: 'Base URL',
      type: 'url',
      required: true,
      placeholder: 'https://api.example.com/v1',
    },
    {
      name: 'authentication',
      label: '認證方式',
      type: 'textarea',
      required: true,
    },
    {
      name: 'endpoints',
      label: 'API 端點',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        method: { type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], label: 'HTTP Method' },
        path: { type: 'text', label: 'Endpoint Path' },
        description: { type: 'textarea', label: 'Description' },
        parameters: { type: 'array', label: 'Parameters' },
        requestBody: { type: 'code', language: 'json', label: 'Request Body Example' },
        responseSuccess: { type: 'code', language: 'json', label: 'Success Response' },
        responseError: { type: 'code', language: 'json', label: 'Error Response' },
      },
    },
    {
      name: 'errorCodes',
      label: '錯誤碼說明',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        code: { type: 'text', label: 'Error Code' },
        message: { type: 'text', label: 'Error Message' },
        description: { type: 'text', label: 'Description' },
      },
    },
    {
      name: 'rateLimiting',
      label: '速率限制',
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
      content: `# {{apiName}} API Documentation

**Version**: {{version}}  
**Base URL**: \`{{baseUrl}}\`  
**Last Updated**: {{date}}

---`,
    },
    {
      id: 'authentication',
      title: 'Authentication',
      order: 2,
      required: true,
      content: `## Authentication

{{authentication}}`,
    },
    {
      id: 'endpoints',
      title: 'API Endpoints',
      order: 3,
      required: true,
      content: `## API Endpoints

{% for endpoint in endpoints %}
### {{uppercase(endpoint.method)}} {{endpoint.path}}

{{endpoint.description}}

{% if endpoint.parameters %}
**Parameters**:
{% for param in endpoint.parameters %}
- {{param}}
{% endfor %}
{% endif %}

{% if endpoint.requestBody %}
**Request Body**:
\`\`\`json
{{endpoint.requestBody}}
\`\`\`
{% endif %}

**Success Response** (200 OK):
\`\`\`json
{{endpoint.responseSuccess}}
\`\`\`

{% if endpoint.responseError %}
**Error Response**:
\`\`\`json
{{endpoint.responseError}}
\`\`\`
{% endif %}

---

{% endfor %}`,
    },
    {
      id: 'errorCodes',
      title: 'Error Codes',
      order: 4,
      required: false,
      condition: 'errorCodes',
      content: `## Error Codes

| Code | Message | Description |
|------|---------|-------------|
{% for error in errorCodes %}
| {{error.code}} | {{error.message}} | {{error.description}} |
{% endfor %}`,
    },
    {
      id: 'rateLimiting',
      title: 'Rate Limiting',
      order: 5,
      required: false,
      condition: 'rateLimiting',
      content: `## Rate Limiting

{{rateLimiting}}`,
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

export const tutorialTemplate: TemplateConfig = {
  id: 'tutorial',
  name: 'Tutorial/Guide',
  description: '教程與指南模板，適合編寫技術教程、使用指南',
  category: 'tutorial',
  tags: ['tutorial', 'guide', 'learning', 'howto'],
  fields: [
    {
      name: 'title',
      label: '教程標題',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: '教程簡介',
      type: 'textarea',
      required: true,
    },
    {
      name: 'difficulty',
      label: '難度等級',
      type: 'select',
      required: true,
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
    {
      name: 'duration',
      label: '預計時長',
      type: 'text',
      required: false,
      placeholder: '30 minutes',
    },
    {
      name: 'prerequisites',
      label: '前置知識',
      type: 'array',
      required: false,
    },
    {
      name: 'objectives',
      label: '學習目標',
      type: 'array',
      required: true,
    },
    {
      name: 'steps',
      label: '教程步驟',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        title: { type: 'text', label: 'Step Title' },
        description: { type: 'textarea', label: 'Description' },
        code: { type: 'code', label: 'Code Example' },
        notes: { type: 'textarea', label: 'Additional Notes' },
      },
    },
    {
      name: 'troubleshooting',
      label: '常見問題',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        problem: { type: 'text', label: 'Problem' },
        solution: { type: 'textarea', label: 'Solution' },
      },
    },
    {
      name: 'nextSteps',
      label: '下一步',
      type: 'array',
      required: false,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{title}}

{{description}}

**Difficulty**: {{difficulty}}  
{% if duration %}
**Duration**: {{duration}}  
{% endif %}
**Last Updated**: {{date}}

---`,
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      order: 2,
      required: false,
      condition: 'prerequisites',
      content: `## Prerequisites

Before starting this tutorial, you should have:

{% for prerequisite in prerequisites %}
- {{prerequisite}}
{% endfor %}`,
    },
    {
      id: 'objectives',
      title: 'Learning Objectives',
      order: 3,
      required: true,
      content: `## What You'll Learn

By the end of this tutorial, you will be able to:

{% for objective in objectives %}
- {{objective}}
{% endfor %}`,
    },
    {
      id: 'steps',
      title: 'Tutorial Steps',
      order: 4,
      required: true,
      content: `## Tutorial Steps

{% for step in steps %}
### Step {{loop.index1}}: {{step.title}}

{{step.description}}

{% if step.code %}
\`\`\`
{{step.code}}
\`\`\`
{% endif %}

{% if step.notes %}
> **Note**: {{step.notes}}
{% endif %}

{% endfor %}`,
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      order: 5,
      required: false,
      condition: 'troubleshooting',
      content: `## Troubleshooting

{% for issue in troubleshooting %}
### {{issue.problem}}

{{issue.solution}}

{% endfor %}`,
    },
    {
      id: 'nextSteps',
      title: 'Next Steps',
      order: 6,
      required: false,
      condition: 'nextSteps',
      content: `## Next Steps

Now that you've completed this tutorial, here's what you can do next:

{% for step in nextSteps %}
- {{step}}
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

export const meetingNotesTemplate: TemplateConfig = {
  id: 'meeting-notes',
  name: 'Meeting Notes',
  description: '會議記錄模板，快速記錄會議內容與決議事項',
  category: 'meeting',
  tags: ['meeting', 'notes', 'minutes', 'business'],
  fields: [
    {
      name: 'meetingTitle',
      label: '會議主題',
      type: 'text',
      required: true,
    },
    {
      name: 'meetingDate',
      label: '會議日期',
      type: 'date',
      required: true,
    },
    {
      name: 'meetingTime',
      label: '會議時間',
      type: 'text',
      required: false,
      placeholder: '14:00 - 15:30',
    },
    {
      name: 'location',
      label: '會議地點',
      type: 'text',
      required: false,
    },
    {
      name: 'attendees',
      label: '出席人員',
      type: 'array',
      required: true,
    },
    {
      name: 'agenda',
      label: '會議議程',
      type: 'array',
      required: true,
    },
    {
      name: 'discussions',
      label: '討論內容',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        topic: { type: 'text', label: 'Discussion Topic' },
        summary: { type: 'textarea', label: 'Summary' },
      },
    },
    {
      name: 'decisions',
      label: '決議事項',
      type: 'array',
      required: false,
    },
    {
      name: 'actionItems',
      label: '行動項目',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        task: { type: 'text', label: 'Task' },
        assignee: { type: 'text', label: 'Assigned To' },
        dueDate: { type: 'date', label: 'Due Date' },
      },
    },
    {
      name: 'nextMeeting',
      label: '下次會議',
      type: 'text',
      required: false,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{meetingTitle}}

**Date**: {{meetingDate}}  
{% if meetingTime %}
**Time**: {{meetingTime}}  
{% endif %}
{% if location %}
**Location**: {{location}}  
{% endif %}

---`,
    },
    {
      id: 'attendees',
      title: 'Attendees',
      order: 2,
      required: true,
      content: `## Attendees

{% for attendee in attendees %}
- {{attendee}}
{% endfor %}`,
    },
    {
      id: 'agenda',
      title: 'Agenda',
      order: 3,
      required: true,
      content: `## Agenda

{% for item in agenda %}
{{loop.index1}}. {{item}}
{% endfor %}`,
    },
    {
      id: 'discussions',
      title: 'Discussions',
      order: 4,
      required: true,
      content: `## Discussions

{% for discussion in discussions %}
### {{discussion.topic}}

{{discussion.summary}}

{% endfor %}`,
    },
    {
      id: 'decisions',
      title: 'Decisions',
      order: 5,
      required: false,
      condition: 'decisions',
      content: `## Decisions Made

{% for decision in decisions %}
- {{decision}}
{% endfor %}`,
    },
    {
      id: 'actionItems',
      title: 'Action Items',
      order: 6,
      required: false,
      condition: 'actionItems',
      content: `## Action Items

| Task | Assigned To | Due Date |
|------|-------------|----------|
{% for item in actionItems %}
| {{item.task}} | {{item.assignee}} | {{item.dueDate}} |
{% endfor %}`,
    },
    {
      id: 'nextMeeting',
      title: 'Next Meeting',
      order: 7,
      required: false,
      condition: 'nextMeeting',
      content: `## Next Meeting

{{nextMeeting}}`,
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

export const projectProposalTemplate: TemplateConfig = {
  id: 'project-proposal',
  name: 'Project Proposal',
  description: '專案提案文檔模板，用於新專案的規劃與提案',
  category: 'project',
  tags: ['project', 'proposal', 'planning', 'business'],
  fields: [
    {
      name: 'projectName',
      label: '專案名稱',
      type: 'text',
      required: true,
    },
    {
      name: 'proposedBy',
      label: '提案人',
      type: 'text',
      required: true,
    },
    {
      name: 'executiveSummary',
      label: '執行摘要',
      type: 'textarea',
      required: true,
    },
    {
      name: 'background',
      label: '背景說明',
      type: 'textarea',
      required: true,
    },
    {
      name: 'objectives',
      label: '專案目標',
      type: 'array',
      required: true,
    },
    {
      name: 'scope',
      label: '專案範圍',
      type: 'textarea',
      required: true,
    },
    {
      name: 'deliverables',
      label: '交付成果',
      type: 'array',
      required: true,
    },
    {
      name: 'timeline',
      label: '時程規劃',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        phase: { type: 'text', label: 'Phase' },
        duration: { type: 'text', label: 'Duration' },
        milestones: { type: 'array', label: 'Milestones' },
      },
    },
    {
      name: 'resources',
      label: '所需資源',
      type: 'textarea',
      required: true,
    },
    {
      name: 'budget',
      label: '預算估算',
      type: 'textarea',
      required: false,
    },
    {
      name: 'risks',
      label: '風險評估',
      type: 'array',
      required: false,
    },
    {
      name: 'success Criteria',
      label: '成功標準',
      type: 'array',
      required: true,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# Project Proposal: {{projectName}}

**Proposed By**: {{proposedBy}}  
**Date**: {{date}}

---`,
    },
    {
      id: 'executiveSummary',
      title: 'Executive Summary',
      order: 2,
      required: true,
      content: `## Executive Summary

{{executiveSummary}}`,
    },
    {
      id: 'background',
      title: 'Background',
      order: 3,
      required: true,
      content: `## Background

{{background}}`,
    },
    {
      id: 'objectives',
      title: 'Project Objectives',
      order: 4,
      required: true,
      content: `## Project Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`,
    },
    {
      id: 'scope',
      title: 'Project Scope',
      order: 5,
      required: true,
      content: `## Project Scope

{{scope}}`,
    },
    {
      id: 'deliverables',
      title: 'Deliverables',
      order: 6,
      required: true,
      content: `## Deliverables

{% for deliverable in deliverables %}
- {{deliverable}}
{% endfor %}`,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      order: 7,
      required: true,
      content: `## Timeline

{% for phase in timeline %}
### {{phase.phase}}

**Duration**: {{phase.duration}}

**Milestones**:
{% for milestone in phase.milestones %}
- {{milestone}}
{% endfor %}

{% endfor %}`,
    },
    {
      id: 'resources',
      title: 'Required Resources',
      order: 8,
      required: true,
      content: `## Required Resources

{{resources}}`,
    },
    {
      id: 'budget',
      title: 'Budget Estimate',
      order: 9,
      required: false,
      condition: 'budget',
      content: `## Budget Estimate

{{budget}}`,
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      order: 10,
      required: false,
      condition: 'risks',
      content: `## Risk Assessment

{% for risk in risks %}
- {{risk}}
{% endfor %}`,
    },
    {
      id: 'successCriteria',
      title: 'Success Criteria',
      order: 11,
      required: true,
      content: `## Success Criteria

{% for criterion in successCriteria %}
- {{criterion}}
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

export const documentationTemplates = [
  technicalDesignDocTemplate,
  apiDocumentationTemplate,
  tutorialTemplate,
  meetingNotesTemplate,
  projectProposalTemplate,
];
