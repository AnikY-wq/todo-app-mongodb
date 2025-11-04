import pino from 'pino';
import config from '../config/config.js';

const isDevelopment = config.env === 'local' || config.env === 'dev';

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
            destination: 'logs/app.log',
          },
        },
  }
);

export default logger;

