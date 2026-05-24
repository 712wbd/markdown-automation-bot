import { UserInput, GenerationResult, TemplateConfig } from '@/types';
import { Logger } from '@/utils/logger';
import { FileSystemManager } from '@/utils/fileSystem';
import { TemplateEngine } from './TemplateEngine';
import { TemplateLibrary } from './TemplateLibrary';
import { marked } from 'marked';
import * as path from 'path';

export interface GenerationOptions {
  overwrite?: boolean;
  backup?: boolean;
  validate?: boolean;
  dryRun?: boolean;
  createDirs?: boolean;
}

export interface MarkdownValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  syntaxIssues: Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

export class FileGenerator {
  private logger: Logger;
  private fileSystem: FileSystemManager;
  private templateEngine: TemplateEngine;
  private templateLibrary: TemplateLibrary;

  constructor(
    fileSystem: FileSystemManager,
    templateEngine: TemplateEngine,
    templateLibrary: TemplateLibrary
  ) {
    this.logger = new Logger('FileGenerator');
    this.fileSystem = fileSystem;
    this.templateEngine = templateEngine;
    this.templateLibrary = templateLibrary;
  }

  public async generate(
    userInput: UserInput,
    options: GenerationOptions = {}
  ): Promise<GenerationResult> {
    const startTime = Date.now();

    try {
      this.logger.info(`Generating file: ${userInput.title}`);

      const template = this.templateLibrary.getTemplate(userInput.templateId!);
      if (!template) {
        return this.createErrorResult(`Template not found: ${userInput.templateId}`, userInput);
      }

      const content = this.templateEngine.renderTemplate(template, userInput);

      const validationResult = options.validate !== false 
        ? this.validateMarkdown(content)
        : { valid: true, errors: [], warnings: [], syntaxIssues: [] };

      if (!validationResult.valid) {
        this.logger.warn('Generated content has syntax issues');
        for (const issue of validationResult.syntaxIssues) {
          if (issue.severity === 'error') {
            this.logger.error(`Line ${issue.line}: ${issue.message}`);
          } else {
            this.logger.warn(`Line ${issue.line}: ${issue.message}`);
          }
        }
      }

      if (options.dryRun) {
        this.logger.info('Dry run mode - content not written to file');
        return {
          success: true,
          content,
          errors: [],
          warnings: validationResult.warnings,
          metadata: {
            templateId: template.id,
            generatedAt: new Date(),
            fileSize: Buffer.byteLength(content, 'utf-8'),
            lineCount: content.split('\n').length,
          },
        };
      }

      const filename = this.generateFilename(userInput, template);
      const filePath = path.join(userInput.outputPath, filename);

      await this.fileSystem.writeFile(filePath, content, {
        overwrite: options.overwrite !== false,
        backup: options.backup !== false,
        createDirs: options.createDirs !== false,
      });

      const duration = Date.now() - startTime;
      this.logger.success(`File generated successfully in ${duration}ms: ${filePath}`);

      return {
        success: true,
        filePath,
        content,
        errors: [],
        warnings: validationResult.warnings,
        metadata: {
          templateId: template.id,
          generatedAt: new Date(),
          fileSize: Buffer.byteLength(content, 'utf-8'),
          lineCount: content.split('\n').length,
        },
      };

    } catch (error) {
      this.logger.error('File generation failed:', error);
      return this.createErrorResult(
        error instanceof Error ? error.message : String(error),
        userInput
      );
    }
  }

