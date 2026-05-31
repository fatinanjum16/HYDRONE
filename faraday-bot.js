/**
 * FARADAY-BOT.JS — HYDRONE AI System v2
 * ══════════════════════════════════════
 * • Faraday floating AI chatbot (Claude-powered, no limit)
 * • Asymmetric high-tech panel design (clip-path, status lights, grid borders)
 * • Per-page Drive modal — each explore button opens its own folder
 * • Truly PUBLIC comments via Firebase Realtime Database (all visitors share)
 *
 * HOW TO ADD: put this before </body> in every HTML file (after hydrone-nav.js)
 *   <script src="faraday-bot.js"></script>
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // DRIVE FOLDER MAP — auto-matched by button href
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
  // FIREBASE CONFIG — free Realtime Database for public comments
  // ─────────────────────────────────────────────────────────
  // SETUP (one-time, 2 minutes):
  //   1. Go to https://console.firebase.google.com
  //   2. Create project → Realtime Database → Start in test mode
  //   3. Copy your database URL (looks like: https://YOUR-APP.firebaseio.com)
  //   4. Replace the FIREBASE_URL below
  // ═══════════════════════════════════════════════════════════
  const FIREBASE_URL = 'https://hydrone-1618-default-rtdb.firebaseio.com';

  // ═══════════════════════════════════════════════════════════
  // GEMINI API KEY — paste your key below between the quotes
  // ═══════════════════════════════════════════════════════════
  const GEMINI_KEY = 'AQ.Ab8RN6L87dktugcnRQmZgNodRRw60r8cZmZxSIifbpF9tfhrVg';
  // ↑ Replace with your actual Firebase Realtime Database URL

  // ═══════════════════════════════════════════════════════════
  // FARADAY SYSTEM PROMPT
  // ═══════════════════════════════════════════════════════════
  const FARADAY_SYSTEM = `You are Faraday, the intelligent AI assistant embedded in the HYDRONE project website — a cutting-edge hybrid aerial-aquatic vehicle research initiative by Fatin Anjum, a student at IUT (Islamic University of Technology), Dhaka, Bangladesh.

HYDRONE is a 7-year independent research project (2019–present) spanning four hardware generations:
- Gen 1 (2019): RC submarine prototype — hull-pressure sealed, DC motor propulsion
- Gen 2 (2021): ROV prototype — tethered underwater ROV, omnidirectional and differential thruster configs
- Gen 3 (2021): HYDRoNE — first true hybrid, Y6 multi-rotor + aquatic hull, floating antenna mechanism
- Gen 4 (2022): HYDRONE vIVo — quad-rotor floating platform, fish-finder sonar (30m visibility), disc BLDC motors

Propulsion Extensions:
- MICKEY: variable-pitch dual-medium propeller unit
- TB5: thrust-bearing 5-axis differential gearbox propulsion system

Capstone: MARINOVA — final capstone ROV integrating all generations' learnings.

Awards & Recognition:
- IUT Excellence Award (2026)
- Top 3 Electronics Category — BEAR Summit (2025)
- 2nd Place — Project Aqua, UVDC India (2024)
- Champion — IUT Skill Innovation Fest (2024)
- 2nd Runner Up — CEZERi Lab Annual Project Competition (2024)

Contact: hydrone2019@gmail.com | fatinanjum@iut-dhaka.edu
Social: YouTube @fatinaxis1618 | LinkedIn: fatin-anjum-499092352 | GrabCAD: flyin.fatin-1
Full project archive: https://drive.google.com/drive/folders/1q2tW_nEu9IeJVoH5DFGb31xrNkWXNkKO

You speak with technical precision and warmth. Answer any question visitors have — engineering details, Fatin's journey, awards, methodology, or contact. Be helpful, concise but thorough. Use **bold** for emphasis, - for lists.`;

  // ═══════════════════════════════════════════════════════════
  // INJECT STYLES
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

/* header */
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

