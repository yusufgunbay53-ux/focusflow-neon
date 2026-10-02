"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { BREAK_SECONDS, WORK_SECONDS } from "@/lib/models";
import { playChime } from "@/lib/sounds";

function format(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroTimer({ onFocusComplete }) {
  const [mode, setMode] = useState("work");
  const [left, setLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setLeft((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = `${format(left)} · FocusFlow`;
    if (left === 0 && running && !done.current) {
      done.current = true;
      setRunning(false);
      playChime();
      const title = mode === "work" ? "Odak turu bitti" : "Mola bitti";
      const body = mode === "work" ? "5 dakikalık molaya geçebilirsin." : "Yeni bir 25 dakikalık tura hazır mısın?";
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(title, { body });
      }
      if (mode === "work") onFocusComplete(25);
      const next = mode === "work" ? "break" : "work";
      setMode(next);
      setLeft(next === "work" ? WORK_SECONDS : BREAK_SECONDS);
      done.current = false;
    }
  }, [left, running, mode, onFocusComplete]);

  function switchMode(next) {
    setMode(next);
    setRunning(false);
    setLeft(next === "work" ? WORK_SECONDS : BREAK_SECONDS);
  }

  async function toggle() {
    if (!running && typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    setRunning((value) => !value);
  }

  const total = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = ((total - left) / total) * 100;

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pomodoro</h2>
        <div className="rounded-full bg-white/5 p-1 text-sm">
          <button onClick={() => switchMode("work")} className={`rounded-full px-3 py-1 ${mode === "work" ? "bg-neon text-night" : "text-slate-300"}`}>25 odak</button>
          <button onClick={() => switchMode("break")} className={`rounded-full px-3 py-1 ${mode === "break" ? "bg-neon text-night" : "text-slate-300"}`}>5 mola</button>
        </div>
      </div>
      <div className="relative mx-auto grid h-44 w-44 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          <circle cx="60" cy="60" r="52" className="fill-none stroke-white/10" strokeWidth="8" />
          <circle cx="60" cy="60" r="52" className="fill-none stroke-neon" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`} />
        </svg>
        <div className="text-center">
          <p className="text-4xl font-semibold tracking-tight">{format(left)}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{mode === "work" ? "Odak" : "Mola"}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={toggle} className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2 font-semibold text-night">
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button onClick={() => { setRunning(false); setLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 hover:border-neon/40">
          <RotateCcw size={16} /> Sıfırla
        </button>
      </div>
    </section>
  );
}
