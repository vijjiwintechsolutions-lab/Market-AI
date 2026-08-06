'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { UniversalMarketplace } from '../components/UniversalMarketplace';
import { Footer } from '../components/Footer';
import { LiveToolRunnerModal } from '../components/LiveToolRunnerModal';
import { SubmitToolModal } from '../components/SubmitToolModal';
import { RealWalletModal } from '../components/RealWalletModal';
import { PricingTiersModal } from '../components/PricingTiersModal';
import { AuthModal } from '../components/AuthModal';
import { CompareToolsModal } from '../components/CompareToolsModal';
import { LatencySettingsModal } from '../components/LatencySettingsModal';
import { AIConsultantWidget } from '../components/AIConsultantWidget';
import { MuteToolConfig } from '../types/mute';

export default function Page() {
  const [selectedTool, setSelectedTool] = useState<MuteToolConfig | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLatencyOpen, setIsLatencyOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Header 
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenLatency={() => setIsLatencyOpen(true)}
      />

      <HeroSection />

      <UniversalMarketplace onSelectTool={(tool) => setSelectedTool(tool)} />

      <Footer />

      {selectedTool && (
        <LiveToolRunnerModal 
          tool={selectedTool} 
          isOpen={!!selectedTool} 
          onClose={() => setSelectedTool(null)} 
        />
      )}

      <SubmitToolModal 
        isOpen={isSubmitOpen} 
        onClose={() => setIsSubmitOpen(false)} 
      />

      <RealWalletModal 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
      />

      <PricingTiersModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <CompareToolsModal 
        isOpen={isCompareOpen} 
        onClose={() => setIsCompareOpen(false)} 
      />

      <LatencySettingsModal 
        isOpen={isLatencyOpen} 
        onClose={() => setIsLatencyOpen(false)} 
      />

      <AIConsultantWidget />
    </main>
  );
}
