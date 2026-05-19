import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Globe, FileText, Image, Wifi, Utensils, Briefcase, Music, Smartphone,
  Mail, Phone, MessageCircle, MapPin, QrCode, Download, Copy, Check,
  Palette, Scan, Share2, Sparkles, Layers, RefreshCw, Trash2,
  Plus, Link2, Eye, Hexagon, Square, Circle,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

type QRType = 'website' | 'pdf' | 'image' | 'wifi' | 'menu' | 'business' | 'mp3' | 'app' | 'email' | 'phone' | 'sms' | 'location'
type QRStyle = 'classic' | 'rounded' | 'dots'

const qrTypes: { id: QRType; label: string; icon: React.ElementType }[] = [
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'sms', label: 'SMS', icon: MessageCircle },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'image', label: 'Images', icon: Image },
  { id: 'menu', label: 'Menu', icon: Utensils },
  { id: 'mp3', label: 'MP3', icon: Music },
  { id: 'app', label: 'App', icon: Smartphone },
]

const colorPresets = [
  '#000000', '#1a1a2e', '#4F46E5', '#7C3AED', '#EC4899',
  '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
]

const savedQRCodes = [
  { id: 1, name: 'Company Website', type: 'website', scans: 234, color: '#4F46E5' },
  { id: 2, name: 'Guest Wi-Fi', type: 'wifi', scans: 89, color: '#10B981' },
  { id: 3, name: 'My Business Card', type: 'business', scans: 156, color: '#F59E0B' },
  { id: 4, name: 'Contact Email', type: 'email', scans: 67, color: '#3B82F6' },
]

