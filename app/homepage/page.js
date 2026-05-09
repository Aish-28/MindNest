"use client";
import Link from 'next/link';
import styles from './homepage.module.css';
import { FiLayers, FiFileText, FiYoutube, FiCpu, FiDownload, FiClock } from "react-icons/fi";

export default function Homepage() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <FiLayers className={styles.logoIcon} />
          <span>MindNest</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Master Your Content with <span className={styles.highlight}>MindNest</span>
        </h1>
        <p className={styles.subtitle}>
          The ultimate workspace for students and professionals. Create projects, upload your study materials, and let AI generate the most important questions to supercharge your learning.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/signup" className={styles.primaryBtn}>Start Your First Project</Link>
          <a href="#scope" className={styles.secondaryBtn}>Explore Features</a>
        </div>
      </header>

      {/* Intro/Scope Section */}
      <section id="scope" className={styles.scopeSection}>
        <div className={styles.sectionHeader}>
          <h2>AI-Powered Learning Ecosystem</h2>
          <p>
            MindNest is a controlled personal tutor that uses <strong>only</strong> your stored content, 
            ensuring learning context is never lost and the output remains strictly relevant to your syllabus.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <FiFileText className={styles.cardIcon} />
            <h3>Centralized Knowledge</h3>
            <p>Upload PDFs, write detailed notes, and add YouTube links to build a continuous personal knowledge base in one place.</p>
          </div>

          <div className={styles.card}>
            <FiCpu className={styles.cardIcon} />
            <h3>Smart Generation</h3>
            <p>Automatically transform your materials into MCQs, short answers, and long answers for rigorous active recall practice.</p>
          </div>

          <div className={styles.card}>
            <FiLayers className={styles.cardIcon} />
            <h3>Strategic Revision</h3>
            <p>Identify important topics, high-scoring areas, and difficult concepts to prioritize your exam preparation effectively.</p>
          </div>

        </div>
      </section>

      {/* Footer Decoration */}
      <div className={styles.bgGlow}></div>
    </div>
  );
}