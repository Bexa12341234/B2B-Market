'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, segments: 0, orders: 0 });
  const { token } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Fetch dashboard data
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = await res.json();

        const segRes = await fetch(`/api/segments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const segments = await segRes.json();

        setStats({ 
          users: users.length, 
          segments: segments.length,
          orders: 0
        });
      } catch (e) {}
    };
    fetchStats();
  }, [token]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('total_users')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.users}</p>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('active_segments')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.segments}</p>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('total_orders')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.orders}</p>
      </div>

      <div className="glass-card" style={{ padding: '32px', gridColumn: '1 / -1' }}>
        <h2 style={{ marginBottom: '24px' }}>{t('quick_actions')}</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => router.push('/admin/users')}>{t('add_new_user')}</button>
          <button className="btn btn-primary" onClick={() => router.push('/admin/segments')}>{t('add_segment')}</button>
          <button className="btn btn-primary" onClick={() => router.push('/admin/categories')}>{t('add_category')}</button>
          <button className="btn btn-secondary" onClick={() => alert('Modul hozirda tayyorlanmoqda!')}>{t('system_log')}</button>
        </div>
      </div>
    </div>
  );
}
