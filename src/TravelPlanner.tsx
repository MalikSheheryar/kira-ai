import { useState, useRef, useEffect } from 'react'
import {
  Compass, Bot, User, X, ChevronRight, MapPin,
  Plane, Hotel, Camera, Calendar, Star,
  ArrowRight, Loader2, Copy, Check,
  ThumbsUp, ThumbsDown, Download, Share2,
  CreditCard, Trash2, Plus, Navigation, Users, Sparkles,
} from 'lucide-react'

const uid = () => Math.random().toString(36).slice(2, 10)
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

// ─── Types ───────────────────────────────────────────────────────────
interface Msg { id: string; role: 'user' | 'ai'; text: string; actions?: string[] }
interface Flight { airline: string; code: string; from: string; to: string; depTime: string; arrTime: string; duration: string; stops: string; price: number; color: string }
interface Hotel { name: string; location: string; rating: number; reviews: number; price: number; amenities: string[]; color1: string; color2: string }
interface Activity { name: string; type: string; duration: string; price: number; rating: number; color1: string; color2: string }
interface TripDay { day: number; date: string; title: string; activities: string[]; color1: string; color2: string }
interface TripPlan { destination: string; country: string; dates: string; days: number; travelers: number; budget: number; flights: Flight[]; hotels: Hotel[]; activities: Activity[]; itinerary: TripDay[] }

// ─── Default Data Generators ─────────────────────────────────────────
const genFlights = (dest: string): Flight[] => {
  const destCode = dest.slice(0, 3).toUpperCase()
  return [
    { airline: 'Qatar Airways', code: 'QR', from: 'DXB', to: destCode, depTime: '11:45 PM', arrTime: '4:40 PM', duration: '12h 55m', stops: 'Nonstop', price: 1760, color: '#6b21a8' },
    { airline: 'Emirates', code: 'EK', from: destCode, to: 'DXB', depTime: '6:55 PM', arrTime: '10:15 AM', duration: '15h 20m', stops: '1 stop', price: 1680, color: '#dc2626' },
  ]
}

const genHotels = (dest: string): Hotel[] => [
  { name: `Park Hyatt ${dest}`, location: 'City Center', rating: 4.9, reviews: 1240, price: 520, amenities: ['Spa', 'Pool', 'Wi-Fi', 'Gym'], color1: '#667eea', color2: '#764ba2' },
  { name: `The Ritz-Carlton ${dest}`, location: 'Waterfront', rating: 4.8, reviews: 980, price: 480, amenities: ['View', 'Fine Dining', 'Bar'], color1: '#f093fb', color2: '#f5576c' },
  { name: `${dest} Marriott`, location: 'Downtown', rating: 4.5, reviews: 2100, price: 220, amenities: ['Wi-Fi', 'Restaurant', 'Gym'], color1: '#4facfe', color2: '#00f2fe' },
]

const genActivities = (dest: string): Activity[] => [
  { name: `${dest} City Highlights Tour`, type: 'Sightseeing', duration: '6 hours', price: 85, rating: 4.8, color1: '#f59e0b', color2: '#d97706' },
  { name: `Local Food & Market Tour`, type: 'Food & Drink', duration: '4 hours', price: 65, rating: 4.9, color1: '#4F46E5', color2: '#7C3AED' },
  { name: `Sunset River Cruise`, type: 'Cruise', duration: '3 hours', price: 120, rating: 4.7, color1: '#3b82f6', color2: '#2563eb' },
  { name: `Historic Temples Walk`, type: 'Cultural', duration: '5 hours', price: 45, rating: 4.6, color1: '#8b5cf6', color2: '#7c3aed' },
  { name: `Nightlife & Bar Hop`, type: 'Nightlife', duration: '4 hours', price: 95, rating: 4.5, color1: '#ec4899', color2: '#db2777' },
]

