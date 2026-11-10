import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity, AlertTriangle, Building2, CheckCircle2, ClipboardCheck,
  FileText, Gauge, HardHat, LayoutDashboard, LogOut, Menu, Search, Settings,
  ShieldCheck, Users, Wrench, X
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Machine = {
  id: string; tag: string; name: string; sector_name: string | null;
  status: string; adequacy_stage: string;
};

const nav = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Empresas e unidades", icon: Building2 },
  { label: "Inventário de máquinas", icon: Wrench },
  { label: "Diagnóstico NR-12", icon: ClipboardCheck },
  { label: "APR e HRN", icon: AlertTriangle },
  { label: "Plano de adequação", icon: Activity },
  { label: "Trabalhadores", icon: Users },
  { label: "Laudos e relatórios", icon: FileText },
  { label: "Configurações", icon: Settings }
];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase.from("machines")
      .select("id,tag,name,status,adequacy_stage,sectors(name)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) { setError(error.message); return; }
        setMachines((data ?? []).map((m: any) => ({
          ...m, sector_name: m.sectors?.name ?? "Setor não informado"
        })));
      });
  }, [session]);

  const filteredMachines = useMemo(() => machines.filter(m =>
    `${m.tag} ${m.name} ${m.sector_name}`.toLowerCase().includes(query.toLowerCase())
  ), [machines, query]);

  async function signIn(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setSession(null);
  }

  if (!isSupabaseConfigured) return <SetupScreen />;
  if (loading) return <div className="loading">Carregando CONECTASEG-NR12 CONTROL...</div>;
  if (!session) return (
    <main className="login-wrap">
      <section className="login-card">
        <Brand />
        <h1>Acesse sua plataforma</h1>
        <p className="muted">Entre com seu usuário autorizado.</p>
        <form onSubmit={signIn} className="form">
          <label>E-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Senha<input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary full">Entrar</button>
        </form>
        <small>O cadastro de usuários é administrado pelo responsável da organização.</small>
      </section>
    </main>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand-row"><Brand compact /><button className="icon-btn mobile-close" onClick={() => setMobileOpen(false)}><X /></button></div>
        <div className="nav-label">GESTÃO NR-12</div>
        {nav.map(item => {
          const Icon = item.icon;
          return <button key={item.label} className={`nav-item ${active === item.label ? "selected" : ""}`}
            onClick={() => { setActive(item.label); setMobileOpen(false); }}>
            <Icon size={18}/><span>{item.label}</span>
          </button>;
        })}
        <div className="sidebar-bottom"><ShieldCheck size={17}/> Ambiente corporativo protegido</div>
      </aside>
      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button>
          <div><span className="eyebrow">CONECTASEG / NR12 CONTROL</span><h2>{active}</h2></div>
          <div className="user-area"><span>{session.user.email}</span><button className="icon-btn" title="Sair" onClick={signOut}><LogOut size={18}/></button></div>
        </header>
        {active === "Dashboard" ? <Dashboard machines={machines} /> :
          active === "Inventário de máquinas" ? <MachineList machines={filteredMachines} query={query} setQuery={setQuery} /> :
          <ModulePlaceholder title={active} />}
      </main>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="brand"><div className="brand-mark"><ShieldCheck size={compact ? 22 : 28}/></div><div><strong>CONECTASEG</strong><b>NR12 CONTROL</b>{!compact && <small>Gestão integrada de máquinas</small>}</div></div>;
}

function SetupScreen() {
  return <main className="login-wrap"><section className="login-card"><Brand/><h1>Configuração pendente</h1>
    <p>Adicione as variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no ambiente local e nas configurações do Netlify.</p>
    <p className="muted">Não coloque a chave service_role no navegador.</p></section></main>;
}

