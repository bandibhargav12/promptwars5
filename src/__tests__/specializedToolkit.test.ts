/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { PRESET_EVENTS } from '../data/presetEvents';
import { SpecializedToolItem } from '../types/event';

describe('Specialized Toolkit Domain Tests', () => {
  it('should verify all 3 preset celebrations include valid specialized protocol items', () => {
    expect(PRESET_EVENTS).toHaveLength(3);

    PRESET_EVENTS.forEach((event) => {
      expect(event.specializedTools).toBeDefined();
      expect(event.specializedTools!.length).toBeGreaterThanOrEqual(4);

      event.specializedTools!.forEach((tool: SpecializedToolItem) => {
        expect(tool.id).toBeTruthy();
        expect(tool.title).toBeTruthy();
        expect(tool.category).toBeTruthy();
        expect(tool.detail).toBeTruthy();
        expect(typeof tool.completed).toBe('boolean');
      });
    });
  });

  it('should verify Wedding preset contains legal, seating, and ceremony protocols', () => {
    const wedding = PRESET_EVENTS.find((e) => e.type === 'wedding');
    expect(wedding).toBeDefined();

    const categories = wedding!.specializedTools!.map((t) => t.category);
    expect(categories).toContain('Ceremony & Legal');
    expect(categories).toContain('Guest Experience');
    expect(categories).toContain('Timing & Logistics');

    const titles = wedding!.specializedTools!.map((t) => t.title);
    expect(titles.some((t) => t.toLowerCase().includes('marriage license'))).toBe(true);
    expect(titles.some((t) => t.toLowerCase().includes('seating chart'))).toBe(true);
  });

  it('should verify Milestone Birthday preset contains surprise reveal and slideshow protocols', () => {
    const birthday = PRESET_EVENTS.find((e) => e.type === 'birthday');
    expect(birthday).toBeDefined();

    const titles = birthday!.specializedTools!.map((t) => t.title);
    expect(titles.some((t) => t.toLowerCase().includes('surprise entrance'))).toBe(true);
    expect(titles.some((t) => t.toLowerCase().includes('montage'))).toBe(true);
  });

  it('should verify Community Gathering preset contains permits, safety, and ADA accessibility', () => {
    const community = PRESET_EVENTS.find((e) => e.type === 'community');
    expect(community).toBeDefined();

    const categories = community!.specializedTools!.map((t) => t.category);
    expect(categories).toContain('Permits & Municipal');
    expect(categories).toContain('Safety & Health');
    expect(categories).toContain('Accessibility & Inclusion');

    const titles = community!.specializedTools!.map((t) => t.title);
    expect(titles.some((t) => t.toLowerCase().includes('permit'))).toBe(true);
    expect(titles.some((t) => t.toLowerCase().includes('first aid'))).toBe(true);
    expect(titles.some((t) => t.toLowerCase().includes('ada accessible'))).toBe(true);
  });

  it('should correctly toggle protocol completion status without mutating original object', () => {
    const wedding = PRESET_EVENTS[0];
    const initialTools = wedding.specializedTools!;
    const targetTool = initialTools[0];
    const initialStatus = targetTool.completed;

    const updatedTools = initialTools.map((t) =>
      t.id === targetTool.id ? { ...t, completed: !t.completed } : t
    );

    expect(updatedTools[0].completed).toBe(!initialStatus);
    expect(initialTools[0].completed).toBe(initialStatus); // Immutability preserved
  });
});
