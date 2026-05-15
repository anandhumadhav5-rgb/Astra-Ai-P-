import ChatEmptyState from "../components/ChatEmptyState";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import QuickPromptChips from "../components/QuickPromptChips";
import Sidebar from "../components/Sidebar";
import useChatManager from "../hooks/useChatManager";
import { QUICK_PROMPTS } from "../utils/constants";

function ChatPage() {
  const {
    chats,
    activeChat,
    isTyping,
    errorMessage,
    isSidebarOpen,
    setIsSidebarOpen,
    createNewChat,
    selectChat,
    sendMessage
  } = useChatManager();

  const hasMessages = Boolean(activeChat?.messages?.length);
  const chatTitle = activeChat?.title ?? "New Chat";

  const handlePromptSelect = async (prompt) => {
    await sendMessage(prompt);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar
        chats={chats}
        activeChatId={activeChat?.id}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section className="relative flex min-w-0 flex-1 flex-col">
        <ChatHeader title={chatTitle} onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-48">
          {hasMessages ? (
            <ChatMessages messages={activeChat.messages} isTyping={isTyping} />
          ) : (
            <>
              <ChatEmptyState />
              <div className="mt-8">
                <QuickPromptChips prompts={QUICK_PROMPTS} onPromptSelect={handlePromptSelect} />
              </div>
            </>
          )}
        </main>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/98 to-transparent pt-6">
          {errorMessage ? (
            <div className="mx-auto mb-2 w-full max-w-4xl px-4 lg:px-6">
              <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {errorMessage}
              </p>
            </div>
          ) : null}
          <ChatInput onSend={sendMessage} disabled={isTyping} />
        </div>
      </section>
    </div>
  );
}

export default ChatPage;
