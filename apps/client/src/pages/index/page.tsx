import styles from "./style.module.css";
import { NavBar } from "../../components/NavBar";

export default function Homepage() {
  return (
    <>
      <NavBar />
      <main className={styles.content}>
        <div className={styles.hero}>
          <h1>
            <span>💸</span> Follow The Money
          </h1>
          <p>Find out which CMS are used in the german public sector.</p>
        </div>
      </main>
    </>
  );
}
