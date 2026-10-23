/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary, formatCurrency } from '../utils/budgetCalculations';
import { BudgetCategory } from '../types/event';

describe('Budget Edge Cases & Boundary Value Tests', () => {
  it('should handle zero target budget gracefully without division by zero NaN', () => {
    const categories: BudgetCategory[] = [
      {
        id: 'cat-1',
        name: 'Gifts',
        allocated: 500,
        items: [{ id: 'i-1', name: 'Favor', estimatedCost: 500, actualCost: 500, paid: true }],
      },
    ];

    const summary = calculateBudgetSummary(categories, 0);
    expect(summary.percentSpent).toBe(0);
    expect(Number.isFinite(summary.percentSpent)).toBe(true);
    expect(summary.remainingVariance).toBe(-500);
    expect(summary.isOverBudget).toBe(true);
  });

  it('should handle negative numbers defensive clamp to zero', () => {
    const summary = calculateBudgetSummary([], -5000);
    expect(summary.totalAllocated).toBe(0);
    expect(summary.totalActual).toBe(0);
    expect(summary.remainingVariance).toBe(0);
    expect(summary.isOverBudget).toBe(false);
  });

  it('should accurately detect over-budget thresholds', () => {
    const categories: BudgetCategory[] = [
      {
        id: 'cat-over',
        name: 'Catering',
        allocated: 10000,
        items: [{ id: 'i-1', name: 'Lobster & Steaks', estimatedCost: 10000, actualCost: 14500, paid: true }],
      },
    ];

    const summary = calculateBudgetSummary(categories, 12000);
    expect(summary.totalActual).toBe(14500);
    expect(summary.remainingVariance).toBe(-2500);
    expect(summary.isOverBudget).toBe(true);
    expect(summary.percentSpent).toBe(121);
  });

  it('should format all global celebration currencies correctly', () => {
    expect(formatCurrency(25000, 'USD')).toBe('$25,000');
    expect(formatCurrency(25000, 'EUR')).toBe('€25,000');
    expect(formatCurrency(25000, 'GBP')).toBe('£25,000');
    expect(formatCurrency(250000, 'INR')).toBe('₹250,000');
    expect(formatCurrency(25000, 'CAD')).toBe('CA$25,000');
    expect(formatCurrency(25000, 'AUD')).toBe('AU$25,000');
    expect(formatCurrency(500, 'XYZ')).toBe('$500'); // Fallback to $
  });

  it('should format non-finite amounts safely without throwing', () => {
    expect(formatCurrency(NaN)).toBe('$0');
    expect(formatCurrency(Infinity)).toBe('$0');
  });

  it('should handle multi-million scale budgets with accurate arithmetic precision', () => {
    const categories: BudgetCategory[] = [
      {
        id: 'cat-mega',
        name: 'Palace Hire',
        allocated: 1200000,
        items: [{ id: 'i-mega', name: 'Grand Ballroom', estimatedCost: 1200000, actualCost: 1195000, paid: true }],
      },
    ];

    const summary = calculateBudgetSummary(categories, 2000000);
    expect(summary.totalActual).toBe(1195000);
    expect(summary.remainingVariance).toBe(805000);
    expect(summary.percentSpent).toBe(60);
    expect(summary.isOverBudget).toBe(false);
  });
});
