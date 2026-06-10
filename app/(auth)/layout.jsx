"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }) {
  const { authUser, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.replace("/dashboard"); // already logged in → go home
    }
  }, [authUser, isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  } // global loader already showing

  return children;
}
