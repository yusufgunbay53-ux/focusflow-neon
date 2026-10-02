"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import PomodoroTimer from "@/components/PomodoroTimer";
import AmbientPlayer from "@/components/AmbientPlayer";
import AiCoach from "@/components/AiCoach";
import { loadStats, loadTasks, saveStats, saveTasks } from "@/lib/storage";
import { emptyDay, todayKey } from "@/lib/models";

export default function AppShell() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(emptyDay());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setStats(loadStats());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveTasks(tasks);
  }, [tasks, ready]);

  useEffect(() => {
    if (ready) saveStats(stats);
  }, [stats, ready]);

  function updateTasks(next) {
    const doneBefore = tasks.filter((task) => task.column === "done").length;
    const doneAfter = next.filter((task) => task.column === "done").length;
    setTasks(next);
    if (doneAfter > doneBefore) {
      setStats((current) => ({ ...current, date: todayKey(), completedTasks: current.completedTasks + (doneAfter - doneBefore) }));
    }
  }

  function onFocusComplete(minutes) {
    setStats((current) => ({
      ...current,
      date: todayKey(),
      pomodoros: current.pomodoros + 1,
      focusMinutes: current.focusMinutes + minutes,
    }));
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-neon">FocusFlow</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Görev ve odak asistanı</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">Kanban, 25/5 Pomodoro ve günlük ritmine göre kısa koçluk. Veriler bu cihazda kalır.</p>
        </div>
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300">
          <Timer size={16} className="text-neon" />
          {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <KanbanBoard tasks={tasks} onChange={updateTasks} />
        <div className="space-y-4">
          <PomodoroTimer onFocusComplete={onFocusComplete} />
          <AmbientPlayer />
          <AiCoach tasks={tasks} stats={stats} />
        </div>
      </div>
    </main>
  );
}
