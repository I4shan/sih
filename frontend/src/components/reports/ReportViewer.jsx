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
  RotateCcw
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
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> Evidence-Backed Investigation Report
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standard Section 13 & 23 Formatted Dossier with Evidence Provenance Footnotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={isGenerating}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {isGenerating ? 'Compiling...' : 'Regenerate'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" /> Export Markdown
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-900/30"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {report && (
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-6 bg-slate-900/90 text-slate-200 print:bg-white print:text-black shadow-2xl">
          {/* Dossier Banner */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                CONFIDENTIAL LAW ENFORCEMENT DOSSIER
              </span>
              <span className="text-xs font-mono text-slate-400">
                Case Ref: {report.case_id} • {new Date(report.generated_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{report.title}</h1>
            <p className="text-xs font-mono text-slate-400">
              SHA-256 Report Integrity Signature: <span className="text-cyan-400">{report.report_hash}</span>
            </p>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              1. Executive Summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 font-sans">
              {report.executive_summary}
            </p>
          </div>

          {/* Key Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              2. Key Investigation Findings
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-300 pl-4 list-disc marker:text-cyan-400">
              {report.key_findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Discovered Path Conduits */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              3. Discovered Network Conduits & Paths
            </h3>
            <div className="space-y-2">
              {report.discovered_paths.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold text-white">{p.path_name}</div>
                    <div className="font-mono text-cyan-400 text-[11px]">{p.chain.join(' ➔ ')}</div>
                  </div>
                  <span className="font-mono text-xs text-slate-400">{p.hops} Hops</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Layering Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              4. Financial Layering & Transit Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block font-mono">Total Flagged Domestic Inflow:</span>
                <span className="text-base font-bold text-amber-400">{report.financial_analysis.total_flagged_inflow}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[11px] block font-mono">Total Transnational Outflow:</span>
                <span className="text-base font-bold text-red-400">{report.financial_analysis.total_flagged_outflow}</span>
              </div>
            </div>
          </div>

          {/* Evidence Citations Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> 5. Evidence Citations & Provenance Footnotes
            </h3>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="p-3">Citation Ref</th>
                    <th className="p-3">Source Artifact</th>
                    <th className="p-3">Extracted Fact / Claim</th>
                    <th className="p-3">Provenance Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.evidence_citations.map((c) => (
                    <tr key={c.citation_id} className="hover:bg-slate-800/40 cursor-pointer" onClick={() => inspectEvidence(c.evidence_id)}>
                      <td className="p-3 font-mono font-bold text-cyan-400">{c.citation_id}</td>
                      <td className="p-3 text-slate-200 font-medium">{c.source_title}</td>
                      <td className="p-3 text-slate-300">{c.claim}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{c.hash_signature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ethical Limitations & Non-Guilt Principle */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1.5 text-amber-300">
            <span className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Section 17 Ethical Framework & Core Principle:
            </span>
            <ul className="space-y-1 pl-4 list-disc text-slate-300">
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
