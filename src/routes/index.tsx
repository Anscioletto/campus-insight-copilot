import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Baby,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coffee,
  Cpu,
  FileText,
  FileSpreadsheet,
  FileCode,
  Gauge,
  GitBranch,
  Leaf,
  Mic,
  Paperclip,
  Send,
  Settings,
  Sparkles,
  SprayCan,
  Trees,
  TrendingDown,
  TrendingUp,
  Utensils,
  Zap,
  History,
  LayoutDashboard,
  Search,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UNISA · Quality Control Co-Pilot" },
      { name: "description", content: "AI-powered quality control dashboard for university campus services." },
    ],
  }),
  component: Dashboard,
});

// ─────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────

type Service = {
  id: string;
  name: string;
  icon: typeof SprayCan;
  status: "conforme" | "criticita" | "attenzione";
  metric: string;
  value: number;
  spark: number[];
};

const services: Service[] = [
  { id: "pul", name: "Pulizia", icon: SprayCan, status: "criticita", metric: "Soddisfazione VOC", value: 78, spark: [88, 86, 84, 82, 80, 79, 78] },
  { id: "rist", name: "Ristorazione", icon: Utensils, status: "conforme", metric: "Soddisfazione VOC", value: 94, spark: [89, 90, 91, 92, 93, 93, 94] },
  { id: "verdi", name: "Aree Verdi", icon: Trees, status: "conforme", metric: "Frequenza Erogazione", value: 98, spark: [95, 96, 96, 97, 97, 98, 98] },
  { id: "asilo", name: "Asilo Nido", icon: Baby, status: "conforme", metric: "Indice Qualità", value: 96, spark: [93, 94, 94, 95, 95, 96, 96] },
  { id: "vend", name: "Distrib. Automatica", icon: Coffee, status: "attenzione", metric: "Uptime Macchine", value: 87, spark: [92, 91, 90, 89, 88, 88, 87] },
];

const mudaMetrics = [
  { label: "Tempo Ricerca Documenti", value: "−95%", trend: "down" as const, target: "Target raggiunto", icon: Search },
  { label: "Tempo Redazione NC", value: "5 min", trend: "down" as const, target: "Target: 5 min", icon: FileText },
  { label: "Non Conformità Aperte", value: "12", trend: "up" as const, target: "+2 questa settimana", icon: AlertTriangle },
  { label: "Audit Completati / Mese", value: "47", trend: "up" as const, target: "+18% vs scorso mese", icon: ShieldCheck },
];

const knowledgeFiles = [
  { name: "Processo qualità.docx", tag: "System Rules", icon: FileText, color: "text-blue-600", active: true },
  { name: "7. Lean Management_Capolupo.pptx", tag: "Methodological Framework", icon: FileSpreadsheet, color: "text-orange-600", active: true },
  { name: "Capitolato_Tecnico_Servizi_Aziendali.pdf", tag: "Capitolato", icon: FileText, color: "text-rose-600", active: true },
  { name: "Offerta_Tecnica_Migliorativa_2026.pdf", tag: "Offerta", icon: FileText, color: "text-rose-600", active: true },
  { name: "Trascrizione_Incontro_Responsabile.md", tag: "Trascrizione", icon: FileCode, color: "text-violet-600", active: true },
];

type Attachment = { name: string; size: number; type: string };

type Message =
  | { role: "user"; content: string; attachment?: Attachment }
  | { role: "assistant"; content: string; table?: NcRow[]; analysis?: DocAnalysis };

type DocAnalysis = {
  fileName: string;
  pages: number;
  findings: { label: string; detail: string; severity: "ok" | "warn" | "crit" }[];
};

type NcRow = { field: string; value: string; badge?: boolean };

