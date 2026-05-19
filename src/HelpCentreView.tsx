import React, { useState } from 'react'
import {
  Search, HelpCircle, ChevronDown, ChevronUp, Mail, MessageSquare,
  Phone, ExternalLink, BookOpen, Video, FileText, Settings as SettingsIcon,
  Shield, CreditCard, User, Globe, Zap, Bell, Star, ArrowRight,
  Clock, CheckCircle2, AlertCircle, MessageCircle, Mic, FolderOpen,
  Cloud, Sparkles, Code, Plane, Utensils, QrCode, Calendar, Monitor,
  Smartphone, Tablet, Send, X,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════ */
const KIRA_BTN_BLUE = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_BLUE_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const KIRA_CARD_BG = 'rgba(255,255,255,0.82)'
const KIRA_CARD_BORDER = '1px solid rgba(17,24,39,0.07)'
const KIRA_ACTIVE_BG = 'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'

/* ═══════════════════════════════════════════════════════════ */
const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: Sparkles, desc: 'Learn the basics of Kira', color: '#3b82f6' },
  { id: 'account', label: 'Account & Profile', icon: User, desc: 'Manage your account settings', color: '#8b5cf6' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, desc: 'Payments, plans, and invoices', color: '#10b981' },
  { id: 'features', label: 'Features & Tools', icon: Zap, desc: 'How to use Kira features', color: '#f59e0b' },
  { id: 'security', label: 'Security & Privacy', icon: Shield, desc: 'Keep your account safe', color: '#ef4444' },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle, desc: 'Fix common issues', color: '#6366f1' },
]

