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
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
        <h2 className="text-lg font-bold text-[#003366] tracking-tight flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>Network Graph Analytics & Topological Anomaly Detection</span>
        </h2>
        <p className="text-xs text-slate-600 mt-1 pl-11">
          Betweenness centrality bottleneck isolation, Louvain community modularity, and circular laundering patterns.
        </p>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>BRIDGE NODES</span>
            <Zap className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {analytics?.top_bridge_nodes?.length || 0}
          </div>
          <span className="text-[11px] text-red-700 font-medium">Critical network bottlenecks</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>LAUNDERING RINGS</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {anomalies.length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Circular structuring alerts</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>COMMUNITY CLUSTERS</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {communities.length}
          </div>
          <span className="text-[11px] text-purple-700 font-medium">Partitioned sub-syndicates</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-sky-300 bg-gradient-to-br from-white to-sky-50 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-sky-900 text-xs font-semibold">
            <span>FLAGGED OUTFLOW</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-sky-900 font-mono">
            ₹4.80 Cr
          </div>
          <span className="text-[11px] text-sky-700 font-medium">Dubai N7 hawala corridor</span>
        </div>
      </div>

      {/* Grid: 3 Main Detailed Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. Bridge Nodes */}
        <div className="rounded-xl bg-white p-4 space-y-3.5 border border-red-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" /> Key Bridge Intermediaries
            </h3>
            <span className="text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Betweenness
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Entities that act as essential connectors and bottlenecks between domestic Case C104 and transnational Network N7.
          </p>

          <div className="space-y-2">
            {(analytics?.top_bridge_nodes || []).map((bridge, idx) => (
              <div
                key={bridge.node_id}
                onClick={() => selectEntityById(bridge.node_id)}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-red-400 hover:bg-red-50/30 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-red-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-red-100 text-red-800 border border-red-300 text-[10px] flex items-center justify-center font-bold font-mono">
                      #{idx + 1}
                    </span>
                    <span>{bridge.label}</span>
                  </div>
                  <div className="text-[10px] text-red-800 font-mono mt-1 pl-7">
                    Score: <span className="font-bold">{bridge.betweenness_score}</span> • {bridge.degree} Connections
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Detected Anomalies */}
        <div className="rounded-xl bg-white p-4 space-y-3.5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Financial Anomalies
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {anomalies.length} Flags
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Circular fund layering rings, high-velocity transit hubs, and structuring alerts detected in transaction graph.
          </p>

          <div className="space-y-2.5">
            {anomalies.map((anom, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900 font-mono text-[11px]">{anom.type}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-200">
                    {anom.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{anom.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Community Clusters */}
        <div className="rounded-xl bg-white p-4 space-y-3.5 border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" /> Dense Community Clusters
            </h3>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Louvain
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatically partitioned sub-networks with high internal communication and financial edge density.
          </p>

          <div className="space-y-2.5">
            {communities.map((comm) => (
              <div key={comm.community_id} className="p-3 rounded-lg bg-slate-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-950">{comm.name}</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {comm.size} Entities
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {comm.members.slice(0, 5).map((m) => (
                    <span 
                      key={m.id}
                      onClick={() => selectEntityById(m.id)}
                      className="px-2 py-0.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 rounded text-[10px] cursor-pointer border border-slate-200 font-medium transition"
                    >
                      {m.label}
                    </span>
                  ))}
                  {comm.members.length > 5 && (
                    <span className="px-2 py-0.5 text-slate-500 text-[10px] font-medium">
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
