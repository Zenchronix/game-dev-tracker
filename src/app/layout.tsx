import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TaskStoreProvider } from "@/contexts/TaskStoreContext";
import { LogStoreProvider } from "@/contexts/LogStoreContext";
import { ProjectStoreProvider } from "@/contexts/ProjectStoreContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { VersionStoreProvider } from "@/contexts/VersionStoreContext";
import { MilestoneProvider } from "@/contexts/MilestoneContext";
import { LayoutStoreProvider } from "@/contexts/LayoutStoreContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "开发追踪器 — 游戏开发工作室",
  description: "记录游戏开发进度、每日日志与里程碑。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} light`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <SearchProvider>
              <ProjectStoreProvider>
                <LogStoreProvider>
                  <VersionStoreProvider>
                    <TaskStoreProvider>
                      <MilestoneProvider>
                        <LayoutStoreProvider>
                          <AppShell>{children}</AppShell>
                        </LayoutStoreProvider>
                      </MilestoneProvider>
                    </TaskStoreProvider>
                  </VersionStoreProvider>
                </LogStoreProvider>
              </ProjectStoreProvider>
            </SearchProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
