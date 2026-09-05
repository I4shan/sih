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
  Zap,
  Shield
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Open Case C104 Dossier",
    desc: "Load initial investigation dossier for 'Case C104: Operation Hawala Matrix' (Primary Suspect: Rajiv Malhotra).",
    actionType: "CASE_LOAD",
    buttonLabel: "Load Case C104"
  },
  {
    step: 2,
    title: "2. Explore Initial Network Graph",
    desc: "Inspect starting entities, shell companies, and HDFC accounts on the Cytoscape canvas.",
    actionType: "EXPLORE_GRAPH",
    buttonLabel: "Focus Rajiv Malhotra"
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
    desc: "Highlight the 3-hop money conduit: Rajiv Malhotra -> Rajesh Hawala -> Tariq Sheikh.",
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
    desc: "Compile final structured investigation report with court-ready cryptographic evidence citations.",
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
        selectEntityById('person_rajiv_malhotra');
        showToast("Focused on Rajiv Malhotra and domestic connections", "info");
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
        <div className="bg-white p-2 pl-3.5 pr-2 rounded-xl flex items-center gap-3 shadow-lg border border-sky-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 animate-ping"></span>
            <span className="text-xs font-bold text-sky-900">
              Step {currentStep.step}/9
            </span>
          </div>
          <span className="text-xs text-slate-700 font-semibold hidden sm:inline max-w-[170px] truncate">
            {currentStep.title}
          </span>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-300">
            <button
              onClick={handleExecuteCurrentStep}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-md flex items-center gap-1 transition shadow-xs"
              title="Execute current demo step"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run</span>
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition"
              title="Expand controller"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDemoGuideOpen(false)}
              className="p-1 text-slate-500 hover:text-red-600 rounded-md hover:bg-slate-100 transition"
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
    <div className="fixed bottom-5 left-5 z-40 w-[390px] max-w-[calc(100vw-40px)] bg-white rounded-xl shadow-2xl overflow-hidden border border-sky-300 animate-in slide-in-from-bottom-4 duration-300">
      {/* Controller Header */}
      <div className="p-3 bg-[#004d80] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-sky-800/90 text-white border border-sky-600">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight">
              SIH 2026 Live Demo Controller
            </h4>
            <span className="text-[10px] text-sky-200">1-Click Investigation Sequence</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-sky-200 hover:text-white hover:bg-sky-800 rounded transition"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="p-1 text-sky-200 hover:text-red-300 hover:bg-sky-800 rounded transition"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controller Body */}
      <div className="p-4 space-y-3.5 bg-slate-50">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
            <span>Step {currentStep.step} of {DEMO_STEPS.length}</span>
            <span className="text-sky-800 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Info */}
        <div className="p-3 rounded-lg bg-white border border-slate-300 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            <h5 className="text-xs font-bold text-slate-900">{currentStep.title}</h5>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pl-3.5">
            {currentStep.desc}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleExecuteCurrentStep}
            className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{currentStep.buttonLabel || 'Execute Next Step'}</span>
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 rounded-lg transition"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(DEMO_STEPS.length - 1, prev + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 rounded-lg transition"
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
