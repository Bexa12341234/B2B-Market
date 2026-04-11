'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function RetailOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/retail`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>Mening buyurtmalarim</h2>
      
      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Sana</th>
                <th style={{ padding: '12px' }}>Yetkazib beruvchi</th>
                <th style={{ padding: '12px' }}>Summa</th>
                <th style={{ padding: '12px' }}>Holat</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const primarySupplier = o.items?.[0]?.supplier;
                
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }}>#{o.id}</td>
                    <td style={{ padding: '12px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        style={{ cursor: 'pointer', color: 'var(--primary)', textDecoration: 'underline' }}
                        onClick={() => setSelectedSupplier(primarySupplier)}
                      >
                        {primarySupplier?.name || 'Noma\'lum'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--secondary)' }}>${o.total?.toFixed(2)}</td>
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>Hozircha buyurtma qilmadingiz.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedSupplier && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedSupplier(null)}>
          <div className="glass-card" style={{ width: '400px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '24px' }}>Yetkazib beruvchi ma'lumotlari</h3>
            <div className="input-group">
              <label className="input-label">Nomi</label>
              <p style={{ color: 'white' }}>{selectedSupplier.name}</p>
            </div>
            <div className="input-group">
              <label className="input-label">Telefon raqami</label>
              <p style={{ color: 'white' }}>{selectedSupplier.phone || 'Aniqlanmagan'}</p>
            </div>
            <div className="input-group">
              <label className="input-label">Lokatsiyasi</label>
              <p style={{ color: 'white' }}>{selectedSupplier.address || 'Aniqlanmagan'}</p>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setSelectedSupplier(null)}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
}
