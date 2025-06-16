"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/db";

export default function AuthBridge() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    (async () => {
      const res = await fetch("/api/token");
      if (!res.ok) throw new Error("Failed to get Firebase token");
      const { token } = await res.json();
      await signInWithCustomToken(auth, token);
    })();
  }, [isLoaded, isSignedIn]);

  return null;
}
