import React, { useState, useRef, useEffect } from 'react'
import {
  Plus, Send, Image, Mic, FileText,
  Clock, Command, ChevronDown, Copy,
  ExternalLink, Globe, Cpu,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════ */
interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  codeBlocks?: { lang: string; code: string }[]
  links?: { label: string; url: string }[]
  actionCards?: { icon: string; label: string }[]
  timestamp: string
}

interface ChatThread {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  agent: string
  unread: number
  messages: ChatMessage[]
}

/* ═══ KIRA THEME CONSTANTS (from App.tsx) ═══ */
const KIRA_BG = 'url("/MainBG.png") center right / cover no-repeat'
const KIRA_BTN_BLUE = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_CARD_BG = 'rgba(255,255,255,0.82)'
const KIRA_CARD_BORDER = '1px solid rgba(17,24,39,0.07)'
const KIRA_ACTIVE_BG = 'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'
const KIRA_BLUR = 'blur(16px)'
const KIRA_TEXT = '#1a1a2e'
const KIRA_TEXT_SECONDARY = '#696D7D'
const KIRA_BLUE_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const KIRA_BORDER_RADIUS = 20
const KIRA_BLUE = '#3b82f6'
// const KIRA_BLUE_HOVER = '#1d4ed8'
const KIRA_SIDEBAR_BG = 'rgba(255,255,255,0.6)'

/* ═══════════════════════════════════════════════════════════ */
const chats: ChatThread[] = [
  { id: 'c1', title: 'Locate SIDEBAR_DESIGN....', lastMessage: '', timestamp: '', agent: 'Assistant', unread: 0,
    messages: [
      { id: 'm1', role: 'agent', content: 'The project uses Vite + React 18 + TypeScript. Your SignUpPage.tsx is included exactly as you provided it - no modifications. The lucide-react dependency is installed so all icons work correctly, and both image assets (beeda-logo.png and MainBG.png) are in the public/ folder so they\'re served at root path (/beeda-logo.png, /MainBG.png) matching your component\'s references.', codeBlocks: [{ lang: 'bash', code: 'cd kira-signup-react\nnpm install\nnpm run dev' }], timestamp: '10:33 AM' },
      { id: 'm2', role: 'agent', content: 'Here is your live deployed preview — click to open:', links: [{ label: 'Live Preview — Kira AI Sign Up', url: '#' }], timestamp: '10:35 AM' },
      { id: 'm3', role: 'user', content: 'can you please deploy iy here and shsare the live deploy preview', timestamp: '10:36 AM' },
      { id: 'm4', role: 'agent', content: '', actionCards: [{ icon: 'python', label: 'Execute Python code' }], timestamp: '10:37 AM' },
      { id: 'm5', role: 'agent', content: 'This is a fully functional, in-browser rendered version of your exact SignUpPage.tsx component. It includes:', timestamp: '10:38 AM' },
    ],
  },
  { id: 'c2', title: 'Homework Tab Update', lastMessage: '', timestamp: '', agent: 'Kira', unread: 0, messages: [] },
  { id: 'c4', title: 'HTML to TSX Conversion', lastMessage: '', timestamp: '', agent: 'Kira', unread: 0, messages: [] },
  { id: 'c5', title: 'Travel Planner Single File ...', lastMessage: '', timestamp: '', agent: 'Kira', unread: 0, messages: [] },
  { id: 'c6', title: 'All Chats', lastMessage: '', timestamp: '', agent: 'Kira', unread: 0, messages: [] },
]

