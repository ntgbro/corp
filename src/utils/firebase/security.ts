// Firebase security utilities

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"']/g, '') // Remove HTML tags and quotes
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format for security
 */
export function isSecureEmail(email: string): boolean {
  // Basic email validation with additional security checks
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional security checks
  if (email.length > 254) {
    return false; // RFC 5321 limit
  }

  const [localPart, domain] = email.split('@');
  if (localPart.length > 64) {
    return false; // RFC 5321 limit
  }

  // Check for suspicious patterns
  if (localPart.includes('..')) {
    return false; // Consecutive dots
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false; // Leading/trailing dots
  }

  return true;
}

/**
 * Validate phone number for security
 */
export function isSecurePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Must start with + and have country code
  if (!cleanPhone.startsWith('+')) {
    return false;
  }

  // Must have at least 10 digits
  if (cleanPhone.length < 12) { // +country code (2-4 digits) + number (8+ digits)
    return false;
  }

  // Check for suspicious patterns
  if (cleanPhone.includes('++')) {
    return false; // Double plus
  }

  if (cleanPhone.match(/(\d)\1{4,}/)) {
    return false; // Too many consecutive identical digits
  }

  return true;
}

/**
 * Sanitize document data for Firestore
 */
export function sanitizeDocumentData(data: any, allowedFields: string[] = []): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    return sanitizeUserInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeDocumentData(item, allowedFields));
  }

  if (typeof data === 'object') {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Check if field is allowed
      if (allowedFields.length > 0 && !allowedFields.includes(key)) {
        continue; // Skip unallowed fields
      }

      // Sanitize field name
      const sanitizedKey = sanitizeUserInput(key);

      // Skip dangerous field names
      if (sanitizedKey !== key || key.includes('__') || key.startsWith('$')) {
        continue;
      }

      sanitized[sanitizedKey] = sanitizeDocumentData(value, allowedFields);
    }

    return sanitized;
  }

  return data;
}

/**
 * Validate file upload security
 */
export function validateFileUploadSecurity(file: File): {
  isSecure: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    issues.push('File size exceeds maximum allowed size');
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ];

  if (!allowedTypes.includes(file.type)) {
    issues.push('File type not allowed');
  }

  // Check file name
  if (file.name.length > 255) {
    issues.push('File name too long');
  }

  if (/[<>\"']/g.test(file.name)) {
    issues.push('File name contains invalid characters');
  }

  // Check for suspicious file extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
  const fileName = file.name.toLowerCase();

  if (suspiciousExtensions.some(ext => fileName.endsWith(ext))) {
    issues.push('Suspicious file extension');
  }

  return {
    isSecure: issues.length === 0,
    issues,
  };
}

/**
 * Generate secure random string
 */
export function generateSecureRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Hash sensitive data (for logging purposes)
 */
