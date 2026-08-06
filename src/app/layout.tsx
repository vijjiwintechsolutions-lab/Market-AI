// =====================================================================
// MARKET1 ROOT LAYOUT (MUTE)
// Applies the Universal Navbar and global styles to the entire OS.
// =====================================================================

import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Market1 OS | The Universal AI & Utility Platform',
  description: 'One Platform. Every Tool. Built on the MUTE Framework.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-[#E0E0E0] font-sans antialiased selection:bg-emerald-500/30">
        {/* 🚀 Universal Navbar is permanently docked here */}
        <Navbar />
        
        {/* Page Content Rendered Here */}
        {children}
      </body>
    </html>
  );
}
