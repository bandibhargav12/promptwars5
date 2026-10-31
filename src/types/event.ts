/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Supported celebration archetype categories.
 */
export type EventType = 'wedding' | 'birthday' | 'community' | 'custom';

/**
 * Represents an individual color swatch within an event's curated palette.
 */
export interface ColorSwatch {
  /** Descriptive title of the color hue (e.g. 'Warm Terracotta', 'Olive Sage') */
  name: string;
  /** Valid CSS hexadecimal color representation (e.g. '#D97706') */
  hex: string;
}

/**
 * Creative concept, sensory atmosphere, and stylistic design blueprint.
 */
export interface EventTheme {
  /** Catchy, elegant design concept title */
  title: string;
  /** Summary of stylistic aesthetic keywords */
  aesthetic: string;
  /** Multi-sensory description encompassing lighting, scents, florals, and spatial texture */
  atmosphere: string;
  /** 4 to 5 harmonized color swatches */
  colorPalette: ColorSwatch[];
  /** Detailed layout notes on tablescape, linens, florals, and spatial installations */
  decorConcept: string;
  /** Musical energy curve and soundscape trajectory */
  musicStyle: string;
  /** Ready-to-use invitation copy draft suitable for digital or print invitations */
  invitationWording: string;
}

/**
 * Granular line item within an itemized budget category.
 */
export interface BudgetItem {
  /** Unique item identifier */
  id: string;
  /** Name of the line item expense */
  name: string;
  /** Target budget estimate amount */
  estimatedCost: number;
  /** Actual recorded expense or invoice charge */
  actualCost: number;
  /** Flag denoting whether deposit/balance has been settled */
  paid: boolean;
  /** Optional vendor tip, pricing rationale, or cost-saving note */
  notes?: string;
}

/**
 * High-level expenditure category grouping related line items.
 */
export interface BudgetCategory {
  /** Unique category identifier */
  id: string;
  /** Human-readable category label */
  name: string;
  /** Allocated budget target for this entire category */
  allocated: number;
  /** List of itemized line items */
  items: BudgetItem[];
}

/**
 * High-level milestone for pre-event preparation and long-range planning.
 */
export interface MilestoneItem {
  /** Unique milestone identifier */
  id: string;
  /** Time horizon relative to event day (e.g. '6 Months Out', '2 Weeks Out') */
  timeframe: string;
  /** Milestone objective summary */
  title: string;
  /** Actionable logistical checklist task */
  description: string;
  /** Progress completion flag */
  completed: boolean;
}

/**
 * Granular run-of-show schedule cue for day-of event execution.
 */
export interface DayOfScheduleItem {
  /** Unique schedule cue identifier */
  id: string;
  /** Time of day string (e.g. '02:30 PM') */
  time: string;
  /** Description of the cue or event sequence */
  activity: string;
  /** Physical staging location or room zone */
  location: string;
  /** Key individual, coordinator, or vendor leading the cue */
  leadPerson: string;
  /** Operational notes, staging cues, or AV audio/lighting details */
  notes?: string;
  /** Execution status checkbox */
  completed?: boolean;
}

/**
 * Vendor partner record tracked in the procurement CRM.
 */
export interface VendorItem {
  /** Unique vendor identifier */
  id: string;
  /** Trade category (e.g. Catering, Florals, Photography) */
  category: string;
  /** Vendor company or professional name */
  name: string;
  /** Contact email, telephone, or booking link */
  contact: string;
  /** Quoted or contracted service fee */
  quoteAmount: number;
  /** Current procurement pipeline stage */
  status: 'Prospecting' | 'In Talks' | 'Quoted' | 'Booked' | 'Completed';
  /** Contract terms, overtime clauses, or dietary notes */
  notes?: string;
  /** Vetting questions and contract deliverables */
  checklist: string[];
}

/**
 * Domain-specific toolkit item tailored to unique celebration requirements
 * (e.g., Marriage legalities, surprise timing cues, municipal permits, volunteer rosters).
 */
export interface SpecializedToolItem {
  /** Unique toolkit item identifier */
  id: string;
  /** Archetype or functional category */
  category: string;
  /** Toolkit requirement summary */
  title: string;
  /** Specific regulatory, logistical, or staging instructions */
  detail: string;
  /** Completion status flag */
  completed: boolean;
  /** Optional planner notes or permit tracking numbers */
  notes?: string;
}

/**
 * Master Celebration Event Blueprint model.
 */
export interface CelebrationEvent {
  /** Globally unique event identifier */
  id: string;
  /** Human-readable event title */
  title: string;
  /** Archetype celebration classification */
  type: EventType;
  /** Scheduled date string (YYYY-MM-DD or formatted) */
  date: string;
  /** Event venue, city, or physical setting */
  location: string;
  /** Total anticipated attendee count */
  guestCount: number;
  /** Overall target budget cap */
  totalBudget: number;
  /** 3-letter currency code (e.g. 'USD', 'EUR', 'GBP', 'INR') */
  currency: string;
  /** Optional visual banner photography URL */
  heroImage?: string;
  /** Stylistic aesthetic keyword summary */
  styleVibe: string;
  /** User-defined special constraints, cultural traditions, or dietary mandates */
  specialRequirements?: string;
  /** Curated aesthetic, palette, and invitation copywriting */
  theme: EventTheme;
  /** Itemized budget ledger and category allocations */
  budget: {
    categories: BudgetCategory[];
  };
  /** Planning milestones and day-of execution cues */
  timeline: {
    milestones: MilestoneItem[];
    dayOfSchedule: DayOfScheduleItem[];
  };
  /** Vendor pipeline and contract directory */
  vendors: VendorItem[];
  /** Archetype-specific compliance, safety, and specialty checklists */
  specializedTools?: SpecializedToolItem[];
  /** Tailored expert logistical recommendations generated by AI */
  personalizedTips: string[];
  /** ISO timestamp of record inception */
  createdAt: string;
}
