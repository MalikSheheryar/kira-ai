/**
 * HelpView.tsx
 * Exact port of kira-help-light.html → TSX
 * - All sections visible at once, nav scrolls to section (like the HTML)
 * - Active nav link highlights on scroll
 * - Kira App header on top, help nav pill below it (sticky together)
 * - MainBG.png background + App.tsx glass/gradient tokens
 * - Outfit font throughout
 * - All topic content, FAQ, contact cards, modal, CTA — nothing missing
 */
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react'

// ─── Kira App.tsx design tokens ───────────────────────────────────────────────
const BTN_BLUE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  boxShadow: 'inset 0 0 0 1px #77C0FF, inset 0 1px 4px 2px #D2EAFF',
}
const ACCENT = '#2563eb'
const ACCENT2 = '#3b82f6'
const ACCENT3 = '#06b6d4'
const TEXT = '#0f172a'
const TEXT_DIM = 'rgba(15,23,42,0.62)'
const TEXT_FAINT = 'rgba(15,23,42,0.38)'
const GLASS = 'rgba(255,255,255,0.32)'
const GLASS_STRONG = 'rgba(255,255,255,0.48)'
const GLASS_BORDER = 'rgba(255,255,255,0.55)'
const SHADOW_SOFT = '0 6px 24px rgba(37,99,235,0.06)'
const SHADOW_MED = '0 10px 32px rgba(37,99,235,0.10)'

