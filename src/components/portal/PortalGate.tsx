'use client';

import {useEffect, useState} from 'react';
import {loadSession, type SupplierSession} from '@/lib/supplierAuth';
import {PortalLanding} from './PortalLanding';
import {SupplierDashboard} from './SupplierDashboard';

type Props = {locale: string};

export function PortalGate({locale}: Props) {
  const [session, setSession] = useState<SupplierSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="min-h-[60vh]" />;

  if (session) {
    return <SupplierDashboard session={session} onSignOut={() => setSession(null)} locale={locale} />;
  }
  return <PortalLanding onSignedIn={() => setSession(loadSession())} />;
}
