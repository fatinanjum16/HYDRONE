(function () {

  // ── Project list ───────────────────────────────────────────
  // selector:  CSS querySelector to find the Nth matching element on the page
  // index:     0-based index of that element (which gen-block, ext-card, etc.)
  // page:      which html file
  //
  // To add a new project: add an entry here. Use browser DevTools to find
  // the right selector + index for the new section.
  const PROJECTS = [
    {
      label: 'Submarine Prototype',
      page:  'core.html',
      selector: '.gen-block',
      index: 0,                 // 1st gen-block on core.html
    },
    {
      label: 'ROV Prototype',
      page:  'core.html',
      selector: '.gen-block',
      index: 1,                 // 2nd gen-block
    },
    {
      label: 'HYDRoNE',
      labelPlain: 'HYDRoNE',
      page:  'core.html',
      selector: '.gen-block',
      index: 2,                 // 3rd gen-block
    },
    {
      label: 'HYDRONE vIVo',
      labelPlain: 'HYDRONE vIVo',
      page:  'core.html',
      selector: '.gen-block',
      index: 3,                 // 4th gen-block
    },
    {
      label: 'MICKEY',
      page:  'propulsion.html',
      selector: '.ext-card',
      index: 0,                 // 1st ext-card on propulsion.html
    },
    {
      label: 'TB5',
      page:  'propulsion.html',
      selector: '.ext-card',
      index: 1,                 // 2nd ext-card
    },
    {
      label: 'MARINOVA',
      page:  'capstone.html',
      selector: '.ext-card, .gen-block, .capstone-badge',
      index: 0,
    },
  ];

  // Detect current page
  const path = window.location.pathname.split('/').pop().replace('.html','') || 'index';

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
    #hn-bar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg, transparent, transparent 60px,
        rgba(0,255,200,0.012) 60px, rgba(0,255,200,0.012) 61px
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
      text-shadow: 0 0 6px rgba(0,255,232,0.9), 0 0 18px rgba(0,255,232,0.55), 0 0 40px rgba(0,255,200,0.30);
      margin-right: auto;
      cursor: pointer;
      transition: text-shadow 0.25s;
      user-select: none;
      flex-shrink: 0;
    }
    #hn-logo:hover {
      text-shadow: 0 0 8px rgba(0,255,232,1), 0 0 28px rgba(0,255,232,0.8), 0 0 60px rgba(0,255,200,0.5);
    }

    #hn-div {
      width: 1px;
      height: 20px;
      background: rgba(0,255,200,0.14);
      margin: 0 20px 0 6px;
      flex-shrink: 0;
    }

    #hn-links {
      display: flex;
      align-items: center;
      gap: 6px;
      list-style: none;
      margin: 0; padding: 0;
    }

    /* shared button/link style */
    .hn-link, .hn-btn {
      font-family: 'Orbitron', sans-serif;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 3px;
      text-decoration: none;
      padding: 5px 14px;
      border-radius: 2px;
      border: 1px solid transparent;
      color: rgba(0, 230, 210, 0.55);
      background: transparent;
      text-shadow: none;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
      cursor: pointer;
      white-space: nowrap;
      position: relative;
      line-height: 1;
      /* CRITICAL: vertical align fix */
      display: inline-flex;
      align-items: center;
      height: 28px;
    }
    .hn-link:hover, .hn-btn:hover {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.35);
      background: rgba(255, 63, 164, 0.06);
      text-shadow: 0 0 5px rgba(255,63,164,0.9), 0 0 18px rgba(255,63,164,0.5), 0 0 38px rgba(255,63,164,0.25);
    }
    .hn-link.hn-active {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.50);
      background: rgba(255, 63, 164, 0.08);
      text-shadow: 0 0 5px rgba(255,63,164,1), 0 0 16px rgba(255,63,164,0.7), 0 0 36px rgba(255,63,164,0.35);
      pointer-events: none;
    }
    .hn-link.hn-active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 14px; right: 14px;
      height: 1px;
      background: #ff3fa4;
      box-shadow: 0 0 6px rgba(255,63,164,0.9), 0 0 16px rgba(255,63,164,0.5);
    }

    /* ── PROJECT LOG ── */
    #hn-project-wrap { position: relative; }

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
      display: inline-flex;
      align-items: center;
      gap: 7px;
      height: 28px;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
      user-select: none;
    }
    #hn-project-btn:hover, #hn-project-btn.open {
      color: #00ffd5;
      border-color: rgba(0,255,200,0.35);
      background: rgba(0,255,200,0.06);
      text-shadow: 0 0 5px rgba(0,255,200,0.9), 0 0 18px rgba(0,255,200,0.5);
    }
    #hn-project-arrow {
      display: inline-block;
      width: 0; height: 0;
      border-left: 3.5px solid transparent;
      border-right: 3.5px solid transparent;
      border-top: 4.5px solid currentColor;
      transition: transform 0.2s ease;
      opacity: 0.65;
      flex-shrink: 0;
    }
    #hn-project-btn.open #hn-project-arrow { transform: rotate(180deg); }

    /* Dropdown */
    #hn-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 272px;
      background: rgba(0, 8, 22, 0.97);
      border: 1px solid rgba(0,255,200,0.22);
      border-radius: 3px;
      box-shadow: 0 0 0 1px rgba(0,255,200,0.04), 0 12px 40px rgba(0,0,0,0.8), 0 0 28px rgba(0,255,200,0.07);
      backdrop-filter: blur(24px);
      overflow: hidden;
      opacity: 0;
      transform: translateY(-6px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 10000;
    }
    #hn-dropdown::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,255,200,0.55), transparent);
      box-shadow: 0 0 6px rgba(0,255,200,0.35);
    }
    #hn-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    /* Search */
    #hn-search-wrap {
      padding: 10px 12px 8px;
      border-bottom: 1px solid rgba(0,255,200,0.07);
      position: relative;
    }
    #hn-search {
      width: 100%;
      background: rgba(0,255,200,0.04);
      border: 1px solid rgba(0,255,200,0.16);
      border-radius: 2px;
      color: #00ffd5;
      font-family: 'Orbitron', sans-serif;
      font-size: 8.5px;
      letter-spacing: 2px;
      padding: 6px 26px 6px 10px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      caret-color: #00ffd5;
    }
    #hn-search::placeholder { color: rgba(0,255,200,0.25); letter-spacing: 1.5px; }
    #hn-search:focus {
      border-color: rgba(0,255,200,0.4);
      box-shadow: 0 0 8px rgba(0,255,200,0.12), inset 0 0 4px rgba(0,255,200,0.04);
    }
    #hn-search-icon {
      position: absolute;
      right: 20px; top: 50%;
      transform: translateY(-50%);
      color: rgba(0,255,200,0.3);
      font-size: 12px;
      pointer-events: none;
    }

    /* Project list */
    #hn-project-list {
      list-style: none; margin: 0; padding: 4px 0;
      max-height: 260px; overflow-y: auto;
    }
    #hn-project-list::-webkit-scrollbar { width: 3px; }
    #hn-project-list::-webkit-scrollbar-track { background: transparent; }
    #hn-project-list::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.2); border-radius: 2px; }

    .hn-proj-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      cursor: pointer;
      transition: background 0.14s;
      border-left: 2px solid transparent;
      position: relative;
    }
    .hn-proj-item:hover {
      background: rgba(0,255,200,0.055);
      border-left-color: #00ffd5;
    }
    .hn-proj-item::after {
      content: '→';
      position: absolute; right: 13px;
      color: rgba(0,255,200,0.28);
      font-size: 11px;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.14s, transform 0.14s;
    }
    .hn-proj-item:hover::after { opacity: 1; transform: translateX(0); }

    .hn-proj-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(0,255,200,0.35);
      flex-shrink: 0;
      box-shadow: 0 0 5px rgba(0,255,200,0.35);
      transition: background 0.14s, box-shadow 0.14s;
    }
    .hn-proj-item:hover .hn-proj-dot {
      background: #00ffd5;
      box-shadow: 0 0 8px rgba(0,255,200,0.75);
    }

    .hn-proj-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 8.8px;
      letter-spacing: 2px;
      color: rgba(0,215,195,0.65);
      transition: color 0.14s, text-shadow 0.14s;
    }
    /* Mixed-case letters inside project names */
    .hn-proj-name .hn-proj-small,
    .hn-proj-name span.hn-proj-small {
      font-family: 'Exo 2', sans-serif !important;
      font-size: 1em;
      font-weight: 600;
      text-transform: none !important;
      letter-spacing: 2px;
      vertical-align: 0.05em;
    }
    .hn-proj-item:hover .hn-proj-name {
      color: #00ffd5;
      text-shadow: 0 0 7px rgba(0,255,200,0.55);
    }

    #hn-no-results {
      padding: 14px;
      font-family: 'Orbitron', sans-serif;
      font-size: 8.5px;
      letter-spacing: 2px;
      color: rgba(0,255,200,0.22);
      text-align: center;
      display: none;
    }

    /* CONNECT — no box by default, box on hover */
    #hn-connect {
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
      display: inline-flex;
      align-items: center;
      height: 28px;
      transition: color 0.2s, border-color 0.2s, text-shadow 0.2s, background 0.2s;
    }
    #hn-connect:hover {
      color: #ff3fa4;
      border-color: rgba(255, 63, 164, 0.40);
      background: rgba(255, 63, 164, 0.06);
      text-shadow: 0 0 5px rgba(255,63,164,0.9), 0 0 18px rgba(255,63,164,0.5), 0 0 38px rgba(255,63,164,0.25);
    }

    body { padding-top: 48px !important; }

    @media (max-width: 600px) {
      #hn-bar { padding: 0 14px; }
      #hn-logo { font-size: 12px; letter-spacing: 3px; }
      .hn-link, .hn-btn, #hn-project-btn, #hn-connect {
        font-size: 8px; letter-spacing: 2px; padding: 5px 9px;
      }
      #hn-div { margin: 0 10px 0 4px; }
      #hn-dropdown { width: 230px; right: -14px; }
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
  const divEl = document.createElement('div');
  divEl.id = 'hn-div';

  const ul = document.createElement('ul');
  ul.id = 'hn-links';

  // HOME
  const homeLi = document.createElement('li');
  const homeA = document.createElement('a');
  homeA.className = 'hn-link' + (path === 'index' ? ' hn-active' : '');
  homeA.textContent = 'HOME';
  homeA.href = 'index.html';
  homeLi.appendChild(homeA);
  ul.appendChild(homeLi);

  // PROJECT LOG
  const projWrap = document.createElement('li');
  projWrap.id = 'hn-project-wrap';

  const projBtn = document.createElement('button');
  projBtn.id = 'hn-project-btn';
  projBtn.innerHTML = 'PROJECT LOG <span id="hn-project-arrow"></span>';

  const dropdown = document.createElement('div');
  dropdown.id = 'hn-dropdown';

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

  const projList = document.createElement('ul');
  projList.id = 'hn-project-list';

  const noResults = document.createElement('div');
  noResults.id = 'hn-no-results';
  noResults.textContent = 'NO MATCH FOUND';

  function buildItems(filter) {
    projList.innerHTML = '';
    const q = (filter || '').trim().toLowerCase();
    const matched = PROJECTS.filter(p =>
      !q || (p.labelPlain || p.label).replace(/<[^>]+>/g,'').toLowerCase().includes(q)
    );
    if (matched.length === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
      matched.forEach(proj => {
        const li = document.createElement('li');
        li.className = 'hn-proj-item';
        const displayLabel = proj.label; // may contain <span> for mixed case
        li.innerHTML = `<span class="hn-proj-dot"></span><span class="hn-proj-name">${displayLabel}</span>`;
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
  bar.appendChild(divEl);
  bar.appendChild(ul);
  document.body.insertBefore(bar, document.body.firstChild);

  // ── Dropdown logic ────────────────────────────────────────
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

  projBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownOpen ? closeDropdown() : openDropdown();
  });
  document.addEventListener('click', e => {
    if (dropdownOpen && !projWrap.contains(e.target)) closeDropdown();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dropdownOpen) closeDropdown();
  });
  searchInput.addEventListener('input', () => buildItems(searchInput.value));
  dropdown.addEventListener('click', e => e.stopPropagation());

  // ── Navigate to project by selector+index ────────────────
  function navigateToProject(proj) {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const targetFile  = proj.page;

    if (currentFile === targetFile) {
      // Same page — find element by selector+index and scroll
      scrollToProjectElement(proj);
    } else {
      // Different page — encode index in sessionStorage then navigate
      try {
        sessionStorage.setItem('hn_scroll_selector', proj.selector);
        sessionStorage.setItem('hn_scroll_index', String(proj.index));
      } catch(_) {}

      const href = targetFile;
      if (typeof _navigate === 'function') {
        _navigate(href);
      } else if (typeof _playClick === 'function') {
        _playClick();
        setTimeout(() => { window.location.href = href; }, 400);
      } else {
        window.location.href = href;
      }
    }
  }

  function scrollToProjectElement(proj) {
    const els = document.querySelectorAll(proj.selector);
    const el  = els[proj.index];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: 'smooth' });
      if (typeof _playClick === 'function') _playClick();
    }
  }

  // On page load — check if we need to scroll to a stored project
  function checkScrollOnLoad() {
    try {
      const sel = sessionStorage.getItem('hn_scroll_selector');
      const idx = sessionStorage.getItem('hn_scroll_index');
      if (sel !== null && idx !== null) {
        sessionStorage.removeItem('hn_scroll_selector');
        sessionStorage.removeItem('hn_scroll_index');
        const proj = { selector: sel, index: parseInt(idx, 10) };
        // Wait for page paint + animations
        setTimeout(() => scrollToProjectElement(proj), 520);
      }
    } catch(_) {}
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

  // ── HOME + Logo navigation ────────────────────────────────
  function hookNav() {
    homeA.addEventListener('click', function(e) {
      if (homeA.classList.contains('hn-active')) return;
      e.preventDefault();
      const href = 'index.html';
      if (typeof _navigate === 'function') _navigate(href);
      else if (typeof _playClick === 'function') { _playClick(); setTimeout(() => { window.location.href = href; }, 400); }
      else window.location.href = href;
    });

    logo.addEventListener('click', function(e) {
      e.preventDefault();
      if (path === 'index') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const href = 'index.html';
      if (typeof _navigate === 'function') _navigate(href);
      else window.location.href = href;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { hookNav(); checkScrollOnLoad(); });
  } else {
    setTimeout(() => { hookNav(); checkScrollOnLoad(); }, 0);
  }

})();
