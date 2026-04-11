'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>B2B<span>Market</span></div>
        <div className={styles.navLinks}>
          <Link href="/login" className="btn btn-primary">{t('submit_login')}</Link>
        </div>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="animate-fade-in">{t('hero_title')}</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('hero_subtitle')}
          </p>
          
          <div className={styles.grid}>
            <div className={`${styles.card} glass-card animate-fade-in`} style={{ animationDelay: '0.2s' }}>
              <h3>{t('supplier_hero')}</h3>
              <p>{t('supplier_hero_desc')}</p>
              <Link href="/login" className={styles.cardLink}>{t('supplier_portal')} →</Link>
            </div>

            <div className={`${styles.card} glass-card animate-fade-in`} style={{ animationDelay: '0.3s' }}>
              <h3>{t('retail_hero')}</h3>
              <p>{t('retail_hero_desc')}</p>
              <Link href="/login" className={styles.cardLink}>{t('retail_portal')} →</Link>
            </div>

            <div className={`${styles.card} glass-card animate-fade-in`} style={{ animationDelay: '0.4s' }}>
              <h3>{t('admin_hero')}</h3>
              <p>{t('admin_hero_desc')}</p>
              <Link href="/login" className={styles.cardLink}>{t('dashboard')} →</Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
