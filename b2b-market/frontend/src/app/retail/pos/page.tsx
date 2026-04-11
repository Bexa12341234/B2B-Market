'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  brand: string;
  purchasedPrice: number;
  imageUrl?: string;
  category?: { name: string };
  totalPurchasedQuantity: number;
  currentStock: number;
}

export default function POSPage() {
  const [stock, setStock] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [markup, setMarkup] = useState(20);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMarkupLoaded, setIsMarkupLoaded] = useState(false);

  // 1. Load markup from localStorage
  useEffect(() => {
    const savedMarkup = localStorage.getItem('pos_markup');
    if (savedMarkup) {
      setMarkup(Number(savedMarkup));
    }
    setIsMarkupLoaded(true);
  }, []);

  // 2. Save markup ONLY after it has been loaded and then changed
  useEffect(() => {
    if (isMarkupLoaded) {
      localStorage.setItem('pos_markup', markup.toString());
    }
  }, [markup, isMarkupLoaded]);

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/pos/stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStock(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [token]);

  const updateQuantity = (productId: number, newQty: number) => {
    const product = stock.find(p => p.id === productId);
    if (!product) return;

    if (newQty > product.currentStock) {
      alert(`Omborda yetarli emas! Mavjud: ${product.currentStock}`);
      newQty = product.currentStock;
    }

    if (newQty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item => item.product.id === productId ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { product, quantity: newQty }];
    });
  };

  const addToCart = (product: Product) => {
    const item = cart.find(i => i.product.id === product.id);
    updateQuantity(product.id, (item ? item.quantity : 0) + 1);
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const filteredStock = stock.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

  const subtotal = cart.reduce((sum, item) => sum + (item.product.purchasedPrice * item.quantity), 0);
  const markupAmount = (subtotal * markup) / 100;
  const total = subtotal + markupAmount;

  const handleFinishSale = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch('/api/pos/sessions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            costPrice: item.product.purchasedPrice,
            price: item.product.purchasedPrice * (1 + markup / 100)
          }))
        })
      });
      if (!res.ok) throw new Error("Error finishing sale");
      alert("✅ OK!");
      setCart([]);
      fetchStock(); // Refresh stock immediately after sale
    } catch (e: any) {
      alert(e.message);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="responsive-grid pos-layout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingRight: '10px' }}>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', position: 'sticky', top: '0', zIndex: 5 }}>
          <input 
            className="input-field" 
            placeholder={t('search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
          {loading ? (
            <p>{t('loading')}</p>
          ) : filteredStock.map(p => (
            <div key={p.id} className="glass-card animate-fade-in" style={{ padding: '0', cursor: p.currentStock > 0 ? 'pointer' : 'not-allowed', overflow: 'hidden', border: cart.find(i => i.product.id === p.id) ? '2px solid var(--secondary)' : '1px solid var(--glass-border)', opacity: p.currentStock > 0 ? 1 : 0.6 }} onClick={() => p.currentStock > 0 && addToCart(p)}>
              <div style={{ height: '120px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--muted)' }}>📦</span>}
                {p.currentStock <= 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>TUGADI</div>}
              </div>
              <div style={{ padding: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>{p.name}</h5>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: '0 0 8px 0' }}>{p.brand}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>${(p.purchasedPrice * (1 + markup/100)).toFixed(2)}</span>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: p.currentStock < 5 ? 'var(--danger)' : 'var(--muted)' }}>{p.currentStock} dona</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{t('cart_pos')}</h3>
          <button 
            className="btn" 
            style={{ padding: '4px 8px', fontSize: '1.2rem', background: 'transparent' }} 
            onClick={() => setIsSettingsOpen(true)}
          >
            ⚙️
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cart.map(item => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.product.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>${(item.product.purchasedPrice * (1 + markup/100)).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => removeFromCart(item.product.id)}>-</button>
                <input 
                  type="number"
                  className="input-field"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                  style={{ 
                    width: '50px', 
                    textAlign: 'center', 
                    padding: '4px', 
                    marginBottom: 0,
                    fontSize: '0.9rem',
                    background: 'rgba(255,255,255,0.05)'
                  }}
                />
                <button className="btn btn-primary" style={{ padding: '2px 8px' }} onClick={() => addToCart(item.product)}> + </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontStyle: 'italic' }}>
              {t('select_product')}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: '800', marginTop: '8px' }}>
            <span>{t('total')}:</span>
            <span style={{ color: 'var(--secondary)' }}>${total.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '20px', padding: '16px', fontSize: '1.2rem' }}
            disabled={cart.length === 0}
            onClick={handleFinishSale}
          >
            {t('finish_sale')}
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsSettingsOpen(false)}>
          <div className="glass-card" style={{ width: '350px', padding: '32px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '24px' }}>{t('pos_settings')}</h3>
            <div className="input-group">
              <label className="input-label">{t('markup')} %</label>
              <input 
                type="number" 
                className="input-field" 
                value={markup} 
                onChange={e => setMarkup(Number(e.target.value))}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{t('total_cost_price')}:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--muted)' }}>{t('profit')} ({markup}%):</span>
                <span style={{ color: 'var(--secondary)' }}>+${markupAmount.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{t('final_price')}:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '8px', marginBottom: '16px' }}>
              {t('markup_helper')}
            </p>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setIsSettingsOpen(false)}>{t('save')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
