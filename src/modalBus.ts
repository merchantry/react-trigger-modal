import { ModalEntry, ShowListener } from './types';

const listeners = new Set<ShowListener>();

export const modalBus = {
  onShow(listener: ShowListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  /** Returns true if a ModalProvider was registered to handle it. */
  show(entry: ModalEntry): boolean {
    if (listeners.size === 0) return false;
    listeners.forEach(l => l(entry));
    return true;
  },
};