/* messages */
#frd-messages {
  flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:10px;
  min-height:0;max-height:340px;
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
  border-radius: 16px 16px 4px 16px;
  color:#e0f8ff;
}
.frd-msg.bot .frd-bubble {
  background: linear-gradient(135deg, rgba(255,156,56,0.07), rgba(200,100,20,0.04));
  border:1px solid rgba(255,156,56,0.15);
  border-left: 2px solid rgba(255,156,56,0.45);
  border-radius: 4px 16px 16px 16px;
}
.frd-bubble strong{color:#00ffe7; font-weight:600;} .frd-bubble em{color:#ffc96b;font-style:normal}
.frd-typing .frd-bubble{padding:13px 18px}
.frd-dots{display:flex;gap:5px;align-items:center}
.frd-dots span{width:6px;height:6px;background:rgba(255,156,56,0.5);border-radius:50%;animation:frdDot 1.4s ease-in-out infinite}
.frd-dots span:nth-child(2){animation-delay:0.2s} .frd-dots span:nth-child(3){animation-delay:0.4s}
@keyframes frdDot{0%,80%,100%{transform:scale(0.6) translateY(0);opacity:0.3}40%{transform:scale(1.1) translateY(-3px);opacity:1}}

/* input */
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
  font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:rgba(0,255,231,0.5);
  gap:10px;
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

/* ── HIGH-TECH PANEL REDESIGN ── */
.gen-block .gen-content{border-left:none !important;padding-left:36px;position:relative}
.gen-block .gen-content::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(to bottom,var(--teal2),rgba(0,201,184,0.3),transparent);
  box-shadow:0 0 8px rgba(0,255,231,0.4);
}
.gen-badge{position:relative}
.gen-badge::before{
  content:'● ACTIVE';position:absolute;top:0;left:0;
  font-family:'Space Mono',monospace;font-size:7px;letter-spacing:2px;
  color:#00ff88;text-shadow:0 0 5px #00ff88;animation:sDot 2s ease-in-out infinite;
}
.gen-desc{
  background:rgba(0,30,50,0.35);border:1px solid rgba(0,201,184,0.1);
  clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%);
  padding:14px 18px !important;position:relative;
}
.gen-desc::after{
  content:'';position:absolute;top:0;right:0;width:18px;height:18px;
  border-top:1px solid rgba(0,255,231,0.4);border-right:1px solid rgba(0,255,231,0.4);
}
.ext-card{
  clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px)) !important;
  border-radius:0 !important;position:relative;
}
.ext-card::after{
  content:'';position:absolute;top:0;right:0;width:24px;height:24px;
  border-top:1px solid rgba(255,156,56,0.5);border-right:1px solid rgba(255,156,56,0.5);pointer-events:none;
}
.ext-card .ext-header{position:relative}
.ext-card .ext-header::before{
  content:'';position:absolute;top:3px;right:8px;
  width:7px;height:7px;background:#ffb800;border-radius:50%;
  box-shadow:0 0 8px #ffb800;animation:sDot 2.5s ease-in-out 0.3s infinite;
}
.how-box,.next-box{
  clip-path:polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%) !important;
  border-radius:0 !important;position:relative;
}
.how-box::after,.next-box::after{
  content:'';position:absolute;bottom:0;right:0;width:12px;height:12px;
  border-bottom:1px solid rgba(0,201,184,0.35);border-right:1px solid rgba(0,201,184,0.35);pointer-events:none;
}
.inno-item{
  clip-path:polygon(10px 0%,100% 0%,100% calc(100% - 10px),calc(100% - 10px) 100%,0% 100%,0% 10px) !important;
  border-radius:0 !important;position:relative;
}
.inno-item::after{
  content:'';position:absolute;top:0;left:0;width:10px;height:10px;
  border-top:1px solid rgba(0,255,231,0.35);border-left:1px solid rgba(0,255,231,0.35);pointer-events:none;
}
.capstone-badge{
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px)) !important;
  border-radius:0 !important;
}
.journey-card{
  clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px)) !important;
  border-radius:0 !important;
}

