#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FileGenerator: () => FileGenerator,
  FileSystemManager: () => FileSystemManager,
  InputParser: () => InputParser,
  Logger: () => Logger,
  MarkdownBot: () => MarkdownBot,
  TemplateEngine: () => TemplateEngine,
  TemplateLibrary: () => TemplateLibrary,
  allTemplates: () => allTemplates,
  apiDocumentationTemplate: () => apiDocumentationTemplate,
  blogPostTemplate: () => blogPostTemplate,
  default: () => index_default,
  documentationTemplates: () => documentationTemplates,
  getTemplateById: () => getTemplateById,
  getTemplatesByCategory: () => getTemplatesByCategory,
  getTemplatesByTags: () => getTemplatesByTags,
  githubChangelogTemplate: () => githubChangelogTemplate,
  githubContributingTemplate: () => githubContributingTemplate,
  githubIssueTemplate: () => githubIssueTemplate,
  githubPullRequestTemplate: () => githubPullRequestTemplate,
  githubReadmeTemplate: () => githubReadmeTemplate,
  githubTemplates: () => githubTemplates,
  learningNotesTemplate: () => learningNotesTemplate,
  learningTemplates: () => learningTemplates,
  meetingNotesTemplate: () => meetingNotesTemplate,
  projectProposalTemplate: () => projectProposalTemplate,
  researchNotesTemplate: () => researchNotesTemplate,
  technicalArticleTemplate: () => technicalArticleTemplate,
  technicalDesignDocTemplate: () => technicalDesignDocTemplate,
  tutorialTemplate: () => tutorialTemplate
});
module.exports = __toCommonJS(index_exports);

// src/utils/logger.ts
var import_chalk = __toESM(require("chalk"));
var Logger = class {
  prefix;
  enableColors;
  minLevel;
  constructor(prefix = "MarkdownBot", enableColors = true) {
    this.prefix = prefix;
    this.enableColors = enableColors;
    this.minLevel = "info";
  }
  setLevel(level) {
    this.minLevel = level;
  }
  shouldLog(level) {
    const levels = ["debug", "info", "warn", "error"];
    const currentIndex = levels.indexOf(this.minLevel);
    const logIndex = levels.indexOf(level);
    return logIndex >= currentIndex;
  }
  formatMessage(level, message, ...args) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const formattedArgs = args.length > 0 ? " " + args.map((a) => JSON.stringify(a)).join(" ") : "";
    return `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}] ${message}${formattedArgs}`;
  }
  debug(message, ...args) {
    if (!this.shouldLog("debug")) return;
    const formatted = this.formatMessage("debug", message, ...args);
    if (this.enableColors) {
      console.log(import_chalk.default.gray(formatted));
    } else {
      console.log(formatted);
    }
  }
  info(message, ...args) {
    if (!this.shouldLog("info")) return;
    const formatted = this.formatMessage("info", message, ...args);
    if (this.enableColors) {
      console.log(import_chalk.default.blue(formatted));
    } else {
      console.log(formatted);
    }
  }
  success(message, ...args) {
    if (!this.shouldLog("info")) return;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const formattedArgs = args.length > 0 ? " " + args.map((a) => JSON.stringify(a)).join(" ") : "";
    const formatted = `[${timestamp}] [${this.prefix}] [SUCCESS] ${message}${formattedArgs}`;
    if (this.enableColors) {
      console.log(import_chalk.default.green(formatted));
    } else {
      console.log(formatted);
    }
  }
  warn(message, ...args) {
    if (!this.shouldLog("warn")) return;
    const formatted = this.formatMessage("warn", message, ...args);
    if (this.enableColors) {
      console.warn(import_chalk.default.yellow(formatted));
    } else {
      console.warn(formatted);
    }
  }
  error(message, ...args) {
    if (!this.shouldLog("error")) return;
    const formatted = this.formatMessage("error", message, ...args);
    if (this.enableColors) {
      console.error(import_chalk.default.red(formatted));
    } else {
      console.error(formatted);
    }
  }
  box(message, type = "info") {
    const border = "\u2550".repeat(message.length + 4);
    const content = `\u2551 ${message} \u2551`;
    let color;
    switch (type) {
      case "success":
        color = import_chalk.default.green;
        break;
      case "warn":
        color = import_chalk.default.yellow;
        break;
      case "error":
        color = import_chalk.default.red;
        break;
      default:
        color = import_chalk.default.blue;
    }
    if (this.enableColors) {
      console.log(color(`\u2554${border}\u2557`));
      console.log(color(content));
      console.log(color(`\u255A${border}\u255D`));
    } else {
      console.log(`\u2554${border}\u2557`);
      console.log(content);
      console.log(`\u255A${border}\u255D`);
    }
  }
  table(headers, rows) {
    const columnWidths = headers.map((header, i) => {
      const maxRowWidth = Math.max(...rows.map((row) => (row[i] || "").length));
      return Math.max(header.length, maxRowWidth);
    });
    const separator = "\u2500".repeat(columnWidths.reduce((sum, w) => sum + w + 3, 0) + 1);
    console.log(`\u250C${separator}\u2510`);
    const headerRow = headers.map((h, i) => h.padEnd(columnWidths[i])).join(" \u2502 ");
    console.log(`\u2502 ${headerRow} \u2502`);
    console.log(`\u251C${separator}\u2524`);
    rows.forEach((row) => {
      const rowStr = row.map((cell, i) => (cell || "").padEnd(columnWidths[i])).join(" \u2502 ");
      console.log(`\u2502 ${rowStr} \u2502`);
    });
    console.log(`\u2514${separator}\u2518`);
  }
  progress(message, current, total) {
    const percentage = Math.round(current / total * 100);
    const barLength = 30;
    const filled = Math.round(percentage / 100 * barLength);
    const bar = "\u2588".repeat(filled) + "\u2591".repeat(barLength - filled);
    const progressMsg = `${message} [${bar}] ${percentage}% (${current}/${total})`;
    if (this.enableColors) {
      process.stdout.write("\r" + import_chalk.default.cyan(progressMsg));
    } else {
      process.stdout.write("\r" + progressMsg);
    }
    if (current === total) {
      console.log();
    }
  }
  spinner(message) {
    const frames = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
    let i = 0;
    let running = true;
    const interval = setInterval(() => {
      if (!running) return;
      const frame = frames[i % frames.length];
      if (this.enableColors) {
        process.stdout.write(`\r${import_chalk.default.cyan(frame)} ${message}`);
      } else {
        process.stdout.write(`\r${frame} ${message}`);
      }
      i++;
    }, 80);
    return {
      stop: (finalMessage) => {
        running = false;
        clearInterval(interval);
        process.stdout.write("\r");
        if (finalMessage) {
          if (this.enableColors) {
            console.log(import_chalk.default.green("\u2713 " + finalMessage));
          } else {
            console.log("\u2713 " + finalMessage);
          }
        } else {
          console.log();
        }
      }
    };
  }
  group(title, callback) {
    console.log("\n" + import_chalk.default.bold.underline(title));
    callback();
    console.log();
  }
  divider(char = "\u2500", length = 60) {
    console.log(char.repeat(length));
  }
  clear() {
    console.clear();
  }
  newLine(count = 1) {
    console.log("\n".repeat(count - 1));
  }
};
var logger = new Logger();

