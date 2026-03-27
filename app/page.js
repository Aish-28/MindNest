"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "./lib/getUserFromToken";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const decodedUser = getUserFromToken();
    console.log("Decoded User:", decodedUser);

    if (!decodedUser) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, []);

  return null;
}