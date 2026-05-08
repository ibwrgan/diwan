import type {GeneratedDesigns} from './ai/types';

const KEY = 'diwan.designs.v1';

export function loadDesigns(): GeneratedDesigns | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedDesigns;
  } catch {
    return null;
  }
}

export function saveDesigns(d: GeneratedDesigns) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

export function clearDesigns() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
