import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  FileCheck, 
  Cpu,
  CornerDownRight,
  ShieldAlert,
  Zap,
  Shield
} from 'lucide-react';

export default function AgentActivityFeed() {
  const { 
    activeInvestigation, 
    isAgentRunning, 
    runAgentInvestigation,
    activeCase
  } = useInvestigation();

  const [customQuery, setCustomQuery] = useState('Find the strongest connections to Network N7 and identify key bridge nodes');
  const [expandedSteps, setExpandedSteps] = useState({ 1: true, 2: true, 3: true });

  const toggleStep = (idx) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLaunch = () => {
    runAgentInvestigation(customQuery);
  };

  const sampleQueries = [
    "Find connections to Dubai Network N7",
    "Identify highest betweenness bridge node",
    "Trace ₹4.8 Cr circular wire transfer"
  ];

  const steps = activeInvestigation?.steps || [];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-sky-200 p-5 space-y-4 shadow-sm">
      {/* Header & Query Launcher */}
      <div className="space-y-3.5 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#003366] flex items-center gap-2 tracking-tight">
                Autonomous Multi-Agent Investigation Feed
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-900 border border-sky-300">
                  LangGraph Orchestrator
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Cryptographic reasoning audit logs and real-time tool execution traces
              </p>
            </div>
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Enter investigative hypothesis or query (e.g., 'Find connections to Dubai Network N7')..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
            <button
              onClick={handleLaunch}
              disabled={isAgentRunning}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAgentRunning ? 'Investigating...' : 'Dispatch Agents'}</span>
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-600 font-semibold">Suggested:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCustomQuery(q)}
                className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-[11px] transition font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investigation Summary Synthesis */}
      {activeInvestigation?.findings_summary && (
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 space-y-1.5 shadow-xs">
          <span className="text-xs font-bold text-sky-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-sky-700" /> Multi-Agent Synthesized Intelligence Finding:
          </span>
          <p className="text-xs text-slate-800 leading-relaxed pl-6 font-medium">
            {activeInvestigation.findings_summary}
          </p>
        </div>
      )}

      {/* Steps Timeline Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {steps.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs space-y-3">
            <Cpu className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
            <p>No active agent execution trace. Dispatch an investigation query above or use the Demo Guide.</p>
          </div>
        ) : (
          steps.map((step) => {
            const isExpanded = expandedSteps[step.step_index];
            return (
              <div 
                key={step.step_index} 
                className="rounded-xl bg-white border border-slate-300 overflow-hidden shadow-xs hover:border-sky-400 transition"
              >
                {/* Step Header */}
                <div 
                  onClick={() => toggleStep(step.step_index)}
                  className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-sky-50/50 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center text-xs font-bold font-mono">
                      {step.step_index}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{step.agent_name}</span>
                        <span className="text-[10px] font-mono text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-300 font-semibold">
                          {step.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{step.thought}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                    </span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>

                {/* Step Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                    {/* Reasoning */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        Agent Reasoning / Hypothesis:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {step.thought}
                      </p>
                    </div>

                    {/* Tool Call Payload */}
                    {step.tool_call && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-sky-800">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Terminal className="w-3.5 h-3.5 text-sky-700" /> Tool Invoked: {step.tool_call.tool_name}()
                          </span>
                          <span className="text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.tool_call.execution_time_ms} ms
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-2 overflow-x-auto text-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Input Payload:</span>
                            <pre className="text-sky-900 mt-1">{JSON.stringify(step.tool_call.tool_input, null, 2)}</pre>
                          </div>
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Execution Output:</span>
                            <pre className="text-emerald-900 mt-1">{JSON.stringify(step.tool_call.tool_output, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
