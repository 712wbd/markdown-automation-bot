import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateEngine } from '@/core/TemplateEngine';
import type { RenderContext } from '@/core/TemplateEngine';

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
  });

  describe('Variable Substitution', () => {
    it('should replace simple variables', () => {
      const template = 'Hello {{name}}!';
      const context: RenderContext = {
        data: { name: 'World' },
      };
      const result = engine.render(template, context);
      expect(result).toBe('Hello World!');
    });

    it('should replace nested variables', () => {
      const template = '{{user.name}} is {{user.age}} years old';
      const context: RenderContext = {
        data: {
          user: { name: 'John', age: 30 },
        },
      };
      const result = engine.render(template, context);
      expect(result).toBe('John is 30 years old');
    });

    it('should handle missing variables gracefully', () => {
      const template = 'Hello {{missing}}!';
      const context: RenderContext = {
        data: {},
      };
      const result = engine.render(template, context);
      expect(result).toBe('Hello !');
    });

    it('should handle undefined nested variables', () => {
      const template = '{{user.missing.property}}';
      const context: RenderContext = {
        data: { user: {} },
      };
      const result = engine.render(template, context);
      expect(result).toBe('');
    });
  });

  describe('Conditionals', () => {
    it('should render if block when condition is true', () => {
      const template = '{% if show %}Visible{% endif %}';
      const context: RenderContext = {
        data: { show: true },
      };
      const result = engine.render(template, context);
      expect(result).toBe('Visible');
    });

    it('should not render if block when condition is false', () => {
      const template = '{% if show %}Visible{% endif %}';
      const context: RenderContext = {
        data: { show: false },
      };
      const result = engine.render(template, context);
      expect(result).toBe('');
    });

    it('should handle if-else blocks', () => {
      const template = '{% if admin %}Admin{% else %}User{% endif %}';
      const contextAdmin: RenderContext = {
        data: { admin: true },
      };
      const contextUser: RenderContext = {
        data: { admin: false },
      };
      expect(engine.render(template, contextAdmin)).toBe('Admin');
      expect(engine.render(template, contextUser)).toBe('User');
    });

    it('should handle comparison operators', () => {
      const template = '{% if count > 5 %}Many{% else %}Few{% endif %}';
      const contextMany: RenderContext = {
        data: { count: 10 },
      };
      const contextFew: RenderContext = {
        data: { count: 3 },
      };
      expect(engine.render(template, contextMany)).toBe('Many');
      expect(engine.render(template, contextFew)).toBe('Few');
    });
  });

  describe('Loops', () => {
    it('should iterate over arrays', () => {
      const template = '{% for item in items %}{{item}} {% endfor %}';
      const context: RenderContext = {
        data: { items: ['a', 'b', 'c'] },
      };
      const result = engine.render(template, context);
      expect(result.trim()).toBe('a  b  c');
    });

    it('should handle empty arrays', () => {
      const template = '{% for item in items %}{{item}}{% endfor %}';
      const context: RenderContext = {
        data: { items: [] },
      };
      const result = engine.render(template, context);
      expect(result).toBe('');
    });

    it('should provide loop variables', () => {
      const template = '{% for item in items %}{{loop.index}}: {{item}} {% endfor %}';
      const context: RenderContext = {
        data: { items: ['a', 'b'] },
      };
      const result = engine.render(template, context);
      expect(result).toContain('0: a');
      expect(result).toContain('1: b');
    });

    it('should handle nested loops', () => {
      const template = '{% for outer in outers %}{% for inner in outer.inners %}{{inner}} {% endfor %}{% endfor %}';
      const context: RenderContext = {
        data: {
          outers: [
            { inners: ['a', 'b'] },
            { inners: ['c', 'd'] },
          ],
        },
      };
      const result = engine.render(template, context);
      expect(result).toContain('a');
      expect(result).toContain('d');
    });
  });

  describe('Helpers', () => {
    it('should apply uppercase helper', () => {
      const template = '{{uppercase(name)}}';
      const context: RenderContext = {
        data: { name: 'hello' },
      };
      const result = engine.render(template, context);
      expect(result).toBe('HELLO');
    });

    it('should apply lowercase helper', () => {
      const template = '{{lowercase(name)}}';
      const context: RenderContext = {
        data: { name: 'HELLO' },
      };
      const result = engine.render(template, context);
      expect(result).toBe('hello');
    });

    it('should apply join helper', () => {
      const template = '{{join(items, ", ")}}';
      const context: RenderContext = {
        data: { items: ['a', 'b', 'c'] },
      };
      const result = engine.render(template, context);
      expect(result).toBe('a, b, c');
    });

    it('should apply default helper', () => {
      const template = '{{default(missing, "fallback")}}';
      const context: RenderContext = {
        data: { missing: '' },
      };
      const result = engine.render(template, context);
      expect(result).toBe('fallback');
    });

    it('should apply truncate helper', () => {
      const template = '{{truncate(text, 10)}}';
      const context: RenderContext = {
        data: { text: 'This is a very long text' },
      };
      const result = engine.render(template, context);
      expect(result).toBe('This is a ...');
    });
  });

  describe('Template Validation', () => {
    it('should validate correct templates', () => {
      const template = 'Hello {{name}}! {% if show %}Visible{% endif %}';
      const result = engine.validateTemplate(template);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect mismatched variable delimiters', () => {
      const template = 'Hello {{name}';
      const result = engine.validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect unclosed if blocks', () => {
      const template = '{% if show %}Visible';
      const result = engine.validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('if'));
    });

    it('should detect unclosed for blocks', () => {
      const template = '{% for item in items %}{{item}}';
      const result = engine.validateTemplate(template);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('for'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty templates', () => {
      const template = '';
      const context: RenderContext = { data: {} };
      const result = engine.render(template, context);
      expect(result).toBe('');
    });

    it('should handle templates with only whitespace', () => {
      const template = '   \n  \t  ';
      const context: RenderContext = { data: {} };
      const result = engine.render(template, context);
      expect(result.trim()).toBe('');
    });

    it('should handle special characters in variable values', () => {
      const template = '{{text}}';
      const context: RenderContext = {
        data: { text: '<script>alert("XSS")</script>' },
      };
      const result = engine.render(template, context);
      expect(result).toContain('<script>');
    });

    it('should handle numeric zero correctly', () => {
      const template = '{% if count === 0 %}Zero{% else %}Not zero{% endif %}';
      const context: RenderContext = {
        data: { count: 0 },
      };
      const result = engine.render(template, context);
      expect(result).toBe('Zero');
    });
  });
});
