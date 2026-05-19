/**
 * CallsView.tsx — Kira Light Design System Edition
 * AI Calling Agent Platform — fully adapted to match Kira app's LIGHT visual language
 * Mirrors SocialMediaView.tsx design tokens, layout patterns, and UX conventions.
 */

import React, { useState, useRef } from 'react'
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Download,
  Play,
  Pause,
  Eye,
  Mic,
  FileText,
  Sparkles,
  Globe,
  Clock,
  Calendar,
  CheckCircle2,
  LayoutDashboard,
  Target,
  Bot,
  BookOpen,
  GitBranch,
  Settings,
  CreditCard,
  TrendingUp,
  BarChart2,
  MessageSquare,
  Users,
  Plus,
  ChevronRight,
  Zap,
  Bell,
  Trash2,
  Hash,
} from 'lucide-react'
import { Megaphone } from 'lucide-react'

// ─── Kira Design Tokens (LIGHT MODE) ─────────────────────────────────────────
const K = {
  mainBg: 'url("/MainBG.png") center right / cover no-repeat',
  sidebarBg: 'rgba(238,241,246,0.95)',
  cardBg: 'rgba(255,255,255,0.82)',
  cardBgStrong: 'rgba(255,255,255,0.92)',
  border: 'rgba(17,24,39,0.07)',
  borderMid: 'rgba(17,24,39,0.12)',
  borderLight: '#f3f4f6',
  text: '#111827',
  textSub: '#374151',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  btnBlue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  btnBlueShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
  btnViolet: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  btnVioletShadow: 'inset 0 0 0 1px #c4b5fd, inset 0 1px 4px 2px #ede9fe',
  gradGreen: 'linear-gradient(135deg,#10B981 0%,#059669 100%)',
  gradCyan: 'linear-gradient(135deg,#06B6D4 0%,#3B82F6 100%)',
  gradPrimary: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)',
  gradOrange: 'linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)',
  gradRed: 'linear-gradient(135deg,#EF4444 0%,#DC2626 100%)',
  activeNavBg:
    'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  primary: '#6366F1',
} as const

// ─── Shared Primitives ─────────────────────────────────────────────────────
const KCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}> = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: K.cardBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 20,
      border: `1px solid ${K.border}`,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
  >
    {children}
  </div>
)

const KBtn: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  variant?: 'blue' | 'violet' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
}> = ({
  children,
  onClick,
  style,
  variant = 'blue',
  size = 'md',
  disabled,
}) => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: size === 'sm' ? 12 : 13,
    padding: size === 'sm' ? '6px 14px' : '10px 20px',
    border: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    opacity: disabled ? 0.45 : 1,
    fontFamily: "'Outfit', system-ui, sans-serif",
    ...style,
  }
  const variantStyles: Record<string, React.CSSProperties> = {
    blue: { background: K.btnBlue, boxShadow: K.btnBlueShadow, color: '#fff' },
    violet: {
      background: K.btnViolet,
      boxShadow: K.btnVioletShadow,
      color: '#fff',
    },
    ghost: {
      background: 'rgba(255,255,255,0.7)',
      border: `1px solid ${K.borderMid}`,
      color: K.textSub,
      backdropFilter: 'blur(8px)',
    },
    danger: { background: K.gradRed, color: '#fff' },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variantStyles[variant] }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.opacity = disabled
          ? '0.45'
          : '1'
      }}
    >
      {children}
    </button>
  )
}

const KBadge: React.FC<{ label: string; color?: string; dot?: boolean }> = ({
  label,
  color = K.success,
  dot = false,
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color,
      background: `${color}18`,
      border: `1px solid ${color}30`,
    }}
  >
    {dot && (
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }}
      />
    )}
    {label}
  </span>
)

const KProgress: React.FC<{
  value: number
  color?: string
  style?: React.CSSProperties
}> = ({ value, color = '#6366F1', style }) => (
  <div
    style={{
      background: 'rgba(17,24,39,0.08)',
      borderRadius: 4,
      height: 5,
      overflow: 'hidden',
      ...style,
    }}
  >
    <div
      style={{
        width: `${Math.min(100, value)}%`,
        height: '100%',
        background: color,
        borderRadius: 4,
        transition: 'width 0.4s',
      }}
    />
  </div>
)

// Active nav glow blobs
const GlowBlobs: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        width: 75,
        height: 75,
        borderRadius: '50%',
        left: 194,
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
        left: 151,
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
        left: 105,
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

// ─── Types ──────────────────────────────────────────────────────────────────
type CallsTab =
  | 'home'
  | 'campaigns'
  | 'agents'
  | 'knowledge-base'
  | 'flow-builder'
  | 'tools'
  | 'contacts'
  | 'phone-numbers'
  | 'conversations'
  | 'calls'
  | 'analytics'
  | 'billing'
  | 'settings'

interface CallRecord {
  id: string
  contactName: string
  phone: string
  direction: 'incoming' | 'outgoing'
  status: 'completed' | 'failed' | 'in_progress' | 'credit_failed'
  duration: number
  sentiment: 'positive' | 'negative' | 'neutral' | null
  classification: 'hot' | 'warm' | 'cold' | 'lost' | null
  campaign: string | null
  agent: string | null
  aiSummary: string | null
  hasRecording: boolean
  hasTranscript: boolean
  createdAt: string
  engine: 'elevenlabs' | 'twilio-openai' | 'openai'
}

interface Campaign {
  id: string
  name: string
  type: string
  status: 'active' | 'completed' | 'pending' | 'paused'
  totalContacts: number
  completedCalls: number
  successRate: number
}

interface Agent {
  id: string
  name: string
  type: 'incoming' | 'flow'
  language: string
  engine: string
  status: 'active' | 'inactive'
  callsHandled: number
}

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_CALLS: CallRecord[] = [
  {
    id: '1',
    contactName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    direction: 'outgoing',
    status: 'completed',
    duration: 187,
    sentiment: 'positive',
    classification: 'hot',
    campaign: 'Q4 Lead Drive',
    agent: 'Sales Agent Pro',
    aiSummary:
      'Customer expressed strong interest in the premium plan. Requested a follow-up demo next week.',
    hasRecording: true,
    hasTranscript: true,
    createdAt: '2026-05-15T10:23:00Z',
    engine: 'elevenlabs',
  },
  {
    id: '2',
    contactName: 'Michael Chen',
    phone: '+1 (555) 234-5678',
    direction: 'incoming',
    status: 'completed',
    duration: 94,
    sentiment: 'neutral',
    classification: 'warm',
    campaign: null,
    agent: 'Support Agent',
    aiSummary:
      'Technical support inquiry about billing. Issue resolved during call.',
    hasRecording: true,
    hasTranscript: true,
    createdAt: '2026-05-15T09:45:00Z',
    engine: 'elevenlabs',
  },
  {
    id: '3',
    contactName: 'Aria Patel',
    phone: '+1 (555) 345-6789',
    direction: 'outgoing',
    status: 'failed',
    duration: 0,
    sentiment: null,
    classification: null,
    campaign: 'Q4 Lead Drive',
    agent: 'Sales Agent Pro',
    aiSummary: null,
    hasRecording: false,
    hasTranscript: false,
    createdAt: '2026-05-15T09:12:00Z',
    engine: 'twilio-openai',
  },
  {
    id: '4',
    contactName: 'James Whitfield',
    phone: '+1 (555) 456-7890',
    direction: 'outgoing',
    status: 'completed',
    duration: 312,
    sentiment: 'positive',
    classification: 'hot',
    campaign: 'Holiday Promo',
    agent: 'Sales Agent Pro',
    aiSummary:
      'Strong buying signals. Customer wants to upgrade to annual plan. High-priority follow-up.',
    hasRecording: true,
    hasTranscript: true,
    createdAt: '2026-05-14T16:30:00Z',
    engine: 'elevenlabs',
  },
  {
    id: '5',
    contactName: 'Elena Rodriguez',
    phone: '+1 (555) 567-8901',
    direction: 'incoming',
    status: 'completed',
    duration: 156,
    sentiment: 'negative',
    classification: 'cold',
    campaign: null,
    agent: 'Support Agent',
    aiSummary:
      'Customer complained about service quality. Escalation was needed.',
    hasRecording: true,
    hasTranscript: false,
    createdAt: '2026-05-14T14:15:00Z',
    engine: 'openai',
  },
  {
    id: '6',
    contactName: 'David Kim',
    phone: '+1 (555) 678-9012',
    direction: 'outgoing',
    status: 'credit_failed',
    duration: 0,
    sentiment: null,
    classification: null,
    campaign: 'Q4 Lead Drive',
    agent: 'Sales Agent Pro',
    aiSummary: null,
    hasRecording: false,
    hasTranscript: false,
    createdAt: '2026-05-14T11:00:00Z',
    engine: 'elevenlabs',
  },
  {
    id: '7',
    contactName: 'Lisa Thompson',
    phone: '+1 (555) 789-0123',
    direction: 'outgoing',
    status: 'completed',
    duration: 228,
    sentiment: 'positive',
    classification: 'warm',
    campaign: 'Holiday Promo',
    agent: 'Sales Agent Pro',
    aiSummary:
      'Interested in the product but needs time to evaluate. Scheduled follow-up for next month.',
    hasRecording: true,
    hasTranscript: true,
    createdAt: '2026-05-13T15:45:00Z',
    engine: 'elevenlabs',
  },
  {
    id: '8',
    contactName: 'Robert Martinez',
    phone: '+1 (555) 890-1234',
    direction: 'incoming',
    status: 'completed',
    duration: 67,
    sentiment: 'neutral',
    classification: 'lost',
    campaign: null,
    agent: 'Support Agent',
    aiSummary:
      'General inquiry. Customer decided not to proceed with purchase.',
    hasRecording: false,
    hasTranscript: true,
    createdAt: '2026-05-13T10:20:00Z',
    engine: 'openai',
  },
]

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Q4 Lead Qualification Drive',
    type: 'Lead Qualification',
    status: 'active',
    totalContacts: 500,
    completedCalls: 325,
    successRate: 87.3,
  },
  {
    id: '2',
    name: 'Holiday Promo 2026',
    type: 'Promotional',
    status: 'active',
    totalContacts: 1200,
    completedCalls: 480,
    successRate: 84.5,
  },
  {
    id: '3',
    name: 'Customer Feedback Survey',
    type: 'Feedback Collection',
    status: 'pending',
    totalContacts: 1000,
    completedCalls: 0,
    successRate: 0,
  },
  {
    id: '4',
    name: 'Payment Reminder Q1',
    type: 'Payment Reminder',
    status: 'completed',
    totalContacts: 750,
    completedCalls: 750,
    successRate: 92.1,
  },
]

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sales Agent Pro',
    type: 'flow',
    language: 'English',
    engine: 'ElevenLabs',
    status: 'active',
    callsHandled: 1284,
  },
  {
    id: '2',
    name: 'Support Agent',
    type: 'incoming',
    language: 'English',
    engine: 'OpenAI',
    status: 'active',
    callsHandled: 632,
  },
  {
    id: '3',
    name: 'Spanish Sales',
    type: 'flow',
    language: 'Spanish',
    engine: 'Twilio+OpenAI',
    status: 'inactive',
    callsHandled: 89,
  },
]

