import React, { useState, useMemo } from 'react'
import {
  Bell, Check, CheckCheck, Trash2, Clock, User, FileText,
  MessageSquare, Shield, CreditCard, Settings, X, Filter,
  ChevronDown, AlertCircle, Sparkles, Zap, Mail, Menu,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════ */
const KIRA_BTN = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const CARD = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(17,24,39,0.07)',
  borderRadius: 20,
}

/* ═══════════════════════════════════════════════════════════ */
interface Notif {
  id: string
  title: string
  desc: string
  time: string
  read: boolean
  type: 'system' | 'chat' | 'security' | 'billing' | 'file' | 'meeting'
  icon: React.ElementType
  color: string
}

const INITIAL_NOTIFS: Notif[] = [
  { id: '1', title: 'Welcome to Beeda AI', desc: 'Your AI assistant Kira is ready to help you. Try asking anything!', time: '2 min ago', read: false, type: 'system', icon: Sparkles, color: '#a855f7' },
  { id: '2', title: 'New meeting transcript', desc: 'Q3 Product Planning session has been transcribed and summarised.', time: '15 min ago', read: false, type: 'meeting', icon: FileText, color: '#3b82f6' },
  { id: '3', title: 'Security alert', desc: 'New login detected from Chrome on MacBook Pro in Los Angeles.', time: '1 hr ago', read: false, type: 'security', icon: Shield, color: '#ef4444' },
  { id: '4', title: 'Brain sync complete', desc: 'Your knowledge graph has been synced across all devices.', time: '2 hrs ago', read: true, type: 'system', icon: Zap, color: '#10b981' },
  { id: '5', title: 'Payment successful', desc: 'Pro Plan subscription renewed — $29 charged to card ending 4242.', time: '5 hrs ago', read: true, type: 'billing', icon: CreditCard, color: '#f59e0b' },
  { id: '6', title: 'File upload complete', desc: '"Project_Brief_Q3.pdf" has been uploaded to My Files.', time: '8 hrs ago', read: true, type: 'file', icon: FileText, color: '#6366f1' },
  { id: '7', title: 'New message from Kira', desc: 'Kira has completed your requested analysis. Tap to view results.', time: 'Yesterday', read: true, type: 'chat', icon: MessageSquare, color: '#22d3ee' },
  { id: '8', title: 'Integration connected', desc: 'Slack workspace connected successfully. You will now receive alerts.', time: 'Yesterday', read: true, type: 'system', icon: Settings, color: '#8b5cf6' },
  { id: '9', title: 'Meeting reminder', desc: 'Client Intro — Acme Corp starts in 30 minutes. Join via the link.', time: 'Yesterday', read: true, type: 'meeting', icon: Clock, color: '#f97316' },
  { id: '10', title: 'Profile updated', desc: 'Your profile information has been updated successfully.', time: '2 days ago', read: true, type: 'system', icon: User, color: '#10b981' },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'system', label: 'System' },
  { id: 'chat', label: 'Chat' },
  { id: 'security', label: 'Security' },
  { id: 'billing', label: 'Billing' },
  { id: 'meeting', label: 'Meetings' },
]

const TYPE_LABELS: Record<string, string> = {
  system: 'System', chat: 'Chat', security: 'Security', billing: 'Billing', file: 'File', meeting: 'Meeting',
}

