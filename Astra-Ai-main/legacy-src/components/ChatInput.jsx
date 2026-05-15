import { useState } from "react";
import { ArrowUp } from "lucide-react";
import useAutoResizeTextarea from "../hooks/useAutoResizeTextarea";

function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState("");
  const textareaRef = useAutoResizeTextarea(message);

  const handleSend = async () => {
    const content = message.trim();
    if (!content || disabled) {
      return;
    }

    setMessage("");
    await onSend(content);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSend();
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-5 pt-3 lg:px-6">
      <div className="animated-border rounded-2xl">
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-panel backdrop-blur-xl">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message NovaChat..."
              className="max-h-60 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={disabled || !message.trim()}
              className="mb-1 mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-slate-500">
        NovaChat can make mistakes. Verify important information.
      </p>
    </div>
  );
}

export default ChatInput;