/* ═══════════════════════════════════════════════════════════ */
export default function ChatHistoryView() {
  const [activeId, setActiveId] = useState<string>('c2')
  const [input, setInput] = useState('')
  const [allChats, setAllChats] = useState(chats)
  const endRef = useRef<HTMLDivElement>(null)

  const activeChat = allChats.find(c => c.id === activeId)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeChat?.messages.length])

  const send = () => {
    if (!input.trim() || !activeChat) return
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setAllChats(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.content } : c
    ))
    setInput('')
    setTimeout(() => {
      const replies = ['Got it! Processing now.', 'I\'m on it.', 'Working on that for you.', 'Let me handle that.']
      const reply: ChatMessage = {
        id: `m${Date.now() + 1}`, role: 'agent',
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setAllChats(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMsg, reply], lastMessage: reply.content } : c
      ))
    }, 1500)
  }

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  const copyCode = (code: string) => navigator.clipboard.writeText(code)

  return (
    <div className="h-full flex overflow-hidden" style={{ background: KIRA_BG }}>
      {/* ═════════════ LEFT SIDEBAR ═════════════ */}
      <div className="w-[280px] flex-shrink-0 flex flex-col"
        style={{ background: KIRA_SIDEBAR_BG, backdropFilter: KIRA_BLUR, borderRight: KIRA_CARD_BORDER }}>

        {/* New Chat button */}
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2.5 text-white text-[13px] font-medium transition-all hover:opacity-90"
            style={{ background: KIRA_BTN_BLUE, borderRadius: 14, boxShadow: KIRA_BLUE_GLOW }}>
            <Plus className="w-4 h-4" />New Chat
            <span className="ml-auto flex items-center gap-1 text-[10px] text-white/60">
              <Command className="w-3 h-3" />K
            </span>
          </button>
        </div>

        {/* Main nav */}
        <div className="px-2 space-y-0.5">
          {[
            { icon: <FileText className="w-4 h-4" />, label: 'Slides' },
            { icon: <Globe className="w-4 h-4" />, label: 'Websites' },
            { icon: <FileText className="w-4 h-4" />, label: 'Docs' },
            { icon: <Cpu className="w-4 h-4" />, label: 'Deep Research' },
            { icon: <FileText className="w-4 h-4" />, label: 'Sheets' },
          ].map(item => (
            <button key={item.label}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-all text-left"
              style={{ color: KIRA_TEXT_SECONDARY, borderRadius: 14, background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,238,255,0.5)'; e.currentTarget.style.color = KIRA_BLUE }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = KIRA_TEXT_SECONDARY }}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        {/* Chat History section */}
        <div className="mt-3 px-4 pb-1.5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" style={{ color: KIRA_TEXT_SECONDARY }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: KIRA_TEXT_SECONDARY }}>Chat History</span>
        </div>

        <div className="px-2 flex-1 overflow-y-auto space-y-0.5">
          {allChats.map(chat => {
            const isActive = activeId === chat.id
            return (
              <button
                key={chat.id}
                onClick={() => setActiveId(chat.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all"
                style={{
                  borderRadius: 14,
                  background: isActive ? KIRA_ACTIVE_BG : 'transparent',
                  color: isActive ? KIRA_BLUE : KIRA_TEXT_SECONDARY,
                }}>
                <span className="text-[12px] truncate font-medium" style={{ color: isActive ? KIRA_BLUE : KIRA_TEXT }}>
                  {chat.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═════════════ RIGHT CHAT PANEL ═════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header (matches Dashboard exactly) ── */}
        <div className="flex items-center justify-between px-5 py-6 mb-6 border-b border-black/10 flex-shrink-0">
          <div>
            <h1 className="text-[30px] font-medium text-black">Good Day Kobe!</h1>
            <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">Nice to see you again.</p>
          </div>
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center justify-between gap-[10px]">
              <button
                className="flex items-center justify-center gap-[10px] px-[20px] bg-white border border-[#111827]/10 text-black rounded-[14px] text-[15px] font-medium shadow-md transition-shadow"
                style={{ width: 159, height: 50 }}>
                <img src="/ActivityLog.png" alt="" className="w-[20px] h-[20px]" />Activity Log
              </button>
              <button
                className="flex items-center justify-center gap-[4px] px-[16px] text-white rounded-[14px] text-[16px] font-medium"
                style={{
                  width: 159, height: 50,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                }}>
                <img src="/NewTask.png" alt="" className="w-[20px] h-[20px]" />New Task
              </button>
            </div>
            <div className="w-[1px] h-[30px] border-l border-[#111827]/10"></div>
            <div className="flex items-center justify-between gap-[15px]">
              <div className="flex items-center justify-between gap-[10px]">
                <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                  <img src="/bell.png" alt="Notifications" className="w-[24px] h-[24px]" />
                </button>
                <button className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
                  <img src="/setting.png" alt="Settings" className="w-[24px] h-[24px]" />
                </button>
              </div>
              <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="/profile.png" alt="Profile" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className={`overflow-y-auto px-6 ${activeChat && activeChat.messages.length > 0 ? 'flex-1 py-6' : 'flex-none'}`}>
          {activeChat && activeChat.messages.length > 0 && activeChat.messages.map(msg => (
            <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
              {/* Code blocks */}
              {msg.codeBlocks?.map((block, i) => (
                <div key={i} className="mb-3 overflow-hidden max-w-[85%]"
                  style={{ background: 'rgba(26,26,46,0.95)', borderRadius: 14, border: KIRA_CARD_BORDER }}>
                  <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: KIRA_CARD_BORDER }}>
                    <span className="text-[11px]" style={{ color: KIRA_BLUE }}>{block.lang}</span>
                    <button onClick={() => copyCode(block.code)} className="flex items-center gap-1 text-[11px] transition-colors hover:text-white"
                      style={{ color: KIRA_TEXT_SECONDARY }}>
                      <Copy className="w-3 h-3" />Copy
                    </button>
                  </div>
                  <pre className="px-4 py-3 text-[13px] font-mono leading-relaxed overflow-x-auto" style={{ color: '#c7d2fe' }}>{block.code}</pre>
                </div>
              ))}
              {/* Action cards */}
              {msg.actionCards?.map((card, i) => (
                <div key={i} className="mb-3 flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:shadow-md max-w-[85%]"
                  style={{ background: KIRA_CARD_BG, backdropFilter: KIRA_BLUR, border: KIRA_CARD_BORDER, borderRadius: 14 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <ExternalLink className="w-4 h-4" style={{ color: KIRA_BLUE }} />
                  </div>
                  <span className="text-[13px] font-medium" style={{ color: KIRA_TEXT }}>{card.label}</span>
                  <ChevronDown className="w-4 h-4 ml-auto" style={{ color: KIRA_TEXT_SECONDARY, transform: 'rotate(-90deg)' }} />
                </div>
              ))}
              {/* Text content */}
              {msg.content && (
                <div className="text-[14px] leading-relaxed max-w-[85%]"
                  style={msg.role === 'user' ? {
                    background: KIRA_BTN_BLUE,
                    color: '#fff',
                    padding: '10px 16px',
                    borderRadius: '16px 16px 4px 16px',
                    boxShadow: KIRA_BLUE_GLOW,
                  } : { color: KIRA_TEXT }}>
                  {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={i} className="font-semibold" style={{ color: msg.role === 'user' ? '#fff' : KIRA_BLUE }}>{part.slice(2, -2)}</strong>
                      : <span key={i}>{part}</span>
                  )}
                </div>
              )}
              {/* Links */}
              {msg.links?.map((link, i) => (
                <a key={i} href={link.url} className="mt-2 inline-flex items-center gap-1.5 text-[14px] hover:underline font-medium max-w-[85%]"
                  style={{ color: KIRA_BLUE }}>
                  <ExternalLink className="w-3.5 h-3.5" />{link.label}
                </a>
              ))}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Centered Chat Input Area */}
        <div className={`flex flex-col items-center justify-center w-full px-6 ${activeChat && activeChat.messages.length > 0 ? 'pb-4 flex-none' : 'flex-1'}`}>
          {/* Welcome text when empty */}
          {(!activeChat || activeChat.messages.length === 0) && (
            <div className="mb-6 text-center">
              <h2 className="text-[26px] font-bold" style={{ color: KIRA_TEXT }}>What can I help you with?</h2>
              <p className="text-[13px] mt-1" style={{ color: KIRA_TEXT_SECONDARY }}>Ask away. Pics work too.</p>
            </div>
          )}

          {/* Chat Input Box */}
          <div className="w-full max-w-[720px]">
            <div className="flex items-start gap-2 p-4 min-h-[180px] transition-all hover:shadow-xl"
              style={{
                background: KIRA_CARD_BG,
                backdropFilter: KIRA_BLUR,
                border: KIRA_CARD_BORDER,
                borderRadius: KIRA_BORDER_RADIUS,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}>
              <button className="p-2 flex-shrink-0 mt-1 transition-all rounded-xl"
                style={{ background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <Plus className="w-5 h-5" style={{ color: KIRA_BLUE }} />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder={activeChat && activeChat.messages.length > 0 ? "Ask away. Pics work too." : "Type your message..."}
                rows={5}
                className="flex-1 px-2 py-1.5 text-[14px] outline-none resize-none min-h-[140px] max-h-[200px] bg-transparent"
                style={{ color: KIRA_TEXT }}
              />
              <div className="flex items-center gap-1 flex-shrink-0 self-end mb-1">
                {/* Image upload */}
                <button className="p-2 rounded-xl transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <Image className="w-5 h-5" style={{ color: KIRA_BLUE }} />
                </button>
                {/* Mic */}
                <button className="p-2 rounded-xl transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <Mic className="w-5 h-5" style={{ color: KIRA_BLUE }} />
                </button>
                {/* File upload */}
                <button className="p-2 rounded-xl transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  <FileText className="w-5 h-5" style={{ color: KIRA_BLUE }} />
                </button>
                {/* Model selector */}
                <span className="text-[11px] ml-1 hidden sm:inline" style={{ color: KIRA_TEXT_SECONDARY }}>K2.6 Instant</span>
                <ChevronDown className="w-3 h-3" style={{ color: KIRA_TEXT_SECONDARY }} />
                {/* Send */}
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="ml-1 p-2.5 rounded-xl transition-all text-white"
                  style={{
                    background: input.trim() ? KIRA_BTN_BLUE : '#e5e7eb',
                    boxShadow: input.trim() ? KIRA_BLUE_GLOW : 'none',
                    opacity: input.trim() ? 1 : 0.5,
                    borderRadius: 14,
                  }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-[11px] mt-2" style={{ color: KIRA_TEXT_SECONDARY }}>AI can make mistakes. Please verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
