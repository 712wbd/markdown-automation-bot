import { TemplateConfig } from '@/types';
import { Logger } from '@/utils/logger';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createHash } from 'crypto';

export interface MarketTemplate extends TemplateConfig {
  author: string;
  version: string;
  downloads: number;
  rating: number;
  reviews: number;
  publishedAt: Date;
  updatedAt: Date;
  license: string;
  repository?: string;
  homepage?: string;
  keywords: string[];
  dependencies?: string[];
  checksum: string;
}

export interface TemplatePackage {
  metadata: MarketTemplate;
  template: TemplateConfig;
  readme?: string;
  changelog?: string;
  examples?: Array<{ name: string; content: string }>;
}

export interface SearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  sortBy?: 'downloads' | 'rating' | 'recent' | 'name';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  templates: MarketTemplate[];
  total: number;
  hasMore: boolean;
}

export class TemplateMarket {
  private logger: Logger;
  private marketPath: string;
  private cachePath: string;
  private templates: Map<string, MarketTemplate> = new Map();
  private packages: Map<string, TemplatePackage> = new Map();

  constructor(marketPath?: string) {
    this.logger = new Logger('TemplateMarket');
    this.marketPath = marketPath || path.join(process.cwd(), '.mdbot', 'market');
    this.cachePath = path.join(this.marketPath, 'cache');
  }

  public async initialize(): Promise<void> {
    await fs.ensureDir(this.marketPath);
    await fs.ensureDir(this.cachePath);
    await this.loadLocalTemplates();
    this.logger.info('Template market initialized');
  }

  private async loadLocalTemplates(): Promise<void> {
    try {
      const marketIndexPath = path.join(this.marketPath, 'index.json');
      if (await fs.pathExists(marketIndexPath)) {
        const indexData = await fs.readJSON(marketIndexPath);
        for (const template of indexData.templates || []) {
          this.templates.set(template.id, template);
        }
        this.logger.info(`Loaded ${this.templates.size} templates from local market`);
      }
    } catch (error) {
      this.logger.warn('Failed to load local templates:', error);
    }
  }

