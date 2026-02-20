"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Newspaper,
  KanbanSquare,
  MessageCircleMore,
  Menu,
  X,
  User,
} from "lucide-react";

const navLinks = [
  {
    id: 1,
    href: "/",
    icon: <House size={24} className="text-red-500" />,
    label: "Home",
  },
  {
    id: 2,
    href: "/blog",
    icon: <Newspaper size={24} className="text-blue-400" />,
    label: "Blog",
  },
  {
    id: 3,
    href: "/projects",
    icon: <KanbanSquare size={24} className="text-orange-400" />,
    label: "Projects",
  },
  {
    id: 4,
    href: "/contact",
    icon: <MessageCircleMore size={24} className="text-emerald-300" />,
    label: "Connect",
  },
  {
    id: 5,
    href: "/#about",
    icon: <User size={24} className="text-violet-400" />,
    label: "About",
  },
];

const SIDEBAR_STATE_KEY = "sidebar_nav_state";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hash, setHash] = useState("");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const applyViewportState = () => {
      const mobileView = mediaQuery.matches;
      setIsMobile(mobileView);

      if (mobileView) {
        setIsOpen(false);
        return;
      }

      const persistedState = window.localStorage.getItem(SIDEBAR_STATE_KEY);
      setIsOpen(persistedState === "open");
    };

    applyViewportState();

    mediaQuery.addEventListener("change", applyViewportState);
    return () => mediaQuery.removeEventListener("change", applyViewportState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isMobile) return;
    window.localStorage.setItem(
      SIDEBAR_STATE_KEY,
      isOpen ? "open" : "closed"
    );
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const sectionId = window.location.hash.replace("#", "");
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);

    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        sidebarRef.current &&
        event.target instanceof Node &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={sidebarRef}
      className={`z-50 left-0 top-0 bg-gray-950 py-0 px-0 flex flex-col items-start justify-start gap-6 border-r border-gray-800 transition-transform duration-300 ${
        isOpen ? "w-55" : "w-auto"
      } sm:py-8 sm:px-1 sm:h-screen`}
    >
      <button
        onClick={toggleSidebar}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        className="py-2 px-2 hover:bg-gray-600 rounded-lg transition hidden sm:block"
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div className="flex flex-row gap-0 w-full border-b-1 sm:flex-col sm:gap-4 sm:border-b-0">
        {navLinks.map((link) => {
          const isAboutLink = link.href === "/#about";
          const isHomeLink = link.href === "/";
          const isAboutHash = hash === "#about" || hash === "#additional-info";
          const isActive = isAboutLink
            ? pathname === "/" && isAboutHash
            : isHomeLink
            ? pathname === "/" && !isAboutHash
            : pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-label={link.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (isMobile) {
                  setIsOpen(false);
                }
              }}
              className={`flex items-center justify-center gap-4 py-3 px-2 w-full hover:text-gray-900 hover:bg-white rounded-0 transition-all duration-200 ease-in-out ${
                isActive ? "bg-gray-500 text-gray-900" : ""
              } sm:justify-start sm:rounded-lg`}
            >
              {link.icon}
              <span
                className={`text-lg font-medium ${
                  isOpen ? "hidden sm:block" : "hidden"
                } `}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNav;
