"use client";

import { createContext, useContext, useState, useCallback, createElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

type ToastContextType = {
  toast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    setKey((k) => k + 1);
    setTimeout(() => {
      setMessage(null);
    }, 2800);
  }, []);

  return createElement(
    ToastContext.Provider,
    { value: { toast } },
    children,
    createElement(
      AnimatePresence,
      null,
      message
        ? createElement(
            motion.div,
            {
              key,
              initial: { opacity: 0, y: 8, x: "-50%" },
              animate: { opacity: 1, y: 0, x: "-50%" },
              exit: { opacity: 0, y: 8, x: "-50%" },
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              className:
                "fixed bottom-20 md:bottom-6 left-1/2 z-50 pointer-events-none",
            },
            createElement(
              "div",
              {
                className:
                  "bg-ink text-white px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2.5 shadow-2xl shadow-ink/20",
              },
              createElement(Icon, {
                icon: "solar:check-circle-bold",
                width: 17,
              }),
              createElement("span", null, message)
            )
          )
        : null
    )
  );
}
