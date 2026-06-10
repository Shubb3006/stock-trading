"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Eye, EyeClosed, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">TradeWise</h1>

            <p className="text-base-content/70">
              Track stocks and manage your portfolio
            </p>

            <h2 className="text-2xl font-semibold pt-2">Welcome Back</h2>
          </div>

          {/* Email */}
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <Mail size={18} />

              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </label>
          </div>

          {/* Password */}
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeClosed size={18} className="cursor-pointer opacity-70" />
                ) : (
                  <Eye size={18} className="cursor-pointer opacity-70" />
                )}
              </button>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn btn-primary w-full"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" /> : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm">
            Don't have an account?
            <Link href="/signup" className="link link-primary ml-1">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