const initialMessages: Message[] = [
  {
    role: "user",
    content:
      "Sto effettuando il sopralluogo al Blocco Aule F e ho riscontrato che la pulizia dei servizi igienici non è stata effettuata stamattina. Cosa prevede l'Offerta Tecnica della ditta in merito alla frequenza?",
  },
  {
    role: "assistant",
    content:
      "In base all'**Articolo 4.2** dell'_Offerta Tecnica Migliorativa_ dell'Operatore Economico (Servizio Pulizie), per il **Blocco Aule F** è prevista una **sanificazione obbligatoria entro le ore 09:00** e un **ripasso pomeridiano**.\n\nIl mancato intervento configura una potenziale **Non Conformità**. Vuoi che prepari una bozza di segnalazione ISO 9001 per il Responsabile Qualità?",
  },
  { role: "user", content: "Sì, procedi con la bozza della scheda di Non Conformità." },
  {
    role: "assistant",
    content: "Ho compilato la bozza secondo il modulo ISO 9001 in uso presso UNISA. Verifica i campi prima della firma.",
    table: [
      { field: "Codice NC", value: "NC-2026-0147" },
      { field: "Data Rilevazione", value: "27/05/2026 · 10:42" },
      { field: "Tecnico Rilevatore", value: "Dott. M. Esposito" },
      { field: "Sito", value: "Blocco Aule F — Servizi Igienici P.1" },
      { field: "Descrizione Rilevazione", value: "Mancata sanificazione mattutina dei servizi igienici. Assenza di registro firme operatore. Riscontrato alle ore 10:30." },
      { field: "Riferimento Capitolato", value: "Offerta Tecnica Migliorativa — Art. 4.2 (sanificazione entro 09:00 + ripasso pomeridiano)" },
      { field: "Gravità", value: "Media — Impatto su utenza didattica" },
      { field: "Azione Correttiva Suggerita", value: "Intervento straordinario entro 2h · Richiamo formale Operatore Economico · Verifica conformità su 7gg" },
      { field: "Stato", value: "Attesa Approvazione e Firma del Tecnico Umano", badge: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// Small primitives
// ─────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Service["status"] }) {
  const map = {
    conforme: "bg-success",
    attenzione: "bg-warning",
    criticita: "bg-destructive",
  };
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full ${map[status]} animate-pulse-dot opacity-75`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${map[status]}`} />
    </span>
  );
}

function Sparkline({ data, status }: { data: number[]; status: Service["status"] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const stroke =
    status === "criticita" ? "var(--destructive)" : status === "attenzione" ? "var(--warning)" : "var(--success)";
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * h} r="2" fill={stroke} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────

function Dashboard() {
  const [tab, setTab] = useState<"dashboard" | "audit" | "ai">("dashboard");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [files, setFiles] = useState(knowledgeFiles.map((f) => ({ ...f })));
  const [whysOpen, setWhysOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const analyzeDocument = (att: Attachment): DocAnalysis => {
    const ext = att.name.split(".").pop()?.toLowerCase() ?? "";
    const isCapitolato = /capitolato|offerta|contratto/i.test(att.name);
    return {
      fileName: att.name,
      pages: Math.max(3, Math.round(att.size / 18000)),
      findings: isCapitolato
        ? [
            { label: "Frequenze di erogazione", severity: "ok", detail: "Tabella SLA estratta — 47 voci conformi a UNI EN 13549." },
            { label: "Penali contrattuali", severity: "warn", detail: "Art. 12 — clausola di penale ambigua su ritardo > 4h." },
            { label: "Sicurezza & DUVRI", severity: "ok", detail: "DUVRI allegato, valutazione rischi presente." },
            { label: "Lacuna rilevata", severity: "crit", detail: "Manca procedura di reperibilità (collegabile a NC-2026-0147)." },
          ]
        : [
            { label: "Tipo documento", severity: "ok", detail: "Classificato come evidenza operativa / verbale di sopralluogo." },
            { label: "Entità riconosciute", severity: "ok", detail: "3 siti, 2 servizi, 1 operatore economico identificati." },
            { label: "Coerenza con capitolato", severity: "warn", detail: "2 punti richiedono cross-check con Art. 4.2." },
          ],
    };
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !pendingAttachment) return;
    const att = pendingAttachment;
    const userContent = input.trim() || (att ? `Analizza questo documento: **${att.name}**` : "");
    const userMsg: Message = { role: "user", content: userContent, attachment: att ?? undefined };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPendingAttachment(null);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      if (att) {
        const analysis = analyzeDocument(att);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Ho processato **${att.name}** ed eseguito l'estrazione semantica completa. Il documento è stato indicizzato nella RAG Memory e correlato ai capitolati attivi. Ecco la sintesi:`,
            analysis,
          },
        ]);
        toast.success("Documento analizzato", { description: `${att.name} indicizzato nella RAG Memory.` });
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Ho consultato i ${files.filter((f) => f.active).length} documenti attivi nella RAG Memory. In riferimento a "${userContent.slice(0, 60)}${userContent.length > 60 ? "…" : ""}", la procedura di riferimento è descritta nel **Processo qualità.docx** §3.4. Posso generare una scheda di audit, una NC o un report sintetico — dimmi come procedere.`,
          },
        ]);
        toast.success("Risposta generata", { description: "AI Co-Pilot ha consultato la RAG Memory." });
      }
    }, 1100);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingAttachment({ name: f.name, size: f.size, type: f.type });
    toast("Documento allegato", { description: `${f.name} pronto per l'analisi.` });
    e.target.value = "";
  };

  const toggleFile = (i: number) => {
    setFiles((f) => f.map((file, idx) => (idx === i ? { ...file, active: !file.active } : file)));
    toast(`${files[i].name}`, { description: files[i].active ? "Rimosso dal contesto RAG" : "Aggiunto al contesto RAG" });
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Toaster position="top-right" richColors closeButton />
      <TopBar tab={tab} setTab={setTab} />

      {tab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_340px] gap-4 p-4 max-w-[1600px] mx-auto">
          <LeftSidebar />
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            thinking={thinking}
            scrollRef={scrollRef}
          />
          <RightPanel files={files} toggleFile={toggleFile} whysOpen={whysOpen} setWhysOpen={setWhysOpen} />
        </div>
      )}

      {tab === "audit" && <EmptyTab title="Audit Storici" desc="Archivio completo degli audit eseguiti, filtrabili per sito, servizio e periodo." icon={History} />}
      {tab === "ai" && <EmptyTab title="Impostazioni AI" desc="Configurazione del modello, soglie di confidenza e regole di grounding RAG." icon={Settings} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Top bar
// ─────────────────────────────────────────────────────────

function TopBar({ tab, setTab }: { tab: string; setTab: (t: "dashboard" | "audit" | "ai") => void }) {
  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "audit" as const, label: "Audit Storici", icon: History },
    { id: "ai" as const, label: "Impostazioni AI", icon: Settings },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">UNISA</span>
            <span className="text-sm font-semibold">Quality Control</span>
          </div>
          <div className="hidden md:flex items-center gap-1 ml-6 p-1 rounded-lg bg-muted/60 border border-border">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    active
                      ? "bg-card text-foreground shadow-elegant"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/60 border border-border text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            <span>Cerca audit, NC, documenti…</span>
            <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-card border border-border">⌘K</kbd>
          </div>
          <button className="relative p-2 rounded-md hover:bg-muted transition">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-ai flex items-center justify-center text-xs font-semibold text-ai-foreground">
            ME
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────
// Left sidebar
// ─────────────────────────────────────────────────────────

function LeftSidebar() {
  return (
    <aside className="space-y-4">
      <section className="rounded-xl bg-card border border-border shadow-elegant overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Service Performance</h2>
            <p className="text-[11px] text-muted-foreground">Lean KPIs · live</p>
          </div>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </div>
        <ul className="divide-y divide-border">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.id}
                className="px-4 py-3 hover:bg-muted/40 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={s.status} />
                    <span
                      className={`text-[10px] uppercase tracking-wider font-medium ${
                        s.status === "conforme"
                          ? "text-success"
                          : s.status === "attenzione"
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {s.status === "conforme" ? "Conforme" : s.status === "attenzione" ? "Attenzione" : "Criticità"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground">{s.metric}</div>
                    <div className="text-base font-semibold tabular-nums">{s.value}%</div>
                  </div>
                  <Sparkline data={s.spark} status={s.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl bg-card border border-border shadow-elegant overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-ai" />
              Muda & Efficiency
            </h2>
            <p className="text-[11px] text-muted-foreground">Lean Management Tracker</p>
          </div>
        </div>
        <ul className="p-2 space-y-1">
          {mudaMetrics.map((m) => {
            const Icon = m.icon;
            const TrendIcon = m.trend === "down" ? TrendingDown : TrendingUp;
            const good = (m.label.startsWith("Tempo") || m.label.startsWith("Non")) ? m.trend === "down" : m.trend === "up";
            return (
              <li
                key={m.label}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition"
              >
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-muted-foreground truncate">{m.label}</div>
                  <div className="text-xs text-muted-foreground/80 truncate">{m.target}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{m.value}</div>
                  <div className={`text-[10px] flex items-center justify-end gap-0.5 ${good ? "text-success" : "text-destructive"}`}>
                    <TrendIcon className="h-2.5 w-2.5" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────
// Chat panel
// ─────────────────────────────────────────────────────────

function ChatPanel({
  messages,
  input,
  setInput,
  onSend,
  thinking,
  scrollRef,
}: {
  messages: Message[];
  input: string;
  setInput: (s: string) => void;
  onSend: (e?: React.FormEvent) => void;
  thinking: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="rounded-xl bg-card border border-border shadow-elegant flex flex-col h-[calc(100vh-96px)] overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-ai flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-ai-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              AI Assistant
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-ai/10 text-ai border border-ai/20">
                Human-in-the-Loop
              </span>
            </h2>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              Active Support · Grounded on 5 docs
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Cpu className="h-3 w-3" />
          <span>UNISA-LLM v2.4</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-6 space-y-6">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-ai animate-pulse-dot" />
            <span className="bg-gradient-to-r from-ai via-ai-glow to-ai bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer font-medium">
              Consultazione RAG in corso…
            </span>
          </div>
        )}
      </div>

      <form onSubmit={onSend} className="p-3 border-t border-border">
        <div className="rounded-xl border border-border bg-surface focus-within:border-ring focus-within:shadow-glow transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={2}
            placeholder="Chiedi al Co-Pilot · es. 'Genera report audit settimanale Blocco Aule F'…"
            className="w-full px-4 pt-3 pb-2 bg-transparent text-sm placeholder:text-muted-foreground/70 outline-none resize-none"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toast("Registrazione vocale", { description: "Funzione voice notes attiva sul campo." })}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                title="Voice note"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toast("Allegato", { description: "Carica foto del sopralluogo o documenti." })}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                title="Allega"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <span className="text-[10px] text-muted-foreground ml-1 hidden sm:inline">
                Shift+Enter per andare a capo
              </span>
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground text-xs font-medium shadow-elegant disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              Invia
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm shadow-elegant">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="h-7 w-7 rounded-lg bg-gradient-ai flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="h-3.5 w-3.5 text-ai-foreground" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="text-sm leading-relaxed text-foreground/90">
          <RichText content={message.content} />
        </div>
        {message.table && <NcTable rows={message.table} />}
      </div>
    </div>
  );
}

function RichText({ content }: { content: string }) {
  // Tiny markdown: **bold**, _italic_, paragraphs.
  const paragraphs = content.split("\n\n");
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {parseInline(p)}
        </p>
      ))}
    </>
  );
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++} className="font-semibold text-foreground">{tok.slice(2, -2)}</strong>);
    else parts.push(<em key={key++} className="italic">{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function NcTable({ rows }: { rows: NcRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-elegant">
      <div className="px-4 py-2.5 border-b border-border bg-gradient-to-r from-primary/5 to-ai/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">Bozza Scheda Non Conformità (NC)</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ISO 9001</span>
      </div>
      <table className="w-full text-xs">
        <tbody>
          {rows.map((r) => (
            <tr key={r.field} className="border-b border-border last:border-0">
              <td className="px-4 py-2 align-top w-[40%] text-muted-foreground font-medium bg-muted/30">
                {r.field}
              </td>
              <td className="px-4 py-2 align-top">
                {r.badge ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-warning/15 text-warning-foreground border border-warning/30 font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    {r.value}
                  </span>
                ) : (
                  r.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Bozza generata dall'AI · richiede firma umana</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toast.success("Bozza archiviata in revisione")}
            className="text-[11px] px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted transition"
          >
            Modifica
          </button>
          <button
            onClick={() => toast.success("NC-2026-0147 firmata e trasmessa", { description: "Inviata al Responsabile Qualità." })}
            className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Approva & Firma
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Right panel
// ─────────────────────────────────────────────────────────

function RightPanel({
  files,
  toggleFile,
  whysOpen,
  setWhysOpen,
}: {
  files: typeof knowledgeFiles;
  toggleFile: (i: number) => void;
  whysOpen: boolean;
  setWhysOpen: (b: boolean) => void;
}) {
  const activeCount = files.filter((f) => f.active).length;
  return (
    <aside className="space-y-4">
      <section className="rounded-xl bg-card border border-border shadow-elegant overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-ai/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-ai" />
                Documentazione Attiva
              </h2>
              <p className="text-[11px] text-muted-foreground">RAG Memory · {activeCount}/{files.length} attivi</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-ai font-medium px-2 py-1 rounded bg-ai/10 border border-ai/20">
              Grounded
            </span>
          </div>
        </div>
        <ul className="p-2 space-y-1">
          {files.map((f, i) => {
            const Icon = f.icon;
            return (
              <li
                key={f.name}
                className="group p-2.5 rounded-lg hover:bg-muted/50 transition flex items-start gap-2.5"
              >
                <div className={`h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0 ${f.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{f.name}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    {f.active && <span className="h-1 w-1 rounded-full bg-success" />}
                    <span>{f.active ? "Active" : "Disabled"} · {f.tag}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFile(i)}
                  className={`relative h-5 w-9 rounded-full transition shrink-0 mt-0.5 ${
                    f.active ? "bg-success" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Toggle ${f.name}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-elegant transition-all ${
                      f.active ? "left-4" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl bg-card border border-border shadow-elegant overflow-hidden">
        <button
          onClick={() => setWhysOpen(!whysOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition"
        >
          <div className="text-left">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5 text-ai" />
              Root Cause Analysis
            </h2>
            <p className="text-[11px] text-muted-foreground">5 Whys · Ishikawa</p>
          </div>
          {whysOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {whysOpen && (
          <div className="px-4 pb-4 space-y-2">
            <div className="text-[11px] text-muted-foreground mb-2">
              Problema: <span className="text-foreground font-medium">Mancata sanificazione Blocco F</span>
            </div>
            {[
              { q: "Perché non è stata effettuata?", a: "L'operatore non era presente alle 08:30." },
              { q: "Perché l'operatore non era presente?", a: "Turno non coperto dopo assenza imprevista." },
              { q: "Perché il turno non era coperto?", a: "Manca procedura di reperibilità formalizzata." },
              { q: "Perché manca la procedura?", a: "Offerta tecnica non specifica il backup operativo." },
              { q: "Causa Radice", a: "Lacuna contrattuale nell'Art. 4.2 — richiesta integrazione.", root: true },
            ].map((w, i) => (
              <div key={i} className="flex gap-2.5">
                <div className={`mt-0.5 h-5 w-5 rounded-md shrink-0 flex items-center justify-center text-[10px] font-bold ${
                  w.root ? "bg-destructive text-destructive-foreground" : "bg-ai/15 text-ai border border-ai/20"
                }`}>
                  {w.root ? "!" : i + 1}
                </div>
                <div className="flex-1 text-xs">
                  <div className={`font-medium ${w.root ? "text-destructive" : "text-foreground"}`}>{w.q}</div>
                  <div className="text-muted-foreground mt-0.5">{w.a}</div>
                </div>
              </div>
            ))}
            <button
              onClick={() => toast.success("Analisi Ishikawa generata")}
              className="w-full mt-2 px-3 py-2 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-ai hover:text-ai hover:bg-ai/5 transition flex items-center justify-center gap-1.5"
            >
              <Leaf className="h-3 w-3" />
              Genera Diagramma Ishikawa
            </button>
          </div>
        )}
      </section>

      <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-[11px] text-muted-foreground flex items-start gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
        <span>
          <span className="text-foreground font-medium">Compliance ISO 9001:2015.</span> Ogni risposta AI è tracciata e revisionabile dal Tecnico della Qualità.
        </span>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────
// Empty tab
// ─────────────────────────────────────────────────────────

function EmptyTab({ title, desc, icon: Icon }: { title: string; desc: string; icon: typeof Settings }) {
  return (
    <div className="max-w-[1600px] mx-auto p-8">
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
        <div className="h-12 w-12 rounded-xl bg-gradient-ai mx-auto mb-4 flex items-center justify-center shadow-glow">
          <Icon className="h-6 w-6 text-ai-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-1.5">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{desc}</p>
        <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-ai">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Sezione in arrivo
        </div>
      </div>
    </div>
  );
}
