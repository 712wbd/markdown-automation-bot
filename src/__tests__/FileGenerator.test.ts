import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileGenerator } from '@/core/FileGenerator';
import { TemplateLibrary } from '@/core/TemplateLibrary';
import { TemplateEngine } from '@/core/TemplateEngine';
import { FileSystemManager } from '@/utils/fileSystem';
import { UserInput } from '@/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('FileGenerator', () => {
  let generator: FileGenerator;
  let library: TemplateLibrary;
  let engine: TemplateEngine;
  let fsManager: FileSystemManager;
  let testDir: string;

  beforeEach(async () => {
    library = new TemplateLibrary();
    engine = new TemplateEngine();
    fsManager = new FileSystemManager();
    generator = new FileGenerator(library, engine, fsManager);
    
    testDir = path.join(os.tmpdir(), `mdbot-gen-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('File Generation', () => {
    it('should generate a valid markdown file', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1', 'Feature 2'],
          installation: 'npm install test-project',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'README.md',
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.errors.length).toBe(0);
      
      const fileExists = await fs.pathExists(result.filePath!);
      expect(fileExists).toBe(true);
    });

    it('should generate file with default filename', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toBeDefined();
      expect(path.basename(result.filePath!)).toMatch(/^test-project.*\.md$/);
    });

    it('should respect overwrite option', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'README.md',
      };

      const firstResult = await generator.generate(input);
      expect(firstResult.success).toBe(true);

      const secondInput = { ...input, overwrite: false };
      const secondResult = await generator.generate(secondInput);
      
      expect(secondResult.filePath).not.toBe(firstResult.filePath);
    });

    it('should handle file generation errors gracefully', async () => {
      const input: UserInput = {
        templateId: 'non-existent-template',
        title: 'Test',
        fields: {},
        outputPath: '/invalid/path/that/does/not/exist',
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should populate metadata in result', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata.templateId).toBe('github-readme');
      expect(result.metadata.generatedAt).toBeInstanceOf(Date);
      expect(result.metadata.fileSize).toBeGreaterThan(0);
      expect(result.metadata.lineCount).toBeGreaterThan(0);
    });
  });

  describe('Markdown Validation', () => {
    it('should validate valid markdown', () => {
      const validMarkdown = `
# Heading 1

This is a paragraph.

## Heading 2

- List item 1
- List item 2

\`\`\`javascript
console.log('Hello');
\`\`\`

[Link](https://example.com)
`;

      const result = generator.validateMarkdown(validMarkdown);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect invalid header levels', () => {
      const invalidMarkdown = `
# Heading 1
### Heading 3 (skips level 2)
## Heading 2
`;

      const result = generator.validateMarkdown(invalidMarkdown);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('header'))).toBe(true);
    });

    it('should detect unclosed code blocks', () => {
      const invalidMarkdown = `
# Heading

\`\`\`javascript
console.log('Hello');

This code block is not closed
`;

      const result = generator.validateMarkdown(invalidMarkdown);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('code block'))).toBe(true);
    });

    it('should detect invalid links', () => {
      const invalidMarkdown = `
# Heading

[Invalid Link](not-a-valid-url)
[Another Link]()
`;

      const result = generator.validateMarkdown(invalidMarkdown);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should detect unbalanced brackets', () => {
      const invalidMarkdown = `
# Heading

[Unbalanced link(https://example.com)
`;

      const result = generator.validateMarkdown(invalidMarkdown);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate complex markdown structures', () => {
      const complexMarkdown = `
# Main Heading

## Section 1

This is a paragraph with **bold** and *italic* text.

### Subsection 1.1

- Bullet point 1
- Bullet point 2
  - Nested bullet 1
  - Nested bullet 2

### Subsection 1.2

1. Numbered item 1
2. Numbered item 2

## Section 2

> This is a blockquote

\`\`\`typescript
interface Example {
  name: string;
  value: number;
}
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |

[Link to section](#section-1)
`;

      const result = generator.validateMarkdown(complexMarkdown);
      expect(result.valid).toBe(true);
    });

    it('should handle empty markdown', () => {
      const result = generator.validateMarkdown('');
      expect(result.warnings.some(w => w.includes('empty'))).toBe(true);
    });

    it('should handle markdown with only whitespace', () => {
      const result = generator.validateMarkdown('   \n\n   \t\t  \n  ');
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Content Processing', () => {
    it('should process template variables correctly', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'My Project',
        fields: {
          projectName: 'My Awesome Project',
          description: 'This is awesome',
          features: ['Feature A', 'Feature B'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.content).toContain('My Awesome Project');
      expect(result.content).toContain('This is awesome');
      expect(result.content).toContain('Feature A');
      expect(result.content).toContain('Feature B');
    });

    it('should handle special characters in content', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test <>&"\'',
        fields: {
          projectName: 'Project <>&"\'',
          description: 'Description with special chars',
          features: ['Feature <>&"\''],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('<>&"\'');
    });

    it('should handle Unicode characters', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: '測試專案 🚀',
        fields: {
          projectName: '中文專案名稱',
          description: '這是一個測試專案 🎉',
          features: ['功能一', '功能二'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('中文專案名稱');
      expect(result.content).toContain('🚀');
    });

    it('should handle very long content', async () => {
      const longText = 'A'.repeat(50000);
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Long Content Test',
        fields: {
          projectName: 'Long Content Project',
          description: longText,
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content?.length).toBeGreaterThan(50000);
    });
  });

  describe('Batch Generation', () => {
    it('should generate multiple files in batch', async () => {
      const inputs: UserInput[] = [
        {
          templateId: 'github-readme',
          title: 'Project 1',
          fields: {
            projectName: 'Project 1',
            description: 'First project',
            features: ['Feature 1'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
          filename: 'README-1.md',
        },
        {
          templateId: 'github-readme',
          title: 'Project 2',
          fields: {
            projectName: 'Project 2',
            description: 'Second project',
            features: ['Feature 2'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
          filename: 'README-2.md',
        },
        {
          templateId: 'github-readme',
          title: 'Project 3',
          fields: {
            projectName: 'Project 3',
            description: 'Third project',
            features: ['Feature 3'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
          filename: 'README-3.md',
        },
      ];

      const results = await generator.generateBatch(inputs);
      
      expect(results.length).toBe(3);
      expect(results.every(r => r.success)).toBe(true);
      
      for (const result of results) {
        const fileExists = await fs.pathExists(result.filePath!);
        expect(fileExists).toBe(true);
      }
    });

    it('should handle partial batch failures', async () => {
      const inputs: UserInput[] = [
        {
          templateId: 'github-readme',
          title: 'Valid Project',
          fields: {
            projectName: 'Valid Project',
            description: 'Valid',
            features: ['Feature 1'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
        },
        {
          templateId: 'non-existent',
          title: 'Invalid Project',
          fields: {},
          outputPath: testDir,
        },
      ];

      const results = await generator.generateBatch(inputs);
      
      expect(results.length).toBe(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });

    it('should provide batch statistics', async () => {
      const inputs: UserInput[] = [
        {
          templateId: 'github-readme',
          title: 'Project 1',
          fields: {
            projectName: 'Project 1',
            description: 'First',
            features: ['Feature 1'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
        },
        {
          templateId: 'github-readme',
          title: 'Project 2',
          fields: {
            projectName: 'Project 2',
            description: 'Second',
            features: ['Feature 2'],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
        },
      ];

      const results = await generator.generateBatch(inputs);
      const stats = generator.getBatchStatistics(results);
      
      expect(stats.total).toBe(2);
      expect(stats.successful).toBe(2);
      expect(stats.failed).toBe(0);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.averageSize).toBeGreaterThan(0);
    });
  });

  describe('Dry Run Mode', () => {
    it('should preview generation without writing files', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'test-preview.md',
      };

      const result = await generator.generate(input, { dryRun: true });
      
      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      
      const fileExists = await fs.pathExists(path.join(testDir, 'test-preview.md'));
      expect(fileExists).toBe(false);
    });

    it('should validate markdown in dry run mode', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test project',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input, { dryRun: true });
      
      expect(result.success).toBe(true);
      expect(result.warnings).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing template gracefully', async () => {
      const input: UserInput = {
        templateId: 'missing-template',
        title: 'Test',
        fields: {},
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.includes('template'))).toBe(true);
    });

    it('should handle invalid output path', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projectName: 'Test',
          description: 'Test',
          features: ['Feature'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: '/invalid/path/that/does/not/exist',
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(false);
    });

    it('should handle filename with special characters', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: ['Feature'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'test<>:"|?*.md',
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
      const filename = path.basename(result.filePath!);
      expect(filename).not.toContain('<');
      expect(filename).not.toContain('>');
      expect(filename).not.toContain(':');
    });

    it('should handle empty template sections', async () => {
      const input: UserInput = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projectName: 'Test',
          description: '',
          features: [],
          installation: '',
          usage: '',
        },
        outputPath: testDir,
      };

      const result = await generator.generate(input);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle large batch generation efficiently', async () => {
      const inputs: UserInput[] = [];
      for (let i = 0; i < 50; i++) {
        inputs.push({
          templateId: 'github-readme',
          title: `Project ${i}`,
          fields: {
            projectName: `Project ${i}`,
            description: `Description ${i}`,
            features: [`Feature ${i}`],
            installation: 'npm install',
            usage: 'npm start',
          },
          outputPath: testDir,
          filename: `README-${i}.md`,
        });
      }

      const startTime = Date.now();
      const results = await generator.generateBatch(inputs);
      const endTime = Date.now();
      
      expect(results.length).toBe(50);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(10000);
    }, 15000);
  });
});
