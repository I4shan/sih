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
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('graph');
  const [layoutName, setLayoutName] = useState('cose');
  const { toastMessage } = useInvestigation();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col grid-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'graph' && (
          <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
            <GraphControls layoutName={layoutName} setLayoutName={setLayoutName} />
            <div className="flex-1 relative min-h-[450px]">
              <CytoscapeGraph layoutName={layoutName} />
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="h-[calc(100vh-140px)]">
            <AgentActivityFeed />
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'evidence' && <EvidenceLedgerPage />}
        {activeTab === 'reports' && <ReportViewer />}
      </main>

      {/* Slideover Entity Drawer */}
      <EntityProfileDrawer />

      {/* Evidence & Provenance Modal */}
      <EvidenceProvenanceModal />

      {/* Ingestion Modal */}
      <DocumentIngestModal />

      {/* SIH Demo Story Guide Controller */}
      <DemoStoryGuide onTabChange={setActiveTab} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-xl ${
            toastMessage.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-800'
              : toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : 'bg-slate-900/95 text-cyan-200 border-cyan-800/80'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400" />
            )}
            <span>{toastMessage.text}</span>
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
