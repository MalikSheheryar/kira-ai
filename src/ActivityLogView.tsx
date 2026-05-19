import React, { useState, useMemo } from 'react'
import {
  Clock, Search, Filter, Calendar, ChevronDown, CheckCircle2,
  AlertCircle, XCircle, RefreshCw, Bot, Globe, FolderOpen,
  CreditCard, Bell, Shield, User, Trash2, ExternalLink,
  Download, FileText, Image, Mail, MessageSquare, Plane,
  QrCode, Code, Utensils, Users, Mic, Sparkles, Zap,
  ArrowUpRight, Activity, X, ChevronRight, CalendarDays,
  BarChart3, Layers, CircleDot, Cloud,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════ */
const KIRA_BTN_BLUE = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_BLUE_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const KIRA_CARD_BG = 'rgba(255,255,255,0.82)'
const KIRA_CARD_BORDER = '1px solid rgba(17,24,39,0.07)'

/* ═══════════════════════════════════════════════════════════ */
interface ActivityItem {
  id: string
  type: 'ai_task' | 'integration' | 'file' | 'calendar' | 'billing' | 'security' | 'system'
  title: string
  description: string
  timestamp: string
  date: string
  status: 'success' | 'warning' | 'error' | 'pending' | 'info'
  icon: any
  user?: string
  duration?: string
}

const activities: ActivityItem[] = [
  { id: 'a1', type: 'ai_task', title: 'Trip to Bali planned', description: 'Kira created a 7-day itinerary with flights and hotels', timestamp: '2 min ago', date: '2026-05-18', status: 'success', icon: Plane, duration: '1.2s' },
  { id: 'a2', type: 'integration', title: 'Slack connected', description: 'Workspace "Beeda Team" linked successfully', timestamp: '15 min ago', date: '2026-05-18', status: 'success', icon: MessageSquare, user: 'Kobe Bryant' },
  { id: 'a3', type: 'ai_task', title: 'Email campaign created', description: '5-email sequence generated for Q2 product launch', timestamp: '32 min ago', date: '2026-05-18', status: 'success', icon: Mail, duration: '45s' },
  { id: 'a4', type: 'security', title: 'Password reset', description: 'Password reset link sent to kobe@beeda.ai', timestamp: '1 hr ago', date: '2026-05-18', status: 'info', icon: Shield, user: 'System' },
  { id: 'a5', type: 'file', title: 'Files uploaded', description: '12 images uploaded to Kira Cloud (48 MB)', timestamp: '2 hrs ago', date: '2026-05-18', status: 'success', icon: FolderOpen, user: 'Kobe Bryant' },
  { id: 'a6', type: 'billing', title: 'Payment processed', description: 'Pro Plan renewal — $29.00 charged to •••• 4242', timestamp: '3 hrs ago', date: '2026-05-18', status: 'success', icon: CreditCard, user: 'Auto' },
  { id: 'a7', type: 'ai_task', title: 'Code review completed', description: 'Refactored API handler from callbacks to async/await', timestamp: '4 hrs ago', date: '2026-05-18', status: 'success', icon: Code, duration: '2.1s' },
  { id: 'a8', type: 'integration', title: 'Google Drive sync failed', description: 'Authentication token expired. Please reconnect.', timestamp: '5 hrs ago', date: '2026-05-18', status: 'error', icon: RefreshCw, user: 'System' },
  { id: 'a9', type: 'calendar', title: 'Meeting scheduled', description: 'Client review meeting with TechVentures on May 24, 10:00 AM', timestamp: '6 hrs ago', date: '2026-05-18', status: 'success', icon: CalendarDays },
  { id: 'a10', type: 'security', title: 'New device signed in', description: 'iPhone 15 Pro from Los Angeles, CA', timestamp: '7 hrs ago', date: '2026-05-18', status: 'warning', icon: AlertCircle, user: 'Kobe Bryant' },
  { id: 'a11', type: 'ai_task', title: 'Meal plan generated', description: 'Vegetarian meal plan for week of May 19 with grocery list', timestamp: '8 hrs ago', date: '2026-05-18', status: 'success', icon: Utensils, duration: '38s' },
  { id: 'a12', type: 'file', title: 'Document analyzed', description: 'Quarterly report summarized — 12 pages processed', timestamp: '10 hrs ago', date: '2026-05-18', status: 'success', icon: FileText, duration: '12s' },
  { id: 'a13', type: 'system', title: 'Kira updated', description: 'App updated to v3.2.1 — new features available', timestamp: '12 hrs ago', date: '2026-05-18', status: 'info', icon: Zap, user: 'System' },
  { id: 'a14', type: 'billing', title: 'Card added', description: 'Visa ending in 4242 added to payment methods', timestamp: 'Yesterday', date: '2026-05-17', status: 'success', icon: CreditCard, user: 'Kobe Bryant' },
  { id: 'a15', type: 'ai_task', title: 'QR codes generated', description: '15 QR codes created for marketing campaign', timestamp: 'Yesterday', date: '2026-05-17', status: 'success', icon: QrCode, duration: '3.4s' },
  { id: 'a16', type: 'integration', title: 'Notion connected', description: 'Note sync and page export enabled', timestamp: 'Yesterday', date: '2026-05-17', status: 'success', icon: Layers },
  { id: 'a17', type: 'security', title: '2FA enabled', description: 'Two-factor authentication activated via authenticator app', timestamp: 'May 16', date: '2026-05-16', status: 'success', icon: Shield, user: 'Kobe Bryant' },
  { id: 'a18', type: 'file', title: 'Files synced to cloud', description: '45 files synced — 12.3 GB uploaded to Kira Cloud', timestamp: 'May 16', date: '2026-05-16', status: 'success', icon: Cloud },
  { id: 'a19', type: 'calendar', title: 'Event reminder', description: 'Team standup in 15 minutes', timestamp: 'May 15', date: '2026-05-15', status: 'pending', icon: Clock },
  { id: 'a20', type: 'ai_task', title: 'Meeting notes taken', description: 'Captured notes from TechVentures client call', timestamp: 'May 15', date: '2026-05-15', status: 'success', icon: Mic, duration: '5.2s' },
]

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: CheckCircle2 },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: AlertCircle },
  error: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: XCircle },
  pending: { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: Clock },
  info: { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', icon: CircleDot },
}