/* ═══════════════════════════════════════════════════════════ */
export default function NotificationsView() {
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS)
  const [activeFilter, setActiveFilter] = useState('all')
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const unreadCount = useMemo(() => notifs.filter(n => !n.read).length, [notifs])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return notifs
    if (activeFilter === 'unread') return notifs.filter(n => !n.read)
    return notifs.filter(n => n.type === activeFilter)
  }, [notifs, activeFilter])

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }
  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    showToast('All notifications marked as read')
  }
  const deleteNotif = (id: string) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
    showToast('Notification removed')
  }
  const clearAll = () => {
    setNotifs([])
    showToast('All notifications cleared')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'url("/MainBG.png") center right / cover no-repeat' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 mb-2 border-b border-black/10">
        <div>
          <h1 className="text-[30px] font-medium text-black">Good Day Kobe!</h1>
          <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">Nice to see you again.</p>
        </div>
        <div className="flex items-center gap-[20px]">
          <button className="flex items-center justify-between gap-[10px] px-[20px] py-2.5 bg-white border border-[#111827]/10 text-black rounded-[14px] text-[15px] font-medium shadow-md transition-shadow">
            <img src="/ActivityLog.png" alt="" className="w-[20px] h-[20px]" />
            Activity Log
          </button>
          <div className="w-[1px] h-[30px] border-l border-[#111827]/10" />
          <div className="flex items-center gap-[10px]">
            <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center relative">
              <img src="/bell.png" alt="Notifications" className="w-[24px] h-[24px]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </button>
            <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
              <img src="/setting.png" alt="Settings" className="w-[24px] h-[24px]" />
            </button>
          </div>
          <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden cursor-pointer">
            <img src="/profile.png" alt="Profile" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(196,181,253,0.4) 0%, rgba(147,197,253,0.3) 40%, transparent 70%)' }} />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[26px] font-semibold text-[#1a1a2e]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Notifications</h2>
              <p className="text-[13px] text-[#696D7D]">
                {unreadCount > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                  </span>
                ) : 'All caught up'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-90"
                style={{ background: KIRA_BTN, color: '#fff', boxShadow: KIRA_GLOW }}>
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            )}
            <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors border"
              style={{ borderColor: 'rgba(239,68,68,0.12)' }}>
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-[#9ca3af] flex-shrink-0" />
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className="px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all flex-shrink-0 whitespace-nowrap"
                style={{
                  background: activeFilter === f.id ? KIRA_BTN : 'rgba(255,255,255,0.6)',
                  color: activeFilter === f.id ? '#fff' : '#696D7D',
                  boxShadow: activeFilter === f.id ? KIRA_GLOW : 'none',
                }}>
                {f.label}
                {f.id === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: activeFilter === f.id ? 'rgba(255,255,255,0.25)' : '#ef4444', color: activeFilter === f.id ? '#fff' : '#fff' }}>{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(59,130,246,0.08)' }}>
                  <Bell className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">No notifications</h3>
                <p className="text-[13px] text-[#696D7D]">{activeFilter === 'unread' ? "You've read all your notifications." : 'No notifications in this category.'}</p>
              </div>
            )}
            {filtered.map(n => {
              const Icon = n.icon
              return (
                <div key={n.id} className="group flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer"
                  style={{
                    background: n.read ? 'rgba(255,255,255,0.6)' : 'rgba(59,130,246,0.05)',
                    border: `1px solid ${n.read ? 'rgba(17,24,39,0.05)' : 'rgba(59,130,246,0.12)'}`,
                  }}
                  onClick={() => markRead(n.id)}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}12` }}>
                    <Icon className="w-5 h-5" style={{ color: n.color }} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: `${n.color}10`, color: n.color }}>{TYPE_LABELS[n.type]}</span>
                      <span className="text-[11px] text-[#9ca3af] flex-shrink-0 ml-auto">{n.time}</span>
                    </div>
                    <h4 className={`text-[14px] font-semibold text-[#1a1a2e] truncate ${!n.read ? '' : ''}`}>{n.title}</h4>
                    <p className="text-[12.5px] text-[#696D7D] leading-relaxed mt-0.5">{n.desc}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!n.read && (
                      <button onClick={(e) => { e.stopPropagation(); markRead(n.id) }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors" title="Mark as read">
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id) }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors" title="Remove">
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl text-white text-[13px] font-medium z-[200] pointer-events-none"
          style={{ background: '#111827', boxShadow: '0 6px 20px rgba(14,10,46,0.2)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
