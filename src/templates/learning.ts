import { TemplateConfig } from '@/types';

export const learningNotesTemplate: TemplateConfig = {
  id: 'learning-notes',
  name: 'Learning Notes',
  description: '學習筆記模板，適合記錄學習內容、重點摘要、心得反思',
  category: 'learning',
  tags: ['learning', 'notes', 'study', 'education'],
  fields: [
    {
      name: 'topic',
      label: '學習主題',
      type: 'text',
      required: true,
    },
    {
      name: 'source',
      label: '學習來源',
      type: 'text',
      required: false,
      placeholder: 'Book, Course, Article, etc.',
    },
    {
      name: 'date',
      label: '學習日期',
      type: 'date',
      required: true,
    },
    {
      name: 'objectives',
      label: '學習目標',
      type: 'array',
      required: true,
    },
    {
      name: 'keypoints',
      label: '重點摘要',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        title: { type: 'text', label: 'Key Point Title' },
        description: { type: 'textarea', label: 'Description' },
        examples: { type: 'array', label: 'Examples' },
      },
    },
    {
      name: 'code Examples',
      label: '程式碼範例',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        language: { type: 'text', label: 'Programming Language' },
        code: { type: 'code', label: 'Code' },
        explanation: { type: 'textarea', label: 'Explanation' },
      },
    },
    {
      name: 'resources',
      label: '相關資源',
      type: 'array',
      required: false,
    },
    {
      name: 'questions',
      label: '疑問與思考',
      type: 'array',
      required: false,
    },
    {
      name: 'reflection',
      label: '學習心得',
      type: 'textarea',
      required: false,
    },
    {
      name: 'nextSteps',
      label: '下一步行動',
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
      content: `# 📚 {{topic}}

**Date**: {{date}}  
{% if source %}
**Source**: {{source}}  
{% endif %}

---`,
    },
    {
      id: 'objectives',
      title: 'Learning Objectives',
      order: 2,
      required: true,
      content: `## 🎯 Learning Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`,
    },
    {
      id: 'keypoints',
      title: 'Key Points',
      order: 3,
      required: true,
      content: `## 📝 Key Points

{% for point in keypoints %}
### {{point.title}}

{{point.description}}

{% if point.examples %}
**Examples**:
{% for example in point.examples %}
- {{example}}
{% endfor %}
{% endif %}

{% endfor %}`,
    },
    {
      id: 'codeExamples',
      title: 'Code Examples',
      order: 4,
      required: false,
      condition: 'codeExamples',
      content: `## 💻 Code Examples

{% for example in codeExamples %}
### {{example.language}}

\`\`\`{{lowercase(example.language)}}
{{example.code}}
\`\`\`

{{example.explanation}}

{% endfor %}`,
    },
    {
      id: 'resources',
      title: 'Resources',
      order: 5,
      required: false,
      condition: 'resources',
      content: `## 🔗 Resources

{% for resource in resources %}
- {{resource}}
{% endfor %}`,
    },
    {
      id: 'questions',
      title: 'Questions',
      order: 6,
      required: false,
      condition: 'questions',
      content: `## ❓ Questions & Thoughts

{% for question in questions %}
- {{question}}
{% endfor %}`,
    },
    {
      id: 'reflection',
      title: 'Reflection',
      order: 7,
      required: false,
      condition: 'reflection',
      content: `## 💭 Reflection

{{reflection}}`,
    },
    {
      id: 'nextSteps',
      title: 'Next Steps',
      order: 8,
      required: false,
      condition: 'nextSteps',
      content: `## 📌 Next Steps

{% for step in nextSteps %}
- [ ] {{step}}
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

export const blogPostTemplate: TemplateConfig = {
  id: 'blog-post',
  name: 'Blog Post',
  description: '部落格文章模板，適合撰寫技術文章、心得分享',
  category: 'blog',
  tags: ['blog', 'article', 'writing', 'content'],
  fields: [
    {
      name: 'title',
      label: '文章標題',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      label: '作者',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: '發布日期',
      type: 'date',
      required: true,
    },
    {
      name: 'tags',
      label: '標籤',
      type: 'array',
      required: true,
    },
    {
      name: 'excerpt',
      label: '摘要',
      type: 'textarea',
      required: true,
      validation: { maxLength: 200 },
    },
    {
      name: 'coverImage',
      label: '封面圖片 URL',
      type: 'url',
      required: false,
    },
    {
      name: 'introduction',
      label: '引言',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sections',
      label: '文章段落',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        heading: { type: 'text', label: 'Section Heading' },
        content: { type: 'textarea', label: 'Content' },
        code: { type: 'code', label: 'Code Example (optional)' },
        images: { type: 'array', label: 'Images (optional)' },
      },
    },
    {
      name: 'conclusion',
      label: '結論',
      type: 'textarea',
      required: true,
    },
    {
      name: 'references',
      label: '參考資料',
      type: 'array',
      required: false,
    },
    {
      name: 'callToAction',
      label: 'Call to Action',
      type: 'textarea',
      required: false,
    },
  ],
  sections: [
    {
      id: 'frontmatter',
      title: 'Frontmatter',
      order: 1,
      required: true,
      content: `---
title: "{{title}}"
author: "{{author}}"
date: {{date}}
tags: [{{join(tags, ", ")}}]
excerpt: "{{excerpt}}"
{% if coverImage %}
coverImage: "{{coverImage}}"
{% endif %}
---`,
    },
    {
      id: 'header',
      title: 'Header',
      order: 2,
      required: true,
      content: `# {{title}}

{% if coverImage %}
![{{title}}]({{coverImage}})
{% endif %}

*By {{author}} | {{date}} | {{join(tags, ", ")}}}*

