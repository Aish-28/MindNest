"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./project.module.css"

import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";

export default function ProjectDetail() {

    const { projectId } = useParams();

    const router = useRouter();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchProject() {

            try {

                const token = localStorage.getItem("token");
                console.log(token)

                const res = await fetch(`/api/project/${projectId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setProject(data.project);

            } catch (err) {

                console.log("Error fetching project", err);

            } finally {

                setLoading(false);
            }
        }

        if (projectId) {
            fetchProject();
        }

    }, [projectId]);

    if (loading) {
        return (
            <div className={styles.loading}>
                Loading project...
            </div>
        );
    }

    if (!project) {
        return (
            <div className={styles.loading}>
                Project not found
            </div>
        );
    }

    return (
        <div className={styles.container}>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className={styles.main}>

                <Navbar />

                {/* Hero Section */}
                <div className={styles.hero}>

                    <div>
                        <h1 className={styles.title}>
                            {project.title}
                        </h1>

                        <p className={styles.description}>
                            {project.description}
                        </p>
                    </div>

                    <button
                        className={styles.askBtn}
                        onClick={() => router.push("/questions")}
                    >
                        Ask Questions
                    </button>

                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>

                    <div className={styles.statCard}>
                        <h3>Notes</h3>
                        <p>{project.notes.length}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h3>Questions</h3>
                        <p>{project.questionBanks.length}</p>
                    </div>

                    <div className={styles.statCard}>
                        <h3>Contents</h3>
                        <p>{project.contents.length}</p>
                    </div>

                </div>

                {/* Topics */}
                <div className={styles.section}>

                    <h2>Important Topics</h2>

                    <div className={styles.tags}>

                        {project.topicAnalysis?.topics?.length > 0 ? (

                            project.topicAnalysis.topics.map((topic, index) => (
                                <span
                                    key={index}
                                    className={styles.tag}
                                >
                                    {topic}
                                </span>
                            ))

                        ) : (

                            <p className={styles.empty}>
                                No topics generated yet
                            </p>
                        )}

                    </div>

                </div>

                {/* Questions */}
                <div className={styles.section}>

                    <h2>Generated Questions</h2>

                    {project.questionBanks.length > 0 ? (

                        <div className={styles.cardsGrid}>

                            {project.questionBanks.map((q, index) => (

                                <div
                                    key={index}
                                    className={styles.card}
                                >
                                    {q.question}
                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className={styles.empty}>
                            No questions available
                        </p>
                    )}

                </div>

                {/* Notes */}
                <div className={styles.section}>

                    <h2>Notes</h2>

                    {project.notes.length > 0 ? (

                        <div className={styles.cardsGrid}>

                            {project.notes.map((note, index) => (

                                <div
                                    key={index}
                                    className={styles.card}
                                >
                                    {note.content}
                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className={styles.empty}>
                            No notes available
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}