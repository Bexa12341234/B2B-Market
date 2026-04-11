'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  phone: string;
  name: string;
  role: string;
  segmentId?: number | null;
  address?: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const { token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ id: 0, name: '', phone: '', role: 'RETAIL', password: '', segmentId: '', address: '' });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);

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
    setForm({ id: 0, name: '', phone: '', role: 'RETAIL', password: '', segmentId: segments.length > 0 ? segments[0].id.toString() : '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setIsEdit(true);
    setForm({ 
      id: user.id, 
      name: user.name, 
      phone: user.phone, 
      role: user.role, 
      password: '', 
      segmentId: user.segmentId ? user.segmentId.toString() : (segments.length > 0 ? segments[0].id.toString() : ''),
      address: user.address || ''
    });
    setIsModalOpen(true);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS not available");
      return;
    }

    setForm(f => ({ ...f, address: 'Detecting...' }));

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ru`);
        const data = await res.json();
        const readableAddress = data.display_name || `${latitude}, ${longitude}`;
        setForm(f => ({ ...f, address: readableAddress }));
      } catch (err) {
        setForm(f => ({ ...f, address: `${latitude}, ${longitude}` }));
      }
    }, (err) => {
      setForm(f => ({ ...f, address: '' }));
    });
  };

  const handleSave = async () => {
    try {
      const payload: any = { name: form.name, phone: form.phone, role: form.role, address: form.address || null };
      if (form.role === 'RETAIL' && form.segmentId) {
        payload.segmentId = Number(form.segmentId);
      } else {
        payload.segmentId = null;
      }

      if (isEdit) {
        if (form.password) payload.password = form.password; 
        const res = await fetch(`/api/admin/users/${form.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Error editing user");
      } else {
        payload.password = form.password || 'password123';
        const res = await fetch(`/api/admin/users`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Error adding user");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const getSegmentName = (id: number | null | undefined) => {
    if (!id) return '-';
    const s = segments.find(x => x.id === id);
    return s ? s.name : '-';
  };

  return (
    <>
      <div className="glass-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{t('users_list')}</h2>
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
                  <th style={{ padding: '12px' }}>{t('user_name')}</th>
                  <th style={{ padding: '12px' }}>{t('user_phone')}</th>
                  <th style={{ padding: '12px' }}>{t('user_location')}</th>
                  <th style={{ padding: '12px' }}>{t('user_role')}</th>
                  <th style={{ padding: '12px' }}>{t('user_segment')}</th>
                  <th style={{ padding: '12px' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px' }}>#{u.id}</td>
                    <td style={{ padding: '12px' }}>{u.name}</td>
                    <td style={{ padding: '12px' }}>{u.phone}</td>
                    <td style={{ padding: '12px' }}>{u.address || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        background: u.role === 'ADMIN' ? 'rgba(245, 158, 11, 0.1)' : u.role === 'SUPPLIER' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        color: u.role === 'ADMIN' ? 'var(--accent)' : u.role === 'SUPPLIER' ? 'var(--secondary)' : 'var(--primary)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{u.role === 'RETAIL' ? getSegmentName(u.segmentId) : '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn" style={{ fontSize: '0.8rem', padding: '6px 12px', marginRight: '8px' }} onClick={() => handleOpenEdit(u)}>{t('edit')}</button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} onClick={async () => {
                            try {
                              console.log("START DELETE ID:", u.id);
                              if (!token) { console.error("NO TOKEN!"); alert("Xatolik: Avtorizatsiya yo'q"); return; }
                              
                              const res = await fetch(`/api/admin/users/${u.id}`, { 
                                method: 'DELETE', 
                                headers: { Authorization: `Bearer ${token}` } 
                              });
                              
                              console.log("STATUS:", res.status);
                              if (!res.ok) {
                                const errData = await res.json().catch(() => ({ message: "Server error" }));
                                throw new Error(errData.message || "Xatolik yuz berdi");
                              }
                              
                              console.log("SUCCESS");
                              fetchData();
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
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '400px', padding: '32px' }}>
            <h3 style={{ marginBottom: '24px' }}>{isEdit ? t('edit_user') : t('add_new_user')}</h3>
            
            <div className="input-group">
              <label className="input-label">{t('user_name')}</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_phone')}</label>
              <input type="text" className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+998..." />
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_location')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                   className="input-field" 
                   style={{ flex: 1 }}
                   value={form.address} 
                   onChange={e => setForm({...form, address: e.target.value})} 
                />
                <button className="btn" style={{ whiteSpace: 'nowrap', padding: '0 12px', fontSize: '0.8rem', background: 'var(--primary)', color: 'white' }} onClick={detectLocation}>
                  📍 {t('detect_location')}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">{t('user_role')}</label>
              <select className="input-field" style={{ background: '#111', color: 'white' }} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="RETAIL">RETAIL</option>
                <option value="SUPPLIER">SUPPLIER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            
            {form.role === 'RETAIL' && (
              <div className="input-group">
                <label className="input-label">{t('user_segment')}</label>
                <select className="input-field" style={{ background: '#111', color: 'white' }} value={form.segmentId} onChange={e => setForm({...form, segmentId: e.target.value})}>
                  {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">{isEdit ? t('new_password') : t('password')}</label>
              <input type="password" className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
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
