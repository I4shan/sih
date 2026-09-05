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
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 animate-in fade-in duration-200"
      />

      {/* Slideover Panel */}
      <div className="fixed right-0 top-0 h-full w-[440px] max-w-[calc(100vw-20px)] bg-white border-l border-slate-300 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-sky-50/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
              {node.type}
            </span>
            {isBridge && (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> BRIDGE NODE
              </span>
            )}
          </div>
          <button 
            onClick={() => selectEntityById(null)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Identity Title */}
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-[#003366] tracking-tight">{node.label}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Entity ID:</span>
              <span className="text-sky-800 font-semibold select-all">{node.id}</span>
            </div>
          </div>

          {/* Priority Risk Score Gauge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" /> Priority Threat Score
              </span>
              <span className={`font-mono font-bold text-sm ${
                riskScore > 75 ? 'text-red-700' : riskScore > 40 ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {riskScore}/100
              </span>
            </div>
            
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  riskScore > 75 
                    ? 'bg-red-600' 
                    : riskScore > 40 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${riskScore}%` }}
              />
            </div>

            {node.risk_factors && node.risk_factors.length > 0 && (
              <div className="pt-2 space-y-1 border-t border-slate-200">
                <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                  Priority Risk Drivers:
                </span>
                <ul className="text-xs text-slate-700 space-y-0.5 pl-4 list-disc marker:text-red-600">
                  {node.risk_factors.map((factor, idx) => (
                    <li key={idx} className="leading-snug">{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Node Properties */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-sky-700" /> Attributes & Registry Meta
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(node.properties || {}).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 capitalize block text-[10px] font-semibold">{k.replace('_', ' ')}:</span>
                  <span className="text-slate-900 font-medium break-words">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cluster Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {node.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-xs bg-sky-50 text-sky-900 rounded border border-sky-200 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Connections Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-sky-700" /> Direct Connections ({edges.length})
              </span>
            </h3>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {edges.map((edge) => {
                const otherId = edge.source === node.id ? edge.target : edge.source;
                const otherNode = connected_nodes.find(n => n.id === otherId);
                return (
                  <div 
                    key={edge.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition cursor-pointer flex items-center justify-between text-xs group"
                    onClick={() => selectEntityById(otherId)}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-sky-900 transition">
                        {otherNode ? otherNode.label : otherId}
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <span className="text-sky-800 font-medium">{edge.label || edge.type}</span>
                        <span className="text-slate-400">•</span>
                        <span>{Math.round(edge.confidence * 100)}% conf</span>
                      </div>
                    </div>
                    {edge.evidence_id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectEvidence(edge.evidence_id);
                        }}
                        className="px-2 py-1 rounded bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1 text-[10px] font-bold transition shadow-2xs"
                        title="Inspect Underlying Evidence"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Proof</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
          <button
            onClick={() => selectEntityById(null)}
            className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition"
          >
            Close Entity Inspector
          </button>
        </div>
      </div>
    </>
  );
}
