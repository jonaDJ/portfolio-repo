import React from "react";
import { CookingPot, Github, Linkedin } from "lucide-react";

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
    icon: <Github size={24} className="text-purple-500" />,
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
  return (
    <div className="mt-12 w-full">
      <div className="flex flex-row gap-6 justify-center">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={`flex items-center justify-center md:justify-start gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg transition hover:bg-gray-800 hover:border-gray-700 ${
              !iconsOnly ? "sm:flex-1" : "sm:flex"
            }  max-w-xs md:max-w-md`}
          >
            {link.icon}
            {!iconsOnly && (
              <div className="hidden sm:block">
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};
