import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Download,
  Copy,
  Share2,
  RefreshCw,
  ChevronDown,
  Mic,
  Upload,
  Trash2,
  AlignLeft,
  RotateCcw,
  RotateCw,
  Languages,
  Send,
  Star,
  Settings,
  X,
  Check,
  Eye,
  EyeOff,
  FileText,
  Bell,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Transcript {
  id: string
  ts: string
  text: string
  live: boolean
}

interface Session {
  id: string
  title: string
  date: string
  transcripts: Transcript[]
  notesHtml: string
  notesText: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtTime(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

const DEMO_SESSIONS: Session[] = [
  {
    id: 'demo1',
    title: 'Q3 Product Planning',
    date: 'Today',
    transcripts: [
      {
        id: 't1',
        ts: '00:00:12',
        text: 'We need to finalise the roadmap before end of quarter.',
        live: false,
      },
    ],
    notesHtml:
      '<h2>Q3 Product Planning</h2><p>Key decisions made around roadmap and delivery timelines.</p><ul><li>Mockups due Friday</li><li>Engineering kickoff Monday</li></ul>',
    notesText:
      'Q3 Product Planning\nKey decisions made around roadmap.\n- Mockups due Friday\n- Engineering kickoff Monday',
  },
  {
    id: 'demo2',
    title: 'Client Intro — Acme Corp',
    date: 'Yesterday',
    transcripts: [
      {
        id: 't3',
        ts: '00:00:05',
        text: 'Thanks for joining the call today. Lets talk about your goals.',
        live: false,
      },
    ],
    notesHtml:
      '<h2>Client Intro — Acme Corp</h2><p>Initial discovery call. Client looking for AI automation.</p>',
    notesText:
      'Client Intro — Acme Corp\nInitial discovery call. Client looking for AI automation.',
  },
]

// ─── Waveform component ───────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(48).fill(8))

  useEffect(() => {
    if (!active) {
      setBars(Array(48).fill(8))
      return
    }
    const iv = setInterval(() => {
      setBars(
        Array(48)
          .fill(0)
          .map(() => Math.random() * 60 + 8),
      )
    }, 100)
    return () => clearInterval(iv)
  }, [active])

  return (
    <div
      style={{
        height: 80,
        background: 'rgba(108,92,231,0.07)',
        borderRadius: 14,
        marginBottom: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '10px 14px',
        overflow: 'hidden',
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            maxWidth: 5,
            height: h,
            borderRadius: 2,
            background: active
              ? 'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)'
              : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            opacity: active ? 1 : 0.3,
            transition: 'height 0.08s ease-out',
          }}
        />
      ))}
    </div>
  )
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span
      style={{
        display: 'inline-flex',
        gap: 4,
        alignItems: 'center',
        padding: '4px 0',
      }}
    >
      {[0, 150, 300].map((delay, i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#6c5ce7',
            display: 'inline-block',
            animation: `kira-td 1.2s ${delay}ms infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes kira-td { 0%,60%,100%{transform:scale(0.7);opacity:0.4} 30%{transform:scale(1.1);opacity:1} }
        @keyframes kira-blink { 0%,50%{opacity:1} 51%,100%{opacity:0.3} }
        @keyframes kira-pulse-rec { 0%,100%{box-shadow:0 6px 18px rgba(239,69,101,0.4)} 50%{box-shadow:0 6px 24px rgba(239,69,101,0.7),0 0 0 8px rgba(239,69,101,0.15)} }
      `}</style>
    </span>
  )
}

