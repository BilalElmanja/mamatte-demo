"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface ApiKeyCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBgColor: string;
  required: boolean;
  placeholder: string;
  helpUrl: string;
  helpLabel: string;
  helpNote?: string;
  value: string;
  status: "idle" | "testing" | "valid" | "invalid";
  onValueChange: (value: string) => void;
  onTest: () => void;
}

export function ApiKeyCard({
  name,
  description,
  icon,
  iconBgColor,
  required,
  placeholder,
  helpUrl,
  helpLabel,
  helpNote,
  value,
  status,
  onValueChange,
  onTest,
}: ApiKeyCardProps) {
  const [shaking, setShaking] = useState(false);

  const handleTest = () => {
    if (!value.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onTest();
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 border-2 transition-all duration-400",
        status === "valid" ? "border-ink bg-white/70" : status === "invalid" ? "border-destructive bg-red-50/40" : "border-transparent",
        !required && status === "idle" && "opacity-50 hover:opacity-100",
        shaking && "anim-shake"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 text-white rounded-xl flex items-center justify-center shadow-md", iconBgColor)}>
            <Icon icon={icon} width={17} />
          </div>
          <div>
            <p className="font-semibold text-sm text-ink">{name}</p>
            <p className="text-[11px] text-muted-rb">{description}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
            required ? "bg-ink/5 text-inksoft" : "bg-stone-custom text-faded"
          )}
        >
          {required ? "Requis" : "Optionnel"}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1 bg-white/70 border border-stone-custom rounded-lg px-3 py-2.5 text-xs font-mono text-ink placeholder:text-faded outline-none input-focus transition-all min-w-0"
        />
        <button
          onClick={handleTest}
          disabled={status === "testing"}
          className={cn(
            "text-xs font-semibold border rounded-lg px-4 py-2.5 transition-all whitespace-nowrap",
            status === "valid"
              ? "border-green-200 bg-green-50 text-green-700"
              : "text-muted-rb border-stone-custom hover:bg-white hover:border-ink/20"
          )}
        >
          {status === "testing" ? (
            "Test..."
          ) : status === "valid" ? (
            <span className="flex items-center gap-1">
              <Icon icon="solar:check-circle-bold" width={13} className="text-green-600" />
              Valide
            </span>
          ) : (
            "Tester"
          )}
        </button>
      </div>

      {helpNote ? (
        <p className="text-[11px] text-muted-rb mt-2">{helpNote}</p>
      ) : (
        <a
          href={helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-muted-rb hover:text-ink transition-colors mt-2"
        >
          <Icon icon="solar:link-minimalistic-linear" width={11} />
          {helpLabel}
        </a>
      )}
    </div>
  );
}