// ─── Helper functions ────────────────────────────────────────────────────────
function formatDuration(seconds: number) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return K.success
    case 'failed':
      return K.error
    case 'credit_failed':
      return K.error
    case 'in_progress':
      return K.warning
    default:
      return K.textLight
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    case 'credit_failed':
      return 'Low Credits'
    case 'in_progress':
      return 'In Progress'
    default:
      return status
  }
}

function getSentimentColor(s: string | null) {
  if (!s) return K.textLight
  switch (s) {
    case 'positive':
      return K.success
    case 'negative':
      return K.error
    default:
      return K.textLight
  }
}

function getClassificationColor(c: string | null) {
  if (!c) return K.textLight
  switch (c) {
    case 'hot':
      return K.success
    case 'warm':
      return K.warning
    case 'cold':
      return '#6B7280'
    case 'lost':
      return K.error
    default:
      return K.textLight
  }
}

// ─── Input style ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: 'rgba(243,244,246,0.8)',
  border: `1px solid rgba(17,24,39,0.12)`,
  borderRadius: 10,
  padding: '10px 14px',
  color: '#111827',
  fontSize: 13,
  outline: 'none',
  fontFamily: "'Outfit', system-ui, sans-serif",
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'BUILD',
    items: [
      {
        id: 'campaigns' as CallsTab,
        label: 'Campaigns',
        icon: <Target size={15} />,
      },
      { id: 'agents' as CallsTab, label: 'Agents', icon: <Bot size={15} /> },
      {
        id: 'knowledge-base' as CallsTab,
        label: 'Knowledge Base',
        icon: <BookOpen size={15} />,
      },
      {
        id: 'flow-builder' as CallsTab,
        label: 'Flow Builder',
        icon: <GitBranch size={15} />,
      },
      { id: 'tools' as CallsTab, label: 'Tools', icon: <Settings size={15} /> },
    ],
  },
  {
    label: 'TELEPHONY',
    items: [
      {
        id: 'contacts' as CallsTab,
        label: 'All Contacts',
        icon: <Users size={15} />,
      },
      {
        id: 'phone-numbers' as CallsTab,
        label: 'Phone Numbers',
        icon: <Phone size={15} />,
      },
    ],
  },
  {
    label: 'MONITOR',
    items: [
      {
        id: 'conversations' as CallsTab,
        label: 'Conversations',
        icon: <MessageSquare size={15} />,
      },
      { id: 'calls' as CallsTab, label: 'Calls', icon: <Phone size={15} /> },
      {
        id: 'analytics' as CallsTab,
        label: 'Analytics',
        icon: <BarChart2 size={15} />,
      },
    ],
  },
]

// const BOTTOM_NAV = [
//   {
//     id: 'billing' as CallsTab,
//     label: 'Billing & Credits',
//     icon: <CreditCard size={15} />,
//   },
//   {
//     id: 'settings' as CallsTab,
//     label: 'Settings',
//     icon: <Sliders size={15} />,
//   },
// ]

// ─── Page: Home Dashboard ─────────────────────────────────────────────────────
/**
 * Updated HomeDashboard — layout matches screenshot
 * Preserves all original K.* color tokens, gradients, KCard, KBadge, etc.
 */

