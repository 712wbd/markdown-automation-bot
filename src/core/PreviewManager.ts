import { TemplateEngine, RenderContext } from './TemplateEngine';
import { TemplateConfig, UserInput } from '@/types';
import { Logger } from '@/utils/logger';
import { marked } from 'marked';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

export interface PreviewOptions {
  port?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  theme?: 'light' | 'dark' | 'auto';
  highlightCode?: boolean;
}

export interface PreviewSession {
  id: string;
  template: TemplateConfig;
  userInput: UserInput;
  renderedContent: string;
  htmlContent: string;
  createdAt: Date;
  lastUpdated: Date;
}

export class PreviewManager {
  private logger: Logger;
  private engine: TemplateEngine;
  private sessions: Map<string, PreviewSession> = new Map();
  private server: Server | null = null;
  private options: Required<PreviewOptions>;
  private watchers: Map<string, fs.FSWatcher> = new Map();

  constructor(engine: TemplateEngine, options?: PreviewOptions) {
    this.logger = new Logger('PreviewManager');
    this.engine = engine;
    this.options = {
      port: options?.port || 3000,
      autoRefresh: options?.autoRefresh ?? true,
      refreshInterval: options?.refreshInterval || 1000,
      theme: options?.theme || 'auto',
      highlightCode: options?.highlightCode ?? true,
    };

    this.configureMarked();
  }

