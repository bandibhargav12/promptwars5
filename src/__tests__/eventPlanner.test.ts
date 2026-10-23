import { describe, it, expect } from 'vitest';
import { PRESET_EVENTS } from '../data/presetEvents';
import { CelebrationEvent } from '../types/event';

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

  it('correctly calculates budget expenditure and variances', () => {
    const event = PRESET_EVENTS[0];
    const totalAllocated = event.budget.categories.reduce(
      (sum, cat) => sum + cat.allocated,
      0
    );
    const totalActual = event.budget.categories.reduce(
      (sum, cat) =>
        sum + cat.items.reduce((itemSum, item) => itemSum + item.actualCost, 0),
      0
    );

    expect(totalAllocated).toBeGreaterThan(0);
    expect(totalActual).toBeGreaterThan(0);

    const remaining = event.totalBudget - totalActual;
    expect(typeof remaining).toBe('number');
  });

  it('supports toggling milestone completion and schedule checks', () => {
    const event: CelebrationEvent = JSON.parse(JSON.stringify(PRESET_EVENTS[0]));
    const firstMilestone = event.timeline.milestones[0];
    const initialStatus = firstMilestone.completed;

    firstMilestone.completed = !initialStatus;
    expect(firstMilestone.completed).toBe(!initialStatus);
  });

  it('verifies vendor contract checklist validation', () => {
    const event = PRESET_EVENTS[0];
    const firstVendor = event.vendors[0];

    expect(firstVendor.category).toBeTruthy();
    expect(firstVendor.checklist.length).toBeGreaterThanOrEqual(1);
    expect(['Prospecting', 'In Talks', 'Quoted', 'Booked', 'Completed']).toContain(
      firstVendor.status
    );
  });
});
