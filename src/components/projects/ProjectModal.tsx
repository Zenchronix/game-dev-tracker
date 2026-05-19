"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";
import type { GameProject, ProjectStage, DevMomentum, Platform } from "@/lib/types";
import { useProjectStore } from "@/contexts/ProjectStoreContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/cn";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-2)" }}>{label}</label>
      {children}
    </div>
  );
}

const PRESET_COLORS = [
  "#3b82f6", "#a855f7", "#22c55e", "#f97316",
  "#ef4444", "#06b6d4", "#eab308", "#ec4899",
];

const GENRES = [
  "Roguelike", "RPG", "Strategy", "Puzzle", "Platformer",
  "Survival", "Simulation", "Action", "Adventure", "Visual Novel", "Other",
];

const ALL_PLATFORMS: Platform[] = ["pc", "mac", "linux", "switch", "ps5", "xbox", "ios", "android", "web"];
const PLATFORM_LABELS: Record<Platform, string> = {
  pc: "PC", mac: "Mac", linux: "Linux", switch: "Switch",
  ps5: "PS5", xbox: "Xbox", ios: "iOS", android: "Android", web: "Web",
};

function defaultModules() {
  const now = new Date().toISOString().slice(0, 10);
  return [
    { key: "art" as const,       label: "美术", progress: 0, weight: 1.2, updatedAt: now },
    { key: "code" as const,      label: "程序", progress: 0, weight: 1.5, updatedAt: now },
    { key: "level" as const,     label: "关卡", progress: 0, weight: 1.0, updatedAt: now },
    { key: "audio" as const,     label: "音效", progress: 0, weight: 0.8, updatedAt: now },
    { key: "narrative" as const, label: "剧情", progress: 0, weight: 0.8, updatedAt: now },
    { key: "qa" as const,        label: "测试", progress: 0, weight: 1.0, updatedAt: now },
  ];
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 40);
}

interface ProjectModalProps {
  project?: GameProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { addProject, updateProject } = useProjectStore();
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const isEdit = !!project;

  // Core fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [genre, setGenre] = useState("Roguelike");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<ProjectStage>("concept");
  const [version, setVersion] = useState("v0.1.0");
  const [momentum, setMomentum] = useState<DevMomentum>("steady");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [autoSlug, setAutoSlug] = useState(true);

