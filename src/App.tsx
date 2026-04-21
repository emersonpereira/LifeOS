import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search, Plus, Menu, X } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { useState } from "react";

// Importação direta para evitar bugs de lazy loading no ambiente de preview
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Agenda from "./pages/Agenda";
import Notes from "./pages/Notes";
import Habits from "./pages/Habits";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#F9FAFB] font-sans antialiased text-slate-900 overflow-hidden relative">
        {/* Mobile Header - Visible only on small screens */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <span className="font-bold text-slate-800">LifeOS</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Sidebar - Responsive and controlled */}
        <div className={`
          fixed inset-0 z-40 lg:relative lg:z-auto transition-transform duration-300 transform
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Backdrop for mobile */}
          {mobileMenuOpen && (
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          <div className="relative h-full w-64">
            <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
        
        <main className="flex-1 overflow-hidden flex flex-col pt-16 lg:pt-0">
          {/* Desktop Search Header - Hidden on small mobile scroll if needed, but here fixed for Sleek UI */}
          <header className="h-16 border-b border-slate-200 bg-white items-center justify-between px-4 lg:px-8 shrink-0 hidden sm:flex">
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg w-full max-w-sm border border-slate-200 group focus-within:border-indigo-300 transition-all">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none text-sm outline-none w-full text-slate-700 placeholder:text-slate-400" 
              />
              <span className="hidden md:block text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">⌘K</span>
            </div>
            <div className="flex space-x-4 ml-4">
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 flex items-center gap-2 active:scale-95">
                <Plus size={16} />
                <span className="hidden md:inline">Novo Item</span>
                <span className="md:hidden">Novo</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="container mx-auto px-4 lg:px-10 py-6 lg:py-10 max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/habits" element={<Habits />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}
