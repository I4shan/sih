import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  Network, 
  Bot, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  Play, 
  Sparkles,
  FolderLock
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    activeCase, 
    setIsIngestModalOpen, 
    setIsDemoGuideOpen,
    graphData
  } = useInvestigation();

  const tabs = [
    { id: 'graph', label: 'Graph Workspace', icon: Network },
    { id: 'agents', label: 'Agent Activity', icon: Bot },
    { id: 'analytics', label: 'Analytics & Clusters', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'evidence', label: 'Evidence Vault', icon: ShieldCheck },
    { id: 'reports', label: 'Intelligence Dossier', icon: FileText },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand & Case Pill */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-sm">PS26189 GRAPH INTELLIGENCE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">Criminal Network Investigation Platform</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <FolderLock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">{activeCase.title}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5 transition"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" /> Ingest Data
          </button>

          <button
            onClick={() => setIsDemoGuideOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-900/40 animate-pulse-slow"
          >
            <Sparkles className="w-3.5 h-3.5" /> SIH Demo Guide
          </button>
        </div>
      </div>

      {/* Mobile Submenu Tabs */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800/80 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap flex items-center gap-1 ${
                isActive ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
