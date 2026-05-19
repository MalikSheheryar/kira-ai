# Building Beeda AI Desktop App

This guide explains how to package Beeda AI as a desktop application for Windows, macOS, and Linux.

---

## 📦 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

For macOS builds on non-Mac machines:
- Docker (for cross-compilation)

For Windows builds on macOS/Linux:
- Wine (optional, for icon generation)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Web App

```bash
npm run build
```

### 3. Build Desktop App

#### Windows
```bash
npm run electron:build:win
```

#### macOS
```bash
npm run electron:build:mac
```

#### Linux
```bash
npm run electron:build:linux
```

#### All Platforms
```bash
npm run electron:build
```

---

## 📁 Output Locations

After building, you'll find the installers in:

```
release/
├── win-unpacked/           # Windows portable
├── Beeda AI Setup 1.0.0.exe # Windows installer
├── Beeda AI-1.0.0.dmg       # macOS installer
├── Beeda AI-1.0.0.zip       # macOS portable
└── Beeda AI-1.0.0.AppImage  # Linux portable
```

---

## 🖼️ Custom Icons

### Generate Icons

Place your source icon (1024x1024 PNG) in `build/` directory:

```bash
# macOS icon
sips -z 1024 1024 icon.png --out icon.icns

# Windows icon
# Use an online converter or ImageMagick
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Linux icon
# PNG works directly, no conversion needed
cp icon.png build/icon.png
```

### Icon Files Needed

```
build/
├── icon.png       # 1024x1024 (Linux, fallback)
├── icon.ico       # 256x256 (Windows)
└── icon.icns      # 1024x1024 (macOS)
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### Feature Flags

Edit `src/config.ts` to enable/disable features:

```typescript
export const config = {
  enableVoice: true,
  enableImageGeneration: true,
  enableN8N: true,
  enableWhatsApp: true,
  enableTelegram: true,
}
```

---

## 🔧 Advanced Build Options

### Code Signing

#### macOS
```bash
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password
npm run electron:build:mac
```

#### Windows
```bash
export WIN_CSC_LINK=/path/to/certificate.p12
export WIN_CSC_KEY_PASSWORD=your_password
npm run electron:build:win
```

### Auto-Updater

Enable auto-updates by configuring `electron-builder`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "kira-ai"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Build Fails

1. **Clear cache**
```bash
rm -rf node_modules dist release
npm install
npm run build
```

2. **Check Node version**
```bash
node --version  # Should be 18+
```

3. **Install native dependencies**
```bash
npm run postinstall
```

### Icons Not Showing

Ensure icons are in `build/` directory before building:
```bash
ls -la build/
# Should show: icon.png, icon.ico, icon.icns
```

### Windows Build on macOS/Linux

Use Docker:
```bash
docker run --rm -ti \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -v ${PWD}:/project \
  -v ${PWD##*/}-node-modules:/project/node_modules \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  /bin/bash -c "npm install && npm run electron:build:win"
```

---

## 📱 Platform-Specific Notes

### Windows

- **NSIS Installer**: Creates a setup wizard
- **Portable**: Single .exe file, no installation needed
- **Requirements**: Windows 10/11 (64-bit)

### macOS

- **DMG**: Standard macOS disk image installer
- **ZIP**: Portable version
- **Requirements**: macOS 10.15+ (Intel & Apple Silicon)
- **Notarization**: Required for distribution outside App Store

### Linux

- **AppImage**: Universal portable format
- **DEB**: Debian/Ubuntu package
- **RPM**: Red Hat/Fedora package
- **Requirements**: Ubuntu 18.04+, Fedora 30+, or equivalent

---

## 🔄 Development Mode

Run the desktop app in development mode:

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Electron
npm run electron
```

Or combined:
```bash
npm run electron:dev
```

---

## 📦 Distribution

### GitHub Releases

1. Create a new release on GitHub
2. Upload build artifacts:
   - `Beeda AI Setup X.X.X.exe` (Windows)
   - `Beeda AI-X.X.X.dmg` (macOS)
   - `Beeda AI-X.X.X.AppImage` (Linux)

### Direct Download

Host files on your website:
```html
<a href="/download/Beeda AI Setup 1.0.0.exe">Download for Windows</a>
<a href="/download/Beeda AI-1.0.0.dmg">Download for macOS</a>
<a href="/download/Beeda AI-1.0.0.AppImage">Download for Linux</a>
```

### App Stores

#### Windows Store
Package as MSIX and submit to Microsoft Store.

#### Mac App Store
Requires additional entitlements and sandboxing.

#### Linux Stores
- Snap Store
- FlatHub
- AppImageHub

---

## 🎯 Performance Optimization

### Reduce Bundle Size

```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune
```

### Enable Compression

Already enabled in `vite.config.ts`:
- Gzip compression
- Code splitting
- Tree shaking

---

## 🔒 Security

### Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### Context Isolation

Enable in `electron/main.js`:
```javascript
webPreferences: {
  contextIsolation: true,
  preload: path.join(__dirname, 'preload.js')
}
```

---

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Vite Plugin for Electron](https://github.com/electron-vite/electron-vite-react)

---

## 💬 Support

Having issues? Check:
1. [GitHub Issues](https://github.com/kira-ai/issues)
2. [Discord Community](https://discord.gg/kira-ai)
3. Email: support@kira.ai
