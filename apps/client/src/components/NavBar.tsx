import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

export const NavBar = () => (
  <nav className={styles.navbar}>
    <ul>
      <Link to="/" className={styles.logo}>
        <span>💸</span> Follow The Money
      </Link>
      <div className={styles.links}>
        <a href="https://github.com/CMS-Garden/ftm">GitHub</a>
      </div>
    </ul>
  </nav>
);
