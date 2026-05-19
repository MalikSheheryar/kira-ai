import React, { useState } from 'react'
import {
  LayoutGrid,
  CalendarDays,
  Clock,
  BarChart3,
  Workflow,
  Route,
  Puzzle,
  Users,
  UserCircle,
  Vote,
  CreditCard,
  Settings,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  Share2,
  Globe,
  Link2,
  Copy,
  Check,
  Zap,
  Mail,
  Phone,
  Video,
  MapPin,
  X,
  CheckCircle2,
  Download,
  Layers,
  GitBranch,
  Slack,
  Chrome,
  Bell,
  Moon,
  Sun,
  Monitor,
  Star,
  CircleDollarSign,
} from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'

type CalendarTab =
  | 'event-types'
  | 'scheduled'
  | 'availability'
  | 'analytics'
  | 'workflows'
  | 'routing'
  | 'integrations'
  | 'contacts'
  | 'polls'
  | 'team'
  | 'billing'
  | 'settings'

export default function CalendarView() {
  const [activeTab, setActiveTab] = useState<CalendarTab>('event-types')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [activeSchedule, setActiveSchedule] = useState('default')
  const [miniMonth, setMiniMonth] = useState(new Date())

  const navItems: { id: CalendarTab; label: string; icon: React.ElementType }[] = [
    { id: 'event-types', label: 'Event Types', icon: LayoutGrid },
    { id: 'scheduled', label: 'Scheduled', icon: CalendarDays },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'routing', label: 'Routing Forms', icon: Route },
    { id: 'integrations', label: 'Integrations', icon: Puzzle },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'polls', label: 'Meeting Polls', icon: Vote },
    { id: 'team', label: 'Team', icon: UserCircle },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // ============ RENDER FUNCTIONS ============

  function renderSidebar() {
    return (
      <div className="w-[220px] min-h-full flex-shrink-0 border-r border-gray-200/60 bg-white/80 backdrop-blur-xl flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-bold text-[#1a1a2e]">Kira</span>
        </div>

        {/* Create Button */}
        <div className="px-4 mb-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>

        {/* Nav Items */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                      : 'text-gray-500 hover:text-[#1a1a2e] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#4F46E5]' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </ScrollArea>

        {/* Bottom user */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[12px] font-semibold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#1a1a2e] truncate">John Doe</p>
              <p className="text-[11px] text-gray-400 truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderTopbar() {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white/60 backdrop-blur-lg sticky top-0 z-10">
        <h2 className="text-[18px] font-semibold text-[#1a1a2e]">
          {navItems.find((n) => n.id === activeTab)?.label}
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-[220px] pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] placeholder-gray-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
            />
          </div>
          <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors">
            <Bell className="w-[18px] h-[18px] text-gray-500" />
          </button>
        </div>
      </div>
    )
  }

  // ============ EVENT TYPES PAGE ============

  function renderEventTypes() {
    const stats = [
      { label: 'Active Event Types', value: '12', change: '+2 this week', positive: true },
      { label: 'Meetings This Week', value: '48', change: '+15% vs last', positive: true },
      { label: 'Avg. Duration', value: '32m', change: '-5m vs avg', positive: true },
      { label: 'No-Show Rate', value: '8%', change: '-2% vs avg', positive: true },
    ]

    const eventTypes = [
      { id: 1, title: '30 Min Meeting', duration: '30 min', type: 'One-on-one', color: 'from-[#4F46E5] to-[#6366F1]', link: 'kira.ai/john/30min', bookings: 24 },
      { id: 2, title: 'Intro Call', duration: '15 min', type: 'Sales', color: 'from-[#EC4899] to-[#F472B6]', link: 'kira.ai/john/intro', bookings: 18 },
      { id: 3, title: 'Team Standup', duration: '45 min', type: 'Team', color: 'from-[#10B981] to-[#34D399]', link: 'kira.ai/john/standup', bookings: 12 },
      { id: 4, title: 'Product Demo', duration: '60 min', type: 'Sales', color: 'from-[#F59E0B] to-[#FBBF24]', link: 'kira.ai/john/demo', bookings: 9 },
      { id: 5, title: 'Deep Dive Session', duration: '90 min', type: 'Consulting', color: 'from-[#8B5CF6] to-[#A78BFA]', link: 'kira.ai/john/deep', bookings: 6 },
      { id: 6, title: 'Quick Sync', duration: '15 min', type: 'One-on-one', color: 'from-[#06B6D4] to-[#22D3EE]', link: 'kira.ai/john/sync', bookings: 31 },
    ]

    const upcoming = [
      { name: 'Sarah Chen', event: '30 Min Meeting', time: 'Today, 2:00 PM', avatar: 'SC' },
      { name: 'Mike Ross', event: 'Product Demo', time: 'Today, 4:30 PM', avatar: 'MR' },
      { name: 'Emily Davis', event: 'Intro Call', time: 'Tomorrow, 10:00 AM', avatar: 'ED' },
      { name: 'Alex Kim', event: 'Deep Dive Session', time: 'Tomorrow, 2:00 PM', avatar: 'AK' },
    ]

    const m = miniMonth.getMonth()
    const y = miniMonth.getFullYear()
    const fD = new Date(y, m, 1).getDay()
    const sO = fD === 0 ? 6 : fD - 1
    const dIM = new Date(y, m + 1, 0).getDate()
    const d = []
    for (let i = 0; i < sO; i++) d.push(null)
    for (let i = 1; i <= dIM; i++) d.push(i)
    const t = new Date()
    const iT = (day: number) => day === t.getDate() && m === t.getMonth() && y === t.getFullYear()

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[12px] text-gray-400 font-medium mb-1">{s.label}</p>
              <p className="text-[28px] font-bold text-[#1a1a2e]">{s.value}</p>
              <p className={`text-[12px] font-medium mt-1 ${s.positive ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Share Strip */}
        <div className="bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-2xl border border-[#4F46E5]/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#4F46E5]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1a1a2e]">Your Scheduling Link</p>
              <p className="text-[12px] text-gray-400">Share with others to let them book time with you</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[13px] text-[#1a1a2e] font-mono">kira.ai/john</div>
            <button className="p-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Event Types Cards */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Your Event Types</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
                <Plus className="w-4 h-4" />
                New Event Type
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {eventTypes.map((et) => (
                <div key={et.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all p-5 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${et.color} flex items-center justify-center`}>
                      <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#1a1a2e] mb-1">{et.title}</h4>
                  <div className="flex items-center gap-3 text-[12px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{et.duration}</span>
                    <span>{et.type}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-[12px] text-gray-400">{et.bookings} bookings</span>
                    <button className="flex items-center gap-1 text-[12px] text-[#4F46E5] hover:underline">
                      <Link2 className="w-3 h-3" />
                      Copy link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[14px] font-semibold text-[#1a1a2e]">
                  {miniMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                  <button onClick={() => setMiniMonth(new Date(y, m - 1, 1))} className="p-1 rounded-lg hover:bg-gray-100">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setMiniMonth(new Date(y, m + 1, 1))} className="p-1 rounded-lg hover:bg-gray-100">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['M','T','W','T','F','S','S'].map((l,i) => (
                  <div key={i} className="text-center text-[11px] font-medium text-gray-400 py-1">{l}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {d.map((day, i) => (
                  <button
                    key={i}
                    disabled={!day}
                    className={`aspect-square rounded-lg text-[12px] font-medium flex items-center justify-center ${
                      !day ? 'invisible' : iT(day) ? 'bg-[#4F46E5] text-white' : 'text-[#1a1a2e] hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="text-[14px] font-semibold text-[#1a1a2e] mb-4">Upcoming Meetings</h4>
              <div className="space-y-3">
                {upcoming.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[11px] font-semibold">
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1a1a2e] truncate">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{u.event}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap">{u.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============ SCHEDULED PAGE ============

  function renderScheduled() {
    const filters = [
      { id: 'all', label: 'All Events', count: 48 },
      { id: 'upcoming', label: 'Upcoming', count: 12 },
      { id: 'completed', label: 'Completed', count: 32 },
      { id: 'cancelled', label: 'Cancelled', count: 4 },
    ]

    const eventOptions = [
      { id: 'all', label: 'All Types' },
      { id: '30min', label: '30 Min Meeting' },
      { id: 'intro', label: 'Intro Call' },
      { id: 'demo', label: 'Product Demo' },
      { id: 'standup', label: 'Team Standup' },
    ]

    const meetings = [
      { name: 'Sarah Chen', email: 'sarah@company.com', event: '30 Min Meeting', date: 'May 13, 2026', time: '2:00 PM - 2:30 PM', status: 'upcoming', method: 'video' },
      { name: 'Mike Ross', email: 'mike@agency.com', event: 'Product Demo', date: 'May 13, 2026', time: '4:30 PM - 5:30 PM', status: 'upcoming', method: 'video' },
      { name: 'Emily Davis', email: 'emily@startup.io', event: 'Intro Call', date: 'May 14, 2026', time: '10:00 AM - 10:15 AM', status: 'upcoming', method: 'phone' },
      { name: 'Alex Kim', email: 'alex@tech.co', event: 'Deep Dive Session', date: 'May 14, 2026', time: '2:00 PM - 3:30 PM', status: 'upcoming', method: 'inperson' },
      { name: 'Lisa Wang', email: 'lisa@design.co', event: '30 Min Meeting', date: 'May 15, 2026', time: '9:00 AM - 9:30 AM', status: 'upcoming', method: 'video' },
      { name: 'James Wilson', email: 'james@corp.com', event: 'Team Standup', date: 'May 12, 2026', time: '10:00 AM - 10:45 AM', status: 'completed', method: 'video' },
      { name: 'Anna Lee', email: 'anna@startup.io', event: 'Intro Call', date: 'May 12, 2026', time: '11:00 AM - 11:15 AM', status: 'completed', method: 'video' },
      { name: 'Tom Brown', email: 'tom@agency.com', event: 'Product Demo', date: 'May 11, 2026', time: '3:00 PM - 4:00 PM', status: 'cancelled', method: 'video' },
      { name: 'Nina Patel', email: 'nina@company.com', event: 'Quick Sync', date: 'May 11, 2026', time: '1:00 PM - 1:15 PM', status: 'completed', method: 'video' },
      { name: 'David Kim', email: 'david@tech.co', event: '30 Min Meeting', date: 'May 10, 2026', time: '11:30 AM - 12:00 PM', status: 'completed', method: 'phone' },
    ]

    const filteredMeetings = meetings.filter((m) => {
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter
      const matchesEvent = eventFilter === 'all' || m.event.toLowerCase().replace(/\s/g, '') === eventFilter
      const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesEvent && matchesSearch
    })

    const methodIcon = (method: string) => {
      if (method === 'video') return <Video className="w-4 h-4 text-gray-400" />
      if (method === 'phone') return <Phone className="w-4 h-4 text-gray-400" />
      return <MapPin className="w-4 h-4 text-gray-400" />
    }

    return (
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: '48', icon: CalendarDays, color: 'from-[#4F46E5] to-[#6366F1]' },
            { label: 'This Week', value: '12', icon: Clock, color: 'from-[#10B981] to-[#34D399]' },
            { label: 'Completion Rate', value: '94%', icon: CheckCircle2, color: 'from-[#F59E0B] to-[#FBBF24]' },
            { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'from-[#EC4899] to-[#F472B6]' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#1a1a2e]">{s.value}</p>
                <p className="text-[12px] text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  statusFilter === f.id
                    ? 'bg-[#1a1a2e] text-white'
                    : 'bg-white text-gray-500 hover:text-[#1a1a2e] border border-gray-200'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              {eventOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr,1fr,1fr,1fr,100px] gap-4 px-5 py-3 border-b border-gray-100 text-[12px] font-medium text-gray-400 uppercase tracking-wider">
            <div>Attendee</div>
            <div>Event Type</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div>Method</div>
          </div>
          {filteredMeetings.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr,1fr,1fr,1fr,100px] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600">
                  {m.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a2e]">{m.name}</p>
                  <p className="text-[11px] text-gray-400">{m.email}</p>
                </div>
              </div>
              <span className="text-[13px] text-[#1a1a2e]">{m.event}</span>
              <div>
                <p className="text-[13px] text-[#1a1a2e]">{m.date}</p>
                <p className="text-[11px] text-gray-400">{m.time}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium w-fit ${
                m.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                m.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                'bg-red-50 text-red-600'
              }`}>
                {m.status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                {m.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                {m.status === 'cancelled' && <X className="w-3 h-3 mr-1" />}
                {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
              </span>
              <div className="flex items-center gap-2">
                {methodIcon(m.method)}
                <span className="text-[12px] text-gray-400 capitalize">{m.method === 'inperson' ? 'In-person' : m.method}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ AVAILABILITY PAGE ============

  function renderAvailability() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

    const availability = {
      Monday: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }],
      Tuesday: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }],
      Wednesday: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }],
      Thursday: [{ start: '9:00 AM', end: '12:00 PM' }, { start: '1:00 PM', end: '5:00 PM' }],
      Friday: [{ start: '9:00 AM', end: '12:00 PM' }],
      Saturday: [],
      Sunday: [],
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Weekly Schedule */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Weekly Hours</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Set your recurring availability</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl border border-gray-200 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                  Copy to All
                </button>
                <button className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {days.map((day) => {
                const slots = availability[day as keyof typeof availability]
                const isActive = slots.length > 0
                return (
                  <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-[100px] flex items-center gap-2">
                      <button
                        className={`relative w-10 h-5.5 rounded-full transition-colors ${isActive ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                        style={{ padding: 0 }}
                      >
                        <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                      <span className="text-[13px] font-medium text-[#1a1a2e]">{day.slice(0, 3)}</span>
                    </div>
                    {isActive ? (
                      <div className="flex items-center gap-2 flex-1">
                        {slots.map((slot, i) => (
                          <React.Fragment key={i}>
                            <div className="flex items-center gap-2">
                              <select className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] text-[#1a1a2e] outline-none">
                                {timeSlots.map((t) => (
                                  <option key={t} value={t} selected={t === slot.start}>{t}</option>
                                ))}
                              </select>
                              <span className="text-gray-300">-</span>
                              <select className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] text-[#1a1a2e] outline-none">
                                {timeSlots.map((t) => (
                                  <option key={t} value={t} selected={t === slot.end}>{t}</option>
                                ))}
                              </select>
                            </div>
                            {i < slots.length - 1 && <span className="text-gray-300">|</span>}
                          </React.Fragment>
                        ))}
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13px] text-gray-400">Unavailable</span>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-5">
            {/* Schedule Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="text-[14px] font-semibold text-[#1a1a2e] mb-3">Schedule</h4>
              <div className="space-y-2">
                {['Default Schedule', 'Summer Hours', 'Holiday Hours'].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSchedule(s.toLowerCase().replace(' ', ''))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all text-left ${
                      activeSchedule === s.toLowerCase().replace(' ', '')
                        ? 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20'
                        : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {s}
                    {i === 0 && <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Active</span>}
                  </button>
                ))}
              </div>
              <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-[13px] text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-colors">
                <Plus className="w-4 h-4" />
                Add Schedule
              </button>
            </div>

            {/* Buffer Time */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="text-[14px] font-semibold text-[#1a1a2e] mb-3">Buffer Time</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500">Before event</span>
                  <select className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] text-[#1a1a2e] outline-none">
                    <option>0 min</option>
                    <option>15 min</option>
                    <option selected>30 min</option>
                    <option>45 min</option>
                    <option>1 hour</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500">After event</span>
                  <select className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-[12px] text-[#1a1a2e] outline-none">
                    <option>0 min</option>
                    <option selected>15 min</option>
                    <option>30 min</option>
                    <option>45 min</option>
                    <option>1 hour</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Linked Calendars */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="text-[14px] font-semibold text-[#1a1a2e] mb-3">Linked Calendars</h4>
              <div className="space-y-3">
                {[
                  { name: 'Google Calendar', email: 'john@gmail.com', status: 'connected', color: '#4F46E5' },
                  { name: 'Outlook Calendar', email: 'john@company.com', status: 'connected', color: '#0EA5E9' },
                ].map((cal, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cal.color + '15' }}>
                      <CalendarDays className="w-4 h-4" style={{ color: cal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[#1a1a2e]">{cal.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{cal.email}</p>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Connected</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-[13px] text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-colors">
                <Plus className="w-4 h-4" />
                Add Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============ ANALYTICS PAGE ============

  function renderAnalytics() {
    const barData = [
      { day: 'Mon', bookings: 8, revenue: 120 },
      { day: 'Tue', bookings: 12, revenue: 180 },
      { day: 'Wed', bookings: 6, revenue: 90 },
      { day: 'Thu', bookings: 15, revenue: 225 },
      { day: 'Fri', bookings: 10, revenue: 150 },
      { day: 'Sat', bookings: 3, revenue: 45 },
      { day: 'Sun', bookings: 2, revenue: 30 },
    ]

    const donutSegments = [
      { label: '30 Min Meeting', value: 42, color: '#4F46E5' },
      { label: 'Intro Call', value: 28, color: '#EC4899' },
      { label: 'Product Demo', value: 15, color: '#F59E0B' },
      { label: 'Team Standup', value: 10, color: '#10B981' },
      { label: 'Others', value: 5, color: '#8B5CF6' },
    ]

    const maxBar = Math.max(...barData.map((d) => d.bookings))

    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: '156', change: '+12% vs last mo', positive: true },
            { label: 'Total Revenue', value: '$2,340', change: '+8% vs last mo', positive: true },
            { label: 'Avg. Meeting Value', value: '$15', change: '+3% vs avg', positive: true },
            { label: 'Conversion Rate', value: '68%', change: '-2% vs avg', positive: false },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[12px] text-gray-400 font-medium mb-1">{s.label}</p>
              <p className="text-[28px] font-bold text-[#1a1a2e]">{s.value}</p>
              <p className={`text-[12px] font-medium mt-1 ${s.positive ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">Bookings This Week</h3>
            <p className="text-[12px] text-gray-400 mb-6">Daily booking volume</p>
            <div className="flex items-end gap-3 h-[200px]">
              {barData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <span className="text-[11px] text-gray-400">{d.bookings}</span>
                    <div
                      className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-[#4F46E5] to-[#6366F1] transition-all hover:opacity-80"
                      style={{ height: `${(d.bookings / maxBar) * 160}px` }}
                    />
                  </div>
                  <span className="text-[12px] text-gray-500 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">Event Type Distribution</h3>
            <p className="text-[12px] text-gray-400 mb-6">Breakdown by event type</p>
            <div className="flex items-center gap-8">
              {/* SVG Donut */}
              <div className="relative w-[160px] h-[160px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {donutSegments.reduce(
                    (acc, seg, i) => {
                      acc.paths.push(
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="20"
                          strokeDasharray={`${(seg.value / 100) * 220} 220`}
                          strokeDashoffset={-acc.offset * 2.2}
                        />
                      )
                      acc.offset += (seg.value / 100) * 360
                      return acc
                    },
                    { paths: [] as React.ReactNode[], offset: 0 }
                  ).paths}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[24px] font-bold text-[#1a1a2e]">156</p>
                    <p className="text-[11px] text-gray-400">Total</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3 flex-1">
                {donutSegments.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[13px] text-[#1a1a2e] flex-1">{s.label}</span>
                    <span className="text-[13px] font-semibold text-[#1a1a2e]">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-4">Top Performing Event Types</h3>
          <div className="space-y-3">
            {[
              { name: '30 Min Meeting', bookings: 68, rate: '92%', trend: '+15%' },
              { name: 'Intro Call', bookings: 45, rate: '88%', trend: '+8%' },
              { name: 'Product Demo', bookings: 24, rate: '76%', trend: '+22%' },
              { name: 'Team Standup', bookings: 19, rate: '95%', trend: '+5%' },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50">
                <span className="text-[14px] font-bold text-gray-300 w-6">#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#1a1a2e]">{e.name}</p>
                  <div className="w-[200px] h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full" style={{ width: e.rate }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[#1a1a2e]">{e.bookings} bookings</p>
                  <p className="text-[12px] text-emerald-500">{e.trend} this month</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ============ WORKFLOWS PAGE ============

  function renderWorkflows() {
    const workflows = [
      { id: 1, name: 'Send Reminder Email', trigger: '24h before event', action: 'Send email', status: 'active', runs: 1240 },
      { id: 2, name: 'Slack Notification', trigger: 'New booking', action: 'Post to Slack', status: 'active', runs: 856 },
      { id: 3, name: 'Follow-up Survey', trigger: 'Event completed', action: 'Send survey', status: 'active', runs: 634 },
      { id: 4, name: 'Add to CRM', trigger: 'New booking', action: 'Create contact', status: 'paused', runs: 856 },
      { id: 5, name: 'Calendar Block', trigger: 'Event created', action: 'Block calendar', status: 'active', runs: 1240 },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Automation Workflows</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Automate tasks before and after events</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {workflows.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="text-[15px] font-semibold text-[#1a1a2e] mb-3">{w.name}</h4>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[12px] text-gray-500">When: {w.trigger}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span className="text-[12px] text-gray-500">Then: {w.action}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`text-[12px] px-3 py-1 rounded-full ${w.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                </span>
                <span className="text-[12px] text-gray-400">{w.runs.toLocaleString()} runs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ ROUTING FORMS PAGE ============

  function renderRouting() {
    const forms = [
      { id: 1, name: 'Sales Inquiry Router', responses: 234, conversion: '68%', status: 'active', fields: 5 },
      { id: 2, name: 'Support Ticket Triage', responses: 189, conversion: '82%', status: 'active', fields: 4 },
      { id: 3, name: 'Demo Request Filter', responses: 156, conversion: '45%', status: 'active', fields: 6 },
      { id: 4, name: 'Partnership Inquiry', responses: 67, conversion: '71%', status: 'draft', fields: 3 },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Routing Forms</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Route visitors to the right booking page</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Create Form
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr,120px,120px,100px,80px] gap-4 px-5 py-3 border-b border-gray-100 text-[12px] font-medium text-gray-400 uppercase tracking-wider">
            <div>Form Name</div>
            <div>Responses</div>
            <div>Conversion</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {forms.map((f) => (
            <div key={f.id} className="grid grid-cols-[1fr,120px,120px,100px,80px] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center">
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">{f.name}</p>
                <p className="text-[11px] text-gray-400">{f.fields} fields</p>
              </div>
              <span className="text-[13px] text-[#1a1a2e]">{f.responses}</span>
              <span className="text-[13px] text-[#1a1a2e] font-medium">{f.conversion}</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium w-fit ${f.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ INTEGRATIONS PAGE ============

  function renderIntegrations() {
    const integrations = [
      { name: 'Google Calendar', category: 'Calendar', icon: CalendarDays, color: '#4F46E5', status: 'connected', desc: 'Sync events and availability' },
      { name: 'Slack', category: 'Communication', icon: Slack, color: '#4A154B', status: 'connected', desc: 'Get booking notifications' },
      { name: 'Zoom', category: 'Video', icon: Video, color: '#2D8CFF', status: 'connected', desc: 'Auto-generate meeting links' },
      { name: 'Stripe', category: 'Payments', icon: CircleDollarSign, color: '#635BFF', status: 'connected', desc: 'Accept payments for bookings' },
      { name: 'Salesforce', category: 'CRM', icon: Users, color: '#00A1E0', status: 'available', desc: 'Create leads from bookings' },
      { name: 'HubSpot', category: 'CRM', icon: Users, color: '#FF7A59', status: 'available', desc: 'Track contacts and deals' },
      { name: 'Microsoft Teams', category: 'Video', icon: Users, color: '#6264A7', status: 'available', desc: 'Teams meeting integration' },
      { name: 'Notion', category: 'Productivity', icon: Layers, color: '#000000', status: 'available', desc: 'Log meetings to database' },
      { name: 'Chrome', category: 'Browser', icon: Chrome, color: '#4285F4', status: 'available', desc: 'Browser extension' },
      { name: 'Zapier', category: 'Automation', icon: Zap, color: '#FF4A00', status: 'available', desc: 'Connect 5000+ apps' },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Integrations</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Connect your favorite tools</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {integrations.map((int, i) => {
            const Icon = int.icon
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: int.color + '12' }}>
                    <Icon className="w-6 h-6" style={{ color: int.color }} />
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full ${int.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {int.status === 'connected' ? 'Connected' : 'Available'}
                  </span>
                </div>
                <h4 className="text-[15px] font-semibold text-[#1a1a2e] mb-1">{int.name}</h4>
                <p className="text-[12px] text-gray-400 mb-1">{int.category}</p>
                <p className="text-[12px] text-gray-500 mb-4">{int.desc}</p>
                <button className={`w-full py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  int.status === 'connected'
                    ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'bg-[#4F46E5] hover:bg-[#4338ca] text-white'
                }`}>
                  {int.status === 'connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ============ CONTACTS PAGE ============

  function renderContacts() {
    const contacts = [
      { name: 'Sarah Chen', email: 'sarah@company.com', company: 'TechCorp', bookings: 8, last: '2 days ago', avatar: 'SC' },
      { name: 'Mike Ross', email: 'mike@agency.com', company: 'Creative Agency', bookings: 5, last: '1 week ago', avatar: 'MR' },
      { name: 'Emily Davis', email: 'emily@startup.io', company: 'StartupXYZ', bookings: 12, last: 'Yesterday', avatar: 'ED' },
      { name: 'Alex Kim', email: 'alex@tech.co', company: 'DataFlow', bookings: 3, last: '3 days ago', avatar: 'AK' },
      { name: 'Lisa Wang', email: 'lisa@design.co', company: 'DesignHub', bookings: 6, last: 'Today', avatar: 'LW' },
      { name: 'James Wilson', email: 'james@corp.com', company: 'Enterprise Inc', bookings: 4, last: '5 days ago', avatar: 'JW' },
      { name: 'Anna Lee', email: 'anna@startup.io', company: 'StartupXYZ', bookings: 7, last: '1 day ago', avatar: 'AL' },
      { name: 'Tom Brown', email: 'tom@agency.com', company: 'Creative Agency', bookings: 2, last: '2 weeks ago', avatar: 'TB' },
    ]

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Contacts</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">People who have booked with you</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr,1fr,120px,100px,100px] gap-4 px-5 py-3 border-b border-gray-100 text-[12px] font-medium text-gray-400 uppercase tracking-wider">
            <div>Contact</div>
            <div>Company</div>
            <div>Bookings</div>
            <div>Last Booking</div>
            <div>Actions</div>
          </div>
          {contacts
            .filter((c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr,1fr,120px,100px,100px] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[12px] font-semibold">
                    {c.avatar}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#1a1a2e]">{c.name}</p>
                    <p className="text-[11px] text-gray-400">{c.email}</p>
                  </div>
                </div>
                <span className="text-[13px] text-gray-600">{c.company}</span>
                <span className="text-[13px] text-[#1a1a2e] font-medium">{c.bookings}</span>
                <span className="text-[13px] text-gray-500">{c.last}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  // ============ MEETING POLLS PAGE ============

  function renderPolls() {
    const polls = [
      { id: 1, title: 'Q2 Team Offsite', votes: 12, options: 4, closes: 'May 15', status: 'active' },
      { id: 2, title: 'All-Hands Meeting', votes: 34, options: 3, closes: 'May 14', status: 'active' },
      { id: 3, title: 'Design Review', votes: 8, options: 5, closes: 'May 16', status: 'active' },
      { id: 4, title: 'Sprint Planning', votes: 0, options: 4, closes: 'May 20', status: 'draft' },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Meeting Polls</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Find the best time for group meetings</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Create Poll
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {polls.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 flex items-center justify-center">
                  <Vote className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="text-[15px] font-semibold text-[#1a1a2e] mb-3">{p.title}</h4>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[12px] text-gray-500">{p.votes} votes</span>
                <span className="text-[12px] text-gray-500">{p.options} time options</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`text-[12px] px-3 py-1 rounded-full ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
                <span className="text-[12px] text-gray-400">Closes {p.closes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ TEAM PAGE ============

  function renderTeam() {
    const members = [
      { name: 'John Doe', role: 'Owner', email: 'john@company.com', avatar: 'JD', status: 'active' },
      { name: 'Sarah Chen', role: 'Admin', email: 'sarah@company.com', avatar: 'SC', status: 'active' },
      { name: 'Mike Ross', role: 'Member', email: 'mike@company.com', avatar: 'MR', status: 'active' },
      { name: 'Emily Davis', role: 'Member', email: 'emily@company.com', avatar: 'ED', status: 'away' },
      { name: 'Alex Kim', role: 'Viewer', email: 'alex@company.com', avatar: 'AK', status: 'active' },
      { name: 'Lisa Wang', role: 'Member', email: 'lisa@company.com', avatar: 'LW', status: 'offline' },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Team Members</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">Manage your team and permissions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {members.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[16px] font-bold">
                  {m.avatar}
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${m.status === 'active' ? 'bg-emerald-400' : m.status === 'away' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
              </div>
              <h4 className="text-[15px] font-semibold text-[#1a1a2e]">{m.name}</h4>
              <p className="text-[12px] text-gray-400 mb-3">{m.email}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] font-medium">{m.role}</span>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ BILLING PAGE ============

  function renderBilling() {
    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-white/70 mb-1">Current Plan</p>
              <h3 className="text-[24px] font-bold mb-2">Pro Plan</h3>
              <p className="text-[14px] text-white/80">$19/month · Renews on June 1, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[36px] font-bold">$19<span className="text-[16px] font-medium text-white/60">/mo</span></p>
              <button className="mt-2 px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium transition-colors">
                Change Plan
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Usage */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-4">Usage This Month</h3>
            <div className="space-y-5">
              {[
                { label: 'Bookings', used: 48, limit: 100, color: 'bg-[#4F46E5]' },
                { label: 'Team Members', used: 4, limit: 10, color: 'bg-[#10B981]' },
                { label: 'Event Types', used: 12, limit: 20, color: 'bg-[#F59E0B]' },
                { label: 'Workflow Runs', used: 856, limit: 2000, color: 'bg-[#EC4899]' },
              ].map((u, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#1a1a2e]">{u.label}</span>
                    <span className="text-[12px] text-gray-400">{u.used} / {u.limit}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${u.color} rounded-full transition-all`} style={{ width: `${(u.used / u.limit) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="space-y-3">
            {[
              { name: 'Free', price: '$0', features: ['3 event types', '10 bookings/mo', 'Basic analytics'], current: false },
              { name: 'Pro', price: '$19', features: ['20 event types', '100 bookings/mo', 'Advanced analytics', 'Workflows'], current: true },
              { name: 'Enterprise', price: '$49', features: ['Unlimited events', 'Unlimited bookings', 'Priority support', 'SSO'], current: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl border p-5 ${plan.current ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[15px] font-semibold text-[#1a1a2e]">{plan.name}</h4>
                  {plan.current && <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#4F46E5] text-white font-medium">Current</span>}
                </div>
                <p className="text-[24px] font-bold text-[#1a1a2e] mb-3">{plan.price}<span className="text-[13px] font-normal text-gray-400">/mo</span></p>
                <ul className="space-y-1.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-[12px] text-gray-500">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                {!plan.current && (
                  <button className="w-full mt-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#1a1a2e] hover:bg-gray-50 transition-colors">
                    {i === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-[16px] font-semibold text-[#1a1a2e]">Invoices</h3>
          </div>
          {[
            { id: 'INV-2026-004', date: 'May 1, 2026', amount: '$19.00', status: 'paid' },
            { id: 'INV-2026-003', date: 'Apr 1, 2026', amount: '$19.00', status: 'paid' },
            { id: 'INV-2026-002', date: 'Mar 1, 2026', amount: '$19.00', status: 'paid' },
            { id: 'INV-2026-001', date: 'Feb 1, 2026', amount: '$19.00', status: 'paid' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a2e]">{inv.id}</p>
                  <p className="text-[11px] text-gray-400">{inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-semibold text-[#1a1a2e]">{inv.amount}</span>
                <span className="text-[12px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Paid</span>
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ============ SETTINGS PAGE ============

  function renderSettings() {
    return (
      <div className="space-y-6 max-w-[800px]">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-5">Profile</h3>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-[24px] font-bold">
              JD
            </div>
            <div>
              <button className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition-colors">
                Change Avatar
              </button>
              <p className="text-[12px] text-gray-400 mt-2">JPG, PNG. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-[#1a1a2e] mb-2 block">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#1a1a2e] mb-2 block">Email</label>
              <input type="email" defaultValue="john@company.com" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] transition-colors" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#1a1a2e] mb-2 block">Time Zone</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] transition-colors">
                <option>Eastern Time (ET)</option>
                <option selected>Pacific Time (PT)</option>
                <option>Central Time (CT)</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#1a1a2e] mb-2 block">Language</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] transition-colors">
                <option selected>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-5">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Booking confirmations', desc: 'Get notified when someone books a meeting', checked: true },
              { label: 'Cancellation alerts', desc: 'Get notified when a booking is cancelled', checked: true },
              { label: 'Reminder emails', desc: 'Receive reminders before your meetings', checked: true },
              { label: 'Weekly summary', desc: 'Get a weekly digest of your bookings', checked: false },
              { label: 'Marketing emails', desc: 'Receive product updates and tips', checked: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a2e]">{n.label}</p>
                  <p className="text-[12px] text-gray-400">{n.desc}</p>
                </div>
                <button
                  className={`relative w-11 h-6 rounded-full transition-colors ${n.checked ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${n.checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-[16px] font-semibold text-[#1a1a2e] mb-5">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">Theme</p>
                <p className="text-[12px] text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]"><Sun className="w-4 h-4" /></button>
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><Moon className="w-4 h-4" /></button>
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><Monitor className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-50">
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">Default Meeting Duration</p>
                <p className="text-[12px] text-gray-400">Set the default length for new events</p>
              </div>
              <select className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none">
                <option>15 min</option>
                <option selected>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-50">
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">Date Format</p>
                <p className="text-[12px] text-gray-400">How dates are displayed</p>
              </div>
              <select className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none">
                <option selected>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
          <h3 className="text-[16px] font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-[13px] text-red-500/70 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-[13px] font-medium hover:bg-red-100 transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ MAIN RENDER ============

  const renderContent = () => {
    switch (activeTab) {
      case 'event-types': return renderEventTypes()
      case 'scheduled': return renderScheduled()
      case 'availability': return renderAvailability()
      case 'analytics': return renderAnalytics()
      case 'workflows': return renderWorkflows()
      case 'routing': return renderRouting()
      case 'integrations': return renderIntegrations()
      case 'contacts': return renderContacts()
      case 'polls': return renderPolls()
      case 'team': return renderTeam()
      case 'billing': return renderBilling()
      case 'settings': return renderSettings()
      default: return renderEventTypes()
    }
  }

  return (
    <div className="h-full flex" style={{ background: 'linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 50%, #f5f0ff 100%)' }}>
      {renderSidebar()}
      <div className="flex-1 flex flex-col min-h-full overflow-hidden">
        {renderTopbar()}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-semibold text-[#1a1a2e]">Create New</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Event Type', desc: 'New booking page', icon: CalendarDays },
                { label: 'Workflow', desc: 'Automation', icon: Workflow },
                { label: 'Routing Form', desc: 'Screen visitors', icon: Route },
                { label: 'Meeting Poll', desc: 'Group scheduling', icon: Vote },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <button key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all text-center group">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#4F46E5]/10 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6 text-gray-400 group-hover:text-[#4F46E5] transition-colors" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1a1a2e]">{item.label}</p>
                      <p className="text-[12px] text-gray-400">{item.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
