"use client";
import styles from "./project.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // Load projects
  useEffect(() => {
    const fetchProjects=async () =>{
      try{
        const token=localStorage.getItem("token");

        const res=await fetch("/api/project/fetch",{
          method:"GET",
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });

        const data=await res.json();

        if (res.ok){
          setProjects(data.projects);
        }else{
          console.error(data.message);
        }
      }
      catch(err){
        console.log("Error in fetching projects: ",err);
      }
    };

    fetchProjects();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create project
  const handleCreateProject =async () => {
    if (!form.title.trim()) return;

    try{
      const token=localStorage.getItem("token");

      const res=await fetch("/api/project/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`,
        },
        body:JSON.stringify({
          title:form.title,
          description:form.description,
        }),
      });

      const data=await res.json();

      if(res.ok){
        setProjects((prev)=>[data.newProject, ...prev]);

        setForm({title:"", description:""});
        console.log("Response:", data);
      }
      else{
        console.log(data.message);
      }
    }
    catch(err){
      console.log("Error in creating project: ",err);
    }
  };

  // Delete project
  // const handleDelete = (id) => {
  //   const updated = projects.filter((proj) => proj.id !== id);
  //   setProjects(updated);
  //   localStorage.setItem("projects", JSON.stringify(updated));
  // };

  const handleDelete = (id) => {
  setProjects((prev) => prev.filter((proj) => proj.id !== id));
};

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        <h2 className={styles.title}>Projects</h2>

        {/* Create Form */}
        <div className={styles.formBox}>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
          />

          <button onClick={handleCreateProject}>
            Create Project
          </button>
        </div>

        {/* Project List */}
        <div className={styles.projectGrid}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📁</div>
              <h3>No Projects Yet</h3>
              <p>Create your first project to get started</p>
            </div>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className={styles.card}>
                
                <div className={styles.cardHeader}>
                  <h3>📌 {proj.title}</h3>
                  <span className={styles.date}>{new Date(proj.createdAt).toLocaleString()}</span>
                </div>

                <p className={styles.desc}>
                  {proj.description || "No description provided."}
                </p>

                <div className={styles.actions}>
                  <button
                    className={styles.openBtn}
                    onClick={() => {
                      localStorage.setItem("selectedProject", JSON.stringify(proj));
                      router.push(`/project/${proj.id}`);
                    }}
                  >
                    Open
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(proj.id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}