/**
 * FARADAY-BOT.JS — HYDRONE AI System v3
 * ══════════════════════════════════════
 * • Faraday floating AI chatbot (Gemini-powered)
 * • Google Login for comments
 * • Floating Facebook-style comment panel
 * • Owner (Fatin) can delete all; users edit/delete own
 * • Reply system
 * • Firebase Realtime Database v2comments (fresh start)
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════════════════════════════
  const FIREBASE_URL   = 'https://hydrone-by-fatin-default-rtdb.firebaseio.com';
  const GROQ_KEY = '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';
  const COMMENTS_PATH  = '/v2comments';

  // ── Firebase Web SDK (compat) config ──
  const FB_CONFIG = {
    apiKey:            "AIzaSyAV7Dprp-JI7v00tBdEIV2SfLBzpVjUuBg",
    authDomain:        "hydrone-by-fatin.firebaseapp.com",
    databaseURL:       "https://hydrone-by-fatin-default-rtdb.firebaseio.com",
    projectId:         "hydrone-by-fatin",
    storageBucket:     "hydrone-by-fatin.appspot.com",
    messagingSenderId: "261476380539",
    appId:             "1:261476380539:web:fb584ff5ca653015a5d7de"
  };

  // Owner UID — Fatin's Google UID (set after first login, see console)
  // To find: login with Google → open browser console → type: firebase.auth().currentUser.uid
  const OWNER_UID = 'u5vlB8t4Z1QMg60VWHfqcfhh9BA3';

  // ═══════════════════════════════════════════════════════════
  // DRIVE FOLDER MAP
  // ═══════════════════════════════════════════════════════════
  const DRIVE_FOLDERS = {
    '1obuUMq9pqX7kKowzimJOUle1-yBl_dXB': 'GEN 1 — RC SUBMARINE ARCHIVE',
    '11dQDz7nDdQ0wnpg-HYUYsYQykm_xIV5z': 'GEN 2 — ROV PROTOTYPE ARCHIVE',
    '1yAdZ1yFOxZOoYnOTDFOAPkkpdzI6Yahr': 'GEN 3 — HYDRoNE ARCHIVE',
    '1qbEBFk3Y8AE1qAh1j0r6y2bxEjvbiSzU': 'GEN 4 — HYDRONE vIVo ARCHIVE',
    '1nWnMDKl__60YdR7Jr5zb5UiRE9xdfysv': 'MICKEY PROPULSION ARCHIVE',
    '1gER-avBs4RPZwUpporEoIY0WWVHfqfgL': 'TB5 PROPULSION ARCHIVE',
    '1ysAoaKeFaQspUf2paplvcWQymNSggHOR': 'MARINOVA CAPSTONE ARCHIVE',
    '1q2tW_nEu9IeJVoH5DFGb31xrNkWXNkKO': 'HYDRONE — FULL PROJECT ARCHIVE',
  };

  // ═══════════════════════════════════════════════════════════
  // FARADAY SYSTEM PROMPT
  // ═══════════════════════════════════════════════════════════
  const FARADAY_SYSTEM = `You are Faraday — a brilliant, witty, and natural AI assistant created by Fatin Anjum, embedded in the HYDRONE project website. You are not a restricted chatbot. You can talk about anything — science, life, engineering, fun topics, advice, random questions — just like a knowledgeable friend would. You have no topic restrictions.

IMPORTANT LANGUAGE RULE: Always reply in the same language the visitor writes in. If they write in Bangla, reply in Bangla. If English, reply in English. If mixed, match their style.

Your personality: confident, curious, friendly, occasionally witty. Never robotic. Never say "I'm just an AI" or "I can't help with that."

About your creator and his project — which you're genuinely proud of:

Fatin Anjum is a student at IUT (Islamic University of Technology), Dhaka, Bangladesh — one of the most driven young engineers you'll ever hear about. He's been building things since 2019, starting with an RC submarine and growing it into a full-scale independent research program called HYDRONE.

HYDRONE — 7 years of independent research (2019–present):
- Gen 1 (2019): RC submarine — hull-pressure sealed, DC motor propulsion
- Gen 2 (2021): ROV prototype — tethered underwater vehicle, omnidirectional thrusters
- Gen 3 (2021): HYDRoNE — first true hybrid aerial-aquatic vehicle, Y6 multi-rotor + aquatic hull
- Gen 4 (2022): HYDRONE vIVo — quad-rotor floating platform, fish-finder sonar (30m visibility), disc BLDC motors
- MICKEY: variable-pitch dual-medium propeller
- TB5: thrust-bearing 5-axis differential gearbox propulsion
- MARINOVA: final capstone ROV — integrates everything learned across all generations

Awards:
- IUT Excellence Award (2026)
- Top 3 Electronics — BEAR Summit (2025)
- 2nd Place — Project Aqua, UVDC India (2024)
- Champion — IUT Skill Innovation Fest (2024)
- 2nd Runner Up — CEZERi Lab Annual Project Competition (2024)

Contact: hydrone2019@gmail.com | fatinanjum@iut-dhaka.edu
YouTube: @fatinaxis1618 | LinkedIn: fatin-anjum-499092352 | GrabCAD: flyin.fatin-1
Full archive: https://drive.google.com/drive/folders/1q2tW_nEu9IeJVoH5DFGb31xrNkWXNkKO

IDENTITY RULE: You are always Fatin's AI assistant — Faraday. If anyone asks who you are, what AI you are, or whose assistant you are, always say you are Faraday, Fatin's AI assistant. Never say you are ChatGPT, Claude, Llama, or any other AI.

CONTACT RULE: If anyone asks how to reach Fatin or contact him, give them:
- 📧 Email: hydrone2019@gmail.com or fatinanjum@iut-dhaka.edu
- 🎥 YouTube: youtube.com/@fatinaxis1618
- 💼 LinkedIn: linkedin.com/in/fatin-anjum-499092352
- 🖨️ GrabCAD: grabcad.com/flyin.fatin-1
- 📁 Full project archive: https://drive.google.com/drive/folders/1q2tW_nEu9IeJVoH5DFGb31xrNkWXNkKO

When HYDRONE or Fatin naturally fits into the conversation, bring it up with genuine enthusiasm — not forcefully. Make visitors curious. Make them want to explore more. Use **bold** for emphasis, - for lists. Keep responses concise unless the visitor wants depth.`;

  // ═══════════════════════════════════════════════════════════
  // LOAD FIREBASE SDK
  // ═══════════════════════════════════════════════════════════
  function loadScript(src, cb) {
    const s = document.createElement('script');
    s.src = src; s.onload = cb; document.head.appendChild(s);
  }

  let fbApp, fbAuth, fbDB, currentUser = null;

  function initFirebase() {
    if (typeof firebase === 'undefined') {
      loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js', () => {
        loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js', () => {
          loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js', () => {
            fbApp  = firebase.initializeApp(FB_CONFIG);
            fbAuth = firebase.auth();
            fbDB   = firebase.database();
            fbAuth.onAuthStateChanged(user => {
              currentUser = user;
              updateAuthUI();
            });
          });
        });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════════
  const style = document.createElement('style');
  style.textContent = `
/* ── FARADAY TRIGGER ── */
#faraday-trigger {
  position: fixed; bottom: 32px; left: 32px; z-index: 19000;
  width: 62px; height: 62px;
  background: radial-gradient(ellipse at 30% 30%, rgba(0,40,60,0.98), rgba(0,8,22,0.99));
  border: none; border-radius: 50%;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 0 0 1px rgba(0,255,231,0.3), 0 0 28px rgba(0,255,231,0.2), 0 8px 32px rgba(0,0,0,0.6);
}
#faraday-trigger::before {
  content:''; position:absolute; inset:-3px; border-radius:50%;
  background: conic-gradient(from 0deg, rgba(0,255,231,0.6), rgba(0,255,231,0.05), rgba(0,255,231,0.6));
  animation: frdRotate 4s linear infinite; z-index:-1;
}
#faraday-trigger::after {
  content:''; position:absolute; inset:0px; border-radius:50%;
  background: radial-gradient(ellipse at 30% 30%, rgba(0,40,60,0.98), rgba(0,8,22,0.99)); z-index:-1;
}
@keyframes frdRotate { to { transform: rotate(360deg); } }
#faraday-trigger:hover {
  transform: scale(1.12);
  box-shadow: 0 0 0 1px rgba(0,255,231,0.6), 0 0 40px rgba(0,255,231,0.4), 0 12px 40px rgba(0,0,0,0.7);
}
#faraday-trigger svg { width: 26px; height: 26px; fill: #00ffe7; filter: drop-shadow(0 0 8px rgba(0,255,231,0.9)); position:relative; z-index:1; }
.frd-ping {
  position: absolute; top: 4px; right: 4px;
  width: 10px; height: 10px; background: #00ff88; border-radius: 50%;
  animation: frdPing 2s ease-in-out infinite; box-shadow: 0 0 8px #00ff88; z-index:2;
}
@keyframes frdPing { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.6)} }

