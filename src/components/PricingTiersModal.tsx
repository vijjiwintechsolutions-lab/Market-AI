import React, { useState } from 'react';
import { X, Coins, Sparkles, Zap, ShieldCheck, Search, Filter, Check, ArrowRight, CreditCard } from 'lucide-react';
import { OFFICIAL_TIER_PRICING, ToolTierPricing } from '../types';

interface PricingTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCredits: number;
  onTopUpCredits?: (amount: number) => void;
}

export const PricingTiersModal: React.FC<PricingTiersModalProps> = ({
  isOpen,
  onClose,
  userCredits,
  onTopUpCredits,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topUpSuccessMsg, setTopUpSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const filteredPricing = OFFICIAL_TIER_PRICING.filter((item) => {
    const matchesTier = selectedTierFilter === 'All' || item.tier === selectedTierFilter;
    const matchesQuery =
      item.toolType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesQuery;
  });

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'Tier 1':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Tier 2':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Tier 3':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Tier 4':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'Tier 5':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Tier 6':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30 font-extrabold shadow-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleTopUp = (amount: number, costStr: string) => {
    if (onTopUpCredits) {
      onTopUpCredits(amount);
      setTopUpSuccessMsg(`Successfully added +${amount} Credits (${costStr}) to your balance!`);
      setTimeout(() => setTopUpSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0F0F13] border border-white/15 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-[#13131A] to-indigo-950/80 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Coins className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Tool Credit & Pay/Task Pricing Tiers
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PAY-AS-YOU-GO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Transparent credit deductions & pay-per-task model across all AI capabilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BALANCE BANNER */}
        <div className="px-5 py-3 bg-[#15151F] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/30 px-3 py-1.5 rounded-lg">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Balance:</span>
              <span className="text-sm font-mono font-extrabold text-amber-300">
                {userCredits} Credits
              </span>
            </div>
            {topUpSuccessMsg && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded flex items-center gap-1.5 animate-bounce">
                <Check className="w-3.5 h-3.5" />
                {topUpSuccessMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Instant Top-Up:</span>
            <button
              onClick={() => handleTopUp(50, '₹100')}
              className="px-2.5 py-1 bg-white/5 hover:bg-indigo-600 text-xs font-mono font-bold text-indigo-300 hover:text-white rounded border border-white/10 transition-all cursor-pointer"
            >
              +50 Credits (₹100)
            </button>
            <button
              onClick={() => handleTopUp(200, '₹350')}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white rounded border border-indigo-400 shadow transition-all cursor-pointer"
            >
              +200 Credits (₹350)
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="px-5 py-3 bg-[#0A0A0D] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0 font-mono text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tool (e.g. Chat, Image, Voice)..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#15151A] text-white placeholder-slate-500 text-xs rounded border border-white/10 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-slate-500 text-[11px] uppercase font-bold mr-1">Filter Tier:</span>
            {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5', 'Tier 6'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTierFilter(tier)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all border cursor-pointer ${
                  selectedTierFilter === tier
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* OFFICIAL PRICING TABLE */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0A0A0E]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#151520] border-b border-white/10 text-slate-400 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-bold">Tool Name / Type</th>
                  <th className="py-3 px-4 font-bold">Tier</th>
                  <th className="py-3 px-4 font-bold text-right">Credits</th>
                  <th className="py-3 px-4 font-bold text-right">Pay / Task</th>
                  <th className="py-3 px-4 font-bold hidden md:table-cell">Capability Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredPricing.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-indigo-950/20 transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{item.toolType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getTierBadgeStyle(item.tier)}`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-300">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {item.credits} {item.credits === 1 ? 'Credit' : 'Credits'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-400">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {item.payPerTask}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] hidden md:table-cell">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPricing.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No pricing tier matched your search.
            </div>
          )}

          {/* TIER BREAKDOWN HIGHLIGHTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-cyan-400 font-mono flex items-center justify-between">
                <span>Tier 1 • Standard Text</span>
                <span className="text-slate-400">1 Cr / ₹2</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Ideal for fast conversational Q&A, translations, and spell checking.
              </p>
            </div>

            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono flex items-center justify-between">
                <span>Tier 2 • Content & Code</span>
                <span className="text-slate-400">2 Cr / ₹5</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Optimized for SEO articles, resume building, and full-stack coding tasks.
              </p>
            </div>

            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-amber-400 font-mono flex items-center justify-between">
                <span>Tier 3 • Image & Logo</span>
                <span className="text-slate-400">5 Cr / ₹10</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                High-resolution AI image generation, vector logos, and graphic avatars.
              </p>
            </div>

            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-indigo-400 font-mono flex items-center justify-between">
                <span>Tier 4 • Voice & Music</span>
                <span className="text-slate-400">10 Cr / ₹20</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Lifelike text-to-speech audio synthesis, voice cloning, and AI songs.
              </p>
            </div>

            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-rose-400 font-mono flex items-center justify-between">
                <span>Tier 5 • Video Synthesis</span>
                <span className="text-slate-400">20 Cr / ₹40</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Cinematic video generation, motion animation, and AI video rendering.
              </p>
            </div>

            <div className="p-3 bg-[#13131B] border border-white/5 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-purple-400 font-mono flex items-center justify-between">
                <span>Tier 6 • Autonomous Agent</span>
                <span className="text-slate-400">50 Cr / ₹99</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Complex multi-step autonomous workflows, deep web research & API execution.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#0A0A0D] border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Credits never expire. Real-time deduction per successful execution.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
