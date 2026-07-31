import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { CATEGORIES_LIST } from '../data/toolsData';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newTool: any) => void;
}

export const SubmitToolModal: React.FC<SubmitToolModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES_LIST[1]);
  const [provider, setProvider] = useState('Google Gemini');
  const [pricing, setPricing] = useState<'Free' | 'Freemium' | 'Paid'>('Free');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [tags, setTags] = useState('AI, Assistant, Generator');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const newToolObj = {
      id: `tool-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      subcategory: 'Community Submission',
      description,
      iconName: 'Sparkles',
      rating: 5.0,
      reviewCount: 1,
      latencyMs: Math.floor(150 + Math.random() * 200),
      uptimePercent: 99.9,
      pricing,
      badge: 'NEW',
      provider,
      modelUsed: 'gemini-3.6-flash',
      tags: tags.split(',').map((t) => t.trim()),
      inputs: [
        { id: 'prompt', name: 'Input Request', type: 'textarea', required: true, defaultValue: 'Try out this community submitted AI tool!' }
      ],
      supportedFormats: ['Text'],
      outputType: 'text',
      runsToday: 1,
      apiRoute: '/api/ai/text'
    };

    onSubmitSuccess(newToolObj);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Submit Your AI Tool</h2>
              <p className="text-xs text-slate-400">Join the Market1 AI registry & reach millions of users.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Tool Submitted Successfully!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your tool has been registered in the live Market1 AI registry and is now active for users to test and rate!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-200">AI Tool Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Code Optimizer Pro"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-200">Short Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your AI tool does and key features..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-200">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  {CATEGORIES_LIST.filter((c) => c !== 'All Categories').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-200">Pricing Tier</label>
                <select
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-200">Provider Engine</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Google Gemini, Groq, OpenRouter"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-200">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Code, TypeScript, Refactor"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" /> Register AI Tool in Live Marketplace
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
