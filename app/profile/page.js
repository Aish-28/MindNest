"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import Sidebar from "../../components/sidebar";
import Navbar from "../../components/navbar";
import { getUserFromToken } from "../lib/getUserFromToken";

export default function Profile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [preview, setPreview] = useState("/default-avatar.png");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  // 🔐 Auth + Load data
  useEffect(() => {
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

    // 👉 Load saved profile from localStorage
    const savedProfile = localStorage.getItem("profile");
    console.log("Saved profile:", savedProfile);

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      if (parsed.image) setPreview(parsed.image);
    } else {
      setFormData({
        name: decodedUser.name,
        email: decodedUser.email,
        phone: "",
        bio: "",
      });
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  // 📝 handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🖼️ image upload (convert to base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);

        // save image in formData
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // 💾 Save to localStorage
  const handleSave = () => {
  localStorage.setItem("profile", JSON.stringify(formData));

  // 🔥 force navbar refresh
  window.dispatchEvent(new Event("profileUpdated"));

  alert("Profile saved locally!");
  setIsEditing(false);
};

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        <Navbar />

        {/* Header */}
        <div className={styles.header}>
          <div>
            <img src={preview} className={styles.avatar} />
            {isEditing && (
              <input type="file" onChange={handleImageChange} />
            )}
          </div>

          <div>
            <h2 className={styles.name}>{formData.name}</h2>
            <p className={styles.email}>{formData.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.card}>
            <h3>12</h3>
            <p>Documents</p>
          </div>
          <div className={styles.card}>
            <h3>45</h3>
            <p>MCQs</p>
          </div>
          <div className={styles.card}>
            <h3>10</h3>
            <p>Sessions</p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formCard}>
          <h3 className={styles.heading}>Profile Details</h3>

          <div className={styles.grid}>
            <div>
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                name="phone"
                value={formData.phone}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.actions}>
            {!isEditing ? (
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={styles.saveBtn}
                onClick={handleSave}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}