"use client";

import React, { useState } from "react";
import { toggleAudio } from "@/lib/audio";

export function AudioCuesToggle() {
  const [enabled, setEnabled] = useState(true);

  const handleToggle = () => {
    const next = toggleAudio();
    setEnabled(next);
  };

  return (
    <button
      onClick={handleToggle}
      title={enabled ? "Mute audio cues" : "Unmute settlement audio cues"}
      className="py-1 px-2.5 rounded-[2px] bg-surface-raised hover:bg-surface border border-border text-text-muted hover:text-text transition-colors flex items-center space-x-1.5 text-xs font-mono"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-up" : "bg-text-muted"}`} />
      <span>{enabled ? "Audio on" : "Muted"}</span>
    </button>
  );
}
