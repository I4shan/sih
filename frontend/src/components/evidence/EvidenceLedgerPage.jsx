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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#003366] tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <span>Cryptographic Evidence Vault & Audit Ledger</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 pl-11">
            Tamper-evident chain of custody: Every relationship, transcript, and record is cryptographically indexed with SHA-256.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition"
          title="Refresh Ledger"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Ledger Integrity Banner */}
      <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/80 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <span>LEDGER INTEGRITY STATUS:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs">
                {ledgerStatus?.integrity?.is_valid ? '100% VERIFIED & UNALTERED' : 'TAMPER DETECTED'}
              </span>
            </div>
            <div className="text-xs text-emerald-900 font-mono mt-0.5">
              Immutable Audit Blocks: <span className="font-bold">{ledgerStatus?.integrity?.total_blocks || 0}</span> • Latest Block Hash: <span className="text-emerald-800 font-bold">{ledgerStatus?.integrity?.latest_hash?.slice(0, 24)}...</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>TAMPER-EVIDENT SECURED</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-700" />
        <input
          type="text"
          placeholder="Search evidence artifacts by ID, title, or source type (FIR, CDR, Bank)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition shadow-xs"
        />
      </div>

      {/* Evidence Table */}
      <div className="rounded-xl overflow-hidden border border-slate-300 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#004d80] text-white">
              <tr>
                <th className="p-3.5 font-bold">Evidence ID & Title</th>
                <th className="p-3.5 font-bold">Source Type</th>
                <th className="p-3.5 font-bold">Extraction Method</th>
                <th className="p-3.5 font-bold">Confidence</th>
                <th className="p-3.5 font-bold">SHA-256 Provenance Hash</th>
                <th className="p-3.5 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEvidence.map((ev, idx) => (
                <tr key={ev.id} className={idx % 2 === 0 ? 'bg-white hover:bg-sky-50/50' : 'bg-slate-50/60 hover:bg-sky-50/50'}>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{ev.title}</div>
                    <div className="text-[10px] font-mono text-sky-800 mt-0.5">{ev.id}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300">
                      {ev.source_type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">{ev.extraction_method}</td>
                  <td className="p-3.5">
                    <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {Math.round(ev.confidence * 100)}%
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-800">
                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {ev.sha256_hash.slice(0, 16)}...{ev.sha256_hash.slice(-8)}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => inspectEvidence(ev.id)}
                      className="px-3 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold text-xs transition shadow-xs"
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
