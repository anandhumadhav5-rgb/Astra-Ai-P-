"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Config ─────────────────────────────────────────────────────────────────────
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? "";
const VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ?? "";
const MODEL_ID = process.env.NEXT_PUBLIC_ELEVENLABS_MODEL ?? "";

// ── Markdown → plain text ─────────────────────────────────────────────────────
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " (code block) ")
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[=\-]{2,}\s*$/gm, "")
    .replace(/[*_]{3}([^*_]+)[*_]{3}/g, "$1")
    .replace(/[*_]{2}([^*_]+)[*_]{2}/g, "$1")
    .replace(/[*_]([^*_]+)[*_]/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^[\-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^[\-*_]{3,}\s*$/gm, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Types ──────────────────────────────────────────────────────────────────────
export interface UseSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  isSupported: boolean;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useSpeech(): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const isMutedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported(true);
      console.log("[useSpeech] ElevenLabs TTS hook initialized.");
    }
  }, []);

  const stopInternal = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    try {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
    } catch (e) {
      // Ignore "already stopped" errors
    }
    sourceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const stop = useCallback(() => {
    stopInternal();
  }, [stopInternal]);

  const speak = useCallback(
    async (text: string) => {
      if (!isSupported || isMutedRef.current || !text.trim()) return;
      
      if (!ELEVENLABS_API_KEY) {
        console.error("[useSpeech] API Key is missing! Check your .env file for NEXT_PUBLIC_ELEVENLABS_API_KEY.");
        return;
      }

      if (!VOICE_ID || !MODEL_ID) {
        console.error(
          "[useSpeech] Voice/model ID is missing! Check NEXT_PUBLIC_ELEVENLABS_VOICE_ID and NEXT_PUBLIC_ELEVENLABS_MODEL in .env."
        );
        return;
      }

      console.log("[useSpeech] Attempting to speak message...");

      // Cancel any ongoing speech
      stopInternal();

      const controller = new AbortController();
      abortRef.current = controller;
      setIsSpeaking(true);

      const plainText = stripMarkdown(text);
      if (!plainText) {
        console.warn("[useSpeech] Message was empty after stripping markdown.");
        setIsSpeaking(false);
        return;
      }

      try {
        // Initialize AudioContext
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const audioCtx = audioCtxRef.current;

        // Fetch from ElevenLabs
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
              text: plainText,
              model_id: MODEL_ID,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[useSpeech] ElevenLabs API error:", errorData);
          throw new Error(errorData.detail?.message || "ElevenLabs API error");
        }

        const arrayBuffer = await response.arrayBuffer();
        if (controller.signal.aborted) return;

        // Ensure context is resumed before decoding/playing
        if (audioCtx.state === "suspended") {
          console.log("[useSpeech] AudioContext suspended, resuming...");
          await audioCtx.resume();
        }

        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (controller.signal.aborted) return;

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        sourceRef.current = source;

        source.onended = () => {
          if (abortRef.current === controller) {
            setIsSpeaking(false);
            abortRef.current = null;
            sourceRef.current = null;
          }
        };

        source.start(0);
        console.log("[useSpeech] Audio playing.");
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("[useSpeech] Speech aborted.");
          return;
        }
        console.error("[useSpeech] TTS Execution Error:", err);
        setIsSpeaking(false);
      }
    },
    [isSupported, stopInternal]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (next) {
        console.log("[useSpeech] TTS Muted.");
        stopInternal();
      } else {
        console.log("[useSpeech] TTS Unmuted.");
      }
      return next;
    });
  }, [stopInternal]);

  useEffect(() => {
    return () => {
      stopInternal();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopInternal]);

  return { speak, stop, isSpeaking, isMuted, toggleMute, isSupported };
}
