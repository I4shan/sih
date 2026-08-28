import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ExternalLink,
  Search,
  RotateCcw
} from 'lucide-react';

export default function EvidenceLedgerPage() {
  const { inspectEvidence, showToast } = useInvestigation();
  const [evidenceList, setEvidenceList] = useState([]);
  const [ledgerStatus, setLedgerStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [evs, ledger] = await Promise.all([
        api.getEvidenceList(),
        api.getAuditLedger()
      ]);
      setEvidenceList(evs);
      setLedgerStatus(ledger);
    } catch (e) {
      showToast('Failed to load evidence vault: ' + e.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEvidence = evidenceList.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.source_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" /> Evidence Vault & Cryptographic Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Section 17 & 18 Evidence Traceability: Every claim is cryptographically hashed with SHA-256 in an append-only audit ledger.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Ledger Integrity Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-emerald-900/50 bg-emerald-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-300">
              LEDGER INTEGRITY: {ledgerStatus?.integrity?.is_valid ? '100% VERIFIED' : 'TAMPER DETECTED'}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Total Immutable Audit Blocks: {ledgerStatus?.integrity?.total_blocks || 0} • Latest Hash: {ledgerStatus?.integrity?.latest_hash?.slice(0, 24)}...
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 font-bold">
          TAMPER-EVIDENT SECURED
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter evidence artifacts by ID, title, or source type (FIR, CDR, Bank)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Evidence Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono">
            <tr>
              <th className="p-4">Evidence ID & Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Extraction Method</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">SHA-256 Provenance Hash</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvidence.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4">
                  <div className="font-semibold text-slate-200">{ev.title}</div>
                  <div className="text-[10px] font-mono text-cyan-400">{ev.id}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {ev.source_type}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{ev.extraction_method}</td>
                <td className="p-4">
                  <span className="font-mono text-emerald-400 font-semibold">{Math.round(ev.confidence * 100)}%</span>
                </td>
                <td className="p-4 font-mono text-[10px] text-slate-400">
                  {ev.sha256_hash.slice(0, 16)}...{ev.sha256_hash.slice(-8)}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => inspectEvidence(ev.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-semibold text-xs transition"
                  >
                    Verify Hash
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
