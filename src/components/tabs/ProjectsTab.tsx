import React, { useState } from 'react';
import { StudentProjectIdea, DifficultyLevel } from '../../types';
import { Code, Clock, Layers, AlertCircle, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';

interface ProjectsTabProps {
  projects: StudentProjectIdea[];
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');

  const filteredProjects = selectedDifficulty === 'All'
    ? projects
    : projects.filter((p) => p.difficulty === selectedDifficulty);

  const getDifficultyBadge = (level: DifficultyLevel) => {
    switch (level) {
      case 'Beginner':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Intermediate':
        return 'text-teal-400 border-teal-500/30 bg-teal-500/10';
      case 'Advanced':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-400 mb-1">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span>Curated Academic Extension Blueprints</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">
            Student Research Project Blueprints
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Three graduated extensions designed for thesis projects, capstones, and independent research.
          </p>
        </div>

        {/* Interactive Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-[#090d15] border border-slate-800 rounded-lg shrink-0">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedDifficulty === lvl
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards List */}
      <div className="space-y-6">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id || idx}
            className="p-6 md:p-8 rounded-xl border border-slate-800 bg-[#0e1420] space-y-6 transition-colors hover:border-slate-700"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${getDifficultyBadge(project.difficulty)}`}>
                  {project.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Estimated: {project.durationWeeks}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Blueprint 0{idx + 1}
              </span>
            </div>

            {/* Title & Problem statement */}
            <div>
              <h4 className="text-lg md:text-xl font-bold text-slate-100 mb-2">
                {project.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            {/* Prerequisite Stack */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Prerequisite Technology Stack & Libraries
              </span>
              <div className="flex flex-wrap gap-2">
                {project.prerequisiteStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded bg-[#090d15] border border-slate-800 text-xs font-mono text-teal-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Implementation Roadmap */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                Phased Implementation Roadmap
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.implementationPlan.map((phase, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-teal-400 mb-1">
                        <span>Phase {pIdx + 1}</span>
                        <span>{phase.weekRange}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-200 mb-1">
                        {phase.phase}
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Outcome & Pitfalls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Expected Deliverable & Outcome</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {project.expectedOutcome}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#090d15] border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Technical Risks & Pitfall Mitigations</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {project.potentialPitfalls}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
