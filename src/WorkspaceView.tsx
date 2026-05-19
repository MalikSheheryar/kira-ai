/**
 * WorkspaceView.tsx
 * Complete 1-to-1 port of KiraWorkspace.jsx — every page, every component,
 * every element preserved. App.tsx colors applied via the light-mode t-object.
 *
 * Pages: home · recent · slides (full DeckEditor) · docs (rich editor)
 *        sheets (formula bar + sheet tabs) · designer (16 types + 12 posters)
 *        image (quick apps + gallery) · workflows (detail modal + run state)
 *        chat · drive (upload/delete) · teams (invite modal + role dropdown)
 *        notepad (search + pin + ask-kira) · video · music · clip
 *        coming-soon (claw / meeting)
 *
 * Global state: KiraContext — toasts · activity log · tasks · settings modals
 */
// @ts-nocheck
import React, { useState, useEffect, useRef, useContext, createContext } from 'react'

// ─── App.tsx design tokens ────────────────────────────────────────────────────
// These match App.tsx exactly: white cards, blue gradient buttons, Outfit font.
const APP_BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}
// The JSX uses a "t" theme-token object. We map it to App.tsx whites/grays
// for light mode. Dark mode preserved for the toggle button.
const TOKENS_LIGHT = {
  bg: '#f6f5f0',
  bgGrad: 'radial-gradient(ellipse at 20% 0%, #e6e2f0 0%, #f6f5f0 35%), radial-gradient(ellipse at 80% 100%, #f0e4ec 0%, #f6f5f0 40%)',
  text: '#0a0a0d', textDim: 'rgba(10,10,13,0.62)', textFaint: 'rgba(10,10,13,0.4)',
  panel: 'rgba(255,255,255,0.82)', panelStrong: 'rgba(255,255,255,0.96)', panelSolid: '#ffffff',
  border: 'rgba(10,10,13,0.08)', borderStrong: 'rgba(10,10,13,0.15)',
  hover: 'rgba(10,10,13,0.05)', sidebarBg: 'rgba(255,255,255,0.5)',
  accent: '#0a0a0d', accentBg: 'rgba(10,10,13,0.08)',
  cardBg: 'rgba(255,255,255,0.82)', chipBg: 'rgba(10,10,13,0.05)',
  chipActiveBg: '#0a0a0d', chipActiveText: '#ffffff',
}
const TOKENS_DARK = {
  bg: '#0a0a0d',
  bgGrad: 'radial-gradient(ellipse at 20% 0%, #1a1830 0%, #0a0a0d 35%), radial-gradient(ellipse at 80% 100%, #1f1230 0%, #0a0a0d 40%)',
  text: '#ffffff', textDim: 'rgba(255,255,255,0.55)', textFaint: 'rgba(255,255,255,0.35)',
  panel: 'rgba(28,28,36,0.55)', panelStrong: 'rgba(38,38,52,0.78)', panelSolid: '#1c1c24',
  border: 'rgba(255,255,255,0.08)', borderStrong: 'rgba(255,255,255,0.14)',
  hover: 'rgba(255,255,255,0.06)', sidebarBg: 'rgba(18,18,24,0.6)',
  accent: '#ffffff', accentBg: 'rgba(255,255,255,0.12)',
  cardBg: 'rgba(40,40,52,0.4)', chipBg: 'rgba(255,255,255,0.06)',
  chipActiveBg: '#ffffff', chipActiveText: '#0a0a0d',
}

// App.tsx header — matches DashboardView header exactly
function WorkspaceAppHeader({ t, k }: { t: typeof TOKENS_LIGHT; k: any }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:`1px solid ${t.border}`, background: t.panelStrong, backdropFilter:'blur(12px)', flexShrink:0, zIndex:10 }}>
      <div>
        <h1 style={{ fontSize:22, fontWeight:600, color:t.text, margin:0 }}>My Workspace</h1>
        <p style={{ fontSize:13, color:t.textDim, margin:'2px 0 0', fontWeight:300 }}>Your unified hub for files, docs, and AI tools</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={() => k?.openActivityLog()} style={{ display:'flex', alignItems:'center', gap:8, height:44, padding:'0 18px', background:t.panelSolid, border:`1px solid ${t.border}`, borderRadius:14, fontSize:14, fontWeight:500, color:t.text, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', cursor:'pointer', fontFamily:'inherit' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            Activity Log
          </button>
          <button onClick={() => k?.openNewTask()} style={{ display:'flex', alignItems:'center', gap:6, height:44, padding:'0 18px', borderRadius:14, fontSize:15, fontWeight:500, color:'#fff', border:'none', cursor:'pointer', fontFamily:'inherit', ...APP_BTN_BLUE }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Task
          </button>
        </div>
        <div style={{ width:1, height:30, background:t.border }} />
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button style={{ width:44, height:44, borderRadius:'50%', background:t.panelSolid, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.textDim} strokeWidth="1.7" strokeLinecap="round"><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
          </button>
          <button onClick={() => k?.openSettings()} style={{ width:44, height:44, borderRadius:'50%', background:t.panelSolid, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.textDim} strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
          </button>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#3b82f6)', overflow:'hidden', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
            <img src="/profile.png" alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={(e: any) => { e.target.style.display='none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Icon({ name, size = 20, fill }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: fill || 'none', stroke: 'currentColor', strokeWidth: 1.7,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'plus':         return <svg {...c}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case 'home':         return <svg {...c}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>;
    case 'slides':       return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="12" y1="5" x2="12" y2="19"/></svg>;
    case 'docs':         return <svg {...c}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="14 3 14 9 20 9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>;
    case 'designer':     return <svg {...c}><path d="M12 3l3 4-3 2-3-2zM5 9l3 4-3 2-3-2zM19 9l3 4-3 2-3-2zM12 14l3 4-3 2-3-2z"/></svg>;
    case 'image':        return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M21 17l-5-5-9 9"/></svg>;
    case 'workflow':     return <svg {...c}><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l3 9M16 7l-3 9"/></svg>;
    case 'claw':         return <svg {...c}><path d="M14 4c2 0 4 1.5 4 4-2 1-3 2-3 4 1 1 1 2 1 3-2 1-4 1-6 0-2-1-4-3-4-6 0-3 3-5 5-5 1-1 2-1 3 0z"/><circle cx="10" cy="12" r="1" fill="currentColor"/></svg>;
    case 'teams':        return <svg {...c}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5"/><path d="M14 19c0-2 1.5-3.5 3.5-3.5S21 19 21 19"/></svg>;
    case 'drive':        return <svg {...c}><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-8l-2-2H5a2 2 0 0 0-2 2z"/><path d="M12 11v6M9 14h6"/></svg>;
    case 'notepad':      return <svg {...c}><path d="M5 3h11l4 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><polyline points="15 3 15 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>;
    case 'clock':        return <svg {...c}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>;
    case 'bell':         return <svg {...c}><path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'pin':          return <svg {...c}><line x1="12" y1="17" x2="12" y2="22"/><path d="M9 4h6l1 8H8z"/><line x1="6" y1="12" x2="18" y2="12"/></svg>;
    case 'trash':        return <svg {...c}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
    case 'more':         return <svg {...c}><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>;
    case 'sidebar':      return <svg {...c}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="14" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
    case 'back':         return <svg {...c}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case 'mic':          return <svg {...c}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case 'speak':        return <svg {...c}><path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 12h2"/></svg>;
    case 'send':         return <svg {...c}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case 'edit':         return <svg {...c}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2 2 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case 'chev-down':    return <svg {...c}><polyline points="6 9 12 15 18 9"/></svg>;
    case 'chev-right':   return <svg {...c}><polyline points="9 18 15 12 9 6"/></svg>;
    case 'standard':     return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2"/></svg>;
    case 'professional': return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5V3h8v2"/></svg>;
    case 'creative':     return <svg {...c}><circle cx="13" cy="6" r="2.5"/><circle cx="6" cy="14" r="2.5"/><circle cx="18" cy="16" r="2.5"/><path d="M14 8l-6 4M14 8l5 6"/></svg>;
    case 'aspect':       return <svg {...c}><rect x="2" y="6" width="20" height="12" rx="1.5"/></svg>;
    case 'lightbulb':    return <svg {...c}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7L9 17h6l1-2.3A7 7 0 0 0 12 2z"/></svg>;
    case 'sun':          return <svg {...c}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>;
    case 'moon':         return <svg {...c}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case 'sparkle':      return <svg {...c}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></svg>;
    case 'search':       return <svg {...c}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>;
    case 'settings':     return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'camera':       return <svg {...c}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'style':        return <svg {...c}><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-1.7 0-3-1.3-3-3v-1c0-1.1-.9-2-2-2H5c-1.1 0-2-.9-2-2z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="11.5" cy="6.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>;
    case 'check':        return <svg {...c}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'eye':          return <svg {...c}><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'star':         return <svg {...c}><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"/></svg>;
    case 'x-twitter':    return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'gmail':        return <svg viewBox="0 0 24 24" width={size} height={size}><path fill="#4285F4" d="M22 6.5v11a2 2 0 0 1-2 2h-3V8.7l-5 3.6-5-3.6v10.8H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 3-1.7L12 9l7-4.2a2 2 0 0 1 3 1.7z"/><path fill="#34A853" d="M4 19.5h3V8.7l-5-3.6v12.4a2 2 0 0 0 2 2z"/><path fill="#FBBC04" d="M17 19.5h3a2 2 0 0 0 2-2V5.1l-5 3.6z"/><path fill="#EA4335" d="M2 6.5l5 3.6v-1.4l5 3.6 5-3.6v1.4l5-3.6a2 2 0 0 0-3-1.7L12 9 5 4.8a2 2 0 0 0-3 1.7z"/></svg>;
    case 'outlook':      return <svg viewBox="0 0 24 24" width={size} height={size}><rect x="1" y="5" width="14" height="14" rx="1.5" fill="#0078D4"/><text x="8" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill="white" fontFamily="Arial">O</text><rect x="14" y="7" width="9" height="10" fill="#0078D4" opacity="0.85"/><path d="M14 7l4.5 3 4.5-3" stroke="white" strokeWidth="0.5" fill="none"/></svg>;
    case 'drive-color':  return <svg viewBox="0 0 24 24" width={size} height={size}><path d="M8 3l-7 12 3 5 7-12z" fill="#0F9D58"/><path d="M16 3H8l8 14h7z" fill="#F4B400"/><path d="M4 20h13l4-5h-13z" fill="#4285F4"/></svg>;
    case 'sheets-color': return <svg viewBox="0 0 24 24" width={size} height={size}><rect x="4" y="3" width="16" height="18" rx="2" fill="#0F9D58"/><rect x="7" y="9" width="10" height="1.5" fill="white"/><rect x="7" y="12" width="10" height="1.5" fill="white"/><rect x="7" y="15" width="10" height="1.5" fill="white"/><line x1="12" y1="8" x2="12" y2="18" stroke="white" strokeWidth="0.7"/></svg>;
    case 'sheets':       return <svg {...c}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>;
    case 'code':         return <svg {...c}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case 'film':         return <svg {...c}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/><line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/></svg>;
    case 'podcast':      return <svg {...c}><line x1="6" y1="6" x2="6" y2="18"/><line x1="10" y1="3" x2="10" y2="21"/><line x1="14" y1="7" x2="14" y2="17"/><line x1="18" y1="10" x2="18" y2="14"/></svg>;
    case 'video':        return <svg {...c}><polygon points="22 8 22 16 16 12 22 8"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>;
    case 'audio':        return <svg {...c}><line x1="4" y1="10" x2="4" y2="14"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="20" y1="11" x2="20" y2="13"/></svg>;
    case 'music':        return <svg {...c}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'telescope':    return <svg {...c}><path d="M10 4 L2 11 l3 3 8-7z"/><path d="M13 7 L20 4 l1 3-7 3z"/><line x1="6" y1="14" x2="11" y2="19"/><line x1="11" y1="19" x2="11" y2="22"/><line x1="11" y1="22" x2="7" y2="22"/><line x1="11" y1="22" x2="15" y2="22"/></svg>;
    case 'check-shield': return <svg {...c}><path d="M12 2 L20 5 v6 c0 5 -4 9 -8 11 -4 -2 -8 -6 -8 -11 V5z"/><polyline points="9 12 11 14 15 10"/></svg>;
    case 'phone':        return <svg {...c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'cloud':        return <svg {...c}><path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.5-1.5A4 4 0 0 0 6 18z"/><polyline points="9 14 12 17 15 14"/></svg>;
    case 'inbox-spark':  return <svg {...c}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
    case 'arrow-left':   return <svg {...c}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case 'tabs':         return <svg {...c}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
    case 'x':            return <svg {...c}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    default:             return <svg {...c}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

function KiraLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#ffffff"/>
      <path d="M9 7 C 18 7 18 25 9 25 C 6 25 6 7 9 7 Z" fill="#2541F2"/>
      <path d="M19 7 C 19 7 24 7 24 14 C 24 18 21 18 19 18 C 19 18 19 14 19 11 Z" fill="#2541F2"/>
      <path d="M19 18 C 22 18 24 19 24 24 C 24 26 21 26 19 26 C 19 26 19 22 19 19 Z" fill="#2541F2"/>
      {[
        { x: 11, y: 13, r: 2.2 },
        { x: 14, y: 17, r: 3.0 },
        { x: 9.5, y: 20, r: 1.6 },
      ].map((s, i) => (
        <path key={i} d={`M ${s.x} ${s.y - s.r} Q ${s.x + s.r * 0.22} ${s.y - s.r * 0.22} ${s.x + s.r} ${s.y} Q ${s.x + s.r * 0.22} ${s.y + s.r * 0.22} ${s.x} ${s.y + s.r} Q ${s.x - s.r * 0.22} ${s.y + s.r * 0.22} ${s.x - s.r} ${s.y} Q ${s.x - s.r * 0.22} ${s.y - s.r * 0.22} ${s.x} ${s.y - s.r} Z`} fill="#ffffff"/>
      ))}
    </svg>
  );
}

// ============================================================
//  GLOBAL APP STATE — Context provider for toast, activity log,
//  tasks, settings, and modals. Lets every page emit notifications
//  and write to a shared activity history without prop drilling.
// ============================================================
const KiraContext = React.createContext(null);
const useKira = () => React.useContext(KiraContext);

function KiraProvider({ children, theme, setTheme }) {
  // === Toasts ===
  const [toasts, setToasts] = useState([]);
  const toast = (text, kind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, kind }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id));
    }, 3200);
  };

  // === Activity log ===
  const [activity, setActivity] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-activity');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 'seed-1', icon: 'sparkle', text: 'Welcome to Kira Workspace',          time: Date.now() - 3600000 * 6,  meta: 'Getting started' },
      { id: 'seed-2', icon: 'workflow', text: 'Workflow templates loaded',         time: Date.now() - 3600000 * 5,  meta: '9 ready to use' },
    ];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-activity', JSON.stringify(activity.slice(0, 100))); } catch {}
  }, [activity]);
  const log = (text, icon = 'sparkle', meta) => {
    setActivity(prev => [{ id: `a-${Date.now()}`, icon, text, time: Date.now(), meta }, ...prev].slice(0, 100));
  };
  const clearActivity = () => setActivity([]);

  // === Tasks ===
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-tasks');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);
  const addTask = (text, due) => {
    const task = { id: `t-${Date.now()}`, text, due: due || null, done: false, created: Date.now() };
    setTasks(prev => [task, ...prev]);
    log(`New task: ${text}`, 'check');
    toast(`Task added: ${text}`, 'success');
    return task;
  };
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // === Settings ===
  const [settings, setSettings] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-settings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { userName: 'Kobe', notifications: true, autoSave: true };
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  // === Modals ===
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const value = {
    toast, log, activity, clearActivity,
    tasks, addTask, toggleTask, deleteTask,
    settings, setSettings,
    theme, setTheme,
    openSettings: () => setSettingsOpen(true),
    openActivityLog: () => setActivityOpen(true),
    openNewTask: () => setNewTaskOpen(true),
  };

  return (
    <KiraContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts}/>
      {settingsOpen   && <SettingsModal    onClose={() => setSettingsOpen(false)}/>}
      {activityOpen   && <ActivityDrawer   onClose={() => setActivityOpen(false)}/>}
      {newTaskOpen    && <NewTaskModal     onClose={() => setNewTaskOpen(false)}/>}
    </KiraContext.Provider>
  );
}

// ============================================================
//  TOAST STACK — bottom-center notifications
// ============================================================
function ToastStack({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)',
      zIndex: 300, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {toasts.map(toastItem => {
        const colors = {
          success: { bg: '#16a34a', icon: 'check' },
          error:   { bg: '#dc2626', icon: 'x' },
          info:    { bg: '#0a0a0d', icon: 'sparkle' },
        };
        const c = colors[toastItem.kind] || colors.info;
        return (
          <div key={toastItem.id} style={{
            background: c.bg, color: '#fff',
            padding: '10px 18px', borderRadius: 24,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'fadeUp 0.25s ease-out',
            pointerEvents: 'auto',
            maxWidth: '90vw',
          }}>
            <Icon name={c.icon} size={14}/>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toastItem.text}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
//  SETTINGS MODAL
// ============================================================
function SettingsModal({ onClose }) {
  const k = useKira();
  const [name, setName] = useState(k.settings.userName);
  const [notifications, setNotifications] = useState(k.settings.notifications);
  const [autoSave, setAutoSave] = useState(k.settings.autoSave);

  const save = () => {
    k.setSettings({ ...k.settings, userName: name, notifications, autoSave });
    k.toast('Settings saved', 'success');
    onClose();
  };

  const clearAll = () => {
    if (!confirm('Clear all local data? This removes saved templates, workflows, notes, activity, and settings. This cannot be undone.')) return;
    ['kira-theme','kira-theme-v2','kira-my-templates','kira-my-workflows','kira-wf-state','kira-notes','kira-activity','kira-tasks','kira-settings','kira-uploads','kira-team','kira-images','kira-chat','kira-drive'].forEach(key => {
      try { window.localStorage?.removeItem(key); } catch {}
    });
    window.location.reload();
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Build a minimal theme tokens object inline — we don't have t in context, recompute
  const isDark = k.theme === 'dark';
  const T = {
    bg: isDark ? '#0a0a0d' : '#f6f5f0',
    text: isDark ? '#ffffff' : '#0a0a0d',
    textDim: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,13,0.62)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,13,0.1)',
    borderStrong: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(10,10,13,0.18)',
    panel: isDark ? 'rgba(38,38,52,0.92)' : 'rgba(255,255,255,0.95)',
    cardBg: isDark ? 'rgba(40,40,52,0.4)' : 'rgba(255,255,255,0.7)',
    hover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.05)',
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        zIndex: 200, animation: 'fadeUp 0.18s ease-out',
      }}/>
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(520px, 94vw)', maxHeight: '88vh',
        background: T.panel, color: T.text,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${T.borderStrong}`, borderRadius: 18,
        zIndex: 201, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.22s ease-out',
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, flex: 1 }}>Settings</h2>
          <button onClick={onClose} style={{
            background: T.hover, border: 'none', color: T.textDim,
            width: 30, height: 30, borderRadius: 15, cursor: 'pointer',
            fontSize: 16, fontFamily: 'inherit',
          }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {/* Profile */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Profile</div>
            <label style={{ fontSize: 13, color: T.textDim, display: 'block', marginBottom: 6 }}>Display name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                background: T.cardBg, border: `1px solid ${T.border}`,
                borderRadius: 9, color: T.text,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
              }}/>
          </div>

          {/* Theme */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Appearance</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['light','dark'].map(mode => (
                <button key={mode} onClick={() => k.setTheme(mode)} style={{
                  flex: 1, padding: '11px 14px', borderRadius: 10,
                  background: k.theme === mode ? T.text : 'transparent',
                  color: k.theme === mode ? T.bg : T.text,
                  border: `1px solid ${k.theme === mode ? T.text : T.border}`,
                  fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  textTransform: 'capitalize',
                }}>
                  <Icon name={mode === 'dark' ? 'moon' : 'sun'} size={14}/> {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Preferences</div>
            <SettingsToggle T={T} label="Notifications"  desc="Toast alerts when tasks finish" on={notifications} onChange={setNotifications}/>
            <SettingsToggle T={T} label="Auto-save"       desc="Save notes and edits automatically" on={autoSave} onChange={setAutoSave}/>
          </div>

          {/* Danger */}
          <div>
            <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>Data</div>
            <button onClick={clearAll} style={{
              width: '100%', padding: '10px 14px', borderRadius: 9,
              background: 'transparent', border: `1px solid ${T.border}`,
              color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="trash" size={13}/> Clear all local data
            </button>
          </div>
        </div>
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '9px 18px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${T.border}`,
            color: T.text, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
          }}>Cancel</button>
          <button onClick={save} style={{
            padding: '9px 18px', borderRadius: 10,
            background: T.text, color: T.bg, border: 'none',
            cursor: 'pointer', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
          }}>Save</button>
        </div>
      </div>
    </>
  );
}

function SettingsToggle({ T, label, desc, on, onChange }) {
  return (
    <div onClick={() => onChange(!on)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 12px', borderRadius: 10,
      background: T.cardBg, border: `1px solid ${T.border}`,
      cursor: 'pointer', marginBottom: 8,
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{label}</div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? '#16a34a' : T.border,
        position: 'relative', transition: 'background 0.18s ease',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2,
          left: on ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.18s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}/>
      </div>
    </div>
  );
}

