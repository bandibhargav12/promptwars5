/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventType, VendorItem } from '../types/event';

/**
 * Metadata configuration for supported event types in AuraCelebrate.
 */
export interface EventTypeConfig {
  id: EventType;
  label: string;
  tagline: string;
  defaultGuestCount: number;
  defaultBudget: number;
  iconName: string;
}

/**
 * Supported celebration event types with domain metadata.
 */
export const EVENT_TYPE_CONFIGS: Record<EventType, EventTypeConfig> = {
  wedding: {
    id: 'wedding',
    label: 'Wedding Celebration',
    tagline: 'Timeless ceremonies, receptions, aisle timelines, and vendor coordination.',
    defaultGuestCount: 120,
    defaultBudget: 35000,
    iconName: 'Heart',
  },
  birthday: {
    id: 'birthday',
    label: 'Milestone Birthday',
    tagline: 'Festive galas, surprise programs, tribute toasts, and entertainment.',
    defaultGuestCount: 60,
    defaultBudget: 12000,
    iconName: 'Cake',
  },
  community: {
    id: 'community',
    label: 'Community Gathering',
    tagline: 'Festivals, charity fundraisers, street fairs, and civic cultural assemblies.',
    defaultGuestCount: 250,
    defaultBudget: 18000,
    iconName: 'Users2',
  },
  custom: {
    id: 'custom',
    label: 'Bespoke Celebration',
    tagline: 'Custom curated galas, intimate dinner parties, and specialty celebrations.',
    defaultGuestCount: 50,
    defaultBudget: 15000,
    iconName: 'Sparkles',
  },
};

/**
 * Currency configuration with symbols and locale display formats.
 */
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)' },
];

/**
 * Vendor workflow progression stages.
 */
export type VendorStatus = VendorItem['status'];

export const VENDOR_STATUS_OPTIONS: VendorStatus[] = [
  'Prospecting',
  'In Talks',
  'Quoted',
  'Booked',
  'Completed',
];

/**
 * Styling color badges for vendor pipeline statuses.
 */
export const VENDOR_STATUS_BADGES: Record<VendorStatus, { bg: string; text: string; border: string }> = {
  Prospecting: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
  'In Talks': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Quoted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Booked: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Completed: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

/**
 * Standard budget categories recommended for full-spectrum events.
 */
export const STANDARD_BUDGET_CATEGORIES = [
  'Venue & Facilities',
  'Catering & Bar',
  'Decor & Florals',
  'Photo & Video',
  'Music & Entertainment',
  'Stationery & Signage',
  'Attire & Styling',
  'Contingency Buffer',
] as const;

/**
 * Maximum character bounds for form inputs to enforce security and clean DB state.
 */
export const INPUT_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  LOCATION_MAX_LENGTH: 200,
  STYLE_VIBE_MAX_LENGTH: 1000,
  SPECIAL_REQS_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500,
  MAX_BUDGET: 100000000,
  MIN_BUDGET: 500,
  MAX_GUESTS: 10000,
  MIN_GUESTS: 1,
} as const;
