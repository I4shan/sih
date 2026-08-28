import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const InvestigationContext = createContext();

export function InvestigationProvider({ children }) {
  // Case State
  const [activeCase, setActiveCase] = useState({
    id: 'C104',
    title: 'Case C104: Operation Hawala Matrix',
    targetNetwork: 'Network N7',
    status: 'ACTIVE_INVESTIGATION'
  });

  // Graph Data
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState(null);

  // Filters
  const [nodeTypeFilter, setNodeTypeFilter] = useState('ALL');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.0);
  const [searchQuery, setSearchQuery] = useState('');

  // Agent Investigation State
  const [activeInvestigation, setActiveInvestigation] = useState(null);
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  // Modals & Drawers
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load Graph Data
  const fetchGraph = async () => {
    setIsLoadingGraph(true);
    try {
      const data = await api.getFullGraph();
      setGraphData(data);
    } catch (err) {
      console.error("Failed to load graph data:", err);
    } finally {
      setIsLoadingGraph(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Inspect Entity
  const selectEntityById = async (id) => {
    if (!id) {
      setSelectedEntity(null);
      return;
    }
    try {
      const conn = await api.getEntityConnections(id);
      setSelectedEntity(conn);
    } catch (e) {
      const fallback = graphData.nodes.find(n => n.id === id);
      setSelectedEntity({ node: fallback, edges: [], connected_nodes: [] });
    }
  };

  // Inspect Evidence
  const inspectEvidence = (evidenceId) => {
    setSelectedEvidenceId(evidenceId);
    setIsEvidenceModalOpen(true);
  };

  // Run Agent Investigation
  const runAgentInvestigation = async (queryText = "Find strongest connections from Case C104 to Network N7") => {
    setIsAgentRunning(true);
    showToast("Investigator Agent initiated...", "info");
    try {
      const inv = await api.runAgentInvestigation({
        case_id: activeCase.id,
        query: queryText,
        focus_entity_id: "person_vikram_singhania"
      });
      setActiveInvestigation(inv);
      showToast("Agent investigation complete. 6 steps executed.", "success");
      
      // Auto highlight discovered path
      try {
        const pathRes = await api.getShortestPath("person_vikram_singhania", "org_dubai_express");
        if (pathRes && pathRes.node_ids) {
          setHighlightedPath(pathRes);
        }
      } catch (e) {
        console.warn("Could not find path:", e);
      }
    } catch (err) {
      showToast("Error running investigation: " + err.message, "error");
    } finally {
      setIsAgentRunning(false);
    }
  };

  return (
    <InvestigationContext.Provider value={{
      activeCase,
      setActiveCase,
      graphData,
      isLoadingGraph,
      fetchGraph,
      selectedEntity,
      setSelectedEntity,
      selectEntityById,
      selectedEdge,
      setSelectedEdge,
      selectedEvidenceId,
      setSelectedEvidenceId,
      inspectEvidence,
      isEvidenceModalOpen,
      setIsEvidenceModalOpen,
      highlightedPath,
      setHighlightedPath,
      nodeTypeFilter,
      setNodeTypeFilter,
      confidenceThreshold,
      setConfidenceThreshold,
      searchQuery,
      setSearchQuery,
      activeInvestigation,
      setActiveInvestigation,
      isAgentRunning,
      runAgentInvestigation,
      isIngestModalOpen,
      setIsIngestModalOpen,
      isDemoGuideOpen,
      setIsDemoGuideOpen,
      toastMessage,
      showToast
    }}>
      {children}
    </InvestigationContext.Provider>
  );
}

export const useInvestigation = () => useContext(InvestigationContext);