export function hashSensitiveData(data: string): string {
  // Simple hash function for demonstration
  // In production, use a proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check if user input contains potential XSS
 */
export function containsXSSRisk(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') {
    return '';
  }

  // Remove potential SQL injection patterns
  const sqlPatterns = [
    /(\bselect\b|\bunion\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/gi,
    /(--|\*|;|\bor\b|\band\b)/gi,
    /(\bexec\b|\bexecute\b|\bsp_\b|\bxp_\b)/gi,
  ];

  let sanitized = query;

  for (const pattern of sqlPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  return sanitized.trim();
}

/**
 * Validate URL for security
 */
export function isSecureUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Check hostname (prevent localhost in production)
    if (__DEV__ && parsedUrl.hostname === 'localhost') {
      return true; // Allow localhost in development
    }

    // Check for suspicious domains
    const suspiciousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (suspiciousDomains.includes(parsedUrl.hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Encrypt sensitive data (placeholder)
 */
export function encryptSensitiveData(data: string): string {
  // In a real implementation, this would use proper encryption
  // For now, just base64 encode
  return Buffer.from(data).toString('base64');
}

/**
 * Decrypt sensitive data (placeholder)
 */
export function decryptSensitiveData(encryptedData: string): string {
  // In a real implementation, this would use proper decryption
  // For now, just base64 decode
  return Buffer.from(encryptedData, 'base64').toString('utf8');
}

/**
 * Validate API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  // Firebase API keys are typically 39 characters long
  // and contain only alphanumeric characters and hyphens
  const apiKeyRegex = /^[A-Za-z0-9_-]{35,45}$/;
  return apiKeyRegex.test(apiKey);
}

/**
 * Check if user agent is suspicious
 */
export function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /automation/i,
    /headless/i,
    /selenium/i,
    /puppeteer/i,
    /phantomjs/i,
    /sqlmap/i,
    /nmap/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Rate limiting check
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this key
    const requests = this.requests.get(key) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    // Check if under limit
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(key, validRequests);
      return true;
    }

    return false;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(key: string): number {
    const requests = this.requests.get(key) || [];
    if (requests.length === 0) return Date.now();

    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > windowStart);

      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

/**
 * Security event logging
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void {
  const securityEvent = {
    event,
    details,
    severity,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.warn('Security Event:', securityEvent);

  // In production, send to security monitoring service
  // securityService.reportEvent(securityEvent);
}

/**
 * Check for common security vulnerabilities in data
 */
export function securityAudit(data: any): {
  hasIssues: boolean;
  issues: Array<{
    type: string;
    field: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
} {
  const issues: Array<{
    type: string;
    field: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }> = [];

  function auditObject(obj: any, path: string = ''): void {
    if (obj === null || obj === undefined) {
      return;
    }

    if (typeof obj === 'string') {
      if (containsXSSRisk(obj)) {
        issues.push({
          type: 'xss',
          field: path,
          description: 'Potential XSS vulnerability detected',
          severity: 'high',
        });
      }

      if (obj.includes('javascript:')) {
        issues.push({
          type: 'javascript_url',
          field: path,
          description: 'JavaScript URL detected',
          severity: 'high',
        });
      }

      if (obj.includes('data:')) {
        issues.push({
          type: 'data_url',
          field: path,
          description: 'Data URL detected',
          severity: 'medium',
        });
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        auditObject(item, `${path}[${index}]`);
      });
    } else if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        const fieldPath = path ? `${path}.${key}` : key;

        // Check for suspicious field names
        if (key.startsWith('__') || key.includes('$')) {
          issues.push({
            type: 'suspicious_field',
            field: fieldPath,
            description: 'Suspicious field name detected',
            severity: 'medium',
          });
        }

        auditObject(value, fieldPath);
      }
    }
  }

  auditObject(data);

  return {
    hasIssues: issues.length > 0,
    issues,
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureRandomString(32);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length >= 32;
}

/**
 * Check for SQL injection patterns
 */
export function hasSQLInjectionRisk(input: string): boolean {
  const sqlPatterns = [
    /(\bselect\b|\bunion\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/gi,
    /(\bexec\b|\bexecute\b|\bsp_\b|\bxp_\b)/gi,
    /(--|\*|;|\bor\b|\band\b)/gi,
    /(\bscript\b|\biframe\b|\bobject\b|\bembed\b)/gi,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize database query parameters
 */
export function sanitizeQueryParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      if (hasSQLInjectionRisk(value)) {
        throw new Error(`SQL injection risk detected in parameter: ${key}`);
      }
      sanitized[key] = sanitizeUserInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Validate Firebase security rules compliance
 */
export function validateFirestoreSecurity(
  operation: 'read' | 'write',
  collection: string,
  data?: any,
  userId?: string
): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check collection name
  if (!collection || collection.includes('/') || collection.length > 63) {
    violations.push('Invalid collection name');
  }

  // Check user authentication for write operations
  if (operation === 'write' && !userId) {
    violations.push('User must be authenticated for write operations');
  }

  // Check document size
  if (data) {
    const dataSize = JSON.stringify(data).length;
    if (dataSize > 1048576) { // 1MB
      violations.push('Document size exceeds Firestore limit');
    }
  }

  // Check field names
  if (data && typeof data === 'object') {
    for (const fieldName of Object.keys(data)) {
      if (fieldName.startsWith('__') || fieldName.includes('.')) {
        violations.push(`Invalid field name: ${fieldName}`);
      }
    }
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}