// ─── Main MeetingsView ────────────────────────────────────────────────────────
export default function MeetingsView() {
  // Sessions
  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS)
  const [currentSession, setCurrentSession] = useState<Session>(
    DEMO_SESSIONS[0],
  )
  const [sessionTitle, setSessionTitle] = useState(DEMO_SESSIONS[0].title)
  const [searchQuery, setSearchQuery] = useState('')

  // Recording
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<any>(null)

  // Transcripts
  const [transcripts, setTranscripts] = useState<Transcript[]>(
    DEMO_SESSIONS[0].transcripts,
  )
  const [livePartial, setLivePartial] = useState('')

  // Notes
  const [notesHtml, setNotesHtml] = useState(DEMO_SESSIONS[0].notesHtml)
  const [notesText, setNotesText] = useState(DEMO_SESSIONS[0].notesText)
  const [generatingNotes, setGeneratingNotes] = useState(false)

  // Export menu
  const [exportOpen, setExportOpen] = useState(false)

  // Ask Kira chat
  const [askMessages, setAskMessages] = useState<ChatMessage[]>([])
  const [askInput, setAskInput] = useState('')
  const [askLoading, setAskLoading] = useState(false)
  const askStreamRef = useRef<HTMLDivElement>(null)

  // Settings modal
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('llama-3.1-8b-instant')
  const [userName, setUserName] = useState('Kobe')
  const [showKey, setShowKey] = useState(false)

  // Share modal
  const [shareOpen, setShareOpen] = useState(false)

  // Toast
  const [toast, setToast] = useState('')
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Audio lang
  const [audioLang, setAudioLang] = useState('en-US')
  const [notesLang, setNotesLang] = useState('English')

  // Word count
  const wordCount = notesText.split(/\s+/).filter(Boolean).length

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(''), 2400)
  }, [])

  // ── Recording ───────────────────────────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    if (recording) {
      // Stop
      setRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setLivePartial('')
      showToast('Recording stopped')
    } else {
      // Start
      setRecording(true)
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const rec = new SpeechRecognition()
        rec.lang = audioLang
        rec.continuous = true
        rec.interimResults = true
        rec.onresult = (e: any) => {
          let final = ''
          let interim = ''
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript
            else interim += e.results[i][0].transcript
          }
          setLivePartial(interim)
          if (final.trim()) {
            const ts = fmtTime(elapsed)
            const entry: Transcript = {
              id: makeId(),
              ts,
              text: final.trim(),
              live: false,
            }
            setTranscripts((prev) => [...prev, entry])
            setLivePartial('')
          }
        }
        rec.onerror = () => {}
        rec.start()
        recognitionRef.current = rec
      } else {
        // Fallback demo transcript
        setTimeout(() => {
          setTranscripts((prev) => [
            ...prev,
            {
              id: makeId(),
              ts: fmtTime(0),
              text: 'Speech recognition is not supported in this browser. Upload an audio file instead.',
              live: false,
            },
          ])
        }, 1500)
      }
      showToast('Recording started')
    }
  }, [recording, audioLang, elapsed, showToast])

  // ── New session ─────────────────────────────────────────────────────────────
  const newSession = useCallback(() => {
    const s: Session = {
      id: makeId(),
      title: 'Untitled',
      date: 'Just now',
      transcripts: [],
      notesHtml: '',
      notesText: '',
    }
    setSessions((prev) => [s, ...prev])
    setCurrentSession(s)
    setSessionTitle('Untitled')
    setTranscripts([])
    setNotesHtml('')
    setNotesText('')
    setAskMessages([])
    setElapsed(0)
  }, [])

  // ── Load session ────────────────────────────────────────────────────────────
  const loadSession = useCallback((s: Session) => {
    setCurrentSession(s)
    setSessionTitle(s.title)
    setTranscripts(s.transcripts)
    setNotesHtml(s.notesHtml)
    setNotesText(s.notesText)
    setAskMessages([])
  }, [])

  // ── Generate notes (mock) ───────────────────────────────────────────────────
  const generateNotes = useCallback(async () => {
    if (transcripts.length === 0) {
      showToast('No transcripts to summarise yet')
      return
    }
    setGeneratingNotes(true)
    await new Promise((r) => setTimeout(r, 1700))

    const combined = transcripts.map((t) => t.text).join(' ')
    const words = combined.split(' ')
    const snippet = words.slice(0, 8).join(' ')

    const html = `<h2>${sessionTitle || 'Meeting Notes'}</h2>
<p><strong>Summary:</strong> ${combined.slice(0, 200)}${combined.length > 200 ? '...' : ''}</p>
<h2>Key Points</h2>
<ul>
  <li>${snippet}...</li>
  <li>Action items were discussed and assigned.</li>
  <li>Follow-up scheduled for next week.</li>
</ul>
<h2>Action Items</h2>
<ul>
  <li>Prepare deliverables before the next session.</li>
  <li>Share notes with all participants.</li>
</ul>`
    const text = `${sessionTitle || 'Meeting Notes'}\n\nSummary: ${combined.slice(0, 200)}\n\nKey Points:\n- ${snippet}...\n- Action items discussed\n\nAction Items:\n- Prepare deliverables\n- Share notes`

    setNotesHtml(html)
    setNotesText(text)
    setGeneratingNotes(false)
    showToast('Notes generated!')
  }, [transcripts, sessionTitle, showToast])

  // ── Ask Kira ────────────────────────────────────────────────────────────────
  const sendAsk = useCallback(
    async (msg?: string) => {
      const text = (msg || askInput).trim()
      if (!text) return
      setAskInput('')
      const userMsg: ChatMessage = { role: 'user', content: text }
      setAskMessages((prev) => [...prev, userMsg])
      setAskLoading(true)

      await new Promise((r) => setTimeout(r, 900))

      const context = notesText || transcripts.map((t) => t.text).join(' ')
      let reply = ''
      if (context) {
        reply = `Based on your session, here's what I found:\n\n${context.slice(0, 200)}...\n\nIs there anything specific you'd like me to elaborate on?`
      } else {
        reply =
          "I don't have any transcripts or notes yet. Start recording or generate notes first, then ask me anything about the session!"
      }

      setAskMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setAskLoading(false)
    },
    [askInput, notesText, transcripts],
  )

  // Scroll ask stream
  useEffect(() => {
    if (askStreamRef.current) {
      askStreamRef.current.scrollTop = askStreamRef.current.scrollHeight
    }
  }, [askMessages, askLoading])

  // ── Copy to clipboard ────────────────────────────────────────────────────────
  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard?.writeText(text).catch(() => {})
      showToast('Copied to clipboard')
    },
    [showToast],
  )

  // ── Clear transcripts ────────────────────────────────────────────────────────
  const clearTranscripts = useCallback(() => {
    setTranscripts([])
    setLivePartial('')
    showToast('Transcripts cleared')
  }, [showToast])

  // ── Download transcripts ─────────────────────────────────────────────────────
  const downloadTranscripts = useCallback(() => {
    const text = transcripts.map((t) => `[${t.ts}] ${t.text}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sessionTitle || 'transcripts'}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Transcripts downloaded')
  }, [transcripts, sessionTitle, showToast])

  // ── Export ───────────────────────────────────────────────────────────────────
  const exportAs = useCallback(
    (kind: string) => {
      if (!notesHtml && kind !== 'copy') {
        showToast('Generate notes first')
        return
      }
      if (kind === 'copy') {
        copyToClipboard(notesText)
        return
      }
      if (kind === 'share') {
        setShareOpen(true)
        return
      }
      showToast(`Exporting as ${kind}...`)
      const blob = new Blob([notesText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${sessionTitle || 'notes'}.${kind === 'markdown' ? 'md' : 'txt'}`
      a.click()
      URL.revokeObjectURL(url)
    },
    [notesHtml, notesText, sessionTitle, copyToClipboard, showToast],
  )

  // ── Save settings ─────────────────────────────────────────────────────────────
  const saveSettings = useCallback(() => {
    setSettingsOpen(false)
    showToast('Settings saved')
  }, [showToast])

  // Filtered sessions
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // ── Render ───────────────────────────────────────────────────────────────────
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
            'radial-gradient(ellipse at top right,rgba(196,181,253,0.45) 0%,rgba(147,197,253,0.35) 40%,transparent 70%)',
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
            'radial-gradient(ellipse at top right,rgba(216,180,254,0.4) 0%,rgba(186,230,253,0.3) 50%,transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(17,24,39,0.08)',

          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* New Notes button */}
        <button
          onClick={newSession}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 16px',
            borderRadius: 12,
            background: 'white',
            border: '1.5px solid #d1d5db',
            color: '#111827',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={15} />
          New Notes
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              fontWeight: 700,
              color: '#9ca3af',
              background: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: 5,
              marginLeft: 2,
            }}
          >
            ⌘ + K
          </span>
        </button>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
            }}
          />
          <input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(243,244,246,0.9)',
              border: '1px solid #e5e7eb',
              borderRadius: 11,
              padding: '9px 12px 9px 36px',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
              fontWeight: 500,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Right actions */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* AI status */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            title="AI Settings"
          >
            <Star size={15} />
          </button>
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            title="Settings"
          >
            <Settings size={15} />
          </button>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 28,
              background: 'rgba(17,24,39,0.1)',
              margin: '0 4px',
            }}
          />

          {/* Notifications */}
          <button
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <img
              src="/bell.png"
              alt="Notifications"
              style={{ width: 22, height: 22 }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            <Bell size={18} color="#374151" style={{ display: 'none' }} />
          </button>
          {/* Settings icon */}
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'white',
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
              style={{ width: 22, height: 22 }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </button>
          {/* Profile */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            <img
              src="/profile.png"
              alt="Profile"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.style.display = 'none'
                el.parentElement!.style.background =
                  'linear-gradient(135deg,#6c5ce7,#a78bfa)'
                el.parentElement!.innerHTML =
                  '<span style="color:white;font-weight:700;font-size:14px">K</span>'
              }}
            />
          </div>
        </div>
      </header>

      {/* ── WORKSPACE ───────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 300px) 1fr minmax(280px, 320px)',
          gap: 16,
          padding: '18px 22px 80px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          minHeight: 0,
        }}
      >
        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflow: 'hidden',
          }}
        >
          {/* Session title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Untitled"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                border: 0,
                outline: 0,
                background: 'transparent',
                padding: '4px 0',
                flex: 1,
                color: '#0e0a2e',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Recorder card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(17,24,39,0.08)',
              borderRadius: 20,
              padding: 20,
              boxShadow: '0 2px 8px rgba(14,10,46,0.06)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {/* Glow decoration */}
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 150,
                height: 150,
                background:
                  'radial-gradient(circle,rgba(108,92,231,0.12),transparent 65%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <Waveform active={recording} />

            {/* Record button */}
            <div
              style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
              <button
                onClick={toggleRecording}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 28px',
                  background: recording ? '#ef4565' : '#0e0a2e',
                  color: 'white',
                  border: 0,
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: recording
                    ? '0 6px 18px rgba(239,69,101,0.4)'
                    : '0 6px 18px rgba(14,10,46,0.25)',
                  animation: recording
                    ? 'kira-pulse-rec 1.5s ease-in-out infinite'
                    : 'none',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: recording ? 'white' : '#ef4565',
                    animation: recording ? 'kira-blink 1s infinite' : 'none',
                    display: 'inline-block',
                  }}
                />
                {recording ? 'Stop recording' : 'Start recording'}
              </button>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: recording ? '#ef4565' : '#9ca3af',
                  fontWeight: 600,
                }}
              >
                {fmtTime(elapsed)}
              </div>
            </div>

            {/* Actions row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 10,
                marginTop: 14,
              }}
            >
              {[
                {
                  icon: <Upload size={15} />,
                  title: 'Upload audio',
                  onClick: () =>
                    showToast('Upload not available in this browser'),
                },
                {
                  icon: <Trash2 size={15} />,
                  title: 'Clear transcripts',
                  onClick: clearTranscripts,
                },
                {
                  icon: <Download size={15} />,
                  title: 'Download transcripts',
                  onClick: downloadTranscripts,
                },
              ].map((a, i) => (
                <button
                  key={i}
                  title={a.title}
                  onClick={a.onClick}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(243,244,246,0.9)',
                    border: 0,
                    color: '#9ca3af',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {a.icon}
                </button>
              ))}
            </div>

            {/* Language selectors */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid rgba(17,24,39,0.07)',
              }}
            >
              {[
                {
                  label: '🎙 Audio language',
                  value: audioLang,
                  onChange: setAudioLang,
                  options: [
                    { v: 'en-US', l: '🇺🇸 English (US)' },
                    { v: 'en-GB', l: '🇬🇧 English (UK)' },
                    { v: 'es-ES', l: '🇪🇸 Español' },
                    { v: 'fr-FR', l: '🇫🇷 Français' },
                    { v: 'de-DE', l: '🇩🇪 Deutsch' },
                    { v: 'zh-CN', l: '🇨🇳 中文' },
                    { v: 'ja-JP', l: '🇯🇵 日本語' },
                    { v: 'ar-SA', l: '🇸🇦 العربية' },
                  ],
                },
                {
                  label: '📝 Notes language',
                  value: notesLang,
                  onChange: setNotesLang,
                  options: [
                    { v: 'English', l: '🇺🇸 English' },
                    { v: 'Spanish', l: '🇪🇸 Español' },
                    { v: 'French', l: '🇫🇷 Français' },
                    { v: 'German', l: '🇩🇪 Deutsch' },
                    { v: 'Chinese', l: '🇨🇳 中文' },
                    { v: 'Arabic', l: '🇸🇦 العربية' },
                    { v: 'Hindi', l: '🇮🇳 हिन्दी' },
                    { v: 'Japanese', l: '🇯🇵 日本語' },
                  ],
                },
              ].map((field, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(243,244,246,0.8)',
                    borderRadius: 11,
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
                  <select
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 0,
                      outline: 0,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: '#111827',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {field.options.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.l}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Transcripts panel */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(17,24,39,0.08)',
              borderRadius: 20,
              padding: 18,
              boxShadow: '0 2px 8px rgba(14,10,46,0.06)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 420, // 👈 add this — gives enough room for both sections

              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 14,
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                }}
              >
                Transcripts
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(
                    transcripts.map((t) => `[${t.ts}] ${t.text}`).join('\n'),
                  )
                }
                title="Copy transcripts"
                style={{
                  marginLeft: 'auto',
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(243,244,246,0.9)',
                  border: 0,
                  color: '#9ca3af',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Copy size={13} />
              </button>
            </div>

            {/* ✅ Transcript scroll area — fixed height so sessions don't squeeze it */}
            <div
              style={{
                height: 180, // fixed height, always visible
                minHeight: 180,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                paddingRight: 4,
                flexShrink: 0, // never shrink
              }}
            >
              {transcripts.length === 0 && !livePartial ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '32px 16px',
                    color: '#9ca3af',
                  }}
                >
                  <Mic
                    size={32}
                    style={{
                      margin: '0 auto 10px',
                      opacity: 0.35,
                      display: 'block',
                    }}
                  />
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                    No transcripts yet. Hit{' '}
                    <strong style={{ color: '#374151' }}>
                      Start recording
                    </strong>{' '}
                    or upload an audio file.
                  </p>
                </div>
              ) : (
                <>
                  {transcripts.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        background: 'rgba(108,92,231,0.08)',
                        borderRadius: 12,
                        padding: '12px 14px',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#111827',
                          marginBottom: 6,
                        }}
                      >
                        {t.ts}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#2d2358',
                          lineHeight: 1.55,
                          fontWeight: 500,
                        }}
                      >
                        {t.text}
                      </div>
                    </div>
                  ))}
                  {livePartial && (
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg,rgba(108,92,231,0.12),rgba(245,130,174,0.10))',
                        border: '1px solid rgba(108,92,231,0.18)',
                        borderRadius: 12,
                        padding: '12px 14px',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#111827',
                          marginBottom: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                        }}
                      >
                        {fmtTime(elapsed)}
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#ef4565',
                            display: 'inline-block',
                            animation: 'kira-blink 1s infinite',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#6c5ce7',
                          lineHeight: 1.55,
                          fontWeight: 500,
                        }}
                      >
                        {livePartial}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ✅ Sessions — fixed height, never grows to crush transcripts */}
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: '1px solid rgba(17,24,39,0.07)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                }}
              >
                Sessions
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: 130,
                  overflowY: 'auto',
                }}
              >
                {filteredSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadSession(s)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 11,
                      background:
                        currentSession.id === s.id ? 'white' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow:
                        currentSession.id === s.id
                          ? '0 1px 4px rgba(14,10,46,0.08)'
                          : 'none',
                      position: 'relative',
                      fontFamily: 'inherit',
                    }}
                  >
                    {currentSession.id === s.id && (
                      <div
                        style={{
                          position: 'absolute',
                          left: -6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 16,
                          borderRadius: 2,
                          background:
                            'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                        }}
                      />
                    )}
                    <FileText
                      size={14}
                      color={currentSession.id === s.id ? '#6c5ce7' : '#9ca3af'}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color:
                            currentSession.id === s.id ? '#6c5ce7' : '#374151',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#9ca3af',
                          fontWeight: 500,
                        }}
                      >
                        {s.date}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER COLUMN ────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Notes header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                margin: 0,
                flex: 1,
                color: '#111827',
              }}
            >
              ✍️ Notes
            </h2>
            {/* Export */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                disabled={!notesHtml}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 14px',
                  borderRadius: 11,
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(17,24,39,0.1)',
                  color: '#374151',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: notesHtml ? 'pointer' : 'not-allowed',
                  opacity: notesHtml ? 1 : 0.5,
                  fontFamily: 'inherit',
                }}
              >
                <Download size={13} />
                Export
                <ChevronDown
                  size={13}
                  style={{
                    transition: 'transform .15s',
                    transform: exportOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>
              {exportOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: 'white',
                    border: '1px solid rgba(17,24,39,0.08)',
                    borderRadius: 13,
                    boxShadow: '0 20px 40px rgba(14,10,46,0.12)',
                    padding: 6,
                    minWidth: 210,
                    zIndex: 60,
                  }}
                >
                  {[
                    {
                      label: 'Markdown (.md)',
                      icon: <FileText size={13} />,
                      action: () => exportAs('markdown'),
                    },
                    {
                      label: 'Plain text (.txt)',
                      icon: <AlignLeft size={13} />,
                      action: () => exportAs('text'),
                    },
                    {
                      label: 'Copy to clipboard',
                      icon: <Copy size={13} />,
                      action: () => {
                        exportAs('copy')
                        setExportOpen(false)
                      },
                    },
                    {
                      label: 'Share...',
                      icon: <Share2 size={13} />,
                      action: () => {
                        setShareOpen(true)
                        setExportOpen(false)
                      },
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        item.action()
                        setExportOpen(false)
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 11px',
                        border: 0,
                        background: 'transparent',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#374151',
                        borderRadius: 9,
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background =
                          'rgba(243,244,246,0.9)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background =
                          'transparent'
                      }}
                    >
                      <span style={{ color: '#9ca3af' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate Notes action card */}
          <button
            onClick={generateNotes}
            disabled={generatingNotes}
            style={{
              background: generatingNotes
                ? 'rgba(108,92,231,0.12)'
                : 'rgba(108,92,231,0.09)',
              border: '1px solid transparent',
              borderRadius: 16,
              padding: '16px 18px',
              cursor: generatingNotes ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              transition: 'all .2s',
              flexShrink: 0,
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!generatingNotes) {
                const el = e.currentTarget
                el.style.background = 'white'
                el.style.borderColor = '#6c5ce7'
                el.style.transform = 'translateY(-1px)'
                el.style.boxShadow = '0 6px 16px rgba(14,10,46,0.08)'
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(108,92,231,0.09)'
              el.style.borderColor = 'transparent'
              el.style.transform = 'none'
              el.style.boxShadow = 'none'
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'white',
                display: 'grid',
                placeItems: 'center',
                color: '#6c5ce7',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(14,10,46,0.06)',
              }}
            >
              <AlignLeft size={19} />
            </div>
            <div>
              <h4
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  margin: '0 0 2px',
                  color: '#111827',
                  letterSpacing: '-0.01em',
                }}
              >
                {generatingNotes ? 'Generating notes...' : 'Generate Notes'}
              </h4>
              <p
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                AI-powered summaries
              </p>
            </div>
          </button>

          {/* Notes area */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(17,24,39,0.07)',
              borderRadius: 20,
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(14,10,46,0.05)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {!notesHtml ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#9ca3af',
                  padding: '32px 20px',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 18,
                    background: 'rgba(108,92,231,0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: 14,
                    color: '#6c5ce7',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width={26}
                    height={26}
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: 15.5,
                    color: '#111827',
                    fontWeight: 700,
                    margin: '0 0 6px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Waiting for transcripts
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    margin: 0,
                    maxWidth: 300,
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  Start recording or upload audio. Once you have a transcript,
                  tap{' '}
                  <strong style={{ color: '#374151' }}>Generate Notes</strong>{' '}
                  to create structured AI summaries.
                </p>
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: '#2d2358',
                  paddingRight: 6,
                }}
                dangerouslySetInnerHTML={{
                  __html: notesHtml
                    .replace(
                      /<h2>/g,
                      '<h2 style="font-size:18px;font-weight:700;margin:20px 0 10px;color:#0e0a2e;padding-left:14px;border-left:4px solid #6c5ce7;letter-spacing:-0.02em">',
                    )
                    .replace(/<\/h2>/g, '</h2>')
                    .replace(
                      /<h1>/g,
                      '<h1 style="font-size:22px;font-weight:700;letter-spacing:-0.025em;margin:0 0 14px;color:#0e0a2e">',
                    )
                    .replace(/<\/h1>/g, '</h1>')
                    .replace(
                      /<ul>/g,
                      '<ul style="margin:0 0 12px;padding-left:22px">',
                    )
                    .replace(/<li>/g, '<li style="margin-bottom:6px">'),
                }}
              />
            )}

            {/* Editor toolbar */}
            {notesHtml && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  marginTop: 12,
                  background: 'rgba(243,244,246,0.8)',
                  borderRadius: 12,
                  fontSize: 13,
                  color: '#9ca3af',
                  fontWeight: 600,
                }}
              >
                <button
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    background: 'white',
                    borderRadius: 7,
                    border: '1px solid #e5e7eb',
                    fontSize: 12.5,
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span>T</span> Body text
                </button>
                <button
                  disabled
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: 'transparent',
                    border: 0,
                    color: '#d1d5db',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'not-allowed',
                  }}
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  disabled
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: 'transparent',
                    border: 0,
                    color: '#d1d5db',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'not-allowed',
                  }}
                >
                  <RotateCw size={13} />
                </button>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#9ca3af',
                  }}
                >
                  {wordCount} words
                </span>
                <button
                  onClick={() => showToast('Translation coming soon')}
                  title="Translate"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: 'transparent',
                    border: 0,
                    color: '#9ca3af',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Languages size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN — Ask Kira ──────────────────────────────────────── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(17,24,39,0.07)',
            borderRadius: 20,
            boxShadow: '0 2px 8px rgba(14,10,46,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 20px',
              borderBottom: '1px solid rgba(17,24,39,0.07)',
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: 0,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Ask Kira
            </h3>
            <button
              onClick={() => setAskMessages([])}
              title="Reset conversation"
              style={{
                marginLeft: 'auto',
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(243,244,246,0.9)',
                border: 0,
                color: '#9ca3af',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Stream */}
          <div
            ref={askStreamRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Intro */}
            {askMessages.length === 0 && (
              <div
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width={17}
                    height={17}
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: '#2d2358',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    paddingTop: 5,
                  }}
                >
                  <span style={{ color: '#111827', fontWeight: 700 }}>
                    👋 Hi, I'm Kira.
                  </span>{' '}
                  Ask me anything about this session — I'll answer based on your
                  transcripts &amp; notes.
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#111827',
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      You may ask:
                    </div>
                    {[
                      'What is the main idea of this session?',
                      'What are the most important concepts?',
                      'Summarize the action items.',
                      'What did the speaker just say?',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendAsk(q)}
                        style={{
                          padding: '10px 13px',
                          background: 'white',
                          border: '1px solid rgba(17,24,39,0.1)',
                          borderRadius: 13,
                          fontSize: 13,
                          color: '#374151',
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: 'pointer',
                          lineHeight: 1.4,
                          fontFamily: 'inherit',
                          transition: 'all .15s',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget
                          el.style.borderColor = '#6c5ce7'
                          el.style.color = '#6c5ce7'
                          el.style.background = 'rgba(108,92,231,0.05)'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget
                          el.style.borderColor = 'rgba(17,24,39,0.1)'
                          el.style.color = '#374151'
                          el.style.background = 'white'
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {askMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  justifyContent:
                    msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%',
                }}
              >
                {msg.role === 'assistant' && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width={13}
                      height={13}
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                )}
                <div
                  style={{
                    padding: '11px 14px',
                    borderRadius:
                      msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '4px 16px 16px 16px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)'
                        : 'rgba(243,244,246,0.9)',
                    color: msg.role === 'user' ? 'white' : '#2d2358',
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    fontWeight: 500,
                    maxWidth: '85%',
                    boxShadow:
                      msg.role === 'user'
                        ? '0 4px 10px rgba(108,92,231,0.25)'
                        : 'none',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading */}
            {askLoading && (
              <div
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width={13}
                    height={13}
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '4px 16px 16px 16px',
                    background: 'rgba(243,244,246,0.9)',
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div
            style={{
              padding: '12px 16px 16px',
              borderTop: '1px solid rgba(17,24,39,0.07)',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'white',
                border: '1.5px solid #e5e7eb',
                borderRadius: 13,
                padding: '5px 5px 5px 13px',
                transition: 'all .15s',
              }}
            >
              <input
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    sendAsk()
                  }
                }}
                placeholder="Feel free to ask Kira anything..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 0,
                  outline: 0,
                  fontSize: 13.5,
                  padding: '8px 0',
                  fontWeight: 500,
                  color: '#111827',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => sendAsk()}
                disabled={!askInput.trim() || askLoading}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: askInput.trim()
                    ? 'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)'
                    : 'rgba(243,244,246,0.9)',
                  color: askInput.trim() ? 'white' : '#d1d5db',
                  border: 0,
                  display: 'grid',
                  placeItems: 'center',
                  cursor: askInput.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: askInput.trim()
                    ? '0 4px 10px rgba(108,92,231,0.3)'
                    : 'none',
                  transition: 'all .15s',
                  flexShrink: 0,
                }}
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SETTINGS MODAL ──────────────────────────────────────────────────── */}
      {settingsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettingsOpen(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14,10,46,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 24,
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 20px 40px rgba(14,10,46,0.14)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '22px 26px 0',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    margin: '0 0 2px',
                    letterSpacing: '-0.025em',
                    color: '#111827',
                  }}
                >
                  Settings
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: '#9ca3af',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Connect Groq AI & tune your preferences
                </p>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                style={{
                  marginLeft: 'auto',
                  width: 30,
                  height: 30,
                  background: 'rgba(243,244,246,0.9)',
                  border: 0,
                  borderRadius: 9,
                  color: '#374151',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={13} />
              </button>
            </div>
            <div style={{ padding: '20px 26px 26px' }}>
              {/* AI Key section */}
              <div
                style={{
                  background: 'rgba(243,244,246,0.8)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 130,
                    height: 130,
                    background:
                      'radial-gradient(circle,rgba(108,92,231,0.1),transparent 65%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 14,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      background:
                        'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                      borderRadius: 10,
                      display: 'grid',
                      placeItems: 'center',
                      color: 'white',
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(108,92,231,0.3)',
                    }}
                  >
                    <Check size={17} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#111827',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Connect Groq AI
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: '#9ca3af',
                        fontWeight: 500,
                        marginTop: 2,
                      }}
                    >
                      Power Kira with real AI —{' '}
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener"
                        style={{
                          color: '#6c5ce7',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        get a free key
                      </a>
                    </div>
                  </div>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 10.5,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: apiKey
                        ? 'rgba(91,191,133,0.18)'
                        : 'rgba(243,244,246,0.9)',
                      color: apiKey ? '#2db876' : '#9ca3af',
                      flexShrink: 0,
                    }}
                  >
                    {apiKey ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: 6,
                    }}
                  >
                    Groq API key
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="gsk_..."
                      style={{
                        flex: 1,
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 11,
                        padding: '9px 13px',
                        fontSize: 12.5,
                        fontFamily: 'monospace',
                        outline: 'none',
                        color: '#111827',
                      }}
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      style={{
                        width: 40,
                        flexShrink: 0,
                        background: 'rgba(243,244,246,0.9)',
                        border: '1px solid #e5e7eb',
                        borderRadius: 11,
                        color: '#9ca3af',
                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#9ca3af',
                      marginTop: 5,
                      fontWeight: 500,
                    }}
                  >
                    Stored locally in your browser. Never sent anywhere except
                    Groq.
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: 6,
                    }}
                  >
                    Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: 11,
                      padding: '9px 13px',
                      fontSize: 13,
                      outline: 'none',
                      color: '#111827',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="llama-3.3-70b-versatile">
                      Llama 3.3 70B (best quality)
                    </option>
                    <option value="llama-3.1-8b-instant">
                      Llama 3.1 8B (fastest)
                    </option>
                    <option value="openai/gpt-oss-20b">GPT-OSS 20B</option>
                    <option value="moonshotai/kimi-k2-instruct">Kimi K2</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#374151',
                    marginBottom: 6,
                  }}
                >
                  Your name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    background: 'rgba(243,244,246,0.8)',
                    border: '1px solid #e5e7eb',
                    borderRadius: 11,
                    padding: '9px 13px',
                    fontSize: 13,
                    outline: 'none',
                    color: '#111827',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}
              >
                <button
                  onClick={() => setSettingsOpen(false)}
                  style={{
                    padding: '10px 18px',
                    background: 'transparent',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: 11,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  style={{
                    padding: '10px 20px',
                    background:
                      'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                    color: 'white',
                    border: 0,
                    borderRadius: 11,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 12px rgba(108,92,231,0.25)',
                  }}
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ──────────────────────────────────────────────────────── */}
      {shareOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShareOpen(false)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14,10,46,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 24,
              maxWidth: 500,
              width: '100%',
              boxShadow: '0 20px 40px rgba(14,10,46,0.14)',
            }}
          >
            <div
              style={{
                padding: '22px 26px 0',
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    margin: '0 0 2px',
                    letterSpacing: '-0.025em',
                    color: '#111827',
                  }}
                >
                  Share notes
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: '#9ca3af',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Send your session somewhere useful
                </p>
              </div>
              <button
                onClick={() => setShareOpen(false)}
                style={{
                  marginLeft: 'auto',
                  width: 30,
                  height: 30,
                  background: 'rgba(243,244,246,0.9)',
                  border: 0,
                  borderRadius: 9,
                  color: '#374151',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={13} />
              </button>
            </div>
            <div style={{ padding: '20px 26px 26px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  background: 'rgba(243,244,246,0.8)',
                  borderRadius: 14,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background:
                      'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={22} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: 3,
                    }}
                  >
                    {sessionTitle || 'Untitled'}
                  </div>
                  <div
                    style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}
                  >
                    {wordCount} words · {transcripts.length} transcripts
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5,1fr)',
                  gap: 10,
                }}
              >
                {[
                  {
                    label: 'Email',
                    bg: 'linear-gradient(135deg,#6c5ce7,#a78bfa,#f582ae)',
                    action: () =>
                      (window.location.href = `mailto:?subject=${encodeURIComponent(sessionTitle)}&body=${encodeURIComponent(notesText)}`),
                  },
                  {
                    label: 'WhatsApp',
                    bg: '#25d366',
                    action: () =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(sessionTitle + '\n\n' + notesText)}`,
                        '_blank',
                      ),
                  },
                  {
                    label: 'Copy',
                    bg: 'rgba(229,231,235,0.9)',
                    textColor: '#374151',
                    action: () => {
                      copyToClipboard(notesText)
                      setShareOpen(false)
                    },
                  },
                  {
                    label: 'Slack',
                    bg: '#4a154b',
                    action: () => {
                      copyToClipboard(notesText)
                      showToast('Notes copied — paste into Slack')
                      setShareOpen(false)
                    },
                  },
                  {
                    label: 'More',
                    bg: 'rgba(229,231,235,0.9)',
                    textColor: '#374151',
                    action: () => {
                      if (navigator.share)
                        navigator
                          .share({ title: sessionTitle, text: notesText })
                          .catch(() => {})
                      else {
                        copyToClipboard(notesText)
                        setShareOpen(false)
                      }
                    },
                  },
                ].map((p, i) => (
                  <button
                    key={i}
                    onClick={p.action}
                    style={{
                      background: 'transparent',
                      border: 0,
                      padding: '10px 4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      borderRadius: 12,
                      cursor: 'pointer',
                      transition: 'all .15s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        'rgba(243,244,246,0.8)'
                      ;(e.currentTarget as HTMLElement).style.transform =
                        'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        'transparent'
                      ;(e.currentTarget as HTMLElement).style.transform = 'none'
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        background: p.bg,
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: p.textColor || 'white',
                      }}
                    >
                      <Share2 size={20} color={p.textColor || 'white'} />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#374151',
                      }}
                    >
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: `translateX(-50%) translateY(${toast ? '0' : '80px'})`,
          background: '#0e0a2e',
          color: 'white',
          padding: '11px 20px',
          borderRadius: 13,
          fontSize: 13.5,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 20px 40px rgba(14,10,46,0.15)',
          opacity: toast ? 1 : 0,
          transition: 'all .25s cubic-bezier(0.18,0.89,0.43,1.19)',
          zIndex: 200,
          pointerEvents: 'none',
          fontFamily: 'inherit',
        }}
      >
        <Check size={15} color="#5bbf85" />
        {toast}
      </div>

      {/* Click-outside to close export menu */}
      {exportOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 55 }}
          onClick={() => setExportOpen(false)}
        />
      )}
    </div>
  )
}
