"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toggleAudio, isAudioEnabled } from "@/lib/audio";

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
      className="p-2 rounded-lg bg-surface-raised hover:bg-surface-raised/80 border border-border text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-mono"
    >
      {enabled ? (
        <>
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline text-[11px]">Audio On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline text-[11px]">Muted</span>
        </>
      )}
    </button>
  );
}
