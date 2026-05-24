import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/logger';
import { TemplateConfig } from '../types';

export interface Plugin {
  name: string;
  version: string;
  description: string;
  author?: string;
  enabled: boolean;
  hooks: PluginHooks;
}

export interface PluginHooks {
  beforeGenerate?: (context: GenerationContext) => Promise<GenerationContext>;
  afterGenerate?: (context: GenerationContext, result: any) => Promise<any>;
  beforeRender?: (template: string, data: any) => Promise<{ template: string; data: any }>;
  afterRender?: (content: string) => Promise<string>;
  onTemplateLoad?: (template: TemplateConfig) => Promise<TemplateConfig>;
  onError?: (error: Error) => Promise<void>;
}

export interface GenerationContext {
  templateId: string;
  fields: Record<string, any>;
  outputPath: string;
  filename?: string;
  metadata?: Record<string, any>;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  main: string;
  dependencies?: Record<string, string>;
  markdownbotVersion?: string;
}

export class PluginManager {
  private plugins: Map<string, Plugin>;
  private pluginPaths: string[];
  private logger: Logger;
  private enabledPlugins: Set<string>;

  constructor(pluginPaths: string[] = []) {
    this.plugins = new Map();
    this.pluginPaths = pluginPaths;
    this.logger = new Logger('PluginManager');
    this.enabledPlugins = new Set();
  }

  public async loadPlugins(): Promise<void> {
    for (const pluginPath of this.pluginPaths) {
      try {
        await this.loadPlugin(pluginPath);
      } catch (error) {
        this.logger.error(`Failed to load plugin from ${pluginPath}: ${error}`);
      }
    }
    this.logger.info(`Loaded ${this.plugins.size} plugins`);
  }

  public async loadPlugin(pluginPath: string): Promise<void> {
    try {
      const manifestPath = path.join(pluginPath, 'plugin.json');
      if (!(await fs.pathExists(manifestPath))) {
        throw new Error('Plugin manifest not found');
      }

      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest: PluginManifest = JSON.parse(manifestContent);

      const pluginMainPath = path.join(pluginPath, manifest.main);
      if (!(await fs.pathExists(pluginMainPath))) {
        throw new Error(`Plugin main file not found: ${manifest.main}`);
      }

      const pluginModule = await import(pluginMainPath);
      const plugin: Plugin = {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        enabled: true,
        hooks: pluginModule.hooks || {},
      };

      this.plugins.set(manifest.name, plugin);
      this.enabledPlugins.add(manifest.name);
      this.logger.info(`Loaded plugin: ${manifest.name} v${manifest.version}`);
    } catch (error) {
      this.logger.error(`Failed to load plugin: ${error}`);
      throw error;
    }
  }

