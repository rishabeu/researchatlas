import React from 'react';
import { PaperMethods } from '../../types';
import { Database, Cpu, Layers, GitCommit, Sigma } from 'lucide-react';

interface MethodsTabProps {
  methods: PaperMethods;
}

export const MethodsTab: React.FC<MethodsTabProps> = ({ methods }) => {
  return (
    <div className="space-y-8">
      {/* Comprehensive Methodological Narrative */}
      <div className="p-6 md:p-8 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-3">
          <Layers className="w-4 h-4 text-teal-400" />
          <span>Methodological Deep Dive</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-4 tracking-tight">
          System Architecture & Pipeline Mechanics
        </h3>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl">
          {methods.methodologicalBreakdown}
        </p>

        {/* Mathematical formulation */}
        {methods.mathematicalFormulation && (
          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              <Sigma className="w-4 h-4 text-teal-400" />
              <span>Mathematical Formulation & Objectives</span>
            </div>
            <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800 text-teal-200/90 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed">
              {methods.mathematicalFormulation}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-step Process Pipeline */}
      <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-6">
          <GitCommit className="w-4 h-4 text-teal-400" />
          <span>Step-by-Step Processing Pipeline</span>
        </div>

        <div className="space-y-4">
          {methods.pipelineSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="p-5 rounded-lg border border-slate-800/80 bg-[#090d15] flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono flex items-center justify-center font-bold">
                    {step.stepNumber}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-9">
                  {step.description}
                </p>
              </div>

              <div className="md:w-72 shrink-0 p-3 rounded bg-[#0b0f17] border border-slate-800/80 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500 block mb-1 uppercase tracking-wider">Tensor Transform</span>
                <span className="text-teal-300 block">{step.inputOutput}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Datasets vs Algorithmic Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datasets & Benchmarks */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            <Database className="w-4 h-4 text-teal-400" />
            <span>Datasets & Experimental Corpora</span>
          </div>

          <div className="space-y-4">
            {methods.datasetsAndBenchmarks.map((ds, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-semibold text-slate-100">{ds.name}</h5>
                  <span className="text-[11px] font-mono text-teal-400">
                    {ds.accessType || 'Access unspecified'}
                  </span>
                </div>
                {ds.sampleCount && (
                  <div className="text-xs font-mono text-slate-400">
                    Sample Volume: <span className="text-slate-200">{ds.sampleCount}</span>
                  </div>
                )}
                {ds.description && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {ds.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Core Architecture & Algorithms */}
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Architecture & Algorithmic Stack</span>
          </div>

          <div className="space-y-2.5">
            {methods.architectureAndAlgorithms.map((algo, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#090d15] border border-slate-800/80 flex items-center justify-between"
              >
                <span className="text-xs md:text-sm text-slate-200 font-mono">
                  {algo}
                </span>
                <span className="text-xs text-teal-400 font-mono">0{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
