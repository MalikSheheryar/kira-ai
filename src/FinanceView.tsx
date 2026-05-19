// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import {
  Home, BarChart3, CreditCard, Wallet, Users, CheckSquare, PieChart, Calculator,
  Receipt, Gift, Plus, ChevronRight,
  ArrowUpRight, ArrowDownRight, TrendingUp, Building2,
  ShoppingBag, Sparkles, X, Search, Filter, Download, Send, Loader2,
  Eye, EyeOff, Lock, Unlock, MoreHorizontal, Zap,
  ArrowRight, Banknote, Repeat, CheckCircle2, Clock, FileText,
  Briefcase, User, Layers, Activity, Target, ShieldCheck,
  ChevronLeft, Edit3, Trash2,
  Heart, Bitcoin
} from 'lucide-react';

export default function FinanceView() {
  const [mode, setMode] = useState('business'); // business | personal
  const [activeNav, setActiveNav] = useState('home');
  const [aiOpen, setAiOpen] = useState(false);
  const [_notifOpen, _setNotifOpen] = useState(false);
  const [_profileOpen, _setProfileOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const businessNav = [
    { section: null, items: [{ id: 'home', label: 'Dashboard', icon: Home }] },
    { section: 'OVERVIEW', items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'transactions', label: 'Transactions', icon: Activity, badge: 12 },
      { id: 'pool', label: 'Pool Accounts', icon: Wallet },
    ]},
    { section: 'SPENDING', items: [
      { id: 'cards', label: 'Cards', icon: CreditCard },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: 5 },
      { id: 'budgeting', label: 'Budgeting', icon: PieChart },
    ]},
    { section: 'OPERATIONS', items: [
      { id: 'accounting', label: 'Accounting', icon: Calculator },
      { id: 'integrations', label: 'Integrations', icon: Layers },
      { id: 'billpay', label: 'Bill Pay', icon: Receipt },
      { id: 'invoices', label: 'Create / Invoices', icon: FileText },
      { id: 'reimburse', label: 'Reimbursements', icon: Banknote },
    ]},
    { section: 'GROWTH', items: [
      { id: 'invest', label: 'Investments', icon: TrendingUp },
      { id: 'insights', label: 'AI Insights', icon: Sparkles },
      { id: 'rewards', label: 'Rewards', icon: Gift },
    ]},
  ];

  const personalNav = [
    { section: null, items: [{ id: 'home', label: 'Dashboard', icon: Home }] },
    { section: 'MONEY', items: [
      { id: 'analytics', label: 'Spending', icon: BarChart3 },
      { id: 'transactions', label: 'Transactions', icon: Activity },
      { id: 'pool', label: 'Accounts', icon: Wallet },
      { id: 'cards', label: 'Cards', icon: CreditCard },
    ]},
    { section: 'PLAN', items: [
      { id: 'budgeting', label: 'Budgets', icon: PieChart },
      { id: 'goals', label: 'Goals', icon: Target },
      { id: 'invest', label: 'Investments', icon: TrendingUp },
      { id: 'billpay', label: 'Bills', icon: Receipt },
      { id: 'invoices', label: 'Create / Invoices', icon: FileText },
    ]},
    { section: 'GROWTH', items: [
      { id: 'insights', label: 'AI Insights', icon: Sparkles },
      { id: 'rewards', label: 'Rewards', icon: Gift },
    ]},
  ];

  const nav = mode === 'business' ? businessNav : personalNav;

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{
      background: 'url("/MainBG.png")',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.4); }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease-out; }
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wave { animation: wave 2.5s ease-in-out infinite; transform-origin: 70% 70%; }
      `}</style>

      {/* SIDEBAR */}
      <aside className="flex flex-col flex-shrink-0 w-64 border-r bg-white/40 backdrop-blur-xl border-white/60">
        {/* Logo */}
        <div className="p-5 flex items-center gap-2.5">
          <div className="flex items-center justify-center shadow-lg w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-[#3b82f6]/30">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-lg font-bold leading-none font-display text-slate-900">Kira</div>
            <div className="text-[10px] text-[#2563eb] font-semibold tracking-wider leading-tight mt-0.5">FINANCE</div>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="px-4 pb-4">
          <div className="flex p-1 border bg-white/60 rounded-xl border-white/80">
            <button
              onClick={() => setMode('business')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'business' ? 'bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-md shadow-[#3b82f6]/30' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3 h-3" /> Business
            </button>
            <button
              onClick={() => setMode('personal')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'personal' ? 'bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-md shadow-[#3b82f6]/30' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3" /> Personal
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-3 space-y-4 overflow-y-auto">
          {nav.map((group, gi) => (
            <div key={gi}>
              {group.section && (
                <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 tracking-widest">
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const active = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group relative ${
                        active
                          ? 'bg-gradient-to-br from-[#3b82f6]/15 to-[#1d4ed8]/10 text-[#1e3a8a] font-semibold'
                          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                      }`}
                    >
                      {active && <div className="absolute left-0 w-1 h-5 -translate-y-1/2 rounded-r top-1/2 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]" />}
                      <Icon className={`w-4 h-4 ${active ? 'text-[#2563eb]' : 'text-slate-500'}`} strokeWidth={active ? 2.2 : 1.8} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-6 mb-6 border-b border-black/10">
          <div>
            <h1 className="text-[30px] font-medium text-black">
              Good Day Kobe!
            </h1>
            <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">
              Nice to see you again.
            </p>
          </div>
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center justify-between gap-[10px]">
              <button
                className="w-[159px] h-[50px] gap-[10px] px-[20px] bg-white border border-[#111827]/10 text-black rounded-[14px] text-[15px] font-medium flex items-center justify-center shadow-md transition-shadow"
              >
                <img
                  src="/ActivityLog.png"
                  alt=""
                  className="w-[20px] h-[20px]"
                />
                Activity Log
              </button>
              <button
                className="w-[159px] h-[50px] gap-[4px] px-[16px] text-white rounded-[14px] text-[16px] font-medium flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow:
                    'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                }}
              >
                <img src="/NewTask.png" alt="" className="w-[20px] h-[20px]" />
                New Task
              </button>
            </div>
            <div className="w-[1px] h-[30px] border-l border-[#111827]/10"></div>
            <div className="flex items-center justify-between gap-[15px]">
              <div className="flex items-center justify-between gap-[10px]">
                <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                  <img
                    src="/bell.png"
                    alt="Notifications"
                    className="w-[24px] h-[24px]"
                  />
                </button>
                <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                  <img
                    src="/setting.png"
                    alt="Settings"
                    className="w-[24px] h-[24px]"
                  />
                </button>
              </div>
              <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/profile.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>{/* Content */}
        <div className="flex-1 px-8 py-6 overflow-y-auto">
          {activeNav === 'home' && <HomePage mode={mode} hideBalance={hideBalance} setHideBalance={setHideBalance} setActiveNav={setActiveNav} setAiOpen={setAiOpen} setShowConnectModal={setShowConnectModal} />}
          {activeNav === 'analytics' && <AnalyticsPage mode={mode} />}
          {activeNav === 'transactions' && <TransactionsPage />}
          {activeNav === 'pool' && <PoolAccountsPage mode={mode} />}
          {activeNav === 'cards' && <CardsPage />}
          {activeNav === 'users' && <UsersPage />}
          {activeNav === 'approvals' && <ApprovalsPage />}
          {activeNav === 'budgeting' && <BudgetingPage mode={mode} />}
          {activeNav === 'goals' && <GoalsPage />}
          {activeNav === 'accounting' && <AccountingPage />}
          {activeNav === 'integrations' && <IntegrationsPage onConnect={() => setShowConnectModal(true)} />}
          {activeNav === 'billpay' && <BillPayPage />}
          {activeNav === 'invoices' && <InvoicesPage mode={mode} />}
          {activeNav === 'reimburse' && <ReimbursementsPage />}
          {activeNav === 'invest' && <InvestmentsPage />}
          {activeNav === 'insights' && <InsightsPage />}
          {activeNav === 'rewards' && <RewardsPage />}
        </div>
      </main>

      {aiOpen && <AiAssistant onClose={() => setAiOpen(false)} mode={mode} />}
      {showConnectModal && <ConnectModal onClose={() => setShowConnectModal(false)} />}
    </div>
  );
}

// ============ AI ASSISTANT ============
function AiAssistant({ onClose, mode }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: mode === 'business'
      ? "Hi! I'm Kira, your AI CFO. Ask me about your cash flow, vendor spend, runway, anomalies — anything." 
      : "Hey! I'm Kira, your AI money coach. Ask me about your spending, savings goals, or how to optimize your budget."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const sys = mode === 'business'
        ? `You are Kira, an AI CFO assistant. The company has $10,000 AED balance, 22 active cards, top spend categories are Deliveroo (AED 312), Enoc fuel (AED 245), Cars Taxi (AED 180), Dubai Taxi (AED 144), Arabia Taxi (AED 100). Connected: Shopify ($45,200 MTD revenue), WooCommerce ($12,800), Stripe, QuickBooks. 22 employees. 5 pending approvals worth AED 4,200. Be concise, data-driven, actionable. Use specific numbers. 2-4 sentences max unless asked for detail.`
        : `You are Kira, an AI personal finance coach. The user has $24,580 across accounts, spent $3,240 this month vs $3,800 budget. Top categories: rent $1,200, groceries $480, dining $320, transport $180. Has $8,500/$15,000 emergency fund goal, $2,400/$10,000 vacation fund. Investments worth $42,000 (+8.2% YTD). Be warm, encouraging, specific with numbers. 2-4 sentences.`;
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: sys,
          messages: [...messages.filter(m => !m.loading), { role: "user", content: msg }].map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
        })
      });
      const data = await response.json();
      const reply = data.content.map(b => b.text || '').join('');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, something glitched. Try again?" }]);
    }
    setLoading(false);
  };

  const suggestions = mode === 'business'
    ? ["Where's our biggest spending leak?", "How's our runway looking?", "Find duplicate subscriptions", "Compare this month vs last"]
    : ["Where am I overspending?", "How much can I save next month?", "Should I invest more?", "Predict my month-end balance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="flex flex-col w-full h-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-[#eff6ff] via-[#eff6ff] to-[#dbeafe]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center shadow-lg w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-[#3b82f6]/30 pulse-glow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold font-display text-slate-900">Kira AI</div>
              <div className="text-[11px] text-[#2563eb] font-medium">Your AI {mode === 'business' ? 'CFO' : 'money coach'}</div>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/60"><X className="w-4 h-4 text-slate-500" /></button>
        </div>

        <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} fade-up`}>
              {m.role === 'assistant' ? (
                <div className="max-w-[90%] flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="text-sm text-slate-800 leading-relaxed bg-slate-50 px-3.5 py-2.5 rounded-2xl rounded-tl-sm">{m.content}</div>
                </div>
              ) : (
                <div className="max-w-[85%] px-3.5 py-2.5 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white text-sm rounded-2xl rounded-tr-sm">{m.content}</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5">
              <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]"><Loader2 className="w-3.5 h-3.5 text-white animate-spin" /></div>
              <div className="text-sm text-slate-400 px-3.5 py-2.5">Thinking…</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-5 pb-2 flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => { setInput(s); setTimeout(send, 50); }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-[#dbeafe] text-slate-700 rounded-full transition">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-end gap-2 p-2 bg-slate-50 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-300">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
              rows={1}
              placeholder="Ask anything…"
              className="flex-1 bg-transparent text-sm placeholder-slate-400 focus:outline-none px-2 py-1.5 resize-none max-h-28"
            />
            <button onClick={send} disabled={!input.trim() || loading} className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] disabled:opacity-40">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ HOME — ROUTER ============
function HomePage(props) {
  return props.mode === 'business'
    ? <BusinessHome {...props} />
    : <PersonalHome {...props} />;
}

// ============ BUSINESS HOME — command center, dense, operational ============
function BusinessHome({ hideBalance, setHideBalance, setActiveNav, setAiOpen, setShowConnectModal }) {
  return (
    <div className="mx-auto space-y-6 max-w-7xl fade-up">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#dbeafe] text-[#1d4ed8] rounded-md">Business · Acme Inc.</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#d1fae5] text-emerald-700 rounded-md flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#ecfdf5]0 animate-pulse" /> All systems
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-900">Good morning, Kobe</h1>
          <p className="mt-1 text-sm text-slate-600">Here's the state of your business this Tuesday.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">As of</span>
          <span className="text-xs font-medium text-slate-700">{new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Hero — bold gradient command card */}
      <div className="relative p-8 overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-[#3b82f6]/30">
        <div className="absolute rounded-full -top-20 -right-20 w-72 h-72 bg-white/10 blur-3xl" />
        <div className="absolute w-64 h-64 rounded-full -bottom-20 -left-20 bg-pink-300/20 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="biz-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#biz-grid)" />
        </svg>

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/80">Total company</span>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-white/60 hover:text-white">
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-5xl font-bold tracking-tight text-white font-display">
              {hideBalance ? '••••••••' : '$48,290.50'}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+12.4%</span>
                <span className="text-xs text-white/70">this month</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="text-xs text-white/80">Across 4 pool accounts</div>
              <div className="w-px h-4 bg-white/20" />
              <div className="text-xs text-white/80">14.2 month runway</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => setAiOpen(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white border bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              AI insights
            </button>
            <button onClick={() => setActiveNav('transactions')} className="px-4 py-2 text-xs font-medium text-white border bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border-white/15">
              View activity
            </button>
          </div>
        </div>

        <div className="relative h-20 mt-6">
          <svg className="w-full h-full" viewBox="0 0 800 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="biz-spark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 60 Q 80 45 120 50 T 240 35 T 360 40 T 480 25 T 600 20 T 720 15 L 800 18 L 800 80 L 0 80 Z" fill="url(#biz-spark)" />
            <path d="M 0 60 Q 80 45 120 50 T 240 35 T 360 40 T 480 25 T 600 20 T 720 15 L 800 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Operational stat row — focus on financial health */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Revenue (MTD)" value="$58,420" change="+18.2%" trend="up" color="from-emerald-500 to-teal-500" />
        <StatCard label="Expenses (MTD)" value="$23,180" change="-4.1%" trend="down" color="from-amber-500 to-orange-500" />
        <StatCard label="Burn rate" value="$11,200" change="-2.8%" trend="down" color="from-indigo-500 to-purple-500" />
        <StatCard label="Pending approvals" value="5" change="+2" trend="up" color="from-pink-500 to-rose-500" />
      </div>

      {/* Business quick actions */}
      <div className="p-5 border bg-white/60 backdrop-blur-md border-white/80 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2563eb]" />
            <h3 className="font-bold font-display text-slate-900">Quick actions</h3>
          </div>
          <span className="text-xs text-slate-500">Most used by your team</span>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {[
            { icon: Send, label: 'Send money', sub: 'Wire / ACH', color: 'from-indigo-500 to-purple-600' },
            { icon: CreditCard, label: 'Issue card', sub: 'Virtual / physical', color: 'from-pink-500 to-rose-500' },
            { icon: Receipt, label: 'Pay bill', sub: 'Vendors', color: 'from-amber-500 to-orange-500' },
            { icon: FileText, label: 'Invoice', sub: 'Create new', color: 'from-emerald-500 to-teal-500' },
            { icon: Repeat, label: 'Reimburse', sub: 'Employee', color: 'from-cyan-500 to-blue-500' },
            { icon: Layers, label: 'Connect', sub: 'Integration', color: 'from-violet-500 to-fuchsia-500', onClick: () => setShowConnectModal(true) },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} onClick={a.onClick} className="relative p-4 text-left transition bg-white border group rounded-2xl border-slate-100 hover:border-[#bfdbfe] hover:shadow-lg hover:shadow-[#3b82f6]/10">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md mb-3`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-xs font-semibold text-slate-900">{a.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{a.sub}</div>
                <ArrowUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b82f6] transition" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Two column — chart + transactions on left, AI + ops cards on right */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <SpendingChart />
          <RecentTransactions mode="business" setActiveNav={setActiveNav} />
        </div>
        <div className="space-y-5">
          <AiBrainCard onClick={() => setAiOpen(true)} />
          <ApprovalsQueueCard setActiveNav={setActiveNav} />
          <ConnectedAccountsCard onConnect={() => setShowConnectModal(true)} mode="business" />
        </div>
      </div>

      {/* Business-specific bottom row: vendors + team spend */}
      <div className="grid grid-cols-2 gap-5">
        <TopVendorsCard />
        <TeamSpendLeaderboard />
      </div>
    </div>
  );
}

