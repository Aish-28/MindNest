"use client";
import styles from "./navbar.module.css";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getUserFromToken } from "../app/lib/getUserFromToken";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Load user + profile
  useEffect(() => {
  const decodedUser = getUserFromToken();
  if (decodedUser) {
    setUser(decodedUser);
  }

  const savedProfile = localStorage.getItem("profile");
  if (savedProfile) {
    setProfile(JSON.parse(savedProfile));
  }

  // LISTENER STARTS HERE
  const handleProfileUpdate = () => {
    const updatedProfile = localStorage.getItem("profile");
    if (updatedProfile) {
      setProfile(JSON.parse(updatedProfile));
    }
  };

  window.addEventListener("profileUpdated", handleProfileUpdate);

  // CLEANUP
  return () => {
    window.removeEventListener("profileUpdated", handleProfileUpdate);
  };

}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    alert("Logged out successfully!");
    router.replace("/login");
  };

  // Priority: profile > JWT
  const displayName = profile?.name || user?.name || "Guest";
  const displayImage = profile?.image || "/avatar.png";

  return (
    <div className={styles.navbar}>
      <div className={styles.right}>

        <div className={styles.profile}>
          <span className={styles.name}>{displayName}</span>

          <img
            src={displayImage}
            alt="profile"
            className={styles.avatar}
          />
        </div>

        <FiLogOut
          className={styles.logoutIcon}
          onClick={handleLogout}
          title="Logout"
        />

      </div>
    </div>
  );
}