function Dashboard({ machines }: { machines: Machine[] }) {
  const stats = [
    { label: "Máquinas cadastradas", value: machines.length, icon: Wrench, tone: "blue" },
    { label: "Em adequação", value: machines.filter(m => m.adequacy_stage === "adequacao").length, icon: Activity, tone: "orange" },
    { label: "Com alertas críticos", value: "—", icon: AlertTriangle, tone: "red" },
    { label: "Diagnósticos registrados", value: "—", icon: ClipboardCheck, tone: "green" }
  ];
  return <div className="content">
    <div className="welcome"><div><span className="eyebrow">VISÃO CORPORATIVA</span><h1>Gestão integrada de segurança de máquinas</h1><p>Centralize inventário, diagnóstico, adequação e acompanhamento operacional.</p></div><div className="status-pill"><span/> Interface conectada ao Supabase</div></div>
    <div className="stats-grid">{stats.map(s => { const Icon=s.icon; return <article className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><Icon/></div><div><strong>{s.value}</strong><span>{s.label}</span></div></article>; })}</div>
    <div className="panel-grid">
      <section className="panel wide"><div className="panel-head"><div><h3>Inventário de máquinas</h3><p>Equipamentos cadastrados na organização</p></div><span className="tag">Dados do Supabase</span></div>
        {machines.length ? <MachineTable machines={machines.slice(0,6)} /> : <Empty text="Nenhuma máquina cadastrada. O inventário aparecerá aqui após o primeiro cadastro."/>}
      </section>
      <section className="panel"><div className="panel-head"><div><h3>Ciclo de adequação</h3><p>Distribuição inicial</p></div><Gauge/></div><div className="empty-chart"><div className="donut"><span>—<small>máquinas</small></span></div><p>Os indicadores serão calculados conforme os registros de diagnóstico e ações.</p></div></section>
      <section className="panel"><div className="panel-head"><div><h3>Central de alertas</h3><p>Ocorrências de segurança</p></div><AlertTriangle color="#D97724"/></div><Empty text="Os alertas aparecerão quando checklists e ocorrências forem habilitados."/></section>
    </div>
    <div className="note"><CheckCircle2 size={18}/> Fundação conectada. Os indicadores ainda não implementados são exibidos como “—”, sem inventar resultados.</div>
    {errorMessagePlaceholder()}
  </div>;
}
function errorMessagePlaceholder() { return null; }

function MachineList({ machines, query, setQuery }: { machines: Machine[]; query: string; setQuery: (v:string)=>void }) {
  return <div className="content"><div className="welcome"><div><span className="eyebrow">CADASTRO BASE</span><h1>Inventário de máquinas</h1><p>Consulta dos equipamentos vinculados à sua organização.</p></div></div>
    <section className="panel"><div className="search-box"><Search size={18}/><input placeholder="Buscar por TAG, máquina ou setor..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      {machines.length ? <MachineTable machines={machines}/> : <Empty text="Nenhuma máquina encontrada ou ainda não há máquinas cadastradas."/>}
    </section></div>;
}

function MachineTable({ machines }: { machines: Machine[] }) {
  return <div className="table-scroll"><table><thead><tr><th>TAG</th><th>Equipamento</th><th>Setor</th><th>Status</th><th>Etapa</th></tr></thead><tbody>
    {machines.map(m=><tr key={m.id}><td><b>{m.tag}</b></td><td>{m.name}</td><td>{m.sector_name}</td><td><span className="soft-tag">{m.status}</span></td><td>{m.adequacy_stage}</td></tr>)}
  </tbody></table></div>;
}
function Empty({text}:{text:string}) { return <div className="empty"><ClipboardCheck size={26}/><p>{text}</p></div>; }
function ModulePlaceholder({title}:{title:string}) { return <div className="content"><section className="panel placeholder"><HardHat size={34}/><h2>{title}</h2><p>Este módulo está previsto na arquitetura do CONECTASEG-NR12 CONTROL e será implementado nas próximas fases.</p><span className="tag">Planejado — ainda não disponível</span></section></div>; }
