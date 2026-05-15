import { createChat, createMessage } from "./chatUtils";

const starterChat = createChat("Welcome to NovaChat");
starterChat.messages = [
  createMessage(
    "assistant",
    [
      "Welcome to **NovaChat**. I can help with product ideas, code, docs, and analysis.",
      "",
      "Try asking for structured output:",
      "",
      "```ts",
      "type ChecklistItem = {",
      "  label: string;",
      "  done: boolean;",
      "};",
      "",
      "const onboarding: ChecklistItem[] = [",
      "  { label: 'Create project scope', done: true },",
      "  { label: 'Wire API service', done: false }",
      "];",
      "```"
    ].join("\n")
  )
];

export const INITIAL_CHATS = [starterChat];

export const QUICK_PROMPTS = [
  "Design a launch plan for a healthcare app",
  "Explain async/await with examples",
  "Write SQL to find top 5 departments by revenue",
  "Refactor this React component for readability"
];
