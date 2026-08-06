// =====================================================================
// MARKET1 OS ROOT APPLICATION (MUTE)
// Handles global tabs, marketplace routing, and state management.
// =====================================================================

'use client';

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UniversalMarketplace } from './components/UniversalMarketplace';

export default function App() {
  // 🚀 FIXED: Added 'providers' to the union type to match Header and tab components
  const [activeTab, setActiveTab] = useState<'marketplace' | 'history' | 'providers' | 'prompts'>('marketplace');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono antialiased">
      {/* Universal Navigation Bar */}
      <Navbar />
      
      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'marketplace' && (
          <UniversalMarketplace 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            favoriteIds={favoriteIds}
            setFavoriteIds={setFavoriteIds}
          />
        )}

        {activeTab === 'history' && (
          <div className="bg-[#151517] border border-white/10 rounded-xl p-8 text-center font-mono">
            <h2 className="text-lg font-extrabold text-white mb-2">Execution History</h2>
            <p className="text-slate-400 text-xs">View your past tool runs and outputs from your dashboard.</p>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="bg-[#151517] border border-white/10 rounded-xl p-8 text-center font-mono">
            <h2 className="text-lg font-extrabold text-white mb-2">AI Providers & Clusters</h2>
            <p className="text-slate-400 text-xs">Manage active server connections and API gateways.</p>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="bg-[#151517] border border-white/10 rounded-xl p-8 text-center font-mono">
            <h2 className="text-lg font-extrabold text-white mb-2">Saved Prompts Hub</h2>
            <p className="text-slate-400 text-xs">Quick access to your frequently used templates.</p>
          </div>
        )}
      </div>
    </main>
  );
}
