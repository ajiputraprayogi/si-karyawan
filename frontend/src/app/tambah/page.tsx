'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Notification } from '@/components/Notification';
import { Sidebar } from '@/components/Sidebar';
import styles from '../form.module.css';

export default function TambahKaryawanPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    jabatan: '',
    departemen: '',
    email: '',
    telepon: '',
    tanggal_masuk: '',
    status_aktif: true,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGlobalError(null);

    try {
      const response = await api.post('/karyawan', formData);
      if (response.data.status === 'success') {
        setNotification({ message: 'Karyawan berhasil ditambahkan!', type: 'success' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setGlobalError(error.response?.data?.message || 'Gagal menyimpan data karyawan. Silakan coba lagi.');
      }
      setSubmitting(false);
    }
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="layout-wrapper">
      <Sidebar activeMenu="tambah" />
      
      <div className="main-content">
        <div className={styles.container}>
          {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Tambah Karyawan</h1>
        <Link href="/" className="btn btn-secondary btn-sm">
          Kembali
        </Link>
      </div>

      <div className={`${styles.card} glass-panel`}>
        {globalError && (
          <div className={styles.errorBox}>
            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nip">NIP (Nomor Induk Pegawai)</label>
              <input
                id="nip"
                type="text"
                name="nip"
                className="glass-input"
                placeholder="Contoh: 1995021201"
                value={formData.nip}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              {errors.nip && <span className={styles.errorText}>{errors.nip[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nama">Nama Lengkap</label>
              <input
                id="nama"
                type="text"
                name="nama"
                className="glass-input"
                placeholder="Contoh: Budi Santoso"
                value={formData.nama}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              {errors.nama && <span className={styles.errorText}>{errors.nama[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="jabatan">Jabatan</label>
              <input
                id="jabatan"
                type="text"
                name="jabatan"
                className="glass-input"
                placeholder="Contoh: Software Engineer"
                value={formData.jabatan}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              {errors.jabatan && <span className={styles.errorText}>{errors.jabatan[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="departemen">Departemen</label>
              <input
                id="departemen"
                type="text"
                name="departemen"
                className="glass-input"
                placeholder="Contoh: Teknologi Informasi"
                value={formData.departemen}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              {errors.departemen && <span className={styles.errorText}>{errors.departemen[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="glass-input"
                placeholder="Contoh: nama@perusahaan.com"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.email && <span className={styles.errorText}>{errors.email[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="telepon">Telepon</label>
              <input
                id="telepon"
                type="text"
                name="telepon"
                className="glass-input"
                placeholder="Contoh: 081234567890"
                value={formData.telepon}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.telepon && <span className={styles.errorText}>{errors.telepon[0]}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="tanggal_masuk">Tanggal Masuk</label>
              <input
                id="tanggal_masuk"
                type="date"
                name="tanggal_masuk"
                className="glass-input"
                value={formData.tanggal_masuk}
                onChange={handleChange}
                required
                disabled={submitting}
              />
              {errors.tanggal_masuk && <span className={styles.errorText}>{errors.tanggal_masuk[0]}</span>}
            </div>

            <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="status_aktif"
                  className={styles.checkboxInput}
                  checked={formData.status_aktif}
                  onChange={handleChange}
                  disabled={submitting}
                />
                Status Aktif Bekerja
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Karyawan'}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}
