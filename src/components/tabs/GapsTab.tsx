import React from 'react';
import { PaperResearchGaps } from '../../types';
import { AlertTriangle, HelpCircle, ShieldAlert, FileQuestion, Ban } from 'lucide-react';

interface GapsTabProps {
  researchGaps: PaperResearchGaps;
}

export const GapsTab: React.FC<GapsTabProps> = ({ researchGaps }) => {
  return (
    <div className="space-y-8">
      {/* Missing Source Sections Notification Card */}
      {researchGaps.missingSourceSections && researchGaps.missingSourceSections.length > 0 && (
        <div className="p-6 rounded-xl border border-amber-500/30 bg-[#16120d]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
            <FileQuestion className="w-4 h-4 text-amber-400" />
            <span>Epistemic Audit: Missing Sections in Source Excerpt</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mb-4 leading-relaxed">
            In accordance with zero-hallucination protocols, ResearchAtlas AI flags standard academic sections that are unverified, absent, or withheld in the analyzed paper:
          </p>

          <div className="space-y-2">
            {researchGaps.missingSourceSections.map((missing, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#0e0c08] border border-amber-500/20 text-xs text-amber-200/90 font-mono"
              >
                <Ban className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{missing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-Column Grid: Stated Limitations vs Unaddressed Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stated Limitations */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Author-Acknowledged Limitations</span>
          </div>

          <div className="space-y-3">
            {researchGaps.statedLimitations.map((lim, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed"
              >
                {lim}
              </div>
            ))}
          </div>
        </div>

        {/* Unaddressed Questions */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-4">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>Open & Unexplored Research Questions</span>
          </div>

          <div className="space-y-3">
            {researchGaps.unaddressedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed"
              >
                {q}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Assumptions & Biases vs Threats to Validity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implicit Assumptions & Biases */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Underlying Assumptions & Sampling Biases</span>
          </div>

          <div className="space-y-3">
            {researchGaps.assumptionsAndBiases.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Threats to Validity */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Threats to Validity (Internal / External / Construct)</span>
          </div>

          <div className="space-y-3">
            {researchGaps.threatsToValidity.map((threat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed"
              >
                {threat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
