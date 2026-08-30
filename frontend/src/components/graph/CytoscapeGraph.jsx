import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import { useInvestigation } from '../../context/InvestigationContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Register extensions
cytoscape.use(cola);
cytoscape.use(dagre);

const NODE_COLORS = {
  Person: '#00f0ff',
  Organization: '#a855f7',
  Phone: '#10b981',
  BankAccount: '#f59e0b',
  Vehicle: '#38bdf8',
  Location: '#f43f5e',
  Case: '#6366f1',
  Document: '#84cc16',
  Evidence: '#ec4899',
  Event: '#eab308',
  Email: '#06b6d4',
  Device: '#14b8a6',
  Transaction: '#fbbf24'
};

const NODE_ICONS = {
  Person: '👤',
  Organization: '🏢',
  Phone: '📱',
  BankAccount: '🏦',
  Vehicle: '🚗',
  Location: '📍',
  Case: '📁',
  Document: '📄',
  Evidence: '🛡️',
  Event: '⚡'
};

export default function CytoscapeGraph({ layoutName = 'cose' }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [showLegend, setShowLegend] = useState(false);
  const {
    graphData,
    selectEntityById,
    setSelectedEdge,
    inspectEvidence,
    highlightedPath,
    nodeTypeFilter,
    confidenceThreshold,
    searchQuery
  } = useInvestigation();

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter nodes and edges based on user criteria
    let filteredNodes = graphData.nodes || [];
    if (nodeTypeFilter !== 'ALL') {
      filteredNodes = filteredNodes.filter(n => n.type === nodeTypeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(n =>
        n.label.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));

    let filteredEdges = (graphData.edges || []).filter(e =>
      visibleNodeIds.has(e.source) &&
      visibleNodeIds.has(e.target) &&
      (e.confidence || 1.0) >= confidenceThreshold
    );

    // Map into clean container card elements
    const elements = [
      ...filteredNodes.map(n => {
        const isBridge = n.tags && n.tags.includes('Bridge Node');
        const icon = NODE_ICONS[n.type] || '🔹';
        const color = NODE_COLORS[n.type] || '#38bdf8';
        const displayLabel = `${icon}  ${n.label}`;

        return {
          group: 'nodes',
          data: {
            id: n.id,
            label: displayLabel,
            rawLabel: n.label,
            type: n.type,
            risk_score: n.risk_score || 0,
            isBridge: isBridge,
            nodeColor: color
          }
        };
      }),
      ...filteredEdges.map(e => ({
        group: 'edges',
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label || e.type,
          type: e.type,
          confidence: e.confidence || 1.0,
          evidence_id: e.evidence_id,
          rawEdge: e
        }
      }))
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        /* Base Container Card */
        {
          selector: 'node',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#0e1626',
            'background-opacity': 0.95,
            'border-width': 1.5,
            'border-color': 'data(nodeColor)',
            'border-opacity': 0.9,
            'corner-radius': 8,
            'width': 140,
            'height': 38,
            'padding': 6,
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, -apple-system, sans-serif',
            'font-weight': '600',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'ellipsis',
            'text-max-width': '125px',
            'shadow-blur': 12,
            'shadow-color': 'data(nodeColor)',
            'shadow-opacity': 0.25,
            'transition-property': 'background-color, border-color, border-width, shadow-blur, shadow-opacity',
            'transition-duration': '0.15s'
          }
        },
        /* Bridge Node Container Card (Red Alert) */
        {
          selector: 'node[?isBridge]',
          style: {
            'background-color': '#1f0a12',
            'border-width': 2.5,
            'border-color': '#ef4444',
            'border-opacity': 1,
            'width': 155,
            'height': 42,
            'shadow-blur': 25,
            'shadow-color': '#ef4444',
            'shadow-opacity': 0.85,
            'color': '#ffccd5'
          }
        },
        /* Selected Container Card */
        {
          selector: 'node:selected',
          style: {
            'border-width': 2.5,
            'border-color': '#00f0ff',
            'background-color': '#0a2238',
            'shadow-blur': 30,
            'shadow-color': '#00f0ff',
            'shadow-opacity': 0.9
          }
        },
        /* Edge Connections */
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.0,
            'label': 'data(label)',
            'color': '#94a3b8',
            'font-size': '8.5px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': '500',
            'text-rotation': 'autorotate',
            'text-background-color': '#080d1a',
            'text-background-opacity': 0.92,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#1e293b',
            'text-border-width': 1,
            'text-border-opacity': 0.8
          }
        },
        /* Selected Edge */
        {
          selector: 'edge:selected',
          style: {
            'width': 3,
            'line-color': '#00f0ff',
            'target-arrow-color': '#00f0ff',
            'color': '#00f0ff',
            'text-border-color': '#00f0ff',
            'shadow-blur': 12,
            'shadow-color': '#00f0ff'
          }
        },
        /* Highlighted Path Nodes (Multi-Hop Trace) */
        {
          selector: '.highlighted-path-node',
          style: {
            'border-width': 2.5,
            'border-color': '#00f0ff',
            'background-color': '#08233a',
            'shadow-blur': 30,
            'shadow-color': '#00f0ff',
            'shadow-opacity': 0.95
          }
        },
        /* Highlighted Path Edges */
        {
          selector: '.highlighted-path-edge',
          style: {
            'width': 3.5,
            'line-color': '#00f0ff',
            'target-arrow-color': '#00f0ff',
            'color': '#00f0ff',
            'text-border-color': '#00f0ff',
            'shadow-blur': 16,
            'shadow-color': '#00f0ff'
          }
        }
      ],
      layout: {
        name: layoutName === 'dagre' ? 'dagre' : (layoutName === 'circle' ? 'circle' : (layoutName === 'concentric' ? 'concentric' : 'cose')),
        animate: true,
        animationDuration: 500,
        nodeRepulsion: 9000,
        idealEdgeLength: 130,
        edgeElasticity: 100,
        padding: 60
      }
    });

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      selectEntityById(node.id());
    });

    // Edge click handler
    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      const raw = edge.data('rawEdge');
      setSelectedEdge(raw);
      if (raw && raw.evidence_id) {
        inspectEvidence(raw.evidence_id);
      }
    });

    // Background click to clear selection
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        selectEntityById(null);
        setSelectedEdge(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graphData, nodeTypeFilter, confidenceThreshold, searchQuery, layoutName]);

  // Apply Highlighted Path Effect
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.elements().removeClass('highlighted-path-node highlighted-path-edge');

    if (highlightedPath && highlightedPath.node_ids) {
      highlightedPath.node_ids.forEach(nid => {
        cy.$(`#${nid}`).addClass('highlighted-path-node');
      });

      if (highlightedPath.edges) {
        highlightedPath.edges.forEach(e => {
          cy.$(`#${e.id}`).addClass('highlighted-path-edge');
        });
      }
    }
  }, [highlightedPath]);

  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 60);
  };

  const handleCenter = () => {
    if (cyRef.current) cyRef.current.center();
  };

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl border border-slate-800/80 bg-[#070b14] shadow-2xl">
      {/* Cytoscape Viewport Canvas */}
      <div id="cytoscape-canvas" ref={containerRef} />

      {/* Top-Left Floating HUD */}
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl glass-panel-glow flex items-center gap-2 text-xs font-mono text-cyan-300 border border-cyan-500/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="font-bold">{graphData.nodes?.length || 0} Entities</span>
          <span className="text-slate-600">•</span>
          <span>{graphData.edges?.length || 0} Links</span>
        </div>
      </div>

      {/* Top-Right Floating Canvas Zoom/Fit Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 glass-panel p-1 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition"
          title="Fit to Screen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCenter}
          className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition"
          title="Center Canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom-Right Floating Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden shadow-2xl max-w-xs transition-all">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="w-full px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-300 text-[11px] font-mono font-semibold flex items-center justify-between gap-2 transition"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Legend</span>
            </div>
            {showLegend ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {showLegend && (
            <div className="p-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-950/95 border-t border-slate-800">
              {Object.entries(NODE_COLORS).slice(0, 8).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-300 truncate">{type}</span>
                </div>
              ))}
              <div className="col-span-2 pt-1 border-t border-slate-800 flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-3 h-3 rounded-md border-2 border-red-500 bg-red-950 flex-shrink-0"></span>
                <span>🚨 Bridge Node</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
