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
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function AgentActivityFeed() {
  const { 
    activeInvestigation, 
    isAgentRunning, 
    runAgentInvestigation,
    activeCase
  } = useInvestigation();

  const [customQuery, setCustomQuery] = useState('Find the strongest connections to Network N7 and identify key bridge nodes');
  const [expandedSteps, setExpandedSteps] = useState({ 1: true, 2: true });

  const toggleStep = (idx) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLaunch = () => {
    runAgentInvestigation(customQuery);
  };

  const steps = activeInvestigation?.steps || [];

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-5">
      {/* Header & Query Launcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Agentic Investigation Trace
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  LangGraph Multi-Agent
                </span>
              </h2>
              <p className="text-xs text-slate-400">Autonomous tool-calling investigation pipeline</p>
            </div>
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Ask an investigation question..."
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={handleLaunch}
            disabled={isAgentRunning}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-900/30 disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            {isAgentRunning ? 'Investigating...' : 'Run Agent Query'}
          </button>
        </div>
      </div>

      {/* Investigation Summary Box (If available) */}
      {activeInvestigation?.findings_summary && (
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-1.5 animate-in fade-in">
          <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" /> Executive Finding Synthesis
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {activeInvestigation.findings_summary}
          </p>
        </div>
      )}

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {steps.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs font-mono space-y-3">
            <Cpu className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
            <p>No active agent execution trace. Click "Run Agent Query" to initiate the multi-agent investigation pipeline.</p>
          </div>
        ) : (
          steps.map((step) => {
            const isExpanded = expandedSteps[step.step_index];
            return (
              <div 
                key={step.step_index} 
                className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden transition"
              >
                {/* Step Header */}
                <div 
                  onClick={() => toggleStep(step.step_index)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center text-xs font-bold font-mono">
                      {step.step_index}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{step.agent_name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.2 rounded border border-cyan-800">
                          {step.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{step.thought}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Step Details (Expandable) */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3 text-xs">
                    {/* Reasoning */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Agent Reasoning:</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                        {step.thought}
                      </p>
                    </div>

                    {/* Tool Call Payload */}
                    {step.tool_call && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                          <span className="flex items-center gap-1 font-bold">
                            <Terminal className="w-3.5 h-3.5" /> Tool: {step.tool_call.tool_name}()
                          </span>
                          <span className="text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {step.tool_call.execution_time_ms} ms
                          </span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-2 overflow-x-auto">
                          <div>
                            <span className="text-slate-500 block text-[10px]">TOOL INPUT:</span>
                            <pre className="text-cyan-200">{JSON.stringify(step.tool_call.tool_input, null, 2)}</pre>
                          </div>
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-slate-500 block text-[10px]">STRUCTURED OUTPUT:</span>
                            <pre className="text-emerald-300">{JSON.stringify(step.tool_call.tool_output, null, 2)}</pre>
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
