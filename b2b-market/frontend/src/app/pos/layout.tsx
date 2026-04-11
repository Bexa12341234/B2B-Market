'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'RETAIL')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'RETAIL') {
    return <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yuklanmoqda...</div>;
  }

  return (
    <div>
      <Sidebar />
      <main className="main-content animate-fade-in">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Kassa (POS)</h1>
            <p style={{ color: 'var(--muted)' }}>Tezkor savdo kalkulyatori va chek chiqarish.</p>
          </div>
          <div className="glass" style={{ padding: '8px 16px' }}>
            {user.name}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
