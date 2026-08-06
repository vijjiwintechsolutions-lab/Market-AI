// =====================================================================
// MARKET1 DYNAMIC TOOL PAGE (App Router)
// This single file renders all 1,300+ tools based on the registry.
// =====================================================================

import { notFound } from 'next/navigation';
import { getToolConfig } from '../../../data/registry';
import { UniversalToolEngine } from '../../../components/UniversalToolEngine';
import { UniversalLanding } from '../../../components/UniversalLanding';
import { Metadata } from 'next';

interface ToolPageProps {
  params: { id: string };
}

// 🚀 DYNAMIC SEO GENERATOR
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const tool = getToolConfig(params.id);
  if (!tool) return { title: 'Tool Not Found | Market1' };

  return {
    title: `${tool.name} | Free Online Tool - Market1`,
    description: tool.description,
    keywords: tool.seoKeywords.join(', '),
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  // 1. Fetch Configuration
  const tool = getToolConfig(params.id);

  // 2. Validate Existence
  if (!tool) {
    notFound(); // Triggers Next.js 404 page automatically
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      
      {/* 🚀 THE UNIVERSAL TOOL ENGINE (The actual workspace) */}
      <UniversalToolEngine 
        tool={tool} 
        onBack={() => window.history.back()} 
      />
      
      <hr className="border-white/5" />

      {/* 🌍 THE UNIVERSAL LANDING PAGE (SEO & Context) */}
      <UniversalLanding tool={tool} />

    </main>
  );
}