// src/utils/fileSystem.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var FileSystemManager = class {
  maxFilenameLength;
  constructor(maxFilenameLength = 255) {
    this.maxFilenameLength = maxFilenameLength;
  }
  sanitizeFilename(filename) {
    let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, "-").replace(/\.{2,}/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase();
    const extIndex = sanitized.lastIndexOf(".");
    const name = extIndex > 0 ? sanitized.substring(0, extIndex) : sanitized;
    const ext = extIndex > 0 ? sanitized.substring(extIndex) : "";
    const maxNameLength = this.maxFilenameLength - ext.length;
    const truncatedName = name.length > maxNameLength ? name.substring(0, maxNameLength) : name;
    return truncatedName + ext;
  }
  async ensureDirectory(dirPath) {
    try {
      await import_fs_extra.default.ensureDir(dirPath);
      logger.debug(`Directory ensured: ${dirPath}`);
    } catch (error) {
      logger.error(`Failed to ensure directory: ${dirPath}`, error);
      throw new Error(`Cannot create directory: ${dirPath}`);
    }
  }
  async fileExists(filePath) {
    try {
      await import_fs_extra.default.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  async directoryExists(dirPath) {
    try {
      const stats = await import_fs_extra.default.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }
  async writeFile(filePath, content, options = {}) {
    const {
      createDirs = true,
      overwrite = false,
      backup = true
    } = options;
    const dir = import_path.default.dirname(filePath);
    const filename = import_path.default.basename(filePath);
    const sanitized = this.sanitizeFilename(filename);
    const finalPath = import_path.default.join(dir, sanitized);
    if (createDirs) {
      await this.ensureDirectory(dir);
    }
    const exists = await this.fileExists(finalPath);
    if (exists && !overwrite) {
      const newPath = await this.generateUniqueFilename(finalPath);
      logger.warn(`File exists, using alternate name: ${newPath}`);
      await import_fs_extra.default.writeFile(newPath, content, "utf-8");
      return newPath;
    }
    if (exists && backup) {
      await this.backupFile(finalPath);
    }
    await import_fs_extra.default.writeFile(finalPath, content, "utf-8");
    logger.success(`File written successfully: ${finalPath}`);
    return finalPath;
  }
  async readFile(filePath) {
    try {
      const content = await import_fs_extra.default.readFile(filePath, "utf-8");
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${filePath}`, error);
      throw new Error(`Cannot read file: ${filePath}`);
    }
  }
  async backupFile(filePath) {
    const ext = import_path.default.extname(filePath);
    const name = import_path.default.basename(filePath, ext);
    const dir = import_path.default.dirname(filePath);
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const backupPath = import_path.default.join(dir, `${name}.backup.${timestamp}${ext}`);
    try {
      await import_fs_extra.default.copy(filePath, backupPath);
      logger.info(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      logger.error(`Failed to create backup: ${filePath}`, error);
      throw new Error(`Cannot create backup: ${filePath}`);
    }
  }
  async generateUniqueFilename(filePath) {
    const ext = import_path.default.extname(filePath);
    const name = import_path.default.basename(filePath, ext);
    const dir = import_path.default.dirname(filePath);
    let counter = 1;
    let newPath = filePath;
    while (await this.fileExists(newPath)) {
      newPath = import_path.default.join(dir, `${name}-${counter}${ext}`);
      counter++;
      if (counter > 1e3) {
        throw new Error("Cannot generate unique filename: too many attempts");
      }
    }
    return newPath;
  }
  async deleteFile(filePath) {
    try {
      await import_fs_extra.default.unlink(filePath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
      throw new Error(`Cannot delete file: ${filePath}`);
    }
  }
  async copyFile(source, destination) {
    try {
      await import_fs_extra.default.copy(source, destination);
      logger.info(`File copied: ${source} -> ${destination}`);
    } catch (error) {
      logger.error(`Failed to copy file: ${source}`, error);
      throw new Error(`Cannot copy file: ${source}`);
    }
  }
  async moveFile(source, destination) {
    try {
      await import_fs_extra.default.move(source, destination);
      logger.info(`File moved: ${source} -> ${destination}`);
    } catch (error) {
      logger.error(`Failed to move file: ${source}`, error);
      throw new Error(`Cannot move file: ${source}`);
    }
  }
  async listFiles(dirPath, pattern) {
    try {
      const files = await import_fs_extra.default.readdir(dirPath);
      if (pattern) {
        return files.filter((file) => pattern.test(file));
      }
      return files;
    } catch (error) {
      logger.error(`Failed to list files: ${dirPath}`, error);
      throw new Error(`Cannot list files: ${dirPath}`);
    }
  }
  async getFileStats(filePath) {
    try {
      const stats = await import_fs_extra.default.stat(filePath);
      const content = await this.readFile(filePath);
      const lines = content.split("\n").length;
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        lines
      };
    } catch (error) {
      logger.error(`Failed to get file stats: ${filePath}`, error);
      throw new Error(`Cannot get file stats: ${filePath}`);
    }
  }
  async searchFiles(dirPath, searchTerm, recursive = true) {
    const results = [];
    async function search(dir) {
      const entries = await import_fs_extra.default.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = import_path.default.join(dir, entry.name);
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
  async cleanDirectory(dirPath, olderThanDays) {
    let deletedCount = 0;
    try {
      const files = await import_fs_extra.default.readdir(dirPath);
      const now = Date.now();
      for (const file of files) {
        const filePath = import_path.default.join(dirPath, file);
        const stats = await import_fs_extra.default.stat(filePath);
        if (olderThanDays) {
          const daysDiff = (now - stats.mtime.getTime()) / (1e3 * 60 * 60 * 24);
          if (daysDiff > olderThanDays) {
            await import_fs_extra.default.unlink(filePath);
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
  async getDirectorySize(dirPath) {
    let totalSize = 0;
    async function calculateSize(dir) {
      const entries = await import_fs_extra.default.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = import_path.default.join(dir, entry.name);
        if (entry.isDirectory()) {
          await calculateSize(fullPath);
        } else if (entry.isFile()) {
          const stats = await import_fs_extra.default.stat(fullPath);
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
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  resolveRelativePath(relativePath, basePath = process.cwd()) {
    return import_path.default.isAbsolute(relativePath) ? relativePath : import_path.default.resolve(basePath, relativePath);
  }
  async validatePath(filePath) {
    const errors = [];
    const warnings = [];
    if (!filePath || filePath.trim() === "") {
      errors.push("Path cannot be empty");
      return { valid: false, errors, warnings };
    }
    const invalidChars = /[<>"|?*\x00-\x1F]/;
    if (invalidChars.test(filePath)) {
      errors.push("Path contains invalid characters");
    }
    if (filePath.length > 260) {
      warnings.push("Path length exceeds Windows MAX_PATH limit (260 characters)");
    }
    const dir = import_path.default.dirname(filePath);
    const dirExists = await this.directoryExists(dir);
    if (!dirExists) {
      warnings.push(`Directory does not exist: ${dir}`);
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  async createTempFile(prefix = "mdbot", ext = ".md") {
    const tmpDir = import_path.default.join(process.cwd(), ".tmp");
    await this.ensureDirectory(tmpDir);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${prefix}-${timestamp}-${random}${ext}`;
    const tempPath = import_path.default.join(tmpDir, filename);
    await import_fs_extra.default.writeFile(tempPath, "", "utf-8");
    logger.debug(`Temp file created: ${tempPath}`);
    return tempPath;
  }
  async cleanupTempFiles(directory = ".tmp") {
    const tmpDir = import_path.default.join(process.cwd(), directory);
    if (!await this.directoryExists(tmpDir)) {
      return 0;
    }
    const files = await import_fs_extra.default.readdir(tmpDir);
    let deletedCount = 0;
    for (const file of files) {
      const filePath = import_path.default.join(tmpDir, file);
      await import_fs_extra.default.unlink(filePath);
      deletedCount++;
    }
    logger.info(`Cleaned up ${deletedCount} temp files`);
    return deletedCount;
  }
};
var fileSystemManager = new FileSystemManager();

// src/core/TemplateEngine.ts
var TemplateEngine = class {
  logger;
  variableDelimiters;
  blockDelimiters;
  constructor(options) {
    this.logger = new Logger("TemplateEngine");
    this.variableDelimiters = options?.customDelimiters?.variable || ["{{", "}}"];
    this.blockDelimiters = options?.customDelimiters?.block || ["{%", "%}"];
  }
  render(template, context, options) {
    try {
      let result = template;
      result = this.processConditionals(result, context);
      result = this.processLoops(result, context);
      result = this.processVariables(result, context);
      result = this.processHelpers(result, context);
      if (!options?.preserveWhitespace) {
        result = this.normalizeWhitespace(result);
      }
      return result;
    } catch (error) {
      this.logger.error("Template rendering failed:", error);
      throw new Error(`Template rendering error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  renderTemplate(templateConfig, userInput) {
    const context = {
      data: {
        ...userInput.fields,
        title: userInput.title,
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        year: (/* @__PURE__ */ new Date()).getFullYear()
      },
      helpers: this.getDefaultHelpers()
    };
    let output = "";
    for (const section of templateConfig.sections) {
      const sectionContent = this.renderSection(section, context);
      if (sectionContent.trim()) {
        output += sectionContent + "\n\n";
      }
    }
    return output.trim();
  }
  renderSection(section, context) {
    if (section.condition && !this.evaluateCondition(section.condition, context)) {
      return "";
    }
    let content = section.content;
    if (section.repeat && section.repeat.items) {
      const items = this.resolveVariable(section.repeat.items, context);
      if (Array.isArray(items)) {
        content = items.map((item, index) => {
          const loopContext = {
            ...context,
            data: {
              ...context.data,
              [section.repeat.as || "item"]: item,
              index,
              first: index === 0,
              last: index === items.length - 1
            }
          };
          return this.render(content, loopContext);
        }).join("\n");
      }
    } else {
      content = this.render(content, context);
    }
    return content;
  }
  processVariables(template, context) {
    const [open, close] = this.variableDelimiters;
    const regex = new RegExp(`${this.escapeRegex(open)}\\s*([^${close}]+?)\\s*${this.escapeRegex(close)}`, "g");
    return template.replace(regex, (match, expression) => {
      try {
        const value = this.evaluateExpression(expression.trim(), context);
        return value !== void 0 && value !== null ? String(value) : "";
      } catch (error) {
        this.logger.warn(`Failed to resolve variable: ${expression}`);
        return match;
      }
    });
  }
  processConditionals(template, context) {
    const [open, close] = this.blockDelimiters;
    const ifRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*if\\s+([^${close}]+?)\\s*${this.escapeRegex(close)}([\\s\\S]*?)${this.escapeRegex(open)}\\s*endif\\s*${this.escapeRegex(close)}`,
      "g"
    );
    return template.replace(ifRegex, (match, condition, content) => {
      try {
        const elseMatch = content.match(
          new RegExp(`${this.escapeRegex(open)}\\s*else\\s*${this.escapeRegex(close)}`)
        );
        if (elseMatch) {
          const [ifContent, elseContent] = content.split(elseMatch[0]);
          return this.evaluateCondition(condition.trim(), context) ? this.render(ifContent, context) : this.render(elseContent, context);
        }
        return this.evaluateCondition(condition.trim(), context) ? this.render(content, context) : "";
      } catch (error) {
        this.logger.warn(`Failed to evaluate condition: ${condition}`);
        return "";
      }
    });
  }
  processLoops(template, context) {
    const [open, close] = this.blockDelimiters;
    const forRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*for\\s+(\\w+)\\s+in\\s+([^${close}]+?)\\s*${this.escapeRegex(close)}([\\s\\S]*?)${this.escapeRegex(open)}\\s*endfor\\s*${this.escapeRegex(close)}`,
      "g"
    );
    return template.replace(forRegex, (match, itemName, itemsExpr, loopContent) => {
      try {
        const items = this.evaluateExpression(itemsExpr.trim(), context);
        if (!Array.isArray(items)) {
          this.logger.warn(`Loop expression did not return an array: ${itemsExpr}`);
          return "";
        }
        return items.map((item, index) => {
          const loopContext = {
            ...context,
            data: {
              ...context.data,
              [itemName]: item,
              loop: {
                index,
                index0: index,
                index1: index + 1,
                first: index === 0,
                last: index === items.length - 1,
                length: items.length
              }
            }
          };
          return this.render(loopContent, loopContext);
        }).join("\n");
      } catch (error) {
        this.logger.warn(`Failed to process loop: ${itemsExpr}`);
        return "";
      }
    });
  }
  processHelpers(template, context) {
    const [open, close] = this.variableDelimiters;
    const helperRegex = new RegExp(
      `${this.escapeRegex(open)}\\s*(\\w+)\\s*\\(([^)]*)\\)\\s*${this.escapeRegex(close)}`,
      "g"
    );
    return template.replace(helperRegex, (match, helperName, argsStr) => {
      try {
        const helper = context.helpers?.[helperName];
        if (typeof helper !== "function") {
          return match;
        }
        const args = argsStr.split(",").map((arg) => this.evaluateExpression(arg.trim(), context)).filter((arg) => arg !== void 0);
        const result = helper(...args);
        return result !== void 0 && result !== null ? String(result) : "";
      } catch (error) {
        this.logger.warn(`Failed to execute helper: ${helperName}`);
        return match;
      }
    });
  }
  evaluateExpression(expression, context) {
    if (!expression) return void 0;
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.slice(1, -1);
    }
    if (expression.startsWith("'") && expression.endsWith("'")) {
      return expression.slice(1, -1);
    }
    if (/^\d+$/.test(expression)) {
      return parseInt(expression, 10);
    }
    if (/^\d+\.\d+$/.test(expression)) {
      return parseFloat(expression);
    }
    if (expression === "true") return true;
    if (expression === "false") return false;
    if (expression === "null") return null;
    if (expression === "undefined") return void 0;
    return this.resolveVariable(expression, context);
  }
  evaluateCondition(condition, context) {
    try {
      const operators = ["===", "!==", "==", "!=", ">=", "<=", ">", "<"];
      for (const op of operators) {
        if (condition.includes(op)) {
          const [left, right] = condition.split(op).map((s) => s.trim());
          const leftValue = this.evaluateExpression(left, context);
          const rightValue = this.evaluateExpression(right, context);
          switch (op) {
            case "===":
              return leftValue === rightValue;
            case "!==":
              return leftValue !== rightValue;
            case "==":
              return leftValue == rightValue;
            case "!=":
              return leftValue != rightValue;
            case ">=":
              return leftValue >= rightValue;
            case "<=":
              return leftValue <= rightValue;
            case ">":
              return leftValue > rightValue;
            case "<":
              return leftValue < rightValue;
          }
        }
      }
      const value = this.resolveVariable(condition, context);
      return Boolean(value);
    } catch (error) {
      return false;
    }
  }
  resolveVariable(path4, context) {
    const parts = path4.split(".");
    let current = context.data;
    for (const part of parts) {
      if (current === void 0 || current === null) {
        return void 0;
      }
      current = current[part];
    }
    return current;
  }
  normalizeWhitespace(content) {
    return content.replace(/\n{3,}/g, "\n\n").replace(/[ \t]+$/gm, "").trim();
  }
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  getDefaultHelpers() {
    return {
      uppercase: (str) => String(str).toUpperCase(),
      lowercase: (str) => String(str).toLowerCase(),
      capitalize: (str) => {
        const s = String(str);
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
      },
      titlecase: (str) => {
        return String(str).split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      },
      trim: (str) => String(str).trim(),
      default: (value, defaultValue) => {
        return value !== void 0 && value !== null && value !== "" ? value : defaultValue;
      },
      join: (arr, separator = ", ") => {
        return Array.isArray(arr) ? arr.join(separator) : String(arr);
      },
      length: (value) => {
        if (Array.isArray(value) || typeof value === "string") {
          return value.length;
        }
        return 0;
      },
      date: (format) => {
        const now = /* @__PURE__ */ new Date();
        if (format === "iso") return now.toISOString();
        if (format === "short") return now.toISOString().split("T")[0];
        return now.toLocaleDateString();
      },
      truncate: (str, length = 50, suffix = "...") => {
        const s = String(str);
        return s.length > length ? s.substring(0, length) + suffix : s;
      },
      replace: (str, search, replace) => {
        return String(str).replace(new RegExp(search, "g"), replace);
      },
      repeat: (str, count) => {
        return String(str).repeat(Math.max(0, count));
      },
      json: (obj, spaces = 2) => {
        return JSON.stringify(obj, null, spaces);
      },
      escape: (str) => {
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      }
    };
  }
  validateTemplate(template) {
    const errors = [];
    const [varOpen, varClose] = this.variableDelimiters;
    const [blockOpen, blockClose] = this.blockDelimiters;
    const varCount = (template.match(new RegExp(this.escapeRegex(varOpen), "g")) || []).length;
    const varCloseCount = (template.match(new RegExp(this.escapeRegex(varClose), "g")) || []).length;
    if (varCount !== varCloseCount) {
      errors.push(`Mismatched variable delimiters: ${varCount} opening, ${varCloseCount} closing`);
    }
    const ifMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*if\\s`, "g")) || [];
    const endifMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*endif\\s*${this.escapeRegex(blockClose)}`, "g")) || [];
    if (ifMatches.length !== endifMatches.length) {
      errors.push(`Mismatched if/endif blocks: ${ifMatches.length} if, ${endifMatches.length} endif`);
    }
    const forMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*for\\s`, "g")) || [];
    const endforMatches = template.match(new RegExp(`${this.escapeRegex(blockOpen)}\\s*endfor\\s*${this.escapeRegex(blockClose)}`, "g")) || [];
    if (forMatches.length !== endforMatches.length) {
      errors.push(`Mismatched for/endfor blocks: ${forMatches.length} for, ${endforMatches.length} endfor`);
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// src/core/TemplateLibrary.ts
var path2 = __toESM(require("path"));
var fs2 = __toESM(require("fs-extra"));
var yaml = __toESM(require("yaml"));
var TemplateLibrary = class {
  templates;
  logger;
  customTemplatesPath;
  constructor(customTemplatesPath) {
    this.templates = /* @__PURE__ */ new Map();
    this.logger = new Logger("TemplateLibrary");
    this.customTemplatesPath = customTemplatesPath;
    this.loadBuiltInTemplates();
    if (customTemplatesPath) {
      this.loadCustomTemplates(customTemplatesPath);
    }
  }
  getTemplate(id) {
    return this.templates.get(id);
  }
  getAllTemplates() {
    return Array.from(this.templates.values());
  }
  getTemplatesByCategory(category) {
    return this.getAllTemplates().filter((t) => t.category === category);
  }
  searchTemplates(options) {
    const matches = [];
    for (const template of this.templates.values()) {
      const match = this.matchTemplate(template, options);
      if (match.score > 0) {
        matches.push(match);
      }
    }
    return matches.sort((a, b) => b.score - a.score);
  }
  registerTemplate(template) {
    if (this.templates.has(template.id)) {
      this.logger.warn(`Template with id "${template.id}" already exists. Overwriting.`);
    }
    const validation = this.validateTemplate(template);
    if (!validation.valid) {
      throw new Error(`Invalid template: ${validation.errors.join(", ")}`);
    }
    this.templates.set(template.id, template);
    this.logger.info(`Template registered: ${template.name} (${template.id})`);
  }
  unregisterTemplate(id) {
    const removed = this.templates.delete(id);
    if (removed) {
      this.logger.info(`Template unregistered: ${id}`);
    }
    return removed;
  }
  async saveTemplate(template, filePath) {
    try {
      const content = yaml.stringify(template);
      await fs2.writeFile(filePath, content, "utf-8");
      this.logger.success(`Template saved: ${filePath}`);
    } catch (error) {
      this.logger.error("Failed to save template:", error);
      throw error;
    }
  }
  async loadTemplate(filePath) {
    try {
      const content = await fs2.readFile(filePath, "utf-8");
      const template = yaml.parse(content);
      const validation = this.validateTemplate(template);
      if (!validation.valid) {
        throw new Error(`Invalid template: ${validation.errors.join(", ")}`);
      }
      this.registerTemplate(template);
      return template;
    } catch (error) {
      this.logger.error("Failed to load template:", error);
      throw error;
    }
  }
  matchTemplate(template, options) {
    let score = 0;
    const matchedFields = [];
    if (options.category && template.category === options.category) {
      score += 50;
      matchedFields.push("category");
    }
    if (options.tags && options.tags.length > 0) {
      const matchedTags = options.tags.filter(
        (tag) => template.tags.some((t) => this.fuzzyMatch(t, tag, options.fuzzySearch))
      );
      if (matchedTags.length > 0) {
        score += matchedTags.length * 20;
        matchedFields.push("tags");
      }
    }
    if (options.keywords && options.keywords.length > 0) {
      for (const keyword of options.keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (this.fuzzyMatch(template.name, keyword, options.fuzzySearch)) {
          score += 30;
          matchedFields.push("name");
        }
        if (this.fuzzyMatch(template.description, keyword, options.fuzzySearch)) {
          score += 10;
          matchedFields.push("description");
        }
        if (template.tags.some((tag) => this.fuzzyMatch(tag, keyword, options.fuzzySearch))) {
          score += 15;
          matchedFields.push("tags");
        }
      }
    }
    return {
      template,
      score,
      matchedFields: [...new Set(matchedFields)]
    };
  }
  fuzzyMatch(text, query, fuzzy = false) {
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
  validateTemplate(template) {
    const errors = [];
    if (!template.id || typeof template.id !== "string") {
      errors.push("Template must have a valid id");
    }
    if (!template.name || typeof template.name !== "string") {
      errors.push("Template must have a valid name");
    }
    if (!template.category) {
      errors.push("Template must have a category");
    }
    if (!Array.isArray(template.fields)) {
      errors.push("Template must have a fields array");
    }
    if (!Array.isArray(template.sections)) {
      errors.push("Template must have a sections array");
    }
    if (template.sections && template.sections.length === 0) {
      errors.push("Template must have at least one section");
    }
    for (const field of template.fields || []) {
      if (!field.name || !field.label || !field.type) {
        errors.push(`Invalid field: ${JSON.stringify(field)}`);
      }
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
  loadBuiltInTemplates() {
    this.logger.info("Loading built-in templates...");
  }
  async loadCustomTemplates(dirPath) {
    try {
      const exists = await fs2.pathExists(dirPath);
      if (!exists) {
        this.logger.warn(`Custom templates directory not found: ${dirPath}`);
        return;
      }
      const files = await fs2.readdir(dirPath);
      const templateFiles = files.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
      this.logger.info(`Loading ${templateFiles.length} custom templates from ${dirPath}`);
      for (const file of templateFiles) {
        try {
          await this.loadTemplate(path2.join(dirPath, file));
        } catch (error) {
          this.logger.error(`Failed to load template ${file}:`, error);
        }
      }
    } catch (error) {
      this.logger.error("Failed to load custom templates:", error);
    }
  }
  listTemplates() {
    const templates = this.getAllTemplates();
    this.logger.info(`
${"=".repeat(80)}`);
    this.logger.info(`Available Templates (${templates.length})`);
    this.logger.info("=".repeat(80));
    const categories = /* @__PURE__ */ new Map();
    for (const template of templates) {
      if (!categories.has(template.category)) {
        categories.set(template.category, []);
      }
      categories.get(template.category).push(template);
    }
    for (const [category, temps] of categories.entries()) {
      this.logger.info(`
${category.toUpperCase()} (${temps.length})`);
      this.logger.divider("-", 80);
      for (const template of temps) {
        this.logger.info(`  \u2022 ${template.name} [${template.id}]`);
        this.logger.info(`    ${template.description}`);
        this.logger.info(`    Tags: ${template.tags.join(", ")}`);
      }
    }
    this.logger.info("\n" + "=".repeat(80) + "\n");
  }
  getTemplateInfo(id) {
    const template = this.getTemplate(id);
    if (!template) {
      return `Template not found: ${id}`;
    }
    const lines = [];
    lines.push("=".repeat(80));
    lines.push(`Template: ${template.name}`);
    lines.push("=".repeat(80));
    lines.push(`ID: ${template.id}`);
    lines.push(`Category: ${template.category}`);
    lines.push(`Description: ${template.description}`);
    lines.push(`Tags: ${template.tags.join(", ")}`);
    lines.push("");
    lines.push("Fields:");
    for (const field of template.fields) {
      const required = field.required ? " (required)" : "";
      lines.push(`  \u2022 ${field.label} [${field.name}]${required}`);
      lines.push(`    Type: ${field.type}`);
      if (field.validation) {
        lines.push(`    Validation: ${JSON.stringify(field.validation)}`);
      }
    }
    lines.push("");
    lines.push("Sections:");
    for (const section of template.sections) {
      lines.push(`  \u2022 ${section.title}`);
      if (section.condition) {
        lines.push(`    Condition: ${section.condition}`);
      }
      if (section.repeat) {
        lines.push(`    Repeat: ${section.repeat.items} as ${section.repeat.as}`);
      }
    }
    lines.push("=".repeat(80));
    return lines.join("\n");
  }
  async exportTemplates(outputPath) {
    try {
      await fs2.ensureDir(outputPath);
      for (const template of this.templates.values()) {
        const filename = `${template.id}.yaml`;
        const filePath = path2.join(outputPath, filename);
        await this.saveTemplate(template, filePath);
      }
      this.logger.success(`Exported ${this.templates.size} templates to ${outputPath}`);
    } catch (error) {
      this.logger.error("Failed to export templates:", error);
      throw error;
    }
  }
  async importTemplates(inputPath) {
    try {
      const exists = await fs2.pathExists(inputPath);
      if (!exists) {
        throw new Error(`Path does not exist: ${inputPath}`);
      }
      const stat2 = await fs2.stat(inputPath);
      let imported = 0;
      if (stat2.isFile()) {
        await this.loadTemplate(inputPath);
        imported = 1;
      } else if (stat2.isDirectory()) {
        const files = await fs2.readdir(inputPath);
        const templateFiles = files.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
        for (const file of templateFiles) {
          try {
            await this.loadTemplate(path2.join(inputPath, file));
            imported++;
          } catch (error) {
            this.logger.error(`Failed to import ${file}:`, error);
          }
        }
      }
      this.logger.success(`Imported ${imported} templates from ${inputPath}`);
      return imported;
    } catch (error) {
      this.logger.error("Failed to import templates:", error);
      throw error;
    }
  }
  getStatistics() {
    const stats = {
      total: this.templates.size,
      byCategory: {},
      totalFields: 0,
      totalSections: 0
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
};

// src/core/InputParser.ts
var import_validator = __toESM(require("validator"));
var InputParser = class {
  logger;
  templateLibrary;
  constructor(templateLibrary) {
    this.logger = new Logger("InputParser");
    this.templateLibrary = templateLibrary;
  }
  parseAndValidate(rawInput) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };
    try {
      const template = this.identifyTemplate(rawInput);
      if (!template) {
        result.valid = false;
        result.errors.push("Unable to identify appropriate template");
        result.suggestions = this.suggestTemplates(rawInput);
        return result;
      }
      this.logger.info(`Identified template: ${template.name} (${template.id})`);
      const validationResult = this.validateFields(rawInput, template);
      if (!validationResult.valid) {
        result.valid = false;
        result.errors.push(...validationResult.errors);
      }
      if (validationResult.warnings.length > 0) {
        result.warnings.push(...validationResult.warnings);
      }
      const missingFields = this.checkMissingFields(rawInput, template);
      if (missingFields.length > 0) {
        result.valid = false;
        result.errors.push(`Missing required fields: ${missingFields.join(", ")}`);
      }
      if (result.valid) {
        result.userInput = {
          templateId: template.id,
          category: template.category,
          title: rawInput.title || rawInput.projectName || "Untitled",
          fields: this.extractFields(rawInput, template),
          outputPath: rawInput.outputPath || process.cwd(),
          filename: rawInput.filename,
          overwrite: rawInput.overwrite !== false
        };
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Parsing error: ${error instanceof Error ? error.message : String(error)}`);
    }
    return result;
  }
  identifyTemplate(rawInput) {
    if (rawInput.templateId) {
      const template = this.templateLibrary.getTemplate(rawInput.templateId);
      if (template) return template;
    }
    if (rawInput.category) {
      const templates = this.templateLibrary.getTemplatesByCategory(rawInput.category);
      if (templates.length > 0) {
        return this.selectBestMatch(rawInput, templates);
      }
    }
    const keywords = this.extractKeywords(rawInput);
    const matches = this.templateLibrary.searchTemplates({
      keywords,
      fuzzySearch: true
    });
    if (matches.length > 0) {
      return matches[0].template;
    }
    return void 0;
  }
  selectBestMatch(rawInput, templates) {
    let bestMatch = templates[0];
    let highestScore = 0;
    for (const template of templates) {
      let score = 0;
      for (const field of template.fields) {
        if (rawInput[field.name] !== void 0) {
          score += field.required ? 10 : 5;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = template;
      }
    }
    return bestMatch;
  }
  extractKeywords(rawInput) {
    const keywords = [];
    const keyFields = ["title", "projectName", "name", "description", "type", "category"];
    for (const key of keyFields) {
      if (rawInput[key] && typeof rawInput[key] === "string") {
        keywords.push(rawInput[key]);
      }
    }
    return keywords;
  }
  suggestTemplates(rawInput) {
    const suggestions = [];
    const allTemplates2 = this.templateLibrary.getAllTemplates();
    if (allTemplates2.length === 0) {
      return ["No templates available"];
    }
    const categories = /* @__PURE__ */ new Map();
    for (const template of allTemplates2) {
      categories.set(template.category, (categories.get(template.category) || 0) + 1);
    }
    suggestions.push("Available template categories:");
    for (const [category, count] of categories.entries()) {
      suggestions.push(`  - ${category} (${count} templates)`);
    }
    suggestions.push("");
    suggestions.push("Popular templates:");
    allTemplates2.slice(0, 5).forEach((t) => {
      suggestions.push(`  - ${t.name} [${t.id}]`);
    });
    return suggestions;
  }
  validateFields(rawInput, template) {
    const errors = [];
    const warnings = [];
    for (const field of template.fields) {
      const value = rawInput[field.name];
      const fieldResult = this.validateField(field, value);
      if (!fieldResult.valid) {
        if (field.required) {
          errors.push(...fieldResult.errors.map((e) => `${field.label}: ${e}`));
        } else {
          warnings.push(...fieldResult.errors.map((e) => `${field.label}: ${e}`));
        }
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  validateField(field, value) {
    const result = {
      field: field.name,
      valid: true,
      errors: [],
      value
    };
    if (value === void 0 || value === null || value === "") {
      if (field.required) {
        result.valid = false;
        result.errors.push("This field is required");
      }
      return result;
    }
    switch (field.type) {
      case "text":
        result.valid = this.validateText(value, field, result.errors);
        break;
      case "textarea":
        result.valid = this.validateTextarea(value, field, result.errors);
        break;
      case "email":
        result.valid = this.validateEmail(value, result.errors);
        break;
      case "url":
        result.valid = this.validateUrl(value, result.errors);
        break;
      case "number":
        result.valid = this.validateNumber(value, field, result.errors);
        break;
      case "date":
        result.valid = this.validateDate(value, result.errors);
        break;
      case "select":
        result.valid = this.validateSelect(value, field, result.errors);
        break;
      case "array":
        result.valid = this.validateArray(value, field, result.errors);
        break;
      case "object":
        result.valid = this.validateObject(value, field, result.errors);
        break;
      case "code":
        result.valid = this.validateCode(value, field, result.errors);
        break;
      case "checklist":
        result.valid = this.validateChecklist(value, field, result.errors);
        break;
      default:
        result.warnings = [`Unknown field type: ${field.type}`];
    }
    return result;
  }
  validateText(value, field, errors) {
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return false;
    }
    if (field.validation) {
      if (field.validation.minLength && value.length < field.validation.minLength) {
        errors.push(`Must be at least ${field.validation.minLength} characters`);
        return false;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Must be at most ${field.validation.maxLength} characters`);
        return false;
      }
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          errors.push(`Does not match required pattern: ${field.validation.pattern}`);
          return false;
        }
      }
    }
    return true;
  }
  validateTextarea(value, field, errors) {
    return this.validateText(value, field, errors);
  }
  validateEmail(value, errors) {
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return false;
    }
    if (!import_validator.default.isEmail(value)) {
      errors.push("Must be a valid email address");
      return false;
    }
    return true;
  }
  validateUrl(value, errors) {
    if (typeof value !== "string") {
      errors.push("Must be a string");
      return false;
    }
    if (!import_validator.default.isURL(value, { require_protocol: false })) {
      errors.push("Must be a valid URL");
      return false;
    }
    return true;
  }
  validateNumber(value, field, errors) {
    const num = typeof value === "number" ? value : Number(value);
    if (isNaN(num)) {
      errors.push("Must be a valid number");
      return false;
    }
    if (field.validation) {
      if (field.validation.min !== void 0 && num < field.validation.min) {
        errors.push(`Must be at least ${field.validation.min}`);
        return false;
      }
      if (field.validation.max !== void 0 && num > field.validation.max) {
        errors.push(`Must be at most ${field.validation.max}`);
        return false;
      }
    }
    return true;
  }
  validateDate(value, errors) {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (typeof value === "string") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push("Must be a valid date");
        return false;
      }
      return true;
    }
    errors.push("Must be a valid date");
    return false;
  }
  validateSelect(value, field, errors) {
    if (!field.options || field.options.length === 0) {
      return true;
    }
    if (!field.options.includes(value)) {
      errors.push(`Must be one of: ${field.options.join(", ")}`);
      return false;
    }
    return true;
  }
  validateArray(value, field, errors) {
    if (!Array.isArray(value)) {
      errors.push("Must be an array");
      return false;
    }
    if (field.validation) {
      if (field.validation.minItems !== void 0 && value.length < field.validation.minItems) {
        errors.push(`Must have at least ${field.validation.minItems} items`);
        return false;
      }
      if (field.validation.maxItems !== void 0 && value.length > field.validation.maxItems) {
        errors.push(`Must have at most ${field.validation.maxItems} items`);
        return false;
      }
    }
    return true;
  }
  validateObject(value, field, errors) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errors.push("Must be an object");
      return false;
    }
    if (field.properties) {
      for (const [key, propDef] of Object.entries(field.properties)) {
        if (value[key] === void 0 && propDef.required) {
          errors.push(`Missing required property: ${key}`);
          return false;
        }
      }
    }
    return true;
  }
  validateCode(value, field, errors) {
    if (typeof value !== "string") {
      errors.push("Code must be a string");
      return false;
    }
    if (field.language) {
    }
    return true;
  }
  validateChecklist(value, field, errors) {
    if (!Array.isArray(value)) {
      errors.push("Checklist must be an array");
      return false;
    }
    return true;
  }
  checkMissingFields(rawInput, template) {
    const missing = [];
    for (const field of template.fields) {
      if (field.required && (rawInput[field.name] === void 0 || rawInput[field.name] === null || rawInput[field.name] === "")) {
        missing.push(field.label || field.name);
      }
    }
    return missing;
  }
  extractFields(rawInput, template) {
    const fields = {};
    for (const field of template.fields) {
      let value = rawInput[field.name];
      if (value === void 0 && field.defaultValue !== void 0) {
        value = field.defaultValue;
      }
      if (value !== void 0) {
        fields[field.name] = this.transformFieldValue(value, field);
      }
    }
    return fields;
  }
  transformFieldValue(value, field) {
    switch (field.type) {
      case "number":
        return typeof value === "number" ? value : Number(value);
      case "date":
        if (value instanceof Date) return value;
        return new Date(value);
      case "array":
        if (Array.isArray(value)) return value;
        return [value];
      default:
        return value;
    }
  }
  async promptMissingFields(rawInput, template) {
    const missingFields = this.checkMissingFields(rawInput, template);
    if (missingFields.length === 0) {
      return rawInput;
    }
    this.logger.warn(`Missing required fields: ${missingFields.join(", ")}`);
    this.logger.info("Please provide the missing information...");
    return rawInput;
  }
  generateFieldPrompts(template) {
    return template.fields.map((field) => ({
      name: field.name,
      message: field.label + (field.required ? " (required)" : " (optional)"),
      type: this.mapFieldTypeToPromptType(field.type),
      required: field.required,
      choices: field.options
    }));
  }
  mapFieldTypeToPromptType(fieldType) {
    const mapping = {
      text: "input",
      textarea: "editor",
      email: "input",
      url: "input",
      number: "number",
      date: "input",
      select: "list",
      array: "input",
      object: "input",
      code: "editor",
      checklist: "checkbox"
    };
    return mapping[fieldType] || "input";
  }
  validateTemplateCompatibility(userInput, template) {
    const errors = [];
    const warnings = [];
    for (const field of template.fields) {
      if (field.required && !userInput.fields[field.name]) {
        errors.push(`Missing required field: ${field.label}`);
      }
    }
    for (const [key, value] of Object.entries(userInput.fields)) {
      const field = template.fields.find((f) => f.name === key);
      if (!field) {
        warnings.push(`Unknown field: ${key}`);
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};

// src/core/FileGenerator.ts
var import_marked = require("marked");
var path3 = __toESM(require("path"));
var FileGenerator = class {
  logger;
  fileSystem;
  templateEngine;
  templateLibrary;
  constructor(fileSystem, templateEngine, templateLibrary) {
    this.logger = new Logger("FileGenerator");
    this.fileSystem = fileSystem;
    this.templateEngine = templateEngine;
    this.templateLibrary = templateLibrary;
  }
  async generate(userInput, options = {}) {
    const startTime = Date.now();
    try {
      this.logger.info(`Generating file: ${userInput.title}`);
      const template = this.templateLibrary.getTemplate(userInput.templateId);
      if (!template) {
        return this.createErrorResult(`Template not found: ${userInput.templateId}`, userInput);
      }
      const content = this.templateEngine.renderTemplate(template, userInput);
      const validationResult = options.validate !== false ? this.validateMarkdown(content) : { valid: true, errors: [], warnings: [], syntaxIssues: [] };
      if (!validationResult.valid) {
        this.logger.warn("Generated content has syntax issues");
        for (const issue of validationResult.syntaxIssues) {
          if (issue.severity === "error") {
            this.logger.error(`Line ${issue.line}: ${issue.message}`);
          } else {
            this.logger.warn(`Line ${issue.line}: ${issue.message}`);
          }
        }
      }
      if (options.dryRun) {
        this.logger.info("Dry run mode - content not written to file");
        return {
          success: true,
          content,
          errors: [],
          warnings: validationResult.warnings,
          metadata: {
            templateId: template.id,
            generatedAt: /* @__PURE__ */ new Date(),
            fileSize: Buffer.byteLength(content, "utf-8"),
            lineCount: content.split("\n").length
          }
        };
      }
      const filename = this.generateFilename(userInput, template);
      const filePath = path3.join(userInput.outputPath, filename);
      await this.fileSystem.writeFile(filePath, content, {
        overwrite: options.overwrite !== false,
        backup: options.backup !== false,
        createDirs: options.createDirs !== false
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
          generatedAt: /* @__PURE__ */ new Date(),
          fileSize: Buffer.byteLength(content, "utf-8"),
          lineCount: content.split("\n").length
        }
      };
    } catch (error) {
      this.logger.error("File generation failed:", error);
      return this.createErrorResult(
        error instanceof Error ? error.message : String(error),
        userInput
      );
    }
  }
  async generateBatch(inputs, options = {}) {
    this.logger.info(`Starting batch generation for ${inputs.length} files`);
    const results = [];
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
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;
    this.logger.info(
      `Batch generation completed: ${successCount} succeeded, ${failureCount} failed`
    );
    return results;
  }
  validateMarkdown(content) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      syntaxIssues: []
    };
    try {
      import_marked.marked.parse(content);
    } catch (error) {
      result.valid = false;
      result.errors.push(error instanceof Error ? error.message : String(error));
      return result;
    }
    const lines = content.split("\n");
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
    const errorCount = result.syntaxIssues.filter((i) => i.severity === "error").length;
    const warningCount = result.syntaxIssues.filter((i) => i.severity === "warning").length;
    result.valid = errorCount === 0;
    result.errors = result.syntaxIssues.filter((i) => i.severity === "error").map((i) => `Line ${i.line}: ${i.message}`);
    result.warnings = result.syntaxIssues.filter((i) => i.severity === "warning").map((i) => `Line ${i.line}: ${i.message}`);
    return result;
  }
  checkLineSyntax(line, lineNumber) {
    const issues = [];
    if (line.match(/\t/)) {
      issues.push({
        line: lineNumber,
        message: "Line contains tabs, should use spaces",
        severity: "warning"
      });
    }
    if (line.length > 0 && line.match(/[ \t]+$/)) {
      issues.push({
        line: lineNumber,
        message: "Line has trailing whitespace",
        severity: "warning"
      });
    }
    const unbalancedBrackets = this.checkUnbalancedBrackets(line);
    if (unbalancedBrackets.length > 0) {
      issues.push({
        line: lineNumber,
        message: `Unbalanced brackets: ${unbalancedBrackets.join(", ")}`,
        severity: "error"
      });
    }
    return issues;
  }
  checkUnbalancedBrackets(line) {
    const issues = [];
    const brackets = {
      "(": ")",
      "[": "]",
      "{": "}"
    };
    const stack = [];
    const inCodeTick = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "`") {
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
      issues.push(`Unclosed ${stack.join(", ")}`);
    }
    return issues;
  }
  validateHeaders(content) {
    const issues = [];
    const lines = content.split("\n");
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
            severity: "warning"
          });
        }
        if (text.match(/^[a-z]/)) {
          issues.push({
            line: i + 1,
            message: "Header should start with a capital letter",
            severity: "warning"
          });
        }
        if (text.match(/\.$/)) {
          issues.push({
            line: i + 1,
            message: "Header should not end with a period",
            severity: "warning"
          });
        }
        previousHeaderLevel = level;
      }
    }
    return issues;
  }
  validateLinks(content) {
    const issues = [];
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, text, url] = match;
        if (!text || text.trim() === "") {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: "Link text is empty",
            severity: "warning"
          });
        }
        if (!url || url.trim() === "") {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: "Link URL is empty",
            severity: "error"
          });
        }
      }
      const imageRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
      while ((match = imageRegex.exec(line)) !== null) {
        const [fullMatch, alt, url] = match;
        if (!alt || alt.trim() === "") {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: "Image alt text is empty",
            severity: "warning"
          });
        }
        if (!url || url.trim() === "") {
          issues.push({
            line: lineNumber,
            column: match.index,
            message: "Image URL is empty",
            severity: "error"
          });
        }
      }
    }
    return issues;
  }
  validateCodeBlocks(content) {
    const issues = [];
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBlockStartLine = 0;
    let codeBlockLanguage = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      if (line.match(/^```/)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockStartLine = lineNumber;
          const langMatch = line.match(/^```(\w+)/);
          codeBlockLanguage = langMatch ? langMatch[1] : "";
          if (!codeBlockLanguage) {
            issues.push({
              line: lineNumber,
              message: "Code block should specify a language",
              severity: "warning"
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
        message: "Unclosed code block",
        severity: "error"
      });
    }
    return issues;
  }
  generateFilename(userInput, template) {
    if (userInput.filename) {
      return this.ensureMarkdownExtension(userInput.filename);
    }
    let filename;
    switch (template.id) {
      case "github-readme":
        filename = "README.md";
        break;
      case "github-contributing":
        filename = "CONTRIBUTING.md";
        break;
      case "github-changelog":
        filename = "CHANGELOG.md";
        break;
      case "github-issue-bug":
        filename = "bug-report.md";
        break;
      case "github-pr":
        filename = "pull-request.md";
        break;
      default:
        const titleSlug = userInput.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        filename = `${titleSlug}.md`;
    }
    return this.fileSystem.sanitizeFilename(filename);
  }
  ensureMarkdownExtension(filename) {
    if (!filename.match(/\.md$/i)) {
      return filename + ".md";
    }
    return filename;
  }
  createErrorResult(message, userInput) {
    return {
      success: false,
      errors: [message],
      warnings: [],
      metadata: {
        templateId: userInput.templateId || "unknown",
        generatedAt: /* @__PURE__ */ new Date(),
        fileSize: 0,
        lineCount: 0
      }
    };
  }
  async previewGeneration(userInput) {
    const template = this.templateLibrary.getTemplate(userInput.templateId);
    if (!template) {
      throw new Error(`Template not found: ${userInput.templateId}`);
    }
    return this.templateEngine.renderTemplate(template, userInput);
  }
  getGenerationSummary(result) {
    const lines = [];
    lines.push("=".repeat(80));
    lines.push("Generation Summary");
    lines.push("=".repeat(80));
    lines.push(`Status: ${result.success ? "SUCCESS" : "FAILED"}`);
    if (result.filePath) {
      lines.push(`Output File: ${result.filePath}`);
    }
    lines.push(`Template: ${result.metadata.templateId}`);
    lines.push(`Generated At: ${result.metadata.generatedAt.toISOString()}`);
    lines.push(`File Size: ${result.metadata.fileSize} bytes`);
    lines.push(`Line Count: ${result.metadata.lineCount}`);
    if (result.errors.length > 0) {
      lines.push("");
      lines.push("Errors:");
      result.errors.forEach((e) => lines.push(`  - ${e}`));
    }
    if (result.warnings.length > 0) {
      lines.push("");
      lines.push("Warnings:");
      result.warnings.forEach((w) => lines.push(`  - ${w}`));
    }
    lines.push("=".repeat(80));
    return lines.join("\n");
  }
};

