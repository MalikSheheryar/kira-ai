import React, { useState } from 'react'
import {
  User, FileText, Shield, Bell, Sliders, Link2, CreditCard,
  Radio, Mic, FolderOpen, Globe, Cloud, Moon, Sun,
  Eye, EyeOff, Check, ChevronRight, Save, Smartphone,
  Fingerprint, Plus, X, Trash2, DollarSign,
  Lock, RefreshCw, Image, Music, Video,
  Sparkles, CheckCheck, Info, MapPin, Phone, Mail,
  Calendar, Clock, Monitor, Tablet, Laptop, LogOut,
  HelpCircle, FileCode, Users, Heart, Star,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════ */
const KIRA_BTN_BLUE = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_BLUE_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const KIRA_ACTIVE_BG = 'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)'
const KIRA_CARD_BG = 'rgba(255,255,255,0.82)'
const KIRA_CARD_BORDER = '1px solid rgba(17,24,39,0.07)'

/* ═══════════════════════════════════════════════════════════ */
const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button onClick={onChange} className="relative flex-shrink-0 w-12 transition-all duration-300 rounded-full h-7"
    style={{ background: on ? KIRA_BTN_BLUE : '#e5e7eb' }}>
    <div className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
      style={{ left: on ? 'calc(100% - 25px)' : '3px' }} />
  </button>
)

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 rounded-[20px] transition-shadow hover:shadow-lg ${className}`}
    style={{ background: KIRA_CARD_BG, backdropFilter: 'blur(16px)', border: KIRA_CARD_BORDER }}>
    {children}
  </div>
)

const SectionHead = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <div>
      <h2 className="text-[20px] font-semibold text-[#1a1a2e]">{title}</h2>
      <p className="text-[13px] text-[#696D7D]">{desc}</p>
    </div>
  </div>
)

/* ═══════════════════════════════════════════════════════════ */
export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState('')
  const [showPw, setShowPw] = useState(false)
const [showNewPw] = useState(false)

  const [twoFA, setTwoFA] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [orbListening, setOrbListening] = useState(true)
  const [wakeWord, setWakeWord] = useState('Hey Kira')
  const [customWakeWord, setCustomWakeWord] = useState('')
  const [wakeMode, setWakeMode] = useState<'preset' | 'custom'>('preset')
  const [browserAccess, setBrowserAccess] = useState(true)
  const [cloudSync, setCloudSync] = useState(true)
  const [agentAutonomous, setAgentAutonomous] = useState(false)
  const [cardLimit, setCardLimit] = useState('5000')
  const [showAddCard, setShowAddCard] = useState(false)
  const [showResetPw, setShowResetPw] = useState(false)
  const [savedCards, setSavedCards] = useState([
    { id: 'c1', name: 'Kobe Bryant', number: '**** **** **** 4242', expiry: '12/27', type: 'visa', default: true },
  ])
  const [showCardNum, setShowCardNum] = useState(false)
  const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvv: '', type: 'visa' })
  const [emailNotifs, setEmailNotifs] = useState({ bookings: true, marketing: false, weekly: true, security: true })
  const [pushNotifs, setPushNotifs] = useState({ bookings: true, messages: true, reminders: true })
  const [profile, setProfile] = useState({
    firstName: 'Kobe', lastName: 'Bryant', displayName: 'Kobe Bryant',
    email: 'kobe@beeda.ai', phone: '+1 (424) 555-0192',
    bio: 'AI enthusiast and productivity hacker. Building the future with Kira.',
    city: 'Los Angeles', country: 'United States', timezone: 'Pacific Time (PT)',
    jobTitle: 'Product Manager', company: 'Beeda AI', website: 'kobe.beeda.ai',
    language: 'English', birthday: 'August 23',
  })

  const fileTypes = [
    { id: 'docs', label: 'Documents', icon: FileText, desc: 'PDF, DOC, TXT, RTF', enabled: true },
    { id: 'images', label: 'Images', icon: Image, desc: 'JPG, PNG, GIF, WebP, SVG', enabled: true },
    { id: 'audio', label: 'Audio', icon: Music, desc: 'MP3, WAV, M4A, FLAC', enabled: false },
    { id: 'video', label: 'Video', icon: Video, desc: 'MP4, MOV, AVI, MKV', enabled: false },
    { id: 'code', label: 'Code Files', icon: FileCode, desc: 'JS, TS, PY, HTML, CSS', enabled: true },
  ]
  const [fileAccess, setFileAccess] = useState(fileTypes)
  const toggleFile = (id: string) => setFileAccess(fileAccess.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))

  const devices = [
    { id: 'd1', name: 'MacBook Pro', type: 'laptop', os: 'macOS Sonoma', location: 'Los Angeles, CA', lastActive: 'Active now', icon: Laptop, current: true },
    { id: 'd2', name: 'iPhone 15 Pro', type: 'mobile', os: 'iOS 18', location: 'Los Angeles, CA', lastActive: '2 min ago', icon: Smartphone, current: false },
    { id: 'd3', name: 'iPad Air', type: 'tablet', os: 'iPadOS 18', location: 'San Francisco, CA', lastActive: '3 days ago', icon: Tablet, current: false },
  ]

  const integrations = [
    { id: 'i1', name: 'Slack', category: 'Communication', desc: 'Channel alerts & file sharing', connected: true, icon: '/Slack.png', status: 'Active' },
    { id: 'i2', name: 'Google Drive', category: 'Storage', desc: 'File access & backups', connected: true, icon: '/GoogleDrive.png', status: 'Active' },
    { id: 'i3', name: 'Notion', category: 'Productivity', desc: 'Note sync & page export', connected: true, icon: '/Notion.png', status: 'Syncing' },
    { id: 'i4', name: 'HubSpot', category: 'CRM', desc: 'Contact & deal sync', connected: false, icon: '/HubSpot.png', status: 'Disconnected' },
    { id: 'i5', name: 'Dropbox', category: 'Storage', desc: 'File storage & sharing', connected: false, icon: '/Dropbox.png', status: 'Disconnected' },
    { id: 'i6', name: 'Monday.com', category: 'Productivity', desc: 'Project management sync', connected: false, icon: '/Monday.png', status: 'Disconnected' },
  ]
  const [connectedInts, setConnectedInts] = useState(integrations)
  const toggleInt = (id: string) => setConnectedInts(connectedInts.map(i => i.id === id ? { ...i, connected: !i.connected, status: !i.connected ? 'Active' : 'Disconnected' } : i))

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'orb', label: 'Kira Orb', icon: Radio },
    { id: 'wake', label: 'Wake Word', icon: Mic },
    { id: 'files', label: 'File Access', icon: FolderOpen },
    { id: 'browser', label: 'Browser', icon: Globe },
    { id: 'card', label: 'Billing & Cards', icon: CreditCard },
    { id: 'cloud', label: 'Kira Cloud', icon: Cloud },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'connected', label: 'Integrations', icon: Link2 },
    { id: 'appearance', label: 'Appearance', icon: Sliders },
    { id: 'about', label: 'About', icon: Info },
  ]

  const save = () => { setSaved('Changes saved successfully'); setTimeout(() => setSaved(''), 3000) }
  const addCard = () => {
    if (!newCard.name || !newCard.number || !newCard.expiry) return
    const masked = '**** **** **** ' + newCard.number.slice(-4)
    setSavedCards([...savedCards, { id: `c${Date.now()}`, name: newCard.name, number: masked, expiry: newCard.expiry, type: newCard.type, default: false }])
    setNewCard({ name: '', number: '', expiry: '', cvv: '', type: 'visa' })
    setShowAddCard(false)
    setSaved('Card added successfully')
    setTimeout(() => setSaved(''), 3000)
  }
  const deleteCard = (id: string) => setSavedCards(savedCards.filter(c => c.id !== id))
  const setDefault = (id: string) => setSavedCards(savedCards.map(c => ({ ...c, default: c.id === id })))
  const removeDevice = (_id: string) => { setSaved('Device removed'); setTimeout(() => setSaved(''), 3000) }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'url("/MainBG.png") center right / cover no-repeat' }}>
      {/* ═══ SIDEBAR ═══ */}
      <div className="w-[250px] flex-shrink-0 flex flex-col" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', borderRight: KIRA_CARD_BORDER }}>
        <div className="p-4">
          <h2 className="text-[18px] font-semibold text-[#1a1a2e]">Settings</h2>
          <p className="text-[12px] text-[#696D7D]">Manage your preferences</p>
        </div>
        <div className="px-2 space-y-0.5 flex-1 overflow-y-auto">
          {tabs.map(t => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                style={{ background: isActive ? KIRA_ACTIVE_BG : 'transparent', color: isActive ? '#3b82f6' : '#696D7D' }}>
                <Icon className="w-[17px] h-[17px] flex-shrink-0" style={{ color: isActive ? '#3b82f6' : '#9ca3af' }} />
                <span className="text-[13px] font-medium">{t.label}</span>
              </button>
            )
          })}
        </div>
        {saved && (
          <div className="flex items-center gap-2 p-3 mx-3 mb-3 border rounded-xl bg-emerald-50 border-emerald-100">
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[12px] text-emerald-600 font-medium">{saved}</span>
          </div>
        )}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-6 mb-8" style={{ borderBottom: KIRA_CARD_BORDER }}>
          <div>
            <h1 className="text-[30px] font-medium text-black">Settings</h1>
            <p className="text-[16px] text-[#696D7D] mt-0.5 font-light">Customize your Kira experience</p>
          </div>
          <button onClick={save}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all hover:opacity-90"
            style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
            <Save className="w-4 h-4" />Save Changes
          </button>
        </div>

        <div className="max-w-[720px] space-y-6">

          {/* ═══════════════ PROFILE ═══════════════ */}
          {activeTab === 'profile' && (
            <>
              <SectionHead icon={User} title="Profile" desc="Your public profile and contact information" />
              {/* Avatar */}
              <Card>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-[28px] font-bold"
                    style={{ background: KIRA_BTN_BLUE }}>KB</div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1a1a2e]">{profile.displayName}</h3>
                    <p className="text-[12px] text-[#696D7D]">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">Pro Plan</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">Active</span>
                    </div>
                    <button className="mt-2 text-[12px] px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#3b82f6' }}>Change Avatar</button>
                  </div>
                </div>
              </Card>
              {/* Contact Info */}
              <Card>
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" />Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Display Name</label>
                    <input value={profile.displayName} onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Email Address</label>
                    <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Website</label>
                    <div className="relative">
                      <Globe className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                    </div>
                  </div>
                </div>
              </Card>
              {/* Location */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" />Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">City</label>
                    <input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Country</label>
                    <input value={profile.country} onChange={e => setProfile({ ...profile, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Timezone</label>
                    <div className="relative">
                      <Clock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <select value={profile.timezone} onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all appearance-none bg-transparent"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }}>
                        <option>Pacific Time (PT)</option>
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>UTC</option>
                        <option>London (GMT)</option>
                        <option>Paris (CET)</option>
                        <option>Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Language</label>
                    <select value={profile.language} onChange={e => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all appearance-none bg-transparent"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }}>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Portuguese</option>
                      <option>Japanese</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>
              </Card>
              {/* Work */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-500" />Work</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Job Title</label>
                    <input value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Company</label>
                    <input value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Bio</label>
                    <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      rows={3} className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all resize-none"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ PERSONAL INFO ═══════════════ */}
          {activeTab === 'personal' && (
            <>
              <SectionHead icon={FileText} title="Personal Information" desc="Your account details and preferences" />
              <Card>
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Account Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">First Name</label>
                    <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Last Name</label>
                    <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Birthday</label>
                    <div className="relative">
                      <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input value={profile.birthday} onChange={e => setProfile({ ...profile, birthday: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Phone</label>
                    <div className="relative">
                      <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Full Address</label>
                    <input defaultValue="1234 Innovation Drive, Suite 500, Los Angeles, CA 90001"
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ SECURITY ═══════════════ */}
          {activeTab === 'security' && (
            <>
              <SectionHead icon={Shield} title="Security" desc="Protect your account and manage access" />
              {/* Email */}
              <Card>
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" />Account Email</h3>
                <div className="flex items-center gap-4 p-4 border rounded-2xl bg-blue-50/30 border-blue-100/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#1a1a2e]">{profile.email}</p>
                    <p className="text-[11px] text-[#696D7D]">Primary email address</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">Verified</span>
                </div>
              </Card>
              {/* Password */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-blue-500" />Password</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Current Password</label>
                    <input type={showPw ? 'text' : 'password'} defaultValue="password123"
                      className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all pr-12"
                      style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                    <button onClick={() => setShowPw(!showPw)} className="absolute p-1 right-3 top-8">
                      {showPw ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {!showResetPw ? (
                    <button onClick={() => setShowResetPw(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-90"
                      style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW, color: '#fff' }}>
                      <RefreshCw className="w-4 h-4" />Reset Password
                    </button>
                  ) : (
                    <div className="p-4 space-y-3 border border-blue-100 rounded-2xl bg-blue-50/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-medium text-[#1a1a2e]">Reset Password</span>
                        <button onClick={() => setShowResetPw(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
                      </div>
                      <input type={showNewPw ? 'text' : 'password'} placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all pr-12"
                        style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                      <button onClick={() => { setShowResetPw(false); setSaved('Password reset successfully'); setTimeout(() => setSaved(''), 3000) }}
                        className="w-full py-3 rounded-2xl text-white text-[14px] font-medium transition-all hover:opacity-90"
                        style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                        Send Reset Link
                      </button>
                    </div>
                  )}
                </div>
              </Card>
              {/* 2FA */}
              <Card className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: twoFA ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                      <Smartphone className="w-6 h-6" style={{ color: twoFA ? '#3b82f6' : '#9ca3af' }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Two-Factor Authentication</h3>
                      <p className="text-[12px] text-[#696D7D]">{twoFA ? 'Enabled via authenticator app' : 'Add an extra layer of security'}</p>
                    </div>
                  </div>
                  <Toggle on={twoFA} onChange={() => setTwoFA(!twoFA)} />
                </div>
              </Card>
              {/* Devices */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-500" />Signed-In Devices</h3>
                <div className="space-y-3">
                  {devices.map(d => {
                    const Icon = d.icon
                    return (
                      <div key={d.id} className="flex items-center justify-between p-4 border rounded-2xl" style={{ borderColor: d.current ? '#3b82f6' : 'rgba(17,24,39,0.07)', background: d.current ? 'rgba(59,130,246,0.03)' : '#fff' }}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: d.current ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                            <Icon className="w-5 h-5" style={{ color: d.current ? '#3b82f6' : '#9ca3af' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[14px] font-medium text-[#1a1a2e]">{d.name}</h4>
                              {d.current && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">This Device</span>}
                            </div>
                            <p className="text-[11px] text-[#696D7D]">{d.os} · {d.location} · {d.lastActive}</p>
                          </div>
                        </div>
                        {!d.current && (
                          <button onClick={() => removeDevice(d.id)} className="p-2 transition-colors rounded-xl hover:bg-red-50">
                            <LogOut className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ KIRA ORB ═══════════════ */}
          {activeTab === 'orb' && (
            <>
              <SectionHead icon={Radio} title="Kira Orb" desc="Control your always-listening AI assistant" />
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: orbListening ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)' }}>
                      {orbListening ? <Radio className="w-6 h-6 text-blue-500" /> : <Mic className="w-6 h-6 text-red-500" />}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Always Listening</h3>
                      <p className="text-[12px] text-[#696D7D]">{orbListening ? 'Orb is active and listening' : 'Orb is disabled'}</p>
                    </div>
                  </div>
                  <Toggle on={orbListening} onChange={() => setOrbListening(!orbListening)} />
                </div>
                {orbListening && (
                  <div className="p-4 mt-4 border border-blue-100 rounded-xl bg-blue-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[13px] text-blue-600 font-medium">Orb is online and ready</span>
                    </div>
                    <p className="text-[11px] text-[#696D7D] mt-1 ml-6">The floating orb appears on all pages and responds to voice commands</p>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ═══════════════ WAKE WORD ═══════════════ */}
          {activeTab === 'wake' && (
            <>
              <SectionHead icon={Mic} title="Wake Word" desc="Choose or create your custom activation phrase" />
              <Card>
                <div className="flex items-center gap-4 p-4 mb-6 border border-blue-100 rounded-2xl bg-blue-50/30">
                  <Sparkles className="flex-shrink-0 w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-[14px] font-medium text-[#1a1a2e]">Current wake word: <strong className="text-blue-600">"{wakeWord}"</strong></p>
                    <p className="text-[11px] text-[#696D7D]">Say this phrase to activate Kira from any screen</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 mb-4 bg-gray-100 rounded-xl w-fit">
                  <button onClick={() => setWakeMode('preset')} className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${wakeMode === 'preset' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Presets</button>
                  <button onClick={() => setWakeMode('custom')} className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${wakeMode === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>Custom</button>
                </div>

                {wakeMode === 'preset' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {['Hey Kira', 'Okay Kira', 'Kira', 'Hey Beeda'].map(w => (
                      <button key={w} onClick={() => setWakeWord(w)}
                        className="flex items-center gap-3 p-4 text-left transition-all border rounded-2xl"
                        style={{ borderColor: wakeWord === w ? '#3b82f6' : 'rgba(17,24,39,0.07)', background: wakeWord === w ? 'rgba(59,130,246,0.05)' : '#fff' }}>
                        <div className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: wakeWord === w ? '#3b82f6' : '#f3f4f6' }}>
                          {wakeWord === w ? <Check className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-gray-400" />}
                        </div>
                        <span className="text-[14px] font-medium" style={{ color: wakeWord === w ? '#3b82f6' : '#1a1a2e' }}>{w}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Your Custom Wake Word</label>
                      <div className="relative">
                        <Mic className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input value={customWakeWord} onChange={e => setCustomWakeWord(e.target.value)}
                          placeholder="Type your custom phrase..."
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all"
                          style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                      </div>
                      <p className="text-[11px] text-[#696D7D] mt-1">Choose a unique phrase that Kira will recognize (min 2 words recommended)</p>
                    </div>
                    <button onClick={() => { if (customWakeWord.trim()) { setWakeWord(customWakeWord.trim()); setSaved('Wake word updated'); setTimeout(() => setSaved(''), 3000) } }}
                      className="px-6 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all hover:opacity-90"
                      style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                      Save Custom Wake Word
                    </button>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ═══════════════ FILE ACCESS ═══════════════ */}
          {activeTab === 'files' && (
            <>
              <SectionHead icon={FolderOpen} title="File Access" desc="Choose which file types Kira can access" />
              <Card>
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Allowed File Types</h3>
                <div className="space-y-3">
                  {fileAccess.map(f => {
                    const Icon = f.icon
                    return (
                      <div key={f.id} className="flex items-center justify-between p-4 border rounded-2xl" style={{ borderColor: 'rgba(17,24,39,0.07)', background: f.enabled ? 'rgba(59,130,246,0.02)' : '#fff' }}>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: f.enabled ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                            <Icon className="w-5 h-5" style={{ color: f.enabled ? '#3b82f6' : '#9ca3af' }} />
                          </div>
                          <div>
                            <h4 className="text-[14px] font-medium text-[#1a1a2e]">{f.label}</h4>
                            <p className="text-[11px] text-[#696D7D]">{f.desc}</p>
                          </div>
                        </div>
                        <Toggle on={f.enabled} onChange={() => toggleFile(f.id)} />
                      </div>
                    )
                  })}
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ BROWSER ═══════════════ */}
          {activeTab === 'browser' && (
            <>
              <SectionHead icon={Globe} title="Browser Access" desc="Allow Kira to access your browser data" />
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: browserAccess ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                      <Globe className="w-6 h-6" style={{ color: browserAccess ? '#3b82f6' : '#9ca3af' }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Browser Integration</h3>
                      <p className="text-[12px] text-[#696D7D]">{browserAccess ? 'Kira can read and interact with web pages' : 'Browser access is disabled'}</p>
                    </div>
                  </div>
                  <Toggle on={browserAccess} onChange={() => setBrowserAccess(!browserAccess)} />
                </div>
                {browserAccess && (
                  <div className="mt-4 space-y-2">
                    {['Read page content', 'Fill forms automatically', 'Take screenshots', 'Manage bookmarks'].map((perm, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-xl bg-blue-50/30 border-blue-100/50">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span className="text-[13px] text-[#1a1a2e]">{perm}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ═══════════════ BILLING & CARDS ═══════════════ */}
          {activeTab === 'card' && (
            <>
              <SectionHead icon={CreditCard} title="Billing & Cards" desc="Manage payment methods and spending" />
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Saved Cards ({savedCards.length})</h3>
                  <button onClick={() => setShowAddCard(!showAddCard)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[12px] font-medium transition-all hover:opacity-90"
                    style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                    <Plus className="w-4 h-4" />Add Card
                  </button>
                </div>
                <div className="space-y-3">
                  {savedCards.map(card => (
                    <div key={card.id} className="p-4 border rounded-2xl" style={{ borderColor: 'rgba(17,24,39,0.07)', background: card.default ? 'rgba(59,130,246,0.03)' : '#fff' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: KIRA_BTN_BLUE }}>
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-medium text-[#1a1a2e]">{card.number}</span>
                              <button onClick={() => setShowCardNum(!showCardNum)} className="p-1 rounded hover:bg-gray-100">
                                {showCardNum ? <EyeOff className="w-3 h-3 text-gray-400" /> : <Eye className="w-3 h-3 text-gray-400" />}
                              </button>
                            </div>
                            <p className="text-[11px] text-[#696D7D]">{card.name} · Expires {card.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!card.default && <button onClick={() => setDefault(card.id)} className="text-[11px] text-blue-500 hover:underline">Set default</button>}
                          {card.default && <span className="text-[11px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">Default</span>}
                          <button onClick={() => deleteCard(card.id)} className="p-2 transition-colors rounded-xl hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              {showAddCard && (
                <Card className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Add New Card</h3>
                    <button onClick={() => setShowAddCard(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                    <div><label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Cardholder Name</label>
                      <input value={newCard.name} onChange={e => setNewCard({ ...newCard, name: e.target.value })} placeholder="Full name on card"
                        className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all" style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} /></div>
                    <div><label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Card Number</label>
                      <input value={newCard.number} onChange={e => setNewCard({ ...newCard, number: e.target.value })} placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all" style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} /></div>
                    <div className="flex gap-4">
                      <div className="flex-1"><label className="text-[12px] font-medium text-[#696D7D] mb-1 block">Expiry</label>
                        <input value={newCard.expiry} onChange={e => setNewCard({ ...newCard, expiry: e.target.value })} placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all" style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} /></div>
                      <div className="flex-1"><label className="text-[12px] font-medium text-[#696D7D] mb-1 block">CVV</label>
                        <input type="password" value={newCard.cvv} onChange={e => setNewCard({ ...newCard, cvv: e.target.value })} placeholder="123"
                          className="w-full px-4 py-3 rounded-2xl border text-[14px] outline-none focus:border-blue-400 transition-all" style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} /></div>
                    </div>
                    <button onClick={addCard} className="w-full py-3 rounded-2xl text-white text-[14px] font-medium transition-all hover:opacity-90" style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>Add Card</button>
                  </div>
                </Card>
              )}
              {/* Autonomous */}
              <Card className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: agentAutonomous ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                      <Fingerprint className="w-6 h-6" style={{ color: agentAutonomous ? '#3b82f6' : '#9ca3af' }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Autonomous Payments</h3>
                      <p className="text-[12px] text-[#696D7D]">Allow agents to use your card for tasks</p>
                    </div>
                  </div>
                  <Toggle on={agentAutonomous} onChange={() => setAgentAutonomous(!agentAutonomous)} />
                </div>
              </Card>
              {/* Limit */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-3">Spending Limit</h3>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <DollarSign className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input type="number" value={cardLimit} onChange={e => setCardLimit(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border text-[14px] font-medium outline-none focus:border-blue-400 transition-all" style={{ borderColor: 'rgba(17,24,39,0.07)', color: '#1a1a2e' }} />
                  </div>
                  <span className="text-[13px] text-[#696D7D] font-medium">USD / month</span>
                </div>
                <div className="w-full h-2 mt-3 overflow-hidden bg-gray-100 rounded-full">
                  <div className="h-full rounded-full" style={{ width: '35%', background: KIRA_BTN_BLUE }} />
                </div>
                <p className="text-[11px] text-[#696D7D] mt-1">$1,750 of ${cardLimit} used this month</p>
              </Card>
              {/* Subscription */}
              <Card className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <RefreshCw className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Subscription</h3>
                      <p className="text-[12px] text-[#696D7D]">Pro Plan · Renews Jan 15, 2026</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[12px] font-medium">Active</span>
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ KIRA CLOUD ═══════════════ */}
          {activeTab === 'cloud' && (
            <>
              <SectionHead icon={Cloud} title="Kira Cloud" desc="Manage cloud storage for your files" />
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: cloudSync ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                      <Cloud className="w-6 h-6" style={{ color: cloudSync ? '#3b82f6' : '#9ca3af' }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Auto-Save to Cloud</h3>
                      <p className="text-[12px] text-[#696D7D]">{cloudSync ? 'Files automatically synced' : 'Cloud sync disabled'}</p>
                    </div>
                  </div>
                  <Toggle on={cloudSync} onChange={() => setCloudSync(!cloudSync)} />
                </div>
                {cloudSync && (
                  <div className="mt-4 space-y-3">
                    <div className="p-4 border rounded-xl bg-blue-50/30 border-blue-100/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-medium text-[#1a1a2e]">Storage Used</span>
                        <span className="text-[12px] text-[#696D7D]">45.2 GB of 100 GB</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '45%', background: KIRA_BTN_BLUE }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ label: 'Documents', size: '12 GB' }, { label: 'Images', size: '28 GB' }, { label: 'Other', size: '5 GB' }].map(s => (
                        <div key={s.label} className="p-3 text-center border border-gray-100 rounded-xl bg-gray-50">
                          <p className="text-[14px] font-semibold text-[#1a1a2e]">{s.size}</p>
                          <p className="text-[11px] text-[#696D7D]">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ═══════════════ NOTIFICATIONS ═══════════════ */}
          {activeTab === 'notifications' && (
            <>
              <SectionHead icon={Bell} title="Notifications" desc="Choose how you want to be notified" />
              <Card>
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {[{ key: 'bookings', label: 'Booking Confirmations', desc: 'Get notified when a booking is made' },
                    { key: 'marketing', label: 'Marketing Updates', desc: 'Receive news and promotions' },
                    { key: 'weekly', label: 'Weekly Digest', desc: 'Summary of your activity' },
                    { key: 'security', label: 'Security Alerts', desc: 'Important security updates' }].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-[14px] font-medium text-[#1a1a2e]">{n.label}</h4>
                        <p className="text-[11px] text-[#696D7D]">{n.desc}</p>
                      </div>
                      <Toggle on={emailNotifs[n.key as keyof typeof emailNotifs]} onChange={() => setEmailNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))} />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  {[{ key: 'bookings', label: 'New Bookings', desc: 'Real-time booking alerts' },
                    { key: 'messages', label: 'Messages', desc: 'When someone messages you' },
                    { key: 'reminders', label: 'Reminders', desc: 'Task and event reminders' }].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-[14px] font-medium text-[#1a1a2e]">{n.label}</h4>
                        <p className="text-[11px] text-[#696D7D]">{n.desc}</p>
                      </div>
                      <Toggle on={pushNotifs[n.key as keyof typeof pushNotifs]} onChange={() => setPushNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))} />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ INTEGRATIONS (CONNECTED) ═══════════════ */}
          {activeTab === 'connected' && (
            <>
              <SectionHead icon={Link2} title="Integrations" desc="Manage connected apps and services" />
              <div className="space-y-4">
                {connectedInts.map(int => (
                  <Card key={int.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: int.connected ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                          <Link2 className="w-6 h-6" style={{ color: int.connected ? '#3b82f6' : '#9ca3af' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[15px] font-semibold text-[#1a1a2e]">{int.name}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                              style={{ background: int.connected ? 'rgba(59,130,246,0.1)' : '#f3f4f6', color: int.connected ? '#3b82f6' : '#9ca3af' }}>
                              {int.category}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#696D7D]">{int.desc}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${int.connected ? 'bg-green-400' : 'bg-gray-300'}`} />
                            <span className="text-[11px] text-[#696D7D]">{int.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleInt(int.id)}
                          className={`px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${int.connected ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' : 'text-white'}`}
                          style={int.connected ? {} : { background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
                          {int.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ═══════════════ APPEARANCE ═══════════════ */}
          {activeTab === 'appearance' && (
            <>
              <SectionHead icon={Sliders} title="Appearance" desc="Customize the look and feel" />
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl" style={{ background: darkMode ? 'rgba(59,130,246,0.1)' : '#f3f4f6' }}>
                      {darkMode ? <Moon className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#1a1a2e]">Dark Mode</h3>
                      <p className="text-[12px] text-[#696D7D]">{darkMode ? 'Dark theme enabled' : 'Switch to dark theme'}</p>
                    </div>
                  </div>
                  <Toggle on={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ icon: Sun, label: 'Light', desc: 'Clean and bright', active: !darkMode },
                    { icon: Moon, label: 'Dark', desc: 'Easy on the eyes', active: darkMode }].map(t => (
                    <button key={t.label} onClick={() => setDarkMode(t.label === 'Dark')}
                      className="flex items-center gap-3 p-4 text-left transition-all border rounded-2xl"
                      style={{ borderColor: t.active ? '#3b82f6' : 'rgba(17,24,39,0.07)', background: t.active ? 'rgba(59,130,246,0.05)' : '#fff' }}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: t.active ? '#3b82f6' : '#f3f4f6' }}>
                        <t.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-medium" style={{ color: t.active ? '#3b82f6' : '#1a1a2e' }}>{t.label}</h4>
                        <p className="text-[11px] text-[#696D7D]">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* ═══════════════ ABOUT ═══════════════ */}
          {activeTab === 'about' && (
            <>
              <SectionHead icon={Info} title="About" desc="Learn more about Kira and our policies" />
              {/* App Info */}
              <Card>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[24px] font-bold"
                    style={{ background: KIRA_BTN_BLUE }}>K</div>
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#1a1a2e]">Kira AI</h3>
                    <p className="text-[12px] text-[#696D7D]">Version 3.2.1 (Build 20845)</p>
                    <p className="text-[11px] text-[#696D7D]">2026 Beeda AI, Inc. All rights reserved.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ label: 'Users', value: '2.4M+' }, { label: 'Countries', value: '180+' }, { label: 'Uptime', value: '99.9%' }].map(s => (
                    <div key={s.label} className="p-3 text-center border rounded-xl bg-blue-50/30 border-blue-100/50">
                      <p className="text-[16px] font-bold text-blue-600">{s.value}</p>
                      <p className="text-[11px] text-[#696D7D]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
              {/* Links */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Legal & Information</h3>
                <div className="space-y-2">
                  {[
                    { icon: FileText, label: 'Privacy Policy', desc: 'How we handle your data' },
                    { icon: FileCode, label: 'Terms of Service', desc: 'Rules for using Kira' },
                    { icon: Shield, label: 'Cookie Policy', desc: 'How we use cookies' },
                    { icon: Users, label: 'About Us', desc: 'Meet the team behind Kira' },
                    { icon: Heart, label: 'Open Source Credits', desc: 'Libraries and tools we use' },
                    { icon: Star, label: 'Rate Kira', desc: 'Share your feedback' },
                  ].map(link => (
                    <button key={link.label} className="flex items-center w-full gap-4 p-4 text-left transition-all border rounded-2xl hover:shadow-sm"
                      style={{ borderColor: 'rgba(17,24,39,0.07)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.03)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(17,24,39,0.07)' }}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <link.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-medium text-[#1a1a2e]">{link.label}</h4>
                        <p className="text-[11px] text-[#696D7D]">{link.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                </div>
              </Card>
              {/* Support */}
              <Card className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Support</h3>
                <div className="flex items-center gap-4 p-4 border border-blue-100 rounded-2xl bg-blue-50/30">
                  <HelpCircle className="w-6 h-6 text-blue-500" />
                  <div className="flex-1">
                    <h4 className="text-[14px] font-medium text-[#1a1a2e]">Need Help?</h4>
                    <p className="text-[11px] text-[#696D7D]">Contact our support team or visit the Help Center</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-[12px] font-medium text-white"
                    style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>Contact Support</button>
                </div>
              </Card>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
