import BeedAI from './BeedAI'
import EmailAgent from './EmailAgent'
import CalendarView from './CalendarView'
import QRCodeGenerator from './QRCodeGenerator'
import TravelPlaner from './TravelPlaner'
import CallsView from './CallsView'
import FinanceView from './FinanceView'
import { SocialMediaView } from './SocialMediaView'
import CoderView from './CoderView'
import { MealCraftView } from './MealPlannerView'
import ChatHistoryView from './ChatHistoryView'
import MeetingsView from './MeetingsView'
import SettingsView from './SettingsView'
import ProfileView from './ProfileView'
import ActivityLogView from './ActivityLogView'
import HelpCentreView from './HelpCentreView'
import IntegrationsHub from './IntegrationsHub'
import FilesManager from './FilesManager'
import SignUpPage from './signup'
import HomeworkView from './HomeworkView'
import WorkspaceView from './WorkspaceView'
import NotificationsView from './NotificationsView'
import MyBrainView from './MyBrainView'
import HelpView from './HelpView'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  XCircle,
  Menu,
  Star,
  X,
  Workflow,
  Mail,
  ImageIcon,
  PenTool,
  ChefHat,
  CheckCircle2,
  MessageCircle,
  Bell,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  // Kira icons
  Brain,
  LayoutDashboard,
  Inbox,
  Users,
  Heart,
  BookOpen,
  AtSign,
  Code,
  Send,
  BarChart2,
  Clock,
  HelpCircle,
  Sliders,
  Reply,
  FileText,
  Check,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Zap,
  MessageSquare,
  Contact,
  Target,
  User,
  Shield,
  Eye,
  EyeOff,
  Globe,
  CreditCard,
  Moon,
  Sun,
  Monitor,
  UploadCloud,
  Trash2,
  Lock,
  KeyRound,
  Laptop,
  Fingerprint,
  History,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Phone,
  Link2,
  Download,
  Smartphone,
  Gamepad2,
  Copy,
  Mic,
} from 'lucide-react'
import { MapPin } from 'lucide-react'

import './App.css'

// ─── Kira sub-tab type ───────────────────────────────────────────────────
type KiraTab =
  | 'mt-dashboard'
  | 'mt-inbox'
  | 'mt-inbox-starred'
  | 'mt-inbox-sent'
  | 'mt-inbox-drafts'
  | 'mt-inbox-spam'
  | 'mt-inbox-trash'
  | 'mt-contacts'
  | 'mt-deals'
  | 'mt-knowledge'
  | 'mt-tempmail'
  | 'mt-workflows'
  | 'mt-campaigns'
  | 'mt-analytics'
  | 'mt-activity'
  | 'mt-help'
  | 'mt-settings'

// View types for navigation
type ViewType =
  | 'dashboard'
  | 'chats'
  | 'email'
  | 'n8n'
  | 'calls'
  | 'connect'
  | 'jarvis'
  | 'homework'
  | 'writer'
  | 'coder'
  | 'api'
  | 'meal'
  | 'history'
  | 'calendar'
  | 'finance'
  | 'meetings'
  | 'social'
  | 'travel'
  | 'qrcode'
  | 'notifications'
  | 'files'
  | 'agents'
  | 'workspace'
  | 'pricing'
  | 'help'
  | 'settings'
  | 'slides'
  | 'spreadsheets'
  | 'music'
  | 'voice'
  | 'photo'
  | 'editor'
  | 'notifications2'
  | 'podcast'
  | 'voiceclone'
  | 'photoeditor'
  | 'factchecker'
  | 'phonecall'
  | 'extension'
  | 'doceditor'
  | 'profile'
  | 'brain'




// ─── Views that have their own internal sidebar ───────────────────────────
// When navigating to these views, the main sidebar auto-collapses to icon-only
// mode so the view's own sidebar takes over the left panel.
// To add a new view: just add its ViewType string to this Set.
const VIEWS_WITH_OWN_SIDEBAR = new Set<ViewType>([
  'email', // KiraView (Email Agent)
  'calls', // CallsView (AI Call Agents)
  'finance', // FinanceView
  'calendar', // CalendarView
  'social',
])



// ─── Kira design tokens ───────────────────────────────────────────────────────
const KIRA_BG = 'url("/MainBG.png") center right / cover no-repeat'
const KIRA_BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}
const KIRA_CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  borderRadius: 20,
  border: '1px solid rgba(17,24,39,0.07)',
}
const KIRA_ACTIVE_BG =
  'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'

