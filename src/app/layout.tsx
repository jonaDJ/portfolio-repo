import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import SidebarNav from "@/Layout/SidebarNav";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Jon | Portfolio & Blog",
    template: "%s | Jon",
  },
  description:
    "Portfolio and blog by Jon featuring web development projects, technical write-ups, and contact information.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.className} antialiased flex flex-col max-h-screen sm:h-auto sm:flex-row`}
      >
        <SidebarNav />
        <div
          id="app-scroll-container"
          className="flex justify-center w-full overflow-y-auto"
        >
          <div className="p-0 w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
