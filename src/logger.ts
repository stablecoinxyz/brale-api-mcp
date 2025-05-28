import fs from 'fs';
import path from 'path';

class Logger {
  private logFile: string;
  private isDev: boolean;
  
  constructor() {
    this.logFile = path.join(process.cwd(), 'mcp-debug.log');
    this.isDev = process.env.NODE_ENV === 'development' || process.env.MCP_DEBUG === 'true';
    
    // Create log file if it doesn't exist
    if (this.isDev && !fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }
  
  private writeLog(level: string, message: string, data?: any) {
    if (!this.isDev) return;
    
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : '';
    const logEntry = `${timestamp} [${level}] ${message}${dataStr}\n`;
    
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      // Silently fail if we can't write to log file
    }
  }
  
  info(message: string, data?: any) {
    this.writeLog('INFO', message, data);
  }
  
  debug(message: string, data?: any) {
    this.writeLog('DEBUG', message, data);
  }
  
  warn(message: string, data?: any) {
    this.writeLog('WARN', message, data);
  }
  
  error(message: string, error?: any) {
    this.writeLog('ERROR', message, error);
  }
  
  // Clear log file
  clear() {
    if (this.isDev && fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }
  
  // Get log file path for external access
  getLogPath(): string {
    return this.logFile;
  }
}

export const logger = new Logger(); 