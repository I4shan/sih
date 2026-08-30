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
  Zap,
  DollarSign,
  TrendingUp,
  Activity
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
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm shadow-cyan-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>Network Graph Analytics & Topological Anomaly Detection</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 pl-11">
          Betweenness centrality bottleneck isolation, Louvain community modularity, and circular laundering patterns.
        </p>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>BRIDGE NODES</span>
            <Zap className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {analytics?.top_bridge_nodes?.length || 0}
          </div>
          <span className="text-[11px] text-red-400 font-mono">Critical network bottlenecks</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LAUNDERING RINGS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {anomalies.length}
          </div>
          <span className="text-[11px] text-amber-400 font-mono">Circular structuring alerts</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COMMUNITY CLUSTERS</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {communities.length}
          </div>
          <span className="text-[11px] text-purple-400 font-mono">Partitioned sub-syndicates</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FLAGGED OUTFLOW</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">
            ₹4.80 Cr
          </div>
          <span className="text-[11px] text-cyan-400 font-mono">Dubai N7 hawala corridor</span>
        </div>
      </div>

      {/* Grid: 3 Main Detailed Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Bridge Nodes (Betweenness Centrality) */}
        <div className="rounded-2xl glass-panel p-5 space-y-4 border border-red-950/60 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" /> Key Bridge Intermediaries
            </h3>
            <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800 font-bold">
              Betweenness
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Entities that act as essential connectors and bottlenecks between domestic Case C104 and transnational Network N7.
          </p>

          <div className="space-y-2.5">
            {(analytics?.top_bridge_nodes || []).map((bridge, idx) => (
              <div
                key={bridge.node_id}
                onClick={() => selectEntityById(bridge.node_id)}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-red-900/40 hover:border-red-500/80 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-200 group-hover:text-red-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-red-950 text-red-300 border border-red-700 text-[10px] flex items-center justify-center font-bold font-mono">
                      #{idx + 1}
                    </span>
                    <span>{bridge.label}</span>
                  </div>
                  <div className="text-[10px] text-red-400 font-mono mt-1 pl-7">
                    Betweenness: <span className="font-bold">{bridge.betweenness_score}</span> • {bridge.degree} Degree Connections
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Detected Anomalies & Laundering Rings */}
        <div className="rounded-2xl glass-panel p-5 space-y-4 border border-amber-950/60 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Financial Anomalies
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 font-bold">
              {anomalies.length} Flags
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Circular fund layering rings, high-velocity transit hubs, and structuring alerts detected in transaction graph.
          </p>

          <div className="space-y-3">
            {anomalies.map((anom, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 font-mono text-[11px]">{anom.type}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-400 border border-red-800 font-bold">
                    {anom.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{anom.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Community Clusters (Louvain Modularity) */}
        <div className="rounded-2xl glass-panel p-5 space-y-4 border border-purple-950/60 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Dense Community Clusters
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800 font-bold">
              Louvain
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically partitioned sub-networks with high internal communication and financial edge density.
          </p>

          <div className="space-y-3">
            {communities.map((comm) => (
              <div key={comm.community_id} className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-900/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">{comm.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {comm.size} Entities
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {comm.members.slice(0, 5).map((m) => (
                    <span 
                      key={m.id}
                      onClick={() => selectEntityById(m.id)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 rounded-lg text-[10px] cursor-pointer border border-slate-800 font-mono transition"
                    >
                      {m.label}
                    </span>
                  ))}
                  {comm.members.length > 5 && (
                    <span className="px-2 py-1 text-slate-500 text-[10px] font-mono">
                      +{comm.members.length - 5} more
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
