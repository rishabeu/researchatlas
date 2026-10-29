import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, Sparkles, AlertCircle, RefreshCw, CheckCircle, FileCode } from 'lucide-react';
import { extractTextFromPdf, ExtractionProgress } from '../utils/pdfExtractor';
import { DEMO_PAPERS, DemoPaperItem } from '../data/demoPapers';

interface PaperInputSectionProps {
  onAnalyze: (paperText: string, paperTitle?: string) => Promise<void>;
  onLoadDemoPaper: (demo: DemoPaperItem) => void;
  isLoading: boolean;
  statusMessage?: string;
  error?: string | null;
}

export const PaperInputSection: React.FC<PaperInputSectionProps> = ({
  onAnalyze,
  onLoadDemoPaper,
  isLoading,
  statusMessage,
  error,
}) => {
  const [activeMode, setActiveMode] = useState<'paste' | 'upload'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState<ExtractionProgress | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setLocalError(null);
    setExtractionProgress(null);

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setLocalError('Invalid format: Please provide a PDF academic paper.');
      return;
    }

    try {
      setPdfFileName(file.name);
      const result = await extractTextFromPdf(file, (progress) => {
        setExtractionProgress(progress);
      });

      setPastedText(result.text);
      if (!paperTitle) {
        // Use filename minus extension as suggested title
        setPaperTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setActiveMode('paste');
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setLocalError(err.message || 'Failed to extract text from PDF document.');
    } finally {
      setTimeout(() => setExtractionProgress(null), 1500);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmed = pastedText.trim();
    if (trimmed.length < 50) {
      setLocalError('Paper excerpt is too short. Please provide at least 50 characters of academic text.');
      return;
    }

    onAnalyze(trimmed, paperTitle.trim() || undefined);
  };

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full">
          <span>Doctoral-Grade Literature Synthesis & Rigor Engine</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100 text-balance leading-tight">
          Evidence-Grounded Research Paper Synthesis
        </h1>
        
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload PDFs or paste research excerpts. Automatically extract methodologies, verify empirical results, inspect Mermaid architectures, and synthesize student thesis blueprints with zero-hallucination discipline.
        </p>

        {/* Quick Demo Paper Launchers */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Instant Demo Papers:
          </span>
          {DEMO_PAPERS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => onLoadDemoPaper(demo)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0e1420] text-slate-300 hover:text-teal-300 hover:border-teal-500/40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>{demo.id === 'traffic-gnn' ? 'Metro Congestion GNN' : 'Tomato Blight CNN'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Input Container */}
      <div className="max-w-4xl mx-auto rounded-xl border border-slate-800 bg-[#0e1420] overflow-hidden shadow-2xl">
        {/* Input Mode Selector Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#090d15]">
          <div className="flex items-center gap-2 p-1 bg-[#0b0f17] border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveMode('paste')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'paste'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Paper Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Document</span>
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 hidden sm:block">
            {pastedText ? `${pastedText.length.toLocaleString()} characters` : 'Strict Evidence Protocol'}
          </div>
        </div>

        {/* Input Form Stage */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Paper Title (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
              Paper Title or Academic Identifier (Optional)
            </label>
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              placeholder="e.g. Attention-Driven Spatio-Temporal Graph Neural Networks for Transit Routing"
              disabled={isLoading}
              className="w-full bg-[#090d15] border border-slate-800 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {activeMode === 'paste' ? (
            /* Paste Paper Text Area */
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  Paper Content, Abstract & Methodology Excerpt
                </label>
                {pdfFileName && (
                  <span className="text-xs font-mono text-teal-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Extracted from {pdfFileName}
                  </span>
                )}
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full paper text or key sections (Title, Abstract, Methodology, Experiments, Results, and Discussion)..."
                rows={12}
                disabled={isLoading}
                className="w-full bg-[#090d15] border border-slate-800 rounded-lg p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 font-mono leading-relaxed focus:outline-none focus:border-teal-500 transition-colors resize-y"
              />
            </div>
          ) : (
            /* PDF Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-teal-400 bg-teal-500/5'
                  : 'border-slate-800 hover:border-slate-700 bg-[#090d15]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-400">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-base font-semibold text-slate-200 mb-1">
                Drop your research paper PDF here, or browse
              </h4>
              <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                PDF text is extracted in-browser with page-by-page progress reporting. Maximum file size: 25MB.
              </p>

              <span className="inline-block px-4 py-2 text-xs font-mono text-teal-300 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                Select .PDF Document
              </span>
            </div>
          )}

          {/* Extraction Progress Indicator */}
          {extractionProgress && (
            <div className="p-4 rounded-lg bg-[#090d15] border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-teal-300">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {extractionProgress.statusText}
                </span>
                <span>{extractionProgress.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-400 h-full transition-all duration-200"
                  style={{ width: `${extractionProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Error messages */}
          {(localError || error) && (
            <div className="p-4 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Analysis Exception:</span>
                <p>{localError || error}</p>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>Evidence protocol: Zero-hallucination extraction</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || pastedText.trim().length < 50}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-teal-900/20"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{statusMessage || 'Synthesizing with Gemini...'}</span>
                </>
              ) : (
                <>
                  <span>Begin Paper Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Trust & Methodology Features Row */}
      <div id="pipeline" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
            01. Epistemic Grounding
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Strict Unreported Flagging
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never invents unverified statistical p-values or baseline metrics. Absent sections are explicitly labeled.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
            02. Methodological Flow
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Automated Mermaid Diagrams
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Compiles algorithmic pipelines into clean, interactive Mermaid flowcharts with raw code export.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1420] space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
            03. Student Extension Blueprints
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Three Feasible Project Plans
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Graduated thesis projects (Beginner to Advanced) with required tech stacks and phased roadmaps.
          </p>
        </div>
      </div>
    </div>
  );
};
