"use client";

import { Sparkles } from "lucide-react";

export default function AiCoach({ tasks, stats }) {
  const open = tasks.filter((task) => task.column !== "done").length;
  const doing = tasks.filter((task) => task.column === "doing").length;
  const highOpen = tasks.filter((task) => task.priority === "high" && task.column !== "done").length;
  let message = "Hazırsın. Bir yüksek öncelikli görev seç ve ilk 25 dakikayı başlat.";
  if (stats.pomodoros >= 4 || stats.completedTasks >= 5) {
    message = "Bugün harika gidiyorsun. Ritmi bozmadan bir tur daha alabilirsin.";
  } else if (stats.focusMinutes >= 25 && doing === 0 && open > 0) {
    message = "Biraz yavaşladın. 5 dakika mola verip Yapılıyor kolonuna tek bir iş taşı.";
  } else if (highOpen > 0 && stats.pomodoros === 0) {
    message = `${highOpen} yüksek öncelikli iş bekliyor. En küçüğünü seç, Pomodoro'yu başlat.`;
  } else if (stats.pomodoros > 0 && stats.pomodoros < 2) {
    message = "İyi bir başlangıç. Bir tur daha, sonra kısa mola.";
  }

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={18} className="text-neon" />
        <h2 className="text-lg font-semibold">AI performans koçu</h2>
      </div>
      <p className="text-sm leading-6 text-slate-200">{message}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Stat label="Odak dk" value={stats.focusMinutes} />
        <Stat label="Tur" value={stats.pomodoros} />
        <Stat label="Biten" value={stats.completedTasks} />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Mock koç. Gerçek modele geçmek için bu mesaj üretimini bir API rotasıyla değiştirmen yeterli. Şema lib/models.js içinde.
      </p>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-3">
      <p className="text-lg font-semibold text-neon">{value}</p>
      <p className="text-slate-400">{label}</p>
    </div>
  );
}
