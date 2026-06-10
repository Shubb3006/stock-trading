"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { TrendingUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { authUser, logout } = useAuthStore();

  async function handleLogout() {
    const success = await logout();
    if (success) router.push("/");
  }

  const linkClass = (path) =>
    `transition-colors px-3 py-2 rounded-full duration-300 ${
      pathname === path || pathname.startsWith(path)
        ? "bg-primary text-white"
        : "hover:text-primary"
    }`;

  const stocksActive = pathname.startsWith("/stocks");

  return (
    <header className="bg-base-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="text-primary" />
          <span>TradeWise</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/stocks" className={linkClass("/stocks")}>
                Stocks
              </Link>
            </li>

            {authUser ? (
              <>
                <li>
                  <Link href="/dashboard" className={linkClass("/dashboard")}>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    href="/transactions"
                    className={linkClass("/transactions")}
                  >
                    My Transactions
                  </Link>
                </li>

                <li className="hidden md:block">
                  <span className="font-medium">
                    Hi,{" "}
                    {authUser.name.charAt(0).toUpperCase() +
                      authUser.name.slice(1).toLowerCase()}
                  </span>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-error"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="btn btn-sm btn-ghost">
                    Login
                  </Link>
                </li>

                <li>
                  <Link href="/signup" className="btn btn-sm btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
