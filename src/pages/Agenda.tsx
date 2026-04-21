import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Agenda() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Para simplificar no MVP, usaremos dados estáticos ou Mock, 
    // mas o backend está pronto para receber eventos.
    setEvents([
      { id: 1, title: "Reunião de Alinhamento", startTime: new Date().toISOString(), location: "Google Meet", description: "Discussão sobre o projeto LifeOS" },
      { id: 2, title: "Academia", startTime: new Date(Date.now() + 3600000 * 2).toISOString(), location: "Smart Fit", description: "Treino de pernas" },
    ]);
  }, []);

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800 font-sans">Agenda Central</h2>
        <p className="text-slate-500 mt-1 text-sm lg:text-base">Seus compromissos organizados por tempo e relevância.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-10">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <CalendarIcon size={14} className="text-indigo-600" /> Próximos Eventos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {events.map((event: any) => (
              <Card key={event.id} className="bg-white border-slate-200 hover:border-indigo-300 transition-all overflow-hidden group shadow-sm hover:shadow-md">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm lg:text-base truncate">{event.title}</h4>
                      <p className="text-xs lg:text-sm text-slate-500 mt-1 line-clamp-1">{event.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 text-[10px] lg:text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                        <Clock size={12} />
                        {format(new Date(event.startTime), "HH:mm")}
                      </div>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-400 mt-3 font-medium">
                      <MapPin size={12} className="text-slate-400" />
                      {event.location}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 italic text-sm">Nada agendado por enquanto.</p>
            </div>
          )}
        </div>

        <div className="hidden xl:block">
          <Card className="bg-white border-slate-200 h-full shadow-sm sticky top-6">
            <CardHeader className="border-b border-slate-50 p-6">
              <CardTitle className="text-sm lg:text-base font-bold text-slate-800 uppercase tracking-tight">Calendário Integrado</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[400px] lg:h-[500px]">
              <div className="text-center px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <CalendarIcon size={32} className="text-slate-200" />
                </div>
                <p className="text-slate-400 text-xs lg:text-sm font-medium tracking-tight leading-relaxed max-w-[200px] mx-auto">
                  Sincronização com Google Calendar disponível em breve para usuários Pro.
                </p>
                <Button variant="outline" size="sm" className="mt-6 text-[10px] font-bold uppercase tracking-widest border-slate-200">
                  Lista de Espera
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
