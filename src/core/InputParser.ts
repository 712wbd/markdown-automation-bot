import { UserInput, TemplateConfig, TemplateField, ValidationResult, TemplateCategory } from '@/types';
import { Logger } from '@/utils/logger';
import { TemplateLibrary } from './TemplateLibrary';
import validator from 'validator';

export interface ParsedInput {
  valid: boolean;
  userInput?: UserInput;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FieldValidationResult {
  field: string;
  valid: boolean;
  errors: string[];
  value?: any;
}

export class InputParser {
  private logger: Logger;
  private templateLibrary: TemplateLibrary;

  constructor(templateLibrary: TemplateLibrary) {
    this.logger = new Logger('InputParser');
    this.templateLibrary = templateLibrary;
  }

  public parseAndValidate(rawInput: Record<string, any>): ParsedInput {
    const result: ParsedInput = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    try {
      const template = this.identifyTemplate(rawInput);
      
      if (!template) {
        result.valid = false;
        result.errors.push('Unable to identify appropriate template');
        result.suggestions = this.suggestTemplates(rawInput);
        return result;
      }

      this.logger.info(`Identified template: ${template.name} (${template.id})`);

      const validationResult = this.validateFields(rawInput, template);
      
      if (!validationResult.valid) {
        result.valid = false;
        result.errors.push(...validationResult.errors);
      }

      if (validationResult.warnings.length > 0) {
        result.warnings.push(...validationResult.warnings);
      }

      const missingFields = this.checkMissingFields(rawInput, template);
      if (missingFields.length > 0) {
        result.valid = false;
        result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (result.valid) {
        result.userInput = {
          templateId: template.id,
          category: template.category,
          title: rawInput.title || rawInput.projectName || 'Untitled',
          fields: this.extractFields(rawInput, template),
          outputPath: rawInput.outputPath || process.cwd(),
          filename: rawInput.filename,
          overwrite: rawInput.overwrite !== false,
        };
      }

    } catch (error) {
      result.valid = false;
      result.errors.push(`Parsing error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  private identifyTemplate(rawInput: Record<string, any>): TemplateConfig | undefined {
    if (rawInput.templateId) {
      const template = this.templateLibrary.getTemplate(rawInput.templateId);
      if (template) return template;
    }

    if (rawInput.category) {
      const templates = this.templateLibrary.getTemplatesByCategory(rawInput.category as TemplateCategory);
      if (templates.length > 0) {
        return this.selectBestMatch(rawInput, templates);
      }
    }

    const keywords = this.extractKeywords(rawInput);
    const matches = this.templateLibrary.searchTemplates({
      keywords,
      fuzzySearch: true,
    });

    if (matches.length > 0) {
      return matches[0].template;
    }

    return undefined;
  }

  private selectBestMatch(rawInput: Record<string, any>, templates: TemplateConfig[]): TemplateConfig {
    let bestMatch = templates[0];
    let highestScore = 0;

    for (const template of templates) {
      let score = 0;

      for (const field of template.fields) {
        if (rawInput[field.name] !== undefined) {
          score += field.required ? 10 : 5;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = template;
      }
    }

    return bestMatch;
  }

  private extractKeywords(rawInput: Record<string, any>): string[] {
    const keywords: string[] = [];

    const keyFields = ['title', 'projectName', 'name', 'description', 'type', 'category'];
    
    for (const key of keyFields) {
      if (rawInput[key] && typeof rawInput[key] === 'string') {
        keywords.push(rawInput[key]);
      }
    }

    return keywords;
  }

  private suggestTemplates(rawInput: Record<string, any>): string[] {
    const suggestions: string[] = [];
    const allTemplates = this.templateLibrary.getAllTemplates();

    if (allTemplates.length === 0) {
      return ['No templates available'];
    }

    const categories = new Map<TemplateCategory, number>();
    for (const template of allTemplates) {
      categories.set(template.category, (categories.get(template.category) || 0) + 1);
    }

    suggestions.push('Available template categories:');
    for (const [category, count] of categories.entries()) {
      suggestions.push(`  - ${category} (${count} templates)`);
    }

    suggestions.push('');
    suggestions.push('Popular templates:');
    allTemplates.slice(0, 5).forEach(t => {
      suggestions.push(`  - ${t.name} [${t.id}]`);
    });

    return suggestions;
  }

  private validateFields(rawInput: Record<string, any>, template: TemplateConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const field of template.fields) {
      const value = rawInput[field.name];
      const fieldResult = this.validateField(field, value);

      if (!fieldResult.valid) {
        if (field.required) {
          errors.push(...fieldResult.errors.map(e => `${field.label}: ${e}`));
        } else {
          warnings.push(...fieldResult.errors.map(e => `${field.label}: ${e}`));
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateField(field: TemplateField, value: any): FieldValidationResult {
    const result: FieldValidationResult = {
      field: field.name,
      valid: true,
      errors: [],
      value,
    };

    if (value === undefined || value === null || value === '') {
      if (field.required) {
        result.valid = false;
        result.errors.push('This field is required');
      }
      return result;
    }

    switch (field.type) {
      case 'text':
        result.valid = this.validateText(value, field, result.errors);
        break;
      case 'textarea':
        result.valid = this.validateTextarea(value, field, result.errors);
        break;
      case 'email':
        result.valid = this.validateEmail(value, result.errors);
        break;
      case 'url':
        result.valid = this.validateUrl(value, result.errors);
        break;
      case 'number':
        result.valid = this.validateNumber(value, field, result.errors);
        break;
      case 'date':
        result.valid = this.validateDate(value, result.errors);
        break;
      case 'select':
        result.valid = this.validateSelect(value, field, result.errors);
        break;
      case 'array':
        result.valid = this.validateArray(value, field, result.errors);
        break;
      case 'object':
        result.valid = this.validateObject(value, field, result.errors);
        break;
      case 'code':
        result.valid = this.validateCode(value, field, result.errors);
        break;
      case 'checklist':
        result.valid = this.validateChecklist(value, field, result.errors);
        break;
      default:
        result.warnings = [`Unknown field type: ${field.type}`];
    }

    return result;
  }

  private validateText(value: any, field: TemplateField, errors: string[]): boolean {
    if (typeof value !== 'string') {
      errors.push('Must be a string');
      return false;
    }

    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors.push(`Must be at least ${field.validation.minLength} characters`);
        return false;
      }

      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Must be at most ${field.validation.maxLength} characters`);
        return false;
      }

      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          errors.push(`Does not match required pattern: ${field.validation.pattern}`);
          return false;
        }
      }
    }

