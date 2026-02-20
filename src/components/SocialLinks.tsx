import React from "react";
import { ArrowUpRight, CookingPot, Github, Linkedin } from "lucide-react";

const socialLinks = [
  {
    id: 1,
    href: process.env.NEXT_PUBLIC_BALANCED_BITE_URL || "#",
    icon: <CookingPot size={24} className="text-amber-500" />,
    label: "Balance Bite",
    description: "Read my food articles",
  },
  {
    id: 2,
    href: process.env.NEXT_PUBLIC_GITHUB_URL || "#",
    icon: <Github size={24} className="text-slate-300" />,
    label: "GitHub",
    description: "Check out my projects",
  },
  {
    id: 3,
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
    icon: <Linkedin size={24} className="text-blue-400" />,
    label: "LinkedIn",
    description: "Connect with me",
  },
];
interface SocialLinksProps {
  iconsOnly?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  iconsOnly = false,
}) => {
  if (iconsOnly) {
    return (
      <div className="mt-8 w-full">
        <div className="flex items-center justify-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 transition hover:-translate-y-0.5 hover:border-gray-500 hover:bg-gray-800"
            >
              <span className="transition-transform group-hover:scale-110">
                {link.icon}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/75 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-gray-600 hover:bg-gray-900"
          >
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/10 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span>{link.icon}</span>
                <div>
                  <p className="font-medium text-white">{link.label}</p>
                  <p className="text-sm text-gray-400">{link.description}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
