const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Graph & Topology
  getFullGraph: () => request('/graph/full'),
  getNeighborhood: (nodeId, depth = 1) => request(`/graph/neighborhood/${nodeId}?depth=${depth}`),
  getShortestPath: (source, target) => request(`/graph/path?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`),
  createEdge: (edgeData) => request('/graph/edge', { method: 'POST', body: JSON.stringify(edgeData) }),

  // Entities
  getEntities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/entities${query ? `?${query}` : ''}`);
  },
  getEntity: (id) => request(`/entities/${encodeURIComponent(id)}`),
  getEntityConnections: (id) => request(`/entities/${encodeURIComponent(id)}/connections`),
  createEntity: (entityData) => request('/entities', { method: 'POST', body: JSON.stringify(entityData) }),

  // Analytics & Centrality
  getCentralityMetrics: () => request('/analytics/centrality'),
  getCommunities: () => request('/analytics/communities'),
  getAnomalies: () => request('/analytics/anomalies'),
  getAnalyticsSummary: () => request('/analytics/summary'),

  // Evidence & Provenance
  getEvidenceList: () => request('/evidence'),
  getEvidence: (id) => request(`/evidence/${encodeURIComponent(id)}`),
  verifyEvidence: (id) => request(`/evidence/verify/${encodeURIComponent(id)}`, { method: 'POST' }),
  getAuditLedger: () => request('/evidence/ledger'),

  // Timeline
  getTimelineEvents: (entityId = null) => {
    return request(`/timeline/events${entityId ? `?entity_id=${encodeURIComponent(entityId)}` : ''}`);
  },

  // Investigations & Agent Workflows
  runAgentInvestigation: (payload) => request('/agent/investigate', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getInvestigations: () => request('/investigations'),
  getInvestigation: (id) => request(`/investigations/${encodeURIComponent(id)}`),

  // Reports
  generateReport: (caseId = 'C104', investigationId = 'inv_default') => request(`/reports/generate?case_id=${caseId}&investigation_id=${investigationId}`, { method: 'POST' }),
  getReport: (id) => request(`/reports/${encodeURIComponent(id)}`),

  // Ingestion
  ingestDocument: (formData) => fetch(`${API_BASE}/ingest/document`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json()),
  resetSeedData: () => request('/ingest/reset-seed', { method: 'POST' })
};
