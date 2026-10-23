/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetCategory, BudgetItem } from '../types/event';

export interface BudgetSummary {
  totalAllocated: number;
  totalActual: number;
  totalPaid: number;
  totalPending: number;
  remainingVariance: number;
  percentSpent: number;
  isOverBudget: boolean;
}

/**
 * Calculates aggregate totals, expenditures, and variance metrics for an event's budget.
 *
 * @param categories - Array of budget categories with line items
 * @param totalTargetBudget - The target total budget cap for the event
 * @returns Comprehensive calculated budget metrics
 */
export function calculateBudgetSummary(
  categories: BudgetCategory[] = [],
  totalTargetBudget: number = 0
): BudgetSummary {
  const safeTarget = Math.max(0, totalTargetBudget);

  const totalAllocated = categories.reduce(
    (sum, cat) => sum + Math.max(0, cat.allocated || 0),
    0
  );

  const totalActual = categories.reduce((sum, cat) => {
    const catSum = (cat.items || []).reduce(
      (itemSum, item) => itemSum + Math.max(0, item.actualCost || 0),
      0
    );
    return sum + catSum;
  }, 0);

  const totalPaid = categories.reduce((sum, cat) => {
    const paidSum = (cat.items || [])
      .filter((item) => Boolean(item.paid))
      .reduce((itemSum, item) => itemSum + Math.max(0, item.actualCost || 0), 0);
    return sum + paidSum;
  }, 0);

  const totalPending = Math.max(0, totalActual - totalPaid);
  const remainingVariance = safeTarget - totalActual;
  const percentSpent =
    safeTarget > 0 ? Math.round((totalActual / safeTarget) * 100) : 0;
  const isOverBudget = remainingVariance < 0;

  return {
    totalAllocated,
    totalActual,
    totalPaid,
    totalPending,
    remainingVariance,
    percentSpent,
    isOverBudget,
  };
}

/**
 * Formats a monetary amount into a clean currency string with tabular numeral support.
 *
 * @param amount - Numeric amount
 * @param currency - 3-letter currency code (e.g. USD, EUR, GBP, INR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'AU$',
  };

  const symbol = symbols[currency.toUpperCase()] || '$';
  return `${symbol}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
