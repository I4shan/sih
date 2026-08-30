import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  Filter, 
  Route, 
  RotateCcw, 
  Search, 
  Sliders, 
  Layers, 
  Sparkles,
  X,
  ChevronDown,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const NODE_TYPE_COLORS = {
  ALL: '#38bdf8',
  Person: '#00f0ff',
  Organization: '#a855f7',
  Phone: '#10b981',
  BankAccount: '#f59e0b',
  Vehicle: '#3b82f6',
  Location: '#f43f5e',
  Case: '#6366f1'
};

export default function GraphControls({ layoutName, setLayoutName }) {
  const {
    graphData,
    fetchGraph,
    nodeTypeFilter,
    setNodeTypeFilter,
    confidenceThreshold,
    setConfidenceThreshold,
    searchQuery,
    setSearchQuery,
    setHighlightedPath,
    showToast
  } = useInvestigation();

  const [sourceId, setSourceId] = useState('person_vikram_singhania');
  const [targetId, setTargetId] = useState('org_dubai_express');
  const [isFindingPath, setIsFindingPath] = useState(false);
  const [showPathfinder, setShowPathfinder] = useState(false);

  const nodeTypes = ['ALL', 'Person', 'Organization', 'Phone', 'BankAccount', 'Vehicle', 'Location', 'Case'];

  const handleFindPath = async () => {
    if (!sourceId || !targetId) {
      showToast('Select both source and target entities', 'error');
      return;
    }
    setIsFindingPath(true);
    try {
      const res = await api.getShortestPath(sourceId, targetId);
      if (res.found) {
        setHighlightedPath(res);
        showToast(`Discovered ${res.hop_count}-hop connecting path!`, 'success');
      } else {
        showToast('No connecting path found between selected entities', 'warning');
      }
    } catch (e) {
      showToast('Path lookup failed: ' + e.message, 'error');
    } finally {
      setIsFindingPath(false);
    }
  };

  const handleClearPath = () => {
    setHighlightedPath(null);
    showToast('Path highlights cleared');
  };

  const nodes = graphData.nodes || [];

  return (
    <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-slate-800/90 shadow-xl space-y-2.5 transition-all">
      {/* Top Main Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search entities, PAN, aliases, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-xs transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1 font-mono">
            <Layers className="w-3 h-3 text-cyan-400" /> Layout:
          </span>
          {[
            { id: 'cose', label: 'Force' },
            { id: 'dagre', label: 'Hierarchy' },
            { id: 'concentric', label: 'Concentric' },
            { id: 'circle', label: 'Circle' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLayoutName(l.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                layoutName === l.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Confidence Threshold */}
        <div className="flex items-center gap-2 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 whitespace-nowrap font-mono">Min Conf:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
          <span className="text-[11px] font-mono font-bold text-cyan-400 min-w-[32px]">
            {Math.round(confidenceThreshold * 100)}%
          </span>
        </div>

        {/* Action Buttons: Pathfinder Toggle & Reload */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPathfinder(!showPathfinder)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition ${
              showPathfinder
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pathfinder</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showPathfinder ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={fetchGraph}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-cyan-400 transition"
            title="Reload graph topology"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {nodeTypes.map((type) => {
            const isSelected = nodeTypeFilter === type;
            const dotColor = NODE_TYPE_COLORS[type] || '#38bdf8';
            return (
              <button
                key={type}
                onClick={() => setNodeTypeFilter(type)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {type !== 'ALL' && (
                  <span 
                    className="w-2 h-2 rounded-full inline-block" 
                    style={{ backgroundColor: dotColor }}
                  />
                )}
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        {/* Active Node Counter */}
        <div className="text-[11px] font-mono text-slate-400">
          Showing <span className="text-cyan-300 font-bold">{nodes.length}</span> nodes
        </div>
      </div>

      {/* Expandable Pathfinder Panel */}
      {showPathfinder && (
        <div className="p-3 bg-slate-950/90 border border-cyan-900/40 rounded-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 font-bold">
                <Route className="w-3.5 h-3.5" /> Discovery Source:
              </span>
              
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 max-w-[220px]"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>

              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />

              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 max-w-[220px]"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFindPath}
                disabled={isFindingPath}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-cyan-900/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isFindingPath ? 'Calculating...' : 'Trace Conduit Path'}</span>
              </button>

              <button
                onClick={handleClearPath}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
