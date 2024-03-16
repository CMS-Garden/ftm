import styles from './NavBar.module.css';

export const NavBar = () => (
  <nav className={styles.navbar}>
    <ul>
      <span className={styles.logo}>
        <span>💸</span> Follow The Money
      </span>
      <a href="https://github.com/CMS-Garden/ftm">GitHub</a>
    </ul>
  </nav>
);
