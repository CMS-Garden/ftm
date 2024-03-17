import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import logoImg from '../assets/logo-small-negative.svg';

export const NavBar = () => (
  <nav className={styles.navbar}>
    <ul>
      <Link to="/" className={styles.logo}>
        <img src={logoImg} height="50" alt="Follow the Money Logo" title="Follow the Money" />
      </Link>
      <div className={styles.links}>
        <a target="_blank" href="https://github.com/CMS-Garden/ftm">GitHub</a>
      </div>
    </ul>
  </nav>
);
