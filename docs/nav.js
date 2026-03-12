// Shared navigation overlay for all Bilt prototype pages
(function () {
  const PROTOTYPES = [
    { id: 'ai-concierge', name: 'AI Concierge', created: '2026-03-12' },
    { id: 'joist-transfer', name: 'JOIST Transfer', created: '2026-03-12' },
    { id: 'points-transfer', name: 'Points Transfer', created: '2026-03-11' },
    { id: 'travel-checkout', name: 'Travel Checkout', created: '2026-03-10' },
  ];

  // Determine current prototype from URL path
  const path = location.pathname;
  const currentId = PROTOTYPES.find(p => path.includes(p.id))?.id || null;

  // Base path — works whether served from /bilt-prototypes/ or locally
  const base = path.substring(0, path.indexOf(currentId) || path.lastIndexOf('/') + 1);

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .bilt-nav-fab-group {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      font-family: 'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .bilt-nav-fab-group * { box-sizing: border-box; margin: 0; padding: 0; }
    .bilt-nav-fab {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(15,20,30,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transition: all 0.2s;
    }
    .bilt-nav-fab:hover {
      background: rgba(15,20,30,0.95);
      color: #fff;
    }
    .bilt-nav-toc-wrap { position: relative; }
    .bilt-nav-toc {
      position: absolute;
      bottom: 48px;
      right: 0;
      width: 240px;
      background: rgba(15,20,30,0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      padding: 12px;
      display: none;
      flex-direction: column;
      gap: 2px;
    }
    .bilt-nav-toc.open { display: flex; animation: biltNavIn 0.15s ease-out; }
    @keyframes biltNavIn {
      from { opacity: 0; transform: translateY(8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .bilt-nav-toc a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      color: rgba(255,255,255,0.6);
      font-size: 13px;
      font-weight: 470;
      text-decoration: none;
      transition: all 0.15s;
    }
    .bilt-nav-toc a:hover {
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.85);
    }
    .bilt-nav-toc a.active {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    .bilt-nav-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #48bb78;
      flex-shrink: 0;
    }
    .bilt-nav-date {
      font-size: 11px;
      opacity: 0.4;
      font-weight: 400;
      margin-left: auto;
    }
    .bilt-nav-home {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      font-weight: 470;
      text-decoration: none;
      transition: all 0.15s;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-top: 4px;
      padding-top: 14px;
    }
    .bilt-nav-home:hover {
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
    }
  `;
  document.head.appendChild(style);

  // Build TOC HTML
  const tocItems = PROTOTYPES.map(p => {
    const href = base + p.id + '/';
    const active = p.id === currentId ? ' active' : '';
    return `<a href="${href}" class="${active}">
      <span class="bilt-nav-dot"></span>
      ${p.name}
      <span class="bilt-nav-date">${formatDate(p.created)}</span>
    </a>`;
  }).join('');

  const hubHref = base || './';

  // Inject DOM
  const group = document.createElement('div');
  group.className = 'bilt-nav-fab-group';
  group.innerHTML = `
    <div class="bilt-nav-toc-wrap">
      <div class="bilt-nav-toc" id="biltNavToc">
        ${tocItems}
        <a class="bilt-nav-home" href="${hubHref}">Hub &#8599;</a>
      </div>
      <button class="bilt-nav-fab" id="biltNavToggle" title="Prototypes">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(group);

  // Toggle
  let open = false;
  document.getElementById('biltNavToggle').addEventListener('click', () => {
    open = !open;
    document.getElementById('biltNavToc').classList.toggle('open', open);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (open && !group.contains(e.target)) {
      open = false;
      document.getElementById('biltNavToc').classList.remove('open');
    }
  });
})();
