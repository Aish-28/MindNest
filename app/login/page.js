"use client";
import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      const data = await res.json();

      // store token
      localStorage.setItem("token", data.token);

      // optionally store user
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login success", data);
      alert("Login successful!");

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link href="/signup" className={styles.link}>Signup</Link>
        </p>
      </form>
    </div>
  );
}