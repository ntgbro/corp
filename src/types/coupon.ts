export interface Coupon {
  id: string;
  code: string;
  name: string;
  title: string;
  description: string;
  imageURL?: string;
  isActive: boolean;
  isStackable: boolean;
  maxUses?: number;
  usedCount?: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  minOrderCount: number;
  discountType: 'percentage' | 'fixed';
  type?: 'percentage' | 'fixed'; // Alternative field name
  discountValue: number;
  value?: number; // Alternative to discountValue
  validFrom: Date | any; // Can be Date or Firestore Timestamp
  validTill: Date | any; // Can be Date or Firestore Timestamp
  validUntil?: Date | any; // Can be Date or Firestore Timestamp
  cities?: string[];
  restaurants?: string[];
  services?: string[];
  zones?: string[];
  warehouses?: string[];
  categories?: string[];
  dayOfWeek?: string[];
  userType?: string;
  applicableFor?: Record<string, boolean>;
  usage?: Record<string, number>;
  maxUsagePerUser?: number;
  maxUsage?: number;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  createdBy?: string;
  termsAndConditions?: string;
  usageLimit?: {
    perUserLimit?: number;
    totalUsage?: number;
  };
  couponId?: string;
}

export interface AppliedCoupon extends Omit<Coupon, 'validFrom' | 'validTill' | 'isActive'> {
  appliedAt: Date;
  discountAmount: number;
}