import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Share2,
  Download,
  ShoppingCart,
  Send,
  Paperclip,
  Mic,
  Calendar,
  ChevronRight,
  X,
  Star,
  Plane,
  Hotel,
  Car,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Thermometer,
  RefreshCw,
  Map,
  List,
  Zap,
  Search,
  Home,
  ArrowLeft,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = 'home' | 'planner'
type ChatMsg = {
  id: number
  role: 'user' | 'ai'
  html: string
  typing?: boolean
}
type DayKey = 1 | 2 | 3 | 4 | 5 | 6
type BookingTab =
  | 'hotels'
  | 'flights'
  | 'homes'
  | 'bundle'
  | 'activities'
  | 'transfer'

// ─── Constants ────────────────────────────────────────────────────────────────
const CURRENCIES = ['$ USD', '€ EUR', '£ GBP', 'د.إ AED']
const UNITS = ['°C', '°F']

const INITIAL_CHAT: ChatMsg[] = [
  {
    id: 1,
    role: 'user',
    html: 'Plan me a 5-day luxury trip to Shanghai for 2 travellers, end of May. Budget around $5K.',
  },
  {
    id: 2,
    role: 'ai',
    html: 'Drafting your <strong>5-Day Luxury Shanghai Escape</strong> now ✨ — pairing a 5-star riverside stay with curated cultural experiences and a private river cruise.',
  },
  {
    id: 3,
    role: 'user',
    html: "Actually, scrap the car rental — we won't need one.",
  },
  {
    id: 4,
    role: 'ai',
    html: "Done! I've ditched the car rental. In Shanghai you're better off with the metro or a cab — less worry, more time enjoying the view from the <strong>Park Hyatt</strong>.<br/><br/><strong>Updated plan:</strong><ul><li><strong>Flights:</strong> DXB → PVG (one stop) and a direct return.</li><li><strong>Hotel:</strong> 5 nights at the <strong>Park Hyatt Shanghai</strong>.</li><li><strong>Transfers:</strong> Private airport transfers kept so you arrive like a VIP.</li></ul>We saved some cash — want me to add a French Concession tour or VIP Huangpu cruise?",
  },
]

const DAY_DETAILS: Record<
  DayKey,
  {
    title: string
    meta: string
    items: { time: string; title: string; desc: string }[]
  }
> = {
  1: {
    title: 'Arrival and Evening Stroll on The Bund',
    meta: 'May 28 · 3 experiences',
    items: [
      {
        time: 'Arrival',
        title: 'Land at PVG · Pudong International',
        desc: 'Private VIP transfer waits at arrivals',
      },
      {
        time: '6:00 PM',
        title: 'Check-in at Park Hyatt Shanghai',
        desc: 'Welcome champagne in your Park Suite',
      },
      {
        time: '8:30 PM',
        title: 'Evening stroll on The Bund',
        desc: 'Iconic skyline views across the Huangpu',
      },
    ],
  },
  2: {
    title: 'Old Shanghai Charm and City Highlights',
    meta: 'May 29 · 4 experiences',
    items: [
      {
        time: '9:00 AM',
        title: 'Yuyuan Garden private tour',
        desc: 'Ming Dynasty garden with a local historian',
      },
      {
        time: '12:30 PM',
        title: 'Lunch at Lost Heaven',
        desc: 'Yunnan cuisine in a 1930s setting',
      },
      {
        time: '3:00 PM',
        title: 'Shanghai Museum guided visit',
        desc: 'Skip-the-line access · curator highlights',
      },
      {
        time: '7:30 PM',
        title: 'Dinner at Mr & Mrs Bund',
        desc: 'Modern French · riverside terrace',
      },
    ],
  },
  3: {
    title: 'Temples and Culinary Delights in the French Concession',
    meta: 'May 30 · 4 experiences',
    items: [
      {
        time: '9:30 AM',
        title: "Jing'an Temple visit",
        desc: 'Centuries-old Buddhist sanctuary',
      },
      {
        time: '12:00 PM',
        title: 'Private French Concession walking tour',
        desc: 'Plane-tree boulevards and Art Deco villas',
      },
      {
        time: '3:00 PM',
        title: 'Tea ceremony at Song Fang Maison de Thé',
        desc: 'Traditional Chinese tea curated by a master',
      },
      {
        time: '8:00 PM',
        title: 'Dinner at Ultraviolet by Paul Pairet',
        desc: '3-Michelin-star multi-sensory dining',
      },
    ],
  },
  4: {
    title: 'Modern Skyscrapers and River Cruise',
    meta: 'May 31 · 2 experiences',
    items: [
      {
        time: '10:00 AM',
        title: 'Shanghai Tower observation deck',
        desc: "World's 2nd tallest building · skip-the-line",
      },
      {
        time: '7:00 PM',
        title: 'VIP Huangpu River cruise',
        desc: 'Private deck with champagne service',
      },
    ],
  },
  5: {
    title: 'Culture and Acrobatics in the City',
    meta: 'Jun 1 · 2 experiences',
    items: [
      {
        time: '11:00 AM',
        title: 'Tianzifang artist district',
        desc: 'Hidden boutiques and contemporary galleries',
      },
      {
        time: '8:00 PM',
        title: 'ERA Acrobatic Show · VIP seats',
        desc: 'World-renowned Shanghai acrobatic troupe',
      },
    ],
  },
  6: {
    title: 'Departure Day',
    meta: 'Jun 2 · 1 experience',
    items: [
      {
        time: '11:00 AM',
        title: 'Late checkout from Park Hyatt',
        desc: 'Complimentary upgrade arranged',
      },
      {
        time: '3:00 PM',
        title: 'Private transfer to PVG',
        desc: 'Onward to flight SC8001 at 6:55 PM',
      },
    ],
  },
}

