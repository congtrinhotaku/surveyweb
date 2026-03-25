"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import * as Icons from "../icons"; // 🔥 IMPORT ALL ICONS
import { ChevronDownIcon, HorizontaLDots } from "../icons";

// ======================
// TYPE
// ======================
type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavItem[];
};

// ======================
// GET TOKEN
// ======================
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// ======================
// GET ICON DYNAMIC
// ======================
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];

  if (!IconComponent) {
    console.warn("Icon not found:", iconName);
    return <Icons.GridIcon />; // fallback
  }

  return <IconComponent />;
};

// ======================
// COMPONENT
// ======================
const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [menuData, setMenuData] = useState<NavItem[]>([]);
  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ======================
  // FETCH MENU
  // ======================
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = getToken();

        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/core/Menus/my-menu`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/signin";
          return;
        }

        if (!res.ok) return;

        const data = await res.json();

        const convert = (items: any[]): NavItem[] =>
          items.map((item) => ({
            name: item.name,
            path: item.path ? "/admin" + item.path : undefined,
            icon: getIcon(item.icon), // 🔥 AUTO ICON
            children:
              item.children?.length > 0
                ? convert(item.children)
                : undefined,
          }));

        setMenuData(convert(data));
      } catch (err) {
        console.error("Load menu failed:", err);
      }
    };

    fetchMenu();
  }, []);

  // ======================
  // ACTIVE
  // ======================
  const isActive = useCallback(
    (path?: string) => path && pathname === path,
    [pathname]
  );

  // ======================
  // SUBMENU AUTO OPEN
  // ======================
  useEffect(() => {
    let found = false;

    menuData.forEach((nav, index) => {
      nav.children?.forEach((sub) => {
        if (isActive(sub.path)) {
          setOpenSubmenu({ index });
          found = true;
        }
      });
    });

    if (!found) setOpenSubmenu(null);
  }, [pathname, menuData, isActive]);

  // ======================
  // HEIGHT
  // ======================
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev?.index === index ? null : { index }
    );
  };

  // ======================
  // RENDER
  // ======================
  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.children ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  openSubmenu?.index === index
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              <span className="w-5 h-5">{nav.icon}</span>
              <span>{nav.name}</span>

              <ChevronDownIcon
                className={`ml-auto w-5 h-5 ${
                  openSubmenu?.index === index ? "rotate-180" : ""
                }`}
              />
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive(nav.path)
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
              >
                <span className="w-5 h-5">{nav.icon}</span>
                <span>{nav.name}</span>
              </Link>
            )
          )}

          {/* SUBMENU */}
          {nav.children && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[index]}px`
                    : 0,
              }}
            >
              <ul className="ml-6 border-l border-slate-700 pl-4 mt-2">
                {nav.children.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      href={sub.path || "#"}
                      className={`block px-3 py-2 rounded-lg text-sm
                        ${
                          isActive(sub.path)
                            ? "bg-blue-500 text-white"
                            : "text-slate-400 hover:bg-slate-700 hover:text-white"
                        }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-[290px] h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="py-6 flex justify-center border-b border-slate-700">
        <Image
          src="/images/logo/logo.svg"
          alt="Logo"
          width={120}
          height={40}
        />
      </div>

      <div className="p-4">
        <h2 className="text-xs uppercase text-slate-400 mb-4">
          Menu
        </h2>

        {renderMenuItems(menuData)}
      </div>
    </aside>
  );
};

export default AdminSidebar;