import React, { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Briefcase, Globe, Calendar, Shield,
  CreditCard, Bell, Moon, Sun, LogOut, Edit3, Check, X, Camera,
  KeyRound, Smartphone, Fingerprint, ChevronRight, Award, Clock,
  Activity, Star, TrendingUp, FileText, Image, Save, Lock,
} from 'lucide-react'

const KIRA_BTN_BLUE = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
const KIRA_BLUE_GLOW = 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF'
const KIRA_CARD = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(17,24,39,0.07)',
  borderRadius: 20,
}

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <button onClick={onChange} className="relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0"
    style={{ background: on ? KIRA_BTN_BLUE : '#e5e7eb' }}>
    <div className="absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
      style={{ left: on ? 'calc(100% - 25px)' : '3px' }} />
  </button>
)

export default function ProfileView() {
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Kobe Bryant',
    email: 'kobe@beeda.ai',
    phone: '+1 (424) 555-0192',
    role: 'Product Manager',
    company: 'Beeda AI',
    location: 'Los Angeles, CA',
    timezone: 'Pacific Time (PT)',
    language: 'English',
    bio: 'AI enthusiast and productivity hacker. Building the future with Kira.',
    website: 'kobe.beeda.ai',
  })
  const [darkMode, setDarkMode] = useState(false)
  const [notifs, setNotifs] = useState(true)

  const handleSave = () => {
    setSaved(true)
    setEditMode(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const stats = [
    { label: 'Tasks Done', value: '1,247', icon: Check, color: '#10b981' },
    { label: 'AI Chats', value: '3.8K', icon: MessageIcon, color: '#3b82f6' },
    { label: 'Days Active', value: '186', icon: Clock, color: '#f59e0b' },
    { label: 'Files Saved', value: '842', icon: FileText, color: '#8b5cf6' },
  ]

  const planFeatures = [
    'Unlimited AI conversations',
    'All premium features',
    'Priority support',
    'Custom integrations',
    'Team collaboration',
  ]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 500, color: '#1a1a2e', fontFamily: "'Outfit', system-ui, sans-serif" }}>My Profile</h2>
          <p style={{ fontSize: 15, color: '#696D7D', marginTop: 4 }}>Manage your account and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[13px] font-medium">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          <button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-white text-[14px] font-medium transition-all hover:opacity-90"
            style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}
          >
            {editMode ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* Profile Hero */}
      <div style={{ ...KIRA_CARD, padding: 32, marginBottom: 24 }}>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-[32px] font-bold"
              style={{ background: KIRA_BTN_BLUE, boxShadow: KIRA_BLUE_GLOW }}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'rgba(17,24,39,0.07)' }}>
              <Camera className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              {editMode ? (
                <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="text-[24px] font-semibold text-[#1a1a2e] bg-transparent border-b border-blue-300 outline-none pb-1" />
              ) : (
                <h3 style={{ fontSize: 24, fontWeight: 600, color: '#1a1a2e' }}>{profile.name}</h3>
              )}
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff' }}>Pro</span>
            </div>
            <p style={{ fontSize: 14, color: '#696D7D', marginBottom: 8 }}>{profile.role} at {profile.company}</p>
            <div className="flex items-center gap-4 text-[13px] text-[#696D7D]">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{profile.website}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{ ...KIRA_CARD, padding: '20px 24px' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <span style={{ fontSize: 12, color: '#696D7D', fontWeight: 500 }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Info */}
        <div style={{ ...KIRA_CARD, padding: 28 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 20 }}>Personal Information</h4>
          <div className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', icon: User },
              { label: 'Email', key: 'email', icon: Mail },
              { label: 'Phone', key: 'phone', icon: Phone },
              { label: 'Role', key: 'role', icon: Briefcase },
              { label: 'Company', key: 'company', icon: BuildingIcon },
              { label: 'Location', key: 'location', icon: MapPin },
              { label: 'Timezone', key: 'timezone', icon: Clock },
              { label: 'Language', key: 'language', icon: Globe },
            ].map(field => {
              const Icon = field.icon
              return (
                <div key={field.key} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</p>
                    {editMode ? (
                      <input value={profile[field.key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                        className="w-full text-[14px] text-[#1a1a2e] bg-transparent border-b border-gray-200 outline-none focus:border-blue-400 pb-1" />
                    ) : (
                      <p style={{ fontSize: 14, color: '#1a1a2e', fontWeight: 500 }}>{profile[field.key as keyof typeof profile]}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Subscription */}
          <div style={{ ...KIRA_CARD, padding: 28 }}>
            <div className="flex items-center justify-between mb-4">
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e' }}>Subscription</h4>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>Pro Plan</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e' }}>$29</span>
              <span style={{ fontSize: 13, color: '#696D7D' }}>/month · Renews Jan 15, 2026</span>
            </div>
            <div className="space-y-2 mb-4">
              {planFeatures.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span style={{ fontSize: 13, color: '#1a1a2e' }}>{f}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 rounded-xl text-[13px] font-medium text-blue-600 hover:bg-blue-50 transition-colors border"
              style={{ borderColor: 'rgba(59,130,246,0.2)' }}>Upgrade Plan</button>
          </div>

          {/* Preferences */}
          <div style={{ ...KIRA_CARD, padding: 28 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <Bell className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>Notifications</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>Push & email alerts</p>
                  </div>
                </div>
                <Toggle on={notifs} onChange={() => setNotifs(!notifs)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: darkMode ? 'rgba(59,130,246,0.08)' : 'rgba(107,114,128,0.08)' }}>
                    {darkMode ? <Moon className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-gray-500" />}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>Dark Mode</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>{darkMode ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Toggle on={darkMode} onChange={() => setDarkMode(!darkMode)} />
              </div>
            </div>
          </div>

          {/* Security */}
          <div style={{ ...KIRA_CARD, padding: 28 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Security</h4>
            <div className="space-y-3">
              {[
                { icon: KeyRound, label: 'Change Password', desc: 'Last changed 2 weeks ago' },
                { icon: Fingerprint, label: 'Two-Factor Auth', desc: 'Enabled via app' },
                { icon: Smartphone, label: 'Active Sessions', desc: '3 devices signed in' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.08)' }}>
                      <Icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-[14px] text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors border"
          style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}

function MessageIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function BuildingIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V22"/><path d="M19 22v-2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V22"/><rect width="20" height="20" x="2" y="2" rx="2"/></svg> }
