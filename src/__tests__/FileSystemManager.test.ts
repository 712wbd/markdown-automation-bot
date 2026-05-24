import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileSystemManager } from '@/utils/fileSystem';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('FileSystemManager', () => {
  let fsManager: FileSystemManager;
  let testDir: string;

  beforeEach(async () => {
    fsManager = new FileSystemManager();
    testDir = path.join(os.tmpdir(), `mdbot-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('sanitizeFilename', () => {
    it('should remove special characters', () => {
      const filename = 'test<>:"/\\|?*file.md';
      const sanitized = fsManager.sanitizeFilename(filename);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).not.toContain(':');
      expect(sanitized).not.toContain('"');
    });

    it('should replace spaces with hyphens', () => {
      const filename = 'my test file.md';
      const sanitized = fsManager.sanitizeFilename(filename);
      expect(sanitized).toBe('my-test-file.md');
    });

    it('should convert to lowercase', () => {
      const filename = 'MyTestFile.MD';
      const sanitized = fsManager.sanitizeFilename(filename);
      expect(sanitized).toBe('mytestfile.md');
    });

    it('should truncate long filenames', () => {
      const longFilename = 'a'.repeat(300) + '.md';
      const sanitized = fsManager.sanitizeFilename(longFilename);
      expect(sanitized.length).toBeLessThanOrEqual(255);
    });

    it('should preserve file extension', () => {
      const filename = 'test-file.md';
      const sanitized = fsManager.sanitizeFilename(filename);
      expect(sanitized).toEndWith('.md');
    });

    it('should remove leading and trailing dots', () => {
      const filename = '...test-file...md';
      const sanitized = fsManager.sanitizeFilename(filename);
      expect(sanitized).not.toStartWith('.');
      expect(sanitized).not.toMatch(/\.{2,}/);
    });
  });

  describe('writeFile', () => {
    it('should write file successfully', async () => {
      const filePath = path.join(testDir, 'test.md');
      const content = '# Test Content';

      await fsManager.writeFile(filePath, content);

      const exists = await fs.pathExists(filePath);
      expect(exists).toBe(true);

      const readContent = await fs.readFile(filePath, 'utf-8');
      expect(readContent).toBe(content);
    });

    it('should create directories automatically', async () => {
      const filePath = path.join(testDir, 'sub', 'dir', 'test.md');
      const content = '# Test';

      await fsManager.writeFile(filePath, content, { createDirs: true });

      const exists = await fs.pathExists(filePath);
      expect(exists).toBe(true);
    });

    it('should generate unique filename when file exists and overwrite is false', async () => {
      const filePath = path.join(testDir, 'test.md');
      await fsManager.writeFile(filePath, 'Original');
      
      const newPath = await fsManager.writeFile(filePath, 'New', { overwrite: false });

      expect(newPath).not.toBe(filePath);
      expect(newPath).toContain('test-');
    });

    it('should create backup when overwriting', async () => {
      const filePath = path.join(testDir, 'test.md');
      await fsManager.writeFile(filePath, 'Original');

      await fsManager.writeFile(filePath, 'Updated', { overwrite: true, backup: true });

      const backupFiles = await fs.readdir(testDir);
      const hasBackup = backupFiles.some(f => f.includes('.backup.'));
      expect(hasBackup).toBe(true);
    });
  });

  describe('validatePath', () => {
    it('should validate correct paths', async () => {
      const validPath = path.join(testDir, 'valid-file.md');
      const result = await fsManager.validatePath(validPath);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid characters', async () => {
      const invalidPath = 'C:\\test\\<invalid>\\file.md';
      const result = await fsManager.validatePath(invalidPath);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn about long paths', async () => {
      const longPath = 'C:\\' + 'a'.repeat(300) + '\\file.md';
      const result = await fsManager.validatePath(longPath);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename when file exists', async () => {
      const filePath = path.join(testDir, 'test.md');
      await fs.writeFile(filePath, 'test');

      const uniquePath = await fsManager.generateUniqueFilename(filePath);

      expect(uniquePath).not.toBe(filePath);
      expect(uniquePath).toContain('test-1.md');
    });

    it('should increment counter for multiple existing files', async () => {
      const basePath = path.join(testDir, 'test.md');
      await fs.writeFile(basePath, 'test');
      await fs.writeFile(path.join(testDir, 'test-1.md'), 'test1');
      await fs.writeFile(path.join(testDir, 'test-2.md'), 'test2');

      const uniquePath = await fsManager.generateUniqueFilename(basePath);

      expect(uniquePath).toContain('test-3.md');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(testDir, 'exists.md');
      await fs.writeFile(filePath, 'test');

      const exists = await fsManager.fileExists(filePath);
      expect(exists).toBe(true);
    });

    it('should return false for non-existing file', async () => {
      const filePath = path.join(testDir, 'not-exists.md');

      const exists = await fsManager.fileExists(filePath);
      expect(exists).toBe(false);
    });
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const filePath = path.join(testDir, 'read.md');
      const content = '# Test Content';
      await fs.writeFile(filePath, content);

      const readContent = await fsManager.readFile(filePath);
      expect(readContent).toBe(content);
    });

    it('should throw error for non-existing file', async () => {
      const filePath = path.join(testDir, 'not-exists.md');

      await expect(fsManager.readFile(filePath)).rejects.toThrow();
    });
  });

  describe('backupFile', () => {
    it('should create backup file', async () => {
      const filePath = path.join(testDir, 'backup.md');
      await fs.writeFile(filePath, 'Original content');

      const backupPath = await fsManager.backupFile(filePath);

      expect(backupPath).toContain('.backup.');
      const backupExists = await fs.pathExists(backupPath);
      expect(backupExists).toBe(true);

      const backupContent = await fs.readFile(backupPath, 'utf-8');
      expect(backupContent).toBe('Original content');
    });
  });

  describe('getFileStats', () => {
    it('should return file statistics', async () => {
      const filePath = path.join(testDir, 'stats.md');
      await fs.writeFile(filePath, 'Test content');

      const stats = await fsManager.getFileStats(filePath);

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('created');
      expect(stats).toHaveProperty('modified');
      expect(stats).toHaveProperty('isFile');
      expect(stats.isFile).toBe(true);
    });
  });

  describe('searchFiles', () => {
    it('should find files by search term', async () => {
      await fs.writeFile(path.join(testDir, 'test-1.md'), 'search term here');
      await fs.writeFile(path.join(testDir, 'test-2.md'), 'no match');
      await fs.writeFile(path.join(testDir, 'test-3.md'), 'search term also here');

      const results = await fsManager.searchFiles(testDir, 'search term');

      expect(results.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', async () => {
      const filePath = path.join(testDir, 'empty.md');
      await fsManager.writeFile(filePath, '');

      const content = await fsManager.readFile(filePath);
      expect(content).toBe('');
    });

    it('should handle very large content', async () => {
      const filePath = path.join(testDir, 'large.md');
      const largeContent = 'x'.repeat(1000000);

      await fsManager.writeFile(filePath, largeContent);

      const content = await fsManager.readFile(filePath);
      expect(content.length).toBe(1000000);
    });

    it('should handle unicode characters', async () => {
      const filePath = path.join(testDir, 'unicode.md');
      const unicodeContent = '你好世界 🌍 مرحبا';

      await fsManager.writeFile(filePath, unicodeContent);

      const content = await fsManager.readFile(filePath);
      expect(content).toBe(unicodeContent);
    });
  });
});
