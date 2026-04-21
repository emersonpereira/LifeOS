import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Check, RotateCcw, TrendingUp } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Habit {
  id: number;
  name: string;
  frequency: string;
  completions: { id: number; date: string }[];
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newName, setNewName] = useState("");

  const fetchHabits = async () => {
    const res = await fetch("/api/habits");
    const data = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (!newName.trim()) return;
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });
    setNewName("");
    fetchHabits();
  };

  const toggleHabit = async (id: number, date: Date) => {
    await fetch(`/api/habits/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: date.toISOString() })
    });
    fetchHabits();
  };

  // Logica para os dias da semana atual
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">Rastreador de Hábitos</h2>
          <p className="text-slate-500 mt-1 text-sm lg:text-base">Consistência é a base de grandes conquistas.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input 
            placeholder="Novo hábito..." 
            className="flex-1 md:w-64 bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 shadow-sm rounded-lg" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <Button onClick={addHabit} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 rounded-lg transition-all active:scale-95 shrink-0">
            <Plus size={18} />
          </Button>
        </div>
      </header>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Hábito</th>
                {days.map((day) => (
                  <th key={day.toString()} className={cn(
                    "py-4 text-center min-w-[60px]",
                    isSameDay(day, today) ? "text-indigo-600 font-bold" : "text-slate-400"
                  )}>
                    <p className="text-[10px] uppercase font-bold tracking-widest">{format(day, "EEE", { locale: ptBR })}</p>
                    <p className="text-sm mt-1">{format(day, "d")}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {habits.map((habit) => (
                <tr key={habit.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-slate-700">{habit.name}</span>
                    </div>
                  </td>
                  {days.map((day) => {
                    const isCompleted = habit.completions.some(c => isSameDay(new Date(c.date), day));
                    return (
                      <td key={day.toString()} className="py-4 text-center">
                        <button
                          onClick={() => toggleHabit(habit.id, day)}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border",
                            isCompleted 
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-100 scale-110" 
                              : "bg-white border-slate-200 text-slate-300 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          {isCompleted && <Check size={14} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {habits.length === 0 && (
          <div className="text-center py-20 bg-white">
            <div className="p-4 bg-slate-50 w-fit mx-auto rounded-full mb-4">
              <TrendingUp size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 italic text-sm">Nenhum hábito cadastrado para esta semana.</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
        <Card className="bg-indigo-900 border-indigo-900 text-white shadow-xl shadow-indigo-100 rounded-xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-400" /> Insight de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-50 leading-relaxed font-medium italic">
              "Foque em 1% melhor a cada dia. Pequenos hábitos levam a resultados exponenciais, cada check conta."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
