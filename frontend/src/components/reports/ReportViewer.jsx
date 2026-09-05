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
  Fingerprint,
  Shield
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
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sky-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#003366] tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <span>Evidence-Backed Intelligence Dossier</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 pl-11">
            Section 13 & 23 Formatted Legal Dossier with Immutable Cryptographic Footnotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{isGenerating ? 'Compiling...' : 'Regenerate'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold rounded-lg border border-sky-300 flex items-center gap-2 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-sky-700" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {report && (
        <div className="p-6 sm:p-10 rounded-xl bg-white border border-slate-300 space-y-6 text-slate-800 shadow-sm print:border-none print:shadow-none">
          {/* Dossier Banner */}
          <div className="border-b-2 border-slate-300 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded text-xs font-bold bg-sky-100 text-sky-950 border border-sky-300 tracking-wide uppercase">
                CONFIDENTIAL • LAW ENFORCEMENT INTELLIGENCE DOSSIER
              </span>
              <span className="text-xs font-medium text-slate-600">
                Case Ref: <span className="text-slate-900 font-bold">{report.case_id}</span> • {new Date(report.generated_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#003366] tracking-tight">{report.title}</h1>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs flex items-center gap-2 text-slate-700">
              <Fingerprint className="w-4 h-4 text-sky-700 flex-shrink-0" />
              <span>SHA-256 Digest Signature: <span className="text-sky-900 font-semibold">{report.report_hash}</span></span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> 1. Executive Summary
            </h3>
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {report.executive_summary}
            </p>
          </div>

          {/* 2. Key Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> 2. Key Investigation Findings
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-700 pl-4 list-disc marker:text-sky-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {report.key_findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* 3. Discovered Path Conduits */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> 3. Discovered Network Conduits & Paths
            </h3>
            <div className="space-y-2">
              {report.discovered_paths.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-sky-50/50 border border-sky-200 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{p.path_name}</div>
                    <div className="font-mono text-sky-800 text-[11px]">{p.chain.join(' ➔ ')}</div>
                  </div>
                  <span className="font-mono text-xs text-sky-900 bg-white px-2.5 py-1 rounded border border-sky-200 font-bold">
                    {p.hops} Hops
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Financial Layering Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> 4. Financial Layering & Transit Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 text-[11px] block font-semibold">Total Flagged Domestic Inflow:</span>
                <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">{report.financial_analysis.total_flagged_inflow}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 text-[11px] block font-semibold">Total Transnational Outflow:</span>
                <span className="text-xl font-bold text-red-700 font-mono mt-1 block">{report.financial_analysis.total_flagged_outflow}</span>
              </div>
            </div>
          </div>

          {/* 5. Evidence Citations Table */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700" /> 5. Evidence Citations & Provenance Footnotes
            </h3>
            <div className="rounded-lg overflow-hidden border border-slate-300 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#004d80] text-white">
                  <tr>
                    <th className="p-3">Citation Ref</th>
                    <th className="p-3">Source Document</th>
                    <th className="p-3">Extracted Fact / Claim</th>
                    <th className="p-3">SHA-256 Hash Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.evidence_citations.map((c, idx) => (
                    <tr key={c.citation_id} className={`hover:bg-sky-50/50 cursor-pointer transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`} onClick={() => inspectEvidence(c.evidence_id)}>
                      <td className="p-3 font-mono font-bold text-sky-800">{c.citation_id}</td>
                      <td className="p-3 text-slate-900 font-semibold">{c.source_title}</td>
                      <td className="p-3 text-slate-700">{c.claim}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{c.hash_signature}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Ethical Guardrail Callout */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-xs space-y-1.5 text-amber-950">
            <div className="font-bold flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Section 17 Ethical Framework & Non-Guilt Principle:</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-amber-900 leading-relaxed text-[11px]">
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
