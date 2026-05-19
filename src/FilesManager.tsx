import React, { useState, useRef, useCallback } from 'react'
import {
  Folder,
  FileText,
  Image,
  File,
  Music,
  Video,
  MoreVertical,
  Upload,
  Search,
  Star,
  Trash2,
  Download,
  FolderOpen,
  Cloud,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Grid,
  List,
  Check,
  X,
  RefreshCw,
  Copy,
  Move,
  Edit3,
  Shield,
  Database,
  FileSpreadsheet,
  FileCode,
  FileType,
  FileArchive,
  Eye,
  Play,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────
interface KFile {
  id: string
  name: string
  type:
    | 'folder'
    | 'doc'
    | 'image'
    | 'video'
    | 'audio'
    | 'spreadsheet'
    | 'code'
    | 'pdf'
    | 'archive'
    | 'other'
  size: string
  updated: string
  starred: boolean
  location: 'kira' | 'local' | 'gdrive'
  parentId: string | null
  thumbnail?: string // Data URL for image preview
}

// ─── Helpers ───────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10)
const now = () =>
  new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const FILE_ICON: Record<string, React.ReactNode> = {
  folder: <Folder className="w-5 h-5 text-[#F59E0B]" />,
  doc: <FileText className="w-5 h-5 text-[#3B82F6]" />,
  image: <Image className="w-5 h-5 text-[#10B981]" />,
  video: <Video className="w-5 h-5 text-[#EF4444]" />,
  audio: <Music className="w-5 h-5 text-[#8B5CF6]" />,
  spreadsheet: <FileSpreadsheet className="w-5 h-5 text-[#10B981]" />,
  code: <FileCode className="w-5 h-5 text-[#6366F1]" />,
  pdf: <FileType className="w-5 h-5 text-[#EF4444]" />,
  archive: <FileArchive className="w-5 h-5 text-[#F59E0B]" />,
  other: <File className="w-5 h-5 text-gray-400" />,
}

const BG_COLORS: Record<string, string> = {
  folder: 'bg-amber-50',
  doc: 'bg-blue-50',
  image: 'bg-emerald-50',
  video: 'bg-red-50',
  audio: 'bg-violet-50',
  spreadsheet: 'bg-emerald-50',
  code: 'bg-indigo-50',
  pdf: 'bg-red-50',
  archive: 'bg-amber-50',
  other: 'bg-gray-50',
}

// ─── Demo Data ───────────────────────────────────────────
const INITIAL_FILES: KFile[] = [
  // Kira Cloud root
  {
    id: uid(),
    name: 'Documents',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: true,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Images',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: false,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Project Alpha',
    type: 'folder',
    size: '--',
    updated: 'May 14, 2026',
    starred: true,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Meeting Notes.docx',
    type: 'doc',
    size: '24 KB',
    updated: 'May 15, 2026',
    starred: false,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Budget 2026.xlsx',
    type: 'spreadsheet',
    size: '156 KB',
    updated: 'May 10, 2026',
    starred: false,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Logo Design.png',
    type: 'image',
    size: '2.4 MB',
    updated: 'May 12, 2026',
    starred: true,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Intro Video.mp4',
    type: 'video',
    size: '48 MB',
    updated: 'May 8, 2026',
    starred: false,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Source Code.zip',
    type: 'archive',
    size: '12 MB',
    updated: 'May 5, 2026',
    starred: false,
    location: 'kira',
    parentId: null,
  },
  {
    id: uid(),
    name: 'API Specs.pdf',
    type: 'pdf',
    size: '3.2 MB',
    updated: 'May 1, 2026',
    starred: false,
    location: 'kira',
    parentId: null,
  },
  // Inside Documents folder
  {
    id: uid(),
    name: 'Contract v2.docx',
    type: 'doc',
    size: '18 KB',
    updated: 'May 14, 2026',
    starred: false,
    location: 'kira',
    parentId: 'demo1',
  },
  {
    id: uid(),
    name: 'Proposal.pdf',
    type: 'pdf',
    size: '1.8 MB',
    updated: 'May 13, 2026',
    starred: false,
    location: 'kira',
    parentId: 'demo1',
  },
  // Local Storage
  {
    id: uid(),
    name: 'Downloads',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: false,
    location: 'local',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Desktop',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: false,
    location: 'local',
    parentId: null,
  },
  {
    id: uid(),
    name: 'screenshot_001.png',
    type: 'image',
    size: '1.1 MB',
    updated: 'May 15, 2026',
    starred: false,
    location: 'local',
    parentId: null,
  },
  {
    id: uid(),
    name: 'invoice_march.pdf',
    type: 'pdf',
    size: '320 KB',
    updated: 'Apr 28, 2026',
    starred: false,
    location: 'local',
    parentId: null,
  },
  {
    id: uid(),
    name: 'backup.sql',
    type: 'code',
    size: '8.4 MB',
    updated: 'May 10, 2026',
    starred: false,
    location: 'local',
    parentId: null,
  },
  // Google Drive
  {
    id: uid(),
    name: 'Shared with me',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: false,
    location: 'gdrive',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Team Folder',
    type: 'folder',
    size: '--',
    updated: now(),
    starred: false,
    location: 'gdrive',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Q1 Report.pdf',
    type: 'pdf',
    size: '4.1 MB',
    updated: 'Apr 15, 2026',
    starred: false,
    location: 'gdrive',
    parentId: null,
  },
  {
    id: uid(),
    name: 'Presentation.pptx',
    type: 'doc',
    size: '8.2 MB',
    updated: 'Mar 22, 2026',
    starred: false,
    location: 'gdrive',
    parentId: null,
  },
]
// Fix parentIds for demo
INITIAL_FILES[0].id = 'demo1'
INITIAL_FILES[9].parentId = 'demo1'
INITIAL_FILES[10].parentId = 'demo1'
INITIAL_FILES[13].id = 'demo2'
INITIAL_FILES[14].id = 'demo3'

// ─── Main Component ───────────────────────────────────────────
export default function FilesManager() {
  const [files, setFiles] = useState<KFile[]>(INITIAL_FILES)
  const [activeLocation, setActiveLocation] = useState<
    'kira' | 'local' | 'gdrive'
  >('kira')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [folderStack, setFolderStack] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    fileId: string
  } | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<
    { name: string; progress: number }[]
  >([])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [previewFile, setPreviewFile] = useState<KFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Breadcrumb
  const getBreadcrumb = (): string[] => {
    if (!currentFolder) return []
    const folder = files.find((f) => f.id === currentFolder)
    return folder ? [folder.name] : []
  }

  const navigateToFolder = (folderId: string) => {
    if (currentFolder) setFolderStack((prev) => [...prev, currentFolder])
    setCurrentFolder(folderId)
  }

  const navigateUp = () => {
    if (folderStack.length > 0) {
      const parent = folderStack[folderStack.length - 1]
      setFolderStack((prev) => prev.slice(0, -1))
      setCurrentFolder(parent === 'root' ? null : parent)
    } else {
      setCurrentFolder(null)
    }
  }

  // Filter files
  const filteredFiles = files.filter((f) => {
    const matchLoc = f.location === activeLocation
    const matchFolder = currentFolder
      ? f.parentId === currentFolder
      : f.parentId === null
    const matchSearch =
      search === '' || f.name.toLowerCase().includes(search.toLowerCase())
    return matchLoc && matchFolder && matchSearch
  })

  const starredFiles = files.filter((f) => f.starred)

  // Actions
  const toggleStar = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)),
    )
    setContextMenu(null)
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setContextMenu(null)
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    const folder: KFile = {
      id: uid(),
      name: newFolderName.trim(),
      type: 'folder',
      size: '--',
      updated: now(),
      starred: false,
      location: activeLocation,
      parentId: currentFolder,
    }
    setFiles((prev) => [...prev, folder])
    setNewFolderName('')
    setShowNewFolder(false)
  }

  const readThumbnail = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (ev) => resolve(ev.target?.result as string)
      reader.onerror = () => resolve(undefined)
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploaded = e.target.files
      if (!uploaded) return
      setShowUpload(true)
      const newUploads = Array.from(uploaded).map((file) => ({
        name: file.name,
        progress: 0,
      }))
      setUploadProgress(newUploads)

      Array.from(uploaded).forEach(async (file, idx) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        let type: KFile['type'] = 'other'
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext))
          type = 'image'
        else if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) type = 'video'
        else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) type = 'audio'
        else if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) type = 'doc'
        else if (['xls', 'xlsx', 'csv'].includes(ext)) type = 'spreadsheet'
        else if (
          [
            'js',
            'ts',
            'jsx',
            'tsx',
            'py',
            'html',
            'css',
            'json',
            'sql',
          ].includes(ext)
        )
          type = 'code'
        else if (['pdf'].includes(ext)) type = 'pdf'
        else if (['zip', 'rar', '7z', 'tar'].includes(ext)) type = 'archive'

        const sizeStr =
          file.size > 1024 * 1024
            ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
            : file.size > 1024
              ? (file.size / 1024).toFixed(0) + ' KB'
              : file.size + ' B'

        // Generate thumbnail for images
        let thumbnail: string | undefined = undefined
        if (type === 'image') {
          thumbnail = await readThumbnail(file)
        }

        // Simulate progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 30 + 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setFiles((prev) => [
              ...prev,
              {
                id: uid(),
                name: file.name,
                type,
                size: sizeStr,
                updated: now(),
                starred: false,
                location: activeLocation,
                parentId: currentFolder,
                thumbnail,
              },
            ])
            setTimeout(() => {
              setUploadProgress((prev) =>
                prev.filter((u) => u.name !== file.name),
              )
              if (idx === uploaded.length - 1)
                setTimeout(() => setShowUpload(false), 500)
            }, 400)
          }
          setUploadProgress((prev) =>
            prev.map((u, i) =>
              i === idx ? { ...u, progress: Math.min(progress, 100) } : u,
            ),
          )
        }, 200)
      })
      e.target.value = ''
    },
    [activeLocation, currentFolder],
  )

  // Storage stats
  const kiraSize = files
    .filter((f) => f.location === 'kira')
    .reduce((s, f) => {
      const n = parseFloat(f.size)
      if (f.size.includes('MB')) return s + n
      if (f.size.includes('KB')) return s + n / 1024
      return s
    }, 0)

  return (
    <div className="flex h-full">
      {/* ═════ SIDEBAR ═════ */}
      <div className="w-[220px] min-w-[220px] flex-shrink-0 border-r border-gray-100 bg-white flex flex-col">
        <div className="px-4 pt-6 pb-3">
          <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#4F46E5]" />
            My Files
          </h2>
        </div>

        <div className="px-3 pb-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#2a2a3e] transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {/* Kira Cloud */}
          <button
            onClick={() => {
              setActiveLocation('kira')
              setCurrentFolder(null)
              setFolderStack([])
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
              activeLocation === 'kira' && !currentFolder
                ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Cloud className="w-4 h-4" /> Kira Cloud
          </button>

          {/* Local Storage */}
          <button
            onClick={() => {
              setActiveLocation('local')
              setCurrentFolder(null)
              setFolderStack([])
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
              activeLocation === 'local'
                ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Local Storage
          </button>

          {/* Google Drive */}
          <button
            onClick={() => {
              setActiveLocation('gdrive')
              setCurrentFolder(null)
              setFolderStack([])
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
              activeLocation === 'gdrive'
                ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <polygon points="12,2 20,7 12,12 4,7" fill="#0066DA" />
              <polygon points="4,7 12,12 12,17 4,12" fill="#00AC47" />
              <polygon points="12,12 20,7 20,12 12,17" fill="#FFBA00" />
              <polygon points="4,12 12,17 12,20 4,15" fill="#00832D" />
              <polygon points="12,17 20,12 20,15 12,20" fill="#2684FC" />
            </svg>
            Google Drive
          </button>

          <div className="my-2 border-t border-gray-100" />

          {/* Quick Access */}
          <p className="px-3 py-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Quick Access
          </p>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-gray-600 hover:bg-gray-50 transition-all">
            <Star className="w-4 h-4 text-amber-400" /> Starred{' '}
            <span className="ml-auto text-[10px] text-gray-400">
              {starredFiles.length}
            </span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-gray-600 hover:bg-gray-50 transition-all">
            <Trash2 className="w-4 h-4 text-gray-400" /> Trash
          </button>
        </div>

        {/* Storage Meter */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-gray-500 font-medium">
              Kira Cloud
            </span>
            <span className="text-[10px] text-gray-400">
              {kiraSize.toFixed(1)} MB / 5 GB
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all"
              style={{ width: `${Math.min((kiraSize / 5120) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] text-emerald-600">
              Encrypted & Secure
            </span>
          </div>
        </div>
      </div>

      {/* ═════ MAIN AREA ═════ */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
              {currentFolder && (
                <button
                  onClick={navigateUp}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-[13px] font-semibold text-[#111827]">
                {activeLocation === 'kira'
                  ? 'Kira Cloud'
                  : activeLocation === 'local'
                    ? 'Local Storage'
                    : 'Google Drive'}
              </span>
              {getBreadcrumb().map((name, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  <span className="text-[13px] text-gray-600">{name}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] w-[180px] transition-all"
              />
            </div>

            {/* New Folder */}
            <button
              onClick={() => setShowNewFolder(true)}
              className="p-2 text-gray-500 transition-colors rounded-xl hover:bg-gray-100"
              title="New Folder"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#111827]' : 'text-gray-400'}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#111827]' : 'text-gray-400'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {showUpload && uploadProgress.length > 0 && (
          <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 bg-blue-50/50">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#4F46E5] animate-spin" />
              <span className="text-[12px] font-medium text-[#111827]">
                Uploading {uploadProgress.length} file(s)
              </span>
            </div>
            {uploadProgress.map((u, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-gray-500 flex-1 truncate">
                  {u.name}
                </span>
                <div className="w-[120px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4F46E5] rounded-full transition-all"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 w-8 text-right">
                  {Math.round(u.progress)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* New Folder Input */}
        {showNewFolder && (
          <div className="flex items-center flex-shrink-0 gap-2 px-6 py-3 border-b border-gray-100 bg-amber-50/50">
            <Folder className="w-4 h-4 text-amber-500" />
            <input
              autoFocus
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30"
            />
            <button
              onClick={createFolder}
              className="p-1.5 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338ca] transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setShowNewFolder(false)
                setNewFolderName('')
              }}
              className="p-1.5 rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Files Grid/List */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="overflow-hidden transition-all bg-white border border-gray-100 cursor-pointer group rounded-xl hover:border-gray-200 hover:shadow-md"
                  onClick={() => file.type !== 'folder' && setPreviewFile(file)}
                  onDoubleClick={() =>
                    file.type === 'folder' && navigateToFolder(file.id)
                  }
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      fileId: file.id,
                    })
                  }}
                >
                  {/* Thumbnail Area */}
                  <div
                    className={`h-[110px] flex items-center justify-center ${BG_COLORS[file.type]} relative overflow-hidden`}
                  >
                    {file.type === 'folder' ? (
                      <FolderOpen className="w-12 h-12 transition-transform text-amber-400/80 group-hover:scale-110" />
                    ) : file.thumbnail && file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : file.type === 'image' ? (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100">
                        <Image className="w-10 h-10 text-emerald-400/60" />
                      </div>
                    ) : file.type === 'video' ? (
                      <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-red-100 to-rose-100">
                        <Video className="w-10 h-10 text-red-400/60" />
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white/80">
                            <Play className="w-5 h-5 text-red-500 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : file.type === 'audio' ? (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-100 to-purple-100">
                        <Music className="w-10 h-10 text-violet-400/60" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center transition-transform shadow-sm w-14 h-14 rounded-xl bg-white/80 group-hover:scale-105">
                        {FILE_ICON[file.type]}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 transition-colors bg-black/0 group-hover:bg-black/5" />
                    {/* Star badge on thumbnail */}
                    {file.starred && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-sm" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-medium text-[#111827] truncate flex-1">
                        {file.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(file.id)
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-100"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${file.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {file.size}
                      </span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">
                        {file.updated}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer group"
                  onClick={() => file.type !== 'folder' && setPreviewFile(file)}
                  onDoubleClick={() =>
                    file.type === 'folder' && navigateToFolder(file.id)
                  }
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      fileId: file.id,
                    })
                  }}
                >
                  {/* List thumbnail */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${BG_COLORS[file.type]} overflow-hidden flex-shrink-0`}
                  >
                    {file.thumbnail && file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      FILE_ICON[file.type]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#111827] truncate">
                      {file.name}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 w-16 text-right flex-shrink-0">
                    {file.size}
                  </span>
                  <span className="text-[11px] text-gray-400 w-24 text-right flex-shrink-0">
                    {file.updated}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(file.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-0.5 rounded hover:bg-gray-100"
                  >
                    <Star
                      className={`w-4 h-4 ${file.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        fileId: file.id,
                      })
                    }}
                    className="flex-shrink-0 p-1 transition-opacity rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gray-50">
                <FolderOpen className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[14px] font-medium text-gray-500">
                No files here
              </p>
              <p className="text-[12px] text-gray-400 mt-1">
                Upload files or create a folder to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═════ Preview Panel ═════ */}
      {previewFile && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          />
          <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-[12px] font-semibold text-gray-500">
                    Preview
                  </span>
                </div>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Area */}
              <div className="mb-5 overflow-hidden border border-gray-100 rounded-2xl bg-gray-50">
                {previewFile.thumbnail && previewFile.type === 'image' ? (
                  <img
                    src={previewFile.thumbnail}
                    alt={previewFile.name}
                    className="w-full h-[200px] object-contain"
                  />
                ) : previewFile.type === 'image' ? (
                  <div className="h-[200px] bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <Image className="w-16 h-16 text-emerald-400/40" />
                  </div>
                ) : previewFile.type === 'video' ? (
                  <div className="h-[200px] bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center relative">
                    <Video className="w-16 h-16 text-red-400/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center justify-center rounded-full shadow-lg w-14 h-14 bg-white/80">
                        <Play className="w-7 h-7 text-red-500 ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : previewFile.type === 'audio' ? (
                  <div className="h-[160px] bg-gradient-to-br from-violet-100 to-purple-100 flex flex-col items-center justify-center gap-3">
                    <Music className="w-16 h-16 text-violet-400/40" />
                    <div className="flex items-center gap-2 px-4">
                      <button className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow">
                        <Play className="w-4 h-4 text-violet-500 ml-0.5" />
                      </button>
                      <div className="w-32 h-1 overflow-hidden rounded-full bg-white/50">
                        <div className="w-1/3 h-full rounded-full bg-violet-400" />
                      </div>
                      <span className="text-[10px] text-violet-400">1:24</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-[160px] flex items-center justify-center ${BG_COLORS[previewFile.type]}`}
                  >
                    <div className="flex items-center justify-center w-20 h-20 bg-white shadow-md rounded-2xl">
                      {React.cloneElement(
                        FILE_ICON[previewFile.type] as React.ReactElement<{
                          className: string
                        }>,
                        { className: 'w-10 h-10' },
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* File Info */}
              <h3 className="text-[16px] font-bold text-[#111827] mb-1">
                {previewFile.name}
              </h3>
              <div className="flex items-center gap-2 mb-5">
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-500 font-medium uppercase">
                  {previewFile.type}
                </span>
                <span className="text-[11px] text-gray-400">
                  {previewFile.size}
                </span>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-400">Location</span>
                  <span className="text-[#111827] font-medium">
                    {previewFile.location === 'kira'
                      ? 'Kira Cloud'
                      : previewFile.location === 'local'
                        ? 'Local Storage'
                        : 'Google Drive'}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-400">Modified</span>
                  <span className="text-[#111827]">{previewFile.updated}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-400">Size</span>
                  <span className="text-[#111827]">{previewFile.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button className="w-full py-2.5 rounded-xl bg-[#111827] text-white text-[12px] font-semibold hover:bg-[#2a2a3e] transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStar(previewFile.id)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Star
                      className={`w-4 h-4 ${previewFile.starred ? 'text-amber-400 fill-amber-400' : ''}`}
                    />
                    {previewFile.starred ? 'Starred' : 'Star'}
                  </button>
                  <button
                    onClick={() => {
                      deleteFile(previewFile.id)
                      setPreviewFile(null)
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-100 text-[12px] font-semibold text-red-500 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═════ Context Menu ═════ */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => toggleStar(contextMenu.fileId)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />{' '}
              {files.find((f) => f.id === contextMenu.fileId)?.starred
                ? 'Unstar'
                : 'Star'}
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-gray-400" /> Download
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
              <Copy className="w-3.5 h-3.5 text-gray-400" /> Copy
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
              <Move className="w-3.5 h-3.5 text-gray-400" /> Move
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="w-3.5 h-3.5 text-gray-400" /> Rename
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={() => deleteFile(contextMenu.fileId)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