const TRIP_SUMMARY = `5-Day Luxury Shanghai Escape\n\nTrip Total: $4,102 · 2 travellers\nDates: 28 May – 2 Jun 2026\nHotel: Park Hyatt Shanghai (5 nights, $2,254)\nFlights: DXB → PVG, Qatar Airways, 1 stop ($1,768 roundtrip)\nTransfer: Private luxury sedan, door-to-door ($80)\n\nDay 1 — Arrival & The Bund\nDay 2 — Old Shanghai Charm\nDay 3 — Temples & French Concession\nDay 4 — Skyscrapers & River Cruise\nDay 5 — Culture & Acrobatics\nDay 6 — Departure\n\nCurated by Kira AI`

// ─── Design tokens (match App.tsx) ────────────────────────────────────────────
const BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(16px)',
  borderRadius: 16,
  border: '1px solid rgba(17,24,39,0.07)',
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ─── Shared App Header (matches DashboardView) ───────────────────────────────
function AppHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle: string
  onBack?: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid rgba(17,24,39,0.08)',
        background: 'rgba(255,255,255,0.0)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(17,24,39,0.08)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#696D7D',
            }}
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 500,
              margin: 0,
              color: '#000',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#696D7D',
              margin: '2px 0 0',
              fontWeight: 300,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            variant="outline"
            style={{
              width: 159,
              height: 50,
              gap: 10,
              paddingLeft: 20,
              paddingRight: 20,
              background: 'white',
              border: '1px solid rgba(17,24,39,0.1)',
              color: 'black',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src="/ActivityLog.png"
              alt=""
              style={{ width: 20, height: 20 }}
            />
            Activity Log
          </Button>
          <Button
            style={{
              width: 159,
              height: 50,
              gap: 4,
              paddingLeft: 16,
              paddingRight: 16,
              color: 'white',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 500,
              border: 'none',
              ...BTN_BLUE,
            }}
          >
            <img src="/NewTask.png" alt="" style={{ width: 20, height: 20 }} />
            New Task
          </Button>
        </div>
        <div
          style={{ width: 1, height: 30, background: 'rgba(17,24,39,0.1)' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
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
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
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
              background: 'white',
              overflow: 'hidden',
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
  )
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
const BOOKING_TABS: { id: BookingTab; label: string; icon: React.ReactNode }[] =
  [
    {
      id: 'hotels',
      label: 'Hotels',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          width={14}
          height={14}
        >
          <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
        </svg>
      ),
    },
    {
      id: 'flights',
      label: 'Flights',
      icon: <Plane size={14} />,
    },
    {
      id: 'homes',
      label: 'Homes & Apts',
      icon: <Home size={14} />,
    },
    {
      id: 'bundle',
      label: 'Flight + Hotel',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <Star size={14} />,
    },
    {
      id: 'transfer',
      label: 'Airport Transfer',
      icon: <Car size={14} />,
    },
  ]

const STAYS = [
  {
    name: 'Ubud',
    loc: 'Bali, Indonesia',
    badge: 'Lush jungles',
    gradient:
      'linear-gradient(180deg, #166534 0%, #15803d 30%, #fbbf24 60%, #d97706 100%)',
  },
  {
    name: 'Calvià',
    loc: 'Mallorca, Spain',
    badge: 'Crystal waters',
    gradient:
      'linear-gradient(180deg, #fef3c7 0%, #fbbf24 30%, #0891b2 65%, #0e7490 100%)',
  },
  {
    name: 'Miami',
    loc: 'Florida, United States',
    badge: 'Art Deco style',
    gradient:
      'linear-gradient(180deg, #fbbf24 0%, #fb923c 25%, #be185d 55%, #581c87 100%)',
  },
  {
    name: 'Miami Beach',
    loc: 'Florida, United States',
    badge: 'Relaxing beaches',
    gradient:
      'linear-gradient(180deg, #fef3c7 0%, #fed7aa 30%, #fb923c 60%, #c2410c 100%)',
  },
]

const QUICK_CHIPS = [
  'Create a new trip',
  'Inspire me where to go',
  'Plan a road trip',
  'Plan a last-minute escape',
]

function HomeScreen({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')
  const [bookingTab, setBookingTab] = useState<BookingTab>('hotels')
  const [stayTab, setStayTab] = useState(0)
  const [destInput, setDestInput] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const q =
      query.trim() ||
      'Plan me a 5-day luxury trip to Shanghai for 2 travellers, end of May. Budget around $5K.'
    onSearch(q)
  }

  return (
    <ScrollArea className="h-full">
      <div
        style={{
          marginTop: 50,
          padding: '0 48px 56px',
          background:
            'radial-gradient(800px 400px at 100% 10%, rgba(91,91,245,.04) 0%, transparent 60%), radial-gradient(600px 400px at 0% 30%, rgba(236,72,153,.03) 0%, transparent 60%)',
          minHeight: '100%',
        }}
      >
        {/* ── Hero query card ── */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              padding: '48px 56px',
              boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
              border: '1px solid rgba(17,24,39,0.06)',
            }}
          >
            <h1
              style={{
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: '0 0 10px',
                color: '#0f172a',
              }}
            >
              Hey Kobe, where are we
              <br />
              going today?
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
              Live prices, all in one place, and a human expert when you need
              one.
            </p>

            {/* Composer */}
            <div
              style={{
                background: 'white',
                border: '1px solid #dde1ea',
                borderRadius: 20,
                padding: '20px 22px 16px',
                marginBottom: 18,
                boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
              }}
            >
              <textarea
                ref={taRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Where do you want to go? e.g. '5-day luxury trip to Shanghai for 2 people'"
                rows={3}
                style={{
                  width: '100%',
                  border: 0,
                  outline: 0,
                  background: 'transparent',
                  resize: 'none',
                  fontFamily: 'inherit',
                  fontSize: 15,
                  color: '#0f172a',
                  lineHeight: 1.55,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 10,
                  borderTop: '1px solid #eaecf2',
                  marginTop: 8,
                }}
              >
                <button
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: 'transparent',
                    border: 0,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <Paperclip size={15} />
                </button>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: 'transparent',
                      border: 0,
                      display: 'grid',
                      placeItems: 'center',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    <Mic size={15} />
                  </button>
                  <button
                    onClick={handleSend}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: 0,
                      color: 'white',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      background: query.trim() ? '#5b5bf5' : '#94a3b8',
                      transition: 'background .15s',
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 18,
              }}
            >
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setQuery(c)
                    setTimeout(() => onSearch(c), 100)
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: '#f0e8ff',
                    border: 0,
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: '#1e293b',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all .15s',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              See how I can help you <ChevronRight size={12} />
            </div>
          </div>
        </div>

        {/* ── Book Manually Section ── */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
            color: '#0f172a',
          }}
        >
          Book your trip Manually
        </h2>

        <div
          style={{
            position: 'relative',
            background:
              'linear-gradient(135deg,#0c4a6e 0%,#0e7490 50%,#06b6d4 100%)',
            borderRadius: 24,
            overflow: 'hidden',
            padding: '38px 24px 28px',
            minHeight: 340,
            boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
            marginBottom: 32,
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 20% 80%, rgba(34,197,94,.3) 0%, transparent 30%), radial-gradient(circle at 85% 75%, rgba(34,197,94,.3) 0%, transparent 25%)',
            }}
          />
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '28%',
              zIndex: 1,
            }}
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0,0 L0,400 L200,400 L200,300 Q150,250 130,180 Q120,120 100,80 Q80,40 60,0 Z"
              fill="#14532d"
              opacity="0.4"
            />
            <path
              d="M0,150 Q50,140 100,180 Q150,220 200,250 L200,400 L0,400 Z"
              fill="#166534"
              opacity="0.3"
            />
          </svg>
          <svg
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '28%',
              zIndex: 1,
            }}
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M200,0 L200,400 L0,400 L0,300 Q50,250 70,180 Q80,120 100,80 Q120,40 140,0 Z"
              fill="#14532d"
              opacity="0.4"
            />
            <path
              d="M200,150 Q150,140 100,180 Q50,220 0,250 L0,400 L200,400 Z"
              fill="#166534"
              opacity="0.3"
            />
          </svg>

          <div
            style={{
              position: 'relative',
              zIndex: 5,
              color: 'white',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.18em',
              marginBottom: 14,
            }}
          >
            SEE THE WORLD FOR LESS WITH KIRA
          </div>

          {/* Booking card */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              background: 'white',
              borderRadius: 18,
              padding: '24px 32px',
              maxWidth: 1000,
              margin: '0 auto',
              boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
            }}
          >
            {/* Booking tabs */}
            <div
              style={{
                display: 'flex',
                gap: 28,
                justifyContent: 'center',
                paddingBottom: 14,
                borderBottom: '1px solid #eaecf2',
                marginBottom: 18,
              }}
            >
              {BOOKING_TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setBookingTab(t.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '6px 0',
                    fontSize: 13.5,
                    fontWeight: bookingTab === t.id ? 600 : 500,
                    color: bookingTab === t.id ? '#5b5bf5' : '#64748b',
                    cursor: 'pointer',
                    border: 0,
                    background: 'transparent',
                    fontFamily: 'inherit',
                    borderBottom:
                      bookingTab === t.id
                        ? '2px solid #5b5bf5'
                        : '2px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Subtabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {['Overnight Stays', 'Day Use Stays'].map((s, i) => (
                <button
                  key={s}
                  onClick={() => setStayTab(i)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: stayTab === i ? '#eeeefe' : 'transparent',
                    border: `1px solid ${stayTab === i ? '#eeeefe' : '#dde1ea'}`,
                    fontSize: 12,
                    fontWeight: 500,
                    color: stayTab === i ? '#5b5bf5' : '#1e293b',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all .15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Destination search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 16px',
                background: 'white',
                border: '1px solid #eaecf2',
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Enter a destination or property"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                style={{
                  flex: 1,
                  border: 0,
                  outline: 0,
                  background: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  color: '#0f172a',
                }}
              />
            </div>

            {/* Date fields */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: 'Check-in',
                  value: 'Mon, 28 May',
                  icon: <Calendar size={15} style={{ color: '#94a3b8' }} />,
                },
                {
                  label: 'Check-out',
                  value: 'Sat, 02 Jun',
                  icon: <Calendar size={15} style={{ color: '#94a3b8' }} />,
                },
                {
                  label: 'Guests & Rooms',
                  value: '2 adults · 1 room',
                  icon: <Users size={15} style={{ color: '#94a3b8' }} />,
                },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{
                    padding: '12px 14px',
                    background: 'white',
                    border: '1px solid #eaecf2',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {f.icon}
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                      {f.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {f.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSearch(destInput || 'luxury hotels in Shanghai')}
              style={{
                width: '100%',
                padding: 13,
                background: '#5b5bf5',
                color: 'white',
                border: 0,
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.18em',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background .15s',
              }}
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* ── Popular Destinations ── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 24,
            padding: 28,
            border: '1px solid rgba(17,24,39,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  color: '#0f172a',
                }}
              >
                Popular Destinations
              </h2>
              <p
                style={{
                  fontSize: 12.5,
                  color: '#64748b',
                  margin: '4px 0 18px',
                }}
              >
                Trending escapes curated by Kira
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              {['All', 'Luxury', 'Beach', 'City', 'Adventure'].map((tab, i) => (
                <button
                  key={tab}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 999,
                    background: i === 0 ? '#5b5bf5' : 'transparent',
                    border: `1px solid ${i === 0 ? '#5b5bf5' : '#dde1ea'}`,
                    color: i === 0 ? 'white' : '#1e293b',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 16,
            }}
          >
            {STAYS.map((s) => (
              <div
                key={s.name}
                onClick={() => onSearch(`Plan a luxury trip to ${s.name}`)}
                style={{ cursor: 'pointer', transition: 'transform .2s' }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform =
                    'translateY(-2px)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = 'none')
                }
              >
                <div
                  style={{
                    position: 'relative',
                    height: 170,
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: s.gradient,
                    marginBottom: 10,
                    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'rgba(15,23,42,.85)',
                      color: 'white',
                      padding: '4px 9px',
                      borderRadius: 6,
                      fontSize: 10.5,
                      fontWeight: 600,
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {s.badge}
                  </span>
                  {/* Decorative lines */}
                  <svg
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.15,
                    }}
                    viewBox="0 0 200 200"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="50"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: '0 0 3px',
                  }}
                >
                  {s.name}
                </div>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  {s.loc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

// ─── PLANNER SCREEN ───────────────────────────────────────────────────────────

const pillMini: React.CSSProperties = {
  padding: '7px 12px',
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(17,24,39,0.08)',
  borderRadius: 8,
  fontSize: 12.5,
  fontWeight: 500,
  cursor: 'pointer',
  color: '#374151',
  fontFamily: 'inherit',
  transition: 'all .15s',
}

function ChatPanel({
  chat,
  onSend,
  onChip,
  onOpenDates,
  onToast,
}: {
  chat: ChatMsg[]
  onSend: (msg: string) => void
  onChip: (msg: string) => void
  onOpenDates: () => void
  onToast: (msg: string) => void
}) {
  const [composer, setComposer] = useState('')
  const convRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (convRef.current)
      convRef.current.scrollTop = convRef.current.scrollHeight
  }, [chat])

  const send = () => {
    const v = composer.trim()
    if (!v) return
    onSend(v)
    setComposer('')
    if (taRef.current) taRef.current.style.height = 'auto'
  }

  const chips = [
    '✨ Add French Concession tour',
    '🛥 Add river cruise',
    '📅 Show itinerary',
    '🍷 Fine dining',
  ]

  return (
    <div
      style={{
        width: 380,
        minWidth: 380,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(17,24,39,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          borderBottom: '1px solid rgba(17,24,39,0.07)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              ...BTN_BLUE,
            }}
          >
            <Plane size={15} />
          </div>
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.01em',
            }}
          >
            Kira Travel
          </span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 999,
            background: '#111827',
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          <Star size={9} fill="currentColor" /> Premium
        </span>
      </div>

      {/* Conversation */}
      <div
        ref={convRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 20px 8px',
          scrollBehavior: 'smooth',
        }}
      >
        {chat.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 14,
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.typing ? (
              <div style={{ display: 'flex', gap: 4, padding: '10px 14px' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#3b82f6',
                      display: 'inline-block',
                      animation: `dot 1.2s ${i * 0.2}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            ) : msg.role === 'user' ? (
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 4px 14px',
                  maxWidth: '85%',
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  boxShadow: '0 2px 8px rgba(59,130,246,.25)',
                }}
                dangerouslySetInnerHTML={{ __html: msg.html }}
              />
            ) : (
              <div
                style={{
                  color: '#1e293b',
                  fontSize: 14,
                  lineHeight: 1.6,
                  maxWidth: '95%',
                }}
                dangerouslySetInnerHTML={{ __html: msg.html }}
              />
            )}
          </div>
        ))}

        <div
          style={{
            padding: '11px 14px',
            background: 'rgba(241,245,249,0.9)',
            border: '1px solid rgba(17,24,39,0.07)',
            borderRadius: 12,
            margin: '6px 0 14px',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
            5-Day Luxury Shanghai Escape
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
            Latest version · Version 2
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: '4px 20px 12px',
          flexShrink: 0,
        }}
      >
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => onChip(c)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(17,24,39,0.1)',
              fontSize: 12,
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div
        style={{
          margin: '0 16px 16px',
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(17,24,39,0.1)',
          borderRadius: 14,
          padding: '12px 12px 8px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <textarea
          ref={taRef}
          value={composer}
          onChange={(e) => {
            setComposer(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Ask anything... e.g. 'add a Michelin-star dinner on Day 3'"
          rows={1}
          style={{
            width: '100%',
            border: 0,
            outline: 0,
            background: 'transparent',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: 13.5,
            color: '#0f172a',
            minHeight: 36,
            maxHeight: 120,
            lineHeight: 1.5,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 6,
          }}
        >
          <div style={{ display: 'flex', gap: 2 }}>
            {[
              { Icon: Paperclip, action: () => onToast('Attach a file') },
              { Icon: Calendar, action: onOpenDates },
              { Icon: Mic, action: () => onToast('Voice input ready') },
            ].map(({ Icon, action }, i) => (
              <button
                key={i}
                onClick={action}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'transparent',
                  border: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
          <button
            onClick={send}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: 0,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              ...BTN_BLUE,
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dot {
          0%,80%,100%{transform:scale(.6);opacity:.4}
          40%{transform:scale(1);opacity:1}
        }
      `}</style>
    </div>
  )
}

function HeroCard() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 240,
        background:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        boxShadow: '0 4px 20px rgba(49,46,129,.25)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '24px 28px',
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236,72,153,.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -60,
          bottom: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <svg
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '45%',
          opacity: 0.35,
        }}
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 L0,140 L40,140 L40,90 L70,90 L70,120 L100,120 L100,60 L110,60 L110,40 L120,40 L120,60 L140,60 L140,100 L180,100 L180,80 L220,80 L220,130 L260,130 L260,70 L290,70 L290,50 L295,50 L295,30 L305,30 L305,50 L320,50 L320,90 L360,90 L360,110 L400,110 L400,60 L420,60 L420,30 L430,30 L430,10 L440,10 L440,30 L460,30 L460,80 L500,80 L500,120 L540,120 L540,90 L580,90 L580,60 L610,60 L610,40 L620,40 L620,20 L630,20 L630,40 L650,40 L650,90 L680,90 L680,130 L720,130 L720,100 L760,100 L760,140 L800,140 L800,200 Z"
          fill="#0c0a23"
        />
      </svg>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,.12)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '.05em',
            textTransform: 'uppercase' as const,
            border: '1px solid rgba(255,255,255,.16)',
            marginBottom: 12,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#a5b4fc',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />
          Curated by Kira
        </div>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 700,
            margin: '0 0 12px',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          5-Day Luxury Shanghai Escape
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 13,
            color: 'rgba(255,255,255,.85)',
          }}
        >
          {[
            { icon: <Calendar size={13} />, label: '5 days' },
            { icon: <MapPin size={13} />, label: '1 city' },
            { icon: <Star size={13} />, label: '16 experiences' },
            { icon: <Hotel size={13} />, label: '1 hotel' },
          ].map(({ icon, label }) => (
            <span
              key={label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              {icon}
              {label}
            </span>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Dubai', active: false },
            null,
            { label: 'Shanghai · 28 May – 2 Jun', active: true },
            null,
            { label: 'Dubai', active: false },
          ].map((item, i) =>
            item === null ? (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,.14)',
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid rgba(255,255,255,.2)',
                }}
              >
                <Plane size={10} style={{ color: '#fff' }} />
              </div>
            ) : (
              <span
                key={i}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: item.active ? '#fff' : 'rgba(255,255,255,.14)',
                  color: item.active ? '#1e1b4b' : '#fff',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: 500,
                  border: item.active
                    ? 'none'
                    : '1px solid rgba(255,255,255,.2)',
                }}
              >
                <MapPin size={11} />
                {item.label}
              </span>
            ),
          )}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}

