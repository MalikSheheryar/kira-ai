import React, { useState } from 'react'
import {
  Search, Link2, Check, Loader2, ExternalLink,
  Zap, Shield, Cloud,
  ChevronRight, X, LayoutGrid, List
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: 'Productivity' | 'CRM' | 'Storage' | 'Communication' | 'Documents'
  color: string
  bgColor: string
  connected: boolean
  connecting: boolean
  icon: React.ReactNode
  features: string[]
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  notion: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#000"/>
      <path d="M22.5 28l26-2.5c3.2-.3 4-.4 6 0l20.5 3c1.4.3 2 1 2 2v46c0 1.8-.6 2.8-2.5 3l-22 2.5c-1.8.2-2.5.3-4.2 0L24 79c-1.6-.3-2.2-1-2.2-2.8V30.5c0-1.4.6-2.5 1.7-2.5z" fill="#fff" opacity="0"/>
      <path d="M32 36l22-1.6v34.5l-22 1.6V36z" fill="#fff"/>
      <path d="M58 34.2L80 36v33.5l-22-1.6V34.2z" fill="#fff" opacity="0.85"/>
    </svg>
  ),
  clickup: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#7B68EE"/>
      <path d="M28 52l14 14 30-30" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  monday: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#FF3D57"/>
      <rect x="20" y="28" width="18" height="44" rx="3" fill="#fff"/>
      <rect x="46" y="18" width="18" height="54" rx="3" fill="#fff" opacity="0.7"/>
      <rect x="72" y="36" width="18" height="36" rx="3" fill="#fff" opacity="0.4"/>
    </svg>
  ),
  hubspot: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#FF7A59"/>
      <circle cx="35" cy="35" r="10" fill="#fff"/>
      <circle cx="65" cy="35" r="10" fill="#fff"/>
      <circle cx="50" cy="60" r="10" fill="#fff"/>
      <line x1="35" y1="35" x2="50" y2="60" stroke="#fff" strokeWidth="5"/>
      <line x1="65" y1="35" x2="50" y2="60" stroke="#fff" strokeWidth="5"/>
    </svg>
  ),
  googledrive: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <polygon points="50,8 85,28 50,48 15,28" fill="#0066DA"/>
      <polygon points="15,28 50,48 50,78 15,58" fill="#00AC47"/>
      <polygon points="50,48 85,28 85,58 50,78" fill="#FFBA00"/>
      <polygon points="15,58 50,78 50,92 15,72" fill="#00832D"/>
      <polygon points="50,78 85,58 85,72 50,92" fill="#2684FC"/>
    </svg>
  ),
  icloud: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="url(#icloudGrad)"/>
      <defs>
        <linearGradient id="icloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34C759"/>
          <stop offset="100%" stopColor="#30B350"/>
        </linearGradient>
      </defs>
      <path d="M65 55c0-8.3-6.7-15-15-15-5.5 0-10.3 3-12.9 7.4C36.3 47 35.2 47 34 47c-6.6 0-12 5.4-12 12s5.4 12 12 12h31c6.6 0 12-5.4 12-12s-5.4-12-12-12z" fill="#fff"/>
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#4A154B"/>
      <rect x="22" y="42" width="16" height="16" rx="3" fill="#36C5F0"/>
      <rect x="62" y="42" width="16" height="16" rx="3" fill="#2EB67D"/>
      <rect x="42" y="22" width="16" height="16" rx="3" fill="#E01E5A"/>
      <rect x="42" y="62" width="16" height="16" rx="3" fill="#ECB22E"/>
      <circle cx="38" cy="30" r="7" fill="#36C5F0"/>
      <circle cx="70" cy="38" r="7" fill="#2EB67D"/>
      <circle cx="62" cy="70" r="7" fill="#ECB22E"/>
      <circle cx="30" cy="62" r="7" fill="#E01E5A"/>
    </svg>
  ),
  dropbox: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#0061FF"/>
      <polygon points="25,30 40,18 55,30 40,42" fill="#fff"/>
      <polygon points="45,30 60,18 75,30 60,42" fill="#fff" opacity="0.7"/>
      <polygon points="25,48 40,36 55,48 40,60" fill="#fff" opacity="0.85"/>
      <polygon points="45,48 60,36 75,48 60,60" fill="#fff" opacity="0.55"/>
      <rect x="42" y="58" width="16" height="4" fill="#fff"/>
    </svg>
  ),
  googledocs: (
    <svg viewBox="0 0 100 100" className="w-8 h-8">
      <rect width="100" height="100" rx="18" fill="#4285F4"/>
      <rect x="28" y="20" width="44" height="60" rx="6" fill="#fff"/>
      <line x1="38" y1="40" x2="62" y2="40" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
      <line x1="38" y1="52" x2="56" y2="52" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
      <line x1="38" y1="64" x2="60" y2="64" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
      <polygon points="72,20 85,32 72,32" fill="#fff"/>
    </svg>
  ),
}

