// Data validation utilities

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

/**
 * Validate a single value against a set of rules
 */
export function validateValue(value: any, rules: ValidationRule[]): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'email':
        if (value && !isValidEmail(value)) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'phone':
        if (value && !isValidPhoneNumber(value)) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'min':
        if (typeof value === 'string' && value.length < rule.value) {
          errors[rule.type] = rule.message;
        } else if (typeof value === 'number' && value < rule.value) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'max':
        if (typeof value === 'string' && value.length > rule.value) {
          errors[rule.type] = rule.message;
        } else if (typeof value === 'number' && value > rule.value) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(value)) {
          errors[rule.type] = rule.message;
        }
        break;

      case 'custom':
        if (rule.value && !rule.value(value)) {
          errors[rule.type] = rule.message;
        }
        break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate an entire form object
 */
export function validateForm(data: Record<string, any>, schema: Record<string, ValidationRule[]>): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const fieldResult = validateValue(data[field], rules);

    if (!fieldResult.isValid) {
      Object.assign(errors, Object.fromEntries(
        Object.entries(fieldResult.errors).map(([key, value]) => [`${field}.${key}`, value])
      ));
    }

    Object.assign(warnings, Object.fromEntries(
      Object.entries(fieldResult.warnings).map(([key, value]) => [`${field}.${key}`, value])
    ));
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

// Common validation functions
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  const normalizedPhone = phone.replace(/[^\d]/g, '');
  return phoneRegex.test(normalizedPhone);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

export function isValidCreditCard(cardNumber: string): boolean {
  const cardNumberRegex = /^[0-9]{13,19}$/;
  if (!cardNumberRegex.test(cardNumber.replace(/\s/g, ''))) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidUPI(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z.-]{2,64}$/;
  return upiRegex.test(upiId);
}

export function isValidGST(gstNumber: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNumber.toUpperCase());
}

export function isValidAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  return aadhaarRegex.test(aadhaar);
}

// Common validation schemas
export const userValidationSchema: Record<string, ValidationRule[]> = {
  displayName: [
    { type: 'required', message: 'Name is required' },
    { type: 'min', value: 2, message: 'Name must be at least 2 characters' },
    { type: 'max', value: 50, message: 'Name must not exceed 50 characters' },
  ],
  email: [
    { type: 'email', message: 'Please enter a valid email address' },
  ],
  phoneNumber: [
    { type: 'required', message: 'Phone number is required' },
    { type: 'phone', message: 'Please enter a valid phone number' },
  ],
  password: [
    { type: 'required', message: 'Password is required' },
    { type: 'min', value: 8, message: 'Password must be at least 8 characters' },
    {
      type: 'custom',
      value: isValidPassword,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    },
  ],
};

export const addressValidationSchema: Record<string, ValidationRule[]> = {
  street: [
    { type: 'required', message: 'Street address is required' },
    { type: 'min', value: 5, message: 'Street address must be at least 5 characters' },
  ],
  city: [
    { type: 'required', message: 'City is required' },
    { type: 'min', value: 2, message: 'City must be at least 2 characters' },
  ],
  state: [
    { type: 'required', message: 'State is required' },
    { type: 'min', value: 2, message: 'State must be at least 2 characters' },
  ],
  pincode: [
    { type: 'required', message: 'Pincode is required' },
    {
      type: 'custom',
      value: isValidPincode,
      message: 'Please enter a valid 6-digit pincode'
    },
  ],
  type: [
    { type: 'required', message: 'Address type is required' },
  ],
};

export const productValidationSchema: Record<string, ValidationRule[]> = {
  name: [
    { type: 'required', message: 'Product name is required' },
    { type: 'min', value: 2, message: 'Product name must be at least 2 characters' },
    { type: 'max', value: 100, message: 'Product name must not exceed 100 characters' },
  ],
  description: [
    { type: 'required', message: 'Product description is required' },
    { type: 'min', value: 10, message: 'Description must be at least 10 characters' },
    { type: 'max', value: 500, message: 'Description must not exceed 500 characters' },
  ],
  price: [
    { type: 'required', message: 'Price is required' },
    { type: 'min', value: 0, message: 'Price must be greater than 0' },
  ],
  categoryId: [
    { type: 'required', message: 'Category is required' },
  ],
  preparationTime: [
    { type: 'required', message: 'Preparation time is required' },
    { type: 'min', value: 1, message: 'Preparation time must be at least 1 minute' },
    { type: 'max', value: 480, message: 'Preparation time must not exceed 8 hours' },
  ],
};

export const orderValidationSchema: Record<string, ValidationRule[]> = {
  deliveryAddressId: [
    { type: 'required', message: 'Delivery address is required' },
  ],
  paymentMethod: [
    { type: 'required', message: 'Payment method is required' },
  ],
  items: [
    { type: 'required', message: 'Order must contain at least one item' },
    {
      type: 'custom',
      value: (items: any[]) => items && items.length > 0,
      message: 'Order must contain at least one item'
    },
  ],
};

// Sanitization functions
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 10000); // Limit length
}

// Data type checking
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isNullOrUndefined(value: any): value is null | undefined {
  return value == null;
}

// Range validation
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function isInLengthRange(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

// File validation
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function isValidFileName(fileName: string): boolean {
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  return !invalidChars.test(fileName) && fileName.length <= 255;
}

// Business logic validation
export function canPlaceOrder(cartItems: any[], userAddresses: any[]): boolean {
  if (!cartItems || cartItems.length === 0) return false;
  if (!userAddresses || userAddresses.length === 0) return false;

  const hasValidItems = cartItems.every(item =>
    item.quantity > 0 &&
    item.price > 0 &&
    item.productId &&
    item.chefId
  );

  const hasDefaultAddress = userAddresses.some(addr => addr.isDefault);

  return hasValidItems && hasDefaultAddress;
}

export function calculateOrderTotal(items: any[], deliveryFee: number = 0, taxRate: number = 0.18): {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + deliveryFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    deliveryFee,
    total: Math.round(total * 100) / 100,
  };
}

export function validateBusinessHours(openTime: string, closeTime: string, currentTime?: Date): {
  isOpen: boolean;
  nextOpenTime?: string;
  message: string;
} {
  const now = currentTime || new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

  let message = isOpen ? 'Open' : 'Closed';
  let nextOpenTime: string | undefined;

  if (!isOpen) {
    const nextOpen = new Date(now);
    nextOpen.setHours(openHour, openMinute, 0, 0);

    if (currentMinutes > closeMinutes) {
      // Next day
      nextOpen.setDate(nextOpen.getDate() + 1);
    }

    nextOpenTime = nextOpen.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    message = `Opens at ${nextOpenTime}`;
  }

  return {
    isOpen,
    nextOpenTime,
    message,
  };
}
