"use client";

import styles from "./dashboard.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // Loading state
  if (!user) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Navbar />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <Sidebar />

      <div className={styles.main}>

        <Navbar />

        <h2 className={styles.dashboard}>
          Dashboard
        </h2>

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

        {/* Knowledge Base Table */}

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
