'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaUser,
  FaChartBar,
  FaHistory,
  FaCogs,
  FaMapMarkerAlt,
  FaHome,
  FaAmbulance,
  FaUsers,
  FaPhone,
  FaListUl,
  
} from 'react-icons/fa';
import { useState } from 'react';
import styles from './Sidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { userData } = useAuth(); // 🔹 Accès au rôle

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // 🔹 Menus par rôle
  const adminMenu = [
    { href: '/admin/dashboard', icon: <FaHome />, label: 'Tableau de Bord' },
    { href: '/admin/users', icon: <FaUsers />, label: 'Utilisateurs' },
    { href: '/admin/role', icon: <FaUser />, label: 'Rôles & Permissions' },
    { href: '/admin/baseSamu', icon: <FaMapMarkerAlt />, label: 'Bases SAMU' },
    { href: '/admin/ambulance/historique', icon: <FaHistory />, label: 'Historique' },
    { href: '/admin/statistiques', icon: <FaChartBar />, label: 'Statistiques' },
    { href: '/admin/setting', icon: <FaCogs />, label: 'Paramètres' }
  ];

  const operateurMenu = [
    { href: '/operateur/dashboard', icon: <FaHome />, label: 'Accueil' },
    { href: '/operateur/notifications', icon: <FaPhone />, label: 'Appels ' },
    { href: '/operateur/notifications/liste', icon: <FaListUl />, label: 'Notifications' },
    { href: '/operateur/historique', icon: <FaHistory />, label: 'Historique ' },
    { href: '/operateur/statistiques', icon: <FaChartBar />, label: 'Statistiques' },
    { href: '/operateur/parametres', icon: <FaCogs />, label: 'Paramètres' }
  ];

  const selectedMenu = userData?.role === 'admin' ? adminMenu : userData?.role === 'operateur' ? operateurMenu : [];

  return (
    
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {collapsed ? 'Ξ' : '☰'}
      </button>

      <h2 className={styles.logo}>🚑SAMU</h2>

      <ul className={styles.menu}>
        {selectedMenu.map((item, index) => (
          <li key={index} className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}>
            <Link href={item.href} className={styles.menuLink}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
