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
    <div className="h-screen w-screen flex flex-col bg-[#f0f4f8] text-slate-900 selection:bg-sky-500/20 selection:text-sky-900 overflow-hidden font-sans">
      {/* Indian Flag Tricolor Accent Header Bar */}
      <div className="tricolor-stripe w-full flex-shrink-0" />

      {/* Top Indian Government Command Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden min-h-0 flex flex-col bg-[#f1f5f9]">
        {activeTab === 'graph' && (
          <div className="flex-1 w-full p-2.5 sm:p-3.5 flex flex-col gap-2.5 min-h-0 overflow-hidden">
            {/* Top Toolbar Ribbon */}
            <GraphControls layoutName={layoutName} setLayoutName={setLayoutName} />
            {/* Graph Canvas Container */}
            <div className="flex-1 relative min-h-[400px] w-full rounded-xl border border-sky-200 shadow-sm overflow-hidden bg-white">
              <CytoscapeGraph layoutName={layoutName} />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto">
            <AgentActivityFeed />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto">
            <AnalyticsPanel />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto">
            <TimelineView />
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto">
            <EvidenceLedgerPage />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto">
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

      {/* SIH Demo Story Guide Floating Controller */}
      <DemoStoryGuide onTabChange={setActiveTab} />

      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-semibold backdrop-blur-md transition-all ${
            toastMessage.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-300 shadow-red-100'
              : toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-emerald-100'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-amber-100'
              : 'bg-white text-sky-950 border-sky-300 shadow-sky-100'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
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
