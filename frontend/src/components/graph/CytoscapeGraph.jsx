import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import { useInvestigation } from '../../context/InvestigationContext';

// Register extensions
cytoscape.use(cola);
cytoscape.use(dagre);

const NODE_COLORS = {
  Person: '#00f0ff',
  Organization: '#a855f7',
  Phone: '#10b981',
  BankAccount: '#f59e0b',
  Vehicle: '#3b82f6',
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

    const elements = [
      ...filteredNodes.map(n => {
        const isBridge = n.tags && n.tags.includes('Bridge Node');
        const icon = NODE_ICONS[n.type] || '🔹';
        return {
          group: 'nodes',
          data: {
            id: n.id,
            label: `${icon} ${n.label}`,
            type: n.type,
            risk_score: n.risk_score || 0,
            isBridge: isBridge,
            nodeColor: NODE_COLORS[n.type] || '#94a3b8'
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
        {
          selector: 'node',
          style: {
            'background-color': 'data(nodeColor)',
            'label': 'data(label)',
            'color': '#f8fafc',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-outline-width': 2,
            'text-outline-color': '#0a0f1d',
            'width': 36,
            'height': 36,
            'border-width': 2,
            'border-color': '#1e293b',
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': '0.25s'
          }
        },
        {
          selector: 'node[?isBridge]',
          style: {
            'width': 46,
            'height': 46,
            'border-width': 4,
            'border-color': '#ef4444',
            'border-opacity': 0.9,
            'font-weight': 'bold',
            'font-size': '12px'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#00f0ff',
            'border-opacity': 1,
            'shadow-blur': 25,
            'shadow-color': '#00f0ff',
            'shadow-opacity': 0.8
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#334155',
            'target-arrow-color': '#334155',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.1,
            'label': 'data(label)',
            'color': '#94a3b8',
            'font-size': '9px',
            'text-rotation': 'autorotate',
            'text-background-color': '#0a0f1d',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 4,
            'line-color': '#00f0ff',
            'target-arrow-color': '#00f0ff',
            'color': '#00f0ff'
          }
        },
        {
          selector: '.highlighted-path-node',
          style: {
            'border-width': 4,
            'border-color': '#00f0ff',
            'shadow-blur': 30,
            'shadow-color': '#00f0ff',
            'shadow-opacity': 0.9
          }
        },
        {
          selector: '.highlighted-path-edge',
          style: {
            'width': 4,
            'line-color': '#00f0ff',
            'target-arrow-color': '#00f0ff',
            'color': '#00f0ff',
            'shadow-blur': 15,
            'shadow-color': '#00f0ff'
          }
        }
      ],
      layout: {
        name: layoutName === 'dagre' ? 'dagre' : (layoutName === 'circle' ? 'circle' : (layoutName === 'concentric' ? 'concentric' : 'cose')),
        animate: true,
        animationDuration: 600,
        nodeRepulsion: 6500,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        padding: 50
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

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl border border-slate-800 bg-background shadow-2xl">
      <div id="cytoscape-canvas" ref={containerRef} />
      <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg glass-panel flex items-center gap-2 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          CYTOSCAPE ENGINE ACTIVE • {graphData.nodes?.length || 0} NODES • {graphData.edges?.length || 0} EDGES
        </div>
      </div>
    </div>
  );
}
