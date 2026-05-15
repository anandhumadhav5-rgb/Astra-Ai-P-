import { useMemo, useState } from "react";
import { streamChatResponse } from "../services/chatService";
import { INITIAL_CHATS } from "../utils/constants";
import {
  createChat,
  createMessage,
  deriveChatTitle
} from "../utils/chatUtils";

function updateChatCollection(chats, chatId, updater) {
  return chats
    .map((chat) => (chat.id === chatId ? updater(chat) : chat))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

function appendMessages(chats, chatId, messages) {
  return updateChatCollection(chats, chatId, (chat) => {
    const updatedMessages = [...chat.messages, ...messages];
    return {
      ...chat,
      messages: updatedMessages,
      title: deriveChatTitle(updatedMessages),
      updatedAt: Date.now()
    };
  });
}

function appendTokenToMessage(chats, chatId, messageId, token) {
  return updateChatCollection(chats, chatId, (chat) => ({
    ...chat,
    messages: chat.messages.map((message) =>
      message.id === messageId
        ? { ...message, content: `${message.content}${token}` }
        : message
    ),
    updatedAt: Date.now()
  }));
}

export default function useChatManager() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(INITIAL_CHATS[0]?.id ?? null);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats]
  );

  const createNewChat = () => {
    const freshChat = createChat();
    setChats((previous) => [freshChat, ...previous]);
    setActiveChatId(freshChat.id);
    setErrorMessage("");
    setIsSidebarOpen(false);
  };

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    setErrorMessage("");
    setIsSidebarOpen(false);
  };

  const sendMessage = async (input) => {
    const content = input.trim();
    if (!content || isTyping) {
      return;
    }

    setErrorMessage("");
    setIsTyping(true);

    let targetChatId = activeChatId;

    if (!targetChatId) {
      const freshChat = createChat();
      targetChatId = freshChat.id;
      setChats((previous) => [freshChat, ...previous]);
      setActiveChatId(freshChat.id);
    }

    const userMessage = createMessage("user", content);
    const assistantMessage = createMessage("assistant", "");

    setChats((previous) =>
      appendMessages(previous, targetChatId, [userMessage, assistantMessage])
    );

    try {
      await streamChatResponse(content, {
        onToken: (token) => {
          setChats((previous) =>
            appendTokenToMessage(previous, targetChatId, assistantMessage.id, token)
          );
        }
      });

      setChats((previous) =>
        updateChatCollection(previous, targetChatId, (chat) => {
          const nextMessages = chat.messages.map((message) => {
            if (message.id !== assistantMessage.id) {
              return message;
            }

            if (message.content.trim()) {
              return message;
            }

            return {
              ...message,
              content: "I could not generate a response for that request."
            };
          });

          return {
            ...chat,
            messages: nextMessages,
            updatedAt: Date.now()
          };
        })
      );
    } catch (error) {
      const fallback =
        error?.message || "I hit a temporary issue while generating a response.";
      setErrorMessage(fallback);

      setChats((previous) =>
        updateChatCollection(previous, targetChatId, (chat) => ({
          ...chat,
          messages: chat.messages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: `Error: ${fallback}` }
              : message
          ),
          updatedAt: Date.now()
        }))
      );
    } finally {
      setIsTyping(false);
    }
  };

  return {
    chats,
    activeChat,
    isTyping,
    errorMessage,
    isSidebarOpen,
    setIsSidebarOpen,
    createNewChat,
    selectChat,
    sendMessage
  };
}
