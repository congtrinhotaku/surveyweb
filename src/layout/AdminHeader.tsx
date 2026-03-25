"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const AdminHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  // ======================
  // LOAD USER FROM STORAGE
  // ======================
  useEffect(() => {
    const loadUser = () => {
      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;

      const userData = storage.getItem("user");

      setUser(userData ? JSON.parse(userData) : null);
    };

    loadUser();

    // listen khi login/logout
    window.addEventListener("userChanged", loadUser);

    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  // ======================
  // SIDEBAR TOGGLE
  // ======================
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // ======================
  // SEARCH SHORTCUT (Ctrl + K)
  // ======================
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(new Event("userChanged"));

    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 lg:px-6">

        {/* ================= LEFT ================= */}
        <div className="flex items-center justify-between w-full gap-3 py-3 lg:py-4">

          {/* SIDEBAR BUTTON */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {isMobileOpen ? "✕" : "☰"}
          </button>

          {/* LOGO MOBILE */}
          <Link href="/" className="lg:hidden">
            <Image
              width={140}
              height={32}
              src="/images/logo/logo.svg"
              alt="Logo"
              className="dark:hidden"
            />
            <Image
              width={140}
              height={32}
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              className="hidden dark:block"
            />
          </Link>

          {/* MOBILE MENU */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            ⋮
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } lg:flex items-center gap-4 w-full lg:w-auto pb-3 lg:pb-0`}
        >
          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <div className="relative">
              <NotificationDropdown />
            </div>
          </div>

          {/* USER INFO */}
          {user && (
            <div className="flex items-center gap-3 ml-2">
              
              {/* TEXT */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user.roles?.[0] || "User"}
                </p>
              </div>

              {/* AVATAR */}
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {user.username?.charAt(0)?.toUpperCase()}
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="ml-2 text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;