const typeLabels: Record<string, string> = {
  ai_task: 'AI Tasks', integration: 'Integrations', file: 'Files', calendar: 'Calendar', billing: 'Billing', security: 'Security', system: 'System',
}

/* ═══════════════════════════════════════════════════════════ */
export default function ActivityLogView() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('all')

  const filtered = useMemo(() => activities.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
    const matchType = activeFilter === 'all' || a.type === activeFilter
    const matchStatus = activeStatus === 'all' || a.status === activeStatus
    return matchSearch && matchType && matchStatus
  }), [search, activeFilter, activeStatus])

  const grouped = useMemo(() => {
    const g: Record<string, ActivityItem[]> = {}
    filtered.forEach(a => {
      if (!g[a.date]) g[a.date] = []
      g[a.date].push(a)
    })
    return g
  }, [filtered])

  const stats = [
    { label: 'Total', value: activities.length, icon: Activity, color: '#3b82f6' },
    { label: 'AI Tasks', value: activities.filter(a => a.type === 'ai_task').length, icon: Bot, color: '#8b5cf6' },
    { label: 'Success', value: activities.filter(a => a.status === 'success').length, icon: CheckCircle2, color: '#10b981' },
    { label: 'Errors', value: activities.filter(a => a.status === 'error').length, icon: XCircle, color: '#ef4444' },
  ]

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'url("/MainBG.png") center right / cover no-repeat' }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: KIRA_CARD_BORDER, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)' }}>
        <div>
          <h1 className="text-[30px] font-medium text-black">Activity Log</h1>
          <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">Track everything Kira does for you</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all hover:shadow-sm"
            style={{ background: KIRA_CARD_BG, border: KIRA_CARD_BORDER, color: '#1a1a2e' }}>
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[900px] mx-auto space-y-6">

          {/* ── Stats ── */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="p-4 rounded-[20px]" style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <span className="text-[12px] text-[#696D7D] font-medium">{s.label}</span>
                  </div>
                  <p className="text-[24px] font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* ── Filters ── */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search activities..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[13px] outline-none focus:border-blue-400 transition-all"
                style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER, color: '#1a1a2e' }} />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100">
              {['all', 'ai_task', 'integration', 'file', 'security', 'billing', 'calendar'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${activeFilter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                  {typeLabels[f] || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Status filters ── */}
          <div className="flex items-center gap-2">
            {['all', 'success', 'warning', 'error', 'pending', 'info'].map(s => (
              <button key={s} onClick={() => setActiveStatus(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border"
                style={{
                  borderColor: activeStatus === s ? statusConfig[s]?.color || '#3b82f6' : 'transparent',
                  background: activeStatus === s ? (statusConfig[s]?.bg || 'rgba(59,130,246,0.08)') : 'transparent',
                  color: activeStatus === s ? (statusConfig[s]?.color || '#3b82f6') : '#696D7D',
                }}>
                {s !== 'all' && <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig[s]?.color }} />}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Timeline ── */}
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-4 h-4 text-[#696D7D]" />
                  <span className="text-[13px] font-semibold text-[#1a1a2e]">{date === '2026-05-18' ? 'Today' : date === '2026-05-17' ? 'Yesterday' : date}</span>
                  <span className="text-[11px] text-[#696D7D]">({items.length})</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="space-y-2">
                  {items.map(item => {
                    const Icon = item.icon
                    const cfg = statusConfig[item.status]
                    const StatusIcon = cfg.icon
                    const isSelected = selected === item.id
                    return (
                      <div key={item.id} onClick={() => setSelected(isSelected ? null : item.id)}
                        className="group p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md"
                        style={{
                          background: isSelected ? 'rgba(59,130,246,0.03)' : KIRA_CARD_BG,
                          backdropFilter: 'blur(16px)',
                          borderColor: isSelected ? '#3b82f6' : 'rgba(17,24,39,0.07)',
                        }}>
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cfg.color}12` }}>
                              <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                              <StatusIcon className="w-3 h-3" style={{ color: cfg.color }} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="text-[14px] font-semibold text-[#1a1a2e] truncate">{item.title}</h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#696D7D]">{item.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[11px] text-[#696D7D] flex items-center gap-1">
                                <Clock className="w-3 h-3" />{item.timestamp}
                              </span>
                              {item.duration && <span className="text-[11px] text-[#696D7D]">Duration: {item.duration}</span>}
                              {item.user && <span className="text-[11px] text-[#696D7D]">by {item.user}</span>}
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{typeLabels[item.type]}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 self-center transition-transform group-hover:translate-x-1" style={{ opacity: isSelected ? 1 : 0.3 }} />
                        </div>
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t flex items-center gap-3" style={{ borderColor: 'rgba(17,24,39,0.07)' }}>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all hover:bg-blue-50"
                              style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}>
                              <ExternalLink className="w-3.5 h-3.5" />View Details
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />Clear
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Activity className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-[14px]">No activities found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