function StatStrip() {
  const stats = [
    {
      label: 'Trip Total',
      value: '$4,102',
      sub: 'Under $5K budget',
      subColor: '#10b981',
      icon: <DollarSign size={16} />,
      iconBg: '#eef2ff',
      iconColor: '#4f46e5',
    },
    {
      label: 'Trip Length',
      value: '5 nights',
      sub: 'May 28 – Jun 2',
      subColor: '#94a3b8',
      icon: <Clock size={16} />,
      iconBg: '#fdf2f8',
      iconColor: '#ec4899',
    },
    {
      label: 'Avg Weather',
      value: '24°C',
      sub: 'Mild & sunny',
      subColor: '#94a3b8',
      icon: <Thermometer size={16} />,
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
    },
    {
      label: 'Kira Score',
      value: '9.4/10',
      sub: 'Highly recommended',
      subColor: '#10b981',
      icon: <Star size={16} />,
      iconBg: '#ecfeff',
      iconColor: '#06b6d4',
    },
  ]
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            ...CARD,
            padding: 18,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: s.iconBg,
              display: 'grid',
              placeItems: 'center',
              color: s.iconColor,
            }}
          >
            {s.icon}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#64748b',
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 12,
              color: s.subColor,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  )
}

function MapCard({ onToast }: { onToast: (m: string) => void }) {
  const pins = [
    { label: 'The Bund', left: '28%', top: '55%', num: '1', pink: false },
    { label: 'Yuyuan Garden', left: '50%', top: '65%', num: '2', pink: false },
    {
      label: 'French Concession',
      left: '40%',
      top: '40%',
      num: '3',
      pink: false,
    },
    { label: 'Shanghai Tower', left: '65%', top: '48%', num: '4', pink: false },
    { label: 'Park Hyatt', left: '72%', top: '62%', num: '★', pink: true },
  ]
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <h2
          style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#111827' }}
        >
          On the map
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onToast('Centered on Shanghai')}
            style={pillMini}
          >
            📍 Center
          </button>
          <button
            onClick={() => onToast('Showing all 16 experiences')}
            style={pillMini}
          >
            View all stops
          </button>
        </div>
      </div>
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div
          style={{
            position: 'relative',
            height: 240,
            background: '#eef2f8',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(59,130,246,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.05) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-5%',
              top: '30%',
              width: '55%',
              height: '55%',
              background: 'rgba(6,182,212,.12)',
              borderRadius: '50% 0 50% 0',
              transform: 'rotate(-20deg)',
              filter: 'blur(8px)',
            }}
          />
          <svg
            style={{ position: 'absolute', inset: 0, opacity: 0.4 }}
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 Q200,85 400,135 T800,120"
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M150,0 L160,240"
              stroke="#94a3b8"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M450,0 Q460,120 470,240"
              stroke="#94a3b8"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M0,170 L800,185"
              stroke="#94a3b8"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          {pins.map((p) => (
            <div
              key={p.label}
              onClick={() => onToast(p.label)}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                transform: 'translate(-50%,-100%)',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50% 50% 50% 0',
                  background: p.pink ? '#ec4899' : '#4f46e5',
                  transform: 'rotate(-45deg)',
                  display: 'grid',
                  placeItems: 'center',
                  border: '2px solid #fff',
                  boxShadow: `0 3px 10px ${p.pink ? 'rgba(236,72,153,.35)' : 'rgba(79,70,229,.35)'}`,
                }}
              >
                <span
                  style={{
                    transform: 'rotate(45deg)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                >
                  {p.num}
                </span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fff',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,.1)',
                  border: '1px solid rgba(17,24,39,0.07)',
                  color: '#1e293b',
                }}
              >
                {p.label}
              </div>
            </div>
          ))}
          <button
            onClick={() => onToast('Opening full map')}
            style={{
              position: 'absolute',
              right: 12,
              bottom: 12,
              padding: '6px 12px',
              background: '#fff',
              border: '1px solid rgba(17,24,39,0.1)',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              color: '#374151',
              boxShadow: '0 1px 4px rgba(0,0,0,.06)',
            }}
          >
            <Map size={12} /> View full map
          </button>
        </div>
      </div>
    </div>
  )
}

