import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  Filter, 
  Route, 
  RotateCcw, 
  Search, 
  Sliders, 
  Maximize2, 
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

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
        showToast('No connecting path found', 'warning');
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

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl glass-panel border border-slate-800 text-sm">
      {/* Top Bar: Search & Layout */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search entities, aliases, PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
          />
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Layout:
          </span>
          {['cose', 'dagre', 'concentric', 'circle'].map((layout) => (
            <button
              key={layout}
              onClick={() => setLayoutName(layout)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                layoutName === layout
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={fetchGraph}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
          title="Reload graph topology"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Middle Bar: Entity Filters & Confidence Slider */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Entity Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setNodeTypeFilter(type)}
              className={`px-2 py-0.5 text-xs rounded-full border transition-all ${
                nodeTypeFilter === type
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-semibold'
                  : 'border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Confidence Threshold Slider */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <span className="text-xs text-slate-400 whitespace-nowrap">Min Confidence:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
            className="w-24 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-cyan-400 min-w-[32px]">
            {Math.round(confidenceThreshold * 100)}%
          </span>
        </div>
      </div>

      {/* Bottom Bar: Multi-Hop Pathfinder Tool */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 bg-slate-950/40 p-2 rounded-lg">
        <div className="flex items-center gap-2 flex-wrap">
          <Route className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300">Pathfinder:</span>
          
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            {(graphData.nodes || []).map((n) => (
              <option key={n.id} value={n.id}>
                {n.label} ({n.type})
              </option>
            ))}
          </select>

          <span className="text-slate-500 text-xs">➔</span>

          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
          >
            {(graphData.nodes || []).map((n) => (
              <option key={n.id} value={n.id}>
                {n.label} ({n.type})
              </option>
            ))}
          </select>

          <button
            onClick={handleFindPath}
            disabled={isFindingPath}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded flex items-center gap-1 transition shadow-lg shadow-cyan-900/40"
          >
            <Sparkles className="w-3 h-3" />
            {isFindingPath ? 'Searching...' : 'Find Connection Path'}
          </button>

          <button
            onClick={handleClearPath}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded transition"
          >
            Clear Path
          </button>
        </div>
      </div>
    </div>
  );
}
