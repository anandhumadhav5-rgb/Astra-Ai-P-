import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function ChatEmptyState() {
  return (
    <motion.div
      className="mx-auto mt-16 max-w-xl px-4 text-center sm:mt-24"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto mb-5 grid h-14 w-14 place-content-center rounded-2xl border border-brand-400/40 bg-brand-500/10">
        <Sparkles className="h-6 w-6 text-brand-300" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-100">How can I help today?</h2>
      <p className="mt-2 text-sm text-slate-400">
        Ask anything from planning and writing to code reviews and technical deep-dives.
      </p>
    </motion.div>
  );
}

export default ChatEmptyState;
