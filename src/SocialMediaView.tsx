/**
 * SocialMediaView.tsx — Kira Light Design System Edition
 * Fully adapted to match Kira app's LIGHT visual language
 */

import React, { useState, useRef } from 'react'
import {
  Film,
  UploadCloud,
  Monitor,
  Smartphone,
  Wand2,
  LayoutDashboard,
  Users,
  Instagram,
  Music2,
  Megaphone,
  History,
  ImageIcon,
  Video,
  BarChart2,
  Bell,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Eye,
  Zap,
  TrendingUp,
  Sparkles,
  PlayCircle,
  Package,
  Clock,
  Download,
} from 'lucide-react'

// ─── Kira Design Tokens (LIGHT MODE) ─────────────────────────────────────────
const K = {
  mainBg: 'url("/MainBG.png") center right / cover no-repeat',
  sidebarBg: 'rgba(238,241,246,0.95)',
  cardBg: 'rgba(255,255,255,0.82)',
  cardBgStrong: 'rgba(255,255,255,0.92)',
  border: 'rgba(17,24,39,0.07)',
  borderMid: 'rgba(17,24,39,0.12)',
  text: '#111827',
  textSub: '#374151',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  btnBlue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  btnBlueShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
  btnViolet: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
  btnVioletShadow: 'inset 0 0 0 1px #c4b5fd, inset 0 1px 4px 2px #ede9fe',
  gradInstagram:
    'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
  gradTikTok: 'linear-gradient(135deg,#69C9D0 0%,#EE1D52 50%,#010101 100%)',
  gradGreen: 'linear-gradient(135deg,#10B981 0%,#059669 100%)',
  gradCyan: 'linear-gradient(135deg,#06B6D4 0%,#3B82F6 100%)',
  gradPrimary: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)',
  activeNavBg:
    'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  primary: '#6366F1',
} as const

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(243,244,246,0.8)',
  border: `1px solid rgba(17,24,39,0.12)`,
  borderRadius: 10,
  padding: '10px 14px',
  color: '#111827',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Outfit', system-ui, sans-serif",
}

// ─── Shared Primitives ─────────────────────────────────────────────────────
const KCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}> = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      background: K.cardBg,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: 20,
      border: `1px solid ${K.border}`,
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
  variant?: 'blue' | 'violet' | 'ghost' | 'instagram' | 'tiktok'
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
    instagram: { background: K.gradInstagram, color: '#fff' },
    tiktok: { background: K.gradTikTok, color: '#fff' },
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

const KBadge: React.FC<{ label: string; color?: string }> = ({
  label,
  color = K.success,
}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color,
      background: `${color}18`,
      border: `1px solid ${color}30`,
    }}
  >
    {label}
  </span>
)

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

// ─── Tab Pages ─────────────────────────────────────────────────────────────

