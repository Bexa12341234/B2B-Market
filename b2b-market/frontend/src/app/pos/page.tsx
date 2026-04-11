'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

interface POSItem {
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [items, setItems] = useState<POSItem[]>([]);

  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  const addItem = () => {
    if (!itemName || !price) return;
    setItems([...items, { name: itemName, price: parseFloat(price), quantity: parseInt(quantity) }]);
    setItemName('');
    setPrice('');
    setQuantity('1');
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', height: 'calc(100vh - 120px)' }}>
      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '32px' }}>Mahsulot qo'shish</h2>
        
        <div className="input-group">
          <label className="input-label">Nomi</label>
          <input className="input-field" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Yoki katalogdan izlash..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Narxi</label>
            <input type="number" className="input-field" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Miqdori</label>
            <input type="number" className="input-field" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px', height: '60px', fontSize: '1.2rem' }} onClick={addItem}>
          Chekga qo'shish
        </button>

        <div style={{ marginTop: '40px' }}>
          <button className="btn" style={{ width: '100%', border: '1px solid var(--glass-border)', color: 'var(--muted)' }} onClick={clear}>Hamasini tozalash</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', background: '#fff', color: '#000', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px dashed #eee', paddingBottom: '20px' }}>
          <h2 style={{ color: '#000' }}>CHEK #{(Math.random() * 100000).toFixed(0)}</h2>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>{new Date().toLocaleString()}</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.1rem' }}>
              <span>{item.name} x{item.quantity}</span>
              <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '4px double #000', paddingTop: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: '900' }}>
            <span>JAMI</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ marginTop: '40px', height: '60px' }}>CHEKNI CHOP ETISH (PRINT)</button>
      </div>
    </div>
  );
}
