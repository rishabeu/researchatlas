import React from 'react';
import { PaperAnalysis } from '../../types';
import { CheckCircle2, ShieldCheck, HelpCircle, FileText, Compass, Target, Lightbulb, Sparkles } from 'lucide-react';

interface OverviewTabProps {
  analysis: PaperAnalysis;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ analysis }) => {
  const { overview, paperMeta } = analysis;

  return (
    <div className="space-y-8">
      {/* Executive Summary Card */}
      <div className="p-6 md:p-8 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Plain-Language Synthesis</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight leading-snug mb-4">
          Core Research Summary
        </h3>
        <p className="text-base text-slate-300 leading-relaxed max-w-4xl">
          {overview.plainLanguageSummary}
        </p>

        {/* Practical Relevance callout */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
                Practical Application & Industry Impact
              </span>
              <p className="text-sm text-slate-200 mt-1">
                {overview.practicalRelevance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column Problem vs Contribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Bottleneck / Problem */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              <Target className="w-4 h-4 text-rose-400" />
              <span>Target Research Bottleneck</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-100 mb-3">
              The Fundamental Problem Addressed
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {overview.coreProblem}
            </p>
          </div>
        </div>

        {/* Key Theoretical or Empirical Contribution */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3">
              <Lightbulb className="w-4 h-4 text-teal-400" />
              <span>Primary Innovation Advance</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-100 mb-3">
              The Key Technical Contribution
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {overview.keyContribution}
            </p>
          </div>
        </div>
      </div>

      {/* Verified Empirical Key Findings */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Author-Verified Key Findings</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {overview.keyFindings.length} Verified Highlights
          </span>
        </div>

        <div className="space-y-3">
          {overview.keyFindings.map((finding, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-lg border border-slate-800/80 bg-[#090d15]"
            >
              <span className="text-xs font-mono text-teal-400/80 pt-0.5 shrink-0">
                0{idx + 1}.
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {finding}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Publication Readiness & Scientific Rigor Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Scientific Rigor & Reproducibility Audit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80">
            <span className="text-xs text-slate-400 font-mono block">Empirical Rigor</span>
            <span className="text-base font-semibold text-slate-100 mt-1 block">
              {overview.publicationReadiness.rigorScore}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80">
            <span className="text-xs text-slate-400 font-mono block">Code & Data Reproducibility</span>
            <span className="text-base font-semibold text-slate-100 mt-1 block">
              {overview.publicationReadiness.reproducibilityStatus}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80">
            <span className="text-xs text-slate-400 font-mono block">Statistical Transparency</span>
            <span className="text-base font-semibold text-slate-100 mt-1 block">
              {overview.publicationReadiness.statisticalReporting}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