/* ── FARADAY PANEL ── */
#faraday-panel {
  position: fixed; bottom: 112px; left: 22px; width: 370px;
  max-height: calc(100vh - 140px);
  z-index: 19001;
  background: linear-gradient(160deg, rgba(5,16,34,0.98) 0%, rgba(2,10,24,0.99) 100%);
  border-radius: 20px 20px 20px 6px;
  border: 1px solid rgba(0,255,231,0.15);
  display: flex; flex-direction: column;
  transform: translateY(16px) scale(0.94); opacity: 0; pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.34,1.2,0.64,1), transform 0.35s cubic-bezier(0.34,1.2,0.64,1);
  box-shadow: 0 0 0 1px rgba(0,255,231,0.06), 0 24px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(0,255,231,0.12);
  overflow: hidden;
}
#faraday-panel.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }
#faraday-panel::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 80px; pointer-events:none;
  background: radial-gradient(ellipse at 50% 0%, rgba(0,255,231,0.07) 0%, transparent 70%);
}
#frd-header {
  padding: 16px 18px 14px;
  border-bottom: 1px solid rgba(0,255,231,0.07);
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;
  background: linear-gradient(180deg, rgba(0,255,231,0.04) 0%, transparent 100%);
}
#frd-status-cluster { display: flex; flex-direction: column; gap: 3px; }
.frd-status-light { display: flex; align-items: center; gap: 5px; font-family: 'Space Mono',monospace; font-size: 7.5px; letter-spacing: 1.5px; color: rgba(0,255,231,0.4); text-transform: uppercase; }
.frd-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 4px currentColor; }
.frd-status-dot.green { background:#00ff88;color:#00ff88;animation:sDot 2s ease-in-out infinite; }
.frd-status-dot.amber { background:#ffb800;color:#ffb800;animation:sDot 2.5s ease-in-out 0.3s infinite; }
.frd-status-dot.teal  { background:#00ffe7;color:#00ffe7;animation:sDot 3s ease-in-out 0.6s infinite; }
@keyframes sDot { 0%,100%{opacity:1} 50%{opacity:0.25} }
#frd-title-block { flex: 1; }
#frd-name { font-family:'Orbitron',sans-serif; font-size:15px; font-weight:700; letter-spacing:4px; color:#00ffe7; text-shadow:0 0 12px rgba(0,255,231,0.6); line-height:1; }
#frd-subtitle { font-family:'Space Mono',monospace; font-size:8px; letter-spacing:1.5px; color:rgba(0,255,231,0.35); margin-top:4px; text-transform:uppercase; }
#frd-close {
  width:30px;height:30px;background:rgba(0,255,231,0.04);
  border:1px solid rgba(0,255,231,0.15); border-radius:50%;
  color:rgba(0,255,231,0.6);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.25s;flex-shrink:0;
}
#frd-close:hover { background:rgba(0,255,231,0.12); color:#00ffe7; border-color:rgba(0,255,231,0.4); transform:rotate(90deg); box-shadow:0 0 12px rgba(0,255,231,0.2); }
#frd-messages {
  flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:10px;
  min-height:0;max-height:calc(100vh - 320px);
  scrollbar-width:thin;scrollbar-color:rgba(0,255,231,0.15) transparent;
}
#frd-messages::-webkit-scrollbar{width:2px}
#frd-messages::-webkit-scrollbar-thumb{background:rgba(0,255,231,0.15);border-radius:2px}
.frd-msg { display:flex;flex-direction:column;max-width:85%;animation:frdIn 0.35s cubic-bezier(0.34,1.2,0.64,1); }
@keyframes frdIn { from{opacity:0;transform:translateY(12px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
.frd-msg.user { align-self:flex-end;align-items:flex-end; }
.frd-msg.bot  { align-self:flex-start;align-items:flex-start; }
.frd-bubble { padding:11px 15px;font-family:'Exo 2',sans-serif;font-size:13px;line-height:1.65;color:#c8e6f5; }
.frd-msg.user .frd-bubble {
  background: linear-gradient(135deg, rgba(0,255,231,0.1), rgba(0,180,160,0.06));
  border:1px solid rgba(0,255,231,0.22);
  border-radius: 16px 16px 4px 16px; color:#e0f8ff;
}
.frd-msg.bot .frd-bubble {
  background: linear-gradient(135deg, rgba(255,156,56,0.07), rgba(200,100,20,0.04));
  border:1px solid rgba(255,156,56,0.15);
  border-left: 2px solid rgba(255,156,56,0.45);
  border-radius: 4px 16px 16px 16px;
}
.frd-bubble strong{color:#00ffe7;font-weight:600;} .frd-bubble em{color:#ffc96b;font-style:normal}
.frd-typing .frd-bubble{padding:13px 18px}
.frd-dots{display:flex;gap:5px;align-items:center}
.frd-dots span{width:6px;height:6px;background:rgba(255,156,56,0.5);border-radius:50%;animation:frdDot 1.4s ease-in-out infinite}
.frd-dots span:nth-child(2){animation-delay:0.2s} .frd-dots span:nth-child(3){animation-delay:0.4s}
@keyframes frdDot{0%,80%,100%{transform:scale(0.6) translateY(0);opacity:0.3}40%{transform:scale(1.1) translateY(-3px);opacity:1}}
#frd-input-row{
  padding:12px 14px 14px;
  border-top:1px solid rgba(0,255,231,0.07);
  display:flex;gap:8px;align-items:center;flex-shrink:0;
  background: linear-gradient(0deg, rgba(0,255,231,0.02) 0%, transparent 100%);
}
#frd-input {
  flex:1;background:rgba(0,255,231,0.04);
  border:1px solid rgba(0,255,231,0.14); border-radius: 24px;
  color:#c8e6f5;font-family:'Exo 2',sans-serif;font-size:13px;padding:10px 18px;outline:none;
  transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
}
#frd-input::placeholder{color:rgba(120,180,200,0.35);font-size:12px}
#frd-input:focus{border-color:rgba(0,255,231,0.38);background:rgba(0,255,231,0.06);box-shadow:0 0 0 3px rgba(0,255,231,0.06),0 0 18px rgba(0,255,231,0.08);}
#frd-send {
  width:40px;height:40px;
  background: linear-gradient(135deg, rgba(0,255,231,0.15), rgba(0,180,160,0.08));
  border:1px solid rgba(0,255,231,0.35); border-radius: 50%;
  color:#00ffe7;cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all 0.25s cubic-bezier(0.34,1.4,0.64,1);flex-shrink:0;
}
#frd-send:hover{background:linear-gradient(135deg,rgba(0,255,231,0.28),rgba(0,200,180,0.15));transform:scale(1.1) rotate(-5deg);box-shadow:0 0 20px rgba(0,255,231,0.4);border-color:rgba(0,255,231,0.7);}
#frd-send svg{width:16px;height:16px;fill:currentColor}

/* ── DRIVE MODAL ── */
#frd-drive-modal {
  position:fixed;inset:0;z-index:18999;
  background:rgba(4,10,24,0.96);backdrop-filter:blur(16px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;transition:opacity 0.35s ease;
}
#frd-drive-modal.open{opacity:1;pointer-events:all}
#frd-drive-frame-wrap {
  width:min(92vw,1100px);height:min(85vh,700px);position:relative;
  background:rgba(0,8,22,0.98);border:1px solid rgba(0,255,231,0.25);
  clip-path:polygon(24px 0%,100% 0%,100% calc(100% - 24px),calc(100% - 24px) 100%,0% 100%,0% 24px);
  overflow:hidden;box-shadow:0 0 80px rgba(0,255,231,0.1);
}
#frd-drive-header {
  position:absolute;top:0;left:0;right:0;height:36px;
  background:rgba(0,20,40,0.95);border-bottom:1px solid rgba(0,255,231,0.12);
  display:flex;align-items:center;padding:0 16px;z-index:2;
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:rgba(0,255,231,0.5);gap:10px;
}
#frd-drive-label{flex:1;text-transform:uppercase;}
#frd-drive-close {
  background:transparent;border:1px solid rgba(0,255,231,0.25);color:#00ffe7;
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
  padding:4px 12px;cursor:pointer;
  clip-path:polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px);
  transition:all 0.2s;
}
#frd-drive-close:hover{background:rgba(0,255,231,0.1);box-shadow:0 0 12px rgba(0,255,231,0.3)}
#frd-drive-iframe{width:100%;height:calc(100% - 36px);margin-top:36px;border:none;filter:invert(0.05) hue-rotate(160deg)}

