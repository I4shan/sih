import React, { useState } from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import Navbar from './components/common/Navbar';
import CytoscapeGraph from './components/graph/CytoscapeGraph';
import GraphControls from './components/graph/GraphControls';
import EntityProfileDrawer from './components/entity/EntityProfileDrawer';
import EvidenceProvenanceModal from './components/evidence/EvidenceProvenanceModal';
import DocumentIngestModal from './components/ingestion/DocumentIngestModal';
import DemoStoryGuide from './components/common/DemoStoryGuide';
import AgentActivityFeed from './components/agents/AgentActivityFeed';
import AnalyticsPanel from './components/analytics/AnalyticsPanel';
import TimelineView from './components/timeline/TimelineView';
import EvidenceLedgerPage from './components/evidence/EvidenceLedgerPage';
import ReportViewer from './components/reports/ReportViewer';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('graph');
  const [layoutName, setLayoutName] = useState('cose');
  const { toastMessage, showToast } = useInvestigation();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#070b14] text-slate-100 grid-bg selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">
      {/* Top Command Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
        {activeTab === 'graph' && (
          <div className="flex-1 w-full p-3 sm:p-4 flex flex-col gap-3 min-h-0 overflow-hidden">
            {/* Top Toolbar Ribbon */}
            <GraphControls layoutName={layoutName} setLayoutName={setLayoutName} />
            {/* Graph Canvas Container */}
            <div className="flex-1 relative min-h-[400px] w-full rounded-2xl overflow-hidden">
              <CytoscapeGraph layoutName={layoutName} />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <AgentActivityFeed />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <AnalyticsPanel />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <TimelineView />
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <EvidenceLedgerPage />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <ReportViewer />
          </div>
        )}
      </main>

      {/* Slideover Entity Drawer */}
      <EntityProfileDrawer />

      {/* Evidence & Provenance Modal */}
      <EvidenceProvenanceModal />

      {/* Ingestion Modal */}
      <DocumentIngestModal />

      {/* SIH Demo Story Guide Floating Controller (Collapsible / Non-blocking) */}
      <DemoStoryGuide onTabChange={setActiveTab} />

      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-2xl transition-all ${
            toastMessage.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-700/80 shadow-red-950/50'
              : toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80 shadow-emerald-950/50'
              : toastMessage.type === 'warning'
              ? 'bg-amber-950/90 text-amber-200 border-amber-700/80 shadow-amber-950/50'
              : 'bg-slate-900/95 text-cyan-200 border-cyan-600/80 shadow-cyan-950/50'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            )}
            <span className="leading-snug">{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <InvestigationProvider>
      <DashboardContent />
    </InvestigationProvider>
  );
}
