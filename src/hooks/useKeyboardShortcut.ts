/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

/**
 * Custom hook to bind accessible keyboard shortcuts (e.g. Escape key to dismiss modals).
 *
 * @param key - The key name (e.g., 'Escape')
 * @param onTrigger - Callback when the key is pressed
 * @param enabled - Whether the listener is active
 */
export function useKeyboardShortcut(
  key: string,
  onTrigger: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, onTrigger, enabled]);
}