const initialIntegrations: Integration[] = [
  {
    id: 'notion', name: 'Notion', category: 'Productivity',
    description: 'Sync docs, databases & wikis with your workspace',
    color: '#000000', bgColor: '#F5F5F5',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.notion,
    features: ['Database sync', 'Page embeds', 'Wiki integration'],
  },
  {
    id: 'clickup', name: 'ClickUp', category: 'Productivity',
    description: 'Manage tasks, docs & goals in one place',
    color: '#7B68EE', bgColor: '#F3F0FF',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.clickup,
    features: ['Task sync', 'Goal tracking', 'Doc linking'],
  },
  {
    id: 'monday', name: 'Monday.com', category: 'Productivity',
    description: 'Project management & workflow automation',
    color: '#FF3D57', bgColor: '#FFF0F2',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.monday,
    features: ['Board sync', 'Automation triggers', 'Timeline view'],
  },
  {
    id: 'hubspot', name: 'HubSpot', category: 'CRM',
    description: 'CRM, marketing & sales pipeline sync',
    color: '#FF7A59', bgColor: '#FFF4F1',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.hubspot,
    features: ['Contact sync', 'Deal tracking', 'Email integration'],
  },
  {
    id: 'googledrive', name: 'Google Drive', category: 'Storage',
    description: 'Access & manage files directly in Kira',
    color: '#0066DA', bgColor: '#F0F5FF',
    connected: true, connecting: false,
    icon: SERVICE_ICONS.googledrive,
    features: ['File access', 'Folder sync', 'Share links'],
  },
  {
    id: 'icloud', name: 'iCloud', category: 'Storage',
    description: 'Sync Apple ecosystem files & data',
    color: '#34C759', bgColor: '#F0FFF4',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.icloud,
    features: ['File sync', 'Photo backup', 'Calendar sync'],
  },
  {
    id: 'slack', name: 'Slack', category: 'Communication',
    description: 'Send messages & alerts to your channels',
    color: '#4A154B', bgColor: '#F8F0FF',
    connected: true, connecting: false,
    icon: SERVICE_ICONS.slack,
    features: ['Channel alerts', 'DM integration', 'Bot commands'],
  },
  {
    id: 'dropbox', name: 'Dropbox', category: 'Storage',
    description: 'Cloud storage & file sharing integration',
    color: '#0061FF', bgColor: '#F0F5FF',
    connected: false, connecting: false,
    icon: SERVICE_ICONS.dropbox,
    features: ['File storage', 'Team sharing', 'Version control'],
  },
  {
    id: 'googledocs', name: 'Google Docs', category: 'Documents',
    description: 'Create, edit & sync documents with Kira',
    color: '#4285F4', bgColor: '#F0F5FF',
    connected: true, connecting: false,
    icon: SERVICE_ICONS.googledocs,
    features: ['Doc creation', 'Real-time sync', 'Comment threads'],
  },
]

const categories = ['All', 'Productivity', 'CRM', 'Storage', 'Communication', 'Documents']

