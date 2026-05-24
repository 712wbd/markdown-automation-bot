import { TemplateEngine, RenderContext, RenderOptions } from './TemplateEngine';
import { Logger } from '@/utils/logger';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';

export interface AdvancedRenderContext extends RenderContext {
  filters?: Record<string, Function>;
  macros?: Record<string, MacroDefinition>;
  imports?: Record<string, string>;
}

export interface MacroDefinition {
  params: string[];
  body: string;
}

export interface FilterChain {
  name: string;
  args: any[];
}

export class AdvancedTemplateEngine extends TemplateEngine {
  private logger: Logger;
  private macros: Map<string, MacroDefinition> = new Map();
  private imports: Map<string, string> = new Map();
  private filters: Map<string, Function> = new Map();

  constructor(options?: RenderOptions) {
    super(options);
    this.logger = new Logger('AdvancedTemplateEngine');
    this.registerDefaultFilters();
  }

  public render(template: string, context: AdvancedRenderContext, options?: RenderOptions): string {
    let result = template;

    result = this.processImports(result, context);
    result = this.processMacros(result, context);
    result = this.processIncludes(result, context);
    result = this.processExtends(result, context);
    result = this.processElseIf(result, context);
    result = this.processUnless(result, context);
    result = this.processSwitch(result, context);
    result = this.processFilters(result, context);
    result = this.processNestedLoops(result, context);
    result = this.processConditionalLoops(result, context);

    result = super.render(result, context, options);

    return result;
  }

  private processImports(template: string, context: AdvancedRenderContext): string {
    const importRegex = /{%\s*import\s+['"]([^'"]+)['"]\s+as\s+(\w+)\s*%}/g;

    return template.replace(importRegex, (match, path, alias) => {
      try {
        if (context.imports && context.imports[path]) {
          this.imports.set(alias, context.imports[path]);
          this.logger.debug(`Imported template '${path}' as '${alias}'`);
        }
        return '';
      } catch (error) {
        this.logger.warn(`Failed to import template: ${path}`);
        return '';
      }
    });
  }

  private processMacros(template: string, context: AdvancedRenderContext): string {
    const macroDefRegex = /{%\s*macro\s+(\w+)\s*\(([^)]*)\)\s*%}([\s\S]*?){%\s*endmacro\s*%}/g;

    let result = template.replace(macroDefRegex, (match, name, params, body) => {
      const paramList = params
        .split(',')
        .map((p: string) => p.trim())
        .filter((p: string) => p);
      this.macros.set(name, { params: paramList, body });
      this.logger.debug(`Defined macro '${name}' with params: ${paramList.join(', ')}`);
      return '';
    });