function HomeDashboard({ onNav }: { onNav: (tab: CallsTab) => void }) {
  const [callActivityTab, setCallActivityTab] = React.useState<
    'all' | 'incoming' | 'outgoing'
  >('all')

  // ── Top row stats (5 cards) ──────────────────────────────────────────────
  const primaryStats = [
    {
      label: 'Total Calls',
      value: '0',
      sub: 'All Time',
      subColor: K.primary,
      icon: <Phone size={18} />,
      iconBg: 'rgba(99,102,241,0.10)',
      iconColor: K.primary,
    },
    {
      label: 'Incoming Calls',
      value: '0',
      sub: '0% success · Avg 0:00',
      subColor: K.textMuted,
      icon: <PhoneIncoming size={18} />,
      iconBg: 'rgba(16,185,129,0.10)',
      iconColor: K.success,
    },
    {
      label: 'Outgoing Calls',
      value: '0',
      sub: '0% success · Avg 0:00',
      subColor: K.textMuted,
      icon: <PhoneOutgoing size={18} />,
      iconBg: 'rgba(59,130,246,0.10)',
      iconColor: K.info,
    },
    {
      label: 'Contacts',
      value: '0',
      sub: null,
      subExtra: (
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <span style={{ color: K.textMuted, fontSize: 11 }}>
            <Users size={10} style={{ display: 'inline', marginRight: 3 }} />0
            campaigns
          </span>
          <span style={{ color: K.textMuted, fontSize: 11 }}>
            <Phone size={10} style={{ display: 'inline', marginRight: 3 }} />0
            calls &amp; conversations
          </span>
        </div>
      ),
      icon: <Users size={18} />,
      iconBg: 'rgba(245,158,11,0.10)',
      iconColor: '#f59e0b',
    },
    {
      label: 'Campaigns',
      value: '0',
      sub: null,
      subExtra: (
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          <span style={{ color: '#ef4444', fontSize: 11 }}>● 0 active</span>
          <span style={{ color: K.success, fontSize: 11 }}>● 0%</span>
        </div>
      ),
      icon: <Target size={18} />,
      iconBg: 'rgba(239,68,68,0.10)',
      iconColor: '#ef4444',
    },
  ]

  // ── Second row stats (5 cards) ────────────────────────────────────────────
  const secondaryStats = [
    {
      label: 'Appointments Booked',
      value: '0',
      icon: '📅',
      iconBg: 'linear-gradient(135deg,#f43f5e,#fb7185)',
    },
    {
      label: 'Forms Submitted',
      value: '0',
      valueSub: '(0 total forms)',
      icon: '📋',
      iconBg: 'linear-gradient(135deg,#6366f1,#818cf8)',
    },
    {
      label: 'Knowledge Bases',
      value: '0',
      icon: '📚',
      iconBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    },
    {
      label: 'Webhooks',
      value: '0',
      icon: '🔗',
      iconBg: 'linear-gradient(135deg,#06b6d4,#22d3ee)',
    },
    {
      label: 'Templates',
      value: '25',
      icon: '📄',
      iconBg: 'linear-gradient(135deg,#10b981,#34d399)',
    },
  ]

  // Mock call activity data (flat line = empty state)
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  // Lead distribution dots
  const leadDots = [
    { label: 'Hot', color: '#ef4444', value: 0 },
    { label: 'Warm', color: '#f59e0b', value: 0 },
    { label: 'Cold', color: '#3b82f6', value: 0 },
    { label: 'Lost', color: K.textLight, value: 0 },
  ]

  // Call type breakdown rows
  const callTypeRows = [
    {
      label: 'Incoming Calls',
      sub: '0% success',
      value: 0,
      color: K.success,
      bg: 'rgba(16,185,129,0.06)',
      icon: <PhoneIncoming size={14} color={K.success} />,
    },
    {
      label: 'Outgoing Calls',
      sub: '0% success',
      value: 0,
      color: K.info,
      bg: 'rgba(59,130,246,0.06)',
      icon: <PhoneOutgoing size={14} color={K.info} />,
    },
    {
      label: 'Campaigns',
      sub: '0 active',
      value: 0,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.06)',
      icon: <Target size={14} color="#8b5cf6" />,
    },
  ]

  // Lead summary rows
  const leadSummaryRows = [
    {
      label: 'Hot Lead',
      value: 0,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.04)',
      dot: '🔴',
    },
    {
      label: 'Warm Lead',
      value: 0,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.04)',
      dot: '🟡',
    },
    {
      label: 'Cold Leads',
      value: 0,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.04)',
      dot: '🔵',
    },
    {
      label: 'Lost',
      value: 0,
      color: K.textMuted,
      bg: 'rgba(156,163,175,0.04)',
      dot: '⚫',
    },
  ]

  const recentCalls = MOCK_CALLS.slice(0, 3)

  // ── Tiny SVG line chart (empty / flat) ───────────────────────────────────
  const ChartPlaceholder = () => (
    <div style={{ width: '100%', paddingBottom: 8 }}>
      {/* Y-axis labels */}
      <div style={{ display: 'flex', gap: 0 }}>
        <div
          style={{
            width: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: 20,
            paddingTop: 4,
          }}
        >
          {[4, 3, 2, 1, 0].map((n) => (
            <span
              key={n}
              style={{ color: K.textLight, fontSize: 10, lineHeight: 1 }}
            >
              {n}
            </span>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <svg
            viewBox="0 0 600 80"
            style={{ width: '100%', height: 80, display: 'block' }}
          >
            {/* Grid lines */}
            {[0, 20, 40, 60, 80].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="600"
                y2={y}
                stroke={K.border}
                strokeWidth="0.5"
              />
            ))}
            {/* Flat incoming line */}
            <polyline
              points="0,78 85,78 170,78 255,78 340,78 425,78 510,78 600,78"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Flat outgoing line */}
            <polyline
              points="0,78 85,78 170,78 255,78 340,78 425,78 510,78 600,78"
              fill="none"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
          </svg>
          {/* X-axis labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: 4,
            }}
          >
            {days.map((d) => (
              <span key={d} style={{ color: K.textLight, fontSize: 10 }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: 28 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: K.textMuted,
            fontSize: 11,
          }}
        >
          <span
            style={{
              width: 10,
              height: 2,
              background: '#10b981',
              display: 'inline-block',
              borderRadius: 2,
            }}
          />{' '}
          Incoming
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: K.textMuted,
            fontSize: 11,
          }}
        >
          <span
            style={{
              width: 10,
              height: 2,
              background: '#6366f1',
              display: 'inline-block',
              borderRadius: 2,
            }}
          />{' '}
          Outgoing
        </span>
      </div>
    </div>
  )

  // ── Lead Distribution donut (empty state with legend) ───────────────────
  const LeadDistributionChart = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: 16,
      }}
    >
      <svg viewBox="0 0 80 80" width={80} height={80}>
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke={K.border}
          strokeWidth="12"
        />
        <circle
          cx="40"
          cy="40"
          r="28"
          fill="none"
          stroke={K.borderLight || '#f3f4f6'}
          strokeWidth="12"
          strokeDasharray="176"
          strokeDashoffset="0"
        />
        <text
          x="40"
          y="44"
          textAnchor="middle"
          style={{ fontSize: 12, fontWeight: 700, fill: K.textMuted }}
        >
          0
        </text>
      </svg>
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {leadDots.map((d) => (
          <span
            key={d.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: K.textMuted,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: d.color,
                display: 'inline-block',
              }}
            />
            {d.label} {d.value}
          </span>
        ))}
      </div>
    </div>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        // background: '#f4f5f7',
        minHeight: '100vh',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2
            style={{ color: K.text, fontSize: 18, fontWeight: 700, margin: 0 }}
          >
            Good Evening, gabriel forest
          </h2>
          <p style={{ color: K.textMuted, fontSize: 13, margin: '2px 0 0' }}>
            Here's what's happening with your campaigns today.
          </p>
        </div>
        <button
          onClick={() => {}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: K.text,
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          <Plus size={14} />
          Quick Actions
        </button>
      </div>

      {/* ── Row 1: 5 primary stat cards ────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: 12,
        }}
      >
        {primaryStats.map((s) => (
          <KCard
            key={s.label}
            style={{ padding: '16px 18px', background: '#fff' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <span
                style={{ color: K.textMuted, fontSize: 12, fontWeight: 500 }}
              >
                {s.label}
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: s.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.iconColor,
                }}
              >
                {s.icon}
              </div>
            </div>
            <div
              style={{
                color: K.text,
                fontWeight: 800,
                fontSize: 32,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            {s.sub && (
              <div style={{ color: s.subColor, fontSize: 11, marginTop: 4 }}>
                {s.sub}
              </div>
            )}
            {s.subExtra && s.subExtra}
          </KCard>
        ))}
      </div>

      {/* ── Row 2: 5 secondary metric cards ────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: 12,
        }}
      >
        {secondaryStats.map((s) => (
          <KCard
            key={s.label}
            style={{ padding: '14px 18px', background: '#fff' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  flexShrink: 0,
                  background: s.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{ color: K.textMuted, fontSize: 11, fontWeight: 500 }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    color: K.text,
                    fontWeight: 800,
                    fontSize: 22,
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                  {s.valueSub && (
                    <span
                      style={{
                        color: K.primary,
                        fontSize: 11,
                        fontWeight: 500,
                        marginLeft: 4,
                      }}
                    >
                      {s.valueSub}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </KCard>
        ))}
      </div>

      {/* ── Row 3: Call Activity (2/3) + Lead Distribution (1/3) ───────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <KCard style={{ padding: 20, background: '#fff' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ color: K.text, fontWeight: 700, fontSize: 14 }}>
              Call Activity
            </div>
            <div
              style={{
                display: 'flex',
                gap: 0,
                border: `1px solid ${K.border}`,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCallActivityTab(tab)}
                  style={{
                    padding: '4px 12px',
                    background:
                      callActivityTab === tab ? K.text : 'transparent',
                    color: callActivityTab === tab ? '#fff' : K.textMuted,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    borderBottom:
                      callActivityTab === tab
                        ? `2px solid ${K.primary}`
                        : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab === 'all'
                    ? 'All Calls'
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ChartPlaceholder />
        </KCard>

        <KCard
          style={{
            padding: 20,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Lead Distribution
          </div>
          <LeadDistributionChart />
        </KCard>
      </div>

      {/* ── Row 4: Sentiment Analysis (1/2) + Call Type Breakdown (1/2) ──────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Sentiment Analysis */}
        <KCard style={{ padding: 20, background: '#fff', minHeight: 160 }}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Sentiment Analysis
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 0',
              gap: 8,
            }}
          >
            <div style={{ color: K.textLight, fontSize: 28 }}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                <line
                  x1="9"
                  y1="9"
                  x2="9.01"
                  y2="9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="15"
                  y1="9"
                  x2="15.01"
                  y2="9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span style={{ color: K.textMuted, fontSize: 13 }}>
              No sentiment data available
            </span>
          </div>
        </KCard>

        {/* Call Type Breakdown */}
        <KCard style={{ padding: 20, background: '#fff' }}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Call Type Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {callTypeRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: row.bg,
                  border: `1px solid ${K.border}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `${row.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {row.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: K.text, fontSize: 13, fontWeight: 600 }}>
                    {row.label}
                  </div>
                  <div style={{ color: K.textMuted, fontSize: 11 }}>
                    {row.sub}
                  </div>
                </div>
                <div
                  style={{ color: row.color, fontWeight: 800, fontSize: 20 }}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </KCard>
      </div>

      {/* ── Row 5: Recent Calls (1/2) + Lead Summary (1/2) ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Recent Calls */}
        <KCard style={{ padding: 20, background: '#fff' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ color: K.text, fontWeight: 700, fontSize: 14 }}>
              Recent Calls
            </div>
            <button
              onClick={() => onNav('calls')}
              style={{
                background: 'transparent',
                border: 'none',
                color: K.primary,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              View All
            </button>
          </div>
          {recentCalls.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 0',
                gap: 8,
              }}
            >
              <Phone size={32} color={K.textLight} strokeWidth={1.2} />
              <span style={{ color: K.textMuted, fontSize: 13 }}>
                No recent calls
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(243,244,246,0.7)',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background:
                        call.direction === 'incoming'
                          ? 'rgba(16,185,129,0.12)'
                          : 'rgba(59,130,246,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {call.direction === 'incoming' ? (
                      <PhoneIncoming size={15} color={K.success} />
                    ) : (
                      <PhoneOutgoing size={15} color={K.info} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ color: K.text, fontSize: 13, fontWeight: 600 }}
                    >
                      {call.contactName}
                    </div>
                    <div style={{ color: K.textMuted, fontSize: 11 }}>
                      {call.phone} · {formatDuration(call.duration)}
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <KBadge
                      label={getStatusLabel(call.status)}
                      color={getStatusColor(call.status)}
                    />
                    <span style={{ color: K.textLight, fontSize: 11 }}>
                      {formatRelativeTime(call.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </KCard>

        {/* Lead Summary */}
        <KCard style={{ padding: 20, background: '#fff' }}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Lead Summary
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {leadSummaryRows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: row.bg,
                  border: `1px solid ${K.border}`,
                }}
              >
                <span style={{ fontSize: 14 }}>{row.dot}</span>
                <span
                  style={{
                    flex: 1,
                    color: K.text,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    color: row.value === 0 ? row.color : K.text,
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </KCard>
      </div>
    </div>
  )
}
// ─── Page: Campaigns ──────────────────────────────────────────────────────────
function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active')
  const [search, setSearch] = useState('')

  const statusColor = (s: string) => {
    switch (s) {
      case 'active':
        return K.success
      case 'completed':
        return K.info
      case 'pending':
        return K.warning
      case 'paused':
        return K.textMuted
      default:
        return K.textLight
    }
  }

  const filtered = MOCK_CAMPAIGNS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div style={{ padding: 24 }}>
      {/* Header Banner */}
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.06))',
          border: '1px solid rgba(245,158,11,0.2)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradOrange,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            }}
          >
            <Target size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              Campaigns
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              Manage and monitor all your calling campaigns
            </div>
          </div>
        </div>
        <KBtn>
          <Plus size={14} /> New Campaign
        </KBtn>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Total Campaigns', value: '4', color: K.primary },
          { label: 'Active', value: '2', color: K.success },
          { label: 'Completed', value: '1', color: K.info },
          { label: 'Pending', value: '1', color: K.warning },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 26 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      {/* Tabs + Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {(['active', 'deleted'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 18px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background:
                  activeTab === t ? K.btnBlue : 'rgba(243,244,246,0.8)',
                color: activeTab === t ? '#fff' : K.textMuted,
                boxShadow: activeTab === t ? K.btnBlueShadow : 'none',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {t === 'active'
                ? `Active Campaigns (${filtered.length})`
                : 'Deleted Campaigns (0)'}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: K.textLight,
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            style={{ ...inputStyle, paddingLeft: 32, width: 220 }}
          />
        </div>
      </div>

      {/* Campaign Cards */}
      {filtered.length === 0 ? (
        <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Target
            size={40}
            color="rgba(99,102,241,0.2)"
            style={{ margin: '0 auto 12px', display: 'block' }}
          />
          <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
            No campaigns yet
          </div>
          <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
            Create your first campaign to start making automated bulk calls with
            AI-powered voice agents.
          </div>
          <div style={{ marginTop: 20 }}>
            <KBtn>
              <Plus size={14} /> Create First Campaign
            </KBtn>
          </div>
        </KCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((c) => (
            <KCard
              key={c.id}
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(99,102,241,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Target size={20} color={K.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: K.text,
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {c.name}
                </div>
                <div style={{ color: K.textMuted, fontSize: 12 }}>{c.type}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 160 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'flex-end',
                    marginBottom: 6,
                  }}
                >
                  <KBadge
                    label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    color={statusColor(c.status)}
                    dot
                  />
                </div>
                <KProgress
                  value={
                    c.totalContacts > 0
                      ? (c.completedCalls / c.totalContacts) * 100
                      : 0
                  }
                  color={statusColor(c.status)}
                  style={{ width: 140 }}
                />
                <div style={{ color: K.textLight, fontSize: 11, marginTop: 4 }}>
                  {c.completedCalls} / {c.totalContacts} calls
                  {c.successRate > 0 && ` · ${c.successRate}% success`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <KBtn size="sm" variant="ghost">
                  <Eye size={13} /> View
                </KBtn>
              </div>
            </KCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page: Agents ─────────────────────────────────────────────────────────────
function AgentsPage() {
  const [activeTab, setActiveTab] = useState<'agents' | 'templates' | 'voices'>(
    'agents',
  )
  const tabs = [
    { key: 'agents', label: 'Agents' },
    { key: 'templates', label: 'Prompt Templates' },
    { key: 'voices', label: 'Voices' },
  ]

  const engineColor = (e: string) => {
    switch (e) {
      case 'ElevenLabs':
        return K.info
      case 'OpenAI':
        return K.success
      case 'Twilio+OpenAI':
        return '#8B5CF6'
      default:
        return K.textMuted
    }
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(99,102,241,0.10),rgba(139,92,246,0.06))',
          border: '1px solid rgba(99,102,241,0.18)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}
          >
            <Bot size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              AI Agents
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              Create and manage your conversational AI agents
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <KBtn variant="ghost">
            <Sparkles size={14} /> Guided Wizard
          </KBtn>
          <KBtn>
            <Plus size={14} /> New Agent
          </KBtn>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Total Agents', value: '3', color: K.primary },
          { label: 'Incoming', value: '1', color: K.success },
          { label: 'Flow', value: '2', color: '#8B5CF6' },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 26 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background:
                activeTab === t.key ? K.btnBlue : 'rgba(243,244,246,0.8)',
              color: activeTab === t.key ? '#fff' : K.textMuted,
              boxShadow: activeTab === t.key ? K.btnBlueShadow : 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'agents' && (
        <>
          {/* Filter Row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: K.textLight,
                }}
              />
              <input
                placeholder="Search agents…"
                style={{ ...inputStyle, paddingLeft: 32, width: 200 }}
              />
            </div>
          </div>

          {MOCK_AGENTS.length === 0 ? (
            <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Bot
                size={40}
                color="rgba(99,102,241,0.2)"
                style={{ margin: '0 auto 12px', display: 'block' }}
              />
              <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
                Create your first agent
              </div>
              <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
                Build AI-powered voice agents to handle incoming calls or run
                automated campaigns.
              </div>
              <div style={{ marginTop: 20 }}>
                <KBtn>
                  <Plus size={14} /> Create Your First Agent
                </KBtn>
              </div>
            </KCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_AGENTS.map((agent) => (
                <KCard
                  key={agent.id}
                  style={{
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(99,102,241,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={20} color={K.primary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{ color: K.text, fontSize: 14, fontWeight: 600 }}
                      >
                        {agent.name}
                      </span>
                      <KBadge
                        label={agent.engine}
                        color={engineColor(agent.engine)}
                      />
                      <KBadge
                        label={agent.type === 'incoming' ? 'Incoming' : 'Flow'}
                        color={
                          agent.type === 'incoming' ? K.success : '#8B5CF6'
                        }
                      />
                    </div>
                    <div style={{ color: K.textMuted, fontSize: 12 }}>
                      Language: {agent.language} · {agent.callsHandled} calls
                      handled
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <KBadge
                      label={agent.status === 'active' ? 'Active' : 'Inactive'}
                      color={
                        agent.status === 'active' ? K.success : K.textMuted
                      }
                      dot
                    />
                    <KBtn size="sm" variant="ghost">
                      <Settings size={13} />
                    </KBtn>
                    <KBtn size="sm" variant="ghost">
                      <Trash2 size={13} />
                    </KBtn>
                  </div>
                </KCard>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab !== 'agents' && (
        <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ color: K.textMuted, fontSize: 14 }}>
            {activeTab === 'templates'
              ? 'Prompt Templates coming soon.'
              : 'Voice library coming soon.'}
          </div>
        </KCard>
      )}
    </div>
  )
}

// ─── Page: Calls & Conversations ─────────────────────────────────────────────
function CallsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [directionFilter, setDirectionFilter] = useState('all')
  const [leadFilter, setLeadFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<
    'all' | 'transcribed' | 'recordings'
  >('all')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const filtered = MOCK_CALLS.filter((c) => {
    const matchSearch =
      !search ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.campaign || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchSentiment =
      sentimentFilter === 'all' || c.sentiment === sentimentFilter
    const matchDir =
      directionFilter === 'all' || c.direction === directionFilter
    const matchLead = leadFilter === 'all' || c.classification === leadFilter
    return matchSearch && matchStatus && matchSentiment && matchDir && matchLead
  })

  const transcribed = filtered.filter((c) => c.hasTranscript)
  const recordings = filtered.filter((c) => c.hasRecording)

  const displayList =
    activeTab === 'all'
      ? filtered
      : activeTab === 'transcribed'
        ? transcribed
        : recordings

  const togglePlay = (id: string) => {
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      audioRef.current?.pause()
      setPlayingId(id)
      // In real app would fetch & play recording
    }
  }

  const tabs = [
    { key: 'all', label: `All Calls (${filtered.length})` },
    { key: 'transcribed', label: `Transcribed (${transcribed.length})` },
    { key: 'recordings', label: `Recordings (${recordings.length})` },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Header Banner */}
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(59,130,246,0.10),rgba(6,182,212,0.06))',
          border: '1px solid rgba(59,130,246,0.18)',
          padding: '22px 26px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: K.gradCyan,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
              }}
            >
              <Phone size={24} color="#fff" />
            </div>
            <div>
              <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
                Calls & Conversations
              </div>
              <div style={{ color: K.textMuted, fontSize: 13 }}>
                View recordings, transcripts, and AI analysis
              </div>
            </div>
          </div>
          <KBtn variant="ghost">
            <Download size={14} /> Export
          </KBtn>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12,
          }}
        >
          {[
            {
              label: 'Total Calls',
              value: MOCK_CALLS.length,
              icon: <Phone size={16} />,
              color: K.info,
            },
            {
              label: 'Completed',
              value: MOCK_CALLS.filter((c) => c.status === 'completed').length,
              icon: <CheckCircle2 size={16} />,
              color: K.success,
            },
            {
              label: 'Incoming',
              value: MOCK_CALLS.filter((c) => c.direction === 'incoming')
                .length,
              icon: <PhoneIncoming size={16} />,
              color: K.success,
            },
            {
              label: 'Outgoing',
              value: MOCK_CALLS.filter((c) => c.direction === 'outgoing')
                .length,
              icon: <PhoneOutgoing size={16} />,
              color: K.info,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: 12,
                padding: '12px 16px',
                border: `1px solid ${K.border}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                <span style={{ color: K.text, fontWeight: 700, fontSize: 22 }}>
                  {s.value}
                </span>
              </div>
              <div style={{ color: K.textMuted, fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: K.textLight,
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search calls…"
            style={{
              ...inputStyle,
              paddingLeft: 32,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {[
          {
            label: 'All Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { v: 'all', l: 'All Status' },
              { v: 'completed', l: 'Completed' },
              { v: 'failed', l: 'Failed' },
              { v: 'in_progress', l: 'In Progress' },
              { v: 'credit_failed', l: 'Low Credits' },
            ],
          },
          {
            label: 'All Sentiment',
            value: sentimentFilter,
            onChange: setSentimentFilter,
            options: [
              { v: 'all', l: 'All Sentiment' },
              { v: 'positive', l: 'Positive' },
              { v: 'neutral', l: 'Neutral' },
              { v: 'negative', l: 'Negative' },
            ],
          },
          {
            label: 'All Directions',
            value: directionFilter,
            onChange: setDirectionFilter,
            options: [
              { v: 'all', l: 'All Directions' },
              { v: 'incoming', l: 'Incoming' },
              { v: 'outgoing', l: 'Outgoing' },
            ],
          },
          {
            label: 'All Leads',
            value: leadFilter,
            onChange: setLeadFilter,
            options: [
              { v: 'all', l: 'All Leads' },
              { v: 'hot', l: 'Hot' },
              { v: 'warm', l: 'Warm' },
              { v: 'cold', l: 'Cold' },
              { v: 'lost', l: 'Lost' },
            ],
          },
        ].map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {f.options.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background:
                activeTab === t.key ? K.btnBlue : 'rgba(243,244,246,0.8)',
              color: activeTab === t.key ? '#fff' : K.textMuted,
              boxShadow: activeTab === t.key ? K.btnBlueShadow : 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Call List */}
      {displayList.length === 0 ? (
        <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Phone
            size={40}
            color="rgba(59,130,246,0.2)"
            style={{ margin: '0 auto 12px', display: 'block' }}
          />
          <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
            No calls found
          </div>
          <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
            {MOCK_CALLS.length === 0
              ? 'Create a campaign to start making calls.'
              : 'Try adjusting your filters.'}
          </div>
        </KCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayList.map((call) => (
            <KCard
              key={call.id}
              style={{
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex' }}>
                {/* Left color accent */}
                <div
                  style={{
                    width: 4,
                    background: getStatusColor(call.status),
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, padding: '16px 20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    {/* Left: contact info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background:
                            call.direction === 'incoming'
                              ? 'rgba(16,185,129,0.12)'
                              : 'rgba(59,130,246,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {call.direction === 'incoming' ? (
                          <PhoneIncoming size={18} color={K.success} />
                        ) : (
                          <PhoneOutgoing size={18} color={K.info} />
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              color: K.text,
                              fontWeight: 700,
                              fontSize: 14,
                            }}
                          >
                            {call.contactName}
                          </span>
                          {/* Engine badge */}
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 20,
                              background:
                                call.engine === 'elevenlabs'
                                  ? 'rgba(59,130,246,0.1)'
                                  : call.engine === 'openai'
                                    ? 'rgba(16,185,129,0.1)'
                                    : 'rgba(139,92,246,0.1)',
                              color:
                                call.engine === 'elevenlabs'
                                  ? K.info
                                  : call.engine === 'openai'
                                    ? K.success
                                    : '#8B5CF6',
                            }}
                          >
                            {call.engine === 'elevenlabs'
                              ? 'ElevenLabs'
                              : call.engine === 'twilio-openai'
                                ? 'Twilio+OpenAI'
                                : 'OpenAI'}
                          </span>
                          <KBadge
                            label={getStatusLabel(call.status)}
                            color={getStatusColor(call.status)}
                          />
                          {call.sentiment && (
                            <KBadge
                              label={
                                call.sentiment.charAt(0).toUpperCase() +
                                call.sentiment.slice(1)
                              }
                              color={getSentimentColor(call.sentiment)}
                            />
                          )}
                          {call.classification && (
                            <KBadge
                              label={
                                call.classification.charAt(0).toUpperCase() +
                                call.classification.slice(1)
                              }
                              color={getClassificationColor(
                                call.classification,
                              )}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: 16,
                            color: K.textMuted,
                            fontSize: 12,
                          }}
                        >
                          <span>{call.phone}</span>
                          {call.campaign && <span>📢 {call.campaign}</span>}
                          {call.agent && <span>🤖 {call.agent}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right: play button */}
                    {call.hasRecording && (
                      <button
                        onClick={() => togglePlay(call.id)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'rgba(243,244,246,0.9)',
                          border: `1px solid ${K.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {playingId === call.id ? (
                          <Pause size={15} color={K.primary} />
                        ) : (
                          <Play size={15} color={K.textMuted} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Duration & Time */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        color: K.textMuted,
                        fontSize: 12,
                      }}
                    >
                      <Clock size={13} />
                      <span style={{ fontWeight: 600 }}>
                        {formatDuration(call.duration)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        color: K.textMuted,
                        fontSize: 12,
                      }}
                    >
                      <Calendar size={13} />
                      <span>{formatRelativeTime(call.createdAt)}</span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {call.aiSummary && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: `1px solid ${K.border}`,
                        display: 'flex',
                        gap: 8,
                      }}
                    >
                      <Sparkles
                        size={14}
                        color={K.primary}
                        style={{ marginTop: 1, flexShrink: 0 }}
                      />
                      <p
                        style={{
                          color: K.textMuted,
                          fontSize: 12,
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {call.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 12,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      {call.hasRecording && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: K.textMuted,
                            fontSize: 11,
                          }}
                        >
                          <Mic size={12} />
                          <span>Recording</span>
                        </div>
                      )}
                      {call.hasTranscript && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: K.textMuted,
                            fontSize: 11,
                          }}
                        >
                          <FileText size={12} />
                          <span>Transcript</span>
                        </div>
                      )}
                      {call.aiSummary && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: K.textMuted,
                            fontSize: 11,
                          }}
                        >
                          <Sparkles size={12} />
                          <span>AI Analysis</span>
                        </div>
                      )}
                    </div>
                    <KBtn size="sm" variant="ghost">
                      <Eye size={12} /> View Details
                    </KBtn>
                  </div>
                </div>
              </div>
            </KCard>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// DROP-IN REPLACEMENT — paste this function into your file.
