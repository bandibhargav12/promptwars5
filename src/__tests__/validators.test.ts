/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { sanitizeString, isValidCelebrationEvent } from '../utils/validators';
import { PRESET_EVENTS } from '../data/presetEvents';

describe('validators Utility', () => {
  it('strips dangerous HTML tag brackets to sanitize user strings', () => {
    expect(sanitizeString('<script>alert("xss")</script>Hello')).toBe('scriptalert("xss")/scriptHello');
    expect(sanitizeString('  Clean Event Title  ')).toBe('Clean Event Title');
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
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
});
