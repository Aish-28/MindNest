import Link from "next/link";
import styles from "./sidebar.module.css";
import { FiLayers } from "react-icons/fi";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>
        <FiLayers className={styles.logoIcon} />
        MindNest
      </h2>

      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/project">Projects</Link>
        </li>
        <li>
          <Link href="/upload">Upload Content</Link>
        </li>
        {/* <li>
          <Link href="/profile">Profile</Link>
        </li> */}
      </ul>
    </div>
  );
}