  public async generateBatch(
    inputs: UserInput[],
    options: GenerationOptions = {}
  ): Promise<GenerationResult[]> {
    this.logger.info(`Starting batch generation for ${inputs.length} files`);

    const results: GenerationResult[] = [];

    for (const input of inputs) {
      try {
        const result = await this.generate(input, options);
        results.push(result);
      } catch (error) {
        results.push(
          this.createErrorResult(
            error instanceof Error ? error.message : String(error),
            input
          )
        );
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    this.logger.info(
      `Batch generation completed: ${successCount} succeeded, ${failureCount} failed`
    );

    return results;
  }

  public validateMarkdown(content: string): MarkdownValidationResult {
    const result: MarkdownValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      syntaxIssues: [],
    };

    try {
      marked.parse(content);
    } catch (error) {
      result.valid = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
      return result;
    }

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      const issues = this.checkLineSyntax(line, lineNumber);
      result.syntaxIssues.push(...issues);
    }

    const headerIssues = this.validateHeaders(content);
    result.syntaxIssues.push(...headerIssues);

    const linkIssues = this.validateLinks(content);
    result.syntaxIssues.push(...linkIssues);

    const codeBlockIssues = this.validateCodeBlocks(content);
    result.syntaxIssues.push(...codeBlockIssues);

    const errorCount = result.syntaxIssues.filter(i => i.severity === 'error').length;
    const warningCount = result.syntaxIssues.filter(i => i.severity === 'warning').length;

    result.valid = errorCount === 0;
    result.errors = result.syntaxIssues
      .filter(i => i.severity === 'error')
      .map(i => `Line ${i.line}: ${i.message}`);
    result.warnings = result.syntaxIssues
      .filter(i => i.severity === 'warning')
      .map(i => `Line ${i.line}: ${i.message}`);

    return result;
  }

