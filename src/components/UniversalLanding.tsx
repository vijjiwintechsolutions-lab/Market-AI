// =====================================================================
// MARKET1 UNIVERSAL LANDING GENERATOR (MULG)
// Dynamically generates Hero, How-To, and FAQs from Tool Configuration.
// =====================================================================

import React from 'react';
import { Shield, Zap, FileCheck, HelpCircle, CheckCircle } from 'lucide-react';
import { MuteToolConfig } from '../types/mute';

interface UniversalLandingProps {
  tool: MuteToolConfig;
}

export const UniversalLanding: React.FC<UniversalLandingProps> = ({ tool }) => {
  const requiresUpload = !tool.accepts.includes('prompt') || tool.accepts.length > 1;
  const isBrowserEngine = tool.engine === 'browser';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-sans">
      
      {/* --------------------------------------------------------- */}
      {/* 1. DYNAMIC "HOW IT WORKS" SECTION */}
      {/* --------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">How to use the {tool.name}</h2>
          <p className="text-sm text-slate-400">Process your files in three simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151517] border border-white/5 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="text-white font-bold">{requiresUpload ? 'Upload File' : 'Enter Prompt'}</h3>
            <p className="text-xs text-slate-400">
              {requiresUpload 
                ? `Upload your target file. We currently support ${tool.accepts.join(', ').toUpperCase()} formats up to ${tool.validation?.maxFileSizeMB || 10}MB.`
                : 'Enter your detailed instructions or text prompt into the configuration panel.'}
            </p>
          </div>
          
          <div className="bg-[#151517] border border-white/5 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="text-white font-bold">Configure Options</h3>
            <p className="text-xs text-slate-400">
              {tool.options.length > 0 
                ? `Adjust the tool settings. You can customize parameters like ${tool.options.slice(0, 2).map(o => o.label).join(' and ')}.`
                : 'Review the default settings. Our engine optimizes the parameters automatically.'}
            </p>
          </div>
          
          <div className="bg-[#151517] border border-white/5 rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="text-white font-bold">Process & Download</h3>
            <p className="text-xs text-slate-400">
              Click execute to run the {tool.engine.toUpperCase()} engine. Download your output securely in {tool.outputs.join(', ').toUpperCase()} format.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- */}
      {/* 2. DYNAMIC FEATURES & CAPABILITIES */}
      {/* --------------------------------------------------------- */}
      <section className="bg-[#151517] border border-white/5 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Privacy First</h4>
            <p className="text-xs text-slate-400">{isBrowserEngine ? 'Files are processed locally on your device. They never touch our servers.' : 'Files are processed securely and deleted automatically after 1 hour.'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">High Speed Engine</h4>
            <p className="text-xs text-slate-400">Powered by our optimized {tool.processor} processor for lightning-fast execution.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Format Support</h4>
            <p className="text-xs text-slate-400">Converts {tool.accepts[0].toUpperCase()} seamlessly to {tool.outputs.join(', ').toUpperCase()} without quality loss.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Production Ready</h4>
            <p className="text-xs text-slate-400">Enterprise-grade output ready for immediate professional use.</p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- */}
      {/* 3. DYNAMIC FAQ SECTION */}
      {/* --------------------------------------------------------- */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-2">Is the {tool.name} free to use?</h4>
            <p className="text-xs text-slate-400">
              {tool.validation?.requireWalletCredits 
                ? `This premium tool requires ${tool.validation.requireWalletCredits} credits per execution from your Market1 Wallet.` 
                : 'Yes, this tool is completely free to use under our standard platform limits.'}
            </p>
          </div>

          {requiresUpload && (
            <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5">
              <h4 className="text-sm font-bold text-white mb-2">What is the maximum file size allowed?</h4>
              <p className="text-xs text-slate-400">
                You can upload up to {tool.validation?.maxFiles || 1} file(s) at a time. The maximum file size limit is {tool.validation?.maxFileSizeMB || 10}MB per execution.
              </p>
            </div>
          )}

          <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-2">Do I need to install any software?</h4>
            <p className="text-xs text-slate-400">
              No. Market1 OS operates entirely in the cloud and your browser. You can run the {tool.name} directly from any modern device.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
