import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle, Quote, RefreshCw } from 'lucide-react';
import { PaperAnalysis, QnAMessage } from '../types';

interface AskThePaperProps {
  analysis: PaperAnalysis;
  rawPaperText?: string;
}

export const AskThePaper: React.FC<AskThePaperProps> = ({ analysis, rawPaperText }) => {
  const [messages, setMessages] = useState<QnAMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I am your evidence-grounded research assistant for "${analysis.paperMeta.title}". You can ask any question regarding datasets, benchmark scores, ablation details, mathematical equations, or acknowledged limitations. If a detail is missing from the paper, I will explicitly note: [NOT REPORTED IN PAPER].`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedQuestions = [
    'What baseline algorithms were evaluated against this model?',
    'What are the primary hardware or compute requirements reported?',
    'What happens when the key proposed module is ablated?',
    'What explicit limitations or unmodeled variables do the authors state?',
    'Is the source code or dataset publicly accessible?',
  ];

  const handleAsk = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: QnAMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      // In demo mode or offline fallback, handle common questions gracefully if server fails or is offline
      const contextText = rawPaperText || analysis.rawTextExcerpt || '';
      
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          paperText: contextText,
          paperTitle: analysis.paperMeta.title,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: QnAMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Q&A error:', err);
      // Fallback response for demo or offline testing
      if (analysis.isDemo) {
        let simulatedAnswer = '';
        const lowerQ = trimmed.toLowerCase();
        if (lowerQ.includes('baseline')) {
          simulatedAnswer = `Based strictly on the paper, the evaluated baselines include:\n\n• **Historical Average (HA)**: 60-min MAE 27.60\n• **Vector Auto-Regression (VAR)**: 60-min MAE 24.12\n• **DCRNN (Li et al., 2018)**: 60-min MAE 20.76\n• **STGCN (Yu et al., 2018)**: 60-min MAE 19.98\n• **Graph WaveNet (Wu et al., 2019)**: 60-min MAE 19.12\n\nThe proposed model achieves 18.42 MAE, reducing error by 11.3% over DCRNN.`;
        } else if (lowerQ.includes('ablat')) {
          simulatedAnswer = `The authors conducted an explicit ablation study evaluating the dynamic temporal matrix:\n\n> "relying solely on a learned static matrix degrades the 60-min MAE from 18.42 to 22.15"\n\nThis represents a **20.2% error inflation**, demonstrating that static railway tracks cannot capture dynamic commuter rerouting during rush hours.`;
        } else if (lowerQ.includes('code') || lowerQ.includes('dataset') || lowerQ.includes('github')) {
          simulatedAnswer = `The datasets (SZ-Metro and SH-Metro) are cited from municipal open research releases. However, a public open-source GitHub code repository link is **[NOT REPORTED IN PAPER]**.`;
        } else if (lowerQ.includes('hardware') || lowerQ.includes('compute') || lowerQ.includes('gpu')) {
          simulatedAnswer = `The paper reports training end-to-end on **4x NVIDIA A100 GPUs** using AdamW optimizer (learning rate 0.001) over 120 epochs. However, exact VRAM consumption per epoch is **[NOT REPORTED IN PAPER]**.`;
        } else {
          simulatedAnswer = `Based strictly on the text of "${analysis.paperMeta.title}":\n\n${analysis.overview.plainLanguageSummary}\n\n*Core finding*: ${analysis.overview.keyFindings[0]}\n\nIf you asked about external variables: Meteorological factors and live municipal event calendars are explicitly noted as **[NOT REPORTED IN PAPER]** due to unintegrated external APIs.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: simulatedAnswer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setError(err.message || 'Failed to receive answer from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and ground rules */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-[#0e1420]">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            Interactive Document Q&A
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Questions are answered with strict evidence grounding. Unreported variables are explicitly flagged.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>Grounded in: {analysis.paperMeta.title.slice(0, 36)}...</span>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="space-y-2">
        <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
          Suggested Grounded Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="text-left text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0c121d] text-slate-300 hover:text-teal-300 hover:border-teal-500/30 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasUnreported = msg.content.includes('[NOT REPORTED IN PAPER]');

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600/20 border border-teal-500/30 text-teal-100'
                    : 'bg-[#0e1420] border border-slate-800 text-slate-200'
                }`}
              >
                {/* Unreported badge */}
                {hasUnreported && (
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Evidence Boundary: Unreported detail noted</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{isUser ? 'You' : 'ResearchAtlas Engine'}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono text-slate-300">
                  U
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
              <RefreshCw className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-[#0e1420] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span>Querying paper evidence & citing relevant sections...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question grounded in this paper (e.g. baseline comparisons, p-values, failure modes)..."
          disabled={loading}
          className="flex-1 bg-[#090d15] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