// All K.*, KCard, KBtn, KProgress, MOCK_CAMPAIGNS, inputStyle,
// useState, and lucide-react imports stay exactly as-is in
// your outer file. Only the AnalyticsPage function changes.
// ============================================================

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days')
  const [callType, setCallType] = useState('all')

  // ── Tab definitions (icons match screenshot) ──────────────
  const tabs = [
    { key: 'all', label: 'All Calls', icon: <Phone size={13} /> },
    { key: 'incoming', label: 'Incoming', icon: <PhoneIncoming size={13} /> },
    { key: 'outgoing', label: 'Outgoing', icon: <PhoneOutgoing size={13} /> },
    { key: 'campaigns', label: 'Campaigns', icon: <Megaphone size={13} /> },
  ]

  // ── Metric cards ──────────────────────────────────────────
  const metrics = [
    {
      label: 'Total Calls',
      value: '45',
      icon: <Phone size={18} />,
      color: K.info,
      trend: '+12%',
      grad: K.gradCyan,
    },
    {
      label: 'Success Rate',
      value: '87%',
      icon: <TrendingUp size={18} />,
      color: K.success,
      trend: '+3.1%',
      grad: K.gradGreen,
    },
    {
      label: 'Qualified Leads',
      value: '18',
      icon: <Users size={18} />,
      color: '#8B5CF6',
      trend: '+5',
      grad: K.gradPrimary,
    },
    {
      label: 'Avg Duration',
      value: '2:34',
      subLabel: 'minutes per call',
      icon: <Clock size={18} />,
      color: K.warning,
      trend: '-0:12',
      grad: K.gradOrange,
    },
  ]

  // ── Daily bar-chart data ──────────────────────────────────
  const dailyData = [
    { day: 'Sat', calls: 2 },
    { day: 'Sun', calls: 0 },
    { day: 'Mon', calls: 8 },
    { day: 'Tue', calls: 12 },
    { day: 'Wed', calls: 6 },
    { day: 'Thu', calls: 10 },
    { day: 'Fri', calls: 7 },
  ]
  const maxCalls = Math.max(...dailyData.map((d) => d.calls), 1)
  // Y-axis ticks: 0 … maxCalls in 4 steps
  const yTicks = [0, 1, 2, 3, 4].map((i) => Math.round((maxCalls / 4) * i))

  // ── Lead distribution (pie chart) ────────────────────────
  const leadDist = [
    { label: 'Hot', value: 8, color: K.success },
    { label: 'Warm', value: 12, color: K.warning },
    { label: 'Cold', value: 18, color: K.textMuted },
    { label: 'Lost', value: 7, color: K.error },
  ]
  // ── Sentiment data (pie chart) ────────────────────────────
  const sentimentData = [
    { label: 'Positive', value: 55, color: K.success },
    { label: 'Neutral', value: 30, color: K.textMuted },
    { label: 'Negative', value: 15, color: K.error },
  ]

  // ── Campaign bar-chart data ───────────────────────────────
  const campaignData = MOCK_CAMPAIGNS.filter((c) => c.successRate > 0)
  const maxCR = Math.max(...campaignData.map((c) => c.successRate), 1)
  const crYTicks = [0, 1, 2, 3, 4].map((i) => Math.round((maxCR / 4) * i))

  // ── SVG pie helper ────────────────────────────────────────
  function buildPieSlices(
    data: { value: number; color: string; label: string }[],
  ) {
    const total = data.reduce((s, d) => s + d.value, 0)
    let cumAngle = -Math.PI / 2 // start at 12 o'clock
    const cx = 80,
      cy = 80,
      r = 65,
      gap = 0.03

    return data.map((d) => {
      const angle = (d.value / total) * 2 * Math.PI
      const startAngle = cumAngle + gap
      const endAngle = cumAngle + angle - gap
      cumAngle += angle

      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(endAngle)
      const y2 = cy + r * Math.sin(endAngle)
      const largeArc = angle > Math.PI ? 1 : 0

      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
      return { ...d, path, pct: Math.round((d.value / total) * 100) }
    })
  }

  const leadSlices = buildPieSlices(leadDist)
  const sentimentSlices = buildPieSlices(sentimentData)

  // ── Shared styles ─────────────────────────────────────────
  const chartCardStyle: React.CSSProperties = {
    padding: 22,
    background: '#fff',
    borderRadius: 16,
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  }

  const axisLabelStyle: React.CSSProperties = {
    fontSize: 10,
    fill: K.textMuted ?? '#9CA3AF',
    fontFamily: "'Outfit', system-ui, sans-serif",
  }

  // ── PieChart sub-component ────────────────────────────────
  function PieChart({ slices }: { slices: ReturnType<typeof buildPieSlices> }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* SVG pie */}
        <svg width={160} height={160} viewBox="0 0 160 160">
          {slices.map((s) => (
            <path key={s.label} d={s.path} fill={s.color} />
          ))}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slices.map((s) => (
            <div
              key={s.label}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: s.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: K.textSub ?? '#374151',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: K.textMuted ?? '#9CA3AF',
                  marginLeft: 'auto',
                  minWidth: 36,
                  textAlign: 'right',
                }}
              >
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── BarChart sub-component (axes + bars) ──────────────────
  function BarChart({
    bars,
    maxVal,
    yTicks: ticks,
    barColor,
    labelKey,
    valueKey,
  }: {
    bars: any[]
    maxVal: number
    yTicks: number[]
    barColor: string
    labelKey: string
    valueKey: string
  }) {
    const svgH = 140
    const svgW = 340
    const padL = 28
    const padB = 22
    const padT = 8
    const plotH = svgH - padT - padB
    const plotW = svgW - padL - 8
    const barW = Math.floor(plotW / bars.length) - 6

    return (
      <svg
        width="100%"
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="none"
      >
        {/* Y-axis grid lines + labels */}
        {ticks.map((t) => {
          const y = padT + plotH - (t / maxVal) * plotH
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={svgW - 8}
                y1={y}
                y2={y}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth={1}
              />
              <text
                x={padL - 4}
                y={y + 3}
                textAnchor="end"
                style={axisLabelStyle}
              >
                {t}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {bars.map((d, i) => {
          const val = d[valueKey] as number
          const barH = Math.max((val / maxVal) * plotH, val > 0 ? 4 : 2)
          const x = padL + i * (plotW / bars.length) + 3
          const y = padT + plotH - barH

          return (
            <g key={d[labelKey]}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={val > 0 ? barColor : 'rgba(17,24,39,0.06)'}
              />
              <text
                x={x + barW / 2}
                y={svgH - 4}
                textAnchor="middle"
                style={axisLabelStyle}
              >
                {d[labelKey]}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{ padding: 24 }}>
      {/* ── Header ── */}
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(139,92,246,0.10),rgba(99,102,241,0.06))',
          border: '1px solid rgba(139,92,246,0.18)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
            }}
          >
            <BarChart2 size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              Analytics
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              Comprehensive insights and performance metrics
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={inputStyle}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <KBtn variant="ghost">
            <Download size={14} /> Export Report
          </KBtn>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {tabs.map((t) => {
          const active = callType === t.key
          return (
            <button
              key={t.key}
              onClick={() => setCallType(t.key)}
              style={{
                padding: '8px 18px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: active ? K.btnBlue : 'rgba(243,244,246,0.8)',
                color: active ? '#fff' : K.textMuted,
                boxShadow: active ? K.btnBlueShadow : 'none',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Metric Cards — wide horizontal layout matching screenshot ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              borderRadius: 16,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              padding: '20px 22px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gradient accent strip across the top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: m.grad,
                borderRadius: '16px 16px 0 0',
              }}
            />

            {/* Icon — top right, matching screenshot */}
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 36,
                height: 36,
                borderRadius: 10,
                background: m.grad,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                opacity: 0.85,
              }}
            >
              {m.icon}
            </div>

            {/* Label */}
            <div
              style={{
                color: K.textMuted,
                fontSize: 12,
                marginTop: 6,
                marginBottom: 6,
              }}
            >
              {m.label}
            </div>

            {/* Big value */}
            <div
              style={{
                color: K.text,
                fontWeight: 800,
                fontSize: 32,
                lineHeight: 1,
              }}
            >
              {m.value}
            </div>

            {/* Sub-label (e.g. "minutes per call") */}
            {m.subLabel && (
              <div style={{ color: K.textMuted, fontSize: 11, marginTop: 3 }}>
                {m.subLabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: Bar chart + Pie chart ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* Daily Call Volume — bar chart with axes */}
        <div style={chartCardStyle}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Daily Call Volume
          </div>
          <BarChart
            bars={dailyData}
            maxVal={maxCalls}
            yTicks={yTicks}
            barColor="#06B6D4" /* cyan — matches K.gradCyan accent */
            labelKey="day"
            valueKey="calls"
          />
        </div>

        {/* Lead Distribution — pie chart */}
        <div style={chartCardStyle}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Lead Distribution
          </div>
          <PieChart slices={leadSlices} />
        </div>
      </div>

      {/* ── Charts Row 2: Campaign bar chart + Sentiment pie ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Campaign Success Rate — bar chart with axes */}
        <div style={chartCardStyle}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Campaign Success Rate
          </div>
          {campaignData.length === 0 ? (
            <div
              style={{
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: K.textMuted,
                fontSize: 13,
              }}
            >
              No campaigns
            </div>
          ) : (
            <BarChart
              bars={campaignData.map((c) => ({
                name: c.name.length > 10 ? c.name.slice(0, 10) + '…' : c.name,
                rate: c.successRate,
              }))}
              maxVal={maxCR}
              yTicks={crYTicks}
              barColor={K.success}
              labelKey="name"
              valueKey="rate"
            />
          )}
        </div>

        {/* Sentiment Analysis — pie chart */}
        <div style={chartCardStyle}>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Sentiment Analysis
          </div>
          <PieChart slices={sentimentSlices} />
        </div>
      </div>
    </div>
  )
}

// ─── Page: All Contacts ───────────────────────────────────────────────────────
function ContactsPage() {
  const contacts = [
    {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah@designco.com',
      campaigns: 1,
      status: 'active',
    },
    {
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      email: 'm.chen@techstartup.io',
      campaigns: 2,
      status: 'active',
    },
    {
      name: 'Aria Patel',
      phone: '+1 (555) 345-6789',
      email: 'aria@clients.net',
      campaigns: 1,
      status: 'inactive',
    },
    {
      name: 'James Whitfield',
      phone: '+1 (555) 456-7890',
      email: 'james@agencygroup.com',
      campaigns: 3,
      status: 'active',
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(6,182,212,0.10),rgba(59,130,246,0.06))',
          border: '1px solid rgba(6,182,212,0.18)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradCyan,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(6,182,212,0.3)',
            }}
          >
            <Users size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              All Contacts
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              View all unique contacts across campaigns
            </div>
          </div>
        </div>
        <KBtn variant="ghost">
          <Download size={14} /> Export All Contacts
        </KBtn>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Unique Contacts', value: contacts.length, color: K.info },
          { label: 'From Campaigns', value: contacts.length, color: K.primary },
          { label: 'From Calls', value: 0, color: '#8B5CF6' },
          { label: 'Campaigns', value: 4, color: K.success },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 26 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      <KCard>
        {/* Search */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${K.border}`,
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
                color: K.textLight,
              }}
            />
            <input
              placeholder="Search by name, phone, or email…"
              style={{
                ...inputStyle,
                paddingLeft: 32,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 140px 1fr 80px 80px 100px',
            gap: 12,
            padding: '10px 18px',
            background: 'rgba(243,244,246,0.6)',
            borderBottom: `1px solid ${K.border}`,
          }}
        >
          {['Names', 'Phone', 'Email', 'Campaigns', 'Status', 'Actions'].map(
            (h) => (
              <div
                key={h}
                style={{
                  color: K.textMuted,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {h}
              </div>
            ),
          )}
        </div>

        {contacts.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: K.textMuted,
              fontSize: 13,
            }}
          >
            No contacts added yet
          </div>
        ) : (
          contacts.map((c, i) => {
            const initials = c.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
            const hue =
              c.name.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 140px 1fr 80px 80px 100px',
                  gap: 12,
                  padding: '14px 18px',
                  borderBottom:
                    i < contacts.length - 1 ? `1px solid ${K.border}` : 'none',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    'rgba(99,102,241,0.03)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background =
                    'transparent')
                }
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: `hsl(${hue},65%,58%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    style={{ color: K.text, fontSize: 13, fontWeight: 600 }}
                  >
                    {c.name}
                  </span>
                </div>
                <span
                  style={{
                    color: K.textMuted,
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                >
                  {c.phone}
                </span>
                <span style={{ color: K.textMuted, fontSize: 12 }}>
                  {c.email}
                </span>
                <span style={{ color: K.text, fontSize: 13, fontWeight: 600 }}>
                  {c.campaigns}
                </span>
                <KBadge
                  label={c.status === 'active' ? 'Active' : 'Inactive'}
                  color={c.status === 'active' ? K.success : K.textMuted}
                  dot
                />
                <KBtn size="sm" variant="ghost">
                  <Eye size={12} />
                </KBtn>
              </div>
            )
          })
        )}
      </KCard>
    </div>
  )
}

// ─── Page: Phone Numbers ──────────────────────────────────────────────────────
function PhoneNumbersPage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(5,150,105,0.06))',
          border: '1px solid rgba(16,185,129,0.2)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradGreen,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            <Phone size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              Phone Numbers
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              Manage your dedicated phone numbers for inbound and outbound calls
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <KBtn variant="ghost">
            <Settings size={14} /> Manage Connections
          </KBtn>
          <KBtn variant="blue">
            <Plus size={14} /> Buy Number
          </KBtn>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Total Numbers', value: '0', color: K.info },
          { label: 'Active', value: '0', color: K.success },
          { label: 'Connected', value: '0', color: '#8B5CF6' },
          { label: 'Credits/Month', value: '50', color: K.warning },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 26 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
        <Phone
          size={40}
          color="rgba(16,185,129,0.2)"
          style={{ margin: '0 auto 12px', display: 'block' }}
        />
        <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
          No Phone Numbers
        </div>
        <div
          style={{
            color: K.textMuted,
            fontSize: 13,
            marginTop: 6,
            maxWidth: 360,
            margin: '8px auto 0',
          }}
        >
          You don't have any phone numbers yet. Buy a number to start receiving
          and making calls.
        </div>
        <div style={{ marginTop: 20 }}>
          <KBtn>
            <Plus size={14} /> Buy Your First Number
          </KBtn>
        </div>
      </KCard>
    </div>
  )
}

// ─── Page: Knowledge Base ─────────────────────────────────────────────────────
function KnowledgeBasePage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg,rgba(139,92,246,0.10),rgba(168,85,247,0.06))',
          border: '1px solid rgba(139,92,246,0.2)',
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.btnViolet,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
            }}
          >
            <BookOpen size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              Knowledge Base
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              Train your AI agents with custom knowledge
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <KBtn variant="ghost">
            <Globe size={14} /> Add URL
          </KBtn>
          <KBtn variant="ghost">
            <Plus size={14} /> Add Files
          </KBtn>
          <KBtn>
            <FileText size={14} /> Create Text
          </KBtn>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Total Items', value: '0', color: K.primary },
          { label: 'Knowledge Chunks', value: '0', color: K.info },
          { label: 'Docs & URLs', value: '0', color: K.success },
          { label: 'Text Entries', value: '0', color: K.warning },
          { label: 'Storage Used', value: '0 B', color: '#8B5CF6' },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 22 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: K.textLight,
            }}
          />
          <input
            placeholder="Search Knowledge Base…"
            style={{
              ...inputStyle,
              paddingLeft: 32,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
        <BookOpen
          size={40}
          color="rgba(139,92,246,0.2)"
          style={{ margin: '0 auto 12px', display: 'block' }}
        />
        <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
          No documents found
        </div>
        <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
          Upload your first document to get started
        </div>
      </KCard>
    </div>
  )
}

