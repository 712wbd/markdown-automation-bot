import { TemplateConfig, TemplateCategory } from '@/types';
import { Logger } from '@/utils/logger';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';

export interface TemplateSearchOptions {
  category?: TemplateCategory;
  tags?: string[];
  keywords?: string[];
  fuzzySearch?: boolean;
}

export interface TemplateMatch {
  template: TemplateConfig;
  score: number;
  matchedFields: string[];
}

export class TemplateLibrary {
  private templates: Map<string, TemplateConfig>;
  private logger: Logger;
  private customTemplatesPath?: string;

  constructor(customTemplatesPath?: string) {
    this.templates = new Map();
    this.logger = new Logger('TemplateLibrary');
    this.customTemplatesPath = customTemplatesPath;
    this.loadBuiltInTemplates();
    if (customTemplatesPath) {
      this.loadCustomTemplates(customTemplatesPath);
    }
  }

  public getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id);
  }

  public getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  public getTemplatesByCategory(category: TemplateCategory): TemplateConfig[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  public searchTemplates(options: TemplateSearchOptions): TemplateMatch[] {
    const matches: TemplateMatch[] = [];

    for (const template of this.templates.values()) {
      const match = this.matchTemplate(template, options);
      if (match.score > 0) {
        matches.push(match);
      }
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  public registerTemplate(template: TemplateConfig): void {
    if (this.templates.has(template.id)) {
      this.logger.warn(`Template with id "${template.id}" already exists. Overwriting.`);
    }

    const validation = this.validateTemplate(template);
    if (!validation.valid) {
      throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
    }

    this.templates.set(template.id, template);
    this.logger.info(`Template registered: ${template.name} (${template.id})`);
  }

  public unregisterTemplate(id: string): boolean {
    const removed = this.templates.delete(id);
    if (removed) {
      this.logger.info(`Template unregistered: ${id}`);
    }
    return removed;
  }

  public async saveTemplate(template: TemplateConfig, filePath: string): Promise<void> {
    try {
      const content = yaml.stringify(template);
      await fs.writeFile(filePath, content, 'utf-8');
      this.logger.success(`Template saved: ${filePath}`);
    } catch (error) {
      this.logger.error('Failed to save template:', error);
      throw error;
    }
  }

  public async loadTemplate(filePath: string): Promise<TemplateConfig> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const template = yaml.parse(content) as TemplateConfig;
      
      const validation = this.validateTemplate(template);
      if (!validation.valid) {
        throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
      }

      this.registerTemplate(template);
      return template;
    } catch (error) {
      this.logger.error('Failed to load template:', error);
      throw error;
    }
  }

  private matchTemplate(template: TemplateConfig, options: TemplateSearchOptions): TemplateMatch {
    let score = 0;
    const matchedFields: string[] = [];

    if (options.category && template.category === options.category) {
      score += 50;
      matchedFields.push('category');
    }

    if (options.tags && options.tags.length > 0) {
      const matchedTags = options.tags.filter(tag => 
        template.tags.some(t => this.fuzzyMatch(t, tag, options.fuzzySearch))
      );
      if (matchedTags.length > 0) {
        score += matchedTags.length * 20;
        matchedFields.push('tags');
      }
    }

    if (options.keywords && options.keywords.length > 0) {
      for (const keyword of options.keywords) {
        const lowerKeyword = keyword.toLowerCase();
        
        if (this.fuzzyMatch(template.name, keyword, options.fuzzySearch)) {
          score += 30;
          matchedFields.push('name');
        }
        
        if (this.fuzzyMatch(template.description, keyword, options.fuzzySearch)) {
          score += 10;
          matchedFields.push('description');
        }

        if (template.tags.some(tag => this.fuzzyMatch(tag, keyword, options.fuzzySearch))) {
          score += 15;
          matchedFields.push('tags');
        }
      }
    }

    return {
      template,
      score,
      matchedFields: [...new Set(matchedFields)],
    };
  }

  private fuzzyMatch(text: string, query: string, fuzzy: boolean = false): boolean {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    if (textLower.includes(queryLower)) {
      return true;
    }

    if (fuzzy) {
      let queryIndex = 0;
      for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
        if (textLower[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }
      return queryIndex === queryLower.length;
    }

    return false;
  }

  private validateTemplate(template: TemplateConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.id || typeof template.id !== 'string') {
      errors.push('Template must have a valid id');
    }

    if (!template.name || typeof template.name !== 'string') {
      errors.push('Template must have a valid name');
    }

    if (!template.category) {
      errors.push('Template must have a category');
    }

    if (!Array.isArray(template.fields)) {
      errors.push('Template must have a fields array');
    }

    if (!Array.isArray(template.sections)) {
      errors.push('Template must have a sections array');
    }

    if (template.sections && template.sections.length === 0) {
      errors.push('Template must have at least one section');
    }

    for (const field of template.fields || []) {
      if (!field.name || !field.label || !field.type) {
        errors.push(`Invalid field: ${JSON.stringify(field)}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private loadBuiltInTemplates(): void {
    this.logger.info('Loading built-in templates...');
  }

  private async loadCustomTemplates(dirPath: string): Promise<void> {
    try {
      const exists = await fs.pathExists(dirPath);
      if (!exists) {
        this.logger.warn(`Custom templates directory not found: ${dirPath}`);
        return;
      }

      const files = await fs.readdir(dirPath);
      const templateFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

      this.logger.info(`Loading ${templateFiles.length} custom templates from ${dirPath}`);

      for (const file of templateFiles) {
        try {
          await this.loadTemplate(path.join(dirPath, file));
        } catch (error) {
          this.logger.error(`Failed to load template ${file}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Failed to load custom templates:', error);
    }
  }

  public listTemplates(): void {
    const templates = this.getAllTemplates();
    
    this.logger.info(`\n${'='.repeat(80)}`);
    this.logger.info(`Available Templates (${templates.length})`);
    this.logger.info('='.repeat(80));

    const categories = new Map<TemplateCategory, TemplateConfig[]>();
    
    for (const template of templates) {
      if (!categories.has(template.category)) {
        categories.set(template.category, []);
      }
      categories.get(template.category)!.push(template);
    }

    for (const [category, temps] of categories.entries()) {
      this.logger.info(`\n${category.toUpperCase()} (${temps.length})`);
      this.logger.divider('-', 80);
      
      for (const template of temps) {
        this.logger.info(`  • ${template.name} [${template.id}]`);
        this.logger.info(`    ${template.description}`);
        this.logger.info(`    Tags: ${template.tags.join(', ')}`);
      }
    }

    this.logger.info('\n' + '='.repeat(80) + '\n');
  }

  public getTemplateInfo(id: string): string {
    const template = this.getTemplate(id);
    if (!template) {
      return `Template not found: ${id}`;
    }

    const lines: string[] = [];
    lines.push('='.repeat(80));
    lines.push(`Template: ${template.name}`);
    lines.push('='.repeat(80));
    lines.push(`ID: ${template.id}`);
    lines.push(`Category: ${template.category}`);
    lines.push(`Description: ${template.description}`);
    lines.push(`Tags: ${template.tags.join(', ')}`);
    lines.push('');
    lines.push('Fields:');
    
    for (const field of template.fields) {
      const required = field.required ? ' (required)' : '';
      lines.push(`  • ${field.label} [${field.name}]${required}`);
      lines.push(`    Type: ${field.type}`);
      if (field.validation) {
        lines.push(`    Validation: ${JSON.stringify(field.validation)}`);
      }
    }

    lines.push('');
    lines.push('Sections:');
    
    for (const section of template.sections) {
      lines.push(`  • ${section.title}`);
      if (section.condition) {
        lines.push(`    Condition: ${section.condition}`);
      }
      if (section.repeat) {
        lines.push(`    Repeat: ${section.repeat.items} as ${section.repeat.as}`);
      }
    }

    lines.push('='.repeat(80));

    return lines.join('\n');
  }

  public async exportTemplates(outputPath: string): Promise<void> {
    try {
      await fs.ensureDir(outputPath);

      for (const template of this.templates.values()) {
        const filename = `${template.id}.yaml`;
        const filePath = path.join(outputPath, filename);
        await this.saveTemplate(template, filePath);
      }

      this.logger.success(`Exported ${this.templates.size} templates to ${outputPath}`);
    } catch (error) {
      this.logger.error('Failed to export templates:', error);
      throw error;
    }
  }

  public async importTemplates(inputPath: string): Promise<number> {
    try {
      const exists = await fs.pathExists(inputPath);
      if (!exists) {
        throw new Error(`Path does not exist: ${inputPath}`);
      }

      const stat = await fs.stat(inputPath);
      let imported = 0;

      if (stat.isFile()) {
        await this.loadTemplate(inputPath);
        imported = 1;
      } else if (stat.isDirectory()) {
        const files = await fs.readdir(inputPath);
        const templateFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

        for (const file of templateFiles) {
          try {
            await this.loadTemplate(path.join(inputPath, file));
            imported++;
          } catch (error) {
            this.logger.error(`Failed to import ${file}:`, error);
          }
        }
      }

      this.logger.success(`Imported ${imported} templates from ${inputPath}`);
      return imported;
    } catch (error) {
      this.logger.error('Failed to import templates:', error);
      throw error;
    }
  }

  public getStatistics(): {
    total: number;
    byCategory: Record<TemplateCategory, number>;
    totalFields: number;
    totalSections: number;
  } {
    const stats = {
      total: this.templates.size,
      byCategory: {} as Record<TemplateCategory, number>,
      totalFields: 0,
      totalSections: 0,
    };

    for (const template of this.templates.values()) {
      if (!stats.byCategory[template.category]) {
        stats.byCategory[template.category] = 0;
      }
      stats.byCategory[template.category]++;
      stats.totalFields += template.fields.length;
      stats.totalSections += template.sections.length;
    }

    return stats;
  }
}
