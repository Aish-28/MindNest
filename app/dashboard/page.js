"use client";
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,Legend} from "recharts";
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

  // Dashboard Data
  const [projects, setProjects] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFiles: 0,
    totalQuestions: 0,
    totalNotes: 0,
  });

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const decodedUser = getUserFromToken();

      if (!decodedUser) {
        router.replace("/login");
        return;
      }

      setUser(decodedUser);

      // API CALL
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log(data);

      // If API fails
      if (!response.ok) {
        console.log(data.error);
        return;
      }

      // Set Projects
      setProjects(data.projects);

      // Set Stats
      setStats({
        totalProjects: data.stats.totalProjects,
        totalFiles: data.stats.totalFiles,
        totalQuestions: data.stats.totalQuestions,
        totalNotes: data.stats.totalNotes,
      });

      // Chart Data
      const formattedData = data.projects.map((project) => ({
        name: project.title,
        questions: project.questionCount,
        notes: project.noteCount,
      }));

      setChartData(formattedData);

      setLoading(false);

    } catch (error) {
      console.log("Dashboard Fetch Error:", error);
    }
  };

  fetchDashboard();
  }, [router]); 

  if (loading) return null;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className={styles.main}>
        {/* Navbar */}
        <Navbar />

        {/* Heading */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.dashboardTitle}>Dashboard</h1>

            <p className={styles.welcome}>
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.card}>
            <h2>{stats.totalProjects}</h2>
            <p>Total Projects</p>
          </div>

          <div className={styles.card}>
            <h2>{stats.totalFiles}</h2>
            <p>Files Uploaded</p>
          </div>

          <div className={styles.card}>
            <h2>{stats.totalQuestions}</h2>
            <p>Questions Generated</p>
          </div>

          <div className={styles.card}>
            <h2>{stats.totalNotes}</h2>
            <p>Notes Created</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickSection}>
          <h2>Quick Actions</h2>

          <div className={styles.quickActions}>
            <button onClick={() => router.push("/upload")}>
              Upload File
            </button>

            <button onClick={() => router.push("/project")}>
              View Projects
            </button>

            <button onClick={() => router.push("/profile")}>
              My Profile
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsContainer}>

          {/* Bar Chart */}
          <div className={styles.chartCard}>
            <h2>Questions Generated Per Project</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="questions" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={styles.chartCard}>
            <h2>Notes vs Questions</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Questions",
                      value: stats.totalQuestions,
                    },
                    {
                      name: "Notes",
                      value: stats.totalNotes,
                    },
                  ]}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#10b981" />
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>Recent Projects</h2>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Topics</th>
                <th>Questions</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>

                    <td>{project.topicCount}</td>

                    <td>{project.questionCount}</td>

                    <td>{project.noteCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.empty}>
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}