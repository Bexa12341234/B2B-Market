'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const adminLinks = [
    { name: t('dashboard'), href: '/admin' },
    { name: t('users'), href: '/admin/users' },
    { name: t('segments'), href: '/admin/segments' },
    { name: t('categories'), href: '/admin/categories' },
    { name: t('orders'), href: '/admin/orders' },
  ];

  const supplierLinks = [
    { name: t('dashboard'), href: '/supplier' },
    { name: t('my_products'), href: '/supplier/products' },
    { name: t('incoming_orders'), href: '/supplier/orders' },
  ];

  const retailLinks = [
    { name: t('catalog'), href: '/retail' },
    { name: t('my_orders'), href: '/retail/orders' },
    { name: t('pos'), href: '/retail/pos' },
    { name: t('history'), href: '/retail/history' },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'SUPPLIER' ? supplierLinks : retailLinks;
  const panelLabel = user.role === 'ADMIN' ? t('admin_panel') : user.role === 'SUPPLIER' ? t('supplier_panel') : t('retail_panel');

  return (
    <>
      <button 
        className="glass mobile-toggle-btn"
        style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '20px', 
          zIndex: 1001, 
          padding: '10px', 
          borderRadius: '10px',
          display: 'none', // Overridden by CSS or inline media query logic
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)' }}>B2B MARKET</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{panelLabel}</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: pathname === link.href ? 'white' : 'var(--muted)',
                background: pathname === link.href ? 'var(--primary)' : 'transparent',
                fontWeight: pathname === link.href ? '600' : '400',
                transition: 'all 0.2s',
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button className="btn" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} onClick={logout}>
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
}