  public async publishTemplate(
    template: TemplateConfig,
    metadata: {
      author: string;
      version: string;
      license: string;
      repository?: string;
      homepage?: string;
      keywords?: string[];
      readme?: string;
      changelog?: string;
      examples?: Array<{ name: string; content: string }>;
    }
  ): Promise<MarketTemplate> {
    try {
      const templateJson = JSON.stringify(template);
      const checksum = createHash('sha256').update(templateJson).digest('hex');

      const marketTemplate: MarketTemplate = {
        ...template,
        author: metadata.author,
        version: metadata.version,
        downloads: 0,
        rating: 0,
        reviews: 0,
        publishedAt: new Date(),
        updatedAt: new Date(),
        license: metadata.license,
        repository: metadata.repository,
        homepage: metadata.homepage,
        keywords: metadata.keywords || template.tags || [],
        dependencies: [],
        checksum,
      };

      const templatePackage: TemplatePackage = {
        metadata: marketTemplate,
        template,
        readme: metadata.readme,
        changelog: metadata.changelog,
        examples: metadata.examples,
      };

      this.templates.set(template.id, marketTemplate);
      this.packages.set(template.id, templatePackage);

      await this.saveToLocal(templatePackage);
      await this.updateMarketIndex();

      this.logger.info(`Published template: ${template.id} v${metadata.version}`);

      return marketTemplate;
    } catch (error) {
      this.logger.error('Failed to publish template:', error);
      throw new Error(`Failed to publish template: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async updateTemplate(
    templateId: string,
    updates: {
      template?: TemplateConfig;
      version?: string;
      changelog?: string;
      readme?: string;
    }
  ): Promise<MarketTemplate> {
    const existing = this.templates.get(templateId);
    if (!existing) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const existingPackage = this.packages.get(templateId);
    if (!existingPackage) {
      throw new Error(`Template package not found: ${templateId}`);
    }

    const updatedTemplate = updates.template || existingPackage.template;
    const templateJson = JSON.stringify(updatedTemplate);
    const checksum = createHash('sha256').update(templateJson).digest('hex');

    const updatedMarketTemplate: MarketTemplate = {
      ...existing,
      ...updatedTemplate,
      author: existing.author,
      version: updates.version || existing.version,
      downloads: existing.downloads,
      rating: existing.rating,
      reviews: existing.reviews,
      publishedAt: existing.publishedAt,
      updatedAt: new Date(),
      license: existing.license,
      repository: existing.repository,
      homepage: existing.homepage,
      keywords: existing.keywords,
      dependencies: existing.dependencies,
      checksum,
    };

    const updatedPackage: TemplatePackage = {
      ...existingPackage,
      metadata: updatedMarketTemplate,
      template: updatedTemplate,
      changelog: updates.changelog || existingPackage.changelog,
      readme: updates.readme || existingPackage.readme,
    };

    this.templates.set(templateId, updatedMarketTemplate);
    this.packages.set(templateId, updatedPackage);

    await this.saveToLocal(updatedPackage);
    await this.updateMarketIndex();

    this.logger.info(`Updated template: ${templateId} to v${updatedMarketTemplate.version}`);

    return updatedMarketTemplate;
  }

  public async searchTemplates(options: SearchOptions = {}): Promise<SearchResult> {
    let results = Array.from(this.templates.values());

    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.keywords.some((k) => k.toLowerCase().includes(query))
      );
    }

    if (options.category) {
      results = results.filter((t) => t.category === options.category);
    }

    if (options.tags && options.tags.length > 0) {
      results = results.filter((t) => options.tags!.some((tag) => t.tags.includes(tag)));
    }

    if (options.author) {
      results = results.filter((t) => t.author === options.author);
    }

    switch (options.sortBy) {
      case 'downloads':
        results.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'recent':
        results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => b.downloads - a.downloads);
    }

    const total = results.length;
    const offset = options.offset || 0;
    const limit = options.limit || 10;
    const paginatedResults = results.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      templates: paginatedResults,
      total,
      hasMore,
    };
  }

  public async getTemplate(templateId: string): Promise<MarketTemplate | undefined> {
    return this.templates.get(templateId);
  }

  public async getTemplatePackage(templateId: string): Promise<TemplatePackage | undefined> {
    return this.packages.get(templateId);
  }

  public async downloadTemplate(templateId: string): Promise<TemplatePackage> {
    const templatePackage = this.packages.get(templateId);
    if (!templatePackage) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const marketTemplate = this.templates.get(templateId);
    if (marketTemplate) {
      marketTemplate.downloads++;
      this.templates.set(templateId, marketTemplate);
      await this.updateMarketIndex();
    }

    this.logger.info(`Downloaded template: ${templateId}`);

    return templatePackage;
  }

  public async installTemplate(templateId: string, targetPath: string): Promise<TemplateConfig> {
    const templatePackage = await this.downloadTemplate(templateId);

    const templateFilePath = path.join(targetPath, `${templateId}.json`);
    await fs.writeJSON(templateFilePath, templatePackage.template, { spaces: 2 });

    if (templatePackage.readme) {
      await fs.writeFile(path.join(targetPath, `${templateId}_README.md`), templatePackage.readme);
    }

    if (templatePackage.examples && templatePackage.examples.length > 0) {
      const examplesDir = path.join(targetPath, `${templateId}_examples`);
      await fs.ensureDir(examplesDir);
      for (const example of templatePackage.examples) {
        await fs.writeFile(path.join(examplesDir, `${example.name}.md`), example.content);
      }
    }

    this.logger.info(`Installed template: ${templateId} to ${targetPath}`);

    return templatePackage.template;
  }

  public async uninstallTemplate(templateId: string, targetPath: string): Promise<void> {
    const templateFilePath = path.join(targetPath, `${templateId}.json`);
    const readmePath = path.join(targetPath, `${templateId}_README.md`);
    const examplesDir = path.join(targetPath, `${templateId}_examples`);

    if (await fs.pathExists(templateFilePath)) {
      await fs.remove(templateFilePath);
    }

    if (await fs.pathExists(readmePath)) {
      await fs.remove(readmePath);
    }

    if (await fs.pathExists(examplesDir)) {
      await fs.remove(examplesDir);
    }

    this.logger.info(`Uninstalled template: ${templateId}`);
  }

  public async rateTemplate(templateId: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const totalRating = template.rating * template.reviews;
    template.reviews++;
    template.rating = (totalRating + rating) / template.reviews;

    this.templates.set(templateId, template);
    await this.updateMarketIndex();

    this.logger.info(`Rated template: ${templateId} with ${rating} stars`);
  }

  public async deleteTemplate(templateId: string): Promise<void> {
    const templateDir = path.join(this.marketPath, 'templates', templateId);

    this.templates.delete(templateId);
    this.packages.delete(templateId);

    if (await fs.pathExists(templateDir)) {
      await fs.remove(templateDir);
    }

    await this.updateMarketIndex();

    this.logger.info(`Deleted template: ${templateId}`);
  }

  public async exportTemplate(templateId: string, outputPath: string): Promise<void> {
    const templatePackage = this.packages.get(templateId);
    if (!templatePackage) {
      throw new Error(`Template not found: ${templateId}`);
    }

    await fs.writeJSON(outputPath, templatePackage, { spaces: 2 });
    this.logger.info(`Exported template package to: ${outputPath}`);
  }

  public async importTemplate(packagePath: string): Promise<MarketTemplate> {
    try {
      const templatePackage: TemplatePackage = await fs.readJSON(packagePath);

      if (!templatePackage.metadata || !templatePackage.template) {
        throw new Error('Invalid template package format');
      }

      this.templates.set(templatePackage.template.id, templatePackage.metadata);
      this.packages.set(templatePackage.template.id, templatePackage);

      await this.saveToLocal(templatePackage);
      await this.updateMarketIndex();

      this.logger.info(`Imported template: ${templatePackage.template.id}`);

      return templatePackage.metadata;
    } catch (error) {
      this.logger.error('Failed to import template:', error);
      throw new Error(`Failed to import template: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async getPopularTemplates(limit: number = 10): Promise<MarketTemplate[]> {
    const result = await this.searchTemplates({
      sortBy: 'downloads',
      limit,
    });
    return result.templates;
  }

  public async getTopRatedTemplates(limit: number = 10): Promise<MarketTemplate[]> {
    const result = await this.searchTemplates({
      sortBy: 'rating',
      limit,
    });
    return result.templates;
  }

  public async getRecentTemplates(limit: number = 10): Promise<MarketTemplate[]> {
    const result = await this.searchTemplates({
      sortBy: 'recent',
      limit,
    });
    return result.templates;
  }

  public async getTemplatesByAuthor(author: string): Promise<MarketTemplate[]> {
    const result = await this.searchTemplates({
      author,
      limit: 100,
    });
    return result.templates;
  }

  public async getTemplatesByCategory(category: string): Promise<MarketTemplate[]> {
    const result = await this.searchTemplates({
      category,
      limit: 100,
    });
    return result.templates;
  }

  public async verifyTemplate(templateId: string): Promise<{ valid: boolean; errors: string[] }> {
    const templatePackage = this.packages.get(templateId);
    if (!templatePackage) {
      return {
        valid: false,
        errors: ['Template not found'],
      };
    }

    const errors: string[] = [];

    const templateJson = JSON.stringify(templatePackage.template);
    const calculatedChecksum = createHash('sha256').update(templateJson).digest('hex');

    if (calculatedChecksum !== templatePackage.metadata.checksum) {
      errors.push('Template checksum mismatch - template may be corrupted');
    }

    if (!templatePackage.template.id) {
      errors.push('Template ID is missing');
    }

    if (!templatePackage.template.name) {
      errors.push('Template name is missing');
    }

    if (!templatePackage.template.sections || templatePackage.template.sections.length === 0) {
      errors.push('Template has no sections');
    }

    if (!templatePackage.metadata.author) {
      errors.push('Template author is missing');
    }

    if (!templatePackage.metadata.version) {
      errors.push('Template version is missing');
    }

    if (!templatePackage.metadata.license) {
      errors.push('Template license is missing');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private async saveToLocal(templatePackage: TemplatePackage): Promise<void> {
    const templateDir = path.join(this.marketPath, 'templates', templatePackage.template.id);
    await fs.ensureDir(templateDir);

    await fs.writeJSON(path.join(templateDir, 'package.json'), templatePackage, { spaces: 2 });

    if (templatePackage.readme) {
      await fs.writeFile(path.join(templateDir, 'README.md'), templatePackage.readme);
    }

    if (templatePackage.changelog) {
      await fs.writeFile(path.join(templateDir, 'CHANGELOG.md'), templatePackage.changelog);
    }

    if (templatePackage.examples && templatePackage.examples.length > 0) {
      const examplesDir = path.join(templateDir, 'examples');
      await fs.ensureDir(examplesDir);
      for (const example of templatePackage.examples) {
        await fs.writeFile(path.join(examplesDir, `${example.name}.md`), example.content);
      }
    }
  }

  private async updateMarketIndex(): Promise<void> {
    const indexPath = path.join(this.marketPath, 'index.json');
    const index = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      totalTemplates: this.templates.size,
      templates: Array.from(this.templates.values()),
    };
    await fs.writeJSON(indexPath, index, { spaces: 2 });
  }

  public async clearCache(): Promise<void> {
    await fs.emptyDir(this.cachePath);
    this.logger.info('Cleared template market cache');
  }

  public async getCacheSize(): Promise<number> {
    let totalSize = 0;

    const calculateDirSize = async (dirPath: string): Promise<number> => {
      let size = 0;
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          size += await calculateDirSize(filePath);
        } else {
          size += stats.size;
        }
      }

      return size;
    };

    if (await fs.pathExists(this.cachePath)) {
      totalSize = await calculateDirSize(this.cachePath);
    }

    return totalSize;
  }

  public getStatistics(): {
    totalTemplates: number;
    totalDownloads: number;
    averageRating: number;
    categoryCounts: Record<string, number>;
    topAuthors: Array<{ author: string; templateCount: number }>;
  } {
    const templates = Array.from(this.templates.values());

    const totalTemplates = templates.length;
    const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0);
    const averageRating =
      templates.length > 0 ? templates.reduce((sum, t) => sum + t.rating, 0) / templates.length : 0;

    const categoryCounts: Record<string, number> = {};
    for (const template of templates) {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
    }

    const authorCounts: Record<string, number> = {};
    for (const template of templates) {
      authorCounts[template.author] = (authorCounts[template.author] || 0) + 1;
    }

    const topAuthors = Object.entries(authorCounts)
      .map(([author, templateCount]) => ({ author, templateCount }))
      .sort((a, b) => b.templateCount - a.templateCount)
      .slice(0, 10);

    return {
      totalTemplates,
      totalDownloads,
      averageRating,
      categoryCounts,
      topAuthors,
    };
  }
}
