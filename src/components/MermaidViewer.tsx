import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, AlertCircle, Code, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  explanation?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, explanation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showRawSource, setShowRawSource] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  // Initialize mermaid configuration once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0b0f17',
        primaryColor: '#0f766e',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#14b8a6',
        lineColor: '#475569',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
      },
      securityLevel: 'loose',
    });
  }, []);

  const renderChart = async () => {
    if (!chart) return;
    setIsRendering(true);
    setError(null);

    // Sanitize common LLM quirks: remove markdown fences if present
    let cleanCode = chart.trim();
    if (cleanCode.startsWith('```mermaid')) {
      cleanCode = cleanCode.replace(/^```mermaid\s*/i, '').replace(/\s*```$/, '');
    } else if (cleanCode.startsWith('```')) {
      cleanCode = cleanCode.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const renderId = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaid.render(renderId, cleanCode);
      setSvgHtml(svg);
      setError(null);
    } catch (err: any) {
      console.warn('Mermaid rendering error:', err);
      setError(err?.message || 'Failed to render flowchart. Showing raw Mermaid specification.');
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    renderChart();
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.6, prev + delta), 2.0));
  };

  const resetZoom = () => setZoomLevel(1);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0e1420] overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-slate-800 bg-[#090d15]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-wider text-teal-400 font-semibold">
            Architectural Pipeline Flow
          </span>
          {isRendering && (
            <span className="text-xs text-slate-400 animate-pulse">Rendering diagram...</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          {!error && !showRawSource && (
            <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-900/60">
              <button
                onClick={() => handleZoom(-0.15)}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:text-white"
                title="Reset Zoom"
                aria-label="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => handleZoom(0.15)}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Toggle between diagram and raw code */}
          <button
            onClick={() => setShowRawSource((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              showRawSource
                ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showRawSource ? 'View Diagram' : 'Source Code'}</span>
          </button>

          {/* Copy Mermaid Source */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Copy Mermaid source to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-teal-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Diagram Stage or Fallback */}
      <div className="p-6 overflow-x-auto min-h-[340px] flex items-center justify-center bg-[#070b12]/50">
        {showRawSource ? (
          <div className="w-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>Mermaid Specification (graph TD)</span>
              <span>UTF-8 Plaintext</span>
            </div>
            <pre className="p-4 rounded-lg bg-[#080d17] border border-slate-800 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed selection:bg-teal-500/30">
              {chart}
            </pre>
          </div>
        ) : error ? (
          <div className="w-full max-w-2xl py-6">
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-amber-200">
                    Mermaid Rendering Notice
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The diagram engine encountered a syntax discrepancy in the generated model nodes. The raw Mermaid specification is shown below for inspection and copy.
                  </p>
                </div>
              </div>
            </div>

            <pre className="p-4 rounded-lg bg-[#080d17] border border-slate-800 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {chart}
            </pre>

            <div className="mt-3 flex justify-end">
              <button
                onClick={renderChart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Rendering
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full transition-transform duration-150 ease-out flex justify-center mermaid-svg-container"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}
      </div>

      {/* Diagram Explanation Footer */}
      {explanation && (
        <div className="px-6 py-4 border-t border-slate-800/80 bg-[#0a0e18]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-1.5">
            Architectural Walkthrough
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