  // Advanced fields
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagline, setTagline] = useState("");
  const [engine, setEngine] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["pc"]);
  const [targetDate, setTargetDate] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [role, setRole] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setSlug(project.slug);
      setGenre(project.genre);
      setDescription(project.description);
      setStage(project.stage);
      setVersion(project.currentVersion);
      setMomentum(project.momentum);
      setColor(project.coverColor);
      setAutoSlug(false);
      setTagline(project.tagline ?? "");
      setEngine(project.engine ?? "");
      setPlatforms(project.platforms ?? ["pc"]);
      setTargetDate(project.targetReleaseDate ?? "");
      setTeamSize(project.teamSize ? String(project.teamSize) : "");
      setRole(project.role ?? "");
      setTags((project.tags ?? []).join(", "));
    }
  }, [project]);

  useEffect(() => {
    if (autoSlug && !isEdit) setSlug(slugify(name));
  }, [name, autoSlug, isEdit]);

  function togglePlatform(p: Platform) {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }

  function handleSave() {
    if (!name.trim()) return;
    const data: Omit<GameProject, "id" | "createdAt" | "updatedAt"> = {
      slug: slug || slugify(name),
      name: name.trim(),
      tagline: tagline.trim() || undefined,
      description,
      genre,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverColor: color,
      stage,
      currentVersion: version,
      momentum,
      overallProgress: 0,
      progressModules: defaultModules(),
      platforms,
      engine: engine.trim() || undefined,
      role: role.trim() || undefined,
      teamSize: teamSize ? parseInt(teamSize, 10) : undefined,
      targetReleaseDate: targetDate || undefined,
      links: [],
      isArchived: false,
    };
    if (isEdit && project) {
      updateProject(project.id, data);
    } else {
      addProject(data);
    }
    onClose();
  }

  const STAGES: ProjectStage[] = ["concept", "prototype", "production", "polish", "released", "paused"];
  const MOMENTUMS: DevMomentum[] = ["idle", "steady", "active", "crunch"];

  const stageLabels: Record<ProjectStage, string> = {
    concept: zh ? "概念期" : "Concept", prototype: zh ? "原型期" : "Prototype",
    production: zh ? "开发中" : "Production", polish: zh ? "打磨期" : "Polish",
    released: zh ? "已发布" : "Released", paused: zh ? "已暂停" : "Paused",
  };
  const stageColors: Record<ProjectStage, string> = {
    concept: "bg-zinc-700/60 text-zinc-300", prototype: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
    production: "bg-blue-500/15 text-blue-300 border border-blue-500/25", polish: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25",
    released: "bg-green-500/15 text-green-300 border border-green-500/25", paused: "bg-zinc-700/40 text-zinc-500",
  };
  const momentumLabels: Record<DevMomentum, string> = {
    idle:   zh ? "🌙 搁置中"   : "🌙 Idle",
    steady: zh ? "🌊 稳步推进" : "🌊 Steady",
    active: zh ? "⚡ 高度活跃" : "⚡ Active",
    crunch: zh ? "🔥 全力攻关" : "🔥 Crunch",
  };
  const momentumColors: Record<DevMomentum, string> = {
    idle:   "bg-zinc-700/60 text-zinc-400",
    steady: "bg-blue-500/15 text-blue-300 border border-blue-500/25",
    active: "bg-green-500/15 text-green-300 border border-green-500/25",
    crunch: "bg-orange-500/15 text-orange-300 border border-orange-500/25",
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg rounded-2xl shadow-2xl"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <span className="font-semibold" style={{ color: "var(--text-1)" }}>
              {isEdit ? (zh ? "编辑项目" : "Edit Project") : (zh ? "新建项目" : "New Project")}
            </span>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/8" style={{ color: "var(--text-3)" }}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[72vh] overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-4">

              {/* Name + color */}
              <div className="flex gap-3">
                <Field label={zh ? "项目名称 *" : "Project Name *"}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={zh ? "我的游戏" : "My Game"}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                    style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                  />
                </Field>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                    {zh ? "主题色" : "Color"}
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn("h-6 w-6 rounded-full border-2 transition-transform hover:scale-110", color === c ? "border-white" : "border-transparent")}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slug */}
              <Field label="URL Slug">
                <input
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                  placeholder="my-game"
                  className="num w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-2)" }}
                />
              </Field>

              {/* Genre + Version */}
              <div className="grid grid-cols-2 gap-3">
                <Field label={zh ? "游戏类型" : "Genre"}>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                  >
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label={zh ? "当前版本" : "Version"}>
                  <input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="num w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                    style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                  />
                </Field>
              </div>

              {/* Description */}
              <Field label={zh ? "项目描述" : "Description"}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                  style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                />
              </Field>

              {/* Stage */}
              <div>
                <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  {zh ? "当前阶段" : "Stage"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button key={s} onClick={() => setStage(s)}
                      className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all", stageColors[s], stage === s && "ring-2 ring-blue-500/40 ring-offset-1 ring-offset-transparent")}>
                      {stageLabels[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Momentum */}
              <div>
                <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                  {zh ? "开发势头" : "Dev Momentum"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOMENTUMS.map((m) => (
                    <button key={m} onClick={() => setMomentum(m)}
                      className={cn("rounded-lg py-1.5 text-xs font-medium transition-all", momentumColors[m], momentum === m && "ring-2 ring-blue-500/40 ring-offset-1 ring-offset-transparent")}>
                      {momentumLabels[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Advanced fields ── */}
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
                style={{ color: "var(--text-3)" }}
              >
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform"
                  style={{ transform: showAdvanced ? "rotate(180deg)" : "none" }}
                />
                {showAdvanced ? (zh ? "收起详细信息" : "Hide details") : (zh ? "展开更多字段" : "More fields")}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tagline */}
                    <Field label={zh ? "一句话描述" : "Tagline"}>
                      <input
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder={zh ? "深渊肉鸽 · 无尽轮回" : "One-line pitch"}
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500/50"
                        style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                      />
                    </Field>

                    {/* Engine + Target Date */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={zh ? "引擎" : "Engine"}>
                        <input
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          placeholder="Unity / Godot / Unreal"
                          className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                        />
                      </Field>
                      <Field label={zh ? "目标发布日" : "Target Release"}>
                        <input
                          type="date"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="num w-full rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                        />
                      </Field>
                    </div>

                    {/* Team */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={zh ? "团队规模" : "Team Size"}>
                        <input
                          value={teamSize}
                          onChange={(e) => setTeamSize(e.target.value)}
                          type="number"
                          min={1}
                          placeholder="1"
                          className="num w-full rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                        />
                      </Field>
                      <Field label={zh ? "我的角色" : "My Role"}>
                        <input
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder={zh ? "独立开发" : "Solo Dev"}
                          className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                        />
                      </Field>
                    </div>

                    {/* Platforms */}
                    <div>
                      <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-2)" }}>
                        {zh ? "目标平台" : "Platforms"}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_PLATFORMS.map((p) => (
                          <button
                            key={p}
                            onClick={() => togglePlatform(p)}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                              platforms.includes(p)
                                ? "ring-2 ring-blue-500/40"
                                : "opacity-50"
                            )}
                            style={{
                              backgroundColor: platforms.includes(p) ? `${color}22` : "var(--bg-raised)",
                              color: platforms.includes(p) ? color : "var(--text-3)",
                              border: `1px solid ${platforms.includes(p) ? `${color}40` : "var(--border-color)"}`,
                            }}
                          >
                            {PLATFORM_LABELS[p]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <Field label={zh ? "标签（逗号分隔）" : "Tags (comma separated)"}>
                      <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="pixel-art, roguelite, dark-fantasy"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-1)" }}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/8" style={{ color: "var(--text-2)" }}>
              {zh ? "取消" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="h-3.5 w-3.5" />
              {isEdit ? (zh ? "保存" : "Save") : (zh ? "创建项目" : "Create")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
