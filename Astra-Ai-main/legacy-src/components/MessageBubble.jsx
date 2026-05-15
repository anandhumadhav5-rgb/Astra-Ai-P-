import { motion } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <article
        className={[
          "max-w-[88%] rounded-2xl px-4 py-3 shadow-panel sm:max-w-[80%]",
          isUser
            ? "rounded-br-md border border-brand-400/20 bg-gradient-to-br from-brand-500/25 to-brand-700/20 text-slate-100"
            : "rounded-bl-md border border-white/10 bg-slate-900/90 text-slate-200"
        ].join(" ")}
      >
        {!isUser ? (
          <p className="mb-2 text-[11px] uppercase tracking-widest text-brand-300/90">AI Assistant</p>
        ) : null}

        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </article>
    </motion.div>
  );
}

export default MessageBubble;
