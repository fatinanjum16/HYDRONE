(function () {
  // ── Page map ──────────────────────────────────────────────
  const PAGES = [
    { id: 'index',      href: 'index.html',      label: 'HOME' },
    { id: 'core',       href: 'core.html',        label: 'CORE' },
    { id: 'propulsion', href: 'propulsion.html',  label: 'PROPULSION' },
    { id: 'capstone',   href: 'capstone.html',    label: 'CAPSTONE' },
  ];

  // ── Project list for PROJECT LOG dropdown ─────────────────
  // To add a new project later: just add { label, anchor, page }
  // anchor = section id on the target page
  // page   = which html file it lives in (leave empty for same page)
  const PROJECTS = [
    { label: 'Submarine Prototype', anchor: 'submarine-prototype', page: 'core.html' },
    { label: 'ROV Prototype',       anchor: 'rov-prototype',       page: 'core.html' },
    { label: 'HYDRoNE',            anchor: 'hydrone',             page: 'core.html' },
    { label: 'HYDRONE vIVo',        anchor: 'hydrone-vivo',        page: 'core.html' },
    { label: 'MICKEY',              anchor: 'mickey',              page: 'propulsion.html' },
    { label: 'TB5',                 anchor: 'tb5',                 page: 'propulsion.html' },
    { label: 'MARINOVA',            anchor: 'marinova',            page: 'capstone.html' },
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

    /* ── PROJECT LOG wrapper ─────────────────── */
    #hn-project-wrap {
      position: relative;
    }

    /* The PROJECT LOG button */
    #hn-project-btn {
      font-family: 'Orbitron', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 3px;
      padding: 5px 14px;
      border-radius: 2px;
      border: 1px solid transparent;
      color: rgba(0, 230, 210, 0.55);
      background: transparent;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
      user-select: none;
    }
    #hn-project-btn:hover,
    #hn-project-btn.open {
      color: #00ffd5;
      border-color: rgba(0, 255, 200, 0.35);
      background: rgba(0, 255, 200, 0.06);
      text-shadow:
        0 0 5px rgba(0,255,200,0.9),
        0 0 18px rgba(0,255,200,0.5),
        0 0 38px rgba(0,255,200,0.25);
    }
    /* Small arrow indicator */
    #hn-project-arrow {
      display: inline-block;
      width: 0; height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid currentColor;
      transition: transform 0.22s ease;
      opacity: 0.7;
    }
    #hn-project-btn.open #hn-project-arrow {
      transform: rotate(180deg);
    }

    /* ── Dropdown panel ──────────────────────── */
    #hn-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 280px;
      background: rgba(0, 8, 22, 0.96);
      border: 1px solid rgba(0, 255, 200, 0.22);
      border-radius: 3px;
      box-shadow:
        0 0 0 1px rgba(0,255,200,0.05),
        0 8px 40px rgba(0,0,0,0.75),
        0 0 30px rgba(0,255,200,0.08);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      overflow: hidden;
      opacity: 0;
      transform: translateY(-8px);
      pointer-events: none;
      transition: opacity 0.22s ease, transform 0.22s ease;
      z-index: 10000;
    }
    #hn-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    /* Top scanline */
    #hn-dropdown::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,255,200,0.6), transparent);
      box-shadow: 0 0 8px rgba(0,255,200,0.4);
    }

    /* Search box */
    #hn-search-wrap {
      padding: 10px 12px 8px;
      border-bottom: 1px solid rgba(0,255,200,0.08);
      position: relative;
    }
    #hn-search {
      width: 100%;
      background: rgba(0,255,200,0.04);
      border: 1px solid rgba(0,255,200,0.18);
      border-radius: 2px;
      color: #00ffd5;
      font-family: 'Orbitron', sans-serif;
      font-size: 8.5px;
      letter-spacing: 2px;
      padding: 6px 28px 6px 10px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      caret-color: #00ffd5;
    }
    #hn-search::placeholder {
      color: rgba(0,255,200,0.28);
      letter-spacing: 1.5px;
    }
    #hn-search:focus {
      border-color: rgba(0,255,200,0.45);
      box-shadow: 0 0 10px rgba(0,255,200,0.15), inset 0 0 6px rgba(0,255,200,0.05);
    }
    /* Search icon */
    #hn-search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(0,255,200,0.35);
      font-size: 11px;
      pointer-events: none;
    }

    /* Project items list */
    #hn-project-list {
      list-style: none;
      margin: 0; padding: 4px 0;
      max-height: 260px;
      overflow-y: auto;
    }
    #hn-project-list::-webkit-scrollbar { width: 3px; }
    #hn-project-list::-webkit-scrollbar-track { background: transparent; }
    #hn-project-list::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.25); border-radius: 2px; }

    .hn-proj-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      border-left: 2px solid transparent;
      position: relative;
    }
    .hn-proj-item:hover {
      background: rgba(0,255,200,0.06);
      border-left-color: #00ffd5;
    }
    .hn-proj-item::after {
      content: '→';
      position: absolute;
      right: 14px;
      color: rgba(0,255,200,0.3);
      font-size: 11px;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.15s, transform 0.15s;
    }
    .hn-proj-item:hover::after {
      opacity: 1;
      transform: translateX(0);
    }
    .hn-proj-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(0,255,200,0.4);
      flex-shrink: 0;
      box-shadow: 0 0 5px rgba(0,255,200,0.4);
      transition: background 0.15s, box-shadow 0.15s;
    }
    .hn-proj-item:hover .hn-proj-dot {
      background: #00ffd5;
      box-shadow: 0 0 8px rgba(0,255,200,0.8);
    }
    .hn-proj-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 8.8px;
      letter-spacing: 2px;
      color: rgba(0,220,200,0.7);
      text-transform: uppercase;
      transition: color 0.15s, text-shadow 0.15s;
    }
    .hn-proj-item:hover .hn-proj-name {
      color: #00ffd5;
      text-shadow: 0 0 8px rgba(0,255,200,0.6);
    }

    /* No results */
    #hn-no-results {
      padding: 14px;
      font-family: 'Orbitron', sans-serif;
      font-size: 8.5px;
      letter-spacing: 2px;
      color: rgba(0,255,200,0.25);
      text-align: center;
      display: none;
    }

    /* CONNECT button */
    #hn-connect {
      font-family: 'Orbitron', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 3px;
      padding: 5px 14px;
      border-radius: 2px;
      border: 1px solid rgba(0, 230, 210, 0.25);
      color: rgba(0, 230, 210, 0.55);
      background: transparent;
      cursor: pointer;
      white-space: nowrap;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
    }
    #hn-connect:hover {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.35);
      background: rgba(255, 63, 164, 0.06);
      text-shadow:
        0 0 5px rgba(255,63,164,0.9),
        0 0 18px rgba(255,63,164,0.5),
        0 0 38px rgba(255,63,164,0.25);
    }

    /* Push body down */
    body { padding-top: 48px !important; }

    /* Mobile: compress */
    @media (max-width: 600px) {
      #hn-bar { padding: 0 14px; }
      #hn-logo { font-size: 12px; letter-spacing: 3px; }
      .hn-link { font-size: 8px; letter-spacing: 2px; padding: 5px 9px; }
      #hn-project-btn { font-size: 8px; letter-spacing: 2px; padding: 5px 9px; }
      #hn-connect { font-size: 8px; letter-spacing: 2px; padding: 5px 9px; }
      #hn-div { margin: 0 10px 0 4px; }
      #hn-dropdown { width: 240px; right: -14px; }
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

  // Links ul
  const ul = document.createElement('ul');
  ul.id = 'hn-links';

  // HOME link
  const homeLi = document.createElement('li');
  const homeA = document.createElement('a');
  homeA.className = 'hn-link' + (currentId === 'index' ? ' hn-active' : '');
  homeA.textContent = 'HOME';
  homeA.href = 'index.html';
  homeLi.appendChild(homeA);
  ul.appendChild(homeLi);

  // ── PROJECT LOG dropdown ──────────────────────────────────
  const projWrap = document.createElement('li');
  projWrap.id = 'hn-project-wrap';

  const projBtn = document.createElement('button');
  projBtn.id = 'hn-project-btn';
  projBtn.innerHTML = 'PROJECT LOG <span id="hn-project-arrow"></span>';

  const dropdown = document.createElement('div');
  dropdown.id = 'hn-dropdown';

  // Search box
  const searchWrap = document.createElement('div');
  searchWrap.id = 'hn-search-wrap';
  const searchInput = document.createElement('input');
  searchInput.id = 'hn-search';
  searchInput.type = 'text';
  searchInput.placeholder = 'SEARCH PROJECTS...';
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;
  const searchIcon = document.createElement('span');
  searchIcon.id = 'hn-search-icon';
  searchIcon.textContent = '⌕';
  searchWrap.appendChild(searchInput);
  searchWrap.appendChild(searchIcon);

  // Project list
  const projList = document.createElement('ul');
  projList.id = 'hn-project-list';

  // No results
  const noResults = document.createElement('div');
  noResults.id = 'hn-no-results';
  noResults.textContent = 'NO MATCH FOUND';

  // Build project items
  function buildItems(filter) {
    projList.innerHTML = '';
    const q = (filter || '').trim().toLowerCase();
    const matched = PROJECTS.filter(p =>
      !q || p.label.toLowerCase().includes(q)
    );

    if (matched.length === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
      matched.forEach(proj => {
        const li = document.createElement('li');
        li.className = 'hn-proj-item';
        li.innerHTML = `<span class="hn-proj-dot"></span><span class="hn-proj-name">${proj.label}</span>`;
        li.addEventListener('click', () => {
          closeDropdown();
          navigateToProject(proj);
        });
        projList.appendChild(li);
      });
    }
  }

  dropdown.appendChild(searchWrap);
  dropdown.appendChild(projList);
  dropdown.appendChild(noResults);
  projWrap.appendChild(projBtn);
  projWrap.appendChild(dropdown);
  ul.appendChild(projWrap);

  // CONNECT
  const connectLi = document.createElement('li');
  const connectBtn = document.createElement('button');
  connectBtn.id = 'hn-connect';
  connectBtn.textContent = 'CONNECT';
  connectLi.appendChild(connectBtn);
  ul.appendChild(connectLi);

  bar.appendChild(logo);
  bar.appendChild(div);
  bar.appendChild(ul);
  document.body.insertBefore(bar, document.body.firstChild);

  // ── Dropdown open/close logic ─────────────────────────────
  let dropdownOpen = false;

  function openDropdown() {
    buildItems('');
    searchInput.value = '';
    dropdown.classList.add('open');
    projBtn.classList.add('open');
    dropdownOpen = true;
    setTimeout(() => searchInput.focus(), 60);
  }

  function closeDropdown() {
    dropdown.classList.remove('open');
    projBtn.classList.remove('open');
    dropdownOpen = false;
  }

  projBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdownOpen) { closeDropdown(); } else { openDropdown(); }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (dropdownOpen && !projWrap.contains(e.target)) {
      closeDropdown();
    }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownOpen) closeDropdown();
  });

  // Search filter
  searchInput.addEventListener('input', () => {
    buildItems(searchInput.value);
  });

  // Stop click inside dropdown from closing
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  // ── Navigate to project (anchor on page) ─────────────────
  function navigateToProject(proj) {
    const targetFile = proj.page || 'index.html';
    const anchor = proj.anchor;
    const currentFile = (window.location.pathname.split('/').pop() || 'index.html');

    if (currentFile === targetFile || currentFile === targetFile.replace('.html','')) {
      // Already on right page — just scroll
      scrollToAnchor(anchor);
    } else {
      // Navigate with flash transition then scroll
      if (typeof _navigate === 'function') {
        _navigate(targetFile + '#' + anchor);
      } else if (typeof _playClick === 'function') {
        _playClick();
        setTimeout(() => { window.location.href = targetFile + '#' + anchor; }, 400);
      } else {
        window.location.href = targetFile + '#' + anchor;
      }
    }
  }

  function scrollToAnchor(anchor) {
    // Try id first, then data-anchor, then fallback scan
    let el = document.getElementById(anchor);
    if (!el) el = document.querySelector('[data-anchor="' + anchor + '"]');
    if (!el) {
      // Fuzzy: match heading text
      const slug = anchor.replace(/-/g, ' ').toLowerCase();
      document.querySelectorAll('h2, h3, .gen-name, .ext-title').forEach(h => {
        if (!el && h.textContent.trim().toLowerCase().includes(slug)) el = h;
      });
    }
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Auto-scroll to anchor from URL hash on page load
  function handleHashOnLoad() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => scrollToAnchor(hash), 400);
    }
  }

  // ── CONNECT → scroll to footer ────────────────────────────
  connectBtn.addEventListener('click', () => {
    const footer = document.querySelector('footer');
    if (footer) {
      const top = footer.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    if (typeof _playClick === 'function') _playClick();
  });

  // ── Wire HOME link navigation ─────────────────────────────
  function hookNav() {
    // HOME link
    homeA.addEventListener('click', function (e) {
      if (homeA.classList.contains('hn-active')) return;
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

    // Logo
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentId === 'index') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const href = 'index.html';
      if (typeof _navigate === 'function') {
        _navigate(href);
      } else {
        window.location.href = href;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { hookNav(); handleHashOnLoad(); });
  } else {
    setTimeout(() => { hookNav(); handleHashOnLoad(); }, 0);
  }

})();