const genItinerary = (dest: string, days: number): TripDay[] => {
  const titles = [
    `Arrival and Evening Stroll in ${dest}`,
    `Old Town Charm and City Highlights`,
    `Temples and Culinary Delights`,
    `Modern Skyscrapers and River Cruise`,
    `Culture and Local Markets`,
    `Scenic Views and Photography`,
    `Shopping and Farewell Dinner`,
    `Departure Day`,
  ]
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    date: `May ${28 + i}`,
    title: titles[i % titles.length].replace('Arrival', `Arrival in ${dest}`).replace('Departure Day', `Departure from ${dest}`),
    activities: ['Morning Explore', 'Lunch at Local Spot', i === 0 ? 'Hotel Check-in' : i === days - 1 ? 'Airport Transfer' : 'Guided Tour', 'Evening Walk'],
    color1: ['#f59e0b', '#4F46E5', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#6b7280'][i % 8],
    color2: ['#d97706', '#7C3AED', '#dc2626', '#2563eb', '#7c3aed', '#0891b2', '#ea580c', '#4b5563'][i % 8],
  }))
}

export default function TravelPlanner() {
  const [chatOpen, setChatOpen] = useState(true)
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: uid(), role: 'ai', text: "Hey there! I'm Kira, your AI travel planner. Tell me where you want to go, when, and your budget — I'll craft the perfect itinerary for you.", actions: ['Plan a trip', 'Find flights', 'Explore hotels', 'Get inspiration'] },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState('')
  const [trip, setTrip] = useState<TripPlan>({
    destination: 'Shanghai', country: 'China', dates: '28 May - 2 Jun', days: 5, travelers: 2, budget: 5000,
    flights: genFlights('Shanghai'), hotels: genHotels('Shanghai'), activities: genActivities('Shanghai'),
    itinerary: genItinerary('Shanghai', 6),
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const extractTripInfo = (text: string) => {
    const t = text.toLowerCase()
    let dest = trip.destination
    let days = trip.days
    let budget = trip.budget

    const destMatch = t.match(/(?:to|in|for)\s+([a-z\s]+?)(?:\s+(?:for|under|with|\d|$))/i)
    if (destMatch) dest = destMatch[1].trim().replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    const dayMatch = t.match(/(\d+)\s*(?:day|days)/i)
    if (dayMatch) days = parseInt(dayMatch[1])

    const budgetMatch = t.match(/[\$£€]?(\d[\d,]*)/)
    if (budgetMatch) budget = parseInt(budgetMatch[1].replace(/,/g, ''))

    // Extract destination from common cities
    const cities = ['tokyo', 'paris', 'bali', 'dubai', 'santorini', 'bangkok', 'london', 'new york', 'rome', 'sydney', 'cairo', 'istanbul', 'maldives', 'seoul', 'singapore']
    for (const city of cities) {
      if (t.includes(city)) {
        dest = city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        break
      }
    }

    return { destination: dest, days, budget }
  }

  const updateTripFromChat = (userMsg: string, aiReply: string) => {
    const { destination, days, budget } = extractTripInfo(userMsg + ' ' + aiReply)
    const fullDays = Math.max(days, 3)
    setTrip({
      destination, country: 'Destination', dates: trip.dates, days: fullDays, travelers: 2, budget,
      flights: genFlights(destination),
      hotels: genHotels(destination),
      activities: genActivities(destination),
      itinerary: genItinerary(destination, fullDays + 1),
    })
  }

  const send = async (text?: string) => {
    const txt = (text || input).trim()
    if (!txt || loading) return
    setInput('')
    setLoading(true)
    const userMsg: Msg = { id: uid(), role: 'user', text: txt }
    setMsgs(p => [...p, userMsg])

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are Kira, an expert AI travel planner. Be warm, concise, and practical. Include specific prices and recommendations. Format with clear sections.' },
            ...msgs.slice(-4).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: txt },
          ],
          temperature: 0.7, max_tokens: 600,
        }),
      })
      const data = await res.json()
      const reply = data.choices[0].message.content
      setMsgs(p => [...p, { id: uid(), role: 'ai', text: reply }])
      updateTripFromChat(txt, reply)
    } catch {
      const destInfo = extractTripInfo(txt)
      const fallback = `Great choice! I've planned an amazing ${destInfo.days}-day trip to ${destInfo.destination}.

Flights: From $${Math.round(destInfo.budget * 0.35).toLocaleString()} roundtrip
Hotel: From $${Math.round(destInfo.budget * 0.08)}/night
Activities: ${genActivities(destInfo.destination).length} curated experiences

Your itinerary is ready on the right! You can adjust flights, hotels, and activities.`
      setMsgs(p => [...p, { id: uid(), role: 'ai', text: fallback, actions: ['Adjust flights', 'Change hotel', 'Add activities'] }])
      updateTripFromChat(txt, fallback)
    }
    setLoading(false)
  }

  const copy = (text: string, id: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(''), 2000) }

  const totalCost = () => {
    const f = trip.flights.reduce((s, f) => s + f.price, 0) * trip.travelers
    const h = trip.hotels[0]?.price || 0
    const a = trip.activities.reduce((s, a) => s + a.price, 0) * trip.travelers
    return { flights: f, hotel: h * trip.days, activities: a, total: f + h * trip.days + a }
  }
  const costs = totalCost()

  return (
    <div className="h-full flex" style={{ background: 'linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 50%, #f5f0ff 100%)' }}>

      {/* ═════ LEFT CHAT PANEL ═════ */}
      {chatOpen && (
        <div className="w-[400px] min-w-[400px] flex-shrink-0 border-r border-gray-200/60 bg-white flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center"><Compass className="w-5 h-5 text-white" /></div>
              <div><span className="text-[15px] font-bold text-[#1a1a2e]">Kira Travel</span><p className="text-[10px] text-gray-400">AI Trip Planner</p></div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            <div className="space-y-4">
              {msgs.map(m => (
                <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="w-3.5 h-3.5 text-white" /></div>
                  )}
                  <div className={`max-w-[85%] ${m.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-[#4F46E5] text-white rounded-br-md' : 'bg-gray-50 text-[#1a1a2e] rounded-bl-md border border-gray-100'}`}>{m.text}</div>
                    {m.actions && <div className="flex flex-wrap gap-1.5 mt-2">{m.actions.map((a, i) => <button key={i} onClick={() => send(a)} className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] text-gray-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all shadow-sm">{a}</button>)}</div>}
                    {m.role === 'ai' && <div className="flex items-center gap-0.5 mt-1"><button onClick={() => copy(m.text, m.id)} className="p-1 rounded hover:bg-gray-100 text-gray-400">{copiedId === m.id ? <Check className="w-3 h-3 text-[#4F46E5]" /> : <Copy className="w-3 h-3" />}</button><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><ThumbsUp className="w-3 h-3" /></button><button className="p-1 rounded hover:bg-gray-100 text-gray-400"><ThumbsDown className="w-3 h-3" /></button></div>}
                  </div>
                  {m.role === 'user' && <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5"><User className="w-3.5 h-3.5 text-gray-500" /></div>}
                </div>
              ))}
              {loading && <div className="flex gap-2.5"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-white" /></div><div className="px-3.5 py-2.5 rounded-2xl bg-gray-50 rounded-bl-md border border-gray-100"><Loader2 className="w-3.5 h-3.5 text-[#4F46E5] animate-spin" /></div></div>}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-[#4F46E5] transition-all">
              <Navigation className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Ask about ${trip.destination}...`} className="flex-1 bg-transparent text-[13px] outline-none placeholder-gray-400 min-w-0" />
              <button onClick={() => send()} disabled={!input.trim() || loading} className="w-8 h-8 rounded-full bg-[#4F46E5] hover:bg-[#4338ca] disabled:bg-gray-300 flex items-center justify-center transition-colors flex-shrink-0"><ArrowRight className="w-4 h-4 text-white" /></button>
            </div>
            <p className="text-[9px] text-gray-400 mt-2 text-center">AI travel planning - Prices are estimates</p>
          </div>
        </div>
      )}

      {/* ═════ RIGHT RESULTS PANEL - DYNAMIC FROM CHAT ═════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {!chatOpen && <button onClick={() => setChatOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><Compass className="w-5 h-5" /></button>}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
              <Calendar className="w-3.5 h-3.5 text-gray-500" /><span className="text-[12px] text-gray-600">{trip.dates}</span>
              <Users className="w-3.5 h-3.5 text-gray-500 ml-1" /><span className="text-[12px] text-gray-600">{trip.travelers} travellers</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20">
              <span className="text-[11px] font-medium text-[#4F46E5]">${costs.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTrip({ ...trip, destination: 'Shanghai', flights: genFlights('Shanghai'), hotels: genHotels('Shanghai'), activities: genActivities('Shanghai'), itinerary: genItinerary('Shanghai', 6) })} className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-100 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> New</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[11px] font-bold">JD</div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-[900px] mx-auto">

            {/* HERO BANNER - Blue Glassmorphism */}
            <div className="relative overflow-hidden rounded-none">
              {/* Animated gradient background layer */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 25%, #3b82f6 50%, #2563eb 75%, #1e40af 100%)' }} />
              {/* Frosted glass overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
              {/* Floating glass orbs */}
              <div className="absolute top-6 right-16 w-24 h-24 rounded-full bg-blue-300/20 blur-2xl" />
              <div className="absolute top-12 right-40 w-14 h-14 rounded-full bg-cyan-300/15 blur-xl" />
              <div className="absolute bottom-12 left-[25%] w-32 h-32 rounded-full bg-blue-400/15 blur-2xl" />
              <div className="absolute top-8 left-16 w-10 h-10 rounded-full bg-sky-300/20 blur-lg" />
              <div className="absolute bottom-6 right-[30%] w-20 h-20 rounded-full bg-indigo-300/15 blur-xl" />
              <div className="absolute top-1/2 left-[60%] w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative px-6 pt-8 pb-6">
                {/* Top line with glass badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-4">
                  <Sparkles className="w-3 h-3 text-blue-200" />
                  <p className="text-[10px] font-semibold text-blue-100 tracking-[0.15em] uppercase">Kira Travel Planner</p>
                </div>
                {/* Headline */}
                <h1 className="text-[28px] font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                  SEE THE WORLD FOR LESS<br />WITH <span className="text-blue-200">KIRA</span>
                </h1>
                <p className="text-[12px] text-blue-100/70 mt-2 mb-5">AI-powered trip planning · Best deals · Multiple options</p>

                {/* Search Form Card with glass edge */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/40">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-[140px] px-3 py-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <Hotel className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-blue-400 uppercase tracking-wide">Destination</p>
                        <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">{trip.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[140px] px-3 py-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-blue-400 uppercase tracking-wide">Dates</p>
                        <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">{trip.dates}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[100px] px-3 py-2.5 rounded-xl bg-blue-50/60 border border-blue-100/80">
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-blue-400 uppercase tracking-wide">Guests</p>
                        <p className="text-[13px] font-semibold text-[#1a1a2e]">{trip.travelers}</p>
                      </div>
                    </div>
                    <button onClick={() => setChatOpen(true)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[13px] font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 flex-shrink-0">
                      <Sparkles className="w-4 h-4" /> Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="flex items-center justify-center gap-8 py-4 border-b border-gray-100">
              {[{ icon: Calendar, label: `${trip.days} days` }, { icon: MapPin, label: trip.destination }, { icon: Star, label: `${trip.activities.length * 4} experiences` }, { icon: Hotel, label: `${trip.hotels.length} hotels` }, { icon: Plane, label: `${trip.flights.length} flights` }].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[13px] text-gray-600"><s.icon className="w-4 h-4 text-gray-400" />{s.label}</div>
              ))}
            </div>

            {/* ROUTE PILL */}
            <div className="flex items-center justify-center py-5">
              <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-gray-50 border border-gray-200">
                <span className="text-[13px] text-gray-600 font-medium">DXB</span>
                <div className="w-6 h-px bg-gray-300" /><Plane className="w-3.5 h-3.5 text-gray-400" /><div className="w-6 h-px bg-gray-300" />
                <div className="flex flex-col items-center px-3 py-1 rounded-lg bg-[#4F46E5]/10 border border-[#4F46E5]/20">
                  <span className="text-[12px] font-semibold text-[#4F46E5]">{trip.destination}</span><span className="text-[10px] text-gray-400">{trip.dates}</span>
                </div>
                <div className="w-6 h-px bg-gray-300" /><Plane className="w-3.5 h-3.5 text-gray-400" /><div className="w-6 h-px bg-gray-300" />
                <span className="text-[13px] text-gray-600 font-medium">DXB</span>
              </div>
            </div>

            {/* MAP */}
            <div className="px-6 pb-5">
              <div className="relative h-[220px] rounded-2xl overflow-hidden bg-[#eef2ff] border border-[#c7d2fe]">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice">
                  <rect width="900" height="220" fill="#eef2ff" />
                  <ellipse cx="200" cy="110" rx="100" ry="70" fill="#c7d2fe" opacity="0.6" />
                  <ellipse cx="650" cy="90" rx="160" ry="80" fill="#c7d2fe" opacity="0.6" />
                  <ellipse cx="420" cy="160" rx="90" ry="45" fill="#c7d2fe" opacity="0.4" />
                  <line x1="200" y1="90" x2="650" y2="75" stroke="#4F46E5" strokeWidth="2.5" strokeDasharray="10,5" opacity="0.7" />
                  {[60, 120, 180].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#a5b4fc" strokeWidth="0.5" opacity="0.3" />)}
                  {[180, 360, 540, 720].map(x => <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="#a5b4fc" strokeWidth="0.5" opacity="0.3" />)}
                </svg>
                {/* Dubai */}
                <div className="absolute" style={{ left: '16%', top: '30%' }}>
                  <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center border-[3px] border-[#4F46E5] relative">
                    <span className="text-[11px] font-bold text-[#4F46E5]">DXB</span>
                    <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#4F46E5]/20 animate-ping" />
                  </div>
                  <div className="text-center mt-1"><span className="text-[11px] font-semibold text-[#1a1a2e] bg-white/90 px-2 py-0.5 rounded shadow-sm">Dubai</span></div>
                </div>
                {/* {trip.destination} */}
                <div className="absolute" style={{ left: '66%', top: '22%' }}>
                  <div className="w-16 h-16 rounded-full bg-[#4F46E5] shadow-lg flex items-center justify-center border-[3px] border-white relative">
                    <span className="text-[11px] font-bold text-white">{trip.destination.slice(0, 3).toUpperCase()}</span>
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#4F46E5]/30 animate-ping" />
                  </div>
                  <div className="text-center mt-1"><span className="text-[11px] font-semibold text-[#1a1a2e] bg-white/90 px-2 py-0.5 rounded shadow-sm">{trip.destination}</span></div>
                </div>
                {/* Plane mid-route */}
                <div className="absolute" style={{ left: '40%', top: '24%' }}>
                  <div className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Plane className="w-4 h-4 text-[#4F46E5]" style={{ transform: 'rotate(45deg)' }} />
                  </div>
                </div>
                <div className="absolute top-3 right-3"><button className="px-3 py-1.5 rounded-full bg-white/90 text-[11px] text-gray-600 shadow-sm hover:bg-white border border-gray-100">View full map</button></div>
                <div className="absolute bottom-3 left-3">
                  <div className="px-3 py-1.5 rounded-full bg-white/90 text-[11px] text-gray-600 shadow-sm border border-gray-100"><span className="font-semibold">{(6470).toLocaleString()} km</span> — {trip.flights[0]?.duration || '9h 30m'}</div>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            <div className="px-6 pb-6">
              {/* Days header */}
              <div className="flex items-start gap-4 pb-5">
                <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0"><Calendar className="w-4 h-4 text-white" /></div>
                <div className="pt-1"><p className="text-[13px] font-semibold text-[#1a1a2e]">Days 1-{trip.itinerary.length}</p><p className="text-[11px] text-gray-400">{trip.dates}</p></div>
              </div>

              {/* Destination intro */}
              <div className="flex items-start gap-4 pb-5">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><MapPin className="w-4 h-4 text-gray-500" /></div>
                  <div className="w-px flex-1 bg-gray-200 mt-2 min-h-[20px]" />
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-[22px] font-bold text-[#1a1a2e]">{trip.destination}</h3>
                  <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">Your upcoming trip to <strong>{trip.destination}</strong> promises an incredible blend of culture, cuisine, and unforgettable experiences. From iconic landmarks to hidden gems, this itinerary has been crafted to give you the perfect balance of adventure and relaxation.</p>
                </div>
              </div>

              {/* Outbound Flight */}
              {trip.flights[0] && <div className="flex items-start gap-4 pb-5">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><Plane className="w-4 h-4 text-gray-500" /></div>
                  <div className="w-px flex-1 bg-gray-200 mt-2 min-h-[20px]" />
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">Outbound Flight</p>
                  <p className="text-[11px] text-gray-400">{trip.flights[0].from} to {trip.flights[0].to}</p>
                  <div className="mt-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: trip.flights[0].color }}>
                        <span className="text-[12px] font-bold text-white">{trip.flights[0].code}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[18px] font-bold text-[#1a1a2e]">{trip.flights[0].from}</span>
                          <div className="flex-1 flex items-center min-w-[40px]"><div className="w-full h-px bg-gray-300 relative"><Plane className="w-3.5 h-3.5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div></div>
                          <span className="text-[18px] font-bold text-[#1a1a2e]">{trip.flights[0].to}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 flex-wrap">
                          <span>{trip.flights[0].depTime} departure</span><span>{trip.flights[0].duration}</span><span className="text-[#4F46E5] font-medium">{trip.flights[0].stops}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[20px] font-bold text-[#1a1a2e]">${trip.flights[0].price.toLocaleString()} <span className="text-[11px] text-gray-400 font-normal">per person</span></span>
                      <div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors">Change</button><button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Hotel */}
              {trip.hotels[0] && <div className="flex items-start gap-4 pb-5">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><Hotel className="w-4 h-4 text-gray-500" /></div>
                  <div className="w-px flex-1 bg-gray-200 mt-2 min-h-[20px]" />
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">Hotel</p>
                  <p className="text-[11px] text-gray-400">{trip.hotels[0].location}</p>
                  <div className="mt-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${trip.hotels[0].color1}, ${trip.hotels[0].color2})` }}>
                        <Hotel className="w-10 h-10 text-white/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#1a1a2e]">{trip.hotels[0].name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= Math.round(trip.hotels[0].rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                          <span className="text-[10px] text-gray-400 ml-1">{trip.hotels[0].rating} · {trip.hotels[0].reviews.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {trip.hotels[0].amenities.map((a, i) => <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-[9px] text-gray-500">{a}</span>)}
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[18px] font-bold text-[#1a1a2e]">${trip.hotels[0].price}</span><span className="text-[11px] text-gray-400">/night · {trip.days} nights = ${(trip.hotels[0].price * trip.days).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex gap-1">
                        {trip.hotels.slice(1, 3).map((h, i) => (
                          <button key={i} className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] text-gray-500 hover:border-gray-200 transition-colors">{h.name}</button>
                        ))}
                      </div>
                      <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors">Change</button>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Activities */}
              <div className="flex items-start gap-4 pb-5">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-gray-500" /></div>
                  <div className="w-px flex-1 bg-gray-200 mt-2 min-h-[20px]" />
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">Activities ({trip.activities.length})</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {trip.activities.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${a.color1}, ${a.color2})` }}>
                          <Camera className="w-6 h-6 text-white/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1a1a2e]">{a.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span>{a.type}</span><span>·</span><span>{a.duration}</span><span>·</span><Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400 inline" /><span>{a.rating}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[14px] font-bold text-[#1a1a2e]">${a.price}</span>
                          <button className="block mt-1 px-2 py-0.5 rounded text-[9px] text-gray-400 hover:text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day Cards */}
              {trip.itinerary.map((day, i) => (
                <div key={i} className="flex items-start gap-4 pb-5">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><span className="text-[11px] font-bold text-gray-500">{day.day}</span></div>
                    {i < trip.itinerary.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2 min-h-[20px]" />}
                  </div>
                  <div className="flex-1 pt-0.5 min-w-0">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer">
                      <div className="w-20 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: `linear-gradient(135deg, ${day.color1}, ${day.color2})` }}>
                        <Camera className="w-7 h-7 text-white/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">Day {day.day}</span>
                          <span className="text-[10px] text-gray-400">{day.activities.length} activities · {day.date}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[#1a1a2e] leading-snug">{day.title}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}

              {/* Return Flight */}
              {trip.flights[1] && <div className="flex items-start gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center flex-shrink-0"><Plane className="w-4 h-4 text-white" /></div>
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1a1a2e]">Return Flight</p>
                  <div className="mt-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: trip.flights[1].color }}>
                        <span className="text-[12px] font-bold text-white">{trip.flights[1].code}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[18px] font-bold text-[#1a1a2e]">{trip.flights[1].from}</span>
                          <div className="flex-1 flex items-center min-w-[40px]"><div className="w-full h-px bg-gray-300 relative"><Plane className="w-3.5 h-3.5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div></div>
                          <span className="text-[18px] font-bold text-[#1a1a2e]">{trip.flights[1].to}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 flex-wrap">
                          <span>{trip.flights[1].depTime} departure</span><span>{trip.flights[1].duration}</span><span>{trip.flights[1].stops}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[20px] font-bold text-[#1a1a2e]">${trip.flights[1].price.toLocaleString()} <span className="text-[11px] text-gray-400 font-normal">per person</span></span>
                      <div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors">Change</button><button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Total Cost Summary */}
              <div className="flex items-start gap-4 pb-6">
                <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-[#4F46E5]" /></div>
                <div className="flex-1 bg-[#1a1a2e] rounded-2xl p-5 text-white">
                  <h3 className="text-[14px] font-semibold mb-3">Trip Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]"><span className="text-white/60">Flights ({trip.travelers}x)</span><span>${costs.flights.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[12px]"><span className="text-white/60">Hotel ({trip.days} nights)</span><span>${costs.hotel.toLocaleString()}</span></div>
                    <div className="flex justify-between text-[12px]"><span className="text-white/60">Activities ({trip.activities.length})</span><span>${costs.activities.toLocaleString()}</span></div>
                    <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-end">
                      <span className="text-[13px] font-semibold">Total Estimated</span>
                      <span className="text-[24px] font-bold">${costs.total.toLocaleString()}</span>
                    </div>
                    {costs.total <= trip.budget && <p className="text-[10px] text-[#4F46E5] mt-1">Under budget by ${(trip.budget - costs.total).toLocaleString()}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-200 bg-white flex-shrink-0">
          <p className="text-[14px] font-semibold text-[#1a1a2e]">{trip.days}-Day {trip.destination} Trip</p>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"><Share2 className="w-4 h-4" /></button>
            <button className="px-4 py-2.5 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#4F46E5]/20 transition-colors"><Download className="w-4 h-4" /> Download</button>
            <button className="px-5 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-[12px] font-medium flex items-center gap-1.5 hover:bg-[#2a2a3e] transition-colors"><CreditCard className="w-4 h-4" /> Book Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}
