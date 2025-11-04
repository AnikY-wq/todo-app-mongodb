import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = config.env === 'local' || config.env === 'dev';

// Ensure logs directory exists
// const logsDir = path.join(path.dirname(__dirname), 'logs');
const logsDir = '/tmp/logs'; // ✅ writable
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'app.log');

const logger = pino(
  {
    level: isDevelopment ? 'debug' : 'info',
    transport: isDevelopment
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
      : {
        target: 'pino/file',
        options: {
          destination: logFilePath,
        },
      },
  }
);

export default logger;

