import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface HistoryItem {
  id: number
  command: string
  response: string
  time: string
  responseTimeMs?: number
  imageUrl?: string
  timestamp: number // epoch ms — used for timeAgo recompute
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'
const LOCAL_STORAGE_KEY = 'kira_command_history'

const SYSTEM_PROMPT = `You are Kira, an advanced AI voice assistant — think Jarvis from Iron Man but smarter and more personable. You are integrated into a productivity platform called Kira AI.

Your personality:
- Concise, confident, and helpful
- Proactive — you anticipate what the user needs
- Slightly witty but always professional
- You refer to yourself as "Kira". Address the user respectfully and professionally.
Your capabilities within this platform:
- Schedule management and reminders
- Email drafting and sending
- Web search and research
- Image and content generation
- Workflow automation
- Meeting summaries
- General knowledge and reasoning

Keep responses short and punchy unless the user asks for detail. Format clearly.
IMPORTANT: When user asks to generate/create an image, respond with exactly this format and nothing else:
IMAGE_REQUEST: <detailed image description here>`

const speakingChips = [
  'What can you do?',
  'Open YouTube',
  'Say hi Kira',
  'Tap to speak',
  'Fun Fact',
  'Create an image',
]

const orbAnimations = `
  @keyframes speakRing {
    0%   { transform: scale(0.94); opacity: 0.85; }
    60%  { transform: scale(1.06); opacity: 0.45; }
    100% { transform: scale(1.15); opacity: 0; }
  }
  @keyframes speakGlow {
    0%   { opacity: 0.4; transform: scale(0.95); }
    50%  { opacity: 0.8; transform: scale(1.05); }
    100% { opacity: 0.4; transform: scale(0.95); }
  }
  @keyframes speakOrb {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.04); }
    100% { transform: scale(1); }
  }
  @keyframes activeSpeakRing {
    0%   { transform: scale(0.90); opacity: 1; }
    60%  { transform: scale(1.12); opacity: 0.5; }
    100% { transform: scale(1.25); opacity: 0; }
  }
  @keyframes activeOrb {
    0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
    50%  { transform: scale(1.06); box-shadow: 0 0 40px 20px rgba(99,102,241,0.3); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
  }
`

// ─── TTS thresholds ──────────────────────────────────────────────────────────

/**
 * Word count threshold below which the full response is spoken aloud.
 * At or below this value  → full TTS.
 * Above this value        → first sentence + "...see full response below."
 */
const FULL_SPEAK_WORD_LIMIT = 30

// Words that indicate a long-form request — skip full TTS for these
const LONG_FORM_TRIGGERS = [
  'article',
  'essay',
  'blog',
  'write',
  'draft',
  'story',
  'poem',
  'report',
  'summary',
  'summarize',
  'email',
  'letter',
  'paragraph',
  'explain in detail',
  'tell me everything',
  'full guide',
  'step by step',
]

function isLongFormRequest(userText: string): boolean {
  const lower = userText.toLowerCase()
  return LONG_FORM_TRIGGERS.some((trigger) => lower.includes(trigger))
}

/**
 * Returns the word count of a plain-text string.
 */
function wordCount(text: string): number {
  return text
    .replace(/[*_#`]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

/**
 * Extracts the first sentence from a response string.
 * Falls back to the first 15 words if no sentence-ending punctuation is found.
 */
function firstSentence(text: string): string {
  const clean = text.replace(/[*_#`]/g, '').trim()
  // Match up to and including the first sentence-ending punctuation
  const match = clean.match(/^.+?[.!?](?:\s|$)/)
  if (match) return match[0].trim()
  // Fallback: first 15 words
  return clean.split(/\s+/).slice(0, 15).join(' ')
}

function timeAgo(epochMs: number): string {
  const secs = Math.floor((Date.now() - epochMs) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed: HistoryItem[] = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveHistory(items: HistoryItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.slice(0, 20)))
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

// ─── Voice helpers ───────────────────────────────────────────────────────────

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  let score = 0
  if (name.includes('google')) score += 100
  if (v.localService === false) score += 50
  const premium = [
    'samantha',
    'daniel',
    'karen',
    'moira',
    'rishi',
    'veena',
    'fiona',
    'allison',
    'ava',
    'kate',
    'serena',
    'victoria',
    'tessa',
  ]
  if (premium.some((p) => name.includes(p))) score += 40
  const femaleHints = [
    'female',
    'woman',
    'girl',
    'f ',
    'zira',
    'hazel',
    'linda',
    'susan',
  ]
  if (femaleHints.some((h) => name.includes(h))) score += 20
  if (v.lang.startsWith('en')) score += 30
  if (v.lang === 'en-US') score += 10
  if (v.lang === 'en-GB') score += 8
  return score
}

function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'))
  if (!englishVoices.length) return null
  return englishVoices.reduce((best, v) =>
    scoreVoice(v) > scoreVoice(best) ? v : best,
  )
}

function speakText(text: string, onEnd?: () => void): void {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const clean = text
    .replace(/[*_#`]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/([.!?])\s+/g, '$1  ')
    .trim()

  const utterance = new SpeechSynthesisUtterance(clean)
  utterance.rate = 0.88
  utterance.pitch = 1.05
  utterance.volume = 1.0

  const applyVoiceAndSpeak = () => {
    const voice = pickBestVoice()
    if (voice) utterance.voice = voice
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      applyVoiceAndSpeak()
    }
  } else {
    applyVoiceAndSpeak()
  }
}

// ─── Copy / Download utilities ───────────────────────────────────────────────

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

function downloadImage(url: string, filename = 'kira-generated.jpg') {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
    })
    .catch(() => {
      window.open(url, '_blank')
    })
}

// ─── Component ────────────────────────────────────────────────────────────────

function BeedAI() {
  const [time, setTime] = useState(new Date())
  const [chatInput, setChatInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory())
  const [isThinking, setIsThinking] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [lastResponseMs, setLastResponseMs] = useState<number | null>(null)
  const [apiStatus, setApiStatus] = useState<'Online' | 'Error'>('Online')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [mainCopied, setMainCopied] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const handleSendRef = useRef<(text?: string) => void>(() => {})
  const idCounter = useRef(
    history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1,
  )
  const lastUserTextRef = useRef('')

  // ── Persist history to localStorage whenever it changes ──────────────────
  useEffect(() => {
    saveHistory(history)
  }, [history])

  // ── Clock ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ── Refresh relative timestamps every minute ──────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setHistory((prev) =>
        prev.map((item) => ({
          ...item,
          time: timeAgo(item.timestamp),
        })),
      )
    }, 60_000)
    return () => clearInterval(timer)
  }, [])

  // ── Speech recognition setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setChatInput(transcript)
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false)
        handleSendRef.current(transcript)
      }
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
  }, [])

  // ── Smart speak: full TTS for short replies, first sentence + cue for long ─
  const speak = (text: string, userQuery: string) => {
    if (isMuted) return

    // Long-form intent detected → skip body entirely
    if (isLongFormRequest(userQuery)) {
      speakText(
        'I have prepared that for you. Please see the full response below.',
      )
      return
    }

    const wc = wordCount(text)

    if (wc <= FULL_SPEAK_WORD_LIMIT) {
      // Short response — speak it in full
      speakText(text)
    } else {
      // Long response — read only the first sentence, then cue the user
      const opening = firstSentence(text)
      speakText(`${opening} ... See the full response below.`)
    }
  }

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const toggleMute = () => {
    if (!isMuted) window.speechSynthesis?.cancel()
    setIsMuted((prev) => !prev)
  }

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    const s = date.getSeconds().toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? chatInput).trim()
    if (!text || isThinking) return

    lastUserTextRef.current = text
    setChatInput('')
    setIsThinking(true)
    setStreamingText('')
    setGeneratedImage(null)
    setExpandedId(null)

    const startMs = Date.now()
    const userCommand = `"${text}"`

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      if (!apiKey) throw new Error('Missing API key')

      const contextMessages = history.slice(-6).flatMap((h) => [
        { role: 'user', content: h.command.replace(/^"|"$/g, '') },
        { role: 'assistant', content: h.response },
      ])

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...contextMessages,
            { role: 'user', content: text },
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: true,
        }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content ?? ''
            fullResponse += delta
            setStreamingText(fullResponse)
          } catch {
            /* skip */
          }
        }
      }

      const elapsedMs = Date.now() - startMs
      setLastResponseMs(elapsedMs)
      setApiStatus('Online')

      let imageUrl: string | undefined
      let displayResponse = fullResponse

      if (fullResponse.startsWith('IMAGE_REQUEST:')) {
        const prompt = fullResponse.replace('IMAGE_REQUEST:', '').trim()
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=500&nologo=true`
        displayResponse = `🎨 Generating image: "${prompt}"`
        setGeneratedImage(imageUrl)
      } else {
        speak(fullResponse, lastUserTextRef.current)
      }

      const now = Date.now()
      const newItem: HistoryItem = {
        id: idCounter.current++,
        command: userCommand,
        response: displayResponse,
        time: timeAgo(now),
        responseTimeMs: elapsedMs,
        imageUrl,
        timestamp: now,
      }

      setHistory((prev) => [newItem, ...prev].slice(0, 20))
    } catch (err) {
      console.error(err)
      setApiStatus('Error')
      const now = Date.now()
      setHistory((prev) =>
        [
          {
            id: idCounter.current++,
            command: userCommand,
            response: 'An error occurred. Please try again.',
            time: timeAgo(now),
            timestamp: now,
          },
          ...prev,
        ].slice(0, 20),
      )
    } finally {
      setIsThinking(false)
      setStreamingText('')
    }
  }

  useEffect(() => {
    handleSendRef.current = handleSend
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChipClick = (chip: string) => {
    setChatInput(chip)
    handleSend(chip)
  }

  const handleCopyMain = async () => {
    const text = history[0]?.response || streamingText
    if (!text) return
    await copyToClipboard(text)
    setMainCopied(true)
    setTimeout(() => setMainCopied(false), 2000)
  }

  const handleCopyHistory = async (item: HistoryItem) => {
    await copyToClipboard(item.response)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearHistory = () => {
    if (window.confirm('Clear all command history?')) {
      setHistory([])
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }

  const statsCards = [
    { label: 'Voice recognition :', value: '98.5%' },
    {
      label: 'Response time :',
      value: lastResponseMs ? `${lastResponseMs}ms` : '—',
    },
    { label: 'Api status :', value: apiStatus },
    { label: 'Kira Model :', value: 'V3.3' },
  ]

  const isActive = isThinking || isListening
  const latestResponse = history[0]

  return (
    <ScrollArea className="h-full max-w-[1644px]">
      <div
        className="w-full min-h-screen"
        style={{
          background: 'url("/MainBG.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-black/10">
          <div className="flex flex-col items-center justify-center flex-1">
            <h1 className="text-[30px] font-medium text-[#111827]">AI</h1>
            <p className="text-[16px] text-[#696D7D] mt-0.5 font-normal text-center">
              {isListening
                ? '🎙️ Listening...'
                : isThinking
                  ? '⚡ Kira is thinking...'
                  : 'Voice Command Interface'}
            </p>
          </div>
          <div className="flex items-center gap-[20px]">
            <div
              className="flex flex-col items-center justify-center px-[18px] py-[8px] rounded-xl min-w-[140px] h-[50px] border border-white"
              style={{
                background:
                  'linear-gradient(45deg, #627EEA 0%, #8A5CFF 50%, #B366FF 100%)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
              }}
            >
              <span className="text-white text-[18px] font-semibold leading-tight tracking-wide">
                {formatTime(time)}
              </span>
              <span className="text-white/60 text-[12px] font-normal leading-none">
                {formatDate(time)}
              </span>
            </div>
            <div className="w-[1px] h-[30px] border-l border-[#111827]/10" />
            <div className="flex items-center gap-[15px]">
              <div className="flex items-center gap-[10px]">
                <button className="w-[50px] h-[50px] rounded-full bg-white/70 shadow-[0px_2px_5px_rgba(17,24,39,0.06)] flex items-center justify-center">
                  <img
                    src="/bell(1).png"
                    alt="Notifications"
                    className="w-[24px] h-[24px]"
                  />
                </button>
                <button className="w-[50px] h-[50px] rounded-full bg-white/70 shadow-[0px_2px_5px_rgba(17,24,39,0.06)] flex items-center justify-center">
                  <img
                    src="/setting.png"
                    alt="Settings"
                    className="w-[24px] h-[24px]"
                  />
                </button>
              </div>
              <div className="relative w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                <div className="absolute -left-[26px] -top-[26px] h-[102px] w-[102px] rounded-full border border-white/60" />
                <div className="absolute -left-[12px] -top-[12px] h-[74px] w-[74px] rounded-full border border-white/60" />
                <img
                  src="/profile.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-start gap-5 p-6 xl:gap-7 lg:flex-row">
          {/* Left side */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-[21px]">
            {/* Orb */}
            <div className="flex flex-col w-full gap-3">
              <div className="w-full h-[650px] rounded-[30px] overflow-hidden relative">
                <img
                  src="/Ai%20screen%20bg.png"
                  alt=""
                  className="absolute inset-0 object-cover w-full h-full"
                />
                <style>{orbAnimations}</style>

                <div className="absolute inset-0 flex items-center justify-center">
                  {[
                    { size: '10.4vw', base: 120, max: 200, delay: '0s' },
                    { size: '14.6vw', base: 168, max: 280, delay: '0.55s' },
                    { size: '18.75vw', base: 216, max: 360, delay: '1.1s' },
                    { size: '22.9vw', base: 264, max: 440, delay: '1.65s' },
                  ].map(({ size, base, max, delay }, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `clamp(${base}px, ${size}, ${max}px)`,
                        height: `clamp(${base}px, ${size}, ${max}px)`,
                        border: `2px solid ${isActive ? 'rgba(99,102,241,0.9)' : 'rgba(255,255,255,0.85)'}`,
                        boxShadow: isActive
                          ? '0 0 20px 4px rgba(99,102,241,0.4), inset 0 0 12px 2px rgba(99,102,241,0.2)'
                          : '0 0 12px 2px rgba(255,255,255,0.3), inset 0 0 8px 1px rgba(255,255,255,0.15)',
                        animation: `${isActive ? 'activeSpeakRing' : 'speakRing'} ${isActive ? '1.2s' : '4s'} ease-out infinite ${delay}`,
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                    />
                  ))}
                  <div
                    className="absolute rounded-full blur-[32px]"
                    style={{
                      width: 'clamp(132px, 11.5vw, 220px)',
                      height: 'clamp(132px, 11.5vw, 220px)',
                      backgroundColor: isActive
                        ? 'rgba(99,102,241,0.5)'
                        : 'rgba(255,255,255,0.4)',
                      animation: 'speakGlow 2.8s ease-in-out infinite',
                      transition: 'background-color 0.3s',
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 'clamp(180px, 15.6vw, 300px)',
                      height: 'clamp(180px, 15.6vw, 300px)',
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.14) 58%, rgba(255,255,255,0) 70%)',
                    }}
                  />
                  <video
                    src="/newKira.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative z-10 rounded-full"
                    style={{
                      width: 'clamp(340px, 30vw, 580px)',
                      height: 'clamp(338px, 29.8vw, 578px)',
                      animation: `${isActive ? 'activeOrb' : 'speakOrb'} ${isActive ? '0.8s' : '2.2s'} ease-in-out infinite`,
                    }}
                  />
                </div>

                {isActive && (
                  <div className="absolute z-20 top-5 left-5">
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[13px] font-medium"
                      style={{
                        background: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      {isListening ? 'Listening...' : 'Kira is thinking...'}
                    </div>
                  </div>
                )}
              </div>

              {/* Chips */}
              <div className="flex flex-wrap items-center justify-center px-2 xl:justify-between gap-x-2 gap-y-2">
                {speakingChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    disabled={isThinking}
                    className="h-[32px] xl:h-[35px] px-[8px] xl:px-[12px] rounded-sm border border-gray-300 bg-white text-[11px] xl:text-[13px] text-black font-medium shadow-[0px_2px_5px_rgba(17,24,39,0.06)] shrink-0 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Response panel */}
            {(streamingText || (!isThinking && latestResponse)) && (
              <div className="w-full rounded-[20px] bg-white border border-[#E5E7EB] p-5 shadow-sm relative">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #627EEA, #B366FF)',
                    }}
                  >
                    <span className="text-white text-[11px] font-bold">K</span>
                  </div>
                  <span className="text-[13px] font-medium text-[#111827]">
                    Kira
                  </span>
                  {isThinking && (
                    <span className="ml-auto text-[11px] text-[#696D7D] animate-pulse">
                      responding...
                    </span>
                  )}
                  {!isThinking && latestResponse?.responseTimeMs && (
                    <span className="ml-auto text-[11px] text-[#696D7D]">
                      {latestResponse.responseTimeMs}ms
                    </span>
                  )}
                </div>

                {/* Generated image with download button */}
                {generatedImage && (
                  <div className="relative mb-3 group">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full rounded-[12px] object-cover max-h-[300px]"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <button
                      onClick={() =>
                        downloadImage(generatedImage, 'kira-image.jpg')
                      }
                      className="absolute top-3 right-3 w-[36px] h-[36px] rounded-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(6px)',
                      }}
                      title="Download image"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-[14px] text-[#374151] leading-relaxed whitespace-pre-wrap pr-8">
                  {streamingText || latestResponse?.response}
                </p>

                {/* Copy button */}
                {!isThinking && (streamingText || latestResponse?.response) && (
                  <button
                    onClick={handleCopyMain}
                    className="absolute bottom-4 right-4 w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-all"
                    style={{
                      background: mainCopied
                        ? 'rgba(99,102,241,0.1)'
                        : 'rgba(0,0,0,0.04)',
                      border: mainCopied
                        ? '1px solid rgba(99,102,241,0.3)'
                        : '1px solid rgba(0,0,0,0.08)',
                    }}
                    title="Copy response"
                  >
                    {mainCopied ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col gap-[27px]">
              {/* Chat input */}
              <div
                className="relative w-full h-[160px] rounded-[16px] border border-[#4F46E5]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(79,70,229,0.08) 0%, rgba(13,162,255,0.08) 100%)',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                }}
                onClick={() => inputRef.current?.focus()}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? 'Listening...'
                      : isThinking
                        ? 'Kira is responding...'
                        : 'Ask Kira anything...'
                  }
                  disabled={isThinking}
                  aria-label="Chat input"
                  style={{
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 10,
                  }}
                  className="absolute left-[18px] top-[12px] w-[calc(100%-120px)] bg-transparent text-[16px] text-[#111827] placeholder:text-[#111827]/40 focus:outline-none disabled:opacity-50"
                />
                <div
                  className="absolute right-[18px] bottom-[12px] flex items-center gap-[6px]"
                  style={{ zIndex: 10 }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMic()
                    }}
                    className={`w-[46px] h-[46px] rounded-[10px] border flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 border-red-400' : 'border-[rgba(195,195,195,0.3)] bg-white'}`}
                  >
                    <img
                      src="/Microphone.png"
                      alt="Microphone"
                      className="w-[24px] h-[24px]"
                      style={isListening ? { filter: 'brightness(10)' } : {}}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMute()
                    }}
                    title={isMuted ? 'Unmute Kira' : 'Mute Kira'}
                    className={`w-[46px] h-[46px] rounded-[10px] border flex items-center justify-center transition-colors ${isMuted ? 'bg-gray-200 border-gray-300' : 'border-[rgba(195,195,195,0.3)] bg-white'}`}
                  >
                    <img
                      src="/volume-cross.png"
                      alt="Mute"
                      className="w-[24px] h-[24px]"
                      style={isMuted ? { opacity: 1 } : { opacity: 0.4 }}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const prompt = window.prompt(
                        'Describe the image you want Kira to generate:',
                      )
                      if (prompt?.trim())
                        handleSend(`Create an image of ${prompt}`)
                    }}
                    title="Generate an image"
                    className="w-[46px] h-[46px] rounded-[10px] border border-[rgba(195,195,195,0.3)] bg-white flex items-center justify-center"
                  >
                    <img
                      src="/gallery.png"
                      alt="Gallery"
                      className="w-[24px] h-[24px]"
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSend()
                    }}
                    disabled={isThinking}
                    className="relative w-[46px] h-[46px] rounded-[14px] border border-white overflow-hidden flex items-center justify-center disabled:opacity-40"
                  >
                    <span className="absolute inset-0 bg-gradient-to-b from-[#4F46E5] to-[#0DA2FF]" />
                    {isThinking ? (
                      <span className="relative w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <img
                        src="/send.png"
                        alt="Send"
                        className="relative w-[26px] h-[26px]"
                      />
                    )}
                    <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_1px_4px_0px_#d2eaff]" />
                  </button>
                </div>
              </div>

              {/* Stats cards */}
              <div className="bg-white border border-white rounded-[30px] w-full p-[25px]">
                <div className="grid grid-cols-4 gap-[10px] xl:gap-[20px]">
                  {statsCards.map((card, i) => (
                    <div
                      key={i}
                      className="p-[16px] xl:p-[25px] bg-[#F3F4F6] rounded-[26px] flex flex-col justify-center min-h-[100px] xl:min-h-[121px] overflow-hidden"
                    >
                      <h2 className="text-[#696D7D] text-[clamp(11px,1.1vw,16px)] leading-snug break-words">
                        {card.label}
                      </h2>
                      <p
                        className={`text-[clamp(16px,1.6vw,26px)] font-medium mt-[8px] xl:mt-[20px] leading-tight break-words ${card.value === 'Error' ? 'text-red-500' : card.value === 'Online' ? 'text-green-600' : 'text-[#111827]'}`}
                      >
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side — Command History */}
          <div className="bg-white rounded-[30px] w-full lg:w-[340px] xl:w-[380px] [@media(min-width:1536px)]:w-[440px] [@media(min-width:1700px)]:w-[600px] lg:shrink-0 h-fit p-[20px] xl:p-[25px]">
            <div className="flex items-center gap-2">
              <div className="w-[36px] h-[26px] bg-[#F3F4F6] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 90 90"
                >
                  <circle cx="45" cy="45" r="45" fill="#6B7280" />
                  <path
                    d="M58.303 65.93c-1.186 0-2.359-.524-3.148-1.529l-13.3-16.93C41.301 46.767 41 45.896 41 45V15.85c0-2.209 1.791-4 4-4s4 1.791 4 4v27.767l12.445 15.842c1.364 1.737 1.062 4.251-.675 5.616C60.038 65.65 59.167 65.93 58.303 65.93z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-[20px] font-medium text-[#111827]">
                Command History
              </h3>
              <div className="flex items-center gap-2 ml-auto">
                {history.length > 0 && (
                  <>
                    <span className="text-[12px] text-[#696D7D] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                      {history.length}
                    </span>
                    <button
                      onClick={handleClearHistory}
                      title="Clear history"
                      className="w-[26px] h-[26px] rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-colors"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-[11px] mt-[25px]">
              {history.length === 0 ? (
                <div className="text-center text-[#696D7D] text-[14px] py-10">
                  <p className="text-[32px] mb-2">🎙️</p>
                  <p>No commands yet.</p>
                  <p className="text-[12px] mt-1 opacity-70">
                    Type or speak to Kira to get started.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="w-full bg-[#F3F4F6] rounded-[20px] overflow-hidden"
                  >
                    {/* Collapsed row */}
                    <button
                      className="w-full flex items-center gap-[12px] xl:gap-[15px] py-[8px] pl-[8px] pr-[12px] xl:pr-[15px] text-left"
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                    >
                      <div className="w-[52px] xl:w-[61px] h-[52px] xl:h-[61px] rounded-[16px] flex items-center justify-center flex-shrink-0 bg-white overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt="Generated"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <img
                            src="/Microphone.png"
                            alt=""
                            className="w-[24px] h-[24px]"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] xl:text-[16px] font-medium text-[#111827] truncate">
                          {item.command}
                        </p>
                        <p className="text-[12px] xl:text-[14px] text-[#696D7D] font-normal truncate">
                          {item.response}
                        </p>
                        {item.responseTimeMs && (
                          <p className="text-[10px] text-[#696D7D]/60">
                            {item.responseTimeMs}ms
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 gap-1">
                        <span className="text-[12px] xl:text-[14px] text-[#696D7D] font-normal">
                          {item.time}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform:
                              expandedId === item.id
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded panel */}
                    {expandedId === item.id && (
                      <div className="px-[12px] pb-[12px] border-t border-black/5">
                        {item.imageUrl && (
                          <div className="relative mt-3 group">
                            <img
                              src={item.imageUrl}
                              alt="Generated"
                              className="w-full rounded-[12px] object-cover max-h-[220px]"
                              onError={(e) =>
                                (e.currentTarget.style.display = 'none')
                              }
                            />
                            <button
                              onClick={() =>
                                downloadImage(
                                  item.imageUrl!,
                                  `kira-image-${item.id}.jpg`,
                                )
                              }
                              className="absolute top-2 right-2 w-[32px] h-[32px] rounded-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{
                                background: 'rgba(0,0,0,0.55)',
                                backdropFilter: 'blur(6px)',
                              }}
                              title="Download image"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                            </button>
                          </div>
                        )}

                        <p className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-wrap mt-3">
                          {item.response}
                        </p>

                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleCopyHistory(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] transition-all"
                            style={{
                              background:
                                copiedId === item.id
                                  ? 'rgba(99,102,241,0.1)'
                                  : 'rgba(0,0,0,0.04)',
                              border:
                                copiedId === item.id
                                  ? '1px solid rgba(99,102,241,0.3)'
                                  : '1px solid rgba(0,0,0,0.08)',
                              color:
                                copiedId === item.id ? '#6366f1' : '#6B7280',
                            }}
                          >
                            {copiedId === item.id ? (
                              <>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                              </>
                            ) : (
                              <>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    x="9"
                                    y="9"
                                    width="13"
                                    height="13"
                                    rx="2"
                                    ry="2"
                                  />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default BeedAI
