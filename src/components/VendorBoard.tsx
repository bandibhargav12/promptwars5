import React, { useState } from 'react';
import { CelebrationEvent, VendorItem } from '../types/event';
import { Users, Phone, Mail, CheckSquare, Square, Plus, Sparkles, DollarSign, FileText } from 'lucide-react';

interface VendorBoardProps {
  currentEvent: CelebrationEvent;
  onUpdateEvent: (updated: CelebrationEvent) => void;
  onOpenAiDrawer: () => void;
}

export const VendorBoard: React.FC<VendorBoardProps> = ({
  currentEvent,
  onUpdateEvent,
  onOpenAiDrawer,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // New Vendor Form State
  const [newCategory, setNewCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newChecklist, setNewChecklist] = useState('');

  // Status stages
  const statuses: ('Prospecting' | 'In Talks' | 'Quoted' | 'Booked' | 'Completed')[] = [
    'Prospecting',
    'In Talks',
    'Quoted',
    'Booked',
    'Completed',
  ];

  // Update vendor status
  const handleUpdateStatus = (
    vendorId: string,
    status: 'Prospecting' | 'In Talks' | 'Quoted' | 'Booked' | 'Completed'
  ) => {
    const updatedVendors = currentEvent.vendors.map((v) => {
      if (v.id === vendorId) return { ...v, status };
      return v;
    });

    onUpdateEvent({
      ...currentEvent,
      vendors: updatedVendors,
    });
  };

  // Add new vendor
  const handleAddVendor = () => {
    if (!newName.trim() || !newCategory.trim()) return;

    const checklistItems = newChecklist
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newV: VendorItem = {
      id: `vnd-${Date.now()}`,
      category: newCategory.trim(),
      name: newName.trim(),
      contact: newContact.trim() || 'Pending details',
      quoteAmount: parseFloat(newQuote) || 0,
      status: 'In Talks',
      notes: newNotes.trim() || undefined,
      checklist:
        checklistItems.length > 0
          ? checklistItems
          : [
              'Verify insurance coverage and permits',
              'Review cancellation and overtime policies',
              'Confirm day-of arrival time and point of contact',
            ],
    };

    onUpdateEvent({
      ...currentEvent,
      vendors: [...currentEvent.vendors, newV],
    });

    setNewCategory('');
    setNewName('');
    setNewContact('');
    setNewQuote('');
    setNewNotes('');
    setNewChecklist('');
    setIsAddingVendor(false);
  };

  // Filter vendors
  const filteredVendors = currentEvent.vendors.filter((v) => {
    if (selectedStatus === 'All') return true;
    return v.status === selectedStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Vendor Directory & Checklist Deliverables
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mt-0.5">
            Partner contract status, quote amounts, and critical screening questions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiDrawer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-900 bg-purple-100/80 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Generate Vendor RFP Questions</span>
          </button>

          <button
            onClick={() => setIsAddingVendor(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs (Segmented control) */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg overflow-x-auto border border-stone-200/80 max-w-full">
        {['All', ...statuses].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedStatus === st
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {st}
            {st === 'All'
              ? ` (${currentEvent.vendors.length})`
              : ` (${currentEvent.vendors.filter((v) => v.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Add Vendor Form */}
      {isAddingVendor && (
        <div className="bg-purple-50/40 border border-purple-200 p-5 rounded-xl space-y-4">
          <div className="text-xs font-bold text-purple-900">
            Register New Vendor or Production Partner
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Category (e.g. Photography, Florals, Catering)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Company or Contact Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:col-span-2"
            />
            <input
              type="text"
              placeholder="Email / Phone / Instagram handle"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Quote Amount ($)"
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
            <input
              type="text"
              placeholder="Key notes, overtime terms, dietary policies"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <textarea
              placeholder="Checklist items (one per line, e.g. Insurance certificate, Arrival time)"
              value={newChecklist}
              onChange={(e) => setNewChecklist(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 sm:col-span-3 h-20"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleAddVendor}
              className="px-3.5 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Save Vendor
            </button>
            <button
              onClick={() => setIsAddingVendor(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filteredVendors.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-stone-400 text-xs italic bg-white rounded-xl border border-stone-200">
            No vendors found for status "{selectedStatus}".
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-stone-200/80 shadow-sm p-5 space-y-4 hover:border-purple-200 transition-all"
            >
              {/* Header: Category & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  {vendor.category}
                </span>

                {/* Status Dropdown */}
                <select
                  value={vendor.status}
                  onChange={(e) =>
                    handleUpdateStatus(
                      vendor.id,
                      e.target.value as any
                    )
                  }
                  className="text-xs font-semibold rounded-lg border border-stone-200 bg-stone-50/80 px-2.5 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Name & Quote */}
              <div className="flex items-baseline justify-between gap-2 border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  {vendor.name}
                </h3>
                <div className="text-right">
                  <div className="text-xs text-stone-400 font-medium">Quote</div>
                  <div className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                    ${vendor.quoteAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact Info (Clean text) */}
              <div className="text-xs text-stone-600 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{vendor.contact}</span>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="text-xs text-stone-500 bg-stone-50/70 p-2.5 rounded-lg border border-stone-100">
                  <span className="font-semibold text-stone-700">Contract Notes: </span>
                  {vendor.notes}
                </div>
              )}

              {/* Deliverables Checklist */}
              {vendor.checklist && vendor.checklist.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-stone-400" />
                    <span>Contract & Due Diligence Checklist</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {vendor.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