  private checkLineSyntax(line: string, lineNumber: number): Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }> {
    const issues: Array<{
      line: number;
      column?: number;
      message: string;
      severity: 'error' | 'warning';
    }> = [];

    if (line.match(/\t/)) {
      issues.push({
        line: lineNumber,
        message: 'Line contains tabs, should use spaces',
        severity: 'warning',
      });
    }

    if (line.length > 0 && line.match(/[ \t]+$/)) {
      issues.push({
        line: lineNumber,
        message: 'Line has trailing whitespace',
        severity: 'warning',
      });
    }

    const unbalancedBrackets = this.checkUnbalancedBrackets(line);
    if (unbalancedBrackets.length > 0) {
      issues.push({
        line: lineNumber,
        message: `Unbalanced brackets: ${unbalancedBrackets.join(', ')}`,
        severity: 'error',
      });
    }

    return issues;
  }

  private checkUnbalancedBrackets(line: string): string[] {
    const issues: string[] = [];
    
    const brackets: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
    };

    const stack: string[] = [];
    const inCodeTick = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '`') {
        continue;
      }

      if (brackets[char]) {
        stack.push(char);
      } else if (Object.values(brackets).includes(char)) {
        const lastOpen = stack.pop();
        if (!lastOpen || brackets[lastOpen] !== char) {
          issues.push(`Mismatched ${char}`);
        }
      }
    }

    if (stack.length > 0) {
      issues.push(`Unclosed ${stack.join(', ')}`);
    }

    return issues;
  }

  private validateHeaders(content: string): Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }> {
    const issues: Array<{
      line: number;
      column?: number;
      message: string;
      severity: 'error' | 'warning';
    }> = [];

    const lines = content.split('\n');
    let previousHeaderLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];

        if (level - previousHeaderLevel > 1) {
          issues.push({
            line: i + 1,
            message: `Header level skipped (from h${previousHeaderLevel} to h${level})`,
            severity: 'warning',
          });
        }

        if (text.match(/^[a-z]/)) {
          issues.push({
            line: i + 1,
            message: 'Header should start with a capital letter',
            severity: 'warning',
          });
        }

        if (text.match(/\.$/)) {
          issues.push({
            line: i + 1,
            message: 'Header should not end with a period',
            severity: 'warning',
          });
        }

        previousHeaderLevel = level;
      }
    }

    return issues;
  }

  private validateLinks(content: string): Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }> {
    const issues: Array<{
      line: number;
      column?: number;
      message: string;
      severity: 'error' | 'warning';
    }> = [];

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, text, url] = match;

        if (!text || text.trim() === '') {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: 'Link text is empty',
            severity: 'warning',
          });
        }

        if (!url || url.trim() === '') {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: 'Link URL is empty',
            severity: 'error',
          });
        }
      }

      const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
      while ((match = imageRegex.exec(line)) !== null) {
        const [fullMatch, alt, url] = match;

        if (!alt || alt.trim() === '') {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: 'Image alt text is empty',
            severity: 'warning',
          });
        }

        if (!url || url.trim() === '') {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: 'Image URL is empty',
            severity: 'error',
          });
        }
      }
    }

    return issues;
  }

  private validateCodeBlocks(content: string): Array<{
    line: number;
    column?: number;
    message: string;
    severity: 'error' | 'warning';
  }> {
    const issues: Array<{
      line: number;
      column?: number;
      message: string;
      severity: 'error' | 'warning';
    }> = [];

    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockStartLine = 0;
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      if (line.match(/^```/)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockStartLine = lineNumber;
          const langMatch = line.match(/^```(\w+)/);
          codeBlockLanguage = langMatch ? langMatch[1] : '';

          if (!codeBlockLanguage) {
            issues.push({
              line: lineNumber,
              message: 'Code block should specify a language',
              severity: 'warning',
            });
          }
        } else {
          inCodeBlock = false;
        }
      }
    }

    if (inCodeBlock) {
      issues.push({
        line: codeBlockStartLine,
        message: 'Unclosed code block',
        severity: 'error',
      });
    }

    return issues;
  }

  private generateFilename(userInput: UserInput, template: TemplateConfig): string {
    if (userInput.filename) {
      return this.ensureMarkdownExtension(userInput.filename);
    }

    let filename: string;

    switch (template.id) {
      case 'github-readme':
        filename = 'README.md';
        break;
      case 'github-contributing':
        filename = 'CONTRIBUTING.md';
        break;
      case 'github-changelog':
        filename = 'CHANGELOG.md';
        break;
      case 'github-issue-bug':
        filename = 'bug-report.md';
        break;
      case 'github-pr':
        filename = 'pull-request.md';
        break;
      default:
        const titleSlug = userInput.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        filename = `${titleSlug}.md`;
    }

    return this.fileSystem.sanitizeFilename(filename);
  }

  private ensureMarkdownExtension(filename: string): string {
    if (!filename.match(/\.md$/i)) {
      return filename + '.md';
    }
    return filename;
  }

  private createErrorResult(message: string, userInput: UserInput): GenerationResult {
    return {
      success: false,
      errors: [message],
      warnings: [],
      metadata: {
        templateId: userInput.templateId || 'unknown',
        generatedAt: new Date(),
        fileSize: 0,
        lineCount: 0,
      },
    };
  }

  public async previewGeneration(userInput: UserInput): Promise<string> {
    const template = this.templateLibrary.getTemplate(userInput.templateId!);
    if (!template) {
      throw new Error(`Template not found: ${userInput.templateId}`);
    }

    return this.templateEngine.renderTemplate(template, userInput);
  }

  public getGenerationSummary(result: GenerationResult): string {
    const lines: string[] = [];

    lines.push('='.repeat(80));
    lines.push('Generation Summary');
    lines.push('='.repeat(80));
    lines.push(`Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    
    if (result.filePath) {
      lines.push(`Output File: ${result.filePath}`);
    }

    lines.push(`Template: ${result.metadata.templateId}`);
    lines.push(`Generated At: ${result.metadata.generatedAt.toISOString()}`);
    lines.push(`File Size: ${result.metadata.fileSize} bytes`);
    lines.push(`Line Count: ${result.metadata.lineCount}`);

    if (result.errors.length > 0) {
      lines.push('');
      lines.push('Errors:');
      result.errors.forEach(e => lines.push(`  - ${e}`));
    }

    if (result.warnings.length > 0) {
      lines.push('');
      lines.push('Warnings:');
      result.warnings.forEach(w => lines.push(`  - ${w}`));
    }

    lines.push('='.repeat(80));

    return lines.join('\n');
  }
}
