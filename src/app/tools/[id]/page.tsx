// =====================================================================
// MARKET1 HOME PAGE
// Automatically loads tools from the MUTE Registry.
// =====================================================================

import { TOOL_REGISTRY } from '../data/registry';
import { UniversalMarketplace } from '../components/UniversalMarketplace';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market1 | The Universal AI & Tool Platform',
  description: 'Access hundreds of professional tools for PDF, Images, Video, and AI processing in one platform.',
};

export default function HomePage() {
  return (
    <main>
      {/* 🚀 Render the Universal Marketplace with all our registered tools */}
      <UniversalMarketplace tools={TOOL_REGISTRY} />
    </main>
  );
}
