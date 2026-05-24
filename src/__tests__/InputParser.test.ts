import { describe, it, expect, beforeEach } from 'vitest';
import { InputParser } from '@/core/InputParser';
import { TemplateLibrary } from '@/core/TemplateLibrary';
import { TemplateConfig } from '@/types';

describe('InputParser', () => {
  let parser: InputParser;
  let library: TemplateLibrary;

  beforeEach(() => {
    library = new TemplateLibrary();
    parser = new InputParser(library);
  });

  describe('Template Identification', () => {
    it('should identify template by explicit ID', () => {
      const input = {
        templateId: 'github-readme',
        title: 'My Project',
        fields: {},
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.template).toBeDefined();
      expect(parsed.template?.id).toBe('github-readme');
    });

    it('should identify template by category', () => {
      const input = {
        category: 'github' as const,
        title: 'My Project',
        fields: {},
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.template).toBeDefined();
      expect(parsed.template?.category).toBe('github');
    });

    it('should identify template from keywords', () => {
      const input = {
        title: 'Create a GitHub README',
        fields: {},
        keywords: ['readme', 'project'],
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.template).toBeDefined();
    });

    it('should throw error when template cannot be identified', () => {
      const input = {
        title: 'Untitled',
        fields: {},
      };

      expect(() => parser.parseAndValidate(input)).toThrow();
    });

    it('should throw error for non-existent template ID', () => {
      const input = {
        templateId: 'non-existent-template',
        title: 'Test',
        fields: {},
      };

      expect(() => parser.parseAndValidate(input)).toThrow();
    });
  });

  describe('Field Validation', () => {
    it('should validate required text fields', () => {
      const input = {
        templateId: 'github-readme',
        title: 'My Project',
        fields: {
          projectName: 'My Awesome Project',
          description: 'A great project',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.valid).toBe(true);
      expect(parsed.errors.length).toBe(0);
    });

    it('should detect missing required fields', () => {
      const input = {
        templateId: 'github-readme',
        title: 'My Project',
        fields: {},
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.valid).toBe(false);
      expect(parsed.missingFields.length).toBeGreaterThan(0);
    });

    it('should validate email fields', () => {
      const template: TemplateConfig = {
        id: 'email-test',
        name: 'Email Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            description: 'User email',
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'email-test',
        title: 'Test',
        fields: {
          email: 'test@example.com',
        },
      };

      const invalidInput = {
        templateId: 'email-test',
        title: 'Test',
        fields: {
          email: 'invalid-email',
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const invalidResult = parser.parseAndValidate(invalidInput);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.some(e => e.includes('email'))).toBe(true);
    });

    it('should validate URL fields', () => {
      const template: TemplateConfig = {
        id: 'url-test',
        name: 'URL Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'website',
            label: 'Website',
            type: 'url',
            required: true,
            description: 'Website URL',
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'url-test',
        title: 'Test',
        fields: {
          website: 'https://example.com',
        },
      };

      const invalidInput = {
        templateId: 'url-test',
        title: 'Test',
        fields: {
          website: 'not-a-url',
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const invalidResult = parser.parseAndValidate(invalidInput);
      expect(invalidResult.valid).toBe(false);
    });

    it('should validate number fields', () => {
      const template: TemplateConfig = {
        id: 'number-test',
        name: 'Number Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'age',
            label: 'Age',
            type: 'number',
            required: true,
            description: 'User age',
            validation: {
              min: 0,
              max: 150,
            },
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'number-test',
        title: 'Test',
        fields: {
          age: 25,
        },
      };

      const tooLowInput = {
        templateId: 'number-test',
        title: 'Test',
        fields: {
          age: -5,
        },
      };

      const tooHighInput = {
        templateId: 'number-test',
        title: 'Test',
        fields: {
          age: 200,
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const tooLowResult = parser.parseAndValidate(tooLowInput);
      expect(tooLowResult.valid).toBe(false);

      const tooHighResult = parser.parseAndValidate(tooHighInput);
      expect(tooHighResult.valid).toBe(false);
    });

    it('should validate date fields', () => {
      const template: TemplateConfig = {
        id: 'date-test',
        name: 'Date Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'eventDate',
            label: 'Event Date',
            type: 'date',
            required: true,
            description: 'Event date',
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'date-test',
        title: 'Test',
        fields: {
          eventDate: '2024-12-31',
        },
      };

      const invalidInput = {
        templateId: 'date-test',
        title: 'Test',
        fields: {
          eventDate: 'not-a-date',
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const invalidResult = parser.parseAndValidate(invalidInput);
      expect(invalidResult.valid).toBe(false);
    });

    it('should validate select fields', () => {
      const template: TemplateConfig = {
        id: 'select-test',
        name: 'Select Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            required: true,
            description: 'Task priority',
            options: ['low', 'medium', 'high'],
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'select-test',
        title: 'Test',
        fields: {
          priority: 'high',
        },
      };

      const invalidInput = {
        templateId: 'select-test',
        title: 'Test',
        fields: {
          priority: 'invalid-option',
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const invalidResult = parser.parseAndValidate(invalidInput);
      expect(invalidResult.valid).toBe(false);
    });

    it('should validate array fields', () => {
      const template: TemplateConfig = {
        id: 'array-test',
        name: 'Array Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'tags',
            label: 'Tags',
            type: 'array',
            required: true,
            description: 'Document tags',
            validation: {
              minItems: 1,
              maxItems: 5,
            },
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'array-test',
        title: 'Test',
        fields: {
          tags: ['tag1', 'tag2', 'tag3'],
        },
      };

      const tooFewInput = {
        templateId: 'array-test',
        title: 'Test',
        fields: {
          tags: [],
        },
      };

      const tooManyInput = {
        templateId: 'array-test',
        title: 'Test',
        fields: {
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const tooFewResult = parser.parseAndValidate(tooFewInput);
      expect(tooFewResult.valid).toBe(false);

      const tooManyResult = parser.parseAndValidate(tooManyInput);
      expect(tooManyResult.valid).toBe(false);
    });

    it('should validate object fields', () => {
      const template: TemplateConfig = {
        id: 'object-test',
        name: 'Object Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'author',
            label: 'Author',
            type: 'object',
            required: true,
            description: 'Author information',
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

      library.registerTemplate(template);

      const validInput = {
        templateId: 'object-test',
        title: 'Test',
        fields: {
          author: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      };

      const invalidInput = {
        templateId: 'object-test',
        title: 'Test',
        fields: {
          author: 'not-an-object',
        },
      };

      const validResult = parser.parseAndValidate(validInput);
      expect(validResult.valid).toBe(true);

      const invalidResult = parser.parseAndValidate(invalidInput);
      expect(invalidResult.valid).toBe(false);
    });
  });

  describe('Field Transformation', () => {
    it('should trim text fields', () => {
      const input = {
        templateId: 'github-readme',
        title: '  My Project  ',
        fields: {
          projectName: '  Project Name  ',
          description: '  Description  ',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.projectName).toBe('Project Name');
      expect(parsed.fields.description).toBe('Description');
    });

    it('should convert string numbers to numbers', () => {
      const template: TemplateConfig = {
        id: 'number-convert-test',
        name: 'Number Convert Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'count',
            label: 'Count',
            type: 'number',
            required: true,
            description: 'Item count',
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

      library.registerTemplate(template);

      const input = {
        templateId: 'number-convert-test',
        title: 'Test',
        fields: {
          count: '42',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.count).toBe(42);
      expect(typeof parsed.fields.count).toBe('number');
    });

    it('should normalize URLs', () => {
      const template: TemplateConfig = {
        id: 'url-normalize-test',
        name: 'URL Normalize Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'website',
            label: 'Website',
            type: 'url',
            required: true,
            description: 'Website URL',
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

      library.registerTemplate(template);

      const input = {
        templateId: 'url-normalize-test',
        title: 'Test',
        fields: {
          website: 'example.com',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.website).toMatch(/^https?:\/\//);
    });

    it('should parse and format dates', () => {
      const template: TemplateConfig = {
        id: 'date-format-test',
        name: 'Date Format Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'eventDate',
            label: 'Event Date',
            type: 'date',
            required: true,
            description: 'Event date',
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

      library.registerTemplate(template);

      const input = {
        templateId: 'date-format-test',
        title: 'Test',
        fields: {
          eventDate: '2024/12/31',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.eventDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Missing Fields Detection', () => {
    it('should detect all missing required fields', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {},
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.missingFields.length).toBeGreaterThan(0);
      
      const template = library.getTemplate('github-readme');
      const requiredFields = template?.fields.filter(f => f.required) || [];
      expect(parsed.missingFields.length).toBe(requiredFields.length);
    });

    it('should provide suggestions for missing fields', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {},
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.suggestions).toBeDefined();
      expect(parsed.suggestions.length).toBeGreaterThan(0);
    });

    it('should not report missing fields for optional fields', () => {
      const template: TemplateConfig = {
        id: 'optional-test',
        name: 'Optional Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'required',
            label: 'Required',
            type: 'text',
            required: true,
            description: 'Required field',
          },
          {
            name: 'optional',
            label: 'Optional',
            type: 'text',
            required: false,
            description: 'Optional field',
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

      library.registerTemplate(template);

      const input = {
        templateId: 'optional-test',
        title: 'Test',
        fields: {
          required: 'Value',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.missingFields.every(f => f !== 'optional')).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty input', () => {
      expect(() => parser.parseAndValidate({} as any)).toThrow();
    });

    it('should handle null and undefined values', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projectName: null,
          description: undefined,
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.valid).toBe(false);
    });

    it('should handle special characters in field values', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test <>&"\'',
        fields: {
          projectName: 'Project <>&"\'',
          description: 'Description with special chars',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.projectName).toContain('<');
    });

    it('should handle very long field values', () => {
      const longText = 'A'.repeat(10000);
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projectName: 'Project',
          description: longText,
        },
      };

      expect(() => parser.parseAndValidate(input)).not.toThrow();
    });

    it('should handle Unicode characters', () => {
      const input = {
        templateId: 'github-readme',
        title: '測試專案 🚀',
        fields: {
          projectName: '中文專案名稱',
          description: '這是一個測試專案 🎉',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.fields.projectName).toBe('中文專案名稱');
    });

    it('should handle circular references in object fields', () => {
      const template: TemplateConfig = {
        id: 'circular-test',
        name: 'Circular Test',
        description: 'Test',
        category: 'custom',
        tags: [],
        fields: [
          {
            name: 'data',
            label: 'Data',
            type: 'object',
            required: true,
            description: 'Data object',
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

      library.registerTemplate(template);

      const circularObj: any = { a: 1 };
      circularObj.self = circularObj;

      const input = {
        templateId: 'circular-test',
        title: 'Test',
        fields: {
          data: circularObj,
        },
      };

      expect(() => parser.parseAndValidate(input)).not.toThrow();
    });
  });

  describe('Auto-correction', () => {
    it('should auto-correct common typos in field names', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          projetName: 'My Project',
          descriptin: 'My description',
        },
      };

      const parsed = parser.parseAndValidate(input, { autoCorrect: true });
      expect(parsed.fields.projectName).toBeDefined();
      expect(parsed.fields.description).toBeDefined();
    });

    it('should provide field name suggestions', () => {
      const input = {
        templateId: 'github-readme',
        title: 'Test',
        fields: {
          wrongFieldName: 'Value',
        },
      };

      const parsed = parser.parseAndValidate(input);
      expect(parsed.suggestions).toBeDefined();
      expect(parsed.suggestions.length).toBeGreaterThan(0);
    });
  });
});
