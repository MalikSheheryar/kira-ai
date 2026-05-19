/**
 * CoderView.tsx
 * Kira AI Code Studio — two-screen flow:
 *   1. HOME   — hero prompt, my projects, community templates (matches kira_coder1.html)
 *   2. STUDIO — left sidebar + chat pane + code/preview workspace
 *
 * Design tokens match App.tsx exactly (KIRA_BG, KIRA_BTN_BLUE, KIRA_CARD, GlowBlobs).
 */

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell,
  Settings,
  Code2,
  Eye,
  Monitor,
  Smartphone,
  Save,
  Upload,
  Plus,
  X,
  Home,
  LayoutGrid,
  GitBranch,
  Database,
  Globe,
  BarChart2,
  Key,
  Server,
  Star,
  Palette,
  Image as ImageIcon,
  Users,
  Mail,
  Bell as BellIcon,
  Rocket,
  RefreshCw,
  ExternalLink,
  Zap,
  FileCode,
  Map,
  ArrowLeft,
  Paperclip,
  Mic,
  Wrench,
  ChevronRight,
  Search,
  Layout,
  Send,
} from 'lucide-react'
// ─── Design tokens (mirrors App.tsx) ─────────────────────────────────────────
const KIRA_BG = 'url("/MainBG.png") center right / cover no-repeat'

const KIRA_BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}

const KIRA_CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 20,
  border: '1px solid rgba(17,24,39,0.07)',
}

// ─── Glow blobs (active sidebar item) ────────────────────────────────────────
function GlowBlobs() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: 75,
          height: 75,
          borderRadius: '50%',
          right: -20,
          top: -6,
          background: '#22D3EE',
          opacity: 0.8,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          right: -30,
          top: -29,
          background: '#60A5FA',
          opacity: 0.6,
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          right: -50,
          top: -35,
          background: '#A855F7',
          opacity: 1,
          filter: 'blur(15px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 146,
          height: 47,
          borderRadius: '50%',
          left: -87,
          top: 39,
          background: '#A855F7',
          opacity: 1,
          filter: 'blur(15px)',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
type SidePanel =
  | 'editor'
  | 'roadmap'
  | 'branding'
  | 'visual'
  | 'files'
  | 'users'
  | 'commerce'
  | 'email'
  | 'push'
  | 'domains'
  | 'mobile'
  | 'showcase'
  | 'analytics'
  | 'versions'
  | 'secrets'
  | 'database'
  | 'backend'
type Screen = 'home' | 'studio'

interface Project {
  id: string
  name: string
  desc: string
  lang: string
  langColor: string
  gradient: string
  updated: string
  stack: string
}

interface ChatMsg {
  role: 'user' | 'ai'
  text: string
  typing?: boolean
  files?: { name: string; action: 'added' | 'modified' }[]
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const MY_PROJECTS: Project[] = [
  {
    id: 'kanban',
    name: 'Kanban Pro',
    desc: 'Drag-and-drop task board with team columns',
    lang: 'React',
    langColor: '#61dafb',
    gradient: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)',
    updated: '2m ago',
    stack: 'React · Tailwind',
  },
  {
    id: 'crm',
    name: 'CRM Dashboard',
    desc: 'Customer management with analytics',
    lang: 'TypeScript',
    langColor: '#3178c6',
    gradient: 'linear-gradient(135deg,#042f2e 0%,#134e4a 50%,#06b6d4 100%)',
    updated: '1h ago',
    stack: 'Next.js · TypeScript',
  },
  {
    id: 'ecomm',
    name: 'Shop Frontend',
    desc: 'E-commerce storefront with cart',
    lang: 'JavaScript',
    langColor: '#f7df1e',
    gradient: 'linear-gradient(135deg,#7c2d12 0%,#c2410c 50%,#fbbf24 100%)',
    updated: 'Yesterday',
    stack: 'Vue · CSS',
  },
]

const COMMUNITY_TEMPLATES = [
  {
    id: 'landing',
    name: 'SaaS Landing',
    desc: 'Hero, features, pricing, CTA',
    category: 'saas',
    gradient: 'linear-gradient(135deg,#4c1d95 0%,#7c3aed 50%,#ec4899 100%)',
    stack: 'Next.js · Tailwind',
    stars: 847,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Site',
    desc: 'Minimalist personal portfolio',
    category: 'portfolio',
    gradient: 'linear-gradient(135deg,#14532d 0%,#15803d 50%,#84cc16 100%)',
    stack: 'React · CSS Modules',
    stars: 612,
  },
  {
    id: 'blog',
    name: 'Dev Blog',
    desc: 'Markdown blog with dark mode',
    category: 'tools',
    gradient: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)',
    stack: 'Astro · MDX',
    stars: 529,
  },
  {
    id: 'store',
    name: 'Product Store',
    desc: 'Grid, cart, Stripe checkout',
    category: 'commerce',
    gradient: 'linear-gradient(135deg,#7c2d12 0%,#c2410c 50%,#fbbf24 100%)',
    stack: 'Next.js · Stripe',
    stars: 1024,
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    desc: 'Charts, tables, sidebar nav',
    category: 'saas',
    gradient: 'linear-gradient(135deg,#042f2e 0%,#0f766e 100%)',
    stack: 'React · Recharts',
    stars: 783,
  },
  {
    id: 'todo',
    name: 'Todo App',
    desc: 'Full-stack todo with auth',
    category: 'tools',
    gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)',
    stack: 'Next.js · Prisma',
    stars: 349,
  },
]

