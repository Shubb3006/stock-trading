"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Sun size={18} />

      <input
        aria-label="Theme toggler"
        type="checkbox"
        className="toggle toggle-sm"
        checked={theme === "dark"}
        onChange={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
      />

      <Moon size={18} />
    </label>
  );
};

export default ThemeToggle;