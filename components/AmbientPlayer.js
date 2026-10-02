"use client";

import { useEffect, useRef, useState } from "react";
import { CloudRain, Music2, Volume2, VolumeX } from "lucide-react";
import { createAmbient } from "@/lib/sounds";

export default function AmbientPlayer() {
  const engine = useRef(null);
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState("mix");
  const [volume, setVolume] = useState(0.35);

  useEffect(() => () => engine.current?.stop(), []);

  function toggle() {
    const next = !on;
    setOn(next);
    if (!engine.current) engine.current = createAmbient();
    engine.current.setMode(mode);
    engine.current.setVolume(next ? volume : 0);
  }

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ortam sesi</h2>
        <button onClick={toggle} className="rounded-lg p-2 hover:bg-white/10" aria-label="Sesi ac veya kapat">
          {on ? <Volume2 size={18} className="text-neon" /> : <VolumeX size={18} />}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {[
          ["rain", "Yağmur", CloudRain],
          ["lofi", "Lo-fi", Music2],
          ["mix", "Karışım", Volume2],
        ].map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => {
              setMode(id);
              if (!engine.current) engine.current = createAmbient();
              engine.current.setMode(id);
              if (!on) {
                setOn(true);
                engine.current.setVolume(volume);
              }
            }}
            className={`rounded-xl border px-2 py-3 transition hover:border-neon/50 ${
              mode === id ? "border-neon bg-neon/10 text-neon" : "border-white/10"
            }`}
          >
            <Icon size={16} className="mx-auto mb-1" />
            {label}
          </button>
        ))}
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
          const value = Number(e.target.value);
          setVolume(value);
          if (on && engine.current) engine.current.setVolume(value);
        }}
        className="mt-4 w-full accent-[#00d2ff]"
      />
      <p className="mt-2 text-xs text-slate-400">Telifli parça yok; yağmur ve lo-fi tını tarayıcıda üretilir.</p>
    </section>
  );
}
