"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, TrendingUp, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { authUser, logout } = useAuthStore();

  async function handleLogout() {
    const success = await logout();
    if (success) router.push("/");
  }

  console.log("navabr")

  const linkClass = (path) =>
    `transition-colors px-3 py-2 rounded-full duration-300 ${
      pathname === path || pathname.startsWith(path)
        ? "bg-primary text-white"
        : "hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="text-primary" />
          <span>TradeWise</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex">
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

        <button
          className="md:hidden "
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 w-full bg-base-100 shadow-lg z-50"
          >
            <ul
              className="flex flex-col gap-3 justify-center items-center p-4 "
              onClick={() => setIsOpen(false)}
            >
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

                  <li>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
