// =====================================================================
// MARKET1 UNIVERSAL WALLET ENGINE (MUTE)
// Securely handles user credits, billing, and balances.
// =====================================================================

import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const UniversalWalletEngine = {
  
  // 1. Fetch current balance
  async getBalance(userId: string): Promise<number> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data().credits || 0;
      } else {
        // Initialize new user with 100 free credits
        await setDoc(userRef, { credits: 100, createdAt: new Date().toISOString() });
        return 100;
      }
    } catch (error) {
      console.error('[MUTE Wallet Engine] Error fetching balance:', error);
      return 0; // Safe fallback
    }
  },

  // 2. Validate if user has enough credits before execution
  async hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
    if (requiredCredits <= 0) return true;
    const balance = await this.getBalance(userId);
    return balance >= requiredCredits;
  },

  // 3. Deduct credits safely after successful execution
  async deductCredits(userId: string, amount: number): Promise<boolean> {
    if (amount <= 0) return true;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        credits: increment(-amount) // Atomic decrement
      });
      console.log(`[MUTE Wallet Engine] Deducted ${amount} credits from ${userId}`);
      return true;
    } catch (error) {
      console.error('[MUTE Wallet Engine] Failed to deduct credits:', error);
      return false;
    }
  }
};
