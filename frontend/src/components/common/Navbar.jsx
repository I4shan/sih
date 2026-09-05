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
  FolderLock,
  Shield
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    activeCase, 
    setIsIngestModalOpen, 
    isDemoGuideOpen, 
    setIsDemoGuideOpen 
  } = useInvestigation();

  const tabs = [
    { id: 'graph', label: 'Network Graph', icon: Network },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'evidence', label: 'Evidence Vault', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-40 flex-shrink-0">
      {/* Top Ministry Ribbon */}
      <div className="bg-[#003b6f] text-white px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-sky-900 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase">GOVERNMENT OF INDIA</span>
          <span className="text-sky-300">|</span>
          <span className="tracking-wide">Ministry of Home Affairs • Financial Intelligence Unit (FIU-IND)</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-sky-800/90 text-sky-100 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-sky-700">
            SMART INDIA HACKATHON 2026
          </span>
          <span className="text-sky-200 hidden sm:inline font-mono">Problem ID: PS26189</span>
        </div>
      </div>

      {/* Main Agency Header & Navigation */}
      <div className="w-full px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white via-sky-50/40 to-white">
        
        {/* Left: Emblem & Agency Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-[#00427a] flex items-center justify-center text-white shadow-sm border border-sky-700 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#003366] tracking-tight leading-none uppercase">
                National Financial Intelligence Platform
              </h1>
            </div>
            <p className="text-[11px] font-semibold text-sky-700 leading-tight mt-0.5">
              Cross-Entity Graph Investigation & Provenance Analytics System
            </p>
          </div>

          {/* Active Case Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-100/80 border border-sky-300 text-xs text-sky-950 font-medium ml-2 shadow-xs">
            <FolderLock className="w-3.5 h-3.5 text-sky-700" />
            <span className="font-bold">Case C104:</span>
            <span className="text-sky-800">Operation Hawala Matrix</span>
          </div>
        </div>

        {/* Center: Government Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-300 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#005b99] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#005b99] hover:bg-sky-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-sky-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsIngestModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-900 border border-sky-300 hover:border-sky-400 text-xs font-semibold rounded-md flex items-center gap-1.5 transition shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Ingest Document</span>
          </button>

          <button
            onClick={() => setIsDemoGuideOpen(!isDemoGuideOpen)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition shadow-sm ${
              isDemoGuideOpen
                ? 'bg-sky-100 text-[#004d80] border border-sky-400 ring-1 ring-sky-300'
                : 'bg-gradient-to-r from-sky-600 to-[#005b99] hover:from-sky-700 hover:to-[#00427a] text-white'
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
