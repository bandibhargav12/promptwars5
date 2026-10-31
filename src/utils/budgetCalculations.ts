/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetCategory, BudgetItem } from '../types/event';
import { SUPPORTED_CURRENCIES } from '../constants/eventConstants';

/**
 * Encapsulates computed aggregate financial health indicators for an event.
 */
export interface BudgetSummary {
  /** Sum of planned allocations across all categories */
  totalAllocated: number;
  /** Actual recorded spending across all line items */
  totalActual: number;
  /** Total amounts marked as paid or settled */
  totalPaid: number;
  /** Outstanding unpaid balance on actual expenses */
  totalPending: number;
  /** Difference between target budget cap and total actual spend */
  remainingVariance: number;
  /** Percentage of target budget utilized (integer between 0 and 100+) */
  percentSpent: number;
  /** Boolean flag indicating whether actual expenses exceed total target budget */
  isOverBudget: boolean;
}

/**
 * Calculates aggregate totals, expenditures, and variance metrics for an event's budget.
 *
 * @param categories - Array of budget categories with line items
 * @param totalTargetBudget - The target total budget cap for the event
 * @returns Comprehensive calculated budget metrics
 *
 * @example
 * ```ts
 * const summary = calculateBudgetSummary(event.budget.categories, 30000);
 * console.log(summary.remainingVariance, summary.isOverBudget);
 * ```
 */
export function calculateBudgetSummary(
  categories: BudgetCategory[] = [],
  totalTargetBudget = 0
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
 * Calculates variance and spend ratio for an individual category.
 *
 * @param category - A single budget category
 * @returns Category spend breakdown
 *
 * @example
 * ```ts
 * const { actualSpend, variance, isOverAllocated } = calculateCategoryVariance(category);
 * ```
 */
export function calculateCategoryVariance(category: BudgetCategory): {
  allocated: number;
  actualSpend: number;
  variance: number;
  percentUtilized: number;
  isOverAllocated: boolean;
} {
  const allocated = Math.max(0, category.allocated || 0);
  const actualSpend = (category.items || []).reduce(
    (sum, item) => sum + Math.max(0, item.actualCost || 0),
    0
  );
  const variance = allocated - actualSpend;
  const percentUtilized =
    allocated > 0 ? Math.round((actualSpend / allocated) * 100) : 0;
  const isOverAllocated = variance < 0;

  return {
    allocated,
    actualSpend,
    variance,
    percentUtilized,
    isOverAllocated,
  };
}

/**
 * Formats a monetary amount into a clean currency string with tabular numeral support.
 *
 * @param amount - Numeric amount
 * @param currency - 3-letter currency code (e.g. USD, EUR, GBP, INR)
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(25000, 'USD') // '$25,000'
 * formatCurrency(1500000, 'INR') // '₹1,500,000'
 * ```
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const currencyMatch = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currency.toUpperCase()
  );
  const symbol = currencyMatch?.symbol || '$';

  return `${symbol}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