// ─── injected CSS (keyframes + class-based hover styles) ──────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Outfit:wght@300;400;500;600&display=swap');
@keyframes float1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(100px,80px) scale(1.1)}}
@keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-80px,-60px) scale(1.15)}}
@keyframes float3{0%,100%{transform:translate(-50%,0) scale(1)}50%{transform:translate(-30%,50px) scale(1.2)}}
@keyframes wave{0%,60%,100%{transform:rotate(0deg)}10%,30%{transform:rotate(14deg)}20%{transform:rotate(-8deg)}40%{transform:rotate(-4deg)}50%{transform:rotate(10deg)}}
@keyframes fadeIn{to{opacity:1;transform:translateY(0)}}
.kh-fade{opacity:0;transform:translateY(20px);animation:fadeIn 0.8s ease forwards}
.kh-d1{animation-delay:0.1s}.kh-d2{animation-delay:0.2s}.kh-d3{animation-delay:0.3s}.kh-d4{animation-delay:0.4s}
.kh-wave{display:inline-block;animation:wave 2.5s ease-in-out infinite;transform-origin:70% 70%}
.kh-qcard:hover{transform:translateY(-4px)!important;background:${GLASS_STRONG}!important;box-shadow:${SHADOW_MED}!important}
.kh-topic:hover{transform:translateY(-3px)!important;background:${GLASS_STRONG}!important;box-shadow:${SHADOW_MED}!important}
.kh-topic li{padding:10px 0;border-bottom:1px solid rgba(15,23,42,0.08);color:${TEXT_DIM};font-size:15px;cursor:pointer;transition:color 0.2s,padding-left 0.2s;list-style:none;display:flex;align-items:center}
.kh-topic li:last-child{border-bottom:none}
.kh-topic li:hover{color:${TEXT};padding-left:6px}
.kh-topic li::before{content:'→ ';color:${ACCENT};opacity:0;transition:opacity 0.2s;margin-right:4px}
.kh-topic li:hover::before{opacity:1}
.kh-ccard:hover{transform:translateY(-3px)!important;background:${GLASS_STRONG}!important;box-shadow:${SHADOW_MED}!important}
.kh-ccard a:hover{gap:10px!important}
.kh-nlink{color:${TEXT_DIM};text-decoration:none;transition:color 0.2s,background 0.2s;padding:8px 14px;border-radius:100px;cursor:pointer;font-size:14px;background:transparent;border:none;font-family:'Outfit',system-ui,sans-serif}
.kh-nlink:hover{color:${ACCENT};background:rgba(37,99,235,0.05)}
.kh-nlink.active{color:${ACCENT};background:rgba(37,99,235,0.08);font-weight:500}
.kh-cta-link:hover{transform:translateY(-1px)!important;box-shadow:0 8px 24px rgba(37,99,235,0.18)!important}
.kh-btn-sec:hover{background:rgba(255,255,255,0.82)!important;transform:translateY(-2px)!important}
.kh-modal-close:hover{background:rgba(37,99,235,0.10)!important;transform:rotate(90deg)!important}
.kh-social:hover{background:linear-gradient(135deg,${ACCENT},${ACCENT2})!important;color:#fff!important;transform:translateY(-2px)!important;border-color:transparent!important}
.kh-flink:hover{color:${ACCENT}!important}
.kh-search:focus-within{border-color:${ACCENT}!important;box-shadow:0 0 0 4px rgba(37,99,235,0.08),${SHADOW_MED}!important}
`

// ─── All topic content ────────────────────────────────────────────────────────
const TOPICS: Record<
  string,
  { category: string; title: string; body: string }
> = {
  'create-account': {
    category: 'Account & Profile',
    title: 'Creating your Kira account',
    body: `<p>Kira AI is a downloadable desktop and mobile app — there is no browser version. Creating an account takes about a minute and gives you access to everything Kira can do across all your devices.</p><h3>Step 1 — Download the app</h3><p>Go to <strong>kira.ai/download</strong> and pick the installer for your platform:</p><p>• <strong>macOS</strong> — universal binary for Apple Silicon and Intel, requires macOS 12 (Monterey) or newer<br>• <strong>Windows</strong> — installer for Windows 10 and 11 (x64 and ARM64)<br>• <strong>Linux</strong> — AppImage, .deb, and .rpm packages for Ubuntu, Fedora, Debian, and Arch<br>• <strong>iOS</strong> — App Store, requires iOS 16 or newer<br>• <strong>Android</strong> — Google Play, requires Android 10 or newer</p><h3>Step 2 — Choose a sign-up method</h3><p>Launch the app and pick how you want to sign in:<br>• <strong>Email + password</strong> — quickest if you prefer not to link other accounts.<br>• <strong>Google</strong> — single sign-on with your Google Workspace or personal account, recommended for teams.<br>• <strong>Apple</strong> — sign in with Apple ID with optional hidden email relay.<br>• <strong>Microsoft</strong> — works with personal Microsoft accounts and corporate Azure AD/Entra ID.</p><h3>Step 3 — Verify your email</h3><p>If you signed up with email/password, look for a verification link from <em>no-reply@kira.ai</em>. Click it once and you're set.</p><h3>Step 4 — Set up your profile</h3><p>Add a display name, a profile picture, your time zone, and your preferred language. These help Kira tailor responses and make shared workspaces friendlier.</p><h3>Multi-device sync</h3><p>Sign into the same account on as many devices as you like. Your chats, settings, Projects, and memory sync seamlessly within seconds.</p><h3>What you get on Day 1</h3><p>New accounts start on the Free plan with the standard model, 10 MB attachments, and unlimited chat history. You can upgrade to Pro at any time without losing anything.</p>`,
  },
  'verify-email': {
    category: 'Account & Profile',
    title: 'Verifying your email address',
    body: `<p>Email verification confirms you own the address and unlocks important security features like password recovery, two-factor authentication backups, and team invitations.</p><h3>Where the verification email comes from</h3><p>Right after signup, check your inbox for a message titled <em>"Confirm your Kira AI email"</em> from <strong>no-reply@kira.ai</strong>. The link inside is valid for 24 hours and can only be used once.</p><h3>If it doesn't arrive within 5 minutes</h3><p>• Check your <strong>spam</strong>, <strong>promotions</strong>, or <strong>junk</strong> folders<br>• Add <strong>no-reply@kira.ai</strong> to your safe-senders list<br>• Corporate mail filters can take up to 15 minutes<br>• If you used a typo'd address, sign out, sign back in with the correct one, and request a new link<br>• Check that your inbox isn't full</p><h3>Request a new link</h3><p>Open the app and go to <strong>Settings → Account → Email → Resend verification</strong>. You can request up to 5 times per hour.</p><h3>Changing your email address</h3><p>Update your primary email from <strong>Settings → Account → Email</strong>. The new address must be verified before it becomes active.</p>`,
  },
  'change-password': {
    category: 'Account & Profile',
    title: 'Changing password or username',
    body: `<p>You can update your password, display name, and profile details at any time from inside the Kira app.</p><h3>Changing your password</h3><p>1. Open the app and click your profile avatar<br>2. Select <strong>Settings → Account → Security</strong><br>3. Click <em>Change password</em><br>4. Enter your current password, then your new one twice<br>5. Save</p><p>The new password must be at least 12 characters and cannot match any of your last 5 passwords.</p><h3>What happens after a password change</h3><p>You'll be signed out of every other device for security. Active chat sessions are preserved. Any active API keys you've issued remain valid.</p><h3>Changing your display name</h3><p>Go to <strong>Settings → Account → Profile</strong>. Display names appear in shared chats, team workspaces, and exported transcripts.</p><h3>Forgot your current password?</h3><p>Use the <em>Forgot password?</em> link on the login screen. A reset email is sent within 1–2 minutes; check spam if needed. The link expires after 1 hour.</p>`,
  },
  'two-factor': {
    category: 'Account & Profile',
    title: 'Two-factor authentication setup',
    body: `<p>Two-factor authentication (2FA) adds a second layer of security so that even if someone gets your password, they can't sign in without your second factor.</p><h3>Supported methods</h3><p>• <strong>Authenticator app (recommended)</strong> — Google Authenticator, 1Password, Authy, or any TOTP-compatible app<br>• <strong>Hardware security key</strong> — YubiKey, Titan, or any FIDO2/WebAuthn-compatible key<br>• <strong>Passkey</strong> — supported on macOS, iOS, Windows 11, and Android<br>• <strong>SMS</strong> — available as a backup but not recommended</p><h3>Setting up an authenticator app</h3><p>1. Go to <strong>Settings → Account → Security → Two-factor authentication</strong><br>2. Click <em>Enable</em> and select <em>Authenticator app</em><br>3. A QR code appears — open your authenticator app and scan it<br>4. Enter the 6-digit code your app generates<br>5. Save your 10 backup codes to a password manager</p><h3>Backup codes</h3><p>Every 2FA setup gives you 10 single-use backup codes. Store them somewhere offline and accessible.</p><h3>Lost your device or codes?</h3><p>If you've lost everything, email <a href="mailto:support@kira.ai" style="color:${ACCENT}">support@kira.ai</a> from your verified email. Identity verification takes 1–3 business days.</p>`,
  },
  'delete-account': {
    category: 'Account & Profile',
    title: 'Deleting your account permanently',
    body: `<p>Account deletion is permanent and removes all your data from our systems. Take a few minutes before you commit so nothing important is lost.</p><h3>Before you delete — checklist</h3><p>• <strong>Export your conversation history</strong> if you might want it later<br>• <strong>Download any invoices</strong> from Settings → Billing → Invoices<br>• <strong>Cancel your subscription</strong> first — deleting an account does not stop active billing<br>• <strong>Disconnect integrations</strong> to revoke access tokens<br>• <strong>Transfer ownership</strong> of any shared Team workspaces<br>• <strong>Revoke API keys</strong> from Settings → Developers</p><h3>How to delete</h3><p>1. Open the Kira app and go to <strong>Settings → Account → Delete account</strong><br>2. Read the consequences screen carefully<br>3. Enter your password and 2FA code to confirm<br>4. Type the word <em>DELETE</em> to confirm one last time</p><p>You'll receive a confirmation email immediately. Deletion begins after a 7-day grace period.</p><h3>What happens during deletion</h3><p>Within 30 days all your data is permanently removed: chats, files, Projects, memory, settings, profile information, integration tokens, and API keys.</p>`,
  },
  prompts: {
    category: 'Using Kira AI',
    title: 'Writing effective prompts',
    body: `<p>The quality of what you get out of Kira depends a lot on what you put in. These techniques work across writing, coding, research, analysis, and creative work.</p><h3>Be specific about the outcome</h3><p>Vague prompts produce generic responses. Specify length, audience, tone, format, and what success looks like.</p><h3>Share context up front</h3><p>Kira works best when it has the same context a human collaborator would need. Paste the relevant email, document, code, or brief directly into the chat.</p><h3>Use roles and personas</h3><p>• <em>"Act as a senior editor reviewing this draft for clarity and concision."</em><br>• <em>"You're a SOC 2 auditor — point out gaps in this security policy."</em><br>• <em>"Pretend you're explaining this to a curious 12-year-old."</em></p><h3>Show examples of what you want</h3><p>Few-shot prompting works exceptionally well. Show 2-3 examples of input → desired output and Kira will follow the pattern.</p><h3>Iterate, don't restart</h3><p>If the first response isn't quite right, ask for changes in the same chat. Iterating preserves the chain of context.</p><h3>Ask for the thinking</h3><p>For complex reasoning, ask Kira to <em>"think through this step by step"</em> or <em>"show your reasoning before giving the final answer."</em></p>`,
  },
  attachments: {
    category: 'Using Kira AI',
    title: 'Working with attachments & files',
    body: `<p>Drop files into any chat and Kira can read, summarize, transform, and reason over them in context.</p><h3>How to attach files</h3><p>• <strong>Drag and drop</strong> onto the chat window<br>• Click the <strong>paperclip icon</strong> next to the message input<br>• <strong>Paste an image</strong> directly with Cmd/Ctrl+V<br>• On mobile, tap the <strong>+</strong> icon</p><h3>Supported file types</h3><p>• <strong>Documents:</strong> PDF, DOCX, PPTX, XLSX, CSV, TSV, TXT, MD, RTF, EPUB<br>• <strong>Images:</strong> PNG, JPG/JPEG, GIF, WEBP, SVG, HEIC, BMP, TIFF<br>• <strong>Code:</strong> any plain-text source files<br>• <strong>Audio:</strong> MP3, WAV, M4A, FLAC, OGG, AAC — automatically transcribed<br>• <strong>Video:</strong> MP4, MOV, AVI, WEBM — audio transcribed and key frames extracted<br>• <strong>Archives:</strong> ZIP, TAR, GZ</p><h3>Size limits by plan</h3><p>• <strong>Free:</strong> 10 MB per file, 3 files per message, 50 files per day<br>• <strong>Pro:</strong> 32 MB per file, 10 files per message, unlimited daily<br>• <strong>Team:</strong> 100 MB per file, 25 files per message, unlimited daily<br>• <strong>Enterprise:</strong> 500 MB per file, custom limits</p>`,
  },
  'voice-mode': {
    category: 'Using Kira AI',
    title: 'Voice mode & transcription',
    body: `<p>Have full natural conversations with Kira using your voice. Great for walking, driving, cooking, or just thinking out loud without typing.</p><h3>Enabling voice mode</h3><p>1. Tap the <strong>microphone icon</strong> at the bottom of any chat<br>2. Grant microphone permissions when prompted (one-time)<br>3. Speak naturally — Kira detects when you stop talking and responds<br>4. Tap the X to end the voice session and return to text</p><h3>Voice options</h3><p>Choose from 12 voices in Settings → Voice. Voices vary in tone (warm, neutral, professional), pace, and pitch.</p><h3>Supported languages</h3><p>Voice mode supports 28 languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Russian, Mandarin, Japanese, Korean, Vietnamese, Thai, Indonesian, Hindi, Tamil, Arabic, Hebrew, Turkish, and more.</p><h3>Hands-free shortcut</h3><p>Enable <em>Wake word</em> in Settings → Voice to start voice conversations by saying <em>"Hey Kira"</em> without touching your device.</p>`,
  },
  'organize-chats': {
    category: 'Using Kira AI',
    title: 'Saving and organizing chats',
    body: `<p>Kira saves every conversation automatically, so you never lose your work. Here's how to keep it organized as your history grows.</p><h3>Automatic titling</h3><p>Kira auto-generates a short, descriptive title for every new chat after a few exchanges. You can rename any chat by right-clicking it in the sidebar.</p><h3>Projects — group related chats</h3><p>A <strong>Project</strong> is a folder of chats that share context, files, and instructions. Create a Project from the sidebar's <em>+</em> menu. Add custom instructions and shared files that every chat in the Project can reference.</p><h3>Starring chats</h3><p>Click the star icon at the top of any chat to pin it to the <em>Starred</em> section at the top of your sidebar. Starred chats sync across devices.</p><h3>Search</h3><p>Use the search bar at the top of the sidebar (or Cmd/Ctrl+K) to find chats by title, any text inside the conversation, date range, Project, or files attached.</p>`,
  },
  'share-chat': {
    category: 'Using Kira AI',
    title: 'Sharing conversations with others',
    body: `<p>Share a Kira conversation as a public link, with a workspace teammate, or as a downloadable export.</p><h3>Public share links</h3><p>1. Click the <strong>share icon</strong> at the top of any chat<br>2. Choose <em>Create public link</em><br>3. Set permissions: read-only (default) or allow viewers to copy the chat to their own account<br>4. Copy the link and share anywhere</p><p>Anyone with the link can read the conversation — no account required. You can revoke any link at any time.</p><h3>Export options</h3><p>Click the share icon → <em>Export</em> to download as Markdown, PDF, HTML, JSON, or plain text.</p><h3>Privacy reminder</h3><p>Shared chats include everything in the conversation. Review before sharing publicly.</p>`,
  },
  'plan-comparison': {
    category: 'Subscriptions',
    title: 'Free vs. Pro vs. Team plans',
    body: `<p>Pick the plan that fits how you use Kira. You can upgrade, downgrade, or cancel at any time, and your chats and Projects always carry over.</p><h3>Free — $0 forever</h3><p>• Daily access to our standard model<br>• 10 MB file uploads, 3 attachments per message, 50 files per day<br>• Unlimited chat history, never deleted<br>• Desktop and mobile apps with full sync<br>• Community support</p><h3>Pro — $20/month or $200/year (save 17%)</h3><p>• Our <strong>most capable model</strong> with extended 500K-token context window<br>• <strong>5× higher</strong> message and tool-use limits<br>• 32 MB file uploads, 10 attachments per message, unlimited daily<br>• Image generation and voice mode included<br>• Priority access — no slowdowns during peak hours<br>• API access with generous trial credits<br>• Priority email support (24 hr response)</p><h3>Team — $30/seat/month or $300/seat/year</h3><p>• Everything in Pro for every team member<br>• <strong>Shared Projects</strong> and workspace-wide chat sharing<br>• <strong>Admin console</strong> for member management, usage analytics, and policy enforcement<br>• 100 MB file uploads, 25 attachments per message<br>• Centralized billing, SCIM provisioning, audit logs (90-day retention)</p><h3>Enterprise — custom pricing</h3><p>Everything in Team, plus SSO/SAML, data residency, HIPAA controls, contractual SLAs, dedicated CSM, 24/7 priority support, volume pricing. <a href="mailto:sales@kira.ai" style="color:${ACCENT}">Contact sales →</a></p>`,
  },
  'cancel-plan': {
    category: 'Subscriptions',
    title: 'Upgrading or canceling anytime',
    body: `<p>Subscription changes are simple and take effect immediately or at your next billing cycle, depending on which direction you're moving.</p><h3>Upgrading</h3><p>1. Open <strong>Settings → Billing → Change plan</strong><br>2. Pick your new plan and review the prorated cost<br>3. Confirm — the upgrade is effective immediately</p><h3>Downgrading</h3><p>Downgrade from the same screen. The change applies <strong>at the end of your current billing period</strong>. No prorated refund is issued on downgrade.</p><h3>Canceling</h3><p>1. <strong>Settings → Billing → Cancel subscription</strong><br>2. Optional: tell us why (we read every response)<br>3. Confirm</p><p>Your paid features remain active through the end of the current billing period.</p><h3>Pausing instead of canceling</h3><p>If you're going on vacation, use <em>Vacation hold</em> from the same Billing screen instead. You can pause for 1, 2, or 3 months — billing stops, and your plan resumes automatically.</p>`,
  },
  refunds: {
    category: 'Subscriptions',
    title: 'Refunds and billing disputes',
    body: `<p>We want every customer to feel good about their subscription.</p><h3>Monthly subscriptions</h3><p>Cancel at any time. Refunds are not issued for partial months, but you keep full access through the end of the billing period. If you forget to cancel before a renewal, contact us within 7 days of the charge and we'll usually refund as a one-time courtesy.</p><h3>Annual subscriptions</h3><p>If you cancel within the first <strong>14 days</strong> of an annual plan, you'll receive a prorated refund for unused months. After 14 days, the plan continues to its end date with no refund.</p><h3>Duplicate or accidental charges</h3><p>Email <a href="mailto:support@kira.ai" style="color:${ACCENT}">support@kira.ai</a> with the charge date, amount, and last four digits of the card. We respond within 1 business day and process valid disputes within 3 business days.</p><h3>How to reach billing support</h3><p>Email <a href="mailto:billing@kira.ai" style="color:${ACCENT}">billing@kira.ai</a> for anything billing-related.</p>`,
  },
  'team-seats': {
    category: 'Subscriptions',
    title: 'Managing team seats & admins',
    body: `<p>Team plan admins have full control over members, billing, and workspace policies.</p><h3>Inviting members</h3><p>1. Open <strong>Workspace → Members → Invite</strong><br>2. Enter email addresses or share an invite link<br>3. Choose their role: Admin, Member, or Guest<br>4. Click Invite — they'll receive instructions to join</p><h3>Roles in detail</h3><p>• <strong>Admin</strong> — full workspace control<br>• <strong>Member</strong> — full access to Kira features, Projects, and shared workspace resources<br>• <strong>Guest</strong> — view-only access to specific shared chats. Does not consume a seat.</p><h3>Removing members</h3><p>Removing a member ends their access immediately. Any chats they created in shared Projects remain in the workspace.</p>`,
  },
  discounts: {
    category: 'Subscriptions',
    title: 'Student & nonprofit discounts',
    body: `<p>We offer meaningful discounts to students, educators, nonprofits, and open-source maintainers.</p><h3>Student discount — 50% off Pro</h3><p>Currently enrolled students at accredited institutions get half-price Pro at $10/month. Verify through our partner SheerID.</p><h3>Educator discount — 50% off Pro</h3><p>Teachers and professors at accredited K-12 schools, colleges, and universities get the same 50% off Pro.</p><h3>Nonprofit discount — 50% off all plans</h3><p>Registered nonprofits (US 501(c)(3) or international equivalents) get half off every plan. Verify through TechSoup, Percent, or by emailing <a href="mailto:nonprofits@kira.ai" style="color:${ACCENT}">nonprofits@kira.ai</a>.</p><h3>Open-source maintainer program — free Pro</h3><p>Maintain a project with significant public adoption? Apply at <strong>kira.ai/oss</strong>. Approval is typically within a week.</p>`,
  },
  'data-location': {
    category: 'Data & Privacy',
    title: 'Where your data lives',
    body: `<p>Transparency about where your data is stored and processed is fundamental to building trust.</p><h3>Default region</h3><p>By default, your data is stored in <strong>US-East</strong> (Virginia, AWS region us-east-1). Data is replicated across multiple availability zones but never leaves the region.</p><h3>EU storage option</h3><p>EU and EEA customers can opt into <strong>EU-West</strong> (Frankfurt, AWS region eu-central-1) at no additional cost. Go to <strong>Settings → Privacy → Data residency</strong> to switch.</p><h3>Encryption at rest</h3><p>All data on disk is encrypted with <strong>AES-256</strong>. Encryption keys are managed in AWS KMS with automatic rotation every 90 days.</p><h3>Encryption in transit</h3><p>All connections use <strong>TLS 1.3</strong>. Older TLS versions are rejected.</p><h3>Audits and certifications</h3><p>SOC 2 Type II audited annually; ISO 27001 certified; GDPR-compliant; HIPAA-ready under BAA (Enterprise); CCPA-compliant.</p>`,
  },
  'training-optout': {
    category: 'Data & Privacy',
    title: 'Training opt-out controls',
    body: `<p>Your conversations are <strong>not used to train our models by default</strong>. Training on user data is opt-in only.</p><h3>How to check your current setting</h3><p>1. Open <strong>Settings → Privacy → Data controls</strong><br>2. Look for "Help improve Kira"<br>3. If it's <strong>off</strong>, none of your data is used for training. This is the default for all new accounts.</p><h3>Team and Enterprise workspaces</h3><p>Workspace data on Team and Enterprise plans is <strong>never</strong> used for training, regardless of individual member settings.</p><h3>API customers</h3><p>API traffic is <strong>never</strong> used for training under any circumstance. This is contractually guaranteed in our DPA and Terms.</p>`,
  },
  'export-data': {
    category: 'Data & Privacy',
    title: 'Exporting your conversation history',
    body: `<p>You own your data. You can export everything, anytime, in formats that work outside Kira.</p><h3>How to request an export</h3><p>1. Go to <strong>Settings → Privacy → Export my data</strong><br>2. Click <em>Request export</em><br>3. Choose what to include<br>4. Click <em>Start export</em></p><p>You'll be emailed when the export is ready, usually within minutes. The secure download link is valid for 7 days.</p><h3>What you can include</h3><p>• All chats, uploaded files, account settings and preferences<br>• Memory entries, custom instructions, billing history and invoices<br>• Integration metadata and API keys metadata</p><h3>Export formats</h3><p>Exports arrive as a ZIP file containing JSON, Markdown, HTML, and your uploaded files in their original formats.</p>`,
  },
  gdpr: {
    category: 'Data & Privacy',
    title: 'GDPR & data subject requests',
    body: `<p>Kira AI is fully GDPR-compliant. We extend the same rights to users globally.</p><h3>Your rights under GDPR</h3><p>• <strong>Right of access</strong> — Settings → Privacy → Export my data<br>• <strong>Right to rectification</strong> — Settings → Account<br>• <strong>Right to erasure</strong> — Settings → Account → Delete account<br>• <strong>Right to data portability</strong> — JSON export<br>• <strong>Right to restriction</strong> — submit a request to privacy@kira.ai<br>• <strong>Right to object</strong> — Settings → Privacy → Data controls</p><h3>How to submit a data subject request</h3><p>Most requests are self-service in Settings. For anything else, email <a href="mailto:privacy@kira.ai" style="color:${ACCENT}">privacy@kira.ai</a>. We respond within <strong>30 days</strong> as required by GDPR.</p><h3>Data Protection Officer (DPO)</h3><p>Our DPO can be reached at <a href="mailto:dpo@kira.ai" style="color:${ACCENT}">dpo@kira.ai</a>.</p>`,
  },
  memory: {
    category: 'Data & Privacy',
    title: 'Memory and personalization settings',
    body: `<p>Memory lets Kira retain useful context across chats so you don't have to repeat yourself every conversation.</p><h3>Enabling memory</h3><p>1. Open <strong>Settings → Personalization → Memory</strong><br>2. Toggle <em>Memory</em> on<br>3. Optionally, seed memory with a few things you want Kira to know about you</p><h3>Viewing and editing memories</h3><p>The same settings page shows everything Kira has remembered, organized into categories. You can edit any entry, delete individual memories, or clear all memory and start fresh.</p><h3>Asking Kira to remember in-context</h3><p>Just say it: <em>"Remember that I'm vegetarian"</em> or <em>"Going forward, default to TypeScript."</em></p>`,
  },
  'gdrive-notion': {
    category: 'Integrations',
    title: 'Connecting Google Drive & Notion',
    body: `<p>Bring the documents you already have into Kira. Once connected, you can ask Kira to find, summarize, search, or build on anything in your Drive or Notion workspace without copy-paste.</p><h3>Connecting Google Drive</h3><p>1. In the Kira app, open <strong>Settings → Integrations → Google Drive</strong><br>2. Click <em>Connect</em> and sign in with your Google account<br>3. Choose <em>scope</em>: Read-only or Read and write<br>4. Optionally select specific folders to expose</p><h3>Connecting Notion</h3><p>1. <strong>Settings → Integrations → Notion → Connect</strong><br>2. Sign into Notion and choose which pages, databases, and workspaces to share with Kira<br>3. Click Allow access</p><h3>Security and access</h3><p>• OAuth tokens are encrypted at rest with AES-256<br>• Kira only accesses what you've explicitly granted<br>• You can revoke access from either side at any time</p>`,
  },
  'slack-teams': {
    category: 'Integrations',
    title: 'Slack & Microsoft Teams setup',
    body: `<p>Use Kira directly inside your team's chat workspace.</p><h3>Slack setup</h3><p>1. In the Kira app, go to <strong>Settings → Integrations → Slack</strong><br>2. Click <em>Add to Slack</em><br>3. Choose your Slack workspace and authorize Kira's requested scopes<br>4. The Kira bot appears in your workspace</p><p>Use <code>/kira [your question]</code> in any channel or DM, or <strong>@Kira</strong> in a channel where the bot has been added.</p><h3>Microsoft Teams setup</h3><p>1. Open Microsoft Teams<br>2. Click <em>Apps</em> in the left sidebar → search <em>Kira AI</em><br>3. Click <em>Add</em> and sign in with your Kira account</p>`,
  },
  'calendar-email': {
    category: 'Integrations',
    title: 'Calendar and email integrations',
    body: `<p>Connect your calendar and email so Kira can help you schedule, draft, follow up, and keep your inbox sane.</p><h3>Calendar integration</h3><p>Kira supports Google Calendar, Microsoft Outlook Calendar, and Apple Calendar.</p><p>Setup: <strong>Settings → Integrations → Calendar</strong>, pick your provider, grant access, and optionally enable write access.</p><h3>Email integration</h3><p>Kira supports Gmail and Microsoft Outlook (Exchange Online).</p><p>Setup: <strong>Settings → Integrations → Email</strong>, pick your provider, choose permission level, and optionally select which folders Kira can access.</p><h3>Smart inbox features (Pro and above)</h3><p>• <strong>Daily digest</strong> — every morning Kira can summarize what arrived overnight<br>• <strong>VIP routing</strong> — mark contacts whose emails Kira should always surface immediately<br>• <strong>Auto-drafts</strong> — Kira prepares drafts for routine emails based on your past responses</p>`,
  },
  'mcp-servers': {
    category: 'Integrations',
    title: 'Custom MCP servers',
    body: `<p>Model Context Protocol (MCP) is an open standard that lets Kira talk to any custom tool, internal system, or data source.</p><h3>What is MCP?</h3><p>MCP is a protocol for AI assistants to discover and call tools (functions) and read resources (data) exposed by external servers. Any server that "speaks MCP" can plug into Kira.</p><h3>How to connect a server</h3><p>1. Go to <strong>Settings → Integrations → Custom MCP</strong><br>2. Click <em>Add server</em><br>3. Enter Name, Server URL or executable path, and Authentication<br>4. Kira queries the server for the tools and resources it provides<br>5. Review and approve the tools you want enabled</p><h3>Building your own MCP server</h3><p>Specs and SDKs are at <strong>modelcontextprotocol.io</strong>. Official SDKs in TypeScript, Python, Go, and Ruby. A minimal MCP server can be written in 50 lines of TypeScript.</p>`,
  },
  'disconnect-apps': {
    category: 'Integrations',
    title: 'Removing or disconnecting apps',
    body: `<p>Revoke access to any integration when you no longer need it.</p><h3>How to disconnect from inside Kira</h3><p>1. Open the Kira app<br>2. Go to <strong>Settings → Integrations</strong><br>3. Find the integration you want to remove<br>4. Click <em>Disconnect</em> and confirm</p><p>Access tokens are invalidated immediately.</p><h3>Revoking from the third-party side</h3><p>• <strong>Google</strong>: myaccount.google.com → Security → Your connections to third-party apps<br>• <strong>Microsoft</strong>: account.microsoft.com → Privacy → Manage app permissions<br>• <strong>Notion</strong>: Settings → Connections → Kira AI<br>• <strong>Slack</strong>: Workspace settings → Apps → Kira AI → Remove</p>`,
  },
  'app-crash': {
    category: 'Troubleshooting',
    title: "App won't load or crashes",
    body: `<p>Almost every loading issue resolves with a few standard steps. Work through these in order.</p><h3>Step 1 — Check our status page</h3><p>Visit <strong>status.kira.ai</strong>. If there's an ongoing incident, it's noted there with estimated resolution time and live updates.</p><h3>Step 2 — Restart the app</h3><p>• <strong>macOS:</strong> Cmd+Q to fully quit, then reopen<br>• <strong>Windows:</strong> right-click the taskbar icon → Quit, then reopen<br>• <strong>iOS/Android:</strong> swipe up to close from app switcher, then reopen</p><h3>Step 3 — Update to the latest version</h3><p>Desktop: Kira auto-updates on launch. To force-check, go to <em>Kira menu → Check for updates</em>.</p><h3>Step 4 — Clear app cache</h3><p>• <strong>macOS/Windows:</strong> <em>Settings → Advanced → Clear cache</em><br>• <strong>Mobile:</strong> <em>Settings → Advanced → Clear cache</em></p><h3>Still stuck</h3><p>1. Open <strong>Settings → Help → Generate diagnostic report</strong><br>2. Email the .zip to <a href="mailto:support@kira.ai" style="color:${ACCENT}">support@kira.ai</a> along with what you were trying to do and your OS/app version.</p>`,
  },
  'login-issues': {
    category: 'Troubleshooting',
    title: 'Login problems & password resets',
    body: `<p>Can't sign in? Work through these in order to find the right fix.</p><h3>"Incorrect password"</h3><p>1. Check Caps Lock and keyboard language<br>2. Try copy-pasting from your password manager to rule out typos<br>3. If you genuinely don't remember, use <em>Forgot password?</em> on the login screen<br>4. A reset email is sent within 1–2 minutes to your registered address<br>5. Check spam if it doesn't arrive<br>6. Reset links expire after 1 hour and are single-use</p><h3>2FA code not working</h3><p>• Make sure your device's clock is accurate — 2FA codes are time-based<br>• Try the next code (codes rotate every 30 seconds)<br>• Try a backup recovery code instead<br>• If you've lost both your device and recovery codes, contact <a href="mailto:support@kira.ai" style="color:${ACCENT}">support@kira.ai</a></p><h3>"Account locked"</h3><p>After many failed sign-in attempts, accounts are temporarily locked. Wait <strong>15 minutes</strong> and try again.</p>`,
  },
  'slow-responses': {
    category: 'Troubleshooting',
    title: 'Slow responses or timeouts',
    body: `<p>Responses normally start streaming within 1–2 seconds. If yours are slower or timing out, here's how to diagnose.</p><h3>Step 1 — Check status</h3><p>Visit <strong>status.kira.ai</strong>. Performance issues, partial outages, and high-traffic periods are reported there.</p><h3>Step 2 — Peak time considerations</h3><p>Free plan users experience occasional slowdowns during peak hours. Pro and Team plans get priority routing and are generally unaffected.</p><h3>Step 3 — Long-chat slowdowns</h3><p>As a chat grows, Kira processes more context each turn. Very long chats can slow significantly. Fix: start a fresh chat and paste in only the relevant context.</p><h3>Step 4 — Network diagnostics</h3><p>• Test a different network — phone hotspot vs. home Wi-Fi can reveal network-specific issues<br>• VPN check — VPNs often route to slower regions; try disconnecting temporarily<br>• Corporate Wi-Fi may have deep packet inspection; IT can whitelist <strong>*.kira.ai</strong></p>`,
  },
  'missing-chats': {
    category: 'Troubleshooting',
    title: 'Missing chats or lost data',
    body: `<p>Chats almost never truly disappear — let's track yours down. Work through these in order.</p><h3>Check for sync delays</h3><p>If a chat appears on one device but not another, pull down to refresh on mobile or restart the app on desktop. Make sure both devices are signed into the same account.</p><h3>Check Archive</h3><p>Chats can be archived manually or by auto-archive rules. Go to <strong>Settings → Chats → Archive</strong> or filter your sidebar by <em>All chats including archived</em>.</p><h3>Check Trash</h3><p>Deleted chats go to Trash for <strong>30 days</strong>, where you can restore them. Find it under <em>Settings → Chats → Trash</em>.</p><h3>If a chat is genuinely gone</h3><p>We keep encrypted backups for 90 days. Email <a href="mailto:support@kira.ai" style="color:${ACCENT}">support@kira.ai</a> with approximate date(s) of the missing chat(s).</p>`,
  },
  'report-bug': {
    category: 'Troubleshooting',
    title: 'Reporting bugs to the team',
    body: `<p>We genuinely want to hear about bugs. Most of our quality improvements come from user reports.</p><h3>The fastest path — in-chat feedback</h3><p>Right after a Kira response, you'll see thumbs-up / thumbs-down buttons. Tap thumbs-down on anything wrong and add a one-sentence note.</p><h3>For UI bugs and app issues</h3><p>Email <a href="mailto:bugs@kira.ai" style="color:${ACCENT}">bugs@kira.ai</a> with:<br>• A clear, specific description of what happened<br>• What you expected to happen instead<br>• Exact steps to reproduce<br>• OS, app version, and device model<br>• Screenshots or a short screen recording</p><h3>For security issues</h3><p>Email <a href="mailto:security@kira.ai" style="color:${ACCENT}">security@kira.ai</a> with details. PGP key available for sensitive disclosures. We acknowledge reports within 24 hours.</p>`,
  },
}

