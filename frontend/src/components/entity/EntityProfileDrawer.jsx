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
  Fingerprint
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

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-slate-900/95 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
            {node.type}
          </span>
          {isBridge && (
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> BRIDGE NODE
            </span>
          )}
        </div>
        <button 
          onClick={() => selectEntityById(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Title & Identity */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{node.label}</h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {node.id}</p>
        </div>

        {/* Priority / Risk Score Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Investigation Priority Signal
            </span>
            <span className="font-mono font-bold text-amber-400">{node.risk_score || 0}/100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                (node.risk_score || 0) > 75 ? 'bg-red-500' : (node.risk_score || 0) > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${node.risk_score || 0}%` }}
            />
          </div>
          {node.risk_factors && node.risk_factors.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Priority Drivers:</span>
              <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc marker:text-cyan-400">
                {node.risk_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Node Properties */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" /> Attributes & Registry Records
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(node.properties || {}).map(([k, v]) => (
              <div key={k} className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                <span className="text-slate-400 capitalize block text-[10px] font-mono">{k.replace('_', ' ')}:</span>
                <span className="text-slate-200 font-medium break-words">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {node.tags && node.tags.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags / Clusters</h3>
            <div className="flex flex-wrap gap-1.5">
              {node.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Direct Connections Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" /> Direct Connections ({edges.length})
            </span>
          </h3>
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {edges.map((edge) => {
              const otherId = edge.source === node.id ? edge.target : edge.source;
              const otherNode = connected_nodes.find(n => n.id === otherId);
              return (
                <div 
                  key={edge.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer flex items-center justify-between text-xs"
                  onClick={() => selectEntityById(otherId)}
                >
                  <div>
                    <div className="font-medium text-slate-200">
                      {otherNode ? otherNode.label : otherId}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                      <span>{edge.label || edge.type}</span>
                      <span className="text-slate-500">• {Math.round(edge.confidence * 100)}% conf</span>
                    </div>
                  </div>
                  {edge.evidence_id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectEvidence(edge.evidence_id);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400"
                      title="Inspect Underlying Evidence"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2">
        <button
          onClick={() => selectEntityById(null)}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