  public enablePlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin not found: ${name}`);
    }
    plugin.enabled = true;
    this.enabledPlugins.add(name);
    this.logger.info(`Enabled plugin: ${name}`);
  }

  public disablePlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin not found: ${name}`);
    }
    plugin.enabled = false;
    this.enabledPlugins.delete(name);
    this.logger.info(`Disabled plugin: ${name}`);
  }

  public unloadPlugin(name: string): void {
    this.plugins.delete(name);
    this.enabledPlugins.delete(name);
    this.logger.info(`Unloaded plugin: ${name}`);
  }

  public getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  public getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  public getEnabledPlugins(): Plugin[] {
    return Array.from(this.plugins.values()).filter(p => p.enabled);
  }

  public async executeHook<T = any>(
    hookName: keyof PluginHooks,
    ...args: any[]
  ): Promise<T> {
    let result: any = args[0];

    for (const plugin of this.getEnabledPlugins()) {
      const hook = plugin.hooks[hookName];
      if (hook) {
        try {
          result = await hook(result, ...args.slice(1));
        } catch (error) {
          this.logger.error(`Error executing hook ${hookName} in plugin ${plugin.name}: ${error}`);
          await this.handlePluginError(plugin.name, error as Error);
        }
      }
    }

    return result;
  }

  public async beforeGenerate(context: GenerationContext): Promise<GenerationContext> {
    return await this.executeHook('beforeGenerate', context);
  }

  public async afterGenerate(context: GenerationContext, result: any): Promise<any> {
    return await this.executeHook('afterGenerate', context, result);
  }

  public async beforeRender(template: string, data: any): Promise<{ template: string; data: any }> {
    let currentTemplate = template;
    let currentData = data;

    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.hooks.beforeRender) {
        try {
          const hookResult = await plugin.hooks.beforeRender(currentTemplate, currentData);
          currentTemplate = hookResult.template;
          currentData = hookResult.data;
        } catch (error) {
          this.logger.error(`Error in beforeRender hook of plugin ${plugin.name}: ${error}`);
        }
      }
    }

    return { template: currentTemplate, data: currentData };
  }

  public async afterRender(content: string): Promise<string> {
    return await this.executeHook('afterRender', content);
  }

  public async onTemplateLoad(template: TemplateConfig): Promise<TemplateConfig> {
    return await this.executeHook('onTemplateLoad', template);
  }

  private async handlePluginError(pluginName: string, error: Error): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin?.hooks.onError) {
      try {
        await plugin.hooks.onError(error);
      } catch (e) {
        this.logger.error(`Error in error handler of plugin ${pluginName}: ${e}`);
      }
    }
  }

  public async installPlugin(pluginSource: string): Promise<void> {
    this.logger.info(`Installing plugin from ${pluginSource}`);
    
    throw new Error('Plugin installation not implemented yet');
  }

  public async uninstallPlugin(name: string): Promise<void> {
    this.logger.info(`Uninstalling plugin: ${name}`);
    
    this.unloadPlugin(name);
    
    throw new Error('Plugin uninstallation not implemented yet');
  }

  public validatePlugin(plugin: Plugin): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!plugin.name || plugin.name.trim() === '') {
      errors.push('Plugin name is required');
    }

    if (!plugin.version || plugin.version.trim() === '') {
      errors.push('Plugin version is required');
    }

    if (!plugin.hooks || Object.keys(plugin.hooks).length === 0) {
      errors.push('Plugin must define at least one hook');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public getPluginStatistics(): {
    total: number;
    enabled: number;
    disabled: number;
    plugins: Array<{ name: string; version: string; enabled: boolean }>;
  } {
    const plugins = this.getAllPlugins();
    return {
      total: plugins.length,
      enabled: this.enabledPlugins.size,
      disabled: plugins.length - this.enabledPlugins.size,
      plugins: plugins.map(p => ({
        name: p.name,
        version: p.version,
        enabled: p.enabled,
      })),
    };
  }

  public async createPluginTemplate(name: string, outputPath: string): Promise<void> {
    const pluginDir = path.join(outputPath, name);
    await fs.ensureDir(pluginDir);

    const manifest: PluginManifest = {
      name,
      version: '1.0.0',
      description: `${name} plugin for MarkdownBot`,
      author: 'Your Name',
      main: 'index.js',
      markdownbotVersion: '^1.0.0',
    };

    await fs.writeFile(
      path.join(pluginDir, 'plugin.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );

    const pluginCode = `
// ${name} Plugin for MarkdownBot

module.exports = {
  hooks: {
    async beforeGenerate(context) {
      console.log('Before generate hook called');
      return context;
    },

    async afterGenerate(context, result) {
      console.log('After generate hook called');
      return result;
    },

    async beforeRender(template, data) {
      console.log('Before render hook called');
      return { template, data };
    },

    async afterRender(content) {
      console.log('After render hook called');
      return content;
    },

    async onTemplateLoad(template) {
      console.log('Template load hook called');
      return template;
    },

    async onError(error) {
      console.error('Error occurred:', error);
    }
  }
};
`;

    await fs.writeFile(
      path.join(pluginDir, 'index.js'),
      pluginCode.trim(),
      'utf-8'
    );

    const readme = `
# ${name} Plugin

Description of your plugin.

## Installation

Copy this directory to your MarkdownBot plugins folder.

## Usage

Enable the plugin in your MarkdownBot configuration.

## Hooks

This plugin implements the following hooks:

- beforeGenerate
- afterGenerate
- beforeRender
- afterRender
- onTemplateLoad
- onError

## License

MIT
`;

    await fs.writeFile(
      path.join(pluginDir, 'README.md'),
      readme.trim(),
      'utf-8'
    );

    this.logger.info(`Plugin template created at ${pluginDir}`);
  }
}
