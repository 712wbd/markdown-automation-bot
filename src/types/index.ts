export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  fields: TemplateField[];
  sections: TemplateSection[];
  metadata: TemplateMetadata;
}

export type TemplateCategory =
  | 'project'
  | 'technical'
  | 'meeting'
  | 'learning'
  | 'github'
  | 'documentation'
  | 'blog'
  | 'api'
  | 'tutorial'
  | 'custom';

export interface TemplateField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  default?: string | number | boolean;
  placeholder?: string;
  validation?: ValidationRule;
  options?: string[];
  description?: string;
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'list'
  | 'array'
  | 'object'
  | 'code';

export interface ValidationRule {
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean | string;
}

export interface TemplateSection {
  id: string;
  title: string;
  level: number;
  content: string;
  optional: boolean;
  variables: string[];
  order: number;
}

export interface TemplateMetadata {
  version: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount?: number;
  rating?: number;
}

export interface UserInput {
  templateId?: string;
  category?: TemplateCategory;
  title: string;
  fields: Record<string, any>;
  outputPath: string;
  filename?: string;
  overwrite?: boolean;
}

export interface GenerationOptions {
  format?: 'standard' | 'github' | 'minimal' | 'full';
  includeMetadata?: boolean;
  includeTOC?: boolean;
  includeTimestamp?: boolean;
  lineWidth?: number;
  validateSyntax?: boolean;
  autoSave?: boolean;
}

export interface GenerationResult {
  success: boolean;
  filePath?: string;
  content?: string;
  errors?: string[];
  warnings?: string[];
  metadata: {
    templateId: string;
    generatedAt: Date;
    fileSize: number;
    lineCount: number;
  };
}

export interface ParserResult {
  templateId?: string;
  category?: TemplateCategory;
  fields: Record<string, any>;
  confidence: number;
  suggestions?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface FileSystemOptions {
  createDirs?: boolean;
  overwrite?: boolean;
  backup?: boolean;
  maxFilenameLength?: number;
}

export interface TemplateLibrary {
  templates: Map<string, TemplateConfig>;
  categories: Map<TemplateCategory, string[]>;
  tags: Map<string, string[]>;
}

export interface MarkdownSyntaxValidator {
  validateHeadings: (content: string) => ValidationResult;
  validateLinks: (content: string) => ValidationResult;
  validateCodeBlocks: (content: string) => ValidationResult;
  validateLists: (content: string) => ValidationResult;
  validateTables: (content: string) => ValidationResult;
  validateAll: (content: string) => ValidationResult;
}

export interface CLIConfig {
  interactive: boolean;
  verbose: boolean;
  quiet: boolean;
  colorize: boolean;
  outputFormat: 'json' | 'text' | 'yaml';
}

export interface BotStatistics {
  totalGenerated: number;
  successRate: number;
  averageGenerationTime: number;
  popularTemplates: string[];
  commonErrors: string[];
}

export interface SearchQuery {
  keyword?: string;
  category?: TemplateCategory;
  tags?: string[];
  rating?: number;
}

export interface CustomTemplate extends TemplateConfig {
  isCustom: true;
  baseTemplateId?: string;
  customizations: Record<string, any>;
}

export interface TemplateVariable {
  name: string;
  type: string;
  description?: string;
  defaultValue?: any;
  transform?: (value: any) => any;
}

export interface RenderContext {
  variables: Record<string, any>;
  helpers: Record<string, Function>;
  partials: Record<string, string>;
  options: GenerationOptions;
}

export interface GitHubIntegration {
  repository?: string;
  branch?: string;
  path?: string;
  commitMessage?: string;
  autoCommit?: boolean;
  createPR?: boolean;
}

export interface ExportOptions {
  format: 'md' | 'html' | 'pdf' | 'docx';
  styling?: string;
  includeCSS?: boolean;
}

export interface TemplateAnalytics {
  templateId: string;
  usageCount: number;
  lastUsed: Date;
  averageRating: number;
  errorRate: number;
}

export interface BatchGenerationOptions {
  templates: string[];
  sharedFields: Record<string, any>;
  outputDirectory: string;
  namingPattern: string;
}

export interface InteractivePrompt {
  type: string;
  name: string;
  message: string;
  default?: any;
  choices?: any[];
  validate?: (value: any) => boolean | string;
  when?: (answers: any) => boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}
