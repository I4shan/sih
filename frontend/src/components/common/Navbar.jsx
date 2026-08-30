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
  Sparkles, 
  FolderLock
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    activeCase, 
    setIsIngestModalOpen, 
    isDemoGuideOpen, 
    setIsDemoGuideOpen 
  } = useInvestigation();

  const tabs = [
    { id: 'graph', label: 'Graph', icon: Network },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'evidence', label: 'Evidence', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="h-14 bg-[#080d1a]/95 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-40 flex-shrink-0">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Case Pill */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-white text-sm tracking-tight">PS26189</span>
              <span className="text-slate-500 text-xs">|</span>
              <span className="text-xs font-medium text-slate-300">Graph Intel</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 hidden sm:inline-block">
                SIH 2026
              </span>
            </div>
          </div>

          {/* Clean Case Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs whitespace-nowrap">
            <FolderLock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">Case C104</span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-slate-400">Operation Hawala</span>
          </div>
        </div>

        {/* Center: Clean Nav Pills */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/90 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Clean Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700/80 flex items-center gap-1.5 transition whitespace-nowrap shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Ingest</span>
          </button>

          <button
            onClick={() => setIsDemoGuideOpen(!isDemoGuideOpen)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shadow-sm ${
              isDemoGuideOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 ring-1 ring-cyan-400/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Guide</span>
          </button>
        </div>

      </div>
    </header>
  );
}
