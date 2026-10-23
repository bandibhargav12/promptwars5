import React, { useState } from 'react';
import { CelebrationEvent } from '../types/event';
import { Calendar, MapPin, Users, DollarSign, ChevronDown, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateBudgetSummary, formatCurrency } from '../utils/budgetCalculations';

interface EventHeaderProps {
  currentEvent: CelebrationEvent;
  allEvents: CelebrationEvent[];
  onSelectEvent: (event: CelebrationEvent) => void;
  onOpenNewEventModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenExportModal: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  currentEvent,
  allEvents,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenAiDrawer,
  onOpenExportModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Calculate high-level stats using pure utility
  const budgetSummary = calculateBudgetSummary(
    currentEvent.budget.categories,
    currentEvent.totalBudget
  );

  const eventTypeLabel = {
    wedding: 'Wedding Celebration',
    birthday: 'Milestone Birthday',
    community: 'Community Gathering',
    custom: 'Custom Celebration',
  }[currentEvent.type];

  return (
    <section className="relative bg-white border-b border-stone-200/80 mb-6">
      {/* Visual Hero Banner with Measured Scrim and Fallback */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-stone-900">
        {currentEvent.heroImage ? (
          <img
            src={currentEvent.heroImage}
            alt={currentEvent.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              // Graceful fallback to styled neutral gradient
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 flex items-center justify-center">
            <span className="text-amber-200/40 text-lg font-serif tracking-widest uppercase">
              {currentEvent.theme?.title || 'Celebration Master Plan'}
            </span>
          </div>
        )}

        {/* Gradient Scrim for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

        {/* Floating Top Controls over Banner */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between no-print">
          {/* Event Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Select Event Blueprint"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/20 transition-all cursor-pointer"
            >
              <span className="text-amber-400 font-semibold">{eventTypeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Select Event Blueprint
                </div>
                {allEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      onSelectEvent(ev);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                      ev.id === currentEvent.id
                        ? 'bg-amber-50/70 text-amber-900 font-semibold'
                        : 'text-stone-700'
                    }`}
                  >
                    <span className="truncate">{ev.title}</span>
                    {ev.id === currentEvent.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </button>
                ))}
                <div className="border-t border-stone-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewEventModal();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-amber-700 hover:bg-amber-50/60 font-medium"
                  >
                    + Create New AI Event Plan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAiDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/90 hover:bg-amber-500 text-stone-950 text-xs font-semibold rounded-lg shadow-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask GenAI</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Master Plan</span>
            </button>
          </div>
        </div>

        {/* Banner Content (Bottom aligned) */}
        <div className="absolute bottom-5 left-6 right-6 text-white max-w-7xl mx-auto">
          {/* Zero-Pill Metadata Header */}
          <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium tracking-wide mb-1.5">
            <span>{eventTypeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>Created with Gemini AI</span>
            <span aria-hidden="true">·</span>
            <span>{currentEvent.theme?.title || 'Bespoke Theme'}</span>
          </div>

          <h1
            className="text-2xl md:text-3.5xl font-bold tracking-tight text-white mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {currentEvent.title}
          </h1>

          <p className="text-xs md:text-sm text-stone-200/90 max-w-3xl line-clamp-1 font-light">
            {currentEvent.styleVibe}
          </p>
        </div>
      </div>

      {/* KPI & Metric Strip (Full-width row below hero banner) */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          {/* Metric 1: Date & Time */}
          <div className="flex items-center gap-3 md:pr-4">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Event Date</div>
              <div className="text-xs md:text-sm font-semibold text-stone-900 font-mono tabular-nums">
                {currentEvent.date}
              </div>
            </div>
          </div>

          {/* Metric 2: Location & Guests */}
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-[11px] text-stone-500 font-medium">Venue & Location</div>
              <div className="text-xs md:text-sm font-semibold text-stone-900 truncate">
                {currentEvent.location}
              </div>
            </div>
          </div>

          {/* Metric 3: Guest Count */}
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-4">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Guest Count</div>
              <div className="text-xs md:text-sm font-semibold text-stone-900 font-mono tabular-nums">
                {currentEvent.guestCount} Attendees
              </div>
            </div>
          </div>

          {/* Metric 4: Target Budget & Actual Spent */}
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-stone-500 font-medium">Budget Tracked</div>
              <div className="text-xs md:text-sm font-semibold text-stone-900 font-mono tabular-nums">
                {formatCurrency(budgetSummary.totalActual, currentEvent.currency)} /{' '}
                {formatCurrency(currentEvent.totalBudget, currentEvent.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
