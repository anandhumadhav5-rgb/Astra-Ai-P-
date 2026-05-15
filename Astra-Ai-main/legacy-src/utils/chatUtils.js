const MAX_TITLE_LENGTH = 28;

export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createMessage(role, content) {
  return {
    id: createId(),
    role,
    content,
    createdAt: Date.now()
  };
}

export function createChat(title = "New Chat") {
  return {
    id: createId(),
    title,
    updatedAt: Date.now(),
    messages: []
  };
}

export function deriveChatTitle(messages) {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage?.content?.trim()) {
    return "New Chat";
  }

  const normalized = firstUserMessage.content.replace(/\s+/g, " ").trim();
  return normalized.length > MAX_TITLE_LENGTH
    ? `${normalized.slice(0, MAX_TITLE_LENGTH)}...`
    : normalized;
}

export function formatRelativeTime(timestamp) {
  const deltaSeconds = Math.floor((Date.now() - timestamp) / 1000);

  if (deltaSeconds < 60) {
    return "Just now";
  }

  if (deltaSeconds < 3600) {
    const minutes = Math.floor(deltaSeconds / 60);
    return `${minutes}m ago`;
  }

  if (deltaSeconds < 86400) {
    const hours = Math.floor(deltaSeconds / 3600);
    return `${hours}h ago`;
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
