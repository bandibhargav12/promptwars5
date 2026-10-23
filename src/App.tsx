import React, { useState, useEffect } from 'react';
import { CelebrationEvent } from './types/event';
import { PRESET_EVENTS } from './data/presetEvents';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { ThemeStudio } from './components/ThemeStudio';
import { BudgetCockpit } from './components/BudgetCockpit';
import { TimelineMatrix } from './components/TimelineMatrix';
import { VendorBoard } from './components/VendorBoard';
import { EventWizardModal } from './components/EventWizardModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ExportModal } from './components/ExportModal';
import { SubmissionAssistantModal } from './components/SubmissionAssistantModal';

const STORAGE_KEY = 'auracelebrate_events_v1';

export default function App() {
  // Initialize events from localStorage or presets
  const [events, setEvents] = useState<CelebrationEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage events, using presets');
    }
    return PRESET_EVENTS;
  });

  const [currentEventId, setCurrentEventId] = useState<string>(() => {
    return events[0]?.id || PRESET_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors'>('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSubmissionKitOpen, setIsSubmissionKitOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to localStorage', e);
    }
  }, [events]);

  const currentEvent =
    events.find((e) => e.id === currentEventId) || events[0] || PRESET_EVENTS[0];

  // Update current event
  const handleUpdateEvent = (updated: CelebrationEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  // Add new event
  const handleEventCreated = (newEvent: CelebrationEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
    setActiveTab('overview');
  };

  // Import event
  const handleImportEvent = (importedEvent: CelebrationEvent) => {
    setEvents((prev) => [importedEvent, ...prev]);
    setCurrentEventId(importedEvent.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewEventModal={() => setIsWizardOpen(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenSubmissionKit={() => setIsSubmissionKitOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Active Celebration Header Banner & Metrics */}
        <EventHeader
          currentEvent={currentEvent}
          allEvents={events}
          onSelectEvent={(ev) => setCurrentEventId(ev.id)}
          onOpenNewEventModal={() => setIsWizardOpen(true)}
          onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        {/* Tab View Container */}
        <div className="max-w-7xl mx-auto px-6 pb-20 no-print">
          {activeTab === 'overview' && (
            <ThemeStudio
              currentEvent={currentEvent}
              onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetCockpit
              currentEvent={currentEvent}
              onUpdateEvent={handleUpdateEvent}
              onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineMatrix
              currentEvent={currentEvent}
              onUpdateEvent={handleUpdateEvent}
              onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorBoard
              currentEvent={currentEvent}
              onUpdateEvent={handleUpdateEvent}
              onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            />
          )}
        </div>

        {/* PRINTABLE MASTER PACKET (Visible strictly during Print) */}
        <div className="hidden print:block p-8 space-y-6 text-black bg-white">
          <div className="border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold">{currentEvent.title}</h1>
            <div className="text-sm text-stone-600 mt-1">
              Date: {currentEvent.date} · Location: {currentEvent.location} · Guests: {currentEvent.guestCount} · Budget: ${currentEvent.totalBudget.toLocaleString()} {currentEvent.currency}
            </div>
            <p className="text-xs text-stone-500 mt-2 italic">
              {currentEvent.styleVibe}
            </p>
          </div>

          {/* Theme & Concept */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-wider border-b pb-1">
              Creative Concept & Theme
            </h2>
            <div className="text-sm font-semibold">{currentEvent.theme?.title}</div>
            <p className="text-xs">{currentEvent.theme?.aesthetic}</p>
            <p className="text-xs text-stone-700">{currentEvent.theme?.atmosphere}</p>
          </section>

          {/* Run of show day-of */}
          <section className="space-y-2 pt-4">
            <h2 className="text-xl font-bold uppercase tracking-wider border-b pb-1">
              Day-of Run of Show
            </h2>
            <table className="w-full text-left text-xs border border-stone-300">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300">
                  <th className="p-2">Time</th>
                  <th className="p-2">Activity</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Lead</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {currentEvent.timeline.dayOfSchedule.map((item) => (
                  <tr key={item.id} className="border-b border-stone-200">
                    <td className="p-2 font-mono font-bold">{item.time}</td>
                    <td className="p-2 font-semibold">{item.activity}</td>
                    <td className="p-2">{item.location}</td>
                    <td className="p-2">{item.leadPerson}</td>
                    <td className="p-2 text-stone-600">{item.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Budget Ledger */}
          <section className="space-y-2 pt-4 page-break-before">
            <h2 className="text-xl font-bold uppercase tracking-wider border-b pb-1">
              Itemized Budget Ledger
            </h2>
            <table className="w-full text-left text-xs border border-stone-300">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-300">
                  <th className="p-2">Category</th>
                  <th className="p-2">Item</th>
                  <th className="p-2 text-right">Estimate</th>
                  <th className="p-2 text-right">Actual Cost</th>
                  <th className="p-2 text-center">Paid</th>
                </tr>
              </thead>
              <tbody>
                {currentEvent.budget.categories.flatMap((cat) =>
                  cat.items.map((item) => (
                    <tr key={item.id} className="border-b border-stone-200">
                      <td className="p-2 text-stone-600">{cat.name}</td>
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-right font-mono">${item.estimatedCost.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono">${item.actualCost.toLocaleString()}</td>
                      <td className="p-2 text-center">{item.paid ? 'YES' : 'PENDING'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Vendors */}
          <section className="space-y-2 pt-4">
            <h2 className="text-xl font-bold uppercase tracking-wider border-b pb-1">
              Vendors & Contract Directory
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {currentEvent.vendors.map((v) => (
                <div key={v.id} className="border border-stone-300 p-2.5 rounded">
                  <div className="font-bold text-sm">{v.name} ({v.category})</div>
                  <div>Status: {v.status} · Quote: ${v.quoteAmount.toLocaleString()}</div>
                  <div className="text-stone-600">Contact: {v.contact}</div>
                  {v.notes && <div className="text-stone-500 mt-1 italic">{v.notes}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Interactive Modals and Side Drawer */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onEventCreated={handleEventCreated}
      />

      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currentEvent={currentEvent}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentEvent={currentEvent}
        onImportEvent={handleImportEvent}
      />

      <SubmissionAssistantModal
        isOpen={isSubmissionKitOpen}
        onClose={() => setIsSubmissionKitOpen(false)}
      />

      {/* Quiet, Human-Designed Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-400 no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-stone-500">
            AuraCelebrate · Intelligent Celebration & Event Planning
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setIsSubmissionKitOpen(true)}
              className="hover:text-amber-700 transition-colors cursor-pointer"
            >
              Evaluation Score Kit
            </button>
            <span>·</span>
            <span>Powered by Google Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
