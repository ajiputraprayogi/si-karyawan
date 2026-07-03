'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeMenu: 'dashboard' | 'tambah' | 'edit';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={styles.mobileHeader}>
        <div className={styles.brand}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px' }}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#brandGradMobile)" fillOpacity="0.15" stroke="url(#brandGradMobile)" strokeWidth="2" />
            <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="url(#brandGradMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 18C6 15.2386 8.23858 13 11 13H13C15.7614 13 18 15.2386 18 18" stroke="url(#brandGradMobile)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="brandGradMobile" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.logo} style={{ fontSize: '1.2rem' }}>Si-karyawan</span>
        </div>
        <button className={styles.mobileToggle} onClick={toggleSidebar} aria-label="Toggle Menu">
          <svg style={{ width: '28px', height: '28px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      {/* Overlay untuk Mobile */}
      {isOpen && <div className={styles.sidebarOverlay} onClick={toggleSidebar} />}

      {/* Sidebar Component */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarActive : ''}`}>
        <div className={styles.topSection}>
          {/* Brand */}
          <div className={styles.brand}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '36px', height: '36px' }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="url(#brandGrad)" fillOpacity="0.15" stroke="url(#brandGrad)" strokeWidth="2" />
              <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="url(#brandGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 18C6 15.2386 8.23858 13 11 13H13C15.7614 13 18 15.2386 18 18" stroke="url(#brandGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="brandGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--primary)" />
                  <stop offset="1" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <span className={styles.logo}>Si-karyawan</span>
          </div>

          {/* User Profile */}
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>{getInitials(user.name)}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName} title={user.name}>{user.name}</span>
              <span className={styles.userRole}>Administrator</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className={styles.menuList}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.menuItem} ${activeMenu === 'dashboard' || activeMenu === 'tambah' ? styles.activeItem : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Data Karyawan
                </Link>
              </li>
              {activeMenu === 'edit' && (
                <li>
                  <span className={`${styles.menuItem} ${styles.activeItem}`}>
                    <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Karyawan
                  </span>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <div>
          <button onClick={logout} className={styles.logoutBtn}>
            <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9z" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};
