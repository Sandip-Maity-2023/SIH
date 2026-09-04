const fs = require('fs');
const path = require('path');

// Ensure log directory exists
const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const errorLogPath = path.join(logDirectory, 'error.log');
const combinedLogPath = path.join(logDirectory, 'combined.log');

const formatLogMessage = (level, message, meta = '') => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}\n`;
};

const writeToFile = (filePath, content) => {
  fs.appendFile(filePath, content, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

const logger = {
  info: (message, meta) => {
    const formatted = formatLogMessage('info', message, meta);
    console.log(`ℹ️  ${formatted.trim()}`);
    writeToFile(combinedLogPath, formatted);
  },

  warn: (message, meta) => {
    const formatted = formatLogMessage('warn', message, meta);
    console.warn(`⚠️  ${formatted.trim()}`);
    writeToFile(combinedLogPath, formatted);
  },

  error: (message, meta) => {
    const formatted = formatLogMessage('error', message, meta);
    console.error(`❌ ${formatted.trim()}`);
    writeToFile(combinedLogPath, formatted);
    writeToFile(errorLogPath, formatted);
  },

  debug: (message, meta) => {
    if (process.env.NODE_ENV === 'development') {
      const formatted = formatLogMessage('debug', message, meta);
      console.debug(`🐛 ${formatted.trim()}`);
    }
  },
};

module.exports = logger;