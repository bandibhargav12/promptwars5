/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  parseTimeToMinutes,
  sortDayOfSchedule,
  calculateMilestoneProgress,
} from '../utils/timelineUtils';
import { DayOfScheduleItem, MilestoneItem } from '../types/event';

describe('timelineUtils Utility', () => {
  it('accurately parses 12-hour AM/PM times into minutes from midnight', () => {
    expect(parseTimeToMinutes('12:00 AM')).toBe(0);
    expect(parseTimeToMinutes('08:30 AM')).toBe(510);
    expect(parseTimeToMinutes('12:00 PM')).toBe(720);
    expect(parseTimeToMinutes('01:15 PM')).toBe(795);
    expect(parseTimeToMinutes('11:45 PM')).toBe(1425);
  });

  it('chronologically sorts day-of schedule cues regardless of initial order', () => {
    const unsortedSchedule: DayOfScheduleItem[] = [
      { id: '1', time: '07:00 PM', activity: 'Dinner', location: 'Hall', leadPerson: 'Caterer' },
      { id: '2', time: '11:00 AM', activity: 'Vendor Setup', location: 'Lawn', leadPerson: 'Lead' },
      { id: '3', time: '04:30 PM', activity: 'Ceremony', location: 'Altar', leadPerson: 'Officiant' },
      { id: '4', time: '10:30 PM', activity: 'Send Off', location: 'Gate', leadPerson: 'Driver' },
    ];

    const sorted = sortDayOfSchedule(unsortedSchedule);

    expect(sorted[0].activity).toBe('Vendor Setup');
    expect(sorted[1].activity).toBe('Ceremony');
    expect(sorted[2].activity).toBe('Dinner');
    expect(sorted[3].activity).toBe('Send Off');
  });

  it('computes milestone progress rates and handles empty arrays', () => {
    const milestones: MilestoneItem[] = [
      { id: '1', timeframe: '6 Months', title: 'Task 1', description: '', completed: true },
      { id: '2', timeframe: '3 Months', title: 'Task 2', description: '', completed: true },
      { id: '3', timeframe: '1 Month', title: 'Task 3', description: '', completed: false },
      { id: '4', timeframe: '1 Week', title: 'Task 4', description: '', completed: false },
    ];

    const progress = calculateMilestoneProgress(milestones);
    expect(progress.completed).toBe(2);
    expect(progress.total).toBe(4);
    expect(progress.percentage).toBe(50);

    const emptyProgress = calculateMilestoneProgress([]);
    expect(emptyProgress.percentage).toBe(0);
  });
});