// ─── Sample project files ─────────────────────────────────────────────────────
const SAMPLE_FILES: Record<string, { lang: string; body: string }> = {
  'index.html': {
    lang: 'html',
    body: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Kanban Pro</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="app-header">
    <h1>📋 Kanban Pro</h1>
    <button id="addTaskBtn">+ New Task</button>
  </header>
  <main class="board">
    <div class="column" data-status="todo">
      <h2>To Do</h2>
      <div class="cards"></div>
    </div>
    <div class="column" data-status="doing">
      <h2>In Progress</h2>
      <div class="cards"></div>
    </div>
    <div class="column" data-status="done">
      <h2>Done</h2>
      <div class="cards"></div>
    </div>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
  },
  'styles.css': {
    lang: 'css',
    body: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
  min-height: 100vh;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  padding: 28px 32px;
}
.column {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  min-height: 400px;
}
.card {
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 8px;
  cursor: grab;
}
.card:hover { border-color: #06b6d4; }`,
  },
  'app.js': {
    lang: 'js',
    body: `// Kanban Pro · drag-and-drop task board
const STORAGE_KEY = 'kanban-pro:tasks';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderBoard() {
  document.querySelectorAll('.cards').forEach(el => el.innerHTML = '');
  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = task.id;
    card.textContent = task.title;
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', task.id);
    });
    const col = document.querySelector(\`.column[data-status="\${task.status}"] .cards\`);
    if (col) col.appendChild(card);
  });
}

document.getElementById('addTaskBtn').addEventListener('click', () => {
  const title = prompt('What needs doing?');
  if (!title) return;
  tasks.push({ id: Date.now().toString(), title, status: 'todo' });
  saveTasks();
  renderBoard();
});

renderBoard();`,
  },
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────
function highlightLine(line: string, lang: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let s = esc(line)
  if (lang === 'html') {
    s = s.replace(
      /(\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;)/g,
      '<span style="color:#6b7280;font-style:italic">$1</span>',
    )
    s = s.replace(
      /(&lt;\/?)([\w-]+)/g,
      '$1<span style="color:#f472b6">$2</span>',
    )
    s = s.replace(
      /([\w-]+)=(&quot;[^&]*&quot;|"[^"]*")/g,
      '<span style="color:#fbbf24">$1</span>=<span style="color:#86efac">$2</span>',
    )
  } else if (lang === 'css') {
    s = s.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span style="color:#6b7280;font-style:italic">$1</span>',
    )
    s = s.replace(
      /([.#]?[\w-]+)\s*(?=\{)/g,
      '<span style="color:#f472b6">$1</span>',
    )
    s = s.replace(/([\w-]+)\s*:/g, '<span style="color:#fbbf24">$1</span>:')
  } else {
    s = s.replace(
      /(\/\/.*$)/gm,
      '<span style="color:#6b7280;font-style:italic">$1</span>',
    )
    s = s.replace(
      /(`[^`]*`|'[^']*'|"[^"]*")/g,
      '<span style="color:#86efac">$1</span>',
    )
    s = s.replace(
      /\b(const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await)\b/g,
      '<span style="color:#c084fc">$1</span>',
    )
    s = s.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#fb923c">$1</span>')
    s = s.replace(
      /\b([a-zA-Z_$][\w$]*)\s*\(/g,
      '<span style="color:#7dd3fc">$1</span>(',
    )
  }
  return s
}

function buildPreviewDoc(
  files: Record<string, { lang: string; body: string }>,
): string {
  const html = files['index.html']?.body || '<p>No index.html found.</p>'
  const css = files['styles.css']?.body || ''
  const js = files['app.js']?.body || ''
  let doc = html
  if (css) doc = doc.replace('</head>', `<style>${css}</style></head>`)
  if (js) doc = doc.replace('</body>', `<script>${js}</script></body>`)
  if (!doc.includes('</head>')) {
    doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${doc}<script>${js}<\/script></body></html>`
  }
  return doc
}

// ─── Studio sidebar nav ───────────────────────────────────────────────────────
const BUILD_NAV: {
  id: SidePanel
  label: string
  icon: React.ElementType
  badge?: string
}[] = [
  { id: 'editor', label: 'AI Editor', icon: Code2 },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'branding', label: 'Branding & SEO', icon: Star },
  { id: 'visual', label: 'Visual Editor', icon: Palette },
  { id: 'files', label: 'Files & Media', icon: ImageIcon },
  { id: 'users', label: 'Users & Access', icon: Users },
  { id: 'commerce', label: 'Commerce', icon: Zap, badge: 'Beta' },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'push', label: 'Push Notifications', icon: BellIcon },
]
const PUBLISH_NAV: { id: SidePanel; label: string; icon: React.ElementType }[] =
  [
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'showcase', label: 'Showcase', icon: Monitor },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ]
const ADVANCED_NAV: {
  id: SidePanel
  label: string
  icon: React.ElementType
  badge?: string
}[] = [
  { id: 'versions', label: 'Versions', icon: GitBranch, badge: 'v3' },
  { id: 'secrets', label: 'API Keys', icon: Key },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'backend', label: 'Backend', icon: Server },
]

// ─── Quick-start prompts ──────────────────────────────────────────────────────
const QUICK_CHIPS = [
  'Landing page',
  'Personal website',
  'SaaS App',
  'Blog',
  'E-commerce',
]

const QUICK_PROMPTS: Record<string, string> = {
  'Landing page':
    'A SaaS landing page for an AI writing assistant with pricing tiers',
  'Personal website':
    'A personal portfolio site with project showcase and contact form',
  'SaaS App': 'A Kanban-style task management app with drag-and-drop columns',
  Blog: 'A blog with markdown support, dark mode, and category filters',
  'E-commerce':
    'An e-commerce storefront with product grid, cart, and checkout',
}

const TEMPLATE_TABS = ['All', 'E-commerce', 'SaaS', 'Portfolio', 'Tools']

