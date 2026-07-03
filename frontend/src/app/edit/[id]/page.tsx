'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Notification } from '@/components/Notification';
import { Sidebar } from '@/components/Sidebar';
import styles from '../../form.module.css';

interface EditKaryawanProps {
  params: Promise<{ id: string }>;
}

export default function EditKaryawanPage({ params }: EditKaryawanProps) {
  const { id } = use(params);
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

  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/karyawan/${id}`);
        if (response.data.status === 'success') {
          const data = response.data.data;
          
          let formattedDate = '';
          if (data.tanggal_masuk) {
            const d = new Date(data.tanggal_masuk);
            formattedDate = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
          }

          setFormData({
            nip: data.nip || '',
            nama: data.nama || '',
            jabatan: data.jabatan || '',
            departemen: data.departemen || '',
            email: data.email || '',
            telepon: data.telepon || '',
            tanggal_masuk: formattedDate,
            status_aktif: !!data.status_aktif,
          });
        }
      } catch (error: unknown) {
        console.error(error);
        setGlobalError('Gagal mengambil data karyawan. Karyawan tidak ditemukan.');
      } finally {
        setFetching(false);
      }
    };

    if (user && id) {
      fetchDetail();
    }
  }, [id, user]);

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
      const response = await api.put(`/karyawan/${id}`, formData);
      if (response.data.status === 'success') {
        setNotification({ message: 'Data karyawan berhasil diperbarui!', type: 'success' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error: unknown) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setGlobalError(err.response?.data?.message || 'Gagal memperbarui data karyawan. Silakan coba lagi.');
      }
      setSubmitting(false);
    }
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div className="layout-wrapper">
      <Sidebar activeMenu="edit" />
      
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
        <h1 className={styles.title}>Edit Karyawan</h1>
        <Link href="/" className="btn btn-secondary btn-sm">
          Kembali
        </Link>
      </div>

      <div className={`${styles.card} glass-panel`}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              border: '3px solid rgba(255, 255, 255, 0.1)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: 'var(--text-muted)' }}>Mengambil data karyawan...</p>
          </div>
        ) : (
          <>
            {globalError && (
              <div className={styles.errorBox}>
                <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{globalError}</span>
              </div>
            )}

            {!globalError && (
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
                    {submitting ? 'Memperbarui...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
