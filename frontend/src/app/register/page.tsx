'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/components/Notification';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});
    setSubmitting(true);

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      setSubmitting(false);
      return;
    }

    try {
      await register(name, email, password, passwordConfirmation);
      setNotification({ message: 'Registrasi berhasil! Mengalihkan ke halaman login...', type: 'success' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorObj = err as any;
      console.error(errorObj);
      
      // Jika ada error validasi detail dari server
      if (errorObj.response && errorObj.response.status === 422) {
        setValidationErrors(errorObj.response.data.errors || {});
      } else {
        setError(errorObj.message || 'Registrasi gagal. Silakan periksa kembali data Anda.');
      }
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
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={`${styles.loginCard} glass-panel`}>
        {/* Logo Brand */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px' }}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#brandGradRegister)" fillOpacity="0.15" stroke="url(#brandGradRegister)" strokeWidth="2" />
            <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="url(#brandGradRegister)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 18C6 15.2386 8.23858 13 11 13H13C15.7614 13 18 15.2386 18 18" stroke="url(#brandGradRegister)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="brandGradRegister" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className={styles.title}>Daftar Akun</h1>
        <p className={styles.subtitle}>Buat akun administrator baru</p>

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
            <label className={styles.label} htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              className="glass-input"
              placeholder="Contoh: Admin Baru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
            />
            {validationErrors.name && (
              <span style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {validationErrors.name[0]}
              </span>
            )}
          </div>

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
            />
            {validationErrors.email && (
              <span style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {validationErrors.email[0]}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="glass-input"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
            {validationErrors.password && (
              <span style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                {validationErrors.password[0]}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password_confirmation">Konfirmasi Password</label>
            <input
              id="password_confirmation"
              type="password"
              className="glass-input"
              placeholder="Ulangi password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} btn btn-primary`}
            disabled={submitting}
          >
            {submitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Sudah punya akun?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
