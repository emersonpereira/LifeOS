import { LayoutDashboard, CheckSquare, Calendar, StickyNote, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CheckSquare, label: "Tarefas", href: "/tasks" },
  { icon: Calendar, label: "Agenda", href: "/agenda" },
  { icon: StickyNote, label: "Notas", href: "/notes" },
  { icon: Activity, label: "Hábitos", href: "/habits" },
];

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-white text-slate-500 flex flex-col border-r border-slate-200 shadow-xl lg:shadow-none">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">LifeOS</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={18} className={cn(
                isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mb-20 lg:mb-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">EP</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Emerson Pereira</p>
            <p className="text-xs text-slate-400 truncate">Plano Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
