'use client';

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!isOpen || !user) return null;

  const getRoleText = (role: string) => {
    if (role === 'ADMIN') return t('role_admin');
    if (role === 'SUPPLIER') return t('role_supplier');
    return t('role_retail');
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.7)', 
        backdropFilter: 'blur(5px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 2000 
      }} 
      onClick={onClose}
    >
      <div 
        className="glass-card" 
        style={{ width: '400px', padding: '32px' }} 
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '24px' }}>{t('profile_title')}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ marginBottom: '4px' }}>{t('your_name')}</label>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</p>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ marginBottom: '4px' }}>{t('your_phone')}</label>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{user.phone}</p>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ marginBottom: '4px' }}>{t('your_role')}</label>
            <p style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>
              {getRoleText(user.role)}
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '32px' }} 
          onClick={onClose}
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
