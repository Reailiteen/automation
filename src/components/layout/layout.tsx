"use client";

import React, { ReactNode } from "react";
import Navigation from "./navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;