export const COLUMNS = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "doing", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

export const PRIORITIES = [
  { id: "low", label: "Düşük" },
  { id: "medium", label: "Orta" },
  { id: "high", label: "Yüksek" },
];

export const WORK_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export const STORAGE_KEYS = {
  tasks: "focusflow.tasks.v1",
  stats: "focusflow.stats.v1",
};

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createTask({ title, notes = "", priority = "medium", column = "todo" }) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    notes: notes.trim(),
    priority,
    column,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

export function emptyDay(date = todayKey()) {
  return { date, completedTasks: 0, pomodoros: 0, focusMinutes: 0 };
}

export const schema = {
  Task: {
    id: "uuid",
    title: "string",
    notes: "string",
    priority: "low | medium | high",
    column: "todo | doing | done",
    createdAt: "iso",
    updatedAt: "iso",
    completedAt: "iso | null",
  },
  DailyStat: {
    date: "YYYY-MM-DD",
    completedTasks: "number",
    pomodoros: "number",
    focusMinutes: "number",
  },
};
