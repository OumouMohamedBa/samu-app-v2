import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import FormulaireAppel from '@/components/operateur/FormulaireAppel';
import styles from '../dashboard/DashboardOperateur.module.css';

export default function NotificationsPage() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        
          <FormulaireAppel />
       
      </div>
    </div>
  );
}