// src/templates/github.ts
var githubReadmeTemplate = {
  id: "github-readme",
  name: "GitHub README.md",
  description: "\u5C08\u696D\u7684 GitHub \u5C08\u6848 README \u6587\u4EF6\u6A21\u677F\uFF0C\u5305\u542B\u5C08\u6848\u4ECB\u7D39\u3001\u5B89\u88DD\u8AAA\u660E\u3001\u4F7F\u7528\u7BC4\u4F8B\u7B49\u5B8C\u6574\u5167\u5BB9",
  category: "github",
  tags: ["github", "readme", "documentation", "project"],
  fields: [
    {
      name: "projectName",
      label: "\u5C08\u6848\u540D\u7A31",
      type: "text",
      required: true,
      placeholder: "My Awesome Project",
      validation: { minLength: 1, maxLength: 100 }
    },
    {
      name: "description",
      label: "\u5C08\u6848\u7C21\u4ECB",
      type: "textarea",
      required: true,
      placeholder: "\u9019\u662F\u4E00\u500B...",
      validation: { minLength: 10, maxLength: 500 }
    },
    {
      name: "badges",
      label: "Badges (\u53EF\u9078)",
      type: "array",
      required: false,
      placeholder: "[![npm](https://img.shields.io/npm/v/package.svg)](...)"
    },
    {
      name: "features",
      label: "\u4E3B\u8981\u529F\u80FD",
      type: "array",
      required: true,
      validation: { minItems: 1 }
    },
    {
      name: "installation",
      label: "\u5B89\u88DD\u6307\u4EE4",
      type: "code",
      required: true,
      language: "bash",
      placeholder: "npm install package-name"
    },
    {
      name: "usageExample",
      label: "\u4F7F\u7528\u7BC4\u4F8B",
      type: "code",
      required: true,
      language: "javascript"
    },
    {
      name: "apiDocs",
      label: "API \u6587\u6A94\u9023\u7D50 (\u53EF\u9078)",
      type: "url",
      required: false
    },
    {
      name: "contributing",
      label: "\u8CA2\u737B\u6307\u5357 (\u53EF\u9078)",
      type: "text",
      required: false
    },
    {
      name: "license",
      label: "\u6388\u6B0A\u5354\u8B70",
      type: "select",
      required: true,
      options: ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC", "Other"],
      defaultValue: "MIT"
    },
    {
      name: "author",
      label: "\u4F5C\u8005",
      type: "text",
      required: true
    },
    {
      name: "repository",
      label: "GitHub Repository URL",
      type: "url",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{projectName}}

{% if badges %}
{% for badge in badges %}
{{badge}}
{% endfor %}
{% endif %}

{{description}}`
    },
    {
      id: "features",
      title: "Features",
      order: 2,
      required: true,
      content: `## \u2728 Features

{% for feature in features %}
- {{feature}}
{% endfor %}`
    },
    {
      id: "installation",
      title: "Installation",
      order: 3,
      required: true,
      content: `## \u{1F4E6} Installation

\`\`\`bash
{{installation}}
\`\`\``
    },
    {
      id: "usage",
      title: "Usage",
      order: 4,
      required: true,
      content: `## \u{1F680} Usage

\`\`\`javascript
{{usageExample}}
\`\`\``
    },
    {
      id: "api",
      title: "API Documentation",
      order: 5,
      required: false,
      condition: "apiDocs",
      content: `## \u{1F4DA} API Documentation

For detailed API documentation, please visit: [{{apiDocs}}]({{apiDocs}})`
    },
    {
      id: "contributing",
      title: "Contributing",
      order: 6,
      required: false,
      condition: "contributing",
      content: `## \u{1F91D} Contributing

{{contributing}}

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.`
    },
    {
      id: "license",
      title: "License",
      order: 7,
      required: true,
      content: `## \u{1F4C4} License

This project is licensed under the {{license}} License - see the [LICENSE](LICENSE) file for details.`
    },
    {
      id: "author",
      title: "Author",
      order: 8,
      required: true,
      content: `## \u{1F464} Author

**{{author}}**

{% if repository %}
- GitHub: [{{repository}}]({{repository}})
{% endif %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var githubContributingTemplate = {
  id: "github-contributing",
  name: "CONTRIBUTING.md",
  description: "\u6A19\u6E96\u7684\u958B\u6E90\u5C08\u6848\u8CA2\u737B\u6307\u5357\uFF0C\u8AAA\u660E\u5982\u4F55\u53C3\u8207\u5C08\u6848\u958B\u767C",
  category: "github",
  tags: ["github", "contributing", "open-source", "guidelines"],
  fields: [
    {
      name: "projectName",
      label: "\u5C08\u6848\u540D\u7A31",
      type: "text",
      required: true
    },
    {
      name: "codeOfConduct",
      label: "\u884C\u70BA\u6E96\u5247\u9023\u7D50",
      type: "url",
      required: false,
      defaultValue: "CODE_OF_CONDUCT.md"
    },
    {
      name: "issueProcess",
      label: "Issue \u63D0\u4EA4\u6D41\u7A0B",
      type: "textarea",
      required: false
    },
    {
      name: "prProcess",
      label: "Pull Request \u6D41\u7A0B",
      type: "textarea",
      required: false
    },
    {
      name: "codingStandards",
      label: "\u7DE8\u78BC\u898F\u7BC4",
      type: "array",
      required: false
    },
    {
      name: "testRequirements",
      label: "\u6E2C\u8A66\u8981\u6C42",
      type: "textarea",
      required: false
    },
    {
      name: "setupInstructions",
      label: "\u958B\u767C\u74B0\u5883\u8A2D\u7F6E",
      type: "code",
      required: true,
      language: "bash"
    }
  ],
  sections: [
    {
      id: "intro",
      title: "Introduction",
      order: 1,
      required: true,
      content: `# Contributing to {{projectName}}

First off, thank you for considering contributing to {{projectName}}! It's people like you that make {{projectName}} such a great tool.

{% if codeOfConduct %}
## Code of Conduct

This project and everyone participating in it is governed by the [{{projectName}} Code of Conduct]({{codeOfConduct}}). By participating, you are expected to uphold this code.
{% endif %}`
    },
    {
      id: "getting-started",
      title: "Getting Started",
      order: 2,
      required: true,
      content: `## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn
- Git

### Setting Up Development Environment

\`\`\`bash
{{setupInstructions}}
\`\`\``
    },
    {
      id: "how-to-contribute",
      title: "How to Contribute",
      order: 3,
      required: true,
      content: `## How Can I Contribute?

### Reporting Bugs

{% if issueProcess %}
{{issueProcess}}
{% else %}
Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected to see**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, etc.)
{% endif %}

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**`
    },
    {
      id: "pull-requests",
      title: "Pull Requests",
      order: 4,
      required: true,
      content: `## Pull Request Process

{% if prProcess %}
{{prProcess}}
{% else %}
1. Fork the repository and create your branch from \`main\`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a clear and descriptive commit message
6. Submit your pull request with a comprehensive description

### Pull Request Guidelines

- **Keep pull requests focused** - One feature or bug fix per PR
- **Write tests** - All new features should include tests
- **Update documentation** - Update README.md and other docs as needed
- **Follow the code style** - Maintain consistency with existing code
- **Write clear commit messages** - Use present tense ("Add feature" not "Added feature")
{% endif %}`
    },
    {
      id: "coding-standards",
      title: "Coding Standards",
      order: 5,
      required: false,
      condition: "codingStandards",
      content: `## Coding Standards

{% for standard in codingStandards %}
- {{standard}}
{% endfor %}`
    },
    {
      id: "testing",
      title: "Testing",
      order: 6,
      required: false,
      condition: "testRequirements",
      content: `## Testing Requirements

{{testRequirements}}`
    },
    {
      id: "community",
      title: "Community",
      order: 7,
      required: true,
      content: `## Community

### Getting Help

If you have questions, you can:
- Open an issue with the question label
- Join our community chat
- Check the documentation

### Recognition

Contributors will be recognized in our README.md file.

Thank you for your contributions! \u{1F389}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var githubIssueTemplate = {
  id: "github-issue-bug",
  name: "GitHub Issue Template (Bug Report)",
  description: "Bug \u56DE\u5831\u7684 Issue \u6A21\u677F\uFF0C\u5E6B\u52A9\u4F7F\u7528\u8005\u63D0\u4F9B\u5B8C\u6574\u7684\u554F\u984C\u8CC7\u8A0A",
  category: "github",
  tags: ["github", "issue", "bug", "template"],
  fields: [
    {
      name: "issueTitle",
      label: "Issue \u6A19\u984C",
      type: "text",
      required: true,
      placeholder: "[Bug] Brief description of the issue"
    },
    {
      name: "description",
      label: "\u554F\u984C\u63CF\u8FF0",
      type: "textarea",
      required: true,
      placeholder: "A clear and concise description of what the bug is."
    },
    {
      name: "stepsToReproduce",
      label: "\u91CD\u73FE\u6B65\u9A5F",
      type: "array",
      required: true
    },
    {
      name: "expectedBehavior",
      label: "\u9810\u671F\u884C\u70BA",
      type: "textarea",
      required: true
    },
    {
      name: "actualBehavior",
      label: "\u5BE6\u969B\u884C\u70BA",
      type: "textarea",
      required: true
    },
    {
      name: "environment",
      label: "\u74B0\u5883\u8CC7\u8A0A",
      type: "object",
      required: true,
      properties: {
        os: { type: "text", label: "Operating System" },
        nodeVersion: { type: "text", label: "Node.js Version" },
        packageVersion: { type: "text", label: "Package Version" }
      }
    },
    {
      name: "screenshots",
      label: "\u622A\u5716 (\u53EF\u9078)",
      type: "array",
      required: false
    },
    {
      name: "additionalContext",
      label: "\u984D\u5916\u8CC7\u8A0A",
      type: "textarea",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{issueTitle}}`
    },
    {
      id: "description",
      title: "Description",
      order: 2,
      required: true,
      content: `## \u{1F41B} Bug Description

{{description}}`
    },
    {
      id: "reproduction",
      title: "Steps to Reproduce",
      order: 3,
      required: true,
      content: `## \u{1F4DD} Steps to Reproduce

{% for step in stepsToReproduce %}
{{loop.index1}}. {{step}}
{% endfor %}`
    },
    {
      id: "expected",
      title: "Expected Behavior",
      order: 4,
      required: true,
      content: `## \u2705 Expected Behavior

{{expectedBehavior}}`
    },
    {
      id: "actual",
      title: "Actual Behavior",
      order: 5,
      required: true,
      content: `## \u274C Actual Behavior

{{actualBehavior}}`
    },
    {
      id: "environment",
      title: "Environment",
      order: 6,
      required: true,
      content: `## \u{1F4BB} Environment

- **OS**: {{environment.os}}
- **Node.js Version**: {{environment.nodeVersion}}
- **Package Version**: {{environment.packageVersion}}`
    },
    {
      id: "screenshots",
      title: "Screenshots",
      order: 7,
      required: false,
      condition: "screenshots",
      content: `## \u{1F4F8} Screenshots

{% for screenshot in screenshots %}
![Screenshot]({{screenshot}})
{% endfor %}`
    },
    {
      id: "additional",
      title: "Additional Context",
      order: 8,
      required: false,
      condition: "additionalContext",
      content: `## \u{1F4CB} Additional Context

{{additionalContext}}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var githubPullRequestTemplate = {
  id: "github-pr",
  name: "GitHub Pull Request Template",
  description: "Pull Request \u6A21\u677F\uFF0C\u78BA\u4FDD PR \u5305\u542B\u6240\u6709\u5FC5\u8981\u8CC7\u8A0A",
  category: "github",
  tags: ["github", "pull-request", "pr", "template"],
  fields: [
    {
      name: "prTitle",
      label: "PR \u6A19\u984C",
      type: "text",
      required: true,
      placeholder: "feat: Add new feature"
    },
    {
      name: "prType",
      label: "PR \u985E\u578B",
      type: "select",
      required: true,
      options: ["Feature", "Bug Fix", "Documentation", "Refactoring", "Performance", "Test", "Chore"]
    },
    {
      name: "description",
      label: "\u8B8A\u66F4\u63CF\u8FF0",
      type: "textarea",
      required: true
    },
    {
      name: "motivation",
      label: "\u52D5\u6A5F\u8207\u80CC\u666F",
      type: "textarea",
      required: true
    },
    {
      name: "changes",
      label: "\u4E3B\u8981\u8B8A\u66F4",
      type: "array",
      required: true
    },
    {
      name: "breakingChanges",
      label: "Breaking Changes (\u53EF\u9078)",
      type: "array",
      required: false
    },
    {
      name: "relatedIssues",
      label: "\u76F8\u95DC Issues",
      type: "array",
      required: false,
      placeholder: "#123, #456"
    },
    {
      name: "testCoverage",
      label: "\u6E2C\u8A66\u8986\u84CB",
      type: "textarea",
      required: true
    },
    {
      name: "checklist",
      label: "Checklist",
      type: "checklist",
      required: true,
      items: [
        "Code follows the project style guidelines",
        "Self-review of code completed",
        "Code commented in hard-to-understand areas",
        "Documentation updated",
        "Tests added/updated",
        "All tests passing",
        "No new warnings generated"
      ]
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{prTitle}}

## Type: {{prType}}`
    },
    {
      id: "description",
      title: "Description",
      order: 2,
      required: true,
      content: `## \u{1F4DD} Description

{{description}}`
    },
    {
      id: "motivation",
      title: "Motivation",
      order: 3,
      required: true,
      content: `## \u{1F4A1} Motivation and Context

{{motivation}}`
    },
    {
      id: "changes",
      title: "Changes",
      order: 4,
      required: true,
      content: `## \u{1F504} Changes Made

{% for change in changes %}
- {{change}}
{% endfor %}`
    },
    {
      id: "breaking",
      title: "Breaking Changes",
      order: 5,
      required: false,
      condition: "breakingChanges",
      content: `## \u26A0\uFE0F Breaking Changes

{% for change in breakingChanges %}
- {{change}}
{% endfor %}`
    },
    {
      id: "related",
      title: "Related Issues",
      order: 6,
      required: false,
      condition: "relatedIssues",
      content: `## \u{1F517} Related Issues

{% for issue in relatedIssues %}
Closes {{issue}}
{% endfor %}`
    },
    {
      id: "testing",
      title: "Testing",
      order: 7,
      required: true,
      content: `## \u{1F9EA} Testing

{{testCoverage}}`
    },
    {
      id: "checklist",
      title: "Checklist",
      order: 8,
      required: true,
      content: `## \u2705 Checklist

{% for item in checklist %}
- [ ] {{item}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var githubChangelogTemplate = {
  id: "github-changelog",
  name: "CHANGELOG.md",
  description: "\u6A19\u6E96\u7684 CHANGELOG \u6587\u4EF6\u6A21\u677F\uFF0C\u9075\u5FAA Keep a Changelog \u683C\u5F0F",
  category: "github",
  tags: ["github", "changelog", "versioning", "releases"],
  fields: [
    {
      name: "projectName",
      label: "\u5C08\u6848\u540D\u7A31",
      type: "text",
      required: true
    },
    {
      name: "releases",
      label: "\u7248\u672C\u767C\u5E03\u8A18\u9304",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        version: { type: "text", label: "Version" },
        date: { type: "date", label: "Release Date" },
        added: { type: "array", label: "Added Features" },
        changed: { type: "array", label: "Changed" },
        deprecated: { type: "array", label: "Deprecated" },
        removed: { type: "array", label: "Removed" },
        fixed: { type: "array", label: "Fixed" },
        security: { type: "array", label: "Security" }
      }
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# Changelog

All notable changes to {{projectName}} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`
    },
    {
      id: "releases",
      title: "Releases",
      order: 2,
      required: true,
      repeat: {
        items: "releases",
        as: "release"
      },
      content: `## [{{release.version}}] - {{release.date}}

{% if release.added %}
### Added
{% for item in release.added %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.changed %}
### Changed
{% for item in release.changed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.deprecated %}
### Deprecated
{% for item in release.deprecated %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.removed %}
### Removed
{% for item in release.removed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.fixed %}
### Fixed
{% for item in release.fixed %}
- {{item}}
{% endfor %}
{% endif %}

{% if release.security %}
### Security
{% for item in release.security %}
- {{item}}
{% endfor %}
{% endif %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var githubTemplates = [
  githubReadmeTemplate,
  githubContributingTemplate,
  githubIssueTemplate,
  githubPullRequestTemplate,
  githubChangelogTemplate
];

// src/templates/documentation.ts
var technicalDesignDocTemplate = {
  id: "tech-design-doc",
  name: "Technical Design Document",
  description: "\u6280\u8853\u8A2D\u8A08\u6587\u6A94\u6A21\u677F\uFF0C\u7528\u65BC\u7CFB\u7D71\u67B6\u69CB\u8207\u6280\u8853\u65B9\u6848\u8A2D\u8A08",
  category: "documentation",
  tags: ["technical", "design", "architecture", "documentation"],
  fields: [
    {
      name: "projectName",
      label: "\u5C08\u6848\u540D\u7A31",
      type: "text",
      required: true
    },
    {
      name: "version",
      label: "\u6587\u6A94\u7248\u672C",
      type: "text",
      required: true,
      defaultValue: "1.0"
    },
    {
      name: "authors",
      label: "\u4F5C\u8005",
      type: "array",
      required: true
    },
    {
      name: "overview",
      label: "\u5C08\u6848\u6982\u8FF0",
      type: "textarea",
      required: true
    },
    {
      name: "objectives",
      label: "\u8A2D\u8A08\u76EE\u6A19",
      type: "array",
      required: true
    },
    {
      name: "requirements",
      label: "\u9700\u6C42\u5206\u6790",
      type: "array",
      required: true
    },
    {
      name: "architecture",
      label: "\u7CFB\u7D71\u67B6\u69CB",
      type: "textarea",
      required: true
    },
    {
      name: "components",
      label: "\u6838\u5FC3\u5143\u4EF6",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        name: { type: "text", label: "Component Name" },
        description: { type: "textarea", label: "Description" },
        responsibilities: { type: "array", label: "Responsibilities" }
      }
    },
    {
      name: "techStack",
      label: "\u6280\u8853\u68E7",
      type: "object",
      required: true,
      properties: {
        frontend: { type: "array", label: "Frontend Technologies" },
        backend: { type: "array", label: "Backend Technologies" },
        database: { type: "array", label: "Database" },
        infrastructure: { type: "array", label: "Infrastructure" }
      }
    },
    {
      name: "dataModel",
      label: "\u6578\u64DA\u6A21\u578B",
      type: "textarea",
      required: false
    },
    {
      name: "apiDesign",
      label: "API \u8A2D\u8A08",
      type: "textarea",
      required: false
    },
    {
      name: "security",
      label: "\u5B89\u5168\u8003\u91CF",
      type: "array",
      required: false
    },
    {
      name: "performance",
      label: "\u6027\u80FD\u512A\u5316",
      type: "array",
      required: false
    },
    {
      name: "deployment",
      label: "\u90E8\u7F72\u7B56\u7565",
      type: "textarea",
      required: false
    },
    {
      name: "risks",
      label: "\u98A8\u96AA\u8A55\u4F30",
      type: "array",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# Technical Design Document: {{projectName}}

**Version**: {{version}}  
**Date**: {{date}}  
**Authors**: {{join(authors, ", ")}}

---`
    },
    {
      id: "overview",
      title: "Overview",
      order: 2,
      required: true,
      content: `## 1. Overview

{{overview}}`
    },
    {
      id: "objectives",
      title: "Design Objectives",
      order: 3,
      required: true,
      content: `## 2. Design Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`
    },
    {
      id: "requirements",
      title: "Requirements Analysis",
      order: 4,
      required: true,
      content: `## 3. Requirements Analysis

{% for requirement in requirements %}
- {{requirement}}
{% endfor %}`
    },
    {
      id: "architecture",
      title: "System Architecture",
      order: 5,
      required: true,
      content: `## 4. System Architecture

{{architecture}}`
    },
    {
      id: "components",
      title: "Core Components",
      order: 6,
      required: true,
      content: `## 5. Core Components

{% for component in components %}
### 5.{{loop.index1}}. {{component.name}}

**Description**: {{component.description}}

**Responsibilities**:
{% for responsibility in component.responsibilities %}
- {{responsibility}}
{% endfor %}

{% endfor %}`
    },
    {
      id: "techStack",
      title: "Technology Stack",
      order: 7,
      required: true,
      content: `## 6. Technology Stack

### Frontend
{% for tech in techStack.frontend %}
- {{tech}}
{% endfor %}

### Backend
{% for tech in techStack.backend %}
- {{tech}}
{% endfor %}

### Database
{% for tech in techStack.database %}
- {{tech}}
{% endfor %}

### Infrastructure
{% for tech in techStack.infrastructure %}
- {{tech}}
{% endfor %}`
    },
    {
      id: "dataModel",
      title: "Data Model",
      order: 8,
      required: false,
      condition: "dataModel",
      content: `## 7. Data Model

{{dataModel}}`
    },
    {
      id: "apiDesign",
      title: "API Design",
      order: 9,
      required: false,
      condition: "apiDesign",
      content: `## 8. API Design

{{apiDesign}}`
    },
    {
      id: "security",
      title: "Security Considerations",
      order: 10,
      required: false,
      condition: "security",
      content: `## 9. Security Considerations

{% for item in security %}
- {{item}}
{% endfor %}`
    },
    {
      id: "performance",
      title: "Performance Optimization",
      order: 11,
      required: false,
      condition: "performance",
      content: `## 10. Performance Optimization

{% for item in performance %}
- {{item}}
{% endfor %}`
    },
    {
      id: "deployment",
      title: "Deployment Strategy",
      order: 12,
      required: false,
      condition: "deployment",
      content: `## 11. Deployment Strategy

{{deployment}}`
    },
    {
      id: "risks",
      title: "Risk Assessment",
      order: 13,
      required: false,
      condition: "risks",
      content: `## 12. Risk Assessment

{% for risk in risks %}
- {{risk}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var apiDocumentationTemplate = {
  id: "api-documentation",
  name: "API Documentation",
  description: "RESTful API \u6587\u6A94\u6A21\u677F\uFF0C\u5305\u542B\u7AEF\u9EDE\u8AAA\u660E\u3001\u8ACB\u6C42/\u97FF\u61C9\u7BC4\u4F8B",
  category: "api",
  tags: ["api", "rest", "documentation", "endpoints"],
  fields: [
    {
      name: "apiName",
      label: "API \u540D\u7A31",
      type: "text",
      required: true
    },
    {
      name: "version",
      label: "API \u7248\u672C",
      type: "text",
      required: true,
      defaultValue: "v1"
    },
    {
      name: "baseUrl",
      label: "Base URL",
      type: "url",
      required: true,
      placeholder: "https://api.example.com/v1"
    },
    {
      name: "authentication",
      label: "\u8A8D\u8B49\u65B9\u5F0F",
      type: "textarea",
      required: true
    },
    {
      name: "endpoints",
      label: "API \u7AEF\u9EDE",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        method: { type: "select", options: ["GET", "POST", "PUT", "PATCH", "DELETE"], label: "HTTP Method" },
        path: { type: "text", label: "Endpoint Path" },
        description: { type: "textarea", label: "Description" },
        parameters: { type: "array", label: "Parameters" },
        requestBody: { type: "code", language: "json", label: "Request Body Example" },
        responseSuccess: { type: "code", language: "json", label: "Success Response" },
        responseError: { type: "code", language: "json", label: "Error Response" }
      }
    },
    {
      name: "errorCodes",
      label: "\u932F\u8AA4\u78BC\u8AAA\u660E",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        code: { type: "text", label: "Error Code" },
        message: { type: "text", label: "Error Message" },
        description: { type: "text", label: "Description" }
      }
    },
    {
      name: "rateLimiting",
      label: "\u901F\u7387\u9650\u5236",
      type: "textarea",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{apiName}} API Documentation

**Version**: {{version}}  
**Base URL**: \`{{baseUrl}}\`  
**Last Updated**: {{date}}

---`
    },
    {
      id: "authentication",
      title: "Authentication",
      order: 2,
      required: true,
      content: `## Authentication

{{authentication}}`
    },
    {
      id: "endpoints",
      title: "API Endpoints",
      order: 3,
      required: true,
      content: `## API Endpoints

{% for endpoint in endpoints %}
### {{uppercase(endpoint.method)}} {{endpoint.path}}

{{endpoint.description}}

{% if endpoint.parameters %}
**Parameters**:
{% for param in endpoint.parameters %}
- {{param}}
{% endfor %}
{% endif %}

{% if endpoint.requestBody %}
**Request Body**:
\`\`\`json
{{endpoint.requestBody}}
\`\`\`
{% endif %}

**Success Response** (200 OK):
\`\`\`json
{{endpoint.responseSuccess}}
\`\`\`

{% if endpoint.responseError %}
**Error Response**:
\`\`\`json
{{endpoint.responseError}}
\`\`\`
{% endif %}

---

{% endfor %}`
    },
    {
      id: "errorCodes",
      title: "Error Codes",
      order: 4,
      required: false,
      condition: "errorCodes",
      content: `## Error Codes

| Code | Message | Description |
|------|---------|-------------|
{% for error in errorCodes %}
| {{error.code}} | {{error.message}} | {{error.description}} |
{% endfor %}`
    },
    {
      id: "rateLimiting",
      title: "Rate Limiting",
      order: 5,
      required: false,
      condition: "rateLimiting",
      content: `## Rate Limiting

{{rateLimiting}}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var tutorialTemplate = {
  id: "tutorial",
  name: "Tutorial/Guide",
  description: "\u6559\u7A0B\u8207\u6307\u5357\u6A21\u677F\uFF0C\u9069\u5408\u7DE8\u5BEB\u6280\u8853\u6559\u7A0B\u3001\u4F7F\u7528\u6307\u5357",
  category: "tutorial",
  tags: ["tutorial", "guide", "learning", "howto"],
  fields: [
    {
      name: "title",
      label: "\u6559\u7A0B\u6A19\u984C",
      type: "text",
      required: true
    },
    {
      name: "description",
      label: "\u6559\u7A0B\u7C21\u4ECB",
      type: "textarea",
      required: true
    },
    {
      name: "difficulty",
      label: "\u96E3\u5EA6\u7B49\u7D1A",
      type: "select",
      required: true,
      options: ["Beginner", "Intermediate", "Advanced"]
    },
    {
      name: "duration",
      label: "\u9810\u8A08\u6642\u9577",
      type: "text",
      required: false,
      placeholder: "30 minutes"
    },
    {
      name: "prerequisites",
      label: "\u524D\u7F6E\u77E5\u8B58",
      type: "array",
      required: false
    },
    {
      name: "objectives",
      label: "\u5B78\u7FD2\u76EE\u6A19",
      type: "array",
      required: true
    },
    {
      name: "steps",
      label: "\u6559\u7A0B\u6B65\u9A5F",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        title: { type: "text", label: "Step Title" },
        description: { type: "textarea", label: "Description" },
        code: { type: "code", label: "Code Example" },
        notes: { type: "textarea", label: "Additional Notes" }
      }
    },
    {
      name: "troubleshooting",
      label: "\u5E38\u898B\u554F\u984C",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        problem: { type: "text", label: "Problem" },
        solution: { type: "textarea", label: "Solution" }
      }
    },
    {
      name: "nextSteps",
      label: "\u4E0B\u4E00\u6B65",
      type: "array",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{title}}

{{description}}

**Difficulty**: {{difficulty}}  
{% if duration %}
**Duration**: {{duration}}  
{% endif %}
**Last Updated**: {{date}}

---`
    },
    {
      id: "prerequisites",
      title: "Prerequisites",
      order: 2,
      required: false,
      condition: "prerequisites",
      content: `## Prerequisites

Before starting this tutorial, you should have:

{% for prerequisite in prerequisites %}
- {{prerequisite}}
{% endfor %}`
    },
    {
      id: "objectives",
      title: "Learning Objectives",
      order: 3,
      required: true,
      content: `## What You'll Learn

By the end of this tutorial, you will be able to:

{% for objective in objectives %}
- {{objective}}
{% endfor %}`
    },
    {
      id: "steps",
      title: "Tutorial Steps",
      order: 4,
      required: true,
      content: `## Tutorial Steps

{% for step in steps %}
### Step {{loop.index1}}: {{step.title}}

{{step.description}}

{% if step.code %}
\`\`\`
{{step.code}}
\`\`\`
{% endif %}

{% if step.notes %}
> **Note**: {{step.notes}}
{% endif %}

{% endfor %}`
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      order: 5,
      required: false,
      condition: "troubleshooting",
      content: `## Troubleshooting

{% for issue in troubleshooting %}
### {{issue.problem}}

{{issue.solution}}

{% endfor %}`
    },
    {
      id: "nextSteps",
      title: "Next Steps",
      order: 6,
      required: false,
      condition: "nextSteps",
      content: `## Next Steps

Now that you've completed this tutorial, here's what you can do next:

{% for step in nextSteps %}
- {{step}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var meetingNotesTemplate = {
  id: "meeting-notes",
  name: "Meeting Notes",
  description: "\u6703\u8B70\u8A18\u9304\u6A21\u677F\uFF0C\u5FEB\u901F\u8A18\u9304\u6703\u8B70\u5167\u5BB9\u8207\u6C7A\u8B70\u4E8B\u9805",
  category: "meeting",
  tags: ["meeting", "notes", "minutes", "business"],
  fields: [
    {
      name: "meetingTitle",
      label: "\u6703\u8B70\u4E3B\u984C",
      type: "text",
      required: true
    },
    {
      name: "meetingDate",
      label: "\u6703\u8B70\u65E5\u671F",
      type: "date",
      required: true
    },
    {
      name: "meetingTime",
      label: "\u6703\u8B70\u6642\u9593",
      type: "text",
      required: false,
      placeholder: "14:00 - 15:30"
    },
    {
      name: "location",
      label: "\u6703\u8B70\u5730\u9EDE",
      type: "text",
      required: false
    },
    {
      name: "attendees",
      label: "\u51FA\u5E2D\u4EBA\u54E1",
      type: "array",
      required: true
    },
    {
      name: "agenda",
      label: "\u6703\u8B70\u8B70\u7A0B",
      type: "array",
      required: true
    },
    {
      name: "discussions",
      label: "\u8A0E\u8AD6\u5167\u5BB9",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        topic: { type: "text", label: "Discussion Topic" },
        summary: { type: "textarea", label: "Summary" }
      }
    },
    {
      name: "decisions",
      label: "\u6C7A\u8B70\u4E8B\u9805",
      type: "array",
      required: false
    },
    {
      name: "actionItems",
      label: "\u884C\u52D5\u9805\u76EE",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        task: { type: "text", label: "Task" },
        assignee: { type: "text", label: "Assigned To" },
        dueDate: { type: "date", label: "Due Date" }
      }
    },
    {
      name: "nextMeeting",
      label: "\u4E0B\u6B21\u6703\u8B70",
      type: "text",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{meetingTitle}}

**Date**: {{meetingDate}}  
{% if meetingTime %}
**Time**: {{meetingTime}}  
{% endif %}
{% if location %}
**Location**: {{location}}  
{% endif %}

---`
    },
    {
      id: "attendees",
      title: "Attendees",
      order: 2,
      required: true,
      content: `## Attendees

{% for attendee in attendees %}
- {{attendee}}
{% endfor %}`
    },
    {
      id: "agenda",
      title: "Agenda",
      order: 3,
      required: true,
      content: `## Agenda

{% for item in agenda %}
{{loop.index1}}. {{item}}
{% endfor %}`
    },
    {
      id: "discussions",
      title: "Discussions",
      order: 4,
      required: true,
      content: `## Discussions

{% for discussion in discussions %}
### {{discussion.topic}}

{{discussion.summary}}

{% endfor %}`
    },
    {
      id: "decisions",
      title: "Decisions",
      order: 5,
      required: false,
      condition: "decisions",
      content: `## Decisions Made

{% for decision in decisions %}
- {{decision}}
{% endfor %}`
    },
    {
      id: "actionItems",
      title: "Action Items",
      order: 6,
      required: false,
      condition: "actionItems",
      content: `## Action Items

| Task | Assigned To | Due Date |
|------|-------------|----------|
{% for item in actionItems %}
| {{item.task}} | {{item.assignee}} | {{item.dueDate}} |
{% endfor %}`
    },
    {
      id: "nextMeeting",
      title: "Next Meeting",
      order: 7,
      required: false,
      condition: "nextMeeting",
      content: `## Next Meeting

{{nextMeeting}}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var projectProposalTemplate = {
  id: "project-proposal",
  name: "Project Proposal",
  description: "\u5C08\u6848\u63D0\u6848\u6587\u6A94\u6A21\u677F\uFF0C\u7528\u65BC\u65B0\u5C08\u6848\u7684\u898F\u5283\u8207\u63D0\u6848",
  category: "project",
  tags: ["project", "proposal", "planning", "business"],
  fields: [
    {
      name: "projectName",
      label: "\u5C08\u6848\u540D\u7A31",
      type: "text",
      required: true
    },
    {
      name: "proposedBy",
      label: "\u63D0\u6848\u4EBA",
      type: "text",
      required: true
    },
    {
      name: "executiveSummary",
      label: "\u57F7\u884C\u6458\u8981",
      type: "textarea",
      required: true
    },
    {
      name: "background",
      label: "\u80CC\u666F\u8AAA\u660E",
      type: "textarea",
      required: true
    },
    {
      name: "objectives",
      label: "\u5C08\u6848\u76EE\u6A19",
      type: "array",
      required: true
    },
    {
      name: "scope",
      label: "\u5C08\u6848\u7BC4\u570D",
      type: "textarea",
      required: true
    },
    {
      name: "deliverables",
      label: "\u4EA4\u4ED8\u6210\u679C",
      type: "array",
      required: true
    },
    {
      name: "timeline",
      label: "\u6642\u7A0B\u898F\u5283",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        phase: { type: "text", label: "Phase" },
        duration: { type: "text", label: "Duration" },
        milestones: { type: "array", label: "Milestones" }
      }
    },
    {
      name: "resources",
      label: "\u6240\u9700\u8CC7\u6E90",
      type: "textarea",
      required: true
    },
    {
      name: "budget",
      label: "\u9810\u7B97\u4F30\u7B97",
      type: "textarea",
      required: false
    },
    {
      name: "risks",
      label: "\u98A8\u96AA\u8A55\u4F30",
      type: "array",
      required: false
    },
    {
      name: "success Criteria",
      label: "\u6210\u529F\u6A19\u6E96",
      type: "array",
      required: true
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# Project Proposal: {{projectName}}

**Proposed By**: {{proposedBy}}  
**Date**: {{date}}

---`
    },
    {
      id: "executiveSummary",
      title: "Executive Summary",
      order: 2,
      required: true,
      content: `## Executive Summary

{{executiveSummary}}`
    },
    {
      id: "background",
      title: "Background",
      order: 3,
      required: true,
      content: `## Background

{{background}}`
    },
    {
      id: "objectives",
      title: "Project Objectives",
      order: 4,
      required: true,
      content: `## Project Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`
    },
    {
      id: "scope",
      title: "Project Scope",
      order: 5,
      required: true,
      content: `## Project Scope

{{scope}}`
    },
    {
      id: "deliverables",
      title: "Deliverables",
      order: 6,
      required: true,
      content: `## Deliverables

{% for deliverable in deliverables %}
- {{deliverable}}
{% endfor %}`
    },
    {
      id: "timeline",
      title: "Timeline",
      order: 7,
      required: true,
      content: `## Timeline

{% for phase in timeline %}
### {{phase.phase}}

**Duration**: {{phase.duration}}

**Milestones**:
{% for milestone in phase.milestones %}
- {{milestone}}
{% endfor %}

{% endfor %}`
    },
    {
      id: "resources",
      title: "Required Resources",
      order: 8,
      required: true,
      content: `## Required Resources

{{resources}}`
    },
    {
      id: "budget",
      title: "Budget Estimate",
      order: 9,
      required: false,
      condition: "budget",
      content: `## Budget Estimate

{{budget}}`
    },
    {
      id: "risks",
      title: "Risk Assessment",
      order: 10,
      required: false,
      condition: "risks",
      content: `## Risk Assessment

{% for risk in risks %}
- {{risk}}
{% endfor %}`
    },
    {
      id: "successCriteria",
      title: "Success Criteria",
      order: 11,
      required: true,
      content: `## Success Criteria

{% for criterion in successCriteria %}
- {{criterion}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var documentationTemplates = [
  technicalDesignDocTemplate,
  apiDocumentationTemplate,
  tutorialTemplate,
  meetingNotesTemplate,
  projectProposalTemplate
];

// src/templates/learning.ts
var learningNotesTemplate = {
  id: "learning-notes",
  name: "Learning Notes",
  description: "\u5B78\u7FD2\u7B46\u8A18\u6A21\u677F\uFF0C\u9069\u5408\u8A18\u9304\u5B78\u7FD2\u5167\u5BB9\u3001\u91CD\u9EDE\u6458\u8981\u3001\u5FC3\u5F97\u53CD\u601D",
  category: "learning",
  tags: ["learning", "notes", "study", "education"],
  fields: [
    {
      name: "topic",
      label: "\u5B78\u7FD2\u4E3B\u984C",
      type: "text",
      required: true
    },
    {
      name: "source",
      label: "\u5B78\u7FD2\u4F86\u6E90",
      type: "text",
      required: false,
      placeholder: "Book, Course, Article, etc."
    },
    {
      name: "date",
      label: "\u5B78\u7FD2\u65E5\u671F",
      type: "date",
      required: true
    },
    {
      name: "objectives",
      label: "\u5B78\u7FD2\u76EE\u6A19",
      type: "array",
      required: true
    },
    {
      name: "keypoints",
      label: "\u91CD\u9EDE\u6458\u8981",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        title: { type: "text", label: "Key Point Title" },
        description: { type: "textarea", label: "Description" },
        examples: { type: "array", label: "Examples" }
      }
    },
    {
      name: "code Examples",
      label: "\u7A0B\u5F0F\u78BC\u7BC4\u4F8B",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        language: { type: "text", label: "Programming Language" },
        code: { type: "code", label: "Code" },
        explanation: { type: "textarea", label: "Explanation" }
      }
    },
    {
      name: "resources",
      label: "\u76F8\u95DC\u8CC7\u6E90",
      type: "array",
      required: false
    },
    {
      name: "questions",
      label: "\u7591\u554F\u8207\u601D\u8003",
      type: "array",
      required: false
    },
    {
      name: "reflection",
      label: "\u5B78\u7FD2\u5FC3\u5F97",
      type: "textarea",
      required: false
    },
    {
      name: "nextSteps",
      label: "\u4E0B\u4E00\u6B65\u884C\u52D5",
      type: "array",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# \u{1F4DA} {{topic}}

**Date**: {{date}}  
{% if source %}
**Source**: {{source}}  
{% endif %}

---`
    },
    {
      id: "objectives",
      title: "Learning Objectives",
      order: 2,
      required: true,
      content: `## \u{1F3AF} Learning Objectives

{% for objective in objectives %}
- {{objective}}
{% endfor %}`
    },
    {
      id: "keypoints",
      title: "Key Points",
      order: 3,
      required: true,
      content: `## \u{1F4DD} Key Points

{% for point in keypoints %}
### {{point.title}}

{{point.description}}

{% if point.examples %}
**Examples**:
{% for example in point.examples %}
- {{example}}
{% endfor %}
{% endif %}

{% endfor %}`
    },
    {
      id: "codeExamples",
      title: "Code Examples",
      order: 4,
      required: false,
      condition: "codeExamples",
      content: `## \u{1F4BB} Code Examples

{% for example in codeExamples %}
### {{example.language}}

\`\`\`{{lowercase(example.language)}}
{{example.code}}
\`\`\`

{{example.explanation}}

{% endfor %}`
    },
    {
      id: "resources",
      title: "Resources",
      order: 5,
      required: false,
      condition: "resources",
      content: `## \u{1F517} Resources

{% for resource in resources %}
- {{resource}}
{% endfor %}`
    },
    {
      id: "questions",
      title: "Questions",
      order: 6,
      required: false,
      condition: "questions",
      content: `## \u2753 Questions & Thoughts

{% for question in questions %}
- {{question}}
{% endfor %}`
    },
    {
      id: "reflection",
      title: "Reflection",
      order: 7,
      required: false,
      condition: "reflection",
      content: `## \u{1F4AD} Reflection

{{reflection}}`
    },
    {
      id: "nextSteps",
      title: "Next Steps",
      order: 8,
      required: false,
      condition: "nextSteps",
      content: `## \u{1F4CC} Next Steps

{% for step in nextSteps %}
- [ ] {{step}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var blogPostTemplate = {
  id: "blog-post",
  name: "Blog Post",
  description: "\u90E8\u843D\u683C\u6587\u7AE0\u6A21\u677F\uFF0C\u9069\u5408\u64B0\u5BEB\u6280\u8853\u6587\u7AE0\u3001\u5FC3\u5F97\u5206\u4EAB",
  category: "blog",
  tags: ["blog", "article", "writing", "content"],
  fields: [
    {
      name: "title",
      label: "\u6587\u7AE0\u6A19\u984C",
      type: "text",
      required: true
    },
    {
      name: "author",
      label: "\u4F5C\u8005",
      type: "text",
      required: true
    },
    {
      name: "date",
      label: "\u767C\u5E03\u65E5\u671F",
      type: "date",
      required: true
    },
    {
      name: "tags",
      label: "\u6A19\u7C64",
      type: "array",
      required: true
    },
    {
      name: "excerpt",
      label: "\u6458\u8981",
      type: "textarea",
      required: true,
      validation: { maxLength: 200 }
    },
    {
      name: "coverImage",
      label: "\u5C01\u9762\u5716\u7247 URL",
      type: "url",
      required: false
    },
    {
      name: "introduction",
      label: "\u5F15\u8A00",
      type: "textarea",
      required: true
    },
    {
      name: "sections",
      label: "\u6587\u7AE0\u6BB5\u843D",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        heading: { type: "text", label: "Section Heading" },
        content: { type: "textarea", label: "Content" },
        code: { type: "code", label: "Code Example (optional)" },
        images: { type: "array", label: "Images (optional)" }
      }
    },
    {
      name: "conclusion",
      label: "\u7D50\u8AD6",
      type: "textarea",
      required: true
    },
    {
      name: "references",
      label: "\u53C3\u8003\u8CC7\u6599",
      type: "array",
      required: false
    },
    {
      name: "callToAction",
      label: "Call to Action",
      type: "textarea",
      required: false
    }
  ],
  sections: [
    {
      id: "frontmatter",
      title: "Frontmatter",
      order: 1,
      required: true,
      content: `---
title: "{{title}}"
author: "{{author}}"
date: {{date}}
tags: [{{join(tags, ", ")}}]
excerpt: "{{excerpt}}"
{% if coverImage %}
coverImage: "{{coverImage}}"
{% endif %}
---`
    },
    {
      id: "header",
      title: "Header",
      order: 2,
      required: true,
      content: `# {{title}}

{% if coverImage %}
![{{title}}]({{coverImage}})
{% endif %}

*By {{author}} | {{date}} | {{join(tags, ", ")}}}*

---`
    },
    {
      id: "introduction",
      title: "Introduction",
      order: 3,
      required: true,
      content: `{{introduction}}`
    },
    {
      id: "content",
      title: "Main Content",
      order: 4,
      required: true,
      content: `{% for section in sections %}
## {{section.heading}}

{{section.content}}

{% if section.code %}
\`\`\`
{{section.code}}
\`\`\`
{% endif %}

{% if section.images %}
{% for image in section.images %}
![Image]({{image}})
{% endfor %}
{% endif %}

{% endfor %}`
    },
    {
      id: "conclusion",
      title: "Conclusion",
      order: 5,
      required: true,
      content: `## Conclusion

{{conclusion}}`
    },
    {
      id: "references",
      title: "References",
      order: 6,
      required: false,
      condition: "references",
      content: `## References

{% for reference in references %}
- {{reference}}
{% endfor %}`
    },
    {
      id: "callToAction",
      title: "Call to Action",
      order: 7,
      required: false,
      condition: "callToAction",
      content: `---

{{callToAction}}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var technicalArticleTemplate = {
  id: "technical-article",
  name: "Technical Article",
  description: "\u6DF1\u5EA6\u6280\u8853\u6587\u7AE0\u6A21\u677F\uFF0C\u9069\u5408\u64B0\u5BEB\u6280\u8853\u6DF1\u5EA6\u89E3\u6790\u3001\u539F\u7406\u5256\u6790",
  category: "technical",
  tags: ["technical", "article", "deep-dive", "engineering"],
  fields: [
    {
      name: "title",
      label: "\u6587\u7AE0\u6A19\u984C",
      type: "text",
      required: true
    },
    {
      name: "author",
      label: "\u4F5C\u8005",
      type: "text",
      required: true
    },
    {
      name: "difficulty",
      label: "\u96E3\u5EA6\u7B49\u7D1A",
      type: "select",
      required: true,
      options: ["Beginner", "Intermediate", "Advanced", "Expert"]
    },
    {
      name: "readingTime",
      label: "\u95B1\u8B80\u6642\u9593 (\u5206\u9418)",
      type: "number",
      required: false
    },
    {
      name: "abstract",
      label: "\u6458\u8981",
      type: "textarea",
      required: true
    },
    {
      name: "prerequisites",
      label: "\u524D\u7F6E\u77E5\u8B58",
      type: "array",
      required: false
    },
    {
      name: "tableOfContents",
      label: "\u662F\u5426\u751F\u6210\u76EE\u9304",
      type: "select",
      required: true,
      options: ["yes", "no"],
      defaultValue: "yes"
    },
    {
      name: "problemStatement",
      label: "\u554F\u984C\u9673\u8FF0",
      type: "textarea",
      required: true
    },
    {
      name: "technicalBackground",
      label: "\u6280\u8853\u80CC\u666F",
      type: "textarea",
      required: true
    },
    {
      name: "solution",
      label: "\u89E3\u6C7A\u65B9\u6848",
      type: "textarea",
      required: true
    },
    {
      name: "implementation",
      label: "\u5BE6\u4F5C\u7D30\u7BC0",
      type: "array",
      required: true,
      itemType: "object",
      properties: {
        title: { type: "text", label: "Step Title" },
        description: { type: "textarea", label: "Description" },
        code: { type: "code", label: "Code" },
        notes: { type: "textarea", label: "Notes" }
      }
    },
    {
      name: "benchmarks",
      label: "\u6027\u80FD\u8A55\u6E2C",
      type: "textarea",
      required: false
    },
    {
      name: "tradeoffs",
      label: "\u6B0A\u8861\u8207\u53D6\u6368",
      type: "array",
      required: false
    },
    {
      name: "futurework",
      label: "\u672A\u4F86\u5DE5\u4F5C",
      type: "array",
      required: false
    },
    {
      name: "conclusion",
      label: "\u7D50\u8AD6",
      type: "textarea",
      required: true
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# {{title}}

**Author**: {{author}}  
**Difficulty**: {{difficulty}}  
{% if readingTime %}
**Reading Time**: ~{{readingTime}} minutes  
{% endif %}
**Date**: {{date}}

---`
    },
    {
      id: "abstract",
      title: "Abstract",
      order: 2,
      required: true,
      content: `## Abstract

{{abstract}}`
    },
    {
      id: "toc",
      title: "Table of Contents",
      order: 3,
      required: false,
      condition: 'tableOfContents === "yes"',
      content: `## Table of Contents

- [Abstract](#abstract)
- [Prerequisites](#prerequisites)
- [Problem Statement](#problem-statement)
- [Technical Background](#technical-background)
- [Solution](#solution)
- [Implementation](#implementation)
- [Performance Benchmarks](#performance-benchmarks)
- [Tradeoffs](#tradeoffs)
- [Future Work](#future-work)
- [Conclusion](#conclusion)

---`
    },
    {
      id: "prerequisites",
      title: "Prerequisites",
      order: 4,
      required: false,
      condition: "prerequisites",
      content: `## Prerequisites

Before reading this article, you should be familiar with:

{% for prerequisite in prerequisites %}
- {{prerequisite}}
{% endfor %}

---`
    },
    {
      id: "problemStatement",
      title: "Problem Statement",
      order: 5,
      required: true,
      content: `## Problem Statement

{{problemStatement}}`
    },
    {
      id: "technicalBackground",
      title: "Technical Background",
      order: 6,
      required: true,
      content: `## Technical Background

{{technicalBackground}}`
    },
    {
      id: "solution",
      title: "Solution",
      order: 7,
      required: true,
      content: `## Solution

{{solution}}`
    },
    {
      id: "implementation",
      title: "Implementation",
      order: 8,
      required: true,
      content: `## Implementation

{% for step in implementation %}
### Step {{loop.index1}}: {{step.title}}

{{step.description}}

{% if step.code %}
\`\`\`
{{step.code}}
\`\`\`
{% endif %}

{% if step.notes %}
> **Note**: {{step.notes}}
{% endif %}

{% endfor %}`
    },
    {
      id: "benchmarks",
      title: "Performance Benchmarks",
      order: 9,
      required: false,
      condition: "benchmarks",
      content: `## Performance Benchmarks

{{benchmarks}}`
    },
    {
      id: "tradeoffs",
      title: "Tradeoffs",
      order: 10,
      required: false,
      condition: "tradeoffs",
      content: `## Tradeoffs

{% for tradeoff in tradeoffs %}
- {{tradeoff}}
{% endfor %}`
    },
    {
      id: "futureWork",
      title: "Future Work",
      order: 11,
      required: false,
      condition: "futureWork",
      content: `## Future Work

{% for item in futureWork %}
- {{item}}
{% endfor %}`
    },
    {
      id: "conclusion",
      title: "Conclusion",
      order: 12,
      required: true,
      content: `## Conclusion

{{conclusion}}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var researchNotesTemplate = {
  id: "research-notes",
  name: "Research Notes",
  description: "\u7814\u7A76\u7B46\u8A18\u6A21\u677F\uFF0C\u9069\u5408\u8A18\u9304\u7814\u7A76\u904E\u7A0B\u3001\u5BE6\u9A57\u7D50\u679C\u3001\u6587\u737B\u56DE\u9867",
  category: "learning",
  tags: ["research", "notes", "academic", "study"],
  fields: [
    {
      name: "title",
      label: "\u7814\u7A76\u4E3B\u984C",
      type: "text",
      required: true
    },
    {
      name: "researcher",
      label: "\u7814\u7A76\u8005",
      type: "text",
      required: true
    },
    {
      name: "date",
      label: "\u65E5\u671F",
      type: "date",
      required: true
    },
    {
      name: "researchQuestion",
      label: "\u7814\u7A76\u554F\u984C",
      type: "textarea",
      required: true
    },
    {
      name: "hypothesis",
      label: "\u7814\u7A76\u5047\u8A2D",
      type: "array",
      required: false
    },
    {
      name: "methodology",
      label: "\u7814\u7A76\u65B9\u6CD5",
      type: "textarea",
      required: true
    },
    {
      name: "literatureReview",
      label: "\u6587\u737B\u56DE\u9867",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        citation: { type: "text", label: "Citation" },
        summary: { type: "textarea", label: "Summary" },
        relevance: { type: "textarea", label: "Relevance" }
      }
    },
    {
      name: "experiments",
      label: "\u5BE6\u9A57\u8A18\u9304",
      type: "array",
      required: false,
      itemType: "object",
      properties: {
        experimentName: { type: "text", label: "Experiment Name" },
        setup: { type: "textarea", label: "Setup" },
        procedure: { type: "textarea", label: "Procedure" },
        results: { type: "textarea", label: "Results" },
        observations: { type: "textarea", label: "Observations" }
      }
    },
    {
      name: "findings",
      label: "\u7814\u7A76\u767C\u73FE",
      type: "array",
      required: true
    },
    {
      name: "discussion",
      label: "\u8A0E\u8AD6",
      type: "textarea",
      required: true
    },
    {
      name: "limitations",
      label: "\u7814\u7A76\u9650\u5236",
      type: "array",
      required: false
    },
    {
      name: "futureDirections",
      label: "\u672A\u4F86\u65B9\u5411",
      type: "array",
      required: false
    }
  ],
  sections: [
    {
      id: "header",
      title: "Header",
      order: 1,
      required: true,
      content: `# Research Notes: {{title}}

**Researcher**: {{researcher}}  
**Date**: {{date}}

---`
    },
    {
      id: "researchQuestion",
      title: "Research Question",
      order: 2,
      required: true,
      content: `## Research Question

{{researchQuestion}}`
    },
    {
      id: "hypothesis",
      title: "Hypothesis",
      order: 3,
      required: false,
      condition: "hypothesis",
      content: `## Hypothesis

{% for h in hypothesis %}
- {{h}}
{% endfor %}`
    },
    {
      id: "methodology",
      title: "Methodology",
      order: 4,
      required: true,
      content: `## Methodology

{{methodology}}`
    },
    {
      id: "literatureReview",
      title: "Literature Review",
      order: 5,
      required: false,
      condition: "literatureReview",
      content: `## Literature Review

{% for paper in literatureReview %}
### {{paper.citation}}

**Summary**: {{paper.summary}}

**Relevance**: {{paper.relevance}}

{% endfor %}`
    },
    {
      id: "experiments",
      title: "Experiments",
      order: 6,
      required: false,
      condition: "experiments",
      content: `## Experiments

{% for experiment in experiments %}
### {{experiment.experimentName}}

**Setup**: {{experiment.setup}}

**Procedure**: {{experiment.procedure}}

**Results**: {{experiment.results}}

**Observations**: {{experiment.observations}}

---

{% endfor %}`
    },
    {
      id: "findings",
      title: "Findings",
      order: 7,
      required: true,
      content: `## Findings

{% for finding in findings %}
- {{finding}}
{% endfor %}`
    },
    {
      id: "discussion",
      title: "Discussion",
      order: 8,
      required: true,
      content: `## Discussion

{{discussion}}`
    },
    {
      id: "limitations",
      title: "Limitations",
      order: 9,
      required: false,
      condition: "limitations",
      content: `## Limitations

{% for limitation in limitations %}
- {{limitation}}
{% endfor %}`
    },
    {
      id: "futureDirections",
      title: "Future Directions",
      order: 10,
      required: false,
      condition: "futureDirections",
      content: `## Future Directions

{% for direction in futureDirections %}
- {{direction}}
{% endfor %}`
    }
  ],
  metadata: {
    version: "1.0.0",
    author: "MarkdownBot",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    language: "markdown",
    encoding: "utf-8"
  }
};
var learningTemplates = [
  learningNotesTemplate,
  blogPostTemplate,
  technicalArticleTemplate,
  researchNotesTemplate
];

// src/templates/index.ts
var allTemplates = [
  ...githubTemplates,
  ...documentationTemplates,
  ...learningTemplates
];
function getTemplateById(id) {
  return allTemplates.find((t) => t.id === id);
}
function getTemplatesByCategory(category) {
  return allTemplates.filter((t) => t.category === category);
}
function getTemplatesByTags(tags) {
  return allTemplates.filter(
    (t) => tags.some((tag) => t.tags.includes(tag))
  );
}

// src/index.ts
var MarkdownBot = class {
  fileSystem;
  templateEngine;
  templateLibrary;
  inputParser;
  fileGenerator;
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
  async generate(userInput) {
    return this.fileGenerator.generate(userInput);
  }
  async generateBatch(inputs) {
    return this.fileGenerator.generateBatch(inputs);
  }
  listTemplates() {
    this.templateLibrary.listTemplates();
  }
  getTemplateInfo(templateId) {
    return this.templateLibrary.getTemplateInfo(templateId);
  }
  validateMarkdown(content) {
    return this.fileGenerator.validateMarkdown(content);
  }
  parseInput(rawInput) {
    return this.inputParser.parseAndValidate(rawInput);
  }
};
var index_default = MarkdownBot;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileGenerator,
  FileSystemManager,
  InputParser,
  Logger,
  MarkdownBot,
  TemplateEngine,
  TemplateLibrary,
  allTemplates,
  apiDocumentationTemplate,
  blogPostTemplate,
  documentationTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getTemplatesByTags,
  githubChangelogTemplate,
  githubContributingTemplate,
  githubIssueTemplate,
  githubPullRequestTemplate,
  githubReadmeTemplate,
  githubTemplates,
  learningNotesTemplate,
  learningTemplates,
  meetingNotesTemplate,
  projectProposalTemplate,
  researchNotesTemplate,
  technicalArticleTemplate,
  technicalDesignDocTemplate,
  tutorialTemplate
});
//# sourceMappingURL=index.cjs.map