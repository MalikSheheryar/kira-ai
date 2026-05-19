import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react'

// ── Design tokens (mirrors App.tsx) ─────────────────────────────────────────
const BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}

// ── Animated Logo ─────────────────────────────────────────────────────────────
function AnimatedLogo({ visible }: { visible: boolean }) {
  const [shimmer, setShimmer] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer(true)
      setTimeout(() => setShimmer(false), 1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(30px) scale(0.92)',
        transition: 'all 0.85s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 120,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(196,181,253,0.45) 0%, rgba(59,130,246,0.25) 50%, transparent 80%)',
            filter: 'blur(28px)',
            animation: 'logoPulse 3s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 180,
            height: 80,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse, rgba(167,139,250,0.5) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'logoPulse 3s ease-in-out infinite 1.5s',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            filter: shimmer
              ? 'brightness(0) invert(1) drop-shadow(0 0 18px rgba(196,181,253,0.9)) drop-shadow(0 0 40px rgba(99,102,241,0.7))'
              : 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(196,181,253,0.5)) drop-shadow(0 0 24px rgba(99,102,241,0.4))',
            transition: 'filter 0.5s ease',
            animation: 'logoFloat 4s ease-in-out infinite',
          }}
        >
          <img
            src="/beeda-logo.png"
            alt="Kira AI"
            style={{
              height: 72,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
      `}</style>
    </div>
  )
}

// ── Floating particle field ───────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.parentElement!.offsetWidth * 2
    const H = canvas.parentElement!.offsetHeight * 2
    canvas.width = W
    canvas.height = H
    canvas.style.width = `${W / 2}px`
    canvas.style.height = `${H / 2}px`

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.15 + Math.random() * 0.4,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()
      })
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}

// ── Select wrapper ─────────────────────────────────────────────────────────
function SelectField({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string
  icon: React.ComponentType<any>
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#374151',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon
          size={15}
          style={{
            position: 'absolute',
            left: 13,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6366f1',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 36px 11px 38px',
            borderRadius: 14,
            border: '1.5px solid rgba(99,102,241,0.18)',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            fontSize: 13.5,
            color: value ? '#111827' : '#9ca3af',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: '0 1px 4px rgba(99,102,241,0.06)',
          }}
        >
          {options.map((o) => (
            <option key={o} value={o === options[0] ? '' : o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{
            position: 'absolute',
            right: 13,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}

// ── Input field ────────────────────────────────────────────────────────────
function InputField({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  suffix,
}: {
  label: string
  icon: React.ComponentType<any>
  type?: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  suffix?: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#374151',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon
          size={15}
          style={{
            position: 'absolute',
            left: 13,
            top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? '#6366f1' : '#9ca3af',
            transition: 'color 0.2s',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '11px 36px 11px 38px',
            borderRadius: 14,
            border: `1.5px solid ${focused ? '#6366f1' : 'rgba(99,102,241,0.18)'}`,
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(8px)',
            fontSize: 13.5,
            color: '#111827',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused
              ? '0 0 0 3px rgba(99,102,241,0.12)'
              : '0 1px 4px rgba(99,102,241,0.06)',
            boxSizing: 'border-box',
          }}
        />
        {suffix && (
          <div
            style={{
              position: 'absolute',
              right: 13,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Step indicator ─────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 8,
            background:
              i === current
                ? 'linear-gradient(90deg,#6366f1,#3b82f6)'
                : i < current
                  ? '#6366f1'
                  : 'rgba(99,102,241,0.18)',
            transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      ))}
    </div>
  )
}

// ── Animated feature pill ──────────────────────────────────────────────────
function FeaturePill({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 14px',
        borderRadius: 40,
        background: 'rgba(255,255,255,0.13)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.22)',
        fontSize: 12.5,
        color: '#fff',
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <Check size={12} strokeWidth={2.5} style={{ color: '#a5f3fc' }} />
      {text}
    </div>
  )
}

// ── MAIN SIGNUP PAGE ───────────────────────────────────────────────────────
export default function SignUpPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [orbLoaded, setOrbLoaded] = useState(false)

  // Step 0 — Account
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [signMethod, setSignMethod] = useState<'email' | 'phone'>('email')

  // Step 1 — Personal
  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [sex, setSex] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setOrbLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  const passwordStrength = (() => {
    if (password.length === 0) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]
  const strengthColor = ['', '#f87171', '#fbbf24', '#34d399', '#6366f1'][
    passwordStrength
  ]

  const countries = [
    'Select Country',
    'Pakistan',
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'India',
    'Saudi Arabia',
    'Other',
  ]

  const ageRanges = [
    'Select Age Range',
    '13–17',
    '18–24',
    '25–34',
    '35–44',
    '45–54',
    '55–64',
    '65+',
  ]
  const sexOptions = [
    'Select',
    'Male',
    'Female',
    'Non-binary',
    'Prefer not to say',
  ]

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{
          width: '42%',
          minWidth: 380,
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 60%, #4f46e5 100%)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Noise texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        {/* MainBG.png blended in */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("/MainBG.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            opacity: 0.08,
            zIndex: 0,
            mixBlendMode: 'screen',
          }}
        />

        {/* Particles */}
        <ParticleField />

        {/* Blobs */}
        <div
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(196,181,253,0.35) 0%, transparent 70%)',
            top: -80,
            right: -100,
            zIndex: 1,
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
            bottom: -60,
            left: -80,
            zIndex: 1,
            filter: 'blur(50px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            padding: '0 48px',
          }}
        >
          <AnimatedLogo visible={orbLoaded} />

          <div
            style={{
              textAlign: 'center',
              opacity: orbLoaded ? 1 : 0,
              transform: orbLoaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.2s',
            }}
          >
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 10px',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              Your AI-Powered
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg,#a5f3fc,#c4b5fd,#93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Everything App
              </span>
            </h1>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
              }}
            >
              Automate, create, and collaborate — all in one place.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <FeaturePill text="Email Agent" delay={500} />
              <FeaturePill text="AI Workflows" delay={680} />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <FeaturePill text="Smart Calendar" delay={860} />
              <FeaturePill text="AI Coder" delay={1040} />
            </div>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <FeaturePill text="Finance Tracker" delay={1220} />
              <FeaturePill text="Meal Planner" delay={1400} />
            </div>
          </div>
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            zIndex: 2,
            letterSpacing: '0.04em',
          }}
        >
          © 2026 Beeda Inc. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f7ff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient sweep — violet/purple/blue only, no pink */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -40,
            width: '30%',
            height: 300,
            borderRadius: '0 0 50% 90%',
            background:
              'linear-gradient(125deg, rgba(139,92,246,0.55) 0%, rgba(167,139,250,0.5) 25%, rgba(196,181,253,0.4) 50%, rgba(99,179,237,0.3) 75%, transparent 100%)',
            filter: 'blur(28px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Tight bright core at top-right corner */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 220,
            height: 200,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at top right, rgba(216,180,254,0.75) 0%, rgba(139,92,246,0.5) 30%, rgba(99,179,237,0.25) 65%, transparent 85%)',
            filter: 'blur(10px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Card */}
        <div
          style={{
            width: '100%',
            maxWidth: 490,
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(22px)',
            borderRadius: 28,
            border: '1px solid rgba(17,24,39,0.08)',
            boxShadow:
              '0 4px 6px rgba(0,0,0,0.03), 0 20px 60px rgba(99,102,241,0.08)',
            padding: '38px 40px 36px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...BTN_BLUE,
                    }}
                  >
                    <Sparkles size={14} color="#fff" />
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}
                  >
                    {step === 0
                      ? 'Create Account'
                      : step === 1
                        ? 'Your Profile'
                        : 'All Set!'}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step === 0 && 'Welcome to Kira AI'}
                  {step === 1 && 'Tell us about you'}
                  {step === 2 && "You're all set! 🎉"}
                </h2>
                <p
                  style={{ fontSize: 13, color: '#696D7D', margin: '4px 0 0' }}
                >
                  {step === 0 &&
                    'Sign up to get started — it only takes a minute.'}
                  {step === 1 && 'Help us personalize your Kira experience.'}
                  {step === 2 &&
                    'Your account is ready. Launching your dashboard…'}
                </p>
              </div>
              <StepDots current={step} total={3} />
            </div>
          </div>

          {/* ── STEP 0: Account ── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Sign-in method toggle */}
              <div
                style={{
                  display: 'flex',
                  background: '#f3f4f6',
                  borderRadius: 14,
                  padding: 4,
                  gap: 4,
                  marginBottom: 2,
                }}
              >
                {(['email', 'phone'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSignMethod(m)}
                    style={{
                      flex: 1,
                      padding: '9px 0',
                      borderRadius: 11,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      transition: 'all 0.22s',
                      background: signMethod === m ? '#fff' : 'transparent',
                      color: signMethod === m ? '#111827' : '#9ca3af',
                      boxShadow:
                        signMethod === m
                          ? '0 1px 4px rgba(0,0,0,0.08)'
                          : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 7,
                    }}
                  >
                    {m === 'email' ? (
                      <>
                        <Mail size={14} style={{ flexShrink: 0 }} /> Email
                      </>
                    ) : (
                      <>
                        <Phone size={14} style={{ flexShrink: 0 }} /> Phone
                      </>
                    )}
                  </button>
                ))}
              </div>

              {signMethod === 'email' ? (
                <InputField
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={setEmail}
                />
              ) : (
                <InputField
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={setPhone}
                />
              )}

              <InputField
                label="Password"
                icon={Lock}
                type={showPass ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={setPassword}
                suffix={
                  <button
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: '#9ca3af',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Password strength */}
              {password.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: -4,
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 4,
                        background:
                          i <= passwordStrength ? strengthColor : '#e5e7eb',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontSize: 11,
                      color: strengthColor,
                      fontWeight: 600,
                      minWidth: 40,
                    }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}

              <InputField
                label="Confirm Password"
                icon={Lock}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirm}
                onChange={setConfirm}
                suffix={
                  <button
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      color: '#9ca3af',
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <button
                onClick={() => setStep(1)}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 4,
                  fontFamily: 'inherit',
                  transition: 'opacity 0.2s, transform 0.15s',
                  ...BTN_BLUE,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.92'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Continue <ArrowRight size={16} />
              </button>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: 12.5,
                  color: '#9ca3af',
                  margin: '2px 0 0',
                }}
              >
                Already have an account?{' '}
                <a
                  href="#"
                  style={{
                    color: '#6366f1',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          )}

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <InputField
                label="Username"
                icon={User}
                placeholder="@yourhandle"
                value={username}
                onChange={setUsername}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <SelectField
                  label="Age Range"
                  icon={User}
                  options={ageRanges}
                  value={ageRange}
                  onChange={setAgeRange}
                />
                <SelectField
                  label="Sex"
                  icon={User}
                  options={sexOptions}
                  value={sex}
                  onChange={setSex}
                />
              </div>

              <SelectField
                label="Country"
                icon={Globe}
                options={countries}
                value={country}
                onChange={setCountry}
              />

              <InputField
                label="Address"
                icon={MapPin}
                placeholder="Street address, city, ZIP"
                value={address}
                onChange={setAddress}
              />

              <InputField
                label="Telephone Number"
                icon={Phone}
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={setPhone}
              />

              {/* Terms */}
              <div
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    border: '2px solid #6366f1',
                    background: '#6366f1',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  <Check size={11} color="#fff" strokeWidth={3} />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#696D7D',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  I agree to Kira's{' '}
                  <a
                    href="#"
                    style={{
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    style={{
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '13px 20px',
                    borderRadius: 16,
                    border: '1.5px solid rgba(17,24,39,0.12)',
                    background: '#fff',
                    color: '#374151',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '13px 0',
                    borderRadius: 16,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: 'inherit',
                    transition: 'opacity 0.2s, transform 0.15s',
                    ...BTN_BLUE,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.92'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Create My Account <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Done ── */}
          {step === 2 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
                padding: '16px 0',
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  boxShadow: '0 0 0 12px rgba(99,102,241,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={44} color="#fff" strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 8px',
                  }}
                >
                  Welcome aboard, {username || 'there'}!
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: '#696D7D',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Your Kira AI account is ready. You're about to experience the
                  next generation of AI productivity.
                </p>
              </div>

              {/* Summary */}
              <div
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  borderRadius: 18,
                  background: '#f8fafc',
                  border: '1px solid rgba(17,24,39,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  { label: 'Email', value: email || 'Not set' },
                  {
                    label: 'Username',
                    value: username ? `@${username}` : 'Not set',
                  },
                  { label: 'Country', value: country || 'Not set' },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12.5,
                        color: '#9ca3af',
                        fontWeight: 500,
                      }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: '#111827',
                        fontWeight: 600,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onComplete} // ← add this line
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontFamily: 'inherit',
                  ...BTN_BLUE,
                }}
              >
                <Sparkles size={16} /> Launch Kira Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