---`,
    },
    {
      id: 'introduction',
      title: 'Introduction',
      order: 3,
      required: true,
      content: `{{introduction}}`,
    },
    {
      id: 'content',
      title: 'Main Content',
      order: 4,
      required: true,
      content: `{% for section in sections %}
## {{section.heading}}

{{section.content}}

{% if section.code %}
\`\`\`
{{section.code}}
\`\`\`
{% endif %}

{% if section.images %}
{% for image in section.images %}
![Image]({{image}})
{% endfor %}
{% endif %}

{% endfor %}`,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      order: 5,
      required: true,
      content: `## Conclusion

{{conclusion}}`,
    },
    {
      id: 'references',
      title: 'References',
      order: 6,
      required: false,
      condition: 'references',
      content: `## References

{% for reference in references %}
- {{reference}}
{% endfor %}`,
    },
    {
      id: 'callToAction',
      title: 'Call to Action',
      order: 7,
      required: false,
      condition: 'callToAction',
      content: `---

{{callToAction}}`,
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

export const technicalArticleTemplate: TemplateConfig = {
  id: 'technical-article',
  name: 'Technical Article',
  description: '深度技術文章模板，適合撰寫技術深度解析、原理剖析',
  category: 'technical',
  tags: ['technical', 'article', 'deep-dive', 'engineering'],
  fields: [
    {
      name: 'title',
      label: '文章標題',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      label: '作者',
      type: 'text',
      required: true,
    },
    {
      name: 'difficulty',
      label: '難度等級',
      type: 'select',
      required: true,
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    {
      name: 'readingTime',
      label: '閱讀時間 (分鐘)',
      type: 'number',
      required: false,
    },
    {
      name: 'abstract',
      label: '摘要',
      type: 'textarea',
      required: true,
    },
    {
      name: 'prerequisites',
      label: '前置知識',
      type: 'array',
      required: false,
    },
    {
      name: 'tableOfContents',
      label: '是否生成目錄',
      type: 'select',
      required: true,
      options: ['yes', 'no'],
      defaultValue: 'yes',
    },
    {
      name: 'problemStatement',
      label: '問題陳述',
      type: 'textarea',
      required: true,
    },
    {
      name: 'technicalBackground',
      label: '技術背景',
      type: 'textarea',
      required: true,
    },
    {
      name: 'solution',
      label: '解決方案',
      type: 'textarea',
      required: true,
    },
    {
      name: 'implementation',
      label: '實作細節',
      type: 'array',
      required: true,
      itemType: 'object',
      properties: {
        title: { type: 'text', label: 'Step Title' },
        description: { type: 'textarea', label: 'Description' },
        code: { type: 'code', label: 'Code' },
        notes: { type: 'textarea', label: 'Notes' },
      },
    },
    {
      name: 'benchmarks',
      label: '性能評測',
      type: 'textarea',
      required: false,
    },
    {
      name: 'tradeoffs',
      label: '權衡與取捨',
      type: 'array',
      required: false,
    },
    {
      name: 'futurework',
      label: '未來工作',
      type: 'array',
      required: false,
    },
    {
      name: 'conclusion',
      label: '結論',
      type: 'textarea',
      required: true,
    },
  ],
  sections: [
    {
      id: 'header',
      title: 'Header',
      order: 1,
      required: true,
      content: `# {{title}}

**Author**: {{author}}  
**Difficulty**: {{difficulty}}  
{% if readingTime %}
**Reading Time**: ~{{readingTime}} minutes  
{% endif %}
**Date**: {{date}}

---`,
    },
    {
      id: 'abstract',
      title: 'Abstract',
      order: 2,
      required: true,
      content: `## Abstract

{{abstract}}`,
    },
    {
      id: 'toc',
      title: 'Table of Contents',
      order: 3,
      required: false,
      condition: 'tableOfContents === "yes"',
      content: `## Table of Contents

- [Abstract](#abstract)
- [Prerequisites](#prerequisites)
- [Problem Statement](#problem-statement)
- [Technical Background](#technical-background)
- [Solution](#solution)
- [Implementation](#implementation)
- [Performance Benchmarks](#performance-benchmarks)
- [Tradeoffs](#tradeoffs)
- [Future Work](#future-work)
- [Conclusion](#conclusion)

---`,
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      order: 4,
      required: false,
      condition: 'prerequisites',
      content: `## Prerequisites

Before reading this article, you should be familiar with:

{% for prerequisite in prerequisites %}
- {{prerequisite}}
{% endfor %}

---`,
    },
    {
      id: 'problemStatement',
      title: 'Problem Statement',
      order: 5,
      required: true,
      content: `## Problem Statement

{{problemStatement}}`,
    },
    {
      id: 'technicalBackground',
      title: 'Technical Background',
      order: 6,
      required: true,
      content: `## Technical Background

{{technicalBackground}}`,
    },
    {
      id: 'solution',
      title: 'Solution',
      order: 7,
      required: true,
      content: `## Solution

{{solution}}`,
    },
    {
      id: 'implementation',
      title: 'Implementation',
      order: 8,
      required: true,
      content: `## Implementation

{% for step in implementation %}
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
      id: 'benchmarks',
      title: 'Performance Benchmarks',
      order: 9,
      required: false,
      condition: 'benchmarks',
      content: `## Performance Benchmarks

{{benchmarks}}`,
    },
    {
      id: 'tradeoffs',
      title: 'Tradeoffs',
      order: 10,
      required: false,
      condition: 'tradeoffs',
      content: `## Tradeoffs

{% for tradeoff in tradeoffs %}
- {{tradeoff}}
{% endfor %}`,
    },
    {
      id: 'futureWork',
      title: 'Future Work',
      order: 11,
      required: false,
      condition: 'futureWork',
      content: `## Future Work

{% for item in futureWork %}
- {{item}}
{% endfor %}`,
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      order: 12,
      required: true,
      content: `## Conclusion

{{conclusion}}`,
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

export const researchNotesTemplate: TemplateConfig = {
  id: 'research-notes',
  name: 'Research Notes',
  description: '研究筆記模板，適合記錄研究過程、實驗結果、文獻回顧',
  category: 'learning',
  tags: ['research', 'notes', 'academic', 'study'],
  fields: [
    {
      name: 'title',
      label: '研究主題',
      type: 'text',
      required: true,
    },
    {
      name: 'researcher',
      label: '研究者',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: '日期',
      type: 'date',
      required: true,
    },
    {
      name: 'researchQuestion',
      label: '研究問題',
      type: 'textarea',
      required: true,
    },
    {
      name: 'hypothesis',
      label: '研究假設',
      type: 'array',
      required: false,
    },
    {
      name: 'methodology',
      label: '研究方法',
      type: 'textarea',
      required: true,
    },
    {
      name: 'literatureReview',
      label: '文獻回顧',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        citation: { type: 'text', label: 'Citation' },
        summary: { type: 'textarea', label: 'Summary' },
        relevance: { type: 'textarea', label: 'Relevance' },
      },
    },
    {
      name: 'experiments',
      label: '實驗記錄',
      type: 'array',
      required: false,
      itemType: 'object',
      properties: {
        experimentName: { type: 'text', label: 'Experiment Name' },
        setup: { type: 'textarea', label: 'Setup' },
        procedure: { type: 'textarea', label: 'Procedure' },
        results: { type: 'textarea', label: 'Results' },
        observations: { type: 'textarea', label: 'Observations' },
      },
    },
    {
      name: 'findings',
      label: '研究發現',
      type: 'array',
      required: true,
    },
    {
      name: 'discussion',
      label: '討論',
      type: 'textarea',
      required: true,
    },
    {
      name: 'limitations',
      label: '研究限制',
      type: 'array',
      required: false,
    },
    {
      name: 'futureDirections',
      label: '未來方向',
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
      content: `# Research Notes: {{title}}

**Researcher**: {{researcher}}  
**Date**: {{date}}

---`,
    },
    {
      id: 'researchQuestion',
      title: 'Research Question',
      order: 2,
      required: true,
      content: `## Research Question

{{researchQuestion}}`,
    },
    {
      id: 'hypothesis',
      title: 'Hypothesis',
      order: 3,
      required: false,
      condition: 'hypothesis',
      content: `## Hypothesis

{% for h in hypothesis %}
- {{h}}
{% endfor %}`,
    },
    {
      id: 'methodology',
      title: 'Methodology',
      order: 4,
      required: true,
      content: `## Methodology

{{methodology}}`,
    },
    {
      id: 'literatureReview',
      title: 'Literature Review',
      order: 5,
      required: false,
      condition: 'literatureReview',
      content: `## Literature Review

{% for paper in literatureReview %}
### {{paper.citation}}

**Summary**: {{paper.summary}}

**Relevance**: {{paper.relevance}}

{% endfor %}`,
    },
    {
      id: 'experiments',
      title: 'Experiments',
      order: 6,
      required: false,
      condition: 'experiments',
      content: `## Experiments

{% for experiment in experiments %}
### {{experiment.experimentName}}

**Setup**: {{experiment.setup}}

**Procedure**: {{experiment.procedure}}

**Results**: {{experiment.results}}

**Observations**: {{experiment.observations}}

---

{% endfor %}`,
    },
    {
      id: 'findings',
      title: 'Findings',
      order: 7,
      required: true,
      content: `## Findings

{% for finding in findings %}
- {{finding}}
{% endfor %}`,
    },
    {
      id: 'discussion',
      title: 'Discussion',
      order: 8,
      required: true,
      content: `## Discussion

{{discussion}}`,
    },
    {
      id: 'limitations',
      title: 'Limitations',
      order: 9,
      required: false,
      condition: 'limitations',
      content: `## Limitations

{% for limitation in limitations %}
- {{limitation}}
{% endfor %}`,
    },
    {
      id: 'futureDirections',
      title: 'Future Directions',
      order: 10,
      required: false,
      condition: 'futureDirections',
      content: `## Future Directions

{% for direction in futureDirections %}
- {{direction}}
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

export const learningTemplates = [
  learningNotesTemplate,
  blogPostTemplate,
  technicalArticleTemplate,
  researchNotesTemplate,
];