function DayCard({
  num,
  title,
  date,
  count,
  gradient,
  onClick,
}: {
  num: string
  title: string
  date: string
  count: number
  gradient: string
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(17,24,39,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .15s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = '#3b82f6'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 2px 12px rgba(59,130,246,.1)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor =
          'rgba(17,24,39,0.07)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      <div style={{ height: 70, background: gradient, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: 7,
            top: 7,
            background: 'rgba(255,255,255,.9)',
            color: '#111827',
            width: 22,
            height: 22,
            borderRadius: 6,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          {num}
        </div>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: 5,
              background: '#eef2ff',
              color: '#4f46e5',
            }}
          >
            Day {num}
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            {count} exp · {date}
          </span>
        </div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ paddingRight: 14, color: '#94a3b8' }}>
        <ChevronRight size={16} />
      </div>
    </div>
  )
}

function FlightCard({
  airline,
  from,
  fromTime,
  to,
  toTime,
  duration,
  stops,
  price,
  priceLabel,
  onChange,
  onRemove,
}: {
  airline: string
  from: string
  fromTime: string
  to: string
  toTime: string
  duration: string
  stops: string
  price: string
  priceLabel: string
  onChange: () => void
  onRemove: () => void
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(17,24,39,0.08)',
        borderRadius: 12,
        padding: 18,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 10,
            background: '#eef2ff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 9.5,
            color: '#4f46e5',
            letterSpacing: '.04em',
          }}
        >
          {airline}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: '#111827',
              }}
            >
              {from}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {fromTime}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
              {duration}
            </div>
            <div
              style={{
                height: 1.5,
                background: '#e2e8f0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Plane size={10} style={{ color: '#fff' }} />
              </div>
            </div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 4 }}>
              {stops}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: '#111827',
              }}
            >
              {to}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {toTime}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px solid rgba(17,24,39,0.06)',
        }}
      >
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {price}
          </span>
          <span style={{ fontSize: 11.5, color: '#64748b', marginLeft: 6 }}>
            {priceLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onChange}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(17,24,39,0.1)',
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={11} /> Change
          </button>
          <button
            onClick={onRemove}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(17,24,39,0.1)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: '#94a3b8',
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  children,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative', paddingLeft: 42, marginBottom: 22 }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 30,
          height: 30,
          borderRadius: 8,
          background: iconBg,
          color: iconColor,
          display: 'grid',
          placeItems: 'center',
          border: '2px solid #fff',
          boxShadow: '0 0 0 1px rgba(17,24,39,0.08)',
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: '#111827',
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
        {sub}
      </div>
      {children}
    </div>
  )
}

