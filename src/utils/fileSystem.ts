import fs from 'fs-extra';
import path from 'path';
import { FileSystemOptions } from '../types/index.js';
import { logger } from './logger.js';

export class FileSystemManager {
  private maxFilenameLength: number;

  constructor(maxFilenameLength: number = 255) {
    this.maxFilenameLength = maxFilenameLength;
  }

  sanitizeFilename(filename: string): string {
    let sanitized = filename
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\.{2,}/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .toLowerCase();

    const extIndex = sanitized.lastIndexOf('.');
    const name = extIndex > 0 ? sanitized.substring(0, extIndex) : sanitized;
    const ext = extIndex > 0 ? sanitized.substring(extIndex) : '';

    const maxNameLength = this.maxFilenameLength - ext.length;
    const truncatedName = name.length > maxNameLength ? name.substring(0, maxNameLength) : name;

    return truncatedName + ext;
  }

  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
      logger.debug(`Directory ensured: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to ensure directory: ${dirPath}`, error);
      throw new Error(`Cannot create directory: ${dirPath}`);
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  async writeFile(
    filePath: string,
    content: string,
    options: FileSystemOptions = {}
  ): Promise<string> {
    const {
      createDirs = true,
      overwrite = false,
      backup = true,
    } = options;

    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);
    const sanitized = this.sanitizeFilename(filename);
    const finalPath = path.join(dir, sanitized);

    if (createDirs) {
      await this.ensureDirectory(dir);
    }

    const exists = await this.fileExists(finalPath);

    if (exists && !overwrite) {
      const newPath = await this.generateUniqueFilename(finalPath);
      logger.warn(`File exists, using alternate name: ${newPath}`);
      await fs.writeFile(newPath, content, 'utf-8');
      return newPath;
    }

    if (exists && backup) {
      await this.backupFile(finalPath);
    }

    await fs.writeFile(finalPath, content, 'utf-8');
    logger.success(`File written successfully: ${finalPath}`);
    return finalPath;
  }

  async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw new Error(`Cannot read file: ${filePath}`);
    }
  }

  async backupFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(dir, `${name}.backup.${timestamp}${ext}`);

    try {
      await fs.copy(filePath, backupPath);
      logger.info(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      logger.error(`Failed to create backup: ${filePath}`, error);
      throw new Error(`Cannot create backup: ${filePath}`);
    }
  }

  async generateUniqueFilename(filePath: string): Promise<string> {
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const dir = path.dirname(filePath);

    let counter = 1;
    let newPath = filePath;

    while (await this.fileExists(newPath)) {
      newPath = path.join(dir, `${name}-${counter}${ext}`);
      counter++;
      
      if (counter > 1000) {
        throw new Error('Cannot generate unique filename: too many attempts');
      }
    }

    return newPath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
      throw new Error(`Cannot delete file: ${filePath}`);
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    try {
      await fs.copy(source, destination);
      logger.info(`File copied: ${source} -> ${destination}`);
    } catch (error) {
      logger.error(`Failed to copy file: ${source}`, error);
      throw new Error(`Cannot copy file: ${source}`);
    }
  }

  async moveFile(source: string, destination: string): Promise<void> {
    try {
      await fs.move(source, destination);
      logger.info(`File moved: ${source} -> ${destination}`);
    } catch (error) {
      logger.error(`Failed to move file: ${source}`, error);
      throw new Error(`Cannot move file: ${source}`);
    }
  }

  async listFiles(dirPath: string, pattern?: RegExp): Promise<string[]> {
    try {
      const files = await fs.readdir(dirPath);
      
      if (pattern) {
        return files.filter(file => pattern.test(file));
      }
      
      return files;
    } catch (error) {
      logger.error(`Failed to list files: ${dirPath}`, error);
      throw new Error(`Cannot list files: ${dirPath}`);
    }
  }

  async getFileStats(filePath: string): Promise<{
    size: number;
    created: Date;
    modified: Date;
    lines: number;
  }> {
    try {
      const stats = await fs.stat(filePath);
      const content = await this.readFile(filePath);
      const lines = content.split('\n').length;

      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        lines,
      };
    } catch (error) {
      logger.error(`Failed to get file stats: ${filePath}`, error);
      throw new Error(`Cannot get file stats: ${filePath}`);
    }
  }

  async searchFiles(dirPath: string, searchTerm: string, recursive: boolean = true): Promise<string[]> {
    const results: string[] = [];

    async function search(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && recursive) {
          await search(fullPath);
        } else if (entry.isFile() && entry.name.includes(searchTerm)) {
          results.push(fullPath);
        }
      }
    }

    try {
      await search(dirPath);
      return results;
    } catch (error) {
      logger.error(`Failed to search files: ${dirPath}`, error);
      throw new Error(`Cannot search files: ${dirPath}`);
    }
  }

  async cleanDirectory(dirPath: string, olderThanDays?: number): Promise<number> {
    let deletedCount = 0;

    try {
      const files = await fs.readdir(dirPath);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);

        if (olderThanDays) {
          const daysDiff = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > olderThanDays) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
      }

      logger.info(`Cleaned ${deletedCount} files from ${dirPath}`);
      return deletedCount;
    } catch (error) {
      logger.error(`Failed to clean directory: ${dirPath}`, error);
      throw new Error(`Cannot clean directory: ${dirPath}`);
    }
  }

  async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    async function calculateSize(dir: string): Promise<void> {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await calculateSize(fullPath);
        } else if (entry.isFile()) {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        }
      }
    }

    try {
      await calculateSize(dirPath);
      return totalSize;
    } catch (error) {
      logger.error(`Failed to calculate directory size: ${dirPath}`, error);
      throw new Error(`Cannot calculate directory size: ${dirPath}`);
    }
  }

  formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  resolveRelativePath(relativePath: string, basePath: string = process.cwd()): string {
    return path.isAbsolute(relativePath) ? relativePath : path.resolve(basePath, relativePath);
  }

  async validatePath(filePath: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!filePath || filePath.trim() === '') {
      errors.push('Path cannot be empty');
      return { valid: false, errors, warnings };
    }

    const invalidChars = /[<>"|?*\x00-\x1F]/;
    if (invalidChars.test(filePath)) {
      errors.push('Path contains invalid characters');
    }

    if (filePath.length > 260) {
      warnings.push('Path length exceeds Windows MAX_PATH limit (260 characters)');
    }

    const dir = path.dirname(filePath);
    const dirExists = await this.directoryExists(dir);
    
    if (!dirExists) {
      warnings.push(`Directory does not exist: ${dir}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async createTempFile(prefix: string = 'mdbot', ext: string = '.md'): Promise<string> {
    const tmpDir = path.join(process.cwd(), '.tmp');
    await this.ensureDirectory(tmpDir);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${prefix}-${timestamp}-${random}${ext}`;
    const tempPath = path.join(tmpDir, filename);

    await fs.writeFile(tempPath, '', 'utf-8');
    logger.debug(`Temp file created: ${tempPath}`);

    return tempPath;
  }

  async cleanupTempFiles(directory: string = '.tmp'): Promise<number> {
    const tmpDir = path.join(process.cwd(), directory);
    
    if (!(await this.directoryExists(tmpDir))) {
      return 0;
    }

    const files = await fs.readdir(tmpDir);
    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(tmpDir, file);
      await fs.unlink(filePath);
      deletedCount++;
    }

    logger.info(`Cleaned up ${deletedCount} temp files`);
    return deletedCount;
  }
}

export const fileSystemManager = new FileSystemManager();
