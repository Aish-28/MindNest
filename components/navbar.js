"use client";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>

      <div className={styles.right}>

        <div className={styles.profile}>

          <span className={styles.name}>Aishwarya</span>

          <img
            src="/avatar.png"
            alt="profile"
            className={styles.avatar}
          />

        </div>

      </div>

    </div>
  );
}