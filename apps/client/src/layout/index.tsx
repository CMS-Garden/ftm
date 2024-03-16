import { NavBar } from "../components/NavBar";
import { Outlet } from "react-router-dom";
import styles from "./style.module.css";

export default function MainLayout() {
  return (
    <div>
      <NavBar />
      <main className={styles.containt}>
        <Outlet />
      </main>
    </div>
  );
}
