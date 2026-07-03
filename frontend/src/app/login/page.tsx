'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      setError(err.message || 'Login gagal. Periksa kembali koneksi atau kredensial Anda.');
      setSubmitting(false);
    }
  };

  if (loading && !submitting) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-muted)' }}>Memuat sesi...</p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.loginCard} glass-panel`}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px' }}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#brandGradLogin)" fillOpacity="0.15" stroke="url(#brandGradLogin)" strokeWidth="2" />
            <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="url(#brandGradLogin)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 18C6 15.2386 8.23858 13 11 13H13C15.7614 13 18 15.2386 18 18" stroke="url(#brandGradLogin)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="brandGradLogin" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className={styles.title}>Si-karyawan</h1>
        <p className={styles.subtitle}>Masuk untuk mengelola data karyawan</p>

        {error && (
          <div className={styles.errorBox}>
            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="glass-input"
              placeholder="admin@karyawan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="glass-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} btn btn-primary`}
            disabled={submitting}
          >
            {submitting ? 'Menghubungkan...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
