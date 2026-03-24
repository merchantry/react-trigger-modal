import { useEffect } from 'react';
import { onKeyDownCallback } from '../utils/html';

export function useOnKeyDown(keys: string[], callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = onKeyDownCallback(keys, callback);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, ...keys, callback]);
}
