import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(">>> [STABILITY] Starting server components...");

  app.use(compression());
  app.use(express.json());

  // 1. API Routes (Defined BEFORE Vite to ensure priority)
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  
  app.get("/api/dashboard", async (req, res) => {
    try {
      const url = process.env.VITE_SUPABASE_URL;
      const key = process.env.VITE_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        return res.json({ tasks: [], events: [], habits: [], stats: { pendingTasksCount: 0, completedTasksToday: 0, productivity: 0 } });
      }

      const supabase = createClient(url, key);
      const today = new Date();
      today.setHours(0,0,0,0);
      const todayISO = today.toISOString();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [tasks, events, habits] = await Promise.all([
        supabase.from('tasks').select('*').eq('completed', false).limit(5).order('created_at', { ascending: false }),
        supabase.from('events').select('*').gte('start_time', todayISO).lt('start_time', tomorrow.toISOString()).order('start_time', { ascending: true }),
        supabase.from('habits').select('*, habit_completions(id)').eq('habit_completions.date', todayISO.split('T')[0])
      ]);

      res.json({
        tasks: tasks.data || [],
        events: events.data || [],
        habits: (habits.data || []).map((h: any) => ({
          ...h,
          isCompletedToday: h.habit_completions && h.habit_completions.length > 0
        })),
        stats: {
          pendingTasksCount: tasks.data?.length || 0,
          completedTasksToday: 0,
          productivity: 0
        }
      });
    } catch (e) {
      console.error("Dashboard API Error:", e);
      res.json({ tasks: [], events: [], habits: [], stats: { pendingTasksCount: 0, completedTasksToday: 0, productivity: 0 } });
    }
  });

  // 2. UI Engine (Vite)
  if (process.env.NODE_ENV !== "production") {
    console.log(">>> [BOOT] Development mode: Attaching Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  // 3. Start listening - AT THE END
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> [SERVER] LifeOS is fully operational at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error(">>> [FATAL] Critical failure on startup:", err);
});
