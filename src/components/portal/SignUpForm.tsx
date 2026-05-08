'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Building, User, Mail, Phone, MapPin, Calendar, Package, Check, ArrowRight, ArrowLeft} from 'lucide-react';

type Props = {
  onSwitchToSignIn: () => void;
};

export function SignUpForm({onSwitchToSignIn}: Props) {
  const t = useTranslations('Portal.signup');
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Riyadh');
  const [years, setYears] = useState('5');
  const [categories, setCategories] = useState<string[]>([]);
  const [capacity, setCapacity] = useState('50');
  const [exclusive, setExclusive] = useState<'yes' | 'no' | 'maybe'>('maybe');
  const [notes, setNotes] = useState('');

  const categoryOptions = t.raw('categoryOptions') as string[];
  const valid = companyName && contactName && email.includes('@') && phone.length >= 9 && categories.length > 0;

  function toggleCategory(c: string) {
    setCategories((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-5 p-10 bg-bone border border-ink-12 rounded-sm text-center items-center">
        <span className="inline-flex h-14 w-14 rounded-full bg-success/20 text-success items-center justify-center">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="font-serif font-bold" style={{fontSize: '26px'}}>{t('submittedTitle')}</h2>
        <p className="lede !text-ink-60 max-w-[440px]">{t('submittedBody')}</p>
        <button type="button" onClick={onSwitchToSignIn} className="btn-ghost mt-2">
          ← Already approved? Sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 p-8 md:p-10 bg-bone border border-ink-12 rounded-sm">
      <header className="flex flex-col gap-2 mb-2">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="font-serif font-bold" style={{fontSize: '28px', lineHeight: 1.15}}>{t('title')}</h2>
        <p className="body-text text-ink-60">{t('lede')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t('fields.companyName')} icon={<Building className="h-4 w-4" />}>
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('fields.contactName')} icon={<User className="h-4 w-4" />}>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('fields.email')} icon={<Mail className="h-4 w-4" />}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('fields.phone')} icon={<Phone className="h-4 w-4" />}>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('phonePlaceholder')} className={inputCls} />
        </Field>
        <Field label={t('fields.city')} icon={<MapPin className="h-4 w-4" />}>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
            <option>Riyadh</option><option>Jeddah</option><option>Dammam</option><option>Other</option>
          </select>
        </Field>
        <Field label={t('fields.yearsInBusiness')} icon={<Calendar className="h-4 w-4" />}>
          <input type="number" min="0" value={years} onChange={(e) => setYears(e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label={t('fields.categories')} icon={<Package className="h-4 w-4" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categoryOptions.map((c) => {
            const sel = categories.includes(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() => toggleCategory(c)}
                className={[
                  'py-2.5 px-3 rounded-sm border text-start transition-all',
                  sel ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-20 hover:border-ink-40',
                ].join(' ')}
                style={{fontSize: '13px'}}
              >
                {sel && <Check className="inline h-3 w-3 me-2" />}
                {c}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t('fields.monthlyCapacity')}>
          <input type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t('fields.willingExclusive')}>
          <div className="grid grid-cols-3 gap-2">
            {(['yes', 'maybe', 'no'] as const).map((k) => (
              <button
                type="button"
                key={k}
                onClick={() => setExclusive(k)}
                className={[
                  'py-2.5 rounded-sm border transition-all',
                  exclusive === k ? 'border-clay-700 bg-clay-700/5 text-clay-700' : 'border-ink-20 hover:border-ink-40',
                ].join(' ')}
                style={{fontSize: '12px'}}
              >
                {t(k)}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field label={t('fields.notes')}>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputCls + ' resize-none'}
        />
      </Field>

      <button
        type="submit"
        disabled={!valid}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mt-2"
      >
        {t('submit')}
        <ArrowRight className="rtl:hidden h-4 w-4" />
        <ArrowLeft className="hidden rtl:inline h-4 w-4" />
      </button>
    </form>
  );
}

const inputCls = 'w-full px-3 py-2.5 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none';

function Field({label, icon, children}: {label: string; icon?: React.ReactNode; children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans uppercase text-ink-60 inline-flex items-center gap-2" style={{fontSize: '11px', letterSpacing: '0.18em'}}>
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
