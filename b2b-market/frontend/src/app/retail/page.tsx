'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  imageUrl?: string;
  description?: string;
  supplierId: number;
  categoryId?: number;
  category?: { id: number, name: string };
}

export default function RetailCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const { token } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/products/catalog`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProducts(data);

        const catRes = await fetch(`/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const catData = await catRes.json();
        setCategories(catData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [token]);

  const updateQuantity = (product: Product, newQty: number) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== product.id));
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, { product, quantity: newQty }];
    });
  };

  const addToCart = (product: Product) => {
    const item = cart.find(i => i.product.id === product.id);
    updateQuantity(product, (item ? item.quantity : 0) + 1);
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      updateQuantity(item.product, item.quantity - 1);
    }
  };

  const getProductQuantity = (productId: number) => {
    return cart.find(i => i.product.id === productId)?.quantity || 0;
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategoryId 
      ? p.category?.id?.toString() === selectedCategoryId || p.categoryId?.toString() === selectedCategoryId 
      : true;
    return matchSearch && matchCategory;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const items = cart.map(i => ({
      productId: i.product.id,
      supplierId: i.product.supplierId,
      quantity: i.quantity,
      price: i.product.basePrice
    }));

    try {
      const res = await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ paymentType: 'cash', items })
      });
      if (!res.ok) throw new Error("Error ordering");
      
      alert("✅ OK!");
      setCart([]);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <>
      <div className="responsive-grid catalog-layout">
        <div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
            <input 
              className="input-field" 
              placeholder={t('search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: '200px', background: '#1a1a20' }}
            />
            <select 
              className="input-field" 
              value={selectedCategoryId} 
              onChange={e => setSelectedCategoryId(e.target.value)}
              style={{ width: '250px', flex: '0 1 auto', background: '#1a1a20' }}
            >
              <option value="">{t('all_categories')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((p: any) => (
              <div key={`${p.supplierId}-${p.id}`} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ background: '#000', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--muted)' }}>-</span>}
                </div>
                <div style={{ padding: '20px' }}>
                  <h4 style={{ marginBottom: '4px' }}>{p.name}</h4>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '12px' }}>{p.brand} {p.category && `• ${p.category.name}`}</p>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '12px' }}>
                      ${p.basePrice.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} 
                        onClick={() => setSelectedProduct(p)}
                      >
                        {t('details')}
                      </button>
                      
                      {getProductQuantity(p.id) > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2px 8px', border: '1px solid var(--glass-border)' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '1rem', minWidth: '28px', background: 'transparent' }} 
                            onClick={(e) => { e.stopPropagation(); removeFromCart(p.id); }}
                          >-</button>
                          <input 
                            type="number"
                            className="input-field"
                            value={getProductQuantity(p.id)}
                            onChange={(e) => { e.stopPropagation(); updateQuantity(p, Number(e.target.value)); }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: '40px', textAlign: 'center', background: 'transparent', border: 'none', color: 'white', marginBottom: 0, padding: 0, fontSize: '0.9rem' }}
                          />
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '1rem', minWidth: '28px' }} 
                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                          >+</button>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary" 
                          style={{ flex: 1.5, padding: '8px', fontSize: '0.8rem', whiteSpace: 'nowrap' }} 
                          onClick={() => addToCart(p)}
                        >
                          {t('add_to_cart')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', height: 'fit-content', position: 'sticky', top: '40px' }}>
          <h2 style={{ marginBottom: '24px' }}>{t('your_order')}</h2>
          {cart.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>{t('cart_empty')}</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                {cart.map(item => {
                  return (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500' }}>{item.product.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.quantity} x ${item.product.basePrice.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => removeFromCart(item.product.id)}>-</button>
                        <button className="btn btn-primary" style={{ padding: '2px 8px' }} onClick={() => addToCart(item.product)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem' }}>
                  <span>{t('total')}</span>
                  <span>${cart.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0).toFixed(2)}</span>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} onClick={handleCheckout}>{t('save')}</button>
            </>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedProduct(null)}>
          <div className="glass-card" style={{ width: '500px', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '300px', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {selectedProduct.imageUrl ? (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--muted)' }}>-</span>
              )}
            </div>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ marginBottom: '4px' }}>{selectedProduct.name}</h2>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedProduct.brand} {selectedProduct.category && `• ${selectedProduct.category.name}`}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>
                  ${selectedProduct.basePrice.toFixed(2)}
                </div>
              </div>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                {selectedProduct.description || "-"}
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>{t('add_to_cart')}</button>
                <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>{t('close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
