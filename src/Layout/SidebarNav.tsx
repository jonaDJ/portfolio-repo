"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Book,
  Code,
  Mail,
  SidebarOpen,
  SidebarClose,
} from "lucide-react";

const navLinks = [
  {
    id: 1,
    href: "/",
    icon: <Home size={24} className="text-blue-500" />,
    label: "Home",
  },
  {
    id: 2,
    href: "/blog",
    icon: <Book size={24} className="text-purple-500" />,
    label: "Blog",
  },
  {
    id: 3,
    href: "/projects",
    icon: <Code size={24} className="text-green-500" />,
    label: "Projects",
  },
  {
    id: 4,
    href: "/contact",
    icon: <Mail size={24} className="text-red-500" />,
    label: "Contact",
  },
];

const SidebarNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

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

    const handleMouseDown = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    const handleTouchStart = (event: TouchEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    }); // Adding passive listener for touch

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (
    <nav
      ref={sidebarRef}
      className={`fixed z-50 left-0 top-0 h-screen bg-gray-950 py-8 px-1 flex flex-col items-start justify-start gap-6 border-r border-gray-800 transition-transform duration-300 `}
    >
      <button
        onClick={toggleSidebar}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
        className="py-2 px-2 hover:bg-gray-600 rounded-lg transition"
      >
        {isOpen ? <SidebarOpen /> : <SidebarClose />}
      </button>
      <div className="flex flex-col gap-4 w-full">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex items-center gap-3 py-2 px-2 w-full text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition"
          >
            {link.icon}
            <span className={`text-lg ${isOpen ? "" : "hidden"}`}>
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SidebarNav;
