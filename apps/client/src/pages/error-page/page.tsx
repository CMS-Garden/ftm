import styles from "./style.module.css";

export default function ErrorPage() {
  return (
    <div id="error-page" className={styles.content}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}
