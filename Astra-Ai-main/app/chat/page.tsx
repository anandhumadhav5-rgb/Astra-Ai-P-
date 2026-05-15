"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, LogOut, Menu, MessageSquarePlus, Send, Sparkles, Square, User, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { chatService, Chat, Message, Role } from "@/lib/chat-service";
import { useSpeech } from "@/hooks/use-speech";

const quickPrompts = [
  "Create a customer support chatbot flow",
  "Draft a product FAQ assistant",
  "Help me brainstorm automation ideas",
  "Write a friendly onboarding message"
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function deriveTitle(messages: Message[]) {
  const firstUserMessage = messages.find((message) => message.role === "user")?.content.trim();
  if (!firstUserMessage) {
    return "New Chat";
  }

  return firstUserMessage.length > 34 ? `${firstUserMessage.slice(0, 34)}...` : firstUserMessage;
}

function parseSseBlock(block: string) {
  const lines = block.split(/\r?\n/);
  let eventName = "";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  try {
    return { eventName, payload: JSON.parse(dataLines.join("\n")) as { token?: string; message?: string } };
  } catch {
    return null;
  }
}

function Sidebar({
  chats,
  activeChatId,
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  user,
  onLogout
}: {
  chats: Chat[];
  activeChatId: string;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  user: any | null;
  onLogout: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-80 max-w-[86vw] flex-col border-r border-line bg-void/95 p-4 shadow-panel backdrop-blur-2xl transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
            <ArrowLeft className="size-4" aria-hidden />
            ASTRA AI
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-md border border-line bg-white/[0.04] text-slate-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="mb-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-plasma-cyan px-4 text-sm font-semibold text-ink transition hover:bg-plasma-mint"
        >
          <MessageSquarePlus className="size-4" aria-hidden />
          Start Chat
        </button>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "w-full rounded-md border px-3 py-3 text-left transition",
                chat.id === activeChatId
                  ? "border-plasma-cyan/40 bg-plasma-cyan/10 text-white"
                  : "border-transparent bg-white/[0.03] text-slate-300 hover:border-line hover:bg-white/[0.06]"
              )}
            >
              <span className="block truncate text-sm font-medium">{chat.title}</span>
              <span className="mt-1 block text-xs text-slate-500">
                {chat.messages.length ? `${chat.messages.length} messages` : "Ready to begin"}
              </span>
            </button>
          ))}
        </div>

        {user && (
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="size-8 shrink-0 rounded-full bg-plasma-cyan/20 grid place-items-center">
                <User className="size-4 text-plasma-cyan" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-slate-200">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <span className="truncate text-[10px] text-slate-500">{user.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-white transition"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default function ChatPage() {
  const { user, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ── Text-to-Speech ─────────────────────────────────────────────────────────
  const { speak, stop, isSpeaking, isMuted, toggleMute, isSupported: ttsSupported } = useSpeech();
  /** ID of the last assistant message we have already spoken, to avoid repeats. */
  const lastSpokenIdRef = useRef<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      const unsubscribe = chatService.subscribeToChats(user.uid, (fetchedChats) => {
        setChats(fetchedChats);
        if (fetchedChats.length > 0 && !activeChatId) {
          setActiveChatId(fetchedChats[0].id);
        }
      });
      return () => unsubscribe();
    } else {
      setChats([]);
      setActiveChatId(null);
    }
  }, [user, activeChatId]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) || null,
    [activeChatId, chats]
  );

  const handleNewChat = async () => {
    if (!user) return;
    abortControllerRef.current?.abort();
    const newChat = await chatService.createChat(user.uid);
    setActiveChatId(newChat.id);
    setErrorMessage("");
    setIsTyping(false);
    setIsSidebarOpen(false);
  };

  const sendMessage = async (value: string) => {
    const content = value.trim();
    if (!content || isTyping || !user) {
      return;
    }

    let targetChatId = activeChatId;
    let targetChat = activeChat;
    
    if (!targetChatId) {
      const newChat = await chatService.createChat(user.uid);
      targetChatId = newChat.id;
      targetChat = newChat;
      setActiveChatId(targetChatId);
    }

    const assistantMessageId = createId("assistant");
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setErrorMessage("");
    setIsTyping(true);
    setInput("");

    const userMessage: Message = { id: createId("user"), role: "user", content, createdAt: Date.now() };
    const initialAssistantMessage: Message = { id: assistantMessageId, role: "assistant", content: "", createdAt: Date.now() };
    
    const updatedMessages = [...(targetChat?.messages || []), userMessage, initialAssistantMessage];
    
    // Update locally and in Firestore
    await chatService.updateChat(targetChatId, {
      messages: updatedMessages,
      title: deriveTitle(updatedMessages)
    });


    try {
      const idToken = await user.getIdToken();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
          "X-Firebase-Auth": `Bearer ${idToken}`,
          Accept: "text/event-stream"
        },
        body: JSON.stringify({ message: content }),
        signal: controller.signal
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to reach the chatbot backend.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullAssistantContent = "";

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(chunk, { stream: true });
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const parsed = parseSseBlock(block);
          if (!parsed) continue;

          if (parsed.eventName === "token" && parsed.payload.token) {
            fullAssistantContent += parsed.payload.token;
            // Update local state for smooth UI, but only update Firestore at the end or occasionally
            setChats(prev => prev.map(c => c.id === targetChatId ? {
              ...c,
              messages: c.messages.map(m => m.id === assistantMessageId ? { ...m, content: fullAssistantContent } : m)
            } : c));
          }

          if (parsed.eventName === "error") {
            throw new Error(parsed.payload.message || "The model returned an error.");
          }
        }
      }

      // Final Firestore update
      await chatService.updateChat(targetChatId, {
        messages: updatedMessages.map(m => m.id === assistantMessageId ? { ...m, content: fullAssistantContent } : m)
      });

    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      const fallback = error instanceof Error ? error.message : "I hit a temporary issue.";
      setErrorMessage(fallback);
      
      await chatService.updateChat(targetChatId, {
        messages: updatedMessages.map(m => m.id === assistantMessageId ? { ...m, content: `Error: ${fallback}` } : m)
      });
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  // ── Auto-speak new assistant messages once streaming completes ──────────────
  useEffect(() => {
    if (!activeChat || isTyping) return;

    const lastMsg = [...activeChat.messages].reverse().find((m) => m.role === "assistant");
    if (
      lastMsg &&
      lastMsg.content.trim() &&
      lastMsg.id !== lastSpokenIdRef.current
    ) {
      lastSpokenIdRef.current = lastMsg.id;
      speak(lastMsg.content);
    }
  }, [activeChat, isTyping, speak]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isRegistering) {
        if (!name.trim()) throw new Error("Please enter your name");
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: unknown) {
      setAuthError((error as Error).message || "Authentication failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink">
        <div className="size-12 animate-spin rounded-full border-4 border-plasma-cyan border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl border border-plasma-cyan/30 bg-plasma-cyan/10 text-plasma-cyan shadow-glow">
              <Bot className="size-8" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              {isRegistering ? "Create your account" : "Welcome to ASTRA"}
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              {isRegistering 
                ? "Join ASTRA to access premium intelligence." 
                : "Sign in to sync your chats across devices."}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-void/50 p-6 backdrop-blur-xl shadow-panel">
            {authError && (
              <div className="mb-4 rounded-lg border border-plasma-rose/30 bg-plasma-rose/10 px-4 py-3 text-xs text-rose-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegistering && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-plasma-cyan/50 focus:bg-white/[0.06] transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-plasma-cyan/50 focus:bg-white/[0.06] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">PASSWORD</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-plasma-cyan/50 focus:bg-white/[0.06] transition"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-plasma-cyan py-3.5 text-sm font-bold text-ink transition hover:bg-plasma-mint shadow-glow-cyan mt-2"
              >
                {isRegistering ? "Create Account" : "Sign In"}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError("");
              }}
              className="text-sm text-plasma-cyan hover:text-plasma-mint transition font-medium"
            >
              {isRegistering ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
            <Link href="/" className="block text-xs text-slate-500 hover:text-slate-300 transition uppercase tracking-widest">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-ink text-white">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId || ""}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={(chatId) => {
          setActiveChatId(chatId);
          setErrorMessage("");
          setIsSidebarOpen(false);
        }}
        user={user}
        onLogout={logout}
      />

      <section className="relative flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-ink/78 px-4 py-3 backdrop-blur-2xl lg:px-6">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="grid size-10 place-items-center rounded-md border border-line bg-white/[0.04] text-slate-300 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="size-5" aria-hidden />
              </button>
              <div>
                <h1 className="text-sm font-semibold text-slate-100 sm:text-base">
                  {activeChat?.title || "New Chat"}
                </h1>
                <p className="text-xs text-slate-400">Model: {process.env.NEXT_PUBLIC_CHAT_MODEL_LABEL || "ASTRA Chat"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* ── Voice Controls ─────────────────────────────────────── */}
              {ttsSupported && (
                <div className="flex items-center gap-1">
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={stop}
                      title="Stop speaking"
                      aria-label="Stop speaking"
                      className="grid size-9 place-items-center rounded-md border border-plasma-rose/40 bg-plasma-rose/10 text-plasma-rose transition hover:bg-plasma-rose/20"
                    >
                      <Square className="size-3.5 fill-current" aria-hidden />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleMute}
                    title={isMuted ? "Unmute voice" : "Mute voice"}
                    aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                    className={cn(
                      "grid size-9 place-items-center rounded-md border transition",
                      isMuted
                        ? "border-slate-600 bg-white/[0.04] text-slate-500 hover:border-line hover:text-slate-300"
                        : "border-plasma-cyan/30 bg-plasma-cyan/10 text-plasma-cyan hover:bg-plasma-cyan/20"
                    )}
                  >
                    {isMuted
                      ? <VolumeX className="size-4" aria-hidden />
                      : <Volume2 className="size-4" aria-hidden />}
                  </button>
                </div>
              )}

              <div className="hidden items-center gap-2 rounded-md border border-line bg-white/[0.04] px-3 py-2 text-xs text-slate-300 sm:flex">
                <Sparkles className="size-3.5 text-plasma-mint" aria-hidden />
                Cloud Secured
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-44 pt-8 lg:px-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {activeChat && activeChat.messages.length ? (
              activeChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" ? (
                    <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-md border border-plasma-cyan/30 bg-plasma-cyan/10 text-plasma-cyan">
                      <Bot className="size-4" aria-hidden />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[min(42rem,82vw)] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-7 shadow-panel",
                      message.role === "user"
                        ? "bg-plasma-cyan text-ink"
                        : "border border-line bg-white/[0.045] text-slate-100"
                    )}
                  >
                    {message.content || <span className="typing-caret inline-block h-4 w-2 translate-y-0.5 bg-plasma-mint" />}
                  </div>
                  {message.role === "user" ? (
                    <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-md border border-plasma-mint/30 bg-plasma-mint/10 text-plasma-mint">
                      <User className="size-4" aria-hidden />
                    </span>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="pt-[12vh] text-center">
                <div className="mx-auto mb-5 grid size-14 place-items-center rounded-lg border border-plasma-cyan/30 bg-plasma-cyan/10 text-plasma-cyan shadow-glow">
                  <Bot className="size-7" aria-hidden />
                </div>
                <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Start a chat with ASTRA</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Ask about automations, support flows, product copy, or anything you want this assistant to help shape.
                </p>
                <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-md border border-line bg-white/[0.04] px-4 py-3 text-left text-sm text-slate-200 transition hover:border-plasma-mint/50 hover:bg-white/[0.08]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/98 to-transparent px-4 pb-4 pt-8 lg:px-6">
          <div className="mx-auto w-full max-w-4xl">
            {errorMessage ? (
              <p className="mb-2 rounded-md border border-plasma-rose/30 bg-plasma-rose/10 px-3 py-2 text-xs text-rose-100">
                {errorMessage}
              </p>
            ) : null}
            <form onSubmit={handleSubmit} className="flex items-end gap-3 rounded-lg border border-line bg-void/88 p-3 shadow-panel backdrop-blur-2xl">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder="Message ASTRA..."
                className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="grid size-11 shrink-0 place-items-center rounded-md bg-plasma-cyan text-ink transition hover:bg-plasma-mint disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
