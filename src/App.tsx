import React, { useState } from 'react';
import { Header } from './components/Header';
import { PaperInputSection } from './components/PaperInputSection';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { Footer } from './components/Footer';
import { PaperAnalysis } from './types';
import { DEMO_PAPERS, DemoPaperItem } from './data/demoPapers';

export default function App() {
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [rawPaperText, setRawPaperText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (paperText: string, paperTitle?: string) => {
    setIsLoading(true);
    setError(null);
    setStatusMessage('Reading paper text & initializing evidence extractor...');

    try {
      setStatusMessage('Extracting methodologies, metrics, and architecture with Gemini...');
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paperText,
          paperTitle,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      setStatusMessage('Validating empirical metrics and building Mermaid pipeline...');
      const data: PaperAnalysis = await response.json();

      setRawPaperText(paperText);
      setAnalysis(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err.message || 'An error occurred while analyzing the paper. Please verify the text or try one of the instant demo papers.'
      );
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const handleLoadDemoPaper = (demo: DemoPaperItem) => {
    setError(null);
    setRawPaperText(demo.rawText);
    setAnalysis(demo.analysis);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClear = () => {
    setAnalysis(null);
    setRawPaperText('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      <Header
        onLoadDemo={() => handleLoadDemoPaper(DEMO_PAPERS[0])}
        onNavigateHome={handleClear}
        hasAnalysis={Boolean(analysis)}
        onClear={handleClear}
      />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {analysis ? (
          <AnalysisWorkspace
            analysis={analysis}
            rawPaperText={rawPaperText}
            onClear={handleClear}
          />
        ) : (
          <PaperInputSection
            onAnalyze={handleAnalyze}
            onLoadDemoPaper={handleLoadDemoPaper}
            isLoading={isLoading}
            statusMessage={statusMessage}
            error={error}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
