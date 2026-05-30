(function () {
  // ── Page map ──────────────────────────────────────────────
  const PAGES = [
    { id: 'index',      href: 'index.html',      label: 'HOME' },
    { id: 'core',       href: 'core.html',        label: 'CORE' },
    { id: 'propulsion', href: 'propulsion.html',  label: 'PROPULSION' },
    { id: 'capstone',   href: 'capstone.html',    label: 'CAPSTONE' },
  ];

  // Detect current page
  const path = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  const currentId = PAGES.find(p => p.id === path)?.id || 'index';

  // ── CSS ───────────────────────────────────────────────────
  const css = `
    #hn-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
      height: 48px;
      display: flex;
      align-items: center;
      padding: 0 28px;
      background: rgba(0, 6, 18, 0.82);
      backdrop-filter: blur(18px) saturate(1.6);
      -webkit-backdrop-filter: blur(18px) saturate(1.6);
      border-bottom: 1px solid rgba(0, 255, 200, 0.10);
      box-shadow: 0 0 32px rgba(0,0,0,0.55), 0 1px 0 rgba(0,255,200,0.07);
    }

    /* scanline shimmer */
    #hn-bar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 60px,
        rgba(0,255,200,0.012) 60px,
        rgba(0,255,200,0.012) 61px
      );
      pointer-events: none;
    }

    /* Logo */
    #hn-logo {
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 5px;
      color: #00ffe8;
      text-decoration: none;
      text-shadow:
        0 0 6px rgba(0,255,232,0.9),
        0 0 18px rgba(0,255,232,0.55),
        0 0 40px rgba(0,255,200,0.30);
      margin-right: auto;
      cursor: pointer;
      transition: text-shadow 0.25s;
      user-select: none;
      flex-shrink: 0;
    }
    #hn-logo:hover {
      text-shadow:
        0 0 8px rgba(0,255,232,1),
        0 0 28px rgba(0,255,232,0.8),
        0 0 60px rgba(0,255,200,0.5);
    }

    /* Nav links */
    #hn-links {
      display: flex;
      align-items: center;
      gap: 6px;
      list-style: none;
      margin: 0; padding: 0;
    }

    .hn-link {
      font-family: 'Orbitron', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 3px;
      text-decoration: none;
      padding: 5px 14px;
      border-radius: 2px;
      border: 1px solid transparent;
      color: rgba(0, 230, 210, 0.55);
      text-shadow: none;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
    }
    .hn-link:hover {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.35);
      background: rgba(255, 63, 164, 0.06);
      text-shadow:
        0 0 5px rgba(255,63,164,0.9),
        0 0 18px rgba(255,63,164,0.5),
        0 0 38px rgba(255,63,164,0.25);
    }

    /* Active state — hot pink neon */
    .hn-link.hn-active {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.50);
      background: rgba(255, 63, 164, 0.08);
      text-shadow:
        0 0 5px rgba(255,63,164,1),
        0 0 16px rgba(255,63,164,0.7),
        0 0 36px rgba(255,63,164,0.35);
      pointer-events: none;
    }
    /* Active underline bar */
    .hn-link.hn-active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 14px; right: 14px;
      height: 1px;
      background: #ff3fa4;
      box-shadow: 0 0 6px rgba(255,63,164,0.9), 0 0 16px rgba(255,63,164,0.5);
    }

    /* Divider between logo and links */
    #hn-div {
      width: 1px;
      height: 20px;
      background: rgba(0,255,200,0.14);
      margin: 0 20px 0 6px;
      flex-shrink: 0;
    }

    /* Push body down */
    body { padding-top: 48px !important; }

    /* Mobile: compress */
    @media (max-width: 600px) {
      #hn-bar { padding: 0 14px; }
      #hn-logo { font-size: 12px; letter-spacing: 3px; }
      .hn-link { font-size: 8px; letter-spacing: 2px; padding: 5px 9px; }
      #hn-div { margin: 0 10px 0 4px; }
    }
  `;

  // ── Build DOM ─────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const bar = document.createElement('nav');
  bar.id = 'hn-bar';

  // Logo
  const logo = document.createElement('a');
  logo.id = 'hn-logo';
  logo.textContent = 'HYDRONE';
  logo.href = 'index.html';

  // Divider
  const div = document.createElement('div');
  div.id = 'hn-div';

  // Links
  const ul = document.createElement('ul');
  ul.id = 'hn-links';

  PAGES.forEach(page => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'hn-link' + (page.id === currentId ? ' hn-active' : '');
    a.textContent = page.label;
    a.href = page.href;
    li.appendChild(a);
    ul.appendChild(li);
  });

  bar.appendChild(logo);
  bar.appendChild(div);
  bar.appendChild(ul);
  document.body.insertBefore(bar, document.body.firstChild);

  // ── Wire up navigation with page transition ───────────────
  // Wait for _navigate to be available (defined in page script)
  function hookNav() {
    const allLinks = bar.querySelectorAll('a');
    allLinks.forEach(a => {
      if (a.classList.contains('hn-active')) return; // already on this page
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (typeof _navigate === 'function') {
          _navigate(href);
        } else if (typeof _playClick === 'function') {
          _playClick();
          setTimeout(() => { window.location.href = href; }, 400);
        } else {
          window.location.href = href;
        }
      });
    });
  }

  // Hook after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookNav);
  } else {
    // _navigate might be defined after this script — wait a tick
    setTimeout(hookNav, 0);
  }

})();
