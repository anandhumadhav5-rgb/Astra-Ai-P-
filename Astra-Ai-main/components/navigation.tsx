"use client";

import { BrainCircuit, MessageSquarePlus, Menu, LogIn, User } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/button";
import { useAuth } from "@/hooks/use-auth";

const links = [
  { label: "Platform", href: "#platform" },
  { label: "Signals", href: "#signals" },
  { label: "Security", href: "#security" },
  { label: "Launch", href: "#launch" }
];

export function Navigation() {
  const { user, loading } = useAuth();
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/72 backdrop-blur-2xl"
    >
      <nav className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-3" aria-label="ASTRA AI home">
          <span className="grid size-9 place-items-center rounded-md border border-plasma-cyan/40 bg-plasma-cyan/10">
            <BrainCircuit className="size-5 text-plasma-cyan" aria-hidden />
          </span>
          <span className="font-display text-base font-bold tracking-wide">ASTRA AI</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          {loading ? (
            <div className="size-8 animate-spin rounded-full border-2 border-plasma-cyan border-t-transparent" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{user.email?.split("@")[0]}</span>
              <ButtonLink href="/chat" className="h-10 px-4">
                <BrainCircuit className="size-4" />
                Go to Chat
              </ButtonLink>
            </div>
          ) : (
            <ButtonLink href="/chat" className="h-10 px-4">
              <LogIn className="size-4" />
              Sign In
            </ButtonLink>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md border border-line bg-white/[0.04] md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </nav>
    </motion.header>
  );
}
