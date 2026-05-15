import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  userId: string;
};

export const chatService = {
  async createChat(userId: string, title: string = "New Chat") {
    const chatData = {
      title,
      userId,
      updatedAt: Date.now(),
      messages: []
    };
    const docRef = await addDoc(collection(db, "chats"), chatData);
    return { id: docRef.id, ...chatData };
  },

  async updateChat(chatId: string, updates: Partial<Chat>) {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      ...updates,
      updatedAt: Date.now()
    });
  },

  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    const q = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      callback(chats);
    });
  },

  async deleteChat(chatId: string) {
    await deleteDoc(doc(db, "chats", chatId));
  }
};
