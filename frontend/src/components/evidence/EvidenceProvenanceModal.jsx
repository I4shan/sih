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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-sky-800 flex items-center justify-between bg-[#004d80] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-800 text-white border border-sky-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Evidence Provenance & Cryptographic Vault</h3>
              <p className="text-xs text-sky-200 font-mono">ID: {selectedEvidenceId}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="p-1 rounded text-sky-200 hover:text-white hover:bg-sky-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-16 text-center text-sky-800 font-medium text-xs flex flex-col items-center gap-2">
              <Database className="w-6 h-6 animate-spin text-sky-600" />
              <span>Retrieving cryptographic provenance from immutable vault...</span>
            </div>
          ) : evidence ? (
            <>
              {/* Evidence Title & Type */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
                    {evidence.source_type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {evidence.verification_status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs text-slate-700 bg-slate-50 border border-slate-300 font-medium">
                    Confidence: {Math.round(evidence.confidence * 100)}%
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[#003366] pt-1 tracking-tight">{evidence.title}</h4>
              </div>

              {/* Content Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-700" /> Extracted Evidence Record Content
                </span>
                <div className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {evidence.content_snippet}
                </div>
              </div>

              {/* Provenance Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase block">Extraction Method:</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{evidence.extraction_method}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase block">Confidence Rating:</span>
                  <span className="font-semibold text-sky-800 mt-0.5 block">{Math.round(evidence.confidence * 100)}% Verified</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase block">Source URI / Vault Ref:</span>
                  <span className="font-mono text-slate-800 truncate block text-[11px] mt-0.5">{evidence.source_uri || 'Internal Vault Store'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase block">Recorded Timestamp:</span>
                  <span className="font-mono text-slate-800 text-[11px] mt-0.5 block">{new Date(evidence.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Cryptographic SHA-256 Box */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-sky-700" /> SHA-256 Cryptographic Signature
                  </span>
                  <button
                    onClick={copyHash}
                    className="text-xs text-sky-900 hover:text-sky-700 flex items-center gap-1.5 transition bg-white px-2.5 py-1 rounded border border-sky-300 font-medium shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-white rounded-lg font-mono text-[11px] text-sky-950 break-all border border-sky-200 select-all leading-relaxed">
                  {evidence.sha256_hash}
                </div>
              </div>

              {/* Tamper Verification Result */}
              {verificationResult && (
                <div className={`p-3.5 rounded-xl border transition-all animate-in fade-in ${
                  verificationResult.is_valid 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-red-50 border-red-300 text-red-950'
                }`}>
                  <div className="flex items-start gap-3">
                    {verificationResult.is_valid ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-xs">
                        {verificationResult.is_valid 
                          ? 'CRYPTOGRAPHIC INTEGRITY VERIFIED (0 Alterations)' 
                          : 'TAMPER ALERT: HASH SIGNATURE MISMATCH'}
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">
                        Computed hash matches the immutable audit ledger entry with zero bit variance.
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleVerifyTampering}
            disabled={isVerifying || !evidence}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Computing SHA-256 Digest...' : 'Verify Cryptographic Hash & Tamper Status'}</span>
          </button>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
