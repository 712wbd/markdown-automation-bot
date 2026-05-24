#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import ora from 'ora';
import Table from 'cli-table3';
import { Listr } from 'listr2';
import { Logger } from './utils/logger';
import { FileSystemManager } from './utils/fileSystem';
import { TemplateEngine } from './core/TemplateEngine';
import { TemplateLibrary } from './core/TemplateLibrary';
import { FileGenerator } from './core/FileGenerator';
import { allTemplates } from './templates';
import type { UserInput, TemplateCategory } from './types';
import * as path from 'path';

const program = new Command();
const logger = new Logger('CLI');

const fileSystem = new FileSystemManager();
const templateEngine = new TemplateEngine();
const templateLibrary = new TemplateLibrary();
const fileGenerator = new FileGenerator(fileSystem, templateEngine, templateLibrary);

for (const template of allTemplates) {
  templateLibrary.registerTemplate(template);
}

function displayBanner(): void {
  console.clear();
  const banner = figlet.textSync('MarkdownBot', {
    font: 'Standard',
    horizontalLayout: 'default',
  });
  
  console.log(chalk.cyan(banner));
  console.log(
    boxen(
      chalk.white.bold('🤖 Enterprise Markdown Automation Bot\n\n') +
      chalk.gray('Generate professional Markdown files with ease\n') +
      chalk.gray('Supports GitHub, Documentation, API Docs, and more'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
      }
    )
  );
}

program
  .name('mdbot')
  .description('🤖 Enterprise Markdown Automation Bot')
  .version('1.0.0');

program
  .command('generate')
  .alias('gen')
  .alias('g')
  .description('Generate a Markdown file from a template')
  .option('-t, --template <id>', 'Template ID')
  .option('-c, --category <category>', 'Template category')
  .option('-o, --output <path>', 'Output directory path', process.cwd())
  .option('-f, --filename <name>', 'Output filename')
  .option('--no-validate', 'Skip Markdown syntax validation')
  .option('--no-backup', 'Do not create backup of existing files')
  .option('--dry-run', 'Preview output without writing file')
  .option('-i, --interactive', 'Interactive mode')
  .action(async (options) => {
    try {
      displayBanner();

      if (options.interactive) {
        await interactiveGenerate(options);
      } else {
        await quickGenerate(options);
      }
    } catch (error) {
      logger.error('Generation failed:', error);
      process.exit(1);
    }
  });

program
  .command('list')
  .alias('ls')
  .description('List all available templates')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    displayBanner();

    let templates = templateLibrary.getAllTemplates();

    if (options.category) {
      templates = templateLibrary.getTemplatesByCategory(options.category as TemplateCategory);
    }

    if (options.tag) {
      templates = templates.filter(t => t.tags.includes(options.tag));
    }

    if (options.json) {
      console.log(JSON.stringify(templates, null, 2));
      return;
    }

    if (templates.length === 0) {
      logger.warn('No templates found matching the criteria');
      return;
    }

    const table = new Table({
      head: [
        chalk.cyan('ID'),
        chalk.cyan('Name'),
        chalk.cyan('Category'),
        chalk.cyan('Tags'),
      ],
      colWidths: [25, 30, 15, 30],
      wordWrap: true,
    });

    templates.forEach(t => {
      table.push([
        t.id,
        t.name,
        t.category,
        t.tags.join(', '),
      ]);
    });

    console.log('\n' + table.toString() + '\n');
    logger.info(`Total templates: ${templates.length}`);
  });

program
  .command('info <template-id>')
  .description('Show detailed information about a template')
  .action(async (templateId) => {
    displayBanner();

    const template = templateLibrary.getTemplate(templateId);

    if (!template) {
      logger.error(`Template not found: ${templateId}`);
      process.exit(1);
    }

    console.log(
      boxen(
        chalk.cyan.bold(template.name) + '\n\n' +
        chalk.white(template.description) + '\n\n' +
        chalk.gray(`ID: ${template.id}`) + '\n' +
        chalk.gray(`Category: ${template.category}`) + '\n' +
        chalk.gray(`Tags: ${template.tags.join(', ')}`),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
        }
      )
    );

    logger.info(`\n${chalk.bold('Required Fields:')}`);
    const requiredFields = template.fields.filter(f => f.required);
    requiredFields.forEach(field => {
      console.log(`  ${chalk.green('•')} ${chalk.white(field.label)} ${chalk.gray(`(${field.type})`)}`);
      if (field.placeholder) {
        console.log(`    ${chalk.gray('Placeholder:')} ${field.placeholder}`);
      }
    });

    const optionalFields = template.fields.filter(f => !f.required);
    if (optionalFields.length > 0) {
      logger.info(`\n${chalk.bold('Optional Fields:')}`);
      optionalFields.forEach(field => {
        console.log(`  ${chalk.yellow('•')} ${chalk.white(field.label)} ${chalk.gray(`(${field.type})`)}`);
      });
    }

    console.log();
  });

