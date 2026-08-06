// =====================================================================
// MARKET1 UNIVERSAL DASHBOARD (MUTE)
// Displays User Profile, Wallet Balance, and Tool Execution History.
// =====================================================================

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { UniversalHistoryEngine, HistoryRecord } from '../../services/historyEngine';
import { UniversalWalletEngine } from '../../services/walletEngine';
import { History, Wallet, UserCircle, Zap, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch Balance
        const balance = await UniversalWalletEngine.getBalance(currentUser.uid);
        setCredits(balance);
        
        // Fetch History
        const userHistory = await UniversalHistoryEngine.getUserHistory();
        setHistory(userHistory);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Zap className="w-8 h-8 text-emerald-500 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center">
        <UserCircle className="w-16 h-16 text-slate-600 mb-4" />
        <h1 className="text-2xl font-extrabold text-white mb-2">Authentication Required</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">You need to sign in to access your Market1 workspace, wallet, and history.</p>
        <Link href="/" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-emerald-500/30" />
            ) : (
              <UserCircle className="w-16 h-16 text-slate-400" />
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-white">{user.displayName || 'Market1 User'}</h1>
              <p className="text-sm text-slate-400 font-sans">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#151517] border border-white/10 px-5 py-3 rounded-xl shadow-lg shadow-emerald-900/10">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Available Balance</p>
              <p className="text-xl font-bold text-white">{credits} <span className="text-sm font-normal text-slate-500">Credits</span></p>
            </div>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-extrabold text-white">Execution History</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              Last {history.length} operations
            </span>
          </div>

          {history.length === 0 ? (
            <div className="w-full bg-[#151517] border border-white/5 rounded-2xl p-12 text-center">
              <Clock className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
              <h3 className="text-white font-bold">No history found</h3>
              <p className="text-slate-400 text-xs mt-1 mb-4 font-sans">You haven't executed any tools yet.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 rounded-lg text-xs font-bold transition-colors border border-emerald-500/20">
                Explore Tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-[#151517] border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0A0A0A] border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Status</th>
                      <th className="p-4">Tool Name</th>
                      <th className="p-4">Engine</th>
                      <th className="p-4">Output</th>
                      <th className="p-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-sans">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          {record.status === 'success' ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 w-max px-2 py-1 rounded border border-emerald-500/20 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Success
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 w-max px-2 py-1 rounded border border-rose-500/20 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-white font-bold">
                          <Link href={`/tools/${record.toolId}`} className="hover:text-emerald-400 transition-colors">
                            {record.toolName}
                          </Link>
                        </td>
                        <td className="p-4 text-slate-400">
                          <span className="text-[10px] uppercase font-mono tracking-wider bg-[#0A0A0A] px-2 py-1 rounded border border-white/10">
                            {record.engine}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 font-bold uppercase text-xs">
                          {record.outputType}
                        </td>
                        <td className="p-4 text-right text-slate-500 text-xs">
                          {new Date(record.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
