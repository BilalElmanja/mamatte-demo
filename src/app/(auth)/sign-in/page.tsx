"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { easing } from "@/lib/motion";
import { AuthHeader } from "../_components/auth-header";
import { GlassCard } from "../_components/glass-card";
import { GoogleOAuthButton } from "../_components/google-oauth-button";
import { DividerOr } from "../_components/divider-or";
import { PasswordInput } from "../_components/password-input";

const formItemVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

const formContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.5,
    },
  },
};

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <AuthHeader
        title={"Content de vous{italic}revoir."}
        subtitle="Votre prochaine idée virale vous attend"
      />

      <GlassCard>
        <GoogleOAuthButton onClick={handleGoogleAuth} />
        <DividerOr />

        <motion.form
          className="flex flex-col gap-5"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
        >
          <motion.div variants={formItemVariants}>
            <label className="block text-[10px] font-bold text-muted-rb uppercase tracking-[.15em] mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="vous@mamatte.fr"
              className="w-full bg-white/70 border border-stone-custom rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-faded outline-none input-focus transition-all duration-300"
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <label className="block text-[10px] font-bold text-muted-rb uppercase tracking-[.15em] mb-2">
              Mot de passe
            </label>
            <PasswordInput
              id="si-pw"
              required
              placeholder="Votre mot de passe"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                className="text-[11px] font-medium text-muted-rb hover:text-ink transition-colors cursor-pointer"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </motion.div>

          <motion.button
            variants={formItemVariants}
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full bg-ink text-white rounded-xl px-6 py-4 text-sm font-semibold flex items-center justify-center gap-2 mt-1 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Icon icon="solar:refresh-linear" width={16} className="animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <Icon
                  icon="solar:arrow-right-linear"
                  width={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </>
            )}
          </motion.button>
        </motion.form>
      </GlassCard>

      <motion.p
        className="text-center text-sm text-muted-rb mt-7"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.4, ease: easing.smooth }}
      >
        Pas encore de compte ?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-ink hover:text-gold transition-colors underline decoration-stone-custom underline-offset-[3px] hover:decoration-gold ml-1"
        >
          Créer un compte
        </Link>
      </motion.p>
    </div>
  );
}
