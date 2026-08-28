import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DocumentIngestModal() {
  const { 
    isIngestModalOpen, 
    setIsIngestModalOpen, 
    fetchGraph, 
    showToast 
  } = useInvestigation();

  const [title, setTitle] = useState('FIR #108/2026 - Smuggling & Hawala Intercept');
  const [sourceType, setSourceType] = useState('FIR');
  const [content, setContent] = useState(`Special Cell Intercept Report:
On 2026-02-18, suspect was intercepted operating vehicle DL01AB9876.
Driver was communicating via phone +919876543210 regarding illicit cash transfer of Rs. 75,00,000 to Account 987654321098.
Case booked under Section IPC 420, 120B and PMLA provisions.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('source_type', sourceType);
      formData.append('content', content);

      const res = await api.ingestDocument(formData);
      setExtractionResult(res);
      await fetchGraph();
      showToast('Document successfully ingested and parsed! Graph updated.', 'success');
    } catch (err) {
      showToast('Ingestion failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isIngestModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Document & Evidence Ingestion Hub</h3>
              <p className="text-xs text-slate-400">Automated Entity Extraction & Graph Ingestion Pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsIngestModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <form onSubmit={handleIngest} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-300">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Source Type</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="FIR">FIR (Police)</option>
                  <option value="CDR_LOG">Telecom CDR Log</option>
                  <option value="BANK_STATEMENT">Bank / STR Statement</option>
                  <option value="PUBLIC_REGISTRY">Corporate / MCA Registry</option>
                  <option value="COURT_ORDER">Court Order / Seizure Memo</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Document Content / Intercept Text</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                placeholder="Paste FIR or report text with phone numbers, PAN, vehicle numbers..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-900/30"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Extracting Entities & Computing Hash...' : 'Ingest & Extract Into Investigation Graph'}
            </button>
          </form>

          {/* Extraction Preview */}
          {extractionResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Entity Extraction Results
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  SHA-256: {extractionResult.sha256_hash.slice(0, 16)}...
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(extractionResult.extracted || {}).map(([key, items]) => (
                  items.length > 0 && (
                    <div key={key} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 capitalize font-mono text-[10px] block">{key}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {items.map((it, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded text-[10px] font-mono border border-cyan-900">
                            {it.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
