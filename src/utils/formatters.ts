// Data formatting utilities

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as currency without symbol
 */
export function formatCurrencyValue(
  amount: number,
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a large number with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format a duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format a date and time
 */
export function formatDateTime(
  date: Date | string | number,
  locale: string = 'en-IN'
): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }, locale);
}

/**
 * Format a time
 */
export function formatTime(
  date: Date | string | number,
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-IN'
): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  if (cleaned.length === 13 && cleaned.startsWith('91')) {
    return `+91-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Format a credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cardNumber;
}

/**
 * Format an address for display
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Format a rating (e.g., 4.5 stars)
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  return `${rating.toFixed(1)} / ${maxRating}`;
}

/**
 * Format a weight with appropriate units
 */
export function formatWeight(weight: number, unit: string = 'kg'): string {
  if (weight < 1 && unit === 'kg') {
    return `${(weight * 1000).toFixed(0)} g`;
  }
  return `${weight.toFixed(2)} ${unit}`;
}

/**
 * Format a distance
 */
export function formatDistance(distance: number, unit: 'km' | 'm' = 'km'): string {
  if (unit === 'm' && distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  if (unit === 'km' && distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} ${unit}`;
}

/**
 * Format a temperature
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  return `${temp.toFixed(1)}°${unit}`;
}

/**
 * Format a list with a conjunction
 */
export function formatList(items: string[], conjunction: string = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];
  return `${allButLast}, ${conjunction} ${last}`;
}

/**
 * Format a name (capitalize first letters)
 */
export function formatName(name: string): string {
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format a product name with brand
 */
export function formatProductName(product: { name: string; brand?: string }): string {
  if (product.brand) {
    return `${product.brand} ${product.name}`;
  }
  return product.name;
}

/**
 * Format an order status for display
 */
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Order Placed',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready': 'Ready for Pickup',
    'picked_up': 'Picked Up',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
  };

  return statusMap[status] || status;
}

/**
 * Format a payment status
 */
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
    'refunded': 'Refunded',
    'partially_refunded': 'Partially Refunded',
  };

  return statusMap[status] || status;
}

/**
 * Format a quantity with unit
 */
export function formatQuantity(quantity: number, unit: string): string {
  if (quantity === 1 && unit.endsWith('s')) {
    return `${quantity} ${unit.slice(0, -1)}`;
  }
  return `${quantity} ${unit}`;
}

/**
 * Format a price range
 */
export function formatPriceRange(min: number, max: number, currency: string = 'INR'): string {
  if (min === max) {
    return formatCurrency(min, currency);
  }
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

/**
 * Format a business hours string
 */
export function formatBusinessHours(hours: {
  open: string;
  close: string;
  isOpen: boolean;
}): string {
  const { open, close, isOpen } = hours;
  const status = isOpen ? 'Open' : 'Closed';
  return `${status}: ${open} - ${close}`;
}

/**
 * Format a review summary
 */
export function formatReviewSummary(rating: number, count: number): string {
  if (count === 0) return 'No reviews yet';
  return `${rating.toFixed(1)} stars (${count} review${count > 1 ? 's' : ''})`;
}

/**
 * Format a chef rating and specialty
 */
export function formatChefInfo(chef: {
  name: string;
  rating: number;
  specialties: string[];
}): string {
  const specialties = chef.specialties.slice(0, 2).join(', ');
  return `${chef.name} • ${chef.rating.toFixed(1)} ⭐ • ${specialties}`;
}

/**
 * Format a delivery time estimate
 */
export function formatDeliveryTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format a discount
 */
export function formatDiscount(discount: number, type: 'percentage' | 'fixed'): string {
  if (type === 'percentage') {
    return `${discount}% off`;
  }
  return formatCurrency(discount);
}

/**
 * Format a tag list
 */
export function formatTags(tags: string[]): string {
  return tags.map(tag => `#${tag}`).join(' ');
}

/**
 * Format a user's initials
 */
export function formatInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Format a coordinate for display
 */
export function formatCoordinate(lat: number, lng: number, precision: number = 4): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}

/**
 * Format a boolean value
 */
export function formatBoolean(value: boolean, trueText: string = 'Yes', falseText: string = 'No'): string {
  return value ? trueText : falseText;
}

/**
 * Format a status with color indicator
 */
export function formatStatus(
  status: string,
  statusMap: Record<string, { text: string; color: string }>
): { text: string; color: string } {
  return statusMap[status] || { text: status, color: '#666' };
}

/**
 * Format a number with ordinal suffix
 */
export function formatOrdinal(num: number): string {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

/**
 * Format a compact number (e.g., 1.2K, 3.5M)
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Format a slug from a string
 */
export function formatSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a title case string
 */
export function formatTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Format a truncated string with ellipsis
 */
export function formatTruncated(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format a JSON object for display
 */
export function formatJSON(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

/**
 * Format a code block
 */
export function formatCodeBlock(code: string, language: string = 'javascript'): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}
