import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>MindNest</h2>

      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/upload">Upload Content</Link></li>
        <li><Link href="">Generate Q&A</Link></li>
        <li><Link href="">Topic Analysis</Link></li>
        <li><Link href="">History</Link></li>
        <li><Link href="">Profile</Link></li>
      </ul>
    </div>
  );
}