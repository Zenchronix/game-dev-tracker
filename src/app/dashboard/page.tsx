"use client";

import { useMemo } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPageWrapper from "@/components/ui/AnimatedPageWrapper";
import MilestoneToast from "@/components/ui/MilestoneToast";
import { useLayoutStore } from "@/contexts/LayoutStoreContext";
import { useMilestones } from "@/contexts/MilestoneContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { WidgetId } from "@/contexts/LayoutStoreContext";

// Widgets
import TodayFocusWidget    from "@/components/dashboard/widgets/TodayFocusWidget";
import ActiveProjectsWidget from "@/components/dashboard/widgets/ActiveProjectsWidget";
import StreakWidget         from "@/components/dashboard/widgets/StreakWidget";
import LifetimeStatsWidget  from "@/components/dashboard/widgets/LifetimeStatsWidget";
import WeeklyRhythmWidget   from "@/components/dashboard/widgets/WeeklyRhythmWidget";
import TaskFocusWidget      from "@/components/dashboard/widgets/TaskFocusWidget";
import RecentLogsWidget     from "@/components/dashboard/widgets/RecentLogsWidget";
import HeatmapWidget        from "@/components/dashboard/widgets/HeatmapWidget";
import AchievementsWidget   from "@/components/dashboard/widgets/AchievementsWidget";

/* Widget registry — maps id to component */
const WIDGET_MAP: Record<WidgetId, React.ReactNode> = {
  "today-focus":     <TodayFocusWidget />,
  "active-projects": <ActiveProjectsWidget />,
  "streak":          <StreakWidget />,
  "lifetime-stats":  <LifetimeStatsWidget />,
  "weekly-rhythm":   <WeeklyRhythmWidget />,
  "task-focus":      <TaskFocusWidget />,
  "recent-logs":     <RecentLogsWidget />,
  "heatmap":         <HeatmapWidget />,
  "achievements":    <AchievementsWidget />,
};

const WIDGET_LABEL: Record<WidgetId, { zh: string; en: string }> = {
  "today-focus":     { zh: "今日焦点",   en: "Today's Focus" },
  "active-projects": { zh: "活跃项目",   en: "Active Projects" },
  "streak":          { zh: "连续打卡",   en: "Streak" },
  "lifetime-stats":  { zh: "个人战绩",   en: "Lifetime Stats" },
  "weekly-rhythm":   { zh: "本周节奏",   en: "Weekly Rhythm" },
  "task-focus":      { zh: "待办焦点",   en: "Task Focus" },
  "recent-logs":     { zh: "最近日志",   en: "Recent Logs" },
  "heatmap":         { zh: "开发热力图", en: "Heatmap" },
  "achievements":    { zh: "成就墙",     en: "Achievements" },
};

/* Size → colspan class */
function colSpan(size: string) {
  switch (size) {
    case "sm": return "col-span-12 md:col-span-4";
    case "md": return "col-span-12 md:col-span-6";
    case "lg": return "col-span-12 md:col-span-8";
    default:   return "col-span-12";
  }
}

export default function DashboardPage() {
  const { widgets, setVisible, reset } = useLayoutStore();
  const { newlyUnlocked, dismissNew } = useMilestones();
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const visible = useMemo(
    () => [...widgets].filter((w) => w.visible).sort((a, b) => a.order - b.order),
    [widgets]
  );
  const hidden = useMemo(
    () => widgets.filter((w) => !w.visible),
    [widgets]
  );

  return (
    <>
      {/* Milestone toast */}
      <MilestoneToast achievement={newlyUnlocked} onDismiss={dismissNew} />

      <AnimatedPageWrapper className="p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>
              {zh ? "概览" : "Dashboard"}
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>
              {zh ? "模块可点击右上角 ⋯ 调整大小或隐藏" : "Click ⋯ on any module to resize or hide"}
            </p>
          </div>
          {/* Reset layout */}
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-white/8"
            style={{ color: "var(--text-3)" }}
            title={zh ? "重置布局" : "Reset layout"}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {zh ? "重置" : "Reset"}
          </button>
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-12 gap-4">
          <AnimatePresence>
            {visible.map((cfg) => (
              <motion.div
                key={cfg.id}
                className={colSpan(cfg.size)}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {WIDGET_MAP[cfg.id]}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Hidden modules restore bar */}
        {hidden.length > 0 && (
          <motion.div
            className="mt-6 rounded-2xl border border-dashed px-5 py-4"
            style={{ borderColor: "var(--border-color)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-3 text-xs font-medium" style={{ color: "var(--text-3)" }}>
              <Eye className="mr-1 inline h-3.5 w-3.5" />
              {zh ? "已隐藏的模块（点击重新显示）" : "Hidden modules (click to restore)"}
            </p>
            <div className="flex flex-wrap gap-2">
              {hidden.map((cfg) => (
                <button
                  key={cfg.id}
                  onClick={() => setVisible(cfg.id, true)}
                  className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-px hover:border-blue-500/40"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-2)", backgroundColor: "var(--bg-card)" }}
                >
                  <Eye className="h-3 w-3" style={{ color: "#3b82f6" }} />
                  {zh ? WIDGET_LABEL[cfg.id].zh : WIDGET_LABEL[cfg.id].en}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatedPageWrapper>
    </>
  );
}
