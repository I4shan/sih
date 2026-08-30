import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  X, 
  ShieldAlert, 
  Link2, 
  FileText, 
  ExternalLink, 
  Layers, 
  Activity,
  AlertTriangle,
  Fingerprint,
  Share2,
  Sparkles
} from 'lucide-react';

export default function EntityProfileDrawer() {
  const { 
    selectedEntity, 
    selectEntityById, 
    inspectEvidence,
    setSelectedEdge
  } = useInvestigation();

  if (!selectedEntity || !selectedEntity.node) return null;

  const { node, edges = [], connected_nodes = [] } = selectedEntity;
  const isBridge = node.tags && node.tags.includes('Bridge Node');
  const riskScore = node.risk_score || 0;

  return (
    <>
      {/* Click-away Backdrop Layer */}
      <div 
        onClick={() => selectEntityById(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
      />

      {/* Slideover Panel */}
      <div className="fixed right-0 top-0 h-full w-[440px] max-w-[calc(100vw-20px)] bg-slate-950/95 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              {node.type}
            </span>
            {isBridge && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-950 text-red-300 border border-red-700 flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> BRIDGE NODE
              </span>
            )}
          </div>
          <button 
            onClick={() => selectEntityById(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Identity Title */}
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight">{node.label}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>ID:</span>
              <span className="text-cyan-400 select-all">{node.id}</span>
            </div>
          </div>

          {/* Priority Risk Score Gauge */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Threat / Priority Score
              </span>
              <span className={`font-mono font-bold text-sm ${
                riskScore > 75 ? 'text-red-400' : riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskScore}/100
              </span>
            </div>
            
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  riskScore > 75 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-sm shadow-red-500' 
                    : riskScore > 40 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>

            {node.risk_factors && node.risk_factors.length > 0 && (
              <div className="pt-2 space-y-1.5 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
                  Priority Risk Drivers:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-red-400">
                  {node.risk_factors.map((factor, idx) => (
                    <li key={idx} className="leading-snug">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Node Properties */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-cyan-400" /> Attributes & Registry Meta
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(node.properties || {}).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 capitalize block text-[10px] font-mono">{k.replace('_', ' ')}:</span>
                  <span className="text-slate-200 font-medium break-words">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Cluster Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {node.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs bg-slate-900 text-cyan-300 rounded-lg border border-slate-800 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Connections Table */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-cyan-400" /> Direct Connections ({edges.length})
              </span>
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {edges.map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const otherNode = connected_nodes.find(n => n.id === otherId);
                return (
                  <div 
                    key={edge.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between text-xs group"
                    onClick={() => selectEntityById(otherId)}
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                        {otherNode ? otherNode.label : otherId}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{edge.label || edge.type}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{Math.round(edge.confidence * 100)}% conf</span>
                      </div>
                    </div>
                    {edge.evidence_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectEvidence(edge.evidence_id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1 transition"
                        title="Inspect Underlying SHA-256 Evidence"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono">Proof</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex gap-2">
          <button
            onClick={() => selectEntityById(null)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Close Entity Inspector
          </button>
        </div>
      </div>
    </>
  );
}
