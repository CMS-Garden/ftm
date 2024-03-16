import { Outlet } from 'react-router-dom';
import styles from './style.module.css';

export default function Homepage() {
  return (
    <>
      <nav className={styles.navbar}>
        <ul>
          <span className={styles.logo}>
            <span>💸</span> Follow The Money
          </span>
        </ul>
      </nav>
      <main className={styles.content}>
        <Outlet />
      </main>
    </>
  );
}
