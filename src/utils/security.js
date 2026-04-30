/**
 * src/utils/security.js
 * 
 * Provides Input Sanitization and Client-side Rate Limiting functions
 * to protect the app from basic injection attacks and bot spam.
 */

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Basic HTML tag stripping to prevent script injection
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[$\{\}<>]/g, '') // Strip potential template/injection chars
    .trim();
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

/**
 * Checks if an action should be rate limited.
 * @param {string} actionName - Unique identifier for the action
 * @param {number} limit - Max number of allowed actions within the timeframe
 * @param {number} timeframeMs - Time window in milliseconds (default 1 min)
 * @returns {boolean} - Returns true if rate limit is exceeded
 */
export const checkRateLimit = (actionName, limit = 5, timeframeMs = 60000) => {
  try {
    const key = `ratelimit_${actionName}`;
    const now = Date.now();
    const stored = localStorage.getItem(key);
    
    let attempts = [];
    if (stored) {
      attempts = JSON.parse(stored);
      // Filter out attempts outside the current timeframe
      attempts = attempts.filter(time => now - time < timeframeMs);
    }
    
    if (attempts.length >= limit) {
      return true; // Rate limit exceeded
    }
    
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));
    return false; // Allowed
    
  } catch (err) {
    // If localStorage fails (e.g., private mode), fail open
    console.warn("Rate limiter skipped due to storage error");
    return false;
  }
};
