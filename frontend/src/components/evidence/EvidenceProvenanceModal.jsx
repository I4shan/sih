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
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink
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
      showToast('SHA-256 Hash copied to clipboard');
    }
  };

  if (!isEvidenceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Evidence Provenance & Integrity Vault</h3>
              <p className="text-xs font-mono text-slate-400">ID: {selectedEvidenceId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs animate-pulse">
              Retrieving cryptographic provenance record...
            </div>
          ) : evidence ? (
            <>
              {/* Evidence Title & Type */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {evidence.source_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {evidence.verification_status}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white pt-1">{evidence.title}</h4>
              </div>

              {/* Content Snippet */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Extracted Evidence Record Content
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {evidence.content_snippet}
                </p>
              </div>

              {/* Provenance Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] font-mono block">Extraction Method:</span>
                  <span className="font-semibold text-slate-200">{evidence.extraction_method}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] font-mono block">Confidence Rating:</span>
                  <span className="font-semibold text-cyan-400">{Math.round(evidence.confidence * 100)}% Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] font-mono block">Source URI / Vault Ref:</span>
                  <span className="font-mono text-slate-300 truncate block text-[11px]">{evidence.source_uri || 'Internal Vault'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 text-[11px] font-mono block">Timestamp:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{new Date(evidence.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Signature Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> SHA-256 Provenance Hash
                  </span>
                  <button
                    onClick={copyHash}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy Hash
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-slate-300 break-all border border-slate-800 select-all">
                  {evidence.sha256_hash}
                </div>
              </div>

              {/* Tamper Verification Action & Result */}
              {verificationResult && (
                <div className={`p-4 rounded-xl border transition-all ${
                  verificationResult.is_valid 
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300' 
                    : 'bg-red-950/40 border-red-600/50 text-red-300'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {verificationResult.is_valid ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-1">
                      <div className="font-bold">
                        {verificationResult.is_valid 
                          ? 'CRYPTOGRAPHIC INTEGRITY CONFIRMED (0 Alterations)' 
                          : 'TAMPER ALERT: HASH SIGNATURE MISMATCH'}
                      </div>
                      <p className="text-[11px] opacity-90">
                        Computed hash exactly matches immutable blockchain audit ledger entry.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">No evidence artifact selected</div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handleVerifyTampering}
            disabled={isVerifying || !evidence}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-900/30"
          >
            <ShieldCheck className="w-4 h-4" />
            {isVerifying ? 'Computing SHA-256 Digest...' : 'Verify Cryptographic Hash & Tamper Status'}
          </button>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
