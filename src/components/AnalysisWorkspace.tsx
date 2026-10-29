import React, { useState } from 'react';
import { PaperAnalysis } from '../types';
import { OverviewTab } from './tabs/OverviewTab';
import { MethodsTab } from './tabs/MethodsTab';
import { ResultsTab } from './tabs/ResultsTab';
import { GapsTab } from './tabs/GapsTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { MermaidViewer } from './MermaidViewer';
import { AskThePaper } from './AskThePaper';
import { exportAnalysisAsJson, exportAnalysisAsTxt } from '../utils/exportUtils';
import { Download, FileText, ArrowLeft, Clock, BookOpen, Layers, BarChart3, AlertTriangle, Terminal, GitBranch, MessageSquare, Sparkles } from 'lucide-react';

interface AnalysisWorkspaceProps {
  analysis: PaperAnalysis;
  rawPaperText?: string;
  onClear: () => void;
}

type TabKey = 'overview' | 'methods' | 'results' | 'gaps' | 'projects' | 'architecture' | 'ask';

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  analysis,
  rawPaperText,
  onClear,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const meta = analysis.paperMeta;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'methods', label: 'Methods', icon: <Layers className="w-4 h-4" /> },
    { key: 'results', label: 'Results', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'gaps', label: 'Research Gaps', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'projects', label: 'Project Ideas', icon: <Terminal className="w-4 h-4" /> },
    { key: 'architecture', label: 'Architecture', icon: <GitBranch className="w-4 h-4" /> },
    { key: 'ask', label: 'Ask the Paper', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].key);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].key);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Paper Header Ribbon */}
      <div className="p-6 md:p-8 rounded-xl border border-slate-800 bg-[#0e1420] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upload</span>
            </button>

            {analysis.isDemo && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-teal-500/30 bg-teal-500/10 text-teal-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                Verified Demo Excerpt
              </span>
            )}
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportAnalysisAsJson(analysis)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#090d15] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="Download structured JSON report"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => exportAnalysisAsTxt(analysis)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#090d15] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="Download comprehensive TXT executive briefing"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Export TXT</span>
            </button>
          </div>
        </div>

        {/* Paper Title & Metadata */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-100 text-balance leading-snug">
            {meta.title}
          </h2>

          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{meta.authors}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{meta.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{meta.field}</span>
            {meta.doiOrSource && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 truncate max-w-xs">{meta.doiOrSource}</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-teal-400">
              <Clock className="w-3 h-3" />
              ~{meta.readingTimeMinutes} min read
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation Controls */}
      <div className="border-b border-slate-800 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Paper Analysis Views"
          className="flex items-center gap-2 min-w-max pb-2"
        >
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                id={`tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/10 border border-teal-500/30 text-teal-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents Stage */}
      <main className="min-h-[450px]">
        {activeTab === 'overview' && (
          <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
            <OverviewTab analysis={analysis} />
          </div>
        )}

        {activeTab === 'methods' && (
          <div role="tabpanel" id="panel-methods" aria-labelledby="tab-methods">
            <MethodsTab methods={analysis.methods} />
          </div>
        )}

        {activeTab === 'results' && (
          <div role="tabpanel" id="panel-results" aria-labelledby="tab-results">
            <ResultsTab results={analysis.results} />
          </div>
        )}

        {activeTab === 'gaps' && (
          <div role="tabpanel" id="panel-gaps" aria-labelledby="tab-gaps">
            <GapsTab researchGaps={analysis.researchGaps} />
          </div>
        )}

        {activeTab === 'projects' && (
          <div role="tabpanel" id="panel-projects" aria-labelledby="tab-projects">
            <ProjectsTab projects={analysis.projectIdeas} />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div role="tabpanel" id="panel-architecture" aria-labelledby="tab-architecture">
            <MermaidViewer
              chart={analysis.architectureDiagram.mermaidGraph}
              explanation={analysis.architectureDiagram.diagramExplanation}
            />
          </div>
        )}

        {activeTab === 'ask' && (
          <div role="tabpanel" id="panel-ask" aria-labelledby="tab-ask">
            <AskThePaper analysis={analysis} rawPaperText={rawPaperText} />
          </div>
        )}
      </main>
    </div>
  );
};
