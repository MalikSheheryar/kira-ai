# Beeda AI for macOS

## Installation Instructions

### Option 1: Using Electron (Recommended)

1. **Install Electron globally:**
   ```bash
   npm install -g electron
   ```

2. **Run the app:**
   ```bash
   cd beeda-ai-mac
   electron electron/main.js
   ```

### Option 2: Using the Web Version

1. **Open `dist/index.html` in your browser:**
   - Double-click `dist/index.html`
   - Or drag it to your browser

### Option 3: Build Native macOS App

If you have Node.js installed, you can build a native macOS app:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the macOS app:**
   ```bash
   npm run electron:build:mac
   ```

3. **Find the installer in `release/` folder:**
   - `Beeda AI-1.0.0.dmg` - Drag to Applications folder
   - `Beeda AI-1.0.0.zip` - Extract and run

## Features

- 🤖 AI-powered automation workflows
- 💬 Chat with AI agents
- 📧 Email automation
- 🎨 Image & video generation
- 📝 AI writing assistant
- 🎙️ Voice commands
- 📱 WhatsApp & Telegram integration
- 🔗 API integrations
- 📊 Analytics & insights

## System Requirements

- macOS 10.15 (Catalina) or later
- Intel or Apple Silicon Mac
- 4GB RAM minimum
- Internet connection for AI features

## Support

For support, visit: https://beeda.ai/support