// Active glow blobs (same as existing sidebar)
function GlowBlobs({ side = 'right' }: { side?: 'right' | 'left' }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: 75,
          height: 75,
          borderRadius: '50%',
          ...(side === 'right' ? { right: -20 } : { left: 194 }),
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
          ...(side === 'right' ? { right: -30 } : { left: 151 }),
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
          ...(side === 'right' ? { right: -50 } : { left: 105 }),
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

// ─── Kira Sub-Views ───────────────────────────────────────────────────────

function MTDashboard() {
  const stats = [
    {
      label: 'Total Conversations',
      value: '45',
      icon: MessageSquare,
      color: '#6366f1',
      change: '+12 today',
    },
    {
      label: 'AI Replies Sent',
      value: '0',
      icon: Sparkles,
      color: '#a855f7',
      change: '0 today',
    },
    {
      label: 'Contacts',
      value: '128',
      icon: Contact,
      color: '#3b82f6',
      change: '+3 today',
    },
    {
      label: 'Open Deals',
      value: '7',
      icon: Target,
      color: '#10b981',
      change: '+1 today',
    },
  ]

  const recentContacts = [
    {
      name: 'c.g.cunha',
      email: 'c.g.cunha@example.com',
      status: 'No messages',
    },
    {
      name: 'Greta Ahmed',
      email: 'greta.ahmed@example.com',
      status: 'No messages',
    },
    {
      name: 'uruguay.xxx',
      email: 'uruguay@example.com',
      status: 'No messages',
    },
  ]

  const setupSteps = [
    {
      title: 'Email Connected',
      desc: '1 account connected · IMAP',
      done: true,
      badge: 'CONNECTED',
    },
    {
      title: 'Train Your AI',
      desc: 'Configure responses',
      done: false,
      badge: 'GET STARTED',
    },
  ]

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Setup Progress Banner */}
      <div
        style={{
          borderRadius: 20,

          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <h2
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 600,
              margin: '0 0 4px',
            }}
          >
            Welcome to Kira!
          </h2>
          <p
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}
          >
            Setup progress: <strong style={{ color: '#a5b4fc' }}>2/3</strong> —
            keep going!
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {setupSteps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: step.done
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid rgba(119,192,255,0.35)`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: step.done
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {step.done ? (
                    <Check size={18} color="#fff" />
                  ) : (
                    <Bell size={18} color="rgba(255,255,255,0.5)" />
                  )}
                </div>
                <div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span
                      style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}
                    >
                      {step.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 20,
                        background: step.done
                          ? '#22c55e'
                          : 'rgba(255,255,255,0.15)',
                        color: step.done ? '#fff' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 12,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome + Stats */}
      <div>
        <div
          style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 16,
            padding: '18px 22px',
            marginBottom: 16,
            border: '1px solid rgba(17,24,39,0.06)',
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 4px',
            }}
          >
            Welcome back, User Mediacity
          </h3>
          <p style={{ fontSize: 13, color: '#696D7D', margin: 0 }}>
            Here's what's happening with your workspace.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
          }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 18,
                  padding: '20px',
                  border: '1px solid rgba(17,24,39,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: stat.color,
                    opacity: 0.08,
                  }}
                />
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: stat.color + '18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Icon size={20} color={stat.color} />
                </div>
                <p
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 2px',
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: 12, color: '#696D7D', margin: 0 }}>
                  {stat.label}
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: '#4f46e5' + '12',
                    color: '#4f46e5',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {stat.change}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue where you left off */}
      <div
        style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 18,
          padding: '20px 22px',
          border: '1px solid rgba(17,24,39,0.06)',
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 14px',
          }}
        >
          Continue where you left off
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentContacts.map((c, i) => {
            const initials = c.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
            const hue =
              c.name.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(243,244,246,0.8)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: `hsl(${hue},65%,58%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    {c.name}
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                    {c.status}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MTContacts() {
  const contacts = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@designco.com',
      status: 'Active',
      tags: ['Design', 'Client'],
    },
    {
      name: 'Michael Chen',
      email: 'm.chen@techstartup.io',
      status: 'Lead',
      tags: ['Business'],
    },
    {
      name: 'Aria Patel',
      email: 'aria@clients.net',
      status: 'Customer',
      tags: ['Finance'],
    },
    {
      name: 'James Whitfield',
      email: 'james@agencygroup.com',
      status: 'Active',
      tags: ['Urgent'],
    },
    {
      name: 'Dev Team',
      email: 'dev@internal.kira',
      status: 'Internal',
      tags: ['Team'],
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Contacts
        </h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            ...KIRA_BTN_BLUE,
          }}
        >
          <Plus size={14} /> Add Contact
        </button>
      </div>
      <div style={{ ...KIRA_CARD, overflow: 'hidden' }}>
        <div
          style={{
            padding: '14px 18px',
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
              placeholder="Search contacts…"
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                outline: 'none',
                background: 'rgba(255,255,255,0.9)',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
        {contacts.map((c, i) => {
          const hue =
            c.name.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360
          const initials = c.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
          const statusColor: Record<string, string> = {
            Active: '#22c55e',
            Lead: '#f59e0b',
            Customer: '#6366f1',
            Internal: '#3b82f6',
          }
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderBottom:
                  i < contacts.length - 1
                    ? '1px solid rgba(17,24,39,0.05)'
                    : 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `hsl(${hue},65%,58%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#111827',
                    margin: '0 0 2px',
                  }}
                >
                  {c.name}
                </p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                  {c.email}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {c.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: '#6366f118',
                      color: '#6366f1',
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: (statusColor[c.status] || '#9ca3af') + '18',
                    color: statusColor[c.status] || '#9ca3af',
                    fontWeight: 600,
                  }}
                >
                  {c.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MTDeals() {
  const deals = [
    {
      title: 'Q4 Campaign Package',
      contact: 'Sarah Johnson',
      value: '$12,400',
      stage: 'Proposal',
      probability: 75,
    },
    {
      title: 'AI Integration Partnership',
      contact: 'Michael Chen',
      value: '$28,000',
      stage: 'Negotiation',
      probability: 55,
    },
    {
      title: 'Annual Support Contract',
      contact: 'Aria Patel',
      value: '$6,000',
      stage: 'Closed Won',
      probability: 100,
    },
    {
      title: 'Website Redesign',
      contact: 'James Whitfield',
      value: '$9,500',
      stage: 'Discovery',
      probability: 25,
    },
  ]
  const stageColor: Record<string, string> = {
    Proposal: '#f59e0b',
    Negotiation: '#6366f1',
    'Closed Won': '#22c55e',
    Discovery: '#3b82f6',
  }
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Deals
        </h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            ...KIRA_BTN_BLUE,
          }}
        >
          <Plus size={14} /> New Deal
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {deals.map((d, i) => (
          <div
            key={i}
            style={{
              ...KIRA_CARD,
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 4px',
                }}
              >
                {d.title}
              </p>
              <p style={{ fontSize: 13, color: '#696D7D', margin: 0 }}>
                {d.contact}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 4px',
                }}
              >
                {d.value}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 60,
                    height: 4,
                    borderRadius: 4,
                    background: '#f1f5f9',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${d.probability}%`,
                      height: '100%',
                      borderRadius: 4,
                      background: stageColor[d.stage] || '#6366f1',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: stageColor[d.stage] || '#6366f1',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: (stageColor[d.stage] || '#6366f1') + '18',
                  }}
                >
                  {d.stage}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MTKnowledgeBase() {
  const articles = [
    {
      title: 'Getting Started with Kira',
      category: 'Basics',
      views: 1240,
    },
    { title: 'Setting up AI Auto-Replies', category: 'Automation', views: 843 },
    { title: 'Managing Contacts & Segments', category: 'Contacts', views: 612 },
    { title: 'Campaign Best Practices', category: 'Campaigns', views: 507 },
    { title: 'IMAP / SMTP Configuration Guide', category: 'Setup', views: 398 },
  ]
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Knowledge Base
        </h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            ...KIRA_BTN_BLUE,
          }}
        >
          <Plus size={14} /> New Article
        </button>
      </div>
      <div style={{ ...KIRA_CARD, overflow: 'hidden' }}>
        {articles.map((a, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderBottom:
                i < articles.length - 1
                  ? '1px solid rgba(17,24,39,0.05)'
                  : 'none',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#6366f112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={18} color="#6366f1" />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#111827',
                  margin: '0 0 2px',
                }}
              >
                {a.title}
              </p>
              <span
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: '#3b82f618',
                  color: '#3b82f6',
                  fontWeight: 500,
                }}
              >
                {a.category}
              </span>
            </div>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {a.views.toLocaleString()} views
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MTTempMail() {
  const [copied, setCopied] = useState(false)
  const tempEmail = 'temp_kira_8f92@Kira.io'
  const inbox = [
    {
      from: 'noreply@github.com',
      subject: 'Verify your email address',
      time: '2m ago',
    },
    {
      from: 'no-reply@google.com',
      subject: 'Your Google Account verification code',
      time: '15m ago',
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 20px',
        }}
      >
        Temp Mail
      </h2>
      <div
        style={{
          ...KIRA_CARD,
          padding: '24px',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#6366f112',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <AtSign size={24} color="#6366f1" />
        </div>
        <p style={{ fontSize: 13, color: '#696D7D', margin: '0 0 12px' }}>
          Your temporary email address:
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#111827',
              padding: '10px 16px',
              borderRadius: 12,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            {tempEmail}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(tempEmail)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              ...KIRA_BTN_BLUE,
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 12px',
        }}
      >
        Inbox ({inbox.length})
      </h3>
      <div style={{ ...KIRA_CARD, overflow: 'hidden' }}>
        {inbox.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: 13,
            }}
          >
            No messages yet. Waiting for emails…
          </div>
        ) : (
          inbox.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderBottom:
                  i < inbox.length - 1
                    ? '1px solid rgba(17,24,39,0.05)'
                    : 'none',
                cursor: 'pointer',
              }}
            >
              <Mail size={18} color="#6366f1" />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111827',
                    margin: '0 0 2px',
                  }}
                >
                  {m.subject}
                </p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                  {m.from}
                </p>
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{m.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function MTWorkflows() {
  const flows = [
    {
      name: 'Auto-Reply: Support Emails',
      trigger: 'New Inbox Email',
      status: 'Active',
      runs: 1240,
    },
    {
      name: 'Lead Nurture Sequence',
      trigger: 'New Contact',
      status: 'Active',
      runs: 84,
    },
    {
      name: 'Invoice Follow-up',
      trigger: 'Tag: Finance',
      status: 'Paused',
      runs: 33,
    },
    {
      name: 'Onboarding Welcome Series',
      trigger: 'New Customer',
      status: 'Draft',
      runs: 0,
    },
  ]
  const statusColor: Record<string, string> = {
    Active: '#22c55e',
    Paused: '#f59e0b',
    Draft: '#9ca3af',
  }
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Workflows
        </h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            ...KIRA_BTN_BLUE,
          }}
        >
          <Plus size={14} /> New Workflow
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {flows.map((f, i) => (
          <div
            key={i}
            style={{
              ...KIRA_CARD,
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
                borderRadius: 14,
                background: '#6366f112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap size={20} color="#6366f1" />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 3px',
                }}
              >
                {f.name}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                Trigger: {f.trigger}
              </p>
            </div>
            <div
              style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: statusColor[f.status] + '18',
                  color: statusColor[f.status],
                  fontWeight: 600,
                }}
              >
                {f.status}
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>
                {f.runs.toLocaleString()} runs
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MTCampaigns() {
  const campaigns = [
    {
      name: 'Q4 Holiday Newsletter',
      type: 'Email Blast',
      sent: 4200,
      openRate: '42%',
      status: 'Sent',
    },
    {
      name: 'Product Launch Announcement',
      type: 'Sequence',
      sent: 1800,
      openRate: '38%',
      status: 'Sent',
    },
    {
      name: 'Re-engagement Series',
      type: 'Drip',
      sent: 0,
      openRate: '-',
      status: 'Scheduled',
    },
    {
      name: 'Black Friday Promo',
      type: 'Email Blast',
      sent: 0,
      openRate: '-',
      status: 'Draft',
    },
  ]
  const statusColor: Record<string, string> = {
    Sent: '#22c55e',
    Scheduled: '#3b82f6',
    Draft: '#9ca3af',
  }
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: '#111827', margin: 0 }}
        >
          Campaigns
        </h2>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 12,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            ...KIRA_BTN_BLUE,
          }}
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {campaigns.map((c, i) => (
          <div
            key={i}
            style={{
              ...KIRA_CARD,
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
                borderRadius: 14,
                background: '#3b82f612',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={20} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 3px',
                }}
              >
                {c.name}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                {c.type}
              </p>
            </div>
            <div
              style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: statusColor[c.status] + '18',
                  color: statusColor[c.status],
                  fontWeight: 600,
                }}
              >
                {c.status}
              </span>
              {c.sent > 0 && (
                <span style={{ fontSize: 12, color: '#696D7D' }}>
                  {c.sent.toLocaleString()} sent · {c.openRate} open
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MTAnalytics() {
  const metrics = [
    {
      label: 'Total Emails Sent',
      value: '6,042',
      icon: Send,
      color: '#3b82f6',
      trend: '+18%',
    },
    {
      label: 'Avg Open Rate',
      value: '40.2%',
      icon: TrendingUp,
      color: '#22c55e',
      trend: '+3.1%',
    },
    {
      label: 'Avg Click Rate',
      value: '12.4%',
      icon: BarChart2,
      color: '#6366f1',
      trend: '+0.9%',
    },
    {
      label: 'Unsubscribes',
      value: '34',
      icon: AlertCircle,
      color: '#f87171',
      trend: '-2',
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 20px',
        }}
      >
        Analytics
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <div
              key={i}
              style={{
                ...KIRA_CARD,
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: -16,
                  right: -16,
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: m.color,
                  opacity: 0.08,
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: m.color + '18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Icon size={18} color={m.color} />
              </div>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 2px',
                }}
              >
                {m.value}
              </p>
              <p style={{ fontSize: 12, color: '#696D7D', margin: '0 0 8px' }}>
                {m.label}
              </p>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: m.trend.startsWith('-') ? '#f87171' : '#22c55e',
                  background: m.trend.startsWith('-')
                    ? '#f8717118'
                    : '#22c55e18',
                  padding: '2px 8px',
                  borderRadius: 20,
                }}
              >
                {m.trend} vs last month
              </span>
            </div>
          )
        })}
      </div>
      <div
        style={{
          ...KIRA_CARD,
          padding: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: 13,
        }}
      >
        <BarChart2
          size={40}
          style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }}
          color="#6366f1"
        />
        <p style={{ margin: 0 }}>
          Detailed charts coming soon. Connect your email account to see full
          analytics.
        </p>
      </div>
    </div>
  )
}

