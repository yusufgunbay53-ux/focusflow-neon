"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, GripVertical, Pencil, Plus, Trash2, X } from "lucide-react";
import { COLUMNS, PRIORITIES, createTask } from "@/lib/models";

const priorityStyle = {
  low: "text-emerald-300 bg-emerald-400/10",
  medium: "text-amber-200 bg-amber-300/10",
  high: "text-rose-200 bg-rose-400/10",
};

export default function KanbanBoard({ tasks, onChange }) {
  const [draft, setDraft] = useState({ title: "", notes: "", priority: "medium" });
  const [editing, setEditing] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);

  const grouped = useMemo(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col.id] = tasks.filter((task) => task.column === col.id);
      return acc;
    }, {});
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onChange([createTask(draft), ...tasks]);
    setDraft({ title: "", notes: "", priority: "medium" });
  }

  function patch(id, next) {
    onChange(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...next,
              updatedAt: new Date().toISOString(),
              completedAt: next.column === "done" ? task.completedAt || new Date().toISOString() : null,
            }
          : task
      )
    );
  }

  function remove(id) {
    onChange(tasks.filter((task) => task.id !== id));
  }

  function dropOn(column) {
    if (!dragId) return;
    patch(dragId, { column });
    setDragId(null);
    setOver(null);
  }

  return (
    <section className="space-y-4">
      <form onSubmit={addTask} className="glass rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Yeni görev..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none ring-neon/40 placeholder:text-slate-500 focus:ring-2"
          />
          <select
            value={draft.priority}
            onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
            className="rounded-xl border border-white/10 bg-[#10192b] px-3 py-3"
          >
            {PRIORITIES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 font-semibold text-night shadow-glow transition hover:brightness-110">
            <Plus size={18} /> Ekle
          </button>
        </div>
        <input
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Kısa not (opsiyonel)"
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-neon/40"
        />
      </form>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => { e.preventDefault(); setOver(column.id); }}
            onDragLeave={() => setOver(null)}
            onDrop={() => dropOn(column.id)}
            className={`glass min-h-[320px] rounded-2xl p-3 transition ${over === column.id ? "column-drop" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">{grouped[column.id].length}</span>
            </div>
            <div className="space-y-3">
              {grouped[column.id].map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDragId(task.id)}
                  className="rounded-xl border border-white/10 bg-[#0d1628] p-3 transition hover:-translate-y-0.5 hover:border-neon/40"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical size={16} className="mt-1 shrink-0 text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium ${task.column === "done" ? "text-slate-500 line-through" : ""}`}>{task.title}</p>
                      {task.notes ? <p className="mt-1 text-sm text-slate-400">{task.notes}</p> : null}
                      <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ${priorityStyle[task.priority]}`}>
                        {PRIORITIES.find((item) => item.id === task.priority)?.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-1">
                    <button onClick={() => patch(task.id, { column: task.column === "done" ? "todo" : "done" })} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-neon" aria-label="Tamamla"><Check size={16} /></button>
                    <button onClick={() => setEditing(task)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-neon" aria-label="Duzenle"><Pencil size={16} /></button>
                    <button onClick={() => remove(task.id)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-rose-300" aria-label="Sil"><Trash2 size={16} /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <EditDialog
          task={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => { patch(editing.id, next); setEditing(null); }}
        />
      ) : null}
    </section>
  );
}

function EditDialog({ task, onClose, onSave }) {
  const [form, setForm] = useState(task);
  useEffect(() => setForm(task), [task]);
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return;
          onSave({ title: form.title.trim(), notes: form.notes, priority: form.priority, column: form.column });
        }}
        className="glass w-full max-w-md rounded-2xl p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Görevi düzenle</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-white/10"><X size={18} /></button>
        </div>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border border-white/10 bg-[#10192b] px-3 py-2">
            {PRIORITIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <select value={form.column} onChange={(e) => setForm({ ...form, column: e.target.value })} className="rounded-xl border border-white/10 bg-[#10192b] px-3 py-2">
            {COLUMNS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <button className="w-full rounded-xl bg-neon py-2.5 font-semibold text-night">Kaydet</button>
      </form>
    </div>
  );
}