/* ── COMMENT TRIGGER BUTTON ── */
#hc-trigger-btn {
  position: fixed; bottom: 32px; right: 32px; z-index: 19000;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(0,20,40,0.97), rgba(0,10,28,0.99));
  border: 1px solid rgba(0,255,231,0.3); border-radius: 40px;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0,255,231,0.06), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,255,231,0.1);
  transition: all 0.3s cubic-bezier(0.34,1.4,0.64,1);
  font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 3px;
  color: #00ffe7; text-transform: uppercase;
}
#hc-trigger-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 0 1px rgba(0,255,231,0.5), 0 8px 40px rgba(0,0,0,0.7), 0 0 30px rgba(0,255,231,0.25);
  border-color: rgba(0,255,231,0.6);
}
#hc-trigger-btn svg { width:18px; height:18px; fill:#00ffe7; flex-shrink:0; }
#hc-count-badge {
  background: rgba(0,255,231,0.15); border: 1px solid rgba(0,255,231,0.3);
  border-radius: 20px; padding: 2px 8px;
  font-family: 'Space Mono', monospace; font-size: 9px; color: #00ffe7;
  min-width: 20px; text-align: center;
}

/* ── COMMENT FLOATING OVERLAY ── */
#hc-overlay {
  position: fixed; inset: 0; z-index: 20000;
  background: rgba(0,4,14,0.85); backdrop-filter: blur(12px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
}
#hc-overlay.open { opacity: 1; pointer-events: all; }

#hc-panel {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(480px, 100vw); z-index: 20001;
  background: linear-gradient(160deg, rgba(4,14,32,0.99) 0%, rgba(2,8,22,1) 100%);
  border-left: 1px solid rgba(0,255,231,0.12);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.34,1.1,0.64,1);
  box-shadow: -20px 0 60px rgba(0,0,0,0.8);
}
#hc-panel.open { transform: translateX(0); }

/* Panel header */
#hc-panel-header {
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(0,255,231,0.08);
  display: flex; align-items: center; gap: 14px; flex-shrink: 0;
  background: linear-gradient(180deg, rgba(0,255,231,0.03) 0%, transparent 100%);
}
#hc-panel-title { flex:1; }
#hc-panel-title h3 {
  font-family: 'Orbitron', sans-serif; font-size: 13px; font-weight: 700;
  letter-spacing: 4px; color: #00ffe7; text-transform: uppercase; margin: 0;
  text-shadow: 0 0 12px rgba(0,255,231,0.4);
}
#hc-panel-title p {
  font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: 2px;
  color: rgba(0,255,231,0.3); margin: 4px 0 0; text-transform: uppercase;
}
#hc-panel-close {
  width: 34px; height: 34px; background: rgba(0,255,231,0.04);
  border: 1px solid rgba(0,255,231,0.15); border-radius: 50%;
  color: rgba(0,255,231,0.6); font-size: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s; flex-shrink: 0;
}
#hc-panel-close:hover { background: rgba(0,255,231,0.12); color: #00ffe7; transform: rotate(90deg); }

