// =====================================================================
// MARKET1 OS ROOT LAYOUT (NEXT.JS APP ROUTER)
// =====================================================================

import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Market1 OS - Universal AI & Tool Matrix',
  description: 'Deploy, configure, and run high-performance enterprise tools instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-[#E0E0E0] font-mono antialiased min-h-screen selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
