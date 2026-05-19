"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useLogStore } from "@/contexts/LogStoreContext";
import { useProjectStore } from "@/contexts/ProjectStoreContext";
import { useTaskStore } from "@/contexts/TaskStoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTotalHours, getStreak } from "@/lib/stats";
import WidgetCard from "../WidgetCard";

export default function LifetimeStatsWidget() {
  const { logs } = useLogStore();
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const totalHours = getTotalHours(logs, projects);
  const streak = getStreak(logs);

  // Best single-week
  const weekBuckets: Record<string, number> = {};
  logs.forEach((l) => {
    const d = new Date(l.date);
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    weekBuckets[key] = (weekBuckets[key] ?? 0) + l.durationMinutes;
  });
  const bestWeekH = Math.max(0, ...Object.values(weekBuckets)) / 60;

  const avgDailyH = streak.activeDays > 0
    ? Math.round((totalHours / streak.activeDays) * 10) / 10
    : 0;

  const doneTasks = tasks.filter((t) => t.status === "done").length;

  const stats = [
    { label: zh ? "总开发时长" : "Total Hours",   value: `${totalHours}`,       unit: "h",  color: "#a855f7" },
    { label: zh ? "活跃天数"   : "Active Days",   value: `${streak.activeDays}`, unit: zh ? "天" : "d", color: "#3b82f6" },
    { label: zh ? "项目总数"   : "Projects",      value: `${projects.length}`,   unit: "",   color: "#22c55e" },
    { label: zh ? "日均时长"   : "Daily Avg",     value: `${avgDailyH}`,         unit: "h",  color: "#f97316" },
    { label: zh ? "最高单周"   : "Best Week",     value: `${Math.round(bestWeekH * 10) / 10}`, unit: "h", color: "#06b6d4" },
    { label: zh ? "已完成任务" : "Done Tasks",    value: `${doneTasks}`,         unit: "",   color: "#eab308" },
  ];

  return (
    <WidgetCard
      id="lifetime-stats"
      title={zh ? "个人战绩" : "Lifetime Stats"}
      icon={<Trophy className="h-4 w-4" />}
      accentColor="#a855f7"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: `${s.color}0d` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="num text-xl font-black" style={{ color: s.color }}>{s.value}</span>
              <span className="text-[10px] font-medium" style={{ color: `${s.color}99` }}>{s.unit}</span>
            </div>
            <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-3)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </WidgetCard>
  );
}
