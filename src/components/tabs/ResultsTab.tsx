import React from 'react';
import { PaperResults } from '../../types';
import { BarChart3, Quote, AlertCircle, TrendingUp, CheckCircle, Split } from 'lucide-react';

interface ResultsTabProps {
  results: PaperResults;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      {/* Benchmark Summary Header Card */}
      <div className="p-6 md:p-8 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <span>Empirical Performance Synthesis</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">
          Reported Experimental Benchmarks
        </h3>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl">
          {results.benchmarkSummary}
        </p>

        {/* Statistical Significance and Rigor Callout */}
        <div className="mt-6 p-4 rounded-lg bg-[#090d15] border border-slate-800 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
              Statistical Significance & Hypothesis Testing
            </span>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              {results.statisticalSignificance}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Supported Findings Table */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Verifiable Metric Registry (Strictly Paper-Supported)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {results.supportedFindings.length} Verified Measurements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Metric & Benchmark</th>
                <th className="py-3 px-4">Dataset / Condition</th>
                <th className="py-3 px-4 text-right">Reported Score</th>
                <th className="py-3 px-4">Baseline Comparison</th>
                <th className="py-3 px-4">Textual Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {results.supportedFindings.map((finding, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {finding.metric}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {finding.datasetOrCondition}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-teal-300 tabular-nums text-sm">
                    {finding.score}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {finding.baselineComparison || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 italic max-w-xs">
                    "{finding.quoteEvidence || 'Explicitly reported in experiment table'}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ablation Studies Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3">
          <Split className="w-4 h-4 text-teal-400" />
          <span>Ablation & Component Contribution Analysis</span>
        </div>
        <h4 className="text-base font-semibold text-slate-100 mb-2">
          Component Ablation Outcomes
        </h4>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {results.ablationStudyFindings}
        </p>
      </div>

      {/* Verbatim Author Quotes Registry */}
      {results.authorQuotes && results.authorQuotes.length > 0 && (
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            <Quote className="w-4 h-4 text-teal-400" />
            <span>Verbatim Document Grounding Quotes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.authorQuotes.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider block">
                    Claim: {q.claim}
                  </span>
                  <blockquote className="text-xs text-slate-200 mt-2 italic leading-relaxed">
                    "{q.verbatimQuote}"
                  </blockquote>
                </div>
                {q.sectionOrPage && (
                  <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    Section: {q.sectionOrPage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
