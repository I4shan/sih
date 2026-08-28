import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  BarChart3, 
  Share2, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  ArrowUpRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AnalyticsPanel() {
  const { selectEntityById, showToast } = useInvestigation();
  const [analytics, setAnalytics] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [cent, comm, anom] = await Promise.all([
          api.getCentralityMetrics(),
          api.getCommunities(),
          api.getAnomalies()
        ]);
        setAnalytics(cent);
        setCommunities(comm);
        setAnomalies(anom);
      } catch (e) {
        showToast('Failed to load analytics: ' + e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" /> Network Graph Analytics & Anomaly Detection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Topological centrality metrics, dense community clusters, and financial laundering patterns.
          </p>
        </div>
      </div>

      {/* Grid: 3 Main Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Bridge Nodes (Betweenness Centrality) */}
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" /> Key Bridge Intermediaries
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Betweenness Centrality</span>
          </div>
          <p className="text-xs text-slate-400">
            Entities that act as essential connectors and bottlenecks between disjoint sub-networks.
          </p>

          <div className="space-y-2">
            {(analytics?.top_bridge_nodes || []).map((bridge, idx) => (
              <div
                key={bridge.node_id}
                onClick={() => selectEntityById(bridge.node_id)}
                className="p-3 rounded-xl bg-slate-950/70 border border-red-950 hover:border-red-500/60 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {bridge.label}
                  </div>
                  <span className="text-[10px] text-red-400 font-mono">
                    Score: {bridge.betweenness_score} • {bridge.degree} connections
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Detected Anomalies & Laundering Rings */}
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Financial Anomalies
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {anomalies.length} Flags
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Circular fund layering rings, high-velocity transit hubs, and structuring alerts.
          </p>

          <div className="space-y-2.5">
            {anomalies.map((anom, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-amber-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 font-mono text-[11px]">{anom.type}</span>
                  <span className="px-2 py-0.2 rounded text-[9px] font-mono bg-red-950 text-red-400 border border-red-800 font-bold">
                    {anom.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{anom.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Community Clusters (Louvain) */}
        <div className="rounded-2xl glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Dense Community Clusters
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Modularity</span>
          </div>
          <p className="text-xs text-slate-400">
            Automatically partitioned sub-networks with high internal communication/financial density.
          </p>

          <div className="space-y-2.5">
            {communities.map((comm) => (
              <div key={comm.community_id} className="p-3 rounded-xl bg-slate-950/70 border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">{comm.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{comm.size} Entities</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comm.members.slice(0, 4).map((m) => (
                    <span 
                      key={m.id}
                      onClick={() => selectEntityById(m.id)}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[10px] cursor-pointer border border-slate-800"
                    >
                      {m.label}
                    </span>
                  ))}
                  {comm.members.length > 4 && (
                    <span className="px-1.5 py-0.5 text-slate-500 text-[10px] font-mono">
                      +{comm.members.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
