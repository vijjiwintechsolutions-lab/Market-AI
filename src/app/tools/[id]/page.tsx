// =====================================================================
// MARKET1 DYNAMIC TOOL PAGE (MUTE)
// Renders the specific tool configuration dynamically based on URL ID.
// =====================================================================

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToolConfig } from '../../../data/registry';
import { UniversalToolEngine } from '../../../components/UniversalToolEngine';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params?.id as string;

  const tool = getToolConfig(toolId);

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-center font-mono">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h1 className="text-xl font-extrabold text-white mb-1">Tool Not Found</h1>
        <p className="text-slate-400 text-xs mb-6">The tool ID "{toolId}" does not exist in the MUTE Registry.</p>
        <button 
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <UniversalToolEngine 
      tool={tool} 
      onBack={() => router.push('/')} 
    />
  );
}
