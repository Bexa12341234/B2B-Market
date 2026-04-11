'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Segment {
  id: number;
  name: string;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');

  const fetchSegments = async () => {
    try {
      const res = await fetch(`/api/segments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSegments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, [token]);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setNewName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Segment) => {
    setIsEdit(true);
    setEditId(s.id);
    setNewName(s.name);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) return;
    try {
      if (isEdit && editId) {
        await fetch(`/api/admin/segments/${editId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ name: newName })
        });
      } else {
        await fetch(`/api/admin/segments`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ name: newName })
        });
      }
      setNewName('');
      setIsModalOpen(false);
      fetchSegments(); 
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{t('segments_list')}</h2>
          <button className="btn btn-primary" onClick={handleOpenAdd}>{t('add_new')}</button>
        </div>
        
        {loading ? (
          <p>{t('loading')}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>{t('name_label')}</th>
                <th style={{ padding: '12px' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {segments.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>#{s.id}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                  <td style={{ padding: '12px' }}>
                    <button className="btn" style={{ fontSize: '0.8rem', padding: '6px 12px', marginRight: '8px' }} onClick={() => handleOpenEdit(s)}>{t('edit')}</button>
                    <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} onClick={async () => {
                          try {
                            console.log("START DELETE ID:", s.id);
                            if (!token) { console.error("NO TOKEN!"); alert("Xatolik: Avtorizatsiya yo'q"); return; }
                            
                            const res = await fetch(`/api/admin/segments/${s.id}`, { 
                              method: 'DELETE', 
                              headers: { Authorization: `Bearer ${token}` } 
                            });
                            
                            console.log("STATUS:", res.status);
                            if (!res.ok) {
                              const errData = await res.json().catch(() => ({ message: "Server error" }));
                              throw new Error(errData.message || "Xatolik yuz berdi");
                            }
                            
                            console.log("SUCCESS");
                            fetchSegments();
                          } catch (err: any) {
                            console.error("ERROR:", err);
                            alert(err.message);
                          }
                    }}>{t('delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '400px', padding: '32px' }}>
            <h3 style={{ marginBottom: '24px' }}>{isEdit ? t('edit') : t('add_new')}</h3>
            <div className="input-group">
              <label className="input-label">{t('name_label')}</label>
              <input className="input-field" value={newName} onChange={e => setNewName(e.target.value)} />
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
