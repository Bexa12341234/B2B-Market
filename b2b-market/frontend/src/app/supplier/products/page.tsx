'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', brand: '', basePrice: '', categoryId: '', imageUrl: '', description: '', segmentIds: [] as number[] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/products/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);

      const catRes = await fetch(`/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const catData = await catRes.json();
      setCategories(catData);

      const segRes = await fetch(`/api/segments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const segData = await segRes.json();
      setSegments(segData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setForm({ 
      name: '', 
      brand: '', 
      basePrice: '', 
      categoryId: categories.length > 0 ? categories[0].id.toString() : '', 
      imageUrl: '', 
      description: '',
      segmentIds: [] 
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setIsEdit(true);
    setEditId(p.id);
    setForm({ 
      name: p.name, 
      brand: p.brand || '', 
      basePrice: p.basePrice.toString(), 
      categoryId: p.categoryId.toString(), 
      imageUrl: p.imageUrl || '', 
      description: p.description || '',
      segmentIds: p.segments ? p.segments.map((s: any) => s.id) : [] 
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!form.categoryId) {
        alert("Category required");
        return;
      }
      
      const payload = { 
        name: form.name, 
        brand: form.brand, 
        basePrice: parseFloat(form.basePrice), 
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
        segmentIds: form.segmentIds
      };

      let res;
      if (isEdit && editId) {
        res = await fetch(`/api/products/${editId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
      }
      
      if (!res.ok) throw new Error("Error saving");

      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if(confirm(t('delete') + "?")) {
        const res = await fetch(`/api/products/${id}`, { 
          method: 'DELETE', 
          headers: { Authorization: `Bearer ${token}` } 
        });
        fetchData();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSegmentToggle = (id: number) => {
    setForm(prev => {
      const newIds = prev.segmentIds.includes(id) 
        ? prev.segmentIds.filter(x => x !== id)
        : [...prev.segmentIds, id];
      return { ...prev, segmentIds: newIds };
    });
  };

  return (
    <>
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{t('my_products')}</h2>
          <button className="btn btn-primary" onClick={handleOpenAdd}>{t('add_new')}</button>
        </div>
        
        {loading ? (
          <p>{t('loading')}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>{t('image_label')}</th>
                  <th style={{ padding: '12px' }}>{t('name_label')}</th>
                  <th style={{ padding: '12px' }}>{t('categories_list')}</th>
                  <th style={{ padding: '12px' }}>{t('cost')} ($)</th>
                  <th style={{ padding: '12px' }}>{t('limit_segment')}</th>
                  <th style={{ padding: '12px' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }}>#{p.id}</td>
                    <td style={{ padding: '12px' }}>
                      {p.imageUrl ? <img src={p.imageUrl} alt="img" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : '-'}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ padding: '12px' }}>{p.category?.name || '-'}</td>
                    <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>${p.basePrice}</td>
                    <td style={{ padding: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      {p.segments && p.segments.length > 0 
                        ? <span style={{color: 'var(--foreground)'}}>{p.segments.length} segments</span>
                        : <span style={{color: 'var(--success)'}}>{t('visible_to_all')}</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '8px' }} onClick={() => handleOpenEdit(p)}>{t('edit')}</button>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} onClick={() => handleDelete(p.id)}>{t('delete')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '450px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '24px', color: 'white' }}>{isEdit ? t('edit') : t('add_new')}</h3>
            
            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--muted)' }}>{t('name_label')}</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: 'var(--muted)' }}>{t('categories_list')}</label>
              <select className="input-field" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}>
                {categories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#1e1e23' }}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Brend</label>
              <input className="input-field" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
            </div>

            <div className="input-group">
              <label className="input-label">{t('details')}</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <label className="input-label">{t('limit_segment')}</label>
              <div 
                className="input-field" 
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {form.segmentIds.length > 0 
                    ? `${form.segmentIds.length} segments` 
                    : t('visible_to_all')}
                </span>
                <span>▼</span>
              </div>
              
              {isDropdownOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', left: 0, right: 0, 
                  background: '#1a1a20', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', padding: '12px', zIndex: 10, marginTop: '4px', maxHeight: '200px', overflowY: 'auto'
                }}>
                  {segments.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.segmentIds.includes(s.id)} onChange={() => handleSegmentToggle(s.id)} />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">{t('cost')} ($)</label>
              <input type="number" className="input-field" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} />
            </div>

            <div className="input-group">
              <label className="input-label">{t('image_label')}</label>
              <input type="file" accept="image/*" className="input-field" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setForm(prev => ({...prev, imageUrl: event.target?.result as string}));
                  };
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>{t('save')}</button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
