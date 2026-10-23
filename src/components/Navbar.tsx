import React from 'react';
import { Sparkles, DollarSign, Clock, Users, Plus, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'budget' | 'timeline' | 'vendors';
  setActiveTab: (tab: 'overview' | 'budget' | 'timeline' | 'vendors') => void;
  onOpenNewEventModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenSubmissionKit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewEventModal,
  onOpenAiDrawer,
  onOpenSubmissionKit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-3.5 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark in display face */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Aura<span className="text-amber-600">Celebrate</span>
          </a>
        </div>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'overview'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Theme & Concept</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'budget'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Budget Cockpit</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'timeline'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Run-of-Show & Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'vendors'
                ? 'text-amber-700 font-semibold border-b-2 border-amber-600'
                : 'hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Vendor Checklist</span>
          </button>

          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-1.5 text-stone-700 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>GenAI Advisor</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Submission Kit helper */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSubmissionKit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/80 rounded-lg border border-amber-300 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Open Hack2skill AI Evaluation & Submission Kit"
          >
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>AI Score Kit</span>
          </button>

          <button
            onClick={onOpenNewEventModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan Celebration</span>
          </button>
        </div>
      </div>
    </header>
  );
};
