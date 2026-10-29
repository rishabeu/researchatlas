import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface HeaderProps {
  onLoadDemo: () => void;
  onNavigateHome: () => void;
  hasAnalysis: boolean;
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadDemo, onNavigateHome, hasAnalysis, onClear }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-[#090d15]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={onNavigateHome}
        className="text-lg font-bold tracking-tight text-slate-100 hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-teal-400"></span>
        <span>ResearchAtlas AI</span>
      </button>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={onNavigateHome}
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Synthesis
        </button>
        <a
          href="#pipeline"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Pipeline
        </a>
        <a
          href="#benchmarks"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Benchmarks
        </a>
        <a
          href="#documentation"
          className="hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          Protocol
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {hasAnalysis ? (
          <button
            onClick={onClear}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Paper
          </button>
        ) : (
          <button
            onClick={onLoadDemo}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Paper</span>
          </button>
        )}
      </div>
    </header>
  );
};
