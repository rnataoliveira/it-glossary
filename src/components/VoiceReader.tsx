"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "playing" | "paused";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";

export default function VoiceReader({ text }: { text: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  function play() {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    utteranceRef.current = utterance;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    setStatus("playing");
  }

  function pause() {
    speechSynthesis.pause();
    setStatus("paused");
  }

  function resume() {
    speechSynthesis.resume();
    setStatus("playing");
  }

  function stop() {
    speechSynthesis.cancel();
    setStatus("idle");
  }

  return (
    <div className="flex justify-end gap-2 mb-6" role="group" aria-label="Read aloud controls">
      {status === "idle" && (
        <button
          onClick={play}
          aria-label="Read aloud"
          className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 ${focusRing}`}
        >
          <SpeakerIcon />
          Read aloud
        </button>
      )}

      {status === "playing" && (
        <>
          <button
            onClick={pause}
            aria-label="Pause reading"
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors ${focusRing}`}
          >
            <span aria-hidden="true">⏸</span> Pause
          </button>
          <button
            onClick={stop}
            aria-label="Stop reading"
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 ${focusRing}`}
          >
            <span aria-hidden="true">⏹</span> Stop
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            onClick={resume}
            aria-label="Resume reading"
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors ${focusRing}`}
          >
            <span aria-hidden="true">▶</span> Resume
          </button>
          <button
            onClick={stop}
            aria-label="Stop reading"
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 ${focusRing}`}
          >
            <span aria-hidden="true">⏹</span> Stop
          </button>
        </>
      )}
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
