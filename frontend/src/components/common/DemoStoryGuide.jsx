import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X, 
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  Zap
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Open Case C104 Dossier",
    desc: "Load initial investigation dossier for 'Case C104: Operation Hawala Matrix' (Primary Suspect: Vikram Singhania).",
    actionType: "CASE_LOAD",
    buttonLabel: "Load Case C104"
  },
  {
    step: 2,
    title: "2. Explore Initial Network Graph",
    desc: "Inspect starting entities, shell companies, and HDFC accounts in Cytoscape canvas.",
    actionType: "EXPLORE_GRAPH",
    buttonLabel: "Focus Vikram Singhania"
  },
  {
    step: 3,
    title: "3. Multi-Agent Inquiry: 'Find connections to N7'",
    desc: "Launch autonomous multi-agent reasoning connecting Case C104 to Dubai Network N7.",
    actionType: "RUN_AGENT",
    buttonLabel: "Run LangGraph Agent"
  },
  {
    step: 4,
    title: "4. Observe Agent Tool Execution",
    desc: "Observe real-time tool execution logs for Investigator, Graph, and Document agents.",
    actionType: "VIEW_AGENT_FEED",
    buttonLabel: "View Agent Activity"
  },
  {
    step: 5,
    title: "5. Discovered Path Highlighting",
    desc: "Highlight the 3-hop money conduit: Vikram Singhania -> Rajesh Hawala -> Tariq Sheikh.",
    actionType: "HIGHLIGHT_PATH",
    buttonLabel: "Highlight 3-Hop Path"
  },
  {
    step: 6,
    title: "6. Inspect Evidence & SHA-256 Provenance",
    desc: "Open evidence provenance modal for ₹4.8 Cr wire with cryptographic SHA-256 hash integrity.",
    actionType: "INSPECT_EVIDENCE",
    buttonLabel: "Open Evidence Vault"
  },
  {
    step: 7,
    title: "7. Identify Critical Bridge Node",
    desc: "Betweenness centrality analytics isolates Rajesh Kumar (Score: 0.842) as the sole bridge node.",
    actionType: "VIEW_ANALYTICS",
    buttonLabel: "View Centrality Metrics"
  },
  {
    step: 8,
    title: "8. Correlate Timeline Bursts",
    desc: "Correlate CDR phone calls with wire transfer velocity in the chronological timeline.",
    actionType: "VIEW_TIMELINE",
    buttonLabel: "View Chronological Timeline"
  },
  {
    step: 9,
    title: "9. Compile Intelligence Dossier",
    desc: "Compile final structured investigation report with cryptographic evidence citations.",
    actionType: "VIEW_REPORT",
    buttonLabel: "View Final Dossier"
  }
];

export default function DemoStoryGuide({ onTabChange }) {
  const { 
    isDemoGuideOpen, 
    setIsDemoGuideOpen, 
    runAgentInvestigation, 
    inspectEvidence,
    selectEntityById,
    showToast
  } = useInvestigation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDemoGuideOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100);

  const handleExecuteCurrentStep = async () => {
    switch (currentStep.actionType) {
      case "CASE_LOAD":
        onTabChange('graph');
        selectEntityById('case_c104');
        showToast("Case C104 loaded into Investigation Workspace", "success");
        break;
      case "EXPLORE_GRAPH":
        onTabChange('graph');
        selectEntityById('person_vikram_singhania');
        showToast("Focused on Vikram Singhania and domestic connections", "info");
        break;
      case "RUN_AGENT":
        onTabChange('agents');
        await runAgentInvestigation();
        break;
      case "VIEW_AGENT_FEED":
        onTabChange('agents');
        break;
      case "HIGHLIGHT_PATH":
        onTabChange('graph');
        selectEntityById('person_rajesh_hawala');
        showToast("Key Bridge Node Rajesh Kumar & Conduit highlighted", "success");
        break;
      case "INSPECT_EVIDENCE":
        inspectEvidence('ev_bank_104_02');
        break;
      case "VIEW_ANALYTICS":
        onTabChange('analytics');
        break;
      case "VIEW_TIMELINE":
        onTabChange('timeline');
        break;
      case "VIEW_REPORT":
        onTabChange('reports');
        break;
      default:
        break;
    }

    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // Minimized Floating Pill Mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="glass-panel-glow p-2 pl-3.5 pr-2 rounded-2xl flex items-center gap-3 shadow-2xl border border-cyan-500/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              Demo Step {currentStep.step}/9
            </span>
          </div>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline max-w-[160px] truncate">
            {currentStep.title}
          </span>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
            <button
              onClick={handleExecuteCurrentStep}
              className="px-2.5 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition shadow-sm"
              title="Execute current demo step"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run</span>
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Expand Demo Controller"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDemoGuideOpen(false)}
              className="p-1 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Floating Window Mode
  return (
    <div className="fixed bottom-5 left-5 z-40 w-[380px] max-w-[calc(100vw-40px)] glass-panel-glow rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/50 backdrop-blur-2xl animate-in slide-in-from-bottom-4 duration-300">
      {/* Controller Header */}
      <div className="p-3.5 border-b border-slate-800/90 bg-slate-950/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-700/80 shadow-sm shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              SIH 2026 Live Demo Controller
            </h4>
            <span className="text-[10px] text-cyan-400 font-mono">1-Click Blueprint Sequence</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition"
            title="Minimize to floating pill"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
            title="Close Demo Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controller Body */}
      <div className="p-4 space-y-3.5 bg-slate-900/80">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Step {currentStep.step} of {DEMO_STEPS.length}</span>
            <span className="text-cyan-400 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Info */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h5 className="text-xs font-bold text-white tracking-tight">{currentStep.title}</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans pl-3.5">
            {currentStep.desc}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleExecuteCurrentStep}
            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-900/40 ring-1 ring-cyan-400/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{currentStep.buttonLabel || 'Execute Next Step'}</span>
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-xl transition"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 rounded-xl transition"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
