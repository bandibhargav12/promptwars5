/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CelebrationEvent } from '../types/event';

/**
 * Sanitizes an arbitrary user string to prevent HTML/XSS injection.
 *
 * @param str - Raw input string
 * @returns Clean, trimmed, and safe string
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // remove dangerous tag markers
    .trim();
}

/**
 * Validates whether an unknown object conforms to the minimal CelebrationEvent contract.
 *
 * @param data - Unknown parsed data
 * @returns boolean indicating validity
 */
export function isValidCelebrationEvent(data: unknown): data is CelebrationEvent {
  if (!data || typeof data !== 'object') return false;

  const candidate = data as Partial<CelebrationEvent>;

  const hasBasicFields =
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.totalBudget === 'number' &&
    candidate.totalBudget >= 0;

  const hasTheme =
    candidate.theme &&
    typeof candidate.theme === 'object' &&
    typeof candidate.theme.title === 'string' &&
    Array.isArray(candidate.theme.colorPalette);

  const hasBudget =
    candidate.budget &&
    typeof candidate.budget === 'object' &&
    Array.isArray(candidate.budget.categories);

  const hasTimeline =
    candidate.timeline &&
    typeof candidate.timeline === 'object' &&
    Array.isArray(candidate.timeline.milestones) &&
    Array.isArray(candidate.timeline.dayOfSchedule);

  const hasVendors = Array.isArray(candidate.vendors);

  return Boolean(
    hasBasicFields && hasTheme && hasBudget && hasTimeline && hasVendors
  );
}