// ─── Page: Flow Builder ───────────────────────────────────────────────────────
function FlowBuilderPage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          borderRadius: 20,
          background: 'rgba(255,255,255,0.7)',
          border: `1px solid ${K.border}`,
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
            Flow Builder
          </div>
          <div style={{ color: K.textMuted, fontSize: 13 }}>
            Create and manage conversation flows with drag-and-drop visual
            builder
          </div>
        </div>
        <KBtn>
          <Plus size={14} /> Create Flow
        </KBtn>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {['My Flows (0)', 'Templates', 'Execution Logs'].map((t, i) => (
          <button
            key={t}
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: i === 0 ? K.btnBlue : 'rgba(243,244,246,0.8)',
              color: i === 0 ? '#fff' : K.textMuted,
              boxShadow: i === 0 ? K.btnBlueShadow : 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <KCard style={{ padding: '80px 20px', textAlign: 'center' }}>
        <GitBranch
          size={48}
          color="rgba(99,102,241,0.2)"
          style={{ margin: '0 auto 16px', display: 'block' }}
        />
        <div style={{ color: K.text, fontWeight: 700, fontSize: 17 }}>
          No flows yet
        </div>
        <div
          style={{
            color: K.textMuted,
            fontSize: 13,
            marginTop: 6,
            maxWidth: 360,
            margin: '8px auto 0',
          }}
        >
          Create your first visual conversation flow to build complex multi-step
          conversations.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <KBtn>
            <Plus size={14} /> Create Blank Flow
          </KBtn>
          <KBtn variant="ghost">
            <FileText size={14} /> Use Call Transfer Template
          </KBtn>
        </div>
      </KCard>
    </div>
  )
}

// ─── Page: Tools ──────────────────────────────────────────────────────────────
function ToolsPage() {
  const tools = [
    {
      name: 'Forms',
      desc: 'Create and manage forms to collect data from your contacts and leads.',
      icon: <FileText size={22} />,
      color: K.info,
    },
    {
      name: 'Appointments',
      desc: 'Manage appointment bookings from your AI agents and forms.',
      icon: <Calendar size={22} />,
      color: K.error,
    },
    {
      name: 'Webhooks',
      desc: 'Configure webhook endpoints to receive real-time event notifications.',
      icon: <Zap size={22} />,
      color: '#8B5CF6',
    },
    {
      name: 'Website Widget',
      desc: 'Embed an AI chat widget on your website for visitor engagement.',
      icon: <Globe size={22} />,
      color: K.info,
    },
    {
      name: 'Quick CRM',
      desc: 'Organize and manage your leads with a kanban board and contact filters.',
      icon: <Target size={22} />,
      color: K.info,
    },
    {
      name: 'Incoming Connections',
      desc: 'Manage incoming call routing and connect callers to your AI agents.',
      icon: <PhoneIncoming size={22} />,
      color: '#8B5CF6',
    },
    {
      name: 'Developer / API Keys',
      desc: 'Manage API keys and access REST API documentation.',
      icon: <Hash size={22} />,
      color: K.warning,
    },
    {
      name: 'Team Management',
      desc: 'Invite team members, assign roles, and manage permissions.',
      icon: <Users size={22} />,
      color: K.info,
    },
    {
      name: 'WhatsApp & Email',
      desc: 'Configure WhatsApp Business and email messaging for your agents.',
      icon: <MessageSquare size={22} />,
      color: K.success,
    },
    {
      name: 'Google Sheets',
      desc: 'Push appointment and form data to Google Sheets in real time.',
      icon: <BarChart2 size={22} />,
      color: K.success,
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          color: K.text,
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 6,
        }}
      >
        Tools
      </div>
      <div style={{ color: K.textMuted, fontSize: 14, marginBottom: 24 }}>
        Access and configure your platform tools and integrations.
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
        }}
      >
        {tools.map((tool) => (
          <KCard
            key={tool.name}
            style={{
              padding: '22px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${tool.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: tool.color,
                  flexShrink: 0,
                }}
              >
                {tool.icon}
              </div>
              <div>
                <div
                  style={{
                    color: K.text,
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 5,
                  }}
                >
                  {tool.name}
                </div>
                <div
                  style={{ color: K.textMuted, fontSize: 12, lineHeight: 1.5 }}
                >
                  {tool.desc}
                </div>
              </div>
            </div>
          </KCard>
        ))}
      </div>
    </div>
  )
}

