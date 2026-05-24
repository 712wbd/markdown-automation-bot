import { TemplateConfig, TemplateSection, TemplateField, UserInput } from '@/types';
import { Logger } from '@/utils/logger';

export interface RenderContext {
  data: Record<string, any>;
  functions?: Record<string, Function>;
  helpers?: Record<string, any>;
}

export interface RenderOptions {
  strict?: boolean;
  preserveWhitespace?: boolean;
  customDelimiters?: {
    variable: [string, string];
    block: [string, string];
  };
}

export class TemplateEngine {
  private logger: Logger;
  private variableDelimiters: [string, string];
  private blockDelimiters: [string, string];

  constructor(options?: RenderOptions) {
    this.logger = new Logger('TemplateEngine');
    this.variableDelimiters = options?.customDelimiters?.variable || ['{{', '}}'];
    this.blockDelimiters = options?.customDelimiters?.block || ['{%', '%}'];
  }

  public render(template: string, context: RenderContext, options?: RenderOptions): string {
    try {
      let result = template;

      result = this.processConditionals(result, context);
      result = this.processLoops(result, context);
      result = this.processVariables(result, context);
      result = this.processHelpers(result, context);

      if (!options?.preserveWhitespace) {
        result = this.normalizeWhitespace(result);
      }

      return result;
    } catch (error) {
      this.logger.error('Template rendering failed:', error);
      throw new Error(`Template rendering error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public renderTemplate(templateConfig: TemplateConfig, userInput: UserInput): string {
    const context: RenderContext = {
      data: {
        ...userInput.fields,
        title: userInput.title,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        year: new Date().getFullYear(),
      },
      helpers: this.getDefaultHelpers(),
    };

    let output = '';

    for (const section of templateConfig.sections) {
      const sectionContent = this.renderSection(section, context);
      if (sectionContent.trim()) {
        output += sectionContent + '\n\n';
      }
    }

    return output.trim();
  }

  private renderSection(section: TemplateSection, context: RenderContext): string {
    if (section.condition && !this.evaluateCondition(section.condition, context)) {
      return '';
    }

    let content = section.content;

    if (section.repeat && section.repeat.items) {
      const items = this.resolveVariable(section.repeat.items, context);
      if (Array.isArray(items)) {
        content = items
          .map((item, index) => {
            const loopContext: RenderContext = {
              ...context,
              data: {
                ...context.data,
                [section.repeat!.as || 'item']: item,
                index,
                first: index === 0,
                last: index === items.length - 1,
              },
            };
            return this.render(content, loopContext);
          })
          .join('\n');
      }
    } else {
      content = this.render(content, context);
    }

    return content;
  }

  private processVariables(template: string, context: RenderContext): string {
    const [open, close] = this.variableDelimiters;
    const regex = new RegExp(`${this.escapeRegex(open)}\\s*([^${close}]+?)\\s*${this.escapeRegex(close)}`, 'g');

    return template.replace(regex, (match, expression) => {
      try {
        const value = this.evaluateExpression(expression.trim(), context);
        return value !== undefined && value !== null ? String(value) : '';
      } catch (error) {
        this.logger.warn(`Failed to resolve variable: ${expression}`);
        return match;
      }
    });
  }

  private processConditionals(template: string, context: RenderContext): string {
    const [open, close] = this.blockDelimiters;
    const ifRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*if\\s+([^${close}]+?)\\s*${this.escapeRegex(close)}([\\s\\S]*?)${this.escapeRegex(open)}\\s*endif\\s*${this.escapeRegex(close)}`,
      'g'
    );

    return template.replace(ifRegex, (match, condition, content) => {
      try {
        const elseMatch = content.match(
          new RegExp(`${this.escapeRegex(open)}\\s*else\\s*${this.escapeRegex(close)}`)
        );

        if (elseMatch) {
          const [ifContent, elseContent] = content.split(elseMatch[0]);
          return this.evaluateCondition(condition.trim(), context)
            ? this.render(ifContent, context)
            : this.render(elseContent, context);
        }

        return this.evaluateCondition(condition.trim(), context)
          ? this.render(content, context)
          : '';
      } catch (error) {
        this.logger.warn(`Failed to evaluate condition: ${condition}`);
        return '';
      }
    });
  }

  private processLoops(template: string, context: RenderContext): string {
    const [open, close] = this.blockDelimiters;
    const forRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*for\\s+(\\w+)\\s+in\\s+([^${close}]+?)\\s*${this.escapeRegex(close)}([\\s\\S]*?)${this.escapeRegex(open)}\\s*endfor\\s*${this.escapeRegex(close)}`,
      'g'
    );

    return template.replace(forRegex, (match, itemName, itemsExpr, loopContent) => {
      try {
        const items = this.evaluateExpression(itemsExpr.trim(), context);

        if (!Array.isArray(items)) {
          this.logger.warn(`Loop expression did not return an array: ${itemsExpr}`);
          return '';
        }

        return items
          .map((item, index) => {
            const loopContext: RenderContext = {
              ...context,
              data: {
                ...context.data,
                [itemName]: item,
                loop: {
                  index,
                  index0: index,
                  index1: index + 1,
                  first: index === 0,
                  last: index === items.length - 1,
                  length: items.length,
                },
              },
            };
            return this.render(loopContent, loopContext);
          })
          .join('\n');
      } catch (error) {
        this.logger.warn(`Failed to process loop: ${itemsExpr}`);
        return '';
      }
    });
  }

  private processHelpers(template: string, context: RenderContext): string {
    const [open, close] = this.variableDelimiters;
    const helperRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*(\\w+)\\s*\\(([^)]*)\\)\\s*${this.escapeRegex(close)}`,
      'g'
    );

    return template.replace(helperRegex, (match, helperName, argsStr) => {
      try {
        const helper = context.helpers?.[helperName];
        if (typeof helper !== 'function') {
          return match;
        }

        const args = argsStr
          .split(',')
          .map((arg: string) => this.evaluateExpression(arg.trim(), context))
          .filter((arg: any) => arg !== undefined);

        const result = helper(...args);
        return result !== undefined && result !== null ? String(result) : '';
      } catch (error) {
        this.logger.warn(`Failed to execute helper: ${helperName}`);
        return match;
      }
    });
  }

