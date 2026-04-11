'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Order {
  id: number;
  status: string;
  retail: { name: string, phone: string, address: string };
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>{t('all_orders')}</h2>
      
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>{t('client_shop')}</th>
                <th style={{ padding: '12px' }}>{t('suppliers')}</th>
                <th style={{ padding: '12px' }}>{t('total_amount')}</th>
                <th style={{ padding: '12px' }}>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const total = o.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const uniqueSuppliers = Array.from(new Map(
                  o.items.map(i => [i.supplier?.id, i.supplier])
                ).values()).filter(Boolean);
                
                return (
                 <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                   <td style={{ padding: '12px' }}>#{o.id}</td>
                   <td style={{ padding: '12px' }}>
                     <span 
                       style={{ cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline' }}
                       onClick={() => setSelectedUser({ ...o.retail, title: t('client_shop') })}
                     >
                       {o.retail.name}
                     </span>
                   </td>
                   <td style={{ padding: '12px' }}>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                       {uniqueSuppliers.length > 0 ? uniqueSuppliers.map((s: any, idx) => (
                          <span 
                            key={idx}
                            style={{ cursor: 'pointer', color: 'var(--secondary)', textDecoration: 'underline' }}
                            onClick={() => setSelectedUser({ ...s, title: t('suppliers') })}
                          >
                            {s?.name}{idx < uniqueSuppliers.length - 1 ? ',' : ''}
                          </span>
                       )) : '-'}
                     </div>
                   </td>
                   <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>${total.toFixed(2)}</td>
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
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedUser(null)}>
          <div className="glass-card" style={{ width: '400px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '24px' }}>{selectedUser.title}</h3>
            <div className="input-group">
              <label className="input-label">{t('user_name')}</label>
              <p style={{ color: 'white' }}>{selectedUser.name}</p>
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_phone')}</label>
              <p style={{ color: 'white' }}>{selectedUser.phone || '-'}</p>
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_location')}</label>
              <p style={{ color: 'white' }}>{selectedUser.address || '-'}</p>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedUser(null)}>{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
