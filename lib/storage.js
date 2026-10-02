import { STORAGE_KEYS, emptyDay, todayKey } from "./models";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadTasks() {
  const tasks = read(STORAGE_KEYS.tasks, null);
  if (Array.isArray(tasks)) return tasks;
  const seed = [
    {
      id: "seed-1",
      title: "Günün en önemli işini seç",
      notes: "Tek bir hedef, tek bir kolon.",
      priority: "high",
      column: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    },
    {
      id: "seed-2",
      title: "İlk Pomodoro'yu başlat",
      notes: "25 dakika kesintisiz odak.",
      priority: "medium",
      column: "doing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    },
  ];
  write(STORAGE_KEYS.tasks, seed);
  return seed;
}

export function saveTasks(tasks) {
  write(STORAGE_KEYS.tasks, tasks);
}

export function loadStats() {
  const all = read(STORAGE_KEYS.stats, {});
  const key = todayKey();
  return all[key] || emptyDay(key);
}

export function saveStats(day) {
  const all = read(STORAGE_KEYS.stats, {});
  all[day.date] = day;
  write(STORAGE_KEYS.stats, all);
}

export function loadHistory() {
  return read(STORAGE_KEYS.stats, {});
}