// ============================================================
//  ACTIVITY LOG DRAWER (right side)
// ============================================================
function ActivityDrawer({ onClose }) {
  const k = useKira();
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isDark = k.theme === 'dark';
  const T = {
    bg: isDark ? '#0a0a0d' : '#f6f5f0',
    text: isDark ? '#ffffff' : '#0a0a0d',
    textDim: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,13,0.62)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,13,0.1)',
    borderStrong: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(10,10,13,0.18)',
    panel: isDark ? 'rgba(22,22,28,0.95)' : 'rgba(255,255,255,0.96)',
    cardBg: isDark ? 'rgba(40,40,52,0.4)' : 'rgba(255,255,255,0.7)',
    hover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.05)',
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  // Group by day
  const groups = {};
  k.activity.forEach(a => {
    const d = new Date(a.time);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    let label;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(a);
  });

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200, animation: 'fadeUp 0.18s ease-out',
      }}/>
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 400, maxWidth: '95vw',
        background: T.panel,
        backdropFilter: 'blur(30px) saturate(160%)',
        WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        borderLeft: `1px solid ${T.borderStrong}`,
        zIndex: 201, display: 'flex', flexDirection: 'column',
        boxShadow: '-12px 0 40px rgba(0,0,0,0.35)',
        animation: 'slideInRight 0.25s ease-out',
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text }}>Activity Log</h2>
            <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>
              {k.activity.length} event{k.activity.length === 1 ? '' : 's'}
            </div>
          </div>
          {k.activity.length > 0 && (
            <button onClick={k.clearActivity} title="Clear all" style={{
              background: 'transparent', border: 'none', color: T.textDim,
              cursor: 'pointer', padding: 6, marginRight: 4,
            }}>
              <Icon name="trash" size={14}/>
            </button>
          )}
          <button onClick={onClose} style={{
            background: T.hover, border: 'none', color: T.textDim,
            width: 30, height: 30, borderRadius: 15, cursor: 'pointer',
            fontSize: 16, fontFamily: 'inherit',
          }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px 22px' }}>
          {k.activity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: T.textDim }}>
              <Icon name="clock" size={32}/>
              <div style={{ marginTop: 14, fontSize: 14, fontWeight: 600, color: T.text }}>No activity yet</div>
              <div style={{ fontSize: 12.5, marginTop: 6 }}>Your actions across Kira appear here.</div>
            </div>
          ) : Object.entries(groups).map(([label, items]) => (
            <div key={label}>
              <div style={{
                fontSize: 10.5, color: T.textDim, fontFamily: 'monospace',
                letterSpacing: 0.5, textTransform: 'uppercase',
                padding: '14px 8px 8px',
              }}>{label}</div>
              {items.map(a => (
                <div key={a.id} style={{
                  display: 'flex', gap: 12, padding: '10px 10px', borderRadius: 9,
                  marginBottom: 2,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: T.cardBg, border: `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: T.text, flexShrink: 0,
                  }}>
                    <Icon name={a.icon} size={13}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text, lineHeight: 1.35 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: T.textDim, marginTop: 2, fontFamily: 'monospace' }}>
                      {formatTime(a.time)}{a.meta ? ` · ${a.meta}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

// ============================================================
//  NEW TASK MODAL
// ============================================================
function NewTaskModal({ onClose }) {
  const k = useKira();
  const [text, setText] = useState('');
  const [due, setDue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    if (!text.trim()) return;
    k.addTask(text.trim(), due || null);
    onClose();
  };

  const isDark = k.theme === 'dark';
  const T = {
    bg: isDark ? '#0a0a0d' : '#f6f5f0',
    text: isDark ? '#ffffff' : '#0a0a0d',
    textDim: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,13,0.62)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,13,0.1)',
    borderStrong: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(10,10,13,0.18)',
    panel: isDark ? 'rgba(38,38,52,0.92)' : 'rgba(255,255,255,0.95)',
    cardBg: isDark ? 'rgba(40,40,52,0.4)' : 'rgba(255,255,255,0.7)',
    hover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,10,13,0.05)',
  };

  const quickSuggestions = [
    'Reply to outstanding emails',
    'Review last quarter\'s numbers',
    'Brainstorm Q2 marketing ideas',
    'Schedule 1:1 with the team',
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        zIndex: 200, animation: 'fadeUp 0.18s ease-out',
      }}/>
      <div style={{
        position: 'fixed', top: '38%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(560px, 94vw)',
        background: T.panel, color: T.text,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${T.borderStrong}`, borderRadius: 18,
        zIndex: 201,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.22s ease-out',
        fontFamily: '"Inter Tight", sans-serif',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 22px 6px' }}>
          <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
            New task
          </div>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder="What do you want to get done?"
            style={{
              width: '100%', padding: '8px 0',
              background: 'transparent', border: 'none', outline: 'none',
              color: T.text, fontSize: 19, fontWeight: 600, fontFamily: 'inherit',
            }}/>
        </div>
        <div style={{ padding: '8px 22px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Today', 'Tomorrow', 'This week'].map(opt => (
            <button key={opt} onClick={() => setDue(opt)} style={{
              padding: '5px 12px', borderRadius: 16,
              background: due === opt ? T.text : 'transparent',
              color: due === opt ? T.bg : T.textDim,
              border: `1px solid ${due === opt ? T.text : T.border}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="clock" size={11}/> {opt}
            </button>
          ))}
        </div>
        {!text && (
          <div style={{ padding: '4px 22px 14px' }}>
            <div style={{ fontSize: 10.5, color: T.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Suggestions
            </div>
            {quickSuggestions.map((s, i) => (
              <button key={i} onClick={() => setText(s)} style={{
                width: '100%', textAlign: 'left',
                padding: '8px 10px', borderRadius: 8,
                background: 'transparent', border: 'none',
                color: T.text, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = T.hover}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <Icon name="sparkle" size={12}/> {s}
              </button>
            ))}
          </div>
        )}
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '8px 14px', borderRadius: 9,
            background: 'transparent', border: `1px solid ${T.border}`,
            color: T.text, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>Cancel</button>
          <button onClick={submit} disabled={!text.trim()} style={{
            padding: '8px 18px', borderRadius: 9,
            background: text.trim() ? '#2541F2' : T.border,
            color: text.trim() ? '#fff' : T.textDim,
            border: 'none', cursor: text.trim() ? 'pointer' : 'default',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          }}>Create</button>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  ROOT APP
// ============================================================
function KiraWorkspaceInner() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage?.getItem('kira-theme-v2');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });
  const [page, setPage] = useState('home');
  const [sidebarKey, setSidebarKey] = useState('home');

  const [myWorkflows, setMyWorkflows] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage?.getItem('kira-my-workflows');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-my-workflows', JSON.stringify(myWorkflows)); } catch {}
  }, [myWorkflows]);

  const [myTemplates, setMyTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage?.getItem('kira-my-templates');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-my-templates', JSON.stringify(myTemplates)); } catch {}
  }, [myTemplates]);

  const [myDecks, setMyDecks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage?.getItem('kira-my-decks');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-my-decks', JSON.stringify(myDecks)); } catch {}
  }, [myDecks]);

  useEffect(() => {
    try { window.localStorage?.setItem('kira-theme-v2', theme); } catch {}
  }, [theme]);

  const t = theme === 'dark'
    ? {
        bg: '#0a0a0d',
        bgGrad: 'radial-gradient(ellipse at 20% 0%, #1a1830 0%, #0a0a0d 35%), radial-gradient(ellipse at 80% 100%, #1f1230 0%, #0a0a0d 40%)',
        text: '#ffffff', textDim: 'rgba(255,255,255,0.55)', textFaint: 'rgba(255,255,255,0.35)',
        panel: 'rgba(28,28,36,0.55)', panelStrong: 'rgba(38,38,52,0.78)', panelSolid: '#1c1c24',
        border: 'rgba(255,255,255,0.08)', borderStrong: 'rgba(255,255,255,0.14)',
        hover: 'rgba(255,255,255,0.06)', sidebarBg: 'rgba(18,18,24,0.6)',
        accent: '#ffffff', accentBg: 'rgba(255,255,255,0.12)',
        cardBg: 'rgba(40,40,52,0.4)', chipBg: 'rgba(255,255,255,0.06)',
        chipActiveBg: '#ffffff', chipActiveText: '#0a0a0d',
      }
    : {
        bg: '#f6f5f0',
        bgGrad: 'radial-gradient(ellipse at 20% 0%, #e6e2f0 0%, #f6f5f0 35%), radial-gradient(ellipse at 80% 100%, #f0e4ec 0%, #f6f5f0 40%)',
        text: '#0a0a0d', textDim: 'rgba(10,10,13,0.62)', textFaint: 'rgba(10,10,13,0.4)',
        panel: 'rgba(255,255,255,0.55)', panelStrong: 'rgba(255,255,255,0.88)', panelSolid: '#ffffff',
        border: 'rgba(10,10,13,0.08)', borderStrong: 'rgba(10,10,13,0.15)',
        hover: 'rgba(10,10,13,0.05)', sidebarBg: 'rgba(255,255,255,0.7)',
        accent: '#0a0a0d', accentBg: 'rgba(10,10,13,0.08)',
        cardBg: 'rgba(255,255,255,0.7)', chipBg: 'rgba(10,10,13,0.05)',
        chipActiveBg: '#0a0a0d', chipActiveText: '#ffffff',
      };

  const sidebarToPage = {
    new: 'home', home: 'home', recent: 'recent', slides: 'slides', docs: 'docs',
    sheets: 'sheets', designer: 'designer', image: 'image', workflows: 'workflows',
    teams: 'teams', drive: 'drive', research: 'chat',
    notepad: 'notepad',
  };

  const goHome = () => { setPage('home'); setSidebarKey('home'); };

  return (
    <KiraProvider theme={theme} setTheme={setTheme}>
    <div style={{
      height: '100vh', background: 'url("/MainBG.png") center right / cover no-repeat',
      color: t.text, display: 'flex', position: 'relative', overflow: 'hidden',
      fontFamily: "'Outfit', system-ui, sans-serif",
    }}>
      {/* App.tsx gradient overlays */}
      <div style={{ position:'fixed', top:0, right:0, width:600, height:600, background:'radial-gradient(ellipse at top right, rgba(196,181,253,0.45) 0%, rgba(147,197,253,0.35) 40%, transparent 70%)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', top:0, right:0, width:400, height:400, background:'radial-gradient(ellipse at top right, rgba(216,180,254,0.4) 0%, rgba(186,230,253,0.3) 50%, transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      <Sidebar
        t={t} active={sidebarKey} theme={theme}
        onSelect={(k) => {
          setSidebarKey(k);
          setPage(sidebarToPage[k]);
        }}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <main style={{
        flex: 1, position: 'relative', zIndex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* App.tsx style header - bell / settings / profile */}
        <WorkspaceAppHeader t={t} k={useKira()}/>
        {page === 'home'      && <HomePage      t={t} theme={theme} onOpen={(p) => { setPage(p); setSidebarKey(p); }}/>}
        {page === 'recent'    && <RecentPage    t={t} theme={theme} onBack={goHome} onOpen={(p) => { setPage(p); setSidebarKey(p); }} myDecks={myDecks}/>}
        {page === 'slides'    && <SlidesPage    t={t} theme={theme} onBack={goHome} myTemplates={myTemplates} setMyTemplates={setMyTemplates} myDecks={myDecks} setMyDecks={setMyDecks}/>}
        {page === 'docs'      && <DocsPage      t={t} theme={theme} onBack={goHome}/>}
        {page === 'sheets'    && <SheetsPage    t={t} theme={theme} onBack={goHome}/>}
        {page === 'designer'  && <DesignerPage  t={t} theme={theme} onBack={goHome}/>}
        {page === 'image'     && <ImagePage     t={t} theme={theme} onBack={goHome}/>}
        {page === 'workflows' && <WorkflowsPage t={t} theme={theme} onBack={goHome} myWorkflows={myWorkflows} setMyWorkflows={setMyWorkflows}/>}
        {page === 'chat'      && <ChatPage      t={t} theme={theme} onBack={goHome}/>}
        {page === 'drive'     && <DrivePage     t={t} theme={theme} onBack={goHome}/>}
        {page === 'teams'     && <TeamsPage     t={t} theme={theme} onBack={goHome}/>}
        {page === 'notepad'   && <NotepadPage   t={t} theme={theme} onBack={goHome}/>}
        {page === 'video'     && <VideoPage     t={t} theme={theme} onBack={goHome}/>}
        {page === 'music'     && <MusicPage     t={t} theme={theme} onBack={goHome}/>}
        {page === 'clip'      && <ClipPage      t={t} theme={theme} onBack={goHome}/>}
        {(page === 'claw' || page === 'meeting') && (
          <ComingSoonPage t={t} theme={theme} page={page} onBack={goHome}/>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=Caveat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'}; border-radius: 4px; }
        @keyframes fadeUp   { from { opacity: 0; transform: translateY(8px); }  to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn  { from { opacity: 0; transform: scale(0.96); }      to { opacity: 1; transform: scale(1); } }
        @keyframes slideIn  { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse    { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
    </KiraProvider>
  );
}

// ============================================================
//  SIDEBAR
// ============================================================
function Sidebar({ t, active, onSelect, theme, onThemeToggle }) {
  const items = [
    { key: 'home',      label: 'Home',        icon: 'home' },
    { key: 'recent',    label: 'Recent',      icon: 'clock' },
    { key: 'slides',    label: 'AI Slides',   icon: 'slides' },
    { key: 'docs',      label: 'AI Docs',     icon: 'docs' },
    { key: 'sheets',    label: 'AI Sheets',   icon: 'sheets-color' },
    { key: 'designer',  label: 'Designer',    icon: 'designer' },
    { key: 'image',     label: 'AI Image Generator', icon: 'image' },
    { key: 'workflows', label: 'Workflows',   icon: 'workflow' },
    { key: 'teams',     label: 'Teams',       icon: 'teams' },
    { key: 'research',  label: 'Deep Research', icon: 'telescope' },
    { key: 'drive',     label: 'Kira Cloud',  icon: 'cloud' },
    { key: 'notepad',   label: 'Notepad',     icon: 'notepad' },
  ];

  const ACTIVE_BG = 'radial-gradient(circle, rgba(229,238,255,0.9) 0%, rgba(255,255,255,0.7) 60%, transparent 100%)';
  const BTN_BLUE_STYLE = { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF' };

  return (
    <aside style={{
      width: 220, minWidth: 220, flexShrink: 0, height: '100vh',
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRight: '1px solid rgba(17,24,39,0.08)',
      display: 'flex', flexDirection: 'column',
      padding: '18px 10px', gap: 2, zIndex: 20, position: 'relative',
    }}>
      {/* Brand row matching App.tsx */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 12px 14px', borderBottom:'1px solid rgba(17,24,39,0.07)', marginBottom:8 }}>
        <div style={{ width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, ...BTN_BLUE_STYLE }}>
          <KiraLogo size={18}/>
        </div>
        <span style={{ fontSize:14, fontWeight:700, color:'#111827' }}>Workspace</span>
      </div>

      <div style={{ flex:1, overflowY:'auto' }}>
      {items.map(item => {
        const isActive = active === item.key;
        return (
          <button key={item.key} onClick={() => onSelect(item.key)}
            style={{
              width: '100%', padding: '10px 12px',
              background: isActive ? ACTIVE_BG : 'transparent',
              border: 'none', borderRadius: 12,
              color: isActive ? '#4f46e5' : '#696D7D',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.18s ease', fontSize: 13, fontWeight: isActive ? 600 : 400,
              fontFamily: "'Outfit', system-ui, sans-serif",
              textAlign: 'left', position: 'relative', overflow: 'hidden',
              marginBottom: 2,
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(10,10,13,0.05)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            {isActive && (
              <>
                <div style={{ position:'absolute', width:75, height:75, borderRadius:'50%', right:-20, top:-6, background:'#22D3EE', opacity:0.8, filter:'blur(24px)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', width:80, height:80, borderRadius:'50%', right:-30, top:-29, background:'#60A5FA', opacity:0.6, filter:'blur(24px)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', width:60, height:60, borderRadius:'50%', right:-50, top:-35, background:'#A855F7', opacity:1, filter:'blur(15px)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', width:146, height:47, borderRadius:'50%', left:-87, top:39, background:'#A855F7', opacity:1, filter:'blur(15px)', pointerEvents:'none' }}/>
              </>
            )}
            <div style={{ position:'relative', zIndex:1, flexShrink:0 }}><Icon name={item.icon} size={15}/></div>
            <span style={{ position:'relative', zIndex:1, flex:1, textAlign:'left' }}>{item.label}</span>
          </button>
        );
      })}
      </div>

      {/* Bottom: theme toggle */}
      <div style={{ borderTop:'1px solid rgba(17,24,39,0.07)', paddingTop:8, marginTop:4 }}>
        <button onClick={onThemeToggle}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{
            width:'100%', padding:'10px 12px',
            background:'transparent', border:'none', borderRadius:12,
            color:'#696D7D', cursor:'pointer',
            display:'flex', alignItems:'center', gap:10,
            transition:'all 0.18s ease', fontSize:13, fontWeight:400,
            fontFamily:"'Outfit', system-ui, sans-serif",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background='rgba(10,10,13,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background='transparent'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15}/>
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  );
}

// ============================================================
//  TOP BAR
// ============================================================
function TopBar({ t, title, breadcrumbs, activeBreadcrumb, onBreadcrumb, onBack, onEditAction, greeting, userName, subtitle, pageTitle, onNewTask, onActivityLog }) {
  const [editOpen, setEditOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const k = useKira();
  // Fallback to context actions so every page gets working buttons out of the box
  const handleNewTask     = onNewTask     || (() => k?.openNewTask());
  const handleActivityLog = onActivityLog || (() => k?.openActivityLog());
  const handleSettings    = () => k?.openSettings();
  const displayName       = userName || k?.settings?.userName || 'Kobe';

  // Compute greeting from current time if not explicitly provided
  const computedGreeting = (() => {
    if (greeting) return greeting;
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  })();

  // "Home style" = right-side actions visible (avatar, bell, etc.)
  // Triggered by either a userName (greeting) or a pageTitle (named page).
  const isHomeStyle = !!userName || !!pageTitle;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: isHomeStyle ? '16px 26px' : '14px 22px',
      borderBottom: `1px solid ${t.border}`, gap: 10,
      background: t.panel,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      position: 'relative',
    }}>
      {/* ===== HOME STYLE: page title or greeting on the left ===== */}
      {isHomeStyle ? (
        pageTitle ? (
          // Named page: show only the page title, no subtitle
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em',
              color: t.text, lineHeight: 1.2,
            }}>{pageTitle}</div>
          </div>
        ) : (
          // Home page: friendly greeting
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 19, fontWeight: 700, letterSpacing: '-0.015em',
              color: t.text, lineHeight: 1.2,
            }}>{computedGreeting}, {displayName}!</div>
            <div style={{ fontSize: 12.5, color: t.textDim, marginTop: 2 }}>
              {subtitle || 'Nice to see you again.'}
            </div>
          </div>
        )
      ) : (
        <>
          {/* ===== STANDARD PAGE: back + sidebar buttons ===== */}
          <button onClick={onBack} title="Back" style={topBtn(t)}
            onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="back" size={17}/>
          </button>
          <button onClick={onBack} title="Sidebar" style={topBtn(t)}
            onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="sidebar" size={17}/>
          </button>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <div style={{ display: 'flex', gap: 18, marginLeft: 8 }}>
              {breadcrumbs.map((b, i) => {
                const isActive = activeBreadcrumb ? activeBreadcrumb === b : i === 0;
                return (
                  <button key={b}
                    onClick={() => onBreadcrumb && onBreadcrumb(b)}
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: isActive ? t.text : t.textDim, fontSize: 13, fontWeight: 500,
                      padding: '4px 0', fontFamily: 'inherit',
                      borderBottom: isActive ? `2px solid ${t.text}` : '2px solid transparent',
                      transition: 'all 0.15s ease',
                    }}>{b}</button>
                );
              })}
            </div>
          )}

          {title && (
            <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: 14.5, fontWeight: 600, color: t.text }}>{title}</h1>
          )}
          {!title && <div style={{ flex: 1 }}/>}
        </>
      )}

      {/* ===== RIGHT SIDE ===== */}
      {isHomeStyle ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Activity Log pill */}
          <button onClick={handleActivityLog}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 20,
              background: t.cardBg, color: t.text,
              border: `1px solid ${t.border}`,
              cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = t.cardBg}>
            <Icon name="clock" size={14}/>
            Activity Log
          </button>

          {/* Bell with notification dot */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setBellOpen(!bellOpen)}
              title="Notifications"
              style={{
                width: 36, height: 36, borderRadius: 18,
                background: t.cardBg, border: `1px solid ${t.border}`,
                color: t.text, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
              onMouseLeave={(e) => e.currentTarget.style.background = t.cardBg}>
              <Icon name="bell" size={15}/>
              {(k?.activity || []).some(a => Date.now() - a.time < 300000) && (
                <span style={{
                  position: 'absolute', top: 7, right: 8,
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#ef4444', border: `1.5px solid ${t.panel}`,
                }}/>
              )}
            </button>
            {bellOpen && (
              <>
                <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 28 }}/>
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: 340,
                  background: t.panelStrong, backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: `1px solid ${t.borderStrong}`, borderRadius: 14,
                  padding: 8, zIndex: 30,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                  animation: 'fadeUp 0.18s ease-out',
                  maxHeight: 460, overflowY: 'auto',
                }}>
                  <div style={{
                    padding: '8px 12px 10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Notifications</div>
                    {k?.activity?.length > 0 && (
                      <button onClick={() => { k?.openActivityLog(); setBellOpen(false); }}
                        style={{
                          fontSize: 11, color: t.textDim,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}>
                        See all
                      </button>
                    )}
                  </div>
                  {(k?.activity || []).slice(0, 6).map(a => {
                    const diff = Date.now() - a.time;
                    const ago = diff < 60000 ? 'Just now'
                      : diff < 3600000 ? `${Math.floor(diff / 60000)}m ago`
                      : diff < 86400000 ? `${Math.floor(diff / 3600000)}h ago`
                      : `${Math.floor(diff / 86400000)}d ago`;
                    return (
                      <div key={a.id} style={{
                        padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: t.cardBg, border: `1px solid ${t.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: t.text, flexShrink: 0,
                        }}>
                          <Icon name={a.icon} size={11}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: t.text, lineHeight: 1.35 }}>{a.text}</div>
                          <div style={{ fontSize: 11, color: t.textDim, marginTop: 2, fontFamily: 'monospace' }}>{ago}</div>
                        </div>
                      </div>
                    );
                  })}
                  {(!k?.activity || k.activity.length === 0) && (
                    <div style={{ padding: 24, textAlign: 'center', color: t.textDim, fontSize: 12.5 }}>
                      All caught up.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button onClick={handleSettings}
            title="Settings"
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: t.cardBg, border: `1px solid ${t.border}`,
              color: t.text, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = t.cardBg}>
            <Icon name="settings" size={15}/>
          </button>

          {/* Avatar — flat illustrated portrait */}
          <button title={displayName} onClick={handleSettings} style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(160deg, #fed7aa 0%, #fdba74 100%)',
            border: `2px solid ${t.panel}`,
            cursor: 'pointer', padding: 0, overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="38" height="38" viewBox="0 0 38 38">
              {/* Background warm peach */}
              <rect width="38" height="38" fill="url(#avBg)"/>
              <defs>
                <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fde2c4"/>
                  <stop offset="1" stopColor="#fbc18a"/>
                </linearGradient>
              </defs>
              {/* Hair back */}
              <path d="M5 24 Q 5 8 19 8 Q 33 8 33 24 L 33 38 L 5 38 Z" fill="#5a3a26"/>
              {/* Face */}
              <ellipse cx="19" cy="20" rx="9.5" ry="11" fill="#f5d0a9"/>
              {/* Hair fringe */}
              <path d="M9 16 Q 12 10 19 10 Q 26 10 29 16 Q 24 13 19 14 Q 14 13 9 16 Z" fill="#5a3a26"/>
              {/* Eyes */}
              <ellipse cx="15.5" cy="19" rx="1.1" ry="1.3" fill="#2d1810"/>
              <ellipse cx="22.5" cy="19" rx="1.1" ry="1.3" fill="#2d1810"/>
              {/* Cheeks */}
              <circle cx="14" cy="22.5" r="1.2" fill="#f4a896" opacity="0.6"/>
              <circle cx="24" cy="22.5" r="1.2" fill="#f4a896" opacity="0.6"/>
              {/* Smile */}
              <path d="M16.5 24.5 Q 19 26 21.5 24.5" stroke="#a8624a" strokeWidth="1" fill="none" strokeLinecap="round"/>
              {/* Hair side strands */}
              <path d="M9 18 Q 8 26 11 32 L 11 38 L 7 38 Q 5 32 5 26 Z" fill="#4a2f1f"/>
              <path d="M29 18 Q 30 26 27 32 L 27 38 L 31 38 Q 33 32 33 26 Z" fill="#4a2f1f"/>
              {/* Shirt collar hint */}
              <path d="M10 36 Q 19 32 28 36 L 28 38 L 10 38 Z" fill="#1a1a22"/>
            </svg>
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <button onClick={() => onEditAction ? onEditAction() : setEditOpen(!editOpen)} style={topBtn(t)}><Icon name="edit" size={16}/></button>
          {editOpen && !onEditAction && (
            <>
              <div onClick={() => setEditOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 28 }}/>
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 6,
                background: t.panelStrong, backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${t.borderStrong}`, borderRadius: 12,
                padding: 6, minWidth: 180, zIndex: 30,
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                animation: 'fadeUp 0.18s ease-out',
              }}>
                {['Rename', 'Duplicate', 'Share', 'Export', 'Delete'].map(item => (
                  <button key={item} onClick={() => { k?.toast(`${item} — coming soon`, 'info'); setEditOpen(false); }}
                    style={{
                      width: '100%', textAlign: 'left',
                      background: 'transparent', border: 'none',
                      color: item === 'Delete' ? '#ef4444' : t.text,
                      padding: '8px 11px', borderRadius: 7,
                      cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >{item}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
const topBtn = (t) => ({
  width: 32, height: 32, borderRadius: 8,
  background: 'transparent', border: 'none', color: t.text,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
});

// ============================================================
//  TEMPLATE CONTENT LIBRARY
//  Real demo content for every template kind. Indexed [kind][i].
//  This is what makes clicked template cards show actual content
//  instead of a "coming soon" stub.
// ============================================================
const TEMPLATE_CONTENT = {
  slide: [
    { title: 'Q4 Business Review',  accent: '#3b82f6', tag: 'Pitch',
      pages: [
        { h: 'Q4 Business Review', sub: 'Performance & outlook · December 2025' },
        { h: 'Key results',         bullets: ['Revenue up 22% YoY', '47% gross margin · +6pts', '12,400 active customers', '$2.1M ARR added in Q4'] },
        { h: 'What worked',         bullets: ['Self-serve onboarding cut activation time 4× ', 'EU launch contributed 18% of new MRR', 'Pricing experiment lifted ARPU 14%'] },
        { h: 'What to fix',         bullets: ['Support backlog grew 2.3× — hire 2 SEs', 'Mobile churn 1.8× desktop · ship native client Q1', 'Sales cycle stretched on enterprise — restructure pod'] },
        { h: 'Next quarter',        bullets: ['Q1 target: $700K net new ARR', 'Ship mobile app for iOS + Android', 'Land 3 enterprise design partners'] },
      ]
    },
    { title: 'Product Roadmap 2026', accent: '#8b5cf6', tag: 'Plan',
      pages: [
        { h: 'Product Roadmap 2026', sub: 'Themes, bets, and milestones' },
        { h: 'Three big bets',   bullets: ['Ambient AI: less app, more presence', 'Voice-first capture under 10 seconds', 'Cross-app workflows that just work'] },
        { h: 'Q1 — Foundation',  bullets: ['Native iOS + Android', 'Voice memo → action pipeline', 'New permissions model'] },
        { h: 'Q2 — Expansion',   bullets: ['28 agents online', 'Public API + SDK', 'EU + UK data residency'] },
      ]
    },
    { title: 'Investor Deck — Seed',  accent: '#22c55e', tag: 'Pitch',
      pages: [
        { h: 'Kira',                 sub: 'A personal super-intelligence' },
        { h: 'The problem',          bullets: ['Knowledge workers manage 6 tools and lose 3 hours/day to context switching', 'Personal AI today is a chat box, not a colleague'] },
        { h: 'The solution',         bullets: ['28 specialized agents acting in your style', 'Lives across inbox, voice, calendar, code', 'Receipts for every action — reversible, accountable'] },
        { h: 'Traction',             bullets: ['$2.1M ARR · 12.4k users · 22% MoM', '47% gross margin', 'NPS 71'] },
        { h: 'The ask',              bullets: ['Raising $8M seed', 'Lead investor wanted', '24 months runway to Series A'] },
      ]
    },
    { title: 'Onboarding 101',        accent: '#f97316', tag: 'Training',
      pages: [
        { h: 'Welcome to Kira',       sub: 'Your first week, step by step' },
        { h: 'Day 1 — Set up',        bullets: ['Connect inbox, calendar, drive', '2-minute voice imprint', 'Pick your first 3 agents'] },
        { h: 'Day 3 — Learn',         bullets: ['Watch Kira draft replies in your voice', 'Approve or edit · she learns from both', 'Pin agents to the home stream'] },
        { h: 'Day 7 — Trust',         bullets: ['Enable auto-send for tier-3 emails', 'Schedule the morning briefing', '14 days to full mirror'] },
      ]
    },
    { title: 'Brand Guidelines',      accent: '#ec4899', tag: 'Brand',
      pages: [
        { h: 'Brand Guidelines',      sub: 'How we look, sound, and feel' },
        { h: 'Voice',                 bullets: ['Direct, never curt', 'Confident, never arrogant', 'Warm, never saccharine'] },
        { h: 'Colors',                bullets: ['Cobalt — #2541F2 (primary)', 'Cream — #F6F4EF (canvas)', 'Ink — #0A0A0D (text)'] },
        { h: 'Type',                  bullets: ['Display: Instrument Serif Italic', 'UI: Inter Tight', 'Mono: JetBrains Mono'] },
      ]
    },
    { title: 'Team All-Hands',        accent: '#06b6d4', tag: 'Update',
      pages: [
        { h: 'All-Hands · Week 47',   sub: 'Wins, plans, and questions' },
        { h: 'Wins',                  bullets: ['Shipped CRM Dashboard v0.4', '47 emails triaged automatically', 'Closed 3 enterprise pilots'] },
        { h: 'Plans',                 bullets: ['Code freeze Wednesday', 'Demo day Friday at 4pm', 'Open enrollment ends next week'] },
      ]
    },
    { title: 'Marketing Plan',        accent: '#a855f7', tag: 'Marketing',
      pages: [
        { h: 'Marketing Plan — Q1',   sub: 'Story, channels, budget' },
        { h: 'Story',                 bullets: ['It doesn\'t help you — it becomes you', '28 agents · one mind', 'Personal super-intelligence'] },
        { h: 'Channels',              bullets: ['Founder-led on X', 'Cinematic 90-second film', 'Hand-picked partner newsletters'] },
      ]
    },
    { title: 'Sales One-Pager',       accent: '#0ea5e9', tag: 'Sales',
      pages: [
        { h: 'Kira for Teams',        sub: 'AI that works the way your team does' },
        { h: 'Why teams choose us',   bullets: ['28 specialized agents — not a chatbot', 'Receipts, reversible, accountable', 'SOC 2 Type II · GDPR · EU residency'] },
        { h: 'Pricing',               bullets: ['$48/user/month · billed annually', '14-day trial · no card required', 'Custom enterprise tiers available'] },
      ]
    },
    { title: 'Strategy Memo',         accent: '#eab308', tag: 'Strategy',
      pages: [
        { h: 'Strategy Memo',         sub: 'Where we are, where we go' },
        { h: 'The next year',         bullets: ['Cross the chasm from early adopters to teams', 'Build the agent runtime as a platform', 'Earn the right to live in users\' lives'] },
      ]
    },
    { title: 'Conference Talk',       accent: '#84cc16', tag: 'Talk',
      pages: [
        { h: 'Becoming, not Helping', sub: 'A talk by Maya · WebSummit \'26' },
        { h: 'Thesis',                bullets: ['Tools we love disappear into the work', 'AI is doomed if it stays a chat box', 'The win is ambient, not interactive'] },
      ]
    },
    { title: 'OKRs Q1',               accent: '#14b8a6', tag: 'Plan',
      pages: [
        { h: 'Q1 OKRs',               sub: 'What we\'ll commit to' },
        { h: 'Growth',                bullets: ['O: Cross $5M ARR', 'KR1: 1,200 net new paid users', 'KR2: 18% expansion from existing'] },
        { h: 'Product',               bullets: ['O: Ship native mobile', 'KR1: iOS app in store by Mar 1', 'KR2: 40% of new users mobile-first'] },
      ]
    },
  ],
  doc: [
    { title: 'Project Proposal',  bodyParts: ['executive', 'objectives', 'scope', 'timeline'] },
    { title: 'Meeting Notes',     bodyParts: ['meta', 'attendees', 'notes', 'actions'] },
    { title: 'Resume',            bodyParts: ['header', 'summary', 'experience', 'education'] },
    { title: 'Cover Letter',      bodyParts: ['header', 'opening', 'body', 'closing'] },
    { title: 'Research Report',   bodyParts: ['abstract', 'method', 'findings', 'conclusion'] },
    { title: 'Product Spec',      bodyParts: ['summary', 'requirements', 'design', 'rollout'] },
    { title: 'Press Release',     bodyParts: ['headline', 'lead', 'body', 'boilerplate'] },
    { title: 'Memo',              bodyParts: ['meta', 'context', 'argument', 'next-steps'] },
    { title: 'SOP Document',      bodyParts: ['purpose', 'steps', 'roles', 'review'] },
    { title: 'Blog Post Draft',   bodyParts: ['hook', 'argument', 'evidence', 'cta'] },
    { title: 'Contract Outline',  bodyParts: ['parties', 'terms', 'payment', 'termination'] },
  ],
};

// ============================================================
//  TEMPLATE VIEWER MODAL
//  Opens when a template card is clicked. Renders viewable demo
//  content per template kind. Click outside or press the X to close.
// ============================================================
function TemplateViewer({ t, theme, kind, index, blank, image, onClose, onUse }) {
  if (kind === null || kind === undefined) return null;
  const k = useKira();

  const renderBody = () => {
    if (blank) {
      return (
        <div style={{ padding: 80, textAlign: 'center', color: t.textDim }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: t.hover,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px', color: t.text }}>
            <Icon name="plus" size={28}/>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 6 }}>
            Blank {kind === 'slide' ? 'presentation' : kind === 'doc' ? 'document' : kind === 'poster' ? 'canvas' : 'project'}
          </div>
          <div style={{ fontSize: 13.5 }}>Start from scratch. Kira can help fill it in.</div>
        </div>
      );
    }

    if (kind === 'slide') {
      const lib = TEMPLATE_CONTENT.slide;
      const tpl = lib[(index - 1) % lib.length];
      return <SlideTemplateContent t={t} tpl={tpl}/>;
    }
    if (kind === 'doc') {
      const lib = TEMPLATE_CONTENT.doc;
      const tpl = lib[(index - 1) % lib.length];
      return <DocTemplateContent t={t} tpl={tpl}/>;
    }
    if (kind === 'poster') {
      return <PosterTemplateContent t={t} index={index}/>;
    }
    if (kind === 'image') {
      return <ImageTemplateContent t={t} index={index} image={image}/>;
    }
    return null;
  };

  // Header title
  const headerTitle = (() => {
    if (blank) return `Blank ${kind === 'slide' ? 'presentation' : kind === 'doc' ? 'document' : kind}`;
    if (kind === 'slide') return TEMPLATE_CONTENT.slide[(index - 1) % TEMPLATE_CONTENT.slide.length].title;
    if (kind === 'doc')   return TEMPLATE_CONTENT.doc[(index - 1) % TEMPLATE_CONTENT.doc.length].title;
    if (kind === 'poster') return `Poster ${index}`;
    if (kind === 'image')  return image?.title || `Generated image ${index}`;
    return 'Template';
  })();

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeUp 0.2s ease-out',
      }}/>
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(94vw, 1100px)', maxHeight: '90vh',
        background: t.panelStrong,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${t.borderStrong}`,
        borderRadius: 18,
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        zIndex: 101,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeUp 0.25s ease-out',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 20px',
          borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>
            {headerTitle}
          </div>
          <button onClick={() => {
              if (onUse) {
                onUse();
                return;
              }
              k?.log(`Used template: ${headerTitle}`, kind === 'slide' ? 'slides' : kind === 'doc' ? 'docs' : kind === 'poster' ? 'designer' : 'image');
              k?.toast(`Template "${headerTitle}" added to your workspace`, 'success');
              onClose();
            }}
            style={{
              padding: '8px 16px', borderRadius: 8,
              background: '#2541F2', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            }}>Use template</button>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'transparent', border: 'none', color: t.text,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, lineHeight: 1,
          }}>×</button>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderBody()}
        </div>
      </div>
    </>
  );
}

// ====== SLIDE TEMPLATE CONTENT ======
function SlideTemplateContent({ t, tpl }) {
  return (
    <div style={{ padding: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {tpl.pages.map((p, i) => (
        <div key={i} style={{
          aspectRatio: '16 / 10',
          borderRadius: 10,
          background: i === 0
            ? `linear-gradient(135deg, ${tpl.accent} 0%, ${tpl.accent}aa 100%)`
            : '#ffffff',
          padding: 22,
          display: 'flex', flexDirection: 'column',
          color: i === 0 ? '#fff' : '#1a1a22',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 10, right: 12,
            fontSize: 9, fontFamily: 'monospace',
            color: i === 0 ? 'rgba(255,255,255,0.7)' : '#9ca3af',
          }}>{i + 1} / {tpl.pages.length}</div>
          {i === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{
                display: 'inline-block', padding: '4px 10px', borderRadius: 12,
                background: 'rgba(255,255,255,0.2)', fontSize: 9, letterSpacing: 2,
                textTransform: 'uppercase', marginBottom: 10, fontFamily: 'monospace',
              }}>{tpl.tag}</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.h}</div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 6 }}>{p.sub}</div>
            </div>
          ) : (
            <>
              <div style={{
                width: 36, height: 3, borderRadius: 2,
                background: tpl.accent, marginBottom: 12,
              }}/>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#1a1a22' }}>{p.h}</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(p.bullets || []).slice(0, 4).map((b, j) => (
                  <li key={j} style={{ fontSize: 10, color: '#374151', display: 'flex', gap: 6, lineHeight: 1.35 }}>
                    <span style={{ color: tpl.accent }}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ====== DOC TEMPLATE CONTENT ======
function DocTemplateContent({ t, tpl }) {
  const SECTIONS = {
    executive: { h: 'Executive summary', body: 'This proposal outlines a phased plan to ship the next-generation product within 90 days. We project a $2.1M ARR contribution and 22% gross margin improvement on baseline.' },
    objectives: { h: 'Objectives', list: ['Launch v2 to 100% of customers by end of Q1', 'Cut activation time from 8 minutes to under 2', 'Increase NPS from 47 to 60+'] },
    scope: { h: 'Scope', body: 'In scope: web app, iOS, Android, public API, and three integration partners. Out of scope: enterprise SSO, on-premise deployment, and the legacy admin portal.' },
    timeline: { h: 'Timeline', list: ['Week 1–2 · Discovery and design', 'Week 3–6 · Build core flows', 'Week 7–9 · Private beta with 12 customers', 'Week 10–12 · GA launch'] },
    meta: { h: 'Meeting details', list: ['Date · Wednesday, 14 May 2026', 'Time · 11:00 – 11:35', 'Location · Conference Room B / Zoom', 'Note-taker · Maya'] },
    attendees: { h: 'Attendees', list: ['Kobe Yang (PM)', 'Maya Singh (Eng)', 'D. Park (Design)', 'Sarah Johnson (CX)'] },
    notes: { h: 'Discussion', body: 'Reviewed the Q3 plan. Eng raised concerns about the database migration overlap with the holiday code freeze. Design proposed a softer rollout pattern using user-tier flags. Agreement to move the migration to Q4 week 3.' },
    actions: { h: 'Action items', list: ['Maya — finalize migration plan by Friday', 'D. Park — share rollout flag spec Monday', 'Kobe — update the roadmap deck before Tuesday standup'] },
    header: { h: 'Jane Cooper', body: 'San Francisco, CA · jane@kira.app · linkedin.com/in/jane-cooper' },
    summary: { h: 'Summary', body: 'Product manager with 8 years of experience shipping consumer and developer tools. Built and led teams of 4–12. Equally comfortable in early-stage zero-to-one and scaling growth-stage products.' },
    experience: { h: 'Experience', list: ['Kira AI · Lead PM · 2024 – Present', 'Notion · Senior PM · 2021 – 2024', 'Figma · PM · 2018 – 2021'] },
    education: { h: 'Education', list: ['Stanford University · BS Computer Science · 2018', 'Y Combinator · Founder Track · 2023'] },
    opening: { h: 'Opening', body: 'Dear Hiring Manager, I am writing to apply for the Senior Product Designer role. After three years building consumer products at Notion, I am looking for a place where craft and ambition meet.' },
    body: { h: 'Why this role', body: 'Your team\'s recent work on the new editor caught my eye — particularly the way you handled the typography overhaul without breaking existing documents. I have shipped two similar migrations and would love to contribute that experience.' },
    closing: { h: 'Closing', body: 'Thank you for considering my application. I would welcome the chance to share my portfolio and discuss how I can contribute. Best, Jane Cooper.' },
    abstract: { h: 'Abstract', body: 'This study examines productivity outcomes among 1,247 knowledge workers using personal AI assistants over a 12-week period. We find a 24% reduction in time spent on routine email and scheduling, with no observed degradation in output quality.' },
    method: { h: 'Method', body: 'Mixed-method study combining time-tracking logs (n=1,247) with structured interviews (n=42). Participants were recruited across three industries: software (47%), professional services (33%), and education (20%).' },
    findings: { h: 'Findings', list: ['24% time savings on routine tasks', 'No significant change in error rates', '71% of participants reported reduced cognitive load', 'Most-valued feature: drafting in user\'s own voice'] },
    conclusion: { h: 'Conclusion', body: 'Personal AI delivers measurable productivity benefits when calibrated to the user\'s style. Future work should examine long-term adoption patterns and effects on creative output.' },
    requirements: { h: 'Requirements', list: ['Sub-200ms p95 latency on the core API', 'GDPR, SOC 2, and EU data residency', 'Mobile-first design — desktop is a port', 'Accessible to WCAG 2.2 AA'] },
    design: { h: 'Design notes', body: 'The interface should feel quiet and confident. Avoid surfaces that compete for attention. Default to muted neutrals; reserve color for state changes and accent emphasis. Type carries the hierarchy.' },
    rollout: { h: 'Rollout', list: ['Week 1 — internal dogfood', 'Week 2 — 5% canary', 'Week 3 — 25% with health metrics', 'Week 4 — 100% with kill-switch ready'] },
    headline: { h: 'For immediate release', body: 'Kira launches personal super-intelligence platform, raises $8M to give every knowledge worker 28 specialized agents.' },
    lead: { h: 'Lead', body: 'SAN FRANCISCO, May 17, 2026 — Kira, the personal AI platform giving every knowledge worker 28 specialized agents, today announced an $8M seed round led by Sequoia Capital, with participation from Founders Fund and several angel investors.' },
    boilerplate: { h: 'About Kira', body: 'Kira is a personal super-intelligence that lives across your inbox, voice, calendar, and decisions. Founded in 2024 and based in San Francisco, the company is backed by Sequoia Capital, Founders Fund, and select angels.' },
    context: { h: 'Context', body: 'Over the past two weeks, our deploys have grown from 4 per day to 11 per day. The same release process is now bottlenecking on a single staging environment — a sign that we have outgrown it.' },
    argument: { h: 'Recommendation', body: 'We should provision a second staging environment dedicated to long-running integration tests. This frees the primary environment for fast-iteration work and prevents the queue from blocking unrelated teams.' },
    'next-steps': { h: 'Next steps', list: ['Owner: Maya — provision env by Friday', 'Owner: Kobe — update CI routing rules', 'Review with the team next Wednesday'] },
    purpose: { h: 'Purpose', body: 'This document defines the standard operating procedure for onboarding a new enterprise customer. It applies to all customers above the $50K ACV threshold and supersedes any previous onboarding documentation.' },
    steps: { h: 'Steps', list: ['1. CS lead is assigned within 24 hours of close', '2. Kickoff call scheduled within 5 business days', '3. Implementation plan delivered within 10 business days', '4. First value milestone defined and tracked weekly'] },
    roles: { h: 'Roles', list: ['Account Executive — closes deal and warm-handoff', 'Customer Success Lead — owns the relationship', 'Solutions Engineer — owns technical implementation', 'Executive Sponsor — checks in monthly'] },
    review: { h: 'Review cadence', body: 'This SOP is reviewed quarterly. Suggest changes via the SOP repository. Major revisions require approval from the VP of Customer Success.' },
    hook: { h: 'The opening', body: 'For most of computing history, software has been a tool you pick up. AI changes that. The next wave of software does not wait to be used — it acts on your behalf, in your style, with your permission.' },
    evidence: { h: 'Evidence', body: 'Three patterns are already emerging. First, agents that understand context save more time than they cost to set up. Second, voice-first interfaces win wherever speed matters more than completeness. Third, users trust systems that show their work.' },
    cta: { h: 'Closing', body: 'If you want to feel this future today, Kira gives every knowledge worker 28 specialized agents that work in their style. Start a free trial — your second self is two minutes of voice training away.' },
    parties: { h: 'Parties', body: 'This agreement is entered into between Kira Inc., a Delaware corporation ("Kira"), and the Customer identified on the cover page ("Customer"), effective as of the date of signature.' },
    terms: { h: 'Terms', list: ['12-month subscription with auto-renewal', 'Pricing per Order Form, locked for the initial term', '99.9% uptime SLA with service credits for missed targets', 'Standard MSA terms apply'] },
    payment: { h: 'Payment', body: 'Customer agrees to pay all fees as set forth in the applicable Order Form. Invoices are net 30. Late payments accrue interest at 1.5% per month or the maximum rate permitted by law, whichever is lower.' },
    termination: { h: 'Termination', body: 'Either party may terminate this agreement for material breach upon 30 days written notice if the breach remains uncured. On termination, Customer\'s data is exported and deleted within 60 days unless retention is required by law.' },
  };

  return (
    <div style={{ padding: 50, maxWidth: 760, margin: '0 auto', color: theme === 'dark' ? '#e5e5e7' : '#1a1a22' }}>
      <div style={{
        background: '#ffffff', padding: '70px 80px', borderRadius: 6,
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        color: '#1a1a22', fontFamily: '"Georgia", serif',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28, letterSpacing: '-0.02em' }}>
          {tpl.title}
        </h1>
        {tpl.bodyParts.map((key, i) => {
          const sec = SECTIONS[key];
          if (!sec) return null;
          return (
            <section key={i} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'system-ui, sans-serif' }}>
                {sec.h}
              </h2>
              {sec.body && (
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151' }}>{sec.body}</p>
              )}
              {sec.list && (
                <ul style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', paddingLeft: 22, margin: 0 }}>
                  {sec.list.map((item, j) => <li key={j} style={{ marginBottom: 4 }}>{item}</li>)}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ====== POSTER TEMPLATE CONTENT ======
function PosterTemplateContent({ t, index }) {
  const presets = [
    { bg: 'linear-gradient(135deg, #ec4899 0%, #fb923c 100%)', h: 'Sunset Festival', sub: 'Live music · all weekend', tag: 'Aug 24–26 · Pier 70', accent: '#fff7ed' },
    { bg: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', h: 'Quarterly Earnings', sub: 'Investor briefing', tag: 'Q4 2025 · 4pm PT', accent: '#cbd5e1' },
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', h: 'Design Conf', sub: 'Three days · forty speakers', tag: 'Sep 12–14 · NYC', accent: '#ede9fe' },
    { bg: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)', h: 'Run for Reads', sub: 'A 5k for literacy', tag: 'Oct 5 · Golden Gate', accent: '#dcfce7' },
    { bg: 'linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)', h: 'Coffee Festival', sub: 'Twenty roasters · one room', tag: 'Sep 21 · Ferry Building', accent: '#fff7ed' },
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', h: 'Tech Talk', sub: 'AI in production', tag: 'Live · Thu 6pm', accent: '#e0f2fe' },
    { bg: 'linear-gradient(135deg, #fda4af 0%, #f472b6 100%)', h: 'Garden Party', sub: 'Spring open house', tag: 'May 18 · 1–5pm', accent: '#fdf2f8' },
    { bg: 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)', h: 'Farmers Market', sub: 'Local growers · every Sat', tag: 'Year round', accent: '#fef9c3' },
    { bg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', h: 'Night Run', sub: 'Glow-in-the-dark 10k', tag: 'Jun 14 · 9pm', accent: '#fae8ff' },
    { bg: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', h: 'Film Festival', sub: 'Independent shorts', tag: 'Nov 1–8 · Castro', accent: '#e2e8f0' },
    { bg: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)', h: 'Open House', sub: 'New campus tour', tag: 'Jul 19 · 10am', accent: '#ecfccb' },
  ];
  const p = presets[(index - 1) % presets.length];

  return (
    <div style={{ padding: 50, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: 460, aspectRatio: '3 / 4',
        background: p.bg, borderRadius: 12,
        padding: 36, display: 'flex', flexDirection: 'column',
        color: '#fff', boxShadow: '0 16px 50px rgba(0,0,0,0.3)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.18)', fontSize: 10, letterSpacing: 2.5,
            textTransform: 'uppercase', fontFamily: 'monospace',
            alignSelf: 'flex-start', marginBottom: 18,
          }}>{p.tag}</div>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            {p.h}
          </div>
          <div style={{ fontSize: 17, opacity: 0.85, marginTop: 10, fontStyle: 'italic' }}>
            {p.sub}
          </div>
        </div>
        <div style={{
          paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.25)',
          fontSize: 11, fontFamily: 'monospace', letterSpacing: 1.5,
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          kira.app/events
        </div>
      </div>
    </div>
  );
}

// ====== IMAGE TEMPLATE CONTENT ======
function ImageTemplateContent({ t, index, image }) {
  // If we got a real image (from the gallery), show it. Otherwise fall back to a tasteful gradient.
  if (image && image.src) {
    return (
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          maxWidth: 600, width: '100%',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}>
          <img src={image.src} alt={image.title}
            style={{ width: '100%', display: 'block' }}/>
        </div>
        <div style={{ marginTop: 22, textAlign: 'center', maxWidth: 560 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: t.textDim,
            letterSpacing: 1.5, textTransform: 'uppercase',
            fontFamily: 'monospace', marginBottom: 8,
          }}>
            {image.style || 'Generated'}
          </div>
          <div style={{ fontSize: 14, color: t.text, fontStyle: 'italic', lineHeight: 1.5 }}>
            "{image.prompt}"
          </div>
        </div>
      </div>
    );
  }

  const presets = [
    { bg: 'linear-gradient(135deg, #fda4af 0%, #fb923c 100%)',  caption: 'Sunrise over open water · cinematic' },
    { bg: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',  caption: 'Neon city skyline at dusk' },
    { bg: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',  caption: 'Forest canopy from above · drone shot' },
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',  caption: 'Hot air balloons at golden hour' },
    { bg: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',  caption: 'Aurora over a mountain ridge' },
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',  caption: 'Underwater coral reef · macro' },
    { bg: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',  caption: 'Desert dunes at sunset' },
    { bg: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',  caption: 'Cherry blossoms drifting in air' },
    { bg: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',  caption: 'Foggy mountain village at dawn' },
  ];
  const p = presets[(index - 1) % presets.length];
  return (
    <div style={{ padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 540, aspectRatio: '1 / 1',
        background: p.bg, borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
        }}/>
      </div>
      <div style={{ marginTop: 18, textAlign: 'center', color: t.textDim, fontSize: 13, fontStyle: 'italic' }}>
        {p.caption}
      </div>
    </div>
  );
}

// ============================================================
//  PROMPT BOX
// ============================================================
function PromptBox({ t, theme, value, onChange, placeholder, model = 'Standard', onModelChange, leftPills, showSpeak = true, onSubmit }) {
  const k = useKira();
  const [modelOpen, setModelOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const fileInputRef = useRef(null);

  const onFilePicked = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const names = files.map(f => f.name).join(', ');
    k?.toast(`Attached: ${names}`, 'success');
    k?.log(`Attached ${files.length} file${files.length === 1 ? '' : 's'}`, 'drive', names);
    e.target.value = '';
  };

  return (
    <div style={{
      width: '100%', background: t.panel,
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      border: `1px solid ${t.border}`, borderRadius: 22,
      padding: '18px 20px 12px',
      boxShadow: theme === 'dark'
        ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)'
        : '0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
    }}>
      {leftPills && <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>{leftPills}</div>}
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={1}
        onKeyDown={(e) => {
          if (onSubmit && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        style={{
          width: '100%', background: 'transparent', border: 'none', outline: 'none',
          color: t.text, fontSize: 14.5, fontFamily: 'inherit',
          resize: 'none', minHeight: 22, lineHeight: 1.5,
        }}
      />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 14,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setAttachOpen(!attachOpen)} style={smallIconBtn(t)}>
              <Icon name="plus" size={15}/>
            </button>
            {attachOpen && (
              <>
                <div onClick={() => setAttachOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 28 }}/>
                <div style={{
                  position: 'absolute', bottom: '120%', left: 0, marginBottom: 4,
                  background: t.panelStrong, backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: `1px solid ${t.borderStrong}`, borderRadius: 12,
                  padding: 6, minWidth: 200, zIndex: 30,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  animation: 'fadeUp 0.18s ease-out',
                }}>
                  {[
                    { label: 'Upload from device', icon: 'plus' },
                    { label: 'Paste from URL',     icon: 'sparkle' },
                    { label: 'From Drive',         icon: 'drive' },
                    { label: 'Take photo',         icon: 'camera' },
                  ].map(item => (
                    <button key={item.label} onClick={() => {
                      setAttachOpen(false);
                      if (item.label === 'Upload from device') {
                        fileInputRef.current?.click();
                      } else if (item.label === 'Paste from URL') {
                        const url = prompt('Paste a URL:');
                        if (url) {
                          k?.toast(`Attached link: ${url.slice(0, 40)}${url.length > 40 ? '…' : ''}`, 'success');
                          k?.log('Attached link', 'sparkle', url.slice(0, 60));
                        }
                      } else {
                        k?.toast(`${item.label} — coming soon`, 'info');
                      }
                    }} style={{
                      width: '100%', textAlign: 'left',
                      background: 'transparent', border: 'none', color: t.text,
                      padding: '8px 11px', borderRadius: 7, cursor: 'pointer',
                      fontSize: 13, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Icon name={item.icon} size={14}/> {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {onModelChange && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setModelOpen(!modelOpen)} style={modelPillBtn(t)}>
                <Icon name="standard" size={13}/> {model} <Icon name="chev-down" size={11}/>
              </button>
              {modelOpen && (
                <>
                  <div onClick={() => setModelOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 28 }}/>
                  <div style={{
                    position: 'absolute', top: '110%', left: 0, marginTop: 4,
                    background: t.panelStrong, backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: `1px solid ${t.borderStrong}`, borderRadius: 12,
                    padding: 6, minWidth: 160, zIndex: 30,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    animation: 'fadeUp 0.2s ease-out',
                  }}>
                    {['Standard', 'Fast', 'Pro', 'Genius'].map(m => (
                      <button key={m} onClick={() => { onModelChange(m); setModelOpen(false); }}
                        style={{
                          width: '100%', textAlign: 'left',
                          background: model === m ? t.hover : 'transparent', border: 'none',
                          color: t.text, padding: '7px 11px', borderRadius: 7,
                          cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                        }}>{m}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setRecording(!recording)} style={{
            ...iconOnly(t),
            color: recording ? '#ef4444' : t.textDim,
            background: recording ? 'rgba(239,68,68,0.12)' : 'transparent',
          }} title={recording ? 'Stop recording' : 'Start voice input'}>
            <Icon name="mic" size={15}/>
          </button>
          {showSpeak && (
            <button onClick={() => onSubmit && onSubmit()} style={{
              padding: '7px 15px', borderRadius: 18,
              background: theme === 'dark' ? '#ffffff' : '#0a0a0d',
              color: theme === 'dark' ? '#0a0a0d' : '#ffffff',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12.5,
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="speak" size={13}/> Speak
            </button>
          )}
        </div>
      </div>
      <input ref={fileInputRef} type="file" multiple onChange={onFilePicked} style={{ display: 'none' }}/>
    </div>
  );
}
const smallIconBtn = (t) => ({
  width: 30, height: 30, borderRadius: 15,
  background: t.hover, border: `1px solid ${t.border}`,
  color: t.text, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});
const iconOnly = (t) => ({
  width: 30, height: 30, borderRadius: 15,
  background: 'transparent', border: 'none',
  color: t.textDim, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});
const modelPillBtn = (t) => ({
  padding: '6px 12px', borderRadius: 16,
  background: t.hover, border: `1px solid ${t.border}`,
  color: t.text, cursor: 'pointer', fontSize: 12.5,
  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
});
const filledPillBtn = (t, active = false, color) => ({
  padding: '7px 14px', borderRadius: 18,
  background: active ? (color ? `${color}26` : t.accentBg) : t.hover,
  border: `1px solid ${active && color ? `${color}55` : t.border}`,
  color: active && color ? color : t.text,
  cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 600 : 500,
  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
  transition: 'all 0.15s ease',
});

// ============================================================
//  HOME
// ============================================================
const HOME_AGENTS = [
  { id: 'slides',    label: 'AI Slides',   icon: 'slides',   color: '#0ea5e9', page: 'slides'    },
  { id: 'docs',      label: 'AI Docs',     icon: 'docs',     color: '#2563eb', page: 'docs'      },
  { id: 'designer',  label: 'AI Designer', icon: 'designer', color: '#6366f1', page: 'designer'  },
  { id: 'image',     label: 'AI Image Generator', icon: 'image', color: '#a855f7', page: 'image', badge: 'Unlimited' },
  { id: 'workflows', label: 'Workflows',   icon: 'workflow', color: '#10b981', page: 'workflows' },
];

function HomePage({ t, theme, onOpen }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('Standard');

  const submit = () => {
    if (!prompt.trim()) return;
    const p = prompt.toLowerCase();
    let dest = 'chat';
    if (/slide|deck|present/.test(p))            dest = 'slides';
    else if (/doc|resume|cover letter|report/.test(p)) dest = 'docs';
    else if (/sheet|spreadsheet|excel|csv|table/.test(p)) dest = 'sheets';
    else if (/poster|flyer|logo|design/.test(p)) dest = 'designer';
    else if (/image|photo|picture/.test(p))      dest = 'image';
    else if (/workflow|automate|schedule/.test(p)) dest = 'workflows';
    else if (/note|notepad|jot|memo|idea/.test(p)) dest = 'notepad';

    k?.log(`Started: ${prompt.slice(0, 50)}`, dest === 'chat' ? 'speak' : dest, `Routed to ${dest}`);
    onOpen(dest);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 40px', animation: 'fadeUp 0.6s ease-out',
        overflowY: 'auto',
      }}>
      <div style={{
        maxWidth: 760, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
          letterSpacing: '-0.02em', margin: '0 0 36px 0',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          Kira Workspace
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e', boxShadow: '0 0 12px #22c55e',
            animation: 'pulse 2.5s ease-in-out infinite',
          }}/>
        </h1>
        <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
          model={model} onModelChange={setModel}
          placeholder="Ask anything, create anything"
          onSubmit={submit}/>

        <div style={{
          marginTop: 64, width: '100%',
          display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {HOME_AGENTS.map((a, i) => (
            <AgentTile key={a.id} agent={a} t={t}
              onClick={() => onOpen(a.page)} animationDelay={i * 0.05}/>
          ))}
        </div>

        {/* Tasks strip — only visible when tasks exist */}
        {k?.tasks && k.tasks.filter(t => !t.done).length > 0 && (
          <div style={{
            marginTop: 56, width: '100%', maxWidth: 640,
            animation: 'fadeUp 0.6s ease-out 0.3s both',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: t.textDim,
              fontFamily: 'monospace', letterSpacing: 1,
              marginBottom: 10, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>Open tasks · {k.tasks.filter(t => !t.done).length}</span>
              <button onClick={() => k.openNewTask()} style={{
                fontSize: 11, color: t.text, fontWeight: 700,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>+ Add</button>
            </div>
            <div style={{
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 14, overflow: 'hidden',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}>
              {k.tasks.filter(task => !task.done).slice(0, 5).map((task, i, arr) => (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
                }}>
                  <button onClick={() => k.toggleTask(task.id)}
                    style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'transparent', border: `2px solid ${t.textDim}`,
                      cursor: 'pointer', flexShrink: 0, padding: 0,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = t.text}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = t.textDim}/>
                  <div style={{ flex: 1, fontSize: 13.5, color: t.text }}>{task.text}</div>
                  {task.due && (
                    <span style={{
                      fontSize: 10.5, color: t.textDim, fontFamily: 'monospace',
                      padding: '2px 8px', borderRadius: 8, background: t.hover,
                    }}>{task.due}</span>
                  )}
                  <button onClick={() => k.deleteTask(task.id)}
                    title="Delete" style={{
                      background: 'transparent', border: 'none', color: t.textDim,
                      cursor: 'pointer', padding: 4, opacity: 0.5,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = t.textDim; }}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function AgentTile({ agent, t, onClick, animationDelay = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'transparent', border: 'none', padding: 8,
        borderRadius: 12, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        color: t.text, fontFamily: 'inherit',
        animation: `fadeUp 0.5s ease-out ${animationDelay}s both`,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.18s ease',
        minWidth: 92,
      }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: `${agent.color}25`,
        border: `1px solid ${agent.color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: agent.color, transition: 'box-shadow 0.2s ease',
        boxShadow: hover
          ? `0 6px 24px ${agent.color}55, inset 0 0 0 1px ${agent.color}40`
          : `inset 0 0 0 1px ${agent.color}30`,
      }}>
        <Icon name={agent.icon} size={23}/>
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 500 }}>{agent.label}</span>
      {agent.badge && (
        <span style={{
          fontSize: 9, fontWeight: 700,
          background: '#fbbf24', color: '#451a03',
          padding: '1.5px 6px', borderRadius: 4, marginTop: -2,
        }}>{agent.badge}</span>
      )}
    </button>
  );
}

// ============================================================
//  EMPTY STATE
// ============================================================
function EmptyState({ t, title, body, cta, onCta }) {
  return (
    <div style={{
      border: `1px dashed ${t.borderStrong}`, borderRadius: 14,
      padding: '60px 20px', textAlign: 'center', background: t.cardBg,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{title}</div>
      <div style={{ fontSize: 13, color: t.textDim, marginTop: 6, maxWidth: 380, margin: '6px auto 0' }}>{body}</div>
      {cta && onCta && (
        <button onClick={onCta} style={{
          marginTop: 18, padding: '8px 18px', borderRadius: 18,
          background: t.chipActiveBg, color: t.chipActiveText, border: 'none',
          cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>{cta}</button>
      )}
    </div>
  );
}

function Dropdown({ t, label, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={filledPillBtn(t)}>
        {label} <Icon name="chev-down" size={11}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 28 }}/>
          <div style={{
            position: 'absolute', top: '110%', left: 0, marginTop: 4,
            background: t.panelStrong,
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${t.borderStrong}`, borderRadius: 12,
            padding: 6, minWidth: 160, zIndex: 30,
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            animation: 'fadeUp 0.18s ease-out',
          }}>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }}
                style={{
                  width: '100%', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  color: t.text, padding: '7px 11px', borderRadius: 7,
                  cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
//  SLIDES PAGE (simplified preview — keeps full template grid)
// ============================================================
const SLIDE_TEMPLATES = [
  { id: 1,  title: 'Add My Template', type: 'add' },
  { id: 2,  title: 'Transforming Customer Relations', type: 'blue-circles', accent: '#1e3a8a' },
  { id: 3,  title: 'マーケティング戦略 2025', type: 'japanese', accent: '#0ea5e9' },
  { id: 4,  title: 'AI REVOLUTION', type: 'gray-ai', accent: '#475569' },
  { id: 5,  title: 'BUSINESS GROWTH', type: 'corporate', accent: '#0891b2' },
  { id: 6,  title: 'DIGITAL TRANSFORMATION', type: 'digital-dark', accent: '#1e1b4b' },
  { id: 7,  title: 'Complete Healthcare Guide', type: 'healthcare', accent: '#0f766e' },
  { id: 8,  title: 'Professional Development', type: 'pro-people', accent: '#fbbf24' },
  { id: 9,  title: 'Digital Learning', type: 'green-tech', accent: '#16a34a' },
  { id: 10, title: 'SmartFlow AI', type: 'robot', accent: '#312e81' },
  { id: 11, title: 'STRATEGIC COMMUNICATION', type: 'orange', accent: '#ea580c' },
  { id: 12, title: 'BUSINESS STRATEGY', type: 'orange-stripe', accent: '#f97316' },
  { id: 13, title: 'Financial Update', type: 'finance', accent: '#1e293b' },
  { id: 14, title: 'InnovateTech', type: 'soft-pink', accent: '#ec4899' },
];

function SlidesPage({ t, theme, onBack, myTemplates, setMyTemplates, myDecks, setMyDecks }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [stylePick, setStylePick] = useState('Professional');
  const [aspect, setAspect] = useState('16:9');
  const [tab, setTab] = useState('Explore');
  const [viewer, setViewer] = useState(null); // { index, blank }
  const [styleFilter, setStyleFilter] = useState('All Styles');
  const [themeFilter, setThemeFilter] = useState('All Themes');
  const [sortBy, setSortBy] = useState('Popularity');
  const [editingDeckId, setEditingDeckId] = useState(null);

  const toggleSave = (id) => {
    setMyTemplates(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Create a deck from a template index in TEMPLATE_CONTENT.slide
  const createDeckFromTemplate = (templateIndex, fromBlank = false) => {
    const now = Date.now();
    if (fromBlank) {
      const id = `deck-${now}`;
      const deck = {
        id,
        name: 'Untitled deck',
        accent: '#3b82f6',
        tag: 'Custom',
        fromTemplate: null,
        slides: [
          { h: 'Untitled deck', sub: 'Click to edit', isTitle: true },
        ],
        created: now,
        modified: now,
      };
      setMyDecks(prev => [deck, ...prev]);
      k?.toast('Blank deck created', 'success');
      k?.log('Created blank deck', 'slides');
      setEditingDeckId(id);
      setViewer(null);
      return;
    }
    const lib = TEMPLATE_CONTENT.slide;
    const tpl = lib[(templateIndex - 1) % lib.length];
    const id = `deck-${now}`;
    const deck = {
      id,
      name: tpl.title,
      accent: tpl.accent,
      tag: tpl.tag,
      fromTemplate: tpl.title,
      slides: tpl.pages.map((p, i) => ({
        h: p.h,
        sub: p.sub || '',
        bullets: p.bullets ? [...p.bullets] : [],
        isTitle: i === 0,
      })),
      created: now,
      modified: now,
    };
    setMyDecks(prev => [deck, ...prev]);
    k?.toast(`Created "${tpl.title}" from template`, 'success');
    k?.log(`Created deck from template`, 'slides', tpl.title);
    setEditingDeckId(id);
    setViewer(null);
  };

  const updateDeck = (id, patch) => {
    setMyDecks(prev => prev.map(d => d.id === id ? { ...d, ...patch, modified: Date.now() } : d));
  };

  const deleteDeck = (id) => {
    const deck = myDecks.find(d => d.id === id);
    if (!confirm(`Delete "${deck?.name || 'this deck'}"?`)) return;
    setMyDecks(prev => prev.filter(d => d.id !== id));
    k?.toast(`Deck deleted`, 'success');
    if (editingDeckId === id) setEditingDeckId(null);
  };

  const duplicateDeck = (id) => {
    const orig = myDecks.find(d => d.id === id);
    if (!orig) return;
    const now = Date.now();
    const copy = { ...orig, id: `deck-${now}`, name: `${orig.name} (copy)`, created: now, modified: now };
    setMyDecks(prev => [copy, ...prev]);
    k?.toast('Deck duplicated', 'success');
  };

  const visibleTemplates = tab === 'My Templates'
    ? SLIDE_TEMPLATES.filter(tplItem => tplItem.type === 'add' || myTemplates.includes(tplItem.id))
    : SLIDE_TEMPLATES;

  const editingDeck = myDecks.find(d => d.id === editingDeckId);

  const formatRelative = (iso) => {
    const diff = Date.now() - iso;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '24px 0 28px', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>Kira AI Slides</h1>

          <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
            placeholder="Enter your presentation topic and requirements..."
            model="Standard" onModelChange={() => {}}
            onSubmit={() => {
              if (!prompt.trim()) return;
              k?.toast(`Generating ${stylePick.toLowerCase()} deck…`, 'info');
              setTimeout(() => {
                // Pick a template that best fits the prompt
                const p = prompt.toLowerCase();
                let pickIdx = 1;
                if (/q\d|review|quarter|business/.test(p)) pickIdx = 1;
                else if (/roadmap|product/.test(p))         pickIdx = 2;
                else if (/invest|pitch|seed|round/.test(p)) pickIdx = 3;
                else if (/onboard|welcome|train/.test(p))   pickIdx = 4;
                else if (/brand|design|style/.test(p))      pickIdx = 5;
                else pickIdx = (Math.floor(Math.random() * TEMPLATE_CONTENT.slide.length) + 1);
                // Create deck and use the prompt as the deck name
                const now = Date.now();
                const tpl = TEMPLATE_CONTENT.slide[(pickIdx - 1) % TEMPLATE_CONTENT.slide.length];
                const id = `deck-${now}`;
                const deck = {
                  id,
                  name: prompt.slice(0, 60),
                  accent: tpl.accent,
                  tag: tpl.tag,
                  fromTemplate: tpl.title,
                  slides: tpl.pages.map((pg, i) => ({
                    h: i === 0 ? prompt.slice(0, 60) : pg.h,
                    sub: pg.sub || '',
                    bullets: pg.bullets ? [...pg.bullets] : [],
                    isTitle: i === 0,
                  })),
                  created: now, modified: now,
                };
                setMyDecks(prev => [deck, ...prev]);
                k?.toast(`Deck "${prompt.slice(0, 30)}" ready`, 'success');
                k?.log(`Generated ${stylePick} deck`, 'slides', prompt.slice(0, 60));
                setEditingDeckId(id);
              }, 900);
              setPrompt('');
            }}
            leftPills={
              <>
                <button onClick={() => setStylePick('Professional')} style={filledPillBtn(t, stylePick === 'Professional')}>
                  <Icon name="professional" size={13}/> Professional
                </button>
                <button onClick={() => setStylePick('Creative')} style={filledPillBtn(t, stylePick === 'Creative')}>
                  <Icon name="creative" size={13}/> Creative
                </button>
                <button onClick={() => setAspect(aspect === '16:9' ? '4:3' : aspect === '4:3' ? '1:1' : '16:9')} style={filledPillBtn(t)}>
                  <Icon name="aspect" size={13}/> {aspect}
                </button>
              </>
            }/>

          {/* My Presentations section */}
          {myDecks.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '40px 0 14px' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                  My presentations <span style={{ color: t.textDim, fontWeight: 500, fontSize: 13 }}>({myDecks.length})</span>
                </h2>
                <button onClick={() => createDeckFromTemplate(0, true)} style={{
                  padding: '7px 14px', borderRadius: 18,
                  background: 'transparent', color: t.text,
                  border: `1px solid ${t.border}`,
                  cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <Icon name="plus" size={12}/> New deck
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 32 }}>
                {myDecks.map((d, i) => (
                  <DeckCard key={d.id} t={t} deck={d} index={i}
                    onOpen={() => setEditingDeckId(d.id)}
                    onDuplicate={() => duplicateDeck(d.id)}
                    onDelete={() => deleteDeck(d.id)}
                    formatRelative={formatRelative}/>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 24, marginTop: myDecks.length > 0 ? 16 : 48, borderBottom: `1px solid ${t.border}` }}>
            {['Explore', 'My Templates'].map(x => (
              <button key={x} onClick={() => setTab(x)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '10px 4px', fontSize: 14, fontWeight: 600,
                color: tab === x ? t.text : t.textDim,
                borderBottom: tab === x ? `2px solid ${t.text}` : '2px solid transparent',
                marginBottom: -1, fontFamily: 'inherit',
              }}>
                {x} {x === 'My Templates' && myTemplates.length > 0 && (
                  <span style={{ marginLeft: 4, fontSize: 11, padding: '1px 6px', borderRadius: 9, background: t.accentBg }}>{myTemplates.length}</span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22, marginBottom: 22, flexWrap: 'wrap' }}>
            <Dropdown t={t} label={styleFilter} options={['All Styles', 'Minimalist', 'Bold', 'Editorial']} onChange={setStyleFilter}/>
            <Dropdown t={t} label={themeFilter} options={['All Themes', 'Light', 'Dark', 'Colorful']} onChange={setThemeFilter}/>
            <Dropdown t={t} label={`Sort by: ${sortBy}`} options={['Popularity', 'Newest', 'Trending']} onChange={(v) => setSortBy(v.replace('Sort by: ', ''))}/>
          </div>

          {tab === 'My Templates' && myTemplates.length === 0 ? (
            <EmptyState t={t}
              title="No saved templates yet"
              body="Star templates from Explore and they'll appear here for quick access."
              cta="Browse Explore"
              onCta={() => setTab('Explore')}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {visibleTemplates.map((tpl, i) => (
                <SlideCard key={tpl.id} t={t} theme={theme} template={tpl} index={i}
                  saved={myTemplates.includes(tpl.id)}
                  onSave={() => toggleSave(tpl.id)}
                  onClick={() => {
                    if (tpl.type === 'add') { k?.toast('Upload your own .pptx or PDF — coming soon', 'info'); return; }
                    else setViewer({ index: i, blank: false });
                  }}/>
              ))}
            </div>
          )}
        </div>
      </div>
      {viewer !== null && (
        <TemplateViewer t={t} theme={theme} kind="slide"
          index={viewer.index} blank={viewer.blank}
          onClose={() => setViewer(null)}
          onUse={() => createDeckFromTemplate(viewer.index, viewer.blank)}/>
      )}
      {editingDeck && (
        <DeckEditor t={t} theme={theme} deck={editingDeck}
          onClose={() => setEditingDeckId(null)}
          onUpdate={(patch) => updateDeck(editingDeck.id, patch)}
          onDelete={() => deleteDeck(editingDeck.id)}/>
      )}
    </div>
  );
}

// ===== Card showing a saved deck in My Presentations =====
function DeckCard({ t, deck, index, onOpen, onDuplicate, onDelete, formatRelative }) {
  const [hover, setHover] = useState(false);
  const firstSlide = deck.slides[0] || { h: deck.name };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 12, padding: 10, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 8,
        transition: 'all 0.18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        animation: `fadeUp 0.4s ease-out ${index * 0.03}s both`,
        position: 'relative',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
      {/* Slide thumb */}
      <div style={{
        aspectRatio: '16 / 9', borderRadius: 8,
        background: '#ffffff',
        border: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '14px 16px', overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{ width: 36, height: 3, background: deck.accent, borderRadius: 2, marginBottom: 10 }}/>
        <div style={{
          fontSize: 12, fontWeight: 700, color: '#0a0a0d', lineHeight: 1.25,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{firstSlide.h}</div>
        {firstSlide.sub && (
          <div style={{
            fontSize: 8, color: '#666', marginTop: 4, lineHeight: 1.4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{firstSlide.sub}</div>
        )}
        <div style={{
          position: 'absolute', bottom: 6, right: 8,
          fontSize: 8, color: '#aaa', fontFamily: 'monospace',
        }}>1 / {deck.slides.length}</div>
      </div>
      {/* Meta */}
      <div style={{ padding: '4px 4px 2px' }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{deck.name}</div>
        <div style={{
          fontSize: 11, color: t.textDim, marginTop: 3, fontFamily: 'monospace',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>{deck.slides.length} slides</span>
          <span>·</span>
          <span>{formatRelative(deck.modified)}</span>
        </div>
      </div>
      {/* Hover actions */}
      {hover && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', gap: 4,
        }}>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate"
            style={{
              width: 26, height: 26, borderRadius: 13,
              background: 'rgba(255,255,255,0.95)', border: `1px solid ${t.border}`,
              color: '#0a0a0d', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete"
            style={{
              width: 26, height: 26, borderRadius: 13,
              background: 'rgba(239,68,68,0.95)', border: 'none',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <Icon name="trash" size={11}/>
          </button>
        </div>
      )}
    </div>
  );
}

// ===== Full-screen deck editor =====
function DeckEditor({ t, theme, deck, onClose, onUpdate, onDelete }) {
  const k = useKira();
  const [activeIdx, setActiveIdx] = useState(0);
  const [name, setName] = useState(deck.name);

  // Keep `name` synced if deck changes from outside
  useEffect(() => { setName(deck.name); }, [deck.id]);

  // Persist the name when blurred
  const commitName = () => {
    if (name.trim() && name !== deck.name) {
      onUpdate({ name: name.trim() });
    } else if (!name.trim()) {
      setName(deck.name);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        setActiveIdx(i => Math.min(i + 1, deck.slides.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setActiveIdx(i => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, deck.slides.length]);

  const active = deck.slides[activeIdx] || deck.slides[0];

  const updateSlide = (patch) => {
    const next = deck.slides.map((s, i) => i === activeIdx ? { ...s, ...patch } : s);
    onUpdate({ slides: next });
  };

  const addSlide = () => {
    const next = [...deck.slides, { h: 'New section', bullets: ['Point 1', 'Point 2'] }];
    onUpdate({ slides: next });
    setActiveIdx(next.length - 1);
    k?.toast('Slide added', 'success');
  };

  const deleteSlide = () => {
    if (deck.slides.length === 1) {
      k?.toast('Cannot delete the last slide', 'error');
      return;
    }
    const next = deck.slides.filter((_, i) => i !== activeIdx);
    onUpdate({ slides: next });
    setActiveIdx(Math.max(0, activeIdx - 1));
    k?.toast('Slide deleted', 'success');
  };

  const duplicateSlide = () => {
    const slideCopy = JSON.parse(JSON.stringify(active));
    const next = [...deck.slides];
    next.splice(activeIdx + 1, 0, slideCopy);
    onUpdate({ slides: next });
    setActiveIdx(activeIdx + 1);
    k?.toast('Slide duplicated', 'success');
  };

  const updateBullet = (i, val) => {
    const bullets = (active.bullets || []).map((b, idx) => idx === i ? val : b);
    updateSlide({ bullets });
  };

  const addBullet = () => {
    updateSlide({ bullets: [...(active.bullets || []), 'New point'] });
  };

  const deleteBullet = (i) => {
    updateSlide({ bullets: (active.bullets || []).filter((_, idx) => idx !== i) });
  };

  const exportDeck = () => {
    k?.toast(`Exporting "${deck.name}" as .pptx…`, 'info');
    setTimeout(() => {
      k?.toast('Export complete', 'success');
      k?.log('Exported deck', 'slides', deck.name);
    }, 900);
  };

  const present = () => {
    k?.toast('Presentation mode — coming soon', 'info');
  };

  return (
    <>
      {/* Full-screen overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: theme === 'dark' ? '#0a0a0d' : '#f6f5f0',
        display: 'flex', flexDirection: 'column',
        animation: 'fadeUp 0.2s ease-out',
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 22px',
          borderBottom: `1px solid ${t.border}`,
          background: t.panel,
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        }}>
          <button onClick={onClose} title="Back to slides"
            style={{
              background: 'transparent', border: 'none', color: t.text,
              cursor: 'pointer', padding: 8, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="arrow-left" size={16}/>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <div style={{ width: 4, height: 22, background: deck.accent, borderRadius: 2 }}/>
            <input value={name} onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: t.text, fontSize: 16, fontWeight: 600,
                fontFamily: 'inherit', width: '100%', minWidth: 100,
              }}/>
            <span style={{
              fontSize: 10.5, color: t.textDim, fontFamily: 'monospace',
              padding: '3px 8px', borderRadius: 8, background: t.hover,
              flexShrink: 0,
            }}>{deck.tag}</span>
          </div>
          <button onClick={exportDeck} style={{
            padding: '7px 14px', borderRadius: 8,
            background: 'transparent', border: `1px solid ${t.border}`,
            color: t.text, cursor: 'pointer',
            fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button onClick={present} style={{
            padding: '7px 16px', borderRadius: 8,
            background: '#2541F2', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            boxShadow: '0 4px 12px rgba(37,65,242,0.32)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
            Present
          </button>
        </div>

        {/* Body — sidebar of slide thumbs + main editor */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left — slide thumbnails */}
          <aside style={{
            width: 200, borderRight: `1px solid ${t.border}`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            background: t.panel,
          }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
              {deck.slides.map((s, i) => (
                <div key={i} onClick={() => setActiveIdx(i)}
                  style={{
                    padding: 4, marginBottom: 6, borderRadius: 7,
                    background: activeIdx === i ? t.hover : 'transparent',
                    border: `2px solid ${activeIdx === i ? deck.accent : 'transparent'}`,
                    cursor: 'pointer',
                    display: 'flex', gap: 8, alignItems: 'center',
                    transition: 'all 0.12s ease',
                  }}>
                  <div style={{
                    fontSize: 10, color: t.textDim, width: 18, textAlign: 'center',
                    fontFamily: 'monospace', flexShrink: 0,
                  }}>{i + 1}</div>
                  {/* Thumb */}
                  <div style={{
                    flex: 1, aspectRatio: '16 / 9',
                    background: '#fff', borderRadius: 4,
                    border: `1px solid ${t.border}`,
                    padding: '6px 7px', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', gap: 2,
                  }}>
                    <div style={{ width: 14, height: 1.5, background: deck.accent, borderRadius: 1 }}/>
                    <div style={{
                      fontSize: 6, fontWeight: 700, color: '#0a0a0d',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginTop: 1,
                    }}>{s.h}</div>
                    {s.sub && (
                      <div style={{ fontSize: 4.5, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.sub}</div>
                    )}
                    {s.bullets && s.bullets.slice(0, 3).map((b, k) => (
                      <div key={k} style={{ fontSize: 4.5, color: '#444', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {b}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: `1px solid ${t.border}` }}>
              <button onClick={addSlide} style={{
                width: '100%', padding: '8px 12px', borderRadius: 9,
                background: 'transparent', border: `1.5px dashed ${t.border}`,
                color: t.text, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.borderStrong; e.currentTarget.style.background = t.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = 'transparent'; }}>
                <Icon name="plus" size={12}/> Add slide
              </button>
            </div>
          </aside>

          {/* Main — slide editor */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            {/* Slide canvas */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: '100%', maxWidth: 880, aspectRatio: '16 / 9',
                background: '#ffffff',
                borderRadius: 14,
                border: `1px solid ${t.border}`,
                boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
                padding: '56px 64px',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
              }}>
                {/* Accent bar */}
                <div style={{ width: 64, height: 5, background: deck.accent, borderRadius: 3, marginBottom: 24 }}/>

                {/* Editable heading */}
                <input value={active.h}
                  onChange={(e) => updateSlide({ h: e.target.value })}
                  placeholder="Slide heading"
                  style={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    color: '#0a0a0d',
                    fontSize: active.isTitle ? 44 : 32,
                    fontWeight: 800, letterSpacing: '-0.02em',
                    fontFamily: 'inherit',
                    marginBottom: 14, padding: 0, lineHeight: 1.1,
                  }}/>

                {/* Sub or bullets */}
                {active.isTitle ? (
                  <input value={active.sub || ''}
                    onChange={(e) => updateSlide({ sub: e.target.value })}
                    placeholder="Subtitle"
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      color: '#555', fontSize: 20, fontFamily: 'inherit',
                      padding: 0, lineHeight: 1.4,
                    }}/>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                    {(active.bullets || []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, group: 'true' }}>
                        <div style={{
                          width: 8, height: 8, marginTop: 11, borderRadius: '50%',
                          background: deck.accent, flexShrink: 0,
                        }}/>
                        <input value={b}
                          onChange={(e) => updateBullet(i, e.target.value)}
                          placeholder="Bullet point"
                          style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: '#333', fontSize: 18, fontFamily: 'inherit',
                            padding: '4px 0', lineHeight: 1.5,
                          }}/>
                        <button onClick={() => deleteBullet(i)} title="Remove"
                          style={{
                            width: 26, height: 26, borderRadius: 6,
                            background: 'transparent', border: 'none', color: '#bbb',
                            cursor: 'pointer', flexShrink: 0, opacity: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'opacity 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; e.currentTarget.style.color = '#bbb'; }}>
                          <Icon name="x" size={13}/>
                        </button>
                      </div>
                    ))}
                    <button onClick={addBullet} style={{
                      alignSelf: 'flex-start', marginTop: 6,
                      padding: '6px 12px', borderRadius: 7,
                      background: 'transparent', border: `1px dashed #ddd`,
                      color: '#888', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#bbb'; e.currentTarget.style.color = '#555'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#888'; }}>
                      <Icon name="plus" size={11}/> Add bullet
                    </button>
                  </div>
                )}

                {/* Slide number */}
                <div style={{
                  position: 'absolute', bottom: 20, right: 28,
                  fontSize: 11, color: '#bbb', fontFamily: 'monospace',
                }}>{activeIdx + 1} / {deck.slides.length}</div>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 22px',
              borderTop: `1px solid ${t.border}`,
              background: t.panel,
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            }}>
              <button onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                disabled={activeIdx === 0}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'transparent', border: `1px solid ${t.border}`,
                  color: activeIdx === 0 ? t.textDim : t.text,
                  cursor: activeIdx === 0 ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: activeIdx === 0 ? 0.5 : 1,
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div style={{ fontSize: 12.5, color: t.textDim, fontFamily: 'monospace', minWidth: 60, textAlign: 'center' }}>
                {activeIdx + 1} / {deck.slides.length}
              </div>
              <button onClick={() => setActiveIdx(i => Math.min(deck.slides.length - 1, i + 1))}
                disabled={activeIdx === deck.slides.length - 1}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'transparent', border: `1px solid ${t.border}`,
                  color: activeIdx === deck.slides.length - 1 ? t.textDim : t.text,
                  cursor: activeIdx === deck.slides.length - 1 ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: activeIdx === deck.slides.length - 1 ? 0.5 : 1,
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <div style={{ flex: 1 }}/>
              <button onClick={duplicateSlide} style={{
                padding: '7px 12px', borderRadius: 8,
                background: 'transparent', border: `1px solid ${t.border}`,
                color: t.text, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Duplicate
              </button>
              <button onClick={deleteSlide} style={{
                padding: '7px 12px', borderRadius: 8,
                background: 'transparent', border: `1px solid ${t.border}`,
                color: t.text, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.border; }}>
                <Icon name="trash" size={12}/> Delete
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function SlideCard({ t, template, index, saved, onSave, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        aspectRatio: '16 / 10', borderRadius: 12, overflow: 'hidden',
        cursor: 'pointer', position: 'relative',
        background: template.type === 'add' ? t.cardBg : '#fff',
        border: `1px solid ${t.border}`,
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 28px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.22s ease',
        animation: `fadeUp 0.4s ease-out ${Math.min(index * 0.03, 0.5)}s both`,
      }}>
      {template.type === 'add' ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: t.textDim }}>
          <Icon name="plus" size={26}/>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{template.title}</span>
        </div>
      ) : (
        <>
          <SlidePreview type={template.type} title={template.title} accent={template.accent}/>
          {onSave && (hover || saved) && (
            <button onClick={(e) => { e.stopPropagation(); onSave(); }}
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 30, height: 30, borderRadius: 15,
                background: 'rgba(0,0,0,0.55)', border: 'none',
                color: saved ? '#fbbf24' : '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              }}>
              <Icon name="star" size={14} fill={saved ? '#fbbf24' : 'none'}/>
            </button>
          )}
        </>
      )}
    </div>
  );
}

function SlidePreview({ type, title, accent }) {
  switch (type) {
    case 'blue-circles':
      return (
        <div style={{ width: '100%', height: '100%', background: accent, position: 'relative', overflow: 'hidden', padding: '12px 16px', color: '#fff', fontFamily: 'serif' }}>
          <div style={{ position: 'absolute', right: -30, top: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(96,165,250,0.3)' }}/>
          <div style={{ position: 'absolute', right: -50, top: 30, width: 110, height: 110, borderRadius: '50%', background: 'rgba(147,197,253,0.25)' }}/>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 16, lineHeight: 1.15 }}>Transforming<br/>Customer<br/>Relations</div>
        </div>
      );
    case 'japanese':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', padding: 14, color: '#222' }}>
          <div style={{ fontSize: 5, color: '#0ea5e9' }}>► デジタルマーケティング部</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>マーケティング<br/><span style={{ color: '#0ea5e9' }}>戦略 2025</span></div>
          <div style={{ marginTop: 6, height: 10, background: '#0ea5e9', borderRadius: 1, width: '70%' }}/>
        </div>
      );
    case 'gray-ai':
      return (
        <div style={{ width: '100%', height: '100%', background: '#e2e8f0', position: 'relative', overflow: 'hidden', padding: 14 }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }}/>
          <div style={{ fontSize: 5, color: '#475569', fontWeight: 600 }}>TECHNOLOGY SOLUTIONS</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 22, color: '#1e293b', fontFamily: 'serif' }}>AI<br/>REVOLUTION</div>
        </div>
      );
    case 'corporate':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', padding: 14, color: '#0c4a6e' }}>
          <div style={{ position: 'absolute', right: -30, bottom: -30, width: 110, height: 110, borderRadius: '50%', background: '#bae6fd', opacity: 0.5 }}/>
          <div style={{ fontSize: 14, fontWeight: 700 }}>BUSINESS GROWTH &</div>
          <div style={{ fontSize: 7, color: '#0891b2', marginTop: 6 }}>Strategic Framework for</div>
        </div>
      );
    case 'digital-dark':
      return (
        <div style={{ width: '100%', height: '100%', background: '#0f172a', padding: 14, color: '#fff' }}>
          <div style={{ fontSize: 5, color: '#a78bfa' }}>‹ NEXUS INNOVATIONS</div>
          <div style={{ fontSize: 14, fontWeight: 800, marginTop: 16, letterSpacing: '-0.02em' }}>DIGITAL<br/>TRANSFORMATION<br/>STRATEGY</div>
          <div style={{ width: 30, height: 1, background: '#a78bfa', marginTop: 4 }}/>
        </div>
      );
    case 'healthcare':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', padding: 14, color: '#222', display: 'flex' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍⚕️</div>
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#0f766e', fontFamily: 'serif' }}>Complete Healthcare<br/>Guide</div>
          </div>
        </div>
      );
    case 'pro-people':
      return (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #f5f5f4 30%, #cbd5e1 100%)', padding: 14, display: 'flex' }}>
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: 6, color: '#71717a', fontWeight: 600 }}>Professional</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginTop: 2 }}>DEVELOPMENT</div>
          </div>
          <div style={{ flex: 1, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>👥</div>
        </div>
      );
    case 'green-tech':
      return (
        <div style={{ width: '100%', height: '100%', background: '#0a0a0a', padding: 14, color: '#fff' }}>
          <div style={{ fontSize: 13, color: '#bef264', fontWeight: 700, marginTop: 16, fontFamily: 'serif' }}>Digital Learning<br/>Innovation</div>
        </div>
      );
    case 'robot':
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <div style={{ flex: 1, background: '#1e3a8a', padding: 14, color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 10 }}>SmartFlow AI</div>
            <div style={{ fontSize: 6, marginTop: 4, color: '#bfdbfe' }}>スマートフロー AI</div>
          </div>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e40af, #312e81)', fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
        </div>
      );
    case 'orange':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', padding: 12, display: 'flex', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: -20, top: -10, bottom: -10, width: 90, background: '#ea580c', borderRadius: '50%' }}/>
          <div style={{ position: 'relative', width: 50, height: 50, borderRadius: '50%', background: '#fed7aa', marginRight: 8, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>👥</div>
          <div style={{ flex: 1, marginTop: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0c0a09' }}>STRATEGIC<br/>COMMUNICATION<br/>FOR LEADERSHIP</div>
          </div>
        </div>
      );
    case 'orange-stripe':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', padding: 14, color: '#0c0a09' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#f97316' }}/>
          <div style={{ paddingLeft: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, color: '#1e3a8a', fontFamily: 'serif' }}>BUSINESS<br/>STRATEGY</div>
          </div>
        </div>
      );
    case 'finance':
      return (
        <div style={{ width: '100%', height: '100%', background: '#fff', padding: 14, color: '#0c0a09' }}>
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'serif' }}>Financial Update<br/>for Investors</div>
        </div>
      );
    case 'soft-pink':
      return (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#831843', textAlign: 'right' }}>InnovateTech</div>
        </div>
      );
    default:
      return <div style={{ width: '100%', height: '100%', background: accent }}/>;
  }
}

