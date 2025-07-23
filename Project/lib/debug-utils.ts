/**
 * Debug utility functions for the JobFit application
 * These utilities provide debugging capabilities during development
 */

// Only log in development mode
const isDev = process.env.NODE_ENV === 'development';

/**
 * Enhanced console logging with timestamp and type
 */
export const logger = {
  info: (message: string, data?: any) => {
    if (!isDev) return;
    console.log(
      `%c[INFO] ${new Date().toISOString()}`,
      'color: #3498db; font-weight: bold;',
      message,
      data ? data : ''
    );
  },
  
  warn: (message: string, data?: any) => {
    if (!isDev) return;
    console.warn(
      `%c[WARN] ${new Date().toISOString()}`,
      'color: #f39c12; font-weight: bold;',
      message,
      data ? data : ''
    );
  },
  
  error: (message: string, error?: any) => {
    if (!isDev) return;
    console.error(
      `%c[ERROR] ${new Date().toISOString()}`,
      'color: #e74c3c; font-weight: bold;',
      message,
      error ? error : ''
    );
  },
  
  success: (message: string, data?: any) => {
    if (!isDev) return;
    console.log(
      `%c[SUCCESS] ${new Date().toISOString()}`,
      'color: #2ecc71; font-weight: bold;',
      message,
      data ? data : ''
    );
  }
};

/**
 * API request/response logger middleware
 */
export const logApiRequest = async (
  endpoint: string,
  method: string,
  requestData: any,
  responseCallback: () => Promise<any>
) => {
  if (!isDev) return responseCallback();
  
  try {
    logger.info(`API Request: ${method} ${endpoint}`, requestData);
    const startTime = performance.now();
    
    const response = await responseCallback();
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    logger.success(`API Response (${duration}ms): ${method} ${endpoint}`, response);
    return response;
  } catch (error) {
    logger.error(`API Error: ${method} ${endpoint}`, error);
    throw error;
  }
};

/**
 * Local storage debug helper
 */
export const storageDebugger = {
  inspect: (key: string) => {
    if (!isDev) return;
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        logger.warn(`LocalStorage: No data found for key "${key}"`);
        return null;
      }
      
      const parsed = JSON.parse(value);
      logger.info(`LocalStorage: Contents of "${key}"`, parsed);
      return parsed;
    } catch (e) {
      logger.error(`LocalStorage: Error parsing key "${key}"`, e);
      return null;
    }
  },
  
  listAll: () => {
    if (!isDev) return;
    const keys = Object.keys(localStorage);
    const items = keys.map(key => ({
      key,
      size: localStorage.getItem(key)?.length || 0,
      preview: localStorage.getItem(key)?.substring(0, 50) + '...'
    }));
    
    logger.info('LocalStorage: All stored items', items);
    return items;
  },
  
  clear: () => {
    if (!isDev) return;
    localStorage.clear();
    logger.warn('LocalStorage: All items cleared');
  }
};

/**
 * Performance monitoring
 */
export const perf = {
  timers: {} as Record<string, number>,
  
  start: (label: string) => {
    if (!isDev) return;
    perf.timers[label] = performance.now();
    logger.info(`Performance: Started timer "${label}"`);
  },
  
  end: (label: string) => {
    if (!isDev) return;
    if (!perf.timers[label]) {
      logger.warn(`Performance: Timer "${label}" not found`);
      return;
    }
    
    const duration = Math.round(performance.now() - perf.timers[label]);
    logger.info(`Performance: "${label}" took ${duration}ms`);
    delete perf.timers[label];
    return duration;
  }
};

/**
 * Component rendering debugger
 * Use this to track component render cycles
 */
export const trackRender = (componentName: string, props?: any) => {
  if (!isDev) return;
  logger.info(`Component Rendered: ${componentName}`, props);
};

export default {
  logger,
  logApiRequest,
  storageDebugger,
  perf,
  trackRender
}; 