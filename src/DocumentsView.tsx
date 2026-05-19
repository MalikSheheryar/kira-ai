/**
 * DocumentsView.tsx — Kira AI Documents Suite
 * Updated header to match DashboardView / SocialMediaView design system
 * Same MainBG.png, same Outfit font, same profile/bell/settings icons,
 * same gradient overlay & top-right blob system.
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  Monitor,
  FileText,
  MessageSquare,
  BookOpen,
  Folder,
  Clock,
  ChevronRight,
  Upload,
  Send,
  Plus,
  Share2,
  Star,
  Sparkles,
  Download,
  ArrowUp,
  Table2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'

// ─── Kira Design Tokens ────────────────────────────────────────────────────
const K = {
  mainBg: 'url("/MainBG.png") center right / cover no-repeat',
  cardBg: 'rgba(255,255,255,0.82)',
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
  activeNavBg:
    'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)',
  accent: '#5b5ef4',
  accent2: '#7c3aed',
  gradPrimary: 'linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const

// ─── Shared Primitives ─────────────────────────────────────────────────────
const KCard: React.FC<{
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ children, style }) => (
  <div
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

interface KBtnProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  variant?: 'blue' | 'violet' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
}
const KBtn: React.FC<KBtnProps> = ({
  children,
  onClick,
  style,
  variant = 'blue',
  size = 'md',
  disabled,
}) => {
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
    },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: size === 'sm' ? 12 : 13,
        padding: size === 'sm' ? '6px 14px' : '9px 18px',
        border: 'none',
        opacity: disabled ? 0.45 : 1,
        fontFamily: "'Outfit', system-ui, sans-serif",
        transition: 'opacity 0.15s',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}


// ─── THEME DATA ────────────────────────────────────────────────────────────
type Theme = {
  name: string
  category: string
  emoji: string
  bg: string
  accent: string
  text: string
  desc?: string
}

const THEMES: Theme[] = [
  {
    name: 'Aurora',
    category: 'minimal',
    emoji: '🌅',
    bg: 'linear-gradient(135deg,#667eea,#764ba2)',
    accent: '#fff',
    text: '#fff',
    desc: 'Clean gradient',
  },
  {
    name: 'Midnight',
    category: 'dark',
    emoji: '🌙',
    bg: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    accent: '#a78bfa',
    text: '#fff',
    desc: 'Deep dark',
  },
  {
    name: 'Ocean',
    category: 'business',
    emoji: '🌊',
    bg: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    accent: '#bae6fd',
    text: '#fff',
    desc: 'Professional blue',
  },
  {
    name: 'Forest',
    category: 'education',
    emoji: '🌿',
    bg: 'linear-gradient(135deg,#10b981,#059669)',
    accent: '#d1fae5',
    text: '#fff',
    desc: 'Calm nature',
  },
  {
    name: 'Sunset',
    category: 'marketing',
    emoji: '🌇',
    bg: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    accent: '#fef3c7',
    text: '#fff',
    desc: 'Warm energy',
  },
  {
    name: 'Rose',
    category: 'culture',
    emoji: '🌸',
    bg: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
    accent: '#fce7f3',
    text: '#fff',
    desc: 'Creative arts',
  },
  {
    name: 'Slate',
    category: 'minimal',
    emoji: '🪨',
    bg: 'linear-gradient(135deg,#334155,#475569)',
    accent: '#e2e8f0',
    text: '#fff',
    desc: 'Executive tone',
  },
  {
    name: 'Ivory',
    category: 'light',
    emoji: '☁️',
    bg: '#fafaf9',
    accent: '#5b5ef4',
    text: '#1a1a2e',
    desc: 'Clean & light',
  },
  {
    name: 'Indigo',
    category: 'tech',
    emoji: '💻',
    bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    accent: '#e0e7ff',
    text: '#fff',
    desc: 'Tech forward',
  },
  {
    name: 'Coral',
    category: 'marketing',
    emoji: '🪸',
    bg: 'linear-gradient(135deg,#f97316,#ec4899)',
    accent: '#fff7ed',
    text: '#fff',
    desc: 'Vibrant brand',
  },
  {
    name: 'Nordic',
    category: 'minimal',
    emoji: '❄️',
    bg: 'linear-gradient(135deg,#dbeafe,#e0f2fe)',
    accent: '#3b82f6',
    text: '#1e3a5f',
    desc: 'Clean nordic',
  },
  {
    name: 'Gold',
    category: 'business',
    emoji: '✨',
    bg: 'linear-gradient(135deg,#92400e,#b45309)',
    accent: '#fbbf24',
    text: '#fff',
    desc: 'Luxury finance',
  },
]

const CATEGORIES = [
  'all',
  'education',
  'business',
  'marketing',
  'culture',
  'minimal',
  'light',
  'dark',
  'tech',
]

// Mini slide preview component
const ThemePreview: React.FC<{ theme: Theme }> = ({ theme }) => (
  <div
    style={{
      width: '100%',
      aspectRatio: '4/3',
      background: theme.bg,
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '10% 10% 5%',
      position: 'relative',
    }}
  >
    <div
      style={{
        fontSize: 7,
        fontWeight: 800,
        color: theme.accent,
        marginBottom: 3,
        opacity: 0.85,
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}
    >
      PRESENTATION
    </div>
    <div
      style={{
        fontSize: 8,
        fontWeight: 800,
        color: theme.text,
        marginBottom: 2,
        lineHeight: 1.2,
      }}
    >
      Slide Title Here
    </div>
    <div
      style={{
        fontSize: 5,
        color: theme.text,
        opacity: 0.65,
        marginBottom: 8,
      }}
    >
      Subtitle or description text
    </div>
    {[70, 50, 85, 40].map((w, i) => (
      <div
        key={i}
        style={{
          height: i === 0 ? 4 : 2.5,
          width: `${w}%`,
          borderRadius: 2,
          background: theme.accent,
          opacity: i === 0 ? 0.5 : 0.25,
          marginBottom: 3,
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        fontSize: 12,
        opacity: 0.6,
      }}
    >
      {theme.emoji}
    </div>
  </div>
)

// ─── GENERATE SUB-VIEW ─────────────────────────────────────────────────────
function GenerateSubView({
  onThemeSelect,
}: {
  onThemeSelect: (t: Theme) => void
}) {
  const [prompt, setPrompt] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const filtered =
    filter === 'all' ? THEMES : THEMES.filter((t) => t.category === filter)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setGenerating(true)
    setProgress(0)
    setDone(false)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setDone(true)
          setGenerating(false)
          return 100
        }
        return p + Math.random() * 12
      })
    }, 200)
  }

  const stats = [
    { val: '16M+', lbl: 'Users worldwide' },
    { val: '2.4s', lbl: 'Avg generation time' },
    { val: '98%', lbl: 'Satisfaction rate' },
    { val: '50+', lbl: 'Professional themes' },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: K.text,
            letterSpacing: -0.6,
            lineHeight: 1.2,
            marginBottom: 10,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          Fast and Smart AI Presentation Agent
        </h1>
        <p style={{ fontSize: 16, color: K.textMuted, fontWeight: 500 }}>
          <strong style={{ color: K.text, fontWeight: 800 }}>
            16 Million users'
          </strong>{' '}
          choice — Slides in Seconds
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 28,
          flexWrap: 'wrap',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.lbl}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.65)',
              border: `1.5px solid rgba(91,94,244,0.12)`,
              borderRadius: 12,
              padding: '8px 16px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontWeight: 800, color: K.accent, fontSize: 14 }}>
              {s.val}
            </span>
            <span style={{ color: K.textSub, fontWeight: 500, fontSize: 13 }}>
              {s.lbl}
            </span>
          </div>
        ))}
      </div>

      {/* Prompt card */}
      <KCard
        style={{
          border: `1.5px solid rgba(91,94,244,0.15)`,
          boxShadow: '0 4px 24px rgba(91,94,244,0.08)',
          padding: 20,
          marginBottom: 28,
        }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want for your slides, e.g., Create slides on the impact of AI on society. The agent will generate a full presentation for you like a human assistant."
          rows={3}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 14,
            color: K.text,
            lineHeight: 1.7,
            background: 'transparent',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid rgba(91,94,244,0.08)`,
            paddingTop: 12,
            marginTop: 8,
          }}
        >
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1.5px solid rgba(91,94,244,0.18)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: K.textMuted,
              cursor: 'pointer',
              background: 'none',
              fontSize: 18,
            }}
          >
            +
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: K.textSub,
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: 16 }}>🍌</span> NANO BANANA PRO
            </div>
            <button
              onClick={handleGenerate}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: K.btnBlue,
                boxShadow: K.btnBlueShadow,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUp size={16} color="#fff" />
            </button>
          </div>
        </div>
      </KCard>

      {/* Generating Modal */}
      {generating && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(30,30,60,0.3)',
            backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <KCard
            style={{
              padding: 40,
              width: 460,
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(91,94,244,0.18)',
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>✨</div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: K.text,
                marginBottom: 8,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Generating your presentation…
            </h3>
            <p
              style={{
                fontSize: 14,
                color: K.textMuted,
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              Kira AI is crafting slides based on your prompt. This usually
              takes under 3 seconds.
            </p>
            <div
              style={{
                background: 'rgba(91,94,244,0.08)',
                borderRadius: 6,
                height: 8,
                marginBottom: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 6,
                  background: K.btnBlue,
                  width: `${Math.min(progress, 100)}%`,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: K.textMuted, marginBottom: 28 }}>
              {Math.round(Math.min(progress, 100))}% — Structuring slides…
            </p>
          </KCard>
        </div>
      )}

      {/* Done Modal */}
      {done && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(30,30,60,0.3)',
            backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setDone(false)}
        >
          <KCard
            style={{
              padding: 40,
              width: 460,
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(91,94,244,0.18)',
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: K.text,
                marginBottom: 8,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Your presentation is ready!
            </h3>
            <p
              style={{
                fontSize: 14,
                color: K.textMuted,
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              8 slides generated · Theme: {selectedTheme?.name || 'Aurora'} ·
              Ready to present
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <KBtn onClick={() => setDone(false)}>
                <Sparkles size={14} /> Open Presentation
              </KBtn>
              <KBtn variant="ghost" onClick={() => setDone(false)}>
                Close
              </KBtn>
            </div>
          </KCard>
        </div>
      )}

      {/* Themes section */}
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: K.text,
          marginBottom: 16,
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        Themes
      </div>

      {/* Filter row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: `1.5px solid ${filter === cat ? K.text : 'rgba(91,94,244,0.14)'}`,
              background: filter === cat ? K.text : 'none',
              color: filter === cat ? '#fff' : K.textSub,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: "'Outfit', system-ui, sans-serif",
              transition: 'all 0.15s',
              flexShrink: 0,
              textTransform: 'uppercase' as const,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Themes grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
        }}
      >
        {filtered.map((theme) => (
          <div
            key={theme.name}
            onClick={() => {
              setSelectedTheme(theme)
              onThemeSelect(theme)
            }}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              cursor: 'pointer',
              border: `2px solid ${selectedTheme?.name === theme.name ? K.accent : 'transparent'}`,
              boxShadow:
                selectedTheme?.name === theme.name
                  ? `0 0 0 3px rgba(91,94,244,0.2)`
                  : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => {
              if (selectedTheme?.name !== theme.name) {
                ;(e.currentTarget as HTMLDivElement).style.transform =
                  'translateY(-3px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 24px rgba(91,94,244,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(0)'
              if (selectedTheme?.name !== theme.name) {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 2px 8px rgba(0,0,0,0.06)'
              }
            }}
          >
            <ThemePreview theme={theme} />
            <div
              style={{
                padding: '8px 10px 10px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: K.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {theme.name}
              </div>
              <span style={{ fontSize: 11 }}>{theme.emoji}</span>
            </div>
          </div>
        ))}
        {/* Upload custom theme */}
        <div
          style={{
            borderRadius: 14,
            border: `2px dashed rgba(91,94,244,0.25)`,
            background: 'rgba(91,94,244,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            aspectRatio: '4/3',
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor = K.accent
            ;(e.currentTarget as HTMLDivElement).style.background =
              'rgba(91,94,244,0.06)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(91,94,244,0.25)'
            ;(e.currentTarget as HTMLDivElement).style.background =
              'rgba(91,94,244,0.03)'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `2px solid rgba(91,94,244,0.25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: K.textMuted,
            }}
          >
            +
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: K.textSub,
              textAlign: 'center',
            }}
          >
            Upload Custom
          </div>
          <div
            style={{ fontSize: 11, color: K.textMuted, textAlign: 'center' }}
          >
            PPTX · PDF · Images
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── THEMES SUB-VIEW ───────────────────────────────────────────────────────
function ThemesSubView() {
  const catItems = [
    { emoji: '🎓', name: 'Education', count: 12, bg: '#EEF2FF' },
    { emoji: '💼', name: 'Business & Finance', count: 10, bg: '#ECFDF5' },
    { emoji: '📣', name: 'Marketing', count: 8, bg: '#FFF7ED' },
    { emoji: '🎨', name: 'Culture & Arts', count: 9, bg: '#FFF1F2' },
    { emoji: '🌿', name: 'Minimal', count: 7, bg: '#F0FDF4' },
    { emoji: '💻', name: 'Tech', count: 6, bg: '#EFF6FF' },
    { emoji: '☁️', name: 'Light', count: 5, bg: '#FAFAF9' },
    { emoji: '🌙', name: 'Dark', count: 5, bg: '#1A1A2E' },
  ]
  return (
    <div
      style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: K.text,
            marginBottom: 8,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          Explore All Themes
        </h2>
        <p style={{ fontSize: 14, color: K.textMuted }}>
          Choose from 50+ professionally designed presentation templates
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 36,
        }}
      >
        {catItems.map((c) => (
          <div
            key={c.name}
            style={{
              borderRadius: 14,
              padding: 16,
              cursor: 'pointer',
              background: '#fff',
              border: `1.5px solid rgba(91,94,244,0.1)`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor = K.accent
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 4px 14px rgba(91,94,244,0.1)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'rgba(91,94,244,0.1)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
                background: c.bg,
              }}
            >
              {c.emoji}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: K.text }}>
                {c.name}
              </div>
              <div style={{ fontSize: 11, color: K.textMuted, marginTop: 1 }}>
                {c.count} themes
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: K.text,
          marginBottom: 16,
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        All Templates
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
        }}
      >
        {THEMES.map((theme) => (
          <div
            key={theme.name}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
              cursor: 'pointer',
              border: `2px solid transparent`,
              transition: 'all 0.18s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-3px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 8px 24px rgba(91,94,244,0.15)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'rgba(91,94,244,0.2)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(0)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 2px 8px rgba(0,0,0,0.06)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'transparent'
            }}
          >
            <ThemePreview theme={theme} />
            <div style={{ padding: '8px 10px 10px', background: '#fff' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: K.text }}>
                {theme.name}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: K.textMuted,
                  marginTop: 2,
                  textTransform: 'capitalize',
                }}
              >
                {theme.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MY PRESENTATIONS SUB-VIEW ────────────────────────────────────────────
type MyPresTab = 'recent' | 'shared' | 'starred'

function MyPresentationsSubView() {
  const [myTab, setMyTab] = useState<MyPresTab>('recent')

  const presentations = [
    {
      name: 'Q4 Business Strategy',
      slides: 12,
      updated: '2 days ago',
      theme: THEMES[2],
      starred: true,
    },
    {
      name: 'Product Launch 2026',
      slides: 8,
      updated: '5 days ago',
      theme: THEMES[4],
      starred: false,
    },
    {
      name: 'Team Onboarding Deck',
      slides: 15,
      updated: '1 week ago',
      theme: THEMES[0],
      starred: true,
    },
    {
      name: 'AI Market Overview',
      slides: 10,
      updated: '2 weeks ago',
      theme: THEMES[8],
      starred: false,
    },
  ]
  const sharedPres = presentations.slice(0, 2)
  const starredPres = presentations.filter((p) => p.starred)
  const visiblePres =
    myTab === 'recent'
      ? presentations
      : myTab === 'shared'
        ? sharedPres
        : starredPres

  return (
    <div
      style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: K.text,
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          My Presentations
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              gap: 6,
              background: 'rgba(91,94,244,0.06)',
              borderRadius: 11,
              padding: 3,
            }}
          >
            {(['recent', 'shared', 'starred'] as MyPresTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setMyTab(t)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: myTab === t ? '#fff' : 'none',
                  color: myTab === t ? K.accent : K.textMuted,
                  border: 'none',
                  boxShadow:
                    myTab === t ? '0 2px 8px rgba(91,94,244,0.12)' : 'none',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <KBtn size="sm">
            <Plus size={13} /> New Presentation
          </KBtn>
        </div>
      </div>

      {visiblePres.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ fontSize: 48, opacity: 0.3 }}>📊</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: K.text,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            No presentations yet
          </div>
          <div
            style={{
              fontSize: 14,
              color: K.textMuted,
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            Generate your first AI presentation using the Generate tab.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
          }}
        >
          {visiblePres.map((pres, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1.5px solid rgba(91,94,244,0.08)`,
                transition: 'all 0.18s',
                boxShadow: '0 2px 8px rgba(91,94,244,0.04)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 24px rgba(91,94,244,0.12)'
                ;(e.currentTarget as HTMLDivElement).style.transform =
                  'translateY(-2px)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  'rgba(91,94,244,0.2)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 2px 8px rgba(91,94,244,0.04)'
                ;(e.currentTarget as HTMLDivElement).style.transform =
                  'translateY(0)'
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  'rgba(91,94,244,0.08)'
              }}
            >
              <div
                style={{
                  aspectRatio: '16/10',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <ThemePreview theme={pres.theme} />
                {pres.starred && (
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: K.text,
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pres.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: K.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{pres.slides} slides</span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: K.textMuted,
                    }}
                  />
                  <span>{pres.updated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── AI PRESENTATION VIEW ─────────────────────────────────────────────────
type PresTab = 'generate' | 'themes' | 'mypres'

function AIPresentationView() {
  const [presTab, setPresTab] = useState<PresTab>('generate')
  const [, setSelectedTheme] = useState<Theme | null>(null)

  const tabs: { id: PresTab; label: string }[] = [
    { id: 'generate', label: '+ Generate' },
    { id: 'themes', label: 'Themes' },
    { id: 'mypres', label: 'My Presentations' },
  ]

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Page-level tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          borderBottom: `1px solid rgba(91,94,244,0.08)`,
          background: 'rgba(255,255,255,0.5)',
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPresTab(tab.id)}
            style={{
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: presTab === tab.id ? K.accent : K.textMuted,
              cursor: 'pointer',
              borderBottom: `2px solid ${presTab === tab.id ? K.accent : 'transparent'}`,
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              background: 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {presTab === 'generate' && (
          <GenerateSubView onThemeSelect={setSelectedTheme} />
        )}
        {presTab === 'themes' && <ThemesSubView />}
        {presTab === 'mypres' && <MyPresentationsSubView />}
      </div>
    </div>
  )
}

// ─── AI CHAT PDF VIEW ─────────────────────────────────────────────────────
type ChatMsg = { role: 'user' | 'ai'; text: string }

function AIChatPDFView() {
  const [uploaded, setUploaded] = useState(false)
  const [pdfName, setPdfName] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: "I've analysed your document. I can answer questions about its content, summarise sections, extract key data, or help you understand complex passages. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const loadPDF = (name?: string) => {
    setPdfName(name || 'research-paper.pdf')
    setUploaded(true)
  }

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Based on the document, ${userMsg.toLowerCase().includes('summar') ? 'here is a summary of the key points: The document covers several important topics including methodology, findings, and conclusions. The main argument is well-supported by the evidence presented.' : 'I found relevant information in section 3 of the document. The content directly addresses your question with supporting data and citations.'}`,
        },
      ])
    }, 800)
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  if (!uploaded) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          background: 'linear-gradient(135deg,#eef2ff 0%,#e8edfb 100%)',
          padding: '40px 20px',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) loadPDF(f.name)
          }}
        />
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: 500,
            maxWidth: '90%',
            background: '#fff',
            borderRadius: 20,
            padding: 40,
            textAlign: 'center',
            border: `2.5px dashed rgba(91,94,244,0.25)`,
            cursor: 'pointer',
            transition: 'all 0.18s',
            boxShadow: '0 8px 32px rgba(91,94,244,0.10)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor = K.accent
            ;(e.currentTarget as HTMLDivElement).style.background =
              'rgba(91,94,244,0.02)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(91,94,244,0.25)'
            ;(e.currentTarget as HTMLDivElement).style.background = '#fff'
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>📄</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: K.text,
              marginBottom: 8,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Chat with any PDF
          </div>
          <div
            style={{
              fontSize: 13,
              color: K.textMuted,
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            Upload a PDF and ask questions. Kira AI will read, understand, and
            answer anything about your document instantly.
          </div>
          <KBtn>
            <Upload size={16} /> Upload PDF
          </KBtn>
        </div>
        <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
          {[
            '📋 Research papers',
            '📑 Legal documents',
            '📚 Textbooks',
            '📊 Reports',
          ].map((t) => (
            <div key={t} style={{ fontSize: 12, color: K.textMuted }}>
              <strong style={{ color: K.textSub }}>{t}</strong>
            </div>
          ))}
        </div>
        <button
          onClick={() => loadPDF()}
          style={{
            background: 'none',
            border: 'none',
            color: K.accent,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Use demo document →
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* PDF header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: `1px solid rgba(91,94,244,0.08)`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            📄
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: K.text }}>
              {pdfName}
            </div>
            <div style={{ fontSize: 11, color: K.textMuted }}>
              2.4 MB · 24 pages
            </div>
          </div>
        </div>
        <KBtn variant="ghost" size="sm" onClick={() => setUploaded(false)}>
          Upload new
        </KBtn>
      </div>

      {/* Chat log */}
      <div
        ref={logRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          background: 'linear-gradient(135deg,#eef2ff,#f0eeff)',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                flexShrink: 0,
                background:
                  msg.role === 'ai' ? K.btnBlue : 'rgba(91,94,244,0.12)',
                color: msg.role === 'ai' ? '#fff' : K.accent,
              }}
            >
              {msg.role === 'ai' ? '✨' : '👤'}
            </div>
            <div
              style={{
                maxWidth: '74%',
                padding: '11px 15px',
                borderRadius:
                  msg.role === 'ai'
                    ? '4px 15px 15px 15px'
                    : '15px 4px 15px 15px',
                fontSize: 13.5,
                lineHeight: 1.7,
                background:
                  msg.role === 'ai' ? 'rgba(255,255,255,0.8)' : K.btnBlue,
                color: msg.role === 'ai' ? K.text : '#fff',
                border:
                  msg.role === 'ai' ? `1px solid rgba(91,94,244,0.1)` : 'none',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid rgba(91,94,244,0.08)`,
          display: 'flex',
          gap: 10,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Ask anything about your document…"
          rows={1}
          style={{
            flex: 1,
            background: 'rgba(238,242,255,0.8)',
            border: `1.5px solid rgba(91,94,244,0.12)`,
            borderRadius: 13,
            padding: '10px 16px',
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 13.5,
            color: K.text,
            outline: 'none',
            resize: 'none',
            height: 44,
          }}
        />
        <button
          onClick={send}
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            flexShrink: 0,
            background: K.btnBlue,
            boxShadow: K.btnBlueShadow,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ─── AI CHAT VIEW ──────────────────────────────────────────────────────────
function AIChatView() {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  const quickQs = [
    'Write a product launch email',
    'Summarise this document',
    'Create a marketing strategy',
    'Explain quantum computing',
    'Review my code',
    'Help me brainstorm ideas',
  ]

  const send = (text?: string) => {
    const txt = text || input.trim()
    if (!txt) return
    setMessages((prev) => [...prev, { role: 'user', text: txt }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `I'd be happy to help with that! Here's a detailed response to "${txt}": This is a thoughtful topic that requires considering multiple perspectives. Let me walk you through the key points and provide actionable insights you can use immediately.`,
        },
      ])
    }, 700)
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        ref={logRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: 'linear-gradient(135deg,#eef2ff 0%,#e8edfb 100%)',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                margin: '0 auto 18px',
                background: K.btnBlue,
                boxShadow: K.btnBlueShadow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              ✨
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: K.text,
                marginBottom: 6,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Kira AI Assistant
            </h3>
            <p
              style={{
                fontSize: 13,
                color: K.textMuted,
                lineHeight: 1.6,
                maxWidth: 420,
                margin: '0 auto',
              }}
            >
              I'm your intelligent AI companion. Ask me anything — I can help
              with writing, analysis, coding, brainstorming, and much more.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              {quickQs.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.7)',
                    border: `1.5px solid rgba(91,94,244,0.15)`,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: K.textSub,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      K.accent
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.accent
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      '#fff'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(91,94,244,0.15)'
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.textSub
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.7)'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  flexShrink: 0,
                  background:
                    msg.role === 'ai' ? K.btnBlue : 'rgba(91,94,244,0.12)',
                  color: msg.role === 'ai' ? '#fff' : K.accent,
                }}
              >
                {msg.role === 'ai' ? '✨' : '👤'}
              </div>
              <div
                style={{
                  maxWidth: '74%',
                  padding: '11px 15px',
                  borderRadius:
                    msg.role === 'ai'
                      ? '4px 15px 15px 15px'
                      : '15px 4px 15px 15px',
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  background:
                    msg.role === 'ai' ? 'rgba(255,255,255,0.8)' : K.btnBlue,
                  color: msg.role === 'ai' ? K.text : '#fff',
                  border:
                    msg.role === 'ai'
                      ? `1px solid rgba(91,94,244,0.1)`
                      : 'none',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid rgba(91,94,244,0.08)`,
          display: 'flex',
          gap: 10,
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Ask Kira anything…"
          rows={1}
          style={{
            flex: 1,
            background: 'rgba(238,242,255,0.8)',
            border: `1.5px solid rgba(91,94,244,0.12)`,
            borderRadius: 13,
            padding: '10px 16px',
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 13.5,
            color: K.text,
            outline: 'none',
            resize: 'none',
            height: 44,
          }}
        />
        <button
          onClick={() => send()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            flexShrink: 0,
            background: K.btnBlue,
            boxShadow: K.btnBlueShadow,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  )
}

// ─── AI SHEETS VIEW ────────────────────────────────────────────────────────
const COL_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
)
const ROWS_COUNT = 30
const COLS_COUNT = 12

type CellFmt = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  textAlign?: string
  color?: string
  bgColor?: string
}
type Cell = { v: string; fmt: CellFmt }
type SheetData = { name: string; cells: Cell[][] }

