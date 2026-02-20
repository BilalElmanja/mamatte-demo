"use client";

import { DashboardHeader } from "./_components/dashboard-header";
import { StatCards } from "./_components/stat-cards";
import { LatestIdeas } from "./_components/latest-ideas";
import { ViralAlerts } from "./_components/viral-alerts";
import { TikTokTrends } from "./_components/tiktok-trends";
import { QuickActions } from "./_components/quick-actions";
import { PlatformComparison } from "./_components/platform-comparison";
import { ViewsSparkline } from "./_components/views-sparkline";
import { EngagementRing } from "./_components/engagement-ring";
import { PostingHeatmap } from "./_components/posting-heatmap";
import { CategoryBars } from "./_components/category-bars";

export default function DashboardPage() {
  return (
    <div>
      {/* Header (full width) */}
      <DashboardHeader />

      {/* Stat cards (4-col grid) */}
      <StatCards />

      {/* Performance charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <ViewsSparkline />
        <EngagementRing />
        <PostingHeatmap />
        <CategoryBars />
      </div>

      {/* Two columns: 3/5 latest ideas (left) + 2/5 alerts + trends + quick actions (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Latest ideas */}
        <div className="lg:col-span-3">
          <LatestIdeas />
        </div>

        {/* Right: Alerts & TikTok trends & Quick actions */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <ViralAlerts />
          <TikTokTrends />
          <QuickActions />
        </div>
      </div>

      {/* Platform comparison (full width) */}
      <PlatformComparison />
    </div>
  );
}
