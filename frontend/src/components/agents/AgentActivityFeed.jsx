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
  Zap
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
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-slate-800/90 p-5 space-y-5 shadow-2xl">
      {/* Header & Query Launcher */}
      <div className="space-y-3.5 border-b border-slate-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-950 to-blue-950 text-cyan-400 border border-cyan-700/80 shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                Autonomous Multi-Agent Investigation Feed
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  LangGraph Orchestrator
                </span>
              </h2>
              <p className="text-xs text-slate-400">Collaborative tool-calling agents with cryptographic reasoning audit logs</p>
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
              placeholder="Ask an investigation question or hypothesis..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-sans"
            />
            <button
              onClick={handleLaunch}
              disabled={isAgentRunning}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-900/40 ring-1 ring-cyan-400/40 disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAgentRunning ? 'Investigating...' : 'Dispatch Agents'}</span>
            </button>
          </div>

          {/* Quick Query Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-500 font-mono">Suggested:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCustomQuery(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 text-[11px] font-mono transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investigation Summary Synthesis */}
      {activeInvestigation?.findings_summary && (
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-700/60 space-y-1.5 animate-in fade-in shadow-lg shadow-cyan-950/30">
          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" /> Multi-Agent Synthesized Intelligence Finding:
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans pl-6">
            {activeInvestigation.findings_summary}
          </p>
        </div>
      )}

      {/* Steps Timeline Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {steps.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs font-mono space-y-3">
            <Cpu className="w-10 h-10 mx-auto text-slate-700 animate-pulse" />
            <p>No active agent execution trace. Dispatch an investigation query above or use the SIH Demo Guide.</p>
          </div>
        ) : (
          steps.map((step) => {
            const isExpanded = expandedSteps[step.step_index];
            return (
              <div 
                key={step.step_index} 
                className="rounded-2xl bg-slate-950/80 border border-slate-800/90 overflow-hidden transition hover:border-slate-700"
              >
                {/* Step Header */}
                <div 
                  onClick={() => toggleStep(step.step_index)}
                  className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono shadow-sm">
                      {step.step_index}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{step.agent_name}</span>
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                          {step.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans">{step.thought}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Step Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-3.5 text-xs animate-in fade-in">
                    {/* Reasoning */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                        Agent Reasoning / Hypothesis:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {step.thought}
                      </p>
                    </div>

                    {/* Tool Call Payload */}
                    {step.tool_call && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Tool Invoked: {step.tool_call.tool_name}()
                          </span>
                          <span className="text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.tool_call.execution_time_ms} ms
                          </span>
                        </div>
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 overflow-x-auto">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Input Payload:</span>
                            <pre className="text-cyan-200 mt-1">{JSON.stringify(step.tool_call.tool_input, null, 2)}</pre>
                          </div>
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Execution Output:</span>
                            <pre className="text-emerald-300 mt-1">{JSON.stringify(step.tool_call.tool_output, null, 2)}</pre>
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
