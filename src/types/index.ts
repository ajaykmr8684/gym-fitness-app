export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planType: 'monthly' | 'quarterly' | 'halfyear' | 'annual';
  planDuration: number; // in days
  strength: boolean;
  cardio: boolean;
  training: boolean;
  baseAmount: number; // Monthly base price
  discountPercentage: number;
  amount: number; // Final price after discount
  amountPaid: number;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'expired';
  notes?: string;
  whatsappOptIn: boolean;
}

export interface Bill {
  id: string;
  memberId: string;
  memberName: string;
  planType: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  billingDate: string;
  status: 'pending' | 'paid' | 'overdue';
  notes?: string;
  emailSent: boolean;
  whatsappSent: boolean;
}

export interface Reminder {
  id: string;
  memberId: string;
  memberName: string;
  type: 'membership_expiry' | 'payment_due' | 'payment_overdue';
  dueDate: string;
  message: string;
  sent: boolean;
  sentDate?: string;
  sentVia: ('email' | 'whatsapp')[];
}

export interface MembershipPlan {
  type: 'monthly' | 'quarterly' | 'halfyear' | 'annual';
  duration: number; // in days
  durationLabel: string;
  discount: number; // percentage
  multiplier: number; // months or duration multiplier
}
