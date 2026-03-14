"use client";
import styles from "./upload.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState } from "react";

export default function Upload() {

    const [activeTab, setActiveTab] = useState("pdf");

    return(
        <div className={styles.container}>
            <Sidebar />

            <div className={styles.main}>
                <Navbar />

                <div className={styles.header}>
                    <h2>Upload Content</h2>
                </div>

                {/* Tabs */}

                <div className={styles.tabs}>

                    <button
                    className={activeTab === "pdf" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("pdf")}
                    >
                    Upload PDF
                    </button>

                    <button
                    className={activeTab === "youtube" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("youtube")}
                    >
                    Add YouTube Link
                    </button>

                </div>

                {/* Upload Box */}

                <div className={styles.uploadBox}>

                    <p>
                        Drag & drop your file here or 
                        <span className={styles.browse}>Browse</span>
                    </p>

                </div>

                {/* Status */}

                <div className={styles.statusBox}>

                    <p><span>✔</span> Extracting text...</p>
                    <p><span>✔</span> Chunking document...</p>
                    <p><span>✔</span> Indexing into knowledge base...</p>

                </div>

            </div>
        
        </div>
    );
}