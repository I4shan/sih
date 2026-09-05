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
  Person: '#0284c7',
  Organization: '#7c3aed',
  Phone: '#059669',
  BankAccount: '#d97706',
  Vehicle: '#2563eb',
  Location: '#e11d48',
  Case: '#4f46e5',
  Document: '#65a30d',
  Evidence: '#db2777',
  Event: '#ca8a04',
  Email: '#0891b2',
  Device: '#0d9488',
  Transaction: '#ea580c'
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
        const color = NODE_COLORS[n.type] || '#0284c7';
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
        /* Base Container Card for Light Gov Theme */
        {
          selector: 'node',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#ffffff',
            'background-opacity': 1.0,
            'border-width': 2,
            'border-color': 'data(nodeColor)',
            'border-opacity': 1.0,
            'corner-radius': 6,
            'width': 145,
            'height': 38,
            'padding': 6,
            'label': 'data(label)',
            'color': '#0f172a',
            'font-size': '11px',
            'font-family': 'Segoe UI, system-ui, -apple-system, sans-serif',
            'font-weight': '600',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'ellipsis',
            'text-max-width': '130px',
            'shadow-blur': 6,
            'shadow-color': '#000000',
            'shadow-opacity': 0.08,
            'transition-property': 'background-color, border-color, border-width, shadow-blur, shadow-opacity',
            'transition-duration': '0.15s'
          }
        },
        /* Bridge Node Container Card (Red Alert for Govt Inspection) */
        {
          selector: 'node[?isBridge]',
          style: {
            'background-color': '#fff5f5',
            'border-width': 2.5,
            'border-color': '#dc2626',
            'border-opacity': 1,
            'width': 160,
            'height': 42,
            'shadow-blur': 12,
            'shadow-color': '#dc2626',
            'shadow-opacity': 0.35,
            'color': '#991b1b'
          }
        },
        /* Selected Container Card */
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#0284c7',
            'background-color': '#e0f2fe',
            'color': '#0369a1',
            'shadow-blur': 16,
            'shadow-color': '#0284c7',
            'shadow-opacity': 0.4
          }
        },
        /* Edge Connections */
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': '#64748b',
            'target-arrow-color': '#64748b',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.0,
            'label': 'data(label)',
            'color': '#334155',
            'font-size': '9px',
            'font-family': 'Segoe UI, system-ui, sans-serif',
            'font-weight': '600',
            'text-rotation': 'autorotate',
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#cbd5e1',
            'text-border-width': 1,
            'text-border-opacity': 0.9
          }
        },
        /* Selected Edge */
        {
          selector: 'edge:selected',
          style: {
            'width': 3,
            'line-color': '#0284c7',
            'target-arrow-color': '#0284c7',
            'color': '#0369a1',
            'text-border-color': '#0284c7',
            'shadow-blur': 8,
            'shadow-color': '#0284c7'
          }
        },
        /* Highlighted Path Nodes (Multi-Hop Trace) */
        {
          selector: '.highlighted-path-node',
          style: {
            'border-width': 3,
            'border-color': '#0284c7',
            'background-color': '#e0f2fe',
            'color': '#0369a1',
            'shadow-blur': 18,
            'shadow-color': '#0284c7',
            'shadow-opacity': 0.5
          }
        },
        /* Highlighted Path Edges */
        {
          selector: '.highlighted-path-edge',
          style: {
            'width': 3.5,
            'line-color': '#0284c7',
            'target-arrow-color': '#0284c7',
            'color': '#0284c7',
            'text-border-color': '#0284c7',
            'shadow-blur': 10,
            'shadow-color': '#0284c7'
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
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-xl border border-sky-200 bg-[#f8fafc] shadow-xs">
      {/* Cytoscape Viewport Canvas */}
      <div id="cytoscape-canvas" ref={containerRef} />

      {/* Top-Left Floating HUD */}
      <div className="absolute top-3.5 left-3.5 pointer-events-none z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/95 border border-sky-300 shadow-sm flex items-center gap-2 text-xs font-mono text-sky-950">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-sky-900">{graphData.nodes?.length || 0} Entities</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">{graphData.edges?.length || 0} Links</span>
        </div>
      </div>

      {/* Top-Right Floating Canvas Zoom/Fit Controls */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 rounded text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition"
          title="Fit to Screen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCenter}
          className="p-1.5 rounded text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition"
          title="Center Canvas"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom-Right Floating Legend */}
      <div className="absolute bottom-3.5 right-3.5 z-10">
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-md max-w-xs transition-all">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="w-full px-3 py-1.5 bg-slate-50 hover:bg-sky-50 text-slate-800 text-[11px] font-semibold flex items-center justify-between gap-2 transition"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-700" />
              <span>Legend</span>
            </div>
            {showLegend ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {showLegend && (
            <div className="p-3 grid grid-cols-2 gap-2 text-[11px] bg-white border-t border-slate-200">
              {Object.entries(NODE_COLORS).slice(0, 8).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-700 truncate">{type}</span>
                </div>
              ))}
              <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center gap-1.5 text-red-700 font-bold">
                <span className="w-3 h-3 rounded-sm border-2 border-red-600 bg-red-100 flex-shrink-0"></span>
                <span>🚨 Bridge Node</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