program
  .command('categories')
  .alias('cat')
  .description('List all template categories')
  .action(async () => {
    displayBanner();

    const templates = templateLibrary.getAllTemplates();
    const categories = new Map<TemplateCategory, number>();

    templates.forEach(t => {
      categories.set(t.category, (categories.get(t.category) || 0) + 1);
    });

    const table = new Table({
      head: [chalk.cyan('Category'), chalk.cyan('Count')],
      colWidths: [30, 10],
    });

    for (const [category, count] of categories.entries()) {
      table.push([category, count.toString()]);
    }

    console.log('\n' + table.toString() + '\n');
  });

program
  .command('validate <file>')
  .description('Validate a Markdown file for syntax errors')
  .action(async (file) => {
    displayBanner();

    const spinner = ora('Reading file...').start();

    try {
      const content = await fileSystem.readFile(file);
      spinner.text = 'Validating Markdown syntax...';

      const result = fileGenerator.validateMarkdown(content);

      spinner.stop();

      if (result.valid) {
        logger.success('✓ Markdown file is valid!');
      } else {
        logger.error('✗ Markdown file has errors:');
        result.errors.forEach(e => console.log(`  ${chalk.red('•')} ${e}`));
      }

      if (result.warnings.length > 0) {
        logger.warn('Warnings:');
        result.warnings.forEach(w => console.log(`  ${chalk.yellow('•')} ${w}`));
      }

      console.log(`\nTotal issues: ${result.syntaxIssues.length}`);
      console.log(`  Errors: ${result.errors.length}`);
      console.log(`  Warnings: ${result.warnings.length}`);

    } catch (error) {
      spinner.fail('Validation failed');
      logger.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('batch <config-file>')
  .description('Generate multiple files from a configuration file')
  .option('-o, --output <path>', 'Output directory', process.cwd())
  .action(async (configFile, options) => {
    displayBanner();

    try {
      logger.info(`Loading batch configuration: ${configFile}`);
      const config = await import(path.resolve(configFile));
      const inputs: UserInput[] = config.default || config.inputs;

      if (!Array.isArray(inputs) || inputs.length === 0) {
        logger.error('Invalid batch configuration');
        process.exit(1);
      }

      logger.info(`Processing ${inputs.length} files...`);

      const tasks = new Listr(
        inputs.map((input, index) => ({
          title: `Generating ${input.title || `file-${index + 1}`}`,
          task: async () => {
            const result = await fileGenerator.generate({
              ...input,
              outputPath: options.output,
            });
            if (!result.success) {
              throw new Error(result.errors?.join(', ') || 'Generation failed');
            }
          },
        })),
        { concurrent: false }
      );

      await tasks.run();

      logger.success(`\nBatch generation completed successfully!`);

    } catch (error) {
      logger.error('Batch generation failed:', error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new MarkdownBot configuration')
  .option('-d, --dir <path>', 'Directory to initialize', process.cwd())
  .action(async (options) => {
    displayBanner();

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-project',
      },
      {
        type: 'checkbox',
        name: 'templates',
        message: 'Select templates to include:',
        choices: [
          { name: 'GitHub README', value: 'github-readme' },
          { name: 'Contributing Guidelines', value: 'github-contributing' },
          { name: 'Changelog', value: 'github-changelog' },
          { name: 'Technical Design Doc', value: 'tech-design-doc' },
          { name: 'API Documentation', value: 'api-documentation' },
          { name: 'Meeting Notes', value: 'meeting-notes' },
        ],
      },
    ]);

    const configPath = path.join(options.dir, '.mdbotrc.json');
    const config = {
      projectName: answers.projectName,
      templates: answers.templates,
      outputPath: './docs',
    };

    await fileSystem.writeFile(configPath, JSON.stringify(config, null, 2), {
      overwrite: false,
    });

    logger.success(`Configuration created: ${configPath}`);
  });

program
  .command('search <query>')
  .description('Search for templates by keyword')
  .action(async (query) => {
    displayBanner();

    const matches = templateLibrary.searchTemplates({
      keywords: [query],
      fuzzySearch: true,
    });

    if (matches.length === 0) {
      logger.warn(`No templates found matching: ${query}`);
      return;
    }

    logger.info(`Found ${matches.length} matching templates:\n`);

    matches.forEach(match => {
      console.log(
        `${chalk.green('•')} ${chalk.white.bold(match.template.name)} ` +
        chalk.gray(`[${match.template.id}]`) +
        ` ${chalk.yellow(`(score: ${match.score})`)}`
      );
      console.log(`  ${chalk.gray(match.template.description)}`);
      console.log(`  ${chalk.cyan('Matched:')} ${match.matchedFields.join(', ')}\n`);
    });
  });

program
  .command('stats')
  .description('Show statistics about templates')
  .action(async () => {
    displayBanner();

    const stats = templateLibrary.getStatistics();

    console.log(
      boxen(
        chalk.cyan.bold('📊 Template Statistics\n\n') +
        chalk.white(`Total Templates: ${stats.total}\n`) +
        chalk.white(`Total Fields: ${stats.totalFields}\n`) +
        chalk.white(`Total Sections: ${stats.totalSections}`),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
        }
      )
    );

    const table = new Table({
      head: [chalk.cyan('Category'), chalk.cyan('Count')],
      colWidths: [30, 10],
    });

    for (const [category, count] of Object.entries(stats.byCategory)) {
      table.push([category, count.toString()]);
    }

    console.log('\n' + table.toString() + '\n');
  });

async function interactiveGenerate(options: any): Promise<void> {
  const { templateId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateId',
      message: 'Select a template:',
      choices: templateLibrary.getAllTemplates().map(t => ({
        name: `${t.name} (${t.category})`,
        value: t.id,
      })),
    },
  ]);

  const template = templateLibrary.getTemplate(templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  logger.info(`\n${chalk.bold('Template:')} ${template.name}`);
  logger.info(`${chalk.gray(template.description)}\n`);

  const fields: Record<string, any> = {};

  for (const field of template.fields) {
    const prompt: any = {
      name: field.name,
      message: field.label + (field.required ? chalk.red(' *') : ''),
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        prompt.type = 'input';
        break;
      case 'textarea':
        prompt.type = 'editor';
        break;
      case 'number':
        prompt.type = 'number';
        break;
      case 'select':
        prompt.type = 'list';
        prompt.choices = field.options;
        break;
      case 'array':
        prompt.type = 'input';
        prompt.message += chalk.gray(' (comma-separated)');
        (prompt as any).filter = (input: string) => input.split(',').map((s: string) => s.trim());
        break;
      default:
        prompt.type = 'input';
    }

    if (field.required) {
      prompt.validate = (input: any) => {
        if (!input || (typeof input === 'string' && input.trim() === '')) {
          return 'This field is required';
        }
        return true;
      };
    }

    const answer = await inquirer.prompt([prompt]);
    fields[field.name] = answer[field.name];
  }

  const { outputPath, filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputPath',
      message: 'Output directory:',
      default: options.output || process.cwd(),
    },
    {
      type: 'input',
      name: 'filename',
      message: 'Filename (optional):',
      default: options.filename,
    },
  ]);

  const userInput: UserInput = {
    templateId: template.id,
    category: template.category,
    title: fields.title || fields.projectName || 'Untitled',
    fields,
    outputPath,
    filename,
    overwrite: true,
  };

  if (options.dryRun) {
    logger.info('\n' + chalk.bold('Preview Mode') + '\n');
    const content = await fileGenerator.previewGeneration(userInput);
    console.log(
      boxen(content, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
      })
    );
    return;
  }

  const spinner = ora('Generating file...').start();

  try {
    const result = await fileGenerator.generate(userInput, {
      validate: options.validate !== false,
      backup: options.backup !== false,
    });

    spinner.stop();

    if (result.success) {
      logger.success(`\n✓ File generated successfully!`);
      console.log(
        boxen(
          chalk.white.bold('Generation Summary\n\n') +
          chalk.gray(`File: ${result.filePath}\n`) +
          chalk.gray(`Size: ${result.metadata.fileSize} bytes\n`) +
          chalk.gray(`Lines: ${result.metadata.lineCount}`),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
          }
        )
      );

      if (result.warnings && result.warnings.length > 0) {
        logger.warn('\nWarnings:');
        result.warnings.forEach(w => console.log(`  ${chalk.yellow('•')} ${w}`));
      }
    } else {
      logger.error('Generation failed:');
      result.errors?.forEach(e => console.log(`  ${chalk.red('•')} ${e}`));
    }
  } catch (error) {
    spinner.fail('Generation failed');
    throw error;
  }
}

async function quickGenerate(options: any): Promise<void> {
  if (!options.template && !options.category) {
    logger.error('Please specify either --template or --category, or use --interactive mode');
    process.exit(1);
  }

  const template = options.template
    ? templateLibrary.getTemplate(options.template)
    : templateLibrary.getTemplatesByCategory(options.category)[0];

  if (!template) {
    logger.error('Template not found');
    process.exit(1);
  }

  logger.info(`Using template: ${template.name}`);
  logger.error('Quick mode requires a configuration file or use --interactive mode');
  process.exit(1);
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  displayBanner();
  program.outputHelp();
}
