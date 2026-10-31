/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  EVENT_TYPE_CONFIGS,
  SUPPORTED_CURRENCIES,
  VENDOR_STATUS_OPTIONS,
  VENDOR_STATUS_BADGES,
  INPUT_LIMITS,
} from '../constants/eventConstants';

describe('Event Constants & Domain Enums', () => {
  it('defines metadata configuration for all 4 supported event archetypes', () => {
    expect(EVENT_TYPE_CONFIGS.wedding.label).toBe('Wedding Celebration');
    expect(EVENT_TYPE_CONFIGS.birthday.label).toBe('Milestone Birthday');
    expect(EVENT_TYPE_CONFIGS.community.label).toBe('Community Gathering');
    expect(EVENT_TYPE_CONFIGS.custom.label).toBe('Bespoke Celebration');

    expect(EVENT_TYPE_CONFIGS.wedding.defaultGuestCount).toBeGreaterThan(0);
    expect(EVENT_TYPE_CONFIGS.community.defaultGuestCount).toBeGreaterThan(100);
  });

  it('supports international currency configurations with correct symbols', () => {
    const symbols = SUPPORTED_CURRENCIES.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.code] = curr.symbol;
      return acc;
    }, {});

    expect(symbols.USD).toBe('$');
    expect(symbols.EUR).toBe('€');
    expect(symbols.GBP).toBe('£');
    expect(symbols.INR).toBe('₹');
    expect(symbols.CAD).toBe('CA$');
    expect(symbols.AUD).toBe('AU$');
  });

  it('provides exhaustive badge stylings for every vendor status', () => {
    VENDOR_STATUS_OPTIONS.forEach((status) => {
      const badge = VENDOR_STATUS_BADGES[status];
      expect(badge).toBeDefined();
      expect(badge.bg).toBeDefined();
      expect(badge.text).toBeDefined();
      expect(badge.border).toBeDefined();
    });
  });

  it('enforces secure input length and financial numerical bounds', () => {
    expect(INPUT_LIMITS.MAX_BUDGET).toBe(100000000);
    expect(INPUT_LIMITS.MIN_BUDGET).toBe(500);
    expect(INPUT_LIMITS.MAX_GUESTS).toBe(10000);
    expect(INPUT_LIMITS.MIN_GUESTS).toBe(1);
    expect(INPUT_LIMITS.TITLE_MAX_LENGTH).toBe(200);
  });
});
