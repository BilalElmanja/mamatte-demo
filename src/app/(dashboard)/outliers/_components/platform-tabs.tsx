"use client";

import { Icon } from "@iconify/react";

type PlatformTabsProps = {
  active: "ig" | "tk";
  onSwitch: (platform: "ig" | "tk") => void;
};

export function PlatformTabs({ active, onSwitch }: PlatformTabsProps) {
  return (
    <div className="flex gap-3">
      {/* Instagram Tab */}
      <button
        onClick={() => onSwitch("ig")}
        className={`platform-tab border rounded-xl px-5 py-3 flex items-center gap-3 flex-1 sm:flex-initial ${
          active === "ig"
            ? "border-pink-200/50 text-[#E1306C]"
            : "border-stone-custom/40 text-muted-rb"
        }`}
        style={
          active === "ig"
            ? {
                background:
                  "linear-gradient(135deg, rgba(131,58,180,0.08), rgba(225,48,108,0.08))",
              }
            : undefined
        }
      >
        <div
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={
            active === "ig"
              ? {
                  background: "linear-gradient(135deg, #833AB4, #E1306C)",
                }
              : { background: "#B5AFA8" }
          }
        />
        <div>
          <div className="flex items-center gap-1.5">
            <Icon icon="simple-icons:instagram" width={14} />
            <span className="text-[13px] font-bold">Instagram Reels</span>
          </div>
          <p className="text-[10px] opacity-60 mt-0.5">
            7 outliers &middot; 3 concurrents
          </p>
        </div>
      </button>

      {/* TikTok Tab */}
      <button
        onClick={() => onSwitch("tk")}
        className={`platform-tab border rounded-xl px-5 py-3 flex items-center gap-3 flex-1 sm:flex-initial ${
          active === "tk"
            ? "border-pink-200/40 text-tiktok"
            : "border-stone-custom/40 text-muted-rb"
        }`}
        style={
          active === "tk"
            ? { background: "rgba(255,0,80,0.06)" }
            : undefined
        }
      >
        <div
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={
            active === "tk"
              ? { background: "#ff0050" }
              : { background: "#B5AFA8" }
          }
        />
        <div>
          <div className="flex items-center gap-1.5">
            <Icon icon="simple-icons:tiktok" width={13} />
            <span className="text-[13px] font-bold">TikTok</span>
          </div>
          <p className="text-[10px] opacity-60 mt-0.5">
            6 outliers &middot; 2 concurrents
          </p>
        </div>
      </button>
    </div>
  );
}
