/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CelebrationEvent,
  EventTheme,
  BudgetCategory,
  BudgetItem,
  VendorItem,
} from '../types/event';

/**
 * Sanitizes an arbitrary user string to prevent HTML/XSS injection and normalize whitespace.
 *
 * @param str - Raw input value
 * @returns Clean, trimmed, and safe string
 *
 * @example
 * ```ts
 * sanitizeString('<script>alert("xss")</script>Hello') // 'scriptalert("xss")/scriptHello'
 * ```
 */
export function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip dangerous HTML tag symbols
    .trim();
}

/**
 * Validates whether an unknown value conforms to the EventTheme interface.
 *
 * @param theme - Candidate theme object
 * @returns boolean type guard for EventTheme
 */
export function isValidTheme(theme: unknown): theme is EventTheme {
  if (!theme || typeof theme !== 'object') return false;
  const t = theme as Partial<EventTheme>;
  return (
    typeof t.title === 'string' &&
    t.title.trim().length > 0 &&
    typeof t.aesthetic === 'string' &&
    Array.isArray(t.colorPalette) &&
    t.colorPalette.length > 0 &&
    t.colorPalette.every(
      (swatch) =>
        Boolean(swatch) &&
        typeof swatch.name === 'string' &&
        typeof swatch.hex === 'string'
    )
  );
}

/**
 * Validates whether an unknown value conforms to a BudgetItem interface.
 *
 * @param item - Candidate budget item
 * @returns boolean type guard for BudgetItem
 */
export function isValidBudgetItem(item: unknown): item is BudgetItem {
  if (!item || typeof item !== 'object') return false;
  const b = item as Partial<BudgetItem>;
  return (
    typeof b.id === 'string' &&
    typeof b.name === 'string' &&
    typeof b.estimatedCost === 'number' &&
    typeof b.actualCost === 'number' &&
    typeof b.paid === 'boolean'
  );
}

/**
 * Validates whether an unknown value conforms to a BudgetCategory interface.
 *
 * @param category - Candidate category object
 * @returns boolean type guard for BudgetCategory
 */
export function isValidBudgetCategory(category: unknown): category is BudgetCategory {
  if (!category || typeof category !== 'object') return false;
  const c = category as Partial<BudgetCategory>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.allocated === 'number' &&
    Array.isArray(c.items) &&
    c.items.every(isValidBudgetItem)
  );
}

/**
 * Validates whether an unknown value conforms to a VendorItem interface.
 *
 * @param vendor - Candidate vendor object
 * @returns boolean type guard for VendorItem
 */
export function isValidVendorItem(vendor: unknown): vendor is VendorItem {
  if (!vendor || typeof vendor !== 'object') return false;
  const v = vendor as Partial<VendorItem>;
  const validStatuses = ['Prospecting', 'In Talks', 'Quoted', 'Booked', 'Completed'];
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.category === 'string' &&
    typeof v.quoteAmount === 'number' &&
    typeof v.status === 'string' &&
    validStatuses.includes(v.status) &&
    Array.isArray(v.checklist)
  );
}

/**
 * Validates whether an unknown object conforms to the complete CelebrationEvent contract.
 *
 * @param data - Unknown parsed data
 * @returns boolean type guard indicating whether data is a valid CelebrationEvent
 *
 * @example
 * ```ts
 * if (isValidCelebrationEvent(parsedJson)) {
 *   loadEvent(parsedJson);
 * }
 * ```
 */
export function isValidCelebrationEvent(data: unknown): data is CelebrationEvent {
  if (!data || typeof data !== 'object') return false;

  const candidate = data as Partial<CelebrationEvent>;

  const hasBasicFields =
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.totalBudget === 'number' &&
    candidate.totalBudget >= 0;

  const hasTheme = isValidTheme(candidate.theme);

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
