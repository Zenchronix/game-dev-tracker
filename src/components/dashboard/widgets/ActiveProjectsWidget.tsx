"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, ArrowRight, Moon, Plus, CalendarDays, Clock } from "lucide-react";
import { useProjectStore } from "@/contexts/ProjectStoreContext";
import { useLogStore } from "@/contexts/LogStoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDayN, getProjectHours, getProjectWeekHours, getDaysSinceActivity, getDaysUntilRelease } from "@/lib/stats";
import { MomentumBadge, StageBadge } from "@/components/ui/Badge";
import WidgetCard from "../WidgetCard";
import LogModal from "@/components/logs/LogModal";
import { useState } from "react";

function ProjectRow({
  project,
  logs,
  lang,
  index,
}: {
  project: ReturnType<typeof useProjectStore>["projects"][0];
  logs: ReturnType<typeof useLogStore>["logs"];
  lang: string;
  index: number;
}) {
  const zh = lang === "zh";
  const [showLog, setShowLog] = useState(false);

  const hours = getProjectHours(project, logs);
  const dayN = getDayN(project);
  const weekH = getProjectWeekHours(project.id, logs);
  const daysSince = getDaysSinceActivity(project.id, logs);
  const daysLeft = getDaysUntilRelease(project);
  const isSleeping = daysSince !== null && daysSince >= 7;

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          borderColor: isSleeping ? "var(--border-color)" : `${project.coverColor}30`,
          backgroundColor: "var(--bg-card)",
          opacity: isSleeping ? 0.7 : 1,
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isSleeping ? 0.7 : 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top accent */}
        <div
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${project.coverColor}, transparent)` }}
        />

        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              {project.icon && <span className="text-sm">{project.icon}</span>}
              <span className="font-semibold truncate text-sm" style={{ color: "var(--text-1)" }}>
                {project.name}
              </span>
              <span className="num text-[10px] shrink-0" style={{ color: "var(--text-3)" }}>
                {project.currentVersion}
              </span>
            </div>
            {project.tagline && (
              <p className="text-[11px] truncate" style={{ color: `${project.coverColor}cc` }}>
                {project.tagline}
              </p>
            )}
          </div>
          <MomentumBadge momentum={project.momentum} />
        </div>

        {/* Sleeping indicator */}
        {isSleeping && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-dashed px-2.5 py-1.5"
            style={{ borderColor: "var(--border-color)" }}>
            <Moon className="h-3 w-3" style={{ color: "var(--text-3)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-3)" }}>
              {zh ? `已沉睡 ${daysSince} 天` : `Inactive for ${daysSince} days`}
            </span>
          </div>
        )}

        {/* Key metrics */}
        <div className="mb-3 grid grid-cols-3 gap-1.5 sm:gap-2">
          {[
            { label: zh ? "累计时长" : "Total Hours", value: `${hours}h`, color: project.coverColor },
            { label: zh ? `第 ${dayN} 天` : `Day ${dayN}`, value: `D${dayN}`, color: "#a855f7" },
            { label: zh ? "本周" : "This Week", value: `${weekH}h`, color: "#22c55e" },
          ].map((m) => (
            <div key={m.label} className="text-center rounded-lg px-2 py-1.5"
              style={{ backgroundColor: `${m.color}0d` }}>
              <p className="num text-base font-bold" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9px] mt-0.5" style={{ color: "var(--text-3)" }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="mb-3">
          <div className="mb-1 flex justify-between">
            <span className="text-[10px]" style={{ color: "var(--text-3)" }}>
              {zh ? "总进度" : "Overall"}
            </span>
            <span className="num text-[10px] font-bold" style={{ color: project.coverColor }}>
              {project.overallProgress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-raised)" }}>
            <motion.div
              className="h-1.5 rounded-full"
              style={{ backgroundColor: project.coverColor }}
              initial={{ width: 0 }}
              animate={{ width: `${project.overallProgress}%` }}
              transition={{ delay: index * 0.06 + 0.3, duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {daysLeft !== null && (
              <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-3)" }}>
                <span>🎯</span>
                <span className="num">
                  {daysLeft > 0
                    ? (zh ? `还差 ${daysLeft} 天` : `${daysLeft}d left`)
                    : (zh ? "已超目标日期" : "Past target")}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => { e.preventDefault(); setShowLog(true); }}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/8"
              style={{ color: project.coverColor }}
            >
              <Plus className="h-3 w-3" />
              {zh ? "记录" : "Log"}
            </button>
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/8"
              style={{ color: "var(--text-3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {zh ? "进入" : "Open"}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
      {showLog && <LogModal defaultProjectId={project.id} onClose={() => setShowLog(false)} />}
    </>
  );
}

export default function ActiveProjectsWidget() {
  const { projects } = useProjectStore();
  const { logs } = useLogStore();
  const { lang } = useLanguage();
  const zh = lang === "zh";

  const active = projects
    .filter((p) => !p.isArchived)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <WidgetCard
      id="active-projects"
      title={zh ? "活跃项目" : "Active Projects"}
      icon={<Gamepad2 className="h-4 w-4" />}
      accentColor="#3b82f6"
      headerRight={
        <Link href="/projects" className="flex items-center gap-1 text-xs transition-colors hover:opacity-80" style={{ color: "var(--text-3)" }}>
          {zh ? "全部" : "All"} <ArrowRight className="h-3 w-3" />
        </Link>
      }
    >
      {active.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {active.slice(0, 3).map((p, i) => (
            <ProjectRow key={p.id} project={p} logs={logs} lang={lang} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            {zh ? "还没有项目，去创建第一个吧" : "No projects yet"}
          </p>
          <Link href="/projects" className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
            <Plus className="h-3 w-3" />{zh ? "新建项目" : "New Project"}
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
