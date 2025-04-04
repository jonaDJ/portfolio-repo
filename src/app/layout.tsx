import type { Metadata } from "next";
import "./globals.css";
import SidebarNav from "@/Layout/SidebarNav";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased overflow-hidden flex flex-col max-h-screen sm:h-auto sm:flex-row`}
      >
        <SidebarNav />
        <div className="flex justify-center w-full overflow-y-auto">
          <div className="p-0 w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
