import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Logger } from '../utils/logger';

export interface BotConfig {
  defaultOutputPath: string;
  defaultTemplate?: string;
  autoOverwrite: boolean;
  createBackup: boolean;
  validateMarkdown: boolean;
  templatePaths: string[];
  maxFileSize: number;
  encoding: BufferEncoding;
  preferences: {
    author?: string;
    email?: string;
    organization?: string;
    license?: string;
    language: string;
    dateFormat: string;
    colorOutput: boolean;
    verbose: boolean;
  };
  advanced: {
    enablePlugins: boolean;
    pluginPaths: string[];
    cacheEnabled: boolean;
    cachePath: string;
    maxCacheSize: number;
    enableTelemetry: boolean;
  };
}

export const DEFAULT_CONFIG: BotConfig = {
  defaultOutputPath: process.cwd(),
  autoOverwrite: false,
  createBackup: true,
  validateMarkdown: true,
  templatePaths: [],
  maxFileSize: 10 * 1024 * 1024,
  encoding: 'utf-8',
  preferences: {
    language: 'zh-TW',
    dateFormat: 'YYYY-MM-DD',
    colorOutput: true,
    verbose: false,
  },
  advanced: {
    enablePlugins: false,
    pluginPaths: [],
    cacheEnabled: true,
    cachePath: path.join(os.tmpdir(), 'markdownbot-cache'),
    maxCacheSize: 100 * 1024 * 1024,
    enableTelemetry: false,
  },
};

export class ConfigManager {
  private config: BotConfig;
  private configPath: string;
  private logger: Logger;

  constructor(configPath?: string) {
    this.logger = new Logger('ConfigManager');
    this.configPath = configPath || this.getDefaultConfigPath();
    this.config = { ...DEFAULT_CONFIG };
    this.loadConfig();
  }

  private getDefaultConfigPath(): string {
    const homeDir = os.homedir();
    const configDir = path.join(homeDir, '.markdownbot');
    return path.join(configDir, 'config.json');
  }

  public async loadConfig(): Promise<void> {
    try {
      if (await fs.pathExists(this.configPath)) {
        const fileContent = await fs.readFile(this.configPath, 'utf-8');
        const userConfig = JSON.parse(fileContent);
        this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
        this.logger.info(`Configuration loaded from ${this.configPath}`);
      } else {
        this.logger.info('No configuration file found, using defaults');
        await this.saveConfig();
      }
    } catch (error) {
      this.logger.error(`Failed to load configuration: ${error}`);
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  public async saveConfig(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf-8'
      );
      this.logger.info(`Configuration saved to ${this.configPath}`);
    } catch (error) {
      this.logger.error(`Failed to save configuration: ${error}`);
      throw error;
    }
  }

  private mergeConfig(defaults: BotConfig, user: Partial<BotConfig>): BotConfig {
    return {
      ...defaults,
      ...user,
      preferences: {
        ...defaults.preferences,
        ...user.preferences,
      },
      advanced: {
        ...defaults.advanced,
        ...user.advanced,
      },
    };
  }

  public get(key?: keyof BotConfig): any {
    if (!key) {
      return { ...this.config };
    }
    return this.config[key];
  }

  public set(key: keyof BotConfig, value: any): void {
    (this.config as any)[key] = value;
  }

  public setPreference(key: keyof BotConfig['preferences'], value: any): void {
    this.config.preferences[key] = value;
  }

  public getPreference(key: keyof BotConfig['preferences']): any {
    return this.config.preferences[key];
  }

  public setAdvanced(key: keyof BotConfig['advanced'], value: any): void {
    (this.config.advanced as any)[key] = value;
  }

  public getAdvanced(key: keyof BotConfig['advanced']): any {
    return this.config.advanced[key];
  }

  public async reset(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await this.saveConfig();
    this.logger.info('Configuration reset to defaults');
  }

  public async exportConfig(filePath: string): Promise<void> {
    try {
      await fs.writeFile(
        filePath,
        JSON.stringify(this.config, null, 2),
        'utf-8'
      );
      this.logger.info(`Configuration exported to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to export configuration: ${error}`);
      throw error;
    }
  }

  public async importConfig(filePath: string): Promise<void> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const importedConfig = JSON.parse(fileContent);
      this.config = this.mergeConfig(DEFAULT_CONFIG, importedConfig);
      await this.saveConfig();
      this.logger.info(`Configuration imported from ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to import configuration: ${error}`);
      throw error;
    }
  }

  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.defaultOutputPath) {
      errors.push('Default output path is required');
    }

    if (this.config.maxFileSize <= 0) {
      errors.push('Max file size must be greater than 0');
    }

    if (!['utf-8', 'utf8', 'ascii', 'latin1', 'base64', 'hex'].includes(this.config.encoding)) {
      errors.push('Invalid encoding format');
    }

    if (this.config.advanced.maxCacheSize <= 0) {
      errors.push('Max cache size must be greater than 0');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public getConfigPath(): string {
    return this.configPath;
  }

  public async initializeUserConfig(): Promise<void> {
    const configDir = path.dirname(this.configPath);
    
    if (!(await fs.pathExists(configDir))) {
      await fs.ensureDir(configDir);
      this.logger.info(`Created configuration directory: ${configDir}`);
    }

    if (!(await fs.pathExists(this.configPath))) {
      await this.saveConfig();
      this.logger.info('Initialized user configuration');
    }
  }

  public showConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  public async clearCache(): Promise<void> {
    const cachePath = this.config.advanced.cachePath;
    try {
      if (await fs.pathExists(cachePath)) {
        await fs.remove(cachePath);
        this.logger.info(`Cache cleared: ${cachePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to clear cache: ${error}`);
      throw error;
    }
  }

  public async getCacheSize(): Promise<number> {
    const cachePath = this.config.advanced.cachePath;
    try {
      if (await fs.pathExists(cachePath)) {
        const files = await fs.readdir(cachePath);
        let totalSize = 0;
        for (const file of files) {
          const filePath = path.join(cachePath, file);
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
        return totalSize;
      }
      return 0;
    } catch (error) {
      this.logger.error(`Failed to get cache size: ${error}`);
      return 0;
    }
  }
}