// ─── Page: Conversations ──────────────────────────────────────────────────────
function ConversationsPage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          borderRadius: 20,
          background: 'rgba(255,255,255,0.7)',
          border: `1px solid ${K.border}`,
          padding: '22px 26px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: K.gradPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={24} color="#fff" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 18 }}>
              Calls & Conversations
            </div>
            <div style={{ color: K.textMuted, fontSize: 13 }}>
              View recordings, transcripts, and AI analysis
            </div>
          </div>
        </div>
      </div>
      <KCard style={{ padding: '60px 20px', textAlign: 'center' }}>
        <MessageSquare
          size={40}
          color="rgba(99,102,241,0.2)"
          style={{ margin: '0 auto 12px', display: 'block' }}
        />
        <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
          No conversations yet
        </div>
        <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
          Conversations will appear here once calls are made.
        </div>
      </KCard>
    </div>
  )
}

// ─── Page: Billing ────────────────────────────────────────────────────────────
function BillingPage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: K.btnBlueShadow,
          padding: '26px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              Current Plan
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>
              Free
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13,
                marginTop: 2,
              }}
            >
              Perfect for trying out AI calling
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 32 }}>
              Free
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>
                {' '}
                forever
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Current Balance', value: '50', color: K.info },
          { label: 'Current Plan', value: 'Free', color: K.success },
          { label: 'Transactions', value: '0', color: K.primary },
          { label: 'Status', value: 'Active', color: K.success },
        ].map((s) => (
          <KCard key={s.label} style={{ padding: '16px 20px' }}>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 22 }}>
              {s.value}
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              {s.label}
            </div>
          </KCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Free Plan */}
        <KCard style={{ padding: '28px', border: `2px solid ${K.border}` }}>
          <div style={{ color: K.textMuted, fontSize: 14, marginBottom: 4 }}>
            Free
          </div>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 28,
              marginBottom: 4,
            }}
          >
            Free <span style={{ fontSize: 14, fontWeight: 400 }}>forever</span>
          </div>
          <div style={{ color: K.textMuted, fontSize: 13, marginBottom: 16 }}>
            Perfect for trying out AI calling. Get started with basic features
            at no cost.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '2 AI Agents',
              '3 Campaigns',
              'Max 10 contacts',
              'Own phone numbers',
              'Choose your LLM',
              '2 Flow Automations',
              '2 Knowledge Bases',
              '2 Webhooks',
              '50 included credits',
            ].map((f) => (
              <div
                key={f}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <CheckCircle2 size={14} color={K.success} />
                <span style={{ color: K.textSub, fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: '10px',
              borderRadius: 10,
              background: 'rgba(243,244,246,0.8)',
              textAlign: 'center',
              color: K.textMuted,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Current Plan
          </div>
        </KCard>

        {/* Pro Plan */}
        <KCard
          style={{
            padding: '28px',
            border: `2px solid ${K.primary}`,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: K.gradPrimary,
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 14px',
              borderRadius: 20,
              whiteSpace: 'nowrap',
            }}
          >
            ✨ Most Popular
          </div>
          <div style={{ color: K.primary, fontSize: 14, marginBottom: 4 }}>
            Pro
          </div>
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 28,
              marginBottom: 4,
            }}
          >
            $49<span style={{ fontSize: 14, fontWeight: 400 }}>/month</span>
          </div>
          <div style={{ color: K.textMuted, fontSize: 13, marginBottom: 16 }}>
            For growing businesses. Unlock advanced features, more capacity, and
            premium support.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '25 AI Agents',
              '50 Campaigns',
              'Max 1000 contacts',
              'Own phone numbers',
              'Choose your LLM',
              '25 Flow Automations',
              '25 Knowledge Bases',
              '20 Webhooks',
              '10 Phone Numbers',
              '300 included credits',
              'Priority support',
              'SIP Trunk Access',
            ].map((f) => (
              <div
                key={f}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <CheckCircle2 size={14} color={K.primary} />
                <span style={{ color: K.textSub, fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <KBtn style={{ width: '100%', justifyContent: 'center' }}>
              Upgrade →
            </KBtn>
          </div>
        </KCard>
      </div>
    </div>
  )
}

// ─── Page: Settings ───────────────────────────────────────────────────────────
function CallsSettingsPage() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          color: K.text,
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 20,
        }}
      >
        Settings
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          {
            label: 'General',
            desc: 'Configure general platform settings',
            icon: <Settings size={20} />,
            color: K.primary,
          },
          {
            label: 'Phone Numbers',
            desc: 'Manage phone number connections',
            icon: <Phone size={20} />,
            color: K.success,
          },
          {
            label: 'AI Configuration',
            desc: 'Train and configure AI response behavior',
            icon: <Bot size={20} />,
            color: '#8B5CF6',
          },
          {
            label: 'Notifications',
            desc: 'Manage notification preferences',
            icon: <Bell size={20} />,
            color: K.warning,
          },
          {
            label: 'Team & Access',
            desc: 'Invite team members and manage roles',
            icon: <Users size={20} />,
            color: K.info,
          },
          {
            label: 'Billing & Plan',
            desc: 'Manage your subscription and billing',
            icon: <CreditCard size={20} />,
            color: K.primary,
          },
        ].map((item, i) => (
          <KCard
            key={i}
            style={{
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${item.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: K.text, fontSize: 14, fontWeight: 600 }}>
                {item.label}
              </div>
              <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
                {item.desc}
              </div>
            </div>
            <ChevronRight size={16} color={K.textLight} />
          </KCard>
        ))}
      </div>
    </div>
  )
}

