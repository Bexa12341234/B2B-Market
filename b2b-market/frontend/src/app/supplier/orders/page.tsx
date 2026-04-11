'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/supplier`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        throw new Error("Error updating status");
      }
      fetchOrders();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>{t('customer_orders')}</h2>
      
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>{t('date_label')}</th>
                <th style={{ padding: '12px' }}>{t('client_shop')}</th>
                <th style={{ padding: '12px' }}>{t('total_amount')}</th>
                <th style={{ padding: '12px' }}>{t('status')}</th>
                <th style={{ padding: '12px' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px' }}>#{o.id}</td>
                  <td style={{ padding: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span 
                      style={{ cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline' }}
                      onClick={() => setSelectedRetailer(o.retail)}
                    >
                       {o.retail?.name || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>${o.total?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem',
                      background: o.status.toLowerCase() === 'pending' ? 'rgba(245, 158, 11, 0.1)' : o.status.toLowerCase() === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: o.status.toLowerCase() === 'pending' ? 'var(--accent)' : o.status.toLowerCase() === 'cancelled' ? 'var(--danger)' : 'var(--secondary)'
                    }}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {o.status.toLowerCase() === 'pending' && (
                        <>
                          <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => handleStatusUpdate(o.id, 'confirmed')}>{t('confirm_order')}</button>
                          <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={() => handleStatusUpdate(o.id, 'cancelled')}>{t('reject_order')}</button>
                        </>
                      )}
                      {o.status.toLowerCase() !== 'pending' && <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{t('no_actions')}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRetailer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedRetailer(null)}>
          <div className="glass-card" style={{ width: '400px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '24px' }}>{t('retailer_details')}</h3>
            <div className="input-group">
              <label className="input-label">{t('user_name')}</label>
              <p style={{ color: 'white' }}>{selectedRetailer.name}</p>
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_phone')}</label>
              <p style={{ color: 'white' }}>{selectedRetailer.phone || '-'}</p>
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_location')}</label>
              <p style={{ color: 'white' }}>{selectedRetailer.address || '-'}</p>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedRetailer(null)}>{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
