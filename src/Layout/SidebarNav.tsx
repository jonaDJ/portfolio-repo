"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  BookOpen,
  Terminal,
  Mail,
  Menu,
  X,
  User,
} from "lucide-react";

const navLinks = [
  {
    id: 1,
    href: "/",
    icon: <BrainCircuit size={24} className="text-sky-400" />,
    label: "Home",
  },
  {
    id: 2,
    href: "/blog",
    icon: <BookOpen size={24} className="text-rose-500" />,
    label: "Blog",
  },
  {
    id: 3,
    href: "/projects",
    icon: <Terminal size={24} className="text-lime-400" />,
    label: "Projects",
  },
  {
    id: 4,
    href: "/contact",
    icon: <Mail size={24} className="text-indigo-400" />,
    label: "Connect",
  },
  {
    id: 5,
    href: "/#about",
    icon: <User size={24} className="text-teal-500" />,
    label: "About",
  },
];

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const sectionId = window.location.hash.replace("#", "");
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname]);

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
          const isActive = pathname === link.href;
          return (
            <a
              key={link.id}
              href={link.href}
              className={`flex items-center justify-center gap-4 py-3 px-2 w-full hover:text-gray-900 hover:bg-white rounded-0 transition-all duration-200 ease-in-out ${
                isActive ? "bg-gray-500 text-gray-900" : ""
              } sm:justify-start sm:rounded-lg`}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {link.icon}
              <span
                className={`text-lg font-medium ${
                  isOpen ? "hidden sm:block" : "hidden"
                } `}
              >
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNav;