// ============ PERSONAL HOME — calm, lifestyle, story-driven ============
function PersonalHome({ hideBalance, setHideBalance, setActiveNav, setAiOpen, setShowConnectModal }) {
  const safeToSpend = 1840;
  const monthlyBudget = 3800;
  const monthlySpent = 3240;
  const pct = (monthlySpent / monthlyBudget) * 100;

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-up">
      {/* Warm greeting */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] text-amber-800 rounded-md">Personal</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-slate-900">
            Hey Kobe <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">You're on track this month. Here's what's happening with your money.</p>
        </div>
      </div>

      {/* Personal hero — split layout: balance + "safe to spend" gauge */}
      <div className="grid grid-cols-5 gap-5">
        {/* Net worth card — warmer gradient, less corporate */}
        <div className="relative col-span-3 overflow-hidden shadow-xl rounded-3xl p-7"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
          <div className="absolute w-64 h-64 rounded-full -top-16 -right-16 bg-yellow-200/20 blur-3xl" />
          <div className="absolute w-56 h-56 rounded-full -bottom-20 -left-10 bg-pink-300/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs font-semibold tracking-wider uppercase text-white/90">Your net worth</span>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-white/70 hover:text-white">
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="mb-2 text-5xl font-bold tracking-tight text-white font-display">
              {hideBalance ? '••••••••' : '$24,580.32'}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full">
                <TrendingUp className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">+$910 this month</span>
              </div>
              <span className="text-xs text-white/80">Saving pace: <strong className="text-white">38%</strong></span>
            </div>

            {/* Asset breakdown — segmented bar */}
            <div className="mb-2">
              <div className="flex h-2 gap-1 overflow-hidden rounded-full">
                <div className="rounded-l-full bg-white/95" style={{ width: '34%' }} />
                <div className="bg-white/70" style={{ width: '52%' }} />
                <div className="rounded-r-full bg-white/40" style={{ width: '14%' }} />
              </div>
              <div className="flex items-center gap-4 mt-2.5 text-[11px] text-white">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-white rounded-full" /> Cash <strong className="ml-1">$8.4K</strong></span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/70" /> Invested <strong className="ml-1">$12.8K</strong></span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white/40" /> Savings <strong className="ml-1">$3.3K</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Safe to spend ring */}
        <div className="flex flex-col col-span-2 p-6 border border-white bg-white/80 backdrop-blur-md rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">Safe to spend</span>
            <span className="text-[10px] text-slate-400">12 days left</span>
          </div>
          <div className="flex items-center justify-center flex-1 my-2">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#safeSpendGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 264} 264`} />
                <defs>
                  <linearGradient id="safeSpendGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Today</div>
                <div className="text-3xl font-bold font-display text-slate-900">${safeToSpend}</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">✓ on track</div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 text-center leading-relaxed">
            Spent <strong className="text-slate-900">${monthlySpent.toLocaleString()}</strong> of ${monthlyBudget.toLocaleString()} budget
          </div>
        </div>
      </div>

      {/* Personal stat row — life-oriented metrics */}
      <div className="grid grid-cols-4 gap-4">
        <PersonalStat icon={Wallet} label="Cash on hand" value="$8,420" sub="Across 2 accounts" color="from-sky-400 to-blue-500" />
        <PersonalStat icon={TrendingUp} label="Investments" value="$42,180" sub="+8.2% YTD" color="from-emerald-400 to-teal-500" up />
        <PersonalStat icon={Target} label="Savings rate" value="38%" sub="Last 30 days" color="from-violet-400 to-fuchsia-500" up />
        <PersonalStat icon={CreditCard} label="Credit utilization" value="14%" sub="Healthy" color="from-amber-400 to-orange-500" />
      </div>

      {/* Story row: Goals + Subscriptions side by side */}
      <div className="grid grid-cols-2 gap-5">
        <GoalsProgressCard setActiveNav={setActiveNav} />
        <SubscriptionsRadarCard />
      </div>

      {/* AI coach + activity */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <RecentTransactions mode="personal" setActiveNav={setActiveNav} />
        </div>
        <div className="space-y-5">
          <PersonalAiCoachCard onClick={() => setAiOpen(true)} />
          <ConnectedAccountsCard onConnect={() => setShowConnectModal(true)} mode="personal" />
        </div>
      </div>

      {/* Bottom row: spending personality + cash flow trend */}
      <div className="grid grid-cols-3 gap-5">
        <SpendingPersonalityCard />
        <div className="col-span-2">
          <PersonalCashFlowMini />
        </div>
      </div>
    </div>
  );
}

