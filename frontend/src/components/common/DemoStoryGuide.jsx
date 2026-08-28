import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X, 
  HelpCircle,
  ShieldAlert,
  Layers,
  FileText,
  Clock,
  BarChart3
} from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Open Case C104",
    desc: "Load initial case dossier for 'Case C104: Operation Hawala Matrix' (Primary Suspect: Vikram Singhania).",
    actionType: "CASE_LOAD"
  },
  {
    step: 2,
    title: "2. Explore Initial Network Graph",
    desc: "Inspect starting entities, shell companies, and HDFC accounts in Cytoscape canvas.",
    actionType: "EXPLORE_GRAPH"
  },
  {
    step: 3,
    title: "3. Ask: 'Find connections to Network N7'",
    desc: "Launch the autonomous multi-agent inquiry connecting Case C104 to the Dubai syndicate.",
    actionType: "RUN_AGENT"
  },
  {
    step: 4,
    title: "4. Agent Visibly Calls Tools",
    desc: "Observe real-time tool execution logs for Investigator, Graph, and Document agents.",
    actionType: "VIEW_AGENT_FEED"
  },
  {
    step: 5,
    title: "5. Discovered Path Highlighting",
    desc: "Highlight the 3-hop money conduit: Vikram Singhania -> Rajesh Hawala -> Tariq Sheikh.",
    actionType: "HIGHLIGHT_PATH"
  },
  {
    step: 6,
    title: "6. Click Relationship & View Provenance",
    desc: "Open evidence provenance modal for ₹4.8 Cr wire with verified SHA-256 hash.",
    actionType: "INSPECT_EVIDENCE"
  },
  {
    step: 7,
    title: "7. Identify Critical Bridge Node",
    desc: "Betweenness centrality analytics isolates Rajesh Kumar (Score: 0.842) as the sole bridge node.",
    actionType: "VIEW_ANALYTICS"
  },
  {
    step: 8,
    title: "8. Correlate Timeline Bursts",
    desc: "Correlate CDR phone calls with wire transfer velocity in the chronological timeline.",
    actionType: "VIEW_TIMELINE"
  },
  {
    step: 9,
    title: "9. Generate Intelligence Dossier",
    desc: "Compile final structured investigation report with cryptographic citations.",
    actionType: "VIEW_REPORT"
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

  if (!isDemoGuideOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleExecuteCurrentStep = async () => {
    switch (currentStep.actionType) {
      case "CASE_LOAD":
        onTabChange('graph');
        selectEntityById('case_c104');
        showToast("Case C104 loaded into Investigation Workspace");
        break;
      case "EXPLORE_GRAPH":
        onTabChange('graph');
        selectEntityById('person_vikram_singhania');
        showToast("Inspecting Vikram Singhania connections");
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
        showToast("Key Bridge Node Rajesh Kumar highlighted");
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

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white font-mono">SIH 2026 Live Demo Controller</span>
        </div>
        <button
          onClick={() => setIsDemoGuideOpen(false)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Step {currentStep.step} of {DEMO_STEPS.length}</span>
          <span className="text-cyan-400 font-bold">{Math.round((currentStep.step / DEMO_STEPS.length) * 100)}%</span>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">{currentStep.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.desc}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleExecuteCurrentStep}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-900/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Execute Next Step
          </button>
          {currentStepIndex > 0 && (
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
            >
              Prev
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
