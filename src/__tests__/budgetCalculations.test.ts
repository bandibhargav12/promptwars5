/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary, formatCurrency } from '../utils/budgetCalculations';
import { BudgetCategory } from '../types/event';

describe('budgetCalculations Utility', () => {
  const sampleCategories: BudgetCategory[] = [
    {
      id: 'cat-1',
      name: 'Venue',
      allocated: 10000,
      items: [
        { id: 'i-1', name: 'Hall Rental', estimatedCost: 7000, actualCost: 7000, paid: true },
        { id: 'i-2', name: 'Security Fee', estimatedCost: 1000, actualCost: 1200, paid: false },
      ],
    },
    {
      id: 'cat-2',
      name: 'Catering',
      allocated: 8000,
      items: [
        { id: 'i-3', name: 'Dinner Plated', estimatedCost: 6000, actualCost: 5500, paid: true },
        { id: 'i-4', name: 'Bar Service', estimatedCost: 2000, actualCost: 2000, paid: false },
      ],
    },
  ];

  it('accurately computes total allocated, actual expenditures, and paid deposits', () => {
    const summary = calculateBudgetSummary(sampleCategories, 25000);

    expect(summary.totalAllocated).toBe(18000);
    expect(summary.totalActual).toBe(15700);
    expect(summary.totalPaid).toBe(12500);
    expect(summary.totalPending).toBe(3200);
    expect(summary.remainingVariance).toBe(9300);
    expect(summary.percentSpent).toBe(63);
    expect(summary.isOverBudget).toBe(false);
  });

  it('correctly flags over-budget scenarios when actual expenses exceed target', () => {
    const summary = calculateBudgetSummary(sampleCategories, 15000);

    expect(summary.remainingVariance).toBe(-700);
    expect(summary.isOverBudget).toBe(true);
    expect(summary.percentSpent).toBe(105);
  });

  it('handles empty or zero-value inputs gracefully without NaN or errors', () => {
    const summary = calculateBudgetSummary([], 0);

    expect(summary.totalAllocated).toBe(0);
    expect(summary.totalActual).toBe(0);
    expect(summary.totalPaid).toBe(0);
    expect(summary.totalPending).toBe(0);
    expect(summary.remainingVariance).toBe(0);
    expect(summary.percentSpent).toBe(0);
    expect(summary.isOverBudget).toBe(false);
  });

  it('formats various currencies accurately with proper international symbols', () => {
    expect(formatCurrency(5000, 'USD')).toBe('$5,000');
    expect(formatCurrency(7500, 'EUR')).toBe('€7,500');
    expect(formatCurrency(12000, 'GBP')).toBe('£12,000');
    expect(formatCurrency(250000, 'INR')).toBe('₹250,000');
    expect(formatCurrency(0, 'USD')).toBe('$0');
  });
});
