/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayOfScheduleItem, MilestoneItem } from '../types/event';

/**
 * Converts a 12-hour formatted time string (e.g., "10:30 AM", "04:15 PM") to minutes from midnight.
 *
 * @param timeStr - Raw time string
 * @returns Minutes from midnight for stable numerical sorting
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;

  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);

  if (!match) return 9999; // place unrecognized formats at the end

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Chronologically sorts an array of run-of-show schedule cues.
 *
 * @param schedule - Array of DayOfScheduleItem
 * @returns Sorted copy of the schedule
 */
export function sortDayOfSchedule(
  schedule: DayOfScheduleItem[] = []
): DayOfScheduleItem[] {
  return [...schedule].sort((a, b) => {
    const timeA = parseTimeToMinutes(a.time);
    const timeB = parseTimeToMinutes(b.time);
    return timeA - timeB;
  });
}

/**
 * Calculates completion metrics for preparation milestones.
 *
 * @param milestones - Array of MilestoneItem
 * @returns Object containing completed count, total count, and percentage
 */
export function calculateMilestoneProgress(milestones: MilestoneItem[] = []): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = milestones.length;
  if (total === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = milestones.filter((m) => Boolean(m.completed)).length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}
