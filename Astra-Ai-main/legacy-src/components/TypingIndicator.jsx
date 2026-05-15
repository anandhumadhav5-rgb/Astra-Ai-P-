import { motion } from "framer-motion";

const dotTransition = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut"
};

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-slate-900/90 px-4 py-3 shadow-panel">
        <div className="mb-2 h-2.5 w-32 rounded-full bg-slate-700/50" />
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-2 w-2 rounded-full bg-brand-300"
              animate={{ opacity: [0.35, 1], y: [0, -3] }}
              transition={{ ...dotTransition, delay: index * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
