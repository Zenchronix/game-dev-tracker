"use client";

import { useState } from "react";
import { Search, Plus, Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearch } from "@/contexts/SearchContext";
import LogModal from "@/components/logs/LogModal";
import NotificationPanel from "./NotificationPanel";

interface TopNavProps {
  onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { openPalette } = useSearch();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const pages = t.topNav.pages as Record<string, { title: string; desc: string }>;
  const matched = Object.entries(pages)
    .filter(([k]) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
    .sort((a, b) => b[0].length - a[0].length)[0];
  const info = matched?.[1] ?? { title: t.appName, desc: "" };

  return (
    <>
      <header
        className="sticky top-0 z-20 flex h-14 items-center justify-between px-4 md:px-6 backdrop-blur-md"
        style={{
          backgroundColor: "var(--bg-overlay)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/8 md:hidden"
            style={{ color: "var(--text-2)" }}
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>
            {info.title}
          </h1>
          {info.desc && (
            <span className="hidden items-center gap-1.5 sm:flex">
              <span style={{ color: "var(--text-3)" }}>/</span>
              <span className="text-xs" style={{ color: "var(--text-3)" }}>{info.desc}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Search — icon only on mobile, full button on desktop */}
          <button
            onClick={openPalette}
            className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 md:px-3"
            style={{ borderColor: "var(--border-color)", backgroundColor: "rgba(128,128,128,0.04)", color: "var(--text-3)" }}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.topNav.search}</span>
            <kbd className="ml-1 hidden rounded px-1.5 py-0.5 font-mono text-[10px] md:inline" style={{ backgroundColor: "rgba(128,128,128,0.08)", color: "var(--text-3)" }}>
              Ctrl+K
            </kbd>
          </button>

          {/* Quick log */}
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500 md:px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.topNav.newLog}</span>
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotif((v) => !v)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${showNotif ? "bg-blue-500/10" : "hover:bg-white/8"}`}
              style={{ color: showNotif ? "#60a5fa" : "var(--text-3)" }}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
            </button>
            <NotificationPanel open={showNotif} onClose={() => setShowNotif(false)} />
          </div>
        </div>
      </header>

      {showLogModal && (
        <LogModal onClose={() => setShowLogModal(false)} />
      )}
    </>
  );
}