    return true;
  }

  private validateTextarea(value: any, field: TemplateField, errors: string[]): boolean {
    return this.validateText(value, field, errors);
  }

  private validateEmail(value: any, errors: string[]): boolean {
    if (typeof value !== 'string') {
      errors.push('Must be a string');
      return false;
    }

    if (!validator.isEmail(value)) {
      errors.push('Must be a valid email address');
      return false;
    }

    return true;
  }

  private validateUrl(value: any, errors: string[]): boolean {
    if (typeof value !== 'string') {
      errors.push('Must be a string');
      return false;
    }

    if (!validator.isURL(value, { require_protocol: false })) {
      errors.push('Must be a valid URL');
      return false;
    }

    return true;
  }

  private validateNumber(value: any, field: TemplateField, errors: string[]): boolean {
    const num = typeof value === 'number' ? value : Number(value);

    if (isNaN(num)) {
      errors.push('Must be a valid number');
      return false;
    }

    if (field.validation) {
      if (field.validation.min !== undefined && num < field.validation.min) {
        errors.push(`Must be at least ${field.validation.min}`);
        return false;
      }

      if (field.validation.max !== undefined && num > field.validation.max) {
        errors.push(`Must be at most ${field.validation.max}`);
        return false;
      }
    }

    return true;
  }

  private validateDate(value: any, errors: string[]): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push('Must be a valid date');
        return false;
      }
      return true;
    }

    errors.push('Must be a valid date');
    return false;
  }

  private validateSelect(value: any, field: TemplateField, errors: string[]): boolean {
    if (!field.options || field.options.length === 0) {
      return true;
    }

    if (!field.options.includes(value)) {
      errors.push(`Must be one of: ${field.options.join(', ')}`);
      return false;
    }

    return true;
  }

  private validateArray(value: any, field: TemplateField, errors: string[]): boolean {
    if (!Array.isArray(value)) {
      errors.push('Must be an array');
      return false;
    }

    if (field.validation) {
      if (field.validation.minItems !== undefined && value.length < field.validation.minItems) {
        errors.push(`Must have at least ${field.validation.minItems} items`);
        return false;
      }

      if (field.validation.maxItems !== undefined && value.length > field.validation.maxItems) {
        errors.push(`Must have at most ${field.validation.maxItems} items`);
        return false;
      }
    }

    return true;
  }

  private validateObject(value: any, field: TemplateField, errors: string[]): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push('Must be an object');
      return false;
    }

    if (field.properties) {
      for (const [key, propDef] of Object.entries(field.properties)) {
        if (value[key] === undefined && (propDef as any).required) {
          errors.push(`Missing required property: ${key}`);
          return false;
        }
      }
    }

    return true;
  }

  private validateCode(value: any, field: TemplateField, errors: string[]): boolean {
    if (typeof value !== 'string') {
      errors.push('Code must be a string');
      return false;
    }

    if (field.language) {
    }

    return true;
  }

  private validateChecklist(value: any, field: TemplateField, errors: string[]): boolean {
    if (!Array.isArray(value)) {
      errors.push('Checklist must be an array');
      return false;
    }

    return true;
  }

  private checkMissingFields(rawInput: Record<string, any>, template: TemplateConfig): string[] {
    const missing: string[] = [];

    for (const field of template.fields) {
      if (field.required && (rawInput[field.name] === undefined || rawInput[field.name] === null || rawInput[field.name] === '')) {
        missing.push(field.label || field.name);
      }
    }

    return missing;
  }

  private extractFields(rawInput: Record<string, any>, template: TemplateConfig): Record<string, any> {
    const fields: Record<string, any> = {};

    for (const field of template.fields) {
      let value = rawInput[field.name];

      if (value === undefined && field.defaultValue !== undefined) {
        value = field.defaultValue;
      }

      if (value !== undefined) {
        fields[field.name] = this.transformFieldValue(value, field);
      }
    }

    return fields;
  }

  private transformFieldValue(value: any, field: TemplateField): any {
    switch (field.type) {
      case 'number':
        return typeof value === 'number' ? value : Number(value);
      
      case 'date':
        if (value instanceof Date) return value;
        return new Date(value);
      
      case 'array':
        if (Array.isArray(value)) return value;
        return [value];
      
      default:
        return value;
    }
  }

  public async promptMissingFields(
    rawInput: Record<string, any>,
    template: TemplateConfig
  ): Promise<Record<string, any>> {
    const missingFields = this.checkMissingFields(rawInput, template);
    
    if (missingFields.length === 0) {
      return rawInput;
    }

    this.logger.warn(`Missing required fields: ${missingFields.join(', ')}`);
    this.logger.info('Please provide the missing information...');

    return rawInput;
  }

  public generateFieldPrompts(template: TemplateConfig): Array<{
    name: string;
    message: string;
    type: string;
    required: boolean;
    choices?: string[];
  }> {
    return template.fields.map(field => ({
      name: field.name,
      message: field.label + (field.required ? ' (required)' : ' (optional)'),
      type: this.mapFieldTypeToPromptType(field.type),
      required: field.required,
      choices: field.options,
    }));
  }

  private mapFieldTypeToPromptType(fieldType: string): string {
    const mapping: Record<string, string> = {
      text: 'input',
      textarea: 'editor',
      email: 'input',
      url: 'input',
      number: 'number',
      date: 'input',
      select: 'list',
      array: 'input',
      object: 'input',
      code: 'editor',
      checklist: 'checkbox',
    };

    return mapping[fieldType] || 'input';
  }

  public validateTemplateCompatibility(
    userInput: UserInput,
    template: TemplateConfig
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const field of template.fields) {
      if (field.required && !userInput.fields[field.name]) {
        errors.push(`Missing required field: ${field.label}`);
      }
    }

    for (const [key, value] of Object.entries(userInput.fields)) {
      const field = template.fields.find(f => f.name === key);
      if (!field) {
        warnings.push(`Unknown field: ${key}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