// ═════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function HomeScreen({
  onSubmit,
}: {
  onSubmit: (prompt: string, projectName: string) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [activeTemplateTab, setActiveTemplateTab] = useState('All')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const filteredTemplates = COMMUNITY_TEMPLATES.filter((t) => {
    if (activeTemplateTab === 'All') return true
    if (activeTemplateTab === 'E-commerce') return t.category === 'commerce'
    if (activeTemplateTab === 'SaaS') return t.category === 'saas'
    if (activeTemplateTab === 'Portfolio') return t.category === 'portfolio'
    if (activeTemplateTab === 'Tools') return t.category === 'tools'
    return true
  })

  const handleSubmit = () => {
    const v = prompt.trim()
    if (!v) return
    onSubmit(v, 'My Project')
  }

  const handleChip = (chip: string) => {
    const p = QUICK_PROMPTS[chip] || chip
    setPrompt(p)
    onSubmit(p, chip)
  }

  const fileDotColor: Record<string, string> = {
    React: '#61dafb',
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    'Next.js': '#000000',
    Vue: '#42b883',
    Astro: '#ff5d01',
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '48px 48px 48px',
        position: 'relative',
      }}
    >
      {/* Gradient backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1000px 500px at 50% -10%, rgba(99,102,241,0.18), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
        {/* ── Hero ── */}
        <section style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 16px',
              color: '#111827',
            }}
          >
            What can{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Kira
            </span>{' '}
            build for you?
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#696D7D',
              margin: '0 auto',
              maxWidth: 540,
            }}
          >
            Describe your app in plain English. We'll wire up the code, layouts,
            and logic so you can focus on the idea.
          </p>
        </section>

        {/* ── Prompt card ── */}
        <div
          style={{
            ...KIRA_CARD,
            padding: 20,
            marginBottom: 14,
            borderRadius: 16,
            transition: 'box-shadow .2s',
          }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            }}
            placeholder="A productivity dashboard with kanban boards, time tracking, and team chat..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 0,
              outline: 0,
              resize: 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: 15,
              color: '#111827',
              minHeight: 90,
              lineHeight: 1.5,
              boxSizing: 'border-box',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 3, flexWrap: 'nowrap' }}>
              {[
                { icon: Paperclip, label: 'Attach Image' },
                { icon: Wrench, label: 'Build mode' },
                { icon: Mic, label: 'Voice input' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => showToast(label)}
                  style={{
                    background: 'transparent',
                    border: 0,
                    padding: '5px 9px',
                    borderRadius: 7,
                    color: '#696D7D',
                    fontSize: 11.5,
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Icon size={13} /> {label !== 'Voice input' ? label : ''}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 0,
                display: 'grid',
                placeItems: 'center',
                cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                opacity: prompt.trim() ? 1 : 0.4,
                transition: 'all .15s',
                ...KIRA_BTN_BLUE,
              }}
            >
              <Send size={14} color="#fff" />
            </button>
          </div>
        </div>

        {/* ── Quick chips ── */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 52,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              color: '#9ca3af',
              fontSize: 12.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Try one <ChevronRight size={12} />
          </span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              style={{
                padding: '7px 14px',
                background: 'rgba(255,255,255,0.82)',
                border: '1px solid rgba(17,24,39,0.1)',
                borderRadius: 999,
                color: '#374151',
                fontSize: 12.5,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .15s',
                backdropFilter: 'blur(8px)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── My projects ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#111827',
              margin: 0,
            }}
          >
            My projects
          </h2>
          <button
            onClick={() => showToast('All projects')}
            style={{
              fontSize: 12.5,
              color: '#696D7D',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'inherit',
            }}
          >
            See all <ChevronRight size={12} />
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {MY_PROJECTS.map((p) => (
            <div
              key={p.id}
              onClick={() => onSubmit(`Continue building ${p.name}`, p.name)}
              style={{
                ...KIRA_CARD,
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all .2s',
                padding: 0,
              }}
            >
              {/* Thumb */}
              <div
                style={{
                  height: 130,
                  background: p.gradient,
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 30% 40%,rgba(255,255,255,0.15) 0%,transparent 40%), radial-gradient(circle at 70% 80%,rgba(255,255,255,0.08) 0%,transparent 50%)',
                  }}
                />
                <Code2
                  size={36}
                  color="rgba(255,255,255,0.9)"
                  style={{ position: 'relative', zIndex: 2 }}
                />
              </div>
              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: 3,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#696D7D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: fileDotColor[p.lang] || '#94a3b8',
                        display: 'inline-block',
                      }}
                    />
                    {p.lang}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: '#9ca3af',
                      display: 'inline-block',
                    }}
                  />
                  <span>{p.updated}</span>
                </div>
              </div>
            </div>
          ))}
          {/* New project card */}
          <div
            onClick={() => showToast('New project wizard')}
            style={{
              ...KIRA_CARD,
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all .2s',
              padding: 0,
              border: '1.5px dashed rgba(17,24,39,0.15)',
              background: 'rgba(255,255,255,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 188,
              gap: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                ...KIRA_BTN_BLUE,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Plus size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
              New project
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Start from scratch or a template
            </span>
          </div>
        </div>

        {/* ── Community templates ── */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#111827',
            margin: '0 0 0 0',
          }}
        >
          From the community
        </h2>

        {/* Template tabs */}
        <div
          style={{
            display: 'flex',
            gap: 22,
            borderBottom: '1px solid rgba(17,24,39,0.08)',
            marginBottom: 18,
            marginTop: 4,
          }}
        >
          {TEMPLATE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTemplateTab(tab)}
              style={{
                padding: '8px 0',
                background: 'transparent',
                border: 0,
                borderBottom: `2px solid ${activeTemplateTab === tab ? '#3b82f6' : 'transparent'}`,
                color: activeTemplateTab === tab ? '#3b82f6' : '#696D7D',
                fontSize: 13,
                fontWeight: activeTemplateTab === tab ? 600 : 500,
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .15s',
              }}
            >
              {tab}
              {tab === 'All' && (
                <span style={{ marginLeft: 4, fontSize: 11, color: '#9ca3af' }}>
                  12
                </span>
              )}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              onClick={() =>
                onSubmit(`Use the "${t.name}" template: ${t.desc}`, t.name)
              }
              style={{
                ...KIRA_CARD,
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all .2s',
                padding: 0,
              }}
            >
              <div
                style={{
                  height: 130,
                  background: t.gradient,
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 30% 40%,rgba(255,255,255,0.15) 0%,transparent 40%)',
                  }}
                />
                <Layout
                  size={36}
                  color="rgba(255,255,255,0.9)"
                  style={{ position: 'relative', zIndex: 2 }}
                />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: 3,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#696D7D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{t.stack}</span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: '#9ca3af',
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Star
                      size={10}
                      style={{ color: '#fbbf24', fill: '#fbbf24' }}
                    />{' '}
                    {t.stars}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(17,24,39,0.09)',
            color: '#111827',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 12px 32px rgba(17,24,39,0.12)',
            zIndex: 200,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#34d399' }}>✓</span> {toast}
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STUDIO SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function StudioScreen({
  projectName,
  onBack,
}: {
  projectName: string
  onBack: () => void
}) {
  const [activePanel, setActivePanel] = useState<SidePanel>('editor')
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const [currentFile, setCurrentFile] = useState('index.html')
  const [files, setFiles] = useState(SAMPLE_FILES)
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [saveState, setSaveState] = useState('All changes saved')
  const [toast, setToast] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  useEffect(() => {
    if (activeTab === 'preview' && iframeRef.current) {
      iframeRef.current.srcdoc = buildPreviewDoc(files)
    }
  }, [activeTab, files])

  const sendChat = () => {
    const v = chatInput.trim()
    if (!v) return
    setChatHistory((h) => [
      ...h,
      { role: 'user', text: v },
      { role: 'ai', typing: true, text: '' },
    ])
    setChatInput('')
    setTimeout(() => {
      setChatHistory((h) => {
        const next = h.filter((m) => !m.typing)
        return [
          ...next,
          {
            role: 'ai',
            text: `Done. I've updated <code>${currentFile}</code> based on your request. Review the preview to see the result — want to keep iterating?`,
            files: [{ name: currentFile, action: 'modified' }],
          },
        ]
      })
      showToast('Changes applied ✓')
    }, 1400)
  }

  const saveFile = () => {
    setSaveState('Saving…')
    setTimeout(() => {
      setSaveState('All changes saved')
      showToast('File saved')
      if (iframeRef.current) iframeRef.current.srcdoc = buildPreviewDoc(files)
    }, 400)
  }

  const fileDotColor: Record<string, string> = {
    html: '#e34c26',
    css: '#264de4',
    js: '#f7df1e',
    ts: '#3178c6',
    tsx: '#61dafb',
    jsx: '#61dafb',
  }

  // ── Sidebar nav button ──────────────────────────────────────────────────────
  const NavBtn = ({
    id,
    label,
    Icon,
    badge,
  }: {
    id: SidePanel
    label: string
    Icon: React.ElementType
    badge?: string
  }) => {
    const active = activePanel === id
    return (
      <button
        onClick={() => {
          setActivePanel(id)
          if (id === 'editor') setActiveTab('code')
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '9px 12px',
          borderRadius: 12,
          width: '100%',
          background: active
            ? 'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'
            : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: active ? '#4f46e5' : '#696D7D',
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.15s',
          fontFamily: "'Outfit', system-ui, sans-serif",
          textAlign: 'left',
        }}
      >
        {active && <GlowBlobs />}
        <Icon
          size={14}
          style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
        />
        <span style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          {label}
        </span>
        {badge && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              background: badge === 'Beta' ? 'rgba(0,217,199,0.15)' : '#fbbf24',
              color: badge === 'Beta' ? '#0d9488' : '#422006',
              border: badge === 'Beta' ? '1px solid #0d9488' : 'none',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {badge}
          </span>
        )}
      </button>
    )
  }

  // ── Panel helpers ───────────────────────────────────────────────────────────
  const SettingRow = ({
    icon: Icon,
    name,
    desc,
    children,
  }: {
    icon: React.ElementType
    name: string
    desc: string
    children?: React.ReactNode
  }) => (
    <div
      style={{
        ...KIRA_CARD,
        padding: '16px 18px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: 'rgba(79,70,229,0.1)',
          color: '#4f46e5',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#111827',
            marginBottom: 2,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 12.5, color: '#696D7D' }}>{desc}</div>
      </div>
      {children}
    </div>
  )

  const ActionBtn = ({
    label,
    onClick,
  }: {
    label: string
    onClick?: () => void
  }) => (
    <button
      onClick={onClick || (() => showToast(label))}
      style={{
        padding: '8px 16px',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        color: '#fff',
        border: 0,
        cursor: 'pointer',
        ...KIRA_BTN_BLUE,
      }}
    >
      {label}
    </button>
  )

  const SwitchToggle = ({ on }: { on?: boolean }) => {
    const [state, setState] = useState(on ?? true)
    return (
      <div
        onClick={() => setState(!state)}
        style={{
          width: 38,
          height: 22,
          borderRadius: 999,
          background: state
            ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)'
            : 'rgba(17,24,39,0.12)',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background .2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: state ? 18 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transition: 'left .2s',
          }}
        />
      </div>
    )
  }

  // ── Panel content ───────────────────────────────────────────────────────────
  const renderPanel = () => {
    const wrap: React.CSSProperties = {
      padding: 28,
      overflowY: 'auto',
      height: '100%',
    }
    const title: React.CSSProperties = {
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: -0.4,
      margin: '0 0 6px',
      color: '#111827',
    }
    const lead: React.CSSProperties = {
      color: '#696D7D',
      fontSize: 13.5,
      margin: '0 0 22px',
      maxWidth: 560,
    }

    switch (activePanel) {
      case 'roadmap':
        return (
          <div style={wrap}>
            <p style={title}>Roadmap</p>
            <p style={lead}>
              Plan what's next. Track features and prioritize the build order.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {['Backlog', 'In Progress', 'Shipped'].map((col, ci) => {
                const colors = ['#64748b', '#fbbf24', '#34d399']
                const items = [
                  ['User authentication', 'Email magic links'],
                  ['Onboarding tour', 'Mobile breakpoints'],
                  ['Initial scaffold', 'Drag-and-drop board'],
                ]
                return (
                  <div
                    key={col}
                    style={{ ...KIRA_CARD, padding: 14, borderRadius: 14 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        marginBottom: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#696D7D',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: colors[ci],
                        }}
                      />
                      {col}
                    </div>
                    {items[ci].map((t) => (
                      <div
                        key={t}
                        style={{
                          background: 'rgba(17,24,39,0.04)',
                          border: '1px solid rgba(17,24,39,0.07)',
                          borderRadius: 8,
                          padding: '9px 11px',
                          marginBottom: 8,
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: '#111827',
                          cursor: 'grab',
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => showToast('Roadmap item added')}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#fff',
                border: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                ...KIRA_BTN_BLUE,
              }}
            >
              <Plus size={13} /> Add roadmap item
            </button>
          </div>
        )

      case 'branding':
        return (
          <div style={wrap}>
            <p style={title}>Branding & SEO</p>
            <p style={lead}>
              Set the visual identity, social metadata, and search-engine
              snippets.
            </p>
            <SettingRow
              icon={Globe}
              name="Custom theme"
              desc="Brand colors, typography, dark mode"
            >
              <SwitchToggle />
            </SettingRow>
            <SettingRow
              icon={ImageIcon}
              name="Open Graph image"
              desc="Preview card shown when shared on social"
            >
              <ActionBtn label="Upload" />
            </SettingRow>
          </div>
        )

      case 'visual':
        return (
          <div style={wrap}>
            <p style={title}>Visual Editor</p>
            <p style={lead}>
              Click any element in the preview to edit it visually.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 260px',
                gap: 14,
              }}
            >
              <div
                style={{
                  ...KIRA_CARD,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  alignItems: 'flex-start',
                  borderRadius: 16,
                }}
              >
                {['h3', 'p', 'button'].map((tag, i) => (
                  <div
                    key={tag}
                    onClick={() => showToast(`${tag} selected`)}
                    style={{
                      position: 'relative',
                      padding: 6,
                      border: `1.5px ${i === 0 ? 'solid #4f46e5' : 'dashed rgba(17,24,39,0.15)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {tag === 'h3' && (
                      <h3
                        style={{
                          fontSize: 26,
                          fontWeight: 700,
                          margin: 0,
                          color: '#111827',
                        }}
                      >
                        Welcome to Kira
                      </h3>
                    )}
                    {tag === 'p' && (
                      <p style={{ fontSize: 14, color: '#696D7D', margin: 0 }}>
                        Build apps with AI, edit visually, ship instantly.
                      </p>
                    )}
                    {tag === 'button' && (
                      <button
                        style={{
                          padding: '8px 18px',
                          borderRadius: 8,
                          ...KIRA_BTN_BLUE,
                          color: '#fff',
                          border: 0,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Get started →
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ ...KIRA_CARD, padding: 16, borderRadius: 16 }}>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: '#696D7D',
                    marginBottom: 14,
                    fontWeight: 600,
                  }}
                >
                  Inspector · h3
                </div>
                {[
                  ['Text', 'Welcome to Kira'],
                  ['Font size', '28px'],
                  ['Weight', '700'],
                ].map(([l, v]) => (
                  <div key={l} style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11.5,
                        color: '#696D7D',
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      {l}
                    </label>
                    <input
                      defaultValue={v}
                      style={{
                        width: '100%',
                        background: 'rgba(243,244,246,0.8)',
                        border: '1px solid rgba(17,24,39,0.1)',
                        borderRadius: 7,
                        padding: '6px 10px',
                        fontSize: 12,
                        color: '#111827',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'files':
        return (
          <div style={wrap}>
            <p style={title}>Files & Media</p>
            <p style={lead}>
              All assets and source files attached to this project.
            </p>
            <SettingRow
              icon={Upload}
              name="Upload assets"
              desc="Drag-drop images, fonts, or data files"
            >
              <ActionBtn label="Browse" />
            </SettingRow>
          </div>
        )

      case 'users':
        return (
          <div style={wrap}>
            <p style={title}>Users & Access</p>
            <p style={lead}>
              Invite collaborators, manage permissions, and audit access.
            </p>
            <div style={{ ...KIRA_CARD, overflow: 'hidden', borderRadius: 14 }}>
              {[
                {
                  name: 'You',
                  email: 'you@kira.dev',
                  role: 'Owner',
                  color: '#f97316',
                  last: 'Now',
                },
                {
                  name: 'Sarah Chen',
                  email: 'sarah@team.io',
                  role: 'Admin',
                  color: '#06b6d4',
                  last: '2h ago',
                },
                {
                  name: 'Mike Ross',
                  email: 'mike@team.io',
                  role: 'Editor',
                  color: '#84cc16',
                  last: 'Yesterday',
                },
              ].map((u, i) => {
                const rColors: Record<string, string> = {
                  Owner: '#4f46e5',
                  Admin: '#0d9488',
                  Editor: '#f59e0b',
                }
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '13px 18px',
                      borderBottom:
                        i < 2 ? '1px solid rgba(17,24,39,0.05)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg,${u.color},${u.color}88)`,
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {u.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {u.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#696D7D' }}>
                        {u.email}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: (rColors[u.role] || '#9ca3af') + '18',
                        color: rColors[u.role] || '#9ca3af',
                        fontWeight: 600,
                      }}
                    >
                      {u.role}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: '#9ca3af',
                        minWidth: 60,
                        textAlign: 'right',
                      }}
                    >
                      {u.last}
                    </span>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => showToast('Invite link copied')}
              style={{
                marginTop: 14,
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#fff',
                border: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                ...KIRA_BTN_BLUE,
              }}
            >
              <Plus size={13} /> Invite member
            </button>
          </div>
        )

      case 'domains':
        return (
          <div style={wrap}>
            <p style={title}>Domains</p>
            <p style={lead}>
              Connect a custom domain or use the free Kira subdomain.
            </p>
            <SettingRow
              icon={Globe}
              name="kira.dev subdomain"
              desc={`${projectName.toLowerCase().replace(/\s+/g, '-')}.kira.dev — active`}
            >
              <SwitchToggle />
            </SettingRow>
            <SettingRow
              icon={Globe}
              name="Custom domain"
              desc="Add your own domain — instant SSL included"
            >
              <ActionBtn label="Add" />
            </SettingRow>
          </div>
        )

      case 'analytics':
        return (
          <div style={wrap}>
            <p style={title}>Analytics</p>
            <p style={lead}>
              Real-time visitor stats, top pages, conversion funnels.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                {
                  label: 'Visitors',
                  value: '2,847',
                  trend: '+12%',
                  color: '#4f46e5',
                },
                {
                  label: 'Page views',
                  value: '9,431',
                  trend: '+8%',
                  color: '#3b82f6',
                },
                {
                  label: 'Bounce rate',
                  value: '34%',
                  trend: '-2%',
                  color: '#10b981',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    ...KIRA_CARD,
                    padding: '18px 20px',
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{ fontSize: 12, color: '#696D7D', marginBottom: 8 }}
                  >
                    {s.label}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: s.color + '18',
                      color: s.color,
                    }}
                  >
                    {s.trend} this month
                  </span>
                </div>
              ))}
            </div>
            <SettingRow
              icon={BarChart2}
              name="Analytics enabled"
              desc="2,847 visitors this month · +12% vs last"
            >
              <ActionBtn label="View" />
            </SettingRow>
          </div>
        )

      case 'versions':
        return (
          <div style={wrap}>
            <p style={title}>Versions</p>
            <p style={lead}>
              Every save is versioned. Roll back, branch, or compare snapshots.
            </p>
            {[
              {
                v: 'v3',
                note: 'Current',
                desc: 'Saved 2 minutes ago · "Added dark mode toggle"',
                current: true,
              },
              {
                v: 'v2',
                note: '',
                desc: 'Yesterday · "Refactored layout grid"',
              },
              {
                v: 'v1',
                note: '',
                desc: '3 days ago · "Initial build from prompt"',
              },
            ].map((ver, i) => (
              <SettingRow
                key={i}
                icon={GitBranch}
                name={`${ver.v} ${ver.note}`}
                desc={ver.desc}
              >
                <ActionBtn
                  label={ver.current ? 'Diff' : 'Restore'}
                  onClick={() =>
                    showToast(
                      ver.current ? 'Opening diff…' : `Restoring ${ver.v}…`,
                    )
                  }
                />
              </SettingRow>
            ))}
          </div>
        )

      case 'secrets':
        return (
          <div style={wrap}>
            <p style={title}>API Keys</p>
            <p style={lead}>
              Securely store API keys. Encrypted at rest, exposed only at
              runtime.
            </p>
            <div
              style={{
                ...KIRA_CARD,
                overflow: 'hidden',
                borderRadius: 14,
                marginBottom: 14,
              }}
            >
              {[
                {
                  key: 'STRIPE_SECRET_KEY',
                  val: 'sk_live_••••••••••••••6Ht2',
                  env: 'Production',
                },
                {
                  key: 'OPENAI_API_KEY',
                  val: 'sk-proj-••••••••••••••V3jK',
                  env: 'All envs',
                },
                {
                  key: 'DATABASE_URL',
                  val: 'postgres://••••••••••••',
                  env: 'Production',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 18px',
                    borderBottom:
                      i < 2 ? '1px solid rgba(17,24,39,0.05)' : 'none',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12.5,
                  }}
                >
                  <span
                    style={{
                      color: '#c084fc',
                      fontWeight: 600,
                      flex: '0 0 200px',
                    }}
                  >
                    {s.key}
                  </span>
                  <span style={{ color: '#696D7D', flex: 1 }}>{s.val}</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      padding: '3px 8px',
                      borderRadius: 5,
                      background: 'rgba(17,24,39,0.05)',
                      color: '#696D7D',
                    }}
                  >
                    {s.env}
                  </span>
                  <button
                    onClick={() => showToast('Reveal disabled — use CLI')}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(17,24,39,0.1)',
                      color: '#696D7D',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      cursor: 'pointer',
                    }}
                  >
                    Reveal
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => showToast('Add a new API key')}
              style={{
                padding: '9px 16px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#fff',
                border: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                ...KIRA_BTN_BLUE,
              }}
            >
              <Plus size={13} /> Add API key
            </button>
          </div>
        )

      case 'database':
        return (
          <div style={wrap}>
            <p style={title}>Database</p>
            <p style={lead}>
              Tables, queries, and migrations. Type-safe access wired into your
              build.
            </p>
            <SettingRow
              icon={Database}
              name="No tables yet"
              desc="Create your first table to start storing data"
            >
              <ActionBtn label="Create Table" />
            </SettingRow>
          </div>
        )

      case 'backend':
        return (
          <div style={wrap}>
            <p style={title}>Backend</p>
            <p style={lead}>
              Serverless functions, scheduled jobs, and API routes.
            </p>
            <SettingRow
              icon={Server}
              name="12 serverless functions"
              desc="us-east-1 · Avg cold start 38ms · 99.97% uptime"
            >
              <ActionBtn label="Logs" />
            </SettingRow>
            <SettingRow
              icon={Server}
              name="Cron jobs (3)"
              desc="Daily backup · Weekly digest · Hourly health check"
            >
              <ActionBtn label="Configure" />
            </SettingRow>
          </div>
        )

      case 'commerce':
        return (
          <div style={wrap}>
            <p style={title}>
              Commerce{' '}
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(0,217,199,0.12)',
                  color: '#0d9488',
                  border: '1px solid #0d9488',
                  marginLeft: 8,
                  verticalAlign: 'middle',
                  fontWeight: 600,
                }}
              >
                Beta
              </span>
            </p>
            <p style={lead}>
              Sell anything — products, subscriptions, digital goods.
              Stripe-powered.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                {
                  label: 'Revenue',
                  value: '$12,847',
                  trend: '↑ 18.2%',
                  up: true,
                },
                { label: 'Orders', value: '142', trend: '↑ 8 today', up: true },
                {
                  label: 'Avg. order',
                  value: '$90.47',
                  trend: '↓ 2.1%',
                  up: false,
                },
                {
                  label: 'Conversion',
                  value: '3.4%',
                  trend: '↑ 0.4pp',
                  up: true,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{ ...KIRA_CARD, padding: 16, borderRadius: 14 }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: '#696D7D',
                      marginBottom: 6,
                    }}
                  >
                    {s.label}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: s.up ? '#34d399' : '#f87171',
                    }}
                  >
                    {s.trend}
                  </span>
                </div>
              ))}
            </div>
            <SettingRow
              icon={Zap}
              name="Products (24)"
              desc="Pro plan · Lifetime · Add-ons · Bundles"
            >
              <ActionBtn label="Manage" />
            </SettingRow>
            <SettingRow
              icon={Key}
              name="Stripe"
              desc="Connected · acct_••••6Ht2 · Live mode"
            >
              <SwitchToggle />
            </SettingRow>
          </div>
        )

      case 'email':
        return (
          <div style={wrap}>
            <p style={title}>Email</p>
            <p style={lead}>
              Transactional email, marketing campaigns, and lifecycle drips.
            </p>
            {[
              {
                title: 'Welcome email',
                meta: 'Sent on signup',
                status: 'Active',
                stat: '847 sent',
              },
              {
                title: 'Order receipt',
                meta: 'Sent on purchase',
                status: 'Active',
                stat: '142 sent',
              },
              {
                title: 'Weekly digest',
                meta: 'Mondays at 9am',
                status: 'Draft',
                stat: 'Not sent',
              },
            ].map((e, i) => (
              <div
                key={i}
                onClick={() => showToast(`Editing ${e.title}`)}
                style={{
                  ...KIRA_CARD,
                  padding: '13px 16px',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: 'rgba(79,70,229,0.1)',
                    color: '#4f46e5',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {e.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#696D7D' }}>
                    {e.meta} ·{' '}
                    <span
                      style={{
                        color: e.status === 'Active' ? '#34d399' : '#9ca3af',
                        fontWeight: 600,
                      }}
                    >
                      {e.status}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    color: '#696D7D',
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {e.stat}
                </span>
              </div>
            ))}
          </div>
        )

      case 'push':
        return (
          <div style={wrap}>
            <p style={title}>Push Notifications</p>
            <p style={lead}>
              Re-engage users with timely, relevant pushes across web and
              mobile.
            </p>
            <SettingRow
              icon={BellIcon}
              name="Web push enabled"
              desc="2,431 subscribers · 78% opt-in rate"
            >
              <SwitchToggle />
            </SettingRow>
            <SettingRow
              icon={Smartphone}
              name="iOS / Android push"
              desc="Configure APNs & FCM credentials"
            >
              <ActionBtn label="Setup" />
            </SettingRow>
          </div>
        )

      case 'mobile':
        return (
          <div style={wrap}>
            <p style={title}>Mobile</p>
            <p style={lead}>
              Wrap your web app as a native iOS & Android binary.
            </p>
            <SettingRow
              icon={Smartphone}
              name="iOS build"
              desc="Signed with Apple Distribution · TestFlight ready"
            >
              <ActionBtn label="Build" />
            </SettingRow>
            <SettingRow
              icon={Smartphone}
              name="Android build"
              desc="AAB bundle · Google Play Console ready"
            >
              <ActionBtn label="Build" />
            </SettingRow>
            <SettingRow
              icon={Rocket}
              name="Push to TestFlight"
              desc="v3 (build 47) · Last pushed 2 hours ago"
            >
              <ActionBtn label="Push" />
            </SettingRow>
          </div>
        )

      case 'showcase':
        return (
          <div style={wrap}>
            <p style={title}>Showcase</p>
            <p style={lead}>Share your build with the Kira community.</p>
            <div
              style={{
                ...KIRA_CARD,
                overflow: 'hidden',
                maxWidth: 460,
                marginBottom: 16,
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  height: 140,
                  background: 'linear-gradient(135deg,#4338ca,#7c3aed,#a78bfa)',
                }}
              />
              <div style={{ padding: '14px 18px' }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: 4,
                  }}
                >
                  {projectName}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: '#696D7D',
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  A modern drag-and-drop task board with team collaboration.
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['productivity', 'react', 'open-source'].map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 10.5,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: 'rgba(17,24,39,0.05)',
                        color: '#696D7D',
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <SettingRow
              icon={Star}
              name="Submit for featuring"
              desc="Editors review weekly · Featured projects get 10x traffic"
            >
              <ActionBtn label="Submit" />
            </SettingRow>
          </div>
        )

      default:
        return null
    }
  }

  // ── Code editor ─────────────────────────────────────────────────────────────
  const renderEditor = () => {
    const file = files[currentFile]
    if (!file) return null
    const lines = file.body.split('\n')
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#0d0d14',
        }}
      >
        {/* File tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(17,24,39,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            minHeight: 36,
            overflowX: 'auto',
          }}
        >
          {Object.keys(files).map((name) => {
            const lang = files[name].lang
            const dot = fileDotColor[lang] || '#94a3b8'
            const active = name === currentFile
            return (
              <button
                key={name}
                onClick={() => setCurrentFile(name)}
                style={{
                  padding: '7px 16px 7px 12px',
                  background: active ? '#0d0d14' : 'transparent',
                  border: 0,
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  color: active ? '#f4f4f6' : '#6b7280',
                  fontSize: 12.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderTop: active
                    ? '1px solid #4f46e5'
                    : '1px solid transparent',
                  marginTop: -1,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: dot,
                    flexShrink: 0,
                  }}
                />
                {name}
                <X
                  size={11}
                  style={{ color: '#4b5563', marginLeft: 4 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (Object.keys(files).length > 1) {
                      const next = { ...files }
                      delete next[name]
                      setFiles(next)
                      setCurrentFile(Object.keys(next)[0])
                    }
                  }}
                />
              </button>
            )
          })}
        </div>
        {/* Code */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr',
                minHeight: '1.6em',
              }}
            >
              <div
                style={{
                  textAlign: 'right',
                  color: '#4b5563',
                  padding: '0 14px 0 10px',
                  userSelect: 'none',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 12,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  padding: '0 14px',
                  whiteSpace: 'pre',
                  color: '#d4d4dc',
                }}
                dangerouslySetInnerHTML={{
                  __html: highlightLine(line, file.lang) || '\u00a0',
                }}
              />
            </div>
          ))}
        </div>
        {/* Status bar */}
        <div
          style={{
            background: 'rgba(17,24,39,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11.5,
            color: '#6b7280',
            gap: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minHeight: 28,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Code2 size={11} />
            {file.lang.toUpperCase()}
          </span>
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <span style={{ marginLeft: 'auto', color: '#34d399' }}>
            {saveState}
          </span>
          <button
            onClick={saveFile}
            style={{
              background: 'rgba(79,70,229,0.9)',
              color: '#fff',
              border: 0,
              padding: '3px 12px',
              borderRadius: 5,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Save size={10} /> Save
          </button>
        </div>
      </div>
    )
  }

  // ── Preview ─────────────────────────────────────────────────────────────────
  const renderPreview = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'rgba(243,244,246,0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.9)',
          borderBottom: '1px solid rgba(17,24,39,0.07)',
        }}
      >
        <button
          onClick={() => {
            if (iframeRef.current)
              iframeRef.current.srcdoc = buildPreviewDoc(files)
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: 'transparent',
            border: 0,
            color: '#696D7D',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} />
        </button>
        <div
          style={{
            flex: 1,
            background: 'rgba(243,244,246,0.8)',
            border: '1px solid rgba(17,24,39,0.08)',
            borderRadius: 6,
            padding: '5px 12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5,
            color: '#696D7D',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#34d399',
            }}
          />
          https://kira.dev/preview/
          {projectName.toLowerCase().replace(/\s+/g, '-')}
        </div>
        <button
          onClick={() => showToast('Opening in new tab…')}
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: 'transparent',
            border: 0,
            color: '#696D7D',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <ExternalLink size={14} />
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'grid',
          placeItems: 'start center',
          padding: 24,
        }}
      >
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          title="Live preview"
          style={{
            border: 0,
            background: 'white',
            borderRadius: 10,
            boxShadow: '0 12px 40px rgba(17,24,39,0.12)',
            transition: 'all .25s',
            width: device === 'mobile' ? 375 : '100%',
            maxWidth: device === 'mobile' ? 375 : 1100,
            height: device === 'mobile' ? 720 : 600,
            minHeight: device === 'mobile' ? 720 : 600,
          }}
        />
      </div>
    </div>
  )

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <aside
        style={{
          width: 220,
          minWidth: 220,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 10px',
          gap: 2,
          borderRight: '1px solid rgba(17,24,39,0.08)',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflowY: 'auto',
        }}
      >
        {/* Brand + back */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px 12px',
            borderBottom: '1px solid rgba(17,24,39,0.07)',
            marginBottom: 8,
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'rgba(17,24,39,0.06)',
              border: 0,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#696D7D',
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={13} />
          </button>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...KIRA_BTN_BLUE,
            }}
          >
            <Zap size={13} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#111827',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {projectName}
          </span>
        </div>

        {/* New app */}
        <button
          onClick={() => showToast('Create new app')}
          style={{
            margin: '0 4px 10px',
            padding: '9px 12px',
            background: 'transparent',
            border: '1px dashed rgba(17,24,39,0.2)',
            color: '#111827',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <Plus size={13} />
          <span>Create new app</span>
        </button>

        {/* Home / All Apps */}
        <div style={{ padding: '4px 8px 8px' }}>
          <NavBtn id={'editor' as SidePanel} label="Home" Icon={Home} />
          <NavBtn
            id={'showcase' as SidePanel}
            label="All Apps"
            Icon={LayoutGrid}
          />
        </div>

        {/* Build */}
        <div style={{ marginTop: 14, padding: '0 8px' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
              padding: '0 4px',
            }}
          >
            Build
          </div>
          {BUILD_NAV.map((n) => (
            <NavBtn key={n.id} {...n} Icon={n.icon} />
          ))}
        </div>

        {/* Publish */}
        <div style={{ marginTop: 14, padding: '0 8px' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
              padding: '0 4px',
            }}
          >
            Publish
          </div>
          {PUBLISH_NAV.map((n) => (
            <NavBtn key={n.id} {...n} Icon={n.icon} />
          ))}
        </div>

        {/* Advanced */}
        <div style={{ marginTop: 14, padding: '0 8px' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
              padding: '0 4px',
            }}
          >
            Advanced
          </div>
          {ADVANCED_NAV.map((n) => (
            <NavBtn key={n.id} {...n} Icon={n.icon} />
          ))}
        </div>
      </aside>

      {/* ── CHAT PANE ── */}
      <div
        style={{
          width: 360,
          minWidth: 360,
          flexShrink: 0,
          borderRight: '1px solid rgba(17,24,39,0.08)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            borderBottom: '1px solid rgba(17,24,39,0.07)',
            gap: 6,
          }}
        >
          {(['Chat', 'History'] as const).map((t) => (
            <button
              key={t}
              style={{
                background:
                  t === 'Chat' ? 'rgba(229,238,255,0.8)' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                color: t === 'Chat' ? '#4f46e5' : '#696D7D',
                fontSize: 12.5,
                fontWeight: t === 'Chat' ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {t === 'Chat' ? <FileCode size={13} /> : <BarChart2 size={13} />}
              {t}
            </button>
          ))}
          <button
            onClick={() => {
              setChatHistory([])
              showToast('New chat started')
            }}
            style={{
              marginLeft: 'auto',
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: 0,
              color: '#696D7D',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {chatHistory.length === 0 ? (
            <div
              style={{ margin: 'auto', textAlign: 'center', color: '#9ca3af' }}
            >
              <Zap
                size={28}
                style={{
                  margin: '0 auto 10px',
                  opacity: 0.3,
                  display: 'block',
                  color: '#4f46e5',
                }}
              />
              <div
                style={{
                  color: '#111827',
                  fontWeight: 600,
                  marginBottom: 4,
                  fontSize: 13,
                }}
              >
                Tell Kira what to build
              </div>
              <div style={{ fontSize: 11.5, maxWidth: 220, lineHeight: 1.55 }}>
                Describe changes, ask for refactors, or paste errors — Kira will
                edit your code.
              </div>
            </div>
          ) : (
            chatHistory.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  fontSize: 13.5,
                  lineHeight: 1.55,
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '9px 13px',
                    borderRadius:
                      m.role === 'user'
                        ? '12px 12px 4px 12px'
                        : '4px 12px 12px 12px',
                    background:
                      m.role === 'user'
                        ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)'
                        : 'rgba(255,255,255,0.85)',
                    color: m.role === 'user' ? '#fff' : '#374151',
                    boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
                    border:
                      m.role === 'ai'
                        ? '1px solid rgba(17,24,39,0.06)'
                        : 'none',
                  }}
                >
                  {m.typing ? (
                    <span style={{ display: 'inline-flex', gap: 3 }}>
                      {[0, 0.2, 0.4].map((d) => (
                        <span
                          key={d}
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: '#4f46e5',
                            display: 'inline-block',
                            animation: `bounce 1.2s ${d}s infinite`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <>
                      <span dangerouslySetInnerHTML={{ __html: m.text }} />
                      {m.files && m.files.length > 0 && (
                        <div
                          style={{
                            marginTop: 8,
                            background: 'rgba(243,244,246,0.8)',
                            borderRadius: 8,
                            padding: '7px 10px',
                            fontSize: 11.5,
                            fontFamily: "'JetBrains Mono',monospace",
                            color: '#696D7D',
                          }}
                        >
                          {m.files.map((f) => (
                            <div
                              key={f.name}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color:
                                  f.action === 'added' ? '#34d399' : '#7dd3fc',
                                padding: '1px 0',
                              }}
                            >
                              {f.action === 'added' ? (
                                <Plus size={10} />
                              ) : (
                                <Save size={10} />
                              )}
                              {f.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Composer */}
        <div
          style={{
            padding: '12px 14px 14px',
            borderTop: '1px solid rgba(17,24,39,0.07)',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(17,24,39,0.1)',
              borderRadius: 14,
              padding: '10px 12px',
              boxShadow: '0 2px 8px rgba(17,24,39,0.04)',
            }}
          >
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendChat()
                }
              }}
              placeholder="Tell Kira what to build or change…"
              rows={1}
              style={{
                width: '100%',
                background: 'transparent',
                border: 0,
                outline: 0,
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: 13,
                color: '#111827',
                minHeight: 40,
                maxHeight: 120,
                lineHeight: 1.5,
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 4,
                gap: 4,
              }}
            >
              {/* Mode pills */}
              {['Build mode', 'Design mode', 'Debug mode'].map((mode, i) => (
                <button
                  key={mode}
                  onClick={() => showToast(mode + ' enabled')}
                  style={{
                    background: i === 0 ? 'rgba(79,70,229,0.1)' : 'transparent',
                    border: 0,
                    padding: '3px 7px',
                    borderRadius: 999,
                    color: i === 0 ? '#4f46e5' : '#9ca3af',
                    fontSize: 10,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}
                >
                  {i === 0 ? (
                    <Wrench size={9} />
                  ) : i === 1 ? (
                    <Palette size={9} />
                  ) : (
                    <Search size={9} />
                  )}
                  {mode}
                </button>
              ))}
              <span style={{ marginLeft: 'auto' }} />
              <button
                onClick={() => showToast('Attach files')}
                style={{
                  background: 'transparent',
                  border: 0,
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  color: '#9ca3af',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Upload size={13} />
              </button>
              <button
                disabled={!chatInput.trim()}
                onClick={sendChat}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  ...KIRA_BTN_BLUE,
                  color: '#fff',
                  border: 0,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: chatInput.trim() ? 1 : 0.5,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: 13, height: 13 }}
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 10.5,
              color: '#9ca3af',
              marginTop: 8,
            }}
          >
            Kira may make mistakes. Review code before publishing.
          </div>
        </div>
      </div>

      {/* ── WORKSPACE ── */}
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: 'rgba(255,255,255,0.25)',
        }}
      >
        {/* Tabs bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(17,24,39,0.07)',
            padding: '0 8px',
            minHeight: 40,
            gap: 1,
          }}
        >
          {(
            [
              ['code', Code2, 'Code'],
              ['preview', Eye, 'Preview'],
            ] as [string, React.ElementType, string][]
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as 'code' | 'preview')
                setActivePanel('editor')
              }}
              style={{
                padding: '8px 14px',
                background:
                  activeTab === id ? 'rgba(255,255,255,0.9)' : 'transparent',
                border: 0,
                borderTop: `2px solid ${activeTab === id ? '#4f46e5' : 'transparent'}`,
                color: activeTab === id ? '#111827' : '#696D7D',
                fontSize: 12.5,
                fontWeight: activeTab === id ? 600 : 400,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <Icon size={13} />
              {label}
              {id === 'preview' && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#34d399',
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </button>
          ))}
          {/* Device toggle */}
          {activeTab === 'preview' && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: 2,
                background: 'rgba(243,244,246,0.8)',
                borderRadius: 8,
                padding: 3,
                border: '1px solid rgba(17,24,39,0.07)',
              }}
            >
              {(
                [
                  ['desktop', Monitor],
                  ['mobile', Smartphone],
                ] as [string, React.ElementType][]
              ).map(([d, Icon]) => (
                <button
                  key={d}
                  onClick={() => setDevice(d as 'desktop' | 'mobile')}
                  style={{
                    width: 28,
                    height: 26,
                    borderRadius: 5,
                    background:
                      device === d ? 'rgba(255,255,255,0.9)' : 'transparent',
                    border: 0,
                    color: device === d ? '#111827' : '#9ca3af',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          )}
          {/* Publish button in workspace tab bar */}
          <button
            onClick={() => showToast('Publishing…')}
            style={{
              marginLeft: activeTab === 'preview' ? 8 : 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              height: 30,
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: '#fff',
              border: 0,
              cursor: 'pointer',
              ...KIRA_BTN_BLUE,
            }}
          >
            <Rocket size={13} /> Publish
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTab === 'code' && activePanel === 'editor' && renderEditor()}
          {activeTab === 'preview' && renderPreview()}
          {activeTab === 'code' && activePanel !== 'editor' && (
            <ScrollArea style={{ height: '100%' }}>{renderPanel()}</ScrollArea>
          )}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(17,24,39,0.09)',
            color: '#111827',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: '0 12px 32px rgba(17,24,39,0.12)',
            zIndex: 200,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#34d399' }}>✓</span> {toast}
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN CoderView — header + screen switcher
// ═════════════════════════════════════════════════════════════════════════════
export default function CoderView() {
  const [screen, setScreen] = useState<Screen>('home')
  const [projectName, setProjectName] = useState('Kira Code Studio')

  const goToStudio = (_prompt: string, name: string) => {
    setProjectName(name)
    setScreen('studio')
  }

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflow: 'hidden',
        background: KIRA_BG,
        position: 'relative',
      }}
    >
      {/* Gradient blobs */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 600,
          height: 600,
          background:
            'radial-gradient(ellipse at top right, rgba(196,181,253,0.45) 0%, rgba(147,197,253,0.35) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          background:
            'radial-gradient(ellipse at top right, rgba(216,180,254,0.4) 0%, rgba(186,230,253,0.3) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── TOP HEADER ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px 18px',
          background: 'transparent',
          borderBottom: '1px solid rgba(17,24,39,0.08)',
          position: 'relative',
          zIndex: 10,
          gap: 16,
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#111827',
              margin: 0,
              letterSpacing: -0.3,
            }}
          >
            {screen === 'home' ? 'Kira Code Studio' : projectName}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#696D7D',
              margin: 0,
              fontWeight: 400,
            }}
          >
            {screen === 'home' ? 'AI-powered app builder' : 'AI-powered editor'}
          </p>
        </div>

        {/* Centre: search */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <input
            placeholder="Search files, components, prompts… ⌘K"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(17,24,39,0.09)',
              borderRadius: 14,
              padding: '10px 14px 10px 38px',
              fontFamily: 'inherit',
              fontSize: 13,
              color: '#111827',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(17,24,39,0.04)',
            }}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {screen === 'studio' && (
            <button
              onClick={() => setScreen('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 20px',
                height: 50,
                borderRadius: 14,
                background: 'white',
                border: '1px solid rgba(17,24,39,0.1)',
                color: '#111827',
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
              }}
            >
              <Home size={18} style={{ color: '#696D7D' }} /> Home
            </button>
          )}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 20px',
              height: 50,
              borderRadius: 14,
              background: 'white',
              border: '1px solid rgba(17,24,39,0.1)',
              color: '#111827',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 18, height: 18, color: '#696D7D' }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Activity Log
          </button>
          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 20px',
              height: 50,
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              color: '#fff',
              border: 0,
              cursor: 'pointer',
              ...KIRA_BTN_BLUE,
            }}
          >
            <Rocket size={16} /> Publish
          </button>
          <div
            style={{ width: 1, height: 30, background: 'rgba(17,24,39,0.1)' }}
          />
          <button
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'white',
              border: '1px solid rgba(17,24,39,0.07)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(17,24,39,0.05)',
              flexShrink: 0,
            }}
          >
            <Bell size={20} color="#111827" />
          </button>
          <button
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'white',
              border: '1px solid rgba(17,24,39,0.07)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(17,24,39,0.05)',
              flexShrink: 0,
            }}
          >
            <Settings size={20} color="#111827" />
          </button>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg,#f97316,#db2777)',
              border: '2px solid white',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(17,24,39,0.1)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <img
              src="/profile.png"
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {screen === 'home' && <HomeScreen onSubmit={goToStudio} />}
        {screen === 'studio' && (
          <StudioScreen
            projectName={projectName}
            onBack={() => setScreen('home')}
          />
        )}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  )
}