// ─── Modal data ───────────────────────────────────────────────────────────────
const MODALS: Record<
  string,
  { category: string; title: string; body: string }
> = {
  status: {
    category: 'System Status',
    title: 'All systems <span style="color:#10b981">operational</span>',
    body: `<p>Last checked just now. All services are running normally.</p><h3>Services</h3><ul style="list-style:none;padding:0"><li style="padding:8px 0;border-bottom:1px solid rgba(37,99,235,0.05);display:flex;justify-content:space-between;align-items:center"><span><span style="width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px rgba(16,185,129,0.5);display:inline-block;margin-right:8px"></span>API</span><span style="color:#10b981;font-weight:500;font-size:14px">Operational</span></li><li style="padding:8px 0;border-bottom:1px solid rgba(37,99,235,0.05);display:flex;justify-content:space-between;align-items:center"><span><span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-right:8px"></span>Desktop app</span><span style="color:#10b981;font-weight:500;font-size:14px">Operational</span></li><li style="padding:8px 0;border-bottom:1px solid rgba(37,99,235,0.05);display:flex;justify-content:space-between;align-items:center"><span><span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-right:8px"></span>Mobile apps</span><span style="color:#10b981;font-weight:500;font-size:14px">Operational</span></li><li style="padding:8px 0;border-bottom:1px solid rgba(37,99,235,0.05);display:flex;justify-content:space-between;align-items:center"><span><span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-right:8px"></span>Integrations</span><span style="color:#10b981;font-weight:500;font-size:14px">Operational</span></li><li style="padding:8px 0;display:flex;justify-content:space-between;align-items:center"><span><span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;margin-right:8px"></span>Authentication</span><span style="color:#10b981;font-weight:500;font-size:14px">Operational</span></li></ul><h3>Recent incidents</h3><p>No incidents reported in the last 30 days.</p>`,
  },
  livechat: {
    category: 'Live Support',
    title: 'Live chat support',
    body: `<p>Our human support team is online <strong>Monday–Friday, 9am–9pm UTC</strong>. Pro customers get 24/7 access.</p><h3>How to reach us</h3><p>1. Open the Kira app on your desktop or phone<br>2. Click the chat bubble in the bottom-right corner<br>3. Type your question — a teammate will reply within minutes</p><h3>What we can help with</h3><p>Account issues, billing disputes, technical troubleshooting, feature questions, and general guidance.</p><p style="margin-top:20px"><a href="mailto:support@kira.ai" style="display:inline-block;padding:12px 22px;background:linear-gradient(135deg,${ACCENT},${ACCENT2});color:#fff;text-decoration:none;border-radius:100px;font-weight:500;font-size:14px">Email support instead →</a></p>`,
  },
  community: {
    category: 'Community',
    title: 'Join the Kira community',
    body: `<p>Connect with thousands of Kira users at <strong>community.kira.ai</strong>. Free and open to everyone.</p><h3>What you'll find</h3><p>• Prompt libraries shared by power users<br>• Workflow templates and integrations<br>• Weekly AMAs with the team<br>• Beta program signups<br>• Feature voting and roadmap discussions</p><p style="margin-top:20px"><a href="https://community.kira.ai" target="_blank" rel="noopener" style="display:inline-block;padding:12px 22px;background:linear-gradient(135deg,${ACCENT},${ACCENT2});color:#fff;text-decoration:none;border-radius:100px;font-weight:500;font-size:14px">Visit community →</a></p>`,
  },
}

