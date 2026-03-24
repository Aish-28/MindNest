"use client";
import styles from "./upload.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState } from "react";

export default function Upload() {

    const [activeTab, setActiveTab] = useState("pdf");
    const [file, setFile] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [status, setStatus] = useState([]);

    // Handle PDF Upload
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setStatus([]);

        // Simulate processing steps
        setStatus((prev) => [...prev, "Extracting text..."]);

        setTimeout(() => {
        setStatus((prev) => [...prev, "Chunking document..."]);
        }, 1000);

        setTimeout(() => {
        setStatus((prev) => [...prev, "Indexing into knowledge base..."]);
        }, 2000);
    };

    // Handle YouTube Submit
    const handleYoutubeSubmit = async () => {
        if (!youtubeLink) return;

        setStatus([]);

        setStatus((prev) => [...prev, "Fetching video data..."]);

        setTimeout(() => {
        setStatus((prev) => [...prev, "Extracting transcript..."]);
        }, 1000);

        setTimeout(() => {
        setStatus((prev) => [...prev, "Indexing content..."]);
        }, 2000);
    };

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

                {/* PDF Upload */}
                {activeTab === "pdf" && (
                <div className={styles.uploadBox}>
                <input
                    type="file"
                    id="fileUpload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />

                <p>
                    Drag & drop your file here or{" "}
                    <label htmlFor="fileUpload" className={styles.browse}>
                    Browse
                    </label>
                </p>

                {file && <p>Selected: {file.name}</p>}
                </div>
                )}

                {/* YouTube Input */}
                {activeTab === "youtube" && (
                <div className={styles.uploadBox}>
                    <input
                    type="text"
                    placeholder="Enter YouTube link"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className={styles.input}
                    />
                    <button onClick={handleYoutubeSubmit}>Submit</button>
                </div>
                )}

                {/* Status */}
                {status.length > 0 && (
                <div className={styles.statusBox}>
                    {status.map((step, index) => (
                    <p key={index}>
                        <span>✔</span> {step}
                    </p>
                    ))}
                </div>
                )}

            </div>
        
        </div>
    );
}