export default function QRCodeGenerator() {
  const [activeType, setActiveType] = useState<QRType>('website')
  const [qrName, setQrName] = useState('My QR Code')
  const [qrData, setQrData] = useState('https://beeda.ai')
  const [qrStyle, setQrStyle] = useState<QRStyle>('classic')
  const [primaryColor, setPrimaryColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [copied, setCopied] = useState(false)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate QR pattern on canvas
  const generateQR = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 400
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    const moduleSize = size / 25
    const seed = qrData.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const rng = (i: number) => {
      const x = Math.sin(seed + i * 997) * 10000
      return x - Math.floor(x)
    }

    const drawFinder = (fx: number, fy: number) => {
      ctx.fillStyle = primaryColor
      ctx.fillRect(fx * moduleSize, fy * moduleSize, 7 * moduleSize, 7 * moduleSize)
      ctx.fillStyle = bgColor
      ctx.fillRect((fx + 1) * moduleSize, (fy + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize)
      ctx.fillStyle = primaryColor
      ctx.fillRect((fx + 2) * moduleSize, (fy + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize)
      ctx.fillStyle = bgColor
      ctx.fillRect((fx + 3) * moduleSize, (fy + 3) * moduleSize, moduleSize, moduleSize)
    }

    drawFinder(0, 0)
    drawFinder(18, 0)
    drawFinder(0, 18)

    ctx.fillStyle = primaryColor
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if ((row < 8 && col < 8) || (row < 8 && col > 17) || (row > 17 && col < 8)) continue
        if (rng(row * 25 + col) > 0.48) {
          const x = col * moduleSize
          const y = row * moduleSize
          const ms = moduleSize - 1
          if (qrStyle === 'dots') {
            ctx.beginPath()
            ctx.arc(x + moduleSize / 2, y + moduleSize / 2, ms * 0.42, 0, Math.PI * 2)
            ctx.fill()
          } else if (qrStyle === 'rounded') {
            const r = ms * 0.25
            ctx.beginPath()
            ctx.moveTo(x + r, y)
            ctx.lineTo(x + ms - r, y)
            ctx.quadraticCurveTo(x + ms, y, x + ms, y + r)
            ctx.lineTo(x + ms, y + ms - r)
            ctx.quadraticCurveTo(x + ms, y + ms, x + ms - r, y + ms)
            ctx.lineTo(x + r, y + ms)
            ctx.quadraticCurveTo(x, y + ms, x, y + ms - r)
            ctx.lineTo(x, y + r)
            ctx.quadraticCurveTo(x, y, x + r, y)
            ctx.fill()
          } else {
            ctx.fillRect(x + 0.5, y + 0.5, ms, ms)
          }
        }
      }
    }

    setQrImage(canvas.toDataURL('image/png'))
  }, [qrData, qrStyle, primaryColor, bgColor])

  useEffect(() => { generateQR() }, [generateQR])

  const handleDownload = (fmt: 'png' | 'jpg') => {
    if (!qrImage) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = `${qrName.replace(/\s+/g, '_')}.${fmt}`
    link.click()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const TypeIcon = qrTypes.find(t => t.id === activeType)?.icon || Globe

  return (
    <div className="h-full flex flex-col">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white/60 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-[#4F46E5]" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1a1a2e]">QR Code Generator</h2>
            <p className="text-[12px] text-gray-400">Create and customize QR codes instantly</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF' }}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-5 max-w-[1200px] mx-auto">

            {/* Left - QR Type */}
            <div className="col-span-3 space-y-4">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-[#4F46E5]" />
                  <h3 className="text-[14px] font-semibold text-[#1a1a2e]">QR Type</h3>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {qrTypes.map((t) => {
                    const Icon = t.icon
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveType(t.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                          activeType === t.id
                            ? 'bg-[#4F46E5]/8 border border-[#4F46E5]/20'
                            : 'border border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-[18px] h-[18px] ${activeType === t.id ? 'text-[#4F46E5]' : 'text-gray-400'}`} />
                        <span className={`text-[11px] font-medium ${activeType === t.id ? 'text-[#4F46E5]' : 'text-gray-500'}`}>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Saved QR Codes */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Saved QR Codes</h3>
                  <span className="text-[11px] text-gray-400">{savedQRCodes.length}</span>
                </div>
                <div className="space-y-2">
                  {savedQRCodes.map((qr) => (
                    <div key={qr.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: qr.color + '12' }}>
                        <QrCode className="w-4 h-4" style={{ color: qr.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-[#1a1a2e] truncate">{qr.name}</p>
                        <p className="text-[11px] text-gray-400">{qr.scans} scans</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-200 text-[12px] text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New QR Code
                </button>
              </div>
            </div>

            {/* Center - Editor */}
            <div className="col-span-5 space-y-4">
              {/* Content Form */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TypeIcon className="w-4 h-4 text-[#4F46E5]" />
                  <h3 className="text-[14px] font-semibold text-[#1a1a2e] capitalize">{activeType} Content</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">QR Code Name</label>
                    <input
                      type="text"
                      value={qrName}
                      onChange={(e) => setQrName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
                    />
                  </div>

                  {activeType === 'website' && (
                    <div>
                      <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Website URL</label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="url" value={qrData} onChange={(e) => setQrData(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] text-[#1a1a2e] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all" />
                      </div>
                    </div>
                  )}
                  {activeType === 'email' && (
                    <>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Email Address</label>
                        <input type="email" placeholder="name@example.com" onChange={(e) => setQrData(`mailto:${e.target.value}`)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Subject</label>
                        <input type="text" placeholder="Email subject" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                    </>
                  )}
                  {activeType === 'phone' && (
                    <div>
                      <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" onChange={(e) => setQrData(`tel:${e.target.value}`)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                    </div>
                  )}
                  {activeType === 'sms' && (
                    <>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Phone Number</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" onChange={(e) => setQrData(`sms:${e.target.value}`)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Message</label>
                        <textarea rows={2} placeholder="Pre-filled message..." className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5] resize-none" />
                      </div>
                    </>
                  )}
                  {activeType === 'wifi' && (
                    <>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Network Name (SSID)</label>
                        <input type="text" placeholder="WiFi Network" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Password</label>
                        <input type="text" placeholder="WiFi password" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Security</label>
                        <select className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]">
                          <option>WPA/WPA2</option>
                          <option>WEP</option>
                          <option>No Encryption</option>
                        </select>
                      </div>
                    </>
                  )}
                  {activeType === 'business' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">First Name</label>
                          <input type="text" placeholder="John" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                        </div>
                        <div>
                          <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Last Name</label>
                          <input type="text" placeholder="Doe" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Company</label>
                        <input type="text" placeholder="Company name" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Phone</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Email</label>
                        <input type="email" placeholder="john@company.com" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                      </div>
                    </>
                  )}
                  {activeType === 'location' && (
                    <div>
                      <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Google Maps URL</label>
                      <input type="url" placeholder="https://maps.google.com/..." onChange={(e) => setQrData(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                    </div>
                  )}
                  {['pdf', 'image', 'menu', 'mp3', 'app'].includes(activeType) && (
                    <div>
                      <label className="text-[12px] font-medium text-gray-500 mb-1.5 block capitalize">{activeType} URL</label>
                      <input type="url" placeholder={`https://example.com/file.${activeType === 'app' ? 'apk' : activeType}`} onChange={(e) => setQrData(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[13px] outline-none focus:border-[#4F46E5]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Style & Colors */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-5">
                {/* Style */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Style</h3>
                  </div>
                  <div className="flex gap-2">
                    {([
                      { id: 'classic', label: 'Classic', icon: Square },
                      { id: 'rounded', label: 'Rounded', icon: Hexagon },
                      { id: 'dots', label: 'Dots', icon: Circle },
                    ] as const).map((s) => {
                      const Icon = s.icon
                      return (
                        <button
                          key={s.id}
                          onClick={() => setQrStyle(s.id)}
                          className={`flex flex-col items-center gap-1.5 py-3 px-4 rounded-xl border-2 transition-all flex-1 ${
                            qrStyle === s.id
                              ? 'border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]'
                              : 'border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[11px] font-medium">{s.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Colors</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-gray-500">Primary</span>
                        <div className="flex items-center gap-2">
                          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                          <span className="text-[11px] text-gray-400 font-mono">{primaryColor}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {colorPresets.map((c) => (
                          <button key={c} onClick={() => setPrimaryColor(c)} className={`w-7 h-7 rounded-lg transition-all ${primaryColor === c ? 'ring-2 ring-offset-1 ring-[#4F46E5]' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-gray-500">Background</span>
                        <div className="flex items-center gap-2">
                          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0" />
                          <span className="text-[11px] text-gray-400 font-mono">{bgColor}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {['#FFFFFF', '#F3F4F6', '#E5E7EB', '#1a1a2e', '#4F46E5', '#10B981', '#FEF3C7', '#DBEAFE'].map((c) => (
                          <button key={c} onClick={() => setBgColor(c)} className={`w-7 h-7 rounded-lg border border-gray-200 transition-all ${bgColor === c ? 'ring-2 ring-offset-1 ring-[#4F46E5]' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Preview */}
            <div className="col-span-4 space-y-4">
              {/* Preview Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#4F46E5]" />
                    <h3 className="text-[14px] font-semibold text-[#1a1a2e]">Preview</h3>
                  </div>
                  <button onClick={generateQR} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* QR Display */}
                <div className="flex justify-center mb-4">
                  <div className="relative p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    {qrImage && (
                      <img src={qrImage} alt="QR Code" className="w-[180px] h-[180px]" />
                    )}
                    {/* Corner markers */}
                    <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-[#4F46E5] rounded-tl-md" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 border-r-2 border-t-2 border-[#4F46E5] rounded-tr-md" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-2 border-b-2 border-[#4F46E5] rounded-bl-md" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-[#4F46E5] rounded-br-md" />
                  </div>
                </div>

                {/* Data preview */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 mb-4">
                  <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-[11px] text-gray-500 truncate">{qrData}</span>
                </div>

                {/* Download buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => handleDownload('png')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-[#4F46E5] hover:text-white border border-gray-200 text-[12px] font-medium text-gray-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG
                  </button>
                  <button
                    onClick={() => handleDownload('jpg')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-[#4F46E5] hover:text-white border border-gray-200 text-[12px] font-medium text-gray-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> JPG
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-all">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5 rounded-2xl border border-[#4F46E5]/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="w-4 h-4 text-[#4F46E5]" />
                  <h3 className="text-[13px] font-semibold text-[#1a1a2e]">Best Practices</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Use high contrast colors for better scanability',
                    'Always test your QR code before printing',
                    'Keep URLs short for cleaner QR patterns',
                    'Download in PNG for best print quality',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[12px] text-gray-500 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[10px] font-bold text-[#4F46E5]">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats mini */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Created', value: '12' },
                  { label: 'Scans', value: '1.2k' },
                  { label: 'Types', value: '8' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/60 p-3 text-center">
                    <p className="text-[18px] font-bold text-[#1a1a2e]">{s.value}</p>
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
