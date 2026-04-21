import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckSquare, Activity, StickyNote, TrendingUp, Calendar, Clock, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DashboardData {
  tasks: any[];
  events: any[];
  habits: any[];
  stats: {
    pendingTasksCount: number;
    completedTasksToday: number;
    productivity: number;
  };
}

const chartData = [
  { name: 'Seg', habits: 4, tasks: 3 },
  { name: 'Ter', habits: 3, tasks: 5 },
  { name: 'Qua', habits: 5, tasks: 2 },
  { name: 'Qui', habits: 4, tasks: 4 },
  { name: 'Sex', habits: 6, tasks: 6 },
  { name: 'Sáb', habits: 2, tasks: 1 },
  { name: 'Dom', habits: 7, tasks: 3 },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Resumo do Dia - MVP Header */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 lg:p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight">O resumo do seu dia.</h2>
            <p className="text-indigo-100 text-sm lg:text-lg opacity-90 max-w-xl">
              Você tem <span className="font-bold underline underline-offset-4">{data.stats.pendingTasksCount} tarefas</span> pendentes e <span className="font-bold underline underline-offset-4">{data.habits.filter(h => !h.isCompletedToday).length} hábitos</span> para concluir hoje.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 min-w-[100px]">
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Produtividade</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold">{data.stats.productivity}%</p>
                <TrendingUp size={12} className="text-emerald-300" />
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Tarefas Hoje</CardTitle>
            <CheckSquare size={16} className="text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-800">{data.stats.completedTasksToday} / {data.stats.pendingTasksCount + data.stats.completedTasksToday}</div>
            <p className="text-[10px] lg:text-xs text-slate-400 mt-1">Status de conclusão</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Hábitos Concluídos</CardTitle>
            <Activity size={16} className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-800">{data.habits.filter(h => h.isCompletedToday).length}</div>
            <p className="text-[10px] lg:text-xs text-slate-400 mt-1">Total de {data.habits.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Agenda de Hoje</CardTitle>
            <Calendar size={16} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-800">{data.events.length}</div>
            <p className="text-[10px] lg:text-xs text-slate-400 mt-1">Compromissos agendados</p>
          </CardContent>
        </Card>

        <Card className="hidden xl:block bg-indigo-600 border-indigo-700 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em]">Sincronização</CardTitle>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold uppercase tracking-tighter">VIP ACTIVE</div>
            <p className="text-[10px] text-indigo-100 font-medium mt-1">Nuvem atualizada há 1m</p>
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {/* Left Column: Tasks and Events */}
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckSquare size={20} className="text-indigo-600" />
                Tarefas Pendentes
              </CardTitle>
              <ChevronRight size={20} className="text-slate-300" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.tasks.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-xl">Nenhuma tarefa pendente para agora.</p>
                ) : (
                  data.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        <span className="text-sm font-medium text-slate-700">{task.title}</span>
                      </div>
                      <div className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold border",
                        task.priority === "HIGH" ? "bg-rose-50 text-rose-600 border-rose-100" :
                        task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      )}>
                        {task.priority}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-amber-500" />
                Próximos Compromissos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.events.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-xl">Agenda livre para hoje.</p>
                ) : (
                  data.events.map((event) => (
                    <div key={event.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-amber-50 rounded-lg">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">{format(new Date(event.startTime), "HH:mm")}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 capitalize">{event.location || "Sem localização"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Habits and Performance Chart */}
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-emerald-500" />
                Hábitos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.habits.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center col-span-full border border-dashed border-slate-200 rounded-xl">Defina seus hábitos no módulo lateral.</p>
                ) : (
                  data.habits.map((habit) => (
                    <div key={habit.id} className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      habit.isCompletedToday ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-100"
                    )}>
                      {habit.isCompletedToday ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <Circle size={18} className="text-slate-300" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        habit.isCompletedToday ? "text-emerald-700" : "text-slate-600"
                      )}>{habit.name}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[200px] w-full pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="habits" stroke="#4F46E6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