// ─── Modal component ──────────────────────────────────────────────────────────
function Modal({
  data,
  onClose,
}: {
  data: { category: string; title: string; body: string } | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!data) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [data])
  if (!data) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: `1px solid ${GLASS_BORDER}`,
          borderRadius: 28,
          boxShadow: '0 20px 60px rgba(37,99,235,0.10)',
          maxWidth: 560,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: 40,
          position: 'relative',
        }}
      >
        <button
          className="kh-modal-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(37,99,235,0.06)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: ACCENT,
            fontSize: 22,
            transition: 'background 0.2s,transform 0.3s',
            fontFamily: 'inherit',
          }}
        >
          ×
        </button>
        <div
          style={{
            fontSize: 12,
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          {data.category}
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: '-0.02em',
            marginBottom: 18,
            lineHeight: 1.15,
            color: TEXT,
          }}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <div
          style={{ color: TEXT_DIM, fontSize: 15, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HelpView() {
  const [modal, setModal] = useState<{
    category: string
    title: string
    body: string
  } | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState('')

  // Section refs for scroll-to and active tracking
  const mainRef = useRef<HTMLElement>(null)
  const topicsRef = useRef<HTMLElement>(null)
  const faqRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Active nav tracking on scroll (same logic as HTML JS)
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const update = () => {
      const sections = [
        { id: 'contact', ref: contactRef },
        { id: 'faq', ref: faqRef },
        { id: 'topics', ref: topicsRef },
      ]
      let current = ''
      for (const s of sections) {
        if (s.ref.current) {
          const rect = s.ref.current.getBoundingClientRect()
          if (rect.top <= 180) {
            current = s.id
            break
          }
        }
      }
      setActiveNav(current)
    }
    el.addEventListener('scroll', update, { passive: true })
    return () => el.removeEventListener('scroll', update)
  }, [])

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openTopic = (id: string) => {
    const d = TOPICS[id]
    if (d) setModal(d)
  }
  const openModal = (key: string) => {
    const d = MODALS[key]
    if (d) setModal(d)
  }

  // Glass card style
  const glass: React.CSSProperties = {
    background: GLASS,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${GLASS_BORDER}`,
    borderRadius: 24,
    boxShadow: SHADOW_SOFT,
  }

  const faqs = [
    {
      q: 'What is Kira AI and what can it do?',
      a: "Kira AI is a conversational assistant designed to help with writing, research, coding, analysis, brainstorming, and much more. It can read documents you upload, browse the web when needed, generate images and visualizations, work with spreadsheets, and connect to tools you already use through integrations. Think of it as a thinking partner that adapts to whatever you're working on.",
    },
    {
      q: 'Is Kira AI free to use?',
      a: 'Yes — Kira AI offers a generous free tier that includes daily access to our standard model, file uploads up to 10 MB, and basic chat history. Pro ($20/month) unlocks our most capable model, higher message limits, longer context windows, image generation, and priority access during peak times. Team and Enterprise plans add collaboration, admin controls, and SSO.',
    },
    {
      q: 'How do you handle my data and conversations?',
      a: 'Your conversations are encrypted in transit and at rest. By default, we do not use your chats to train our models — this is an opt-in setting under Privacy. You can delete any conversation at any time, export your full history as JSON, or request full account deletion. We are SOC 2 Type II certified and GDPR compliant.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: "Absolutely. You can cancel from Settings → Billing at any time. Your Pro access remains active until the end of your current billing period — no prorated refunds, but no early termination either. You'll keep all your chats and can resubscribe whenever you like.",
    },
    {
      q: 'Does Kira work offline?',
      a: "Kira AI requires an internet connection to process requests, since the models run on our servers. However, you can view your past conversations offline in the desktop and mobile apps once they've synced. We're exploring on-device options for sensitive workflows — stay tuned.",
    },
    {
      q: 'How do I report a bug or suggest a feature?',
      a: 'We love hearing from users. The fastest way is the thumbs-up/thumbs-down buttons in any chat — these go straight to our team. For broader feedback, email feedback@kira.ai or join our community forum at community.kira.ai where the team posts regularly.',
    },
    {
      q: 'Is there an API for developers?',
      a: 'Yes — the Kira API is available for all Pro and Team customers. It includes streaming responses, function calling, vision, file inputs, and webhooks. We provide official SDKs for Python, JavaScript/TypeScript, Go, and Ruby. Generous free tier for testing; pay-as-you-go pricing for production. Documentation is at docs.kira.ai.',
    },
    {
      q: 'What languages does Kira support?',
      a: 'Kira AI works fluently in over 90 languages, with strongest performance in English, Spanish, French, German, Chinese, Japanese, Portuguese, Arabic, and Hindi. You can switch languages mid-conversation, and Kira will follow naturally. Voice mode currently supports 28 languages.',
    },
    {
      q: 'I forgot my password. What do I do?',
      a: "On the login screen, click \"Forgot password?\" and enter your email. We'll send a secure reset link within a minute or two. If you don't see it, check spam — and make sure to add no-reply@kira.ai to your safe senders. Still stuck? Email support@kira.ai and we'll verify your identity and help reset manually.",
    },
  ]

  const topicSections = [
    {
      title: 'Account & Profile',
      items: [
        ['create-account', 'Creating your Kira account'],
        ['verify-email', 'Verifying your email address'],
        ['change-password', 'Changing password or username'],
        ['two-factor', 'Two-factor authentication setup'],
        ['delete-account', 'Deleting your account permanently'],
      ],
    },
    {
      title: 'Using Kira AI',
      items: [
        ['prompts', 'Writing effective prompts'],
        ['attachments', 'Working with attachments & files'],
        ['voice-mode', 'Voice mode & transcription'],
        ['organize-chats', 'Saving and organizing chats'],
        ['share-chat', 'Sharing conversations with others'],
      ],
    },
    {
      title: 'Subscriptions',
      items: [
        ['plan-comparison', 'Free vs. Pro vs. Team plans'],
        ['cancel-plan', 'Upgrading or canceling anytime'],
        ['refunds', 'Refunds and billing disputes'],
        ['team-seats', 'Managing team seats & admins'],
        ['discounts', 'Student & nonprofit discounts'],
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        ['data-location', 'Where your data lives'],
        ['training-optout', 'Training opt-out controls'],
        ['export-data', 'Exporting your conversation history'],
        ['gdpr', 'GDPR & data subject requests'],
        ['memory', 'Memory and personalization settings'],
      ],
    },
    {
      title: 'Integrations',
      items: [
        ['gdrive-notion', 'Connecting Google Drive & Notion'],
        ['slack-teams', 'Slack & Microsoft Teams setup'],
        ['calendar-email', 'Calendar and email integrations'],
        ['mcp-servers', 'Custom MCP servers'],
        ['disconnect-apps', 'Removing or disconnecting apps'],
      ],
    },
    {
      title: 'Troubleshooting',
      items: [
        ['app-crash', "App won't load or crashes"],
        ['login-issues', 'Login problems & password resets'],
        ['slow-responses', 'Slow responses or timeouts'],
        ['missing-chats', 'Missing chats or lost data'],
        ['report-bug', 'Reporting bugs to the team'],
      ],
    },
  ]

  const contactCards = [
    {
      icon: '✉️',
      title: 'Email Support',
      desc: 'For account issues, billing, and general questions. We reply within 24 hours on weekdays.',
      link: 'support@kira.ai →',
      onClick: () => (window.location.href = 'mailto:support@kira.ai'),
      meta: 'Average response: 6 hours',
    },
    {
      icon: '💬',
      title: 'Live Chat',
      desc: 'Talk to a real person in-app. Available Monday through Friday, around the clock for Pro customers.',
      link: 'Open chat →',
      onClick: () => openModal('livechat'),
      meta: 'Mon–Fri • 24/7 for Pro',
    },
    {
      icon: '🏢',
      title: 'Enterprise & Sales',
      desc: "Custom plans, security reviews, and onboarding for teams of 25+. We'll set up a dedicated point of contact.",
      link: 'sales@kira.ai →',
      onClick: () => (window.location.href = 'mailto:sales@kira.ai'),
      meta: 'Reply within 1 business day',
    },
    {
      icon: '🛡️',
      title: 'Security & Abuse',
      desc: 'Vulnerabilities, security disclosures, or reports of misuse. Encrypted communication available on request.',
      link: 'security@kira.ai →',
      onClick: () => (window.location.href = 'mailto:security@kira.ai'),
      meta: 'Acknowledged within 24h',
    },
    {
      icon: '📰',
      title: 'Press & Media',
      desc: 'Interviews, partnerships, speaking engagements, and media inquiries from journalists and researchers.',
      link: 'press@kira.ai →',
      onClick: () => (window.location.href = 'mailto:press@kira.ai'),
      meta: 'Reply within 2 business days',
    },
    {
      icon: '🌐',
      title: 'Community',
      desc: 'Join thousands of users sharing tips, prompts, and workflows. The team checks in daily and posts updates.',
      link: 'community.kira.ai →',
      onClick: () => openModal('community'),
      meta: 'Free • Open to everyone',
    },
  ]

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      <style>{CSS}</style>

      {/* ══ ROW 1: Kira App Header ══════════════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(17,24,39,0.08)',
          zIndex: 101,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: '#111827',
              margin: 0,
            }}
          >
            Help Center
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#696D7D',
              margin: '2px 0 0',
              fontWeight: 300,
            }}
          >
            Find answers, guides, and contact support
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 44,
                padding: '0 18px',
                background: '#fff',
                border: '1px solid rgba(17,24,39,0.10)',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 500,
                color: '#111827',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                fontFamily: "'Outfit', system-ui, sans-serif",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#696D7D"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              Activity Log
            </button>
          </div>
          <div
            style={{ width: 1, height: 30, background: 'rgba(17,24,39,0.10)' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#696D7D"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1z" />
                <path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
            </button>
            <button
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#696D7D"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
              </svg>
            </button>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src="/profile.png"
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e: any) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══ ROW 2: Help nav — floating pill, sticky, matching HTML nav style ══ */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 24px',
          background: 'transparent',
          zIndex: 100,
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: 100,
            boxShadow: SHADOW_SOFT,
          }}
        >
          {/* Logo — click scrolls to top */}
          <div
            onClick={() =>
              mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            {/* <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                boxShadow: '0 4px 16px rgba(37,99,235,0.18)',
                flexShrink: 0,
              }}
            /> */}
            Kira AI
          </div>
          {/* Links */}
          <div style={{ display: 'flex', gap: 8, fontSize: 14 }}>
            <button
              className={`kh-nlink${activeNav === 'topics' ? ' active' : ''}`}
              onClick={() => scrollTo(topicsRef)}
            >
              Topics
            </button>
            <button
              className={`kh-nlink${activeNav === 'faq' ? ' active' : ''}`}
              onClick={() => scrollTo(faqRef)}
            >
              FAQ
            </button>
            <button
              className={`kh-nlink${activeNav === 'contact' ? ' active' : ''}`}
              onClick={() => scrollTo(contactRef)}
            >
              Contact
            </button>
            <button className="kh-nlink" onClick={() => openModal('status')}>
              Status
            </button>
          </div>
          {/* CTA */}
          <a
            className="kh-cta-link"
            onClick={() => scrollTo(contactRef)}
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'transform 0.2s,box-shadow 0.2s',
              boxShadow: '0 4px 16px rgba(37,99,235,0.15)',
              cursor: 'pointer',
            }}
          >
            Get Support
          </a>
        </nav>
      </div>

      {/* ══ MAIN CONTENT — scrollable, all sections visible ════════════════ */}
      <main
        ref={mainRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          //   background: 'url("/MainBG.png") center right / cover no-repeat',
        }}
      >
        {/* Ambient orbs */}
        <div
          style={{
            position: 'fixed',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #93c5fd, transparent 70%)',
            filter: 'blur(140px)',
            top: -200,
            left: -150,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.4,
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'fixed',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #67e8f9, transparent 70%)',
            filter: 'blur(140px)',
            bottom: -150,
            right: -100,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.4,
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'fixed',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #a5b4fc, transparent 70%)',
            filter: 'blur(120px)',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.32,
            animation: 'float3 30s ease-in-out infinite',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px 80px',
          }}
        >
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section style={{ margin: '80px auto 60px', textAlign: 'center' }}>
            <div
              className="kh-fade"
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                borderRadius: 100,
                background: GLASS,
                border: `1px solid ${GLASS_BORDER}`,
                backdropFilter: 'blur(20px)',
                fontSize: 13,
                color: ACCENT,
                marginBottom: 24,
                letterSpacing: '0.04em',
                fontWeight: 500,
              }}
            >
              ✦ Help Center
            </div>
            <h1
              className="kh-fade kh-d1"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 500,
                fontSize: 'clamp(40px, 7vw, 84px)',
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                marginBottom: 24,
                color: TEXT,
              }}
            >
              How can we{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2}, ${ACCENT3})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                help you
              </em>
              <br />
              today?
            </h1>
            <p
              className="kh-fade kh-d2"
              style={{
                fontSize: 19,
                color: TEXT_DIM,
                maxWidth: 600,
                margin: '0 auto 40px',
              }}
            >
              Find answers, explore guides, and connect with our team.
              Everything you need to get the most out of Kira AI.
            </p>
            {/* Search */}
            <div
              className="kh-fade kh-d3 kh-search"
              style={{
                maxWidth: 640,
                margin: '0 auto',
                padding: '8px 8px 8px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: GLASS_STRONG,
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: 100,
                boxShadow: SHADOW_MED,
                transition: 'border-color 0.2s,box-shadow 0.2s',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, opacity: 0.7 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim())
                    alert(`Searching for: "${searchQuery}"`)
                }}
                type="text"
                placeholder="Search articles, guides, and answers..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: TEXT,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: 16,
                  outline: 'none',
                  padding: '14px 0',
                }}
              />
              <button
                onClick={() => {
                  if (searchQuery.trim())
                    alert(`Searching for: "${searchQuery}"`)
                }}
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 100,
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
                  transition: 'transform 0.2s',
                }}
              >
                Search
              </button>
            </div>
          </section>

          {/* ── QUICK LINKS ──────────────────────────────────────────────── */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              margin: '60px auto',
            }}
          >
            {[
              {
                icon: '🚀',
                title: 'Getting Started',
                desc: 'Set up your account, install Kira, and run your first prompt.',
              },
              {
                icon: '💳',
                title: 'Billing & Plans',
                desc: 'Upgrade, downgrade, manage invoices, and understand pricing.',
              },
              {
                icon: '🔐',
                title: 'Privacy & Security',
                desc: 'How we protect your data and what controls you have.',
              },
              {
                icon: '⚙️',
                title: 'API & Developers',
                desc: 'Build with Kira — endpoints, SDKs, rate limits, and webhooks.',
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`kh-fade kh-d${i + 1} kh-qcard`}
                style={{
                  ...glass,
                  padding: 28,
                  cursor: 'pointer',
                  transition: 'transform 0.3s,box-shadow 0.3s,background 0.3s',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `linear-gradient(135deg, rgba(37,99,235,0.08), rgba(59,130,246,0.06))`,
                    border: '1px solid rgba(37,99,235,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                    fontSize: 22,
                  }}
                >
                  {c.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 500,
                    fontSize: 19,
                    marginBottom: 6,
                    color: TEXT,
                  }}
                >
                  {c.title}
                </h3>
                <p style={{ fontSize: 14, color: TEXT_DIM }}>{c.desc}</p>
              </div>
            ))}
          </section>

          {/* ── TOPICS ───────────────────────────────────────────────────── */}
          <section
            ref={topicsRef}
            id="topics"
            style={{ margin: '100px auto', scrollMarginTop: 220 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  Browse
                </div>
                <h2
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 500,
                    fontSize: 'clamp(32px, 5vw, 52px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    maxWidth: 700,
                    color: TEXT,
                  }}
                >
                  Explore by{' '}
                  <em style={{ fontStyle: 'italic', color: ACCENT2 }}>topic</em>
                </h2>
              </div>
              <a
                href="#"
                style={{
                  color: ACCENT,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                View all articles →
              </a>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {topicSections.map((sec, si) => (
                <div
                  key={si}
                  className="kh-topic"
                  style={{
                    ...glass,
                    padding: 32,
                    transition:
                      'transform 0.3s,box-shadow 0.3s,background 0.3s',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 500,
                      fontSize: 22,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: TEXT,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: ACCENT,
                        boxShadow: '0 0 12px rgba(37,99,235,0.3)',
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    {sec.title}
                  </h3>
                  <ul style={{ padding: 0, margin: 0 }}>
                    {sec.items.map(([id, label]) => (
                      <li key={id} onClick={() => openTopic(id)}>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <section
            ref={faqRef}
            id="faq"
            style={{ margin: '100px auto', scrollMarginTop: 220 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  FAQ
                </div>
                <h2
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 500,
                    fontSize: 'clamp(32px, 5vw, 52px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    maxWidth: 700,
                    color: TEXT,
                  }}
                >
                  Frequently asked{' '}
                  <em style={{ fontStyle: 'italic', color: ACCENT2 }}>
                    questions
                  </em>
                </h2>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {faqs.map((faq, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={i}
                    style={{
                      ...glass,
                      background: open ? GLASS_STRONG : GLASS,
                      boxShadow: open ? SHADOW_MED : SHADOW_SOFT,
                      overflow: 'hidden',
                      transition: 'background 0.3s,box-shadow 0.3s',
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      style={{
                        width: '100%',
                        padding: '24px 28px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                        fontFamily: "'Fraunces', Georgia, serif",
                        fontWeight: 500,
                        fontSize: 18,
                        textAlign: 'left',
                        color: open ? ACCENT : TEXT,
                        transition: 'color 0.2s',
                      }}
                    >
                      {faq.q}
                      <span
                        style={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: open
                            ? `linear-gradient(135deg,${ACCENT},${ACCENT2})`
                            : 'rgba(255,255,255,0.6)',
                          border: open
                            ? 'none'
                            : '1px solid rgba(37,99,235,0.14)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition:
                            'transform 0.3s,background 0.3s,color 0.3s',
                          transform: open ? 'rotate(45deg)' : 'rotate(0)',
                          fontSize: 14,
                          color: open ? '#fff' : ACCENT,
                        }}
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <div
                        style={{
                          padding: '0 28px 28px',
                          color: TEXT_DIM,
                          fontSize: 15,
                          lineHeight: 1.7,
                          maxWidth: 780,
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── CONTACT ──────────────────────────────────────────────────── */}
          <section
            ref={contactRef}
            id="contact"
            style={{ margin: '100px auto', scrollMarginTop: 220 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: 40,
                flexWrap: 'wrap',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    marginBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  Get in touch
                </div>
                <h2
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontWeight: 500,
                    fontSize: 'clamp(32px, 5vw, 52px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    maxWidth: 700,
                    color: TEXT,
                  }}
                >
                  Still need{' '}
                  <em style={{ fontStyle: 'italic', color: ACCENT2 }}>help?</em>
                </h2>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
              }}
            >
              {contactCards.map((c, i) => (
                <div
                  key={i}
                  className="kh-ccard"
                  onClick={c.onClick}
                  style={{
                    ...glass,
                    padding: 32,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition:
                      'transform 0.3s,box-shadow 0.3s,background 0.3s',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background:
                        'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(37,99,235,0.08))',
                      border: '1px solid rgba(37,99,235,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      fontSize: 22,
                    }}
                  >
                    {c.icon}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 500,
                      fontSize: 20,
                      marginBottom: 6,
                      color: TEXT,
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{ color: TEXT_DIM, fontSize: 14, marginBottom: 16 }}
                  >
                    {c.desc}
                  </p>
                  <a
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: ACCENT,
                      textDecoration: 'none',
                      fontSize: 15,
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'gap 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    {c.link}
                  </a>
                  <div
                    style={{ marginTop: 12, fontSize: 13, color: TEXT_FAINT }}
                  >
                    {c.meta}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA BANNER ───────────────────────────────────────────────── */}
          <section
            style={{
              margin: '100px auto',
              padding: '60px 40px',
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.25))',
              border: `1px solid ${GLASS_BORDER}`,
              borderRadius: 32,
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              boxShadow: SHADOW_MED,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.08), transparent 60%)',
                pointerEvents: 'none',
              }}
            />
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 500,
                fontSize: 'clamp(28px, 4vw, 42px)',
                letterSpacing: '-0.02em',
                marginBottom: 16,
                position: 'relative',
                color: TEXT,
              }}
            >
              Can't find what you're looking for?
            </h2>
            <p
              style={{
                color: TEXT_DIM,
                marginBottom: 28,
                fontSize: 17,
                position: 'relative',
              }}
            >
              Our human support team is one click away — no bots, no scripts.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                position: 'relative',
              }}
            >
              <a
                href="mailto:support@kira.ai"
                style={{
                  padding: '14px 28px',
                  borderRadius: 100,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(37,99,235,0.15)',
                  transition: 'transform 0.2s,box-shadow 0.2s',
                  display: 'inline-block',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                Email Support
              </a>
              <button
                onClick={() => openModal('livechat')}
                className="kh-btn-sec"
                style={{
                  padding: '14px 28px',
                  borderRadius: 100,
                  fontWeight: 500,
                  fontSize: 15,
                  background: 'rgba(255,255,255,0.7)',
                  color: TEXT,
                  border: `1px solid ${GLASS_BORDER}`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  cursor: 'pointer',
                  transition: 'background 0.2s,transform 0.2s',
                  fontFamily: "'Outfit', system-ui, sans-serif",
                }}
              >
                Open Live Chat
              </button>
            </div>
          </section>
        </div>
        {/* end content wrapper */}
      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <Modal data={modal} onClose={() => setModal(null)} />
    </div>
  )
}
