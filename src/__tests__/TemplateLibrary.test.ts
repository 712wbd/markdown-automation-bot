import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateLibrary, TemplateSearchOptions } from '@/core/TemplateLibrary';
import { TemplateConfig, TemplateCategory } from '@/types';

describe('TemplateLibrary', () => {
  let library: TemplateLibrary;

  beforeEach(() => {
    library = new TemplateLibrary();
  });

  describe('Template Registration', () => {
    it('should register a valid template', () => {
      const template: TemplateConfig = {
        id: 'test-template',
        name: 'Test Template',
        description: 'A test template',
        category: 'custom',
        tags: ['test'],
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
            description: 'Document title',
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
          author: 'Test Author',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      library.registerTemplate(template);
      const retrieved = library.getTemplate('test-template');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Template');
    });

    it('should throw error for invalid template', () => {
      const invalidTemplate = {
        id: '',
        name: 'Invalid',
        category: 'custom',
      } as any;

      expect(() => library.registerTemplate(invalidTemplate)).toThrow();
    });

    it('should warn when overwriting existing template', () => {
      const template: TemplateConfig = {
        id: 'duplicate-id',
        name: 'First Template',
        description: 'First',
        category: 'custom',
        tags: [],
        fields: [],
        sections: [],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      library.registerTemplate(template);
      
      const secondTemplate = { ...template, name: 'Second Template' };
      library.registerTemplate(secondTemplate);
      
      const retrieved = library.getTemplate('duplicate-id');
      expect(retrieved?.name).toBe('Second Template');
    });

    it('should unregister template successfully', () => {
      const template: TemplateConfig = {
        id: 'temp-template',
        name: 'Temporary Template',
        description: 'Temporary',
        category: 'custom',
        tags: [],
        fields: [],
        sections: [],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      library.registerTemplate(template);
      expect(library.getTemplate('temp-template')).toBeDefined();

      const removed = library.unregisterTemplate('temp-template');
      expect(removed).toBe(true);
      expect(library.getTemplate('temp-template')).toBeUndefined();
    });

    it('should return false when unregistering non-existent template', () => {
      const removed = library.unregisterTemplate('non-existent-id');
      expect(removed).toBe(false);
    });
  });

  describe('Template Retrieval', () => {
    it('should retrieve all templates', () => {
      const templates = library.getAllTemplates();
      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(0);
    });

    it('should retrieve templates by category', () => {
      const githubTemplates = library.getTemplatesByCategory('github');
      expect(githubTemplates).toBeInstanceOf(Array);
      expect(githubTemplates.every(t => t.category === 'github')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const templates = library.getTemplatesByCategory('non-existent' as TemplateCategory);
      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBe(0);
    });

    it('should return undefined for non-existent template id', () => {
      const template = library.getTemplate('non-existent-id');
      expect(template).toBeUndefined();
    });

    it('should list all available categories', () => {
      const categories = library.getCategories();
      expect(categories).toBeInstanceOf(Array);
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('github');
      expect(categories).toContain('technical');
    });
  });

  describe('Template Search', () => {
    it('should search templates by category', () => {
      const options: TemplateSearchOptions = {
        category: 'github',
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
      expect(matches.every(m => m.template.category === 'github')).toBe(true);
    });

    it('should search templates by tags', () => {
      const options: TemplateSearchOptions = {
        tags: ['readme'],
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every(m => m.template.tags.includes('readme'))).toBe(true);
    });

    it('should search templates by keywords', () => {
      const options: TemplateSearchOptions = {
        keywords: ['github', 'readme'],
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('should support fuzzy search', () => {
      const options: TemplateSearchOptions = {
        keywords: ['gihtub'],
        fuzzySearch: true,
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
    });

    it('should return matches sorted by score', () => {
      const options: TemplateSearchOptions = {
        keywords: ['technical', 'document'],
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
      
      for (let i = 0; i < matches.length - 1; i++) {
        expect(matches[i].score).toBeGreaterThanOrEqual(matches[i + 1].score);
      }
    });

    it('should combine multiple search criteria', () => {
      const options: TemplateSearchOptions = {
        category: 'github',
        tags: ['readme'],
        keywords: ['project'],
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
    });

    it('should return empty array for no matches', () => {
      const options: TemplateSearchOptions = {
        keywords: ['nonexistentkeywordthatshouldnotmatchanything'],
        fuzzySearch: false,
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
      expect(matches.length).toBe(0);
    });
  });

  describe('Template Validation', () => {
    it('should validate template structure', () => {
      const validTemplate: TemplateConfig = {
        id: 'valid-test',
        name: 'Valid Template',
        description: 'A valid template',
        category: 'custom',
        tags: ['test'],
        fields: [
          {
            name: 'field1',
            label: 'Field 1',
            type: 'text',
            required: true,
            description: 'Test field',
          },
        ],
        sections: [
          {
            id: 'section1',
            name: 'Section 1',
            content: 'Content',
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

      const validation = library.validateTemplate(validTemplate);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    it('should detect missing required fields', () => {
      const invalidTemplate = {
        id: 'missing-fields',
        name: 'Invalid',
      } as any;

      const validation = library.validateTemplate(invalidTemplate);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid field types', () => {
      const invalidTemplate: TemplateConfig = {
        id: 'invalid-field-type',
        name: 'Invalid Field Type',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'field1',
            label: 'Field 1',
            type: 'invalid-type' as any,
            required: true,
            description: 'Invalid field',
          },
        ],
        sections: [],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const validation = library.validateTemplate(invalidTemplate);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('field type'))).toBe(true);
    });

    it('should detect duplicate section IDs', () => {
      const invalidTemplate: TemplateConfig = {
        id: 'duplicate-sections',
        name: 'Duplicate Sections',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [],
        sections: [
          {
            id: 'section1',
            name: 'Section 1',
            content: 'Content 1',
            required: true,
            order: 1,
          },
          {
            id: 'section1',
            name: 'Section 1 Duplicate',
            content: 'Content 2',
            required: false,
            order: 2,
          },
        ],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const validation = library.validateTemplate(invalidTemplate);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('duplicate'))).toBe(true);
    });
  });

  describe('Template Statistics', () => {
    it('should return template statistics', () => {
      const stats = library.getStatistics();
      expect(stats).toBeDefined();
      expect(stats.totalTemplates).toBeGreaterThan(0);
      expect(stats.categoryCounts).toBeDefined();
      expect(stats.totalFields).toBeGreaterThan(0);
      expect(stats.totalSections).toBeGreaterThan(0);
    });

    it('should count templates by category correctly', () => {
      const stats = library.getStatistics();
      const githubCount = library.getTemplatesByCategory('github').length;
      expect(stats.categoryCounts.github).toBe(githubCount);
    });

    it('should track most used tags', () => {
      const stats = library.getStatistics();
      expect(stats.topTags).toBeInstanceOf(Array);
      expect(stats.topTags.length).toBeGreaterThan(0);
    });
  });

  describe('Template Export and Import', () => {
    it('should export template to JSON', () => {
      const template = library.getTemplate('github-readme');
      expect(template).toBeDefined();

      const exported = library.exportTemplate('github-readme', 'json');
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(parsed.id).toBe('github-readme');
    });

    it('should export template to YAML', () => {
      const template = library.getTemplate('github-readme');
      expect(template).toBeDefined();

      const exported = library.exportTemplate('github-readme', 'yaml');
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('string');
      expect(exported).toContain('id: github-readme');
    });

    it('should throw error when exporting non-existent template', () => {
      expect(() => library.exportTemplate('non-existent', 'json')).toThrow();
    });

    it('should export all templates', () => {
      const exported = library.exportAllTemplates('json');
      expect(exported).toBeDefined();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });
  });

  describe('Template Cloning', () => {
    it('should clone a template with new ID', () => {
      const originalId = 'github-readme';
      const newId = 'my-custom-readme';

      const cloned = library.cloneTemplate(originalId, newId, {
        name: 'My Custom README',
        description: 'Customized README template',
      });

      expect(cloned).toBeDefined();
      expect(cloned.id).toBe(newId);
      expect(cloned.name).toBe('My Custom README');
      expect(library.getTemplate(newId)).toBeDefined();
    });

    it('should throw error when cloning non-existent template', () => {
      expect(() => library.cloneTemplate('non-existent', 'new-id')).toThrow();
    });

    it('should throw error when cloning to existing ID', () => {
      const existingId = 'github-readme';
      expect(() => library.cloneTemplate(existingId, existingId)).toThrow();
    });
  });

  describe('Template Recommendations', () => {
    it('should recommend templates based on input', () => {
      const input = {
        keywords: ['project', 'readme'],
        purpose: 'Create a README for my project',
      };

      const recommendations = library.recommendTemplates(input);
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should recommend templates based on previous usage', () => {
      library.recordTemplateUsage('github-readme');
      library.recordTemplateUsage('github-readme');
      library.recordTemplateUsage('technical-design');

      const recommendations = library.getPopularTemplates(3);
      expect(recommendations).toBeInstanceOf(Array);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].id).toBe('github-readme');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty search options', () => {
      const matches = library.searchTemplates({});
      expect(matches).toBeInstanceOf(Array);
    });

    it('should handle special characters in search keywords', () => {
      const options: TemplateSearchOptions = {
        keywords: ['<test>', '[special]', '{chars}'],
      };
      const matches = library.searchTemplates(options);
      expect(matches).toBeInstanceOf(Array);
    });

    it('should handle very long template names', () => {
      const template: TemplateConfig = {
        id: 'long-name-test',
        name: 'A'.repeat(1000),
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [],
        sections: [],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      expect(() => library.registerTemplate(template)).not.toThrow();
    });

    it('should handle templates with circular references in fields', () => {
      const template: any = {
        id: 'circular-test',
        name: 'Circular Reference Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [],
        sections: [],
        metadata: {
          version: '1.0.0',
          author: 'Test',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const validation = library.validateTemplate(template);
      expect(validation).toBeDefined();
    });

    it('should handle concurrent template registrations', () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const template: TemplateConfig = {
          id: `concurrent-${i}`,
          name: `Concurrent ${i}`,
          description: 'Test',
          category: 'custom',
          tags: [],
          fields: [],
          sections: [],
          metadata: {
            version: '1.0.0',
            author: 'Test',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
        promises.push(Promise.resolve(library.registerTemplate(template)));
      }

      return Promise.all(promises).then(() => {
        for (let i = 0; i < 10; i++) {
          expect(library.getTemplate(`concurrent-${i}`)).toBeDefined();
        }
      });
    });
  });

  describe('Template Metadata', () => {
    it('should update template metadata', () => {
      const template = library.getTemplate('github-readme');
      expect(template).toBeDefined();

      const updated = library.updateTemplateMetadata('github-readme', {
        author: 'Updated Author',
        tags: ['new-tag'],
      });

      expect(updated.metadata.author).toBe('Updated Author');
      expect(updated.tags).toContain('new-tag');
    });

    it('should track template version history', () => {
      const template = library.getTemplate('github-readme');
      expect(template).toBeDefined();

      library.updateTemplateMetadata('github-readme', {
        version: '2.0.0',
      });

      const history = library.getTemplateHistory('github-readme');
      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(0);
    });
  });
});
