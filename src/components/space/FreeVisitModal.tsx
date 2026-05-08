'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {X, MapPin, Phone, Calendar} from 'lucide-react';
import type {VisitBooking} from '@/lib/spaceStore';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (b: VisitBooking) => void;
};

export function FreeVisitModal({open, onClose, onConfirm}: Props) {
  const t = useTranslations('Space.visitModal');
  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [day, setDay] = useState<'today' | 'tomorrow' | 'afterTomorrow'>('tomorrow');
  const [slot, setSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;
  const cities = t.raw('cities') as string[];
  if (!city && cities[0]) setCity(cities[0]);

  const valid = city && address.length > 5 && phone.length >= 9;

  function submit() {
    onConfirm({city, address, phone, day, slot, bookedAt: Date.now()});
    setConfirmed(true);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className="relative w-full max-w-[560px] bg-sand-100 rounded-sm border border-ink-12 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 text-ink-60 hover:text-clay-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {confirmed ? (
          <div className="p-10 md:p-12 flex flex-col gap-5 text-center">
            <span className="eyebrow mx-auto">{t('confirmedTitle')}</span>
            <h3 className="h-section">{t('confirmedTitle')}</h3>
            <p className="lede">{t('confirmedBody')}</p>
            <button onClick={onClose} className="btn-primary mt-4 self-center">
              {t('close')}
            </button>
          </div>
        ) : (
          <div className="p-8 md:p-10 flex flex-col gap-6">
            <header className="flex flex-col gap-3">
              <span className="eyebrow">{t('title')}</span>
              <h3 className="font-serif font-bold" style={{fontSize: '28px', lineHeight: 1.15}}>{t('title')}</h3>
              <p className="body-text text-ink-60">{t('lede')}</p>
            </header>

            <div className="flex flex-col gap-4">
              <Field label={t('cityLabel')}>
                <div className="grid grid-cols-3 gap-2">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCity(c)}
                      className={[
                        'py-2.5 rounded-sm border text-sm font-medium transition-all',
                        city === c
                          ? 'border-clay-700 bg-clay-700/5 text-clay-700'
                          : 'border-ink-20 hover:border-ink-40 text-ink',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t('addressLabel')} icon={<MapPin className="h-4 w-4" />}>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('addressPlaceholder')}
                  className="w-full px-3 py-3 bg-bone border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none transition-colors"
                />
              </Field>

              <Field label={t('phoneLabel')} icon={<Phone className="h-4 w-4" />}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('phonePlaceholder')}
                  className="w-full px-3 py-3 bg-bone border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none transition-colors"
                />
              </Field>

              <Field label={t('slotLabel')} icon={<Calendar className="h-4 w-4" />}>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(['today', 'tomorrow', 'afterTomorrow'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDay(d)}
                      className={[
                        'py-2.5 rounded-sm border font-medium transition-all',
                        day === d
                          ? 'border-clay-700 bg-clay-700/5 text-clay-700'
                          : 'border-ink-20 hover:border-ink-40 text-ink',
                      ].join(' ')}
                      style={{fontSize: '13px'}}
                    >
                      {t(d)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={[
                        'py-2 rounded-sm border transition-all',
                        slot === s
                          ? 'border-clay-700 bg-clay-700/5 text-clay-700'
                          : 'border-ink-20 hover:border-ink-40 text-ink-60',
                      ].join(' ')}
                      style={{fontSize: '12px'}}
                    >
                      {t(s === 'morning' ? 'slotMorning' : s === 'afternoon' ? 'slotAfternoon' : 'slotEvening')}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              <button onClick={submit} disabled={!valid} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed flex-1 sm:flex-none">
                {t('submit')}
              </button>
              <button onClick={onClose} className="btn-ghost flex-1 sm:flex-none">
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({label, icon, children}: {label: string; icon?: React.ReactNode; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans uppercase text-ink-60 flex items-center gap-2" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
