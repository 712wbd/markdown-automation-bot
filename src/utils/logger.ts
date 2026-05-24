import chalk from 'chalk';
import { LogLevel } from '../types/index.js';

export class Logger {
  private prefix: string;
  private enableColors: boolean;
  private minLevel: LogLevel;

  constructor(prefix: string = 'MarkdownBot', enableColors: boolean = true) {
    this.prefix = prefix;
    this.enableColors = enableColors;
    this.minLevel = 'info';
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(this.minLevel);
    const logIndex = levels.indexOf(level);
    return logIndex >= currentIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(a => JSON.stringify(a)).join(' ') : '';
    return `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    
    const formatted = this.formatMessage('debug', message, ...args);
    if (this.enableColors) {
      console.log(chalk.gray(formatted));
    } else {
      console.log(formatted);
    }
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    
    const formatted = this.formatMessage('info', message, ...args);
    if (this.enableColors) {
      console.log(chalk.blue(formatted));
    } else {
      console.log(formatted);
    }
  }

  success(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(a => JSON.stringify(a)).join(' ') : '';
    const formatted = `[${timestamp}] [${this.prefix}] [SUCCESS] ${message}${formattedArgs}`;
    
    if (this.enableColors) {
      console.log(chalk.green(formatted));
    } else {
      console.log(formatted);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    
    const formatted = this.formatMessage('warn', message, ...args);
    if (this.enableColors) {
      console.warn(chalk.yellow(formatted));
    } else {
      console.warn(formatted);
    }
  }

  error(message: string, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    
    const formatted = this.formatMessage('error', message, ...args);
    if (this.enableColors) {
      console.error(chalk.red(formatted));
    } else {
      console.error(formatted);
    }
  }

  box(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info'): void {
    const border = '═'.repeat(message.length + 4);
    const content = `║ ${message} ║`;
    
    let color: (text: string) => string;
    switch (type) {
      case 'success':
        color = chalk.green;
        break;
      case 'warn':
        color = chalk.yellow;
        break;
      case 'error':
        color = chalk.red;
        break;
      default:
        color = chalk.blue;
    }

    if (this.enableColors) {
      console.log(color(`╔${border}╗`));
      console.log(color(content));
      console.log(color(`╚${border}╝`));
    } else {
      console.log(`╔${border}╗`);
      console.log(content);
      console.log(`╚${border}╝`);
    }
  }

  table(headers: string[], rows: string[][]): void {
    const columnWidths = headers.map((header, i) => {
      const maxRowWidth = Math.max(...rows.map(row => (row[i] || '').length));
      return Math.max(header.length, maxRowWidth);
    });

    const separator = '─'.repeat(columnWidths.reduce((sum, w) => sum + w + 3, 0) + 1);
    
    console.log(`┌${separator}┐`);
    
    const headerRow = headers.map((h, i) => h.padEnd(columnWidths[i])).join(' │ ');
    console.log(`│ ${headerRow} │`);
    
    console.log(`├${separator}┤`);
    
    rows.forEach(row => {
      const rowStr = row.map((cell, i) => (cell || '').padEnd(columnWidths[i])).join(' │ ');
      console.log(`│ ${rowStr} │`);
    });
    
    console.log(`└${separator}┘`);
  }

  progress(message: string, current: number, total: number): void {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filled = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
    
    const progressMsg = `${message} [${bar}] ${percentage}% (${current}/${total})`;
    
    if (this.enableColors) {
      process.stdout.write('\r' + chalk.cyan(progressMsg));
    } else {
      process.stdout.write('\r' + progressMsg);
    }
    
    if (current === total) {
      console.log();
    }
  }

  spinner(message: string): { stop: (finalMessage?: string) => void } {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    let running = true;

    const interval = setInterval(() => {
      if (!running) return;
      const frame = frames[i % frames.length];
      if (this.enableColors) {
        process.stdout.write(`\r${chalk.cyan(frame)} ${message}`);
      } else {
        process.stdout.write(`\r${frame} ${message}`);
      }
      i++;
    }, 80);

    return {
      stop: (finalMessage?: string) => {
        running = false;
        clearInterval(interval);
        process.stdout.write('\r');
        if (finalMessage) {
          if (this.enableColors) {
            console.log(chalk.green('✓ ' + finalMessage));
          } else {
            console.log('✓ ' + finalMessage);
          }
        } else {
          console.log();
        }
      },
    };
  }

  group(title: string, callback: () => void): void {
    console.log('\n' + chalk.bold.underline(title));
    callback();
    console.log();
  }

  divider(char: string = '─', length: number = 60): void {
    console.log(char.repeat(length));
  }

  clear(): void {
    console.clear();
  }

  newLine(count: number = 1): void {
    console.log('\n'.repeat(count - 1));
  }
}

export const logger = new Logger();
