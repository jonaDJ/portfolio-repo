import type { Metadata } from "next";
import "./globals.css";
import SidebarNav from "@/Layout/SidebarNav";

export const metadata: Metadata = {
  title: {
    default: "Jon | Portfolio & Blog",
    template: "%s | Jon",
  },
  description:
    "Portfolio and blog by Jon featuring web development projects, technical write-ups, and contact information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col max-h-screen sm:h-auto sm:flex-row">
        <SidebarNav />
        <div className="flex justify-center w-full overflow-y-auto">
          <div className="p-0 w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