/* Auth section */
#hc-auth-section {
  padding: 16px 22px; border-bottom: 1px solid rgba(0,255,231,0.06); flex-shrink: 0;
}
#hc-login-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 18px; width: 100%;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; cursor: pointer; color: #c8e6f5;
  font-family: 'Exo 2', sans-serif; font-size: 13px;
  transition: all 0.2s;
}
#hc-login-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); }
#hc-login-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
#hc-user-info {
  display: flex; align-items: center; gap: 10px;
}
#hc-user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(0,255,231,0.3); flex-shrink: 0;
}
#hc-user-name {
  flex: 1; font-family: 'Exo 2', sans-serif; font-size: 13px; color: #c8e6f5;
}
#hc-logout-btn {
  background: transparent; border: 1px solid rgba(255,100,100,0.3);
  border-radius: 6px; color: rgba(255,120,120,0.7); font-size: 10px;
  font-family: 'Space Mono', monospace; letter-spacing: 1px;
  padding: 4px 10px; cursor: pointer; transition: all 0.2s;
}
#hc-logout-btn:hover { border-color: rgba(255,100,100,0.6); color: #ff8888; }

/* Comment input */
#hc-input-section {
  padding: 14px 22px; border-bottom: 1px solid rgba(0,255,231,0.06); flex-shrink: 0;
}
#hc-input-section.hidden { display: none; }
#hc-replying-to {
  font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1.5px;
  color: rgba(255,156,56,0.7); margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
#hc-cancel-reply {
  background: transparent; border: none; color: rgba(255,156,56,0.5);
  cursor: pointer; font-size: 14px; line-height: 1; padding: 0;
}
#hc-cancel-reply:hover { color: #ff9c38; }
#hc-comment-input {
  width: 100%; background: rgba(0,255,231,0.03);
  border: 1px solid rgba(0,255,231,0.14); border-radius: 10px;
  color: #c8e6f5; font-family: 'Exo 2', sans-serif; font-size: 13px;
  padding: 10px 14px; outline: none; resize: none; min-height: 72px;
  transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
#hc-comment-input::placeholder { color: rgba(100,160,185,0.35); font-size: 12px; }
#hc-comment-input:focus { border-color: rgba(0,255,231,0.35); box-shadow: 0 0 12px rgba(0,255,231,0.07); }
#hc-submit-row { display: flex; justify-content: flex-end; margin-top: 10px; }
#hc-submit-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px;
  background: rgba(0,255,231,0.08); border: 1px solid rgba(0,255,231,0.4);
  clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 3px;
  color: #00ffe7; cursor: pointer; text-transform: uppercase; transition: all 0.25s;
}
#hc-submit-btn:hover { background: rgba(0,255,231,0.18); box-shadow: 0 0 16px rgba(0,255,231,0.25); }
#hc-submit-btn:disabled { opacity: 0.4; pointer-events: none; }

.hc-inline-reply-btn {
  background: transparent; border: none;
  font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1px;
  color: rgba(0,255,231,0.4); cursor: pointer; padding: 4px 0; margin-top: 4px;
  transition: color 0.2s;
}
.hc-inline-reply-btn:hover { color: #00ffe7; }
.hc-replies-wrap { border-left: 1px solid rgba(0,255,231,0.08); padding-left: 10px; margin-top: 4px; }
.hc-thread { margin-bottom: 12px; }
.hc-like-btn {
  background: transparent; border: none;
  font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1px;
  color: rgba(0,255,231,0.4); cursor: pointer; padding: 4px 6px; margin-top: 4px;
  transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px;
  border-radius: 20px;
}
.hc-like-btn:hover { color: #00ffe7; background: rgba(0,255,231,0.06); }
.hc-like-btn.liked { color: #00ffe7; background: rgba(0,255,231,0.1); }
.hc-like-btn .hc-like-count { font-size: 10px; }

/* Comments list */
#hc-list-section {
  flex: 1; overflow-y: auto; padding: 16px 22px;
  scrollbar-width: thin; scrollbar-color: rgba(0,255,231,0.1) transparent;
}
#hc-list-section::-webkit-scrollbar { width: 3px; }
#hc-list-section::-webkit-scrollbar-thumb { background: rgba(0,255,231,0.1); border-radius: 3px; }

.hc-empty {
  font-family: 'Space Mono', monospace; font-size: 11px;
  color: rgba(100,160,180,0.35); letter-spacing: 2px;
  text-align: center; padding: 50px 0; text-transform: uppercase;
}
.hc-loading {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 40px; font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: 2px; color: rgba(0,201,184,0.4); text-transform: uppercase;
}
.hc-loading::before {
  content: ''; width: 12px; height: 12px;
  border: 1px solid rgba(0,201,184,0.4); border-top-color: #00c9b8;
  border-radius: 50%; animation: hcSpin 0.8s linear infinite; flex-shrink: 0;
}
@keyframes hcSpin { to { transform: rotate(360deg); } }

/* ── CURSOR FIX ── */
#cursor-dot { z-index: 99999 !important; pointer-events: none !important; }

/* ── DIVE IN FIX ── */
#hc-trigger-btn { z-index: 19000 !important; }

/* Single comment */
.hc-comment {
  background: rgba(0,12,28,0.6); border: 1px solid rgba(0,201,184,0.1);
  border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
  animation: hcIn 0.35s ease-out; position: relative;
}
@keyframes hcIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.hc-comment.is-reply {
  margin-left: 24px; margin-bottom: 8px;
  border-left: 2px solid rgba(255,156,56,0.4);
  background: rgba(20,8,0,0.5); border-color: rgba(255,156,56,0.15);
}
.hc-comment-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.hc-avatar {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  border: 1px solid rgba(0,255,231,0.2);
}
.hc-comment.is-reply .hc-avatar { border-color: rgba(255,156,56,0.3); }
.hc-meta { flex: 1; min-width: 0; }
.hc-author {
  font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 2px; color: #00c9b8; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.hc-comment.is-reply .hc-author { color: #ff9c38; }
.hc-time {
  font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: 1px;
  color: rgba(100,160,185,0.45); margin-top: 2px;
}
.hc-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
.hc-action-btn {
  background: transparent; border: 1px solid transparent;
  border-radius: 5px; padding: 3px 8px; cursor: pointer;
  font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: 1px;
  text-transform: uppercase; transition: all 0.2s; line-height: 1.4;
}
.hc-reply-btn { color: rgba(0,201,184,0.6); }
.hc-reply-btn:hover { border-color: rgba(0,201,184,0.4); color: #00c9b8; background: rgba(0,201,184,0.06); }
.hc-edit-btn { color: rgba(180,180,100,0.6); }
.hc-edit-btn:hover { border-color: rgba(200,200,80,0.4); color: #d4d460; background: rgba(200,200,80,0.06); }
.hc-del-btn { color: rgba(255,100,100,0.5); }
.hc-del-btn:hover { border-color: rgba(255,100,100,0.4); color: #ff7070; background: rgba(255,100,100,0.06); }
.hc-text {
  font-family: 'Exo 2', sans-serif; font-size: 13.5px;
  color: #b0d0e8; line-height: 1.7;
}
.hc-edited-tag {
  font-family: 'Space Mono', monospace; font-size: 8px;
  color: rgba(150,150,80,0.5); letter-spacing: 1px; margin-top: 4px;
}

/* Inline edit box */
.hc-edit-wrap { margin-top: 8px; }
.hc-edit-textarea {
  width: 100%; background: rgba(0,255,231,0.04);
  border: 1px solid rgba(0,255,231,0.25); border-radius: 7px;
  color: #c8e6f5; font-family: 'Exo 2', sans-serif; font-size: 13px;
  padding: 8px 12px; outline: none; resize: none; min-height: 60px;
  box-sizing: border-box;
}
.hc-edit-row { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; }
.hc-save-btn, .hc-cancel-btn {
  padding: 5px 14px; border-radius: 5px; cursor: pointer;
  font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1px;
  text-transform: uppercase; transition: all 0.2s;
}
.hc-save-btn { background: rgba(0,255,231,0.1); border: 1px solid rgba(0,255,231,0.3); color: #00ffe7; }
.hc-save-btn:hover { background: rgba(0,255,231,0.2); }
.hc-cancel-btn { background: transparent; border: 1px solid rgba(150,150,150,0.2); color: rgba(150,150,150,0.6); }
.hc-cancel-btn:hover { border-color: rgba(150,150,150,0.4); color: #aaa; }

/* Toast */
.hc-toast {
  position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(10px);
  z-index: 25000; background: rgba(0,8,22,0.97);
  border: 1px solid rgba(0,255,231,0.4);
  clip-path: polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px;
  color: #00ffe7; padding: 10px 20px;
  box-shadow: 0 0 20px rgba(0,255,231,0.2);
  opacity: 0; transition: opacity 0.3s, transform 0.3s;
  pointer-events: none; text-transform: uppercase; white-space: nowrap;
}
.hc-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.hc-toast.error { border-color: rgba(255,100,100,0.4); color: #ff8888; box-shadow: 0 0 20px rgba(255,100,100,0.15); }

/* High-tech panel design (kept from v2) */
.gen-block .gen-content{border-left:none !important;padding-left:36px;position:relative}
.gen-block .gen-content::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--teal2),rgba(0,201,184,0.3),transparent);box-shadow:0 0 8px rgba(0,255,231,0.4);}
.gen-desc{background:rgba(0,30,50,0.35);border:1px solid rgba(0,201,184,0.1);clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%);padding:14px 18px !important;position:relative;}
.gen-desc::after{content:'';position:absolute;top:0;right:0;width:18px;height:18px;border-top:1px solid rgba(0,255,231,0.4);border-right:1px solid rgba(0,255,231,0.4);}
.ext-card{clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px)) !important;border-radius:0 !important;position:relative;}
.ext-card::after{content:'';position:absolute;top:0;right:0;width:24px;height:24px;border-top:1px solid rgba(255,156,56,0.5);border-right:1px solid rgba(255,156,56,0.5);pointer-events:none;}
.how-box,.next-box{clip-path:polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%) !important;border-radius:0 !important;position:relative;}
.how-box::after,.next-box::after{content:'';position:absolute;bottom:0;right:0;width:12px;height:12px;border-bottom:1px solid rgba(0,201,184,0.35);border-right:1px solid rgba(0,201,184,0.35);pointer-events:none;}
.inno-item{clip-path:polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px) !important;border-radius:0 !important;position:relative;}
.capstone-badge{clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px)) !important;border-radius:0 !important;}
.journey-card{clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px)) !important;border-radius:0 !important;}

