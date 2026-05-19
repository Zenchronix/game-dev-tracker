"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Gamepad2, BookOpen, BarChart3,
  CheckSquare, Settings, Zap, Languages, Sun, Moon,
  ChevronDown, Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMilestones } from "@/contexts/MilestoneContext";

function MilestoneSidebar() {
  const { achievements } = useMilestones();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const [open, setOpen] = useState(true);

  const unlocked = achievements.filter((a) => a.unlocked);
  const nextLocked = achievements.filter((a) => !a.unlocked && (a.progress ?? 0) > 0)
    .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
    .slice(0, 3);

  return (
    <div className="mx-2 my-2 overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
      >
        <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        <span className="flex-1 text-left text-xs font-semibold" style={{ color: "var(--text-2)" }}>
          {zh ? "开发里程碑" : "Dev Milestones"}
        </span>
        <span className="num rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
          {unlocked.length}/{achievements.length}
        </span>
        <ChevronDown
          className="h-3 w-3 shrink-0 transition-transform"
          style={{ color: "var(--text-3)", transform: open ? "none" : "rotate(-90deg)" }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t px-3 pb-3 pt-2" style={{ borderColor: "var(--border-color)" }}>
              {/* Unlocked */}
              {unlocked.length > 0 && (
                <div className="mb-2">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    {zh ? "已解锁" : "Unlocked"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {unlocked.map((a) => (
                      <span
                        key={a.id}
                        title={`${a.label}: ${a.desc}`}
                        className="flex h-7 w-7 cursor-default items-center justify-center rounded-lg text-base transition-transform hover:scale-110"
                        style={{ backgroundColor: "#eab30815", border: "1px solid #eab30830" }}
                      >
                        {a.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* In progress */}
              {nextLocked.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
                    {zh ? "进行中" : "In Progress"}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {nextLocked.map((a) => (
                      <div key={a.id}>
                        <div className="mb-0.5 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-2)" }}>
                            <span className="text-sm opacity-50">{a.emoji}</span>
                            {a.label}
                          </span>
                          <span className="num text-[9px]" style={{ color: "var(--text-3)" }}>
                            {a.progress}%
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-raised)" }}>
                          <motion.div
                            className="h-1 rounded-full bg-amber-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${a.progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unlocked.length === 0 && nextLocked.length === 0 && (
                <p className="text-center text-[10px] py-2" style={{ color: "var(--text-3)" }}>
                  {zh ? "记录第一条日志解锁成就！" : "Log to unlock!"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { t, lang, toggle: toggleLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard,  icon: LayoutDashboard },
    { href: "/projects",  label: t.nav.projects,   icon: Gamepad2 },
    { href: "/logs",      label: t.nav.devLogs,    icon: BookOpen },
    { href: "/analytics", label: t.nav.analytics,  icon: BarChart3 },
    { href: "/tasks",     label: t.nav.tasks,      icon: CheckSquare },
  ];

  return (
    <aside
      className="fixed left-0 top-0 z-30 flex h-screen w-[220px] flex-col backdrop-blur-sm"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-color)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-14 items-center gap-2.5 px-4"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/30">
          <Zap className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-1)" }}>
            {t.appName}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{t.appSub}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3">
        <p
          className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-3)" }}
        >
          {t.nav.workspace}
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn("sidebar-item", isActive && "active")}>
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Milestones — takes remaining space with scroll */}
      <div className="flex-1 overflow-y-auto py-1" style={{ minHeight: 0 }}>
        <MilestoneSidebar />
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1 p-3" style={{ borderTop: "1px solid var(--border-color)" }}>
        <button
          onClick={toggleTheme}
          className="sidebar-item justify-between"
          title={theme === "dark" ? "切换白天模式" : "切换夜晚模式"}
        >
          <span className="flex items-center gap-2.5">
            {theme === "dark"
              ? <Moon className="h-4 w-4 shrink-0" />
              : <Sun className="h-4 w-4 shrink-0 text-yellow-400" />}
            <span style={{ color: "var(--text-2)" }}>
              {theme === "dark" ? (lang === "zh" ? "夜晚模式" : "Night") : (lang === "zh" ? "白天模式" : "Day")}
            </span>
          </span>
          <div
            className="flex h-5 w-9 items-center rounded-full px-0.5 transition-all duration-300"
            style={{
              backgroundColor: theme === "dark" ? "rgba(59,130,246,0.3)" : "rgba(234,179,8,0.3)",
              justifyContent: theme === "dark" ? "flex-end" : "flex-start",
            }}
          >
            <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
          </div>
        </button>

        <button
          onClick={toggleLang}
          className="sidebar-item justify-between"
          title={lang === "zh" ? "Switch to English" : "切换为中文"}
        >
          <span className="flex items-center gap-2.5">
            <Languages className="h-4 w-4 shrink-0" />
            <span>{lang === "zh" ? "中文" : "English"}</span>
          </span>
          <span
            className="num rounded border px-1.5 py-0.5 text-[11px]"
            style={{ borderColor: "var(--border-color)", color: "var(--text-3)" }}
          >
            {lang === "zh" ? "EN" : "中"}
          </span>
        </button>

        <Link href="/settings" className="sidebar-item">
          <Settings className="h-4 w-4 shrink-0" />
          <span>{t.nav.settings}</span>
        </Link>
      </div>
    </aside>
  );
}
