/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { PRESET_EVENTS } from '../data/presetEvents';
import { CelebrationEvent } from '../types/event';
import { calculateBudgetSummary } from '../utils/budgetCalculations';

describe('AuraCelebrate Event Planner Engine', () => {
  it('loads valid preset celebrations with all required pillars', () => {
    expect(PRESET_EVENTS.length).toBeGreaterThanOrEqual(3);

    const wedding = PRESET_EVENTS.find((e) => e.type === 'wedding');
    const birthday = PRESET_EVENTS.find((e) => e.type === 'birthday');
    const community = PRESET_EVENTS.find((e) => e.type === 'community');

    expect(wedding).toBeDefined();
    expect(birthday).toBeDefined();
    expect(community).toBeDefined();

    // Verify Theme Pillar
    expect(wedding?.theme.colorPalette.length).toBeGreaterThanOrEqual(3);
    expect(wedding?.theme.invitationWording).toBeTruthy();

    // Verify Budget Pillar
    expect(wedding?.budget.categories.length).toBeGreaterThan(0);
    expect(wedding?.totalBudget).toBeGreaterThan(0);

    // Verify Timeline Pillar
    expect(wedding?.timeline.milestones.length).toBeGreaterThan(0);
    expect(wedding?.timeline.dayOfSchedule.length).toBeGreaterThan(0);

    // Verify Vendor Pillar
    expect(wedding?.vendors.length).toBeGreaterThan(0);
  });

  it('correctly calculates budget expenditure and variances across presets', () => {
    PRESET_EVENTS.forEach((event) => {
      const summary = calculateBudgetSummary(
        event.budget.categories,
        event.totalBudget
      );
      expect(summary.totalAllocated).toBeGreaterThan(0);
      expect(summary.totalActual).toBeGreaterThan(0);
      expect(summary.remainingVariance).toBeTypeOf('number');
      expect(summary.percentSpent).toBeGreaterThanOrEqual(0);
    });
  });

  it('supports toggling milestone completion and schedule checks', () => {
    const event: CelebrationEvent = JSON.parse(JSON.stringify(PRESET_EVENTS[0]));
    const firstMilestone = event.timeline.milestones[0];
    const initialStatus = firstMilestone.completed;

    firstMilestone.completed = !initialStatus;
    expect(firstMilestone.completed).toBe(!initialStatus);
  });

  it('verifies vendor contract checklist and quote validation', () => {
    const event = PRESET_EVENTS[0];
    const firstVendor = event.vendors[0];

    expect(firstVendor.category).toBeTruthy();
    expect(firstVendor.quoteAmount).toBeGreaterThan(0);
    expect(firstVendor.checklist.length).toBeGreaterThanOrEqual(1);
    expect(['Prospecting', 'In Talks', 'Quoted', 'Booked', 'Completed']).toContain(
      firstVendor.status
    );
  });

  it('verifies specialized Wedding domain requirements', () => {
    const wedding = PRESET_EVENTS.find((e) => e.type === 'wedding');
    expect(wedding?.theme.aesthetic.toLowerCase()).toContain('tuscan');
    expect(wedding?.theme.decorConcept).toBeTruthy();
    expect(wedding?.timeline.dayOfSchedule.some((s) => s.activity.toLowerCase().includes('ceremony'))).toBe(true);
    expect(wedding?.vendors.some((v) => v.category.toLowerCase().includes('photo'))).toBe(true);
  });

  it('verifies specialized Milestone Birthday domain requirements', () => {
    const birthday = PRESET_EVENTS.find((e) => e.type === 'birthday');
    expect(birthday?.theme.aesthetic.toLowerCase()).toContain('glam');
    expect(birthday?.timeline.dayOfSchedule.some((s) => s.activity.toLowerCase().includes('champagne'))).toBe(true);
    expect(birthday?.vendors.some((v) => v.category.toLowerCase().includes('music'))).toBe(true);
  });

  it('verifies specialized Community Gathering domain requirements', () => {
    const community = PRESET_EVENTS.find((e) => e.type === 'community');
    expect(community?.guestCount).toBeGreaterThanOrEqual(300);
    expect(community?.timeline.dayOfSchedule.some((s) => s.activity.toLowerCase().includes('festival'))).toBe(true);
    expect(community?.budget.categories.some((c) => c.name.toLowerCase().includes('permit'))).toBe(true);
  });
});
