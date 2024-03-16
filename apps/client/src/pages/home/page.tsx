import styles from "./style.module.css";

export default function Homepage() {
  return (
    <>
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>
            <span>💸</span> Follow The Money
          </h1>
          <p>Find out which CMS are used in the german public sector.</p>
        </div>
      </div>
    </>
  );
}
