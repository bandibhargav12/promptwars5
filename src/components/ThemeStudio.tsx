/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CelebrationEvent } from '../types/event';
import { Copy, Check, Sparkles, Music, Palette, Compass, MessageSquareQuote, Lightbulb } from 'lucide-react';

interface ThemeStudioProps {
  currentEvent: CelebrationEvent;
  onOpenAiDrawer: () => void;
}

export const ThemeStudio: React.FC<ThemeStudioProps> = ({ currentEvent, onOpenAiDrawer }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const theme = currentEvent.theme;

  const handleCopyHex = (hex: string): void => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyInvite = (): void => {
    if (theme?.invitationWording) {
      navigator.clipboard.writeText(theme.invitationWording);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Creative Concept & Aesthetic Blueprint
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            Sensory atmosphere, color harmony, spatial decor, and invitation storytelling.
          </p>
        </div>

        <button
          onClick={onOpenAiDrawer}
          aria-label="Refine theme with AI consultant"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/60 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Refine Theme with AI</span>
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Concept & Sensory Vibe */}
        <div className="lg:col-span-7 space-y-6">
          {/* Aesthetic & Atmosphere Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase mb-3">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Theme Identity & Aesthetic</span>
            </div>

            <h3
              className="text-xl font-bold text-stone-900 mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {theme?.title || 'Atmospheric Celebration'}
            </h3>

            <p className="text-sm text-stone-700 leading-relaxed font-normal mb-4">
              {theme?.aesthetic}
            </p>

            <div className="pt-4 border-t border-stone-100">
              <div className="text-xs font-semibold text-stone-900 mb-1.5">
                Sensory & Lighting Atmosphere
              </div>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                {theme?.atmosphere}
              </p>
            </div>
          </div>

          {/* Decor Concept & Styling */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase mb-3">
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Spatial Decor & Botanical Styling</span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {theme?.decorConcept}
            </p>
          </div>

          {/* Music & Trajectory */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase mb-3">
              <Music className="w-4 h-4 text-amber-600" />
              <span>Soundtrack & Acoustic Trajectory</span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed font-normal">
              {theme?.musicStyle}
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Color Palette & Invitation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Color Palette Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-amber-800 tracking-wide uppercase">
                Color Palette & Swatches
              </div>
              <span className="text-[11px] text-stone-400">Click to copy hex</span>
            </div>

            <div className="space-y-3">
              {theme?.colorPalette?.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyHex(color.hex)}
                  aria-label={`Copy color ${color.name} hex code ${color.hex}`}
                  className="w-full group flex items-center justify-between p-2.5 rounded-lg border border-stone-100 hover:border-amber-300 hover:bg-stone-50/60 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-md shadow-inner border border-black/10 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                        {color.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono tabular-nums">
                        {color.hex}
                      </div>
                    </div>
                  </div>

                  <div className="text-stone-400 group-hover:text-stone-600">
                    {copiedHex === color.hex ? (
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Invitation Wording Card */}
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase">
                <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                <span>Invitation Wording</span>
              </div>
              <button
                onClick={handleCopyInvite}
                aria-label="Copy invitation draft wording"
                className="text-stone-500 hover:text-stone-800 transition-colors p-1 cursor-pointer"
                title="Copy wording"
              >
                {copiedInvite ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-stone-50/70 border border-stone-200/60 font-serif italic text-stone-700 text-sm leading-relaxed">
              "{theme?.invitationWording}"
            </div>
          </div>

          {/* Curated Logistical Tips */}
          {currentEvent.personalizedTips && currentEvent.personalizedTips.length > 0 && (
            <div className="bg-amber-50/50 rounded-xl border border-amber-200/60 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 tracking-wide uppercase mb-3">
                <Lightbulb className="w-4 h-4 text-amber-700" />
                <span>Advisor Insight & Tips</span>
              </div>

              <ul className="space-y-2.5 text-xs md:text-sm text-stone-700">
                {currentEvent.personalizedTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