function DashboardPage() {
  const stats = [
    {
      label: 'Influencers',
      value: '11',
      sub: '11 Active',
      icon: <Users size={20} />,
      grad: K.gradPrimary,
    },
    {
      label: 'Gallery',
      value: '4',
      sub: '0 generated',
      icon: <ImageIcon size={20} />,
      grad: K.gradCyan,
    },
    {
      label: 'Content Videos',
      value: '8',
      sub: '0 completed',
      icon: <PlayCircle size={20} />,
      grad: 'linear-gradient(135deg,#8B5CF6,#A855F7)',
    },
    {
      label: 'Showcases',
      value: '10',
      sub: '7 completed',
      icon: <Package size={20} />,
      grad: K.gradGreen,
    },
  ]
  const taskBreakdown = [
    { label: 'content_maker', count: 5, credits: 1000, max: 1750 },
    { label: 'Influencer Create', count: 9, credits: 900, max: 1750 },
    { label: 'Influencer Variation', count: 4, credits: 600, max: 1750 },
    {
      label: 'Influencer Import from Gallery',
      count: 3,
      credits: 0,
      max: 1750,
    },
    { label: 'Influencer Manual upload', count: 2, credits: 0, max: 1750 },
    { label: 'product_showcase_maker', count: 7, credits: 1750, max: 1750 },
  ]
  const recentInfluencers = [
    { name: 'Monika', time: '2 months ago', active: true },
    { name: 'Monika', time: '2 months ago', active: true },
    { name: 'Half girl', time: '2 months ago', active: true },
    { name: 'Business girl', time: '2 months ago', active: true },
  ]
  const recentActivity = [
    {
      type: 'product_showcase_maker',
      msg: 'product_content #19 completed successfully — video saved to tTg8G.mp4',
      time: '2 months ago',
      credits: 250,
      status: 'success',
    },
    {
      type: 'product_showcase_maker',
      msg: 'product_content #19 job submitted — taskId: a9710ce53a33ea902907ec64acaaff7c',
      time: '2 months ago',
      credits: 250,
      status: 'pending',
    },
    {
      type: 'product_showcase_maker',
      msg: 'product_content #18 job submitted — taskId: 488a8998a7196b1902013ea805d07a29',
      time: '2 months ago',
      credits: 250,
      status: 'pending',
    },
  ]

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {stats.map((s) => (
          <KCard
            key={s.label}
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                flexShrink: 0,
                background: s.grad,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: `0 4px 14px -4px rgba(0,0,0,0.25)`,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{ color: K.textMuted, fontSize: 12, fontWeight: 500 }}
              >
                {s.label}
              </div>
              <div
                style={{
                  color: K.text,
                  fontWeight: 800,
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: K.textLight, fontSize: 11 }}>{s.sub}</div>
            </div>
          </KCard>
        ))}
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}
      >
        <KCard style={{ padding: 22 }}>
          <div
            style={{
              color: K.textMuted,
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Your Plan
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: K.text, fontWeight: 700, fontSize: 20 }}>
              Trial
            </div>
            <KBadge label="Apr 28" color={K.warning} />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <span style={{ color: K.textMuted, fontSize: 13 }}>⊙ Credits</span>
            <span style={{ color: K.text, fontWeight: 600, fontSize: 13 }}>
              10,050 / 50
            </span>
          </div>
          <KProgress
            value={100}
            color={K.success}
            style={{ marginBottom: 12 }}
          />
          <div style={{ color: K.textLight, fontSize: 11 }}>
            ⏰ Renews Apr 28, 2027 · in a year
          </div>
        </KCard>
        <KCard style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <TrendingUp size={15} color="#6366F1" />
            <span style={{ color: K.text, fontWeight: 600, fontSize: 13 }}>
              Credits Spent (7d)
            </span>
          </div>
          <div style={{ color: K.textMuted, fontSize: 11, marginBottom: 20 }}>
            Successful tasks only
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 80,
              color: K.textLight,
              fontSize: 13,
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <BarChart2 size={28} color="rgba(99,102,241,0.2)" />
            No activity yet
          </div>
        </KCard>
        <KCard style={{ padding: 22 }}>
          <div
            style={{
              color: K.text,
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            Task Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {taskBreakdown.map((t) => (
              <div key={t.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      color: K.textSub,
                      fontSize: 11,
                      maxWidth: '60%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.label}
                  </span>
                  <span style={{ color: K.textLight, fontSize: 10 }}>
                    {t.count} · {t.credits.toLocaleString()} cr
                  </span>
                </div>
                <KProgress value={(t.credits / t.max) * 100} color="#6366F1" />
              </div>
            ))}
          </div>
        </KCard>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <KCard style={{ padding: 22 }}>
          <div
            style={{
              color: K.text,
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            Recent Influencers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentInfluencers.map((inf, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: K.gradPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                    }}
                  >
                    {inf.name[0]}
                  </div>
                  <div>
                    <div
                      style={{ color: K.text, fontSize: 13, fontWeight: 600 }}
                    >
                      {inf.name}
                    </div>
                    <div style={{ color: K.textLight, fontSize: 11 }}>
                      {inf.time}
                    </div>
                  </div>
                </div>
                {inf.active && <KBadge label="active" color={K.success} />}
              </div>
            ))}
          </div>
        </KCard>
        <KCard style={{ padding: 22 }}>
          <div
            style={{
              color: K.text,
              fontWeight: 600,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            Recent Activity
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <div style={{ marginTop: 2 }}>
                  {a.status === 'success' ? (
                    <CheckCircle2 size={16} color={K.success} />
                  ) : (
                    <AlertCircle size={16} color={K.warning} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#6366F1',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {a.type}
                  </div>
                  <div
                    style={{
                      color: K.textMuted,
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}
                  >
                    {a.msg}
                  </div>
                  <div
                    style={{ color: K.textLight, fontSize: 10, marginTop: 2 }}
                  >
                    {a.time}
                  </div>
                </div>
                <div
                  style={{
                    color: K.warning,
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⊙ {a.credits}
                </div>
              </div>
            ))}
          </div>
        </KCard>
      </div>
    </div>
  )
}

function InfluencersPage({ onOpenCreate: _onOpenCreate }: { onOpenCreate: () => void }) {
  const influencers = [
    {
      name: 'Monika',
      desc: 'This model is for my work which is related to xyz',
      active: true,
      grad: K.gradPrimary,
    },
    {
      name: 'Monika',
      desc: 'This model is for my work which is related to xyz',
      active: true,
      grad: 'linear-gradient(135deg,#EC4899,#8B5CF6)',
    },
    {
      name: 'Half girl',
      desc: 'A photorealistic young female influencer, 22–28 years old',
      active: true,
      grad: 'linear-gradient(135deg,#06B6D4,#6366F1)',
    },
    {
      name: 'Half girl',
      desc: 'A photorealistic young female influencer, 22–28 years old',
      active: true,
      grad: 'linear-gradient(135deg,#F97316,#EC4899)',
    },
    {
      name: 'Business girl',
      desc: 'Influencer in smart business',
      active: true,
      grad: K.gradGreen,
    },
    {
      name: 'Jewellery',
      desc: 'Model traditional',
      active: true,
      grad: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    },
    {
      name: 'African American',
      desc: 'Full length portrait, professional 27-year-old African American female influencer...',
      active: true,
      grad: 'linear-gradient(135deg,#7C3AED,#EC4899)',
    },
    {
      name: 'Asian women',
      desc: 'Asian women',
      active: true,
      grad: 'linear-gradient(135deg,#3B82F6,#06B6D4)',
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {influencers.map((inf, i) => (
          <div
            key={i}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              border: `1px solid ${K.border}`,
              aspectRatio: '3/4',
              background: inf.grad,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'scale(1.02)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 12px 40px rgba(99,102,241,0.3)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.18)',
              }}
            >
              <Users size={64} />
            </div>
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <KBadge label="Active" color={K.success} />
            </div>
            <button
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(0,0,0,0.45)',
                border: 'none',
                borderRadius: 7,
                padding: 6,
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Trash2 size={13} />
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  'linear-gradient(to top,rgba(0,0,0,0.75),transparent)',
                padding: '28px 12px 12px',
              }}
            >
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                {inf.name}
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  lineHeight: 1.4,
                  marginTop: 2,
                }}
              >
                {inf.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Create Influencer Dialog — CONVERTED TO LIGHT
export function CreateAICharacterDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [method, setMethod] = useState<'upload' | 'ai' | null>(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const steps = ['Creation Method', 'Character Details', 'Review & Create']

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }
  const dialogStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: `1px solid ${K.border}`,
    borderRadius: 20,
    width: 760,
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  }

  const Header = () => (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        padding: '20px 28px 0',
        borderBottom: `1px solid ${K.border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: K.btnBlue,
              boxShadow: K.btnBlueShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#fff',
            }}
          >
            <Plus size={20} />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 15 }}>
              Create AI Character — Step {step + 1} of 3
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 1 }}>
              {steps[step]}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(243,244,246,0.9)',
            border: `1px solid ${K.border}`,
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: K.textMuted,
          }}
        >
          <X size={16} />
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 20 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  background:
                    i < step
                      ? K.success
                      : i === step
                        ? K.btnBlue
                        : 'rgba(243,244,246,0.9)',
                  color: i < step ? '#fff' : i === step ? '#fff' : K.textLight,
                  border: i > step ? `2px solid ${K.border}` : 'none',
                  boxShadow: i === step ? K.btnBlueShadow : 'none',
                }}
              >
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  color:
                    i === step ? K.text : i < step ? K.textMuted : K.textLight,
                  fontWeight: i === step ? 600 : 400,
                }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: '0 14px',
                  background: i < step ? K.success : K.border,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  const Step0 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 28px' }}>
      <div
        style={{
          color: K.text,
          fontWeight: 700,
          fontSize: 17,
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        How would you like to create your AI character?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div
          onClick={() => setMethod('upload')}
          style={{
            borderRadius: 16,
            border:
              method === 'upload'
                ? '2px solid #6366F1'
                : `1px solid ${K.border}`,
            background:
              method === 'upload'
                ? 'rgba(99,102,241,0.06)'
                : 'rgba(255,255,255,0.6)',
            padding: '40px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            transition: 'all 0.2s',
          }}
        >
          {method === 'upload' && (
            <div style={{ position: 'absolute', top: 14, right: 14 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: K.success,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={13} color="#fff" />
              </div>
            </div>
          )}
          <UploadCloud size={44} color="#6366F1" />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: K.text,
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Upload Photo
            </div>
            <div style={{ color: K.textMuted, fontSize: 13, lineHeight: 1.6 }}>
              Use your own image to create a character. Best for real people or
              existing photos.
            </div>
          </div>
          <span
            style={{
              background: 'rgba(99,102,241,0.1)',
              borderRadius: 8,
              padding: '5px 14px',
              color: K.primary,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Quick &amp; Easy
          </span>
        </div>
        <div
          onClick={() => setMethod('ai')}
          style={{
            borderRadius: 16,
            border:
              method === 'ai' ? '2px solid #6366F1' : `1px solid ${K.border}`,
            background:
              method === 'ai'
                ? 'rgba(99,102,241,0.06)'
                : 'rgba(255,255,255,0.6)',
            padding: '40px 28px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            transition: 'all 0.2s',
          }}
        >
          {method === 'ai' && (
            <div style={{ position: 'absolute', top: 14, right: 14 }}>
              <Sparkles size={16} color={K.primary} />
            </div>
          )}
          <Sparkles size={44} color={K.warning} />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: K.text,
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              AI Generate
            </div>
            <div style={{ color: K.textMuted, fontSize: 13, lineHeight: 1.6 }}>
              Create a unique character using AI. Describe what you want and let
              AI bring it to life.
            </div>
          </div>
          <span
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 8,
              padding: '5px 14px',
              color: K.warning,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ✨ Powered by AI
          </span>
        </div>
      </div>
    </div>
  )

  const Step1 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
      {method === 'upload' && (
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              color: K.textMuted,
              fontSize: 12,
              fontWeight: 500,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Reference Photo
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) setUploadedPhoto(e.target.files[0].name)
            }}
          />
          {uploadedPhoto ? (
            <div
              style={{
                borderRadius: 10,
                border: `1px solid ${K.success}`,
                background: 'rgba(16,185,129,0.06)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CheckCircle2 size={18} color={K.success} />
              <span style={{ color: K.text, fontSize: 13 }}>
                {uploadedPhoto}
              </span>
              <button
                onClick={() => setUploadedPhoto(null)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: K.textLight,
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                borderRadius: 10,
                border: `2px dashed ${K.borderMid}`,
                background: 'rgba(243,244,246,0.5)',
                padding: '28px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <UploadCloud
                size={28}
                color={K.textLight}
                style={{ margin: '0 auto 8px', display: 'block' }}
              />
              <span style={{ color: K.textMuted, fontSize: 13 }}>
                Click to upload photo
              </span>
            </div>
          )}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            color: K.textMuted,
            fontSize: 12,
            fontWeight: 500,
            display: 'block',
            marginBottom: 8,
          }}
        >
          Character Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Character Name"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            color: K.textMuted,
            fontSize: 12,
            fontWeight: 500,
            display: 'block',
            marginBottom: 8,
          }}
        >
          Character Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          placeholder="Character Description"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
      {method === 'ai' && (
        <>
          <div
            style={{
              marginBottom: 16,
              background: 'rgba(243,244,246,0.6)',
              borderRadius: 12,
              border: `1px solid ${K.border}`,
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Sparkles size={15} color={K.primary} />
              <span style={{ color: K.primary, fontSize: 13, fontWeight: 600 }}>
                AI Generation Prompt
              </span>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={5}
              placeholder="Describe the character you want to generate in detail..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 12,
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ color: K.warning, fontSize: 13, fontWeight: 600 }}>
                Pro Tips for Better Results:
              </span>
            </div>
            {[
              'Include "Full body shot" or "Head to toe" for complete figure',
              'Specify age, build, height for accurate generation',
              'Describe clothing, pose, and background details',
              'Add "8K resolution, photorealistic" for quality',
              'Mention lighting: "studio lighting", "natural light", etc.',
            ].map((tip, i) => (
              <div
                key={i}
                style={{ color: K.textMuted, fontSize: 12, marginBottom: 4 }}
              >
                • {tip}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )

  const Step2 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '36px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.15)',
            border: `2px solid ${K.success}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Check size={26} color={K.success} />
        </div>
        <div style={{ color: K.text, fontWeight: 700, fontSize: 17 }}>
          Review Your Character
        </div>
        <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
          Please review the details before creating
        </div>
      </div>
      <div
        style={{
          background: 'rgba(243,244,246,0.6)',
          border: `1px solid ${K.border}`,
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        {[
          {
            label: 'Creation Method',
            value: method === 'upload' ? '⬆️ Photo Upload' : '✨ AI Generated',
          },
          { label: 'Character Name', value: name || '—' },
          { label: 'Character Description', value: desc || '—' },
          ...(method === 'ai'
            ? [{ label: 'AI Prompt', value: aiPrompt || '—' }]
            : []),
          ...(method === 'upload'
            ? [{ label: 'Photo', value: uploadedPhoto || '—' }]
            : []),
        ].map((row, i, arr) => (
          <div
            key={row.label}
            style={{
              padding: '14px 20px',
              borderBottom:
                i < arr.length - 1 ? `1px solid ${K.border}` : 'none',
            }}
          >
            <div
              style={{
                color: K.textMuted,
                fontSize: 11,
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                color: K.text,
                fontWeight: 600,
                fontSize: 14,
                fontFamily:
                  row.label === 'AI Prompt'
                    ? 'monospace'
                    : "'Outfit', system-ui, sans-serif",
                background:
                  row.label === 'AI Prompt'
                    ? 'rgba(243,244,246,0.8)'
                    : 'transparent',
                borderRadius: row.label === 'AI Prompt' ? 8 : 0,
                padding: row.label === 'AI Prompt' ? '8px 10px' : 0,
              }}
            >
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const Footer = () => (
    <div
      style={{
        borderTop: `1px solid ${K.border}`,
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.9)',
      }}
    >
      {step > 0 ? (
        <button
          onClick={() => setStep((s) => s - 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: K.textMuted,
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          <ChevronLeft size={15} /> Back
        </button>
      ) : (
        <div />
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(243,244,246,0.9)',
            border: `1px solid ${K.border}`,
            borderRadius: 10,
            padding: '9px 18px',
            color: K.textMuted,
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        {step < 2 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !method}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: K.btnBlue,
              boxShadow: K.btnBlueShadow,
              border: 'none',
              borderRadius: 10,
              padding: '9px 20px',
              color: '#fff',
              cursor: step === 0 && !method ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Outfit', system-ui, sans-serif",
              opacity: step === 0 && !method ? 0.45 : 1,
            }}
          >
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: K.btnBlue,
              boxShadow: K.btnBlueShadow,
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Outfit', system-ui, sans-serif",
              borderRadius: 10,
              padding: '9px 20px',
            }}
          >
            <Sparkles size={15} /> Generate Character
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <Header />
        {step === 0 && <Step0 />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        <Footer />
      </div>
    </div>
  )
}

function LinkInstagramPage() {
  return (
    <div
      style={{
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: K.gradInstagram,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(220,39,67,0.35)',
        }}
      >
        <Instagram size={36} color="#fff" />
      </div>
      <div
        style={{
          color: K.text,
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        No accounts connected yet
      </div>
      <div
        style={{
          color: K.textMuted,
          fontSize: 14,
          textAlign: 'center',
          maxWidth: 360,
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        Click "Add Account" to connect your Instagram Business account and start
        automating.
      </div>
      <KBtn variant="instagram">
        <Plus size={16} /> Add Account
      </KBtn>
    </div>
  )
}

function LinkTikTokPage() {
  return (
    <div
      style={{
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: K.gradTikTok,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 8px 32px rgba(238,29,82,0.3)',
        }}
      >
        <Music2 size={36} color="#fff" />
      </div>
      <div
        style={{
          color: K.text,
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 8,
        }}
      >
        No TikTok accounts connected yet
      </div>
      <div
        style={{
          color: K.textMuted,
          fontSize: 14,
          textAlign: 'center',
          maxWidth: 360,
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        Click "Add Account" to connect your TikTok account and start managing
        content.
      </div>
      <KBtn variant="tiktok">
        <Plus size={16} /> Add Account
      </KBtn>
    </div>
  )
}

function SocialPublishingPage() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | null>(null)
  const [caption, setCaption] = useState('')
  const [activeTab, setActiveTab] = useState<'gallery' | 'content'>('gallery')
  const [hashtags] = useState([
    '#aiinfluencer',
    '#automation',
    '#socialmedia',
    '#contentcreator',
  ])
  const steps = ['Select Media', 'Configure Post', 'Review & Publish']
  const tabs = [
    { key: 'gallery' as const, label: 'Gallery', count: 4 },
    { key: 'content' as const, label: 'Content', count: 8 },
  ]
  const mediaItems = [
    { id: 0, name: 'Monika', label: 'GALLERY', grad: K.gradPrimary },
    {
      id: 1,
      name: 'Half girl',
      label: 'GALLERY',
      grad: 'linear-gradient(135deg,#06B6D4,#6366F1)',
    },
    { id: 2, name: 'Business girl', label: 'GALLERY', grad: K.gradGreen },
    {
      id: 3,
      name: 'Jewellery',
      label: 'GALLERY',
      grad: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    },
  ]

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}
    >
      <KCard style={{ padding: '20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    background: i <= step ? K.btnBlue : 'rgba(243,244,246,0.9)',
                    boxShadow: i <= step ? K.btnBlueShadow : 'none',
                    color: i <= step ? '#fff' : K.textLight,
                    transition: 'all 0.3s',
                  }}
                >
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <div
                  style={{
                    color: i === step ? K.text : K.textMuted,
                    fontSize: 12,
                    fontWeight: i === step ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    margin: '-20px 12px 0',
                    background: i < step ? K.btnBlue : 'rgba(17,24,39,0.1)',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </KCard>

      {step === 0 && (
        <KCard>
          <div
            style={{
              padding: '16px 24px',
              background:
                'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.04))',
              borderBottom: `1px solid ${K.border}`,
              borderRadius: '20px 20px 0 0',
            }}
          >
            <div style={{ color: K.text, fontWeight: 700, fontSize: 14 }}>
              Select Media to Publish
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              Only successfully generated media is shown
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              borderBottom: `1px solid ${K.border}`,
              padding: '0 24px',
              gap: 4,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: activeTab === t.key ? '#6366F1' : K.textMuted,
                  borderBottom:
                    activeTab === t.key
                      ? '2px solid #6366F1'
                      : '2px solid transparent',
                  transition: 'all 0.2s',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 16,
              padding: 24,
            }}
          >
            {mediaItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '3/4',
                  cursor: 'pointer',
                  background: item.grad,
                  border:
                    selected === item.id
                      ? '3px solid #6366F1'
                      : `1px solid ${K.border}`,
                  transition: 'all 0.2s',
                  boxShadow:
                    selected === item.id
                      ? '0 0 20px rgba(99,102,241,0.4)'
                      : '0 2px 12px rgba(0,0,0,0.07)',
                }}
              >
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 5,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                {selected === item.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: '#6366F1',
                      borderRadius: '50%',
                      padding: 4,
                      display: 'flex',
                    }}
                  >
                    <Check size={13} color="#fff" />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      'linear-gradient(to top,rgba(0,0,0,0.7),transparent)',
                    padding: '20px 10px 10px',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '0 24px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <KBtn
              onClick={() => selected !== null && setStep(1)}
              disabled={selected === null}
            >
              Next: Configure Post <ChevronRight size={16} />
            </KBtn>
          </div>
        </KCard>
      )}

      {step === 1 && (
        <KCard style={{ padding: 28 }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          >
            <div>
              <div
                style={{
                  color: K.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Platform
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {(['instagram', 'tiktok'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      background:
                        platform === p
                          ? p === 'instagram'
                            ? K.gradInstagram
                            : K.gradTikTok
                          : 'rgba(243,244,246,0.8)',
                      border:
                        platform === p ? 'none' : `1px solid ${K.borderMid}`,
                      color: platform === p ? '#fff' : K.textMuted,
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      justifyContent: 'center',
                      fontFamily: "'Outfit', system-ui, sans-serif",
                      transition: 'all 0.2s',
                    }}
                  >
                    {p === 'instagram' ? (
                      <Instagram size={18} />
                    ) : (
                      <Music2 size={18} />
                    )}
                    {p === 'instagram' ? 'Instagram' : 'TikTok'}
                  </button>
                ))}
              </div>
              <div
                style={{
                  color: K.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Caption
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={5}
                placeholder="Write your post caption here..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <div
                style={{
                  color: K.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  margin: '14px 0 8px',
                }}
              >
                Hashtags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {hashtags.map((h) => (
                  <span
                    key={h}
                    style={{
                      background: 'rgba(99,102,241,0.08)',
                      color: '#6366F1',
                      borderRadius: 20,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 500,
                      border: '1px solid rgba(99,102,241,0.2)',
                    }}
                  >
                    {h}
                  </span>
                ))}
                <button
                  style={{
                    background: 'rgba(243,244,246,0.8)',
                    border: `1px dashed ${K.borderMid}`,
                    borderRadius: 20,
                    padding: '4px 10px',
                    fontSize: 12,
                    color: K.textMuted,
                    cursor: 'pointer',
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  + Add
                </button>
              </div>
            </div>
            <div>
              <div
                style={{
                  color: K.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Preview
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: mediaItems[selected ?? 0]?.grad ?? K.gradPrimary,
                  aspectRatio: '9/16',
                  maxHeight: 340,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Eye size={32} color="rgba(255,255,255,0.4)" />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 24,
            }}
          >
            <KBtn variant="ghost" onClick={() => setStep(0)}>
              <ChevronLeft size={16} /> Back
            </KBtn>
            <KBtn onClick={() => setStep(2)}>
              Review & Publish <ChevronRight size={16} />
            </KBtn>
          </div>
        </KCard>
      )}

      {step === 2 && (
        <KCard style={{ padding: 32 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: K.btnBlue,
                boxShadow: K.btnBlueShadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={36} color="#fff" />
            </div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 20 }}>
              Ready to Publish
            </div>
            <div
              style={{
                color: K.textMuted,
                fontSize: 14,
                textAlign: 'center',
                maxWidth: 400,
                lineHeight: 1.6,
              }}
            >
              Your post is configured and ready. Review the details below and
              click Publish.
            </div>
            <KCard
              style={{
                width: '100%',
                maxWidth: 480,
                padding: 20,
                background: K.cardBgStrong,
              }}
            >
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {[
                  [
                    'Platform',
                    platform
                      ? platform === 'instagram'
                        ? '📸 Instagram'
                        : '🎵 TikTok'
                      : 'Not selected',
                  ],
                  ['Media', `Item #${(selected ?? 0) + 1}`],
                  ['Caption', caption || '(none)'],
                  ['Hashtags', hashtags.join(' ')],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12 }}>
                    <span
                      style={{ color: K.textLight, fontSize: 13, minWidth: 80 }}
                    >
                      {k}
                    </span>
                    <span style={{ color: K.textSub, fontSize: 13, flex: 1 }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </KCard>
            <div style={{ display: 'flex', gap: 12 }}>
              <KBtn variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back
              </KBtn>
              <KBtn
                variant="violet"
                onClick={() => {
                  setStep(0)
                  setSelected(null)
                }}
              >
                <Megaphone size={16} /> Publish Now
              </KBtn>
            </div>
          </div>
        </KCard>
      )}
    </div>
  )
}

function PublishingHistoryPage() {
  return (
    <div
      style={{
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'rgba(99,102,241,0.08)',
          border: `1px solid rgba(99,102,241,0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <History size={32} color="rgba(99,102,241,0.5)" />
      </div>
      <div style={{ color: K.text, fontWeight: 600, fontSize: 16 }}>
        No posts yet
      </div>
      <div style={{ color: K.textMuted, fontSize: 13, marginTop: 6 }}>
        Published and scheduled posts will appear here.
      </div>
    </div>
  )
}

function GalleryPage() {
  const items = [
    {
      name: 'Monika',
      time: '7w ago',
      status: 'active',
      img: true,
      grad: K.gradPrimary,
    },
    {
      name: 'Half girl',
      time: '7w ago',
      status: 'active',
      img: true,
      grad: 'linear-gradient(135deg,#06B6D4,#6366F1)',
    },
    {
      name: 'Brazil',
      time: '8w ago',
      status: 'active',
      img: true,
      grad: K.gradGreen,
    },
    { name: 'Unknown', time: '8w ago', status: 'failed', img: false, grad: '' },
  ]
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              border: `1px solid ${K.border}`,
              aspectRatio: '3/4',
              background: item.img ? item.grad : 'rgba(243,244,246,0.8)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: item.img ? 'flex-end' : 'center',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
            }}
          >
            {item.status === 'active' && (
              <div style={{ position: 'absolute', top: 10, left: 10 }}>
                <KBadge label="Active" color={K.success} />
              </div>
            )}
            {item.img ? (
              <>
                <button
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(0,0,0,0.45)',
                    border: 'none',
                    borderRadius: 7,
                    padding: 6,
                    cursor: 'pointer',
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Trash2 size={13} />
                </button>
                <div
                  style={{
                    background:
                      'linear-gradient(to top,rgba(0,0,0,0.7),transparent)',
                    padding: '24px 12px 12px',
                    width: '100%',
                  }}
                >
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {item.time}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        borderRadius: 7,
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        fontFamily: "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      <Eye size={12} /> View
                    </button>
                    <button
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        borderRadius: 7,
                        padding: '6px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        fontFamily: "'Outfit', system-ui, sans-serif",
                      }}
                    >
                      <Download size={12} /> Save
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <AlertCircle
                  size={28}
                  color={K.error}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ color: K.text, fontSize: 13, fontWeight: 600 }}>
                  {item.name}
                </div>
                <div style={{ color: K.textMuted, fontSize: 11, marginTop: 4 }}>
                  Generation failed
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentPage() {
  const videos = [
    {
      name: 'Product Showcase #1',
      influencer: 'Monika',
      status: 'completed',
      time: '2 months ago',
      grad: K.gradPrimary,
    },
    {
      name: 'Summer Collection',
      influencer: 'Half girl',
      status: 'completed',
      time: '2 months ago',
      grad: 'linear-gradient(135deg,#06B6D4,#6366F1)',
    },
    {
      name: 'Brand Story',
      influencer: 'Business girl',
      status: 'processing',
      time: '2 months ago',
      grad: K.gradGreen,
    },
    {
      name: 'Holiday Special',
      influencer: 'Asian women',
      status: 'failed',
      time: '2 months ago',
      grad: 'linear-gradient(135deg,#F97316,#EC4899)',
    },
  ]
  const statusColor = (s: string) =>
    s === 'completed' ? K.success : s === 'processing' ? K.warning : K.error

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
        }}
      >
        {videos.map((v, i) => (
          <KCard key={i} style={{ overflow: 'hidden' }}>
            <div
              style={{
                background: v.grad,
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <PlayCircle size={36} color="rgba(255,255,255,0.6)" />
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <KBadge label={v.status} color={statusColor(v.status)} />
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ color: K.text, fontWeight: 600, fontSize: 13 }}>
                {v.name}
              </div>
              <div style={{ color: K.textMuted, fontSize: 11, marginTop: 3 }}>
                {v.influencer} · {v.time}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <KBtn
                  size="sm"
                  variant="ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Eye size={12} />
                </KBtn>
                <KBtn
                  size="sm"
                  variant="ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Download size={12} />
                </KBtn>
                <KBtn
                  size="sm"
                  variant="ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Trash2 size={12} />
                </KBtn>
              </div>
            </div>
          </KCard>
        ))}
      </div>
    </div>
  )
}

function UsagePage() {
  const logs = [
    {
      type: 'product_showcase_maker',
      msg: 'product_content #19 completed — video saved to tTg8G.mp4',
      time: '2 months ago',
      credits: 250,
      status: 'success',
    },
    {
      type: 'content_maker',
      msg: 'content_post #12 completed successfully',
      time: '2 months ago',
      credits: 200,
      status: 'success',
    },
    {
      type: 'influencer_create',
      msg: 'Influencer "Monika" created successfully',
      time: '2 months ago',
      credits: 100,
      status: 'success',
    },
    {
      type: 'product_showcase_maker',
      msg: 'product_content #18 job submitted — taskId: 488a8998a71...',
      time: '2 months ago',
      credits: 250,
      status: 'pending',
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <KCard>
        {logs.map((log, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              padding: '16px 20px',
              borderBottom:
                i < logs.length - 1 ? `1px solid ${K.border}` : 'none',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background:
                  log.status === 'success'
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(245,158,11,0.1)',
                border: `1px solid ${log.status === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Video
                size={16}
                color={log.status === 'success' ? K.success : K.warning}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 3,
                }}
              >
                <span style={{ color: K.text, fontWeight: 600, fontSize: 13 }}>
                  {log.type}
                </span>
                <KBadge
                  label={log.status}
                  color={log.status === 'success' ? K.success : K.warning}
                />
              </div>
              <div style={{ color: K.textMuted, fontSize: 12 }}>{log.msg}</div>
              <div style={{ color: K.textLight, fontSize: 11, marginTop: 3 }}>
                ⏰ {log.time}
              </div>
            </div>
            <div
              style={{
                color: K.warning,
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              ⊙ {log.credits}
            </div>
          </div>
        ))}
      </KCard>
    </div>
  )
}

function NotificationsPage() {
  const notes = [
    {
      icon: <CheckCircle2 size={18} color={K.success} />,
      title: 'Task Completed',
      body: 'product_content #19 has been processed successfully.',
      time: '2 months ago',
    },
    {
      icon: <AlertCircle size={18} color={K.error} />,
      title: 'Task Failed',
      body: 'Content generation was blocked during safety review.',
      time: '2 months ago',
    },
    {
      icon: <Zap size={18} color={K.warning} />,
      title: 'Credits Low',
      body: 'You have used 80% of your trial credits.',
      time: '2 months ago',
    },
    {
      icon: <Bell size={18} color={K.info} />,
      title: 'New Feature',
      body: 'Social Publishing wizard now supports TikTok Stories.',
      time: '3 months ago',
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <KCard>
        {notes.map((n, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              padding: '18px 20px',
              borderBottom:
                i < notes.length - 1 ? `1px solid ${K.border}` : 'none',
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
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(243,244,246,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {n.icon}
            </div>
            <div>
              <div style={{ color: K.text, fontWeight: 600, fontSize: 14 }}>
                {n.title}
              </div>
              <div style={{ color: K.textMuted, fontSize: 13, marginTop: 2 }}>
                {n.body}
              </div>
              <div style={{ color: K.textLight, fontSize: 11, marginTop: 4 }}>
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </KCard>
    </div>
  )
}

// ─── Navigation Config ─────────────────────────────────────────────────────
type SocialTab =
  | 'dashboard'
  | 'influencers'
  | 'instagram'
  | 'tiktok'
  | 'usage'
  | 'notifications'
  | 'showcase'
  | 'publishing'
  | 'history'
  | 'gallery'
  | 'content'

const NAV_ITEMS: { id: SocialTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'influencers', label: 'Influencers', icon: <Users size={16} /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={16} /> },
  { id: 'content', label: 'Content', icon: <Video size={16} /> },

  {
    id: 'publishing',
    label: 'Social Publishing',
    icon: <Megaphone size={16} />,
  },
  { id: 'showcase', label: 'Product Showcase', icon: <Film size={16} /> },
  { id: 'history', label: 'Publishing History', icon: <History size={16} /> },
  { id: 'instagram', label: 'Link Instagram', icon: <Instagram size={16} /> },
  { id: 'tiktok', label: 'Link TikTok', icon: <Music2 size={16} /> },
  { id: 'usage', label: 'Usage', icon: <BarChart2 size={16} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
]

const PAGE_META: Record<
  SocialTab,
  {
    title: string
    subtitle: string
    icon: React.ReactNode
    actionLabel?: string
    actionVariant?: 'blue' | 'violet' | 'ghost'
  }
> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of your AI influencer platform',
    icon: <LayoutDashboard size={20} />,
  },
  influencers: {
    title: 'Influencers',
    subtitle: 'Create and manage AI-powered virtual influencers',
    icon: <Users size={20} />,
    actionLabel: 'Create AI Character',
  },
  instagram: {
    title: 'Link Instagram',
    subtitle: 'Link your Instagram account to enable auto posting',
    icon: <Instagram size={20} />,
    actionLabel: 'Add Account',
    actionVariant: 'violet',
  },
  tiktok: {
    title: 'TikTok Accounts',
    subtitle: 'Connect your TikTok accounts and manage content',
    icon: <Music2 size={20} />,
    actionLabel: 'Add Account',
    actionVariant: 'violet',
  },
  publishing: {
    title: 'Social Publishing',
    subtitle: 'Automatically publish generated content to your social accounts',
    icon: <Megaphone size={20} />,
    actionLabel: 'Refresh',
    actionVariant: 'ghost',
  },
  showcase: {
    title: 'Product Showcase',
    subtitle: 'Create videos with your products and influencers',
    icon: <Film size={20} />,
    actionLabel: 'Create Showcase',
  },
  history: {
    title: 'My Posts',
    subtitle: 'History of all your published and scheduled posts',
    icon: <History size={20} />,
    actionLabel: 'Refresh',
    actionVariant: 'ghost',
  },
  gallery: {
    title: 'Gallery',
    subtitle: 'Generate stunning visuals with your influencers',
    icon: <ImageIcon size={20} />,
    actionLabel: 'Add New',
  },
  content: {
    title: 'Content',
    subtitle: 'Create and manage AI-generated content videos',
    icon: <Video size={20} />,
    actionLabel: 'Add New',
  },
  usage: {
    title: 'Usage',
    subtitle: 'Watch logs of your influencer activity',
    icon: <BarChart2 size={20} />,
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Stay updated with your platform activity',
    icon: <Bell size={20} />,
  },
}

const SHOWCASE_VIDEOS = [
  {
    id: '1',
    influencer: 'Monika',
    prompt: 'girl handing headphone saying "This is the best headphone eve…"',
    aspect: '9:16',
    time: '7w ago',
    status: 'completed',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumb: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
  },
  {
    id: '2',
    influencer: 'Middle east',
    prompt: 'Same female influencer from the reference image, exact same…',
    aspect: '9:16',
    time: '8w ago',
    status: 'completed',
    src: 'https://www.w3schools.com/html/movie.mp4',
    thumb: 'linear-gradient(135deg,#06B6D4,#3B82F6)',
  },
  {
    id: '3',
    influencer: '',
    prompt: '',
    aspect: '9:16',
    time: '8w ago',
    status: 'failed',
    error:
      'Request blocked: The generation was halted during Google safety review.',
    src: '',
    thumb: '',
  },
  {
    id: '4',
    influencer: '',
    prompt: '',
    aspect: '9:16',
    time: '8w ago',
    status: 'failed',
    error:
      'Credits insufficient: Your current balance is not enough to run this request.',
    src: '',
    thumb: '',
  },
  {
    id: '5',
    influencer: 'Half girl',
    prompt: 'Same female influencer from the reference image, exact same…',
    aspect: '9:16',
    time: '8w ago',
    status: 'completed',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumb: 'linear-gradient(135deg,#10B981,#059669)',
  },
  {
    id: '6',
    influencer: 'Half girl',
    prompt: 'Use the provided influencer image as the base and the provided…',
    aspect: '9:16',
    time: '8w ago',
    status: 'completed',
    src: 'https://www.w3schools.com/html/movie.mp4',
    thumb: 'linear-gradient(135deg,#F59E0B,#EF4444)',
  },
  {
    id: '7',
    influencer: '',
    prompt: '',
    aspect: '9:16',
    time: '8w ago',
    status: 'failed',
    error: 'Insufficient credits — needs 250, has 200',
    src: '',
    thumb: '',
  },
  {
    id: '8',
    influencer: 'Asian women',
    prompt: 'woman wearing this T-shirt and saying "I am not a real person I…"',
    aspect: '9:16',
    time: '8w ago',
    status: 'completed',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumb: 'linear-gradient(135deg,#EC4899,#8B5CF6)',
  },
]

function ShowcaseCard({
  item,
  onDelete,
}: {
  item: (typeof SHOWCASE_VIDEOS)[0]
  onDelete: () => void
}) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  if (item.status === 'failed') {
    return (
      <div
        style={{
          borderRadius: 14,
          overflow: 'hidden',
          border: `1px solid ${K.border}`,
          background: K.cardBg,
          aspectRatio: '9/16',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={onDelete}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: 7,
            padding: 6,
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          <Trash2 size={13} />
        </button>
        <AlertCircle size={32} color={K.error} />
        <span style={{ color: K.error, fontWeight: 700, fontSize: 13 }}>
          Failed
        </span>
        <span
          style={{
            color: K.textMuted,
            fontSize: 11,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {item.error}
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${K.border}`,
        background: '#fff',
        aspectRatio: '9/16',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={item.src}
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {!playing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: item.thumb || 'linear-gradient(135deg,#6366F1,#8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayCircle size={28} color="#fff" />
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          display: 'flex',
          gap: 6,
        }}
      >
        <span
          style={{
            background: K.success,
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 6,
          }}
        >
          Completed
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: 7,
          padding: 6,
          cursor: 'pointer',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Trash2 size={13} />
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top,rgba(0,0,0,0.85),transparent)',
          padding: '28px 12px 12px',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
          {item.influencer}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 11,
            marginTop: 2,
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.prompt}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 8,
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
            📐 {item.aspect}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
            🗓 {item.time}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ProductShowcasePage({
  onCreateClick,
}: {
  onCreateClick: () => void
}) {
  const [videos, setVideos] = useState(SHOWCASE_VIDEOS)
  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <div style={{ padding: 0 }}>
      {/* <div
        style={{
          background: K.cardBgStrong,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${K.border}`,
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background:
                'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))',
              border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Film size={22} color="#6366F1" />
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 17 }}>
              Product Showcase
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              Create videos with your products and influencers
            </div>
          </div>
        </div>
        <KBtn onClick={onCreateClick}>
          <Plus size={16} /> Create Showcase
        </KBtn>
      </div> */}
      {/* <div
        style={{
          height: 2,
          background: 'linear-gradient(90deg,#6366F1,#EC4899,#3B82F6)',
        }}
      /> */}
      <div
        style={{
          padding: 24,
          background: 'transparent',
          minHeight: 'calc(100vh - 180px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
          }}
        >
          {videos.map((v) => (
            <ShowcaseCard
              key={v.id}
              item={v}
              onDelete={() => deleteVideo(v.id)}
            />
          ))}
          <div
            onClick={onCreateClick}
            style={{
              borderRadius: 14,
              border: `2px dashed ${K.borderMid}`,
              aspectRatio: '9/16',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.5)',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = K.borderMid)
            }
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(99,102,241,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={22} color="#6366F1" />
            </div>
            <span style={{ color: K.textMuted, fontSize: 12, fontWeight: 500 }}>
              New Showcase
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Create Showcase Dialog — CONVERTED TO LIGHT
const SHOWCASE_MODELS = [
  {
    name: 'betsy',
    desc: 'Black african american female',
    grad: 'linear-gradient(135deg,#7C3AED,#EC4899)',
  },
  {
    name: 'Mia',
    desc: 'African american female dress in luxury attire',
    grad: 'linear-gradient(135deg,#06B6D4,#6366F1)',
  },
  {
    name: 'Mia',
    desc: 'African american female dress in luxury attire',
    grad: 'linear-gradient(135deg,#3B82F6,#06B6D4)',
  },
  {
    name: 'kira',
    desc: 'blonde female dress in elegant luxury attire',
    grad: 'linear-gradient(135deg,#F59E0B,#EC4899)',
  },
  {
    name: 'Monika',
    desc: 'This model is for my work which is related to xyz',
    grad: K.gradPrimary,
  },
  {
    name: 'Half girl',
    desc: 'A photorealistic young female influencer, 22–28 years old',
    grad: 'linear-gradient(135deg,#10B981,#06B6D4)',
  },
  {
    name: 'Business girl',
    desc: 'Influencer in smart business',
    grad: K.gradGreen,
  },
  {
    name: 'Asian women',
    desc: 'Asian women',
    grad: 'linear-gradient(135deg,#EC4899,#8B5CF6)',
  },
]

export function CreateShowcaseDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [selectedModel, setSelectedModel] = useState<number | null>(null)
  const [productFile, setProductFile] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [aspect, setAspect] = useState<'16:9' | '9:16' | 'auto'>('9:16')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const steps = ['Select your model', 'Upload Product', 'Add Prompt']
  const stepIcons = ['👤', '🖼️', 'Tt']

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }
  const dialogStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.95)',
    border: `1px solid ${K.border}`,
    borderRadius: 20,
    width: 820,
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100vh - 80px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  }

  const Header = () => (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        borderBottom: `1px solid ${K.border}`,
        padding: '0 28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0 14px',
          borderBottom: `1px solid ${K.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: K.btnBlue,
              boxShadow: K.btnBlueShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#fff',
            }}
          >
            {stepIcons[step]}
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 16 }}>
              {steps[step]}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(243,244,246,0.9)',
            border: `1px solid ${K.border}`,
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: K.textMuted,
          }}
        >
          <X size={16} />
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  background:
                    i < step
                      ? K.success
                      : i === step
                        ? K.btnBlue
                        : 'rgba(243,244,246,0.9)',
                  color: i < step ? '#fff' : i === step ? '#fff' : K.textLight,
                  border:
                    i === step
                      ? 'none'
                      : i < step
                        ? 'none'
                        : `2px solid ${K.border}`,
                  flexShrink: 0,
                  boxShadow: i === step ? K.btnBlueShadow : 'none',
                }}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: i === step ? 600 : 400,
                  color:
                    i === step ? K.text : i < step ? K.textMuted : K.textLight,
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  margin: '0 16px',
                  background: i < step ? K.success : K.border,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  const Step0 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div
        style={{
          background: 'rgba(99,102,241,0.06)',
          borderRadius: 14,
          border: '1px solid rgba(99,102,241,0.2)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(99,102,241,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Users size={22} color="#6366F1" />
        </div>
        <div>
          <div style={{ color: K.text, fontWeight: 700, fontSize: 15 }}>
            Choose Your Model
          </div>
          <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
            Select the influencer to showcase your product
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
        }}
      >
        {SHOWCASE_MODELS.map((m, i) => (
          <div
            key={i}
            onClick={() => setSelectedModel(i)}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '3/4',
              cursor: 'pointer',
              background: m.grad,
              border:
                selectedModel === i
                  ? '3px solid #6366F1'
                  : `2px solid ${K.border}`,
              transition: 'all 0.2s',
              boxShadow:
                selectedModel === i ? '0 0 0 3px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <span
                style={{
                  background: K.success,
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                Active
              </span>
            </div>
            {selectedModel === i && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                <Check size={15} color={K.primary} />
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.15)',
              }}
            >
              <Users size={52} />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  'linear-gradient(to top,rgba(0,0,0,0.8),transparent)',
                padding: '24px 10px 10px',
              }}
            >
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>
                {m.name}
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 10,
                  marginTop: 2,
                  lineHeight: 1.4,
                }}
              >
                {m.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const Step1 = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div
        style={{
          background: 'rgba(99,102,241,0.06)',
          borderRadius: 14,
          border: '1px solid rgba(99,102,241,0.2)',
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(99,102,241,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UploadCloud size={22} color="#6366F1" />
        </div>
        <div>
          <div style={{ color: K.text, fontWeight: 700, fontSize: 15 }}>
            Upload Product Image
          </div>
          <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
            Upload a clear image of your product
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setProductFile(file.name)
        }}
      />
      {productFile ? (
        <div
          style={{
            borderRadius: 14,
            border: `2px solid ${K.success}`,
            background: 'rgba(16,185,129,0.06)',
            padding: 28,
            textAlign: 'center',
          }}
        >
          <CheckCircle2
            size={40}
            color={K.success}
            style={{ margin: '0 auto 12px', display: 'block' }}
          />
          <div style={{ color: K.text, fontWeight: 600, fontSize: 14 }}>
            {productFile}
          </div>
          <div style={{ color: K.textMuted, fontSize: 12, marginTop: 4 }}>
            Image uploaded successfully
          </div>
          <button
            onClick={() => setProductFile(null)}
            style={{
              marginTop: 16,
              background: 'rgba(243,244,246,0.9)',
              border: `1px solid ${K.border}`,
              borderRadius: 8,
              padding: '8px 16px',
              color: K.textMuted,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Change file
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            borderRadius: 14,
            border: `2px dashed ${K.borderMid}`,
            background: 'rgba(243,244,246,0.5)',
            padding: '60px 28px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(99,102,241,0.5)'
            ;(e.currentTarget as HTMLDivElement).style.background =
              'rgba(99,102,241,0.05)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor = K.borderMid
            ;(e.currentTarget as HTMLDivElement).style.background =
              'rgba(243,244,246,0.5)'
          }}
        >
          <UploadCloud
            size={48}
            color={K.textLight}
            style={{ margin: '0 auto 16px', display: 'block' }}
          />
          <div
            style={{
              color: K.text,
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 6,
            }}
          >
            Click to upload
          </div>
          <div style={{ color: K.textMuted, fontSize: 13 }}>
            Supported: JPG, PNG, WebP (Max 5MB)
          </div>
        </div>
      )}
    </div>
  )

  const Step2 = () => {
    const model = selectedModel !== null ? SHOWCASE_MODELS[selectedModel] : null
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div
          style={{
            background: 'rgba(99,102,241,0.06)',
            borderRadius: 14,
            border: '1px solid rgba(99,102,241,0.2)',
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(99,102,241,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#6366F1',
            }}
          >
            Tt
          </div>
          <div>
            <div style={{ color: K.text, fontWeight: 700, fontSize: 15 }}>
              Add Prompt
            </div>
            <div style={{ color: K.textMuted, fontSize: 12, marginTop: 2 }}>
              Describe how the influencer should present your product
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              color: K.textMuted,
              fontSize: 12,
              fontWeight: 500,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Prompt (optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="e.g. The influencer holds the product and says 'This is amazing!'"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              color: K.textMuted,
              fontSize: 12,
              fontWeight: 500,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            📐 Aspect Ratio
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['16:9', '9:16', 'auto'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAspect(r)}
                style={{
                  flex: 1,
                  padding: '14px 10px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background:
                    aspect === r
                      ? 'rgba(99,102,241,0.1)'
                      : 'rgba(243,244,246,0.8)',
                  border:
                    aspect === r
                      ? '2px solid #6366F1'
                      : `1px solid ${K.borderMid}`,
                  color: aspect === r ? '#6366F1' : K.textMuted,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s',
                }}
              >
                {r === '16:9' ? (
                  <Monitor size={20} />
                ) : r === '9:16' ? (
                  <Smartphone size={20} />
                ) : (
                  <Wand2 size={20} />
                )}
                {r === '16:9'
                  ? '16:9 (Landscape)'
                  : r === '9:16'
                    ? '9:16 (Portrait)'
                    : 'Auto (AI Decides)'}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Clock size={16} color={K.warning} />
          <span style={{ color: K.warning, fontSize: 13 }}>
            Video Duration: 8 seconds (fixed)
          </span>
        </div>
        <div
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 14,
            padding: '18px 20px',
          }}
        >
          <div
            style={{
              color: K.text,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 14,
            }}
          >
            Summary
          </div>
          {[
            ['👤', 'Model', model?.name || 'Not selected'],
            ['🖼️', 'Product', productFile || 'Not uploaded'],
            ['📐', 'Aspect Ratio', aspect],
            ['Tt', 'Prompt', prompt || 'Not provided'],
          ].map(([icon, key, val]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 10,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
              <span style={{ color: K.textMuted, fontSize: 13, minWidth: 80 }}>
                {key}:
              </span>
              <span style={{ color: K.text, fontSize: 13, fontWeight: 500 }}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const Footer = () => (
    <div
      style={{
        borderTop: `1px solid ${K.border}`,
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.9)',
      }}
    >
      <button
        onClick={() => {
          if (step === 0) onClose()
          else setStep((s) => s - 1)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: 'rgba(243,244,246,0.9)',
          border: `1px solid ${K.border}`,
          borderRadius: 10,
          padding: '9px 18px',
          color: K.text,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        {step === 0 ? (
          <>
            <X size={15} /> Cancel
          </>
        ) : (
          <>
            <ChevronLeft size={15} /> Back
          </>
        )}
      </button>
      {step < 2 ? (
        <button
          onClick={() => setStep((s) => s + 1)}
          disabled={step === 0 && selectedModel === null}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background:
              step === 0 && selectedModel === null
                ? 'rgba(243,244,246,0.9)'
                : K.btnBlue,
            boxShadow:
              step === 0 && selectedModel === null ? 'none' : K.btnBlueShadow,
            border: 'none',
            borderRadius: 10,
            padding: '9px 20px',
            color: step === 0 && selectedModel === null ? K.textLight : '#fff',
            cursor:
              step === 0 && selectedModel === null ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          Next <ChevronRight size={15} />
        </button>
      ) : (
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: K.btnBlue,
            boxShadow: K.btnBlueShadow,
            border: 'none',
            borderRadius: 10,
            padding: '9px 22px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          <Sparkles size={15} /> Generate Video
        </button>
      )}
    </div>
  )

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <Header />
        {step === 0 && <Step0 />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        <Footer />
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function SocialMediaView() {
  const [tab, setTab] = useState<SocialTab>('dashboard')
  const [search, _setSearch] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showShowcaseDialog, setShowShowcaseDialog] = useState(false)

  const meta = PAGE_META[tab]
  const filteredNav = NAV_ITEMS.filter(
    (n) => !search || n.label.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAction() {
    if (tab === 'influencers') setShowCreateDialog(true)
    if (tab === 'showcase') setShowShowcaseDialog(true)
  }

  function renderPage() {
    switch (tab) {
      case 'dashboard':
        return <DashboardPage />
      case 'influencers':
        return (
          <InfluencersPage onOpenCreate={() => setShowCreateDialog(true)} />
        )
      case 'instagram':
        return <LinkInstagramPage />
      case 'tiktok':
        return <LinkTikTokPage />
      case 'publishing':
        return <SocialPublishingPage />
      case 'history':
        return <PublishingHistoryPage />
      case 'showcase':
        return (
          <ProductShowcasePage
            onCreateClick={() => setShowShowcaseDialog(true)}
          />
        )
      case 'gallery':
        return <GalleryPage />
      case 'content':
        return <ContentPage />
      case 'usage':
        return <UsagePage />
      case 'notifications':
        return <NotificationsPage />
      default:
        return null
    }
  }

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
      {/* Subtle overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom right, rgba(238,241,246,0.55) 0%, rgba(229,238,255,0.35) 50%, rgba(255,255,255,0.2) 100%)',
          zIndex: 0,
        }}
      />
      {/* Top-right gradient blobs */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 600,
          height: 600,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at top right, rgba(196,181,253,0.45) 0%, rgba(147,197,253,0.35) 40%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse at top right, rgba(216,180,254,0.4) 0%, rgba(186,230,253,0.3) 50%, transparent 70%)',
        }}
      />

      {/* ── Left Sidebar ── */}
      <aside
        style={{
          width: 220,
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
        {/* Logo area */}
        <div
          style={{
            padding: '16px 14px 8px',
            borderBottom: `1px solid ${K.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: K.gradPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <span style={{ color: K.text, fontWeight: 700, fontSize: 14 }}>
              Social Media
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
          {filteredNav.map((item) => {
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
                  padding: '10px 12px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: 'none',
                  marginBottom: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  background: active ? K.activeNavBg : 'transparent',
                  color: active ? K.text : K.textMuted,
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.55)'
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'transparent'
                }}
              >
                {active && <GlowBlobs />}
                <span
                  style={{
                    color: active ? '#6366F1' : K.textLight,
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
        </nav>

        {/* Bottom items */}
        <div style={{ borderTop: `1px solid ${K.border}`, padding: 8 }}>
          {[{ label: 'Help', icon: <HelpCircle size={15} /> }].map((item) => (
            <button
              key={item.label}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 9,
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                color: K.textMuted,
                fontSize: 13,
                marginBottom: 2,
                fontFamily: "'Outfit', system-ui, sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.6)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  'transparent')
              }
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Area ── */}
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
              Social Media — Kira
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {meta.actionLabel &&
              meta.actionVariant !== 'ghost' &&
              tab !== 'instagram' &&
              tab !== 'tiktok' && (
                <KBtn
                  variant={meta.actionVariant ?? 'blue'}
                  onClick={handleAction}
                >
                  <Plus size={14} />
                  {meta.actionLabel}
                </KBtn>
              )}
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
                onError={(e) => (e.currentTarget.style.display = 'none')}
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
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </button>
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
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {renderPage()}
        </div>
      </div>

      {/* Create Influencer Dialog */}
      {showCreateDialog && (
        <CreateAICharacterDialog onClose={() => setShowCreateDialog(false)} />
      )}
      {showShowcaseDialog && (
        <CreateShowcaseDialog onClose={() => setShowShowcaseDialog(false)} />
      )}
    </div>
  )
}

export default SocialMediaView