// ============ BUSINESS-ONLY CARDS ============
function ApprovalsQueueCard({ setActiveNav }) {
  const items = [
    { who: 'Sarah K.', what: 'Card request · Marketing', amt: 1200, time: '2h ago' },
    { who: 'Marcus L.', what: 'Fund request · Travel', amt: 850, time: '5h ago' },
    { who: 'Priya R.', what: 'Reimbursement · Client dinner', amt: 320, time: '1d ago' },
  ];
  return (
    <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold font-display text-slate-900">Awaiting your approval</h3>
          <span className="px-1.5 py-0.5 bg-[#fee2e2] text-rose-700 text-[10px] font-bold rounded-md">5</span>
        </div>
        <button onClick={() => setActiveNav('approvals')} className="text-xs font-semibold text-[#2563eb]">All →</button>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2.5 p-2 -mx-2 rounded-xl hover:bg-slate-50">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              {it.who.split(' ').map(s => s[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-slate-900">{it.who}</div>
              <div className="text-[10px] text-slate-500 truncate">{it.what}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">${it.amt}</div>
              <div className="text-[10px] text-slate-400">{it.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-1.5 text-[11px] font-semibold bg-[#ecfdf5]0 hover:bg-emerald-600 text-white rounded-lg">Approve all</button>
        <button className="flex-1 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg">Review</button>
      </div>
    </div>
  );
}

function TopVendorsCard() {
  const vendors = [
    { name: 'AWS', cat: 'Infrastructure', amt: 4820, pct: 22, color: 'bg-[#fffbeb]0' },
    { name: 'Google Workspace', cat: 'Software', amt: 1240, pct: 12, color: 'bg-blue-500' },
    { name: 'WeWork', cat: 'Office', amt: 2400, pct: 18, color: 'bg-[#eff6ff]0' },
    { name: 'Slack', cat: 'Software', amt: 680, pct: 7, color: 'bg-[#eff6ff]0' },
    { name: 'LinkedIn Ads', cat: 'Marketing', amt: 920, pct: 9, color: 'bg-[#eff6ff]0' },
  ];
  return (
    <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold font-display text-slate-900">Top vendors this month</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Where the money is going</p>
        </div>
        <button className="text-xs font-semibold text-[#2563eb]">Details →</button>
      </div>
      <div className="space-y-3">
        {vendors.map((v, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${v.color}`} />
                <span className="text-sm font-semibold text-slate-900">{v.name}</span>
                <span className="text-[10px] text-slate-500">· {v.cat}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">${v.amt.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${v.color} rounded-full`} style={{ width: `${v.pct * 3}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSpendLeaderboard() {
  const team = [
    { name: 'Sarah K.', dept: 'Marketing', amt: 8420, limit: 12000, color: 'from-indigo-500 to-violet-600' },
    { name: 'Marcus L.', dept: 'Sales', amt: 4280, limit: 8000, color: 'from-amber-400 to-pink-500' },
    { name: 'Priya R.', dept: 'Operations', amt: 2140, limit: 5000, color: 'from-emerald-500 to-teal-600' },
    { name: 'Alex T.', dept: 'Engineering', amt: 1240, limit: 3000, color: 'from-rose-500 to-orange-500' },
  ];
  return (
    <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold font-display text-slate-900">Team spend</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Who's spending what</p>
        </div>
        <button className="text-xs font-semibold text-[#2563eb]">All members →</button>
      </div>
      <div className="space-y-3">
        {team.map((m, i) => {
          const pct = (m.amt / m.limit) * 100;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-xs font-bold`}>
                {m.name.split(' ').map(s => s[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-900">{m.name}</span>
                    <span className="text-[10px] text-slate-500 ml-1.5">· {m.dept}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">${m.amt.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal"> / ${(m.limit/1000)}K</span></span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${m.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ PERSONAL-ONLY CARDS ============
function PersonalStat({ icon: Icon, label, value, sub, color, up }) {
  return (
    <div className="p-4 border border-white bg-white/80 backdrop-blur-md rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {up && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
      </div>
      <div className="text-[11px] text-slate-500 font-medium">{label}</div>
      <div className="font-display text-xl font-bold text-slate-900 mt-0.5">{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function GoalsProgressCard({ setActiveNav }) {
  const goals = [
    { name: 'Emergency fund', emoji: '🛡️', current: 8500, target: 15000, color: 'from-emerald-400 to-teal-500', tagline: '6 months expenses' },
    { name: 'Tokyo trip', emoji: '🗼', current: 2400, target: 10000, color: 'from-pink-400 to-rose-500', tagline: 'Cherry blossom 2027' },
    { name: 'New laptop', emoji: '💻', current: 1800, target: 3500, color: 'from-violet-400 to-fuchsia-500', tagline: 'M-series Pro' },
  ];
  return (
    <div className="p-6 border border-white bg-white/80 backdrop-blur-md rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-rose-500" />
            Your goals
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">What you're saving for</p>
        </div>
        <button onClick={() => setActiveNav('goals')} className="text-xs font-semibold text-[#2563eb]">All →</button>
      </div>
      <div className="space-y-4">
        {goals.map((g, i) => {
          const pct = (g.current / g.target) * 100;
          return (
            <div key={i}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{g.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{g.name}</span>
                    <span className="text-[11px] font-bold text-slate-700">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{g.tagline}</div>
                </div>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full bg-gradient-to-r ${g.color} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span>${g.current.toLocaleString()} of ${g.target.toLocaleString()}</span>
                <span>${(g.target - g.current).toLocaleString()} to go</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubscriptionsRadarCard() {
  const subs = [
    { name: 'Netflix', cost: 15.99, color: 'bg-[#fef2f2]0', emoji: '🎬' },
    { name: 'Spotify', cost: 9.99, color: 'bg-[#ecfdf5]0', emoji: '🎵' },
    { name: 'iCloud+', cost: 2.99, color: 'bg-sky-500', emoji: '☁️' },
    { name: 'Notion', cost: 8.00, color: 'bg-slate-700', emoji: '📝' },
    { name: 'Audible', cost: 14.95, color: 'bg-[#fffbeb]0', emoji: '🎧' },
    { name: 'NYT', cost: 4.00, color: 'bg-slate-800', emoji: '📰' },
  ];
  const total = subs.reduce((s, x) => s + x.cost, 0);
  return (
    <div className="p-6 border border-white bg-white/80 backdrop-blur-md rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
            <Repeat className="w-4 h-4 text-[#3b82f6]" />
            Subscriptions
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Detected recurring charges</p>
        </div>
        <span className="px-2 py-1 text-xs font-semibold rounded-md text-amber-700 bg-[#fffbeb]">Review 2 unused</span>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold font-display text-slate-900">${total.toFixed(2)}</span>
        <span className="text-xs text-slate-500">/month · <strong>${(total * 12).toFixed(0)}/yr</strong></span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {subs.map((s, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <div className="text-base">{s.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-slate-900 truncate">{s.name}</div>
              <div className="text-[10px] text-slate-500">${s.cost}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalAiCoachCard({ onClick }) {
  return (
    <button onClick={onClick} className="relative w-full p-5 overflow-hidden text-left rounded-3xl group"
      style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
      <div className="absolute w-40 h-40 rounded-full -top-12 -right-12 bg-white/40 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center w-8 h-8 shadow-md rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold font-display text-slate-900">Kira coach</span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-slate-700">
          You're spending <strong>26% less on dining</strong> than last month. At this pace you'll hit your Tokyo goal <strong>2 months early</strong>.
        </p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 backdrop-blur-md rounded-full text-[11px] text-slate-900 font-semibold">
          Chat with Kira <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </button>
  );
}

function SpendingPersonalityCard() {
  return (
    <div className="p-5 border border-white bg-white/80 backdrop-blur-md rounded-3xl">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold font-display text-slate-900">Your spending personality</h3>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          🦊
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">The Mindful Explorer</div>
          <div className="text-[10px] text-slate-500">Updated this week</div>
        </div>
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
        You value experiences over things. <strong>62%</strong> of discretionary spend goes to travel, dining, and books.
      </p>
      <div className="space-y-1.5">
        {[
          { label: 'Experiences', pct: 62, color: 'bg-orange-400' },
          { label: 'Necessities', pct: 28, color: 'bg-sky-400' },
          { label: 'Things', pct: 10, color: 'bg-violet-400' },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
            <span className="text-[10px] text-slate-700 flex-1">{t.label}</span>
            <span className="text-[10px] font-bold text-slate-900">{t.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalCashFlowMini() {
  const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
  const inflow = [1200, 0, 0, 5200, 200, 0, 0, 5200];
  const outflow = [-820, -640, -480, -1240, -380, -560, -420, -980];
  const max = Math.max(...inflow, ...outflow.map(Math.abs));

  return (
    <div className="p-5 border border-white bg-white/80 backdrop-blur-md rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold font-display text-slate-900">Cash flow rhythm</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Income vs spending · last 8 weeks</p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ecfdf5]0" /> In</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> Out</span>
        </div>
      </div>
      <div className="flex items-center h-32 gap-2">
        {weeks.map((w, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex flex-col items-stretch gap-0.5">
              <div className="rounded-md bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${(inflow[i] / max) * 56}px` }} />
              <div className="rounded-md bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8]" style={{ height: `${(Math.abs(outflow[i]) / max) * 56}px` }} />
            </div>
            <div className="text-[9px] text-slate-500 mt-1">{w}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 mt-3 text-xs border-t border-slate-100">
        <div>
          <span className="text-slate-500">Net this month: </span>
          <span className="font-bold text-emerald-700">+$8,940</span>
        </div>
        <span className="text-[10px] text-slate-500">Up 22% vs last month</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, trend, color }) {
  const isUp = trend === 'up';
  return (
    <div className="relative p-4 overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${color} rounded-full blur-2xl opacity-20`} />
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold font-display text-slate-900">{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ${isUp ? 'text-emerald-700' : 'text-rose-700'}`}>
        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
  );
}

function SpendingChart() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = [42, 58, 48, 65, 52, 78, 62, 70, 58, 75, 82, 60];
  const max = Math.max(...data);
  return (
    <div className="p-6 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold font-display text-slate-900">Spend traffic</h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly outflow · last 12 months</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          {['12M','3M','30D','7D'].map((t,i)=>(
            <button key={t} className={`px-2.5 py-1 text-[11px] font-medium rounded-md ${i===0?'bg-white text-slate-900 shadow-sm':'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2 h-44">
        {data.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
            <div className="w-full flex flex-col items-stretch gap-0.5 h-full justify-end">
              <div className="rounded-md bg-slate-100" style={{ height: `${((max-v)/max)*100*0.4}%` }} />
              <div className="transition rounded-md bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] group-hover:shadow-lg group-hover:shadow-[#3b82f6]/30" style={{ height: `${(v/max)*100}%` }} />
            </div>
            <div className="text-[10px] text-slate-500">{months[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions({ mode, setActiveNav }) {
  const txns = mode === 'business' ? [
    { name: 'Deliveroo DMCC', cat: 'Food & beverage', amt: -312.40, date: 'Today', icon: '🍔', user: 'Sarah K.' },
    { name: 'Shopify payout', cat: 'Revenue', amt: 4820.00, date: 'Today', icon: '🛍️', user: 'Auto' },
    { name: 'ENOC fuel', cat: 'Transport', amt: -245.00, date: 'Yesterday', icon: '⛽', user: 'Marcus L.' },
    { name: 'AWS', cat: 'Software', amt: -890.20, date: 'Yesterday', icon: '☁️', user: 'Auto' },
    { name: 'Stripe payout', cat: 'Revenue', amt: 8240.50, date: 'Mon', icon: '💳', user: 'Auto' },
    { name: 'WeWork', cat: 'Office', amt: -2400.00, date: 'Mon', icon: '🏢', user: 'Admin' },
  ] : [
    { name: 'Whole Foods', cat: 'Groceries', amt: -84.20, date: 'Today', icon: '🛒', user: 'Card ••4521' },
    { name: 'Salary deposit', cat: 'Income', amt: 5200.00, date: 'Today', icon: '💼', user: 'Direct deposit' },
    { name: 'Uber', cat: 'Transport', amt: -18.50, date: 'Yesterday', icon: '🚗', user: 'Card ••4521' },
    { name: 'Netflix', cat: 'Subscriptions', amt: -15.99, date: 'Yesterday', icon: '🎬', user: 'Card ••4521' },
    { name: 'Spotify', cat: 'Subscriptions', amt: -9.99, date: 'Mon', icon: '🎵', user: 'Card ••4521' },
    { name: 'Coffee', cat: 'Dining', amt: -6.40, date: 'Mon', icon: '☕', user: 'Card ••4521' },
  ];
  return (
    <div className="p-6 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold font-display text-slate-900">Recent activity</h3>
        <button onClick={() => setActiveNav('transactions')} className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
          View all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-1">
        {txns.map((t, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition text-left">
            <div className="flex items-center justify-center w-10 h-10 text-lg rounded-xl bg-slate-100">{t.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-slate-900">{t.name}</div>
              <div className="text-[11px] text-slate-500">{t.cat} · {t.user}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${t.amt > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {t.amt > 0 ? '+' : ''}${Math.abs(t.amt).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400">{t.date}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AiBrainCard({ onClick }) {
  return (
    <button onClick={onClick} className="relative w-full p-5 overflow-hidden text-left bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] rounded-3xl group">
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 300 300">
        {[...Array(50)].map((_, i) => {
          const x = Math.random() * 300, y = Math.random() * 300, r = Math.random() * 2 + 1;
          const c = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][i % 4];
          return <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={Math.random() * 0.8 + 0.2} />;
        })}
        {[...Array(30)].map((_, i) => (
          <line key={i} x1={Math.random()*300} y1={Math.random()*300} x2={Math.random()*300} y2={Math.random()*300} stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
        ))}
      </svg>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center justify-center rounded-lg w-7 h-7 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white font-display">The Brain</span>
        </div>
        <p className="text-xs text-indigo-200">Kira learns your patterns and surfaces insights you'd miss</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] text-white font-medium">
          Open assistant <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </button>
  );
}

function ConnectedAccountsCard({ onConnect, mode }) {
  const accounts = mode === 'business' ? [
    { name: 'Chase Business', sub: 'Operating · ••4521', bal: 28420.50, logo: '🏦', color: 'bg-blue-500' },
    { name: 'Shopify', sub: 'POS · Connected', bal: 12840.00, logo: '🛍️', color: 'bg-[#ecfdf5]0' },
    { name: 'Stripe', sub: 'Payouts pending', bal: 4820.30, logo: '💳', color: 'bg-[#eff6ff]0' },
    { name: 'WooCommerce', sub: '8 stores', bal: 2210.20, logo: '🛒', color: 'bg-[#eff6ff]0' },
  ] : [
    { name: 'Chase Checking', sub: '••4521', bal: 8420.50, logo: '🏦', color: 'bg-blue-500' },
    { name: 'Ally Savings', sub: '••7782', bal: 12840.00, logo: '💰', color: 'bg-[#ecfdf5]0' },
    { name: 'Robinhood', sub: 'Investments', bal: 3320.30, logo: '📈', color: 'bg-[#fffbeb]0' },
  ];
  return (
    <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold font-display text-slate-900">Connected accounts</h3>
        <button onClick={onConnect} className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {accounts.map((a, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2 transition rounded-xl hover:bg-slate-50">
            <div className="text-2xl">{a.logo}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-slate-900">{a.name}</div>
              <div className="text-[10px] text-slate-500">{a.sub}</div>
            </div>
            <div className="text-xs font-bold text-slate-900">${a.bal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ANALYTICS ============
function AnalyticsPage({ mode }) {
  return (
    <div className="mx-auto space-y-5 max-w-7xl fade-up">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">Deep dive on your money flows</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"><Filter className="w-3.5 h-3.5" /> Filters</button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"><Download className="w-3.5 h-3.5" /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label={mode === 'business' ? 'Company balance' : 'Total balance'} value="$48,290" change="+12.4%" trend="up" color="from-indigo-500 to-purple-500" />
        <StatCard label="Live users" value="22" change="+3" trend="up" color="from-emerald-500 to-teal-500" />
        <StatCard label="Active cards" value="22" change="+5" trend="up" color="from-pink-500 to-rose-500" />
        <StatCard label="Pool accounts" value="4" change="+1" trend="up" color="from-amber-500 to-orange-500" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <DonutCard title="Top 10 merchants" total="$981.40" />
        <DonutCard title="Spend by category" total="$3,240.80" alt />
      </div>

      <SpendingChart />

      <div className="grid grid-cols-3 gap-5">
        <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
          <h3 className="mb-3 font-bold font-display text-slate-900">Card requests</h3>
          <div className="text-4xl font-bold font-display text-slate-900">12</div>
          <div className="mt-1 text-xs text-slate-500">5 awaiting approval</div>
          <button className="w-full py-2 mt-3 text-xs font-semibold text-[#1d4ed8] rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe]">Review →</button>
        </div>
        <div className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
          <h3 className="mb-3 font-bold font-display text-slate-900">Fund requests</h3>
          <div className="text-4xl font-bold font-display text-slate-900">8</div>
          <div className="mt-1 text-xs text-slate-500">$4,200 total pending</div>
          <button className="w-full py-2 mt-3 text-xs font-semibold text-[#1d4ed8] rounded-lg bg-[#eff6ff] hover:bg-[#dbeafe]">Review →</button>
        </div>
        <div className="p-5 text-white bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-3xl">
          <h3 className="font-display font-bold mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Anomaly detected</h3>
          <div className="text-sm">Software spend up <strong>42%</strong> vs avg. AWS bill spiked Tuesday.</div>
          <button className="w-full py-2 mt-3 text-xs font-semibold text-white rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30">Investigate →</button>
        </div>
      </div>
    </div>
  );
}

function DonutCard({ title, total, alt }) {
  const segs = alt ? [
    { name: 'Office & Software', val: 38, color: '#3b82f6' },
    { name: 'Marketing', val: 24, color: '#60a5fa' },
    { name: 'Transport', val: 16, color: '#3b82f6' },
    { name: 'Food & Beverage', val: 12, color: '#60a5fa' },
    { name: 'Travel', val: 10, color: '#3b82f6' },
  ] : [
    { name: 'Deliveroo DMCC', val: 32, color: '#3b82f6' },
    { name: 'ENOC', val: 22, color: '#60a5fa' },
    { name: 'Cars Taxi', val: 18, color: '#3b82f6' },
    { name: 'Dubai Taxi', val: 12, color: '#60a5fa' },
    { name: 'Arabia Taxi', val: 10, color: '#3b82f6' },
    { name: 'Smart Dubai', val: 6, color: '#93c5fd' },
  ];
  const total100 = segs.reduce((s, x) => s + x.val, 0);
  let cumAngle = -90;
  return (
    <div className="p-6 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold font-display text-slate-900">{title}</h3>
        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {segs.map((s, i) => {
              const startAngle = cumAngle;
              const sweep = (s.val / total100) * 360;
              cumAngle += sweep;
              const start = polarToCartesian(70, 70, 50, startAngle);
              const end = polarToCartesian(70, 70, 50, startAngle + sweep);
              const startInner = polarToCartesian(70, 70, 30, startAngle);
              const endInner = polarToCartesian(70, 70, 30, startAngle + sweep);
              const largeArc = sweep > 180 ? 1 : 0;
              return (
                <path key={i} d={`M ${start.x} ${start.y} A 50 50 0 ${largeArc} 1 ${end.x} ${end.y} L ${endInner.x} ${endInner.y} A 30 30 0 ${largeArc} 0 ${startInner.x} ${startInner.y} Z`} fill={s.color} />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[10px] text-slate-500 font-medium">Total</div>
            <div className="text-sm font-bold font-display text-slate-900">{total}</div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {segs.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 truncate text-slate-700">{s.name}</span>
              <span className="font-medium text-slate-500">{s.val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// ============ TRANSACTIONS ============
function TransactionsPage() {
  const [filter, setFilter] = useState('all');
  const txns = [
    { name: 'Deliveroo DMCC', cat: 'Food & beverage', amt: -312.40, date: 'Dec 14, 2:14 PM', icon: '🍔', user: 'Sarah K.', card: '••4521', status: 'completed' },
    { name: 'Shopify payout', cat: 'Revenue', amt: 4820.00, date: 'Dec 14, 10:32 AM', icon: '🛍️', user: 'Auto', card: '—', status: 'completed' },
    { name: 'ENOC fuel', cat: 'Transport', amt: -245.00, date: 'Dec 13, 4:18 PM', icon: '⛽', user: 'Marcus L.', card: '••8843', status: 'completed' },
    { name: 'AWS', cat: 'Software', amt: -890.20, date: 'Dec 13, 12:00 AM', icon: '☁️', user: 'Auto', card: '••0012', status: 'completed' },
    { name: 'Stripe payout', cat: 'Revenue', amt: 8240.50, date: 'Dec 11, 6:00 AM', icon: '💳', user: 'Auto', card: '—', status: 'completed' },
    { name: 'WeWork', cat: 'Office', amt: -2400.00, date: 'Dec 11, 9:15 AM', icon: '🏢', user: 'Admin', card: '••4521', status: 'completed' },
    { name: 'Office printer', cat: 'Office', amt: -340.00, date: 'Dec 10, 3:42 PM', icon: '🖨️', user: 'Lisa P.', card: '••2241', status: 'pending' },
    { name: 'Figma', cat: 'Software', amt: -75.00, date: 'Dec 10, 8:00 AM', icon: '🎨', user: 'Design Team', card: '••0012', status: 'completed' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Transactions</h1>
          <p className="mt-1 text-sm text-slate-600">All your money movement, searchable and filterable</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700"><Filter className="w-3.5 h-3.5" /> Filters</button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700"><Download className="w-3.5 h-3.5" /> Export CSV</button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'income', 'expenses', 'pending', 'flagged'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition capitalize ${filter === f ? 'bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">Merchant</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Card</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t, i) => (
              <tr key={i} className="border-b cursor-pointer border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-lg rounded-lg w-9 h-9 bg-slate-100">{t.icon}</div>
                    <div className="text-sm font-medium text-slate-900">{t.name}</div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-600">{t.cat}</td>
                <td className="px-5 py-3.5 text-xs text-slate-600">{t.user}</td>
                <td className="px-5 py-3.5 text-xs text-slate-600 font-mono">{t.card}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500">{t.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                    t.status === 'completed' ? 'bg-[#ecfdf5] text-emerald-700' : 'bg-[#fffbeb] text-amber-700'
                  }`}>
                    {t.status === 'completed' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {t.status}
                  </span>
                </td>
                <td className={`px-5 py-3.5 text-right text-sm font-bold ${t.amt > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {t.amt > 0 ? '+' : '−'}${Math.abs(t.amt).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ POOL ACCOUNTS ============
function PoolAccountsPage({ mode }) {
  const pools = mode === 'business' ? [
    { name: 'Operating', balance: 28420.50, alloc: 'Daily ops', cards: 8, color: 'from-indigo-500 to-purple-600', txns: 142 },
    { name: 'Marketing', balance: 12840.00, alloc: 'Q4 campaigns', cards: 4, color: 'from-pink-500 to-rose-500', txns: 38 },
    { name: 'Travel & Events', balance: 4820.30, alloc: 'Team trips', cards: 6, color: 'from-amber-500 to-orange-500', txns: 24 },
    { name: 'Reserve', balance: 24210.00, alloc: 'Emergency fund', cards: 0, color: 'from-emerald-500 to-teal-500', txns: 2 },
  ] : [
    { name: 'Daily spending', balance: 2420.50, alloc: 'Bills & groceries', cards: 2, color: 'from-indigo-500 to-purple-600', txns: 42 },
    { name: 'Emergency fund', balance: 8840.00, alloc: '3 months expenses', cards: 0, color: 'from-pink-500 to-rose-500', txns: 0 },
    { name: 'Vacation', balance: 2400.00, alloc: 'Japan trip 2026', cards: 0, color: 'from-amber-500 to-orange-500', txns: 0 },
    { name: 'Investments', balance: 10920.30, alloc: 'Robinhood', cards: 0, color: 'from-emerald-500 to-teal-500', txns: 6 },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">{mode === 'business' ? 'Pool accounts' : 'Accounts'}</h1>
          <p className="mt-1 text-sm text-slate-600">{mode === 'business' ? 'Allocate budgets, control spend per team' : 'Spaces for different goals and money jobs'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> New pool
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {pools.map((p, i) => (
          <div key={i} className="relative p-6 overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
            <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${p.color} rounded-full blur-3xl opacity-15`} />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{p.alloc}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-bold font-display text-slate-900">${p.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {p.cards} cards</span>
                <span>·</span>
                <span>{p.txns} transactions</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 text-xs font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-800">Transfer</button>
                <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ CARDS ============
function CardsPage() {
  const cards = [
    { name: 'Marketing Team', user: 'Sarah K.', last4: '4521', type: 'virtual', limit: 5000, spent: 3240, color: 'from-indigo-500 via-purple-500 to-pink-500', frozen: false },
    { name: 'Operations', user: 'Marcus L.', last4: '8843', type: 'physical', limit: 8000, spent: 1820, color: 'from-slate-800 to-slate-950', frozen: false },
    { name: 'AWS Subscription', user: 'Auto', last4: '0012', type: 'virtual', limit: 2000, spent: 890, color: 'from-amber-500 via-orange-500 to-rose-500', frozen: false },
    { name: 'Travel', user: 'Lisa P.', last4: '2241', type: 'physical', limit: 3000, spent: 0, color: 'from-emerald-500 via-teal-500 to-cyan-500', frozen: true },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Cards</h1>
          <p className="mt-1 text-sm text-slate-600">Issue, freeze, and control virtual & physical cards</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> Issue card
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
            <div className={`relative h-44 bg-gradient-to-br ${c.color} rounded-2xl p-5 text-white overflow-hidden shadow-xl`}>
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
                <circle cx="350" cy="50" r="80" fill="white" />
                <circle cx="350" cy="50" r="50" fill="white" opacity="0.7" />
              </svg>
              <div className="relative flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">{c.type} card</div>
                    <div className="mt-1 text-lg font-bold font-display">{c.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.frozen && <Lock className="w-4 h-4 opacity-80" />}
                    <div className="text-xs opacity-80">{c.user}</div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-lg tracking-widest opacity-90">•••• •••• •••• {c.last4}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[10px] opacity-70">VALID THRU 12/28</div>
                    <div className="text-sm font-bold tracking-wider font-display">VISA</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Monthly limit</span>
                <span className="font-semibold text-slate-900">${c.spent.toLocaleString()} / ${c.limit.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]" style={{ width: `${(c.spent/c.limit)*100}%` }} />
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-1">
                  {c.frozen ? <><Unlock className="w-3 h-3" /> Unfreeze</> : <><Lock className="w-3 h-3" /> Freeze</>}
                </button>
                <button className="flex-1 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200">Settings</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ USERS ============
function UsersPage() {
  const users = [
    { name: 'Sarah Kim', role: 'Marketing Lead', email: 's.kim@co.com', cards: 2, spent: 3240, color: 'bg-[#eff6ff]0' },
    { name: 'Marcus Leigh', role: 'Operations Manager', email: 'marcus@co.com', cards: 1, spent: 1820, color: 'bg-[#eff6ff]0' },
    { name: 'Lisa Park', role: 'Head of Design', email: 'lisa.p@co.com', cards: 1, spent: 0, color: 'bg-[#ecfdf5]0' },
    { name: 'David Cohen', role: 'CFO', email: 'd.cohen@co.com', cards: 3, spent: 8420, color: 'bg-[#fffbeb]0' },
    { name: 'Aisha Rahman', role: 'Engineering Lead', email: 'aisha@co.com', cards: 1, spent: 240, color: 'bg-[#eff6ff]0' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Team</h1>
          <p className="mt-1 text-sm text-slate-600">22 members · Manage roles & permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> Invite member
        </button>
      </div>

      <div className="overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
        {users.map((u, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 transition border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
            <div className={`w-11 h-11 rounded-full ${u.color} flex items-center justify-center text-white font-semibold text-sm`}>
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">{u.name}</div>
              <div className="text-xs text-slate-500">{u.role} · {u.email}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">{u.cards} cards</div>
              <div className="text-sm font-semibold text-slate-900">${u.spent.toLocaleString()}<span className="text-xs font-normal text-slate-500"> /mo</span></div>
            </div>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ APPROVALS ============
function ApprovalsPage() {
  const requests = [
    { type: 'Card request', user: 'Aisha Rahman', detail: 'Virtual card · AWS subscription', amount: 500, date: '2h ago', color: 'bg-[#eff6ff]0' },
    { type: 'Fund request', user: 'Marcus Leigh', detail: 'Top up Operations pool', amount: 2000, date: '5h ago', color: 'bg-[#eff6ff]0' },
    { type: 'Reimbursement', user: 'Sarah Kim', detail: 'Conference travel + meals', amount: 840, date: '1d ago', color: 'bg-[#eff6ff]0' },
    { type: 'Bill payment', user: 'Auto', detail: 'WeWork Dec invoice', amount: 2400, date: '1d ago', color: 'bg-[#fffbeb]0' },
    { type: 'Card request', user: 'David Cohen', detail: 'Physical card · Travel', amount: 5000, date: '2d ago', color: 'bg-[#ecfdf5]0' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Approvals</h1>
          <p className="mt-1 text-sm text-slate-600">5 pending · $10,740 total value</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">Approve all safe</button>
          <button className="px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">Configure rules</button>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map((r, i) => (
          <div key={i} className="flex items-center gap-4 p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center`}>
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">{r.type}</span>
                <span className="text-xs text-slate-500">{r.date}</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{r.user}</div>
              <div className="text-xs text-slate-500">{r.detail}</div>
            </div>
            <div className="text-xl font-bold font-display text-slate-900">${r.amount.toLocaleString()}</div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-[#fef2f2] text-rose-700 rounded-lg text-xs font-semibold hover:bg-[#fee2e2]">Reject</button>
              <button className="px-3 py-1.5 bg-[#ecfdf5]0 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ BUDGETING ============
function BudgetingPage({ mode }) {
  const budgets = mode === 'business' ? [
    { name: 'Marketing', spent: 8240, limit: 12000, color: 'from-pink-500 to-rose-500' },
    { name: 'Office & Software', spent: 4820, limit: 6000, color: 'from-indigo-500 to-purple-600' },
    { name: 'Travel & Events', spent: 1820, limit: 5000, color: 'from-amber-500 to-orange-500' },
    { name: 'Team meals', spent: 920, limit: 1500, color: 'from-emerald-500 to-teal-500' },
  ] : [
    { name: 'Groceries', spent: 480, limit: 600, color: 'from-emerald-500 to-teal-500' },
    { name: 'Dining out', spent: 320, limit: 250, color: 'from-rose-500 to-red-500' },
    { name: 'Transport', spent: 180, limit: 250, color: 'from-indigo-500 to-purple-600' },
    { name: 'Entertainment', spent: 95, limit: 200, color: 'from-amber-500 to-orange-500' },
    { name: 'Shopping', spent: 240, limit: 400, color: 'from-pink-500 to-rose-500' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Budgets</h1>
          <p className="mt-1 text-sm text-slate-600">{mode === 'business' ? 'Set caps, track team spend, get alerts' : 'Plan your money before you spend it'}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> New budget
        </button>
      </div>

      <div className="space-y-3">
        {budgets.map((b, i) => {
          const pct = (b.spent / b.limit) * 100;
          const over = pct > 100;
          return (
            <div key={i} className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ${b.spent.toLocaleString()} of ${b.limit.toLocaleString()} this month
                    {over && <span className="ml-2 font-semibold text-rose-600">· ${(b.spent-b.limit).toLocaleString()} over</span>}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`font-display text-xl font-bold ${over ? 'text-rose-600' : 'text-slate-900'}`}>{pct.toFixed(0)}%</div>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full bg-gradient-to-r ${over ? 'from-[#3b82f6] to-[#1d4ed8]' : b.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ GOALS ============
function GoalsPage() {
  const goals = [
    { name: 'Emergency fund', target: 15000, saved: 8500, icon: '🛟', deadline: 'Aug 2026' },
    { name: 'Japan trip', target: 10000, saved: 2400, icon: '🗾', deadline: 'Apr 2026' },
    { name: 'New car down payment', target: 8000, saved: 5200, icon: '🚗', deadline: 'Jun 2026' },
    { name: 'Course / certification', target: 2500, saved: 1800, icon: '🎓', deadline: 'Feb 2026' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Savings goals</h1>
          <p className="mt-1 text-sm text-slate-600">Auto-allocate from every paycheck</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> New goal
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = (g.saved / g.target) * 100;
          return (
            <div key={i} className="p-6 border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{g.icon}</div>
                  <div>
                    <h3 className="font-bold font-display text-slate-900">{g.name}</h3>
                    <p className="text-xs text-slate-500">By {g.deadline}</p>
                  </div>
                </div>
                <span className="text-lg font-bold font-display text-slate-900">{pct.toFixed(0)}%</span>
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">
                ${g.saved.toLocaleString()} <span className="text-base font-normal text-slate-400">/ ${g.target.toLocaleString()}</span>
              </div>
              <div className="h-2 mt-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 text-xs font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-800">Add money</button>
                <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Edit goal</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ ACCOUNTING ============
function AccountingPage() {
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <h1 className="mb-1 text-3xl font-bold font-display text-slate-900">Accounting</h1>
      <p className="mb-6 text-sm text-slate-600">Auto-categorize, sync with QuickBooks, Xero, NetSuite</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'To categorize', val: 24, sub: 'Needs review' },
          { label: 'Synced this month', val: 312, sub: 'Auto-coded' },
          { label: 'Tax-deductible', val: '$18,420', sub: '142 transactions' },
        ].map(c => (
          <div key={c.label} className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className="text-xs text-slate-500">{c.label}</div>
            <div className="mt-1 text-3xl font-bold font-display text-slate-900">{c.val}</div>
            <div className="mt-1 text-xs text-slate-500">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'QuickBooks Online', status: 'Connected · Last synced 2m ago', color: 'bg-[#ecfdf5]0', logo: 'QB' },
          { name: 'Xero', status: 'Not connected', color: 'bg-slate-300', logo: 'X' },
          { name: 'NetSuite', status: 'Not connected', color: 'bg-slate-300', logo: 'NS' },
          { name: 'Sage', status: 'Not connected', color: 'bg-slate-300', logo: 'S' },
        ].map(p => (
          <div key={p.name} className="flex items-center gap-4 p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center text-white font-bold text-sm`}>{p.logo}</div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{p.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{p.status}</div>
            </div>
            <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${p.status.startsWith('Connected') ? 'bg-slate-100 text-slate-700' : 'bg-[#eff6ff]0 text-white'}`}>
              {p.status.startsWith('Connected') ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ INTEGRATIONS ============
function IntegrationsPage({ onConnect }) {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const cats = [
    { name: 'Banking', icon: Building2, accent: '#3B82F6', items: [
      { name: 'Plaid', sub: 'US banks', connected: true, desc: '12,000+ institutions, real-time sync', brand: 'PL', color: '#000000' },
      { name: 'Tink', sub: 'EU banks', connected: false, desc: 'European open banking network', brand: 'TI', color: '#1E3A8A' },
      { name: 'Wio Bank', sub: 'UAE business', connected: true, desc: 'Business banking for UAE', brand: 'W', color: '#7C3AED' },
      { name: 'Emirates NBD', sub: 'UAE retail', connected: true, desc: 'Personal and business accounts', brand: 'E', color: '#DC2626' },
      { name: 'Mashreq Neo', sub: 'UAE digital', connected: false, desc: 'Digital-first banking', brand: 'M', color: '#F97316' },
      { name: 'Revolut Business', sub: 'Global', connected: false, desc: 'Multi-currency accounts', brand: 'R', color: '#0F172A' },
    ]},
    { name: 'Crypto', icon: Bitcoin, accent: '#3b82f6', items: [
      { name: 'Coinbase', sub: 'Exchange', connected: true, desc: 'Spot trading, staking, and rewards', brand: 'C', color: '#0052FF', popular: true },
      { name: 'Binance', sub: 'Exchange', connected: true, desc: 'Trading, earn products, futures', brand: 'B', color: '#F0B90B' },
      { name: 'MetaMask', sub: 'Self-custody', connected: false, desc: 'ETH and L2 chains, read-only', brand: 'M', color: '#F6851B' },
    ]},
    { name: 'E-commerce', icon: ShoppingBag, accent: '#10B981', items: [
      { name: 'Shopify', sub: 'Platform', connected: true, desc: 'Auto-sync sales and payouts', brand: 'S', color: '#95BF47', popular: true },
      { name: 'WooCommerce', sub: 'WordPress', connected: true, desc: '8 stores connected', brand: 'W', color: '#7F54B3' },
      { name: 'Amazon Seller', sub: 'Marketplace', connected: false, desc: 'Marketplace integration', brand: 'A', color: '#FF9900' },
      { name: 'Etsy', sub: 'Marketplace', connected: false, desc: 'Sync orders and fees', brand: 'E', color: '#F45800' },
      { name: 'eBay', sub: 'Marketplace', connected: false, desc: 'Listings and payouts', brand: 'e', color: '#E53238' },
      { name: 'BigCommerce', sub: 'Platform', connected: false, desc: 'Enterprise e-commerce', brand: 'BC', color: '#121118' },
    ]},
    { name: 'Payments', icon: CreditCard, accent: '#3b82f6', items: [
      { name: 'Stripe', sub: 'Processor', connected: true, desc: 'Payouts and disputes', brand: 'S', color: '#635BFF', popular: true },
      { name: 'PayPal', sub: 'Processor', connected: false, desc: 'Receive and pay globally', brand: 'P', color: '#003087' },
      { name: 'Square', sub: 'POS', connected: false, desc: 'In-person payments', brand: 'Sq', color: '#000000' },
      { name: 'Wise', sub: 'Transfers', connected: false, desc: 'Multi-currency transfers', brand: 'W', color: '#9FE870' },
      { name: 'Adyen', sub: 'Processor', connected: false, desc: 'Global payments platform', brand: 'A', color: '#0ABF53' },
    ]},
    { name: 'Accounting', icon: Calculator, accent: '#3b82f6', items: [
      { name: 'QuickBooks', sub: 'Bookkeeping', connected: true, desc: 'Auto categorization', brand: 'Q', color: '#2CA01C' },
      { name: 'Xero', sub: 'Bookkeeping', connected: false, desc: 'Cloud accounting', brand: 'X', color: '#13B5EA' },
      { name: 'NetSuite', sub: 'ERP', connected: false, desc: 'Enterprise ERP', brand: 'N', color: '#125B95' },
      { name: 'Zoho Books', sub: 'Bookkeeping', connected: false, desc: 'SMB accounting', brand: 'Z', color: '#E32227' },
      { name: 'FreshBooks', sub: 'Invoicing', connected: false, desc: 'Service business invoicing', brand: 'F', color: '#0075DD' },
    ]},
    { name: 'Investments', icon: TrendingUp, accent: '#0EA5E9', items: [
      { name: 'Robinhood', sub: 'Brokerage', connected: false, desc: 'Stocks and options', brand: 'R', color: '#00C805' },
      { name: 'Interactive Brokers', sub: 'Brokerage', connected: false, desc: 'Global brokerage', brand: 'IB', color: '#D81222' },
      { name: 'Sarwa', sub: 'Robo-advisor', connected: false, desc: 'MENA robo-advisor', brand: 'S', color: '#F4C400' },
      { name: 'eToro', sub: 'Social', connected: false, desc: 'Social investing', brand: 'e', color: '#13C636' },
    ]},
    { name: 'Productivity', icon: Zap, accent: '#06B6D4', items: [
      { name: 'Slack', sub: 'Messaging', connected: true, desc: 'Spend alerts to channels', brand: 'S', color: '#4A154B' },
      { name: 'Google Workspace', sub: 'Suite', connected: true, desc: 'Receipts from Gmail', brand: 'G', color: '#4285F4' },
      { name: 'Zapier', sub: 'Automation', connected: false, desc: '5,000+ app automations', brand: 'Z', color: '#FF4F00' },
    ]},
  ];

  const totalConnected = cats.reduce((sum, c) => sum + c.items.filter(i => i.connected).length, 0);
  const totalAvailable = cats.reduce((sum, c) => sum + c.items.length, 0);
  const connectedItems = cats.flatMap(c => c.items.filter(i => i.connected).map(i => ({ ...i, cat: c.name })));

  const visibleCats = activeCat === 'All' ? cats : cats.filter(c => c.name === activeCat);
  const filteredCats = search
    ? visibleCats.map(cat => ({ ...cat, items: cat.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase())) })).filter(c => c.items.length > 0)
    : visibleCats;

  const catCounts = Object.fromEntries(cats.map(c => [c.name, { connected: c.items.filter(i => i.connected).length, total: c.items.length }]));

  return (
    <div className="mx-auto max-w-7xl fade-up">
      {/* Page header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Integrations</h1>
          <p className="mt-1 text-sm text-slate-600">One hub for every account, tool, and wallet you use.</p>
        </div>
        <button onClick={onConnect} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition bg-slate-900 rounded-xl hover:bg-slate-800">
          <Plus className="w-4 h-4" /> Request integration
        </button>
      </div>

      {/* Hero stat strip — cleaner, flat, no gradients */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        <StatTile icon={CheckCircle2} iconBg="bg-[#ecfdf5]" iconColor="text-emerald-600" label="Connected" value={`${totalConnected}`} sub={`of ${totalAvailable} apps`} />
        <StatTile icon={Activity} iconBg="bg-[#eff6ff]" iconColor="text-[#2563eb]" label="Sync health" value="100%" sub="All systems live" />
        <StatTile icon={Clock} iconBg="bg-[#fffbeb]" iconColor="text-amber-600" label="Last sync" value="2m" sub="Real-time" />
        <StatTile icon={Layers} iconBg="bg-[#eff6ff]" iconColor="text-[#2563eb]" label="Categories" value={`${cats.length}`} sub={`${activeCat === 'All' ? 'all visible' : activeCat}`} />
      </div>

      {/* Connected at a glance — modern strip */}
      {connectedItems.length > 0 && (
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl mb-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-display text-slate-900">Active connections</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Synced and pulling data right now</p>
            </div>
            <button onClick={() => setActiveCat('All')} className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {connectedItems.map((it, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200/60 rounded-full">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{ background: it.color }}>
                  {it.brand}
                </div>
                <span className="text-xs font-medium text-slate-700">{it.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ecfdf5]0 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + category chips — horizontal, less heavy than the sidebar */}
      <div className="sticky top-0 z-10 p-3 mb-5 bg-white border border-slate-200/80 rounded-2xl backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations..."
              className="w-full py-2 pr-3 text-xs border rounded-lg pl-9 bg-slate-50 border-slate-200 focus:outline-none focus:border-indigo-300 focus:bg-white"
            />
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
            <CategoryChip active={activeCat === 'All'} onClick={() => setActiveCat('All')} icon={Layers} label="All" count={totalAvailable} />
            {cats.map(c => (
              <CategoryChip
                key={c.name}
                active={activeCat === c.name}
                onClick={() => setActiveCat(c.name)}
                icon={c.icon}
                label={c.name}
                count={catCounts[c.name].total}
                hasConnected={catCounts[c.name].connected > 0}
                accent={c.accent}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main grid — no more sidebar, full width, flatter cards */}
      <div>
        {filteredCats.length === 0 ? (
          <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl">
            <Search className="w-8 h-8 mx-auto mb-3 text-slate-300" />
            <div className="font-semibold text-slate-900">No integrations found</div>
            <p className="mt-1 text-xs text-slate-500">Try a different search or category</p>
          </div>
        ) : (
          filteredCats.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{
                      background: `${cat.accent}15`
                    }}>
                      <Icon className="w-4 h-4" style={{ color: cat.accent }} />
                    </div>
                    <div>
                      <h3 className="font-bold font-display text-slate-900">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {cat.items.filter(i => i.connected).length} of {cat.items.length} connected
                      </p>
                    </div>
                  </div>
                  {cat.items.filter(i => i.connected).length > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#ecfdf5] rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ecfdf5]0 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {cat.items.map(it => (
                    <IntegrationCard key={it.name} item={it} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Request CTA at bottom */}
      <div className="relative p-6 mt-8 overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] rounded-2xl">
        <div className="absolute w-40 h-40 rounded-full -top-8 -right-8 bg-[#eff6ff]0/20 blur-3xl" />
        <div className="relative flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider">Don't see your tool?</span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">Request an integration</h3>
            <p className="max-w-md mt-1 text-sm text-violet-200">Tell us what you use and we'll prioritize the most-asked apps. Most requests ship within 30 days.</p>
          </div>
          <button onClick={onConnect} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 transition flex items-center gap-2 flex-shrink-0">
            Request now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, iconBg, iconColor, label, value, sub }) {
  return (
    <div className="p-4 bg-white border border-slate-200/80 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold leading-none font-display text-slate-900">{value}</div>
      <div className="text-[11px] text-slate-500 mt-1.5">{sub}</div>
    </div>
  );
}

function CategoryChip({ active, onClick, icon: Icon, label, count, hasConnected, accent }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-3 h-3" style={!active && accent ? { color: accent } : {}} />
      {label}
      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 ${
        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        {hasConnected && <span className={`w-1 h-1 rounded-full ${active ? 'bg-emerald-300' : 'bg-[#ecfdf5]0'}`} />}
        {count}
      </span>
    </button>
  );
}

// ============ INTEGRATION CARD ============
function IntegrationCard({ item }) {
  return (
    <div className="relative p-4 transition-all bg-white border group border-slate-200/80 rounded-2xl hover:border-slate-300 hover:shadow-sm">
      {item.popular && !item.connected && (
        <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-[#fef3c7] text-amber-800 text-[9px] font-bold uppercase tracking-wider rounded">
          Popular
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        {/* Brand mark — squircle with letter */}
        <div className="relative flex items-center justify-center flex-shrink-0 font-bold text-white w-11 h-11 rounded-xl font-display" style={{
          background: item.color,
          fontSize: item.brand.length > 1 ? '13px' : '17px'
        }}>
          {item.brand}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate text-slate-900">{item.name}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed mb-4 line-clamp-2 min-h-[28px]">{item.desc}</p>

      <div className="flex items-center justify-between gap-2">
        {item.connected ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ecfdf5]0 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-700">Connected</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900">
              Manage <ChevronRight className="w-3 h-3" />
            </button>
          </>
        ) : (
          <button className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1.5">
            <Plus className="w-3 h-3" /> Connect
          </button>
        )}
      </div>
    </div>
  );
}

// ============ INVOICES ============
function InvoicesPage({ mode }) {
  const [view, setView] = useState('list'); // list | templates | editor
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (view === 'editor' && selectedTemplate) {
    return <InvoiceEditor template={selectedTemplate} mode={mode} onBack={() => setView('templates')} />;
  }

  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-600">
            {mode === 'business' ? 'Send, track, and get paid faster with AI follow-ups.' : 'Send invoices for freelance work or side projects.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('templates')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            <Layers className="w-4 h-4" /> Browse templates
          </button>
          <button
            onClick={() => setView('templates')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30"
          >
            <Plus className="w-4 h-4" /> New invoice
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex p-1 mb-5 border bg-white/60 border-white/80 rounded-xl w-fit">
        {[
          { id: 'list', label: 'All invoices' },
          { id: 'templates', label: 'Templates' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              view === t.id ? 'bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'list' && <InvoiceList mode={mode} />}
      {view === 'templates' && <InvoiceTemplateGallery mode={mode} onSelect={(t) => { setSelectedTemplate(t); setView('editor'); }} />}
    </div>
  );
}

function InvoiceList({ mode }) {
  const businessInvoices = [
    { id: 'INV-2026-1024', client: 'Globex Corp', amount: 12400, status: 'paid', date: 'Mar 14', due: 'Mar 28', items: 4 },
    { id: 'INV-2026-1023', client: 'Initech Ltd', amount: 8200, status: 'sent', date: 'Mar 12', due: 'Mar 26', items: 3 },
    { id: 'INV-2026-1022', client: 'Pied Piper', amount: 24000, status: 'overdue', date: 'Feb 28', due: 'Mar 14', items: 6 },
    { id: 'INV-2026-1021', client: 'Hooli Inc', amount: 5600, status: 'draft', date: 'Mar 10', due: '—', items: 2 },
    { id: 'INV-2026-1020', client: 'Massive Dynamic', amount: 18900, status: 'paid', date: 'Mar 8', due: 'Mar 22', items: 5 },
  ];
  const personalInvoices = [
    { id: 'INV-001', client: 'Side gig — Design work', amount: 800, status: 'sent', date: 'Mar 12', due: 'Mar 26', items: 1 },
    { id: 'INV-002', client: 'Freelance writing — Acme blog', amount: 450, status: 'paid', date: 'Mar 5', due: 'Mar 19', items: 1 },
    { id: 'INV-003', client: 'Photography — Family shoot', amount: 320, status: 'draft', date: 'Mar 14', due: '—', items: 1 },
  ];
  const invoices = mode === 'business' ? businessInvoices : personalInvoices;
  const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);

  const statusStyles = {
    paid: 'bg-[#ecfdf5] text-emerald-700 border-emerald-200',
    sent: 'bg-[#fffbeb] text-amber-700 border-amber-200',
    overdue: 'bg-[#fef2f2] text-rose-700 border-rose-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="p-4 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
          <div className="text-xs text-slate-500">Outstanding</div>
          <div className="mt-1 text-2xl font-bold font-display text-slate-900">${totalOutstanding.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-1">{invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length} invoices</div>
        </div>
        <div className="p-4 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
          <div className="text-xs text-slate-500">Overdue</div>
          <div className="mt-1 text-2xl font-bold font-display text-rose-600">${totalOverdue.toLocaleString()}</div>
          <div className="text-[10px] text-rose-500 mt-1">AI follow-up sent</div>
        </div>
        <div className="p-4 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
          <div className="text-xs text-slate-500">Paid this month</div>
          <div className="mt-1 text-2xl font-bold font-display text-emerald-600">${totalPaid.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-1">{invoices.filter(i => i.status === 'paid').length} invoices</div>
        </div>
        <div className="p-4 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
          <div className="text-xs text-slate-500">Avg. payment time</div>
          <div className="mt-1 text-2xl font-bold font-display text-slate-900">{mode === 'business' ? '11 days' : '8 days'}</div>
          <div className="text-[10px] text-emerald-600 mt-1">↓ 3 days faster</div>
        </div>
      </div>

      <div className="overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">Invoice</div>
          <div className="col-span-3">Client / Project</div>
          <div className="col-span-2">Issued</div>
          <div className="col-span-2">Due</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>
        {invoices.map((inv, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-white/60 cursor-pointer transition items-center">
            <div className="col-span-3">
              <div className="text-sm font-semibold text-slate-900">{inv.id}</div>
              <div className="mt-1">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border rounded-md ${statusStyles[inv.status]}`}>{inv.status}</span>
              </div>
            </div>
            <div className="col-span-3 text-sm text-slate-700">
              <div className="font-medium">{inv.client}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{inv.items} {inv.items === 1 ? 'item' : 'items'}</div>
            </div>
            <div className="col-span-2 text-xs text-slate-600">{inv.date}</div>
            <div className="col-span-2 text-xs text-slate-600">{inv.due}</div>
            <div className="col-span-2 text-right">
              <div className="font-bold text-slate-900">${inv.amount.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InvoiceTemplateGallery({ mode, onSelect }) {
  const businessTemplates = [
    { id: 'modern-dark', name: 'Modern Dark Header', category: 'Professional', plan: 'Business', accent: '#3b82f6', headerStyle: 'darkBand' },
    { id: 'minimal-line', name: 'Minimal Line', category: 'Service', plan: 'Free', accent: '#1e3a8a', headerStyle: 'minimal' },
    { id: 'gradient-pro', name: 'Gradient Pro', category: 'Creative', plan: 'Business', accent: '#3b82f6', headerStyle: 'gradient' },
    { id: 'classic-blue', name: 'Classic Corporate', category: 'Professional', plan: 'Free', accent: '#1d4ed8', headerStyle: 'sidebar' },
    { id: 'royalty-gold', name: 'Royalty Gold', category: 'Royalty', plan: 'Business', accent: '#2563eb', headerStyle: 'gold' },
    { id: 'consultancy', name: 'Consultancy', category: 'Service', plan: 'Free', accent: '#3b82f6', headerStyle: 'split' },
    { id: 'agency-pink', name: 'Agency Pink', category: 'Creative', plan: 'Business', accent: '#3b82f6', headerStyle: 'gradient' },
    { id: 'tech-saas', name: 'Tech SaaS', category: 'Tech', plan: 'Business', accent: '#6366F1', headerStyle: 'minimal' },
  ];
  const personalTemplates = [
    { id: 'freelancer-clean', name: 'Freelancer Clean', category: 'Freelance', plan: 'Free', accent: '#1e3a8a', headerStyle: 'minimal' },
    { id: 'creative-warm', name: 'Creative Warm', category: 'Creative', plan: 'Free', accent: '#3b82f6', headerStyle: 'gradient' },
    { id: 'photo-elegant', name: 'Photographer Elegant', category: 'Photography', plan: 'Pro', accent: '#1e3a8a', headerStyle: 'darkBand' },
    { id: 'tutor-friendly', name: 'Tutor Friendly', category: 'Education', plan: 'Free', accent: '#3b82f6', headerStyle: 'split' },
    { id: 'side-hustle', name: 'Side Hustle', category: 'General', plan: 'Free', accent: '#3b82f6', headerStyle: 'sidebar' },
    { id: 'wedding-soft', name: 'Wedding Soft', category: 'Events', plan: 'Pro', accent: '#3b82f6', headerStyle: 'gradient' },
  ];
  const templates = mode === 'business' ? businessTemplates : personalTemplates;
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter);

  return (
    <div>
      {/* Hero promo */}
      <div className="relative p-5 mb-5 overflow-hidden border rounded-2xl border-indigo-200/60" style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
      }}>
        <div className="absolute w-48 h-48 rounded-full -top-12 -right-12 bg-violet-300/30 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="flex items-center justify-center text-2xl w-14 h-14 rounded-2xl" style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
          }}>
            <Sparkles className="text-white w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold font-display text-slate-900">Edit with AI</div>
            <p className="text-xs text-slate-600 mt-0.5 max-w-lg">Describe your business and Kira will fill out the entire invoice — line items, payment terms, branding, and auto-send schedule.</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Generate with AI
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === c
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-4 gap-5">
        {filtered.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="overflow-hidden text-left transition-all bg-white border group border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-[#3b82f6]/10 hover:border-[#bfdbfe] hover:-translate-y-1"
          >
            <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
              <InvoicePreview template={t} />
              {t.plan === 'Business' || t.plan === 'Pro' ? (
                <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase rounded-md">{t.plan}</span>
              ) : null}
              <div className="absolute inset-0 flex items-end justify-center pb-4 transition opacity-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent group-hover:opacity-100">
                <span className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Use this template
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-slate-900">{t.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{t.category} · Letter (8.5 × 11)</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ INVOICE PREVIEW (mini render of each template) ============
function InvoicePreview({ template }) {
  const accent = template.accent;
  const dark = '#1E293B';

  return (
    <div className="w-full h-full bg-white p-3 text-[5px] leading-tight relative overflow-hidden">
      {/* Header variants */}
      {template.headerStyle === 'darkBand' && (
        <div className="rounded-t-sm px-3 py-2.5 flex items-center justify-between" style={{ background: dark, marginInline: '-12px', marginTop: '-12px' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ background: accent }} />
            <div>
              <div className="font-bold text-white" style={{ fontSize: '6px' }}>STUDIO CO.</div>
              <div className="text-white/60" style={{ fontSize: '4px' }}>Creative agency</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/70" style={{ fontSize: '4px' }}>INVOICE</div>
            <div className="font-bold" style={{ fontSize: '8px', color: accent, fontStyle: 'italic' }}>INVOICE</div>
          </div>
        </div>
      )}

      {template.headerStyle === 'minimal' && (
        <div className="pb-2 mb-2 border-b border-slate-200">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-bold text-slate-900" style={{ fontSize: '8px', letterSpacing: '0.5px' }}>INVOICE</div>
              <div className="text-slate-500 mt-0.5" style={{ fontSize: '4.5px' }}>#INV-2026-0042</div>
            </div>
            <div className="w-1 h-5" style={{ background: accent }} />
          </div>
        </div>
      )}

      {template.headerStyle === 'gradient' && (
        <div className="rounded-t-sm px-3 py-2.5 relative overflow-hidden" style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
          marginInline: '-12px',
          marginTop: '-12px'
        }}>
          <div className="absolute w-12 h-12 rounded-full -top-4 -right-4 bg-white/20" />
          <div className="relative">
            <div className="font-bold text-white" style={{ fontSize: '5px', letterSpacing: '1px', opacity: 0.8 }}>INVOICE</div>
            <div className="text-white font-bold mt-0.5" style={{ fontSize: '11px' }}>$2,310.00</div>
            <div className="text-white/80" style={{ fontSize: '4px' }}>Due Jan 25, 2026</div>
          </div>
        </div>
      )}

      {template.headerStyle === 'sidebar' && (
        <div className="absolute top-0 bottom-0 left-0 w-12" style={{ background: accent }}>
          <div className="p-2 text-white">
            <div style={{ fontSize: '5px', opacity: 0.8 }}>FROM</div>
            <div className="font-bold mt-0.5" style={{ fontSize: '6px' }}>BrightPixel</div>
            <div className="mt-3" style={{ fontSize: '4px', opacity: 0.7 }}>hello@bright.co</div>
          </div>
        </div>
      )}

      {template.headerStyle === 'gold' && (
        <div className="flex items-start justify-between pb-2 mb-2 border-b-2" style={{ borderColor: accent }}>
          <div>
            <div className="font-bold text-slate-900" style={{ fontSize: '6px' }}>PIXITECH</div>
            <div className="text-slate-500" style={{ fontSize: '4px' }}>Technologies</div>
          </div>
          <div className="text-right">
            <div className="font-bold" style={{ fontSize: '9px', color: dark }}>INVOICE</div>
            <div className="text-slate-500 mt-0.5" style={{ fontSize: '4px' }}>#INV-2026-001</div>
          </div>
        </div>
      )}

      {template.headerStyle === 'split' && (
        <div className="flex mb-2">
          <div className="flex-1 py-1.5">
            <div className="font-bold text-slate-900" style={{ fontSize: '7px' }}>Consultancy</div>
            <div className="text-slate-500 mt-0.5" style={{ fontSize: '4px' }}>Professional services</div>
          </div>
          <div className="px-3 py-1.5 text-white rounded" style={{ background: accent }}>
            <div className="font-bold" style={{ fontSize: '7px' }}>INVOICE</div>
          </div>
        </div>
      )}

      {/* Body: bill to + invoice meta */}
      <div className={`flex gap-2 mb-2 ${template.headerStyle === 'sidebar' ? 'ml-12' : ''} mt-2`}>
        <div className="flex-1">
          <div className="font-semibold text-slate-500" style={{ fontSize: '4px', letterSpacing: '0.5px' }}>BILL TO</div>
          <div className="font-semibold text-slate-900 mt-0.5" style={{ fontSize: '5px' }}>Acme Industries</div>
          <div className="text-slate-500" style={{ fontSize: '4px' }}>contact@acme.co</div>
          <div className="text-slate-500" style={{ fontSize: '4px' }}>456 Oak Ave, Townsville</div>
        </div>
        <div className="text-right">
          <div className="text-slate-500" style={{ fontSize: '4px' }}>Date: Mar 14, 2026</div>
          <div className="text-slate-500" style={{ fontSize: '4px' }}>Due: Mar 28, 2026</div>
        </div>
      </div>

      {/* Line items table */}
      <div className={`${template.headerStyle === 'sidebar' ? 'ml-12' : ''}`}>
        <div className="flex justify-between px-2 py-1 font-semibold text-white rounded" style={{ background: accent, fontSize: '4.5px' }}>
          <span className="flex-1">Description</span>
          <span className="w-6 text-center">Qty</span>
          <span className="w-8 text-right">Price</span>
          <span className="w-8 text-right">Amount</span>
        </div>
        {[
          { desc: 'Design retainer', qty: 1, price: '$1,200', amt: '$1,200' },
          { desc: 'Brand strategy', qty: 1, price: '$800', amt: '$800' },
          { desc: 'Revisions', qty: 2, price: '$150', amt: '$300' },
        ].map((row, i) => (
          <div key={i} className="flex justify-between px-2 py-1 border-b border-slate-100" style={{ fontSize: '4.5px' }}>
            <span className="flex-1 text-slate-700">{row.desc}</span>
            <span className="w-6 text-center text-slate-700">{row.qty}</span>
            <span className="w-8 text-right text-slate-700">{row.price}</span>
            <span className="w-8 font-semibold text-right text-slate-900">{row.amt}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className={`mt-2 flex justify-end ${template.headerStyle === 'sidebar' ? 'mr-0' : ''}`}>
        <div className="text-right space-y-0.5" style={{ fontSize: '4.5px' }}>
          <div className="flex gap-3 text-slate-600"><span>Subtotal</span><span className="font-medium">$2,300</span></div>
          <div className="flex gap-3 text-slate-600"><span>Tax 5%</span><span className="font-medium">$115</span></div>
          <div className="flex gap-3 px-2 py-1 mt-1 font-bold text-white rounded" style={{ background: accent, fontSize: '5.5px' }}>
            <span>Total</span><span>$2,415</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-3 ${template.headerStyle === 'sidebar' ? 'left-14' : 'left-3'} right-3`}>
        <div className="italic text-slate-500" style={{ fontSize: '4px' }}>Thank you for your business!</div>
        <div className="flex items-end justify-between mt-1">
          <div>
            <div className="w-12 h-2 border-b border-slate-300" />
            <div className="text-slate-500 mt-0.5" style={{ fontSize: '3.5px' }}>Signature</div>
          </div>
          <div className="text-slate-400" style={{ fontSize: '3.5px' }}>Page 1 of 1</div>
        </div>
      </div>
    </div>
  );
}

// ============ INVOICE EDITOR ============
function InvoiceEditor({ template, mode, onBack }) {
  const [lineItems, setLineItems] = useState([
    { desc: 'Design retainer', qty: 1, price: 1200 },
    { desc: 'Brand strategy', qty: 1, price: 800 },
    { desc: 'Revisions', qty: 2, price: 150 },
  ]);
  const [taxRate, setTaxRate] = useState(5);
  const [clientName, setClientName] = useState('Acme Industries');
  const [clientEmail, setClientEmail] = useState('billing@acme.co');
  const [clientAddress, setClientAddress] = useState('456 Oak Avenue, Townsville, State 67890');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-' + Math.floor(Math.random() * 9000 + 1000));
  const [companyName, setCompanyName] = useState(mode === 'business' ? 'Acme Inc.' : 'Kobe Owens');

  const subtotal = lineItems.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const updateItem = (i, field, value) => {
    const copy = [...lineItems];
    copy[i] = { ...copy[i], [field]: field === 'desc' ? value : Number(value) || 0 };
    setLineItems(copy);
  };
  const addItem = () => setLineItems([...lineItems, { desc: '', qty: 1, price: 0 }]);
  const removeItem = (i) => setLineItems(lineItems.filter((_, idx) => idx !== i));

  const accent = template.accent;

  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center justify-center bg-white border w-9 h-9 rounded-xl border-slate-200 hover:bg-slate-50">
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900">{template.name}</h1>
            <p className="text-xs text-slate-500">Editing · {template.category} template</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" /> Edit with AI
          </button>
          <button className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
          <button className="px-4 py-2 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#3b82f6]/30 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Send invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Edit panel */}
        <div className="col-span-2 space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl">
            <h3 className="mb-3 text-sm font-bold font-display text-slate-900">Your details</h3>
            <Field label="From" value={companyName} onChange={setCompanyName} />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl">
            <h3 className="mb-3 text-sm font-bold font-display text-slate-900">Bill to</h3>
            <Field label="Client name" value={clientName} onChange={setClientName} />
            <Field label="Email" value={clientEmail} onChange={setClientEmail} />
            <Field label="Address" value={clientAddress} onChange={setClientAddress} />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl">
            <h3 className="mb-3 text-sm font-bold font-display text-slate-900">Invoice meta</h3>
            <Field label="Invoice number" value={invoiceNumber} onChange={setInvoiceNumber} />
            <Field label="Tax rate (%)" value={String(taxRate)} onChange={(v) => setTaxRate(Number(v) || 0)} />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-display text-slate-900">Line items</h3>
              <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            <div className="space-y-2">
              {lineItems.map((item, i) => (
                <div key={i} className="grid items-center grid-cols-12 gap-2">
                  <input
                    value={item.desc}
                    onChange={(e) => updateItem(i, 'desc', e.target.value)}
                    placeholder="Description"
                    className="col-span-6 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-300"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', e.target.value)}
                    placeholder="Qty"
                    className="col-span-2 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-300"
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', e.target.value)}
                    placeholder="Price"
                    className="col-span-3 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-300"
                  />
                  <button onClick={() => removeItem(i)} className="flex items-center justify-center col-span-1 rounded-lg w-7 h-7 hover:bg-[#fef2f2] text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="col-span-3">
          <div className="sticky overflow-hidden bg-white border shadow-xl top-4 border-slate-200 rounded-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between px-5 py-2 border-b bg-slate-50 border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live preview</span>
              <span className="text-[10px] text-slate-500">Letter · 8.5 × 11 in</span>
            </div>
            <InvoiceFullRender
              template={template}
              accent={accent}
              companyName={companyName}
              invoiceNumber={invoiceNumber}
              clientName={clientName}
              clientEmail={clientEmail}
              clientAddress={clientAddress}
              lineItems={lineItems}
              taxRate={taxRate}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-[#dbeafe]"
      />
    </div>
  );
}

function InvoiceFullRender({ template, accent, companyName, invoiceNumber, clientName, clientEmail, clientAddress, lineItems, taxRate, subtotal, tax, total }) {
  const dark = '#1E293B';
  const style = template.headerStyle;

  return (
    <div className="p-8 text-sm bg-white" style={{ minHeight: '600px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      {style === 'darkBand' && (
        <div className="flex items-center justify-between px-6 py-5 mb-6 -mt-2 rounded-lg" style={{ background: dark }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: accent }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold text-white">{companyName}</div>
              <div className="text-xs text-white/60">www.{companyName.toLowerCase().replace(/[^a-z]/g, '')}.com</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs italic text-white/70">Professional services</div>
            <div className="text-2xl font-bold font-display" style={{ color: accent, fontStyle: 'italic' }}>INVOICE</div>
          </div>
        </div>
      )}

      {style === 'minimal' && (
        <div className="flex items-end justify-between pb-5 mb-6 border-b border-slate-200">
          <div>
            <div className="text-3xl font-bold tracking-tight font-display text-slate-900">Invoice</div>
            <div className="mt-1 text-xs text-slate-500">{invoiceNumber}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900">{companyName}</div>
              <div className="text-xs text-slate-500">hello@example.com</div>
            </div>
            <div className="w-1 h-12" style={{ background: accent }} />
          </div>
        </div>
      )}

      {style === 'gradient' && (
        <div className="relative px-6 py-6 mb-6 -mt-2 overflow-hidden rounded-2xl" style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`
        }}>
          <div className="absolute w-32 h-32 rounded-full -top-8 -right-8 bg-white/20 blur-2xl" />
          <div className="relative flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-white/80">Invoice</div>
              <div className="mt-2 text-base font-bold text-white font-display">{companyName}</div>
              <div className="text-xs text-white/80">{invoiceNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/80">Total due</div>
              <div className="text-3xl font-bold text-white font-display">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {style === 'sidebar' && (
        <div className="flex gap-6 mb-6 -mt-2 -mb-2 -ml-2">
          <div className="w-32 px-4 py-6 -mt-6 -mb-6 -ml-6 text-white" style={{ background: accent, minHeight: '200px' }}>
            <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">From</div>
            <div className="text-sm font-bold">{companyName}</div>
            <div className="mt-6 text-[10px] opacity-80 leading-relaxed">hello@example.com<br />+1 (415) 555-0142</div>
          </div>
          <div className="flex-1 py-2">
            <div className="text-3xl font-bold font-display text-slate-900">Invoice</div>
            <div className="mt-1 text-xs text-slate-500">{invoiceNumber}</div>
          </div>
        </div>
      )}

      {style === 'gold' && (
        <div className="flex items-start justify-between pb-4 mb-6 border-b-2" style={{ borderColor: accent }}>
          <div>
            <div className="text-lg font-bold text-slate-900">{companyName}</div>
            <div className="text-xs text-slate-500">Technologies</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-display text-slate-900">INVOICE</div>
            <div className="mt-1 text-xs text-slate-500">{invoiceNumber}</div>
          </div>
        </div>
      )}

      {style === 'split' && (
        <div className="flex mb-6">
          <div className="flex-1 py-3">
            <div className="text-lg font-bold font-display text-slate-900">{companyName}</div>
            <div className="text-xs text-slate-500">Professional services</div>
          </div>
          <div className="px-6 py-3 text-white rounded-lg" style={{ background: accent }}>
            <div className="text-sm font-bold">INVOICE</div>
            <div className="mt-1 text-xs opacity-90">{invoiceNumber}</div>
          </div>
        </div>
      )}

      {/* Bill to + meta */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bill to</div>
          <div className="text-sm font-semibold text-slate-900">{clientName}</div>
          <div className="text-slate-600 text-xs mt-0.5">{clientEmail}</div>
          <div className="text-xs text-slate-600">{clientAddress}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice details</div>
          <div className="text-xs text-slate-600">Issued: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div className="text-xs text-slate-600">Due: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-4 overflow-hidden border rounded-lg border-slate-200">
        <div className="flex items-center px-4 py-2 text-xs font-semibold text-white" style={{ background: accent }}>
          <span className="flex-1">Description</span>
          <span className="w-16 text-center">Qty</span>
          <span className="w-24 text-right">Price</span>
          <span className="w-24 text-right">Amount</span>
        </div>
        {lineItems.map((item, i) => (
          <div key={i} className="px-4 py-2.5 flex items-center text-xs border-b border-slate-100 last:border-0">
            <span className="flex-1 text-slate-800">{item.desc || <span className="text-slate-300">—</span>}</span>
            <span className="w-16 text-center text-slate-700">{item.qty}</span>
            <span className="w-24 text-right text-slate-700">${item.price.toFixed(2)}</span>
            <span className="w-24 font-semibold text-right text-slate-900">${(item.qty * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1.5 text-xs">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-xs border-b border-slate-200">
            <span className="text-slate-600">Tax ({taxRate}%)</span>
            <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2.5 mt-2 text-white rounded-lg px-3 font-bold" style={{ background: accent }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-4 border-t border-slate-200">
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment terms</div>
          <div className="text-xs text-slate-600">Payment is due within 14 days. Bank transfer or card accepted.</div>
        </div>
        <div className="text-right">
          <div className="w-32 mb-1 border-b border-slate-300" style={{ height: '24px' }} />
          <div className="text-[10px] text-slate-500">Signature</div>
        </div>
      </div>
    </div>
  );
}

// ============ BILL PAY ============
function BillPayPage() {
  const bills = [
    { vendor: 'WeWork', amount: 2400, due: 'Dec 15', status: 'scheduled', icon: '🏢' },
    { vendor: 'AWS', amount: 890, due: 'Dec 16', status: 'scheduled', icon: '☁️' },
    { vendor: 'Figma', amount: 75, due: 'Dec 18', status: 'pending', icon: '🎨' },
    { vendor: 'Slack', amount: 240, due: 'Dec 20', status: 'pending', icon: '💬' },
    { vendor: 'Office cleaner', amount: 320, due: 'Dec 22', status: 'review', icon: '🧹' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Bill pay</h1>
          <p className="mt-1 text-sm text-slate-600">Upcoming bills · $3,925 due this week</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> Schedule payment
        </button>
      </div>

      <div className="space-y-2">
        {bills.map((b, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 text-xl rounded-lg bg-slate-100">{b.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{b.vendor}</div>
              <div className="text-xs text-slate-500">Due {b.due}</div>
            </div>
            <div className="text-lg font-bold font-display text-slate-900">${b.amount.toLocaleString()}</div>
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
              b.status === 'scheduled' ? 'bg-[#ecfdf5] text-emerald-700' :
              b.status === 'pending' ? 'bg-[#fffbeb] text-amber-700' :
              'bg-[#eff6ff] text-[#1d4ed8]'
            }`}>{b.status}</span>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800">Pay now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REIMBURSEMENTS ============
function ReimbursementsPage() {
  const reqs = [
    { user: 'Sarah Kim', desc: 'Conference + meals · Dubai', amount: 840, date: 'Dec 12', status: 'pending', receipts: 4 },
    { user: 'Marcus Leigh', desc: 'Client dinner', amount: 220, date: 'Dec 11', status: 'approved', receipts: 1 },
    { user: 'Lisa Park', desc: 'Design software', amount: 480, date: 'Dec 10', status: 'paid', receipts: 1 },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Reimbursements</h1>
          <p className="mt-1 text-sm text-slate-600">Employee expenses, fully tracked</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">
          <Plus className="w-4 h-4" /> New request
        </button>
      </div>

      <div className="space-y-2">
        {reqs.map((r, i) => (
          <div key={i} className="flex items-center gap-4 p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 text-xs font-semibold text-white rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">
              {r.user.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{r.user}</div>
              <div className="text-xs text-slate-500">{r.desc} · {r.receipts} receipts · {r.date}</div>
            </div>
            <div className="text-lg font-bold font-display text-slate-900">${r.amount}</div>
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
              r.status === 'paid' ? 'bg-[#ecfdf5] text-emerald-700' :
              r.status === 'approved' ? 'bg-[#eff6ff] text-[#1d4ed8]' :
              'bg-[#fffbeb] text-amber-700'
            }`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ INVESTMENTS ============
function InvestmentsPage() {
  const holdings = [
    { ticker: 'VOO', name: 'Vanguard S&P 500', shares: 24, price: 462.30, change: 1.2, value: 11095.20 },
    { ticker: 'AAPL', name: 'Apple Inc', shares: 32, price: 192.40, change: -0.8, value: 6156.80 },
    { ticker: 'NVDA', name: 'NVIDIA Corp', shares: 12, price: 920.50, change: 3.4, value: 11046.00 },
    { ticker: 'BTC', name: 'Bitcoin', shares: 0.18, price: 67200, change: 2.1, value: 12096.00 },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Investments</h1>
          <p className="mt-1 text-sm text-slate-600">Portfolio value: $40,394 · +8.2% YTD</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">Sell</button>
          <button className="px-4 py-2 text-sm font-semibold text-white shadow-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] rounded-xl shadow-[#3b82f6]/30">Buy</button>
        </div>
      </div>

      <div className="overflow-hidden border bg-white/70 backdrop-blur-md border-white/80 rounded-3xl">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">Asset</th>
              <th className="px-5 py-3 text-right">Shares</th>
              <th className="px-5 py-3 text-right">Price</th>
              <th className="px-5 py-3 text-right">Today</th>
              <th className="px-5 py-3 text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <div className="font-bold text-slate-900">{h.ticker}</div>
                  <div className="text-xs text-slate-500">{h.name}</div>
                </td>
                <td className="px-5 py-4 text-sm text-right">{h.shares}</td>
                <td className="px-5 py-4 font-mono text-sm text-right">${h.price.toLocaleString()}</td>
                <td className={`px-5 py-4 text-right text-sm font-semibold ${h.change > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {h.change > 0 ? '+' : ''}{h.change}%
                </td>
                <td className="px-5 py-4 text-sm font-bold text-right">${h.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ AI INSIGHTS ============
function InsightsPage() {
  const insights = [
    { icon: '🚨', title: 'Subscription leak detected', desc: 'You have 3 paid Figma seats but only 2 active users. Save $30/mo by removing one.', action: 'Review subscriptions', priority: 'high' },
    { icon: '💡', title: 'Cash flow optimization', desc: 'Moving your $24K Reserve to a high-yield account at 4.8% APY earns ~$1,152/year passively.', action: 'Compare accounts', priority: 'medium' },
    { icon: '📊', title: 'Spending pattern shift', desc: 'Marketing spend up 42% vs last quarter — driven by paid social. Consider attribution review.', action: 'Open analytics', priority: 'medium' },
    { icon: '🎯', title: "You're crushing it", desc: "Operations team came in 22% under budget this month. Reward them or reallocate the surplus.", action: 'Reallocate', priority: 'low' },
    { icon: '⚠️', title: 'Duplicate vendor', desc: 'Both "AWS" and "Amazon Web Services" appear as separate vendors. Consolidate?', action: 'Merge vendors', priority: 'low' },
  ];
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <div className="mb-5">
        <h1 className="text-3xl font-bold font-display text-slate-900">AI insights</h1>
        <p className="mt-1 text-sm text-slate-600">Patterns Kira spotted while you were busy</p>
      </div>

      <div className="space-y-3">
        {insights.map((s, i) => (
          <div key={i} className={`relative overflow-hidden rounded-2xl p-5 ${
            s.priority === 'high' ? 'bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border border-[#bfdbfe]' :
            s.priority === 'medium' ? 'bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border border-[#bfdbfe]' :
            'bg-white/70 border border-white/80'
          } backdrop-blur-md flex items-center gap-4`}>
            <div className="text-3xl">{s.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-white border text-slate-900 rounded-xl border-slate-200 hover:bg-slate-50">
              {s.action} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ REWARDS ============
function RewardsPage() {
  return (
    <div className="mx-auto max-w-7xl fade-up">
      <h1 className="mb-1 text-3xl font-bold font-display text-slate-900">Rewards</h1>
      <p className="mb-6 text-sm text-slate-600">Earn 1.5% cashback on all card spend · 3% on travel</p>

      <div className="relative p-8 mb-5 overflow-hidden text-white shadow-2xl rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-orange-500/30">
        <div className="absolute rounded-full -top-20 -right-20 w-72 h-72 bg-white/20 blur-3xl" />
        <div className="relative">
          <div className="text-sm font-semibold opacity-90">Available cashback</div>
          <div className="mt-2 text-5xl font-bold font-display">$1,240.50</div>
          <div className="mt-2 text-sm opacity-90">+ 12,420 points · worth ~$248</div>
          <div className="flex gap-2 mt-5">
            <button className="px-4 py-2 text-sm font-bold text-orange-600 bg-white rounded-xl hover:bg-orange-50">Redeem cash</button>
            <button className="px-4 py-2 text-sm font-semibold text-white border bg-white/20 backdrop-blur-md rounded-xl border-white/30 hover:bg-white/30">Use points</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { name: 'Amazon gift card', cost: 1000, value: 10, icon: '📦' },
          { name: 'Statement credit', cost: 5000, value: 50, icon: '💵' },
          { name: 'Travel voucher', cost: 10000, value: 120, icon: '✈️' },
        ].map((r, i) => (
          <div key={i} className="p-5 border bg-white/70 backdrop-blur-md border-white/80 rounded-2xl">
            <div className="mb-2 text-3xl">{r.icon}</div>
            <div className="font-semibold text-slate-900">{r.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{r.cost.toLocaleString()} pts · ${r.value} value</div>
            <button className="w-full py-2 mt-3 text-xs font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-800">Redeem</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ NOTIFICATIONS ============
function NotificationsPanel({ onClose }) {
  const notifs = [
    { type: 'approval', title: 'Card request from Aisha', sub: 'AWS subscription · $500/mo', time: '2m ago', color: 'bg-[#eff6ff]0' },
    { type: 'alert', title: 'Marketing budget at 92%', sub: '$960 remaining this month', time: '1h ago', color: 'bg-[#fffbeb]0' },
    { type: 'success', title: 'Shopify payout received', sub: '$4,820.00 to Operating pool', time: '3h ago', color: 'bg-[#ecfdf5]0' },
    { type: 'insight', title: 'New AI insight ready', sub: 'Subscription leak detected', time: '5h ago', color: 'bg-[#eff6ff]0' },
  ];
  return (
    <div className="absolute right-0 z-50 overflow-hidden bg-white border shadow-2xl top-12 w-80 rounded-2xl border-slate-100 fade-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h3 className="font-bold font-display text-slate-900">Notifications</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
      </div>
      <div className="overflow-y-auto max-h-96">
        {notifs.map((n, i) => (
          <div key={i} className="flex gap-3 px-4 py-3 border-b hover:bg-slate-50 border-slate-50">
            <div className={`w-2 h-2 rounded-full ${n.color} mt-2 flex-shrink-0`} />
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">{n.title}</div>
              <div className="text-xs text-slate-500">{n.sub}</div>
              <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileMenu({ onClose, mode }) {
  return (
    <div className="absolute right-0 z-50 w-64 overflow-hidden bg-white border shadow-2xl top-12 rounded-2xl border-slate-100 fade-up">
      <div className="p-4 border-b bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8]">K</div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Kobe Bryant</div>
            <div className="text-xs text-slate-500">kobe@example.com</div>
          </div>
        </div>
      </div>
      <div className="p-1">
        {['Account settings', 'Switch organization', 'Refer a friend', 'Help center', 'Sign out'].map(o => (
          <button key={o} onClick={onClose} className="w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-slate-50">{o}</button>
        ))}
      </div>
    </div>
  );
}

// ============ CONNECT MODAL ============
function ConnectModal({ onClose }) {
  const [step, setStep] = useState('select');
  const [provider, setProvider] = useState(null);

  const options = [
    { name: 'Bank account', desc: 'Plaid · 12,000+ US banks · 3,000+ EU banks', icon: '🏦', id: 'bank' },
    { name: 'Shopify', desc: 'Auto-sync sales, refunds, payouts', icon: '🛍️', id: 'shopify' },
    { name: 'WooCommerce', desc: 'Connect WordPress stores', icon: '🛒', id: 'woo' },
    { name: 'Stripe', desc: 'Card payments & subscriptions', icon: '💳', id: 'stripe' },
    { name: 'PayPal', desc: 'Send & receive globally', icon: '🅿️', id: 'paypal' },
    { name: 'Amazon Seller', desc: 'Marketplace orders & fees', icon: '📦', id: 'amazon' },
    { name: 'QuickBooks', desc: 'Auto categorize transactions', icon: '📊', id: 'qb' },
    { name: 'Xero', desc: 'Cloud accounting', icon: '📈', id: 'xero' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col fade-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900">
              {step === 'select' && 'Connect an account'}
              {step === 'auth' && `Connecting ${provider?.name}`}
              {step === 'success' && 'All set!'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {step === 'select' && 'Bank-grade security · 256-bit encryption'}
              {step === 'auth' && 'Authenticating securely…'}
              {step === 'success' && 'Your data is syncing now'}
            </p>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100"><X className="w-4 h-4 text-slate-500" /></button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {step === 'select' && (
            <div className="grid grid-cols-2 gap-3">
              {options.map(o => (
                <button key={o.id} onClick={() => { setProvider(o); setStep('auth'); setTimeout(() => setStep('success'), 1800); }} className="flex items-center gap-3 p-4 text-left transition border border-slate-200 rounded-2xl hover:border-[#93c5fd] hover:bg-[#eff6ff]/30">
                  <div className="text-3xl">{o.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{o.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{o.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {step === 'auth' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 text-5xl">{provider?.icon}</div>
              <div className="font-semibold text-slate-900">Securely connecting to {provider?.name}…</div>
              <Loader2 className="w-6 h-6 mt-4 text-[#3b82f6] animate-spin" />
              <div className="flex items-center gap-2 mt-6 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Encrypted end-to-end · Read-only access
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#d1fae5]">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900">{provider?.name} connected!</h3>
              <p className="max-w-xs mt-1 text-sm text-slate-600">Your transactions and balances will appear in a few moments.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#3b82f6]/30">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}