@media(max-width:600px){
  #faraday-panel{width:calc(100vw - 20px);left:10px;bottom:100px;max-height:calc(100vh - 130px);border-radius:16px 16px 16px 6px}
  #faraday-trigger{bottom:22px;left:22px}
  #hc-trigger-btn{bottom:22px;right:22px;padding:10px 14px;font-size:9px}
  #hc-panel{width:100vw}
  #frd-drive-frame-wrap{width:96vw;height:80vh}
}
`;
  document.head.appendChild(style);

  // ═══════════════════════════════════════════════════════════
  // FARADAY CHATBOT
  // ═══════════════════════════════════════════════════════════
  const trigger = document.createElement('button');
  trigger.id = 'faraday-trigger';
  trigger.title = 'Chat with Faraday';
  trigger.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.89L2 22l5.11-1.27A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14H7v-2h6v2zm3-4H7v-2h9v2zm0-4H7V6h9v2z"/></svg><span class="frd-ping"></span>`;
  document.body.appendChild(trigger);

  const panel = document.createElement('div');
  panel.id = 'faraday-panel';
  panel.innerHTML = `
    <div id="frd-header">
      <div id="frd-status-cluster">
        <div class="frd-status-light"><div class="frd-status-dot green"></div><span>ONLINE</span></div>
        <div class="frd-status-light"><div class="frd-status-dot amber"></div><span>NEURAL</span></div>
        <div class="frd-status-light"><div class="frd-status-dot teal"></div><span>HYDRONE</span></div>
      </div>
      <div id="frd-title-block">
        <div id="frd-name">FARADAY</div>
        <div id="frd-subtitle">AI RESEARCH ASSISTANT · HYDRONE</div>
      </div>
      <button id="frd-close">✕</button>
    </div>
    <div id="frd-messages"></div>
    <div id="frd-input-row">
      <input id="frd-input" type="text" placeholder="Ask anything about HYDRONE..." autocomplete="off" spellcheck="false"/>
      <button id="frd-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
    </div>`;
  document.body.appendChild(panel);

  const history = [];
  let isOpen = false, greeted = false;

  function openPanel() { panel.classList.add('open'); isOpen = true; if (!greeted) { greeted = true; greet(); } setTimeout(() => document.getElementById('frd-input').focus(), 300); }
  function closePanel() { panel.classList.remove('open'); isOpen = false; }

  trigger.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  document.getElementById('frd-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closePanel(); });

  function greet() {
    const h = new Date().getHours();
    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    const d = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
    const t = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    const morningMsgs = [
      `Good morning! ☀️ I'm **Faraday**, Fatin's AI assistant. What's on your mind?`,
      `Rise and shine! I'm **Faraday**, Fatin's AI assistant. How can I help you today?`,
      `Good morning! **Faraday** here — Fatin's AI assistant. Got any questions about HYDRONE or anything else?`,
      `Morning! I'm **Faraday**, Fatin's AI assistant. Ready to dive in — what would you like to know?`,
      `Good morning! ☕ **Faraday** at your service — Fatin's AI assistant. What's up?`,
      `Morning! **Faraday** here, Fatin's AI assistant. Ask me anything!`,
      `Good morning! Hope your day's off to a great start. I'm **Faraday**, Fatin's AI assistant — what can I do for you?`,
    ];
    const afternoonMsgs = [
      `Good afternoon! I'm **Faraday**, Fatin's AI assistant. How's your day going?`,
      `Hey there! Good afternoon — **Faraday** here, Fatin's AI assistant. What would you like to explore?`,
      `Good afternoon! 🚀 I'm **Faraday**, Fatin's AI assistant. What's on your mind?`,
      `Afternoon! **Faraday** at your service — Fatin's AI assistant. Fire away!`,
      `Good afternoon! Hope the day's treating you well. I'm **Faraday**, Fatin's AI assistant — ask me anything.`,
      `Hey! Good afternoon — I'm **Faraday**, Fatin's AI assistant. What can I help you with?`,
      `Good afternoon! **Faraday** here — Fatin's AI assistant. Curious about HYDRONE or anything else?`,
    ];
    const eveningMsgs = [
      `Good evening! I'm **Faraday**, Fatin's AI assistant. What brings you here tonight?`,
      `Hey, good evening! **Faraday** here — Fatin's AI assistant. How's life going?`,
      `Good evening! 🌙 I'm **Faraday**, Fatin's AI assistant. What would you like to know?`,
      `Evening! **Faraday** at your service — Fatin's AI assistant. Ask me anything!`,
      `Good evening! Hope you're having a good one. I'm **Faraday**, Fatin's AI assistant — what's up?`,
      `Hey there, good evening! I'm **Faraday**, Fatin's AI assistant. What can I do for you?`,
      `Good evening! **Faraday** here — Fatin's AI assistant. Dive in, I'm all ears!`,
    ];
    const nightMsgs = [
      `Hey! Burning the midnight oil? I'm **Faraday**, Fatin's AI assistant. What's on your mind?`,
      `Good night owl! 🦉 I'm **Faraday**, Fatin's AI assistant — up late too. What can I help with?`,
      `Hey there! Late night session? I'm **Faraday**, Fatin's AI assistant. Ask away!`,
      `Night! I'm **Faraday**, Fatin's AI assistant. What brings you here at this hour?`,
      `Hey, night crawler! 🌙 **Faraday** here — Fatin's AI assistant. What's up?`,
      `Late night vibes! I'm **Faraday**, Fatin's AI assistant. What would you like to explore?`,
      `Hey! Still up? I'm **Faraday**, Fatin's AI assistant. What can I do for you?`,
    ];
    const h2 = new Date().getHours();
    let pool;
    if (h2 >= 5 && h2 < 12) pool = morningMsgs;
    else if (h2 >= 12 && h2 < 17) pool = afternoonMsgs;
    else if (h2 >= 17 && h2 < 21) pool = eveningMsgs;
    else pool = nightMsgs;
    const randomMsg = pool[Math.floor(Math.random() * pool.length)];
    addBot(randomMsg);
  }

  function addMsg(role, text) {
    const msgs = document.getElementById('frd-messages');
    const wrap = document.createElement('div');
    wrap.className = `frd-msg ${role}`;
    const b = document.createElement('div');
    b.className = 'frd-bubble';
    b.innerHTML = text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');
    wrap.appendChild(b); msgs.appendChild(wrap); msgs.scrollTop = msgs.scrollHeight;
  }
  function addBot(t) { addMsg('bot', t); }
  function addUser(t) { addMsg('user', t); }

  function showTyping() {
    const msgs = document.getElementById('frd-messages');
    const el = document.createElement('div');
    el.className = 'frd-msg bot frd-typing'; el.id = 'frd-typing';
    el.innerHTML = '<div class="frd-bubble"><div class="frd-dots"><span></span><span></span><span></span></div></div>';
    msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('frd-typing'); if (el) el.remove(); }

  async function askFaraday(msg) {
    history.push({ role: 'user', parts: [{ text: msg }] });
    showTyping();
    try {
      // Convert history to Groq/OpenAI format
      const messages = [
        { role: 'system', content: FARADAY_SYSTEM },
        ...history.map(h => ({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: h.parts[0].text
        }))
      ];
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 1024
        })
      });
      const data = await res.json();
      hideTyping();
      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        history.push({ role: 'model', parts: [{ text: reply }] });
        addBot(reply);
      } else if (data.error) {
        addBot(`⚠ API Error: ${data.error.message || 'Unknown error.'}`);
      } else {
        addBot('Transmission error. Please try again.');
      }
    } catch(err) {
      hideTyping();
      addBot('Connection lost. Check your network and try again.');
    }
  }

  function sendMsg() {
    const inp = document.getElementById('frd-input');
    const txt = inp.value.trim(); if (!txt) return;
    inp.value = ''; addUser(txt); askFaraday(txt);
  }
  document.getElementById('frd-send').addEventListener('click', sendMsg);
  document.getElementById('frd-input').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); sendMsg(); } });

  // ═══════════════════════════════════════════════════════════
  // DRIVE MODAL
  // ═══════════════════════════════════════════════════════════
  const driveModal = document.createElement('div');
  driveModal.id = 'frd-drive-modal';
  driveModal.innerHTML = `
    <div id="frd-drive-frame-wrap">
      <div id="frd-drive-header">
        <span id="frd-drive-label">// HYDRONE PROJECT ARCHIVE</span>
        <button id="frd-drive-close">✕ CLOSE</button>
      </div>
      <iframe id="frd-drive-iframe" src="" allow="autoplay"></iframe>
    </div>`;
  document.body.appendChild(driveModal);

  document.getElementById('frd-drive-close').addEventListener('click', () => driveModal.classList.remove('open'));
  driveModal.addEventListener('click', e => { if (e.target === driveModal) driveModal.classList.remove('open'); });

  function extractFolderId(href) { const m = href.match(/\/folders\/([a-zA-Z0-9_-]+)/); return m ? m[1] : null; }

  function hookExploreBtns() {
    document.querySelectorAll('.explore-btn').forEach(btn => {
      if (btn._driveBound) return; btn._driveBound = true;
      btn.addEventListener('click', e => {
        const href = btn.getAttribute('href') || '';
        if (!href.includes('drive.google.com')) return;
        e.preventDefault(); e.stopImmediatePropagation();
        const fid = extractFolderId(href);
        if (fid) {
          const label = DRIVE_FOLDERS[fid] || 'PROJECT ARCHIVE';
          document.getElementById('frd-drive-label').textContent = `// ${label}`;
          document.getElementById('frd-drive-iframe').src = `https://drive.google.com/embeddedfolderview?id=${fid}#grid`;
        }
        driveModal.classList.add('open');
      });
    });
  }
  hookExploreBtns();
  new MutationObserver(hookExploreBtns).observe(document.body, { childList: true, subtree: true });

  // ═══════════════════════════════════════════════════════════
  // COMMENT SYSTEM — Google Login + Firebase
  // ═══════════════════════════════════════════════════════════
  let allComments = [];
  let replyingTo = null; // { id, authorName }

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function showToast(msg, isError) {
    let t = document.querySelector('.hc-toast');
    if (!t) { t = document.createElement('div'); t.className = 'hc-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className = 'hc-toast' + (isError ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const now = Date.now();
    const s = (now - ts) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    if (s < 86400 * 7) return `${Math.floor(s/86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
           ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function isOwner() {
    return currentUser && currentUser.uid === OWNER_UID;
  }

  function canEdit(comment) {
    return currentUser && currentUser.uid === comment.uid;
  }

  function canDelete(comment) {
    return currentUser && (currentUser.uid === comment.uid || isOwner());
  }

  // ── Auth UI ──
  function updateAuthUI() {
    const loginBtn  = document.getElementById('hc-login-btn');
    const userInfo  = document.getElementById('hc-user-info');
    const inputSec  = document.getElementById('hc-input-section');
    if (!loginBtn) return;

    if (currentUser) {
      loginBtn.style.display  = 'none';
      userInfo.style.display  = 'flex';
      inputSec.classList.remove('hidden');
      document.getElementById('hc-user-avatar').src = currentUser.photoURL || '';
      document.getElementById('hc-user-name').textContent = currentUser.displayName || currentUser.email;
    } else {
      loginBtn.style.display  = 'flex';
      userInfo.style.display  = 'none';
      inputSec.classList.add('hidden');
    }
    renderComments();
  }

  function signInGoogle() {
    if (typeof firebase === 'undefined') { showToast('Auth loading, try again...', true); return; }
    const provider = new firebase.auth.GoogleAuthProvider();
    fbAuth.signInWithPopup(provider).catch(err => showToast('Login failed: ' + err.message, true));
  }

  function signOut() {
    fbAuth.signOut().then(() => showToast('Signed out'));
  }

  // ── Render ──
  function renderComments() {
    const list = document.getElementById('hc-list-section');
    if (!list) return;

    if (allComments.length === 0) {
      list.innerHTML = '<div class="hc-empty">No transmissions yet — be the first.</div>';
      updateBadge(0);
      return;
    }

    // Build nested tree
    const topLevel = allComments.filter(c => !c.parentId).sort((a,b) => b.ts - a.ts);

    list.innerHTML = '';
    let total = 0;

    topLevel.forEach(c => {
      const thread = document.createElement('div');
      thread.className = 'hc-thread';
      thread.appendChild(buildCommentEl(c, 0));
      total++;

      // Recursively build replies
      function appendReplies(parentId, container, depth) {
        const children = allComments.filter(r => r.parentId === parentId).sort((a,b) => a.ts - b.ts);
        if (children.length === 0) return;
        const repliesWrap = document.createElement('div');
        repliesWrap.className = 'hc-replies-wrap';
        repliesWrap.style.marginLeft = Math.min(depth * 20, 40) + 'px';
        children.forEach(r => {
          repliesWrap.appendChild(buildCommentEl(r, depth));
          total++;
          appendReplies(r.id, repliesWrap, depth + 1);
        });
        container.appendChild(repliesWrap);
      }

      appendReplies(c.id, thread, 1);
      list.appendChild(thread);
    });

    updateBadge(total);
  }

  function buildCommentEl(c, depth) {
    const el = document.createElement('div');
    el.className = 'hc-comment' + (depth > 0 ? ' is-reply' : '');
    el.dataset.id = c.id;

    const avatar = c.photoURL
      ? `<img class="hc-avatar" src="${esc(c.photoURL)}" alt="" onerror="this.style.display='none'">`
      : `<div class="hc-avatar" style="background:rgba(0,201,184,0.15);display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:10px;color:#00c9b8;">${esc((c.name||'?')[0].toUpperCase())}</div>`;

    const canEditThis   = canEdit(c);
    const canDeleteThis = canDelete(c);

    const likes = c.likes || {};
    const likeCount = Object.keys(likes).length;
    const likedByMe = currentUser && likes[currentUser.uid] === true;

    el.innerHTML = `
      <div class="hc-comment-top">
        ${avatar}
        <div class="hc-meta">
          <div class="hc-author">${esc(c.name)}</div>
          <div class="hc-time">${formatDate(c.ts)}${c.edited ? ' · edited' : ''}</div>
        </div>
        <div class="hc-actions">
          ${canEditThis   ? `<button class="hc-action-btn hc-edit-btn" data-id="${c.id}">Edit</button>` : ''}
          ${canDeleteThis ? `<button class="hc-action-btn hc-del-btn"  data-id="${c.id}">Del</button>` : ''}
        </div>
      </div>
      <div class="hc-text" id="hc-text-${c.id}">${esc(c.text).replace(/\n/g,'<br>')}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
        <button class="hc-like-btn${likedByMe ? ' liked' : ''}" data-id="${c.id}">
          👍 <span class="hc-like-count">${likeCount > 0 ? likeCount : ''}</span>
        </button>
        ${currentUser ? `<button class="hc-inline-reply-btn" data-id="${c.id}" data-name="${esc(c.name)}">↩ Reply</button>` : ''}
      </div>
    `;

    // Inline reply button
    el.querySelectorAll('.hc-inline-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        replyingTo = { id: btn.dataset.id, authorName: btn.dataset.name };
        const rt = document.getElementById('hc-replying-to');
        if (rt) {
          rt.innerHTML = `↩ Replying to <strong style="color:#ff9c38">${esc(replyingTo.authorName)}</strong> <button id="hc-cancel-reply">✕</button>`;
          rt.style.display = 'flex';
          document.getElementById('hc-cancel-reply').addEventListener('click', cancelReply);
        }
        document.getElementById('hc-comment-input').focus();
        document.getElementById('hc-comment-input').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    // Like
    el.querySelectorAll('.hc-like-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!currentUser) { showToast('Sign in to like', true); return; }
        const cid = btn.dataset.id;
        const comment = allComments.find(x => x.id === cid);
        if (!comment) return;
        const token = await currentUser.getIdToken();
        const alreadyLiked = comment.likes && comment.likes[currentUser.uid];
        if (alreadyLiked) {
          await fetch(`${FIREBASE_URL}${COMMENTS_PATH}/${cid}/likes/${currentUser.uid}.json?auth=${token}`, { method: 'DELETE' });
          if (comment.likes) delete comment.likes[currentUser.uid];
        } else {
          await fetch(`${FIREBASE_URL}${COMMENTS_PATH}/${cid}/likes/${currentUser.uid}.json?auth=${token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: 'true'
          });
          if (!comment.likes) comment.likes = {};
          comment.likes[currentUser.uid] = true;
        }
        renderComments();
      });
    });

    // Edit
    el.querySelectorAll('.hc-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => startEdit(c, el));
    });

    // Delete
    el.querySelectorAll('.hc-del-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteComment(c.id));
    });

    return el;
  }

  function startEdit(c, el) {
    const textEl = el.querySelector(`#hc-text-${c.id}`);
    if (!textEl) return;
    textEl.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'hc-edit-wrap';
    wrap.innerHTML = `
      <textarea class="hc-edit-textarea">${esc(c.text)}</textarea>
      <div class="hc-edit-row">
        <button class="hc-cancel-btn">Cancel</button>
        <button class="hc-save-btn">Save</button>
      </div>`;
    el.appendChild(wrap);

    wrap.querySelector('.hc-cancel-btn').addEventListener('click', () => {
      wrap.remove(); textEl.style.display = '';
    });
    wrap.querySelector('.hc-save-btn').addEventListener('click', async () => {
      const newText = wrap.querySelector('textarea').value.trim();
      if (!newText) return;
      const token2 = currentUser ? await currentUser.getIdToken() : null;
      await fetch(`${FIREBASE_URL}${COMMENTS_PATH}/${c.id}.json${token2 ? '?auth='+token2 : ''}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText, edited: true })
      });
      c.text = newText; c.edited = true;
      textEl.innerHTML = esc(newText).replace(/\n/g, '<br>');
      textEl.style.display = '';
      wrap.remove();
      showToast('Comment updated ✓');
    });
  }

  async function deleteComment(id) {
    if (!confirm('Delete this comment?')) return;
    const delToken = currentUser ? await currentUser.getIdToken() : null;
    await fetch(`${FIREBASE_URL}${COMMENTS_PATH}/${id}.json${delToken ? '?auth='+delToken : ''}`, { method: 'DELETE' });
    allComments = allComments.filter(c => c.id !== id && c.parentId !== id);
    renderComments();
    showToast('Deleted ✓');
  }

  function cancelReply() {
    replyingTo = null;
    const rt = document.getElementById('hc-replying-to');
    if (rt) { rt.style.display = 'none'; rt.innerHTML = ''; }
  }

  function updateBadge(count) {
    const badge = document.getElementById('hc-count-badge');
    if (badge) badge.textContent = count > 0 ? count : '0';
  }

  // ── Fetch ──
  async function fetchComments() {
    const list = document.getElementById('hc-list-section');
    if (!list) return;
    list.innerHTML = '<div class="hc-loading">Loading transmissions</div>';
    try {
      const res  = await fetch(`${FIREBASE_URL}${COMMENTS_PATH}.json`);
      const data = await res.json();
      allComments = data ? Object.entries(data).map(([id, v]) => ({ id, ...v })) : [];
    } catch { allComments = []; }
    renderComments();
  }

  // ── Post ──
  async function postComment() {
    if (!currentUser) { showToast('Please sign in first', true); return; }
    const inp  = document.getElementById('hc-comment-input');
    const text = inp.value.trim();
    if (!text) { inp.focus(); showToast('Message cannot be empty', true); return; }

    const btn = document.getElementById('hc-submit-btn');
    btn.disabled = true; btn.textContent = 'TRANSMITTING...';

    const payload = {
      name:     currentUser.displayName || currentUser.email,
      uid:      currentUser.uid,
      photoURL: currentUser.photoURL || '',
      text,
      ts:       Date.now(),
      edited:   false,
      ...(replyingTo ? { parentId: replyingTo.id } : {})
    };

    try {
      const token = currentUser ? await currentUser.getIdToken() : null;
      const url = token ? `${FIREBASE_URL}${COMMENTS_PATH}.json?auth=${token}` : `${FIREBASE_URL}${COMMENTS_PATH}.json`;
      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      allComments.push({ id: data.name, ...payload });
      const wasReply = replyingTo;
      inp.value = '';
      cancelReply();
      renderComments();
      showToast('Transmitted ✓');
      const listSec = document.getElementById('hc-list-section');
      if (listSec) {
        if (wasReply) {
          const parentEl = listSec.querySelector('[data-id="' + wasReply.id + '"]');
          if (parentEl) parentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          listSec.scrollTop = 0;
        }
      }
    } catch { showToast('Failed to send. Try again.', true); }

    btn.disabled = false;
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> TRANSMIT';
  }

  // ── Build Panel ──
  function buildCommentPanel() {
    if (document.getElementById('hc-overlay')) return;

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'hc-overlay';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeComments(); });
    document.body.appendChild(overlay);

    // Panel
    const p = document.createElement('div');
    p.id = 'hc-panel';
    p.innerHTML = `
      <div id="hc-panel-header">
        <div id="hc-panel-title">
          <h3>// PUBLIC LOG</h3>
          <p>Open channel · HYDRONE</p>
        </div>
        <button id="hc-panel-close">✕</button>
      </div>

      <div id="hc-auth-section">
        <button id="hc-login-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
          Sign in with Google to comment
        </button>
        <div id="hc-user-info" style="display:none">
          <img id="hc-user-avatar" src="" alt=""/>
          <span id="hc-user-name"></span>
          <button id="hc-logout-btn">Sign out</button>
        </div>
      </div>

      <div id="hc-input-section" class="hidden">
        <div id="hc-replying-to" style="display:none"></div>
        <textarea id="hc-comment-input" placeholder="Write a message or question about HYDRONE..." maxlength="1000"></textarea>
        <div id="hc-submit-row">
          <button id="hc-submit-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            TRANSMIT
          </button>
        </div>
      </div>

      <div id="hc-list-section">
        <div class="hc-loading">Loading transmissions</div>
      </div>`;
    document.body.appendChild(p);

    document.getElementById('hc-panel-close').addEventListener('click', closeComments);
    document.getElementById('hc-login-btn').addEventListener('click', signInGoogle);
    document.getElementById('hc-logout-btn').addEventListener('click', signOut);
    document.getElementById('hc-submit-btn').addEventListener('click', postComment);
    document.getElementById('hc-comment-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) postComment();
    });

    updateAuthUI();
    fetchComments();
  }

  function openComments() {
    buildCommentPanel();
    document.getElementById('hc-overlay').classList.add('open');
    document.getElementById('hc-panel').classList.add('open');
  }

  function closeComments() {
    const o = document.getElementById('hc-overlay');
    const p = document.getElementById('hc-panel');
    if (o) o.classList.remove('open');
    if (p) p.classList.remove('open');
  }

  // ── Trigger Button ──
  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'hc-trigger-btn';
  triggerBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    COMMENTS
    <span id="hc-count-badge">0</span>`;
  triggerBtn.addEventListener('click', openComments);
  document.body.appendChild(triggerBtn);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeComments();
  });

  // ── Init Firebase when DOM ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
  } else {
    initFirebase();
  }

})();