const faqs: Record<string, { q: string; a: string }[]> = {
  'getting-started': [
    { q: 'What is Kira AI?', a: 'Kira AI is your intelligent personal assistant that helps you manage tasks, plan trips, write code, organize files, and much more — all through natural conversation.' },
    { q: 'How do I get started with Kira?', a: 'Simply sign up for an account, complete your profile, and start chatting with Kira. You can ask Kira to help with anything from planning a trip to writing an email campaign.' },
    { q: 'What can Kira do for me?', a: 'Kira can help with travel planning, email campaigns, code reviews, meal planning, document analysis, social media strategy, homework help, meeting scheduling, and much more.' },
    { q: 'Is there a mobile app?', a: 'Yes! Kira is available on iOS and Android. You can download the app from the App Store or Google Play Store to access Kira on the go.' },
    { q: 'How do I update my profile?', a: 'Go to Settings → Profile to update your display name, email, phone number, bio, location, and work information.' },
  ],
  'account': [
    { q: 'How do I change my email address?', a: 'Navigate to Settings → Profile → Contact Information. Update your email address and click Save Changes. You will receive a verification email to confirm the new address.' },
    { q: 'How do I reset my password?', a: 'Go to Settings → Security and click "Reset Password". A reset link will be sent to your registered email address. Follow the link to create a new password.' },
    { q: 'How do I enable two-factor authentication?', a: 'Navigate to Settings → Security and toggle on "Two-Factor Authentication". Follow the setup process using your preferred authenticator app.' },
    { q: 'Can I have multiple accounts?', a: 'Yes, you can create multiple Kira accounts with different email addresses. However, each account requires a separate subscription.' },
    { q: 'How do I delete my account?', a: 'Contact our support team to request account deletion. Please note that this action is irreversible and all your data will be permanently removed.' },
  ],
  'billing': [
    { q: 'What plans does Kira offer?', a: 'Kira offers a Free plan with basic features, a Pro plan at $29/month with full AI capabilities, and an Enterprise plan for teams with custom pricing.' },
    { q: 'How do I upgrade my plan?', a: 'Go to Settings → Billing & Cards → Subscription. Click "Upgrade" and select your preferred plan. Payment will be processed using your default card.' },
    { q: 'How do I add a payment method?', a: 'Navigate to Settings → Billing & Cards and click "Add Card". Enter your card details and click Save. You can set a default card and spending limits.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Settings → Billing & Cards → Subscription and click "Cancel Plan". You will continue to have access until the end of your billing period.' },
    { q: 'Can I get a refund?', a: 'Refunds are handled on a case-by-case basis. Contact our support team within 14 days of your purchase to request a refund.' },
  ],
  'features': [
    { q: 'How does the Travel Planner work?', a: 'Ask Kira to plan a trip by providing your destination, dates, budget, and number of travelers. Kira will find flights, hotels, activities, and create a day-by-day itinerary.' },
    { q: 'How do I use the AI Code Assistant?', a: 'Go to the Coder tab and describe what you need help with. Kira can review code, suggest improvements, debug errors, and help with refactoring.' },
    { q: 'How does the Meal Planner work?', a: 'Tell Kira your dietary preferences, restrictions, and goals. Kira will create a weekly meal plan with recipes and generate a grocery list for you.' },
    { q: 'Can Kira help with homework?', a: 'Yes! Go to the Homework tab and ask Kira for help with any subject. Kira can explain concepts, solve problems, and create study guides.' },
    { q: 'How do I create a QR code?', a: 'Navigate to the QR Code tab, enter the URL or text you want to encode, customize the appearance if desired, and download the QR code image.' },
    { q: 'How does the floating AI Orb work?', a: 'The Orb appears on all pages and listens for voice commands. You can toggle it on/off in Settings → Kira Orb and set your preferred wake word.' },
  ],
  'security': [
    { q: 'Is my data secure with Kira?', a: 'Yes. Kira uses end-to-end encryption for all data transmission and storage. We are SOC 2 Type II certified and comply with GDPR and CCPA regulations.' },
    { q: 'What is the Kira Orb wake word?', a: 'The default wake word is "Hey Kira". You can customize it in Settings → Wake Word to any phrase you prefer, or choose from presets like "Okay Kira" or "Hey Beeda".' },
    { q: 'How do I manage browser permissions?', a: 'Go to Settings → Browser to control what Kira can access: read page content, fill forms, take screenshots, and manage bookmarks.' },
    { q: 'Can Kira access my files?', a: 'Kira can only access file types you explicitly allow in Settings → File Access. You have granular control over documents, images, audio, video, and code files.' },
    { q: 'How do I review signed-in devices?', a: 'Navigate to Settings → Security → Signed-In Devices to see all active sessions. You can sign out remote devices individually.' },
  ],
  'troubleshooting': [
    { q: 'Kira is not responding. What should I do?', a: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, try signing out and back in.' },
    { q: 'Why did my integration disconnect?', a: 'Integrations may disconnect if the authentication token expires. Go to Settings → Integrations and reconnect the service. You may need to re-authorize.' },
    { q: 'My file upload failed. What should I check?', a: 'Ensure the file type is allowed in Settings → File Access, check that the file size is under 100MB, and verify your internet connection is stable.' },
    { q: 'The AI Orb is not showing. How do I fix it?', a: 'Make sure the Orb is enabled in Settings → Kira Orb. If it is enabled but not visible, try refreshing the page or checking for browser extension conflicts.' },
    { q: 'How do I report a bug?', a: 'Use the Contact Support button below or email support@beeda.ai. Include screenshots, steps to reproduce, and your browser version for faster resolution.' },
  ],
}

const guides = [
  { title: 'Getting Started Guide', desc: 'Everything you need to know to start using Kira', icon: BookOpen, time: '5 min read' },
  { title: 'Video Tutorials', desc: 'Watch step-by-step video guides', icon: Video, time: '12 videos' },
  { title: 'Feature Deep Dive', desc: 'Explore all Kira features in detail', icon: FileText, time: '15 min read' },
  { title: 'API Documentation', desc: 'Integrate Kira into your applications', icon: Code, time: 'Developer docs' },
]

/* ═══════════════════════════════════════════════════════════ */
export default function HelpCentreView() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [showContact, setShowContact] = useState(false)

  const currentFaqs = faqs[activeCategory] || []
  const filteredFaqs = search
    ? Object.values(faqs).flat().filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : currentFaqs

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'url("/MainBG.png") center right / cover no-repeat' }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: KIRA_CARD_BORDER, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)' }}>
        <div>
          <h1 className="text-[30px] font-medium text-black">Help Centre</h1>
          <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">Find answers and get support</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[900px] mx-auto space-y-6">

          {/* ── Search ── */}
          <div className="p-6 rounded-[20px] text-center" style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
            <h2 className="text-[18px] font-semibold text-[#1a1a2e] mb-2">How can we help you?</h2>
            <p className="text-[13px] text-[#696D7D] mb-4">Search our knowledge base or browse categories below</p>
            <div className="relative max-w-[500px] mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search for answers..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            {search && (
              <p className="text-[12px] text-[#696D7D] mt-2">Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* ── Categories ── */}
          {!search && (
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className="p-4 rounded-2xl border transition-all text-left hover:shadow-md"
                    style={{
                      borderColor: isActive ? cat.color : 'rgba(17,24,39,0.07)',
                      background: isActive ? `${cat.color}08` : KIRA_CARD_BG,
                      backdropFilter: 'blur(16px)',
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: `${cat.color}12` }}>
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-[#1a1a2e]">{cat.label}</h3>
                    <p className="text-[11px] text-[#696D7D]">{cat.desc}</p>
                    <p className="text-[11px] mt-1 font-medium" style={{ color: cat.color }}>{faqs[cat.id]?.length || 0} articles</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── FAQ Section ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#1a1a2e]">
                {search ? 'Search Results' : `${categories.find(c => c.id === activeCategory)?.label} FAQ`}
              </h3>
              <span className="text-[12px] text-[#696D7D]">{filteredFaqs.length} articles</span>
            </div>

            {filteredFaqs.length === 0 && (
              <div className="p-8 rounded-2xl text-center" style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
                <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-[14px] text-[#696D7D]">No results found. Try a different search term.</p>
              </div>
            )}

            {filteredFaqs.map((faq, i) => {
              const key = `${activeCategory}-${i}`
              const isOpen = openFaq === key
              return (
                <div key={key} className="rounded-2xl border transition-all"
                  style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="w-full flex items-center justify-between p-5 text-left">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-[14px] font-medium text-[#1a1a2e]">{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="pl-8 border-t pt-4" style={{ borderColor: 'rgba(17,24,39,0.07)' }}>
                        <p className="text-[13px] text-[#696D7D] leading-relaxed">{faq.a}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button className="flex items-center gap-1.5 text-[12px] text-emerald-600 hover:text-emerald-700 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" />Helpful
                          </button>
                          <button className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                            <AlertCircle className="w-3.5 h-3.5" />Not helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Guides ── */}
          {!search && (
            <div className="grid grid-cols-2 gap-3">
              {guides.map(g => {
                const Icon = g.icon
                return (
                  <button key={g.title} className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md text-left"
                    style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.background = 'rgba(59,130,246,0.03)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(17,24,39,0.07)'; e.currentTarget.style.background = KIRA_CARD_BG }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-[#1a1a2e]">{g.title}</h4>
                      <p className="text-[11px] text-[#696D7D]">{g.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-[11px] text-[#696D7D]">{g.time}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Contact Support ── */}
          <div className="p-6 rounded-[20px]" style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-2">Still need help?</h3>
            <p className="text-[13px] text-[#696D7D] mb-4">Our support team is available 24/7 to assist you.</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setShowContact(!showContact)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all hover:opacity-90"
                style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                <MessageSquare className="w-4 h-4" />Contact Support
              </button>
              <a href="mailto:support@beeda.ai"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:bg-gray-50"
                style={{ background: 'rgba(255,255,255,0.6)', border: KIRA_CARD_BORDER, color: '#1a1a2e' }}>
                <Mail className="w-4 h-4" />Email Us
              </a>
            </div>
            {showContact && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/30 border border-blue-100 space-y-3">
                <div>
                  <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Subject</label>
                  <input placeholder="What do you need help with?"
                    className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                    style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Message</label>
                  <textarea placeholder="Describe your issue in detail..." rows={4}
                    className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all resize-none"
                    style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                </div>
                <button className="px-6 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all hover:opacity-90"
                  style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                  Send Message
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
