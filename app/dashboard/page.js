"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { getUserFromToken } from "../lib/getUserFromToken";

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      const decodedUser = getUserFromToken();
      if (!decodedUser) {
        router.replace("/login");
      } else {
        setUser(decodedUser);
        setLoading(false);
      }
    }
  }, []);

  if (loading) return null;

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        <h2 className={styles.dashboard}>Dashboard</h2>

        <h2 className={styles.welcome}>
          Welcome back, {user?.name}
        </h2>

        {/* Stats Cards */}
        <div className={styles.stats}>
          <div className={styles.card}>
            <h2>12</h2>
            <p>Documents Uploaded</p>
          </div>

          <div className={styles.card}>
            <h2>18</h2>
            <p>Key Topics Identified</p>
          </div>

          <div className={styles.card}>
            <h2>45</h2>
            <p>MCQs Generated</p>
          </div>

          <div className={styles.card}>
            <h2>10</h2>
            <p>Study Sessions</p>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <h3>My Knowledge Base</h3>

          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>DBMS Unit 1</td>
                <td>PDF</td>
                <td>12 Nov 2022</td>
                <td>
                  <button>View</button>
                  <button>Generate</button>
                </td>
              </tr>

              <tr>
                <td>Biology Notes</td>
                <td>Markdown</td>
                <td>11 Nov 2024</td>
                <td>
                  <button>View</button>
                  <button>Generate</button>
                </td>
              </tr>

              <tr>
                <td>Machine Learning Intro</td>
                <td>Video</td>
                <td>11 Feb 2022</td>
                <td>
                  <button>View</button>
                  <button>Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}