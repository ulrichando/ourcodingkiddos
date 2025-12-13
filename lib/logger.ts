/**
 * Production-safe Logger
 *
 * In development, logs to console.
 * In production, can be configured to:
 * - Disable non-error logs
 * - Send logs to external service (Sentry, LogRocket, etc.)
 * - Log to server-side file
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === 'production';
const isDebugEnabled = process.env.DEBUG_LOGS === 'true';

/**
 * Formats a log message with optional context
 */
function formatMessage(prefix: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${prefix}] ${message}${contextStr}`;
}

/**
 * Logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug logs - only shown in development or when DEBUG_LOGS=true
   */
  debug(prefix: string, message: string, context?: LogContext): void {
    if (!isProduction || isDebugEnabled) {
      console.debug(formatMessage(prefix, message, context));
    }
  },

  /**
   * Info logs - shown in development, silenced in production unless DEBUG_LOGS=true
   */
  info(prefix: string, message: string, context?: LogContext): void {
    if (!isProduction || isDebugEnabled) {
      console.info(formatMessage(prefix, message, context));
    }
  },

  /**
   * Warning logs - always shown
   */
  warn(prefix: string, message: string, context?: LogContext): void {
    console.warn(formatMessage(prefix, message, context));
  },

  /**
   * Error logs - always shown
   * In production, could be sent to error tracking service
   */
  error(prefix: string, message: string, error?: unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorContext: LogContext = { ...context };

    if (error instanceof Error && error.stack) {
      errorContext.stack = error.stack;
    } else if (error && !(error instanceof Error)) {
      errorContext.rawError = error;
    }

    console.error(formatMessage(prefix, `${message}: ${errorMessage}`, errorContext));

    // In production, you could send to an error tracking service:
    // if (isProduction) {
    //   Sentry.captureException(error, { extra: errorContext });
    // }
  },

  /**
   * Auth-specific logging
   */
  auth: {
    debug(message: string, context?: LogContext): void {
      logger.debug('Auth', message, context);
    },
    info(message: string, context?: LogContext): void {
      logger.info('Auth', message, context);
    },
    warn(message: string, context?: LogContext): void {
      logger.warn('Auth', message, context);
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      logger.error('Auth', message, error, context);
    },
  },

  /**
   * Google Meet-specific logging
   */
  googleMeet: {
    debug(message: string, context?: LogContext): void {
      logger.debug('Google Meet', message, context);
    },
    info(message: string, context?: LogContext): void {
      logger.info('Google Meet', message, context);
    },
    warn(message: string, context?: LogContext): void {
      logger.warn('Google Meet', message, context);
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      logger.error('Google Meet', message, error, context);
    },
  },

  /**
   * Email-specific logging
   */
  email: {
    debug(message: string, context?: LogContext): void {
      logger.debug('Email', message, context);
    },
    info(message: string, context?: LogContext): void {
      logger.info('Email', message, context);
    },
    warn(message: string, context?: LogContext): void {
      logger.warn('Email', message, context);
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      logger.error('Email', message, error, context);
    },
  },

  /**
   * API-specific logging
   */
  api: {
    debug(message: string, context?: LogContext): void {
      logger.debug('API', message, context);
    },
    info(message: string, context?: LogContext): void {
      logger.info('API', message, context);
    },
    warn(message: string, context?: LogContext): void {
      logger.warn('API', message, context);
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      logger.error('API', message, error, context);
    },
  },

  /**
   * Database-specific logging
   */
  db: {
    debug(message: string, context?: LogContext): void {
      logger.debug('DB', message, context);
    },
    info(message: string, context?: LogContext): void {
      logger.info('DB', message, context);
    },
    warn(message: string, context?: LogContext): void {
      logger.warn('DB', message, context);
    },
    error(message: string, error?: unknown, context?: LogContext): void {
      logger.error('DB', message, error, context);
    },
  },
};

export default logger;
