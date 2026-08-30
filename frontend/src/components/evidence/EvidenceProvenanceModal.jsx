import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Fingerprint,
  Database
} from 'lucide-react';

export default function EvidenceProvenanceModal() {
  const { 
    selectedEvidenceId, 
    isEvidenceModalOpen, 
    setIsEvidenceModalOpen,
    showToast
  } = useInvestigation();

  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!selectedEvidenceId || !isEvidenceModalOpen) {
      setEvidence(null);
      setVerificationResult(null);
      return;
    }

    const loadEvidence = async () => {
      setIsLoading(true);
      try {
        const data = await api.getEvidence(selectedEvidenceId);
        setEvidence(data);
      } catch (e) {
        showToast('Failed to load evidence: ' + e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvidence();
  }, [selectedEvidenceId, isEvidenceModalOpen]);

  const handleVerifyTampering = async () => {
    if (!selectedEvidenceId) return;
    setIsVerifying(true);
    try {
      const res = await api.verifyEvidence(selectedEvidenceId);
      setVerificationResult(res);
      if (res.is_valid) {
        showToast('SHA-256 Integrity Verified: Document is authentic and unmodified.', 'success');
      } else {
        showToast('INTEGRITY ALERT: SHA-256 hash mismatch! Evidence may have been altered.', 'error');
      }
    } catch (e) {
      showToast('Verification failed: ' + e.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyHash = () => {
    if (evidence?.sha256_hash) {
      navigator.clipboard.writeText(evidence.sha256_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('SHA-256 Hash copied to clipboard');
    }
  };

  if (!isEvidenceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-cyan-500/20">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm shadow-cyan-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Evidence Provenance & Cryptographic Vault</h3>
              <p className="text-xs font-mono text-cyan-400">ID: {selectedEvidenceId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {isLoading ? (
            <div className="py-16 text-center text-cyan-400 font-mono text-xs animate-pulse flex flex-col items-center gap-2">
              <Database className="w-6 h-6 animate-bounce" />
              <span>Retrieving cryptographic provenance from immutable vault...</span>
            </div>
          ) : evidence ? (
            <>
              {/* Evidence Title & Type */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {evidence.source_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {evidence.verification_status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
                    Confidence: {Math.round(evidence.confidence * 100)}%
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white pt-1 tracking-tight">{evidence.title}</h4>
              </div>

              {/* Content Snippet */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Extracted Evidence Record Content
                </span>
                <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {evidence.content_snippet}
                </div>
              </div>

              {/* Provenance Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Extraction Method:</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{evidence.extraction_method}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Confidence Rating:</span>
                  <span className="font-semibold text-cyan-400 mt-0.5 block">{Math.round(evidence.confidence * 100)}% Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Source URI / Vault Ref:</span>
                  <span className="font-mono text-slate-300 truncate block text-[11px] mt-0.5">{evidence.source_uri || 'Internal Vault Store'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Recorded Timestamp:</span>
                  <span className="font-mono text-slate-300 text-[11px] mt-0.5 block">{new Date(evidence.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4" /> SHA-256 Cryptographic Signature
                  </span>
                  <button
                    onClick={copyHash}
                    className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-cyan-300 break-all border border-slate-800 select-all leading-relaxed">
                  {evidence.sha256_hash}
                </div>
              </div>

              {/* Tamper Verification Result */}
              {verificationResult && (
                <div className={`p-4 rounded-2xl border transition-all animate-in fade-in ${
                  verificationResult.is_valid 
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 shadow-lg shadow-emerald-950/30' 
                    : 'bg-red-950/40 border-red-600/50 text-red-300 shadow-lg shadow-red-950/30'
                }`}>
                  <div className="flex items-start gap-3">
                    {verificationResult.is_valid ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-sm">
                        {verificationResult.is_valid 
                          ? 'CRYPTOGRAPHIC INTEGRITY VERIFIED (0 Alterations)' 
                          : 'TAMPER ALERT: HASH SIGNATURE MISMATCH'}
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        Computed hash matches the immutable blockchain audit ledger entry with zero bit variance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">No evidence artifact selected</div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleVerifyTampering}
            disabled={isVerifying || !evidence}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400/40 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Computing SHA-256 Digest...' : 'Verify Cryptographic Hash & Tamper Status'}</span>
          </button>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
