'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e1b4b, #000)',
    }}>
      <div className="glass-card animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ marginBottom: '32px', textAlign: 'center', fontWeight: '800', fontSize: '2rem' }}>
          B2B <span style={{ color: 'var(--primary)' }}>Market</span>
        </h1>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {t('error_login') || 'Error'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">{t('phone_number')}</label>
            <input
              type="text"
              className="input-field"
              placeholder={t('placeholder_phone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">{t('password')}</label>
            <input
              type="password"
              className="input-field"
              placeholder={t('placeholder_pass')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
            {loading ? t('loading') : t('submit_login')}
          </button>
        </form>
      </div>
    </div>
  );
}
