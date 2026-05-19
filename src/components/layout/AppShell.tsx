"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GridBackground from "./GridBackground";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import CommandPalette from "@/components/search/CommandPalette";
import { useSearch } from "@/contexts/SearchContext";

function GlobalKeyListener() {
  const { openPalette, closePalette, open } = useSearch();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette(); else openPalette();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPalette, closePalette]);
  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <GlobalKeyListener />
      <GridBackground />

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — no left margin on mobile, 220px on desktop */}
      <div className="relative md:ml-[220px] flex min-h-screen flex-col">
        <TopNav onMenuClick={() => setSidebarOpen((v) => !v)} />
        {/* pb-16 on mobile for bottom nav, pb-0 on desktop */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      <BottomNav />
      <CommandPalette />
    </div>
  );
}