    const macroCallRegex = /{%\s*call\s+(\w+)\s*\(([^)]*)\)\s*%}/g;
    result = result.replace(macroCallRegex, (match, name, args) => {
      try {
        const macro = this.macros.get(name) || context.macros?.[name];
        if (!macro) {
          this.logger.warn(`Macro '${name}' not found`);
          return match;
        }

        const argValues = args
          .split(',')
          .map((arg: string) => arg.trim())
          .filter((arg: string) => arg);

        const macroContext: AdvancedRenderContext = {
          ...context,
          data: {
            ...context.data,
          },
        };

        macro.params.forEach((param, index) => {
          macroContext.data[param] = this.evaluateExpression(argValues[index] || '', context);
        });

        return this.render(macro.body, macroContext);
      } catch (error) {
        this.logger.warn(`Failed to execute macro: ${name}`);
        return match;
      }
    });

    return result;
  }

  private processIncludes(template: string, context: AdvancedRenderContext): string {
    const includeRegex = /{%\s*include\s+['"]([^'"]+)['"]\s*%}/g;

    return template.replace(includeRegex, (match, alias) => {
      try {
        const includedTemplate = this.imports.get(alias);
        if (!includedTemplate) {
          this.logger.warn(`Include template '${alias}' not found`);
          return match;
        }
        return this.render(includedTemplate, context);
      } catch (error) {
        this.logger.warn(`Failed to include template: ${alias}`);
        return match;
      }
    });
  }

  private processExtends(template: string, context: AdvancedRenderContext): string {
    const extendsRegex = /{%\s*extends\s+['"]([^'"]+)['"]\s*%}/g;
    const blockDefRegex = /{%\s*block\s+(\w+)\s*%}([\s\S]*?){%\s*endblock\s*%}/g;

    const extendsMatch = template.match(extendsRegex);
    if (!extendsMatch) return template;

    const baseTemplateName = extendsMatch[0].match(/['"]([^'"]+)['"]/)?.[1];
    if (!baseTemplateName) return template;

    const baseTemplate = this.imports.get(baseTemplateName);
    if (!baseTemplate) {
      this.logger.warn(`Base template '${baseTemplateName}' not found`);
      return template;
    }

    const blocks: Record<string, string> = {};
    let match;
    while ((match = blockDefRegex.exec(template)) !== null) {
      blocks[match[1]] = match[2];
    }

    let result = baseTemplate.replace(blockDefRegex, (match, blockName, defaultContent) => {
      return blocks[blockName] || defaultContent;
    });

    return result;
  }

  private processElseIf(template: string, context: AdvancedRenderContext): string {
    const ifRegex = /{%\s*if\s+([^%]+?)\s*%}([\s\S]*?){%\s*endif\s*%}/g;

    return template.replace(ifRegex, (match, condition, content) => {
      try {
        const parts = content.split(/{%\s*elif\s+([^%]+?)\s*%}/g);
        const conditions: Array<{ condition: string; content: string }> = [];

        conditions.push({ condition, content: parts[0] });

        for (let i = 1; i < parts.length; i += 2) {
          if (i + 1 < parts.length) {
            conditions.push({ condition: parts[i], content: parts[i + 1] });
          }
        }

        const elseMatch = content.match(/{%\s*else\s*%}/);
        let elseContent = '';
        if (elseMatch) {
          const lastConditionIndex = conditions.length - 1;
          const splitContent = conditions[lastConditionIndex].content.split(/{%\s*else\s*%}/);
          conditions[lastConditionIndex].content = splitContent[0];
          elseContent = splitContent[1] || '';
        }

        for (const { condition: cond, content: cont } of conditions) {
          if (this.evaluateCondition(cond.trim(), context)) {
            return this.render(cont, context);
          }
        }

        return elseContent ? this.render(elseContent, context) : '';
      } catch (error) {
        this.logger.warn(`Failed to process if/elif/else: ${condition}`);
        return '';
      }
    });
  }

  private processUnless(template: string, context: AdvancedRenderContext): string {
    const unlessRegex = /{%\s*unless\s+([^%]+?)\s*%}([\s\S]*?){%\s*endunless\s*%}/g;

    return template.replace(unlessRegex, (match, condition, content) => {
      try {
        const elseMatch = content.match(/{%\s*else\s*%}/);
        if (elseMatch) {
          const [unlessContent, elseContent] = content.split(elseMatch[0]);
          return !this.evaluateCondition(condition.trim(), context)
            ? this.render(unlessContent, context)
            : this.render(elseContent, context);
        }

        return !this.evaluateCondition(condition.trim(), context)
          ? this.render(content, context)
          : '';
      } catch (error) {
        this.logger.warn(`Failed to process unless: ${condition}`);
        return '';
      }
    });
  }

  private processSwitch(template: string, context: AdvancedRenderContext): string {
    const switchRegex = /{%\s*switch\s+([^%]+?)\s*%}([\s\S]*?){%\s*endswitch\s*%}/g;

    return template.replace(switchRegex, (match, expression, content) => {
      try {
        const value = this.evaluateExpression(expression.trim(), context);
        const caseRegex = /{%\s*case\s+([^%]+?)\s*%}([\s\S]*?)(?={%\s*(?:case|default|endswitch))/g;
        const defaultRegex = /{%\s*default\s*%}([\s\S]*?)(?={%\s*endswitch)/;

        let caseMatch;
        while ((caseMatch = caseRegex.exec(content)) !== null) {
          const caseValue = this.evaluateExpression(caseMatch[1].trim(), context);
          if (value === caseValue) {
            return this.render(caseMatch[2], context);
          }
        }

        const defaultMatch = content.match(defaultRegex);
        if (defaultMatch) {
          return this.render(defaultMatch[1], context);
        }

        return '';
      } catch (error) {
        this.logger.warn(`Failed to process switch: ${expression}`);
        return '';
      }
    });
  }

  private processFilters(template: string, context: AdvancedRenderContext): string {
    const filterRegex = /{{\s*([^}|]+?)\s*(\|[^}]+?)?\s*}}/g;

    return template.replace(filterRegex, (match, expression, filterChain) => {
      try {
        let value = this.evaluateExpression(expression.trim(), context);

        if (filterChain) {
          const filters = filterChain
            .split('|')
            .slice(1)
            .map((f: string) => f.trim());

          for (const filterExpr of filters) {
            const filterMatch = filterExpr.match(/^(\w+)(?:\(([^)]*)\))?$/);
            if (!filterMatch) continue;

            const [, filterName, argsStr] = filterMatch;
            const filter = this.filters.get(filterName) || context.filters?.[filterName];

            if (typeof filter === 'function') {
              const args = argsStr
                ? argsStr.split(',').map((arg: string) => this.evaluateExpression(arg.trim(), context))
                : [];
              value = filter(value, ...args);
            }
          }
        }

        return value !== undefined && value !== null ? String(value) : '';
      } catch (error) {
        this.logger.warn(`Failed to apply filters: ${match}`);
        return match;
      }
    });
  }

  private processNestedLoops(template: string, context: AdvancedRenderContext): string {
    const forRegex = /{%\s*for\s+(\w+)(?:\s*,\s*(\w+))?\s+in\s+([^%]+?)\s*%}([\s\S]*?){%\s*endfor\s*%}/g;

    return template.replace(forRegex, (match, key, value, itemsExpr, loopContent) => {
      try {
        const items = this.evaluateExpression(itemsExpr.trim(), context);

        if (!items) {
          this.logger.warn(`Loop expression returned null/undefined: ${itemsExpr}`);
          return '';
        }

        if (Array.isArray(items)) {
          return items
            .map((item, index) => {
              const loopContext: AdvancedRenderContext = {
                ...context,
                data: {
                  ...context.data,
                  [key]: value ? index : item,
                  ...(value ? { [value]: item } : {}),
                  loop: {
                    index,
                    index0: index,
                    index1: index + 1,
                    first: index === 0,
                    last: index === items.length - 1,
                    length: items.length,
                    revindex: items.length - index,
                    revindex0: items.length - index - 1,
                    revindex1: items.length - index,
                    cycle: (...args: any[]) => args[index % args.length],
                  },
                },
              };
              return this.render(loopContent, loopContext);
            })
            .join('');
        } else if (typeof items === 'object') {
          return Object.entries(items)
            .map(([k, v], index, arr) => {
              const loopContext: AdvancedRenderContext = {
                ...context,
                data: {
                  ...context.data,
                  [key]: value ? k : v,
                  ...(value ? { [value]: v } : {}),
                  loop: {
                    index,
                    index0: index,
                    index1: index + 1,
                    first: index === 0,
                    last: index === arr.length - 1,
                    length: arr.length,
                    key: k,
                  },
                },
              };
              return this.render(loopContent, loopContext);
            })
            .join('');
        }

        return '';
      } catch (error) {
        this.logger.warn(`Failed to process nested loop: ${itemsExpr}`);
        return '';
      }
    });
  }

  private processConditionalLoops(template: string, context: AdvancedRenderContext): string {
    const forIfRegex = /{%\s*for\s+(\w+)\s+in\s+([^%]+?)\s+if\s+([^%]+?)\s*%}([\s\S]*?){%\s*endfor\s*%}/g;

    return template.replace(forIfRegex, (match, itemName, itemsExpr, condition, loopContent) => {
      try {
        const items = this.evaluateExpression(itemsExpr.trim(), context);

        if (!Array.isArray(items)) {
          this.logger.warn(`Conditional loop expression did not return an array: ${itemsExpr}`);
          return '';
        }

        const filteredItems = items.filter((item, index) => {
          const loopContext: AdvancedRenderContext = {
            ...context,
            data: {
              ...context.data,
              [itemName]: item,
              loop: { index },
            },
          };
          return this.evaluateCondition(condition.trim(), loopContext);
        });

        return filteredItems
          .map((item, index) => {
            const loopContext: AdvancedRenderContext = {
              ...context,
              data: {
                ...context.data,
                [itemName]: item,
                loop: {
                  index,
                  first: index === 0,
                  last: index === filteredItems.length - 1,
                  length: filteredItems.length,
                },
              },
            };
            return this.render(loopContent, loopContext);
          })
          .join('');
      } catch (error) {
        this.logger.warn(`Failed to process conditional loop: ${itemsExpr}`);
        return '';
      }
    });
  }

  private registerDefaultFilters(): void {
    this.filters.set('abs', (value: number) => Math.abs(value));
    this.filters.set('ceil', (value: number) => Math.ceil(value));
    this.filters.set('floor', (value: number) => Math.floor(value));
    this.filters.set('round', (value: number, precision: number = 0) => {
      const multiplier = Math.pow(10, precision);
      return Math.round(value * multiplier) / multiplier;
    });

    this.filters.set('date', (value: string | Date, formatStr: string = 'yyyy-MM-dd') => {
      try {
        const date = typeof value === 'string' ? parseISO(value) : value;
        return format(date, formatStr);
      } catch {
        return String(value);
      }
    });

    this.filters.set('addDays', (value: string | Date, days: number) => {
      try {
        const date = typeof value === 'string' ? parseISO(value) : value;
        return format(addDays(date, days), 'yyyy-MM-dd');
      } catch {
        return String(value);
      }
    });

    this.filters.set('daysSince', (value: string | Date) => {
      try {
        const date = typeof value === 'string' ? parseISO(value) : value;
        return differenceInDays(new Date(), date);
      } catch {
        return 0;
      }
    });

    this.filters.set('reverse', (value: any[]) => {
      return Array.isArray(value) ? [...value].reverse() : value;
    });

    this.filters.set('sort', (value: any[], key?: string) => {
      if (!Array.isArray(value)) return value;
      const sorted = [...value];
      if (key) {
        sorted.sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
      } else {
        sorted.sort();
      }
      return sorted;
    });

    this.filters.set('first', (value: any[]) => {
      return Array.isArray(value) && value.length > 0 ? value[0] : undefined;
    });

    this.filters.set('last', (value: any[]) => {
      return Array.isArray(value) && value.length > 0 ? value[value.length - 1] : undefined;
    });

    this.filters.set('slice', (value: any[], start: number, end?: number) => {
      return Array.isArray(value) ? value.slice(start, end) : value;
    });

    this.filters.set('unique', (value: any[]) => {
      return Array.isArray(value) ? [...new Set(value)] : value;
    });

    this.filters.set('groupBy', (value: any[], key: string) => {
      if (!Array.isArray(value)) return value;
      return value.reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    });

    this.filters.set('sum', (value: any[], key?: string) => {
      if (!Array.isArray(value)) return 0;
      if (key) {
        return value.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
      }
      return value.reduce((sum, item) => sum + (Number(item) || 0), 0);
    });

    this.filters.set('avg', (value: any[], key?: string) => {
      if (!Array.isArray(value) || value.length === 0) return 0;
      const sum = this.filters.get('sum')!(value, key);
      return sum / value.length;
    });

    this.filters.set('min', (value: any[], key?: string) => {
      if (!Array.isArray(value) || value.length === 0) return undefined;
      if (key) {
        return Math.min(...value.map(item => Number(item[key]) || 0));
      }
      return Math.min(...value.map(item => Number(item) || 0));
    });

    this.filters.set('max', (value: any[], key?: string) => {
      if (!Array.isArray(value) || value.length === 0) return undefined;
      if (key) {
        return Math.max(...value.map(item => Number(item[key]) || 0));
      }
      return Math.max(...value.map(item => Number(item) || 0));
    });

    this.filters.set('split', (value: string, separator: string = ',') => {
      return String(value).split(separator);
    });

    this.filters.set('replace', (value: string, search: string, replace: string) => {
      return String(value).replace(new RegExp(search, 'g'), replace);
    });

    this.filters.set('trim', (value: string) => String(value).trim());
    this.filters.set('ltrim', (value: string) => String(value).replace(/^\s+/, ''));
    this.filters.set('rtrim', (value: string) => String(value).replace(/\s+$/, ''));

    this.filters.set('upper', (value: string) => String(value).toUpperCase());
    this.filters.set('lower', (value: string) => String(value).toLowerCase());
    this.filters.set('capitalize', (value: string) => {
      const s = String(value);
      return s.charAt(0).toUpperCase() + s.slice(1);
    });

    this.filters.set('title', (value: string) => {
      return String(value)
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    });

    this.filters.set('camelCase', (value: string) => {
      return String(value)
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toLowerCase());
    });

    this.filters.set('snakeCase', (value: string) => {
      return String(value)
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
    });

    this.filters.set('kebabCase', (value: string) => {
      return String(value)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
    });

    this.filters.set('truncate', (value: string, length: number = 50, suffix: string = '...') => {
      const s = String(value);
      return s.length > length ? s.substring(0, length) + suffix : s;
    });

    this.filters.set('wordwrap', (value: string, width: number = 80) => {
      const words = String(value).split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        if ((currentLine + ' ' + word).length > width) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        }
      }

      if (currentLine) lines.push(currentLine);
      return lines.join('\n');
    });

    this.filters.set('urlencode', (value: string) => {
      return encodeURIComponent(String(value));
    });

    this.filters.set('urldecode', (value: string) => {
      return decodeURIComponent(String(value));
    });

    this.filters.set('base64encode', (value: string) => {
      return Buffer.from(String(value)).toString('base64');
    });

    this.filters.set('base64decode', (value: string) => {
      return Buffer.from(String(value), 'base64').toString('utf-8');
    });

    this.filters.set('json', (value: any, spaces: number = 2) => {
      return JSON.stringify(value, null, spaces);
    });

    this.filters.set('escape', (value: string) => {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    });

    this.filters.set('unescape', (value: string) => {
      return String(value)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
    });

    this.filters.set('default', (value: any, defaultValue: any) => {
      return value !== undefined && value !== null && value !== '' ? value : defaultValue;
    });

    this.filters.set('length', (value: any) => {
      if (Array.isArray(value) || typeof value === 'string') {
        return value.length;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length;
      }
      return 0;
    });

    this.filters.set('keys', (value: any) => {
      return typeof value === 'object' && value !== null ? Object.keys(value) : [];
    });

    this.filters.set('values', (value: any) => {
      return typeof value === 'object' && value !== null ? Object.values(value) : [];
    });

    this.filters.set('entries', (value: any) => {
      return typeof value === 'object' && value !== null ? Object.entries(value) : [];
    });
  }

  public registerFilter(name: string, filter: Function): void {
    this.filters.set(name, filter);
    this.logger.debug(`Registered filter: ${name}`);
  }

  public registerMacro(name: string, macro: MacroDefinition): void {
    this.macros.set(name, macro);
    this.logger.debug(`Registered macro: ${name}`);
  }

  public registerImport(alias: string, template: string): void {
    this.imports.set(alias, template);
    this.logger.debug(`Registered import: ${alias}`);
  }

  private evaluateExpression(expression: string, context: AdvancedRenderContext): any {
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

    if (expression.startsWith('[') && expression.endsWith(']')) {
      try {
        return JSON.parse(expression);
      } catch {
        return undefined;
      }
    }

    if (expression.startsWith('{') && expression.endsWith('}')) {
      try {
        return JSON.parse(expression);
      } catch {
        return undefined;
      }
    }

    return this.resolveVariable(expression, context);
  }

  private evaluateCondition(condition: string, context: AdvancedRenderContext): boolean {
    try {
      if (condition.includes(' and ') || condition.includes(' && ')) {
        const parts = condition.split(/\s+(?:and|&&)\s+/);
        return parts.every(part => this.evaluateCondition(part.trim(), context));
      }

      if (condition.includes(' or ') || condition.includes(' || ')) {
        const parts = condition.split(/\s+(?:or|\|\|)\s+/);
        return parts.some(part => this.evaluateCondition(part.trim(), context));
      }

      if (condition.startsWith('not ') || condition.startsWith('!')) {
        const innerCondition = condition.replace(/^(?:not |!)/, '').trim();
        return !this.evaluateCondition(innerCondition, context);
      }

      if (condition.includes(' in ')) {
        const [item, collection] = condition.split(' in ').map(s => s.trim());
        const itemValue = this.evaluateExpression(item, context);
        const collectionValue = this.evaluateExpression(collection, context);

        if (Array.isArray(collectionValue)) {
          return collectionValue.includes(itemValue);
        }
        if (typeof collectionValue === 'string') {
          return collectionValue.includes(String(itemValue));
        }
        if (typeof collectionValue === 'object' && collectionValue !== null) {
          return itemValue in collectionValue;
        }
        return false;
      }

      const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];

      for (const op of operators) {
        if (condition.includes(op)) {
          const [left, right] = condition.split(op).map(s => s.trim());
          const leftValue = this.evaluateExpression(left, context);
          const rightValue = this.evaluateExpression(right, context);

          switch (op) {
            case '===':
              return leftValue === rightValue;
            case '!==':
              return leftValue !== rightValue;
            case '==':
              return leftValue == rightValue;
            case '!=':
              return leftValue != rightValue;
            case '>=':
              return leftValue >= rightValue;
            case '<=':
              return leftValue <= rightValue;
            case '>':
              return leftValue > rightValue;
            case '<':
              return leftValue < rightValue;
          }
        }
      }

      const value = this.resolveVariable(condition, context);
      return Boolean(value);
    } catch (error) {
      return false;
    }
  }

  private resolveVariable(path: string, context: AdvancedRenderContext): any {
    const parts = path.split('.');
    let current: any = context.data;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }

      if (part.includes('[') && part.includes(']')) {
        const match = part.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const [, prop, index] = match;
          current = current[prop];
          if (Array.isArray(current)) {
            current = current[parseInt(index, 10)];
          }
          continue;
        }
      }

      current = current[part];
    }

    return current;
  }
}
