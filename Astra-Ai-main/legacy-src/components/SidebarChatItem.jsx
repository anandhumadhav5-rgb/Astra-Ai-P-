import { MessageSquare } from "lucide-react";
import { formatRelativeTime } from "../utils/chatUtils";

function SidebarChatItem({ chat, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(chat.id)}
      className={[
        "w-full rounded-xl border px-3 py-3 text-left transition",
        isActive
          ? "border-brand-400/60 bg-brand-500/10 text-slate-100"
          : "border-transparent bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80"
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{chat.title}</p>
          <p className="mt-1 text-xs text-slate-500">{formatRelativeTime(chat.updatedAt)}</p>
        </div>
      </div>
    </button>
  );
}

export default SidebarChatItem;
