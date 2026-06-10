"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }) {
  const { authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.replace(`/login`);
    }
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return children;
}
