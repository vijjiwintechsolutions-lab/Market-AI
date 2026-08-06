// =====================================================================
// MARKET1 OS NEXT.JS APP ROUTER ROOT PAGE
// =====================================================================

'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UniversalMarketplace } from '../components/UniversalMarketplace';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UniversalMarketplace
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          favoriteIds={favoriteIds}
          setFavoriteIds={setFavoriteIds}
        />
      </div>
    </main>
  );
}
