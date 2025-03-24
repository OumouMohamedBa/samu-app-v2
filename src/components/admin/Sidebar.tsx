'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaChartBar, FaHistory, FaCogs, FaHome, FaAmbulance, FaUsers, FaTachometerAlt } from 'react-icons/fa';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.logo}>🚑 Ambulance Connect</h2>

      <ul className={styles.menu}>
        {[
          { href: '/dashboard', icon: <FaHome />, label: 'Tableau de Bord' },
          { href: '/admin/users', icon: <FaUsers />, label: 'Utilisateurs' },
          { href: '/admin/role', icon: <FaUser />, label: 'Rôles & Permissions' },
          { href: '/admin/ambulance', icon: <FaAmbulance />, label: 'Suivi Ambulances' },
          { href: '/admin/affectation', icon: <FaAmbulance />, label: 'Affectation' },
          { href: '/admin/ambulance/historique', icon: <FaHistory />, label: 'Historique' },
        ].map((item, index) => (
          <li key={index} className={`${styles.menuItem} ${pathname === item.href ? styles.active : ''}`}>
            <Link href={item.href} className={styles.menuLink}>
              {item.icon} <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Section en bas */}
      <ul className={styles.menuBottom}>
        {[
          { href: '/admin/statistiques', icon: <FaChartBar />, label: 'Statistiques' },
          { href: '/admin/setting', icon: <FaCogs />, label: 'Paramètres' },
        ].map((item, index) => (
          <li key={index} className={`${styles.menuBottomItem} ${pathname === item.href ? styles.activeBottom : ''}`}>
            <Link href={item.href} className={styles.menuBottomLink}>
              {item.icon} <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
