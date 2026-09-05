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
  ArrowRight,
  Database,
  Fingerprint
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-sky-800 flex items-center justify-between bg-[#004d80] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-800 text-white border border-sky-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Document & Evidence Ingestion Hub</h3>
              <p className="text-xs text-sky-200">Automated Entity Extraction & Graph Ingestion Pipeline</p>
            </div>
          </div>
          <button
            onClick={() => setIsIngestModalOpen(false)}
            className="p-1 rounded text-sky-200 hover:text-white hover:bg-sky-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <form onSubmit={handleIngest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 font-sans"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Source Type</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-600"
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
              <label className="text-xs font-bold text-slate-700">Raw Document Text / Intercept Transcript</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 leading-relaxed"
                placeholder="Paste FIR or report text with phone numbers, PAN, vehicle numbers, bank accounts..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Extracting Entities & Computing SHA-256...' : 'Ingest & Extract Into Investigation Graph'}</span>
            </button>
          </form>

          {/* Extraction Preview */}
          {extractionResult && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-300 space-y-2.5 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Entity Extraction Results
                </span>
                <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                  SHA-256: {extractionResult.sha256_hash?.slice(0, 16)}...
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(extractionResult.extracted || {}).map(([key, items]) => (
                  items.length > 0 && (
                    <div key={key} className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="text-slate-600 capitalize font-bold text-[10px] block">{key}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {items.map((it, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-sky-100 text-sky-900 rounded text-[10px] font-mono border border-sky-300 font-medium">
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
