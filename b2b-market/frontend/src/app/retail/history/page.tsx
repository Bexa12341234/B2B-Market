'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function SalesHistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/pos/sessions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <h2 style={{ marginBottom: '24px' }}>{t('sales_history_archive')}</h2>
      
      {loading ? (
        <p>{t('loading')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sessions.map(session => {
            const totalCost = (session.items || []).reduce((sum: number, i: any) => sum + ((i.costPrice || 0) * (i.quantity || 0)), 0);
            const totalSale = (session.items || []).reduce((sum: number, i: any) => sum + (i.total || 0), 0);
            const totalProfit = totalSale - totalCost;

            return (
              <div key={session.id} className="glass-card animate-fade-in" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'rgba(30, 30, 35, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>{t('sale_number')} #{session.id}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(session.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>+${(totalProfit || 0).toFixed(2)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>{t('profit')}</div>
                  </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--muted)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '8px' }}>{t('name_label')}</th>
                      <th style={{ padding: '8px' }}>{t('cost')}</th>
                      <th style={{ padding: '8px' }}>{t('markup')}</th>
                      <th style={{ padding: '8px' }}>{t('price')}</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>{t('total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(session.items || []).map((item: any) => {
                      const cost = item.costPrice || 0;
                      const price = item.price || 0;
                      const markupPct = cost > 0 ? ((price - cost) / cost * 100).toFixed(0) : '0';
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '12px 8px' }}>
                            {item.productName} 
                            <span style={{ marginLeft: '8px', color: 'var(--muted)', fontSize: '0.8rem' }}>x{item.quantity || 0}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>${cost.toFixed(2)}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>+{markupPct}%</td>
                          <td style={{ padding: '12px 8px' }}>${price.toFixed(2)}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>${(item.total || 0).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t('total_cost_price')}</div>
                    <div style={{ fontWeight: '600' }}>${totalCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t('final_price')}</div>
                    <div style={{ fontWeight: '600' }}>${totalSale.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t('profit')}</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>+${totalProfit.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
