import React, { useState } from 'react';
import { CelebrationEvent } from '../types/event';
import { Sparkles, X, Send, Copy, Check, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: CelebrationEvent;
}

interface AiRecommendation {
  title: string;
  description: string;
  impact?: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentEvent,
}) => {
  const [prompt, setPrompt] = useState('');
  const [section, setSection] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    recommendations: AiRecommendation[];
    summaryNotes?: string;
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: 'Trim Catering Costs',
      prompt: 'Suggest 4 specific, creative ways to trim catering and beverage costs without making guests feel shortchanged.',
      sec: 'Budget',
    },
    {
      label: 'Speech & Toast Schedule',
      prompt: 'Draft an engaging 15-minute toast and speech schedule with speaker order, time limits, and musical transition cues.',
      sec: 'Timeline',
    },
    {
      label: 'Photographer Screening Questions',
      prompt: 'Generate 5 high-impact screening questions to ask our prospective photographer regarding lighting, backup gear, and turnaround.',
      sec: 'Vendors',
    },
    {
      label: 'Rain Contingency Plan',
      prompt: 'Formulate an actionable rainy-day contingency protocol including tent flip timings, guest umbrellas, and photography adjustments.',
      sec: 'Overview',
    },
    {
      label: 'Interactive Guest Moments',
      prompt: 'Suggest 3 bespoke interactive guest experience stations (e.g. audio guestbook, custom perfume bar, vinyl record signing) matching this theme.',
      sec: 'Theme',
    },
  ];

  const handleAsk = async (userPrompt: string, secName = 'General') => {
    if (!userPrompt.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setResults(null);

    try {
      const response = await fetch('/api/ai/refine-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventContext: {
            title: currentEvent.title,
            type: currentEvent.type,
            guestCount: currentEvent.guestCount,
            totalBudget: currentEvent.totalBudget,
            currency: currentEvent.currency,
          },
          sectionName: secName,
          instruction: userPrompt,
        }),
      });

      const data = await response.json();
      if (!data.success || !data.result) {
        throw new Error(data.error || 'Failed to generate recommendations.');
      }

      setResults(data.result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Could not fetch AI suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                GenAI Planning Consultant
              </h3>
              <p className="text-[11px] text-stone-500 truncate max-w-xs">
                Context: {currentEvent.title} ({currentEvent.guestCount} guests)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Prompts Section */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Recommended Event Consultations</span>
            </div>
            <div className="space-y-1.5">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(item.prompt);
                    handleAsk(item.prompt, item.sec);
                  }}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-amber-400 hover:bg-amber-50/40 text-xs transition-all flex items-center justify-between group"
                >
                  <span className="font-medium text-stone-800 group-hover:text-amber-900">
                    {item.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-7 h-7 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500">
                Consulting Gemini on event logistics...
              </p>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="space-y-4 animate-in fade-in">
              {results.summaryNotes && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
                  {results.summaryNotes}
                </div>
              )}

              <div className="space-y-3">
                {results.recommendations.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-stone-900">
                        {rec.title}
                      </h4>
                      <button
                        onClick={() =>
                          handleCopy(
                            `${rec.title}\n${rec.description}${
                              rec.impact ? `\nImpact: ${rec.impact}` : ''
                            }`,
                            rIdx
                          )
                        }
                        className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
                        title="Copy recommendation"
                      >
                        {copiedIndex === rIdx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rec.description}
                    </p>

                    {rec.impact && (
                      <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                        {rec.impact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Prompt Input */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(prompt, 'Custom');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. Suggest a signature mocktail...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="p-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
