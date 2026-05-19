import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import {
  Brain, Inbox, Map, FileText, Lightbulb, FolderOpen, Target, BookOpen,
  PenLine, Search, ZoomIn, ZoomOut, Maximize2, Grid3x3, Share2, Plus,
  ChevronRight, Network, Tag, X, Link, Image, Upload, FileUp, Globe,
  Check, StickyNote, Trash2, Edit3, Sun, Moon, MessageSquare, Send,
  Bot, User, Sparkles, Compass, ChevronDown, Rss,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  r: number
  color: string
  glow: string
  category: string
  connections: string[]
  content?: string
  isNote?: boolean
  tags?: string[]
  createdAt?: string
}
interface GraphEdge { from: string; to: string }
interface NoteData {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
}
interface ImportItem {
  id: string
  type: 'link' | 'image' | 'document'
  title: string
  url?: string
  createdAt: string
}
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════════════════════════
function useThemeColors(isDark: boolean) {
  return useMemo(() => {
    const D = {
      bg: '#0a0a1a', sidebar: 'rgba(15,15,35,0.95)', sidebarBorder: 'rgba(255,255,255,0.06)',
      card: 'rgba(20,20,40,0.95)', cardBorder: 'rgba(255,255,255,0.08)',
      textPrimary: '#ffffff', textSecondary: '#9ca3af', textMuted: '#6b7280',
      inputBg: 'rgba(255,255,255,0.05)', inputBorder: 'rgba(255,255,255,0.08)',
      hoverBg: 'rgba(255,255,255,0.05)', activeBg: 'rgba(255,255,255,0.08)',
      modalOverlay: 'rgba(0,0,0,0.7)', modalBg: '#12122a',
      gridColor: 'rgba(255,255,255,0.025)', shadow: '0 20px 60px rgba(0,0,0,0.5)',
      topBarBg: 'linear-gradient(to bottom, rgba(10,10,26,0.92) 0%, transparent 100%)',
      bottomBarBg: 'linear-gradient(to top, rgba(10,10,26,0.92) 0%, transparent 100%)',
      chatBg: 'rgba(12,12,28,0.98)', chatBubbleUser: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      chatBubbleAi: 'rgba(255,255,255,0.06)',
    }
    const L = {
      bg: '#f5f3ff', sidebar: 'rgba(255,255,255,0.95)', sidebarBorder: 'rgba(0,0,0,0.06)',
      card: 'rgba(255,255,255,0.97)', cardBorder: 'rgba(0,0,0,0.08)',
      textPrimary: '#111827', textSecondary: '#4b5563', textMuted: '#9ca3af',
      inputBg: 'rgba(0,0,0,0.03)', inputBorder: 'rgba(0,0,0,0.08)',
      hoverBg: 'rgba(0,0,0,0.03)', activeBg: 'rgba(59,130,246,0.08)',
      modalOverlay: 'rgba(0,0,0,0.35)', modalBg: '#ffffff',
      gridColor: 'rgba(0,0,0,0.035)', shadow: '0 20px 60px rgba(0,0,0,0.12)',
      topBarBg: 'linear-gradient(to bottom, rgba(245,243,255,0.92) 0%, transparent 100%)',
      bottomBarBg: 'linear-gradient(to top, rgba(245,243,255,0.92) 0%, transparent 100%)',
      chatBg: 'rgba(255,255,255,0.97)', chatBubbleUser: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      chatBubbleAi: 'rgba(0,0,0,0.04)',
    }
    return isDark ? D : L
  }, [isDark])
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const CATEGORIES = [
  { id: 'inbox', label: 'Inbox', icon: Inbox, color: '#22d3ee' },
  { id: 'maps', label: 'Maps', icon: Map, color: '#a855f7' },
  { id: 'work', label: 'Body of Work', icon: FileText, color: '#3b82f6' },
  { id: 'notes', label: 'Notes', icon: FileText, color: '#22d3ee' },
  { id: 'ideas', label: 'Ideas', icon: Lightbulb, color: '#f59e0b' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, color: '#6366f1' },
  { id: 'areas', label: 'Areas', icon: Target, color: '#ec4899' },
  { id: 'library', label: 'Library', icon: BookOpen, color: '#10b981' },
  { id: 'journal', label: 'Journal', icon: PenLine, color: '#f97316' },
]
const CAT_COLORS: Record<string, string> = {
  inbox: '#22d3ee', maps: '#a855f7', work: '#3b82f6', notes: '#22d3ee',
  ideas: '#f59e0b', projects: '#6366f1', areas: '#ec4899', library: '#10b981', journal: '#f97316',
}

// ═══════════════════════════════════════════════════════════════════════════════
//  INITIAL GRAPH DATA
// ═══════════════════════════════════════════════════════════════════════════════
const INITIAL_NODES: GraphNode[] = [
  { id: 'ai', label: 'AI', x: 500, y: 350, r: 32, color: '#22d3ee', glow: '#22d3ee88', category: 'ideas', connections: ['nlp','ml','agents','search','analysis','api','data','vision'] },
  { id: 'nlp', label: 'NLP', x: 320, y: 200, r: 22, color: '#a855f7', glow: '#a855f788', category: 'work', connections: ['ai','ml','transformers','tokens','agents'] },
  { id: 'ml', label: 'ML', x: 400, y: 160, r: 24, color: '#3b82f6', glow: '#3b82f688', category: 'work', connections: ['ai','nlp','training','models','data'] },
  { id: 'transformers', label: '', x: 250, y: 160, r: 12, color: '#a855f7', glow: '#a855f744', category: 'work', connections: ['nlp','tokens'] },
  { id: 'tokens', label: '', x: 280, y: 250, r: 10, color: '#a855f7', glow: '#a855f744', category: 'notes', connections: ['nlp','transformers'] },
  { id: 'training', label: '', x: 420, y: 100, r: 14, color: '#3b82f6', glow: '#3b82f644', category: 'work', connections: ['ml','models'] },
  { id: 'models', label: '', x: 500, y: 130, r: 13, color: '#3b82f6', glow: '#3b82f644', category: 'library', connections: ['ml','training','api'] },
  { id: 'agents', label: 'agents', x: 680, y: 210, r: 20, color: '#22d3ee', glow: '#22d3ee88', category: 'projects', connections: ['ai','nlp','api','workflow','automation'] },
  { id: 'search', label: 'search', x: 720, y: 320, r: 18, color: '#22d3ee', glow: '#22d3ee88', category: 'areas', connections: ['ai','analysis','indexing'] },
  { id: 'analysis', label: 'analysis', x: 700, y: 430, r: 19, color: '#ec4899', glow: '#ec489988', category: 'areas', connections: ['ai','search','data','visualization'] },
  { id: 'api', label: 'api', x: 650, y: 130, r: 17, color: '#f59e0b', glow: '#f59e0b88', category: 'projects', connections: ['ai','agents','models','endpoints'] },
  { id: 'workflow', label: '', x: 780, y: 180, r: 12, color: '#22d3ee', glow: '#22d3ee44', category: 'projects', connections: ['agents','automation'] },
  { id: 'automation', label: '', x: 820, y: 260, r: 11, color: '#22d3ee', glow: '#22d3ee44', category: 'projects', connections: ['workflow','agents'] },
  { id: 'indexing', label: '', x: 800, y: 380, r: 10, color: '#22d3ee', glow: '#22d3ee44', category: 'areas', connections: ['search'] },
  { id: 'visualization', label: '', x: 780, y: 490, r: 12, color: '#ec4899', glow: '#ec489944', category: 'areas', connections: ['analysis','data'] },
  { id: 'endpoints', label: '', x: 720, y: 80, r: 11, color: '#f59e0b', glow: '#f59e0b44', category: 'projects', connections: ['api'] },
  { id: 'data', label: '', x: 520, y: 500, r: 18, color: '#10b981', glow: '#10b98188', category: 'library', connections: ['ai','analysis','database','visualization'] },
  { id: 'vision', label: '', x: 400, y: 480, r: 16, color: '#f97316', glow: '#f9731688', category: 'library', connections: ['ai','images','recognition'] },
  { id: 'database', label: '', x: 580, y: 550, r: 13, color: '#10b981', glow: '#10b98144', category: 'library', connections: ['data'] },
  { id: 'images', label: '', x: 320, y: 430, r: 12, color: '#f97316', glow: '#f9731644', category: 'library', connections: ['vision'] },
  { id: 'recognition', label: '', x: 380, y: 540, r: 10, color: '#f97316', glow: '#f9731644', category: 'library', connections: ['vision'] },
  { id: 's1', label: '', x: 200, y: 300, r: 8, color: '#a855f7', glow: '#a855f733', category: 'notes', connections: ['nlp'] },
  { id: 's2', label: '', x: 220, y: 400, r: 7, color: '#3b82f6', glow: '#3b82f633', category: 'notes', connections: ['s1'] },
  { id: 's3', label: '', x: 350, y: 320, r: 9, color: '#22d3ee', glow: '#22d3ee33', category: 'inbox', connections: ['ai','s1'] },
  { id: 's4', label: '', x: 600, y: 240, r: 8, color: '#f59e0b', glow: '#f59e0b33', category: 'ideas', connections: ['ai','agents'] },
  { id: 's5', label: '', x: 480, y: 260, r: 7, color: '#ec4899', glow: '#ec489933', category: 'ideas', connections: ['ai','s4'] },
  { id: 's6', label: '', x: 620, y: 450, r: 8, color: '#10b981', glow: '#10b98133', category: 'journal', connections: ['analysis','data'] },
  { id: 's7', label: '', x: 450, y: 420, r: 7, color: '#f97316', glow: '#f9731633', category: 'journal', connections: ['ai','s6'] },
  { id: 's8', label: '', x: 850, y: 350, r: 8, color: '#22d3ee', glow: '#22d3ee33', category: 'areas', connections: ['search','automation'] },
  { id: 's9', label: '', x: 800, y: 150, r: 7, color: '#f59e0b', glow: '#f59e0b33', category: 'projects', connections: ['api','workflow'] },
  { id: 's10', label: '', x: 300, y: 500, r: 6, color: '#10b981', glow: '#10b98133', category: 'library', connections: ['s2','vision'] },
  { id: 's11', label: '', x: 550, y: 180, r: 8, color: '#a855f7', glow: '#a855f733', category: 'work', connections: ['ml','models'] },
  { id: 's12', label: '', x: 650, y: 350, r: 7, color: '#ec4899', glow: '#ec489933', category: 'areas', connections: ['ai','analysis'] },
  { id: 's13', label: '', x: 750, y: 450, r: 6, color: '#3b82f6', glow: '#3b82f633', category: 'areas', connections: ['visualization'] },
  { id: 's14', label: '', x: 180, y: 220, r: 7, color: '#22d3ee', glow: '#22d3ee33', category: 'inbox', connections: ['s1'] },
  { id: 's15', label: '', x: 420, y: 380, r: 6, color: '#f59e0b', glow: '#f59e0b33', category: 'ideas', connections: ['s7','s5'] },
]

function buildEdges(nodes: GraphNode[]): GraphEdge[] {
  const edges: GraphEdge[] = []
  const seen = new Set<string>()
  nodes.forEach((node) => {
    node.connections.forEach((targetId) => {
      const key = [node.id, targetId].sort().join('-')
      if (!seen.has(key)) { seen.add(key); edges.push({ from: node.id, to: targetId }) }
    })
  })
  return edges
}
const INITIAL_EDGES = buildEdges(INITIAL_NODES)

function generateId() { return 'n_' + Math.random().toString(36).substr(2, 9) }

// ═══════════════════════════════════════════════════════════════════════════════
//  SUGGESTED PROMPTS
// ═══════════════════════════════════════════════════════════════════════════════
const SUGGESTED_PROMPTS = [
  'Summarize my knowledge graph',
  'What are my most connected ideas?',
  'Find related concepts between notes',
  'Suggest new connections',
  'Analyze my brain patterns',
  'What topics am I focusing on?',
]

// ═══════════════════════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function NoteModal({ isDark, colors, onClose, onSave, editNote }: {
  isDark: boolean; colors: ReturnType<typeof useThemeColors>
  onClose: () => void; onSave: (note: NoteData) => void; editNote?: NoteData | null
}) {
  const [title, setTitle] = useState(editNote?.title || '')
  const [content, setContent] = useState(editNote?.content || '')
  const [category, setCategory] = useState(editNote?.category || 'notes')
  const [tags, setTags] = useState(editNote?.tags?.join(', ') || '')
  const handleSave = () => {
    if (!title.trim()) return
    onSave({ id: editNote?.id || generateId(), title: title.trim(), content: content.trim(), category, tags: tags.split(',').map(t => t.trim()).filter(Boolean), createdAt: editNote?.createdAt || new Date().toISOString() })
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: colors.modalOverlay }} onClick={onClose}>
      <div className="w-full max-w-lg mx-4 overflow-hidden" style={{ background: colors.modalBg, borderRadius: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: colors.shadow }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.sidebarBorder }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)' }}>
              <StickyNote size={15} color="#fff" />
            </div>
            <h3 className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>{editNote ? 'Edit Note' : 'Add Note'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"><X size={18} style={{ color: colors.textMuted }} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter note title..." className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} autoFocus />
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note content..." rows={5} className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all resize-none" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} />
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                  style={{ background: category === cat.id ? `${cat.color}18` : colors.inputBg, border: `1px solid ${category === cat.id ? `${cat.color}40` : colors.inputBorder}`, color: category === cat.id ? cat.color : colors.textSecondary }}>
                  <cat.icon size={12} color={category === cat.id ? cat.color : colors.textMuted} /> {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Tags (comma separated)</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. research, ai, important" className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: colors.sidebarBorder }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all" style={{ color: colors.textSecondary, border: `1px solid ${colors.inputBorder}` }}>Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="px-5 py-2 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>{editNote ? 'Update Note' : 'Save Note'}</button>
        </div>
      </div>
    </div>
  )
}

