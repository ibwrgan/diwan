// Mock orders + performance metrics shown inside the gated supplier portal.
// Driven by the supplier id; each supplier sees their own slice.

import {SKUS, SUPPLIERS, type SKU} from './products';

export type SupplierOrder = {
  id: string;             // anonymized customer-facing id
  status: 'pending' | 'inProgress' | 'ready' | 'delivered';
  receivedDays: number;   // days ago
  deadlineDays: number;   // days from today; negative = overdue
  items: {skuId: string; qty: number}[];
  city: 'Riyadh' | 'Jeddah' | 'Dammam';
};

// Deterministic seeded RNG (so the demo doesn't change between renders)
function seeded(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  return () => {
    h = (h * 9301 + 49297) | 0;
    return Math.abs(h) / 0x7fffffff;
  };
}

export function ordersFor(supplierId: string): SupplierOrder[] {
  const skus = SKUS.filter((s) => s.supplierId === supplierId);
  if (!skus.length) return [];
  const rnd = seeded(supplierId);
  const cities: SupplierOrder['city'][] = ['Riyadh', 'Riyadh', 'Riyadh', 'Jeddah', 'Dammam'];
  const statuses: SupplierOrder['status'][] = ['pending', 'pending', 'inProgress', 'inProgress', 'ready', 'ready', 'delivered', 'delivered'];
  const out: SupplierOrder[] = [];
  for (let i = 0; i < 8; i++) {
    const itemCount = 1 + Math.floor(rnd() * 3);
    const items: SupplierOrder['items'] = [];
    for (let j = 0; j < itemCount; j++) {
      const sku = skus[Math.floor(rnd() * skus.length)];
      items.push({skuId: sku.id, qty: 1 + Math.floor(rnd() * 3)});
    }
    out.push({
      id: `DWN-${(2840 + i).toString().padStart(4, '0')}`,
      status: statuses[Math.floor(rnd() * statuses.length)],
      receivedDays: Math.floor(rnd() * 14),
      deadlineDays: Math.floor(rnd() * 24) - 2,
      items,
      city: cities[Math.floor(rnd() * cities.length)],
    });
  }
  return out;
}

export type SupplierPerformance = {
  leadsDelivered: number;
  revenueRouted: number;          // SAR
  equivalentWalkInCAC: number;    // SAR (1,200 per lead industry avg)
  customerServiceTickets: number; // tickets Diwan absorbed
  benchmarks: {leads: number; revenue: number; cac: number; tickets: number};
};

export function performanceFor(supplierId: string): SupplierPerformance {
  const skus = SKUS.filter((s) => s.supplierId === supplierId);
  const rnd = seeded(supplierId + 'perf');
  const leads = 12 + Math.floor(rnd() * 24);
  const avgPrice = skus.length ? skus.reduce((s, x) => s + x.diwanPrice, 0) / skus.length : 8000;
  const revenue = Math.round(leads * avgPrice * (0.6 + rnd() * 0.6));
  return {
    leadsDelivered: leads,
    revenueRouted: revenue,
    equivalentWalkInCAC: leads * 1200,
    customerServiceTickets: 14 + Math.floor(rnd() * 18),
    benchmarks: {
      leads: Math.round(leads * 0.18),    // walk-in equivalent
      revenue: Math.round(revenue * 0.22),
      cac: 0,                              // walk-in costs the supplier the CAC
      tickets: 0,                          // walk-in supplier handles all tickets
    },
  };
}
