export { Logger } from './utils/logger';
export { FileSystemManager } from './utils/fileSystem';
export { TemplateEngine } from './core/TemplateEngine';
export { TemplateLibrary } from './core/TemplateLibrary';
export { InputParser } from './core/InputParser';
export { FileGenerator } from './core/FileGenerator';

export * from './types';
export * from './templates';

import { FileSystemManager } from './utils/fileSystem';
import { TemplateEngine } from './core/TemplateEngine';
import { TemplateLibrary } from './core/TemplateLibrary';
import { InputParser } from './core/InputParser';
import { FileGenerator } from './core/FileGenerator';
import { allTemplates } from './templates';
import type { UserInput, GenerationResult } from './types';

export class MarkdownBot {
  private fileSystem: FileSystemManager;
  private templateEngine: TemplateEngine;
  private templateLibrary: TemplateLibrary;
  private inputParser: InputParser;
  private fileGenerator: FileGenerator;

  constructor() {
    this.fileSystem = new FileSystemManager();
    this.templateEngine = new TemplateEngine();
    this.templateLibrary = new TemplateLibrary();
    this.inputParser = new InputParser(this.templateLibrary);
    this.fileGenerator = new FileGenerator(
      this.fileSystem,
      this.templateEngine,
      this.templateLibrary
    );

    for (const template of allTemplates) {
      this.templateLibrary.registerTemplate(template);
    }
  }

  public async generate(userInput: UserInput): Promise<GenerationResult> {
    return this.fileGenerator.generate(userInput);
  }

  public async generateBatch(inputs: UserInput[]): Promise<GenerationResult[]> {
    return this.fileGenerator.generateBatch(inputs);
  }

  public listTemplates(): void {
    this.templateLibrary.listTemplates();
  }

  public getTemplateInfo(templateId: string): string {
    return this.templateLibrary.getTemplateInfo(templateId);
  }

  public validateMarkdown(content: string) {
    return this.fileGenerator.validateMarkdown(content);
  }

  public parseInput(rawInput: Record<string, any>) {
    return this.inputParser.parseAndValidate(rawInput);
  }
}

export default MarkdownBot;
