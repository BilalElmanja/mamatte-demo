"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { easing } from "@/lib/motion";
import { FAQ_ITEMS } from "./data";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-28" id="faq">
      <div className="max-w-[740px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="text-[11px] font-bold text-gold uppercase tracking-[.25em] mb-4">
              FAQ
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-3xl md:text-[2.8rem] font-extrabold text-ink leading-tight">
              Questions{" "}
              <span className="font-serif italic font-normal gradient-text">
                frequentes
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* FAQ items */}
        <ScrollReveal>
          <div className="space-y-2.5">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border border-stone-custom/30 rounded-2xl bg-white cursor-pointer transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:bg-ink/[.015]"
                  onClick={() => toggle(index)}
                >
                  {/* Question row */}
                  <div className="flex items-center justify-between px-6 py-5">
                    <p className="text-[14px] font-semibold text-ink pr-6">
                      {item.question}
                    </p>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{
                        duration: 0.35,
                        ease: easing.smooth,
                      }}
                      className="flex-shrink-0"
                    >
                      <Icon
                        icon="solar:alt-arrow-down-linear"
                        width={18}
                        className="text-faded"
                      />
                    </motion.div>
                  </div>

                  {/* Answer body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.45,
                              ease: easing.smooth,
                            },
                            opacity: {
                              duration: 0.3,
                              delay: 0.1,
                              ease: easing.smooth,
                            },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: {
                              duration: 0.35,
                              ease: easing.smooth,
                            },
                            opacity: {
                              duration: 0.2,
                              ease: easing.smooth,
                            },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-[13px] text-muted-rb leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
