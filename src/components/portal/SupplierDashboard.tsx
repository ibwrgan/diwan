'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {LogOut, ShoppingBag, FileText, BarChart3, FileLock2, Truck, AlertCircle, CheckCircle2, Sparkles} from 'lucide-react';
import {SUPPLIERS, SKUS, supplierById} from '@/data/products';
import {ordersFor, performanceFor, type SupplierOrder} from '@/data/supplierMockData';
import {clearSession, type SupplierSession} from '@/lib/supplierAuth';

type Props = {
  session: SupplierSession;
  onSignOut: () => void;
  locale: string;
};

type Tab = 'orders' | 'pricing' | 'performance' | 'documents';

export function SupplierDashboard({session, onSignOut, locale}: Props) {
  const t = useTranslations('Portal.dashboard');
  const [tab, setTab] = useState<Tab>('orders');
  const [filter, setFilter] = useState<'all' | SupplierOrder['status']>('all');

  const supplier = supplierById(session.supplierId)!;
  const orders = useMemo(() => ordersFor(session.supplierId), [session.supplierId]);
  const perf = useMemo(() => performanceFor(session.supplierId), [session.supplierId]);
  const skus = useMemo(() => SKUS.filter((s) => s.supplierId === session.supplierId), [session.supplierId]);

  const fmt = (n: number) => n.toLocaleString('en-US');
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  function logout() {
    clearSession();
    onSignOut();
  }

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Greeting + sign out */}
        <header className="flex flex-wrap items-center justify-between gap-6 pb-8 mb-8 border-b border-ink-12">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Diwan Supplier Portal</span>
            <h1 className="h-display" style={{fontSize: 'clamp(28px, 4vw, 40px)'}}>{t('greeting', {company: supplier.name})}</h1>
            <p className="font-sans uppercase text-ink-60" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
              {supplier.city} · {supplier.diwanExclusive ? 'Diwan-exclusive partner' : 'Network supplier'} · {supplier.leadTimeDays}-day lead time
            </p>
          </div>
          <button onClick={logout} className="btn-ghost !py-2.5 !px-5 inline-flex items-center gap-2" style={{fontSize: '12px'}}>
            <LogOut className="h-4 w-4" />
            {t('signOut')}
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 border-b border-ink-12 -mb-px">
          {([
            {k: 'orders' as Tab,      icon: ShoppingBag, label: t('tabs.orders'),      badge: orders.filter((o) => o.status === 'pending').length},
            {k: 'pricing' as Tab,     icon: FileLock2,   label: t('tabs.pricing'),     badge: skus.length},
            {k: 'performance' as Tab, icon: BarChart3,   label: t('tabs.performance'), badge: 0},
            {k: 'documents' as Tab,   icon: FileText,    label: t('tabs.documents'),   badge: 5},
          ]).map((x) => {
            const active = tab === x.k;
            return (
              <button
                key={x.k}
                onClick={() => setTab(x.k)}
                className={[
                  'inline-flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors',
                  active ? 'border-clay-700 text-clay-700' : 'border-transparent text-ink-60 hover:text-ink',
                ].join(' ')}
              >
                <x.icon className="h-4 w-4" />
                <span className="font-sans uppercase" style={{fontSize: '11px', letterSpacing: '0.18em'}}>{x.label}</span>
                {x.badge > 0 && (
                  <span
                    className={`tabular px-2 py-0.5 rounded-full ${active ? 'bg-clay-700 text-sand-100' : 'bg-ink-12 text-ink-60'}`}
                    style={{fontSize: '10px'}}
                  >
                    {x.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-10">
          {tab === 'orders' && (
            <OrdersView orders={orders} filtered={filtered} filter={filter} setFilter={setFilter} fmt={fmt} t={t} />
          )}
          {tab === 'pricing' && <PricingView skus={skus} fmt={fmt} t={t} />}
          {tab === 'performance' && <PerformanceView perf={perf} fmt={fmt} t={t} />}
          {tab === 'documents' && <DocumentsView t={t} />}
        </div>
      </div>
    </section>
  );
}

function OrdersView({orders, filtered, filter, setFilter, fmt, t}: any) {
  const filters = ['all', 'pending', 'inProgress', 'ready', 'delivered'] as const;
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="h-section" style={{fontSize: '32px'}}>{t('orders.title')}</h2>
        <p className="lede !text-ink-60 max-w-[640px]">{t('orders.subtitle')}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === 'all' ? orders.length : orders.filter((o: SupplierOrder) => o.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-sans uppercase transition-all',
                filter === f ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-12 text-ink-60 hover:border-ink-40',
              ].join(' ')}
              style={{fontSize: '11px', letterSpacing: '0.18em'}}
            >
              {t(`orders.filter.${f}`)}
              <span className="tabular">{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((o: SupplierOrder) => {
          const total = o.items.reduce((s, it) => {
            const sku = SKUS.find((x) => x.id === it.skuId);
            return s + (sku?.diwanCost ?? 0) * it.qty;
          }, 0);
          const overdue = o.deadlineDays < 0;
          return (
            <li key={o.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 border border-ink-12 rounded-sm bg-bone items-center">
              <div className="md:col-span-3 flex flex-col gap-1">
                <span className="font-serif font-bold" style={{fontSize: '16px'}}>{o.id}</span>
                <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>
                  {o.city} · received {o.receivedDays}d ago
                </span>
              </div>
              <div className="md:col-span-3 flex flex-col gap-0.5">
                <span className="font-sans" style={{fontSize: '13px'}}>{o.items.length} item{o.items.length === 1 ? '' : 's'}</span>
                <span className="font-sans text-ink-60" style={{fontSize: '11px'}}>
                  {o.items.slice(0, 2).map((it) => `${it.qty}× ${SKUS.find((s) => s.id === it.skuId)?.category ?? '—'}`).join(', ')}
                  {o.items.length > 2 && ` +${o.items.length - 2}`}
                </span>
              </div>
              <div className="md:col-span-2 font-serif font-bold tabular text-clay-700" style={{fontSize: '17px'}}>
                SAR {fmt(total)}
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                {overdue ? (
                  <AlertCircle className="h-4 w-4 text-error" />
                ) : (
                  <Truck className="h-4 w-4 text-clay-700" />
                )}
                <span className={`font-sans tabular ${overdue ? 'text-error' : 'text-ink'}`} style={{fontSize: '13px'}}>
                  {overdue ? `${Math.abs(o.deadlineDays)}d overdue` : `${o.deadlineDays}d left`}
                </span>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <StatusBadge status={o.status} t={t} />
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="p-10 text-center font-serif italic text-ink-60 border border-ink-12 rounded-sm bg-bone">
            No orders in this view yet.
          </li>
        )}
      </ul>
    </div>
  );
}

function StatusBadge({status, t}: {status: SupplierOrder['status']; t: any}) {
  const map: Record<SupplierOrder['status'], {bg: string; text: string; label: string}> = {
    pending:    {bg: 'bg-warning/15',  text: 'text-warning', label: t('orders.filter.pending')},
    inProgress: {bg: 'bg-info/15',     text: 'text-info',    label: t('orders.filter.inProgress')},
    ready:      {bg: 'bg-clay-700/15', text: 'text-clay-700',label: t('orders.filter.ready')},
    delivered:  {bg: 'bg-success/15',  text: 'text-success', label: t('orders.filter.delivered')},
  };
  const m = map[status];
  return (
    <span
      className={`font-sans uppercase px-3 py-1 rounded-full ${m.bg} ${m.text}`}
      style={{fontSize: '10px', letterSpacing: '0.16em'}}
    >
      {m.label}
    </span>
  );
}

function PricingView({skus, fmt, t}: any) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="h-section" style={{fontSize: '32px'}}>{t('pricing.title')}</h2>
        <p className="lede !text-ink-60 max-w-[640px]">{t('pricing.subtitle')}</p>
      </header>
      <div className="border border-ink-12 rounded-sm overflow-hidden bg-bone">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-ink-12 bg-sand-100/40 font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>
          <span className="col-span-4">{t('pricing.columns.sku')}</span>
          <span className="col-span-2">{t('pricing.columns.unitPrice')}</span>
          <span className="col-span-2">{t('pricing.columns.yourCost')}</span>
          <span className="col-span-2">{t('pricing.columns.margin')}</span>
          <span className="col-span-2 text-end">{t('pricing.columns.monthlyCap')}</span>
        </div>
        {skus.map((s: any, i: number) => {
          const margin = s.diwanPrice - s.diwanCost;
          return (
            <div key={s.id} className={`grid grid-cols-12 gap-3 px-5 py-3 items-center ${i !== skus.length - 1 ? 'border-b border-ink-12' : ''}`}>
              <div className="col-span-4 flex flex-col gap-0.5">
                <span className="font-serif font-bold" style={{fontSize: '14px'}}>{s.name}</span>
                <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.14em'}}>{s.id} · {s.category}</span>
              </div>
              <div className="col-span-2 font-serif font-bold tabular text-clay-700" style={{fontSize: '14px'}}>SAR {fmt(s.diwanPrice)}</div>
              <div className="col-span-2 font-sans tabular text-ink-60" style={{fontSize: '13px'}}>SAR {fmt(s.diwanCost)}</div>
              <div className="col-span-2 font-sans tabular text-success" style={{fontSize: '13px'}}>SAR {fmt(margin)}</div>
              <div className="col-span-2 text-end flex justify-end">
                <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-success/15 text-success" style={{fontSize: '10px', letterSpacing: '0.14em'}}>
                  Active
                </span>
              </div>
            </div>
          );
        })}
        {skus.length === 0 && (
          <div className="p-10 text-center font-serif italic text-ink-60">No SKUs configured yet.</div>
        )}
      </div>
    </div>
  );
}

function PerformanceView({perf, fmt, t}: any) {
  const cards = [
    {k: 'leads',   value: perf.leadsDelivered,        bench: perf.benchmarks.leads,   unit: t('performance.metrics.leads.unit'),   label: t('performance.metrics.leads.label')},
    {k: 'revenue', value: perf.revenueRouted,         bench: perf.benchmarks.revenue, unit: t('performance.metrics.revenue.unit'), label: t('performance.metrics.revenue.label')},
    {k: 'cac',     value: perf.equivalentWalkInCAC,   bench: 0,                       unit: t('performance.metrics.cac.unit'),     label: t('performance.metrics.cac.label')},
    {k: 'tickets', value: perf.customerServiceTickets,bench: 0,                       unit: t('performance.metrics.tickets.unit'), label: t('performance.metrics.tickets.label')},
  ];
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="h-section" style={{fontSize: '32px'}}>{t('performance.title')}</h2>
        <p className="lede !text-ink-60 max-w-[640px]">{t('performance.subtitle')}</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <article key={c.k} className="flex flex-col gap-3 p-6 bg-bone border border-ink-12 rounded-sm">
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>{c.label}</span>
            <span className="font-serif font-bold tabular text-clay-700" style={{fontSize: '34px', lineHeight: 1}}>
              {fmt(c.value)}
            </span>
            <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.18em'}}>{c.unit}</span>
            <hr className="rule my-1" />
            <div className="flex justify-between items-baseline">
              <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>{t('performance.vsBench')}</span>
              <span className="font-sans tabular text-ink-60" style={{fontSize: '13px'}}>{fmt(c.bench)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DocumentsView({t}: {t: any}) {
  const items = t.raw('documents.items') as Array<{k: string; name: string; status: string; date: string}>;
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="h-section" style={{fontSize: '32px'}}>{t('documents.title')}</h2>
        <p className="lede !text-ink-60 max-w-[640px]">{t('documents.subtitle')}</p>
      </header>
      <ul className="flex flex-col divide-y divide-ink-12 border border-ink-12 rounded-sm bg-bone">
        {items.map((it) => (
          <li key={it.k} className="grid grid-cols-12 gap-3 px-5 py-4 items-center">
            <div className="col-span-1">
              <FileText className="h-4 w-4 text-clay-700" />
            </div>
            <div className="col-span-7 flex flex-col gap-0.5">
              <span className="font-serif font-bold" style={{fontSize: '15px'}}>{it.name}</span>
              <span className="font-sans uppercase text-ink-60" style={{fontSize: '10px', letterSpacing: '0.16em'}}>{it.date}</span>
            </div>
            <div className="col-span-2">
              <span className="font-sans uppercase px-2 py-0.5 rounded-full bg-success/15 text-success" style={{fontSize: '10px', letterSpacing: '0.14em'}}>
                <CheckCircle2 className="inline h-3 w-3 me-1" />
                {it.status}
              </span>
            </div>
            <div className="col-span-2 flex justify-end">
              <button className="btn-ghost !py-2 !px-4" style={{fontSize: '11px'}}>Download</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