export default function IntegrationsHub() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [detailId, setDetailId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const toggleConnect = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id !== id) return item
      if (item.connected) {
        return { ...item, connected: false, connecting: false }
      }
      return { ...item, connecting: true }
    }))
    // Simulate connection flow
    setTimeout(() => {
      setIntegrations(prev => prev.map(item =>
        item.id === id ? { ...item, connected: !item.connected, connecting: false } : item
      ))
    }, 1500)
  }

  const filtered = integrations.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const connected = integrations.filter(i => i.connected).length
  const detailItem = integrations.find(i => i.id === detailId)

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[24px] font-bold text-[#111827] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              API Integrations
            </h1>
            <p className="text-[13px] text-gray-500 mt-1 ml-[52px]">
              Connect your favorite tools and services to supercharge your workflow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[13px] font-semibold text-emerald-700">{connected} Connected</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[13px] text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-[#111827]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-[#111827]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="px-8 pb-8 flex-1">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(item => (
              <IntegrationCard
                key={item.id}
                item={item}
                onToggle={() => toggleConnect(item.id)}
                onDetail={() => setDetailId(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(item => (
              <IntegrationListRow
                key={item.id}
                item={item}
                onToggle={() => toggleConnect(item.id)}
                onDetail={() => setDetailId(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {detailItem && (
        <DetailPanel
          item={detailItem}
          onClose={() => setDetailId(null)}
          onToggle={() => toggleConnect(detailItem.id)}
        />
      )}
    </div>
  )
}

function IntegrationCard({ item, onToggle, onDetail }: {
  item: Integration; onToggle: () => void; onDetail: () => void
}) {
  return (
    <div
      className="group relative rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onDetail}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: item.color }} />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: item.bgColor }}
          >
            {item.icon}
          </div>
          <div className="flex items-center gap-2">
            {item.connected && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600 border border-emerald-100 flex items-center gap-1">
                <Check className="w-3 h-3" /> Active
              </span>
            )}
          </div>
        </div>

        <h3 className="text-[15px] font-semibold text-[#111827] mb-1">{item.name}</h3>
        <p className="text-[12px] text-gray-500 leading-relaxed mb-4">{item.description}</p>

        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {item.features.map((f, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500 border border-gray-100">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={onToggle}
            disabled={item.connecting}
            className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
              item.connected
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-[#111827] text-white hover:bg-[#2a2a3e] shadow-sm'
            }`}
          >
            {item.connecting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...</>
            ) : item.connected ? (
              <><Link2 className="w-3.5 h-3.5" /> Disconnect</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Connect</>
            )}
          </button>
          <button
            onClick={onDetail}
            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function IntegrationListRow({ item, onToggle, onDetail }: {
  item: Integration; onToggle: () => void; onDetail: () => void
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all cursor-pointer p-4"
      onClick={onDetail}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.bgColor }}
      >
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-semibold text-[#111827]">{item.name}</h3>
        <p className="text-[12px] text-gray-500 truncate">{item.description}</p>
      </div>
      <div className="flex items-center gap-2">
        {item.features.map((f, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] text-gray-500 border border-gray-100">
            {f}
          </span>
        ))}
      </div>
      <span className="px-2 py-0.5 rounded-full bg-gray-50 text-[10px] font-medium text-gray-500">
        {item.category}
      </span>
      {item.connected ? (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-600 border border-emerald-100 flex items-center gap-1">
          <Check className="w-3 h-3" /> Active
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full bg-gray-50 text-[10px] font-medium text-gray-400">Disconnected</span>
      )}
      <button
        onClick={e => { e.stopPropagation(); onToggle() }}
        disabled={item.connecting}
        className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
          item.connected
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-[#111827] text-white hover:bg-[#2a2a3e]'
        }`}
      >
        {item.connecting ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /></>
        ) : item.connected ? (
          'Disconnect'
        ) : (
          <><Zap className="w-3.5 h-3.5" /> Connect</>
        )}
      </button>
    </div>
  )
}

function DetailPanel({ item, onClose, onToggle }: {
  item: Integration; onClose: () => void; onToggle: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: item.bgColor }}>
                {item.icon}
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">{item.name}</h2>
                <span className="text-[11px] text-gray-400">{item.category}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-gray-100 p-4 mb-6" style={{ background: item.connected ? '#F0FFF4' : '#FAFAFA' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.connected ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  {item.connected ? <Shield className="w-5 h-5 text-emerald-600" /> : <Cloud className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">{item.connected ? 'Connected' : 'Not Connected'}</p>
                  <p className="text-[11px] text-gray-500">{item.connected ? 'Real-time sync is active' : 'Connect to enable sync'}</p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${item.connected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
            </div>
          </div>

          {/* Features */}
          <h3 className="text-[13px] font-semibold text-[#111827] mb-3 uppercase tracking-wide">Features</h3>
          <div className="flex flex-col gap-2 mb-6">
            {item.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#4F46E5]" />
                </div>
                <span className="text-[13px] text-[#111827]">{f}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onToggle}
              disabled={item.connecting}
              className={`w-full py-3 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                item.connected
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  : 'bg-[#111827] text-white hover:bg-[#2a2a3e]'
              }`}
            >
              {item.connecting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : item.connected ? (
                <><Link2 className="w-4 h-4" /> Disconnect Integration</>
              ) : (
                <><Zap className="w-4 h-4" /> Connect {item.name}</>
              )}
            </button>
            <button className="w-full py-3 rounded-xl bg-white border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Visit {item.name}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
