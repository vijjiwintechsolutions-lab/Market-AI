// =====================================================================
// MARKET1 UNIVERSAL ADMIN OS (MAOS)
// Platform-wide analytics, tool usage, and health monitoring.
// =====================================================================

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Activity, Zap, CheckCircle2, XCircle, BarChart3, Clock, ArrowLeft } from 'lucide-react';
import { getToolConfig } from '../../data/registry';

interface ToolStats {
  runs: number;
  successes: number;
  failures: number;
  totalTime: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Record<string, ToolStats>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🚀 PRODUCTION HOOK: Fetch from Firestore/Mixpanel here
    // For now, load the local aggregated analytics from our UniversalAnalyticsEngine
    const data = JSON.parse(localStorage.getItem('market1_analytics') || '{}');
    setAnalytics(data);
    setIsLoading(false);
  }, []);

  // Calculate Global Metrics
  const globalMetrics = useMemo(() => {
    let totalRuns = 0;
    let totalSuccess = 0;
    let totalFails = 0;
    let totalExecutionTime = 0;

    Object.values(analytics).forEach(stat => {
      totalRuns += stat.runs;
      totalSuccess += stat.successes;
      totalFails += stat.failures;
      totalExecutionTime += stat.totalTime;
    });

    const successRate = totalRuns > 0 ? ((totalSuccess / totalRuns) * 100).toFixed(1) : '0.0';
    const avgTime = totalRuns > 0 ? Math.round(totalExecutionTime / totalRuns) : 0;

    return { totalRuns, totalSuccess, totalFails, successRate, avgTime };
  }, [analytics]);

  const sortedTools = Object.entries(analytics).sort((a, b) => b[1].runs - a[1].runs);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 mb-4 transition-colors text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back to Platform
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Universal Admin OS</h1>
                <p className="text-sm text-slate-400 font-sans">Real-time platform analytics and tool performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* GLOBAL METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#151517] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Total Executions</h3>
            </div>
            <p className="text-3xl font-extrabold text-white">{globalMetrics.totalRuns}</p>
          </div>
          
          <div className="bg-[#151517] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Success Rate</h3>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">{globalMetrics.successRate}%</p>
          </div>

          <div className="bg-[#151517] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Total Failures</h3>
            </div>
            <p className="text-3xl font-extrabold text-white">{globalMetrics.totalFails}</p>
          </div>

          <div className="bg-[#151517] border border-white/10 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Avg Engine Time</h3>
            </div>
            <p className="text-3xl font-extrabold text-white">{globalMetrics.avgTime} <span className="text-sm font-normal text-slate-500">ms</span></p>
          </div>
        </div>

        {/* TOOL PERFORMANCE TABLE */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Engine Performance (Per Tool)
          </h2>
          
          {sortedTools.length === 0 ? (
            <div className="w-full bg-[#151517] border border-white/5 rounded-2xl p-12 text-center">
              <BarChart3 className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
              <h3 className="text-white font-bold">No Analytics Data</h3>
              <p className="text-slate-400 text-xs mt-1 mb-4 font-sans">Tools need to be executed by users to generate data.</p>
            </div>
          ) : (
            <div className="bg-[#151517] border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0A0A0A] border-b border-white/10 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="p-4">Tool Name & Engine</th>
                      <th className="p-4 text-right">Total Runs</th>
                      <th className="p-4 text-right">Success</th>
                      <th className="p-4 text-right">Failures</th>
                      <th className="p-4 text-right">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-sans">
                    {sortedTools.map(([toolId, stats]) => {
                      const config = getToolConfig(toolId);
                      const avgToolTime = stats.runs > 0 ? Math.round(stats.totalTime / stats.runs) : 0;
                      
                      return (
                        <tr key={toolId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white mb-1">{config?.name || toolId}</div>
                            <span className={`text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border ${
                              config?.engine === 'ai' ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' : 
                              config?.engine === 'browser' ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' :
                              'bg-blue-600/20 text-blue-300 border-blue-500/30'
                            }`}>
                              {config?.engine || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="p-4 text-right font-extrabold text-white">{stats.runs}</td>
                          <td className="p-4 text-right text-emerald-400 font-bold">{stats.successes}</td>
                          <td className="p-4 text-right text-rose-400 font-bold">{stats.failures}</td>
                          <td className="p-4 text-right text-slate-400 font-mono text-xs">{avgToolTime} ms</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
