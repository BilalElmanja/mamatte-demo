"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Icon } from "@iconify/react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
}

export function PasswordInput({ id, className = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={`w-full bg-white/70 border border-stone-custom rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-faded outline-none input-focus transition-all duration-300 pr-11 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-faded hover:text-ink transition-colors cursor-pointer"
        tabIndex={-1}
      >
        <Icon
          icon={visible ? "solar:eye-closed-linear" : "solar:eye-linear"}
          width={18}
        />
      </button>
    </div>
  );
}
