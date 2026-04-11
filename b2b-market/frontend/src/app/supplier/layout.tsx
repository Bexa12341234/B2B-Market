'use client';

import ProfileModal from '@/components/ProfileModal';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'SUPPLIER')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'SUPPLIER') {
    return <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('loading')}</div>;
  }

  return (
    <div>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{t('supplier_panel')}</h1>
            <p style={{ color: 'var(--muted)' }}>{t('my_products')} & {t('incoming_orders')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              className="glass" 
              style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '12px' }}
              onClick={() => setIsProfileOpen(true)}
            >
              {user.name}
            </div>
          </div>
        </header>

        <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        {children}
      </main>
    </div>
  );
}
