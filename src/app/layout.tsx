// =====================================================================
// MARKET1 OS ROOT LAYOUT
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
      <body className="bg-[#0A0A0A] text-[#E0E0E0] font-mono min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