function PlannerPanel({
  chat,
  currencyIdx,
  unitsIdx,
  onCycleCurrency,
  onCycleUnits,
  onToast,
  onSend,
  onChip,
  onOpenDates,
}: {
  chat: ChatMsg[]
  currencyIdx: number
  unitsIdx: number
  onCycleCurrency: () => void
  onCycleUnits: () => void
  onToast: (msg: string) => void
  onSend: (msg: string) => void
  onChip: (msg: string) => void
  onOpenDates: () => void
}) {
  const [detailDay, setDetailDay] = useState<DayKey | null>(null)

  const DAY_CONFIGS = [
    {
      num: '1',
      title: 'Arrival and Evening Stroll on The Bund',
      date: 'May 28',
      count: 3,
      gradient: 'linear-gradient(135deg,#fbbf24,#f97316)',
    },
    {
      num: '2',
      title: 'Old Shanghai Charm and City Highlights',
      date: 'May 29',
      count: 4,
      gradient: 'linear-gradient(135deg,#fed7aa,#c2410c)',
    },
    {
      num: '3',
      title: 'Temples & Culinary Delights',
      date: 'May 30',
      count: 4,
      gradient: 'linear-gradient(135deg,#ef4444,#7c2d12)',
    },
    {
      num: '4',
      title: 'Modern Skyscrapers and River Cruise',
      date: 'May 31',
      count: 2,
      gradient: 'linear-gradient(135deg,#0ea5e9,#4338ca)',
    },
    {
      num: '5',
      title: 'Culture and Acrobatics',
      date: 'Jun 1',
      count: 2,
      gradient: 'linear-gradient(135deg,#ec4899,#be185d)',
    },
    {
      num: '6',
      title: 'Departure Day',
      date: 'Jun 2',
      count: 1,
      gradient: 'linear-gradient(135deg,#fb923c,#7c2d12)',
    },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      {/* LEFT: Chat */}
      <ChatPanel
        chat={chat}
        onSend={onSend}
        onChip={onChip}
        onOpenDates={onOpenDates}
        onToast={onToast}
      />

      {/* RIGHT: Trip details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
        {/* Currency/unit strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 6,
            marginBottom: 16,
          }}
        >
          <button onClick={onCycleCurrency} style={pillMini}>
            {CURRENCIES[currencyIdx]}
          </button>
          <button onClick={onCycleUnits} style={pillMini}>
            {UNITS[unitsIdx]}
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <HeroCard />
        </div>
        <div style={{ marginBottom: 20 }}>
          <StatStrip />
        </div>
        <div style={{ marginBottom: 20 }}>
          <MapCard onToast={onToast} />
        </div>

        {/* Timeline */}
        <div style={{ ...CARD, padding: '22px 22px 12px', marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 700,
                margin: 0,
                color: '#111827',
              }}
            >
              Your journey
            </h2>
            <button
              onClick={() => onToast('Compact view toggled')}
              style={{
                ...pillMini,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <List size={12} /> Compact view
            </button>
          </div>

          <div style={{ position: 'relative', paddingLeft: 0 }}>
            <div
              style={{
                position: 'absolute',
                left: 15,
                top: 8,
                bottom: 8,
                width: 2,
                background: 'rgba(17,24,39,0.08)',
                borderRadius: 2,
              }}
            />

            <TimelineItem
              icon={<Plane size={13} />}
              iconBg="#eef2ff"
              iconColor="#4f46e5"
              title="Arrive · DXB → PVG"
              sub="May 28 · Qatar Airways · 1 stop"
            >
              <FlightCard
                airline="QATAR"
                from="DXB"
                fromTime="May 28, 11:45 PM"
                to="PVG +1"
                toTime="May 29, 4:40 PM"
                duration="12h 55m"
                stops="1 stop · Doha"
                price="$1,768"
                priceLabel="Roundtrip · 2 pax"
                onChange={() => onToast('Opening flight alternatives')}
                onRemove={() => {
                  if (window.confirm('Remove flight?'))
                    onToast('Flight removed')
                }}
              />
            </TimelineItem>

            <TimelineItem
              icon={<Car size={13} />}
              iconBg="#111827"
              iconColor="#fff"
              title="Private 1-Way Airport Transfer"
              sub="May 29 · Travel time: 1 hour"
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(17,24,39,0.08)',
                  borderRadius: 12,
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg,#ddd6fe,#c7d2fe)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Car size={32} style={{ color: '#4f46e5', opacity: 0.7 }} />
                </div>
                <div
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: '#111827',
                      }}
                    >
                      Luxury Sedan · Door-to-Door
                    </div>
                    <div
                      style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}
                    >
                      English-speaking driver · Bottled water · WiFi
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        $80
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: '#64748b',
                          marginLeft: 5,
                        }}
                      >
                        per group
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => onToast('Browsing transfers')}
                        style={{
                          ...pillMini,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                        }}
                      >
                        <RefreshCw size={10} /> Change
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Remove transfer?'))
                            onToast('Transfer removed')
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          background: '#fff',
                          border: '1px solid rgba(17,24,39,0.1)',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TimelineItem>

            <TimelineItem
              icon={<Hotel size={13} />}
              iconBg="#ecfdf5"
              iconColor="#10b981"
              title="Stay · Park Hyatt Shanghai"
              sub="May 28 – Jun 2 · 5 nights"
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(17,24,39,0.08)',
                  borderRadius: 12,
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background:
                      'linear-gradient(160deg,#312e81,#6366f1,#ec4899)',
                    position: 'relative',
                    minHeight: 140,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: 10,
                      color: '#fbbf24',
                      fontSize: 11,
                    }}
                  >
                    ★★★★★
                  </div>
                </div>
                <div
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14.5,
                        color: '#111827',
                      }}
                    >
                      Park Hyatt Shanghai
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <span
                        style={{
                          background: '#ecfdf5',
                          color: '#10b981',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 11.5,
                          fontWeight: 600,
                        }}
                      >
                        9.0 · Very Good
                      </span>
                    </div>
                    <div
                      style={{
                        background: '#eef2ff',
                        border: '1px solid #e0e7ff',
                        borderRadius: 8,
                        padding: '7px 10px',
                        fontSize: 12,
                        color: '#374151',
                        marginTop: 8,
                        lineHeight: 1.45,
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <Zap
                        size={11}
                        style={{
                          color: '#4f46e5',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      5-star riverside luxury — soaring views, world-class spa,
                      two Michelin-mentioned restaurants.
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        $2,254
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          color: '#64748b',
                          marginLeft: 5,
                        }}
                      >
                        Incl. taxes & fees
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => onToast('Browsing hotels')}
                        style={{
                          ...pillMini,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                        }}
                      >
                        <RefreshCw size={10} /> Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TimelineItem>

            <TimelineItem
              icon={<Calendar size={13} />}
              iconBg="#fffbeb"
              iconColor="#f59e0b"
              title="Itinerary · Day-by-Day"
              sub="Click any day to view full details"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DAY_CONFIGS.map((d) => (
                  <DayCard
                    key={d.num}
                    num={d.num}
                    title={d.title}
                    date={d.date}
                    count={d.count}
                    gradient={d.gradient}
                    onClick={() => setDetailDay(parseInt(d.num) as DayKey)}
                  />
                ))}
              </div>
            </TimelineItem>

            <TimelineItem
              icon={<Plane size={13} style={{ transform: 'rotate(45deg)' }} />}
              iconBg="#eef2ff"
              iconColor="#4f46e5"
              title="Depart · PVG → DXB"
              sub="Jun 2 · Sichuan Airlines · 2 stops"
            >
              <FlightCard
                airline="SICH"
                from="PVG"
                fromTime="Jun 02, 6:55 PM"
                to="DXB +1"
                toTime="Jun 03, 10:15 AM"
                duration="19h 20m"
                stops="2 stops"
                price="Included"
                priceLabel="in roundtrip total"
                onChange={() => onToast('Searching return options')}
                onRemove={() => {
                  if (window.confirm('Remove return flight?'))
                    onToast('Return flight removed')
                }}
              />
            </TimelineItem>
          </div>
        </div>
      </div>

      {/* Day detail side panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          maxWidth: '100%',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          boxShadow: '-12px 0 40px rgba(15,23,42,.12)',
          transform: detailDay ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
          zIndex: 90,
          overflowY: 'auto',
          padding: 24,
        }}
      >
        {detailDay &&
          (() => {
            const data = DAY_DETAILS[detailDay]
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: '-0.01em',
                        color: '#111827',
                      }}
                    >
                      Day {detailDay} · {data.title}
                    </h3>
                    <div
                      style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}
                    >
                      {data.meta}
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailDay(null)}
                    style={{
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: 4,
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {data.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 12,
                        padding: 14,
                        border: '1px solid rgba(17,24,39,0.08)',
                        borderRadius: 10,
                        background: 'rgba(248,250,252,0.8)',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLDivElement).style.borderColor =
                          '#3b82f6'
                        ;(e.currentTarget as HTMLDivElement).style.background =
                          '#eef2ff'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLDivElement).style.borderColor =
                          'rgba(17,24,39,0.08)'
                        ;(e.currentTarget as HTMLDivElement).style.background =
                          'rgba(248,250,252,0.8)'
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: '#4f46e5',
                          background: '#eef2ff',
                          padding: '4px 8px',
                          borderRadius: 6,
                          height: 'fit-content',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.time}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13.5,
                            color: '#111827',
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#64748b',
                            lineHeight: 1.5,
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TravelPlaner() {
  const [screen, setScreen] = useState<Screen>('home')
  const [chat, setChat] = useState<ChatMsg[]>(INITIAL_CHAT)
  const [currencyIdx, setCurrencyIdx] = useState(0)
  const [unitsIdx, setUnitsIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast({ msg, show: true })
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2400,
    )
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleSearch = (_query: string) => {
    // Inject user message and transition to planner
    setChat([...INITIAL_CHAT])
    setScreen('planner')
    setTimeout(() => {
      setChat((c) => [...c])
    }, 50)
  }

  const sendMessage = (text: string) => {
    const userMsg: ChatMsg = { id: Date.now(), role: 'user', html: esc(text) }
    const typing: ChatMsg = {
      id: Date.now() + 1,
      role: 'ai',
      html: '',
      typing: true,
    }
    setChat((c) => [...c, userMsg, typing])
    setTimeout(() => {
      setChat((c) => [
        ...c.filter((m) => !m.typing),
        {
          id: Date.now() + 2,
          role: 'ai',
          html: "Got it — I've folded that into your plan. Anything else you'd like to refine?",
        },
      ])
    }, 900)
  }

  const shareTrip = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(TRIP_SUMMARY)
        .then(() => showToast('Trip summary copied to clipboard'))
    } else {
      showToast('Copy your trip summary from the page')
    }
  }

  const downloadTrip = () => {
    const blob = new Blob([TRIP_SUMMARY], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Kira-Shanghai-Trip.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    showToast('Trip downloaded')
  }

  const bookTrip = () => {
    if (
      window.confirm(
        'Book the entire trip for $4,102? An expert will review and confirm all bookings.',
      )
    ) {
      showToast('Connecting you to a Kira travel expert...')
    }
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
        background: 'url("/MainBG.png") center right / cover no-repeat',
        position: 'relative',
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 600,
          height: 600,
          background:
            'radial-gradient(ellipse at top right, rgba(196,181,253,0.4) 0%, rgba(147,197,253,0.3) 40%, transparent 70%)',
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
            'radial-gradient(ellipse at top right, rgba(216,180,254,0.35) 0%, rgba(186,230,253,0.25) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Consistent App Header */}
      <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
        <AppHeader
          title={
            screen === 'home'
              ? 'Travel Planner'
              : '5-Day Luxury Shanghai Escape'
          }
          subtitle={
            screen === 'home'
              ? 'Plan your perfect trip with AI'
              : 'AI-curated · 2 travellers · May 28 – Jun 2'
          }
          onBack={screen === 'planner' ? () => setScreen('home') : undefined}
        />
      </div>

      {/* Body */}
      <div
        style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}
      >
        {screen === 'home' ? (
          <HomeScreen onSearch={handleSearch} />
        ) : (
          <div
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <PlannerPanel
              chat={chat}
              currencyIdx={currencyIdx}
              unitsIdx={unitsIdx}
              onCycleCurrency={() => {
                const i = (currencyIdx + 1) % CURRENCIES.length
                setCurrencyIdx(i)
                showToast('Currency: ' + CURRENCIES[i])
              }}
              onCycleUnits={() => {
                const i = (unitsIdx + 1) % UNITS.length
                setUnitsIdx(i)
                showToast('Temperature: ' + UNITS[i])
              }}
              onToast={showToast}
              onSend={sendMessage}
              onChip={sendMessage}
              onOpenDates={() => setModalOpen(true)}
            />

            {/* Footer */}
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(17,24,39,0.08)',
              }}
            >
              <div>
                <div
                  style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}
                >
                  Trip Total · 2 travellers
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  $4,102
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={shareTrip}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(17,24,39,0.1)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#374151',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <Share2 size={14} /> Share
                </button>
                <button
                  onClick={downloadTrip}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(17,24,39,0.1)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#374151',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                  }}
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={bookTrip}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'inherit',
                    ...BTN_BLUE,
                  }}
                >
                  <ShoppingCart size={14} /> Book Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date modal */}
      {modalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15,23,42,.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: 24,
              boxShadow: '0 12px 40px rgba(15,23,42,.15)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 4,
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  color: '#111827',
                }}
              >
                Adjust your trip dates
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 18px' }}>
              Update the dates and I'll restructure the entire itinerary.
            </p>
            {[
              { label: 'Departure', id: 'dep', defaultValue: '2026-05-28' },
              { label: 'Return', id: 'ret', defaultValue: '2026-06-02' },
            ].map((f) => (
              <div key={f.id} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  {f.label}
                </label>
                <input
                  type="date"
                  defaultValue={f.defaultValue}
                  id={f.id}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontFamily: 'inherit',
                    fontSize: 13.5,
                    outline: 'none',
                    color: '#111827',
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#374151',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Travellers
              </label>
              <select
                defaultValue="2"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  outline: 'none',
                  color: '#111827',
                }}
              >
                <option value="1">1 traveller</option>
                <option value="2">2 travellers</option>
                <option value="3">3 travellers</option>
                <option value="4">4+ travellers</option>
              </select>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'flex-end',
                marginTop: 14,
              }}
            >
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: '#374151',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const dep =
                    (document.getElementById('dep') as HTMLInputElement)
                      ?.value || ''
                  const ret =
                    (document.getElementById('ret') as HTMLInputElement)
                      ?.value || ''
                  showToast('Trip updated · ' + dep + ' → ' + ret)
                  setModalOpen(false)
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'inherit',
                  ...BTN_BLUE,
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          left: '50%',
          transform: toast.show
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(80px)',
          background: '#111827',
          color: '#fff',
          padding: '11px 18px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(15,23,42,.2)',
          zIndex: 200,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          opacity: toast.show ? 1 : 0,
          transition: 'transform .3s cubic-bezier(.2,.8,.2,1), opacity .2s',
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: '#10b981' }}>✓</span>
        <span>{toast.msg}</span>
      </div>
    </div>
  )
}
