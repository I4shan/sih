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
  Search, 
  RotateCcw,
  Fingerprint,
  Database,
  ExternalLink
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
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm shadow-cyan-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <span>Cryptographic Evidence Vault & Audit Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 pl-11">
            Tamper-evident chain of custody: Every relationship, transcript, and record is cryptographically indexed with SHA-256.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
          title="Refresh Ledger"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Ledger Integrity Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-emerald-900/60 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700 shadow-md shadow-emerald-950/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <span>LEDGER INTEGRITY STATUS:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-xs">
                {ledgerStatus?.integrity?.is_valid ? '100% VERIFIED & UNALTERED' : 'TAMPER DETECTED'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Immutable Audit Blocks: <span className="text-slate-200 font-bold">{ledgerStatus?.integrity?.total_blocks || 0}</span> • Latest Block Hash: <span className="text-cyan-400">{ledgerStatus?.integrity?.latest_hash?.slice(0, 24)}...</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>TAMPER-EVIDENT SECURED</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
        <input
          type="text"
          placeholder="Search evidence artifacts by ID, title, or source type (FIR, CDR, Bank)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition font-sans"
        />
      </div>

      {/* Evidence Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-slate-800/90 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="p-4">Evidence ID & Title</th>
                <th className="p-4">Source Type</th>
                <th className="p-4">Extraction Method</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">SHA-256 Provenance Hash</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{ev.title}</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{ev.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {ev.source_type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-sans">{ev.extraction_method}</td>
                  <td className="p-4">
                    <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {Math.round(ev.confidence * 100)}%
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-cyan-300">
                    <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {ev.sha256_hash.slice(0, 16)}...{ev.sha256_hash.slice(-8)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => inspectEvidence(ev.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/80 font-bold text-xs transition shadow-sm"
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
    </div>
  );
}