  private configureMarked(): void {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      mangle: false,
    });
  }

  public async createPreview(
    template: TemplateConfig,
    userInput: UserInput
  ): Promise<PreviewSession> {
    const sessionId = this.generateSessionId();

    try {
      const renderedContent = this.engine.renderTemplate(template, userInput);

      const htmlContent = await marked(renderedContent);

      const session: PreviewSession = {
        id: sessionId,
        template,
        userInput,
        renderedContent,
        htmlContent,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      this.sessions.set(sessionId, session);
      this.logger.info(`Created preview session: ${sessionId}`);

      return session;
    } catch (error) {
      this.logger.error('Failed to create preview:', error);
      throw new Error(`Preview creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async updatePreview(sessionId: string, userInput: UserInput): Promise<PreviewSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Preview session not found: ${sessionId}`);
    }

    try {
      const renderedContent = this.engine.renderTemplate(session.template, userInput);
      const htmlContent = await marked(renderedContent);

      session.userInput = userInput;
      session.renderedContent = renderedContent;
      session.htmlContent = htmlContent;
      session.lastUpdated = new Date();

      this.logger.info(`Updated preview session: ${sessionId}`);

      return session;
    } catch (error) {
      this.logger.error('Failed to update preview:', error);
      throw new Error(`Preview update failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public getPreview(sessionId: string): PreviewSession | undefined {
    return this.sessions.get(sessionId);
  }

  public getAllPreviews(): PreviewSession[] {
    return Array.from(this.sessions.values());
  }

  public deletePreview(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      this.logger.info(`Deleted preview session: ${sessionId}`);
    }
    return deleted;
  }

  public async exportPreviewAsHtml(sessionId: string, outputPath: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Preview session not found: ${sessionId}`);
    }

    const fullHtml = this.generateFullHtmlPage(session);
    await fs.writeFile(outputPath, fullHtml, 'utf-8');
    this.logger.info(`Exported preview to: ${outputPath}`);
  }

  public async exportPreviewAsMarkdown(sessionId: string, outputPath: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Preview session not found: ${sessionId}`);
    }

    await fs.writeFile(outputPath, session.renderedContent, 'utf-8');
    this.logger.info(`Exported markdown to: ${outputPath}`);
  }

  public async exportPreviewAsPdf(sessionId: string, outputPath: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Preview session not found: ${sessionId}`);
    }

    this.logger.warn('PDF export requires external library (puppeteer). Exporting as HTML instead.');
    await this.exportPreviewAsHtml(sessionId, outputPath.replace(/\.pdf$/i, '.html'));
  }

  public async startPreviewServer(sessionId?: string): Promise<{ url: string; port: number }> {
    if (this.server) {
      throw new Error('Preview server is already running');
    }

    const port = this.options.port;

    return new Promise((resolve, reject) => {
      this.server = createServer((req, res) => {
        this.handleRequest(req, res, sessionId);
      });

      this.server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          this.logger.error(`Port ${port} is already in use`);
          reject(new Error(`Port ${port} is already in use`));
        } else {
          this.logger.error('Server error:', error);
          reject(error);
        }
      });

      this.server.listen(port, () => {
        const url = `http://localhost:${port}`;
        this.logger.info(`Preview server started at ${url}`);
        resolve({ url, port });
      });
    });
  }

  public async stopPreviewServer(): Promise<void> {
    if (!this.server) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.server!.close((error) => {
        if (error) {
          this.logger.error('Failed to stop server:', error);
          reject(error);
        } else {
          this.logger.info('Preview server stopped');
          this.server = null;
          resolve();
        }
      });
    });
  }

  public isServerRunning(): boolean {
    return this.server !== null;
  }

  public async watchFile(filePath: string, sessionId: string): Promise<void> {
    if (this.watchers.has(filePath)) {
      this.logger.warn(`Already watching file: ${filePath}`);
      return;
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Preview session not found: ${sessionId}`);
    }

    const watcher = fs.watch(filePath, async (eventType) => {
      if (eventType === 'change') {
        this.logger.debug(`File changed: ${filePath}`);
        try {
          await this.updatePreview(sessionId, session.userInput);
        } catch (error) {
          this.logger.error('Failed to update preview on file change:', error);
        }
      }
    });

    this.watchers.set(filePath, watcher);
    this.logger.info(`Watching file: ${filePath}`);
  }

  public unwatchFile(filePath: string): void {
    const watcher = this.watchers.get(filePath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(filePath);
      this.logger.info(`Stopped watching file: ${filePath}`);
    }
  }

  public unwatchAllFiles(): void {
    for (const [filePath, watcher] of this.watchers.entries()) {
      watcher.close();
      this.logger.debug(`Stopped watching file: ${filePath}`);
    }
    this.watchers.clear();
    this.logger.info('Stopped watching all files');
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse, defaultSessionId?: string): void {
    const url = req.url || '/';

    if (url === '/' || url === '/index.html') {
      this.handleIndexRequest(res);
    } else if (url.startsWith('/preview/')) {
      const sessionId = url.split('/')[2] || defaultSessionId;
      this.handlePreviewRequest(res, sessionId);
    } else if (url.startsWith('/api/sessions')) {
      this.handleApiSessionsRequest(res);
    } else if (url === '/api/refresh' && req.method === 'POST') {
      this.handleApiRefreshRequest(req, res);
    } else if (url === '/styles.css') {
      this.handleStylesRequest(res);
    } else {
      this.handle404(res);
    }
  }

  private handleIndexRequest(res: ServerResponse): void {
    const sessions = this.getAllPreviews();
    const sessionsList = sessions
      .map(
        (s) => `
        <li>
          <a href="/preview/${s.id}">
            ${s.template.name} - ${s.userInput.title || 'Untitled'}
          </a>
          <span class="timestamp">${s.lastUpdated.toLocaleString()}</span>
        </li>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Bot Preview</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Markdown Bot Preview Server</h1>
          <h2>Active Preview Sessions</h2>
          ${sessions.length > 0 ? `<ul class="sessions-list">${sessionsList}</ul>` : '<p>No active preview sessions</p>'}
        </div>
      </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  private handlePreviewRequest(res: ServerResponse, sessionId?: string): void {
    if (!sessionId) {
      this.handle404(res);
      return;
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      this.handle404(res);
      return;
    }

    const html = this.generateFullHtmlPage(session);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  }

  private handleApiSessionsRequest(res: ServerResponse): void {
    const sessions = this.getAllPreviews().map((s) => ({
      id: s.id,
      templateName: s.template.name,
      title: s.userInput.title,
      createdAt: s.createdAt,
      lastUpdated: s.lastUpdated,
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sessions));
  }

  private handleApiRefreshRequest(req: IncomingMessage, res: ServerResponse): void {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { sessionId } = JSON.parse(body);
        const session = this.sessions.get(sessionId);

        if (!session) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Session not found' }));
          return;
        }

        await this.updatePreview(sessionId, session.userInput);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to refresh preview' }));
      }
    });
  }

  private handleStylesRequest(res: ServerResponse): void {
    const css = this.generateStyles();
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(css);
  }

  private handle404(res: ServerResponse): void {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>404 - Not Found</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>404 - Not Found</h1>
          <p><a href="/">Back to Home</a></p>
        </div>
      </body>
      </html>
    `;
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  private generateFullHtmlPage(session: PreviewSession): string {
    const autoRefreshScript = this.options.autoRefresh
      ? `
        <script>
          setInterval(() => {
            fetch('/api/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: '${session.id}' })
            }).then(() => {
              location.reload();
            });
          }, ${this.options.refreshInterval});
        </script>
      `
      : '';

    return `
      <!DOCTYPE html>
      <html lang="en" data-theme="${this.options.theme}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${session.userInput.title || 'Preview'} - Markdown Bot</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="toolbar">
          <a href="/" class="btn">← Back to Sessions</a>
          <span class="title">${session.template.name}</span>
          <span class="timestamp">Last updated: ${session.lastUpdated.toLocaleTimeString()}</span>
        </div>
        <div class="container markdown-body">
          ${session.htmlContent}
        </div>
        ${autoRefreshScript}
      </body>
      </html>
    `;
  }

  private generateStyles(): string {
    return `
      :root {
        --primary-color: #0366d6;
        --bg-color: #ffffff;
        --text-color: #24292e;
        --border-color: #e1e4e8;
        --code-bg: #f6f8fa;
        --link-color: #0366d6;
      }

      [data-theme="dark"] {
        --primary-color: #58a6ff;
        --bg-color: #0d1117;
        --text-color: #c9d1d9;
        --border-color: #30363d;
        --code-bg: #161b22;
        --link-color: #58a6ff;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background-color: var(--bg-color);
      }

      .toolbar {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background-color: var(--bg-color);
        border-bottom: 1px solid var(--border-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        z-index: 1000;
      }

      .toolbar .title {
        font-weight: 600;
        font-size: 1.1rem;
      }

      .toolbar .timestamp {
        font-size: 0.9rem;
        color: #6a737d;
      }

      .btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        transition: opacity 0.2s;
      }

      .btn:hover {
        opacity: 0.8;
      }

      .container {
        max-width: 980px;
        margin: 2rem auto;
        padding: 0 2rem;
      }

      .sessions-list {
        list-style: none;
        margin: 1rem 0;
      }

      .sessions-list li {
        padding: 1rem;
        margin-bottom: 0.5rem;
        background-color: var(--code-bg);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .sessions-list a {
        color: var(--link-color);
        text-decoration: none;
        font-weight: 500;
      }

      .sessions-list a:hover {
        text-decoration: underline;
      }

      .markdown-body {
        font-size: 16px;
        line-height: 1.6;
      }

      .markdown-body h1,
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4,
      .markdown-body h5,
      .markdown-body h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
      }

      .markdown-body h1 {
        font-size: 2em;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.3em;
      }

      .markdown-body h2 {
        font-size: 1.5em;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.3em;
      }

      .markdown-body h3 { font-size: 1.25em; }
      .markdown-body h4 { font-size: 1em; }
      .markdown-body h5 { font-size: 0.875em; }
      .markdown-body h6 { font-size: 0.85em; color: #6a737d; }

      .markdown-body p {
        margin-top: 0;
        margin-bottom: 16px;
      }

      .markdown-body a {
        color: var(--link-color);
        text-decoration: none;
      }

      .markdown-body a:hover {
        text-decoration: underline;
      }

      .markdown-body ul,
      .markdown-body ol {
        padding-left: 2em;
        margin-top: 0;
        margin-bottom: 16px;
      }

      .markdown-body li {
        margin-bottom: 0.25em;
      }

      .markdown-body code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        background-color: var(--code-bg);
        border-radius: 6px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      }

      .markdown-body pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: var(--code-bg);
        border-radius: 6px;
        margin-bottom: 16px;
      }

      .markdown-body pre code {
        display: inline;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        background-color: transparent;
        border: 0;
      }

      .markdown-body blockquote {
        padding: 0 1em;
        color: #6a737d;
        border-left: 0.25em solid var(--border-color);
        margin: 0 0 16px 0;
      }

      .markdown-body table {
        border-spacing: 0;
        border-collapse: collapse;
        margin-bottom: 16px;
        width: 100%;
        overflow: auto;
      }

      .markdown-body table th,
      .markdown-body table td {
        padding: 6px 13px;
        border: 1px solid var(--border-color);
      }

      .markdown-body table th {
        font-weight: 600;
        background-color: var(--code-bg);
      }

      .markdown-body table tr {
        background-color: var(--bg-color);
        border-top: 1px solid var(--border-color);
      }

      .markdown-body img {
        max-width: 100%;
        box-sizing: content-box;
      }

      .markdown-body hr {
        height: 0.25em;
        padding: 0;
        margin: 24px 0;
        background-color: var(--border-color);
        border: 0;
      }
    `;
  }

  private generateSessionId(): string {
    return `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public async cleanup(): Promise<void> {
    this.unwatchAllFiles();
    if (this.server) {
      await this.stopPreviewServer();
    }
    this.sessions.clear();
    this.logger.info('PreviewManager cleaned up');
  }
}
