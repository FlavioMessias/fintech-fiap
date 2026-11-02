"use client";

import { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div
      className="
        min-h-screen
        bg-[#f4f6f5]
      "
    >
      <Sidebar />

      <main
        className="
          min-h-screen
          md:ml-[248px]
        "
      >
        {children}
      </main>
    </div>
  );
}