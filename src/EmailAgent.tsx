import { useState } from 'react'
import {
  Search,
  Plus,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  Tag,
  MoreHorizontal,
  Paperclip,
  Send,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  AlignLeft,
  X,
  Inbox,
  Mail,
  AlertCircle,
  FileText,
  Check,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────

interface EmailThread {
  id: string
  from: string
  fromEmail: string
  subject: string
  preview: string
  time: string
  timestamp: number
  isRead: boolean
  isStarred: boolean
  isSelected: boolean
  labels: string[]
  folder: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | 'starred'
  messages: EmailMessage[]
  hasAttachment: boolean
  aiSuggested?: string
}

interface EmailMessage {
  id: string
  from: string
  fromEmail: string
  to: string
  subject: string
  body: string
  time: string
  timestamp: number
  isRead: boolean
  attachments?: { name: string; size: string; type: string }[]
}

interface ComposeData {
  to: string
  cc: string
  bcc: string
  subject: string
  body: string
  showCc: boolean
  showBcc: boolean
}

// ─── Groq AI helper ────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

async function callGroq(
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 600,
    }),
  })
  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_THREADS: EmailThread[] = [
  {
    id: '1',
    from: 'Sarah Johnson',
    fromEmail: 'sarah@designco.com',
    subject: 'Q4 Campaign Assets - Final Review',
    preview:
      "Hey team, I've uploaded all the final assets for the Q4 campaign. Please review the brand guidelines...",
    time: '2m ago',
    timestamp: Date.now() - 120000,
    isRead: false,
    isStarred: true,
    isSelected: false,
    labels: ['Design', 'Urgent'],
    folder: 'inbox',
    hasAttachment: true,
    aiSuggested: 'Acknowledge receipt and confirm timeline',
    messages: [
      {
        id: 'm1',
        from: 'Sarah Johnson',
        fromEmail: 'sarah@designco.com',
        to: 'you@kira.ai',
        subject: 'Q4 Campaign Assets - Final Review',
        body: `<p>Hi,</p><p>I've uploaded all the final assets for the Q4 campaign. Please review the brand guidelines and let me know if everything looks good before we push to production.</p><p>Assets included:</p><ul><li>Banner ads (all sizes)</li><li>Social media templates</li><li>Email header designs</li></ul><p>The deadline is Friday EOD. Let me know if you need anything from me.</p><p>Best,<br/>Sarah</p>`,
        time: '2m ago',
        timestamp: Date.now() - 120000,
        isRead: false,
        attachments: [
          { name: 'Q4_Campaign_Assets.zip', size: '24.5 MB', type: 'zip' },
          { name: 'Brand_Guidelines_2024.pdf', size: '4.2 MB', type: 'pdf' },
        ],
      },
    ],
  },
  {
    id: '2',
    from: 'Michael Chen',
    fromEmail: 'm.chen@techstartup.io',
    subject: 'Partnership Proposal — AI Integration',
    preview:
      "Following up on our call last week. I've put together a detailed proposal for the AI integration partnership...",
    time: '18m ago',
    timestamp: Date.now() - 1080000,
    isRead: false,
    isStarred: false,
    isSelected: false,
    labels: ['Business'],
    folder: 'inbox',
    hasAttachment: true,
    aiSuggested: 'Schedule a follow-up call',
    messages: [
      {
        id: 'm2',
        from: 'Michael Chen',
        fromEmail: 'm.chen@techstartup.io',
        to: 'you@kira.ai',
        subject: 'Partnership Proposal — AI Integration',
        body: `<p>Hi,</p><p>Following up on our call last week. I've put together a detailed proposal for the AI integration partnership. The document covers scope, timeline, and pricing in full detail.</p><p>Let me know when you're available for a 30-minute review session.</p><p>Cheers,<br/>Michael</p>`,
        time: '18m ago',
        timestamp: Date.now() - 1080000,
        isRead: false,
        attachments: [
          { name: 'Partnership_Proposal_v2.pdf', size: '1.8 MB', type: 'pdf' },
        ],
      },
    ],
  },
  {
    id: '3',
    from: 'Aria Patel',
    fromEmail: 'aria@clients.net',
    subject: 'Re: Invoice #1047 — Payment Confirmation',
    preview:
      'Just wanted to confirm that the payment for invoice #1047 has been processed. You should see the funds...',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    isRead: true,
    isStarred: false,
    isSelected: false,
    labels: ['Finance'],
    folder: 'inbox',
    hasAttachment: false,
    messages: [
      {
        id: 'm3',
        from: 'Aria Patel',
        fromEmail: 'aria@clients.net',
        to: 'you@kira.ai',
        subject: 'Re: Invoice #1047 — Payment Confirmation',
        body: `<p>Hi,</p><p>Just wanted to confirm that the payment for invoice #1047 has been processed. You should see the funds in your account within 2-3 business days.</p><p>Thanks for the great work on the last project!</p><p>Best,<br/>Aria</p>`,
        time: '1h ago',
        timestamp: Date.now() - 3600000,
        isRead: true,
      },
    ],
  },
  {
    id: '4',
    from: 'Dev Team',
    fromEmail: 'dev@internal.kira',
    subject: 'Weekly Standup Notes + Action Items',
    preview:
      "Here are the notes from today's standup. Key action items: complete the API integration by Thursday...",
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    isRead: true,
    isStarred: false,
    isSelected: false,
    labels: ['Team'],
    folder: 'inbox',
    hasAttachment: false,
    messages: [
      {
        id: 'm4',
        from: 'Dev Team',
        fromEmail: 'dev@internal.kira',
        to: 'you@kira.ai',
        subject: 'Weekly Standup Notes + Action Items',
        body: `<p>Team,</p><p>Here are the notes from today's standup:</p><ul><li>API integration — due Thursday</li><li>Update design system tokens</li><li>Review PRs by EOD</li></ul><p>Ping @ops if you need anything unblocked.</p>`,
        time: '3h ago',
        timestamp: Date.now() - 10800000,
        isRead: true,
      },
    ],
  },
  {
    id: '5',
    from: 'Notion',
    fromEmail: 'noreply@notion.so',
    subject: 'Your workspace has been updated',
    preview:
      "A team member made changes to your shared workspace. Click here to see what's new...",
    time: 'Yesterday',
    timestamp: Date.now() - 86400000,
    isRead: true,
    isStarred: false,
    isSelected: false,
    labels: [],
    folder: 'inbox',
    hasAttachment: false,
    messages: [
      {
        id: 'm5',
        from: 'Notion',
        fromEmail: 'noreply@notion.so',
        to: 'you@kira.ai',
        subject: 'Your workspace has been updated',
        body: `<p>Hi,</p><p>A team member made changes to your shared workspace. Click the link below to see what's new.</p><a href="#">View changes →</a>`,
        time: 'Yesterday',
        timestamp: Date.now() - 86400000,
        isRead: true,
      },
    ],
  },
  {
    id: '6',
    from: 'James Whitfield',
    fromEmail: 'james@agencygroup.com',
    subject: 'Urgent: Client presentation moved to Monday',
    preview:
      'Just got word that the client wants to move the presentation to Monday morning. We need to finalize all slides by...',
    time: 'Yesterday',
    timestamp: Date.now() - 90000000,
    isRead: false,
    isStarred: true,
    isSelected: false,
    labels: ['Urgent'],
    folder: 'inbox',
    hasAttachment: false,
    messages: [
      {
        id: 'm6',
        from: 'James Whitfield',
        fromEmail: 'james@agencygroup.com',
        to: 'you@kira.ai',
        subject: 'Urgent: Client presentation moved to Monday',
        body: `<p>Hey,</p><p>Just got word that the client wants to move the presentation to Monday morning. We need to finalize all slides by Sunday evening.</p><p>Can you confirm you'll be available?</p><p>Cheers,<br/>James</p>`,
        time: 'Yesterday',
        timestamp: Date.now() - 90000000,
        isRead: false,
      },
    ],
  },
]

