import React, { useState } from 'react';
import { CelebrationEvent, BudgetCategory, BudgetItem } from '../types/event';
import { Plus, Trash2, CheckCircle, Circle, DollarSign, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface BudgetCockpitProps {
  currentEvent: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onOpenAiDrawer: () => void;
}

export const BudgetCockpit: React.FC<BudgetCockpitProps> = ({
  currentEvent,
  onUpdateEvent,
  onOpenAiDrawer,
}) => {
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEstimated, setNewItemEstimated] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Totals calculations
  const totalBudget = currentEvent.totalBudget;
  const totalAllocated = currentEvent.budget.categories.reduce(
    (sum, cat) => sum + cat.allocated,
    0
  );
  const totalActual = currentEvent.budget.categories.reduce(
    (sum, cat) =>
      sum + cat.items.reduce((itemSum, item) => itemSum + item.actualCost, 0),
    0
  );
  const totalPaid = currentEvent.budget.categories.reduce(
    (sum, cat) =>
      sum +
      cat.items
        .filter((item) => item.paid)
        .reduce((itemSum, item) => itemSum + item.actualCost, 0),
    0
  );

  const remaining = totalBudget - totalActual;
  const percentSpent = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  // Toggle paid status
  const handleTogglePaid = (catId: string, itemId: string) => {
    const updatedCategories = currentEvent.budget.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, paid: !item.paid };
        }),
      };
    });

    onUpdateEvent({
      ...currentEvent,
      budget: { ...currentEvent.budget, categories: updatedCategories },
    });
  };

  // Update actual cost
  const handleUpdateCost = (catId: string, itemId: string, newCost: number) => {
    const updatedCategories = currentEvent.budget.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, actualCost: newCost };
        }),
      };
    });

    onUpdateEvent({
      ...currentEvent,
      budget: { ...currentEvent.budget, categories: updatedCategories },
    });
  };

  // Delete line item
  const handleDeleteItem = (catId: string, itemId: string) => {
    const updatedCategories = currentEvent.budget.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter((item) => item.id !== itemId),
      };
    });

    onUpdateEvent({
      ...currentEvent,
      budget: { ...currentEvent.budget, categories: updatedCategories },
    });
  };

  // Add line item
  const handleAddItem = (catId: string) => {
    if (!newItemName.trim()) return;

    const cost = parseFloat(newItemEstimated) || 0;
    const newItem: BudgetItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      estimatedCost: cost,
      actualCost: cost,
      paid: false,
      notes: newItemNotes.trim() || undefined,
    };

    const updatedCategories = currentEvent.budget.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: [...cat.items, newItem],
      };
    });

    onUpdateEvent({
      ...currentEvent,
      budget: { ...currentEvent.budget, categories: updatedCategories },
    });

    setNewItemName('');
    setNewItemEstimated('');
    setNewItemNotes('');
    setAddingToCategory(null);
  };

  // Add new Category
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;

    const newCategory: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      allocated: 0,
      items: [],
    };

    onUpdateEvent({
      ...currentEvent,
      budget: {
        ...currentEvent.budget,
        categories: [...currentEvent.budget.categories, newCategory],
      },
    });

    setNewCatName('');
    setIsAddingCategory(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header with Title and AI Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Budget Cockpit & Expenditure Ledger
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            Category allocations, estimated quotes, deposit trackers, and cost controls.
          </p>
        </div>

        <button
          onClick={onOpenAiDrawer}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/60"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Optimize Budget with AI</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
            Total Target Budget
          </div>
          <div className="text-xl md:text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            ${totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-stone-400 mt-1">
            Currency: {currentEvent.currency}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
            Committed / Spent
          </div>
          <div className="text-xl md:text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            ${totalActual.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
            {percentSpent}% of total target
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
            Paid Deposits
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            ${totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1 font-mono tabular-nums">
            ${(totalActual - totalPaid).toLocaleString()} pending
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
            Remaining Buffer
          </div>
          <div
            className={`text-xl md:text-2xl font-bold mt-1 font-mono tabular-nums ${
              remaining >= 0 ? 'text-stone-900' : 'text-rose-600'
            }`}
          >
            ${remaining.toLocaleString()}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {remaining >= 0 ? 'Under target cap' : 'Over target budget'}
          </div>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-stone-700">
          <span>Budget Allocation Health</span>
          <span className="font-mono tabular-nums">
            ${totalActual.toLocaleString()} of ${totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentSpent > 100
                ? 'bg-rose-500'
                : percentSpent > 85
                ? 'bg-amber-500'
                : 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
      </div>

      {/* Categories Ledger */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Category Breakdown & Line Items
          </h3>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add Category Form Inline */}
        {isAddingCategory && (
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center gap-3">
            <input
              type="text"
              placeholder="e.g., Guest Favors & Gifts"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleAddCategory}
              className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Save Category
            </button>
            <button
              onClick={() => setIsAddingCategory(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {currentEvent.budget.categories.map((cat) => {
            const catSpent = cat.items.reduce((s, i) => s + i.actualCost, 0);
            const catOverAllocated = cat.allocated > 0 && catSpent > cat.allocated;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <div className="px-5 py-3.5 bg-stone-50/70 border-b border-stone-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-900">
                      {cat.name}
                    </span>
                    <span className="text-xs text-stone-500 font-mono tabular-nums">
                      {cat.items.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-stone-600">
                      Allocated:{' '}
                      <span className="font-semibold text-stone-900 font-mono tabular-nums">
                        ${cat.allocated.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-stone-600">
                      Spent:{' '}
                      <span
                        className={`font-semibold font-mono tabular-nums ${
                          catOverAllocated ? 'text-rose-600' : 'text-stone-900'
                        }`}
                      >
                        ${catSpent.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddingToCategory(cat.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Inline Add Item Form for this Category */}
                {addingToCategory === cat.id && (
                  <div className="p-4 bg-amber-50/30 border-b border-amber-200/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Item name (e.g. Acoustic sound rental)"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="number"
                        placeholder="Estimated Cost ($)"
                        value={newItemEstimated}
                        onChange={(e) => setNewItemEstimated(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Notes or vendor tip"
                        value={newItemNotes}
                        onChange={(e) => setNewItemNotes(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleAddItem(cat.id)}
                        className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                      >
                        Add Line Item
                      </button>
                      <button
                        onClick={() => setAddingToCategory(null)}
                        className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Items Table */}
                {cat.items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400 italic">
                    No items added yet. Click "+ Add Item" above.
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[11px] text-stone-400 uppercase tracking-wider bg-stone-50/40">
                          <th className="py-2.5 px-4 font-medium w-10">Paid</th>
                          <th className="py-2.5 px-4 font-medium">Item Name</th>
                          <th className="py-2.5 px-4 font-medium">Notes & Vendor Details</th>
                          <th className="py-2.5 px-4 font-medium text-right">Estimate</th>
                          <th className="py-2.5 px-4 font-medium text-right">Actual Cost</th>
                          <th className="py-2.5 px-4 font-medium text-center w-12">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {cat.items.map((item) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-stone-50/50 transition-colors ${
                              item.paid ? 'bg-stone-50/30' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleTogglePaid(cat.id, item.id)}
                                title={item.paid ? 'Mark as Unpaid' : 'Mark as Paid Deposit'}
                                className="text-stone-400 hover:text-emerald-600 transition-colors"
                              >
                                {item.paid ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            <td className="py-3 px-4 font-semibold text-stone-900">
                              <span className={item.paid ? 'text-stone-500 line-through' : ''}>
                                {item.name}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                              {item.notes || '—'}
                            </td>

                            <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-600">
                              ${item.estimatedCost.toLocaleString()}
                            </td>

                            <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-stone-900">
                              <input
                                type="number"
                                value={item.actualCost}
                                onChange={(e) =>
                                  handleUpdateCost(
                                    cat.id,
                                    item.id,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-24 text-right px-1.5 py-0.5 rounded border border-transparent hover:border-stone-300 focus:border-amber-500 focus:outline-none bg-transparent"
                              />
                            </td>

                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteItem(cat.id, item.id)}
                                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                                title="Delete line item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
