export type EventType = 'wedding' | 'birthday' | 'community' | 'custom';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface EventTheme {
  title: string;
  aesthetic: string;
  atmosphere: string;
  colorPalette: ColorSwatch[];
  decorConcept: string;
  musicStyle: string;
  invitationWording: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  items: BudgetItem[];
}

export interface MilestoneItem {
  id: string;
  timeframe: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface DayOfScheduleItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  leadPerson: string;
  notes?: string;
  completed?: boolean;
}

export interface VendorItem {
  id: string;
  category: string;
  name: string;
  contact: string;
  quoteAmount: number;
  status: 'Prospecting' | 'In Talks' | 'Quoted' | 'Booked' | 'Completed';
  notes?: string;
  checklist: string[];
}

export interface CelebrationEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  heroImage?: string;
  styleVibe: string;
  specialRequirements?: string;
  theme: EventTheme;
  budget: {
    categories: BudgetCategory[];
  };
  timeline: {
    milestones: MilestoneItem[];
    dayOfSchedule: DayOfScheduleItem[];
  };
  vendors: VendorItem[];
  personalizedTips: string[];
  createdAt: string;
}
