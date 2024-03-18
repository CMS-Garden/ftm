import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.css';

export const Footer = () => {
  return (
      <footer className={styles.siteFooter}>
          <nav className={styles.siteFooterInner} aria-labelledby="footer-navigation">
              <ul>
                  <li> <Link to="/imprint">Imprint</Link></li>
                  <li> <Link to="/privacy-policy">Privacy Policy</Link></li>
              </ul>
          </nav>
      </footer>
  );
}
