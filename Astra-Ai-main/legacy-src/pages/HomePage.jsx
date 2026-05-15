import { motion } from "framer-motion";
import { ArrowRight, Bot, Code2, MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";
import LogoMark from "../components/LogoMark";

const featureCards = [
  {
    icon: MessagesSquare,
    title: "Fluid Conversations",
    description: "Context-aware chat threads with fast, distraction-free interactions."
  },
  {
    icon: Code2,
    title: "Code-Ready Responses",
    description: "Markdown and syntax-highlighted code blocks designed for developers."
  },
  {
    icon: Bot,
    title: "AI-First Workspace",
    description: "Built for planning, writing, and technical collaboration in one interface."
  }
];

function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <LogoMark />
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-400/40 bg-brand-500/10 px-3 py-2 text-sm font-medium text-brand-100 transition hover:border-brand-300 hover:bg-brand-500/20"
          >
            Open Chat
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
            Premium AI Interface
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
            Ship high-quality AI conversations with a modern, production-ready frontend.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm text-slate-400 sm:text-base">
            NovaChat combines a polished dark UI, responsive layout, markdown rendering, and
            developer-grade code presentation in one clean React architecture.
          </p>

          <div className="mt-8">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Start Chatting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                className="glass-panel rounded-2xl p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10">
                  <Icon className="h-5 w-5 text-brand-300" />
                </div>
                <h2 className="text-lg font-semibold text-slate-100">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