function MTActivity() {
  return <ActivityLogView />
}

function MTHelp() {
  return <HelpCentreView />
}

function MTSettings() {
  return (
    <div style={{ padding: 24 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 20px',
        }}
      >
        Settings
      </h2>
      {[
        {
          label: 'Email Accounts',
          desc: 'Connect and manage IMAP/SMTP accounts',
          icon: Mail,
        },
        {
          label: 'AI Configuration',
          desc: 'Train and configure AI response behavior',
          icon: Sparkles,
        },
        {
          label: 'Notifications',
          desc: 'Manage notification preferences',
          icon: Bell,
        },
        {
          label: 'Team & Access',
          desc: 'Invite team members and manage roles',
          icon: Users,
        },
        {
          label: 'Billing & Plan',
          desc: 'Manage your subscription and billing',
          icon: Wallet,
        },
      ].map((item, i) => {
        const Icon = item.icon
        return (
          <div
            key={i}
            style={{
              ...KIRA_CARD,
              padding: '18px 22px',
              marginBottom: 12,
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
                borderRadius: 14,
                background: '#6366f112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={20} color="#6366f1" />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 2px',
                }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                {item.desc}
              </p>
            </div>
            <ChevronRight size={16} color="#9ca3af" />
          </div>
        )
      })}
    </div>
  )
}

// ─── Kira Full View (wraps EmailAgent + sub-nav + sub-views) ──────────────

function KiraView() {
  const [activeTab, setActiveTab] = useState<KiraTab>('mt-inbox')

  const KiraNavItems: {
    id: KiraTab
    label: string
    Icon: React.ComponentType<any>
    section?: string
    isSubItem?: boolean
  }[] = [
    { id: 'mt-dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'mt-inbox', label: 'Inbox', Icon: Inbox },
    { id: 'mt-inbox-starred', label: 'Starred', Icon: Star, isSubItem: true },
    { id: 'mt-inbox-sent', label: 'Sent', Icon: Send, isSubItem: true },
    { id: 'mt-inbox-drafts', label: 'Drafts', Icon: FileText, isSubItem: true },
    { id: 'mt-inbox-spam', label: 'Spam', Icon: AlertCircle, isSubItem: true },
    { id: 'mt-inbox-trash', label: 'Trash', Icon: Trash2, isSubItem: true },
    { id: 'mt-contacts', label: 'Contacts', Icon: Users },
    { id: 'mt-deals', label: 'Deals', Icon: Heart },
    { id: 'mt-knowledge', label: 'Knowledge Base', Icon: BookOpen },
    { id: 'mt-tempmail', label: 'Temp Mail', Icon: AtSign },
    { id: 'mt-workflows', label: 'Workflows', Icon: Code },
    { id: 'mt-campaigns', label: 'Campaigns', Icon: Send },
    { id: 'mt-analytics', label: 'Analytics', Icon: BarChart2 },
    { id: 'mt-activity', label: 'Activity', Icon: Clock },
    { id: 'mt-help', label: 'Help Center', Icon: HelpCircle },
    // section
    { id: 'mt-settings', label: 'Settings', Icon: Sliders },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mt-dashboard':
        return <MTDashboard />
      case 'mt-inbox':
      case 'mt-inbox-starred':
      case 'mt-inbox-sent':
      case 'mt-inbox-drafts':
      case 'mt-inbox-spam':
      case 'mt-inbox-trash':
        return <EmailAgent />
      case 'mt-contacts':
        return <MTContacts />
      case 'mt-deals':
        return <MTDeals />
      case 'mt-knowledge':
        return <MTKnowledgeBase />
      case 'mt-tempmail':
        return <MTTempMail />
      case 'mt-workflows':
        return <MTWorkflows />
      case 'mt-campaigns':
        return <MTCampaigns />
      case 'mt-analytics':
        return <MTAnalytics />
      case 'mt-activity':
        return <MTActivity />
      case 'mt-help':
        return <MTHelp />
      case 'mt-settings':
        return <MTSettings />
      default:
        return <EmailAgent />
    }
  }

  const settingsTabId: KiraTab = 'mt-settings'
  const helpTabId: KiraTab = 'mt-help'
  const mainItems = KiraNavItems.filter(
    (i) => i.id !== settingsTabId && i.id !== helpTabId,
  )
  const helpItem = KiraNavItems.find((i) => i.id === helpTabId)!

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflow: 'hidden',
        background: KIRA_BG,
        position: 'relative',
      }}
    >
      {/* Top-right gradient blobs — same as Home/BeedAI */}
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

      {/* Kira inner sidebar */}
      <div
        style={{
          width: 210,
          minWidth: 210,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 10px',
          gap: 2,
          position: 'relative',
          zIndex: 1,
          borderRight: '1px solid rgba(17,24,39,0.08)',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Branding row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px 14px',
            borderBottom: '1px solid rgba(17,24,39,0.07)',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              ...KIRA_BTN_BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mail size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
            Kira
          </span>
        </div>

        {/* Main nav items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {mainItems
            .filter((item) => {
              if (!item.isSubItem) return true
              // Only show inbox sub-items when an inbox tab is active
              const inboxActive =
                activeTab === 'mt-inbox' ||
                activeTab === 'mt-inbox-starred' ||
                activeTab === 'mt-inbox-sent' ||
                activeTab === 'mt-inbox-drafts' ||
                activeTab === 'mt-inbox-spam' ||
                activeTab === 'mt-inbox-trash'
              return inboxActive
            })
            .map((item) => {
              const Icon = item.Icon
              const active = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: item.isSubItem ? '7px 12px 7px 32px' : '10px 12px',
                    borderRadius: 12,
                    background: active ? KIRA_ACTIVE_BG : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: active
                      ? '#4f46e5'
                      : item.isSubItem
                        ? '#9ca3af'
                        : '#696D7D',
                    fontSize: item.isSubItem ? 12 : 13,
                    fontWeight: active ? 600 : 400,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.15s',
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    textAlign: 'left',
                    width: '100%',
                    marginBottom: 2,
                  }}
                >
                  {active && <GlowBlobs side="right" />}
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
                    {item.label}
                  </span>
                </button>
              )
            })}
        </div>

        {/* Help divider at bottom */}
        <div
          style={{ borderTop: '1px solid rgba(17,24,39,0.07)', paddingTop: 8 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '4px 12px 6px',
            }}
          >
            Help
          </div>
          {/* Help Centre */}
          <button
            onClick={() => setActiveTab(helpItem.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background:
                activeTab === helpItem.id ? KIRA_ACTIVE_BG : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === helpItem.id ? '#4f46e5' : '#696D7D',
              fontSize: 13,
              fontWeight: activeTab === helpItem.id ? 600 : 400,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.15s',
              fontFamily: "'Outfit', system-ui, sans-serif",
              textAlign: 'left',
              width: '100%',
            }}
          >
            {activeTab === helpItem.id && <GlowBlobs side="right" />}
            <HelpCircle
              size={15}
              style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Help Center</span>
          </button>
        </div>
      </div>

      {/* Tab content pane */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* For the inbox tab, render the full EmailAgent (has its own header). For all others, render a shared header + content */}
        {activeTab === 'mt-inbox' ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {renderTabContent()}
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {renderTabContent()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ==================== VIEW COMPONENTS ====================

function DashboardView({ setView }: { setView: (view: ViewType) => void }) {
  const quickActions = [
    { label: 'New\nWorkflow', icon: Workflow, view: 'n8n' as ViewType },
    {
      label: 'Whatsapp Telegram Connect',
      icon: MessageCircle,
      view: 'connect' as ViewType,
    },
    { label: 'Homework\nHelp', icon: BookOpen, view: 'homework' as ViewType },

    { label: 'Write\nArticle', icon: PenTool, view: 'writer' as ViewType },
    { label: 'Create a\nMeal Plan', icon: ChefHat, view: 'meal' as ViewType },
    { label: 'Email\nAgent', icon: Mail, view: 'email' as ViewType },
  ]

  const recentActivity = [
    {
      action: 'Workflow completed',
      detail: 'Customer onboarding automation',
      time: '2m ago',
      icon: CheckCircle2,
    },
    {
      action: 'Email replied',
      detail: 'Replied to support@company.com',
      time: '5m ago',
      icon: Mail,
    },
    {
      action: 'Image generated',
      detail: 'Marketing banner for Q1 campaign',
      time: '12m ago',
      icon: ImageIcon,
    },
  ]

  const files = [
    { name: 'Documents', size: '10 GB', color: '#F5A623' },
    { name: 'Images & Videos', size: '5 GB', color: '#F5A623' },
    { name: 'Videos & Audio', size: '8 GB', color: '#F5A623' },
  ]

  return (
    <ScrollArea className="h-full max-w-[1644px]">
      <div
        className="w-full min-h-full"
        style={{
          background: 'url("/MainBG.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat',
        }}
      >
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
              <Button
                variant="outline"
                className="w-[159px] h-[50px] gap-[10px] px-[20px] bg-white border border-[#111827]/10 text-black rounded-[14px] text-[15px] font-medium w-[140px] h-[45px] shadow-md transition-shadow"
              >
                <img
                  src="/ActivityLog.png"
                  alt=""
                  className="w-[20px] h-[20px]"
                />
                Activity Log
              </Button>
            </div>
            <div className="w-[1px] h-[30px] border-l border-[#111827]/10"></div>
            <div className="flex items-center justify-between gap-[15px]">
              <div className="flex items-center justify-between gap-[10px]">
                <button
                  onClick={() => setView('notifications')}
                  className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all relative"
                >
                  <img
                    src="/bell.png"
                    alt="Notifications"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
                </button>
                <button
                  onClick={() => setView('settings')}
                  className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                >
                  <img
                    src="/setting.png"
                    alt="Settings"
                    className="w-[24px] h-[24px]"
                  />
                </button>
              </div>
              <div
                className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                onClick={() => setView('profile')}
              >
                <img
                  src="/profile.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 px-5 mb-5">
          <div className="flex flex-col gap-5 w-[100%]">
            {/* ── Stats Row ── */}
            <div>
              <div className="bg-white w-full max-w-[1582px] mx-auto min-h-[211px] xl2:min-h-[245px] rounded-[30px] border border-gray-100 shadow-sm overflow-hidden p-[20px]">
                <div className="grid grid-cols-4 gap-[10px] xl2:gap-[20px] cards-container">
                  {/* Weather Card */}
                  <div className="p-3 relative overflow-hidden rounded-[26px] bg-[#F7F8F8] max-w-[292px] min-h-[105px]">
                    <img
                      src="/Maskgroup.png"
                      alt="Weather Background"
                      className="absolute inset-0 w-full h-full object-cover rounded-[26px]"
                    />
                    <div className="relative z-10 flex items-start justify-between">
                      <p className="text-[#171717] text-[20px] xl2:text-[24px] xl2:font-medium">
                        Jan 20 2026, <br /> New York
                      </p>
                      <p className="text-[#171717] text-[25px] xl2:text-[29px] font-medium">
                        28°C
                      </p>
                    </div>
                  </div>
                  {[
                    {
                      value: '12',
                      change: '+3 today',
                      label: 'Active Workflows',
                      svg: 'ActiveWorkflows.png',
                    },
                    {
                      value: '48',
                      change: '+12 today',
                      label: 'Messages Today',
                      svg: 'MessagesToday.png',
                    },
                    {
                      value: '156',
                      change: '+24 today',
                      label: 'Emails Processed',
                      svg: 'EmailsProcessed.png',
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex-1 flex items-start justify-center rounded-[26px] bg-[#F7F8F8] justify-between max-w-[292px] w-full min-h-[170px] xl2:min-h-[204px] p-[18px] xlg:p-[25px]"
                    >
                      <div className="flex-1 flex flex-col justify-between w-full max-w-[242px] mx-auto h-full">
                        <div className="flex items-start justify-between w-full h-full">
                          <div className="max-w-[160px] min-h-[131px] h-full flex flex-col items-start justify-between">
                            <div className="flex gap-[10px] flex-col">
                              <p className="text-[28px] xl2:text-[34px] font-medium text-black">
                                {stat.value}
                              </p>
                              <div className="bg-[#4F46E5]/10 py-[4px] rounded-[40px] text-center px-[8px] flex items-center justify-center w-content xl2:w-[75px] h-[20px] xl2:h-[25px]">
                                <p className="text-[10px] xl2:text-[12px] text-[#163BDE] font-medium text-center">
                                  {stat.change}
                                </p>
                              </div>
                            </div>
                            <p className="text-[13px] xl2:text-[16px] font-regular text-black">
                              {stat.label}
                            </p>
                          </div>
                          <div className="w-[45px] xl2:w-[60px] h-[45px] xl2:h-[60px] rounded-[16px] flex items-center justify-center flex-shrink-0 bg-white">
                            <img
                              src={`/${stat.svg}`}
                              alt={stat.label}
                              className="w-[18px] xl2:w-[24px] h-[18px] xl2:h-[24px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Quick Actions ── */}
            <div>
              <div className="w-full max-w-[1583px] min-h-[254px] xl2:min-h-[290px] mx-auto bg-white rounded-[30px] border border-gray-100 shadow-sm p-[25px]">
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="gap-[8px] flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="w-[36px] min-h-[26px] bg-[#F3F4F6] rounded-[15px] flex items-center justify-center">
                        <img
                          src="/QuickActions.jpg"
                          alt="Quick Actions"
                          className="w-[30px] h-[30px]"
                        />
                      </div>
                      <h2 className="text-[20px] font-medium text-black">
                        Quick Actions
                      </h2>
                    </div>
                    <p className="text-[14px] text-[#696D7D]">
                      Launch your most used features instantly
                    </p>
                  </div>
                  <div className="flex items-center gap-[15px]">
                    <div className="w-[40px] h-[40px] rounded-[14px] bg-[#F3F4F6] flex items-center justify-center">
                      <ChevronLeft className="w-[18px] h-[18px] text-gray-400" />
                    </div>
                    <div className="w-[40px] h-[40px] rounded-[14px] bg-[#F3F4F6] flex items-center justify-center">
                      <ChevronRight className="w-[18px] h-[18px] text-gray-900" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {quickActions.map((action, i) => {
                    const svgFiles = [
                      '/NewWordflow.png',
                      '/WhatsappTelegramConnect.png',
                      '/GenerateImage.png',
                      '/WriteArticle.png',
                      '/Clippathgroup.png',
                      '/EmailAgents.png',
                    ]
                    const currentSvg = svgFiles[i % svgFiles.length]
                    return (
                      <button
                        key={i}
                        onClick={() => setView(action.view)}
                        className="relative flex flex-col items-start p-3 xl2:p-4 rounded-[15px] xl2:rounded-[26px] bg-[#F3F4F6] transition-all group max-w-[152px] min-h-[130px] xl2:min-h-[164px]"
                      >
                        <div
                          className="absolute top-0 right-0 z-10 w-[30px] h-[30px] xl2:w-[44px] xl2:h-[44px]"
                          style={{
                            backgroundColor: 'white',
                            borderBottomLeftRadius: '44px',
                            borderTopRightRadius: '22px',
                          }}
                        />
                        <span
                          className="absolute z-20 text-gray-400"
                          style={{ top: '6px', right: '6px', fontSize: '12px' }}
                        >
                          <img
                            src="/toprightarrow.png"
                            alt={action.label}
                            className="w-[14px] h-[14px] xl2:w-[18px] xl2:h-[18px]"
                          />
                        </span>
                        <div className="flex flex-col items-stretch justify-between w-full h-full">
                          <div className="w-[40px] h-[40px] xl2:w-[46px] xl2:h-[46px] rounded-full bg-gray-900 flex items-center justify-center z-10">
                            <img
                              src={currentSvg}
                              alt={action.label}
                              className="w-[20px] h-[20px]"
                            />
                          </div>
                          <span className="text-[13px] xl2:text-[16px] font-normal text-black text-left leading-tight mb-2">
                            {action.label}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white w-fit max-w-[447px] h-[497px] xl2:h-[561px] items-stretch p-[25px] rounded-[30px] flex flex-col gap-[25px] cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]"
onClick={() => setView('brain')}

          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[36px] h-[26px] bg-[#F3F4F6] rounded-[15px] flex items-center justify-center">
                    <img
                      src="/RecentActivity.png"
                      alt="Quick Actions"
                      className="w-[24px] h-[24px]"
                    />
                  </div>
                  <h3 className="text-[20px] font-medium text-black">
                    The Brain
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateTo('brain')
                  }}
                  className="transition-transform hover:translate-x-0.5 hover:-translate-y-0.5"
                >
                  <img
                    src="/BrainArrow.png"
                    alt="Go to My Brain"
                    className="w-[24px] h-[24px]"
                  />
                </button>
              </div>
              <p className="text-[14px] text-[#696D7D] mt-2">
                Where Kira Learns and understand you
              </p>
            </div>
            <div className="w-[347px] xl2:w-[400px] h-[367px] xl2:h-[435px] rounded-[26px] overflow-hidden">
              <img
                src="/Blackglobe.png"
                alt="Knowledge Graph"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        {/* ═══ NEW FIGMA SECTION ═══ */}
        <div className="px-5 pb-3">
          <div
            style={{
              width: '100%',
              maxWidth: '1583px',
              margin: '0 auto 1rem',
              background: '#ffffff',
              borderRadius: '30px',
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              padding: '19px',
              boxSizing: 'border-box',
              display: 'grid',
              gridTemplateColumns: '25fr 28fr 25fr 19fr',
              gap: 14,
              height: 376,
            }}
          >
            {/* ══ 1. SMART CALENDAR ══ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#111827',
                  margin: '0 0 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                Smart Calendar
              </p>
              <div
                style={{
                  padding: '8px',
                  flex: 1,
                  borderRadius: 20,
                  border: '1px solid rgba(17,24,39,0.07)',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  minHeight: 0,
                }}
              >
                {/* Top controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    flexShrink: 0,
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      background: '#f3f4f6',
                      borderRadius: 20,
                      padding: '3px 4px',
                      flexShrink: 0,
                    }}
                  >
                    {['M', 'W'].map((l) => (
                      <span
                        key={l}
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: '#9ca3af',
                          padding: '3px 7px',
                          borderRadius: 14,
                          cursor: 'pointer',
                        }}
                      >
                        {l}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 14,
                        background: '#1f2937',
                        cursor: 'pointer',
                      }}
                    >
                      D
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      overflow: 'hidden',
                      flexShrink: 1,
                      minWidth: 0,
                    }}
                  >
                    <ChevronLeft
                      size={12}
                      color="#9ca3af"
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Thursday April 2026
                    </span>
                    <ChevronRight
                      size={12}
                      color="#9ca3af"
                      style={{ cursor: 'pointer', flexShrink: 0 }}
                    />
                  </div>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      padding: '4px 9px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#E7EBFB',
                      color: '#163BDE',
                      fontSize: 10,
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={10} /> New Event
                  </button>
                </div>
                {/* Calendar image — padded to match top bar alignment, scales proportionally */}
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                    padding: '0 8px 8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/Frame_2087327983.png"
                    alt="Calendar"
                    style={{
  width: '100%',
  display: 'block',
  height: '260px',
}}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ══ 2. CALL LOGS ══ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#111827',
                  margin: '0 0 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                Call Logs
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  minHeight: 0,
                }}
              >
                {[
                  {
                    tags: [
                      {
                        label: 'Completed',
                        color: '#22c55e',
                        bg: 'rgba(34,197,94,0.1)',
                      },

                      {
                        label: 'Hot',
                        color: '#ef4444',
                        bg: 'rgba(239,68,68,0.1)',
                      },
                    ],
                  },
                  {
                    tags: [
                      {
                        label: 'Completed',
                        color: '#22c55e',
                        bg: 'rgba(34,197,94,0.1)',
                      },
                      {
                        label: 'Neutral',
                        color: '#6b7280',
                        bg: 'rgba(107,114,128,0.1)',
                      },
                    ],
                  },
                ].map((call, ci) => (
                  <div
                    key={ci}
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      background: '#fff',
                      border: '1px solid rgba(17,24,39,0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'row',
                      minHeight: 0,
                    }}
                  >
                    {/* Green LEFT accent bar */}
                    <div
                      style={{
                        width: 5,
                        flexShrink: 0,
                        background:
                          'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
                        borderRadius: '16px 0 0 16px',
                      }}
                    />

                    {/* Card content — fills full width */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                      }}
                    >
                      {/* TOP SECTION */}
                      <div
                        style={{
                          padding: '10px 12px 8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          flex: '1 0 auto',
                          paddingBottom: 0,
                        }}
                      >
                        {/* Row 1: Avatar + Name + Tags */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            width: '100%',
                          }}
                        >
                          <img
                            src="/Frame_40.png"
                            alt="Call"
                            style={{
                              transform: 'translateY(8px)',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display =
                                'none'
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#111827',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Sarah Johnson
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 500,
                              color: '#6366f1',
                              background: 'rgba(99,102,241,0.08)',
                              padding: '2px 8px',
                              borderRadius: 20,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ElevenLabs
                          </span>
                          {call.tags.map((t, ti) => (
                            <span
                              key={ti}
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: t.color,
                                background: t.bg,
                                padding: '2px 8px',
                                borderRadius: 20,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t.label}
                            </span>
                          ))}
                        </div>
                        {/* Row 2: Phone | Campaign | Agent */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: 11,
                            color: '#6b7280',
                            whiteSpace: 'nowrap',
                            paddingLeft: 36,
                            width: '100%',
                          }}
                        >
                          +1 (555) 123-4567
                          <span style={{ color: '#d1d5db', margin: '0 5px' }}>
                            |
                          </span>
                          <MapPin
                            size={10}
                            color="#9ca3af"
                            style={{ flexShrink: 0, marginRight: 2 }}
                          />
                          Q4 Lead Drive
                          <span style={{ color: '#d1d5db', margin: '0 5px' }}>
                            |
                          </span>
                          <Sparkles
                            size={10}
                            color="#9ca3af"
                            style={{ flexShrink: 0, marginRight: 2 }}
                          />
                          Sales Agent Pro
                        </div>
                        {/* Row 3: Time | Date */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: 11,
                            color: '#6b7280',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            marginTop: '15px',
                          }}
                        >
                          <Clock
                            size={11}
                            color="#9ca3af"
                            style={{ flexShrink: 0, marginRight: 3 }}
                          />
                          <span>3:07</span>
                          <span style={{ color: '#d1d5db', margin: '0 5px' }}>
                            |
                          </span>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0, marginRight: 3 }}
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>2d ago</span>
                        </div>
                      </div>
                      {/* BOTTOM SECTION */}
                      <div
                        style={{
                          padding: '6px 12px 8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                          borderTop: '1px solid rgba(17,24,39,0.04)',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <p
                          style={{
                            fontSize: 11,
                            color: '#6b7280',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 4,
                            lineHeight: 1.3,
                            width: '100%',
                          }}
                        >
                          <Sparkles
                            size={18}
                            color="#818cf8"
                            style={{ flexShrink: 0, marginTop: 1 }}
                          />
                          Customer expressed strong interest in the premium plan
                          of Kira. Req...
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: 11,
                            color: '#6b7280',
                            whiteSpace: 'nowrap',
                            width: '100%',
                          }}
                        >
                          <Mic
                            size={11}
                            color="#6b7280"
                            style={{ flexShrink: 0, marginRight: 3 }}
                          />
                          Recording
                          <span style={{ color: '#d1d5db', margin: '0 6px' }}>
                            |
                          </span>
                          <FileText
                            size={11}
                            color="#6b7280"
                            style={{ flexShrink: 0, marginRight: 3 }}
                          />
                          Transcript
                          <span style={{ color: '#d1d5db', margin: '0 6px' }}>
                            |
                          </span>
                          <Sparkles
                            size={11}
                            color="#6b7280"
                            style={{ flexShrink: 0, marginRight: 3 }}
                          />
                          AI Analysis
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ 3. CREATE SOCIAL MEDIA POST ══ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: '#111827',
                  margin: '0 0 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                Create Social media post
              </p>
              <div
                style={{
                  flex: 1,
                  borderRadius: 20,
                  overflow: 'hidden',
                  minHeight: 0,
                }}
              >
                <img
                  src="/image-social.png"
                  alt="Create Social media post"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    display: 'block',
                  }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>

            {/* ══ 4. RIGHT CARDS ══ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: 26 }} />
              {[
                { label: 'Invitation', src: '/Frame_2087327989.png' },
                { label: 'Resume', src: '/Frame_2087327991.png' },
                { label: 'Doc', src: '/Frame_2087327992.png' },
                { label: 'Presentation', src: '/Frame_2087327993.png' },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                    minHeight: 0,
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 4px 16px rgba(0,0,0,0.10)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                      'none'
                  }}
                >
                  <img
                    src={card.src}
                    alt={card.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'fill',
                      display: 'block',
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ── Bottom Row: Recent Activity + Files ── */}
        <div className="px-5 pb-3">
          <div className="grid grid-cols-2 gap-[20px] w-full mx-auto max-w-[1582px] min-h-[382px]">
            <div className="max-w-[781px] min-h-[382px] bg-white rounded-[30px] border border-gray-100 shadow-sm p-[25px]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-[36px] h-[26px] bg-[#F3F4F6] rounded-[15px] flex items-center justify-center">
                    <img
                      src="/RecentActivity.png"
                      alt="Quick Actions"
                      className="w-[24px] h-[24px]"
                    />
                  </div>
                  <h3 className="text-[20px] font-medium text-black">
                    Recent Activity
                  </h3>
                </div>
                <button className="text-[14px] min-w-[79px] h-[37px] text-[#4F46E5] font-regular px-[15px] py-[8px] rounded-[30px] bg-[#4F46E5]/10">
                  View all
                </button>
              </div>
              <p className="text-[14px] text-[#696D7D] mb-4 mt-2">
                Latest actions from your AI agents
              </p>
              <div className="space-y-[11px]">
                {recentActivity.map((item, i) => {
                  const images = [
                    '/Workflowcompleted.png',
                    '/Emailreplied.png',
                    '/Imagegenerated.png',
                  ]
                  return (
                    <div
                      key={i}
                      className="min-h-[78px] max-w-[731px] w-full flex items-center gap-[10px] bg-[#F3F4F6] rounded-[20px] py-[8px] pl-[8px] pr-[15px]"
                    >
                      <div className="w-[61px] h-[61px] rounded-[16px] flex items-center justify-center flex-shrink-0 bg-white">
                        <img
                          src={images[i % images.length]}
                          alt={item.action}
                          className="w-[30px] h-[30px]"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[16px] font-medium text-black">
                          {item.action}
                        </p>
                        <p className="text-[14px] text-[#696D7D] font-regular flex-shrink-0">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-[14px] text-[#696D7D] font-regular flex-shrink-0">
                        {item.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="w-full max-w-[781px] min-h-[382px] bg-white rounded-[30px] border border-gray-100 shadow-sm p-[25px] pt-[30px]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-[36px] h-[26px] bg-[#F3F4F6] rounded-[15px] flex items-center justify-center">
                    <img
                      src="/FileContent.png"
                      alt="Quick Actions"
                      className="w-[24px] h-[24px]"
                    />
                  </div>
                  <h3 className="text-[20px] font-medium text-black">
                    Your Files & Contents
                  </h3>
                </div>
                <button className="text-[14px] min-w-[79px] h-[37px] text-[#4F46E5] font-regular px-[15px] py-[8px] rounded-[30px] bg-[#4F46E5]/10">
                  View all
                </button>
              </div>
              <p className="text-[14px] text-[#696D7D] mb-4 mt-2">
                One unified storage for productivity
              </p>
              <div className="grid grid-cols-3 gap-[16px]">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="bg-[#F3F4F6] rounded-[16px] p-2 flex flex-col items-center gap-2 w-full max-w-[233px] min-h-[255px]"
                  >
                    <div className="bg-white w-full rounded-[16px] h-[169px] flex items-center justify-center relative">
                      <div className="absolute self-end top-2 right-2">
                        <span className="text-[13px] font-regular px-[8px] py-[4px] rounded-full text-[#34C759] bg-[#34C759]/15 w-[54px] h-[24px]">
                          Active
                        </span>
                      </div>
                      <img
                        src="/file.png"
                        alt="Quick Actions"
                        className="w-[70px] h-[62px]"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[16px] font-medium text-black text-center">
                        {file.name}
                      </p>
                      <p className="text-[14px] text-[#696D7D] font-regular">
                        {file.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

// Stub views
function DocumentEditorView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Document Editor</h2>
    </div>
  )
}
function N8NView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Automation</h2>
    </div>
  )
}
function ConnectView() {
  const [copiedCode, setCopiedCode] = useState(false)
  const copyCode = () => {
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const platforms = [
    {
      id: 'imessage',
      name: 'iMessage',
      description: 'Chat with your agent via iMessage.',
      status: 'connected' as const,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#34C759] to-[#30D158] flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      ),
      connectButton: {
        label: 'Connect via iMessage',
        color: 'bg-[#007AFF] hover:bg-[#0051D5]',
      },
      qrOverlay: (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34C759] to-[#30D158] flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      ),
      details: {
        phone: '+14156326765',
        code: 'B44-4MPWCD8T',
        expires: 'Expires in 30 minutes',
      },
      howItWorks: [
        'Click the button below and iMessage will open with the activation code ready to send.',
        "Send the message and your agent is connected. That's it!",
      ],
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Chat with your agent via WhatsApp.',
      status: 'disconnected' as const,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
      ),
      connectButton: {
        label: 'Open WhatsApp',
        color: 'bg-[#25D366] hover:bg-[#128C7E]',
      },
      qrOverlay: (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-white" />
        </div>
      ),
      howItWorks: [
        'Click "Open WhatsApp" — this opens WhatsApp with a pre-filled activation code.',
        'Send the activation code to start the connection.',
        'Once connected, any message you send on WhatsApp will be handled by your agent.',
      ],
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Connect a Telegram bot to chat with your agent.',
      status: 'disconnected' as const,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0088CC] to-[#34B2F5] flex items-center justify-center">
          <Send className="w-5 h-5 text-white" />
        </div>
      ),
      connectButton: {
        label: 'Create Telegram Bot',
        color: 'bg-[#0088CC] hover:bg-[#006BA8]',
      },
      howItWorks: [
        'Users open your bot in Telegram and send /start to begin.',
        'Every text message they send is processed by your agent.',
        "The agent's response is sent back in the Telegram chat.",
      ],
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Connect with your agent via Discord.',
      status: 'disconnected' as const,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5865F2] to-[#4752C4] flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
      ),
      connectButton: {
        label: 'Share Link',
        color: 'bg-[#5865F2] hover:bg-[#4752C4]',
      },
      inviteLink: 'https://discord.gg/MKmzu7Qes',
      linkExpiry: 'Your invite link expires in 7 days. Edit invite link',
      howItWorks: [
        'Click the button below and Discord will open with the invite ready.',
        'Send the invite and your agent is connected to your server.',
      ],
    },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="w-full min-h-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[26px] font-semibold text-[#1a1a2e]">
              Connect
            </h1>
            <p className="text-[14px] text-gray-400 mt-0.5">
              Manage your messaging platform connections
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Connection
          </button>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-[1100px]">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="p-6 border bg-white/80 backdrop-blur-xl rounded-2xl border-gray-200/60"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {p.icon}
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1a1a2e]">
                      {p.name}
                    </h3>
                    <p className="text-[12px] text-gray-400">{p.description}</p>
                  </div>
                </div>
                {p.status === 'connected' && (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                )}
              </div>

              {/* Connect Section */}
              <div className="p-4 mb-4 bg-gray-50/70 rounded-xl">
                <p className="text-[13px] font-medium text-[#1a1a2e] mb-1">
                  {p.id === 'discord' ? 'Connect Discord' : `Connect ${p.name}`}
                </p>
                <p className="text-[12px] text-gray-400 mb-3">
                  {p.id === 'imessage' &&
                    'Click the button below and iMessage will open with the activation code ready to send.'}
                  {p.id === 'whatsapp' &&
                    "Click the button below to open WhatsApp and activate the connection. You'll receive an activation code to send to the agent's WhatsApp number."}
                  {p.id === 'telegram' &&
                    'Create a Telegram bot for your agent with one click. It will be set up and ready to chat automatically.'}
                  {p.id === 'discord' &&
                    'Link your Discord server or bot to enable real-time conversations with your agent.'}
                </p>

                {/* QR Code or Invite Link */}
                {p.id === 'imessage' && p.details && (
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src="/qrcode-connect.png"
                        alt="iMessage QR"
                        className="w-[120px] h-[120px] rounded-xl object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {p.qrOverlay}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Phone Number
                        </p>
                        <p className="text-[14px] font-semibold text-[#1a1a2e]">
                          {p.details.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Activation Code
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-[#1a1a2e] font-mono">
                            {p.details.code}
                          </p>
                          <button
                            onClick={copyCode}
                            className="p-1 transition-colors rounded-md hover:bg-gray-200"
                          >
                            {copiedCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {p.details.expires}
                      </p>
                    </div>
                  </div>
                )}

                {p.id === 'whatsapp' && (
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src="/qrcode-connect.png"
                        alt="WhatsApp QR"
                        className="w-[120px] h-[120px] rounded-xl object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {p.qrOverlay}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] text-gray-500 mb-3">
                        Scan the QR code with your phone to open the
                        conversation in WhatsApp.
                      </p>
                      <button
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-colors ${p.connectButton.color}`}
                      >
                        {p.connectButton.label}
                      </button>
                    </div>
                  </div>
                )}

                {p.id === 'telegram' && (
                  <button
                    className={`px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-colors ${p.connectButton.color}`}
                  >
                    {p.connectButton.label}
                  </button>
                )}

                {p.id === 'discord' && p.inviteLink && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl">
                      <input
                        type="text"
                        defaultValue={p.inviteLink}
                        className="flex-1 text-[13px] text-[#1a1a2e] bg-transparent outline-none"
                        readOnly
                      />
                      <button className="p-1 transition-colors rounded-md hover:bg-gray-100">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400">{p.linkExpiry}</p>
                    <button
                      className={`px-4 py-2 rounded-xl text-[13px] font-medium text-white transition-colors ${p.connectButton.color}`}
                    >
                      {p.connectButton.label}
                    </button>
                  </div>
                )}
              </div>

              {/* How It Works */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <p className="text-[13px] font-medium text-[#1a1a2e]">
                    How it works
                  </p>
                </div>
                <ol className="space-y-2">
                  {p.howItWorks.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-medium text-gray-500 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[12px] text-gray-500 leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

function WriterView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Writer</h2>
    </div>
  )
}
function APIIntegrationView() {
  return <IntegrationsHub />
}
function HistoryView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">History</h2>
    </div>
  )
}
function QRCodeView() {
  return <QRCodeGenerator />
}

function FilesView() {
  return <FilesManager />
}
function AgentsView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">My Agents</h2>
    </div>
  )
}

function PricingView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Pricing</h2>
    </div>
  )
}

// SettingsView component imported from './SettingsView.tsx'
function SlidesView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Slides</h2>
    </div>
  )
}
function SpreadsheetsView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Spreadsheets</h2>
    </div>
  )
}
function MusicView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Music</h2>
    </div>
  )
}
function PodcastView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Podcast</h2>
    </div>
  )
}
function VoiceCloneView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Voice Clone</h2>
    </div>
  )
}
function PhotoEditorView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Photo Editor</h2>
    </div>
  )
}
function FactCheckerView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Fact Checker</h2>
    </div>
  )
}
function PhoneCallView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">AI Phone Call</h2>
    </div>
  )
}
function ExtensionView() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Chrome Extension</h2>
    </div>
  )
}

// ==================== MAIN APP COMPONENT ====================

function App() {
  console.log('App rendering...')
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI

  // ── Signup gate ─────────────────────────────────────────────────────────
  const [showSignup, setShowSignup] = useState<boolean>(() => {
    if (!isElectron) return false
    return localStorage.getItem('kira_signed_up') !== 'true'
  })

  const handleSignupComplete = () => {
    localStorage.setItem('kira_signed_up', 'true')
    setShowSignup(false)
  }

  const [currentView, setCurrentView] = useState<ViewType>('dashboard')

  // ── SIDEBAR COLLAPSE LOGIC ────────────────────────────────────────────────
  // userCollapsed: what the user manually toggled via the hamburger button
  // sidebarCollapsed: derived — true if user collapsed it, OR if the active
  //   view has its own sidebar (so the main sidebar auto-hides to icons only)
  const [userCollapsed, setUserCollapsed] = useState(false)
  const sidebarCollapsed =
    userCollapsed || VIEWS_WITH_OWN_SIDEBAR.has(currentView)

  // Central navigation function — use this everywhere instead of setCurrentView directly
  const navigateTo = (view: ViewType) => {
    setCurrentView(view)
    // When leaving a view-with-own-sidebar back to a normal view,
    // the main sidebar re-expands automatically because sidebarCollapsed
    // is derived from currentView. No extra logic needed here.
  }

  const [darkMode] = useState(false)

  const homeItem = { id: 'dashboard', label: 'Home', icon: '/Home.png' }

  const automationItems = [
    { id: 'email', label: 'Email Agent', icon: Mail },
    { id: 'calls', label: 'Ai Call Agents', icon: '/CallAgent.png' },
    { id: 'connect', label: 'Whatsapp Telegram Connect', icon: '/Connect.png' },
    { id: 'jarvis', label: 'Kira AI', icon: '/MyWorkspace.png' },
    { id: 'api', label: 'API Integrations', icon: '/APIIntegration.png' },
  ]

  const contentItems = [
    {
      id: 'homework',
      label: 'Homework',
      icon: BookOpen, // or use BookOpen if you want a Lucide icon
    },
    { id: 'coder', label: 'Coder', icon: '/Coder.png' },
    { id: 'qrcode', label: 'QR Code Generator', icon: '/qrcode.png' },
  ]

  const productivityItems = [
    { id: 'meetings', label: 'Meetings', icon: '/Meetings.png' },
    { id: 'finance', label: 'Finance', icon: '/Finance.png' },
    { id: 'calendar', label: 'Smart Calendar', icon: '/SmartCalendar.png' },
    { id: 'meal', label: 'Meal Planner', icon: '/MealPlanner.png' },
    { id: 'travel', label: 'Travel Planner', icon: MapPin },
    { id: 'social', label: 'Social Media', icon: '/SocialMedia.png' },
    { id: 'chats', label: 'Chats', icon: MessageCircle },
  ]

  const resourceItems = [
    { id: 'brain', label: 'My Brain', icon: Brain },
    { id: 'files', label: 'My Files', icon: '/MyFile.png' },
    { id: 'workspace', label: 'My Workspace', icon: '/MyWorkspace.png' },
  ]

  const toolsItems = [{ id: 'history', label: 'History', icon: '/History.png' }]
  const otherItems = [
    { id: 'help', label: 'Help Center', icon: '/HelpCenter.png' },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView setView={navigateTo} />
      case 'chats':
        return <ChatHistoryView />
      case 'email':
        return <KiraView />
      case 'n8n':
        return <N8NView />
      case 'calls':
        return <CallsView />
      case 'connect':
        return <ConnectView />
      case 'jarvis':
        return <BeedAI />
      case 'homework':
        return <HomeworkView />
      case 'coder':
        return <CoderView />
      case 'api':
        return <IntegrationsHub />
      case 'meal':
        return <MealCraftView />
      case 'history':
        return <HistoryView />
      case 'calendar':
        return <CalendarView />

      case 'finance':
        return <FinanceView />
      case 'meetings':
        return <MeetingsView />
      case 'social':
        return <SocialMediaView />
      case 'qrcode':
        return <QRCodeView />
      case 'notifications':
        return <NotificationsView />
      case 'notifications2':
        return <NotificationsView />
      case 'files':
        return <FilesManager />
      case 'agents':
        return <AgentsView />
      case 'workspace':
        return <WorkspaceView />
      case 'pricing':
        return <PricingView />
      case 'help':
        return <HelpView />
      case 'settings':
        return <SettingsView />
      case 'profile':
        return <ProfileView />
      case 'brain':
        return <MyBrainView />
      case 'doceditor':
        return <DocumentEditorView />
      case 'slides':
        return <SlidesView />
      case 'spreadsheets':
        return <SpreadsheetsView />
      case 'music':
        return <MusicView />
      case 'podcast':
        return <PodcastView />
      case 'voiceclone':
        return <VoiceCloneView />
      case 'photoeditor':
        return <PhotoEditorView />
      case 'factchecker':
        return <FactCheckerView />
      case 'phonecall':
        return <PhoneCallView />
      case 'extension':
        return <ExtensionView />
      case 'travel':
        return <TravelPlaner />
      default:
        return <DashboardView setView={navigateTo} />
    }
  }

  // Helper to render sidebar nav button
  const SidebarBtn = ({
    item,
  }: {
    item: { id: string; label: string; icon: any }
  }) => {
    const active = currentView === item.id

   
    return (
      <Tooltip delayDuration={sidebarCollapsed ? 0 : 1000}>
        <TooltipTrigger asChild>
          <button
            onClick={() => navigateTo(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-[20px] py-[12px] rounded-xl text-[13px] text-[#696D7D] transition-all relative overflow-hidden ${active ? 'text-black' : 'text-gray-600 hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}
            style={
              active
                ? {
                    background:
                      'radial-gradient(circle, rgba(229,238,255,0.8) 0%, rgba(255,255,255,0.6) 60%, transparent 100%)',
                  }
                : {}
            }
          >
            {active && (
              <>
                <div
                  className="absolute w-[75px] h-[75px] rounded-full left-[194px] top-[-6px] opacity-80 blur-[24px]"
                  style={{ backgroundColor: '#22D3EE' }}
                />
                <div
                  className="absolute w-[80px] h-[80px] rounded-full left-[151px] top-[-29px] opacity-60 blur-[24px]"
                  style={{ backgroundColor: '#60A5FA' }}
                />
                <div
                  className="absolute w-[60px] h-[60px] rounded-full left-[105px] top-[-35px] blur-[15px]"
                  style={{ backgroundColor: '#A855F7' }}
                />
                <div
                  className="absolute w-[146px] h-[47px] rounded-full left-[-87px] top-[39px] blur-[15px]"
                  style={{ backgroundColor: '#A855F7' }}
                />
              </>
            )}
            {typeof item.icon === 'string' ? (
              <img
                src={item.icon}
                alt=""
                className="relative z-10 flex-shrink-0 w-4 h-4"
              />
            ) : typeof item.icon === 'function' ? (
              React.createElement(item.icon as React.ComponentType<any>, {
                className: 'w-4 h-4 flex-shrink-0 relative z-10',
              })
            ) : React.isValidElement(item.icon) ? (
              item.icon
            ) : (
              React.createElement(item.icon as React.ComponentType<any>, {
                className: 'w-4 h-4 flex-shrink-0 relative z-10',
              })
            )}
            {!sidebarCollapsed && (
              <span className="relative z-10 w-full font-medium text-left truncate">
                {item.label}
              </span>
            )}
          </button>
        </TooltipTrigger>
        {sidebarCollapsed && (
          <TooltipContent side="right">{item.label}</TooltipContent>
        )}
      </Tooltip>
    )
  }
if (showSignup) {
    return <SignUpPage onComplete={handleSignupComplete} />
  }

  return (

    
    <TooltipProvider>
      <div
        className={`bg-[#EEf1f6] flex h-screen w-full overflow-hidden ${darkMode ? 'dark' : ''}`}
      >
        {/* ── Sidebar ── */}
        <aside
          className={`dark:bg-gray-900 border-r border-[#111827]/10 dark:border-gray-800 flex flex-col transition-all duration-300 px-2 ${sidebarCollapsed ? 'w-20' : 'w-[16rem]'}`}
        >
          {/* Header */}
          <div
            className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div
              className={`flex items-center gap-3 ${sidebarCollapsed ? 'hidden' : ''}`}
            >
              <img
                src="/beeda-logo.png"
                alt="Beeda AI"
                className="object-contain h-[42px]"
              />
            </div>
            {/* Only show the toggle button when NOT on a view-with-own-sidebar */}
            {!VIEWS_WITH_OWN_SIDEBAR.has(currentView) && (
              <button
                onClick={() => setUserCollapsed(!userCollapsed)}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {sidebarCollapsed ? (
                  <Menu className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </button>
            )}
            {/* When on a view-with-own-sidebar, show logo centered in the collapsed rail */}
            {VIEWS_WITH_OWN_SIDEBAR.has(currentView) && sidebarCollapsed && (
              <img
                src="/beeda-logo.png"
                alt="Beeda AI"
                className="object-contain h-[28px]"
              />
            )}
          </div>

          <div className="flex-1 h-[calc(100vh-140px)] max-w-[277px] overflow-y-auto scrollbar-hide">
            <div className="max-w-[237px] mx-auto">
              {/* Home */}
              <nav className="space-y-1">
                <Tooltip delayDuration={sidebarCollapsed ? 0 : 1000}>onClick={(e) => { e.stopPropagation(); setView('brain') }}
                  <TooltipTrigger asChild> 


                    <button
                      onClick={() => navigateTo(homeItem.id as ViewType)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-black text-[13px] transition-all relative overflow-hidden ${currentView === homeItem.id ? 'text-black' : 'text-black hover:bg-gray-100'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                      style={
                        currentView === homeItem.id
                          ? {
                              background:
                                'radial-gradient(circle, rgba(229,238,255,0.8) 0%, rgba(255,255,255,0.6) 60%, transparent 100%)',
                            }
                          : {}
                      }
                    >
                      {currentView === homeItem.id && (
                        <>
                          <div
                            className="absolute w-[75px] h-[75px] rounded-full left-[194px] top-[-6px] opacity-80 blur-[24px]"
                            style={{ backgroundColor: '#22D3EE' }}
                          />
                          <div
                            className="absolute w-[80px] h-[80px] rounded-full left-[151px] top-[-29px] opacity-60 blur-[24px]"
                            style={{ backgroundColor: '#60A5FA' }}
                          />
                          <div
                            className="absolute w-[60px] h-[60px] rounded-full left-[105px] top-[-35px] blur-[15px]"
                            style={{ backgroundColor: '#A855F7' }}
                          />
                          <div
                            className="absolute w-[146px] h-[47px] rounded-full left-[-87px] top-[39px] blur-[15px]"
                            style={{ backgroundColor: '#A855F7' }}
                          />
                        </>
                      )}
                      <img
                        src="/Home.png"
                        alt=""
                        className="relative z-10 flex-shrink-0 w-4 h-4"
                      />
                      {!sidebarCollapsed && (
                        <span className="relative z-10 font-medium">
                          {homeItem.label}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">
                      {homeItem.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Automation & Integrations
                </div>
              )}
              <nav className="pt-4 space-y-1">
                {automationItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Content & Creation
                </div>
              )}
              <nav className="pt-4 space-y-[8px]">
                {contentItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Productivity & Planning
                </div>
              )}
              <nav className="pt-4 space-y-[8px]">
                {productivityItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Resources
                </div>
              )}
              <nav className="pt-4 space-y-[6px]">
                {resourceItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Tools
                </div>
              )}
              <nav className="pt-4 space-y-[6px]">
                {toolsItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-4 text-[13px] font-medium text-[#6E697D] uppercase text-left">
                  Others
                </div>
              )}
              <nav className="pt-4 space-y-[6px] pb-4">
                {otherItems.map((item) => (
                  <SidebarBtn key={item.id} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100" />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 via-transparent to-cyan-100/50" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-200/40 to-cyan-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-200/30 to-purple-200/20 rounded-full blur-[100px]" />
          <div className="relative z-10 h-full">{renderContent()}</div>

          {/* ═══ FLOATING AI ORB - ALWAYS LISTENING (all pages) ═══ */}
          <div className="fixed z-50 flex flex-col items-center gap-2 pointer-events-none bottom-6 right-6">
            {/* Listening label */}
            <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111827]/80 backdrop-blur-sm text-white text-[10px] font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
              <Mic className="w-3 h-3 text-emerald-400" />
              <span>Listening</span>
            </div>
            {/* Orb container */}
            <div
              className="relative cursor-pointer pointer-events-auto group"
              title="Kira is listening..."
            >
              {/* Wave pulse ring 1 - purple theme */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#7C3AED]/50 animate-wave-pulse"
                style={{
                  background:
                    'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
                }}
              />
              {/* Wave pulse ring 2 - indigo, staggered */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#4F46E5]/40 animate-wave-pulse-purple"
                style={{
                  background:
                    'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)',
                }}
              />
              {/* Soft ambient glow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#4F46E5]/15 to-[#7C3AED]/15 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              {/* The orb */}
              <div className="relative w-20 h-20 animate-float">
                <img
                  src="/orb.png"
                  alt="Kira AI Orb"
                  className="object-contain w-full h-full transition-transform duration-500 drop-shadow-2xl group-hover:scale-110"
                />
              </div>
              {/* Listening dot */}
              <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-md flex items-center justify-center z-10">
                <Mic className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

export default App
