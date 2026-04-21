import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MoreVertical, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newToken, setNewTitle] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newToken.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newToken, priority: "MEDIUM" })
    });
    setNewTitle("");
    fetchTasks();
  };

  const toggleTask = async (id: number, completed: boolean) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">Tarefas Prioritárias</h2>
          <p className="text-slate-500 mt-1 text-sm">Gerencie seu foco e produtividade diária.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input 
            placeholder="Nova tarefa..." 
            className="flex-1 md:w-64 bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 shadow-sm rounded-lg" 
            value={newToken}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Button onClick={addTask} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 transition-all active:scale-95 shrink-0 rounded-lg">
            <Plus size={18} />
          </Button>
        </div>
      </header>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 lg:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                  className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md"
                />
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm lg:text-base font-medium transition-all duration-300 truncate max-w-[200px] sm:max-w-md lg:max-w-xl",
                    task.completed ? "text-slate-400 line-through" : "text-slate-800"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={cn(
                      "text-[9px] lg:text-[10px] px-1.5 py-0 border-slate-200 font-bold tracking-wider uppercase rounded-sm",
                      task.priority === "HIGH" ? "text-red-600 bg-red-50 border-red-100" : 
                      task.priority === "MEDIUM" ? "text-amber-600 bg-amber-50 border-amber-100" : 
                      "text-emerald-600 bg-emerald-50 border-emerald-100"
                    )}>
                      {task.priority === "HIGH" ? "Alta" : task.priority === "MEDIUM" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTask(task.id)}
                  className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 rounded-lg overflow-hidden shrink-0">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-16 lg:py-24 bg-white">
              <div className="p-4 bg-slate-50 w-fit mx-auto rounded-full mb-4">
                <CheckSquare size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 italic text-sm">Nenhuma tarefa por enquanto.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
