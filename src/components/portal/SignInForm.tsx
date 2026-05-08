'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Mail, Lock, ArrowRight, ArrowLeft} from 'lucide-react';
import {SUPPLIERS} from '@/data/products';
import {saveSession} from '@/lib/supplierAuth';

type Props = {
  onSignedIn: () => void;
  onSwitchToApply: () => void;
};

export function SignInForm({onSignedIn, onSwitchToApply}: Props) {
  const t = useTranslations('Portal.signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const valid = email.includes('@') && password.length >= 6;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setPending(true);
    // Demo auth: assign the user to one of our network suppliers based on
    // a hash of their email so each demo email "is" a different supplier.
    const idx = Math.abs(hashCode(email)) % SUPPLIERS.length;
    const supplier = SUPPLIERS[idx];
    await new Promise((r) => setTimeout(r, 600));
    saveSession({
      email,
      company: supplier.name,
      supplierId: supplier.id,
      signedInAt: Date.now(),
    });
    onSignedIn();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 p-8 md:p-10 bg-bone border border-ink-12 rounded-sm">
      <header className="flex flex-col gap-2 mb-2">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="font-serif font-bold" style={{fontSize: '28px', lineHeight: 1.15}}>{t('title')}</h2>
      </header>

      <Field label={t('emailLabel')} icon={<Mail className="h-4 w-4" />}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full px-3 py-3 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none"
        />
      </Field>

      <Field label={t('passwordLabel')} icon={<Lock className="h-4 w-4" />}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('passwordPlaceholder')}
          className="w-full px-3 py-3 bg-sand-100 border border-ink-20 rounded-sm focus:border-clay-700 focus:outline-none"
        />
      </Field>

      <a href="#" className="font-sans text-clay-700 hover:underline self-end" style={{fontSize: '13px'}} onClick={(e) => e.preventDefault()}>
        {t('forgot')}
      </a>

      <button
        type="submit"
        disabled={!valid || pending}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
      >
        {pending ? '…' : t('submit')}
        {!pending && (
          <>
            <ArrowRight className="rtl:hidden h-4 w-4" />
            <ArrowLeft className="hidden rtl:inline h-4 w-4" />
          </>
        )}
      </button>

      <div className="pt-3 border-t border-ink-12 flex items-center justify-between gap-3 flex-wrap font-sans" style={{fontSize: '13px'}}>
        <span className="text-ink-60">{t('noAccount')}</span>
        <button type="button" onClick={onSwitchToApply} className="text-clay-700 hover:underline">
          {t('applyLink')} →
        </button>
      </div>

      <p className="font-sans italic text-ink-60 text-center" style={{fontSize: '11px'}}>
        {t('demoNote')}
      </p>
    </form>
  );
}

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

function hashCode(s: string): number {
  let h = 0;
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return h;
}