function makeEmptySheet(name: string): SheetData {
  return {
    name,
    cells: Array.from({ length: ROWS_COUNT }, () =>
      Array.from({ length: COLS_COUNT }, () => ({ v: '', fmt: {} })),
    ),
  }
}

function AISheetsView() {
  const [sheetIndex, setSheetIndex] = useState(0)
  const [sheets, setSheets] = useState<SheetData[]>(() => {
    const s0 = makeEmptySheet('Sheet1')
    const headers = [
      'Month',
      'Revenue',
      'Expenses',
      'Profit',
      'Growth %',
      'Units Sold',
    ]
    headers.forEach((h, c) => {
      s0.cells[0][c].v = h
      s0.cells[0][c].fmt = {
        bold: true,
        bgColor: '#5b5ef4',
        color: '#ffffff',
        textAlign: 'center',
      }
    })
    const data = [
      ['Jan', '42500', '28000', '14500', '5.2%', '850'],
      ['Feb', '38200', '25000', '13200', '-4.3%', '740'],
      ['Mar', '51000', '32000', '19000', '+12.1%', '1020'],
      ['Apr', '48750', '29500', '19250', '+8.7%', '975'],
      ['May', '55000', '34000', '21000', '+9.4%', '1100'],
      ['Jun', '61200', '38000', '23200', '+11.2%', '1240'],
    ]
    data.forEach((row, r) => {
      row.forEach((val, c) => {
        s0.cells[r + 1][c].v = val
        if (r % 2 === 0)
          s0.cells[r + 1][c].fmt = {
            ...s0.cells[r + 1][c].fmt,
            bgColor: '#f8faff',
          }
      })
    })
    return [s0, makeEmptySheet('Sheet2'), makeEmptySheet('Sheet3')]
  })
  const [selected, setSelected] = useState({ r: 0, c: 0 })
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState('')
  const [aiInput, setAiInput] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const [docName, setDocName] = useState('Untitled Spreadsheet')
  const inputRef = useRef<HTMLInputElement>(null)

  const sheet = sheets[sheetIndex]
  const cell = sheet.cells[selected.r][selected.c]
  const cellRef = `${COL_LETTERS[selected.c]}${selected.r + 1}`

  const updateCell = (r: number, c: number, val: string) => {
    setSheets((prev) => {
      const next = prev.map((s, si) =>
        si === sheetIndex
          ? {
              ...s,
              cells: s.cells.map((row, ri) =>
                ri === r
                  ? row.map((cell2, ci) =>
                      ci === c ? { ...cell2, v: val } : cell2,
                    )
                  : row,
              ),
            }
          : s,
      )
      return next
    })
  }

  const applyFmt = (key: keyof CellFmt, val: any) => {
    setSheets((prev) => {
      const next = prev.map((s, si) =>
        si === sheetIndex
          ? {
              ...s,
              cells: s.cells.map((row, ri) =>
                ri === selected.r
                  ? row.map((c2, ci) =>
                      ci === selected.c
                        ? { ...c2, fmt: { ...c2.fmt, [key]: val } }
                        : c2,
                    )
                  : row,
              ),
            }
          : s,
      )
      return next
    })
  }

  const toggleFmt = (key: 'bold' | 'italic' | 'underline') => {
    applyFmt(key, !cell.fmt[key])
  }

  const startEdit = (r: number, c: number) => {
    setSelected({ r, c })
    setEditing(true)
    setEditVal(sheets[sheetIndex].cells[r][c].v)
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  const commitEdit = () => {
    updateCell(selected.r, selected.c, editVal)
    setEditing(false)
  }

  const runSheetAI = async () => {
    if (!aiInput.trim()) return
    setAiThinking(true)
    await new Promise((r) => setTimeout(r, 1000))
    if (
      aiInput.toLowerCase().includes('sum') ||
      aiInput.toLowerCase().includes('total')
    ) {
      const newSheets = [...sheets]
      const s = { ...newSheets[sheetIndex] }
      s.cells = s.cells.map((row) => row.map((c2) => ({ ...c2 })))
      s.cells[7][1].v = '=SUM(B2:B7)'
      s.cells[7][0].v = 'TOTAL'
      s.cells[7][0].fmt = { bold: true }
      newSheets[sheetIndex] = s
      setSheets(newSheets)
    }
    setAiThinking(false)
    setAiInput('')
  }

  const menuBtns = ['File', 'Edit', 'View', 'Insert', 'Format', 'Data']

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          borderBottom: `1px solid #e5e7eb`,
          flexShrink: 0,
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 8px',
            borderRight: '1px solid #e5e7eb',
            marginRight: 4,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: K.btnBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
            }}
          >
            📊
          </div>
          <input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: K.text,
              width: 160,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          />
        </div>
        {menuBtns.map((b) => (
          <button
            key={b}
            style={{
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 500,
              color: K.textSub,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontFamily: "'Outfit', system-ui, sans-serif",
              borderRadius: 4,
              transition: 'background 0.13s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                '#f3f4f6')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'none')
            }
          >
            {b}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 8,
            border: `1px solid rgba(91,94,244,0.2)`,
            background: 'rgba(91,94,244,0.05)',
            color: K.accent,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Outfit', system-ui, sans-serif",
            marginRight: 4,
          }}
        >
          <Download size={13} /> Export
        </button>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: '#fff',
            color: K.textSub,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Outfit', system-ui, sans-serif",
            marginRight: 8,
          }}
        >
          <Upload size={13} /> Import
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 12px',
          background:
            'linear-gradient(135deg,rgba(91,94,244,0.06),rgba(124,58,237,0.04))',
          borderBottom: '1px solid rgba(91,94,244,0.1)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runSheetAI()}
          placeholder="Ask AI: 'Add a SUM formula', 'Create a sales table', 'Sort by column B'…"
          style={{
            flex: 1,
            border: `1px solid rgba(91,94,244,0.15)`,
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 13,
            color: K.text,
            outline: 'none',
            background: 'rgba(255,255,255,0.8)',
          }}
        />
        <button
          onClick={runSheetAI}
          disabled={aiThinking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
            background: K.btnBlue,
            boxShadow: K.btnBlueShadow,
            border: 'none',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Outfit', system-ui, sans-serif",
            whiteSpace: 'nowrap',
            opacity: aiThinking ? 0.6 : 1,
          }}
        >
          {aiThinking ? '…' : '✨ Ask AI'}
        </button>
        {['Budget table', 'Auto formula', 'Analyse data', 'Insert chart'].map(
          (chip) => (
            <button
              key={chip}
              onClick={() => setAiInput(chip)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                background: 'rgba(91,94,244,0.08)',
                border: '1px solid rgba(91,94,244,0.15)',
                color: K.accent,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Outfit', system-ui, sans-serif",
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {chip}
            </button>
          ),
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '4px 8px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            title: 'Bold',
            icon: <Bold size={13} />,
            action: () => toggleFmt('bold'),
            active: cell.fmt.bold,
          },
          {
            title: 'Italic',
            icon: <Italic size={13} />,
            action: () => toggleFmt('italic'),
            active: cell.fmt.italic,
          },
          {
            title: 'Underline',
            icon: <Underline size={13} />,
            action: () => toggleFmt('underline'),
            active: cell.fmt.underline,
          },
        ].map((btn) => (
          <button
            key={btn.title}
            onClick={btn.action}
            title={btn.title}
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: 'none',
              background: btn.active ? '#dbeafe' : 'none',
              color: btn.active ? '#1d4ed8' : K.textSub,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {btn.icon}
          </button>
        ))}
        <div
          style={{
            width: 1,
            height: 20,
            background: '#d1d5db',
            margin: '0 3px',
          }}
        />
        {[
          { title: 'Left', icon: <AlignLeft size={13} />, val: 'left' },
          { title: 'Center', icon: <AlignCenter size={13} />, val: 'center' },
          { title: 'Right', icon: <AlignRight size={13} />, val: 'right' },
        ].map((btn) => (
          <button
            key={btn.title}
            onClick={() => applyFmt('textAlign', btn.val)}
            title={btn.title}
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: 'none',
              background: cell.fmt.textAlign === btn.val ? '#dbeafe' : 'none',
              color: cell.fmt.textAlign === btn.val ? '#1d4ed8' : K.textSub,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {btn.icon}
          </button>
        ))}
        <div
          style={{
            width: 1,
            height: 20,
            background: '#d1d5db',
            margin: '0 3px',
          }}
        />
        {['$', '%', ','].map((fmt) => (
          <button
            key={fmt}
            title={`Format as ${fmt}`}
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              border: 'none',
              background: 'none',
              color: K.textSub,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {fmt}
          </button>
        ))}
        <div
          style={{
            width: 1,
            height: 20,
            background: '#d1d5db',
            margin: '0 3px',
          }}
        />
        <span style={{ fontSize: 11, color: K.textMuted, marginLeft: 4 }}>
          Selected: {cellRef}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          flexShrink: 0,
          background: '#fff',
          height: 28,
        }}
      >
        <input
          value={cellRef}
          readOnly
          style={{
            width: 60,
            borderRight: '1px solid #e5e7eb',
            padding: '0 8px',
            fontSize: 12,
            fontWeight: 600,
            color: K.text,
            border: 'none',
            outline: 'none',
            height: '100%',
            fontFamily: 'monospace',
            background: '#f9fafb',
          }}
        />
        <div
          style={{
            fontSize: 12,
            padding: '0 8px',
            color: K.textMuted,
            fontStyle: 'italic',
            borderRight: '1px solid #e5e7eb',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          fx
        </div>
        <input
          ref={inputRef}
          value={editing ? editVal : cell.v}
          onChange={(e) => setEditVal(e.target.value)}
          onFocus={() => {
            setEditing(true)
            setEditVal(cell.v)
          }}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
          }}
          placeholder="Enter value or formula…"
          style={{
            flex: 1,
            padding: '0 10px',
            fontSize: 12,
            color: K.text,
            border: 'none',
            outline: 'none',
            height: '100%',
            fontFamily: 'monospace',
          }}
        />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            fontSize: 12,
            minWidth: '100%',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: 40,
                  minWidth: 40,
                  height: 22,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  zIndex: 3,
                }}
              />
              {COL_LETTERS.slice(0, COLS_COUNT).map((col) => (
                <th
                  key={col}
                  style={{
                    minWidth: 100,
                    height: 22,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    fontSize: 11,
                    fontWeight: 600,
                    color: K.textSub,
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS_COUNT }, (_, r) => (
              <tr key={r}>
                <td
                  style={{
                    width: 40,
                    minWidth: 40,
                    height: 22,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    fontSize: 11,
                    fontWeight: 600,
                    color: K.textSub,
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  {r + 1}
                </td>
                {Array.from({ length: COLS_COUNT }, (_, c) => {
                  const cl = sheet.cells[r][c]
                  const isSel = selected.r === r && selected.c === c
                  const isEditing = isSel && editing
                  return (
                    <td
                      key={c}
                      onClick={() => {
                        setSelected({ r, c })
                        setEditing(false)
                      }}
                      onDoubleClick={() => startEdit(r, c)}
                      style={{
                        minWidth: 100,
                        height: 22,
                        border: isSel
                          ? `2px solid ${K.accent}`
                          : '1px solid #e5e7eb',
                        background: isSel
                          ? 'rgba(91,94,244,0.05)'
                          : cl.fmt.bgColor || '#fff',
                        padding: '0 4px',
                        cursor: 'default',
                        position: 'relative',
                        color: cl.fmt.color || K.text,
                        fontWeight: cl.fmt.bold ? 700 : 400,
                        fontStyle: cl.fmt.italic ? 'italic' : 'normal',
                        textDecoration: cl.fmt.underline ? 'underline' : 'none',
                        textAlign: (cl.fmt.textAlign as any) || 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit()
                            if (e.key === 'Escape') setEditing(false)
                          }}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: 12,
                            fontFamily: 'monospace',
                            color: cl.fmt.color || K.text,
                          }}
                          autoFocus
                        />
                      ) : (
                        cl.v
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid #e5e7eb',
          background: '#f9fafb',
          flexShrink: 0,
          padding: '0 4px',
        }}
      >
        {sheets.map((s, i) => (
          <button
            key={i}
            onClick={() => setSheetIndex(i)}
            style={{
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: sheetIndex === i ? 700 : 500,
              color: sheetIndex === i ? K.accent : K.textSub,
              background: sheetIndex === i ? '#fff' : 'none',
              border: 'none',
              borderTop:
                sheetIndex === i
                  ? `2px solid ${K.accent}`
                  : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Outfit', system-ui, sans-serif",
              borderRadius: 0,
            }}
          >
            {s.name}
          </button>
        ))}
        <button
          onClick={() => {
            const n = makeEmptySheet(`Sheet${sheets.length + 1}`)
            setSheets([...sheets, n])
            setSheetIndex(sheets.length)
          }}
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: '1px solid #d1d5db',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: K.textMuted,
            marginLeft: 4,
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

// ─── RESOURCES VIEW ───────────────────────────────────────────────────────
function ResourcesView() {
  const resources = [
    {
      icon: '📖',
      bg: '#EEF2FF',
      title: 'Getting Started Guide',
      desc: 'Learn how to create your first AI-powered presentation in under 2 minutes.',
      link: 'Read guide',
    },
    {
      icon: '🎬',
      bg: '#ECFDF5',
      title: 'Video Tutorials',
      desc: 'Watch step-by-step video tutorials for all features including themes, customisation and exports.',
      link: 'Watch now',
    },
    {
      icon: '💡',
      bg: '#FFF7ED',
      title: 'Prompt Tips',
      desc: 'Master the art of writing prompts to get the best AI presentations every time.',
      link: 'View tips',
    },
    {
      icon: '🎨',
      bg: '#FFF1F2',
      title: 'Theme Customisation',
      desc: 'Learn how to customise colours, fonts, layouts and branding in your presentations.',
      link: 'Learn more',
    },
    {
      icon: '📤',
      bg: '#F0FDF4',
      title: 'Export & Share',
      desc: 'Export to PowerPoint, PDF or share a live link. Learn all export options available.',
      link: 'View docs',
    },
    {
      icon: '🔌',
      bg: '#EFF6FF',
      title: 'API & Integrations',
      desc: 'Integrate Kira AI into your own apps using our REST API. Full developer documentation.',
      link: 'API docs',
    },
  ]
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 60px' }}>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: K.text,
          marginBottom: 6,
          fontFamily: "'Outfit', system-ui, sans-serif",
        }}
      >
        Resources
      </h2>
      <p style={{ color: K.textMuted, fontSize: 14, marginBottom: 28 }}>
        Guides, tutorials, and tools to help you get the most out of Kira AI
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
        }}
      >
        {resources.map((r) => (
          <div
            key={r.title}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 22,
              border: `1.5px solid rgba(91,94,244,0.1)`,
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor = K.accent
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 6px 20px rgba(91,94,244,0.1)'
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'rgba(91,94,244,0.1)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(0)'
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 14,
                background: r.bg,
              }}
            >
              {r.icon}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: K.text,
                marginBottom: 6,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {r.title}
            </div>
            <div
              style={{ fontSize: 12.5, color: K.textMuted, lineHeight: 1.6 }}
            >
              {r.desc}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                marginTop: 12,
                fontSize: 12,
                fontWeight: 700,
                color: K.accent,
                cursor: 'pointer',
              }}
            >
              {r.link} <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN DOCUMENTS VIEW ──────────────────────────────────────────────────
type DocNavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: DocNavItem[] = [
  { id: 'presentation', label: 'AI Presentation', icon: <Monitor size={15} /> },
  { id: 'chatpdf', label: 'AI ChatPDF', icon: <FileText size={15} /> },
  { id: 'aichat', label: 'AI Chat', icon: <MessageSquare size={15} /> },
  { id: 'aisheets', label: 'AI Sheets', icon: <Table2 size={15} /> },
]

const NAV_OTHER: DocNavItem[] = [
  { id: 'files', label: 'Files', icon: <Folder size={15} /> },
  { id: 'history', label: 'Chat History', icon: <Clock size={15} /> },
  { id: 'resources', label: 'Resources', icon: <BookOpen size={15} /> },
]

export function DocumentsView() {
  const [activeNav, setActiveNav] = useState('presentation')

  const renderContent = () => {
    switch (activeNav) {
      case 'presentation':
        return <AIPresentationView />
      case 'chatpdf':
        return <AIChatPDFView />
      case 'aichat':
        return <AIChatView />
      case 'aisheets':
        return <AISheetsView />
      case 'resources':
        return <ResourcesView />
      default:
        return (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 40,
              color: K.textMuted,
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 48, opacity: 0.3 }}>📁</div>
            <div
              style={{
                fontWeight: 600,
                color: K.text,
                fontSize: 16,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              {NAV_OTHER.find((n) => n.id === activeNav)?.label ||
                'Coming Soon'}
            </div>
            <p
              style={{
                color: K.textMuted,
                fontSize: 13,
                maxWidth: 300,
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              This section will be available soon.
            </p>
          </div>
        )
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
      {/* ── Background: MainBG.png + overlays (matches Dashboard/SocialMedia) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: K.mainBg,
          zIndex: 0,
        }}
      />
      {/* Soft gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom right, rgba(238,241,246,0.55) 0%, rgba(229,238,255,0.35) 50%, rgba(255,255,255,0.2) 100%)',
          zIndex: 0,
        }}
      />
      {/* Top-right gradient blobs — exact match to DashboardView */}
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

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 200,
          minWidth: 200,
          height: '100vh',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(28px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
          borderRight: `1.5px solid rgba(255,255,255,0.85)`,
          boxShadow: '0 8px 32px rgba(91,94,244,0.10)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '20px 16px 16px',
            borderBottom: `1px solid rgba(91,94,244,0.08)`,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: K.btnBlue,
              boxShadow: K.btnBlueShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: K.text,
              letterSpacing: -0.3,
            }}
          >
            Documents
          </span>
        </div>

        {/* Nav scroll */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? K.accent : K.textSub,
                  cursor: 'pointer',
                  transition: 'all 0.17s',
                  border: `1px solid ${active ? 'rgba(91,94,244,0.15)' : 'transparent'}`,
                  background: active
                    ? 'linear-gradient(135deg,rgba(91,94,244,0.14),rgba(124,58,237,0.08))'
                    : 'none',
                  textAlign: 'left',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(91,94,244,0.06)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = K.text
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'none'
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.textSub
                  }
                }}
              >
                <span
                  style={{
                    color: active ? K.accent : K.textMuted,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}

          <div
            style={{
              height: 1,
              background: 'rgba(91,94,244,0.08)',
              margin: '8px 6px',
            }}
          />

          {NAV_OTHER.map((item) => {
            const active = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? K.accent : K.textSub,
                  cursor: 'pointer',
                  transition: 'all 0.17s',
                  border: `1px solid ${active ? 'rgba(91,94,244,0.15)' : 'transparent'}`,
                  background: active
                    ? 'linear-gradient(135deg,rgba(91,94,244,0.14),rgba(124,58,237,0.08))'
                    : 'none',
                  textAlign: 'left',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(91,94,244,0.06)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = K.text
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    ;(e.currentTarget as HTMLButtonElement).style.background =
                      'none'
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      K.textSub
                  }
                }}
              >
                <span
                  style={{
                    color: active ? K.accent : K.textMuted,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Quick-launch cards */}
        <div
          style={{
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div
            onClick={() => setActiveNav('presentation')}
            style={{
              borderRadius: 13,
              padding: '10px 11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg,#ec4899,#a855f7)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.opacity = '0.9')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.opacity = '1')
            }
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              ✨
            </div>
            Kira Skill
          </div>
          <div
            onClick={() => setActiveNav('aisheets')}
            style={{
              borderRadius: 13,
              padding: '10px 11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.opacity = '0.9')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.opacity = '1')
            }
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              📊
            </div>
            AI Sheets
          </div>
        </div>

        {/* Social row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderTop: `1px solid rgba(91,94,244,0.08)`,
          }}
        >
          {['▶', '𝕏', '⌂', 'R', '♪'].map((s) => (
            <div
              key={s}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: K.textMuted,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.color = K.accent)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.color = K.textMuted)
              }
            >
              {s}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <div
        style={{
          marginTop: 20,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
        }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            TOPBAR — matches DashboardView exactly:
            Left: title + subtitle | Right: Activity-Log-style btn, New-Task-style btn,
            bell icon (round), settings icon (round), profile avatar (round)
        ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 72,
            flexShrink: 0,
            borderBottom: `1px solid rgba(17,24,39,0.10)`,
          }}
        >
          {/* Left: title block */}
          <div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: '#111827',
                margin: 0,
                marginTop: '30px',

                fontFamily: "'Outfit', system-ui, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Documents
            </h1>
            <p
              style={{
                fontSize: 16,
                color: '#696D7D',
                margin: '2px 0 0',
                marginTop: '5px',
                marginBottom: '30px',

                fontWeight: 400,
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              Nice to see you again.
            </p>
          </div>

          {/* Right: buttons + icon row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Share button */}
              <button
                style={{
                  width: 140, // ← was 159
                  height: 45, // ← was 50
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '0 20px',
                  background: '#fff',
                  border: '1px solid rgba(17,24,39,0.10)',
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#111827',
                  cursor: 'pointer',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 4px 14px rgba(17,24,39,0.10)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 2px 8px rgba(17,24,39,0.06)')
                }
              >
                <Share2 size={18} />
                Share
              </button>

              <button
                style={{
                  width: 175, // ← increased from 159 to fit single line
                  height: 45,
                  whiteSpace: 'nowrap', // ← prevents text wrap
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '0 16px',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow:
                    'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                <Plus size={18} />
                New Document
              </button>
            </div>

            {/* Divider */}
            <div
              style={{
                width: 1,
                height: 30,
                background: 'rgba(17,24,39,0.10)',
              }}
            />

            {/* Icon buttons — unchanged */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
                }}
              >
                <img
                  src="/bell.png"
                  alt="Notifications"
                  style={{ width: 24, height: 24 }}
                />
              </button>
              <button
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
                }}
              >
                <img
                  src="/setting.png"
                  alt="Settings"
                  style={{ width: 24, height: 24 }}
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
                  boxShadow: '0 2px 8px rgba(17,24,39,0.06)',
                  cursor: 'pointer',
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
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default DocumentsView
