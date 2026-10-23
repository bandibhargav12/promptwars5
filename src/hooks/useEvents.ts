/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { CelebrationEvent } from '../types/event';
import { PRESET_EVENTS } from '../data/presetEvents';
import { isValidCelebrationEvent } from '../utils/validators';

const STORAGE_KEY = 'auracelebrate_events_v3';

export interface UseEventsReturn {
  events: CelebrationEvent[];
  currentEvent: CelebrationEvent;
  currentEventId: string;
  setCurrentEventId: (id: string) => void;
  updateCurrentEvent: (updated: CelebrationEvent) => void;
  createEvent: (newEvent: CelebrationEvent) => void;
  importEvent: (imported: CelebrationEvent) => boolean;
}

/**
 * Custom hook to manage event blueprints with localStorage persistence and fallback validation.
 */
export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CelebrationEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(isValidCelebrationEvent);
          if (valid.length > 0) return valid;
        }
      }
    } catch (err) {
      console.warn('Unable to load celebrations from localStorage, falling back to presets.', err);
    }
    return PRESET_EVENTS;
  });

  const [currentEventId, setCurrentEventId] = useState<string>(() => {
    return events[0]?.id || PRESET_EVENTS[0].id;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (err) {
      console.error('Failed to persist events to localStorage', err);
    }
  }, [events]);

  const currentEvent =
    events.find((e) => e.id === currentEventId) || events[0] || PRESET_EVENTS[0];

  const updateCurrentEvent = useCallback((updated: CelebrationEvent) => {
    if (!isValidCelebrationEvent(updated)) return;
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const createEvent = useCallback((newEvent: CelebrationEvent) => {
    if (!isValidCelebrationEvent(newEvent)) return;
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
  }, []);

  const importEvent = useCallback((imported: CelebrationEvent): boolean => {
    if (!isValidCelebrationEvent(imported)) return false;
    setEvents((prev) => [imported, ...prev]);
    setCurrentEventId(imported.id);
    return true;
  }, []);

  return {
    events,
    currentEvent,
    currentEventId,
    setCurrentEventId,
    updateCurrentEvent,
    createEvent,
    importEvent,
  };
}
