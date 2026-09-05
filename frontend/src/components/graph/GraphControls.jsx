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
  ALL: '#0284c7',
  Person: '#0369a1',
  Organization: '#7c3aed',
  Phone: '#059669',
  BankAccount: '#d97706',
  Vehicle: '#2563eb',
  Location: '#e11d48',
  Case: '#4f46e5'
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

  const [sourceId, setSourceId] = useState('person_rajiv_malhotra');
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
        showToast(`Discovered ${res.hop_count}-hop connecting conduit path!`, 'success');
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
    <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-sky-200 shadow-sm space-y-2.5 transition-all">
      {/* Top Main Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-600" />
          <input
            type="text"
            placeholder="Search entities, PAN, aliases, phone numbers, accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 text-xs transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-lg border border-sky-200">
          <span className="text-[11px] text-sky-900 px-2 flex items-center gap-1 font-semibold">
            <Layers className="w-3 h-3 text-sky-600" /> Layout:
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
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                layoutName === l.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-900 hover:bg-sky-100/60'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Confidence Threshold */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
          <span className="text-[11px] text-slate-700 whitespace-nowrap font-medium">Min Confidence:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            className="w-20 accent-sky-600 h-1.5 bg-slate-200 rounded cursor-pointer"
          />
          <span className="text-[11px] font-mono font-bold text-sky-700 min-w-[32px]">
            {Math.round(confidenceThreshold * 100)}%
          </span>
        </div>

        {/* Action Buttons: Pathfinder Toggle & Reload */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPathfinder(!showPathfinder)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
              showPathfinder
                ? 'bg-sky-100 text-sky-900 border-sky-400'
                : 'bg-white hover:bg-sky-50 text-sky-900 border-sky-300'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-sky-600" />
            <span>Pathfinder</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showPathfinder ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={fetchGraph}
            className="p-2 rounded-lg bg-white hover:bg-sky-50 border border-slate-300 text-slate-600 hover:text-sky-600 transition"
            title="Reload graph topology"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-sky-600" /> Filter:
          </span>
          {nodeTypes.map((type) => {
            const isSelected = nodeTypeFilter === type;
            const dotColor = NODE_TYPE_COLORS[type] || '#0284c7';
            return (
              <button
                key={type}
                onClick={() => setNodeTypeFilter(type)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-sky-100 border-sky-500 text-sky-900 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-sky-300 hover:bg-sky-50/50'
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
        <div className="text-[11px] text-slate-600 font-medium">
          Showing <span className="text-sky-700 font-bold">{nodes.length}</span> nodes
        </div>
      </div>

      {/* Expandable Pathfinder Panel */}
      {showPathfinder && (
        <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-lg space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <span className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                <Route className="w-3.5 h-3.5 text-sky-700" /> Source Entity:
              </span>
              
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-600 max-w-[220px]"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>

              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />

              <span className="text-[11px] font-bold text-sky-900">Target Entity:</span>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-600 max-w-[220px]"
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
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-md flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isFindingPath ? 'Tracing...' : 'Trace Conduit Path'}</span>
              </button>

              <button
                onClick={handleClearPath}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs rounded-md transition"
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
