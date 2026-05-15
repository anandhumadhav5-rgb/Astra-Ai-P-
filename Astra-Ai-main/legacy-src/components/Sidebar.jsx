import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import LogoMark from "./LogoMark";
import SidebarChatItem from "./SidebarChatItem";

function SidebarPanel({ chats, activeChatId, onSelectChat, onNewChat, onClose }) {
  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <LogoMark />
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/15 px-3 py-2.5 text-sm font-medium text-brand-100 transition hover:border-brand-400 hover:bg-brand-500/25"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {chats.map((chat) => (
          <SidebarChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
}

function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isOpen,
  onClose
}) {
  return (
    <>
      <aside className="hidden h-full w-80 shrink-0 lg:block">
        <SidebarPanel
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onNewChat={onNewChat}
          onClose={onClose}
        />
      </aside>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-label="Close sidebar backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
            >
              <SidebarPanel
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={onSelectChat}
                onNewChat={onNewChat}
                onClose={onClose}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
