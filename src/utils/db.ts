import { Member, Bill, Reminder, MembershipPlan } from '../types';
import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

// Member operations
export const addMember = async (member: Omit<Member, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'members'), member);
    return { id: docRef.id, ...member };
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

export const updateMember = async (id: string, updates: Partial<Member>) => {
  try {
    await updateDoc(doc(db, 'members', id), updates);
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const getMembers = async (): Promise<Member[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'members'));
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Member));
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};

// Bill operations
export const addBill = async (bill: Omit<Bill, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'bills'), bill);
    return { id: docRef.id, ...bill };
  } catch (error) {
    console.error('Error adding bill:', error);
    throw error;
  }
};

export const updateBill = async (id: string, updates: Partial<Bill>) => {
  try {
    await updateDoc(doc(db, 'bills', id), updates);
  } catch (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
};

export const getBills = async (memberId?: string): Promise<Bill[]> => {
  try {
    let q;
    if (memberId) {
      q = query(collection(db, 'bills'), where('memberId', '==', memberId));
    } else {
      q = query(collection(db, 'bills'));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Bill));
  } catch (error) {
    console.error('Error getting bills:', error);
    throw error;
  }
};

// Reminder operations
export const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'reminders'), reminder);
    return { id: docRef.id, ...reminder };
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

export const updateReminder = async (id: string, updates: Partial<Reminder>) => {
  try {
    await updateDoc(doc(db, 'reminders', id), updates);
  } catch (error) {
    console.error('Error updating reminder:', error);
    throw error;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'reminders'));
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as Reminder));
  } catch (error) {
    console.error('Error getting reminders:', error);
    throw error;
  }
};

// Membership plans with discounts
export const membershipPlans: MembershipPlan[] = [
  { type: 'monthly', duration: 30, durationLabel: 'Monthly', discount: 0, multiplier: 1 },
  { type: 'quarterly', duration: 90, durationLabel: 'Quarterly (3 months)', discount: 5, multiplier: 3 },
  { type: 'halfyear', duration: 180, durationLabel: 'Half Year (6 months)', discount: 10, multiplier: 6 },
  { type: 'annual', duration: 365, durationLabel: 'Annual (12 months)', discount: 20, multiplier: 12 },
];

// Base monthly pricing
export const basePricing = {
  strength: 1200,        // ₹1200
  cardio: 300,           // +₹300 for cardio (total ₹1500)
  training: 500,         // +₹500 for training
};

// Calculate membership price based on plan and features
export const calculateMembershipPrice = (
  planType: 'monthly' | 'quarterly' | 'halfyear' | 'annual',
  strength: boolean,
  cardio: boolean,
  training: boolean
): { baseAmount: number; discountPercentage: number; finalAmount: number } => {
  // Calculate monthly base amount
  let monthlyAmount = 0;
  if (strength) monthlyAmount += basePricing.strength;
  if (cardio) monthlyAmount += basePricing.cardio;
  if (training) monthlyAmount += basePricing.training;

  // Find the plan
  const plan = membershipPlans.find(p => p.type === planType);
  if (!plan) {
    return { baseAmount: monthlyAmount, discountPercentage: 0, finalAmount: monthlyAmount };
  }

  // Calculate base amount for the duration (before discount)
  const baseAmount = Math.round(monthlyAmount * plan.multiplier);
  
  // Apply discount with proper rounding
  const discountPercentage = plan.discount;
  const discountAmount = Math.round(baseAmount * (discountPercentage / 100));
  const finalAmount = Math.round(baseAmount - discountAmount);

  return { baseAmount, discountPercentage, finalAmount };
};

// Format membership details for display
export const formatMembershipDetails = (
  strength: boolean,
  cardio: boolean,
  training: boolean
): string => {
  const features: string[] = [];
  if (strength) features.push('Strength');
  if (cardio) features.push('Cardio');
  if (training) features.push('Training');
  return features.join(' + ') || 'None';
};

export const calculateExpiryDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
