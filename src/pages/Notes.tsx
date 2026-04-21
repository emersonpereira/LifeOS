import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Note {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    if (activeNote) {
      await fetch(`/api/notes/${activeNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
    } else {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "Sem título", content })
      });
    }
    
    setTitle("");
    setContent("");
    setActiveNote(null);
    fetchNotes();
  };

  const deleteNote = async (id: number) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (activeNote?.id === id) {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
    fetchNotes();
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const createNewNote = () => {
    setActiveNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="h-full flex flex-col space-y-4 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-800">Notas</h2>
          <p className="text-slate-500 mt-1 text-sm">Capture ideias e reflexões instantâneas.</p>
        </div>
        <Button onClick={createNewNote} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 transition-all active:scale-95 rounded-lg w-full sm:w-auto">
          <Plus size={18} className="mr-2" /> Nova Nota
        </Button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Sidebar de Notas */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 h-[250px] lg:h-full">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Buscar notas..." 
              className="pl-10 bg-white border-slate-200 text-slate-900 text-sm h-10 shadow-sm focus-visible:ring-indigo-500 rounded-lg" 
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {notes.map(note => (
              <Card 
                key={note.id} 
                className={`bg-white border-slate-200 cursor-pointer transition-all hover:bg-slate-50 shadow-sm rounded-lg ${activeNote?.id === note.id ? 'border-indigo-600 ring-1 ring-indigo-50 bg-indigo-50/10' : ''}`}
                onClick={() => selectNote(note)}
              >
                <div className="p-3">
                  <h3 className={cn(
                    "text-sm font-semibold truncate",
                    activeNote?.id === note.id ? "text-indigo-700" : "text-slate-800"
                  )}>{note.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{note.content || "Sem conteúdo"}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {format(new Date(note.updatedAt), "d 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Área de Edição */}
        <Card className="flex-1 bg-white border-slate-200 flex flex-col overflow-hidden shadow-sm rounded-xl min-h-[400px]">
          <CardHeader className="border-b border-slate-100 pb-4 shrink-0 px-4 lg:px-6">
            <Input 
              placeholder="Título da nota..." 
              className="bg-transparent border-none text-lg lg:text-xl font-bold p-0 h-auto focus-visible:ring-0 placeholder:text-slate-300 text-slate-800" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
            <Textarea 
              placeholder="Comece a escrever sua ideia brilhante..."
              className="flex-1 bg-transparent border-none resize-none p-4 lg:p-6 text-slate-700 focus-visible:ring-0 text-sm lg:text-base leading-relaxed custom-scrollbar"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="p-3 lg:p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <span className="text-[10px] lg:text-xs text-slate-400 italic font-medium">
                {activeNote ? "Alterações salvas" : "Nova nota em rascunho"}
              </span>
              <div className="flex items-center gap-2">
                {activeNote && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                    onClick={() => deleteNote(activeNote.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 rounded-lg px-4"
                  onClick={saveNote}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
