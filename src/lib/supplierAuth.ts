// Demo-grade supplier auth. Real product would be Supabase / SSO / etc.
// For the pitch demo we just store {email, company, supplierId} in localStorage.

export type SupplierSession = {
  email: string;
  company: string;
  supplierId: string;   // matches a supplier in data/products.ts
  signedInAt: number;
};

const KEY = 'diwan.supplier.auth.v1';

export function loadSession(): SupplierSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SupplierSession;
  } catch {
    return null;
  }
}

export function saveSession(s: SupplierSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
