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
  discountValue: number;
  validFrom: Date | any; // Can be Date or Firestore Timestamp
  validTill: Date | any; // Can be Date or Firestore Timestamp
  cities?: string[];
  restaurants?: string[];
  services?: string[];
  zones?: string[];
  applicableFor?: Record<string, boolean>;
  usage?: Record<string, number>;
  maxUsagePerUser?: number;
  maxUsage?: number;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface AppliedCoupon extends Omit<Coupon, 'validFrom' | 'validTill' | 'isActive'> {
  appliedAt: Date;
  discountAmount: number;
  discountValue: number;
}
