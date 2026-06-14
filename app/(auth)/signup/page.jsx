"use client";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Eye,
  EyeClosed,
  Loader2,
  Lock,
  Mail,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      router.replace(redirectTo);
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

            <h2 className="text-2xl font-semibold pt-2">Create your account</h2>
          </div>
          <div className="w-full">
            <label className="input input-bordered flex items-center gap-2 w-full">
              <PanelsTopLeft size={18} />

              <input
                type="text"
                className="grow"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </label>
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
            disabled={isSigningUp}
            className="btn btn-primary w-full"
          >
            {isSigningUp ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm">
            Already Have a Account?
            <Link
              href={`/login?redirect=${redirectTo}`}
              className="link link-primary ml-1"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
