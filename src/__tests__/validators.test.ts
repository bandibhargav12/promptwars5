/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  isValidCelebrationEvent,
  isValidTheme,
  isValidBudgetItem,
  isValidBudgetCategory,
  isValidVendorItem,
} from '../utils/validators';
import { PRESET_EVENTS } from '../data/presetEvents';

describe('validators Utility', () => {
  it('strips dangerous HTML tag brackets to sanitize user strings', () => {
    expect(sanitizeString('<script>alert("xss")</script>Hello')).toBe('scriptalert("xss")/scriptHello');
    expect(sanitizeString('  Clean Event Title  ')).toBe('Clean Event Title');
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(123)).toBe('');
  });

  it('validates authentic celebration events conforming to all 4 pillars', () => {
    expect(isValidCelebrationEvent(PRESET_EVENTS[0])).toBe(true);
    expect(isValidCelebrationEvent(PRESET_EVENTS[1])).toBe(true);
    expect(isValidCelebrationEvent(PRESET_EVENTS[2])).toBe(true);
  });

  it('rejects malformed or incomplete event objects', () => {
    expect(isValidCelebrationEvent(null)).toBe(false);
    expect(isValidCelebrationEvent({})).toBe(false);
    expect(isValidCelebrationEvent({ title: 'Incomplete' })).toBe(false);
    expect(isValidCelebrationEvent({ title: 'No Budget', totalBudget: -100 })).toBe(false);
  });

  it('correctly validates EventTheme objects and color palettes', () => {
    expect(isValidTheme(PRESET_EVENTS[0].theme)).toBe(true);
    expect(isValidTheme(null)).toBe(false);
    expect(isValidTheme({ title: '', aesthetic: 'Modern', colorPalette: [] })).toBe(false);
    expect(isValidTheme({ title: 'Valid', aesthetic: 'Modern', colorPalette: [{ name: 'Gold', hex: '#FFD700' }] })).toBe(true);
  });

  it('correctly validates BudgetItem and BudgetCategory records', () => {
    const validItem = { id: 'b1', name: 'Lighting', estimatedCost: 1000, actualCost: 950, paid: true };
    expect(isValidBudgetItem(validItem)).toBe(true);
    expect(isValidBudgetItem({ id: 'b1', name: 'Lighting' })).toBe(false);

    const validCategory = {
      id: 'cat1',
      name: 'Production',
      allocated: 5000,
      items: [validItem],
    };
    expect(isValidBudgetCategory(validCategory)).toBe(true);
    expect(isValidBudgetCategory({ id: 'cat1', name: 'Production', allocated: 5000, items: [{}] })).toBe(false);
  });

  it('correctly validates VendorItem pipeline contracts', () => {
    const validVendor = {
      id: 'v1',
      category: 'Florals',
      name: 'Petal Studio',
      quoteAmount: 3200,
      status: 'Booked' as const,
      checklist: ['Deliver centerpieces', 'Install arch'],
    };
    expect(isValidVendorItem(validVendor)).toBe(true);
    expect(isValidVendorItem({ id: 'v1', name: 'Petal Studio', status: 'InvalidStatus' })).toBe(false);
  });
});
