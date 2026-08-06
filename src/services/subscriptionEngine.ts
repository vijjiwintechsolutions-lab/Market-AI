// =====================================================================
// MARKET1 UNIVERSAL SUBSCRIPTION ENGINE (MUTE)
// Manages Pricing Tiers, Daily Limits, and Feature Access.
// =====================================================================

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface TierLimits {
  maxFileSizeMB: number;
  dailyFreeExecutions: number;
  hasPriorityProcessing: boolean;
}

const TIER_CONFIGS: Record<SubscriptionTier, TierLimits> = {
  free: { maxFileSizeMB: 10, dailyFreeExecutions: 5, hasPriorityProcessing: false },
  pro: { maxFileSizeMB: 100, dailyFreeExecutions: 9999, hasPriorityProcessing: true },
  enterprise: { maxFileSizeMB: 500, dailyFreeExecutions: 99999, hasPriorityProcessing: true }
};

export const UniversalSubscriptionEngine = {
  // 1. Get User's Current Tier
  async getUserTier(userId: string): Promise<SubscriptionTier> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().subscriptionTier) {
        return userSnap.data().subscriptionTier as SubscriptionTier;
      }
      return 'free';
    } catch (error) {
      console.error('[MUTE Subscription Engine] Failed to fetch tier:', error);
      return 'free';
    }
  },

  // 2. Get Limits for the User
  async getUserLimits(userId: string | null): Promise<TierLimits> {
    if (!userId) return TIER_CONFIGS['free']; // Guests always get free limits
    const tier = await this.getUserTier(userId);
    return TIER_CONFIGS[tier];
  },

  // 3. Track Daily Usage (To enforce the 5 free runs/day)
  async checkDailyLimit(userId: string): Promise<boolean> {
    const limits = await this.getUserLimits(userId);
    if (limits.dailyFreeExecutions > 1000) return true; // Pro users skip this check

    try {
      const today = new Date().toISOString().split('T')[0];
      const usageRef = doc(db, 'usage', `${userId}_${today}`);
      const usageSnap = await getDoc(usageRef);

      if (!usageSnap.exists()) {
        // First run of the day
        await setDoc(usageRef, { count: 0 });
        return true;
      }

      const currentCount = usageSnap.data().count || 0;
      return currentCount < limits.dailyFreeExecutions;
    } catch (error) {
      console.error('[MUTE Subscription Engine] Daily limit check failed:', error);
      return false; // Fail safe
    }
  },

  // 4. Increment Daily Usage
  async incrementDailyUsage(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const usageRef = doc(db, 'usage', `${userId}_${today}`);
      const usageSnap = await getDoc(usageRef);
      
      if (usageSnap.exists()) {
        await setDoc(usageRef, { count: (usageSnap.data().count || 0) + 1 }, { merge: true });
      }
    } catch (error) {
      console.error('[MUTE Subscription Engine] Failed to increment usage:', error);
    }
  }
};