  private evaluateExpression(expression: string, context: RenderContext): any {
    if (!expression) return undefined;

    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1);
    }
    if (expression.startsWith("'") && expression.endsWith("'")) {
      return expression.slice(1, -1);
    }

    if (/^\d+$/.test(expression)) {
      return parseInt(expression, 10);
    }
    if (/^\d+\.\d+$/.test(expression)) {
      return parseFloat(expression);
    }

    if (expression === 'true') return true;
    if (expression === 'false') return false;
    if (expression === 'null') return null;
    if (expression === 'undefined') return undefined;

    return this.resolveVariable(expression, context);
  }

  private evaluateCondition(condition: string, context: RenderContext): boolean {
    try {
      const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];
      
      for (const op of operators) {
        if (condition.includes(op)) {
          const [left, right] = condition.split(op).map(s => s.trim());
          const leftValue = this.evaluateExpression(left, context);
          const rightValue = this.evaluateExpression(right, context);

          switch (op) {
            case '===': return leftValue === rightValue;
            case '!==': return leftValue !== rightValue;
            case '==': return leftValue == rightValue;
            case '!=': return leftValue != rightValue;
            case '>=': return leftValue >= rightValue;
            case '<=': return leftValue <= rightValue;
            case '>': return leftValue > rightValue;
            case '<': return leftValue < rightValue;
          }
        }
      }

      const value = this.resolveVariable(condition, context);
      return Boolean(value);
    } catch (error) {
      return false;
    }
  }

  private resolveVariable(path: string, context: RenderContext): any {
    const parts = path.split('.');
    let current: any = context.data;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  private normalizeWhitespace(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+$/gm, '')
      .trim();
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getDefaultHelpers(): Record<string, Function> {
    return {
      uppercase: (str: string) => String(str).toUpperCase(),
      lowercase: (str: string) => String(str).toLowerCase(),
      capitalize: (str: string) => {
        const s = String(str);
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      },
      titlecase: (str: string) => {
        return String(str)
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      },
      trim: (str: string) => String(str).trim(),
      default: (value: any, defaultValue: any) => {
        return value !== undefined && value !== null && value !== '' ? value : defaultValue;
      },
      join: (arr: any[], separator: string = ', ') => {
        return Array.isArray(arr) ? arr.join(separator) : String(arr);
      },
      length: (value: any) => {
        if (Array.isArray(value) || typeof value === 'string') {
          return value.length;
        }
        return 0;
      },
      date: (format?: string) => {
        const now = new Date();
        if (format === 'iso') return now.toISOString();
        if (format === 'short') return now.toISOString().split('T')[0];
        return now.toLocaleDateString();
      },
      truncate: (str: string, length: number = 50, suffix: string = '...') => {
        const s = String(str);
        return s.length > length ? s.substring(0, length) + suffix : s;
      },
      replace: (str: string, search: string, replace: string) => {
        return String(str).replace(new RegExp(search, 'g'), replace);
      },
      repeat: (str: string, count: number) => {
        return String(str).repeat(Math.max(0, count));
      },
      json: (obj: any, spaces: number = 2) => {
        return JSON.stringify(obj, null, spaces);
      },
      escape: (str: string) => {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      },
    };
  }

  public validateTemplate(template: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const [varOpen, varClose] = this.variableDelimiters;
    const [blockOpen, blockClose] = this.blockDelimiters;

    const varCount = (template.match(new RegExp(this.escapeRegex(varOpen), 'g')) || []).length;
    const varCloseCount = (template.match(new RegExp(this.escapeRegex(varClose), 'g')) || []).length;
    if (varCount !== varCloseCount) {
      errors.push(`Mismatched variable delimiters: ${varCount} opening, ${varCloseCount} closing`);
    }

    const ifMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*if\\s`, 'g')) || [];
    const endifMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*endif\\s*${this.escapeRegex(blockClose)}`, 'g')) || [];
    if (ifMatches.length !== endifMatches.length) {
      errors.push(`Mismatched if/endif blocks: ${ifMatches.length} if, ${endifMatches.length} endif`);
    }

    const forMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*for\\s`, 'g')) || [];
    const endforMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*endfor\\s*${this.escapeRegex(blockClose)}`, 'g')) || [];
    if (forMatches.length !== endforMatches.length) {
      errors.push(`Mismatched for/endfor blocks: ${forMatches.length} for, ${endforMatches.length} endfor`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