/* ── PUBLIC COMMENTS ── */
#hydrone-comments {
  max-width:960px;margin:60px auto 0;padding:0 40px 80px;position:relative;z-index:10;
}
#hydrone-comments::before {
  content:'';display:block;width:100%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,231,0.3),rgba(255,156,56,0.2),transparent);
  margin-bottom:48px;
}
.hc-label{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:6px;color:var(--teal);text-transform:uppercase;margin-bottom:6px;display:flex;align-items:center;gap:14px}
.hc-label::after{content:'';flex:1;height:1px;background:rgba(0,201,184,0.15)}
.hc-heading{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:700;color:var(--white);letter-spacing:3px;margin-bottom:32px;text-transform:uppercase}
.hc-heading span{color:var(--teal2)}
.hc-form-wrap{
  background:rgba(0,20,40,0.5);border:1px solid rgba(0,255,231,0.14);
  clip-path:polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px));
  padding:28px 28px 22px;margin-bottom:40px;position:relative;
}
.hc-form-wrap::before{
  content:'// LEAVE A MESSAGE';position:absolute;top:0;left:24px;
  font-family:'Space Mono',monospace;font-size:7.5px;letter-spacing:3px;
  color:rgba(0,255,231,0.45);background:rgba(0,20,40,0.95);
  padding:3px 8px;border:1px solid rgba(0,255,231,0.1);border-top:none;
}
.hc-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.hc-input,.hc-textarea{
  background:rgba(0,255,231,0.03);border:1px solid rgba(0,255,231,0.14);
  color:#c8e6f5;font-family:'Exo 2',sans-serif;font-size:13.5px;
  padding:10px 14px;outline:none;width:100%;
  clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);
  transition:border-color 0.2s,box-shadow 0.2s;
}
.hc-input::placeholder,.hc-textarea::placeholder{color:rgba(100,160,185,0.35);font-size:12px}
.hc-input:focus,.hc-textarea:focus{border-color:rgba(0,255,231,0.4);box-shadow:0 0 14px rgba(0,255,231,0.08)}
.hc-textarea{resize:vertical;min-height:90px;margin-bottom:14px;display:block}
.hc-submit{
  display:inline-flex;align-items:center;gap:10px;padding:11px 24px;
  background:rgba(0,255,231,0.08);border:1px solid rgba(0,255,231,0.4);
  clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);
  font-family:'Orbitron',sans-serif;font-size:10px;letter-spacing:3px;
  color:#00ffe7;cursor:pointer;text-transform:uppercase;transition:all 0.25s;
}
.hc-submit:hover{background:rgba(0,255,231,0.18);box-shadow:0 0 20px rgba(0,255,231,0.3)}
.hc-submit:disabled{opacity:0.4;pointer-events:none}
.hc-list{display:flex;flex-direction:column;gap:16px}
.hc-empty{font-family:'Space Mono',monospace;font-size:11px;color:rgba(100,160,180,0.4);letter-spacing:2px;text-align:center;padding:40px 0;text-transform:uppercase}
.hc-loading{display:flex;align-items:center;justify-content:center;gap:8px;padding:30px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(0,201,184,0.4);text-transform:uppercase}
.hc-loading::before{content:'';width:12px;height:12px;border:1px solid rgba(0,201,184,0.4);border-top-color:var(--teal);border-radius:50%;animation:hcSpin 0.8s linear infinite}
@keyframes hcSpin{to{transform:rotate(360deg)}}
.hc-comment{
  background:rgba(0,15,32,0.5);border:1px solid rgba(0,201,184,0.1);
  clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%);
  padding:16px 20px;position:relative;animation:hcIn 0.4s ease-out;
}
@keyframes hcIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.hc-meta{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}
.hc-author{font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:var(--teal2)}
.hc-time{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:1.5px;color:rgba(100,160,185,0.5)}
.hc-text{font-family:'Exo 2',sans-serif;font-size:14px;color:#b8d8f0;line-height:1.7}
.hc-comment.is-reply{margin-left:28px;border-left:2px solid rgba(255,156,56,0.5);background:rgba(20,10,0,0.4);border-top-color:rgba(255,156,56,0.18)}
.hc-comment.is-reply .hc-author{color:var(--amber2)}
.hc-reply-tag{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1.5px;color:var(--amber);background:rgba(255,156,56,0.08);border:1px solid rgba(255,156,56,0.2);padding:2px 7px;margin-left:auto;text-transform:uppercase}
.hc-load-more{display:flex;justify-content:center;margin-top:24px}
.hc-load-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;background:transparent;border:1px solid rgba(0,201,184,0.25);clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(0,201,184,0.6);cursor:pointer;transition:all 0.2s;text-transform:uppercase}
.hc-load-btn:hover{border-color:rgba(0,201,184,0.5);color:var(--teal);box-shadow:0 0 12px rgba(0,201,184,0.15)}
.hc-toast{position:fixed;bottom:108px;right:32px;z-index:20000;background:rgba(0,8,22,0.97);border:1px solid rgba(0,255,231,0.4);clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;color:#00ffe7;padding:10px 18px;box-shadow:0 0 20px rgba(0,255,231,0.2);opacity:0;transform:translateY(10px);transition:opacity 0.3s,transform 0.3s;pointer-events:none;text-transform:uppercase}
.hc-toast.show{opacity:1;transform:translateY(0)}

@media(max-width:600px){
  #faraday-panel{width:calc(100vw - 20px);left:10px;bottom:100px;max-height:calc(100vh - 130px);border-radius:16px 16px 16px 6px}
  #faraday-trigger{bottom:22px;left:22px}
  #hydrone-comments{padding:0 18px 60px}
  .hc-row{grid-template-columns:1fr}
  #frd-drive-frame-wrap{width:96vw;height:80vh}
}
`;
  document.head.appendChild(style);

  // ═══════════════════════════════════════════════════════════
  // FARADAY TRIGGER + PANEL
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

  // chat state
  const history = [];
  let isOpen = false, greeted = false;

  function openPanel() {
    panel.classList.add('open'); isOpen = true;
    if (!greeted) { greeted = true; greet(); }
    setTimeout(() => document.getElementById('frd-input').focus(), 300);
  }
  function closePanel() { panel.classList.remove('open'); isOpen = false; }

  trigger.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  document.getElementById('frd-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closePanel(); });

  function greet() {
    const h = new Date().getHours();
    const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    const d = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
    const t = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    addBot(`${g}! I'm **Faraday**, HYDRONE's embedded AI.\n\nToday is ${d} — ${t}.\n\nI know this project inside out — 7 years of engineering, from the first RC submarine to MARINOVA. What would you like to know?`);
  }

  function addMsg(role, text) {
    const msgs = document.getElementById('frd-messages');
    const wrap = document.createElement('div');
    wrap.className = `frd-msg ${role}`;
    const b = document.createElement('div');
    b.className = 'frd-bubble';
    b.innerHTML = text.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');
    wrap.appendChild(b);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
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
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: FARADAY_SYSTEM }] },
            contents: history
          })
        }
      );
      const data = await res.json();
      hideTyping();
      if (data.candidates && data.candidates[0]) {
        const reply = data.candidates[0].content.parts.map(p => p.text).join('\n');
        history.push({ role: 'model', parts: [{ text: reply }] });
        addBot(reply);
      } else { addBot('Transmission error. Please try again.'); }
    } catch { hideTyping(); addBot('Connection lost. Check your network and try again.'); }
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

  function extractFolderId(href) {
    const m = href.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : null;
  }

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
  // PUBLIC COMMENTS — Firebase Realtime Database
  // ═══════════════════════════════════════════════════════════
  let commentsPage = 1;
  const PER_PAGE = 8;
  let allComments = [];

  function timeAgo(ts) {
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return new Date(ts).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function showToast(msg) {
    let t = document.querySelector('.hc-toast');
    if (!t) { t = document.createElement('div'); t.className = 'hc-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function renderComments() {
    const list = document.getElementById('hc-list');
    const loadWrap = document.getElementById('hc-load-more');
    if (!list) return;
    list.innerHTML = '';
    if (allComments.length === 0) {
      list.innerHTML = '<div class="hc-empty">No transmissions yet — be the first.</div>';
      if (loadWrap) loadWrap.style.display = 'none';
      return;
    }
    const sorted = [...allComments].sort((a,b) => b.ts - a.ts);
    const shown = sorted.slice(0, commentsPage * PER_PAGE);
    shown.forEach(c => {
      const el = document.createElement('div');
      el.className = 'hc-comment' + (c.isReply ? ' is-reply' : '');
      el.innerHTML = `
        <div class="hc-meta">
          <span class="hc-author">${esc(c.name)}</span>
          <span class="hc-time">${timeAgo(c.ts)}</span>
          ${c.isReply ? '<span class="hc-reply-tag">✦ Fatin</span>' : ''}
        </div>
        <div class="hc-text">${esc(c.text).replace(/\n/g,'<br>')}</div>`;
      list.appendChild(el);
    });
    if (loadWrap) loadWrap.style.display = allComments.length > commentsPage * PER_PAGE ? 'flex' : 'none';
  }

  async function fetchComments() {
    const list = document.getElementById('hc-list');
    if (!list) return;
    list.innerHTML = '<div class="hc-loading">LOADING TRANSMISSIONS</div>';
    try {
      const res = await fetch(`${FIREBASE_URL}/comments.json`);
      const data = await res.json();
      if (data) {
        allComments = Object.entries(data).map(([id, v]) => ({ id, ...v }));
      } else { allComments = []; }
    } catch {
      allComments = [];
    }
    renderComments();
  }

  async function postComment(name, text) {
    const payload = JSON.stringify({ name, text, ts: Date.now(), isReply: false });
    const res = await fetch(`${FIREBASE_URL}/comments.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload
    });
    if (!res.ok) throw new Error('Post failed');
    const data = await res.json();
    allComments.push({ id: data.name, name, text, ts: Date.now(), isReply: false });
    renderComments();
  }

  function injectComments() {
    const footer = document.querySelector('footer');
    if (!footer || document.getElementById('hydrone-comments')) return;

    const sec = document.createElement('section');
    sec.id = 'hydrone-comments';
    sec.innerHTML = `
      <div class="hc-label">// OPEN CHANNEL</div>
      <div class="hc-heading">PUBLIC <span>LOG</span></div>
      <div class="hc-form-wrap">
        <div class="hc-row">
          <input class="hc-input" id="hc-name" type="text" placeholder="YOUR NAME" maxlength="50" autocomplete="off"/>
          <input class="hc-input" id="hc-email" type="email" placeholder="EMAIL (optional, not shown)" maxlength="120" autocomplete="off"/>
        </div>
        <textarea class="hc-textarea" id="hc-text" placeholder="Leave a message, question or feedback about HYDRONE..." maxlength="1000"></textarea>
        <button class="hc-submit" id="hc-submit">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          TRANSMIT
        </button>
      </div>
      <div class="hc-list" id="hc-list"><div class="hc-loading">LOADING TRANSMISSIONS</div></div>
      <div class="hc-load-more" id="hc-load-more" style="display:none">
        <button class="hc-load-btn" id="hc-load-btn">↑ LOAD MORE</button>
      </div>`;
    footer.parentNode.insertBefore(sec, footer);

    fetchComments();

    document.getElementById('hc-submit').addEventListener('click', async () => {
      const nameEl = document.getElementById('hc-name');
      const textEl = document.getElementById('hc-text');
      const name = nameEl.value.trim();
      const text = textEl.value.trim();
      if (!name) { nameEl.focus(); showToast('Please enter your name.'); return; }
      if (!text) { textEl.focus(); showToast('Message cannot be empty.'); return; }
      const btn = document.getElementById('hc-submit');
      btn.disabled = true; btn.textContent = 'TRANSMITTING...';
      try {
        await postComment(name, text);
        nameEl.value = ''; document.getElementById('hc-email').value = ''; textEl.value = '';
        showToast('Transmitted ✓');
        commentsPage = 1;
      } catch {
        showToast('Failed to send. Check connection.');
      }
      btn.disabled = false;
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> TRANSMIT';
    });

    document.getElementById('hc-load-btn').addEventListener('click', () => {
      commentsPage++; renderComments();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectComments);
  } else {
    injectComments();
  }

})();
