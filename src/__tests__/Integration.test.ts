import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MarkdownBot } from '@/index';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('Integration Tests', () => {
  let bot: MarkdownBot;
  let testDir: string;

  beforeEach(async () => {
    bot = new MarkdownBot();
    testDir = path.join(os.tmpdir(), `mdbot-integration-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('End-to-End Markdown Generation', () => {
    it('should generate GitHub README from start to finish', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'My Awesome Project',
        fields: {
          projectName: 'My Awesome Project',
          description: 'A truly awesome project',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          installation: 'npm install my-awesome-project',
          usage: 'npm start',
          license: 'MIT',
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.filePath).toBeDefined();
      
      const fileContent = await fs.readFile(result.filePath!, 'utf-8');
      expect(fileContent).toContain('My Awesome Project');
      expect(fileContent).toContain('Feature 1');
      expect(fileContent).toContain('npm install my-awesome-project');
    });

    it('should generate CONTRIBUTING guide', async () => {
      const input = {
        templateId: 'github-contributing',
        title: 'Contributing Guide',
        fields: {
          projectName: 'Test Project',
          contactEmail: 'test@example.com',
          codeOfConduct: 'Be nice to everyone',
          contributionTypes: ['Bug Reports', 'Feature Requests', 'Code Contributions'],
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('Contributing Guide');
    });

    it('should generate technical documentation', async () => {
      const input = {
        templateId: 'technical-design',
        title: 'System Design Document',
        fields: {
          documentTitle: 'System Design Document',
          projectName: 'Test System',
          author: 'John Doe',
          overview: 'System overview',
          architecture: 'Microservices architecture',
          technologies: ['Node.js', 'TypeScript', 'PostgreSQL'],
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('System Design Document');
    });

    it('should generate meeting notes', async () => {
      const input = {
        templateId: 'meeting-notes',
        title: 'Team Meeting Notes',
        fields: {
          meetingTitle: 'Sprint Planning',
          date: '2024-06-01',
          attendees: ['Alice', 'Bob', 'Charlie'],
          agenda: ['Review last sprint', 'Plan next sprint'],
          notes: 'Discussion about project timeline',
          actionItems: ['Alice to review PR', 'Bob to update documentation'],
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('Sprint Planning');
    });

    it('should generate blog post', async () => {
      const input = {
        templateId: 'blog-post',
        title: 'My First Blog Post',
        fields: {
          title: 'Understanding TypeScript',
          author: 'Jane Doe',
          date: '2024-06-01',
          summary: 'An introduction to TypeScript',
          content: 'TypeScript is a typed superset of JavaScript...',
          tags: ['typescript', 'programming'],
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('Understanding TypeScript');
    });
  });

  describe('Template Discovery and Selection', () => {
    it('should list all available templates', () => {
      const templates = bot.listTemplates();
      
      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(10);
      expect(templates.some(t => t.id === 'github-readme')).toBe(true);
      expect(templates.some(t => t.id === 'technical-design')).toBe(true);
    });

    it('should filter templates by category', () => {
      const githubTemplates = bot.listTemplates({ category: 'github' });
      
      expect(githubTemplates).toBeInstanceOf(Array);
      expect(githubTemplates.every(t => t.category === 'github')).toBe(true);
    });

    it('should search templates by keywords', () => {
      const results = bot.searchTemplates({ keywords: ['readme', 'github'] });
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].template.id).toBe('github-readme');
    });

    it('should get template details', () => {
      const template = bot.getTemplate('github-readme');
      
      expect(template).toBeDefined();
      expect(template?.name).toBe('GitHub README.md');
      expect(template?.fields.length).toBeGreaterThan(0);
    });
  });

  describe('Batch Operations', () => {
    it('should generate multiple files in batch', async () => {
      const inputs = [
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
          filename: 'PROJECT-1.md',
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
          filename: 'PROJECT-2.md',
        },
      ];

      const results = await bot.generateBatch(inputs);
      
      expect(results.length).toBe(2);
      expect(results.every(r => r.success)).toBe(true);
      
      const file1Exists = await fs.pathExists(path.join(testDir, 'PROJECT-1.md'));
      const file2Exists = await fs.pathExists(path.join(testDir, 'PROJECT-2.md'));
      expect(file1Exists).toBe(true);
      expect(file2Exists).toBe(true);
    });
  });

  describe('Input Validation and Error Handling', () => {
    it('should validate required fields', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {},
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-existent templates', async () => {
      const input = {
        templateId: 'non-existent-template',
        title: 'Test',
        fields: {},
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.includes('template'))).toBe(true);
    });

    it('should validate field types', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: 'not-an-array',
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Custom Templates', () => {
    it('should register a custom template', () => {
      const customTemplate = {
        id: 'custom-test',
        name: 'Custom Test Template',
        description: 'A custom template for testing',
        category: 'custom' as const,
        tags: ['custom', 'test'],
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text' as const,
            required: true,
            description: 'Document title',
          },
          {
            name: 'content',
            label: 'Content',
            type: 'textarea' as const,
            required: true,
            description: 'Document content',
          },
        ],
        sections: [
          {
            id: 'header',
            name: 'Header',
            content: '# {{title}}',
            required: true,
            order: 1,
          },
          {
            id: 'body',
            name: 'Body',
            content: '{{content}}',
            required: true,
            order: 2,
          },
        ],
        metadata: {
          version: '1.0.0',
          author: 'Test User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      bot.registerTemplate(customTemplate);
      
      const retrieved = bot.getTemplate('custom-test');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Custom Test Template');
    });

    it('should use custom template for generation', async () => {
      const customTemplate = {
        id: 'custom-gen-test',
        name: 'Custom Generation Test',
        description: 'Test',
        category: 'custom' as const,
        tags: [],
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text' as const,
            required: true,
            description: 'Title',
          },
        ],
        sections: [
          {
            id: 'header',
            name: 'Header',
            content: '# {{title}}',
            required: true,
            order: 1,
          },
        ],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      bot.registerTemplate(customTemplate);

      const input = {
        templateId: 'custom-gen-test',
        title: 'Custom Document',
        fields: {
          title: 'Custom Document',
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      expect(result.content).toContain('Custom Document');
    });
  });

  describe('Markdown Validation Integration', () => {
    it('should validate generated markdown automatically', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'A test',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      
      const validation = bot.validateMarkdown(result.content!);
      expect(validation.valid).toBe(true);
    });
  });

  describe('File System Integration', () => {
    it('should handle filename sanitization', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'test<>:"|?*.md',
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      const filename = path.basename(result.filePath!);
      expect(filename).not.toContain('<');
      expect(filename).not.toContain('>');
    });

    it('should create output directory if not exists', async () => {
      const newDir = path.join(testDir, 'subdir', 'nested');
      
      const input = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: newDir,
      };

      const result = await bot.generate(input);
      
      expect(result.success).toBe(true);
      const dirExists = await fs.pathExists(newDir);
      expect(dirExists).toBe(true);
    });

    it('should handle duplicate filenames', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
        filename: 'README.md',
      };

      const result1 = await bot.generate(input);
      expect(result1.success).toBe(true);

      const input2 = { ...input, overwrite: false };
      const result2 = await bot.generate(input2);
      
      expect(result2.success).toBe(true);
      expect(result2.filePath).not.toBe(result1.filePath);
    });
  });

  describe('Statistics and Reporting', () => {
    it('should provide generation statistics', async () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test Project',
        fields: {
          projectName: 'Test Project',
          description: 'Test',
          features: ['Feature 1'],
          installation: 'npm install',
          usage: 'npm start',
        },
        outputPath: testDir,
      };

      const result = await bot.generate(input);
      
      expect(result.metadata).toBeDefined();
      expect(result.metadata.templateId).toBe('github-readme');
      expect(result.metadata.fileSize).toBeGreaterThan(0);
      expect(result.metadata.lineCount).toBeGreaterThan(0);
      expect(result.metadata.generatedAt).toBeInstanceOf(Date);
    });

    it('should provide library statistics', () => {
      const stats = bot.getStatistics();
      
      expect(stats).toBeDefined();
      expect(stats.totalTemplates).toBeGreaterThan(10);
      expect(stats.categoryCounts).toBeDefined();
      expect(stats.categoryCounts.github).toBeGreaterThan(0);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle complete project documentation generation', async () => {
      const readmeResult = await bot.generate({
        templateId: 'github-readme',
        title: 'My Library',
        fields: {
          projectName: 'My Library',
          description: 'A useful library',
          features: ['Feature 1', 'Feature 2'],
          installation: 'npm install my-library',
          usage: 'import { myFunction } from "my-library"',
        },
        outputPath: testDir,
        filename: 'README.md',
      });

      const contributingResult = await bot.generate({
        templateId: 'github-contributing',
        title: 'Contributing',
        fields: {
          projectName: 'My Library',
          contactEmail: 'maintainer@example.com',
          codeOfConduct: 'Be respectful',
          contributionTypes: ['Bug Reports', 'Pull Requests'],
        },
        outputPath: testDir,
        filename: 'CONTRIBUTING.md',
      });

      const changelogResult = await bot.generate({
        templateId: 'github-changelog',
        title: 'Changelog',
        fields: {
          projectName: 'My Library',
          releases: [
            {
              version: '1.0.0',
              date: '2024-06-01',
              changes: ['Initial release'],
            },
          ],
        },
        outputPath: testDir,
        filename: 'CHANGELOG.md',
      });

      expect(readmeResult.success).toBe(true);
      expect(contributingResult.success).toBe(true);
      expect(changelogResult.success).toBe(true);
    });

    it('should handle technical documentation workflow', async () => {
      const designDoc = await bot.generate({
        templateId: 'technical-design',
        title: 'System Design',
        fields: {
          documentTitle: 'System Design Document',
          projectName: 'E-commerce Platform',
          author: 'Architecture Team',
          overview: 'High-level system overview',
          architecture: 'Microservices-based architecture',
          technologies: ['Node.js', 'PostgreSQL', 'Redis'],
        },
        outputPath: testDir,
      });

      const apiDoc = await bot.generate({
        templateId: 'api-documentation',
        title: 'API Documentation',
        fields: {
          apiName: 'E-commerce API',
          version: 'v1.0',
          baseUrl: 'https://api.example.com',
          authentication: 'JWT Bearer Token',
          endpoints: [
            { method: 'GET', path: '/products', description: 'List products' },
          ],
        },
        outputPath: testDir,
      });

      expect(designDoc.success).toBe(true);
      expect(apiDoc.success).toBe(true);
    });
  });

  describe('Performance Under Load', () => {
    it('should handle multiple concurrent generations', async () => {
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          bot.generate({
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
            filename: `project-${i}.md`,
          })
        );
      }

      const results = await Promise.all(promises);
      
      expect(results.length).toBe(20);
      expect(results.every(r => r.success)).toBe(true);
    }, 20000);
  });
});
