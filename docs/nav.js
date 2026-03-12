// Shared navigation overlay for all Bilt prototype pages
(function () {
  const PROTOTYPES = [
    { id: 'ai-concierge', name: 'AI Concierge', description: 'Coworker Colin was presenting during a design review — had Claude bring his designs to life in real time.', project: 'colin-prototype', created: '2026-03-12' },
    { id: 'joist-transfer', name: 'JOIST Transfer', description: 'Pointed Claude and Figma MCP at the entire components page and had it build a transfer flow informed by the JOIST design system.', project: 'joist-view', created: '2026-03-12' },
    { id: 'points-transfer', name: 'Points Transfer', description: 'Pointed Claude Code and Figma MCP via Chrome DevTools at the local components file from Travel Checkout — it generated this transfer flow.', project: 'partner-travel-flow-figma-mcp', created: '2026-03-11' },
    { id: 'travel-checkout', name: 'Travel Checkout', description: 'First attempt using Figma MCP with Claude Code — gave it one frame and it built this flight booking flow.', project: 'travel-page-prototype-one', created: '2026-03-10' },
  ];

  const path = location.pathname;
  const currentId = PROTOTYPES.find(p => path.includes(p.id))?.id || null;
  const base = currentId ? path.substring(0, path.indexOf(currentId)) : path.replace(/\/$/, '') + '/';

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatDateLong(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  const style = document.createElement('style');
  style.textContent = `
    .bilt-nav-group {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      font-family: 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .bilt-nav-group * { box-sizing: border-box; margin: 0; padding: 0; }

    .bilt-nav-fab {
      width: 40px; height: 40px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(15,20,30,0.85);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      color: rgba(255,255,255,0.6); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: all 0.2s;
    }
    .bilt-nav-fab:hover { background: rgba(15,20,30,0.95); color: #fff; }

    /* TOC Panel */
    .bilt-nav-wrap { position: relative; }
    .bilt-nav-panel {
      position: absolute; bottom: 48px; right: 0;
      background: rgba(15,20,30,0.9);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      display: none; flex-direction: column;
    }
    .bilt-nav-panel.open { display: flex; animation: biltNavIn 0.15s ease-out; }
    @keyframes biltNavIn {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* TOC specific */
    .bilt-nav-toc { width: 240px; padding: 12px; gap: 2px; }
    .bilt-nav-toc a {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 470;
      text-decoration: none; transition: all 0.15s;
    }
    .bilt-nav-toc a:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
    .bilt-nav-toc a.active { background: rgba(255,255,255,0.12); color: #fff; }
    .bilt-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #48bb78; flex-shrink: 0; }
    .bilt-nav-date { font-size: 11px; opacity: 0.4; font-weight: 400; margin-left: auto; }

    /* Info Panel */
    .bilt-nav-info { width: 260px; padding: 20px; gap: 16px; }
    .bilt-nav-info h2 { font-size: 16px; font-weight: 500; color: #fff; letter-spacing: -0.2px; }
    .bilt-nav-field { display: flex; flex-direction: column; gap: 3px; }
    .bilt-nav-label {
      font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.3);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .bilt-nav-value { font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.4; }
    .bilt-nav-value a { color: #63b3ed; text-decoration: none; }
    .bilt-nav-value a:hover { text-decoration: underline; }
    .bilt-nav-status {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 500;
      background: rgba(72,187,120,0.15); color: #48bb78;
    }
    .bilt-nav-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .bilt-nav-open {
      display: block; width: 100%; padding: 8px; border-radius: 8px; border: none;
      background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
      font-family: inherit; font-size: 13px; font-weight: 470;
      cursor: pointer; transition: background 0.15s;
      text-align: center; text-decoration: none;
    }
    .bilt-nav-open:hover { background: rgba(255,255,255,0.14); color: #fff; }
  `;
  document.head.appendChild(style);

  // Build TOC items
  const tocItems = PROTOTYPES.map(p => {
    const href = base + p.id + '/';
    const active = p.id === currentId ? ' active' : '';
    return `<a href="${href}" class="${active}"><span class="bilt-nav-dot"></span>${p.name}<span class="bilt-nav-date">${formatDate(p.created)}</span></a>`;
  }).join('');

  // Current prototype data for info panel
  const current = PROTOTYPES.find(p => p.id === currentId);
  const currentUrl = current ? base + current.id + '/' : '';

  const group = document.createElement('div');
  group.className = 'bilt-nav-group';
  group.innerHTML = `
    <div class="bilt-nav-wrap">
      <div class="bilt-nav-panel bilt-nav-toc" id="biltToc">${tocItems}</div>
      <button class="bilt-nav-fab" id="biltTocBtn" title="Prototypes">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </button>
    </div>
    ${current ? `
    <div class="bilt-nav-wrap">
      <div class="bilt-nav-panel bilt-nav-info" id="biltInfo">
        <h2>${current.name}</h2>
        <div class="bilt-nav-field">
          <span class="bilt-nav-label">Status</span>
          <span class="bilt-nav-value"><span class="bilt-nav-status"><span class="bilt-nav-status-dot"></span>Live</span></span>
        </div>
        <div class="bilt-nav-field">
          <span class="bilt-nav-label">Description</span>
          <span class="bilt-nav-value">${current.description}</span>
        </div>
        <div class="bilt-nav-field">
          <span class="bilt-nav-label">Created</span>
          <span class="bilt-nav-value">${formatDateLong(current.created)}</span>
        </div>
        <div class="bilt-nav-field">
          <span class="bilt-nav-label">Project</span>
          <span class="bilt-nav-value">${current.project}</span>
        </div>
        <a class="bilt-nav-open" href="${currentUrl}" target="_blank">Open in new tab &#8599;</a>
      </div>
      <button class="bilt-nav-fab" id="biltInfoBtn" title="Prototype info">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
        </svg>
      </button>
    </div>` : ''}
  `;
  document.body.appendChild(group);

  // Toggle logic
  let tocOpen = false;
  let infoOpen = false;
  const tocPanel = document.getElementById('biltToc');
  const infoPanel = document.getElementById('biltInfo');

  document.getElementById('biltTocBtn').addEventListener('click', () => {
    tocOpen = !tocOpen;
    if (tocOpen && infoOpen) { infoOpen = false; infoPanel?.classList.remove('open'); }
    tocPanel.classList.toggle('open', tocOpen);
  });

  if (infoPanel) {
    document.getElementById('biltInfoBtn').addEventListener('click', () => {
      infoOpen = !infoOpen;
      if (infoOpen && tocOpen) { tocOpen = false; tocPanel.classList.remove('open'); }
      infoPanel.classList.toggle('open', infoOpen);
    });
  }

  document.addEventListener('click', (e) => {
    if (!group.contains(e.target)) {
      tocOpen = false; infoOpen = false;
      tocPanel.classList.remove('open');
      infoPanel?.classList.remove('open');
    }
  });
})();
