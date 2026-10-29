import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 py-10 px-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-teal-500/80"></span>
          <span className="font-semibold text-slate-400">ResearchAtlas AI</span>
          <span>·</span>
          <span>Academic Paper Analysis Engine</span>
        </div>

        <div className="flex items-center gap-6">
          <span>Zero-Hallucination Protocol</span>
          <span>·</span>
          <span>Strict Evidence Attribution</span>
          <span>·</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};
