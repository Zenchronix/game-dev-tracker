# 游戏开发记录站

一个为独立游戏开发者设计的项目管理与开发记录工具。极客风格，深色优先，高信息密度，像 Linear 一样好用。

**在线地址**：[game-dev-tracker.netlify.app](https://game-dev-tracker.netlify.app)（部署后更新）

---

## 功能概览

- **概览仪表盘** — 开发时长、连续打卡天数、里程碑成就、本周节奏热力图，模块可自由显隐排序
- **项目管理** — 多游戏项目并行，支持网格/列表视图，内联编辑所有字段（名称、类型、引擎、平台、版本、简介、开发势头……）
- **开发日志** — 按日期记录每天完成内容、遇到的问题、明日计划、心情和开发时长，支持标签分类
- **任务看板** — 三视图（看板 / 列表 / 专注），拖拽改变状态，可折叠分组，任务优先级与截止日期
- **进度分析** — 日均时长折线图、工作类型分布、模块雷达图、项目进度对比
- **版本记录** — 记录每个版本的发布说明与迭代时间线
- **开发里程碑** — 自动解锁成就（首次日志、累计 50 小时、连续打卡……），展示在侧边栏

---

## 设计风格

- 深色 / 浅色双模式
- Geek · Minimal · Dashboard 气质
- 参考 Linear、Vercel、Raycast、GitHub 的交互语言
- Framer Motion 动效，克制丝滑

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| 动效 | Framer Motion |
| 图表 | Recharts |
| 拖拽 | @dnd-kit |
| 状态 | React Context + localStorage |
| 部署 | Netlify |

---

## 本地运行

```bash
git clone https://github.com/Zenchronix/game-dev-tracker.git
cd game-dev-tracker
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

---

## 数据说明

所有数据存储在浏览器 **localStorage**，无需后端，无需账号，完全本地。清除浏览器缓存会重置数据，建议定期导出（后续版本会支持导出功能）。

---

## 作者

[@Zenchronix](https://github.com/Zenchronix)