// ============================================================
//  DOCS PAGE — split layout: prompt panel (left) + editor (right)
//  Matches the "Unleash the Power of AI Docs" reference design.
// ============================================================
const DOC_TYPES = ['Rich Text', 'Markdown', 'DOCX'];

function DocsPage({ t, theme, onBack }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [docType, setDocType] = useState('Rich Text');
  const [editorContent, setEditorContent] = useState('');
  const [font, setFont] = useState('Times');
  const [size, setSize] = useState('16');
  const [textStyle, setTextStyle] = useState('Normal Text');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>


      {/* ===== SPLIT LAYOUT ===== */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ===== LEFT PANEL — prompt + welcome ===== */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '60px 56px 24px',
          borderRight: `1px solid ${t.border}`,
          overflowY: 'auto',
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560, margin: '0 auto', width: '100%' }}>
            <h1 style={{
              fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
              textAlign: 'center', marginBottom: 22,
              animation: 'fadeUp 0.4s ease-out',
            }}>
              Unleash the Power of AI Docs
            </h1>
            <ul style={{
              listStyle: 'disc', paddingLeft: 22, color: t.text,
              fontSize: 15, lineHeight: 2,
              animation: 'fadeUp 0.5s ease-out 0.05s both',
            }}>
              <li>Draft docs from anything, such as ideas, links, web pages, or files</li>
              <li>Supports both AI editing and manual editing</li>
              <li>Rich Text and Markdown, pick the format you like</li>
            </ul>
          </div>

          {/* Sticky prompt box at the bottom of left panel */}
          <div style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            padding: '14px 16px 12px',
            marginTop: 24,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeUp 0.5s ease-out 0.1s both',
          }}>
            {/* Type pills row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>AI Docs</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {DOC_TYPES.map(dt => (
                  <button key={dt} onClick={() => setDocType(dt)} style={{
                    padding: '5px 11px', borderRadius: 12,
                    background: docType === dt ? t.text : 'transparent',
                    color: docType === dt ? t.bg : t.textDim,
                    border: 'none', cursor: 'pointer',
                    fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s ease',
                  }}>
                    {docType === dt && <Icon name="check" size={11}/>} {dt}
                  </button>
                ))}
                <button title="Collapse" style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: 'transparent', border: 'none', color: t.textDim,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: 4,
                }}>
                  <Icon name="chev-down" size={12}/>
                </button>
              </div>
            </div>

            {/* Prompt textarea */}
            <textarea value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your doc request here..."
              rows={2}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                color: t.text, fontSize: 14, lineHeight: 1.5,
                fontFamily: 'inherit', padding: '6px 0',
              }}/>

            {/* Bottom controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button title="Attach" style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: t.hover, border: `1px solid ${t.border}`, color: t.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="plus" size={14}/>
                </button>
                <button style={filledPillBtn(t)}>
                  <Icon name="standard" size={13}/> Standard
                  <Icon name="chev-down" size={10}/>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button title="Mic" style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: 'transparent', border: 'none', color: t.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="mic" size={15}/>
                </button>
                <button onClick={() => {
                    if (!prompt.trim()) return;
                    // Build a richer-looking generated draft
                    const lines = [
                      `# ${prompt.slice(0, 80)}`,
                      '',
                      'Executive Summary',
                      '',
                      `This document explores ${prompt.toLowerCase()}. The following sections cover the background, key findings, and next steps.`,
                      '',
                      'Background',
                      '',
                      'Over the past quarter, the team has been investigating this area in depth. Three principal themes have emerged from our work.',
                      '',
                      'Key Findings',
                      '',
                      '1. The most important consideration is timing — moving too early creates risk, but waiting forfeits momentum.',
                      '2. Stakeholder alignment is the second-largest determinant of success.',
                      '3. Measuring the right outcomes (not the easy ones) drives clarity.',
                      '',
                      'Recommendations',
                      '',
                      'Based on the findings above, we recommend three concrete next steps. Each is described in detail below, with owners and target dates.',
                      '',
                      '— Drafted by Kira AI Docs · ' + new Date().toLocaleString(),
                    ];
                    setEditorContent(lines.join('\n'));
                    k?.toast(`Document drafted from your prompt`, 'success');
                    k?.log(`Drafted ${docType} document`, 'docs', prompt.slice(0, 60));
                    setPrompt('');
                  }}
                  style={{
                    padding: '7px 16px', borderRadius: 18,
                    background: t.text, color: t.bg, border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Icon name="speak" size={13}/> Speak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL — editor ===== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {/* Editor toolbar */}
          <div style={{
            padding: '14px 22px',
            borderBottom: `1px solid ${t.border}`,
            background: t.panel,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {/* Row 1 — undo/redo, text style, font, size, bold/italic/underline/strike, align, lists */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                <button style={toolBtn(t)} title="Undo">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 14l-4-4 4-4"/><path d="M5 10h11a5 5 0 0 1 0 10h-3"/>
                  </svg>
                </button>
                <button style={toolBtn(t)} title="Redo">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14l4-4-4-4"/><path d="M19 10H8a5 5 0 0 0 0 10h3"/>
                  </svg>
                </button>
              </div>

              <Dropdown t={t} label={textStyle} options={['Normal Text', 'Heading 1', 'Heading 2', 'Heading 3', 'Quote']} onChange={setTextStyle}/>
              <Dropdown t={t} label={font} options={['Times', 'Inter', 'Helvetica', 'Georgia', 'JetBrains Mono']} onChange={setFont}/>

              <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${t.border}`, borderRadius: 8, padding: '0 4px', height: 30 }}>
                <input value={size} onChange={(e) => setSize(e.target.value)} style={{
                  width: 30, background: 'transparent', border: 'none', outline: 'none',
                  color: t.text, fontSize: 13, fontFamily: 'inherit', textAlign: 'center',
                }}/>
              </div>

              <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>

              <button style={toolBtn(t)} title="Bold"><b style={{ fontSize: 14 }}>B</b></button>
              <button style={toolBtn(t)} title="Italic"><i style={{ fontSize: 14, fontFamily: 'serif' }}>I</i></button>
              <button style={toolBtn(t)} title="Underline"><u style={{ fontSize: 14 }}>U</u></button>
              <button style={toolBtn(t)} title="Strikethrough"><s style={{ fontSize: 14 }}>S</s></button>

              <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>

              <button style={toolBtn(t)} title="Align left">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Align center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Align right">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
                </svg>
              </button>

              <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>

              <button style={toolBtn(t)} title="Numbered list">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
                  <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Bulleted list">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Indent">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8 7 12 3 16"/><line x1="11" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Outdent">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="7 8 3 12 7 16"/><line x1="11" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Line height">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Row 2 — color, highlight, image, link, table, marker, more */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button style={toolBtn(t)} title="Text color">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>A</span>
                  <span style={{ width: 12, height: 3, background: '#0a0a0d', borderRadius: 1 }}/>
                </div>
              </button>
              <button style={toolBtn(t)} title="Highlight">
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ width: 11, height: 11, background: '#fbbf24', borderRadius: 2 }}/>
                  <Icon name="chev-down" size={9}/>
                </div>
              </button>
              <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>
              <button style={toolBtn(t)} title="Image"><Icon name="image" size={14}/></button>
              <button style={toolBtn(t)} title="Link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="Table">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
                </svg>
              </button>
              <button style={toolBtn(t)} title="AI tools"><Icon name="sparkle" size={14}/></button>
              <button style={toolBtn(t)} title="More"><Icon name="chev-down" size={12}/></button>
            </div>
          </div>

          {/* Editor canvas */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 60px', background: t.bg }}>
            <div style={{
              maxWidth: 820, margin: '0 auto',
              background: theme === 'dark' ? '#16161c' : '#ffffff',
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              minHeight: 600,
              padding: '40px 48px',
              boxShadow: theme === 'dark' ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.06)',
            }}>
              {editorContent ? (
                <div style={{
                  fontFamily: font, fontSize: parseInt(size, 10) || 16,
                  color: t.text, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                }}>{editorContent}</div>
              ) : (
                <div>
                  <div style={{
                    fontFamily: font, fontSize: 32, fontWeight: 700,
                    color: t.text, marginBottom: 12, letterSpacing: '-0.01em',
                  }}>Start writing...</div>
                  <div style={{
                    fontFamily: font, fontSize: 15, color: t.textDim,
                  }}>Enter your content here</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const toolBtn = (t) => ({
  width: 30, height: 30, borderRadius: 7,
  background: 'transparent', border: 'none', color: t.text,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit', transition: 'background 0.12s ease',
});

// ============================================================
//  DESIGNER PAGE — matches the "Kira AI Designer" reference design
// ============================================================
const DESIGNER_TYPES = [
  { id: 'poster',      label: 'Poster',         preview: { type: 'cinema', bg: '#fb923c' } },
  { id: 'flyer',       label: 'Flyer',          preview: { type: 'volleyball' } },
  { id: 'product',     label: 'Product',        preview: { type: 'product', bg: '#dc2626' } },
  { id: 'menu',        label: 'Menu',           preview: { type: 'menu' } },
  { id: 'coupon',      label: 'Coupon',         preview: { type: 'coupon' } },
  { id: 'social',      label: 'Social Media',   preview: { type: 'social' } },
  { id: 'wallpaper',   label: 'Wallpaper',      preview: { type: 'wallpaper' } },
  { id: 'card',        label: 'Card & Invite',  preview: { type: 'card' } },
  { id: 'stylized',    label: 'Stylized Name',  preview: { type: 'stylized', text: 'Kanye West' } },
  { id: 'comic',       label: 'Comic',          preview: { type: 'comic' } },
  { id: 'meme',        label: 'Meme',           preview: { type: 'meme' } },
  { id: 'character',   label: 'Character',      preview: { type: 'character' } },
  { id: 'logo',        label: 'logo',           preview: { type: 'logo', text: 'Bellezza' } },
  { id: 'sticker',     label: 'Sticker',        preview: { type: 'sticker' } },
  { id: 'home',        label: 'Home Design',    preview: { type: 'home' } },
  { id: 'tshirt',      label: 'T-shirt',        preview: { type: 'tshirt' } },
];

// ===== Small icon-tile preview renderer for the type row =====
function TypePreview({ kind }) {
  const wrap = (children, bg, br = 14) => (
    <div style={{
      width: '100%', height: '100%', borderRadius: br,
      background: bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
  switch (kind.type) {
    case 'cinema':
      return wrap(
        <div style={{ color: '#fff', fontSize: 8, fontWeight: 900, textAlign: 'center', lineHeight: 1.1, letterSpacing: 0.5 }}>
          CINEMA<br/>CLUB
        </div>,
        'linear-gradient(135deg, #fb923c, #ea580c)'
      );
    case 'volleyball':
      return wrap(
        <div style={{ color: '#fff', fontSize: 7, fontWeight: 800, textAlign: 'center', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          VOLLEYBALL
        </div>,
        'linear-gradient(135deg, #1e3a8a, #1e293b)'
      );
    case 'product':
      return wrap(
        <div style={{ width: '40%', height: '70%', background: '#fbbf24', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}/>,
        'linear-gradient(135deg, #dc2626, #991b1b)'
      );
    case 'menu':
      return wrap(
        <div style={{ width: '50%', height: '50%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍜</div>,
        'linear-gradient(135deg, #fbbf24, #f59e0b)'
      );
    case 'coupon':
      return wrap(
        <div style={{ color: '#fff', textAlign: 'center', lineHeight: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 900 }}>50%</div>
          <div style={{ fontSize: 6, fontWeight: 700, marginTop: 1 }}>OFF</div>
        </div>,
        'linear-gradient(135deg, #f97316, #c2410c)'
      );
    case 'social':
      return wrap(
        <div style={{ width: '70%', height: '70%', background: 'linear-gradient(135deg, #fbbf24, #fb923c)', borderRadius: '50%', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: '15%', height: '4px', background: '#fff', borderRadius: 2 }}/>
        </div>,
        'linear-gradient(135deg, #fdba74, #fb923c)'
      );
    case 'wallpaper':
      return wrap(null, 'linear-gradient(135deg, #fbcfe8 0%, #c4b5fd 50%, #93c5fd 100%)');
    case 'card':
      return wrap(
        <div style={{ width: '80%', height: '70%', background: '#fff', borderRadius: 4, padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ height: 2, background: '#a855f7', borderRadius: 1, width: '60%' }}/>
          <div>
            <div style={{ height: 1.5, background: '#ccc', borderRadius: 1, width: '90%', marginBottom: 2 }}/>
            <div style={{ height: 1.5, background: '#ccc', borderRadius: 1, width: '70%' }}/>
          </div>
        </div>,
        'linear-gradient(135deg, #f9a8d4, #f472b6)'
      );
    case 'stylized':
      return wrap(
        <div style={{ color: '#fff', fontSize: 7, fontWeight: 900, fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', lineHeight: 1 }}>
          {kind.text || 'Stylized'}
        </div>,
        '#0a0a0d'
      );
    case 'comic':
      return wrap(
        <div style={{ color: '#fff', fontSize: 8, fontWeight: 900, fontFamily: 'serif' }}>L</div>,
        'radial-gradient(circle at 50% 40%, #525252, #171717)'
      );
    case 'meme':
      return wrap(
        <div style={{ color: '#fff', fontSize: 18 }}>😼</div>,
        'linear-gradient(135deg, #84cc16, #65a30d)'
      );
    case 'character':
      return wrap(
        <div style={{ width: '60%', height: '80%', background: 'linear-gradient(180deg, #fed7aa 30%, #1f2937 70%)', borderRadius: '40% 40% 4px 4px' }}/>,
        'linear-gradient(135deg, #fef3c7, #fde68a)'
      );
    case 'logo':
      return wrap(
        <div style={{ color: '#0a0a0d', fontSize: 8, fontFamily: 'serif', fontStyle: 'italic', fontWeight: 600 }}>{kind.text || 'logo'}</div>,
        '#ffffff'
      );
    case 'sticker':
      return wrap(
        <div style={{
          width: '70%', height: '70%', background: '#16a34a', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 6, fontWeight: 700, textAlign: 'center', padding: 2,
        }}>
          KIRA
        </div>,
        'linear-gradient(135deg, #84cc16, #22c55e)'
      );
    case 'home':
      return wrap(
        <div style={{ width: '60%', height: '50%', background: '#a3a3a3', borderRadius: 4 }}/>,
        'linear-gradient(135deg, #d4d4d4, #a3a3a3)'
      );
    case 'tshirt':
      return wrap(
        <div style={{ width: '70%', height: '70%', background: '#d1fae5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>👕</div>,
        'linear-gradient(135deg, #e5e7eb, #d1d5db)'
      );
    default:
      return wrap(null, '#475569');
  }
}

// ===== Rich poster gallery thumbnails =====
function PosterThumb({ index }) {
  const posters = [
    // 0 — Explore the Wild
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #fed7aa 0%, #fb923c 50%, #7c2d12 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%, #1f2937 25%, transparent 35%)' }}/>
        <div style={{ position: 'absolute', top: '10%', left: '8%', right: '8%', color: '#fff' }}>
          <div style={{ fontSize: 8, fontWeight: 800, lineHeight: 1, letterSpacing: -0.3 }}>EXPLORE<br/>THE WILD</div>
          <div style={{ fontSize: 6, fontStyle: 'italic', fontFamily: 'serif', marginTop: 6 }}>Mountain<br/>Expedition</div>
        </div>
        <div style={{ position: 'absolute', bottom: '8%', left: '8%', color: '#fff', fontSize: 7 }}>
          <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1 }}>40%</div>
          <div style={{ fontSize: 5 }}>SPECIAL OFFER</div>
        </div>
      </div>
    ),
    // 1 — SOCIAL Sneakers
    () => (
      <div style={{ width: '100%', height: '100%', background: '#fb923c', position: 'relative', padding: 6 }}>
        <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, letterSpacing: -0.5 }}>SOCIAL</div>
        <div style={{ color: '#fff', fontSize: 4, fontWeight: 700, marginTop: 2 }}>PREMIUM USED SNEAKERS</div>
        <div style={{
          position: 'absolute', bottom: '20%', left: '15%', right: '15%', height: '35%',
          background: '#1e3a8a', borderRadius: '60% 60% 50% 50%',
        }}/>
        <div style={{ position: 'absolute', bottom: '5%', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 4, fontWeight: 700 }}>
          QUALITY GUARANTEED
        </div>
      </div>
    ),
    // 2 — Vote Robert
    () => (
      <div style={{ width: '100%', height: '100%', background: '#fff', position: 'relative' }}>
        <div style={{ background: '#1e3a8a', color: '#fff', padding: '6px 4px 4px', fontSize: 7, fontWeight: 900, lineHeight: 1.1 }}>
          Vote<br/>Robert<br/>Thompson
        </div>
        <div style={{ background: '#e5e7eb', height: '40%' }}/>
        <div style={{ background: '#dc2626', color: '#fff', padding: '4px', fontSize: 8, fontWeight: 900 }}>PROGRESS</div>
        <div style={{ background: '#1e3a8a', color: '#fff', padding: '4px', fontSize: 8, fontWeight: 900 }}>FOR ALL</div>
      </div>
    ),
    // 3 — Sarah Chen
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #525252, #262626)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '8%', left: '10%', color: '#fff', fontSize: 6, fontWeight: 700 }}>🎾</div>
        <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 8 }}>👤</div>
        <div style={{ position: 'absolute', bottom: '5%', left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1 }}>SARAH CHEN</div>
          <div style={{ fontSize: 4, marginTop: 2 }}>Olympic Gold Medalist</div>
        </div>
      </div>
    ),
    // 4 — Genspark Designer (now: Kira Designer)
    () => (
      <div style={{ width: '100%', height: '100%', background: '#0a0a0d', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #fff 8%, transparent 30%)', mixBlendMode: 'screen', opacity: 0.15 }}/>
        <div style={{ color: '#fff', fontFamily: 'serif', fontStyle: 'italic', textAlign: 'center', lineHeight: 0.9 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Kira</div>
          <div style={{ fontSize: 10, marginTop: 2 }}>AI</div>
          <div style={{ fontSize: 9, marginTop: 1 }}>Designer</div>
        </div>
      </div>
    ),
    // 5 — Classical Crossover
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #1c1917, #0c0a09)', color: '#fef3c7', padding: 6, position: 'relative', textAlign: 'center' }}>
        <div style={{ fontSize: 4, fontStyle: 'italic', fontFamily: 'serif' }}>DAVID HARMONY'S</div>
        <div style={{ fontSize: 9, fontFamily: 'serif', fontWeight: 700, lineHeight: 1, marginTop: 2 }}>CLASSICAL<br/>CROSSOVER</div>
        <div style={{ marginTop: '40%', fontSize: 4 }}>05 NOV · 7pm</div>
        <div style={{ position: 'absolute', bottom: '5%', right: '8%', color: '#fef3c7', fontSize: 7, fontWeight: 900, fontFamily: 'serif' }}>$55</div>
      </div>
    ),
    // 6 — Digital Balance
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #ddd6fe, #c7d2fe)', padding: 5, position: 'relative' }}>
        <div style={{ color: '#4c1d95', fontSize: 8, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }}>
          DIGITAL<br/>BALANCE
        </div>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Set screen limits', 'Take regular breaks', 'Practice mindfulness'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', color: '#fff', fontSize: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{i+1}</div>
              <span style={{ fontSize: 4, color: '#4c1d95', fontWeight: 600 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    // 7 — Coffee shop
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #78350f, #451a03)', color: '#fef3c7', padding: 6, position: 'relative' }}>
        <div style={{ fontSize: 9, fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700 }}>Roasted</div>
        <div style={{ fontSize: 6, fontWeight: 700, opacity: 0.85, marginTop: 1 }}>SLOW BREW · LOCAL BEANS</div>
        <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, textAlign: 'center', fontSize: 14 }}>☕</div>
      </div>
    ),
    // 8 — Yoga retreat
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #fef3c7, #d4a574)', color: '#451a03', padding: 6, textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 4, letterSpacing: 1, fontWeight: 600 }}>BREATHE · STRETCH · BE</div>
        <div style={{ fontSize: 11, fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700, marginTop: 8 }}>Yoga<br/>Retreat</div>
        <div style={{ position: 'absolute', bottom: '8%', left: 0, right: 0, fontSize: 4 }}>JUNE 12 · BALI</div>
      </div>
    ),
    // 9 — Music festival
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #831843, #f59e0b)', color: '#fff', padding: 6, position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 900, lineHeight: 0.9 }}>SUMMER<br/>FEST</div>
        <div style={{ fontSize: 4, marginTop: 4 }}>JULY 18–20</div>
        <div style={{ position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', fontSize: 4, fontWeight: 700 }}>40+ ARTISTS · 3 STAGES</div>
      </div>
    ),
    // 10 — Tech conference
    () => (
      <div style={{ width: '100%', height: '100%', background: '#0a0a0d', color: '#22d3ee', padding: 6, position: 'relative' }}>
        <div style={{ fontSize: 4, letterSpacing: 2 }}>2026 · NEW YORK</div>
        <div style={{ fontSize: 10, fontWeight: 900, fontFamily: 'monospace', marginTop: 4, lineHeight: 1 }}>BUILD<br/>{'/'}AI</div>
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', color: '#fbbf24', fontSize: 5 }}>$299</div>
      </div>
    ),
    // 11 — Art exhibit
    () => (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fbcfe8, #fde68a)', color: '#7c2d12', padding: 6 }}>
        <div style={{ fontSize: 4, fontStyle: 'italic', fontFamily: 'serif' }}>An exhibition by</div>
        <div style={{ fontSize: 10, fontWeight: 900, fontFamily: 'serif', marginTop: 2, lineHeight: 1 }}>Maya<br/>Carter</div>
        <div style={{ marginTop: '40%', fontSize: 4 }}>OPENS MAR 8 · MoMA</div>
      </div>
    ),
  ];
  const Comp = posters[index % posters.length];
  return <Comp/>;
}

function DesignerPage({ t, theme, onBack }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [activeType, setActiveType] = useState('poster');
  const [viewer, setViewer] = useState(null);
  const activeLabel = DESIGNER_TYPES.find(d => d.id === activeType)?.label || 'Poster';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>


      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '24px 0 28px', fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Kira AI Designer
          </h1>

          {/* Single prompt box centered */}
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
              placeholder={`Design a ${activeLabel.toLowerCase()}...`}
              model="Standard" onModelChange={() => {}}
              onSubmit={() => {
                if (!prompt.trim()) return;
                k?.toast(`Designing a ${activeLabel.toLowerCase()}…`, 'info');
                setTimeout(() => {
                  k?.toast(`${activeLabel} ready: ${prompt.slice(0, 40)}`, 'success');
                  k?.log(`Designed a ${activeLabel}`, 'designer', prompt.slice(0, 60));
                  setViewer({ index: 1 + Math.floor(Math.random() * 11), blank: false });
                }, 900);
                setPrompt('');
              }}/>
          </div>

          {/* Type tiles row — flex wrap */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 18,
            justifyContent: 'center',
            marginTop: 44, marginBottom: 48,
          }}>
            {DESIGNER_TYPES.map((dt, i) => (
              <button key={dt.id} onClick={() => setActiveType(dt.id)}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  color: t.text, fontFamily: 'inherit', padding: 0,
                  width: 80,
                  animation: `fadeUp 0.4s ease-out ${i * 0.03}s both`,
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  width: 74, height: 74, borderRadius: 16,
                  background: t.cardBg,
                  padding: 6,
                  boxShadow: activeType === dt.id
                    ? `0 0 0 2px ${t.text}, 0 8px 24px rgba(0,0,0,0.25)`
                    : '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.18s ease',
                  overflow: 'hidden',
                }}>
                  <TypePreview kind={dt.preview}/>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 500, opacity: activeType === dt.id ? 1 : 0.85 }}>{dt.label}</span>
              </button>
            ))}
          </div>

          {/* Gallery title */}
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.01em' }}>
            {activeLabel}
          </h2>

          {/* Gallery grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
            {/* Blank tile first */}
            <div onClick={() => setViewer({ index: 0, blank: true })}
              style={{
                aspectRatio: '0.72', borderRadius: 10,
                cursor: 'pointer',
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.textDim,
                transition: 'all 0.18s ease',
                animation: 'fadeUp 0.4s ease-out both',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = t.borderStrong; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.border; }}>
              <Icon name="plus" size={26}/>
            </div>
            {/* 11 rich poster previews */}
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i + 1} onClick={() => setViewer({ index: i + 1, blank: false })}
                style={{
                  aspectRatio: '0.72', borderRadius: 10,
                  cursor: 'pointer',
                  background: '#0a0a0d',
                  border: `1px solid ${t.border}`,
                  overflow: 'hidden',
                  transition: 'all 0.18s ease',
                  animation: `fadeUp 0.4s ease-out ${Math.min((i + 1) * 0.03, 0.4)}s both`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <PosterThumb index={i}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      {viewer !== null && (
        <TemplateViewer t={t} theme={theme} kind="poster"
          index={viewer.index} blank={viewer.blank}
          onClose={() => setViewer(null)}/>
      )}
    </div>
  );
}

// ============================================================
//  IMAGE PAGE
// ============================================================
const QUICK_APPS = [
  { id: 'bg',     label: 'Background Remover' },
  { id: 'eraser', label: 'Magic Eraser' },
  { id: 'redraw', label: 'Magic Redraw' },
  { id: 'unblur', label: 'Photo Unblur' },
  { id: 'expand', label: 'Image Expand' },
];

// Inlined demo image data for the AI Image gallery
const DEMO_IMAGES = {
  kidsCity: 'data:image/jpeg;base64,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',
  boyGlobe: 'data:image/jpeg;base64,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',
  womanPortrait: 'data:image/jpeg;base64,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',
  womanLight: 'data:image/jpeg;base64,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',
  punkChibi: 'data:image/jpeg;base64,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',
};


function ImagePage({ t, theme, onBack }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [quality, setQuality] = useState('High');
  const [viewer, setViewer] = useState(null);

  // The 5 demo images are used as a rotating pool for "generated" results
  const demoPool = [
    { src: DEMO_IMAGES.kidsCity,      title: 'Kids in city street',     style: 'Illustration' },
    { src: DEMO_IMAGES.boyGlobe,      title: 'Boy with classroom globes',style: '3D Pixar' },
    { src: DEMO_IMAGES.womanPortrait, title: 'Woman in golden light',   style: 'Cinematic' },
    { src: DEMO_IMAGES.womanLight,    title: 'Cinematic dress portrait',style: 'Cinematic' },
    { src: DEMO_IMAGES.punkChibi,     title: 'Punk chibi with bat',     style: '3D Cartoon' },
  ];

  const generate = () => {
    if (!prompt.trim()) return;
    const pick = demoPool[Math.floor(Math.random() * demoPool.length)];
    const generatedImage = { ...pick, title: prompt.slice(0, 60), prompt };
    k?.toast(`Generating ${aspect} ${quality.toLowerCase()}-quality image…`, 'info');
    setTimeout(() => {
      k?.toast(`Image ready: "${prompt.slice(0, 30)}"`, 'success');
      k?.log(`Generated image`, 'image', prompt.slice(0, 60));
      setViewer({ index: 99, blank: false, image: generatedImage });
    }, 1100);
    setPrompt('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '40px 0 28px', fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' }}>Kira AI Image Generator</h1>

          <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
            placeholder="A futuristic city skyline at sunset…"
            onSubmit={generate}
            leftPills={
              <>
                <button style={filledPillBtn(t, true, '#a855f7')}><Icon name="sparkle" size={13}/> Kira Image v2</button>
                <button onClick={() => setAspect(aspect === '1:1' ? '16:9' : aspect === '16:9' ? '9:16' : '1:1')} style={filledPillBtn(t)}>
                  <Icon name="aspect" size={13}/> {aspect}
                </button>
                <button onClick={() => setQuality(quality === 'High' ? 'Ultra' : quality === 'Ultra' ? 'Standard' : 'High')} style={filledPillBtn(t)}>
                  <Icon name="settings" size={13}/> {quality}
                </button>
              </>
            }/>

          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '36px 0 14px' }}>Quick Apps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {QUICK_APPS.map((q, i) => (
              <button key={q.id} onClick={() => {
                k?.toast(`${q.label} — running on your last generation`, 'info');
                setTimeout(() => {
                  k?.toast(`${q.label} complete`, 'success');
                  k?.log(`Used ${q.label}`, 'image');
                }, 700);
              }}
                style={{
                  position: 'relative', aspectRatio: '2 / 1',
                  background: `linear-gradient(135deg, ${['#84cc16','#94a3b8','#f97316','#fbcfe8','#a78bfa'][i]}, ${['#16a34a','#475569','#dc2626','#f9a8d4','#6366f1'][i]})`,
                  border: 'none', borderRadius: 12,
                  cursor: 'pointer', padding: 14,
                  display: 'flex', alignItems: 'flex-end',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  fontFamily: 'inherit', textAlign: 'left',
                  animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`,
                }}>
                {q.label}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '36px 0 14px' }}>Recent generations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {[
              { src: DEMO_IMAGES.kidsCity,      title: 'Kids in city street',     style: 'Illustration', prompt: 'A diverse group of kids smiling on a sunny city street, cartoon style' },
              { src: DEMO_IMAGES.boyGlobe,      title: 'Boy with classroom globes',style: '3D Pixar',    prompt: 'A young boy in a globe-filled classroom, soft warm light, 3D animation' },
              { src: DEMO_IMAGES.womanPortrait, title: 'Woman in golden light',   style: 'Cinematic',    prompt: 'Cinematic portrait of a young woman, warm window light, soft focus' },
              { src: DEMO_IMAGES.womanLight,    title: 'Cinematic dress portrait',style: 'Cinematic',    prompt: 'Portrait of a woman in a white dress, dappled golden hour light' },
              { src: DEMO_IMAGES.punkChibi,     title: 'Punk chibi with bat',     style: '3D Cartoon',   prompt: 'Stylized 3D chibi punk character with bat and tattoos against graffiti wall' },
            ].map((g, i) => (
              <div key={i} onClick={() => setViewer({ index: i + 1, blank: false, image: g })}
                style={{
                  aspectRatio: '4 / 5', borderRadius: 10,
                  background: `#0a0a0d url(${g.src}) center/cover no-repeat`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'flex-end',
                  padding: 10,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  animation: `fadeUp 0.5s ease-out ${i * 0.07}s both`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                {/* Soft bottom gradient for label readability */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%',
                  background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))',
                  pointerEvents: 'none',
                }}/>
                <div style={{
                  position: 'relative', zIndex: 1,
                  color: '#fff',
                  fontSize: 11, fontWeight: 600,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  lineHeight: 1.3,
                }}>
                  <div style={{ fontSize: 9, opacity: 0.75, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 2, textTransform: 'uppercase' }}>
                    {g.style}
                  </div>
                  <div>{g.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {viewer !== null && (
        <TemplateViewer t={t} theme={theme} kind="image"
          index={viewer.index} blank={viewer.blank} image={viewer.image}
          onClose={() => setViewer(null)}/>
      )}
    </div>
  );
}

// ============================================================
//  WORKFLOWS PAGE
// ============================================================
const WORKFLOW_CATEGORIES = ['All', 'Email', 'Data', 'Marketing', 'Productivity'];

const WORKFLOW_TEMPLATES = [
  { id: 1,  title: 'Daily Spam Email Cleanup',     desc: 'Automatically scan inbox, classify and clean up spam and low-value promotions.', icons: ['outlook','gmail'], cat: 'Email',
    schedule: 'Daily at 6:00 AM',
    steps: [
      { label: 'Connect to Gmail and Outlook',                detail: 'Read-only scan of new messages from the last 24 hours' },
      { label: 'Classify each message',                       detail: 'Spam, promo, newsletter, or important — using Kira\'s classifier' },
      { label: 'Move low-value mail to a "Triaged" label',    detail: 'Original messages stay archived, never deleted' },
      { label: 'Email you a 3-line digest of what was moved', detail: 'Reply UNDO within 1 hour to revert anything' },
    ],
  },
  { id: 2,  title: 'Daily Unread Email Digest',    desc: 'Every morning at 8 AM, automatically check unread emails from the past 24h.', icons: ['gmail','outlook'], cat: 'Email',
    schedule: 'Daily at 8:00 AM',
    steps: [
      { label: 'Pull all unread mail from the last 24h' },
      { label: 'Rank by sender importance, thread urgency, and keywords you flag' },
      { label: 'Generate a 5-bullet morning briefing' },
      { label: 'Deliver as a single email + push to phone' },
    ],
  },
  { id: 3,  title: 'YouTube Channel Analysis',     desc: 'Comprehensive YouTube channel analysis that searches videos and researches trends.', icons: ['sparkle'], cat: 'Marketing',
    schedule: 'On demand',
    steps: [
      { label: 'Take a channel URL or handle' },
      { label: 'Fetch the last 30 videos and their analytics' },
      { label: 'Find rising topics across the niche' },
      { label: 'Output a content roadmap as a doc' },
    ],
  },
  { id: 4,  title: 'X Trend Analyzer',             desc: 'Search X/Twitter for posts related to a topic, analyze trends.', icons: ['x-twitter','sparkle'], cat: 'Marketing',
    schedule: 'Hourly',
    steps: [
      { label: 'Search X for posts about your keywords' },
      { label: 'Rank by engagement and sentiment' },
      { label: 'Cluster into themes' },
      { label: 'Slack you when a topic crosses your alert threshold' },
    ],
  },
  { id: 5,  title: 'AI News Daily Aggregator',     desc: 'Automatically search, filter, and aggregate AI news daily.', icons: ['outlook','sparkle'], cat: 'Productivity',
    schedule: 'Daily at 7:00 AM',
    steps: [
      { label: 'Scan 40+ AI-focused sources' },
      { label: 'Deduplicate and rank by signal' },
      { label: 'Summarize the top 10 stories' },
      { label: 'Email the digest before standup' },
    ],
  },
  { id: 6,  title: 'Stock Data Analysis',          desc: 'AI-powered stock analysis with fundamentals and investment insights.', icons: ['sparkle'], cat: 'Data',
    schedule: 'Weekly on Fridays',
    steps: [
      { label: 'Pull fundamentals for tickers on your watchlist' },
      { label: 'Compute valuation ratios and YoY changes' },
      { label: 'Compare against sector medians' },
      { label: 'Generate a 1-page report per ticker' },
    ],
  },
  { id: 7,  title: 'Email Attachment Saver',       desc: 'Automatically download email attachments to Drive when new emails arrive.', icons: ['drive-color','outlook'], cat: 'Email',
    schedule: 'Real-time',
    steps: [
      { label: 'Watch for new mail with attachments' },
      { label: 'Save attachments to a structured Drive folder by sender' },
      { label: 'Tag the email "Saved"' },
      { label: 'Optional: OCR PDFs into searchable text' },
    ],
  },
  { id: 8,  title: 'Email Receipt to Sheets',      desc: 'Automatically process expense receipts from emails.', icons: ['sheets-color','outlook'], cat: 'Data',
    schedule: 'Real-time',
    steps: [
      { label: 'Detect receipt emails from common vendors' },
      { label: 'Extract date, vendor, amount, category' },
      { label: 'Append rows to your expense sheet' },
      { label: 'Email you a weekly category summary' },
    ],
  },
  { id: 9,  title: 'Weekly Project Report',        desc: 'Generate weekly project status reports from team activity.', icons: ['sparkle','outlook'], cat: 'Productivity',
    schedule: 'Weekly on Mondays',
    steps: [
      { label: 'Aggregate commits, issues, and docs changed last week' },
      { label: 'Group by project and contributor' },
      { label: 'Write a stakeholder-friendly summary' },
      { label: 'Email it to project leads by 9 AM' },
    ],
  },
];

function WorkflowsPage({ t, theme, onBack, myWorkflows, setMyWorkflows }) {
  const k = useKira();
  const [category, setCategory] = useState('All');
  const [detail, setDetail] = useState(null); // workflow object when modal is open
  const [search, setSearch] = useState('');

  // Per-workflow runtime state: { [id]: { enabled, lastRun, runCount } }
  // Persisted to localStorage separately so we don't break the existing "myWorkflows" array contract.
  const [wfState, setWfState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage?.getItem('kira-wf-state');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {};
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-wf-state', JSON.stringify(wfState)); } catch {}
  }, [wfState]);

  const filtered = WORKFLOW_TEMPLATES.filter(w => {
    if (category !== 'All' && w.cat !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!w.title.toLowerCase().includes(q) && !w.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const myWfList = WORKFLOW_TEMPLATES.filter(w => myWorkflows.includes(w.id));

  const toggleMine = (id) => {
    setMyWorkflows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const setWfField = (id, patch) => {
    setWfState(prev => ({ ...prev, [id]: { enabled: true, lastRun: null, runCount: 0, ...prev[id], ...patch } }));
  };

  const runWorkflow = (w) => {
    const now = new Date().toISOString();
    const cur = wfState[w.id] || { enabled: true, lastRun: null, runCount: 0 };
    setWfField(w.id, { lastRun: now, runCount: (cur.runCount || 0) + 1 });
    k?.toast(`Running: ${w.title}`, 'success');
    k?.log(`Ran workflow: ${w.title}`, 'workflow');
  };

  const addAndRun = (w) => {
    if (!myWorkflows.includes(w.id)) toggleMine(w.id);
    setWfField(w.id, { enabled: true });
    runWorkflow(w);
    setDetail(null);
  };

  const formatRelative = (iso) => {
    if (!iso) return 'Never run';
    const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>Automate your work</h1>
            <p style={{ margin: '6px 0 0', color: t.textDim, fontSize: 14.5 }}>Create Workflows to manage tasks</p>
          </div>

          {/* My Workflows */}
          <h2 style={{ margin: '36px 0 12px', fontSize: 16, fontWeight: 700 }}>
            My Workflows {myWfList.length > 0 && <span style={{ color: t.textDim, fontWeight: 500 }}>({myWfList.length})</span>}
          </h2>
          {myWfList.length === 0 ? (
            <EmptyState t={t}
              title="No workflows yet"
              body="Create your first workflow to automate your tasks"
              cta="Browse templates"
              onCta={() => document.querySelector('[data-templates-section]')?.scrollIntoView({ behavior: 'smooth' })}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {myWfList.map((w, i) => {
                const s = wfState[w.id] || { enabled: true, lastRun: null, runCount: 0 };
                return (
                  <div key={w.id}
                    onClick={() => setDetail(w)}
                    style={{
                      background: t.cardBg, border: `1px solid ${t.border}`,
                      borderRadius: 14, padding: 16, cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', gap: 10,
                      transition: 'all 0.18s ease',
                      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                      animation: `fadeUp 0.4s ease-out ${i * 0.03}s both`,
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = t.borderStrong; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.border; }}>

                    {/* Top row: icons + status dot + on/off toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {w.icons.map((ic, k) => (
                          <Icon key={k} name={ic} size={18}/>
                        ))}
                        <span style={{
                          marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 5,
                          fontSize: 11, color: s.enabled ? '#10b981' : t.textDim, fontFamily: 'monospace',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.enabled ? '#10b981' : '#9ca3af' }}/>
                          {s.enabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      {/* Enable / disable toggle */}
                      <button onClick={(e) => { e.stopPropagation(); setWfField(w.id, { enabled: !s.enabled }); }}
                        title={s.enabled ? 'Pause' : 'Resume'}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: 4, color: t.text, opacity: 0.7,
                        }}>
                        {s.enabled ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
                        )}
                      </button>
                    </div>

                    {/* Title + desc */}
                    <div>
                      <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{w.title}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: t.textDim, lineHeight: 1.45 }}>{w.desc}</p>
                    </div>

                    <div style={{ flex: 1 }}/>

                    {/* Meta: last run + schedule */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: t.textDim, fontFamily: 'monospace' }}>
                      <Icon name="clock" size={11}/>
                      <span>{formatRelative(s.lastRun)}</span>
                      <span>·</span>
                      <span>{s.runCount || 0} run{(s.runCount || 0) === 1 ? '' : 's'}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <button onClick={(e) => { e.stopPropagation(); runWorkflow(w); }}
                        style={{
                          flex: 1, padding: '8px 12px', borderRadius: 9,
                          background: t.text, color: t.bg, border: 'none',
                          fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
                        Run now
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleMine(w.id); }}
                        title="Remove from my workflows"
                        style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: 'transparent', border: `1px solid ${t.border}`, color: t.textDim,
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = t.textDim; e.currentTarget.style.borderColor = t.border; }}>
                        <Icon name="trash" size={13}/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Templates header + search */}
          <div data-templates-section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '36px 0 14px', flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Start from Template</h2>
            <div style={{ position: 'relative' }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates…"
                style={{
                  width: 220, padding: '7px 12px 7px 32px',
                  background: t.cardBg, border: `1px solid ${t.border}`,
                  borderRadius: 9, color: t.text,
                  fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}/>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: t.textDim, pointerEvents: 'none' }}>
                <Icon name="search" size={13}/>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {WORKFLOW_CATEGORIES.map(c => {
              const count = c === 'All' ? WORKFLOW_TEMPLATES.length : WORKFLOW_TEMPLATES.filter(w => w.cat === c).length;
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: '7px 16px', borderRadius: 22,
                  background: category === c ? t.text : 'transparent',
                  color: category === c ? t.bg : t.text,
                  border: `1px solid ${category === c ? t.text : t.border}`,
                  cursor: 'pointer', fontSize: 13, fontWeight: category === c ? 600 : 500, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s ease',
                }}>
                  {c}
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Template grid */}
          {filtered.length === 0 ? (
            <EmptyState t={t}
              title={search ? `No templates match "${search}"` : 'No templates in this category yet'}
              body={search ? 'Try a different keyword or category.' : 'Pick another category above.'}
              cta="Show all templates"
              onCta={() => { setSearch(''); setCategory('All'); }}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {filtered.map((w, i) => (
                <WorkflowCard key={w.id} t={t} wf={w} index={i}
                  saved={myWorkflows.includes(w.id)}
                  onClick={() => setDetail(w)}
                  onToggle={() => toggleMine(w.id)}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== WORKFLOW DETAIL MODAL ===== */}
      {detail && (
        <WorkflowDetailModal t={t} theme={theme} wf={detail}
          isSaved={myWorkflows.includes(detail.id)}
          state={wfState[detail.id] || { enabled: true, lastRun: null, runCount: 0 }}
          onClose={() => setDetail(null)}
          onSave={() => toggleMine(detail.id)}
          onRun={() => runWorkflow(detail)}
          onAddAndRun={() => addAndRun(detail)}
          onToggleEnabled={() => setWfField(detail.id, { enabled: !(wfState[detail.id]?.enabled ?? true) })}
          formatRelative={formatRelative}/>
      )}
    </div>
  );
}

function WorkflowCard({ t, wf, index, saved, onClick, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 14, padding: 18, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 8,
        minHeight: 140, transition: 'all 0.18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        position: 'relative',
        animation: `fadeUp 0.4s ease-out ${index * 0.03}s both`,
      }}>
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }}
        title={saved ? 'Remove from my workflows' : 'Save to my workflows'}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: saved ? '#fbbf24' : t.textDim, padding: 4,
        }}>
        <Icon name="star" size={15} fill={saved ? '#fbbf24' : 'none'}/>
      </button>
      <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: t.text, lineHeight: 1.25, paddingRight: 22 }}>{wf.title}</h3>
      <p style={{ margin: 0, fontSize: 12.5, color: t.textDim, lineHeight: 1.45 }}>{wf.desc}</p>
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {wf.icons.map((ic, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <Icon name={ic} size={18}/>
            </span>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.3 }}>
          {wf.cat.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ===== Workflow detail modal =====
function WorkflowDetailModal({ t, theme, wf, isSaved, state, onClose, onSave, onRun, onAddAndRun, onToggleEnabled, formatRelative }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        zIndex: 100, animation: 'fadeUp 0.18s ease-out',
      }}/>
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(720px, 94vw)', maxHeight: '88vh',
        background: t.panelStrong, color: t.text,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${t.borderStrong}`, borderRadius: 18,
        zIndex: 101, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.22s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 26px 18px',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {wf.icons.map((ic, i) => <Icon key={i} name={ic} size={18}/>)}
              <span style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, marginLeft: 4 }}>
                {wf.cat.toUpperCase()}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>{wf.title}</h2>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: t.textDim, lineHeight: 1.55 }}>{wf.desc}</p>
          </div>
          <button onClick={onClose} style={{
            background: t.hover, border: 'none', color: t.textDim,
            width: 30, height: 30, borderRadius: 15, cursor: 'pointer',
            fontSize: 16, fontFamily: 'inherit', flexShrink: 0,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px' }}>
          {/* Schedule + status row */}
          <div style={{
            display: 'flex', gap: 16, flexWrap: 'wrap',
            marginBottom: 22,
          }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>
                Schedule
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={14}/> {wf.schedule || 'On demand'}
              </div>
            </div>
            {isSaved && (
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>
                  Last run
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'monospace' }}>
                  {formatRelative(state.lastRun)} · {state.runCount || 0} total
                </div>
              </div>
            )}
            {isSaved && (
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>
                  Status
                </div>
                <button onClick={onToggleEnabled} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 10,
                  background: state.enabled ? '#10b98122' : t.hover,
                  border: `1px solid ${state.enabled ? '#10b98155' : t.border}`,
                  color: state.enabled ? '#10b981' : t.textDim,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: state.enabled ? '#10b981' : '#9ca3af' }}/>
                  {state.enabled ? 'Active' : 'Paused'}
                </button>
              </div>
            )}
          </div>

          {/* Steps */}
          <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>
            How it works
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(wf.steps || []).map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '12px 14px',
                background: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: 11,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 13,
                  background: t.text, color: t.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{step.label}</div>
                  {step.detail && (
                    <div style={{ fontSize: 12, color: t.textDim, marginTop: 3, lineHeight: 1.5 }}>{step.detail}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '14px 26px',
          borderTop: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <button onClick={onSave}
            style={{
              padding: '9px 16px', borderRadius: 10,
              background: isSaved ? t.hover : 'transparent',
              border: `1px solid ${t.border}`,
              color: t.text,
              cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
            <Icon name="star" size={13} fill={isSaved ? '#fbbf24' : 'none'}/>
            {isSaved ? 'Saved' : 'Save to my workflows'}
          </button>
          <div style={{ flex: 1 }}/>
          {isSaved ? (
            <button onClick={onRun}
              style={{
                padding: '9px 18px', borderRadius: 10,
                background: '#2541F2', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(37,65,242,0.32)',
              }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20"/></svg>
              Run now
            </button>
          ) : (
            <button onClick={onAddAndRun}
              style={{
                padding: '9px 18px', borderRadius: 10,
                background: '#2541F2', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(37,65,242,0.32)',
              }}>
              <Icon name="plus" size={13}/>
              Add and run
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
//  CHAT PAGE
// ============================================================
function ChatPage({ t, theme, onBack }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm Kira AI Chat. Ask me anything." },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const aiReply = (q) => {
    q = q.toLowerCase();
    if (q.startsWith('hi') || q.startsWith('hello')) return "Hey there! What can I help you with today?";
    if (q.includes('kira')) return "Kira is your AI workspace — agents for slides, docs, design, image, video, automation, all in one place.";
    if (q.endsWith('?')) return "Good question. Short answer: yes — though it depends on context. Want me to go deeper?";
    return `Got it — "${q}". Want me to break this into steps, draft something, or just answer it directly?`;
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }, { role: 'ai', text: '…' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => prev.map((m, i, arr) => i === arr.length - 1 ? { role: 'ai', text: aiReply(userMsg) } : m));
    }, 850);
  };

  const suggestions = [
    'Draft a project kickoff email',
    'Compare Python vs Rust for ML',
    '10 startup name ideas for a coffee app',
    'Explain transformers simply',
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.25s ease-out',
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px', borderRadius: 18,
                background: m.role === 'user' ? (theme === 'dark' ? '#fff' : '#0a0a0d') : t.panel,
                color: m.role === 'user' ? (theme === 'dark' ? '#0a0a0d' : '#fff') : t.text,
                border: m.role === 'ai' ? `1px solid ${t.border}` : 'none',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap',
              }}>{m.text}</div>
            </div>
          ))}
          {messages.length === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 28 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  background: t.cardBg, border: `1px solid ${t.border}`,
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 12, padding: '12px 14px',
                  textAlign: 'left', color: t.text, fontSize: 13, fontFamily: 'inherit',
                  cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '0 24px 24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{
          background: t.panel,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${t.border}`,
          borderRadius: 22, padding: 12,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Ask anything…"
            style={{
              flex: 1, background: 'transparent', padding: '4px 8px',
              border: 'none', outline: 'none', color: t.text,
              fontSize: 14, fontFamily: 'inherit',
            }}/>
          <button onClick={send} disabled={!input.trim()} style={{
            padding: '8px 16px', borderRadius: 16,
            background: theme === 'dark' ? '#fff' : '#0a0a0d',
            color: theme === 'dark' ? '#0a0a0d' : '#fff',
            border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.5,
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="send" size={14}/> Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  DRIVE PAGE
// ============================================================
const DRIVE_FILES = [
  { id: 1, name: 'Q4 Strategy Deck.pptx',          type: 'slides',   size: '4.2 MB', mod: 'May 14' },
  { id: 2, name: 'Customer Personas — Final.docx', type: 'docs',     size: '820 KB', mod: 'May 12' },
  { id: 3, name: 'Brand Logo v3.svg',              type: 'designer', size: '128 KB', mod: 'May 10' },
  { id: 4, name: 'Product Hero Render.png',        type: 'image',    size: '2.1 MB', mod: 'May 09' },
  { id: 5, name: 'Daily Spam Cleanup.workflow',    type: 'workflow', size: '12 KB',  mod: 'May 08' },
  { id: 6, name: 'Investor One-Pager.pdf',         type: 'docs',     size: '1.4 MB', mod: 'May 05' },
  { id: 7, name: 'Summer Campaign Poster.png',     type: 'image',    size: '3.6 MB', mod: 'May 03' },
  { id: 8, name: 'Roadmap.pptx',                   type: 'slides',   size: '5.8 MB', mod: 'May 01' },
];

function DrivePage({ t, theme, onBack }) {
  const k = useKira();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const fileInputRef = useRef(null);

  // Real file list — start with seed, persist additions and deletions
  const [files, setFiles] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-drive');
      if (raw) return JSON.parse(raw);
    } catch {}
    return DRIVE_FILES;
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-drive', JSON.stringify(files)); } catch {}
  }, [files]);

  const detectType = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['ppt','pptx','key'].includes(ext)) return 'slides';
    if (['doc','docx','pdf','txt','md','rtf'].includes(ext)) return 'docs';
    if (['png','jpg','jpeg','gif','webp','heic','svg','avif'].includes(ext)) return 'image';
    if (['ai','psd','sketch','fig'].includes(ext)) return 'designer';
    if (['workflow','json','yaml','yml'].includes(ext)) return 'workflow';
    return 'docs';
  };

  const formatSize = (bytes) => {
    if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const handleUpload = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const newFiles = picked.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      type: detectType(f.name),
      size: formatSize(f.size),
      mod: 'Just now',
    }));
    setFiles(prev => [...newFiles, ...prev]);
    k?.toast(`Uploaded ${picked.length} file${picked.length === 1 ? '' : 's'}`, 'success');
    k?.log(`Uploaded to Drive`, 'drive', picked.map(f => f.name).join(', ').slice(0, 60));
    e.target.value = '';
  };

  const deleteFile = (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    k?.toast(`Deleted: ${name}`, 'success');
    k?.log(`Deleted from Drive`, 'trash', name);
  };

  const openFile = (f) => {
    k?.toast(`Opening ${f.name}`, 'info');
    k?.log(`Opened ${f.name}`, iconFor(f.type));
  };

  const filtered = files.filter(f => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const colorFor = (type) => ({ slides: '#0ea5e9', docs: '#2563eb', designer: '#6366f1', image: '#a855f7', workflow: '#10b981' }[type] || t.text);
  const iconFor = (type) => ({ slides: 'slides', docs: 'docs', designer: 'designer', image: 'image', workflow: 'workflow' }[type] || 'docs');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 8,
              background: t.panel, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${t.border}`, borderRadius: 12, padding: '8px 14px',
            }}>
              <Icon name="search" size={15}/>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Kira Cloud…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13.5, fontFamily: 'inherit' }}/>
            </div>
            <input ref={fileInputRef} type="file" multiple onChange={handleUpload} style={{ display: 'none' }}/>
            <button onClick={() => fileInputRef.current?.click()} style={{
              background: t.chipActiveBg, color: t.chipActiveText, border: 'none',
              padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="plus" size={13}/> Upload
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {[{ k: 'all', l: 'All' }, { k: 'slides', l: 'Slides' }, { k: 'docs', l: 'Docs' }, { k: 'designer', l: 'Designs' }, { k: 'image', l: 'Images' }, { k: 'workflow', l: 'Workflows' }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{
                padding: '6px 14px', borderRadius: 18,
                background: filter === f.k ? t.chipActiveBg : 'transparent',
                color: filter === f.k ? t.chipActiveText : t.text,
                border: `1px solid ${filter === f.k ? 'transparent' : t.border}`,
                cursor: 'pointer', fontSize: 12.5, fontWeight: 500, fontFamily: 'inherit',
              }}>{f.l}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState t={t} title="No files match" body="Try a different search or filter."/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {filtered.map((f, i) => (
                <DriveFileCard key={f.id} t={t} f={f} i={i}
                  colorFor={colorFor} iconFor={iconFor}
                  onOpen={() => openFile(f)}
                  onDelete={() => deleteFile(f.id, f.name)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Per-file card with hover delete
function DriveFileCard({ t, f, i, colorFor, iconFor, onOpen, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 12, padding: 14, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
        color: t.text, fontFamily: 'inherit',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        textAlign: 'left',
        animation: `fadeUp 0.3s ease-out ${i * 0.02}s both`,
        transition: 'all 0.15s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
      }}>
      {hover && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete"
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 24, height: 24, borderRadius: 12,
            background: 'rgba(239,68,68,0.15)', border: 'none',
            color: '#ef4444', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Icon name="trash" size={12}/>
        </button>
      )}
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: `${colorFor(f.type)}20`, color: colorFor(f.type),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={iconFor(f.type)} size={20}/>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word' }}>{f.name}</div>
      <div style={{ fontSize: 11, color: t.textDim }}>{f.size} · {f.mod}</div>
    </div>
  );
}

// ============================================================
//  TEAMS PAGE
// ============================================================
function TeamsPage({ t, theme, onBack }) {
  const k = useKira();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-team');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 1, name: 'You',            email: 'you@kira.app',   role: 'Owner',  color: '#2541F2', status: 'online' },
      { id: 2, name: 'Maya Chen',      email: 'maya@kira.app',  role: 'Editor', color: '#a855f7', status: 'online' },
      { id: 3, name: 'David Park',     email: 'david@kira.app', role: 'Editor', color: '#16a34a', status: 'away' },
      { id: 4, name: 'Sarah Mitchell', email: 'sarah@kira.app', role: 'Viewer', color: '#dc2626', status: 'offline' },
      { id: 5, name: 'Alex Rodriguez', email: 'alex@kira.app',  role: 'Editor', color: '#f59e0b', status: 'online' },
    ];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-team', JSON.stringify(members)); } catch {}
  }, [members]);

  const addMember = (name, email, role) => {
    const palette = ['#dc2626','#16a34a','#a855f7','#f59e0b','#0ea5e9','#ec4899','#8b5cf6','#10b981'];
    const newMember = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      color: palette[Math.floor(Math.random() * palette.length)],
      status: 'offline',
    };
    setMembers(prev => [...prev, newMember]);
    k?.toast(`Invited ${name} as ${role}`, 'success');
    k?.log(`Invited ${name}`, 'teams', email);
  };

  const updateRole = (id, role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    k?.toast('Role updated', 'success');
  };

  const removeMember = (id, name) => {
    if (!confirm(`Remove ${name} from the workspace?`)) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    k?.toast(`${name} removed`, 'success');
    k?.log(`Removed ${name} from team`, 'teams');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Workspace</h1>
              <p style={{ margin: '6px 0 0', color: t.textDim, fontSize: 14 }}>
                {members.length} members · {members.filter(m => m.status === 'online').length} online
              </p>
            </div>
            <button onClick={() => setInviteOpen(true)} style={{
              background: t.chipActiveBg, color: t.chipActiveText,
              border: 'none', padding: '9px 16px', borderRadius: 18,
              cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="plus" size={13}/> Invite member
            </button>
          </div>

          <div style={{
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 14, overflow: 'hidden',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          }}>
            {members.map((m, i) => (
              <TeamMemberRow key={m.id} t={t} m={m} theme={theme}
                isLast={i === members.length - 1}
                onRoleChange={(r) => updateRole(m.id, r)}
                onRemove={() => removeMember(m.id, m.name)}/>
            ))}
          </div>
        </div>
      </div>

      {inviteOpen && <InviteModal t={t} theme={theme} onClose={() => setInviteOpen(false)} onInvite={addMember}/>}
    </div>
  );
}

// Each team member row with role dropdown and remove button
function TeamMemberRow({ t, theme, m, isLast, onRoleChange, onRemove }) {
  const [hover, setHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = m.role === 'Owner';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px',
        borderBottom: !isLast ? `1px solid ${t.border}` : 'none',
        background: hover ? t.hover : 'transparent',
        transition: 'background 0.12s ease',
        position: 'relative',
      }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: m.color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, position: 'relative', flexShrink: 0,
      }}>
        {m.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
        <span style={{
          position: 'absolute', bottom: -1, right: -1,
          width: 10, height: 10, borderRadius: '50%',
          background: m.status === 'online' ? '#22c55e' : m.status === 'away' ? '#fbbf24' : '#71717a',
          border: `2px solid ${theme === 'dark' ? '#0a0a0d' : '#f6f5f0'}`,
        }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{m.name}</div>
        <div style={{ fontSize: 12, color: t.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => !isOwner && setMenuOpen(o => !o)}
          style={{
            padding: '4px 10px', borderRadius: 12,
            background: isOwner ? '#fbbf2425' : t.hover,
            color: isOwner ? '#fbbf24' : t.textDim,
            fontSize: 11, fontWeight: 600,
            border: 'none', cursor: isOwner ? 'default' : 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
          {m.role}
          {!isOwner && <Icon name="chev-down" size={10}/>}
        </button>
        {menuOpen && !isOwner && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }}/>
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 41,
              background: t.panelStrong, backdropFilter: 'blur(20px)',
              border: `1px solid ${t.borderStrong}`, borderRadius: 10,
              minWidth: 130, overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}>
              {['Editor', 'Viewer'].map(r => (
                <button key={r} onClick={() => { onRoleChange(r); setMenuOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 12px',
                    background: m.role === r ? t.hover : 'transparent',
                    color: t.text, border: 'none', cursor: 'pointer',
                    fontSize: 12.5, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  {m.role === r && <Icon name="check" size={11}/>}
                  <span style={{ marginLeft: m.role === r ? 0 : 17 }}>{r}</span>
                </button>
              ))}
              <div style={{ height: 1, background: t.border }}/>
              <button onClick={() => { setMenuOpen(false); onRemove(); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px',
                  background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer',
                  fontSize: 12.5, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <Icon name="trash" size={11}/> Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Invite modal
function InviteModal({ t, theme, onClose, onInvite }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Editor');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    if (!email.trim() || !name.trim()) return;
    onInvite(name, email, role);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        zIndex: 200,
      }}/>
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(440px, 94vw)',
        background: t.panelStrong, color: t.text,
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: `1px solid ${t.borderStrong}`, borderRadius: 16,
        zIndex: 201, padding: 22,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.22s ease-out',
        fontFamily: '"Inter Tight", sans-serif',
      }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700 }}>Invite to workspace</h2>
        <p style={{ margin: '0 0 18px', color: t.textDim, fontSize: 13 }}>They'll get an email with an invite link.</p>

        <label style={{ fontSize: 12, color: t.textDim, display: 'block', marginBottom: 5 }}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maya Chen"
          style={{
            width: '100%', padding: '10px 12px', marginBottom: 14,
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 9, color: t.text, fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}/>

        <label style={{ fontSize: 12, color: t.textDim, display: 'block', marginBottom: 5 }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maya@example.com"
          style={{
            width: '100%', padding: '10px 12px', marginBottom: 14,
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 9, color: t.text, fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}/>

        <label style={{ fontSize: 12, color: t.textDim, display: 'block', marginBottom: 5 }}>Role</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {['Editor', 'Viewer'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '8px 12px', borderRadius: 9,
              background: role === r ? t.text : 'transparent',
              color: role === r ? t.bg : t.text,
              border: `1px solid ${role === r ? t.text : t.border}`,
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}>{r}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '9px 16px', borderRadius: 10,
            background: 'transparent', border: `1px solid ${t.border}`,
            color: t.text, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          }}>Cancel</button>
          <button onClick={submit} disabled={!email.trim() || !name.trim()} style={{
            padding: '9px 18px', borderRadius: 10,
            background: (email.trim() && name.trim()) ? '#2541F2' : t.border,
            color: (email.trim() && name.trim()) ? '#fff' : t.textDim,
            border: 'none', cursor: (email.trim() && name.trim()) ? 'pointer' : 'default',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
          }}>Send invite</button>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  AI SHEETS PAGE — split layout like AI Docs but with a spreadsheet
// ============================================================
function SheetsPage({ t, theme, onBack }) {
  const [prompt, setPrompt] = useState('');
  const [sheetType, setSheetType] = useState('Spreadsheet');
  // Demo data — a small product sales table to make the right panel look alive
  const initialData = [
    ['Product',          'Q1',     'Q2',     'Q3',     'Q4',     'Total'   ],
    ['Pro Plan',         '$24.2k', '$28.1k', '$31.4k', '$36.7k', '$120.4k' ],
    ['Team Plan',        '$18.5k', '$21.2k', '$24.8k', '$27.3k', '$91.8k'  ],
    ['Enterprise',       '$42.0k', '$51.4k', '$58.6k', '$68.2k', '$220.2k' ],
    ['Add-ons',          '$3.4k',  '$4.1k',  '$5.2k',  '$6.8k',  '$19.5k'  ],
    ['',                 '',       '',       '',       '',       ''        ],
    ['Total',            '$88.1k', '$104.8k','$120.0k','$139.0k','$451.9k' ],
  ];
  const [data, setData] = useState(initialData);
  const [activeCell, setActiveCell] = useState({ r: 0, c: 0 });

  const colLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const updateCell = (r, c, val) => {
    setData(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>


      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ===== LEFT — welcome + prompt ===== */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '60px 56px 24px',
          borderRight: `1px solid ${t.border}`,
          overflowY: 'auto',
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560, margin: '0 auto', width: '100%' }}>
            <h1 style={{
              fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em',
              textAlign: 'center', marginBottom: 22,
              animation: 'fadeUp 0.4s ease-out',
            }}>
              Spreadsheets, the smart way
            </h1>
            <ul style={{
              listStyle: 'disc', paddingLeft: 22, color: t.text,
              fontSize: 15, lineHeight: 2,
              animation: 'fadeUp 0.5s ease-out 0.05s both',
            }}>
              <li>Build sheets from a sentence — Kira fills in formulas, formats, and charts</li>
              <li>Import CSV, Excel, or paste data from anywhere</li>
              <li>Ask follow-up questions in plain English to slice your data</li>
            </ul>
          </div>

          {/* Prompt box */}
          <div style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 18,
            padding: '14px 16px 12px',
            marginTop: 24,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'fadeUp 0.5s ease-out 0.1s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>AI Sheets</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {['Spreadsheet', 'CSV', 'XLSX'].map(dt => (
                  <button key={dt} onClick={() => setSheetType(dt)} style={{
                    padding: '5px 11px', borderRadius: 12,
                    background: sheetType === dt ? t.text : 'transparent',
                    color: sheetType === dt ? t.bg : t.textDim,
                    border: 'none', cursor: 'pointer',
                    fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s ease',
                  }}>
                    {sheetType === dt && <Icon name="check" size={11}/>} {dt}
                  </button>
                ))}
              </div>
            </div>

            <textarea value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your sheet request here..."
              rows={2}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                color: t.text, fontSize: 14, lineHeight: 1.5,
                fontFamily: 'inherit', padding: '6px 0',
              }}/>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button title="Attach" style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: t.hover, border: `1px solid ${t.border}`, color: t.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="plus" size={14}/>
                </button>
                <button style={filledPillBtn(t)}>
                  <Icon name="standard" size={13}/> Standard
                  <Icon name="chev-down" size={10}/>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button title="Mic" style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: 'transparent', border: 'none', color: t.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="mic" size={15}/>
                </button>
                <button onClick={() => {
                  if (!prompt.trim()) return;
                  // Demo: pretend a new row was added based on prompt
                  setData(prev => [...prev.slice(0, -2), [prompt.slice(0, 28), '$0', '$0', '$0', '$0', '$0'], prev[prev.length - 2], prev[prev.length - 1]]);
                  setPrompt('');
                }}
                  style={{
                    padding: '7px 16px', borderRadius: 18,
                    background: t.text, color: t.bg, border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <Icon name="speak" size={13}/> Speak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT — spreadsheet editor ===== */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* Toolbar */}
          <div style={{
            padding: '12px 22px',
            borderBottom: `1px solid ${t.border}`,
            background: t.panel,
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <button style={toolBtn(t)} title="Undo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14l-4-4 4-4"/><path d="M5 10h11a5 5 0 0 1 0 10h-3"/>
              </svg>
            </button>
            <button style={toolBtn(t)} title="Redo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14l4-4-4-4"/><path d="M19 10H8a5 5 0 0 0 0 10h3"/>
              </svg>
            </button>
            <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>
            <Dropdown t={t} label="Inter" options={['Inter', 'Times', 'Helvetica', 'JetBrains Mono']} onChange={() => {}}/>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${t.border}`, borderRadius: 8, padding: '0 4px', height: 30 }}>
              <span style={{ fontSize: 13, color: t.text, padding: '0 6px' }}>12</span>
            </div>
            <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>
            <button style={toolBtn(t)} title="Bold"><b style={{ fontSize: 14 }}>B</b></button>
            <button style={toolBtn(t)} title="Italic"><i style={{ fontSize: 14, fontFamily: 'serif' }}>I</i></button>
            <button style={toolBtn(t)} title="Underline"><u style={{ fontSize: 14 }}>U</u></button>
            <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>
            <button style={toolBtn(t)} title="Currency">$</button>
            <button style={toolBtn(t)} title="Percent">%</button>
            <button style={toolBtn(t)} title="Decrease decimals">.0</button>
            <button style={toolBtn(t)} title="Increase decimals">.00</button>
            <div style={{ width: 1, height: 22, background: t.border, margin: '0 4px' }}/>
            <button style={toolBtn(t)} title="Sort">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h13M3 12h9M3 18h5"/><path d="M17 16l3 3 3-3M20 19V8"/>
              </svg>
            </button>
            <button style={toolBtn(t)} title="Filter">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/>
              </svg>
            </button>
            <button style={toolBtn(t)} title="Chart">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            </button>
            <button style={toolBtn(t)} title="Formula"><span style={{ fontFamily: 'serif', fontSize: 14, fontStyle: 'italic' }}>ƒ</span></button>
            <div style={{ flex: 1 }}/>
            <button style={toolBtn(t)} title="AI tools"><Icon name="sparkle" size={14}/></button>
          </div>

          {/* Formula bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '6px 12px',
            borderBottom: `1px solid ${t.border}`,
            background: t.bg,
            gap: 10,
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 12, color: t.textDim,
              padding: '4px 10px', background: t.hover, borderRadius: 6,
              minWidth: 50, textAlign: 'center',
            }}>
              {colLetters[activeCell.c] || 'A'}{activeCell.r + 1}
            </div>
            <span style={{ color: t.textDim, fontFamily: 'serif', fontStyle: 'italic', fontSize: 14 }}>ƒx</span>
            <input
              value={data[activeCell.r]?.[activeCell.c] ?? ''}
              onChange={(e) => updateCell(activeCell.r, activeCell.c, e.target.value)}
              placeholder="Type a value or =formula"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: t.text, fontSize: 13, fontFamily: 'monospace',
              }}/>
          </div>

          {/* Spreadsheet grid */}
          <div style={{ flex: 1, overflow: 'auto', background: t.bg }}>
            <table style={{
              borderCollapse: 'collapse', width: '100%',
              fontFamily: 'inherit', fontSize: 13,
              tableLayout: 'fixed',
            }}>
              <thead>
                <tr>
                  <th style={cellHeader(t, true)}/>
                  {colLetters.slice(0, data[0].length).map((L, c) => (
                    <th key={L} style={cellHeader(t)}>{L}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, r) => (
                  <tr key={r}>
                    <td style={cellHeader(t)}>{r + 1}</td>
                    {row.map((val, c) => {
                      const isActive = activeCell.r === r && activeCell.c === c;
                      const isHeader = r === 0;
                      const isTotal = r === data.length - 1 && val !== '';
                      return (
                        <td key={c}
                          onClick={() => setActiveCell({ r, c })}
                          style={{
                            border: `1px solid ${t.border}`,
                            padding: '7px 10px',
                            background: isActive ? `${t.text}15` : (isHeader ? t.hover : (isTotal ? t.hover : 'transparent')),
                            outline: isActive ? `2px solid ${t.text}` : 'none',
                            outlineOffset: -2,
                            fontWeight: isHeader || isTotal ? 700 : 400,
                            color: t.text,
                            cursor: 'cell',
                            minWidth: 90,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Extra empty rows so the grid feels like a real sheet */}
                {Array.from({ length: 14 }).map((_, ri) => {
                  const r = data.length + ri;
                  return (
                    <tr key={r}>
                      <td style={cellHeader(t)}>{r + 1}</td>
                      {data[0].map((_, c) => {
                        const isActive = activeCell.r === r && activeCell.c === c;
                        return (
                          <td key={c}
                            onClick={() => setActiveCell({ r, c })}
                            style={{
                              border: `1px solid ${t.border}`,
                              padding: '7px 10px',
                              background: isActive ? `${t.text}15` : 'transparent',
                              outline: isActive ? `2px solid ${t.text}` : 'none',
                              outlineOffset: -2,
                              cursor: 'cell',
                              minWidth: 90, height: 28,
                            }}/>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sheet tabs at bottom */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '8px 12px',
            borderTop: `1px solid ${t.border}`,
            background: t.panel,
            gap: 6,
          }}>
            <button title="Add sheet" style={toolBtn(t)}>
              <Icon name="plus" size={13}/>
            </button>
            <button style={{
              padding: '5px 12px', borderRadius: 7,
              background: t.text, color: t.bg, border: 'none',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
            }}>Revenue</button>
            <button style={{
              padding: '5px 12px', borderRadius: 7,
              background: 'transparent', color: t.textDim,
              border: 'none', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>Expenses</button>
            <button style={{
              padding: '5px 12px', borderRadius: 7,
              background: 'transparent', color: t.textDim,
              border: 'none', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}>Forecast</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cellHeader = (t, corner) => ({
  border: `1px solid ${t.border}`,
  background: t.hover,
  color: t.textDim,
  padding: '6px 10px',
  fontSize: 11, fontWeight: 600,
  textAlign: 'center',
  fontFamily: 'monospace',
  position: 'sticky', top: 0,
  width: corner ? 38 : 'auto',
  minWidth: corner ? 38 : 90,
});

// ============================================================
//  RECENT PAGE — aggregates recently-worked-on projects from
//  every storage source: decks, notes, generations, uploads.
//  Renders as a filterable, searchable grid.
// ============================================================
function RecentPage({ t, theme, onBack, onOpen, myDecks }) {
  const k = useKira();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  // Pull live data from every storage source. Re-read on each render
  // so the page is always fresh after any edit.
  const collectItems = () => {
    const items = [];

    // Decks (already passed in as prop)
    (myDecks || []).forEach(d => {
      items.push({
        id: `deck-${d.id}`, kind: 'slides',
        title: d.name, subtitle: `${d.slides?.length || 0} slides · ${d.tag || 'Deck'}`,
        time: d.modified || d.created || Date.now(),
        accent: d.accent || '#3b82f6',
        page: 'slides',
        icon: 'slides',
      });
    });

    // Notes
    try {
      const raw = window.localStorage?.getItem('kira-notes');
      if (raw) {
        JSON.parse(raw).forEach(n => {
          items.push({
            id: `note-${n.id}`, kind: 'notes',
            title: n.title || 'Untitled note',
            subtitle: (n.body || '').slice(0, 60) || 'Empty note',
            time: n.updated || Date.now(),
            accent: '#10b981',
            page: 'notepad',
            icon: 'notepad',
          });
        });
      }
    } catch {}

    // Workflows in My Workflows
    try {
      const raw = window.localStorage?.getItem('kira-my-workflows');
      const wfState = JSON.parse(window.localStorage?.getItem('kira-wf-state') || '{}');
      if (raw) {
        const ids = JSON.parse(raw);
        // Map IDs back to titles via a lookup. We need WORKFLOW_TEMPLATES.
        ids.forEach(id => {
          const tpl = (typeof WORKFLOW_TEMPLATES !== 'undefined') ? WORKFLOW_TEMPLATES.find(w => w.id === id) : null;
          if (!tpl) return;
          const s = wfState[id] || {};
          items.push({
            id: `wf-${id}`, kind: 'workflows',
            title: tpl.title, subtitle: tpl.desc,
            time: s.lastRun ? new Date(s.lastRun).getTime() : Date.now() - 86400000,
            accent: '#06b6d4',
            page: 'workflows',
            icon: 'workflow',
          });
        });
      }
    } catch {}

    // Drive files
    try {
      const raw = window.localStorage?.getItem('kira-drive');
      if (raw) {
        JSON.parse(raw).forEach(f => {
          // Use saved order as a proxy for time when no `mod` is real
          const time = f.id && typeof f.id === 'number' && f.id > 1000000000000 ? f.id : Date.now() - (Math.random() * 86400000 * 5);
          items.push({
            id: `file-${f.id}`, kind: 'files',
            title: f.name, subtitle: `${f.size || ''} · ${f.type || 'file'}`,
            time,
            accent: f.type === 'slides' ? '#0ea5e9' : f.type === 'docs' ? '#2563eb' : f.type === 'image' ? '#a855f7' : f.type === 'designer' ? '#6366f1' : '#10b981',
            page: 'drive',
            icon: f.type === 'slides' ? 'slides' : f.type === 'docs' ? 'docs' : f.type === 'image' ? 'image' : f.type === 'designer' ? 'designer' : 'workflow',
          });
        });
      }
    } catch {}

    // Image generations
    try {
      const raw = window.localStorage?.getItem('kira-images');
      if (raw) {
        JSON.parse(raw).forEach((img, i) => {
          items.push({
            id: `img-${img.id || i}`, kind: 'images',
            title: img.title || 'Generated image',
            subtitle: img.style || 'AI Image',
            time: img.created || Date.now() - i * 60000,
            accent: '#a855f7',
            page: 'image',
            icon: 'image',
          });
        });
      }
    } catch {}

    // Sort newest first
    return items.sort((a, b) => b.time - a.time);
  };

  const allItems = collectItems();

  const filtered = allItems.filter(it => {
    if (filter !== 'all' && it.kind !== filter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!it.title.toLowerCase().includes(q) && !it.subtitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Group items by relative date
  const groupByTime = (items) => {
    const groups = { Today: [], Yesterday: [], 'This week': [], Earlier: [] };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 6 * 86400000;
    items.forEach(it => {
      if (it.time >= todayStart) groups.Today.push(it);
      else if (it.time >= yesterdayStart) groups.Yesterday.push(it);
      else if (it.time >= weekStart) groups['This week'].push(it);
      else groups.Earlier.push(it);
    });
    return groups;
  };

  const groups = groupByTime(filtered);

  const counts = {
    all: allItems.length,
    slides: allItems.filter(i => i.kind === 'slides').length,
    notes: allItems.filter(i => i.kind === 'notes').length,
    workflows: allItems.filter(i => i.kind === 'workflows').length,
    files: allItems.filter(i => i.kind === 'files').length,
    images: allItems.filter(i => i.kind === 'images').length,
  };

  const filterTabs = [
    { key: 'all',       label: 'All',         icon: 'sparkle' },
    { key: 'slides',    label: 'Decks',       icon: 'slides' },
    { key: 'notes',     label: 'Notes',       icon: 'notepad' },
    { key: 'workflows', label: 'Workflows',   icon: 'workflow' },
    { key: 'files',     label: 'Files',       icon: 'cloud' },
    { key: 'images',    label: 'Images',      icon: 'image' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginTop: 8, marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent</h1>
            <p style={{ margin: '6px 0 0', color: t.textDim, fontSize: 14 }}>
              {allItems.length === 0
                ? 'Anything you work on across Kira will appear here.'
                : `${allItems.length} item${allItems.length === 1 ? '' : 's'} across your workspace`}
            </p>
          </div>

          {/* Search + filter row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8,
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '8px 14px',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}>
              <Icon name="search" size={15}/>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recent items…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13.5, fontFamily: 'inherit' }}/>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
            {filterTabs.map(tab => {
              const count = counts[tab.key] || 0;
              const active = filter === tab.key;
              return (
                <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                  padding: '7px 14px', borderRadius: 22,
                  background: active ? t.chipActiveBg : 'transparent',
                  color: active ? t.chipActiveText : t.text,
                  border: `1px solid ${active ? t.text : t.border}`,
                  cursor: 'pointer', fontSize: 12.5, fontWeight: active ? 600 : 500, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.15s ease',
                }}>
                  <Icon name={tab.icon} size={12}/>
                  {tab.label}
                  <span style={{ fontSize: 11, opacity: 0.65 }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Grid grouped by time */}
          {filtered.length === 0 ? (
            <EmptyState t={t}
              title={query
                ? `No recent items match "${query}"`
                : allItems.length === 0
                  ? 'Nothing here yet'
                  : `No items in this category`}
              body={allItems.length === 0
                ? 'Create a deck, jot a note, or generate an image — it\'ll show up here.'
                : 'Try a different category or search term.'}
              cta={allItems.length === 0 ? 'Go to home' : 'Show all'}
              onCta={() => allItems.length === 0 ? onOpen('home') : (setFilter('all'), setQuery(''))}/>
          ) : (
            <>
              {['Today', 'Yesterday', 'This week', 'Earlier'].map(label => {
                const items = groups[label];
                if (!items || items.length === 0) return null;
                return (
                  <div key={label} style={{ marginBottom: 28 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: t.textDim,
                      fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase',
                      marginBottom: 12,
                    }}>
                      {label} <span style={{ opacity: 0.6 }}>· {items.length}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                      {items.map((it, i) => (
                        <RecentCard key={it.id} t={t} item={it} index={i}
                          formatTime={formatTime}
                          onOpen={() => {
                            k?.log(`Opened ${it.title}`, it.icon);
                            onOpen(it.page);
                          }}/>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentCard({ t, item, index, formatTime, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onOpen}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 12, padding: 14,
        cursor: 'pointer',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        transition: 'all 0.18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        animation: `fadeUp 0.3s ease-out ${Math.min(index * 0.03, 0.3)}s both`,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      }}>
      {/* Icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: `${item.accent}22`, color: item.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={item.icon} size={18}/>
      </div>
      {/* Title + subtitle */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13.5, fontWeight: 600, color: t.text, lineHeight: 1.3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{item.title}</div>
        <div style={{
          fontSize: 12, color: t.textDim, marginTop: 3, lineHeight: 1.4,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{item.subtitle}</div>
        <div style={{
          fontSize: 10.5, color: t.textDim, marginTop: 5,
          fontFamily: 'monospace', opacity: 0.75,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.kind}</span>
          <span>·</span>
          <span>{formatTime(item.time)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  NOTEPAD PAGE
//  Two-column layout: list of notes on the left, editor on the right.
//  Notes persist to localStorage (kira-notes).
//  Features: create, rename via title field, edit body, pin, delete,
//  search, and an "Ask Kira" prompt to refine the current note.
// ============================================================
function NotepadPage({ t, theme, onBack }) {
  const k = useKira();
  const [notes, setNotes] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-notes');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {}
    // Default starter notes so the page never feels empty
    const now = Date.now();
    return [
      { id: 'n1', title: 'Welcome to Notepad',
        body: 'This is your personal Kira notepad — a quick place to jot ideas, meeting notes, or anything you want to keep handy.\n\n• Pin important notes\n• Search across everything\n• Ask Kira to clean up, summarize, or extend any note\n\nEverything saves automatically.',
        pinned: true, updated: now },
      { id: 'n2', title: 'Q3 product ideas',
        body: 'Theme: less app, more ambient.\n\n— Push key actions to the lock screen\n— Voice-first capture for everything under 10 seconds\n— Daily digest at 6pm: what shipped, what stalled, what to ship tomorrow',
        pinned: false, updated: now - 86400000 },
      { id: 'n3', title: 'Reading list',
        body: '1. The Beginning of Infinity — Deutsch\n2. Working in Public — Eghbal\n3. A Pattern Language — Alexander\n4. The Death and Life of Great American Cities — Jacobs',
        pinned: false, updated: now - 86400000 * 3 },
    ];
  });
  const [activeId, setActiveId] = useState(() => 'n1');
  const [search, setSearch] = useState('');
  const [prompt, setPrompt] = useState('');

  // Persist
  useEffect(() => {
    try { window.localStorage?.setItem('kira-notes', JSON.stringify(notes)); } catch {}
  }, [notes]);

  const active = notes.find(n => n.id === activeId) || notes[0];

  const updateActive = (patch) => {
    setNotes(prev => prev.map(n =>
      n.id === activeId ? { ...n, ...patch, updated: Date.now() } : n
    ));
  };

  const createNote = () => {
    const id = `n${Date.now()}`;
    const newNote = { id, title: 'Untitled note', body: '', pinned: false, updated: Date.now() };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(id);
  };

  const togglePin = (id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned, updated: Date.now() } : n
    ));
  };

  const deleteNote = (id) => {
    const idx = notes.findIndex(n => n.id === id);
    const next = notes.filter(n => n.id !== id);
    setNotes(next);
    if (id === activeId && next.length) {
      setActiveId(next[Math.min(idx, next.length - 1)].id);
    }
  };

  const askKira = () => {
    if (!prompt.trim() || !active) return;
    const cleanedPrompt = prompt.trim();
    setPrompt('');
    // Append the AI "response" inline. This is a UI demo, not a real call.
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const insertion = `\n\n— Kira (${stamp}): ${cleanedPrompt}\n[Result would appear here in the live app.]`;
    updateActive({ body: (active.body || '') + insertion });
  };

  // Filter + sort: pinned first, then by updated desc
  const filtered = notes
    .filter(n => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updated - a.updated;
    });

  const formatWhen = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const previewOf = (body) => {
    const firstLine = (body || '').split('\n').find(l => l.trim()) || '';
    return firstLine.length > 70 ? firstLine.slice(0, 70) + '…' : firstLine;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '20px 32px 28px', gap: 20 }}>

        {/* ============ LEFT: NOTE LIST ============ */}
        <aside style={{
          width: 300, flexShrink: 0,
          background: t.cardBg,
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>Notes</div>
              <button onClick={createNote} title="New note" style={{
                width: 30, height: 30, borderRadius: 8,
                background: t.text, color: t.bg,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <Icon name="plus" size={15}/>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes…"
                style={{
                  width: '100%', padding: '8px 12px 8px 32px',
                  background: t.hover, border: `1px solid ${t.border}`,
                  borderRadius: 9, color: t.text,
                  fontSize: 12.5, fontFamily: 'inherit', outline: 'none',
                }}/>
              <div style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                color: t.textDim, pointerEvents: 'none',
              }}>
                <Icon name="search" size={13}/>
              </div>
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
            {filtered.length === 0 && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: t.textDim, fontSize: 12.5 }}>
                {search ? 'No notes match' : 'No notes yet'}
              </div>
            )}
            {filtered.map(n => {
              const isActive = n.id === activeId;
              return (
                <div key={n.id} onClick={() => setActiveId(n.id)}
                  style={{
                    padding: '11px 12px', marginBottom: 4,
                    borderRadius: 9,
                    background: isActive ? t.hover : 'transparent',
                    border: `1px solid ${isActive ? t.border : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = t.hover; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    {n.pinned && (
                      <span style={{ color: t.textDim, display: 'flex' }}>
                        <Icon name="pin" size={11}/>
                      </span>
                    )}
                    <div style={{
                      flex: 1, fontSize: 13, fontWeight: 600,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{n.title || 'Untitled'}</div>
                  </div>
                  <div style={{
                    fontSize: 11.5, color: t.textDim,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    marginBottom: 4,
                  }}>{previewOf(n.body) || 'No content'}</div>
                  <div style={{
                    fontSize: 10.5, color: t.textDim, opacity: 0.7,
                    fontFamily: 'monospace',
                  }}>{formatWhen(n.updated)}</div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ============ RIGHT: EDITOR ============ */}
        <main style={{
          flex: 1,
          background: t.cardBg,
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {active ? (
            <>
              {/* Editor toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: `1px solid ${t.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: t.textDim, fontSize: 12 }}>
                  <span style={{ fontFamily: 'monospace' }}>Updated {formatWhen(active.updated)}</span>
                  <span>·</span>
                  <span>{(active.body || '').length} chars</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => togglePin(active.id)}
                    title={active.pinned ? 'Unpin' : 'Pin'}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: active.pinned ? t.hover : 'transparent',
                      border: `1px solid ${active.pinned ? t.border : 'transparent'}`,
                      color: active.pinned ? t.text : t.textDim,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Icon name="pin" size={14}/>
                  </button>
                  <button onClick={() => {
                    if (notes.length <= 1) {
                      k?.toast('Cannot delete the last note. Add another first.', 'error');
                      return;
                    }
                    if (confirm(`Delete "${active.title || 'this note'}"?`)) deleteNote(active.id);
                  }}
                    title="Delete"
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'transparent', border: '1px solid transparent',
                      color: t.textDim, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = t.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = t.textDim; e.currentTarget.style.background = 'transparent'; }}>
                    <Icon name="trash" size={14}/>
                  </button>
                </div>
              </div>

              {/* Title + body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 16px' }}>
                <input value={active.title}
                  onChange={(e) => updateActive({ title: e.target.value })}
                  placeholder="Untitled note"
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    color: t.text, fontSize: 30, fontWeight: 700,
                    letterSpacing: '-0.02em', fontFamily: 'inherit', outline: 'none',
                    marginBottom: 14, padding: 0,
                  }}/>
                <textarea value={active.body}
                  onChange={(e) => updateActive({ body: e.target.value })}
                  placeholder="Start writing… or ask Kira below to help draft."
                  style={{
                    width: '100%', minHeight: 'calc(100% - 60px)',
                    background: 'transparent', border: 'none', resize: 'none',
                    color: t.text, fontSize: 15, lineHeight: 1.65,
                    fontFamily: 'inherit', outline: 'none', padding: 0,
                  }}/>
              </div>

              {/* Ask Kira footer */}
              <div style={{ padding: '12px 16px 16px', borderTop: `1px solid ${t.border}` }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px 8px 14px',
                  background: t.hover,
                  border: `1px solid ${t.border}`,
                  borderRadius: 11,
                }}>
                  <Icon name="sparkle" size={14}/>
                  <input value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askKira(); } }}
                    placeholder="Ask Kira to clean up, summarize, extend…"
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: t.text, fontSize: 13, fontFamily: 'inherit', outline: 'none',
                    }}/>
                  <button onClick={askKira} disabled={!prompt.trim()}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: prompt.trim() ? t.text : t.border,
                      color: prompt.trim() ? t.bg : t.textDim,
                      border: 'none',
                      cursor: prompt.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.12s ease',
                    }}>
                    <Icon name="send" size={13}/>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 16, color: t.textDim,
            }}>
              <Icon name="notepad" size={42}/>
              <div style={{ fontSize: 14 }}>Select a note or create a new one</div>
              <button onClick={createNote} style={{
                padding: '10px 18px', borderRadius: 10,
                background: t.text, color: t.bg, border: 'none',
                fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
                cursor: 'pointer',
              }}>
                + New note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================
//  AI VIDEO PAGE — text-to-video generator
// ============================================================
function VideoPage({ t, theme, onBack }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('16:9');
  const [duration, setDuration] = useState('5s');
  const [style, setStyle] = useState('Cinematic');

  // Persistent generations
  const [videos, setVideos] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-videos');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 1, title: 'Sunset over ocean cliffs', style: 'Cinematic',  duration: '8s',  aspect: '16:9', thumb: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 60%, #312e81 100%)' },
      { id: 2, title: 'City at night, neon rain',  style: 'Cyberpunk',  duration: '5s',  aspect: '9:16', thumb: 'linear-gradient(135deg, #1e293b 0%, #6366f1 50%, #ec4899 100%)' },
      { id: 3, title: 'Drone shot over forest',   style: 'Documentary',duration: '10s', aspect: '16:9', thumb: 'linear-gradient(135deg, #14532d 0%, #22c55e 60%, #fef3c7 100%)' },
      { id: 4, title: 'Coffee being poured',      style: 'Macro',      duration: '5s',  aspect: '1:1',  thumb: 'linear-gradient(135deg, #451a03 0%, #92400e 50%, #fbbf24 100%)' },
    ];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-videos', JSON.stringify(videos)); } catch {}
  }, [videos]);

  const generate = () => {
    if (!prompt.trim()) return;
    k?.toast(`Generating ${duration} ${style.toLowerCase()} video…`, 'info');
    const palettes = [
      'linear-gradient(135deg, #6366f1, #ec4899)',
      'linear-gradient(135deg, #fb923c, #b91c1c)',
      'linear-gradient(135deg, #14b8a6, #1e3a8a)',
      'linear-gradient(135deg, #f59e0b, #831843)',
      'linear-gradient(135deg, #22d3ee, #4f46e5)',
    ];
    setTimeout(() => {
      const id = Date.now();
      setVideos(prev => [{
        id, title: prompt.slice(0, 50),
        style, duration, aspect,
        thumb: palettes[Math.floor(Math.random() * palettes.length)],
      }, ...prev]);
      k?.toast(`Video ready: "${prompt.slice(0, 30)}"`, 'success');
      k?.log(`Generated video`, 'video', prompt.slice(0, 60));
    }, 1400);
    setPrompt('');
  };

  const deleteVideo = (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setVideos(prev => prev.filter(v => v.id !== id));
    k?.toast('Video deleted', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '32px 0 24px', fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Kira AI Video
          </h1>

          <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
            placeholder="Describe the video you want — scene, mood, camera..."
            model="Standard" onModelChange={() => {}}
            onSubmit={generate}/>

          {/* Controls row */}
          <div style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <ControlGroup t={t} label="Style"    value={style}    options={['Cinematic','Documentary','Cyberpunk','Macro','Anime','Cartoon']} onChange={setStyle}/>
            <ControlGroup t={t} label="Aspect"   value={aspect}   options={['16:9','9:16','1:1','4:3']}                          onChange={setAspect}/>
            <ControlGroup t={t} label="Duration" value={duration} options={['3s','5s','8s','10s','15s']}                         onChange={setDuration}/>
          </div>

          {/* Gallery */}
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '40px 0 14px' }}>
            Recent generations {videos.length > 0 && <span style={{ color: t.textDim, fontWeight: 500, fontSize: 13 }}>({videos.length})</span>}
          </h2>
          {videos.length === 0 ? (
            <EmptyState t={t} title="No videos yet" body="Describe something above and Kira will generate it." cta="Try an example" onCta={() => setPrompt('A timelapse of clouds rolling over a mountain at sunrise')}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {videos.map((v, i) => (
                <VideoCard key={v.id} t={t} v={v} i={i}
                  onPlay={() => { k?.toast(`Playing "${v.title}"`, 'info'); k?.log(`Played video`, 'video', v.title); }}
                  onDelete={() => deleteVideo(v.id, v.title)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ t, v, i, onPlay, onDelete }) {
  const [hover, setHover] = useState(false);
  const aspectRatio = v.aspect === '9:16' ? '9 / 16' : v.aspect === '1:1' ? '1 / 1' : v.aspect === '4:3' ? '4 / 3' : '16 / 9';
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onPlay}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 12, padding: 10, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 8,
        transition: 'all 0.18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        animation: `fadeUp 0.4s ease-out ${i * 0.03}s both`,
        position: 'relative',
      }}>
      {hover && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            width: 26, height: 26, borderRadius: 13,
            background: 'rgba(239,68,68,0.15)', border: 'none',
            color: '#ef4444', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <Icon name="trash" size={12}/>
        </button>
      )}
      <div style={{
        aspectRatio, background: v.thumb, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          transition: 'transform 0.18s ease',
          transform: hover ? 'scale(1.1)' : 'scale(1)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a0d" style={{ marginLeft: 2 }}>
            <polygon points="6 4 20 12 6 20"/>
          </svg>
        </div>
        <div style={{
          position: 'absolute', bottom: 6, right: 8,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
          padding: '2px 6px', borderRadius: 3,
        }}>{v.duration}</div>
      </div>
      <div style={{ padding: '0 4px 2px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{v.title}</div>
        <div style={{ fontSize: 11, color: t.textDim, marginTop: 3, fontFamily: 'monospace', letterSpacing: 0.3, textTransform: 'uppercase' }}>
          {v.style} · {v.aspect}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  AI MUSIC PAGE
// ============================================================
function MusicPage({ t, theme, onBack }) {
  const k = useKira();
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Lo-fi');
  const [mood, setMood] = useState('Calm');
  const [duration, setDuration] = useState('30s');
  const [playingId, setPlayingId] = useState(null);

  // Persistent tracks
  const [tracks, setTracks] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-music');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 1, title: 'Rainy Afternoon', genre: 'Lo-fi',       mood: 'Calm',     duration: '2:14', color: '#a78bfa', wave: [0.4,0.6,0.5,0.7,0.5,0.4,0.6,0.5,0.7,0.6,0.4,0.5,0.6,0.5,0.4] },
      { id: 2, title: 'Sunset Drive',    genre: 'Synthwave',   mood: 'Energetic',duration: '3:02', color: '#ec4899', wave: [0.5,0.8,0.6,0.9,0.7,0.5,0.8,0.6,0.9,0.7,0.5,0.8,0.6,0.7,0.5] },
      { id: 3, title: 'Forest Trails',   genre: 'Ambient',     mood: 'Peaceful', duration: '4:20', color: '#22c55e', wave: [0.3,0.4,0.3,0.5,0.4,0.3,0.5,0.4,0.3,0.4,0.3,0.5,0.4,0.3,0.4] },
      { id: 4, title: 'Studio Session',  genre: 'Jazz',        mood: 'Smooth',   duration: '2:48', color: '#f59e0b', wave: [0.6,0.7,0.5,0.8,0.6,0.7,0.5,0.8,0.6,0.5,0.7,0.6,0.8,0.5,0.6] },
    ];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-music', JSON.stringify(tracks)); } catch {}
  }, [tracks]);

  const generate = () => {
    if (!prompt.trim()) return;
    k?.toast(`Composing ${duration} ${genre.toLowerCase()} track…`, 'info');
    const colors = ['#a78bfa','#ec4899','#22c55e','#f59e0b','#06b6d4','#8b5cf6','#fb923c'];
    const wave = Array.from({ length: 15 }, () => 0.3 + Math.random() * 0.6);
    const secs = parseInt(duration, 10) || 60;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    setTimeout(() => {
      const id = Date.now();
      setTracks(prev => [{
        id, title: prompt.slice(0, 50),
        genre, mood, duration: `${mins}:${String(remSecs).padStart(2, '0')}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        wave,
      }, ...prev]);
      k?.toast(`Track ready: "${prompt.slice(0, 30)}"`, 'success');
      k?.log(`Generated music track`, 'music', prompt.slice(0, 60));
    }, 1500);
    setPrompt('');
  };

  const togglePlay = (id, title) => {
    if (playingId === id) {
      setPlayingId(null);
      k?.toast(`Paused`, 'info');
    } else {
      setPlayingId(id);
      k?.toast(`Playing "${title}"`, 'info');
      k?.log(`Played track`, 'music', title);
    }
  };

  const deleteTrack = (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setTracks(prev => prev.filter(tr => tr.id !== id));
    if (playingId === id) setPlayingId(null);
    k?.toast('Track deleted', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '32px 0 24px', fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Kira AI Music
          </h1>

          <PromptBox t={t} theme={theme} value={prompt} onChange={setPrompt}
            placeholder="Describe the track — instruments, mood, tempo..."
            model="Standard" onModelChange={() => {}}
            onSubmit={generate}/>

          <div style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <ControlGroup t={t} label="Genre"    value={genre}    options={['Lo-fi','Synthwave','Ambient','Jazz','Pop','Cinematic','Electronic','Classical']} onChange={setGenre}/>
            <ControlGroup t={t} label="Mood"     value={mood}     options={['Calm','Energetic','Peaceful','Smooth','Epic','Melancholic','Uplifting']}        onChange={setMood}/>
            <ControlGroup t={t} label="Duration" value={duration} options={['15s','30s','60s','120s','180s','240s']}                                           onChange={setDuration}/>
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '40px 0 14px' }}>
            Your tracks {tracks.length > 0 && <span style={{ color: t.textDim, fontWeight: 500, fontSize: 13 }}>({tracks.length})</span>}
          </h2>

          {tracks.length === 0 ? (
            <EmptyState t={t} title="No tracks yet" body="Compose your first track to fill this list." cta="Try an example" onCta={() => setPrompt('Mellow piano with soft strings, late night, slow tempo')}/>
          ) : (
            <div style={{
              background: t.cardBg, border: `1px solid ${t.border}`,
              borderRadius: 14, overflow: 'hidden',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}>
              {tracks.map((tr, i) => (
                <MusicRow key={tr.id} t={t} track={tr} index={i}
                  isLast={i === tracks.length - 1}
                  playing={playingId === tr.id}
                  onToggle={() => togglePlay(tr.id, tr.title)}
                  onDelete={() => deleteTrack(tr.id, tr.title)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MusicRow({ t, track, index, isLast, playing, onToggle, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 18px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        background: hover ? t.hover : 'transparent',
        transition: 'background 0.15s ease',
        animation: `fadeUp 0.3s ease-out ${index * 0.04}s both`,
      }}>
      {/* Play button */}
      <button onClick={onToggle} style={{
        width: 40, height: 40, borderRadius: 20,
        background: track.color, color: '#fff', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: `0 4px 12px ${track.color}40`,
      }}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}><polygon points="6 4 20 12 6 20"/></svg>
        )}
      </button>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize: 11, color: t.textDim, marginTop: 2, fontFamily: 'monospace', letterSpacing: 0.3 }}>
          {track.genre} · {track.mood}
        </div>
      </div>

      {/* Waveform */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        width: 100, height: 28,
      }}>
        {track.wave.map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${h * 100}%`,
            background: playing && i < (Date.now() / 100) % track.wave.length ? track.color : t.border,
            borderRadius: 1,
            transition: 'background 0.12s ease',
            animation: playing ? `pulse 1.${i % 9}s ease-in-out infinite` : 'none',
          }}/>
        ))}
      </div>

      {/* Duration */}
      <div style={{ fontSize: 12, color: t.textDim, fontFamily: 'monospace', width: 42, textAlign: 'right' }}>
        {track.duration}
      </div>

      {/* Delete on hover */}
      <button onClick={onDelete} title="Delete"
        style={{
          width: 28, height: 28, borderRadius: 14,
          background: 'transparent', border: 'none',
          color: t.textDim, cursor: 'pointer',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.15s ease, color 0.15s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
        onMouseLeave={(e) => e.currentTarget.style.color = t.textDim}>
        <Icon name="trash" size={13}/>
      </button>
    </div>
  );
}

// ============================================================
//  CLIP GENIUS PAGE — short-form video editor / clip generator
// ============================================================
function ClipPage({ t, theme, onBack }) {
  const k = useKira();
  const [sourceUrl, setSourceUrl] = useState('');
  const [clipStyle, setClipStyle] = useState('TikTok');
  const [autoCaption, setAutoCaption] = useState(true);
  const [autoMusic, setAutoMusic] = useState(true);
  const fileInputRef = useRef(null);

  const [clips, setClips] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('kira-clips');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: 1, source: '40-min podcast episode', style: 'TikTok',     duration: '0:42', score: 92, hook: 'The moment everything changed' },
      { id: 2, source: '40-min podcast episode', style: 'Reels',      duration: '0:58', score: 88, hook: 'A 3-step framework that works' },
      { id: 3, source: 'Conference keynote',     style: 'YouTube Shorts', duration: '0:30', score: 95, hook: 'The one thing nobody told us' },
      { id: 4, source: 'Conference keynote',     style: 'TikTok',     duration: '0:51', score: 81, hook: 'Why I almost quit last year' },
    ];
  });
  useEffect(() => {
    try { window.localStorage?.setItem('kira-clips', JSON.stringify(clips)); } catch {}
  }, [clips]);

  const styleColors = {
    'TikTok':         '#0a0a0d',
    'Reels':          'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
    'YouTube Shorts': '#dc2626',
    'X':              '#0a0a0d',
  };

  const generateClips = (sourceLabel) => {
    if (!sourceLabel) return;
    k?.toast(`Analyzing ${sourceLabel} and generating clips…`, 'info');
    setTimeout(() => {
      const hooks = [
        'The moment everything changed',
        'A counterintuitive truth',
        '3 things that nobody tells you',
        'What I wish I knew earlier',
        'The biggest mistake I made',
        'How this actually works',
      ];
      const newClips = Array.from({ length: 3 }).map((_, i) => ({
        id: Date.now() + i,
        source: sourceLabel,
        style: clipStyle,
        duration: `0:${30 + Math.floor(Math.random() * 30)}`,
        score: 70 + Math.floor(Math.random() * 30),
        hook: hooks[Math.floor(Math.random() * hooks.length)],
      }));
      setClips(prev => [...newClips, ...prev]);
      k?.toast(`Generated ${newClips.length} clips`, 'success');
      k?.log(`Generated clips from ${sourceLabel}`, 'film', `${newClips.length} clips, ${clipStyle}`);
    }, 1600);
  };

  const handleUrlSubmit = () => {
    if (!sourceUrl.trim()) return;
    generateClips(sourceUrl);
    setSourceUrl('');
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    generateClips(file.name);
    e.target.value = '';
  };

  const deleteClip = (id) => {
    setClips(prev => prev.filter(c => c.id !== id));
    k?.toast('Clip deleted', 'success');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '32px 0 12px', fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Clip Genius
          </h1>
          <p style={{ textAlign: 'center', margin: '0 0 24px', color: t.textDim, fontSize: 14 }}>
            Paste a long video and Kira will find the best 30-60s moments for short-form.
          </p>

          {/* Source input */}
          <div style={{
            background: t.cardBg, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: 16,
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            maxWidth: 720, margin: '0 auto',
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUrlSubmit(); }}
                placeholder="Paste a YouTube, Vimeo, or video URL…"
                style={{
                  flex: 1, padding: '11px 14px',
                  background: t.bg, border: `1px solid ${t.border}`,
                  borderRadius: 10, color: t.text,
                  fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
                }}/>
              <button onClick={handleUrlSubmit} disabled={!sourceUrl.trim()}
                style={{
                  padding: '11px 18px', borderRadius: 10,
                  background: sourceUrl.trim() ? '#2541F2' : t.border,
                  color: sourceUrl.trim() ? '#fff' : t.textDim,
                  border: 'none', cursor: sourceUrl.trim() ? 'pointer' : 'default',
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: sourceUrl.trim() ? '0 4px 12px rgba(37,65,242,0.32)' : 'none',
                }}>
                <Icon name="sparkle" size={13}/> Clip it
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: t.textDim, fontSize: 12, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1 }}>
              <span style={{ flex: 1, height: 1, background: t.border }}/>
              <span>or</span>
              <span style={{ flex: 1, height: 1, background: t.border }}/>
            </div>
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFile} style={{ display: 'none' }}/>
            <button onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', marginTop: 12,
                padding: '11px 16px', borderRadius: 10,
                background: 'transparent', border: `1.5px dashed ${t.border}`,
                color: t.text, cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.borderStrong; e.currentTarget.style.background = t.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = 'transparent'; }}>
              <Icon name="plus" size={14}/> Upload a video file
            </button>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            <ControlGroup t={t} label="Format" value={clipStyle} options={['TikTok','Reels','YouTube Shorts','X']} onChange={setClipStyle}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>Auto-add</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setAutoCaption(!autoCaption)} style={{
                  padding: '6px 12px', borderRadius: 16,
                  background: autoCaption ? t.text : 'transparent',
                  color: autoCaption ? t.bg : t.text,
                  border: `1px solid ${autoCaption ? t.text : t.border}`,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {autoCaption && <Icon name="check" size={11}/>}
                  Captions
                </button>
                <button onClick={() => setAutoMusic(!autoMusic)} style={{
                  padding: '6px 12px', borderRadius: 16,
                  background: autoMusic ? t.text : 'transparent',
                  color: autoMusic ? t.bg : t.text,
                  border: `1px solid ${autoMusic ? t.text : t.border}`,
                  cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {autoMusic && <Icon name="check" size={11}/>}
                  Music
                </button>
              </div>
            </div>
          </div>

          {/* Generated clips */}
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '40px 0 14px' }}>
            Your clips {clips.length > 0 && <span style={{ color: t.textDim, fontWeight: 500, fontSize: 13 }}>({clips.length})</span>}
          </h2>
          {clips.length === 0 ? (
            <EmptyState t={t} title="No clips yet" body="Paste a video URL or upload a file to get started." cta="Try a sample" onCta={() => generateClips('Sample podcast episode')}/>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {clips.map((c, i) => (
                <ClipCard key={c.id} t={t} clip={c} i={i}
                  styleColor={styleColors[c.style] || '#0a0a0d'}
                  onPlay={() => { k?.toast(`Playing clip: ${c.hook}`, 'info'); k?.log(`Played clip`, 'film', c.hook); }}
                  onExport={() => { k?.toast(`Exporting for ${c.style}…`, 'info'); k?.log(`Exported clip`, 'film', `${c.hook} · ${c.style}`); }}
                  onDelete={() => deleteClip(c.id)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClipCard({ t, clip, i, styleColor, onPlay, onExport, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: t.cardBg, border: `1px solid ${hover ? t.borderStrong : t.border}`,
        borderRadius: 12, overflow: 'hidden',
        transition: 'all 0.18s ease',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        animation: `fadeUp 0.4s ease-out ${i * 0.03}s both`,
        position: 'relative',
      }}>
      {/* Vertical thumb */}
      <div onClick={onPlay} style={{
        aspectRatio: '9 / 16',
        background: styleColor,
        position: 'relative', cursor: 'pointer',
        overflow: 'hidden',
      }}>
        {/* Pretend captions */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 14px',
        }}>
          <div style={{
            color: '#fff', fontSize: 13, fontWeight: 800,
            textAlign: 'center', lineHeight: 1.25,
            textShadow: '0 2px 6px rgba(0,0,0,0.7)',
            letterSpacing: -0.3,
          }}>
            "{clip.hook}"
          </div>
        </div>
        {/* Play button overlay */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 44, height: 44, borderRadius: 22,
          background: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 1 : 0, transition: 'opacity 0.18s ease',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}><polygon points="6 4 20 12 6 20"/></svg>
        </div>
        {/* Score badge */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: clip.score >= 90 ? '#16a34a' : clip.score >= 80 ? '#f59e0b' : '#71717a',
          color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
          padding: '3px 7px', borderRadius: 10,
        }}>{clip.score}</div>
        {/* Duration */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
          padding: '2px 6px', borderRadius: 3,
        }}>{clip.duration}</div>
      </div>
      {/* Footer */}
      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.source}</div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 1, fontFamily: 'monospace', letterSpacing: 0.3, textTransform: 'uppercase' }}>{clip.style}</div>
        </div>
        <button onClick={onExport} title="Export"
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: t.text, color: t.bg, border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button onClick={onDelete} title="Delete"
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'transparent', border: `1px solid ${t.border}`,
            color: t.textDim, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = t.textDim; e.currentTarget.style.borderColor = t.border; }}>
          <Icon name="trash" size={11}/>
        </button>
      </div>
    </div>
  );
}

// ===== Shared control group =====
function ControlGroup({ t, label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10.5, color: t.textDim, fontFamily: 'monospace', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{
          padding: '7px 14px 7px 16px', borderRadius: 18,
          background: t.cardBg, border: `1px solid ${t.border}`,
          color: t.text, cursor: 'pointer',
          fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          {value} <Icon name="chev-down" size={10}/>
        </button>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }}/>
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 4,
              background: t.panelStrong, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${t.borderStrong}`, borderRadius: 10,
              padding: 4, minWidth: 130, zIndex: 31,
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
              animation: 'fadeUp 0.15s ease-out',
            }}>
              {options.map(opt => (
                <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{
                  width: '100%', textAlign: 'left',
                  background: value === opt ? t.hover : 'transparent', border: 'none',
                  color: t.text, padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                  fontSize: 12.5, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = t.hover; }}
                onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}>
                  {value === opt && <Icon name="check" size={11}/>}
                  <span style={{ marginLeft: value === opt ? 0 : 17 }}>{opt}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
//  COMING SOON
// ============================================================
function ComingSoonPage({ t, theme, page, onBack }) {
  const titles = {
    claw:    { title: 'Kira Claw',      subtitle: 'Your physical workspace assistant.', accent: '#dc2626' },
    sheets:  { title: 'AI Sheets',      subtitle: 'AI-powered spreadsheets.',           accent: '#10b981' },
    music:   { title: 'AI Music',       subtitle: 'Compose original tracks from text.', accent: '#7c3aed' },
    video:   { title: 'AI Video',       subtitle: 'Turn ideas into cinematic clips.',   accent: '#b45309' },
    meeting: { title: 'Meeting Notes',  subtitle: 'Capture, summarize, and share.',     accent: '#0d9488' },
  };
  const info = titles[page] || { title: 'Coming Soon', subtitle: 'This module is on the way.', accent: '#6366f1' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '0 32px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 280, height: 280, borderRadius: '50%',
          background: `radial-gradient(circle, ${info.accent}33 0%, transparent 70%)`,
          filter: 'blur(40px)', animation: 'pulse 3s ease-in-out infinite',
        }}/>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `${info.accent}20`, border: `1px solid ${info.accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: info.accent, marginBottom: 22, zIndex: 1,
          animation: 'scaleIn 0.5s ease-out',
        }}>
          <Icon name="sparkle" size={36}/>
        </div>
        <h2 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', zIndex: 1 }}>{info.title}</h2>
        <p style={{ margin: '8px 0 26px', fontSize: 14.5, color: t.textDim, textAlign: 'center', maxWidth: 480, zIndex: 1 }}>{info.subtitle}</p>
        <span style={{
          padding: '6px 14px', borderRadius: 14,
          background: t.panel, border: `1px solid ${t.border}`,
          color: t.textDim, fontSize: 12.5, fontWeight: 500,
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          zIndex: 1,
        }}>Coming soon</span>
      </div>
    </div>
  );
}

// ============================================================
//  AGENT PICKER
// ============================================================
const ALL_AGENTS = [
  // Row 1
  { id: 'slides',    label: 'AI Slides',         icon: 'slides',       color: '#f59e0b', page: 'slides' },
  { id: 'sheets',    label: 'AI Sheets',         icon: 'sheets',       color: '#22c55e', page: 'sheets' },
  { id: 'docs',      label: 'AI Docs',           icon: 'docs',         color: '#3b82f6', page: 'docs' },
  // Row 2
  { id: 'designer',  label: 'AI Designer',       icon: 'designer',     color: '#a78bfa', page: 'designer' },
  { id: 'chat',      label: 'AI Chat',           icon: 'speak',        color: '#0ea5e9', page: 'chat' },
  { id: 'image',     label: 'AI Image',          icon: 'image',        color: '#a855f7', page: 'image' },
  // Row 3
  { id: 'research',  label: 'Deep Research',     icon: 'telescope',    color: '#8b5cf6', page: 'chat' },
  { id: 'cloudsync', label: 'Kira Cloud',        icon: 'cloud',        color: '#0ea5e9', page: 'drive' },
  { id: 'notes',     label: 'Smart Notes',       icon: 'notepad',      color: '#10b981', page: 'notepad' },
];

function AgentPicker({ t, theme, onClose, onPick }) {
  const k = useKira();
  const [query, setQuery] = useState('');
  const filtered = query
    ? ALL_AGENTS.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    : ALL_AGENTS;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Dim backdrop — click anywhere outside to close */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        zIndex: 40, animation: 'fadeUp 0.18s ease-out',
      }}/>

      {/* Left slide-out drawer — sits as a card, sized to content */}
      <aside style={{
        position: 'fixed',
        top: 12,
        left: 80,
        width: 360,
        maxHeight: 'calc(100vh - 24px)',
        background: theme === 'dark' ? 'rgba(18,18,24,0.95)' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: `1px solid ${t.borderStrong}`,
        borderRadius: 18,
        zIndex: 41,
        display: 'flex', flexDirection: 'column',
        boxShadow: theme === 'dark'
          ? '0 24px 60px rgba(0,0,0,0.5)'
          : '0 16px 50px rgba(0,0,0,0.12)',
        animation: 'slideInLeft 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        color: t.text,
        overflow: 'hidden',
      }}>
        {/* Header — back arrow + tabs icon */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px 10px',
        }}>
          <button onClick={onClose} title="Back" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: t.text, padding: 6, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.12s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <button title="Toggle" style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: t.text, padding: 6, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.12s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="tabs" size={20}/>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '14px 22px 26px',
        }}>
          {/* Optional search input — hidden by default, can be enabled */}
          {query !== null && (
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder=""
              style={{ display: 'none' }}/>
          )}

          {/* ===== AGENTS SECTION ===== */}
          <div style={{
            fontSize: 17, fontWeight: 700,
            color: t.text, letterSpacing: '-0.01em',
            marginBottom: 18,
          }}>
            Agents
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}>
            {filtered.map((a, i) => (
              <button key={a.id} onClick={() => onPick(a.page)}
                style={{ ...agentTile(t), animation: `fadeUp 0.3s ease-out ${i * 0.02}s both` }}
                onMouseEnter={(e) => e.currentTarget.style.background = t.hover}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {a.badge && (
                  <span style={{
                    position: 'absolute',
                    top: 4, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 9, fontWeight: 700,
                    background: '#f97316', color: '#ffffff',
                    padding: '2px 8px', borderRadius: 10,
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                  }}>{a.badge}</span>
                )}
                <div style={agentIconWrap(a.color)}>
                  <Icon name={a.icon} size={28}/>
                </div>
                <span style={agentLabel(t)}>{a.label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                No agents found
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ===== Helpers for the agent tile look =====
const agentTile = (t) => ({
  position: 'relative',
  background: 'transparent',
  border: 'none',
  padding: '14px 8px 12px',
  borderRadius: 12,
  cursor: 'pointer',
  color: t?.text || '#ffffff',
  fontFamily: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  transition: 'background 0.15s ease',
});

const agentIconWrap = (color, bg) => ({
  width: 46, height: 46,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color,
  ...(bg !== undefined ? { background: bg } : {}),
});

const agentLabel = (t) => ({
  fontSize: 12.5,
  fontWeight: 500,
  color: t?.text || '#ffffff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});


// ─── WorkspaceView — the exported component App.tsx imports ───────────────────
export default function WorkspaceView() {
  return <KiraWorkspaceInner />
}