'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Notification } from '@/components/Notification';
import { Sidebar } from '@/components/Sidebar';
import styles from './page.module.css';

interface Karyawan {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
  departemen: string;
  email: string | null;
  telepon: string | null;
  tanggal_masuk: string;
  status_aktif: boolean;
}

interface Stats {
  total: number;
  aktif: number;
  nonaktif: number;
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, aktif: 0, nonaktif: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; nama: string } | null>(null);

  const fetchKaryawan = async () => {
    setLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      if (statusFilter !== 'all') {
        params.status_aktif = statusFilter === 'aktif' ? '1' : '0';
      }

      const response = await api.get('/karyawan', { params });
      if (response.data.status === 'success') {
        setKaryawans(response.data.data.data);
        setStats(response.data.stats);
        setPaginationInfo({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          total: response.data.data.total,
          from: response.data.data.from || 0,
          to: response.data.data.to || 0,
        });
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Gagal mengambil data karyawan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchKaryawan();
    }
  }, [page, statusFilter, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchKaryawan();
  };

  const handleDelete = async (id: number, nama: string) => {
    try {
      const response = await api.delete(`/karyawan/${id}`);
      if (response.data.status === 'success') {
        showNotification(`Data karyawan "${nama}" berhasil dihapus`, 'success');
        fetchKaryawan();
      }
    } catch (error: any) {
      console.error(error);
      showNotification('Gagal menghapus data karyawan', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const formatTanggal = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="layout-wrapper">
      <Sidebar activeMenu="dashboard" />
      
      <div className="main-content">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

      {/* Stats Cards */}
      <section className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statInfo}>
            <h3>Total Karyawan</h3>
            <div className={styles.statValue}>{stats.total}</div>
          </div>
          <div className={styles.statIcon}>
            <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statInfo}>
            <h3>Aktif</h3>
            <div className={styles.statValue} style={{ color: 'var(--success)' }}>{stats.aktif}</div>
          </div>
          <div className={styles.statIcon} style={{ color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statInfo}>
            <h3>Nonaktif</h3>
            <div className={styles.statValue} style={{ color: 'var(--danger)' }}>{stats.nonaktif}</div>
          </div>
          <div className={styles.statIcon} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <svg style={{ width: '24px', height: '24px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={`${styles.contentPanel} glass-panel`}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <form onSubmit={handleSearchSubmit} className={styles.searchWrapper}>
            <input
              type="text"
              className="glass-input"
              placeholder="Cari NIP, nama, jabatan, departemen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              Cari
            </button>
          </form>

          <div className={styles.rightActions}>
            <select
              className={`glass-input ${styles.filterSelect}`}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>

            <Link href="/tambah" className="btn btn-primary">
              <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Tambah Karyawan
            </Link>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        ) : karyawans.length === 0 ? (
          <div className={styles.emptyState}>
            <svg style={{ width: '64px', height: '64px', fill: 'currentColor' }} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6.8 11.75a1 1 0 101.733 1L9 11.83V15a1 1 0 102 0v-3.17l.467.92a1 1 0 101.733-1l-2.333-4.25A1 1 0 0010 7z" clipRule="evenodd" />
            </svg>
            <p>Data karyawan tidak ditemukan</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>NIP</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                    <th>Departemen</th>
                    <th>Email / Telepon</th>
                    <th>Tanggal Masuk</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {karyawans.map((karyawan) => (
                    <tr key={karyawan.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{karyawan.nip}</td>
                      <td style={{ fontWeight: 600 }}>{karyawan.nama}</td>
                      <td>{karyawan.jabatan}</td>
                      <td>{karyawan.departemen}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{karyawan.email || '-'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{karyawan.telepon || '-'}</div>
                      </td>
                      <td>{formatTanggal(karyawan.tanggal_masuk)}</td>
                      <td>
                        <span className={`${styles.badge} ${karyawan.status_aktif ? styles.badgeActive : styles.badgeInactive}`}>
                          {karyawan.status_aktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                          <Link href={`/edit/${karyawan.id}`} className={`${styles.btnAction} ${styles.btnEdit}`} title="Edit Karyawan">
                            <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: karyawan.id, nama: karyawan.nama })}
                            className={`${styles.btnAction} ${styles.btnDelete}`}
                            title="Hapus Karyawan"
                          >
                            <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <div>
                Menampilkan data {paginationInfo.from} - {paginationInfo.to} dari {paginationInfo.total} karyawan
              </div>
              <div className={styles.paginationBtns}>
                <button
                  className={styles.paginationBtn}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Sebelumnya
                </button>
                <button
                  className={styles.paginationBtn}
                  disabled={page === paginationInfo.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modern Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-panel animate-fade-in`}>
            <div className={styles.modalIcon}>
              <svg style={{ width: '36px', height: '36px', fill: 'currentColor' }} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Hapus Karyawan?</h2>
            <p className={styles.modalText}>
              Apakah Anda yakin ingin menghapus data karyawan <strong>{deleteTarget.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => {
                  handleDelete(deleteTarget.id, deleteTarget.nama);
                  setDeleteTarget(null);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
