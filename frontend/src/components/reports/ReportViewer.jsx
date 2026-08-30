import React, { useState, useEffect } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { api } from '../../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  Fingerprint
} from 'lucide-react';

export default function ReportViewer() {
  const { activeCase, inspectEvidence, showToast } = useInvestigation();
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchReport = async () => {
    setIsGenerating(true);
    try {
      const data = await api.generateReport(activeCase.id);
      setReport(data);
      showToast('Investigation Intelligence Dossier compiled with evidence citations', 'success');
    } catch (e) {
      showToast('Failed to compile report: ' + e.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeCase]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const md = `# ${report.title}
Case: ${report.case_id}
Generated: ${new Date(report.generated_at).toLocaleString()}
SHA-256 Report Hash: ${report.report_hash}

## Executive Summary
${report.executive_summary}

## Key Findings
${report.key_findings.map(f => `- ${f}`).join('\n')}

## Discovered Conduits
${report.discovered_paths.map(p => `- ${p.path_name} (${p.hops} hops): ${p.chain.join(' -> ')}`).join('\n')}

## Financial Layering Analysis
- Total Flagged Inflow: ${report.financial_analysis.total_flagged_inflow}
- Total Flagged Outflow: ${report.financial_analysis.total_flagged_outflow}
- Shell Entities: ${report.financial_analysis.shell_entities_involved.join(', ')}

## Evidence Citations
${report.evidence_citations.map(c => `- [${c.citation_id}] ${c.source_title}: ${c.claim} (Hash: ${c.hash_signature})`).join('\n')}

## Ethical Limitations & Non-Guilt Principle
${report.limitations.map(l => `- ${l}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Investigation_Report_${report.case_id}.md`;
    a.click();
    showToast('Report downloaded as Markdown');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shadow-sm shadow-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <span>Evidence-Backed Intelligence Dossier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 pl-11">
            Section 13 & 23 Formatted Legal Dossier with Immutable Cryptographic Footnotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isGenerating ? 'Compiling...' : 'Regenerate'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold rounded-xl border border-cyan-900/60 flex items-center gap-2 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {report && (
        <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-slate-800 space-y-7 bg-slate-950/90 text-slate-200 print:bg-white print:text-black shadow-2xl">
          {/* Dossier Banner */}
          <div className="border-b border-slate-800 pb-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                CONFIDENTIAL LAW ENFORCEMENT DOSSIER
              </span>
              <span className="text-xs font-mono text-slate-400">
                Case Ref: <span className="text-slate-200 font-bold">{report.case_id}</span> • {new Date(report.generated_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{report.title}</h1>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs flex items-center gap-2 text-slate-400">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>SHA-256 Digest Signature: <span className="text-cyan-300 font-semibold">{report.report_hash}</span></span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 1. Executive Summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 font-sans bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              {report.executive_summary}
            </p>
          </div>

          {/* 2. Key Findings */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 2. Key Investigation Findings
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300 pl-4 list-disc marker:text-cyan-400 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              {report.key_findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* 3. Discovered Path Conduits */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 3. Discovered Network Conduits & Paths
            </h3>
            <div className="space-y-2">
              {report.discovered_paths.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{p.path_name}</div>
                    <div className="font-mono text-cyan-300 text-[11px]">{p.chain.join(' ➔ ')}</div>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-bold">
                    {p.hops} Hops
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Financial Layering Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 4. Financial Layering & Transit Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block font-mono uppercase">Total Flagged Domestic Inflow:</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono mt-1 block">{report.financial_analysis.total_flagged_inflow}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 text-[11px] block font-mono uppercase">Total Transnational Outflow:</span>
                <span className="text-xl font-extrabold text-red-400 font-mono mt-1 block">{report.financial_analysis.total_flagged_outflow}</span>
              </div>
            </div>
          </div>

          {/* 5. Evidence Citations Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> 5. Evidence Citations & Provenance Footnotes
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3.5">Citation Ref</th>
                    <th className="p-3.5">Source Artifact</th>
                    <th className="p-3.5">Extracted Fact / Claim</th>
                    <th className="p-3.5">SHA-256 Provenance Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.evidence_citations.map((c) => (
                    <tr key={c.citation_id} className="hover:bg-slate-800/40 cursor-pointer transition" onClick={() => inspectEvidence(c.evidence_id)}>
                      <td className="p-3.5 font-mono font-bold text-cyan-300">{c.citation_id}</td>
                      <td className="p-3.5 text-slate-200 font-semibold">{c.source_title}</td>
                      <td className="p-3.5 text-slate-300 font-sans">{c.claim}</td>
                      <td className="p-3.5 font-mono text-[10px] text-cyan-400">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{c.hash_signature}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Ethical Guardrail Callout */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/50 text-xs space-y-2 text-amber-200">
            <div className="font-bold flex items-center gap-2 text-sm text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Section 17 Ethical Framework & Non-Guilt Principle:</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-slate-300 leading-relaxed">
              {report.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
