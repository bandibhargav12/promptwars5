/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CelebrationEvent, SpecializedToolItem } from '../types/event';
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Heart,
  Cake,
  Users2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface SpecializedToolkitViewProps {
  currentEvent: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onOpenAiDrawer: () => void;
}

export const SpecializedToolkitView: React.FC<SpecializedToolkitViewProps> = ({
  currentEvent,
  onUpdateEvent,
  onOpenAiDrawer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDetail, setNewItemDetail] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const tools = currentEvent.specializedTools || [];

  // Toggle item completion
  const handleToggleCompleted = (itemId: string): void => {
    const updatedTools = tools.map((tool) =>
      tool.id === itemId ? { ...tool, completed: !tool.completed } : tool
    );
    onUpdateEvent({
      ...currentEvent,
      specializedTools: updatedTools,
    });
  };

  // Add custom tool item
  const handleAddItem = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: SpecializedToolItem = {
      id: `st-${Date.now()}`,
      category: newItemCategory.trim() || 'Custom Checklist',
      title: newItemTitle.trim(),
      detail: newItemDetail.trim() || 'Custom requirement defined by event planner.',
      completed: false,
    };

    onUpdateEvent({
      ...currentEvent,
      specializedTools: [...tools, newItem],
    });

    setNewItemTitle('');
    setNewItemDetail('');
    setNewItemCategory('');
    setIsAddingItem(false);
  };

  const categories = Array.from(new Set(tools.map((t) => t.category)));
  const filteredTools =
    selectedCategory === 'all'
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

  const completedCount = tools.filter((t) => t.completed).length;
  const progressPercent = tools.length > 0 ? Math.round((completedCount / tools.length) * 100) : 0;

  const eventMetadata = {
    wedding: {
      label: 'Wedding Planning Protocols & Day-of Kit',
      icon: Heart,
      iconColor: 'text-rose-500 bg-rose-50',
      description: 'Legal ceremony verification, head table layouts, toast sequences, and emergency bridal party checklists.',
    },
    birthday: {
      label: 'Milestone Celebration Signature Curation',
      icon: Cake,
      iconColor: 'text-amber-500 bg-amber-50',
      description: 'Surprise entrance choreography, memory slideshow synchronization, signature cocktail recipes, and VIP toasts.',
    },
    community: {
      label: 'Community Gathering Logistics & Municipal Safety',
      icon: Users2,
      iconColor: 'text-emerald-500 bg-emerald-50',
      description: 'City permit compliances, emergency EMT protocols, volunteer rosters, and ADA accessibility clearances.',
    },
    custom: {
      label: 'Bespoke Celebration Protocols',
      icon: FileCheck,
      iconColor: 'text-blue-500 bg-blue-50',
      description: 'Custom tailored planning checklists, key milestones, and critical day-of operational dependencies.',
    },
  }[currentEvent.type];

  const IconComponent = eventMetadata.icon;

  return (
    <section className="space-y-6" aria-labelledby="specialized-toolkit-heading">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${eventMetadata.iconColor}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {currentEvent.type.toUpperCase()} SPECIALIZATION
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">Problem Statement Pillar</span>
            </div>
            <h2
              id="specialized-toolkit-heading"
              className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {eventMetadata.label}
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-2xl mt-1">
              {eventMetadata.description}
            </p>
          </div>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
              {completedCount} <span className="text-xs text-stone-500 font-normal">/ {tools.length}</span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              {progressPercent}% Protocols Completed
            </div>
          </div>

          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assist</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Add Item Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by protocol category">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            All Protocols ({tools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg border border-stone-200/80 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAddingItem ? 'Cancel' : 'Add Custom Protocol'}</span>
        </button>
      </div>

      {/* Add Custom Item Form */}
      {isAddingItem && (
        <form
          onSubmit={handleAddItem}
          className="bg-amber-50/50 rounded-xl border border-amber-200/80 p-4 space-y-3 animate-in fade-in"
        >
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Add Specialized Protocol Item
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Category (e.g. Legal, Toast, Emergency)"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Protocol Title *"
              required
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="sm:col-span-2 px-3 py-2 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <textarea
            placeholder="Operational detail, timing note, or responsible lead person..."
            rows={2}
            value={newItemDetail}
            onChange={(e) => setNewItemDetail(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
            >
              Save Protocol
            </button>
          </div>
        </form>
      )}

      {/* Protocol Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToggleCompleted(tool.id)}
            className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
              tool.completed
                ? 'bg-stone-50/70 border-stone-200 text-stone-400'
                : 'bg-white hover:bg-amber-50/30 border-stone-200/90 hover:border-amber-300 shadow-2xs hover:shadow-xs'
            }`}
          >
            <button
              type="button"
              aria-label={tool.completed ? `Mark ${tool.title} as incomplete` : `Mark ${tool.title} as complete`}
              className="mt-0.5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors"
            >
              {tool.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Circle className="w-5 h-5 text-stone-300" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {tool.category}
                </span>
                {tool.completed && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              <h4
                className={`text-sm font-semibold transition-colors ${
                  tool.completed
                    ? 'line-through text-stone-400'
                    : 'text-stone-900 group-hover:text-amber-900'
                }`}
              >
                {tool.title}
              </h4>

              <p
                className={`text-xs mt-1 leading-relaxed ${
                  tool.completed ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {tool.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-500">
          <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-medium">No specialized protocols found in this category.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-2 text-xs text-amber-700 font-semibold hover:underline"
          >
            View all protocols
          </button>
        </div>
      )}
    </section>
  );
};
