import { Menu, Sparkles } from "lucide-react";

function ChatHeader({ title, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-sm font-semibold text-slate-100 sm:text-base">{title}</h1>
            <p className="text-xs text-slate-400">Model: NovaGPT-4.1</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-brand-300" />
          Secure session
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
