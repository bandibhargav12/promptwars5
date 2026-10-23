/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { CelebrationEvent } from '../types/event';
import { Printer, Download, Upload, X, FileText } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { isValidCelebrationEvent } from '../utils/validators';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: CelebrationEvent;
  onImportEvent: (event: CelebrationEvent) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentEvent,
  onImportEvent,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useKeyboardShortcut('Escape', onClose, isOpen);

  if (!isOpen) return null;

  const handlePrint = (): void => {
    window.print();
  };

  const handleExportJson = (): void => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(currentEvent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const filename = `${currentEvent.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}_master_plan.json`;
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json: unknown = JSON.parse(event.target?.result as string);
        if (isValidCelebrationEvent(json)) {
          onImportEvent(json);
          setImportStatus('Successfully loaded celebration plan!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('Invalid event blueprint JSON schema.');
        }
      } catch (_err: unknown) {
        setImportStatus('Error reading JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in no-print"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="export-modal-title"
                className="text-sm font-bold text-stone-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Export & Archive Event Packet
              </h3>
              <p className="text-[11px] text-stone-500">
                Print master itinerary or download JSON archive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close export modal"
            className="text-stone-400 hover:text-stone-700 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {importStatus && (
            <div
              role="alert"
              className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg"
            >
              {importStatus}
            </div>
          )}

          {/* Option 1: Print / Save to PDF */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>Printable Run-of-Show & Budget Ledger</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Formatted for clean physical printouts or Save as PDF.
              </p>
            </div>
            <button
              onClick={handlePrint}
              aria-label="Print event packet"
              className="px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Print Packet
            </button>
          </div>

          {/* Option 2: Download JSON */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export JSON Master Data</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Download full state for backups or sharing across team accounts.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              aria-label="Download JSON file"
              className="px-3.5 py-2 bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors border border-stone-300"
            >
              Download JSON
            </button>
          </div>

          {/* Option 3: Import JSON */}
          <div className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Import Blueprint JSON</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Restore a previously exported celebration file.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Import JSON file"
              className="px-3.5 py-2 bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-200 transition-colors border border-stone-300"
            >
              Import File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
