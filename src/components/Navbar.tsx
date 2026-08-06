// =====================================================================
// MARKET1 UNIVERSAL NAVBAR (MUTE)
// Handles global navigation, Firebase Auth state, and Wallet Balance.
// =====================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, LogOut, Zap, Sparkles, UserCircle } from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { UniversalWalletEngine } from '../services/walletEngine';

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const balance = await UniversalWalletEngine.getBalance(currentUser.uid);
        setCredits(balance);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("[MUTE Auth] Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("[MUTE Auth] Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10 transition-all font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-900/40">
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                MARKET<span className="text-emerald-400">1</span>
              </span>
            </Link>
            <span className="hidden sm:flex items-center gap-1 ml-4 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-emerald-500" /> OS
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-[#151517] border border-white/10 px-3 py-1.5 rounded-full">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">{credits} <span className="text-slate-400 font-normal">Credits</span></span>
                    </div>

                    <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
                      ) : (
                        <UserCircle className="w-8 h-8 text-slate-400" />
                      )}
                      <button 
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleLogin}
                    className="flex items-center gap-2 bg-white text-slate-950 px-4 py-2 rounded-full text-xs font-extrabold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
                  >
                    <UserCircle className="w-4 h-4" />
                    Sign In with Google
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