const LABEL_COLORS: Record<string, string> = {
  Design: '#818cf8',
  Urgent: '#f87171',
  Business: '#34d399',
  Finance: '#fbbf24',
  Team: '#60a5fa',
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: `hsl(${hue}, 65%, 58%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  )
}

function LabelBadge({ label }: { label: string }) {
  const color = LABEL_COLORS[label] ?? '#9ca3af'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        color,
        background: color + '18',
        border: `1px solid ${color}30`,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  )
}

// ─── Compose Window ─────────────────────────────────────────────────────────

function ComposeWindow({
  onClose,
  initialData,
  groqKey,
}: {
  onClose: () => void
  initialData?: Partial<ComposeData>
  groqKey: string
}) {
  const [data, setData] = useState<ComposeData>({
    to: initialData?.to ?? '',
    cc: '',
    bcc: '',
    subject: initialData?.subject ?? '',
    body: initialData?.body ?? '',
    showCc: false,
    showBcc: false,
  })
  const [minimized, setMinimized] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiHint, setAiHint] = useState('')

  const handleAiDraft = async () => {
    if (!groqKey || !data.subject) return
    setAiLoading(true)
    try {
      const text = await callGroq(
        'You are Kira, an AI email assistant. Write a professional, concise email based on the subject line provided. Keep it under 150 words. Return only the email body, no subject line.',
        `Write an email for subject: "${data.subject}"${data.to ? ` to ${data.to}` : ''}`,
        groqKey,
      )
      setData((d) => ({ ...d, body: text }))
    } catch {
      setAiHint('Failed to generate — check your Groq API key.')
    } finally {
      setAiLoading(false)
    }
  }

  if (minimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 24,
          width: 280,
          background: '#1a1d27',
          borderRadius: '12px 12px 0 0',
          border: '1px solid #2d3039',
          borderBottom: 'none',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          zIndex: 50,
        }}
        onClick={() => setMinimized(false)}
      >
        <span style={{ color: '#e5e7eb', fontSize: 13, fontWeight: 500 }}>
          {data.subject || 'New Message'}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Maximize2 size={14} color="#9ca3af" />
          <X
            size={14}
            color="#9ca3af"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 24,
        width: 560,
        maxWidth: 'calc(100vw - 48px)',
        background: '#ffffff',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        borderBottom: 'none',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
          borderRadius: '16px 16px 0 0',
        }}
      >
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
          New Message
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setMinimized(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 6,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Minimize2 size={12} color="#fff" />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 6,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={12} color="#fff" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: '0 16px', borderBottom: '1px solid #f1f5f9' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 0',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <span
            style={{ fontSize: 12, color: '#94a3b8', width: 32, flexShrink: 0 }}
          >
            To
          </span>
          <input
            value={data.to}
            onChange={(e) => setData((d) => ({ ...d, to: e.target.value }))}
            placeholder="Recipients"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 13,
              color: '#1e293b',
              background: 'transparent',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setData((d) => ({ ...d, showCc: !d.showCc }))}
              style={{
                fontSize: 11,
                color: data.showCc ? '#3b82f6' : '#94a3b8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cc
            </button>
            <button
              onClick={() => setData((d) => ({ ...d, showBcc: !d.showBcc }))}
              style={{
                fontSize: 11,
                color: data.showBcc ? '#3b82f6' : '#94a3b8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Bcc
            </button>
          </div>
        </div>
        {data.showCc && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 0',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#94a3b8',
                width: 32,
                flexShrink: 0,
              }}
            >
              Cc
            </span>
            <input
              value={data.cc}
              onChange={(e) => setData((d) => ({ ...d, cc: e.target.value }))}
              placeholder="CC recipients"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: '#1e293b',
                background: 'transparent',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            />
          </div>
        )}
        {data.showBcc && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 0',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#94a3b8',
                width: 32,
                flexShrink: 0,
              }}
            >
              Bcc
            </span>
            <input
              value={data.bcc}
              onChange={(e) => setData((d) => ({ ...d, bcc: e.target.value }))}
              placeholder="BCC recipients"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: '#1e293b',
                background: 'transparent',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 0',
          }}
        >
          <span
            style={{ fontSize: 12, color: '#94a3b8', width: 32, flexShrink: 0 }}
          >
            Sub
          </span>
          <input
            value={data.subject}
            onChange={(e) =>
              setData((d) => ({ ...d, subject: e.target.value }))
            }
            placeholder="Subject"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 13,
              color: '#1e293b',
              fontWeight: 500,
              background: 'transparent',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 16px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {[Bold, Italic, Underline, Link, List, AlignLeft].map((Icon, i) => (
          <button
            key={i}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <Icon size={14} />
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={handleAiDraft}
          disabled={aiLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            border: 'none',
            cursor: aiLoading ? 'not-allowed' : 'pointer',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            opacity: aiLoading ? 0.7 : 1,
          }}
        >
          <Sparkles size={11} />
          {aiLoading ? 'Drafting…' : 'AI Draft'}
        </button>
      </div>

      <textarea
        value={data.body}
        onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
        placeholder="Write your message…"
        style={{
          flex: 1,
          minHeight: 180,
          maxHeight: 260,
          padding: '14px 16px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 13,
          color: '#1e293b',
          lineHeight: 1.6,
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      />
      {aiHint && (
        <p style={{ fontSize: 11, color: '#f87171', padding: '0 16px 8px' }}>
          {aiHint}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            borderRadius: 8,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: 12,
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          <Paperclip size={13} /> Attach
        </button>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Send size={13} /> Send
        </button>
      </div>
    </div>
  )
}

// ─── Main EmailAgent Component ───────────────────────────────────────────────

export default function EmailAgent() {
  const [threads, setThreads] = useState<EmailThread[]>(MOCK_THREADS)
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null)
  const [activeFolder, setActiveFolder] = useState<string>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [composing, setComposing] = useState(false)
  const [composeData, setComposeData] = useState<Partial<ComposeData>>({})
  const [groqKey, setGroqKey] = useState('')
  const [showApiInput, setShowApiInput] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [, setAiReply] = useState('')
  const [replyMode, setReplyMode] = useState<
    'reply' | 'replyAll' | 'forward' | null
  >(null)
  const [replyBody, setReplyBody] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const unreadCount = threads.filter(
    (t) => !t.isRead && t.folder === 'inbox',
  ).length

  const filteredThreads = threads.filter((t) => {
    const matchFolder =
      activeFolder === 'starred' ? t.isStarred : t.folder === activeFolder
    const matchSearch =
      !searchQuery ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.from.toLowerCase().includes(searchQuery.toLowerCase())
    return matchFolder && matchSearch
  })

  const handleSelect = (thread: EmailThread) => {
    setSelectedThread(thread)
    setReplyMode(null)
    setAiReply('')
    setReplyBody('')
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, isRead: true } : t)),
    )
  }

  const handleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred } : t)),
    )
  }

  const handleArchive = (id: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== id))
    if (selectedThread?.id === id) setSelectedThread(null)
  }

  const handleReply = (mode: 'reply' | 'replyAll' | 'forward') => {
    setReplyMode(mode)
    setReplyBody('')
    setAiReply('')
  }

  const handleAiSuggestReply = async () => {
    if (!groqKey || !selectedThread) return
    setAiLoading(true)
    try {
      const lastMsg =
        selectedThread.messages[selectedThread.messages.length - 1]
      const text = await callGroq(
        'You are Kira, an AI email assistant. Write a professional, concise reply email. Keep it under 100 words. Return only the reply body.',
        `Reply to this email from ${lastMsg.from}:\n\nSubject: ${lastMsg.subject}\n\n${lastMsg.body.replace(/<[^>]+>/g, '')}`,
        groqKey,
      )
      setAiReply(text)
      setReplyBody(text)
      if (!replyMode) setReplyMode('reply')
    } catch {
      setAiReply('Error: Check your Groq API key.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCheckbox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const sidebarFolders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount },
    {
      id: 'starred',
      label: 'Starred',
      icon: Star,
      count: threads.filter((t) => t.isStarred).length,
    },
    { id: 'sent', label: 'Sent', icon: Send, count: 0 },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: 0 },
    { id: 'spam', label: 'Spam', icon: AlertCircle, count: 0 },
    { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
  ]

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflow: 'hidden',
        // ── Identical to Home & BeedAI background ──
        background: 'url("/MainBG.png") center right / cover no-repeat',
        position: 'relative',
      }}
    >
      {/* ── Top-right gradient blob — extracted from Home/BeedAI via App.tsx ── */}
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

      {/* ── Header — identical structure to Home & BeedAI ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px 14px',
          borderBottom: '1px solid rgba(17,24,39,0.1)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#111827',
              margin: 0,
            }}
          >
            Email Agent
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#696D7D',
              margin: 0,
              marginTop: 2,
              fontWeight: 400,
            }}
          >
            AI-powered inbox — {unreadCount} unread
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* AI Key Toggle */}
          {showApiInput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_…  Groq API key"
                style={{
                  width: 220,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  color: '#1e293b',
                  background: 'rgba(255,255,255,0.9)',
                }}
              />
              <button
                onClick={() => setShowApiInput(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10,
                  background: '#111827',
                  border: 'none',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowApiInput(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                background: groqKey
                  ? 'rgba(240,253,244,0.9)'
                  : 'rgba(255,245,245,0.9)',
                border: `1px solid ${groqKey ? '#bbf7d0' : '#fecaca'}`,
                color: groqKey ? '#16a34a' : '#dc2626',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={13} />
              {groqKey ? 'AI Active' : 'Connect AI'}
            </button>
          )}

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 30,
              borderLeft: '1px solid rgba(17,24,39,0.1)',
            }}
          />

          {/* Bell + Settings — same as Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0px 2px 5px rgba(17,24,39,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src="/bell(1).png"
                alt="Notifications"
                style={{ width: 24, height: 24 }}
              />
            </button>
            <button
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0px 2px 5px rgba(17,24,39,0.06)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src="/setting.png"
                alt="Settings"
                style={{ width: 24, height: 24 }}
              />
            </button>
          </div>

          {/* Compose Button — identical to "New Task" button in Home */}
          <button
            onClick={() => setComposing(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 16px',
              height: 50,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            <img
              src="/NewTask.png"
              alt=""
              style={{ width: 20, height: 20 }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            Compose
          </button>

          {/* Profile — same as Home */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/profile.png"
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
          padding: '20px',
          gap: 20,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Left \ REMOVED — folders now live in KiraView sidebar ── */}
        {false && (
          <div
            style={{
              width: 200,
              minWidth: 200,
              flexShrink: 0,
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(16px)',
              borderRadius: 20,
              border: '1px solid rgba(17,24,39,0.07)',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 10px',
              gap: 2,
            }}
          >
            {sidebarFolders.map((folder) => {
              const Icon = folder.icon
              const active = activeFolder === folder.id
              return (
                <button
                  key={folder.id}
                  onClick={() => {
                    setActiveFolder(folder.id)
                    setSelectedThread(null)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 12,
                    // Active state: radial gradient matching App.tsx sidebar selection
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
                  {/* Active glow blobs — exact match from App.tsx sidebar */}
                  {active && (
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
                  )}
                  <Icon
                    size={15}
                    style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
                  />
                  <span
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {folder.label}
                  </span>
                  {folder.count > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 10,
                        background: active ? '#4f46e5' : '#e5e7eb',
                        color: active ? '#fff' : '#374151',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {folder.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Thread List ── */}
        {/* ── Thread List ── */}
        <div
          style={{
            width: 320,
            minWidth: 280,
            flexShrink: 0,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(17,24,39,0.07)',
            overflow: 'hidden',
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: '14px 14px 10px',
              borderBottom: '1px solid rgba(17,24,39,0.06)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails…"
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  outline: 'none',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1e293b',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Thread items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {filteredThreads.length === 0 && (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: 13,
                }}
              >
                <Mail
                  size={32}
                  style={{
                    margin: '0 auto 10px',
                    opacity: 0.3,
                    display: 'block',
                  }}
                />
                <p>No emails here</p>
              </div>
            )}
            {filteredThreads.map((thread) => {
              const isActive = selectedThread?.id === thread.id
              const isChecked = selectedIds.has(thread.id)
              return (
                <div
                  key={thread.id}
                  onClick={() => handleSelect(thread)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 10px',
                    borderRadius: 14,
                    cursor: 'pointer',
                    marginBottom: 3,
                    // Active: same glow radial as sidebar selection
                    background: isActive
                      ? 'radial-gradient(circle at 80% 50%, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'
                      : 'transparent',
                    borderLeft: isActive
                      ? '3px solid #4f46e5'
                      : '3px solid transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Active glow blobs on thread item */}
                  {isActive && (
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
                          opacity: 0.6,
                          filter: 'blur(24px)',
                          pointerEvents: 'none',
                          zIndex: 0,
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
                          opacity: 0.4,
                          filter: 'blur(24px)',
                          pointerEvents: 'none',
                          zIndex: 0,
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
                          opacity: 0.5,
                          filter: 'blur(15px)',
                          pointerEvents: 'none',
                          zIndex: 0,
                        }}
                      />
                    </>
                  )}

                  {/* Checkbox */}
                  <div
                    onClick={(e) => handleCheckbox(thread.id, e)}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      flexShrink: 0,
                      marginTop: 2,
                      border: `1.5px solid ${isChecked ? '#4f46e5' : '#d1d5db'}`,
                      background: isChecked ? '#4f46e5' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {isChecked && <Check size={10} color="#fff" />}
                  </div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Avatar name={thread.from} size={34} />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: thread.isRead ? 400 : 700,
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 130,
                        }}
                      >
                        {thread.from}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: '#9ca3af',
                            flexShrink: 0,
                          }}
                        >
                          {thread.time}
                        </span>
                        <button
                          onClick={(e) => handleStar(thread.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                          }}
                        >
                          {thread.isStarred ? (
                            <Star size={13} fill="#fbbf24" color="#fbbf24" />
                          ) : (
                            <Star size={13} color="#d1d5db" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: thread.isRead ? 400 : 600,
                        color: thread.isRead ? '#6b7280' : '#111827',
                        margin: '0 0 4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {thread.subject}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: '#9ca3af',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {thread.preview}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        marginTop: 5,
                      }}
                    >
                      {thread.labels.map((l) => (
                        <LabelBadge key={l} label={l} />
                      ))}
                      {thread.hasAttachment && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: 10,
                            color: '#94a3b8',
                          }}
                        >
                          <Paperclip size={9} />
                        </span>
                      )}
                      {!thread.isRead && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: '#4f46e5',
                            display: 'inline-block',
                            marginTop: 3,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Email Detail / Reading Pane ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)',
            borderRadius: 20,
            border: '1px solid rgba(17,24,39,0.07)',
          }}
        >
          {!selectedThread ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                color: '#9ca3af',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={30} color="#818cf8" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#374151',
                    margin: '0 0 6px',
                  }}
                >
                  Select an email
                </p>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                  Choose a thread from the list to read it here
                </p>
              </div>
              {/* Compose button in empty state — same "New Task" style */}
              <button
                onClick={() => setComposing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  padding: '10px 20px',
                  height: 50,
                  borderRadius: 14,
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow:
                    'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                <Plus size={16} /> Compose New Email
              </button>
            </div>
          ) : (
            <>
              {/* Reading pane header */}
              <div
                style={{
                  padding: '16px 24px 12px',
                  borderBottom: '1px solid rgba(17,24,39,0.07)',
                  background: 'rgba(255,255,255,0.9)',
                  flexShrink: 0,
                  borderRadius: '20px 20px 0 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: '#111827',
                        margin: '0 0 8px',
                        lineHeight: 1.3,
                      }}
                    >
                      {selectedThread.subject}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedThread.labels.map((l) => (
                        <LabelBadge key={l} label={l} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {[
                      {
                        icon: Archive,
                        label: 'Archive',
                        action: () => handleArchive(selectedThread.id),
                      },
                      {
                        icon: Trash2,
                        label: 'Delete',
                        action: () => handleArchive(selectedThread.id),
                      },
                      { icon: Tag, label: 'Label', action: () => {} },
                      { icon: MoreHorizontal, label: 'More', action: () => {} },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        title={label}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#64748b',
                        }}
                      >
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Suggestion */}
                {selectedThread.aiSuggested && groqKey && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      borderRadius: 10,
                      background:
                        'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(99,102,241,0.06))',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <Sparkles
                      size={14}
                      color="#6366f1"
                      style={{ flexShrink: 0 }}
                    />
                    <p
                      style={{
                        fontSize: 12,
                        color: '#4f46e5',
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      <strong>Kira suggests:</strong>{' '}
                      {selectedThread.aiSuggested}
                    </p>
                    <button
                      onClick={handleAiSuggestReply}
                      disabled={aiLoading}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 7,
                        background:
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        boxShadow:
                          'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                        border: 'none',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: aiLoading ? 'not-allowed' : 'pointer',
                        opacity: aiLoading ? 0.7 : 1,
                      }}
                    >
                      {aiLoading ? 'Drafting…' : 'Draft Reply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                {selectedThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      border: '1px solid rgba(17,24,39,0.06)',
                      marginBottom: 14,
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        borderBottom: '1px solid #f8fafc',
                      }}
                    >
                      <Avatar name={msg.from} size={36} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: '#111827',
                            }}
                          >
                            {msg.from}
                          </span>
                          <span style={{ fontSize: 12, color: '#9ca3af' }}>
                            {msg.time}
                          </span>
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                          to {msg.to}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '16px 18px',
                        fontSize: 14,
                        color: '#374151',
                        lineHeight: 1.7,
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.body }}
                    />
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div
                        style={{
                          padding: '10px 18px 14px',
                          borderTop: '1px solid #f8fafc',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 8,
                        }}
                      >
                        {msg.attachments.map((att) => (
                          <div
                            key={att.name}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              cursor: 'pointer',
                            }}
                          >
                            <Paperclip size={13} color="#6366f1" />
                            <div>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: '#374151',
                                  margin: 0,
                                }}
                              >
                                {att.name}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: '#9ca3af',
                                  margin: 0,
                                }}
                              >
                                {att.size}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reply bar */}
              <div
                style={{
                  padding: '12px 24px 16px',
                  borderTop: '1px solid rgba(17,24,39,0.07)',
                  background: 'rgba(255,255,255,0.9)',
                  flexShrink: 0,
                  borderRadius: '0 0 20px 20px',
                }}
              >
                {replyMode ? (
                  <div
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 14,
                      overflow: 'hidden',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 14px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: '#64748b',
                          fontWeight: 500,
                        }}
                      >
                        {replyMode === 'reply'
                          ? 'Reply'
                          : replyMode === 'replyAll'
                            ? 'Reply All'
                            : 'Forward'}
                      </span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        to {selectedThread.fromEmail}
                      </span>
                      <div style={{ flex: 1 }} />
                      <button
                        onClick={() => setReplyMode(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} color="#9ca3af" />
                      </button>
                    </div>
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="Write a reply…"
                      autoFocus
                      style={{
                        width: '100%',
                        minHeight: 100,
                        maxHeight: 180,
                        padding: '12px 14px',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: 13,
                        color: '#1e293b',
                        lineHeight: 1.6,
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        background: 'transparent',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div
                      style={{
                        padding: '8px 14px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '5px 10px',
                            borderRadius: 8,
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: 12,
                            color: '#64748b',
                            cursor: 'pointer',
                          }}
                        >
                          <Paperclip size={12} /> Attach
                        </button>
                        {groqKey && (
                          <button
                            onClick={handleAiSuggestReply}
                            disabled={aiLoading}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '5px 10px',
                              borderRadius: 8,
                              background: 'rgba(99,102,241,0.08)',
                              border: '1px solid rgba(99,102,241,0.2)',
                              fontSize: 12,
                              color: '#6366f1',
                              cursor: aiLoading ? 'not-allowed' : 'pointer',
                              fontWeight: 500,
                            }}
                          >
                            <Sparkles size={12} />
                            {aiLoading ? 'Drafting…' : 'AI Draft'}
                          </button>
                        )}
                      </div>
                      {/* Send button — "New Task" style */}
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '0 16px',
                          height: 40,
                          borderRadius: 12,
                          background:
                            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          boxShadow:
                            'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "'Outfit', system-ui, sans-serif",
                        }}
                      >
                        <Send size={13} /> Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { icon: Reply, label: 'Reply', mode: 'reply' as const },
                      {
                        icon: ReplyAll,
                        label: 'Reply All',
                        mode: 'replyAll' as const,
                      },
                      {
                        icon: Forward,
                        label: 'Forward',
                        mode: 'forward' as const,
                      },
                    ].map(({ icon: Icon, label, mode }) => (
                      <button
                        key={mode}
                        onClick={() => handleReply(mode)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 14px',
                          borderRadius: 10,
                          background: 'rgba(255,255,255,0.9)',
                          border: '1px solid #e2e8f0',
                          fontSize: 13,
                          color: '#374151',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontFamily: "'Outfit', system-ui, sans-serif",
                        }}
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Compose Window */}
      {composing && (
        <ComposeWindow
          onClose={() => {
            setComposing(false)
            setComposeData({})
          }}
          initialData={composeData}
          groqKey={groqKey}
        />
      )}
    </div>
  )
}
