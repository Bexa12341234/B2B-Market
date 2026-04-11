'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function SupplierDashboard() {
  const { t } = useLanguage();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('my_products')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>0</p>
      </div>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('active_offers')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>0</p>
      </div>
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>{t('new_orders')}</h3>
        <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>0</p>
      </div>
    </div>
  );
}