function ImportModal({ isDark, colors, onClose, onImport }: {
  isDark: boolean; colors: ReturnType<typeof useThemeColors>
  onClose: () => void; onImport: (item: ImportItem) => void
}) {
  const [activeTab, setActiveTab] = useState<'link' | 'image' | 'document'>('link')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [fileName, setFileName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const handleFileSelect = (type: 'image' | 'document') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setFileName(file.name); setTitle(file.name.replace(/\.[^/.]+$/, '')) }
  }
  const handleImport = () => {
    if (activeTab === 'link' && !url.trim()) return
    if ((activeTab === 'image' || activeTab === 'document') && !title.trim()) return
    onImport({ id: generateId(), type: activeTab, title: title.trim() || (activeTab === 'link' ? url.trim() : fileName), url: activeTab === 'link' ? url.trim() : undefined, createdAt: new Date().toISOString() })
    onClose()
  }
  const tabs = [
    { id: 'link' as const, label: 'From Link', icon: Globe },
    { id: 'image' as const, label: 'Upload Image', icon: Image },
    { id: 'document' as const, label: 'Upload Document', icon: FileUp },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: colors.modalOverlay }} onClick={onClose}>
      <div className="w-full max-w-md mx-4 overflow-hidden" style={{ background: colors.modalBg, borderRadius: 20, border: `1px solid ${colors.cardBorder}`, boxShadow: colors.shadow }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.sidebarBorder }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}><Upload size={15} color="#fff" /></div>
            <h3 className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>Import to Brain</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"><X size={18} style={{ color: colors.textMuted }} /></button>
        </div>
        <div className="flex gap-1 px-6 pt-4 pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setUrl(''); setTitle(''); setFileName('') }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{ background: activeTab === tab.id ? `${CAT_COLORS['projects']}18` : 'transparent', border: `1px solid ${activeTab === tab.id ? `${CAT_COLORS['projects']}40` : 'transparent'}`, color: activeTab === tab.id ? CAT_COLORS['projects'] : colors.textMuted }}>
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>
        <div className="px-6 py-4">
          {activeTab === 'link' && (
            <div className="space-y-3">
              <div>
                <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>URL</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}` }}>
                  <Link size={14} style={{ color: colors.textMuted }} />
                  <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/article" className="flex-1 text-[13px] bg-transparent outline-none" style={{ color: colors.textPrimary }} />
                </div>
              </div>
              <div>
                <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Title (optional)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Give this link a name..." className="w-full px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent outline-none" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} />
              </div>
            </div>
          )}
          {activeTab === 'image' && (
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all" style={{ borderColor: dragOver ? '#6366f1' : colors.inputBorder, background: dragOver ? `${CAT_COLORS['projects']}08` : colors.inputBg }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) { setFileName(f.name); setTitle(f.name.replace(/\.[^/.]+$/, '')) } }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: `${CAT_COLORS['projects']}15` }}><Image size={22} color={CAT_COLORS['projects']} /></div>
                <div className="text-center"><p className="text-[13px] font-medium" style={{ color: colors.textSecondary }}>Drag & drop an image here</p><p className="text-[11px] mt-0.5" style={{ color: colors.textMuted }}>or click to browse</p></div>
                <label className="relative w-full h-10 cursor-pointer"><input type="file" accept="image/*" onChange={handleFileSelect('image')} className="absolute inset-0 opacity-0 cursor-pointer" /></label>
              </div>
              {fileName && <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${CAT_COLORS['projects']}10` }}><Check size={14} color={CAT_COLORS['projects']} /><span className="text-[12px]" style={{ color: colors.textSecondary }}>{fileName}</span></div>}
              <div>
                <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Name your image..." className="w-full px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent outline-none" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} />
              </div>
            </div>
          )}
          {activeTab === 'document' && (
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all" style={{ borderColor: dragOver ? '#6366f1' : colors.inputBorder, background: dragOver ? `${CAT_COLORS['projects']}08` : colors.inputBg }}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) { setFileName(f.name); setTitle(f.name.replace(/\.[^/.]+$/, '')) } }}>
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: `${CAT_COLORS['projects']}15` }}><FileUp size={22} color={CAT_COLORS['projects']} /></div>
                <div className="text-center"><p className="text-[13px] font-medium" style={{ color: colors.textSecondary }}>Drag & drop a document here</p><p className="text-[11px] mt-0.5" style={{ color: colors.textMuted }}>PDF, DOCX, TXT supported</p></div>
                <label className="relative w-full h-10 cursor-pointer"><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect('document')} className="absolute inset-0 opacity-0 cursor-pointer" /></label>
              </div>
              {fileName && <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${CAT_COLORS['projects']}10` }}><Check size={14} color={CAT_COLORS['projects']} /><span className="text-[12px]" style={{ color: colors.textSecondary }}>{fileName}</span></div>}
              <div>
                <label className="block mb-1.5 text-[11px] font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Name your document..." className="w-full px-3.5 py-2.5 rounded-xl text-[13px] bg-transparent outline-none" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textPrimary }} />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: colors.sidebarBorder }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all" style={{ color: colors.textSecondary, border: `1px solid ${colors.inputBorder}` }}>Cancel</button>
          <button onClick={handleImport} disabled={activeTab === 'link' ? !url.trim() : !title.trim()} className="px-5 py-2 rounded-xl text-[13px] font-medium text-white transition-all disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #6366f1, #1d4ed8)' }}>Import</button>
        </div>
      </div>
    </div>
  )
}

function NotesListPanel({ isDark, colors, notes, onEdit, onDelete, onClose }: {
  isDark: boolean; colors: ReturnType<typeof useThemeColors>
  notes: NoteData[]; onEdit: (note: NoteData) => void; onDelete: (id: string) => void; onClose: () => void
}) {
  const [expandedNote, setExpandedNote] = useState<string | null>(null)
  return (
    <div className="flex flex-col h-full border-r" style={{ width: 280, minWidth: 280, background: colors.sidebar, borderColor: colors.sidebarBorder }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.sidebarBorder }}>
        <div className="flex items-center gap-2">
          <StickyNote size={15} style={{ color: CAT_COLORS['notes'] }} />
          <span className="text-[13px] font-semibold" style={{ color: colors.textPrimary }}>Notes</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-md" style={{ background: `${CAT_COLORS['notes']}15`, color: CAT_COLORS['notes'] }}>{notes.length}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Close"><X size={14} style={{ color: colors.textMuted }} /></button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 px-6 text-center">
            <StickyNote size={24} style={{ color: colors.textMuted }} className="mb-2 opacity-40" />
            <p className="text-[12px]" style={{ color: colors.textMuted }}>No notes yet. Click "Add Note" to create your first note.</p>
          </div>
        )}
        {notes.map(note => {
          const cat = CATEGORIES.find(c => c.id === note.category)
          const isExpanded = expandedNote === note.id
          return (
            <div key={note.id} className="mx-2 mb-1 rounded-xl transition-all cursor-pointer" style={{ background: isExpanded ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)') : 'transparent', border: `1px solid ${isExpanded ? colors.cardBorder : 'transparent'}` }} onClick={() => setExpandedNote(isExpanded ? null : note.id)}>
              <div className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-6 mt-0.5 rounded-md flex-shrink-0" style={{ background: `${cat?.color || CAT_COLORS['notes']}15` }}><cat.icon size={12} color={cat?.color || CAT_COLORS['notes']} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium truncate" style={{ color: colors.textPrimary }}>{note.title}</p>
                    <p className="text-[11px] truncate" style={{ color: colors.textMuted }}>{note.content || 'No content'}</p>
                    {note.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{note.tags.map(tag => <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: `${CAT_COLORS['notes']}10`, color: CAT_COLORS['notes'] }}>#{tag}</span>)}</div>}
                  </div>
                </div>
                {isExpanded && (
                  <div className="flex items-center gap-1 mt-2 ml-8">
                    <button onClick={e => { e.stopPropagation(); onEdit(note) }} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ color: colors.textSecondary }}><Edit3 size={10} /> Edit</button>
                    <button onClick={e => { e.stopPropagation(); onDelete(note.id) }} className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all hover:bg-red-500/10" style={{ color: '#ef4444' }}><Trash2 size={10} /> Delete</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChatPanel({ isDark, colors, allNodes, notes, onAddNote, onClose }: {
  isDark: boolean; colors: ReturnType<typeof useThemeColors>
  allNodes: GraphNode[]; notes: NoteData[]; onAddNote: () => void; onClose: () => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: "Hi! I'm Kira, your brain assistant. I can help you explore your knowledge graph, summarize notes, find connections, and more. What would you like to know?", timestamp: new Date().toISOString() }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const generateResponse = useCallback((userMsg: string): string => {
    const lower = userMsg.toLowerCase()
    const labeledNodes = allNodes.filter(n => n.label.length > 0)
    const totalConnections = allNodes.reduce((acc, n) => acc + n.connections.length, 0)

    if (lower.includes('summarize') || lower.includes('overview') || lower.includes('summary')) {
      return `Your brain contains **${allNodes.length} nodes** with **${totalConnections} connections** across ${CATEGORIES.length} categories. Key areas: ${labeledNodes.slice(0, 5).map(n => n.label).join(', ')}, and more. Your most connected hub is the AI node with ${allNodes.find(n => n.id === 'ai')?.connections.length || 0} direct connections.`
    }
    if (lower.includes('most connected') || lower.includes('connected ideas')) {
      const sorted = [...allNodes].sort((a, b) => b.connections.length - a.connections.length).slice(0, 5)
      return `Your most connected concepts are:\n${sorted.map((n, i) => `${i + 1}. **${n.label || n.id}** — ${n.connections.length} connections (${CATEGORIES.find(c => c.id === n.category)?.label || n.category})`).join('\n')}`
    }
    if (lower.includes('note')) {
      if (notes.length === 0) return "You don't have any personal notes yet. Click **Add Note** in the sidebar to create your first note!"
      return `You have **${notes.length} notes**:\n${notes.slice(0, 5).map((n, i) => `${i + 1}. **${n.title}** (${CATEGORIES.find(c => c.id === n.category)?.label || n.category})${n.tags.length ? ` — tagged: ${n.tags.join(', ')}` : ''}`).join('\n')}${notes.length > 5 ? `\n...and ${notes.length - 5} more` : ''}`
    }
    if (lower.includes('connect') || lower.includes('relationship') || lower.includes('related')) {
      return `I can see strong connections between your **AI** hub and these clusters:\n\n**ML/NLP cluster:** ML (${allNodes.find(n => n.id === 'ml')?.connections.length || 0} links), NLP (${allNodes.find(n => n.id === 'nlp')?.connections.length || 0} links)\n**Projects cluster:** agents (${allNodes.find(n => n.id === 'agents')?.connections.length || 0} links), api, workflow\n**Analysis cluster:** search, analysis, data, visualization\n\nWould you like me to suggest new connections?`
    }
    if (lower.includes('suggest') || lower.includes('recommend') || lower.includes('new')) {
      return `Based on your graph structure, here are some connection suggestions:\n\n1. **NLP + search** — You have both but they're not directly linked\n2. **ML + data** — Strong thematic overlap, only 1 connection\n3. **vision + images** — Direct connection missing despite being closely related\n4. **api + endpoints** — Only 1 link, could be strengthened\n\nWould you like me to add any of these?`
    }
    if (lower.includes('focus') || lower.includes('topic') || lower.includes('working on')) {
      const catCounts: Record<string, number> = {}
      allNodes.forEach(n => { catCounts[n.category] = (catCounts[n.category] || 0) + 1 })
      const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
      return `Based on your graph, your top focus areas are:\n${sorted.map(([cat, count], i) => `${i + 1}. **${CATEGORIES.find(c => c.id === cat)?.label || cat}** — ${count} nodes`).join('\n')}\n\nYou're building a strong foundation around AI/ML with practical applications in agents, search, and analysis.`
    }
    if (lower.includes('pattern') || lower.includes('structure') || lower.includes('analyze')) {
      const avgConnections = (totalConnections / allNodes.length).toFixed(1)
      const orphanNodes = allNodes.filter(n => n.connections.length === 0).length
      const hubNodes = allNodes.filter(n => n.connections.length >= 4).length
      return `**Brain Analysis:**\n\n- Average connectivity: **${avgConnections}** connections per node\n- Hub nodes (4+ connections): **${hubNodes}**\n- Orphan nodes: **${orphanNodes}**\n- Network density: **${((totalConnections / (allNodes.length * (allNodes.length - 1) / 2)) * 100).toFixed(1)}%**\n\nYour network shows a **hub-and-spoke pattern** centered on AI, which is excellent for knowledge organization.`
    }
    if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi') {
      return "Hello! I'm ready to help you explore your brain. Try asking me to summarize your graph, find connections, or analyze patterns!"
    }
    if (lower.includes('help')) {
      return "Here's what I can do:\n\n**Summarize** — Get an overview of your entire brain\n**Find connections** — Discover links between concepts\n**Analyze patterns** — Understand your knowledge structure\n**Notes** — Review your personal notes\n**Suggest connections** — Get AI-recommended new links\n\nJust type what you're looking for!"
    }
    return `That's an interesting question about your knowledge graph! I can see you have ${allNodes.length} nodes across ${CATEGORIES.length} categories. To give you a more specific answer, try asking about:\n\n- Summarizing your brain\n- Finding connections\n- Analyzing patterns\n- Your notes\n- Suggesting new links`
  }, [allNodes, notes])

  const sendMessage = useCallback(() => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: input.trim(), timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const response = generateResponse(userMsg.content)
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() }])
      setIsTyping(false)
    }, 600 + Math.random() * 800)
  }, [input, generateResponse])

  const sendPrompt = useCallback((prompt: string) => {
    setInput(prompt)
    setTimeout(() => {
      const userMsg: ChatMessage = { id: generateId(), role: 'user', content: prompt, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, userMsg])
      setInput('')
      setIsTyping(true)
      setTimeout(() => {
        const response = generateResponse(prompt)
        setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() }])
        setIsTyping(false)
      }, 600 + Math.random() * 800)
    }, 50)
  }, [generateResponse])

  return (
    <div className="flex flex-col h-full border-l" style={{ width: 340, minWidth: 340, background: colors.chatBg, borderColor: colors.sidebarBorder }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.sidebarBorder }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: colors.textPrimary }}>Kira Brain Chat</p>
            <p className="text-[10px]" style={{ color: '#22c55e' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: '#22c55e' }} />Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Close"><X size={14} style={{ color: colors.textMuted }} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-3 overflow-y-auto space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full flex items-center justify-center" style={{ background: msg.role === 'user' ? colors.inputBg : 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              {msg.role === 'user' ? <User size={12} style={{ color: colors.textSecondary }} /> : <Bot size={12} color="#fff" />}
            </div>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[12px] leading-relaxed whitespace-pre-wrap`}
              style={{
                background: msg.role === 'user' ? colors.chatBubbleUser : colors.chatBubbleAi,
                color: msg.role === 'user' ? '#fff' : colors.textSecondary,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                borderBottomLeftRadius: msg.role === 'user' ? 12 : 4,
              }}>
              {msg.content.split('**').map((part, i) => i % 2 === 1
                ? <span key={i} className="font-semibold" style={{ color: msg.role === 'user' ? '#e0e7ff' : colors.textPrimary }}>{part}</span>
                : part
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}><Bot size={12} color="#fff" /></div>
            <div className="px-3 py-2 rounded-xl" style={{ background: colors.chatBubbleAi, borderBottomLeftRadius: 4 }}>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: colors.textMuted, animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2">
          <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5 px-1" style={{ color: colors.textMuted }}>Quick prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.slice(0, 4).map(prompt => (
              <button key={prompt} onClick={() => sendPrompt(prompt)} className="px-2.5 py-1.5 rounded-lg text-[10px] transition-all hover:opacity-80" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textSecondary }}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t" style={{ borderColor: colors.sidebarBorder }}>
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}` }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your brain..."
              className="flex-1 text-[12px] bg-transparent outline-none placeholder-gray-500"
              style={{ color: colors.textPrimary }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white transition-all disabled:opacity-30 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function SocialPanel({ isDark, colors, onClose }: {
  isDark: boolean; colors: ReturnType<typeof useThemeColors>; onClose: () => void
}) {
  const [feedTab, setFeedTab] = useState<'activity' | 'shared'>('activity')
  const activities = [
    { id: '1', user: 'Alex Chen', action: 'shared a note', target: 'AI Research Summary', time: '2m ago', avatar: 'AC', color: '#3b82f6' },
    { id: '2', user: 'Sarah Kim', action: 'connected', target: 'NLP + Transformers', time: '15m ago', avatar: 'SK', color: '#ec4899' },
    { id: '3', user: 'Jordan Lee', action: 'imported a link', target: 'Machine Learning Guide', time: '1h ago', avatar: 'JL', color: '#10b981' },
    { id: '4', user: 'Morgan Park', action: 'added a note', target: 'Graph Visualization Ideas', time: '3h ago', avatar: 'MP', color: '#f59e0b' },
    { id: '5', user: 'Riley Wang', action: 'commented on', target: 'Agent Architecture', time: '5h ago', avatar: 'RW', color: '#a855f7' },
  ]
  const sharedItems = [
    { id: '1', title: 'My Knowledge Graph 2025', author: 'You', shares: 12, likes: 34, time: '2d ago' },
    { id: '2', title: 'AI Concepts Collection', author: 'You', shares: 8, likes: 21, time: '1w ago' },
  ]
  return (
    <div className="flex flex-col h-full border-l" style={{ width: 300, minWidth: 300, background: colors.chatBg, borderColor: colors.sidebarBorder }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.sidebarBorder }}>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            <Rss size={13} color="#fff" />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: colors.textPrimary }}>Social Feed</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Close"><X size={14} style={{ color: colors.textMuted }} /></button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-3 pb-2">
        {[{ id: 'activity' as const, label: 'Activity' }, { id: 'shared' as const, label: 'My Shares' }].map(tab => (
          <button key={tab.id} onClick={() => setFeedTab(tab.id)} className="flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{ background: feedTab === tab.id ? '#ec489918' : 'transparent', border: `1px solid ${feedTab === tab.id ? '#ec489940' : 'transparent'}`, color: feedTab === tab.id ? '#ec4899' : colors.textMuted }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-2 overflow-y-auto">
        {feedTab === 'activity' && (
          <div className="space-y-2">
            {activities.map(a => (
              <div key={a.id} className="flex gap-2.5 p-2.5 rounded-xl transition-all" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: a.color }}>{a.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px]" style={{ color: colors.textPrimary }}>
                    <span className="font-medium">{a.user}</span>{' '}<span style={{ color: colors.textMuted }}>{a.action}</span>{' '}<span className="font-medium" style={{ color: '#ec4899' }}>{a.target}</span>
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: colors.textMuted }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {feedTab === 'shared' && (
          <div className="space-y-2">
            {sharedItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${colors.inputBorder}` }}>
                <p className="text-[12px] font-medium" style={{ color: colors.textPrimary }}>{item.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>{item.shares} shares</span>
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>{item.likes} likes</span>
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>{item.time}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 mt-2 rounded-xl text-[11px] font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
              <Share2 size={11} className="inline mr-1.5" /> Share My Brain
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MyBrainView() {
  const [isDark, setIsDark] = useState(true)
  const colors = useThemeColors(isDark)

  // Graph
  const [allNodes, setAllNodes] = useState<GraphNode[]>(INITIAL_NODES)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  // Panels
  const [showNotesPanel, setShowNotesPanel] = useState(false)
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [showSocialPanel, setShowSocialPanel] = useState(false)

  // Modals
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteData | null>(null)

  // Data
  const [notes, setNotes] = useState<NoteData[]>([])
  const [imports, setImports] = useState<ImportItem[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }, [])

  const allEdges = useMemo(() => buildEdges(allNodes), [allNodes])

  const filteredNodes = useMemo(() => {
    return allNodes.filter(n => {
      const matchCat = activeCategory ? n.category === activeCategory : true
      const matchSearch = searchQuery ? n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.id.toLowerCase().includes(searchQuery.toLowerCase()) : true
      return matchCat && matchSearch
    })
  }, [allNodes, activeCategory, searchQuery])

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])
  const visibleEdges = useMemo(() => allEdges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to)), [allEdges, filteredNodeIds])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    CATEGORIES.forEach(c => { counts[c.id] = 0 })
    allNodes.forEach(n => { if (counts[n.category] !== undefined) counts[n.category]++ })
    return counts
  }, [allNodes])

  // Note CRUD
  const handleSaveNote = useCallback((note: NoteData) => {
    setNotes(prev => {
      const existing = prev.findIndex(n => n.id === note.id)
      if (existing >= 0) { const u = [...prev]; u[existing] = note; return u }
      return [...prev, note]
    })
    setAllNodes(prev => {
      const existing = prev.findIndex(n => n.id === note.id)
      const catColor = CAT_COLORS[note.category] || '#6366f1'
      const r = Math.max(10, Math.min(22, 8 + note.title.length * 0.5))
      const angle = Math.random() * Math.PI * 2
      const dist = 120 + Math.random() * 200
      const newNode: GraphNode = {
        id: note.id, label: note.title, x: 500 + Math.cos(angle) * dist, y: 350 + Math.sin(angle) * dist,
        r, color: catColor, glow: catColor + '88', category: note.category, connections: ['ai'],
        content: note.content, isNote: true, tags: note.tags, createdAt: note.createdAt,
      }
      if (existing >= 0) { const u = [...prev]; u[existing] = { ...newNode, x: prev[existing].x, y: prev[existing].y, connections: prev[existing].connections }; return u }
      return [...prev, newNode]
    })
    showToast(note.id in notes.map(n => n.id) ? 'Note updated' : 'Note created')
  }, [showToast, notes])

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    setAllNodes(prev => prev.filter(n => n.id !== id))
    showToast('Note deleted')
  }, [showToast])

  // Import
  const handleImport = useCallback((item: ImportItem) => {
    setImports(prev => [...prev, item])
    setAllNodes(prev => {
      const catColor = item.type === 'link' ? '#3b82f6' : item.type === 'image' ? '#f97316' : '#10b981'
      const label = item.title.length > 20 ? item.title.slice(0, 18) + '..' : item.title
      const angle = Math.random() * Math.PI * 2
      const dist = 140 + Math.random() * 220
      const newNode: GraphNode = {
        id: item.id, label, x: 500 + Math.cos(angle) * dist, y: 350 + Math.sin(angle) * dist,
        r: 14, color: catColor, glow: catColor + '88', category: 'library', connections: ['ai', 'data'], createdAt: item.createdAt,
      }
      return [...prev, newNode]
    })
    showToast(`Imported ${item.type}: ${item.title}`)
  }, [showToast])

  // Pan/Zoom
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) { setIsPanning(true); setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }) }
  }, [pan])
  const handleMouseMove = useCallback((e: React.MouseEvent) => { if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y }) }, [isPanning, panStart])
  const handleMouseUp = useCallback(() => setIsPanning(false), [])
  const handleWheel = useCallback((e: React.WheelEvent) => { e.preventDefault(); const delta = e.deltaY > 0 ? -0.1 : 0.1; setZoom(z => Math.max(0.3, Math.min(3, z + delta))) }, [])
  const handleZoomToFit = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }) }, [])

  // Modal helpers
  const openNoteModal = useCallback(() => { setEditingNote(null); setShowNoteModal(true) }, [])
  const openEditNote = useCallback((note: NoteData) => { setEditingNote(note); setShowNoteModal(true) }, [])

  return (
    <div className="flex w-full h-full overflow-hidden" style={{ background: colors.bg, fontFamily: "'Outfit', system-ui, sans-serif" }}
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>

      {/* ══════ LEFT SIDEBAR ══════ */}
      <div className="flex flex-col h-full border-r" style={{ width: 230, minWidth: 230, background: colors.sidebar, borderColor: colors.sidebarBorder }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: colors.sidebarBorder }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)' }}>
              <Brain size={16} color="#fff" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>My Brain</h2>
              <p className="text-[11px]" style={{ color: colors.textMuted }}>Knowledge Graph</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}` }}>
            <Search size={14} style={{ color: colors.textMuted }} />
            <input type="text" placeholder="Search nodes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 text-[12px] bg-transparent outline-none placeholder-gray-500" style={{ color: colors.textPrimary }} />
          </div>
        </div>

        {/* View toggles */}
        <div className="px-4 pb-2 space-y-1">
          <button onClick={() => setShowNotesPanel(!showNotesPanel)} className="flex items-center w-full gap-2 px-3 py-2 text-left transition-all rounded-lg"
            style={{ background: showNotesPanel ? colors.activeBg : 'transparent', border: `1px solid ${showNotesPanel ? `${CAT_COLORS['notes']}30` : 'transparent'}` }}>
            <StickyNote size={14} color={showNotesPanel ? CAT_COLORS['notes'] : colors.textMuted} />
            <span className="flex-1 text-[12px] font-medium" style={{ color: showNotesPanel ? CAT_COLORS['notes'] : colors.textSecondary }}>Notes List</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: `${CAT_COLORS['notes']}12`, color: CAT_COLORS['notes'] }}>{notes.length}</span>
          </button>
          <button onClick={() => setShowChatPanel(!showChatPanel)} className="flex items-center w-full gap-2 px-3 py-2 text-left transition-all rounded-lg"
            style={{ background: showChatPanel ? colors.activeBg : 'transparent', border: `1px solid ${showChatPanel ? `${CAT_COLORS['projects']}30` : 'transparent'}` }}>
            <MessageSquare size={14} color={showChatPanel ? CAT_COLORS['projects'] : colors.textMuted} />
            <span className="flex-1 text-[12px] font-medium" style={{ color: showChatPanel ? CAT_COLORS['projects'] : colors.textSecondary }}>Chats</span>
            {showChatPanel && <ChevronRight size={12} color={CAT_COLORS['projects']} />}
          </button>
          <button onClick={() => setShowSocialPanel(!showSocialPanel)} className="flex items-center w-full gap-2 px-3 py-2 text-left transition-all rounded-lg"
            style={{ background: showSocialPanel ? colors.activeBg : 'transparent', border: `1px solid ${showSocialPanel ? '#ec489930' : 'transparent'}` }}>
            <Rss size={14} color={showSocialPanel ? '#ec4899' : colors.textMuted} />
            <span className="flex-1 text-[12px] font-medium" style={{ color: showSocialPanel ? '#ec4899' : colors.textSecondary }}>Social Media</span>
            {showSocialPanel && <ChevronRight size={12} color="#ec4899" />}
          </button>
        </div>

        {/* Categories */}
        <div className="flex-1 px-3 overflow-y-auto">
          <div className="px-2 mb-2 text-[10px] font-semibold tracking-wider uppercase" style={{ color: colors.textMuted }}>Categories</div>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button key={cat.id} onClick={() => setActiveCategory(isActive ? null : cat.id)} className="flex items-center w-full gap-3 px-3 py-2 mb-1 text-left transition-all rounded-lg" style={{ background: isActive ? colors.activeBg : 'transparent' }}>
                <Icon size={15} color={isActive ? cat.color : colors.textMuted} />
                <span className="flex-1 text-[13px]" style={{ color: isActive ? colors.textPrimary : colors.textSecondary }}>{cat.label}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-md" style={{ color: isActive ? cat.color : colors.textMuted, background: isActive ? `${cat.color}18` : colors.inputBg }}>{categoryCounts[cat.id] || 0}</span>
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-t" style={{ borderColor: colors.sidebarBorder }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px]" style={{ color: colors.textMuted }}>Total Nodes</span>
            <span className="text-[12px] font-semibold" style={{ color: colors.textPrimary }}>{allNodes.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: colors.textMuted }}>Connections</span>
            <span className="text-[12px] font-semibold" style={{ color: colors.textPrimary }}>{allEdges.length}</span>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: colors.sidebarBorder }}>
          <button onClick={openNoteModal} className="flex items-center justify-center flex-1 gap-1.5 py-2 text-[11px] font-medium text-white transition-all rounded-lg hover:opacity-90" style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)' }}>
            <Plus size={12} /> Add Note
          </button>
          <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center flex-1 gap-1.5 py-2 text-[11px] font-medium transition-all rounded-lg hover:bg-black/5 dark:hover:bg-white/5" style={{ color: colors.textSecondary, border: `1px solid ${colors.inputBorder}` }}>
            <Upload size={12} /> Import
          </button>
        </div>
      </div>

      {/* ══════ NOTES PANEL ══════ */}
      {showNotesPanel && <NotesListPanel isDark={isDark} colors={colors} notes={notes} onEdit={openEditNote} onDelete={handleDeleteNote} onClose={() => setShowNotesPanel(false)} />}

      {/* ══════ MAIN GRAPH AREA ══════ */}
      <div className="relative flex-1 h-full overflow-hidden" onMouseDown={handleMouseDown}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3" style={{ background: colors.topBarBg }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}` }}>
              <Network size={14} color={isDark ? '#22d3ee' : '#3b82f6'} />
              <span className="text-[12px]" style={{ color: colors.textSecondary }}>Graph View</span>
            </div>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-lg" style={{ color: colors.textSecondary, border: `1px solid ${colors.inputBorder}` }}>
                <Tag size={10} /> {CATEGORIES.find(c => c.id === activeCategory)?.label} <span className="ml-1" style={{ color: colors.textMuted }}>Clear</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
              style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}`, color: colors.textSecondary }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#6366f1" />}
              {isDark ? 'Light' : 'Dark'}
            </button>

            {/* Zoom */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: colors.inputBg, border: `1px solid ${colors.inputBorder}` }}>
              <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"><ZoomOut size={14} style={{ color: colors.textMuted }} /></button>
              <span className="text-[11px] w-10 text-center" style={{ color: colors.textMuted }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"><ZoomIn size={14} style={{ color: colors.textMuted }} /></button>
              <div className="w-px h-4 mx-1" style={{ background: colors.inputBorder }} />
              <button onClick={handleZoomToFit} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all" title="Reset view"><Maximize2 size={14} style={{ color: colors.textMuted }} /></button>
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <svg ref={svgRef} className="w-full h-full" style={{ cursor: isPanning ? 'grabbing' : 'grab' }} onWheel={handleWheel}>
          <defs>
            {['#22d3ee', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#f97316'].map(color => (
              <filter key={color} id={`glow-${color.replace('#', '')}`} x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
            <pattern id="brain-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.gridColor} strokeWidth="0.5" />
            </pattern>
            <radialGradient id="bg-glow-brain" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isDark ? '#22d3ee' : '#a855f7'} stopOpacity={isDark ? '0.04' : '0.06'} />
              <stop offset="50%" stopColor={isDark ? '#a855f7' : '#3b82f6'} stopOpacity={isDark ? '0.025' : '0.035'} />
              <stop offset="100%" stopColor={isDark ? '#0a0a1a' : '#f5f3ff'} stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill={colors.bg} />
          <rect width="100%" height="100%" fill="url(#brain-grid)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <circle cx={500} cy={350} r={350} fill="url(#bg-glow-brain)" />

            {/* Edges */}
            {visibleEdges.map((edge, i) => {
              const fromNode = allNodes.find(n => n.id === edge.from)
              const toNode = allNodes.find(n => n.id === edge.to)
              if (!fromNode || !toNode) return null
              const isH = hoveredNode === edge.from || hoveredNode === edge.to
              return (
                <line key={`e-${i}`} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y}
                  stroke={isH ? fromNode.color : `${fromNode.color}${isDark ? '22' : '16'}`}
                  strokeWidth={isH ? 1.5 : 0.8} opacity={isH ? 1 : isDark ? 0.4 : 0.25}
                  style={{ transition: 'all 0.3s ease' }} />
              )
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              const isH = hoveredNode === node.id
              const hasLabel = node.label.length > 0
              const glowFilter = `url(#glow-${node.color.replace('#', '').slice(0, 6)})`
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
                  {isH && <circle r={node.r + 12} fill="none" stroke={node.color} strokeWidth="0.5" opacity={0.4}><animate attributeName="r" values={`${node.r + 8};${node.r + 16};${node.r + 8}`} dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" /></circle>}
                  <circle r={node.r + 4} fill={node.glow} opacity={isH ? 0.5 : 0.2} filter={glowFilter} style={{ transition: 'all 0.3s ease' }} />
                  <circle r={node.r} fill={node.color} opacity={isH ? 1 : 0.85} style={{ transition: 'all 0.2s ease' }} />
                  <circle r={node.r * 0.5} fill="#fff" opacity={isH ? 0.3 : 0.15} cy={-node.r * 0.15} cx={-node.r * 0.15} style={{ transition: 'all 0.2s ease' }} />
                  {hasLabel && (
                    <g>
                      <rect x={-((node.label.length * 6.5) + 12) / 2} y={node.r + 8} width={(node.label.length * 6.5) + 12} height={18} rx={4}
                        fill={isDark ? 'rgba(10,10,26,0.88)' : 'rgba(255,255,255,0.92)'}
                        stroke={isH ? `${node.color}60` : colors.inputBorder} strokeWidth="0.5" style={{ transition: 'all 0.2s ease' }} />
                      <text y={node.r + 20} textAnchor="middle" fill={isH ? colors.textPrimary : colors.textSecondary} fontSize="10" fontWeight={isH ? '600' : '500'}
                        fontFamily="'Outfit', system-ui, sans-serif" style={{ transition: 'all 0.2s ease' }}>{node.label}</text>
                    </g>
                  )}
                </g>
              )
            })}

            <g transform="translate(500, 350)">
              <text y={-42} textAnchor="middle" fill={isDark ? '#22d3ee' : '#3b82f6'} fontSize="11" fontWeight="600" opacity={0.7} fontFamily="'Outfit', system-ui, sans-serif">AI</text>
            </g>
          </g>
        </svg>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-2.5" style={{ background: colors.bottomBarBg }}>
          <div className="flex items-center gap-3">
            <span className="text-[11px]" style={{ color: colors.textMuted }}>{filteredNodes.length} nodes visible</span>
            <span style={{ color: colors.inputBorder }}>|</span>
            <span className="text-[11px]" style={{ color: colors.textMuted }}>{visibleEdges.length} connections</span>
          </div>
          <div className="flex items-center gap-2">
            <Grid3x3 size={12} style={{ color: colors.textMuted }} />
            <span className="text-[11px]" style={{ color: colors.textMuted }}>Drag to pan &middot; Scroll to zoom</span>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredNode && (
          <div className="absolute z-30 px-3 py-2 pointer-events-none" style={{ right: 20, top: 60, background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 12, backdropFilter: 'blur(12px)' }}>
            {(() => {
              const node = allNodes.find(n => n.id === hoveredNode)
              if (!node) return null
              const cat = CATEGORIES.find(c => c.id === node.category)
              return (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: node.color }} />
                    <span className="text-[13px] font-semibold" style={{ color: colors.textPrimary }}>{node.label || node.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: colors.textMuted }}>
                    <span style={{ color: cat?.color || colors.textSecondary }}>{cat?.label || node.category}</span>
                    <span>&middot;</span>
                    <span>{node.connections.length} connections</span>
                    {node.isNote && <><span>&middot;</span><span style={{ color: CAT_COLORS['notes'] }}>Note</span></>}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* ══════ CHAT PANEL ══════ */}
      {showChatPanel && <ChatPanel isDark={isDark} colors={colors} allNodes={allNodes} notes={notes} onAddNote={openNoteModal} onClose={() => setShowChatPanel(false)} />}

      {/* ══════ SOCIAL PANEL ══════ */}
      {showSocialPanel && <SocialPanel isDark={isDark} colors={colors} onClose={() => setShowSocialPanel(false)} />}

      {/* ══════ MODALS ══════ */}
      {showNoteModal && <NoteModal isDark={isDark} colors={colors} onClose={() => { setShowNoteModal(false); setEditingNote(null) }} onSave={handleSaveNote} editNote={editingNote} />}
      {showImportModal && <ImportModal isDark={isDark} colors={colors} onClose={() => setShowImportModal(false)} onImport={handleImport} />}

      {/* ══════ TOAST ══════ */}
      {toast && (
        <div className="fixed z-[60] flex items-center gap-2 px-4 py-2.5 rounded-xl bottom-6 left-1/2 -translate-x-1/2" style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)', color: '#fff', fontSize: 12 }}>
          <Check size={14} className="text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  )
}
