import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';
import logoImg from '../assets/logo-small-negative.svg';
import home from '../assets/home.svg';
import Hamburger from './Hamburger';

export const NavBar = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const classes = hamburgerOpen
    ? `${styles.navbar} ${styles.navbarOpen}`
    : styles.navbar;

  return (
    <nav className={classes}>
      <Link to="/" className={styles.logo}>
        <img
          src={logoImg}
          height="50"
          alt="Follow the Money Logo"
          title="Follow the Money"
        />
      </Link>
      <ul className={styles.links}>
        <li>
          <Link title="home" to="/">
            <img src={home} height="17" alt="Home" title="Home" />
          </Link>
        </li>
        <li>
          <a
            title="GitHub"
            target="_blank"
            href="https://github.com/CMS-Garden/ftm"
          >
            GitHub
          </a>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
      </ul>
      <div
        className={`${styles.hamburger} ${styles.hamburgerWrapper}`}
        onClick={toggleHamburger}
      >
        <Hamburger isOpen={hamburgerOpen} />
      </div>
    </nav>
  );
};