// ─── Main CallsView Component ─────────────────────────────────────────────────
export function CallsView() {
  const [tab, setTab] = useState<CallsTab>('home')

  function renderPage() {
    switch (tab) {
      case 'home':
        return <HomeDashboard onNav={setTab} />
      case 'campaigns':
        return <CampaignsPage />
      case 'agents':
        return <AgentsPage />
      case 'knowledge-base':
        return <KnowledgeBasePage />
      case 'flow-builder':
        return <FlowBuilderPage />
      case 'tools':
        return <ToolsPage />
      case 'contacts':
        return <ContactsPage />
      case 'phone-numbers':
        return <PhoneNumbersPage />
      case 'conversations':
        return <ConversationsPage />
      case 'calls':
        return <CallsPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'billing':
        return <BillingPage />
      case 'settings':
        return <CallsSettingsPage />
      default:
        return <HomeDashboard onNav={setTab} />
    }
  }

  const getPageMeta = () => {
    const meta: Record<CallsTab, { title: string; subtitle: string }> = {
      home: { title: 'Dashboard', subtitle: 'AI Call Agents — Kira' },
      campaigns: { title: 'Campaigns', subtitle: 'AI Call Agents — Kira' },
      agents: { title: 'AI Agents', subtitle: 'AI Call Agents — Kira' },
      'knowledge-base': {
        title: 'Knowledge Base',
        subtitle: 'AI Call Agents — Kira',
      },
      'flow-builder': {
        title: 'Flow Builder',
        subtitle: 'AI Call Agents — Kira',
      },
      tools: { title: 'Tools', subtitle: 'AI Call Agents — Kira' },
      contacts: { title: 'All Contacts', subtitle: 'AI Call Agents — Kira' },
      'phone-numbers': {
        title: 'Phone Numbers',
        subtitle: 'AI Call Agents — Kira',
      },
      conversations: {
        title: 'Conversations',
        subtitle: 'AI Call Agents — Kira',
      },
      calls: {
        title: 'Calls & Conversations',
        subtitle: 'AI Call Agents — Kira',
      },
      analytics: { title: 'Analytics', subtitle: 'AI Call Agents — Kira' },
      billing: {
        title: 'Billing & Subscription',
        subtitle: 'AI Call Agents — Kira',
      },
      settings: { title: 'Settings', subtitle: 'AI Call Agents — Kira' },
    }
    return meta[tab]
  }

  const meta = getPageMeta()

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* MainBG */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: K.mainBg,
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom right, rgba(238,241,246,0.55) 0%, rgba(229,238,255,0.35) 50%, rgba(255,255,255,0.2) 100%)',
          zIndex: 0,
        }}
      />
      {/* Top-right blobs */}
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

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 210,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: K.sidebarBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: `1px solid ${K.border}`,
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '16px 14px 12px',
            borderBottom: `1px solid ${K.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: K.btnBlue,
                boxShadow: K.btnBlueShadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone size={15} color="#fff" />
            </div>
            <span style={{ color: K.text, fontWeight: 700, fontSize: 14 }}>
              AI Call Agents
            </span>
          </div>
        </div>

        {/* Home */}
        <div style={{ padding: '8px 8px 0' }}>
          <button
            onClick={() => setTab('home')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              border: 'none',
              background: tab === 'home' ? K.activeNavBg : 'transparent',
              color: tab === 'home' ? K.text : K.textMuted,
              fontSize: 13,
              fontWeight: tab === 'home' ? 600 : 400,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'left',
              fontFamily: "'Outfit', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
          >
            {tab === 'home' && <GlowBlobs />}
            <span
              style={{
                color: tab === 'home' ? K.primary : K.textLight,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <LayoutDashboard size={15} />
            </span>
            <span style={{ position: 'relative', zIndex: 1 }}>Home</span>
            {tab === 'home' && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: 3,
                  borderRadius: 2,
                  background: K.btnBlue,
                }}
              />
            )}
          </button>
        </div>

        {/* Scrollable Nav Sections */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div
                style={{
                  color: K.textLight,
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '12px 12px 4px',
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                const active = tab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 12,
                      border: 'none',
                      marginBottom: 2,
                      background: active ? K.activeNavBg : 'transparent',
                      color: active ? K.text : K.textMuted,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left',
                      fontFamily: "'Outfit', system-ui, sans-serif",
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = 'rgba(255,255,255,0.55)'
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = 'transparent'
                    }}
                  >
                    {active && <GlowBlobs />}
                    <span
                      style={{
                        color: active ? K.primary : K.textLight,
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: 3,
                          borderRadius: 2,
                          background: K.btnBlue,
                        }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top Navbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px 14px',
            borderBottom: '1px solid rgba(17,24,39,0.1)',
            flexShrink: 0,
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
              {meta.title}
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#696D7D',
                margin: '2px 0 0',
                fontWeight: 400,
              }}
            >
              {meta.subtitle}
            </p>
          </div>
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
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  ;(e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
                }}
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
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  ;(e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
                }}
              />
            </button>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: K.gradPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src="/profile.png"
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  ;(e.currentTarget.parentElement as HTMLElement).innerHTML =
                    '<span style="color:#fff;font-size:18px;font-weight:700">G</span>'
                }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default CallsView
