import { motion } from "framer-motion";

function QuickPromptChips({ prompts, onPromptSelect }) {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-2 px-4 sm:grid-cols-2 lg:px-6">
      {prompts.map((prompt, index) => (
        <motion.button
          key={prompt}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.2 }}
          onClick={() => onPromptSelect(prompt)}
          className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-brand-400/50 hover:bg-slate-900 hover:text-white"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}

export default QuickPromptChips;
