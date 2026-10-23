/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CelebrationEvent, MilestoneItem, DayOfScheduleItem } from '../types/event';
import { Clock, Calendar, Plus, CheckCircle2, Circle, MapPin, User, Sparkles, Filter } from 'lucide-react';
import { sortDayOfSchedule, calculateMilestoneProgress } from '../utils/timelineUtils';

interface TimelineMatrixProps {
  currentEvent: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onOpenAiDrawer: () => void;
}

export const TimelineMatrix: React.FC<TimelineMatrixProps> = ({
  currentEvent,
  onUpdateEvent,
  onOpenAiDrawer,
}) => {
  const [subView, setSubView] = useState<'dayOf' | 'milestones'>('dayOf');
  const [searchFilter, setSearchFilter] = useState('');

  // Add Day-of Schedule state
  const [isAddingDayOf, setIsAddingDayOf] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLead, setNewLead] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Add Milestone state
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newTimeframe, setNewTimeframe] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  // Progress metrics from utility
  const milestoneProgress = calculateMilestoneProgress(currentEvent.timeline.milestones);

  // Toggle milestone completion
  const handleToggleMilestone = (id: string): void => {
    const updatedMilestones = currentEvent.timeline.milestones.map((m) => {
      if (m.id === id) return { ...m, completed: !m.completed };
      return m;
    });

    onUpdateEvent({
      ...currentEvent,
      timeline: {
        ...currentEvent.timeline,
        milestones: updatedMilestones,
      },
    });
  };

  // Toggle day-of activity completion
  const handleToggleDayOf = (id: string): void => {
    const updatedDayOf = currentEvent.timeline.dayOfSchedule.map((d) => {
      if (d.id === id) return { ...d, completed: !d.completed };
      return d;
    });

    onUpdateEvent({
      ...currentEvent,
      timeline: {
        ...currentEvent.timeline,
        dayOfSchedule: updatedDayOf,
      },
    });
  };

  // Add Day-Of Activity
  const handleAddDayOfItem = (): void => {
    if (!newTime.trim() || !newActivity.trim()) return;

    const newItem: DayOfScheduleItem = {
      id: `dayof-${Date.now()}`,
      time: newTime.trim(),
      activity: newActivity.trim(),
      location: newLocation.trim() || 'Main Area',
      leadPerson: newLead.trim() || 'Coordinator',
      notes: newNotes.trim() || undefined,
      completed: false,
    };

    onUpdateEvent({
      ...currentEvent,
      timeline: {
        ...currentEvent.timeline,
        dayOfSchedule: sortDayOfSchedule([...currentEvent.timeline.dayOfSchedule, newItem]),
      },
    });

    setNewTime('');
    setNewActivity('');
    setNewLocation('');
    setNewLead('');
    setNewNotes('');
    setIsAddingDayOf(false);
  };

  // Add Milestone
  const handleAddMilestone = (): void => {
    if (!newTimeframe.trim() || !newMilestoneTitle.trim()) return;

    const newM: MilestoneItem = {
      id: `ms-${Date.now()}`,
      timeframe: newTimeframe.trim(),
      title: newMilestoneTitle.trim(),
      description: newMilestoneDesc.trim(),
      completed: false,
    };

    onUpdateEvent({
      ...currentEvent,
      timeline: {
        ...currentEvent.timeline,
        milestones: [...currentEvent.timeline.milestones, newM],
      },
    });

    setNewTimeframe('');
    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setIsAddingMilestone(false);
  };

  // Filtering
  const sortedDayOf = sortDayOfSchedule(currentEvent.timeline.dayOfSchedule);

  const filteredMilestones = currentEvent.timeline.milestones.filter(
    (m) =>
      m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.timeframe.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredDayOf = sortedDayOf.filter(
    (d) =>
      d.activity.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.leadPerson.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (d.notes && d.notes.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Chronological Timelines & Run-of-Show
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            Operational day-of execution cues and long-range preparation milestones ({milestoneProgress.percentage}% milestones complete).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiDrawer}
            aria-label="Ask AI Schedule Advisor"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-100/80 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>AI Schedule Advisor</span>
          </button>
        </div>
      </div>

      {/* View Switcher and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Interactive Segmented Control */}
        <div className="inline-flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/80" role="tablist">
          <button
            role="tab"
            aria-selected={subView === 'dayOf'}
            onClick={() => setSubView('dayOf')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              subView === 'dayOf'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Day-of Run of Show ({currentEvent.timeline.dayOfSchedule.length})</span>
          </button>

          <button
            role="tab"
            aria-selected={subView === 'milestones'}
            onClick={() => setSubView('milestones')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              subView === 'milestones'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Preparation Milestones ({currentEvent.timeline.milestones.length})</span>
          </button>
        </div>

        {/* Search Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              aria-label="Filter timeline items"
              placeholder="Filter timeline items..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 w-full sm:w-56"
            />
          </div>

          {subView === 'dayOf' ? (
            <button
              onClick={() => setIsAddingDayOf(true)}
              aria-label="Add run of show schedule cue"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Cue</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddingMilestone(true)}
              aria-label="Add preparation milestone"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Form: Add Day of Schedule Item */}
      {isAddingDayOf && (
        <div className="bg-amber-50/40 border border-amber-200 p-5 rounded-xl space-y-3">
          <div className="text-xs font-bold text-amber-900">
            Add New Run-of-Show Schedule Cue
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              aria-label="Schedule cue time"
              placeholder="Time (e.g. 04:30 PM)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
            <input
              type="text"
              aria-label="Activity name"
              placeholder="Activity Name (e.g. Cake Cutting)"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 sm:col-span-2"
            />
            <input
              type="text"
              aria-label="Location or room"
              placeholder="Location (e.g. Lawn Veranda)"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="text"
              aria-label="Lead coordinator or host"
              placeholder="Lead Person / Coordinator"
              value={newLead}
              onChange={(e) => setNewLead(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <input
              type="text"
              aria-label="Operational notes"
              placeholder="Operational notes, music cue, equipment"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 sm:col-span-3"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleAddDayOfItem}
              className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Save Schedule Cue
            </button>
            <button
              onClick={() => setIsAddingDayOf(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inline Form: Add Milestone */}
      {isAddingMilestone && (
        <div className="bg-blue-50/40 border border-blue-200 p-5 rounded-xl space-y-3">
          <div className="text-xs font-bold text-blue-900">
            Add Preparation Milestone Checklist Item
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              aria-label="Milestone timeframe"
              placeholder="Timeframe (e.g. 2 Months Out)"
              value={newTimeframe}
              onChange={(e) => setNewTimeframe(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              aria-label="Milestone title"
              placeholder="Milestone Title (e.g. Finalize Tasting Menu)"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:col-span-2"
            />
            <textarea
              aria-label="Milestone action steps"
              placeholder="Action steps and notes..."
              value={newMilestoneDesc}
              onChange={(e) => setNewMilestoneDesc(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:col-span-3 h-16"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleAddMilestone}
              className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Save Milestone
            </button>
            <button
              onClick={() => setIsAddingMilestone(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SUBVIEW 1: DAY OF RUN OF SHOW */}
      {subView === 'dayOf' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm p-6">
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-stone-200">
              {filteredDayOf.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs italic">
                  No schedule cues matching "{searchFilter}".
                </div>
              ) : (
                filteredDayOf.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-4 group">
                    {/* Circle Indicator on the timeline line */}
                    <button
                      onClick={() => handleToggleDayOf(item.id)}
                      className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-amber-600 text-amber-700 flex items-center justify-center shrink-0 hover:bg-amber-50 transition-colors shadow-xs cursor-pointer"
                      aria-label={item.completed ? `Mark ${item.activity} uncompleted` : `Mark ${item.activity} completed`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </button>

                    {/* Content Box */}
                    <div
                      className={`flex-1 bg-stone-50/60 rounded-xl p-4 border border-stone-200/60 hover:border-amber-200 transition-all ${
                        item.completed ? 'opacity-70 bg-stone-50/30' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-800 tabular-nums">
                            {item.time}
                          </span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <h4
                            className={`text-sm font-bold text-stone-900 ${
                              item.completed ? 'line-through text-stone-500' : ''
                            }`}
                          >
                            {item.activity}
                          </h4>
                        </div>

                        {/* Location and Lead */}
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {item.location}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            {item.leadPerson}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-stone-600 mt-2 bg-white/70 p-2.5 rounded-lg border border-stone-100">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: PREPARATION MILESTONES */}
      {subView === 'milestones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-stone-400 text-xs italic">
              No milestones found.
            </div>
          ) : (
            filteredMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm transition-all hover:border-blue-300 ${
                  milestone.completed ? 'bg-stone-50/40 opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleMilestone(milestone.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                    aria-label={milestone.completed ? `Mark ${milestone.title} as incomplete` : `Mark ${milestone.title} as complete`}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
                      {milestone.timeframe}
                    </div>

                    <h4
                      className={`text-sm font-bold text-stone-900 mb-1 ${
                        milestone.completed ? 'line-through text-stone-500' : ''
                      }`}
                    >
                      {milestone.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
