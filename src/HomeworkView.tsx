import React, { useState, useRef, useEffect } from 'react';
import {
  Home, BookOpen, Mic, Sparkles, FileText,
  Upload, ChevronDown, X, Plus,
  ArrowLeft, Send, Paperclip, ArrowUp, ChevronRight, Check,
  Play,
  Wand2, FileSearch, Download,
  Loader2, BookMarked,
  Award, Headphones,
    History as HistoryIcon,

} from 'lucide-react';
// then use <HistoryIcon size={15} /> everywhere

// ─── App.tsx design tokens ────────────────────────────────────────────────────
const KIRA_BG = 'url("/MainBG.png") center right / cover no-repeat';
const KIRA_BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
};

const KIRA_ACTIVE_BG =
  'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)';

// Active glow blobs (matching App.tsx sidebar)
function GlowBlobs() {
  return (
    <>
      <div style={{ position: 'absolute', width: 75, height: 75, borderRadius: '50%', right: -20, top: -6, background: '#22D3EE', opacity: 0.8, filter: 'blur(24px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', right: -30, top: -29, background: '#60A5FA', opacity: 0.6, filter: 'blur(24px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', right: -50, top: -35, background: '#A855F7', opacity: 1, filter: 'blur(15px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 146, height: 47, borderRadius: '50%', left: -87, top: 39, background: '#A855F7', opacity: 1, filter: 'blur(15px)', pointerEvents: 'none' }} />
    </>
  );
}

// Kira AI brand logo
function KiraLogo({ size = 36, className = '' }: { size?: any; className?: any }) {
  const sparkle = (cx: number, cy: number, r: number): string => {
    const i = r * 0.22;
    return `M ${cx} ${cy - r} Q ${cx + i} ${cy - i} ${cx + r} ${cy} Q ${cx + i} ${cy + i} ${cx} ${cy + r} Q ${cx - i} ${cy + i} ${cx - r} ${cy} Q ${cx - i} ${cy - i} ${cx} ${cy - r} Z`;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M 22 14 C 58 14 58 86 22 86 C 16 86 16 14 22 14 Z" fill="#2541F2" />
      <path d="M 54 52 C 54 18 56 14 88 14 C 88 50 86 52 54 52 Z" fill="#2541F2" />
      <path d="M 54 56 C 86 56 88 56 88 88 C 56 88 54 88 54 56 Z" fill="#2541F2" />
      <path d={sparkle(30, 44, 8)} fill="white" />
      <path d={sparkle(39, 57, 11)} fill="white" />
      <path d={sparkle(26, 70, 6)} fill="white" />
    </svg>
  );
}


export default function KiraAI() {
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Solver state
  const [solverTab, setSolverTab] = useState('Solver');
  const [solverInput, setSolverInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [modalNote, setModalNote] = useState('');
  const [solveResult, setSolveResult] = useState<any>(null);
  const [solving, setSolving] = useState(false);

  // Humanizer state
  const [humanizerText, setHumanizerText] = useState('');
  const [humanizerResult, setHumanizerResult] = useState<any>(null);
  const [humanizing, setHumanizing] = useState(false);
  const [humanizerStyle, setHumanizerStyle] = useState('Original');

  // Live Notes state
  const [notesView, setNotesView] = useState('list');
  const [recording, setRecording] = useState(false);

  // Study set state
  const [studyView, setStudyView] = useState('list');
  const [studyTab, setStudyTab] = useState('Home');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('Flashcards');
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [podcastList, setPodcastList] = useState<Array<{id: number; title: string; date: string; status: string; isNew: boolean}>>([
    { id: 1, title: 'Algebraic Foundations and Systems of Equations', date: '2026/05/16, 15:48', status: 'ready', isNew: true },
  ]);
  const [createFlow, setCreateFlow] = useState<'session' | 'source' | 'name' | 'loading' | null>(null);
  const [createFlowMode, setCreateFlowMode] = useState('flashcard');
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetColor, setNewSetColor] = useState('#a855f7');
  const [newSetFormat, setNewSetFormat] = useState('Flashcard');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'study', label: 'AI Study', icon: BookOpen },
    { id: 'notes', label: 'AI Live Notes', icon: Mic },
    { id: 'humanizer', label: 'AI Humanizer', icon: Sparkles },
    { id: 'predictor', label: 'Exam Predictor', icon: FileText },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setShowSolveModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolveSend = () => {
    setShowSolveModal(false);
    setSolving(true);
    setSolveResult({ status: 'analyzing', image: uploadedImage, question: modalNote || 'solve this math problem' });
    setTimeout(() => { setSolveResult((p: any) => ({ ...p, status: 'answer' })); setSolving(false); }, 2500);
  };

  const handleHumanize = () => {
    if (!humanizerText.trim()) return;
    setHumanizing(true);
    setHumanizerResult({ status: 'processing' });
    setTimeout(() => {
      const humanized = "Spring is the relief we've been waiting for when the air finally loses its bite. You start seeing those first pops of color in the garden, and suddenly the trees aren't just bare sticks anymore. It's the kind of weather that really pulls you outside. I've noticed people just seem lighter and more awake once the sun starts sticking around later in the evening. It feels like a nice reset for everyone, a simple reminder that things can finally start over and grow again.";
      setHumanizerResult({ status: 'done', text: humanized, words: humanized.split(' ').length, detected: 5 });
      setHumanizing(false);
    }, 3000);
  };

  const trySample = () => {
    setHumanizerText("Spring is a beautiful season that brings warmth and new life to the environment. During this time, flowers begin to bloom and trees turn green again. The weather becomes more pleasant, and people often spend more time outdoors. Many individuals feel happier and more energetic as the days grow longer. Spring also represents a fresh start and new opportunities for growth and development. Overall, it is a season that has a positive impact on both nature and human emotions.");
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', fontFamily: "'Outfit', system-ui, sans-serif", overflow: 'hidden', background: KIRA_BG, position: 'relative' }}>
      {/* Background gradient blobs (matching App.tsx) */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, background: 'radial-gradient(ellipse at top right,rgba(196,181,253,0.45) 0%,rgba(147,197,253,0.35) 40%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, background: 'radial-gradient(ellipse at top right,rgba(216,180,254,0.4) 0%,rgba(186,230,253,0.3) 50%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── SIDEBAR (App.tsx style) ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <aside style={{ width: 210, minWidth: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '18px 10px', gap: 2, position: 'relative', zIndex: 1, borderRight: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)' }}>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 14px', borderBottom: '1px solid rgba(17,24,39,0.07)', marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', ...KIRA_BTN_BLUE }}>
              <KiraLogo size={20} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Kira AI</span>
            <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 0, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
              <X size={16} />
            </button>
          </div>

          {/* Nav items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setNotesView('list'); setSolveResult(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, width: '100%',
                    background: active ? KIRA_ACTIVE_BG : 'transparent', border: 'none', cursor: 'pointer',
                    color: active ? '#4f46e5' : '#696D7D', fontSize: 13, fontWeight: active ? 600 : 400,
                    position: 'relative', overflow: 'hidden', transition: 'all 0.15s', fontFamily: "'Outfit', system-ui, sans-serif",
                    textAlign: 'left', marginBottom: 2,
                  }}
                >
                  {active && <GlowBlobs />}
                  <Icon size={15} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
                  <span style={{ flex: 1, textAlign: 'left', position: 'relative', zIndex: 1 }}>{item.label}</span>
                </button>
              );
            })}
          </div>

          
        </aside>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(17,24,39,0.08)', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </button>
        )}

        {/* ── HEADER (App.tsx style) */}
        {!(activePage === 'study' && studyView === 'detail') && !(activePage === 'notes' && notesView === 'detail') && (
          <AppHeader />
        )}

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {activePage === 'home' && !solveResult && (
            <HomePage
              tab={solverTab} setTab={setSolverTab}
              input={solverInput} setInput={setSolverInput}
              onUpload={() => fileInputRef.current?.click()}
              onSolve={() => {
                if (uploadedImage) { setShowSolveModal(true); }
                else if (solverInput.trim()) {
                  setSolveResult({ status: 'analyzing', question: solverInput });
                  setSolving(true);
                  setTimeout(() => { setSolveResult((p: any) => ({...p, status:'answer'})); setSolving(false); }, 2500);
                }
              }}
            />
          )}

          {activePage === 'home' && solveResult && (
            <ChatPage result={solveResult} solving={solving} onNew={() => { setSolveResult(null); setUploadedImage(null); setSolverInput(''); }} />
          )}

          {activePage === 'study' && studyView === 'list' && (
            <StudyPage
              onOpenSet={() => { setStudyView('detail'); setStudyTab('Home'); }}
              onCreateTool={(mode: string) => { setCreateFlowMode(mode); setCreateFlow('session'); }}
            />
          )}
          {activePage === 'study' && studyView === 'detail' && (
            <StudySetDetailPage
              tab={studyTab} setTab={setStudyTab}
              onBack={() => setStudyView('list')}
              onStartTopic={() => setShowActivityModal(true)}
              podcastList={podcastList}
              onCreatePodcast={() => setShowPodcastModal(true)}
            />
          )}
          {activePage === 'notes' && notesView === 'list' && <NotesListPage onNew={() => setNotesView('detail')} />}
          {activePage === 'notes' && notesView === 'detail' && (
            <NotesDetailPage
              recording={recording} setRecording={setRecording}
              onBack={() => setNotesView('list')}
            />
          )}
          {activePage === 'humanizer' && (
            <HumanizerPage
              text={humanizerText} setText={setHumanizerText}
              result={humanizerResult} humanizing={humanizing}
              onHumanize={handleHumanize} onSample={trySample}
              style={humanizerStyle} setStyle={setHumanizerStyle}
            />
          )}
          {activePage === 'predictor' && <PredictorPage />}

          <input type="file" ref={fileInputRef} accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleImageUpload} />
        </div>
      </main>

      {/* Solve modal */}
      {showSolveModal && uploadedImage && (
        <SolveModal image={uploadedImage} note={modalNote} setNote={setModalNote} onClose={() => setShowSolveModal(false)} onSend={handleSolveSend} />
      )}

      {showActivityModal && (
        <ActivityPickerModal selected={selectedActivity} setSelected={setSelectedActivity} onClose={() => setShowActivityModal(false)} onContinue={() => { setShowActivityModal(false); setStudyTab(selectedActivity); }} />
      )}

      {showPodcastModal && (
        <CreatePodcastModal
          onClose={() => setShowPodcastModal(false)}
          onCreate={(podcast: any) => {
            setPodcastList(prev => [{ ...podcast, id: Date.now(), status: 'generating', isNew: false }, ...prev]);
            setShowPodcastModal(false);
            setTimeout(() => { setPodcastList(prev => prev.map((p, i) => i === 0 ? { ...p, status: 'ready', isNew: true } : p)); }, 4000);
          }}
        />
      )}

      {createFlow === 'session' && (<NewSessionModal mode={createFlowMode} onClose={() => setCreateFlow(null)} onCreateNew={() => setCreateFlow('source')} onSelectExisting={() => { setCreateFlow(null); setStudyView('detail'); setStudyTab('Home'); }} />)}
      {createFlow === 'source' && (<CreateFromModal onClose={() => setCreateFlow(null)} onBack={() => setCreateFlow('session')} onContinue={() => setCreateFlow('name')} />)}
      {createFlow === 'name' && (<NameYourSetModal title={newSetTitle} setTitle={setNewSetTitle} color={newSetColor} setColor={setNewSetColor} format={newSetFormat} setFormat={setNewSetFormat} mode={createFlowMode} onClose={() => setCreateFlow(null)} onCreate={() => setCreateFlow('loading')} />)}
      {createFlow === 'loading' && (<CreatingLoader title={newSetTitle || 'Your new study set'} onDone={() => { setCreateFlow(null); setStudyView('detail'); setStudyTab('Home'); setNewSetTitle(''); }} />)}
    </div>
  );
}

// ── APP HEADER (matches App.tsx DashboardView header) ────────────────────────
function AppHeader() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Day' : 'Good Evening';

  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid rgba(17,24,39,0.08)', position: 'relative', zIndex: 10, flexShrink: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{greeting}, Kobe!</h1>
        <p style={{ fontSize: 13, color: '#696D7D', margin: 0, fontWeight: 400 }}>Nice to see you again.</p>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Activity Log */}
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 14, background: 'white', border: '1.5px solid rgba(17,24,39,0.1)', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <img src="/ActivityLog.png" alt="" style={{ width: 18, height: 18 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          Activity Log
        </button>
        {/* New Task */}
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 14, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 0, ...KIRA_BTN_BLUE }}>
          <img src="/NewTask.png" alt="" style={{ width: 18, height: 18 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          New Task
        </button>

        <div style={{ width: 1, height: 28, background: 'rgba(17,24,39,0.1)', margin: '0 4px' }} />

        {/* Bell */}
        <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src="/bell.png" alt="Notifications" style={{ width: 22, height: 22 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'; }} />
        </button>
        {/* Settings */}
        <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src="/setting.png" alt="Settings" style={{ width: 22, height: 22 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </button>
        {/* Profile */}
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
          <img src="/profile.png" alt="Profile" style={{ objectFit: 'cover', width: '100%', height: '100%' }} onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = 'none'; el.parentElement!.style.background = 'linear-gradient(135deg,#6c5ce7,#a78bfa)'; el.parentElement!.innerHTML = '<span style="color:white;font-weight:700;font-size:14px">K</span>'; }} />
        </div>
      </div>
    </header>
  );
}

// ── Shared card style helper ──────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(14px)',
  borderRadius: 20,
  border: '1px solid rgba(17,24,39,0.08)',
  boxShadow: '0 2px 8px rgba(14,10,46,0.06)',
};

// ── Shared blue button helper ─────────────────────────────────────────────────
const blueBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 18px', borderRadius: 12, color: 'white',
  fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
  fontFamily: "'Outfit', system-ui, sans-serif", ...KIRA_BTN_BLUE,
};

// ============ HOME PAGE (Solver) ============
function HomePage({ tab, setTab, input, setInput, onUpload, onSolve }: any) {
  const tabs = [
    { id: 'Solver', icon: '✦' },
    { id: 'Flashcard', icon: '🎴' },
    { id: 'Quiz', icon: '📝' },
    { id: 'Study Guide', icon: '📚' },
    { id: 'Mock Exam', icon: '🎯' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,24,39,0.08)', color: '#696D7D', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          <HistoryIcon size={15} /> History
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px 40px' }}>
        {/* Hero */}
       <div style={{ width: '100%', maxWidth: 700, marginBottom: 28, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 24px rgba(14,10,46,0.12)', position: 'relative' }}>
  <div style={{ width: '100%', height: 220, position: 'relative' }}>
    {/* Unsplash studying/tutoring image */}
    <img
      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=220&fit=crop&crop=center"
      alt="Students studying"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
    {/* Dark overlay so text stays readable */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(14,10,46,0.35) 0%, rgba(14,10,46,0.65) 100%)' }} />
    {/* "Learn anything" label at top center */}
    <p style={{ position: 'absolute', top: 16, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
      Learn anything
    </p>
  </div>
  {/* Bottom text overlay */}
  <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, color: 'white' }}>
    <p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>A patient tutor in your pocket — for every subject</p>
  </div>
</div>

        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 6px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kira</h1>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 12px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your personal study companion</h2>
          <p style={{ color: '#696D7D', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={15} color="#3b82f6" /> Get instant, reliable study help <Sparkles size={15} color="#3b82f6" />
          </p>
        </div>

        {/* Tabs */}
        <div style={{ width: '100%', maxWidth: 700 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: '12px 12px 0 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: tab === t.id ? '1px solid rgba(17,24,39,0.08)' : '1px solid transparent', borderBottom: tab === t.id ? '1px solid white' : '1px solid transparent', background: tab === t.id ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.4)', color: tab === t.id ? '#111827' : '#696D7D' }}>
                <span>{t.icon}</span><span>{t.id}</span>
              </button>
            ))}
          </div>

          {/* Card */}
          <div style={{ ...cardStyle, borderRadius: '0 12px 20px 20px', padding: 20 }}>
            <div onClick={onUpload} style={{ border: '2px dashed rgba(59,130,246,0.4)', borderRadius: 14, padding: '28px 16px', textAlign: 'center', marginBottom: 14, cursor: 'pointer' }}>
              <p style={{ margin: 0, fontSize: 14 }}>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>Choose file</span>
                <span style={{ color: '#696D7D' }}> or drag & drop to upload</span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>Support type: image, pdf, word, excel, ppt and txt</p>
            </div>

            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or upload your questions"
              style={{ width: '100%', background: 'transparent', outline: 'none', resize: 'none', fontSize: 14, color: '#111827', marginBottom: 14, border: 0, fontFamily: 'inherit', boxSizing: 'border-box' }} rows={2} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(17,24,39,0.08)', color: '#696D7D', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Sparkles size={14} /> Screenshot
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: 'rgba(243,244,246,0.9)', border: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                  <KiraLogo size={18} /><span style={{ fontWeight: 600 }}>Kira AI</span><ChevronDown size={13} />
                </button>
                <button onClick={onSolve} style={{ padding: '9px 24px', borderRadius: 999, color: 'white', fontWeight: 600, fontSize: 13, border: 0, cursor: input.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', ...KIRA_BTN_BLUE, opacity: input.trim() ? 1 : 0.6 }}>
                  Solve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CHAT / RESULT PAGE ============
function ChatPage({ result, onNew }: any) {
  const [input, setInput] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [videoCooking, setVideoCooking] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [followups, setFollowups] = useState<Array<{role: 'user' | 'ai'; text?: string; thinking?: boolean}>>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result?.status === 'answer' && !videoCooking && !videoReady) {
      const t1 = setTimeout(() => setVideoCooking(true), 1000);
      const t2 = setTimeout(() => { setVideoReady(true); setVideoCooking(false); }, 8000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [result?.status]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [followups]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('why') || q.includes('explain') || q.includes('how')) return "Great question! The key insight is using the algebraic identity (s − t)² = s² + t² − 2st. We know s² + t² = 41 from the second equation, and we derived st = 20 from the first. Substituting: (s − t)² = 41 − 2(20) = 1.";
    if (q.includes('another') || q.includes('similar') || q.includes('practice')) return "Sure! Try this: If x + y = 7 and xy = 12, find (x − y)². Hint: use (x − y)² = (x + y)² − 4xy. Let me know what you get!";
    return "Good question. Based on the problem, the answer is (s − t)² = 1. The trick is recognizing that you don't need to solve for s and t individually. Want me to walk through another approach?";
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setFollowups(prev => [...prev, { role: 'user', text }, { role: 'ai', thinking: true }]);
    setTimeout(() => {
      setFollowups(prev => prev.map((m, i, arr) => i === arr.length - 1 && m.thinking ? { role: 'ai', text: generateResponse(text), thinking: false } : m));
    }, 1200);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '12px 24px', flexShrink: 0 }}>
        <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,24,39,0.08)', color: '#696D7D', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> New question
        </button>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,24,39,0.08)', color: '#696D7D', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <HistoryIcon size={15} /> History
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: 'rgba(251,191,36,0.15)', color: '#92400e', fontSize: 13, fontWeight: 600 }}>
          ∞ Unlimited
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 16px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* User question */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <div style={{ maxWidth: '60%', background: 'rgba(59,130,246,0.08)', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p style={{ fontSize: 14, color: '#1e3a8a', margin: 0 }}>{result.question}</p>
              {result.image && <img src={result.image} alt="question" style={{ borderRadius: 10, maxHeight: 180, marginTop: 8 }} />}
            </div>
          </div>

          {result.status === 'analyzing' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20 }}>
              <KiraLogo size={28} />
              <div>
                <p style={{ fontWeight: 700, marginBottom: 4, color: '#111827', fontSize: 14 }}>Kira AI</p>
                <p style={{ color: '#696D7D', fontSize: 13 }}>Analyzing question concepts...</p>
              </div>
            </div>
          )}

          {result.status === 'answer' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <KiraLogo size={28} />
                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: 14 }}>Kira AI</p>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>thought for 1s ▾</span>
              </div>

              {/* Final answer */}
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ color: '#10b981', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Final Answer</h2>
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '16px 20px' }}>
                  <p style={{ fontStyle: 'italic', fontSize: 22, fontFamily: 'serif', margin: 0 }}>(s − t)² = <strong style={{ fontStyle: 'normal' }}>1</strong></p>
                </div>
              </div>

              <VideoCard ready={videoReady} cooking={videoCooking} playing={videoPlaying} setPlaying={setVideoPlaying} />

              {/* Feedback card */}
              <div style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0' }}>
                <div>
                  <p style={{ fontWeight: 700, margin: '0 0 2px', fontSize: 14 }}>Was this answer helpful?</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Your feedback helps me learn and get smarter for you 🙏</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(17,24,39,0.1)', background: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>👍 Yes</button>
                  <button style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(17,24,39,0.1)', background: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>👎 No</button>
                </div>
              </div>

              {/* Explanation */}
              <div>
                <h2 style={{ color: '#3b82f6', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Explanation</h2>
                <p style={{ fontWeight: 700, marginBottom: 16 }}>Solving for the squared difference <em>(s − t)²</em></p>
                <div style={{ borderLeft: '2px solid rgba(17,24,39,0.1)', paddingLeft: 40, marginLeft: 12 }}>
                  {[
                    { num: 1, title: 'Identifying the product of the variables', content: 'We start with 20/t = s. Multiplying both sides by t: st = 20' },
                    { num: 2, title: 'Expanding the target expression', content: '(s − t)² = s² − 2st + t² = (s² + t²) − 2st' },
                    { num: 3, title: 'Substituting known values', content: '(s − t)² = 41 − 2(20) = 41 − 40 = 1' },
                  ].map(step => (
                    <div key={step.num} style={{ position: 'relative', marginBottom: 24 }}>
                      <div style={{ position: 'absolute', left: -52, top: 2, width: 24, height: 24, borderRadius: '50%', background: '#3b82f6', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step.num}</div>
                      <p style={{ fontWeight: 700, marginBottom: 8 }}>{step.title}</p>
                      <div style={{ ...cardStyle, borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: 16 }}>{step.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {followups.map((m, i) => (
            m.role === 'user' ? (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <div style={{ maxWidth: '60%', background: 'rgba(59,130,246,0.08)', borderRadius: '16px 16px 4px 16px', padding: '12px 16px', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <p style={{ fontSize: 14, color: '#1e3a8a', margin: 0, whiteSpace: 'pre-wrap' }}>{m.text}</p>
                </div>
              </div>
            ) : (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                <KiraLogo size={26} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4, color: '#111827', fontSize: 13 }}>Kira AI</p>
                  {m.thinking ? <p style={{ color: '#696D7D', fontSize: 13 }}>Thinking...</p> : <p style={{ fontSize: 14, lineHeight: 1.6, color: '#374151' }}>{m.text}</p>}
                </div>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom input */}
      <div style={{ borderTop: '1px solid rgba(17,24,39,0.08)', padding: '12px 24px', flexShrink: 0, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ ...cardStyle, borderRadius: 16, padding: '8px 8px 8px 16px', border: '1.5px solid rgba(59,130,246,0.3)' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type text, or add images or a PDF by uploading, pasting, or dragging here"
              style={{ width: '100%', background: 'transparent', outline: 'none', border: 0, fontSize: 14, color: '#111827', padding: '8px 0', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'transparent', border: 0, color: '#696D7D', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Paperclip size={15} /> Upload File
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'rgba(243,244,246,0.9)', border: 0, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                  <KiraLogo size={18} /><span style={{ fontWeight: 600 }}>Kira AI</span><ChevronDown size={13} />
                </button>
                <button onClick={handleSend} disabled={!input.trim()} style={{ width: 36, height: 36, borderRadius: '50%', border: 0, color: 'white', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(input.trim() ? KIRA_BTN_BLUE : { background: '#d1d5db' }) }}>
                  <ArrowUp size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ ready, cooking, playing, setPlaying }: any) {
  if (!ready && !cooking) {
    return (
      <div style={{ ...cardStyle, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ width: 120, height: 76, background: 'linear-gradient(135deg, #1e3a8a, #1e40af)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Loader2 color="white" size={22} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <div>
          <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14 }}>Video Explanation</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Preparing your video...</p>
        </div>
      </div>
    );
  }
  if (cooking) {
    return (
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(17,24,39,0.08)', marginBottom: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ width: 44, height: 44, margin: '0 auto 12px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Cooking up your video</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Ready in ~60s</p>
          </div>
        </div>
        <div style={{ padding: '12px 16px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>Video Explanation</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Guided, step-by-step solution</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(17,24,39,0.08)', background: 'white', marginBottom: 16 }}>
      <div style={{ background: '#0f172a', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }} onClick={() => setPlaying(!playing)}>
        <div style={{ fontFamily: 'serif', color: '#67e8f9', fontSize: 18, padding: 20, border: '1px solid #22d3ee', borderRadius: 12 }}>
          <div>{'{'} 20/t = s</div>
          <div style={{ marginLeft: 12 }}>s² + t² = 41</div>
          <div style={{ color: '#f9a8d4', marginTop: 8 }}>Find: (s − t)² = ?</div>
        </div>
        {!playing && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play color="#0f172a" size={24} />
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={13} color="white" />
          </div>
          <p style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>Video Explanation Ready</p>
        </div>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Guided, step-by-step solution</p>
      </div>
    </div>
  );
}

// ============ SOLVE MODAL ============
function SolveModal({ image, note, setNote, onClose, onSend }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 520, width: '100%', padding: 24, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 0, cursor: 'pointer', color: '#9ca3af' }}><X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', ...KIRA_BTN_BLUE }}>
            <KiraLogo size={26} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#111827' }}>Send this question for solving?</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, background: 'rgba(243,244,246,0.9)', borderRadius: 14, padding: 14 }}>
          <img src={image} alt="question" style={{ maxHeight: 200, borderRadius: 10, border: '2px solid #3b82f6' }} />
        </div>
        <div style={{ border: '1.5px solid rgba(59,130,246,0.4)', borderRadius: 14, padding: 12, marginBottom: 14 }}>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="(Optional) Provide a question, specific formulas, conditions, or your preferred approach here."
            style={{ width: '100%', outline: 'none', resize: 'none', fontSize: 13, border: 0, fontFamily: 'inherit', boxSizing: 'border-box' }} rows={3} maxLength={250} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>{note.length} / 250</span>
          </div>
        </div>
        <button onClick={onSend} style={{ width: '100%', padding: '12px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Send</button>
      </div>
    </div>
  );
}

// ============ STUDY PAGE ============
function StudyPage({ onOpenSet, onCreateTool }: any) {
  const tools = [
    { id: 'flashcard', label: 'Flashcard', sub: 'Flip to memorize', icon: '🃏', gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)' },
    { id: 'quiz', label: 'Quiz', sub: 'Practice makes perfect', icon: '📋', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)' },
    { id: 'podcast', label: 'Podcast', sub: 'Listen and learn', icon: '🎧', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #3b82f6 100%)' },
    { id: 'guide', label: 'Study guide', sub: 'Summarize with clarity', icon: '📚', gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)' },
    { id: 'exam', label: 'Exam predictor', sub: 'Study what matters', icon: '🎯', gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)' },
    { id: 'cheat', label: 'Cheat sheet', sub: 'Crack the exam', icon: '📄', gradient: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%)' },
  ];

  return (
<div style={{ height: '100%', overflowY: 'auto' }}>
<div style={{ padding: 28, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#111827' }}>Jump back in</h2>
      <div style={{ ...cardStyle, padding: '18px 22px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, margin: '0 0 8px', color: '#111827' }}>Algebraic Foundations and Systems of Equations</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#696D7D' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookMarked size={13} color="#3b82f6" /> 3 flashcards</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FileText size={13} color="#3b82f6" /> 44 quiz questions</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Headphones size={13} color="#3b82f6" /> 2 podcasts</span>
            <span style={{ marginLeft: 'auto' }}>0% mastered</span>
          </div>
          <div style={{ marginTop: 8, height: 4, background: 'rgba(17,24,39,0.07)', borderRadius: 4 }}><div style={{ height: 4, width: '0%', background: '#3b82f6', borderRadius: 4 }} /></div>
        </div>
        <button onClick={onOpenSet} style={{ ...blueBtnStyle, borderRadius: 999, whiteSpace: 'nowrap' }}>Continue learning</button>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#111827' }}>Quick tools</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {tools.map((tool, _idx) => (
          <button key={tool.id} onClick={() => onCreateTool(tool.id)} style={{ background: tool.gradient, borderRadius: 20, padding: '18px 20px', textAlign: 'left', border: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 6px 20px rgba(14,10,46,0.18)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(14,10,46,0.24)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(14,10,46,0.18)'; }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ color: 'white' }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{tool.label}</h3>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.25)' }}>{tool.sub}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{tool.icon}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0, color: '#111827' }}>Recent study sets</h2>
        <button style={{ color: '#3b82f6', fontWeight: 600, fontSize: 13, background: 'transparent', border: 0, cursor: 'pointer' }}>View all</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <button onClick={() => onCreateTool('flashcard')} style={{ ...cardStyle, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 110, border: '1.5px dashed rgba(59,130,246,0.3)', cursor: 'pointer', background: 'rgba(255,255,255,0.6)' }}>
          <div style={{ width: 38, height: 38, background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Plus size={18} /></div>
          <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14 }}>New study set</span>
        </button>
        <button onClick={onOpenSet} style={{ ...cardStyle, padding: 18, textAlign: 'left', cursor: 'pointer', background: 'rgba(255,255,255,0.88)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#111827' }}>Algebraic Foundations and Systems of Equations</h3>
          <div style={{ height: 3, background: 'rgba(17,24,39,0.07)', borderRadius: 3, marginBottom: 6 }}><div style={{ height: 3, width: '20%', background: '#3b82f6', borderRadius: 3 }} /></div>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>1 topics ready</p>
        </button>
        <button onClick={onOpenSet} style={{ ...cardStyle, padding: 18, textAlign: 'left', cursor: 'pointer' }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#111827' }}>🍪 How to Ace Your Exam in 7 Days</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>K</div>
            <span style={{ fontSize: 13, color: '#696D7D' }}>Kira</span>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>20 flashcards</p>
        </button>
      </div>
    </div>
    </div>
  );
}

// ============ STUDY SET DETAIL ============
function StudySetDetailPage({ tab, setTab, onBack, onStartTopic, podcastList, onCreatePodcast }: any) {
  const tabs = ['Home', 'Study Guide', 'Flashcards', 'Quiz', 'Exam Predictor', 'Podcast'];
  const [knowledgeMap, setKnowledgeMap] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ padding: 8, borderRadius: 10, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ArrowLeft size={17} /></button>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={14} color="white" /></div>
          <h1 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#111827' }}>Algebraic Foundations and Systems of Equations</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <button onClick={() => setShowShareModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(17,24,39,0.1)', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}><Send size={13} /> Share</button>
          <button onClick={() => setShowCreateMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: 0, ...KIRA_BTN_BLUE }}><Sparkles size={13} /> Create</button>
          {showCreateMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowCreateMenu(false)} />
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 240, ...cardStyle, zIndex: 50, padding: 8 }}>
                {[
                  { label: 'Flashcards', icon: '🃏', target: 'Flashcards' },
                  { label: 'Quiz', icon: '📋', target: 'Quiz' },
                  { label: 'Study guide', icon: '📚', target: 'Study Guide' },
                  { label: 'Podcast', icon: '🎧', target: 'Podcast' },
                  { label: 'Exam predictor', icon: '🎯', target: 'Exam Predictor' },
                ].map(item => (
                  <button key={item.label} onClick={() => { setTab(item.target); setShowCreateMenu(false); if (item.label === 'Podcast') onCreatePodcast(); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', color: '#374151' }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</span>
                    <ChevronRight size={13} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} />}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: files */}
        <aside style={{ width: 280, borderRight: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(17,24,39,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700, margin: 0, fontSize: 14, color: '#111827' }}>Uploaded files <span style={{ color: '#9ca3af', fontWeight: 500 }}>(1)</span></h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: 'transparent', border: 0, cursor: 'pointer', color: '#696D7D', fontSize: 13, fontWeight: 500 }}><Plus size={13} /> Add file</button>
          </div>
          <div style={{ padding: 16, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ color: '#f59e0b' }}>📁</span>
              <span style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>Photos</span>
            </div>
            <div style={{ ...cardStyle, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 24, height: 24, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>1</div>
              <div style={{ background: 'rgba(243,244,246,0.9)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
                <div style={{ fontFamily: 'serif', fontSize: 22, color: '#374151', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 40, marginRight: 8 }}>{'{  '}</span>
                    <div>
                      <div><span style={{ borderBottom: '2px solid #374151', padding: '0 6px' }}>20</span>/<span style={{ padding: '0 6px' }}>t</span> = s</div>
                      <div>s² + t² = 41</div>
                      <div>(s − t)² = ?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: main */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div style={{ padding: '18px 28px 0', borderBottom: '1px solid rgba(17,24,39,0.08)', display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0, background: 'rgba(255,255,255,0.5)' }}>
            {tabs.map(t => {
              const active = tab === t;
              return (
                <button key={t} onClick={() => setTab(t)} style={{ paddingBottom: 14, fontSize: 13, fontWeight: 600, border: 'none', borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent', background: 'transparent', cursor: 'pointer', color: active ? '#3b82f6' : '#696D7D', fontFamily: 'inherit' }}>
                  {t}
                </button>
              );
            })}
          </div>

          {tab === 'Home' && (
            <div style={{ padding: '28px 28px', maxWidth: 700 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em', color: '#111827' }}>Your learning path is ready!</h1>
                  <p style={{ color: '#696D7D', margin: 0, fontSize: 14 }}><span style={{ color: '#3b82f6', fontWeight: 700 }}>1</span> core topics ready to explore</p>
                </div>
                <KiraMascot />
              </div>

              {/* Activity tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                {[{ icon: '✊', label: 'Learning' }, { icon: '📊', label: 'Exam' }, { icon: '📋', label: 'Quiz' }, { icon: '📡', label: 'Podcast' }].map(a => (
                  <button key={a.label} onClick={onStartTopic} style={{ ...cardStyle, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(17,24,39,0.08)', cursor: 'pointer', borderRadius: 14 }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{a.label}</span>
                  </button>
                ))}
              </div>

              {/* Knowledge map toggle */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                <button onClick={() => setKnowledgeMap(!knowledgeMap)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(17,24,39,0.1)', background: 'rgba(255,255,255,0.8)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                  <span>Knowledge map</span>
                  <div style={{ width: 36, height: 20, borderRadius: 999, background: knowledgeMap ? '#3b82f6' : 'rgba(17,24,39,0.15)', position: 'relative', transition: 'background 0.2s' }}>
                    <div style={{ position: 'absolute', top: 2, width: 16, height: 16, background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s', transform: knowledgeMap ? 'translateX(18px)' : 'translateX(2px)' }} />
                  </div>
                </button>
              </div>

              {/* Section */}
              <div style={{ background: 'rgba(243,244,246,0.8)', borderRadius: 18, padding: 18 }}>
                <button onClick={() => setSectionOpen(!sectionOpen)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 0, cursor: 'pointer', marginBottom: 14, fontFamily: 'inherit' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Section 1</p>
                    <h3 style={{ fontWeight: 700, fontSize: 18, margin: 0, color: '#111827' }}>Solving for (s-t)²</h3>
                  </div>
                  <span style={{ fontSize: 13, color: '#696D7D', display: 'flex', alignItems: 'center', gap: 4 }}>1 topics <ChevronDown size={13} /></span>
                </button>

                {sectionOpen && (
                  <div style={{ ...cardStyle, borderRadius: 16, padding: 16, border: '1.5px solid rgba(59,130,246,0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <p style={{ fontWeight: 700, margin: 0, fontSize: 14, color: '#111827' }}>Given System and Target Expression</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ color: '#fbbf24', fontSize: 16 }}>★</span>
                        <span style={{ color: '#d1d5db', fontSize: 16 }}>★</span>
                        <span style={{ color: '#d1d5db', fontSize: 16 }}>★</span>
                      </div>
                    </div>
                    <button onClick={onStartTopic} style={{ width: '100%', padding: '11px 0', borderRadius: 12, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Start topic</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'Study Guide' && <StudyGuideTab />}
          {tab === 'Podcast' && <PodcastTab list={podcastList} onCreate={onCreatePodcast} />}
          {tab === 'Quiz' && <QuizTab />}

          {tab !== 'Home' && tab !== 'Study Guide' && tab !== 'Podcast' && tab !== 'Quiz' && (
            <div style={{ padding: '40px 28px', maxWidth: 700 }}>
              <div style={{ ...cardStyle, padding: 36, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, margin: '0 auto 14px', background: 'rgba(59,130,246,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={24} color="#3b82f6" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#111827' }}>{tab}</h3>
                <p style={{ color: '#696D7D', margin: 0 }}>Your {tab.toLowerCase()} content for this study set appears here.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Chat panel */}
        <StudyChatPanel />
      </div>
    </div>
  );
}

// ── Study Chat Panel ──────────────────────────────────────────────────────────
function StudyChatPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', text: "Ask about this set anytime. I'll give 5-bullet summaries, define terms, and answer your questions based on the pages you uploaded." },
    { role: 'user', text: 'explain in' },
    { role: 'ai', math: true },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => { setMessages(prev => [...prev, { role: 'ai', text: "Let me work through that with you. Could you tell me which step you'd like to dive into first?" }]); }, 600);
  };

  if (collapsed) {
    return (
      <button onClick={() => setCollapsed(false)} style={{ width: 48, background: 'rgba(255,255,255,0.7)', borderLeft: '1px solid rgba(17,24,39,0.08)', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, gap: 10, cursor: 'pointer', color: '#696D7D' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, writingMode: 'vertical-rl', letterSpacing: '0.05em', color: '#696D7D' }}>AI Chat</span>
      </button>
    );
  }

  return (
    <aside style={{ width: 320, borderLeft: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(17,24,39,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111827' }}>AI Chat</h3>
        <button onClick={() => setCollapsed(true)} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: '#696D7D', padding: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {messages.map((m: any, i) => {
          if (m.role === 'system') return <p key={i} style={{ fontSize: 13, color: '#696D7D', lineHeight: 1.6 }}>{m.text}</p>;
          if (m.role === 'user') return (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
              <div style={{ background: 'rgba(59,130,246,0.08)', color: '#1e3a8a', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', fontSize: 13, maxWidth: '85%' }}>{m.text}</div>
            </div>
          );
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <KiraLogo size={22} />
                <p style={{ fontWeight: 700, fontSize: 13, margin: 0, color: '#111827' }}>Kira</p>
              </div>
              {m.math ? (
                <div style={{ fontSize: 13, lineHeight: 1.7, color: '#374151' }}>
                  <p>To find <em>(s − t)²</em>, use algebraic identities:</p>
                  <ol style={{ paddingLeft: 18, margin: '8px 0' }}>
                    <li>From 20/t = s: <em>st = 20</em></li>
                    <li>Given: <em>s² + t² = 41</em></li>
                  </ol>
                  <p>Expanding: <em>(s − t)² = (s² + t²) − 2st = 41 − 40 = <strong>1</strong></em></p>
                </div>
              ) : (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#374151', margin: 0 }}>{m.text}</p>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(17,24,39,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(243,244,246,0.9)', borderRadius: 999, padding: '6px 6px 6px 14px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask Kira anything..." style={{ flex: 1, background: 'transparent', outline: 'none', border: 0, fontSize: 13, color: '#111827', fontFamily: 'inherit' }} />
          <button onClick={handleSend} style={{ width: 32, height: 32, borderRadius: '50%', border: 0, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(input.trim() ? KIRA_BTN_BLUE : { background: '#d1d5db' }) }}>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ============ QUIZ TAB ============
function QuizTab() {
  const [view, setView] = useState('setup');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { prompt: 'Let s = 20/t and s² + t² = 41. What is the value of (s − t)²?', options: ['9', '41', '1', '0'], correct: 2 },
    { prompt: 'Which identity helps solve (s − t)²?', options: ['(a+b)²=a²+b²', '(a-b)²=a²+b²-2ab', 'a²-b²=(a+b)(a-b)', 'None'], correct: 1 },
  ];

  const q = questions[currentQ];
  const progress = ((currentQ + (submitted ? 1 : 0.4)) / questions.length) * 100;
  const isCorrect = submitted && selected === q.correct;

  if (view === 'setup') {
    return (
      <div style={{ padding: '32px 28px', maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 28, color: '#111827' }}>Pick your quiz vibe</h2>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 12px', borderRadius: 20, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🤖</div>
          <p style={{ fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', fontSize: 13 }}>SOLID</p>
        </div>
        <div style={{ position: 'relative', marginBottom: 32, padding: '0 8px' }}>
          <div style={{ height: 6, background: 'rgba(59,130,246,0.15)', borderRadius: 999 }}>
            <div style={{ height: 6, background: '#3b82f6', borderRadius: 999, width: '15%' }} />
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)', width: 18, height: 18, borderRadius: '50%', background: '#3b82f6', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
        </div>
        <button onClick={() => { setView('running'); setCurrentQ(0); setSelected(null); setSubmitted(false); }}
          style={{ width: '100%', padding: '14px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 15, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>
          Continue
        </button>
      </div>
    );
  }

  if (view === 'done') {
    return (
      <div style={{ padding: '40px 28px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, margin: '0 auto 16px', borderRadius: 24, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={32} color="#10b981" />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#111827' }}>Quiz complete!</h2>
        <p style={{ color: '#696D7D', marginBottom: 22 }}>Great work — review your answers or take another round.</p>
        <button onClick={() => setView('setup')} style={{ padding: '10px 28px', borderRadius: 999, color: 'white', fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Take another quiz</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 30, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderBottom: '1px solid rgba(17,24,39,0.07)', flexShrink: 0 }}>
        <button onClick={() => setView('setup')} style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        <div style={{ flex: 1, height: 6, background: 'rgba(17,24,39,0.07)', borderRadius: 999 }}>
          <div style={{ height: 6, background: '#3b82f6', borderRadius: 999, width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ ...cardStyle, padding: 24, marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#111827' }}>{q.prompt}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = 'rgba(59,130,246,0.05)';
                if (submitted) {
                  if (i === q.correct) bg = 'rgba(16,185,129,0.1)';
                  else if (i === selected) bg = 'rgba(239,68,68,0.08)';
                  else bg = 'rgba(243,244,246,0.8)';
                } else if (selected === i) bg = 'rgba(59,130,246,0.1)';
                return (
                  <button key={i} disabled={submitted} onClick={() => setSelected(i)}
                    style={{ padding: '13px 18px', borderRadius: 14, border: submitted && i === q.correct ? '1.5px solid rgba(16,185,129,0.4)' : submitted && i === selected ? '1.5px solid rgba(239,68,68,0.3)' : selected === i ? '1.5px solid rgba(59,130,246,0.4)' : '1.5px solid transparent', background: bg, fontSize: 14, fontWeight: 500, cursor: submitted ? 'default' : 'pointer', fontFamily: 'inherit', color: '#111827' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          {submitted && (
            <div style={{ ...cardStyle, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <KiraLogo size={24} />
                <p style={{ fontWeight: 700, margin: 0, fontSize: 14 }}>Kira</p>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#374151', margin: 0 }}>The correct answer is <strong>{q.options[q.correct]}</strong>. {isCorrect ? 'Great work!' : 'Using the identity (s-t)² = s² + t² - 2st, we substitute the known values to get the answer.'}</p>
            </div>
          )}
        </div>
      </div>

      {!submitted ? (
        <div style={{ padding: '12px 22px', borderTop: '1px solid rgba(17,24,39,0.07)', flexShrink: 0 }}>
          <button onClick={() => setSubmitted(true)} disabled={selected === null}
            style={{ width: '100%', padding: '13px 0', borderRadius: 14, fontWeight: 700, fontSize: 14, border: 0, cursor: selected !== null ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: selected !== null ? 'rgba(17,24,39,0.08)' : 'rgba(17,24,39,0.04)', color: selected !== null ? '#374151' : '#9ca3af' }}>
            Next
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', background: isCorrect ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', borderTop: '1px solid rgba(17,24,39,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16, color: isCorrect ? '#059669' : '#d97706' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: isCorrect ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCorrect ? <Check size={14} color="white" /> : <X size={14} color="white" />}
            </div>
            {isCorrect ? 'Way to go!' : 'Incorrect'}
          </div>
          <button onClick={() => { if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelected(null); setSubmitted(false); } else { setView('done'); } }}
            style={{ marginLeft: 'auto', padding: '10px 28px', borderRadius: 14, color: 'white', fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit', background: isCorrect ? '#10b981' : '#f59e0b' }}>
            {currentQ < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============ STUDY GUIDE TAB ============
function StudyGuideTab() {
  const [mode, setMode] = useState('Full Notes');

  return (
    <div style={{ padding: '22px 28px', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 999, color: 'white', fontWeight: 600, fontSize: 13, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>
          <Sparkles size={14} /> AI Tutor
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {['Full Notes', 'Summary'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, border: m === mode ? '1.5px solid rgba(59,130,246,0.4)' : '1px solid rgba(17,24,39,0.1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', background: m === mode ? 'rgba(59,130,246,0.07)' : 'rgba(255,255,255,0.8)', color: m === mode ? '#3b82f6' : '#696D7D' }}>
              {m}
            </button>
          ))}
          <button style={{ padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(17,24,39,0.08)', cursor: 'pointer', display: 'flex', color: '#696D7D' }}><Download size={15} /></button>
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: '#111827' }}>Solving for <em>(s − t)²</em></h2>
      <div style={{ height: 1, background: 'rgba(17,24,39,0.08)', margin: '14px 0' }} />
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18, color: '#111827' }}>Given System and Target Expression</h3>

      {mode === 'Full Notes' ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            { title: 'Given system', content: '20/t = s (i.e. st = 20) and s² + t² = 41' },
            { title: 'Target', content: 'Find (s − t)²' },
            { title: 'Key identity', content: '(s − t)² = s² + t² − 2st' },
            { title: 'Substitution', content: '(s − t)² = 41 − 2(20) = 41 − 40 = 1' },
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 16, fontSize: 14, lineHeight: 1.7 }}>
              <span style={{ color: '#9ca3af', marginTop: 4 }}>•</span>
              <div><strong>{item.title}:</strong> <em style={{ fontFamily: 'serif' }}>{item.content}</em></div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}>
          <p>Using the identity <em>(s − t)² = s² + t² − 2st</em>, substitute the values from the system:</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', gap: 10, marginBottom: 8 }}><span style={{ color: '#9ca3af' }}>•</span><em>s² + t² = 41</em></li>
            <li style={{ display: 'flex', gap: 10, marginBottom: 8 }}><span style={{ color: '#9ca3af' }}>•</span><em>st = 20</em></li>
          </ul>
          <p>This yields <em>(s − t)² = 41 − 40 = <strong>1</strong></em>.</p>
        </div>
      )}
    </div>
  );
}

// ============ PODCAST TAB ============
function PodcastTab({ list, onCreate }: any) {
  return (
    <div style={{ padding: '22px 28px', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, margin: 0, color: '#111827' }}>Podcast list</h2>
        <button onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 999, border: '1.5px solid rgba(59,130,246,0.3)', color: '#3b82f6', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'rgba(255,255,255,0.8)' }}>
          <Plus size={15} /> Create New Podcast
        </button>
      </div>
      {list.length === 0 ? (
        <div style={{ ...cardStyle, padding: 40, textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 14px', background: 'rgba(6,182,212,0.1)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={26} color="#06b6d4" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#111827' }}>No podcasts yet</h3>
          <p style={{ color: '#696D7D', marginBottom: 20 }}>Generate an AI-hosted audio walkthrough of this study set</p>
          <button onClick={onCreate} style={{ padding: '10px 24px', borderRadius: 999, color: 'white', fontWeight: 700, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Create your first podcast</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((p: any) => (
            <div key={p.id} style={{ background: 'rgba(243,244,246,0.8)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
              {p.isNew && (<span style={{ position: 'absolute', top: -8, left: -4, padding: '2px 10px', background: '#f97316', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 6 }}>New</span>)}
              <div style={{ width: 52, height: 52, borderRadius: 14, background: p.status === 'ready' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'rgba(17,24,39,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.status === 'ready' ? (
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#fce7f3', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👩</div>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#dbeafe', border: '2px solid white', marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>👨</div>
                  </div>
                ) : <Loader2 size={20} color="#9ca3af" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, margin: '0 0 3px', color: p.status === 'generating' ? '#9ca3af' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h3>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{p.date}</p>
              </div>
              {p.status === 'ready' && (
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, border: '1.5px solid rgba(59,130,246,0.3)', color: '#3b82f6', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'white' }}>
                  <Play size={13} /> Play
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ MODALS ============
function NewSessionModal({ mode, onClose, onCreateNew, onSelectExisting }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 600, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={16} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 22, color: '#111827' }}>New {mode} session</h2>
        <button onClick={onCreateNew} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 16, border: '1.5px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.04)', cursor: 'pointer', marginBottom: 18, fontFamily: 'inherit' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Plus size={20} /></div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontWeight: 700, color: '#3b82f6', margin: '0 0 2px', fontSize: 14 }}>Create new {mode}</p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Upload new materials</p>
          </div>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(17,24,39,0.08)' }} />
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(17,24,39,0.08)' }} />
        </div>
        <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: '#111827' }}>Select from history</h3>
        <button onClick={onSelectExisting} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'rgba(243,244,246,0.8)', border: 0, cursor: 'pointer', fontFamily: 'inherit', color: '#374151', fontSize: 14, fontWeight: 600 }}>
          <div style={{ width: 5, height: 22, background: '#8b5cf6', borderRadius: 3, flexShrink: 0 }} />
          Algebraic Foundations and Systems of Equations
        </button>
      </div>
    </div>
  );
}

function CreateFromModal({ onClose, onBack, onContinue }: any) {
  const [source, setSource] = useState('Files');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sources = ['Files', 'Text', 'YouTube Video', 'Audio', 'Google Drive'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 700, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={16} /></button>
        <button onClick={onBack} style={{ position: 'absolute', top: 18, left: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><ArrowLeft size={16} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 22, marginLeft: 32, color: '#111827' }}>Create from</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 18 }}>
          {sources.map(s => (
            <button key={s} onClick={() => setSource(s)} style={{ borderRadius: 16, padding: '14px 8px', border: s === source ? '1.5px solid rgba(59,130,246,0.4)' : '1px solid rgba(17,24,39,0.08)', background: s === source ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
              <span style={{ fontSize: 24 }}>{s === 'Files' ? '📄' : s === 'Text' ? '✏️' : s === 'YouTube Video' ? '▶️' : s === 'Audio' ? '🎵' : '☁️'}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: s === source ? '#3b82f6' : '#374151' }}>{s}</span>
            </button>
          ))}
        </div>
        {source === 'Files' && (
          <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed rgba(59,130,246,0.3)', borderRadius: 18, padding: '36px 20px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Upload size={32} color="#3b82f6" />
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 6px', color: '#111827' }}>Drag & drop files to upload</p>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 16px' }}>Supported types: PDF, Word, PPT, TXT, Images, Audio</p>
            <button style={{ padding: '8px 22px', borderRadius: 999, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontWeight: 600, fontSize: 13, border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Select file</button>
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={() => onContinue()} />
          </div>
        )}
        {source !== 'Files' && (
          <>
            {source === 'Text' && <textarea placeholder="Paste your text or notes here..." style={{ width: '100%', height: 150, padding: '12px 14px', border: '1.5px solid rgba(17,24,39,0.1)', borderRadius: 14, outline: 'none', resize: 'none', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
            {source === 'YouTube Video' && <input placeholder="Paste a YouTube link..." style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(17,24,39,0.1)', borderRadius: 14, outline: 'none', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />}
            <button onClick={onContinue} style={{ marginTop: 16, width: '100%', padding: '13px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Continue</button>
          </>
        )}
      </div>
    </div>
  );
}

function NameYourSetModal({ title, setTitle, color, setColor, format, setFormat, mode, onClose, onCreate }: any) {
  const colors = ['#a855f7','#3b82f6','#22c55e','#f97316','#fbbf24','#ef4444','#94a3b8','#ec4899','#06b6d4','#10b981','#eab308','#f43f5e'];
  const formats = [{ id: 'Study guide', icon: '📑' }, { id: 'Flashcard', icon: '🃏' }, { id: 'Quiz', icon: '📋' }];

  useEffect(() => { if (!title) { const titles: any = { flashcard: 'Flashcard Study Set', quiz: 'Quiz Practice Set', podcast: 'Podcast Study Set', guide: 'Study Guide', exam: 'Exam Prediction Set', cheat: 'Cheat Sheet' }; setTitle(titles[mode] || 'New study set'); } }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 540, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={16} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: '#111827' }}>Name your set</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Provide a title that captures the main topic or learning goal</p>
        <div style={{ background: 'rgba(243,244,246,0.9)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: color, flexShrink: 0 }} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, background: 'transparent', outline: 0, border: 0, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', color: '#111827' }} placeholder="Untitled set" />
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151' }}>Choose set color</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {colors.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: 8, background: c, border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none' }}>
              {color === c && <Check size={13} color="white" strokeWidth={3} />}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Choose study format</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          {formats.map(f => (
            <button key={f.id} onClick={() => setFormat(f.id)} style={{ borderRadius: 16, border: f.id === format ? '1.5px solid rgba(59,130,246,0.5)' : '1px solid rgba(17,24,39,0.08)', background: f.id === format ? 'rgba(59,130,246,0.07)' : 'rgba(243,244,246,0.8)', padding: '18px 10px', cursor: 'pointer', position: 'relative', fontFamily: 'inherit' }}>
              {f.id === format && <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color="white" strokeWidth={3} /></div>}
              <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 6 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, textAlign: 'center', margin: 0, fontSize: 13, color: f.id === format ? '#3b82f6' : '#374151' }}>{f.id}</p>
            </button>
          ))}
        </div>
        <button onClick={onCreate} style={{ width: '100%', padding: '13px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Create set</button>
      </div>
    </div>
  );
}

function CreatingLoader({ title, onDone }: any) {
  const [step, setStep] = useState(0);
  const steps = ['Analyzing', 'Breaking down complex topics', 'Calculating optimal learning sequence...', 'Building your personalized learning path...', `Finalizing study plan for ${title.slice(0, 30)}`];

  useEffect(() => {
    if (step < steps.length - 1) { const t = setTimeout(() => setStep(step + 1), 900); return () => clearTimeout(t); }
    else { const t = setTimeout(() => onDone(), 1200); return () => clearTimeout(t); }
  }, [step]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.98)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <div style={{ width: 160, height: 100, background: 'white', borderRadius: 20, border: '1px solid rgba(17,24,39,0.08)', boxShadow: '0 8px 24px rgba(14,10,46,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
            <div style={{ width: 60, height: 6, background: 'rgba(17,24,39,0.08)', borderRadius: 4 }} />
            <div style={{ width: 72, height: 6, background: 'rgba(17,24,39,0.08)', borderRadius: 4 }} />
            <div style={{ width: 48, height: 6, background: 'rgba(17,24,39,0.08)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', top: -10, right: -10, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...KIRA_BTN_BLUE }}>
              <Sparkles size={14} color="white" />
            </div>
          </div>
        </div>
        <div style={{ height: 5, background: 'rgba(17,24,39,0.07)', borderRadius: 999, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ height: 5, borderRadius: 999, width: `${((step + 1) / steps.length) * 100}%`, transition: 'width 0.6s', ...KIRA_BTN_BLUE }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...(i < step ? { ...KIRA_BTN_BLUE } : i === step ? { border: '2px solid #3b82f6', background: 'transparent' } : { border: '2px solid rgba(17,24,39,0.12)', background: 'transparent' }) }}>
                {i < step && <Check size={13} color="white" strokeWidth={3} />}
                {i === step && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: i < step ? '#111827' : i === step ? '#3b82f6' : '#9ca3af' }}>{s}</span>
              {i === step && <Loader2 size={15} color="#3b82f6" style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareModal({ onClose }: any) {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://kira.ai/s/algebraic-foundations-x7k2';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 480, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={16} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: '#111827' }}>Share study set</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Anyone with this link can study with Kira</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(243,244,246,0.9)', borderRadius: 14, padding: '8px 10px', marginBottom: 22 }}>
          <input readOnly value={shareUrl} style={{ flex: 1, background: 'transparent', border: 0, outline: 0, fontSize: 13, color: '#374151', fontFamily: 'inherit' }} />
          <button onClick={() => { navigator.clipboard?.writeText(shareUrl).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
            style={{ padding: '7px 16px', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...(copied ? { background: '#10b981' } : KIRA_BTN_BLUE) }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#374151' }}>Share via</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {[{ label: 'Email', icon: '✉️' }, { label: 'Messages', icon: '💬' }, { label: 'WhatsApp', icon: '📱' }, { label: 'X', icon: '🐦' }, { label: 'Discord', icon: '🎮' }, { label: 'More', icon: '•••' }].map(c => (
            <button key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 4px', borderRadius: 12, background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(243,244,246,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatePodcastModal({ onClose, onCreate }: any) {
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('Short (1-3 minutes)');
  const [instructions, setInstructions] = useState('');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 520, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={18} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 20, textAlign: 'center', marginBottom: 24, color: '#111827' }}>Create podcast</h2>
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block', color: '#374151' }}>Language</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', background: 'rgba(243,244,246,0.9)', borderRadius: 12, padding: '11px 14px', fontSize: 14, outline: 'none', border: '1px solid rgba(17,24,39,0.08)', fontFamily: 'inherit', color: '#111827', cursor: 'pointer' }}>
            {['English','Spanish','French','German','简体中文'].map(l => <option key={l}>{l}</option>)}
          </select>
        </label>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#374151' }}>Select Speakers</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ label: 'Host', emoji: '👩', name: 'Lexie', bg: '#fce7f3' }, { label: 'Guest', emoji: '👨', name: 'Noah', bg: '#dbeafe' }].map(s => (
              <div key={s.name} style={{ background: 'rgba(243,244,246,0.9)', borderRadius: 16, padding: 18, position: 'relative', textAlign: 'center' }}>
                <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 11, fontWeight: 700, background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: 6 }}>{s.label}</span>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: s.bg, margin: '12px auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{s.emoji}</div>
                <p style={{ fontWeight: 700, margin: 0, fontSize: 14, color: '#111827' }}>{s.name}</p>
              </div>
            ))}
          </div>
        </div>
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block', color: '#374151' }}>Duration</span>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', background: 'rgba(243,244,246,0.9)', borderRadius: 12, padding: '11px 14px', fontSize: 14, outline: 'none', border: '1px solid rgba(17,24,39,0.08)', fontFamily: 'inherit', color: '#111827', cursor: 'pointer' }}>
            {['Short (1-3 minutes)','Medium (3-7 minutes)','Long (7-15 minutes)'].map(d => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label style={{ display: 'block', marginBottom: 22 }}>
          <span style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block', color: '#374151' }}>Custom Instructions (Optional)</span>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Add instructions (optional)" rows={3}
            style={{ width: '100%', background: 'rgba(243,244,246,0.9)', borderRadius: 12, padding: '11px 14px', fontSize: 13, outline: 'none', border: '1px solid rgba(17,24,39,0.08)', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </label>
        <button onClick={() => onCreate({ title: 'Algebraic Foundations and Systems of Equations', date: new Date().toLocaleString() })}
          style={{ width: '100%', padding: '13px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>
          Continue
        </button>
      </div>
    </div>
  );
}

function ActivityPickerModal({ selected, setSelected, onClose, onContinue }: any) {
  const activities = [{ id: 'Flashcards', icon: '🃏', sub: '1/3', progress: 33 }, { id: 'Learning', icon: '✊', sub: '0/1', progress: 0 }, { id: 'Quiz', icon: '📋', sub: '0/4', progress: 0 }];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,10,46,0.5)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ ...cardStyle, maxWidth: 560, width: '100%', padding: 28, position: 'relative', borderRadius: 24 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(243,244,246,0.9)', border: 0, cursor: 'pointer', borderRadius: 8, padding: 6, color: '#696D7D' }}><X size={18} /></button>
        <h2 style={{ fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 24, color: '#111827' }}>Given System and Target Expression</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {activities.map(a => (
            <button key={a.id} onClick={() => setSelected(a.id)} style={{ borderRadius: 18, border: a.id === selected ? '1.5px solid rgba(59,130,246,0.5)' : '1px solid rgba(17,24,39,0.08)', background: a.id === selected ? 'rgba(59,130,246,0.07)' : 'rgba(243,244,246,0.8)', padding: '18px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}><span style={{ fontSize: 44 }}>{a.icon}</span></div>
              <p style={{ fontWeight: 700, textAlign: 'center', margin: '0 0 10px', fontSize: 14, color: a.id === selected ? '#3b82f6' : '#111827' }}>{a.id}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(17,24,39,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: 4, background: '#10b981', borderRadius: 4, width: `${a.progress}%` }} />
                </div>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{a.sub}</span>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onContinue} style={{ width: '100%', padding: '13px 0', borderRadius: 14, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Continue</button>
      </div>
    </div>
  );
}

// ============ LIVE NOTES ============
function NotesListPage({ onNew }: any) {
  return (
    <div style={{ overflowY: 'auto', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 42, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', margin: '0 0 6px', color: '#111827' }}>
        Generate <span style={{ color: '#3b82f6' }}>AI Notes</span> from
      </h1>
      <h1 style={{ fontSize: 42, fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', margin: '0 0 28px', background: 'linear-gradient(90deg, #c026d3, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        your Live Lectures
      </h1>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 15, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>
          <Mic size={17} /> Start Smart Note-taking
        </button>
        <span style={{ position: 'absolute', right: -60, top: -4, padding: '2px 8px', background: 'rgba(251,191,36,0.2)', color: '#92400e', fontSize: 11, fontWeight: 700, borderRadius: 999 }}>FREE Beta</span>
      </div>
      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginBottom: 32 }}>Ensure your audio recordings comply with legal and ethical standards</p>
      <div style={{ ...cardStyle, padding: 22, width: '100%', maxWidth: 680 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#111827' }}>All Notes (2)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1, 2].map(i => (
            <button key={i} onClick={onNew} style={{ background: 'rgba(59,130,246,0.06)', borderRadius: 14, padding: '14px 16px', textAlign: 'left', border: '1px solid rgba(59,130,246,0.15)', cursor: 'pointer', fontFamily: 'inherit' }}>
              <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14, color: '#111827' }}>Untitled</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>May 16, 2026</p>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, fontSize: 13, color: '#9ca3af' }}>
        <span>🌐 Multi-language support</span>
        <span>|</span>
        <button style={{ color: '#3b82f6', fontWeight: 600, background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13 }}>🛡️ Privacy Protection</button>
      </div>
    </div>
  );
}

function NotesDetailPage({ recording, setRecording, onBack }: any) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const askQuestions = ["What did professor just say?", "What are the most important concepts I should review from this lecture?", "What is the main idea of this lecture?"];

  const handleAsk = (q: string) => {
    setMessages((prev: any[]) => [...prev, { role: 'user', text: q }]);
    setTimeout(() => { setMessages((prev: any[]) => [...prev, { role: 'ai', text: "I'll help analyze the lecture content once you start recording. Tap Start Recording above to begin capturing audio." }]); }, 600);
  };

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* Left: recording */}
      <div style={{ width: 290, borderRight: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(17,24,39,0.08)', display: 'flex', justifyContent: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13, fontWeight: 600, border: '1px solid rgba(17,24,39,0.1)', borderRadius: 10, background: 'white', cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
            <Plus size={14} /> New Notes
          </button>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, background: 'transparent', border: 0, cursor: 'pointer', color: '#696D7D' }}><ArrowLeft size={17} /></button>
          <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 14, color: '#111827' }}>Untitled</h2>
          <div style={{ ...cardStyle, borderRadius: 16, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, height: 48 }}>
              {recording ? (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
                  {[1,2,3,4,5,6,7,8,9].map(i => (
                    <div key={i} style={{ width: 4, background: '#3b82f6', borderRadius: 3, height: `${20 + Math.sin(i * 0.8) * 20 + 10}px` }} />
                  ))}
                </div>
              ) : (
                <div style={{ width: '100%', borderTop: '2px dashed rgba(59,130,246,0.3)' }} />
              )}
            </div>
            <button onClick={() => setRecording(!recording)} style={{ width: '100%', padding: '11px 0', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...(recording ? { background: '#ef4444', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' } : KIRA_BTN_BLUE) }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: recording ? 'white' : '#ef4444' }} />
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[{ label: '🎤 Audio language', value: '🇺🇸 English' }, { label: '📝 Notes language', value: '🇨🇳 简体中文' }].map(f => (
              <div key={f.label} style={{ background: 'rgba(243,244,246,0.9)', borderRadius: 10, padding: '8px 10px' }}>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 600 }}>{f.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#111827' }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 14px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: '#111827' }}>Transcripts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(243,244,246,0.9)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <FileText size={20} color="#9ca3af" />
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 4px' }}>No transcripts yet</p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Start recording and transcribing</p>
          </div>
        </div>
      </div>

      {/* Center: notes */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(17,24,39,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'rgba(255,255,255,0.6)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111827' }}>✍️ Notes</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(17,24,39,0.1)', fontSize: 13, cursor: 'pointer', color: '#696D7D', fontFamily: 'inherit' }}>
            <Download size={13} /> Export
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[{ icon: FileText, label: 'Generate Notes', sub: 'AI-powered summaries', color: '#8b5cf6' }, { icon: Sparkles, label: 'Study Smart', sub: 'Generate study sets', color: '#3b82f6' }].map(item => {
              const Icon = item.icon;
              return (
                <button key={item.label} style={{ ...cardStyle, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)` }}><Icon size={16} color="white" /></div>
                  <div>
                    <p style={{ fontWeight: 700, margin: '0 0 2px', fontSize: 13, color: '#111827' }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{item.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 32 }}>Waiting for speech-to-text, you can also directly type in your notes.</p>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(17,24,39,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, flexShrink: 0 }}>
          <span style={{ color: '#696D7D' }}>T Body text ▾</span>
          <span style={{ color: '#9ca3af' }}>0 words</span>
        </div>
      </div>

      {/* Right: Ask Kira */}
      <div style={{ width: 280, borderLeft: '1px solid rgba(17,24,39,0.08)', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(17,24,39,0.08)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#111827' }}>Ask Kira</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <KiraLogo size={24} />
            <p style={{ fontWeight: 700, fontSize: 13, margin: 0, color: '#111827' }}>Kira</p>
          </div>
          <div style={{ background: 'rgba(243,244,246,0.9)', borderRadius: 14, padding: '10px 12px', marginBottom: 14, fontSize: 13, lineHeight: 1.6, color: '#374151' }}>
            👋 Hello! I am your AI assistant. Ask me anything about the session
          </div>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#111827' }}>You may ask:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {askQuestions.map((q, i) => (
              <button key={i} onClick={() => handleAsk(q)} style={{ ...cardStyle, borderRadius: 12, padding: '10px 12px', textAlign: 'left', border: '1px solid rgba(17,24,39,0.08)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: '#374151' }}>{q}</button>
            ))}
            {messages.map((m: any, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 12, fontSize: 13, ...(m.role === 'user' ? { ...KIRA_BTN_BLUE, color: 'white', marginLeft: 20 } : { background: 'rgba(243,244,246,0.9)', color: '#374151', marginRight: 20 }) }}>{m.text}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(17,24,39,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(243,244,246,0.9)', borderRadius: 999, padding: '6px 6px 6px 14px' }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && chatInput.trim()) { handleAsk(chatInput); setChatInput(''); } }}
              placeholder="Feel free to ask Kira anything..." style={{ flex: 1, background: 'transparent', outline: 0, border: 0, fontSize: 13, fontFamily: 'inherit', color: '#111827' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ HUMANIZER ============
function HumanizerPage({ text, setText, result, humanizing, onHumanize, onSample, style, setStyle }: any) {
  const [tab, setTab] = useState('text');
  const styles = ['Original', 'Natural', 'Academic', 'Simple', 'Informal', 'Expand'];

  return (
    <div style={{ overflowY: 'auto', padding: '24px 28px', maxWidth: 1100, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #2563eb, #7c3aed, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI Humanizer & Detector
      </h1>
      <p style={{ textAlign: 'center', color: '#696D7D', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Sparkles size={15} color="#8b5cf6" /> Check your text for AI — then rewrite it to sound human in one click <Sparkles size={15} color="#8b5cf6" />
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Left */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#111827' }}>Your draft</h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(17,24,39,0.1)', fontSize: 13, cursor: 'pointer', color: '#696D7D', fontFamily: 'inherit' }}>
              <HistoryIcon size={13} /> History
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[{ id: 'text', label: 'Text input', icon: FileText }, { id: 'upload', label: 'Upload files', icon: Upload }].map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, border: t.id === tab ? '1px solid rgba(17,24,39,0.1)' : 0, background: t.id === tab ? 'rgba(243,244,246,0.9)' : 'transparent', fontSize: 13, fontWeight: t.id === tab ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', color: '#374151' }}>
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>
          <div style={{ background: 'rgba(243,244,246,0.7)', borderRadius: 14, padding: 14, marginBottom: 14, minHeight: 250, position: 'relative' }}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here..."
              style={{ width: '100%', height: '100%', background: 'transparent', outline: 0, resize: 'none', minHeight: 230, border: 0, fontSize: 14, fontFamily: 'inherit', color: '#111827', boxSizing: 'border-box' }} />
            {!text && (
              <button onClick={onSample} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 999, background: 'white', border: '1px solid rgba(17,24,39,0.1)', boxShadow: '0 2px 8px rgba(14,10,46,0.06)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#374151', fontWeight: 600 }}>
                <Sparkles size={14} color="#3b82f6" /> Try a sample
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled={!text.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: text.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', background: text.trim() ? 'rgba(59,130,246,0.08)' : 'rgba(243,244,246,0.9)', color: text.trim() ? '#3b82f6' : '#9ca3af', border: 0 }}>
                <FileSearch size={13} /> Check for AI
              </button>
              <button onClick={onHumanize} disabled={!text.trim() || humanizing} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: text.trim() && !humanizing ? 'pointer' : 'not-allowed', fontFamily: 'inherit', border: 0, color: 'white', ...(text.trim() && !humanizing ? KIRA_BTN_BLUE : { background: '#d1d5db' }) }}>
                {humanizing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Wand2 size={13} />}
                {humanizing ? 'Humanizing...' : 'Humanize'}
              </button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#111827' }}>
            {result?.status === 'done' ? 'Humanized' : result?.status === 'processing' ? 'Humanizing...' : 'Result'}
          </h2>
          {!result && <p style={{ color: '#9ca3af', fontSize: 13 }}>Run AI check or humanize your text to see results here.</p>}
          {result?.status === 'processing' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {styles.map(s => <button key={s} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, background: s === 'Original' ? 'rgba(17,24,39,0.08)' : 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', color: '#696D7D' }}>{s}</button>)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Reviewing your draft', 'Checking for AI-like patterns', 'Improving flow and phrasing', 'Preparing the final version'].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    {i < 2 ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" /></div>
                      : i === 2 ? <Loader2 size={20} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                      : <div style={{ width: 20, height: 20, flexShrink: 0 }} />}
                    <span style={{ color: i === 2 ? '#3b82f6' : i < 2 ? '#374151' : '#9ca3af' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result?.status === 'done' && (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {styles.map(s => (
                  <button key={s} onClick={() => setStyle(s)} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', border: 0, ...(style === s ? { background: '#111827', color: 'white', fontWeight: 700 } : { background: 'rgba(243,244,246,0.9)', color: '#696D7D' }) }}>{s}</button>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginBottom: 16 }}>{result.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(17,24,39,0.08)' }}>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>{result.words} words</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#059669', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                  <Award size={13} /> {result.detected}% detected as AI
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ EXAM PREDICTOR ============
function PredictorPage() {
  const samples = [
    { id: 1, title: 'BIOL 1101: Introduction to Biology A', school: 'University of Pennsylvania', accuracy: '94%', exams: 2 },
    { id: 2, title: 'STATS 10: Introduction to Statistical Reasoning', school: 'University of California -LA', accuracy: '94%', exams: 2 },
    { id: 3, title: 'PSYCH 1: General Psychology', school: 'Santa Monica College', accuracy: '94%', exams: 2 },
  ];

  return (
<div style={{ height: '100%', overflowY: 'auto' }}>
    <div style={{ padding: '24px 28px', maxWidth: 900, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>      <h1 style={{ fontSize: 34, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#111827', letterSpacing: '-0.025em' }}>Let's predict your next exam</h1>
      <p style={{ textAlign: 'center', color: '#3b82f6', fontWeight: 600, marginBottom: 6 }}>Upload exam materials</p>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>Paste past exams, notes, and lecture slides to improve prediction accuracy</p>

      <div style={{ border: '2px dashed rgba(59,130,246,0.3)', borderRadius: 20, padding: '44px 20px', textAlign: 'center', marginBottom: 36 }}>
        <div style={{ width: 60, height: 60, background: 'rgba(59,130,246,0.1)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Upload size={26} color="#3b82f6" />
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#111827' }}>Drag & drop exam materials here</p>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 4px' }}>Supported types: PDF, Word, PPT, TXT, JPG, JPEG, PNG, HEIC, WebP</p>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 18px' }}>We can only process the first 50 pages of each file</p>
        <button style={{ padding: '10px 28px', borderRadius: 999, color: 'white', fontWeight: 700, fontSize: 14, border: 0, cursor: 'pointer', fontFamily: 'inherit', ...KIRA_BTN_BLUE }}>Select files</button>
      </div>

      <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: '#111827' }}>Nothing to upload? Try a real prediction</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {samples.map(s => (
          <div key={s.id} style={{ ...cardStyle, borderRadius: 18, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 140, background: 'rgba(243,244,246,0.9)', padding: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', background: '#3b82f6', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 999 }}>Final Exam</span>
              <div style={{ fontSize: 9, color: '#696D7D', fontFamily: 'monospace', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 700, margin: '0 0 4px' }}>Section 1: Multiple Choice</p>
                <p style={{ margin: '0 0 2px' }}>1. What is the primary function...</p>
                <p style={{ margin: '0 0 2px', paddingLeft: 8 }}>a) Protein synthesis</p>
                <p style={{ margin: '0 0 2px', paddingLeft: 8 }}>b) Energy production (ATP)</p>
              </div>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <h3 style={{ fontWeight: 700, fontSize: 13, margin: '0 0 4px', color: '#111827' }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 10px' }}>{s.school}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '3px 10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: 11, fontWeight: 600, borderRadius: 999 }}>{s.exams} Mock exams</span>
                <span style={{ padding: '3px 10px', background: 'rgba(245,158,11,0.1)', color: '#d97706', fontSize: 11, fontWeight: 600, borderRadius: 999 }}>{s.accuracy} Accuracy</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

// ── Kira mascot SVG ───────────────────────────────────────────────────────────
function KiraMascot() {
  return (
    <svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="furGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <g fill="#60a5fa" opacity="0.7">
        <path d="M 40 30 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 l 4 -2 z" />
        <path d="M 170 50 l 2 4 l 4 2 l -4 2 l -2 4 l -2 -4 l -4 -2 l 4 -2 z" />
      </g>
      <path d="M 65 65 L 55 35 L 80 55 Z" fill="url(#furGrad2)" />
      <path d="M 135 65 L 145 35 L 120 55 Z" fill="url(#furGrad2)" />
      <path d="M 67 60 L 62 45 L 75 55 Z" fill="#bfdbfe" />
      <path d="M 133 60 L 138 45 L 125 55 Z" fill="#bfdbfe" />
      <ellipse cx="100" cy="95" rx="45" ry="42" fill="url(#furGrad2)" />
      <ellipse cx="100" cy="105" rx="32" ry="28" fill="#dbeafe" />
      <circle cx="85" cy="92" r="7" fill="#1e293b" />
      <circle cx="115" cy="92" r="7" fill="#1e293b" />
      <circle cx="87" cy="89" r="2.5" fill="white" />
      <circle cx="117" cy="89" r="2.5" fill="white" />
      <ellipse cx="100" cy="108" rx="3" ry="2.5" fill="#1e293b" />
      <path d="M 100 110 Q 96 116 92 113" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 100 110 Q 104 116 108 113" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="155" cy="115" rx="14" ry="10" fill="url(#furGrad2)" transform="rotate(-20 155 115)" />
      <rect x="155" y="95" width="40" height="18" rx="3" fill="#fbbf24" transform="rotate(-15 175 104)" />
      <text x="175" y="107" textAnchor="middle" fontSize="7" fontWeight="800" fill="#78350f" transform="rotate(-15 175 104)">SUCCESS</text>
    </svg>
  );
}

// ── Global CSS for spin animation ─────────────────────────────────────────────
const globalStyle = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = globalStyle;
  document.head.appendChild(styleEl);
}