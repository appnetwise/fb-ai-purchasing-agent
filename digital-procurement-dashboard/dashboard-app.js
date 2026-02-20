/* ProcureIQ Dashboard App */
const I = (id) => document.getElementById(id);

// SVG icon paths
const icons = {
  dashboard: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>',
  cart: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>',
  orders: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>',
  inventory: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
  invoice: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>',
  suppliers: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>',
  analytics: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
  pricing: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  flash: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>',
  settings: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>',
  truck: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 8h6a1 1 0 011 1v5h-7"/>',
  waste: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>',
  marketplace: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
  catalog: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
  dispatch: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>',
  admin: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>'
};
const svg = (name) => `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[name]}</svg>`;

// Sidebar configs per role
const sidebarConfig = {
  restaurant: {
    title: 'Restaurant Manager', avatar: 'AM', name: 'Ahmed M.', subtitle: 'Procurement Mgr',
    gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    items: [
      { id: 'r-dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 'r-smartcart', icon: 'cart', label: 'Smart Cart' },
      { id: 'r-marketplace', icon: 'marketplace', label: 'Marketplace & RFQ' },
      { id: 'r-orders', icon: 'orders', label: 'Orders' },
      { id: 'r-delivery', icon: 'truck', label: 'Delivery Tracking' },
      { id: 'r-inventory', icon: 'inventory', label: 'Inventory' },
      { id: 'r-kitchen', icon: 'orders', label: 'Kitchen Copilot' },
      { id: 'r-invoices', icon: 'invoice', label: 'Invoices & Match' },
      { id: 'r-suppliers', icon: 'suppliers', label: 'Suppliers' },
      { id: 'r-waste', icon: 'waste', label: 'Waste & Insights' },
      { id: 'r-analytics', icon: 'analytics', label: 'Analytics' }
    ]
  },
  supplier: {
    title: 'Supplier Manager', avatar: 'SK', name: 'Sarah K.', subtitle: 'Sales Manager',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    items: [
      { id: 's-dashboard', icon: 'dashboard', label: 'Dashboard' },
      { id: 's-catalog', icon: 'catalog', label: 'Catalog Management' },
      { id: 's-incoming', icon: 'orders', label: 'Incoming POs' },
      { id: 's-pricing', icon: 'pricing', label: 'Pricing Agent' },
      { id: 's-flash', icon: 'flash', label: 'Flash Deals' },
      { id: 's-dispatch', icon: 'dispatch', label: 'Orders & Dispatch' },
      { id: 's-customers', icon: 'suppliers', label: 'Customers' },
      { id: 's-collections', icon: 'invoice', label: 'Collections' },
      { id: 's-invoices', icon: 'invoice', label: 'Invoices' },
      { id: 's-analytics', icon: 'analytics', label: 'Analytics' }
    ]
  },
  sales: {
    title: 'Sales Representative', avatar: 'JD', name: 'Jason D.', subtitle: 'Territory Manager',
    gradient: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
    items: [
      { id: 'sales-dashboard', icon: 'dashboard', label: 'Territory Ops' },
      { id: 'sales-territory', icon: 'suppliers', label: 'Map View' },
      { id: 'sales-commissions', icon: 'analytics', label: 'Commissions' },
      { id: 'sales-activity', icon: 'orders', label: 'Agent Activity' }
    ]
  },
  admin: {
    title: 'Platform Admin', avatar: 'AD', name: 'Admin User', subtitle: 'System control',
    gradient: 'linear-gradient(135deg,#10b981,#3b82f6)',
    items: [
      { id: 'admin-dashboard', icon: 'dashboard', label: 'Platform Hub' },
      { id: 'admin-verification', icon: 'admin', label: 'Supplier Verification' },
      { id: 'admin-disputes', icon: 'invoice', label: 'Dispute Center' },
      { id: 'admin-analytics', icon: 'analytics', label: 'Global Analytics' }
    ]
  }
};

let currentRole = 'restaurant';
let currentPanel = 'r-dashboard';

function renderSidebar(role) {
  const c = sidebarConfig[role];
  const first = c.items[0].id;
  I('sidebar').innerHTML = `
    <a href="index.html" class="sidebar-logo">
      <div class="sidebar-logo-icon">P</div>
      <div><div class="sidebar-logo-text">ProcureIQ</div><div class="sidebar-logo-sub">${c.title}</div></div>
    </a>
    <nav style="flex:1;padding:8px 0;overflow-y:auto;">
      <div class="sidebar-section">Navigation</div>
      ${c.items.map((it, i) => `<div class="nav-item${i === 0 ? ' active' : ''}" onclick="showPanel('${it.id}')" data-panel="${it.id}">${svg(it.icon)}${it.label}</div>`).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="avatar" style="background:${c.gradient}">${c.avatar}</div>
      <div><div style="font-size:13px;font-weight:600">${c.name}</div><div style="font-size:11px;color:var(--fg-muted)">${c.subtitle}</div></div>
    </div>`;
}

function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  I(id).classList.add('active');
  const nav = document.querySelector(`.nav-item[data-panel="${id}"]`);
  if (nav) nav.classList.add('active');
  currentPanel = id;
  // Update topbar title
  const label = nav ? nav.textContent.trim() : 'Dashboard';
  document.querySelector('.top-title').textContent = label;
}

function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.role === role);
  });
  const sub = document.querySelector('.top-subtitle');
  if (role === 'restaurant') sub.textContent = 'Operations Overview — Al Barsha Kitchen Group';
  else if (role === 'supplier') sub.textContent = 'Sales Hub — Gulf Foods LLC';
  else if (role === 'sales') sub.textContent = 'Territory Overview — Dubai Marina & JBR';
  else sub.textContent = 'Platform Administration — ProcureIQ';
  renderSidebar(role);
  const first = sidebarConfig[role].items[0].id;
  showPanel(first);
}

// ─── PANEL CONTENT BUILDERS ──────────────────────────
function statCard(icon, color, label, val, badgeClass, badgeText, sub) {
  return `<div class="card anim"><div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div><div style="font-size:12px;font-weight:500;color:var(--fg-muted);margin-bottom:6px">${label}</div>
    <div class="stat-val">${val}</div>
    <div style="display:flex;align-items:center;gap:4px;margin-top:6px"><span class="badge ${badgeClass}">${badgeText}</span>${sub ? `<span style="font-size:11px;color:var(--fg-muted)">${sub}</span>` : ''}</div></div>
    <div class="icon-box" style="background:linear-gradient(135deg,${color}18,${color}08)">${icon}</div></div></div>`;
}

function tblRow(cols, gridCols) { return `<div class="tbl-row" style="grid-template-columns:${gridCols}">${cols.map(c => `<span>${c}</span>`).join('')}</div>`; }

// ─── RESTAURANT PANELS ──────────────────────────

function buildRestaurantDashboard() {
  const s = (c, sz) => `<svg width="${sz || 22}" height="${sz || 22}" fill="none" stroke="${c}" viewBox="0 0 24 24">`;
  return `<div class="g4 mb24">
    ${statCard(s('#3b82f6') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>', '#3b82f6', "Today's Orders", '47', 'b-green', '↑ 12%', 'vs last week')}
    ${statCard(s('#10b981') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1"/></svg>', '#10b981', 'Daily Spend', 'AED 34,820', 'b-green', '↓ 8% saved', 'by AI')}
    ${statCard(s('#8b5cf6') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', '#8b5cf6', 'Active Suppliers', '12', 'b-blue', '3 preferred', '')}
    ${statCard(s('#06b6d4') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707"/></svg>', '#06b6d4', 'AI Cart Accuracy', '94.2%', 'b-green', '↑ 2.3%', 'this month')}</div>
  <div class="g2 mb24">
    <div class="card"><div class="card-title"><span>📊 Monthly Spend Trend</span></div><canvas id="rSpendChart" height="180"></canvas></div>
    <div class="card"><div class="card-title"><span>🥧 Spend by Category</span></div><canvas id="rCatChart" height="180"></canvas></div>
  </div>`;
}

function buildSmartCart() {
  const gCols = '2fr 1.5fr 1fr 1fr 1fr';
  const items = [
    ['<b>Australian Beef Tenderloin</b>', 'Gulf Foods LLC', '25 kg', 'AED 2,375', '<span class="badge b-green">-AED 125</span>'],
    ['<b>Basmati Rice (Premium)</b>', 'Al Khaleej Trading', '100 kg', 'AED 850', '<span class="badge b-green">-AED 60</span>'],
    ['<b>Fresh Salmon Fillet</b>', 'SeaFresh Imports', '15 kg', 'AED 1,425', '<span class="badge b-green">-AED 90</span>'],
    ['<b>Olive Oil (Extra Virgin)</b>', 'Mediterranean Co.', '20 L', 'AED 680', '<span class="badge b-green">-AED 40</span>'],
    ['<b>Fryer Oil (Canola)</b>', 'Gulf Foods LLC', '50 L', 'AED 425', '<span class="badge b-blue">Bundle</span>']
  ];
  return `<div class="card mb24">
    <div class="card-title"><div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#2563eb);display:flex;align-items:center;justify-content:center">
      <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24">${icons.cart}</svg></div>
      <div><div style="font-weight:700">AI Smart Cart</div><div style="font-size:11px;color:var(--fg-muted)">Today's suggested order • Generated 6:00 AM</div></div></div>
      <span class="badge b-amber">⏳ Pending Approval</span></div>
    <div class="tbl mb16">
      <div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Item</span><span>Supplier</span><span>Qty</span><span>Price</span><span>Savings</span></div>
      ${items.map(r => tblRow(r, gCols)).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><span style="font-size:13px;color:var(--fg-muted)">Total: </span><span style="font-size:18px;font-weight:800">AED 5,755</span>
        <span class="badge b-green" style="margin-left:8px">Saving AED 315</span></div>
      <div style="display:flex;gap:8px"><button class="btn btn-outline">✏️ Edit</button><button class="btn btn-primary">✓ Approve Cart</button></div>
    </div>
    <div style="margin-top:12px;padding:10px 14px;background:rgba(59,130,246,.04);border:1px solid rgba(59,130,246,.1);border-radius:8px;font-size:12px;color:var(--accent)">
      ⏱️ <strong>30 seconds</strong> vs 45 min manual — <strong>98% time saved</strong></div>
  </div>
  <div class="card"><div class="card-title">📜 Previous Carts</div>
    <div class="tbl">${[
      ['Yesterday', 'AED 4,920', 'Approved', '<span class="badge b-green">✓</span>'],
      ['Feb 15', 'AED 6,100', 'Approved (edited)', '<span class="badge b-blue">✎</span>'],
      ['Feb 14', 'AED 5,340', 'Auto-approved', '<span class="badge b-purple">🤖</span>']
    ].map(r => tblRow(r, '1fr 1fr 1.5fr .5fr')).join('')}</div></div>`;
}

function buildMarketplaceRFQ() {
  const gCols = '1.5fr 1fr 1fr 1fr 1.5fr';
  const tools = `<div style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="btn btn-primary">+ Create New RFQ</button></div>`;
  const items = [
    ['<b>RFQ-902</b> (Seafood)', 'Active', '4 Quotes', 'Closes in 2h', '<button class="btn btn-outline" style="padding:4px 8px;font-size:11px">Compare Quotes</button>'],
    ['<b>RFQ-901</b> (Dairy)', 'Closed', '3 Quotes', 'Awarded', '<button class="btn" style="padding:4px 8px;font-size:11px" disabled>View PO</button>']
  ];

  const suppliers = [
    { n: 'Gulf Foods LLC', t: 'Meat & Poultry', r: '4.8 ★', min: 'AED 500 MOQ' },
    { n: 'SeaFresh Imports', t: 'Seafood', r: '4.6 ★', min: 'AED 300 MOQ' },
    { n: 'Desert Farms', t: 'Local Produce', r: '4.9 ★', min: 'AED 200 MOQ' },
    { n: 'Global Spices Co', t: 'Dry Goods', r: '4.5 ★', min: 'None' }
  ];

  return `${tools}
    <div class="card mb24"><div class="card-title">📨 Active RFQs</div>
      <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>RFQ ID / Category</span><span>Status</span><span>Responses</span><span>Time Left</span><span>Action</span></div>
      ${items.map(r => tblRow(r, gCols)).join('')}</div>
    </div>
    <div class="card"><div class="card-title">🏢 Discover Top Suppliers</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
        ${suppliers.map(s => `
          <div style="border:1px solid var(--border);border-radius:10px;padding:16px;background:var(--bg)">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">${s.n}</div>
            <div style="font-size:12px;color:var(--fg-muted)">${s.t}</div>
            <div style="display:flex;justify-content:space-between;margin-top:12px;font-size:11px;">
              <span style="color:#f59e0b;font-weight:600">${s.r}</span>
              <span style="color:var(--fg-muted)">${s.min}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function buildDeliveryTracking() {
  const t = [
    { t: '10:15 AM', d: 'Driver accepted route' },
    { t: '10:45 AM', d: 'Picked up from warehouse' },
    { t: '11:20 AM', d: 'En route to Al Barsha Kitchen' }
  ];

  return `<div class="g3 mb24">
    <div class="card" style="border-left:3px solid #10b981"><div style="font-size:11px;color:var(--fg-muted)">On Track</div><div class="stat-val">3</div></div>
    <div class="card" style="border-left:3px solid #f59e0b"><div style="font-size:11px;color:var(--fg-muted)">Delayed</div><div class="stat-val">1</div></div>
    <div class="card" style="border-left:3px solid #3b82f6"><div style="font-size:11px;color:var(--fg-muted)">Completed Today</div><div class="stat-val">4</div></div>
  </div>
  <div class="g2">
    <div class="card">
      <div class="card-title">🚚 Active Deliveries</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="border:1px solid #10b981;border-radius:10px;padding:14px;background:rgba(16,185,129,.05)">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-weight:700">PO-4890 (Gulf Foods)</span>
            <span class="badge b-green">ETA: 11:45 AM</span>
          </div>
          <div style="font-size:12px;color:var(--fg-muted);margin-bottom:12px">Driver: Tariq M. • +971 50 123 4567 • 5 Pallets</div>
          <div class="progress-bar"><div class="progress-fill" style="width:85%;background:#10b981"></div></div>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;padding:14px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-weight:700">PO-4892 (Deira Produce)</span>
            <span class="badge b-amber">ETA: 2:30 PM (Delayed)</span>
          </div>
          <div style="font-size:12px;color:var(--fg-muted);margin-bottom:12px">Driver: Khalid S. • Pending Pickup</div>
          <div class="progress-bar"><div class="progress-fill" style="width:20%;background:#f59e0b"></div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📍 Live Tracking (PO-4890)</div>
      <div style="display:flex;flex-direction:column;gap:14px;position:relative;padding-left:16px;">
        <div style="position:absolute;left:4px;top:8px;bottom:8px;width:2px;background:var(--border)"></div>
        ${t.map((s, i) => `
          <div style="position:relative">
            <div style="position:absolute;left:-17px;top:2px;width:10px;height:10px;border-radius:50%;background:${i === t.length - 1 ? '#10b981' : 'var(--fg-subtle)'};border:2px solid var(--bg)"></div>
            <div style="font-size:12px;font-weight:600">${s.t}</div>
            <div style="font-size:12px;color:var(--fg-muted)">${s.d}</div>
          </div>
        `).join('')}
        <div style="position:relative;opacity:0.5">
          <div style="position:absolute;left:-17px;top:2px;width:10px;height:10px;border-radius:50%;background:var(--border);border:2px solid var(--bg)"></div>
          <div style="font-size:12px;font-weight:600">Expected: 11:45 AM</div>
          <div style="font-size:12px;color:var(--fg-muted)">Arrival at Al Barsha Kitchen</div>
        </div>
      </div>
      <button class="btn btn-outline" style="width:100%;margin-top:20px">View Map Driver Details</button>
    </div>
  </div>`;
}

function buildOrders() {
  const gCols = '1fr 1.5fr 0.8fr 1fr 1fr';
  const rows = [
    ['<b>ORD-4721</b>', 'Gulf Foods LLC', '5 items', 'AED 2,800', '<span class="badge b-green">Delivered</span>'],
    ['<b>ORD-4720</b>', 'SeaFresh Imports', '3 items', 'AED 1,425', '<span class="badge b-blue">In Transit</span>'],
    ['<b>ORD-4719</b>', 'Al Khaleej Trading', '4 items', 'AED 1,250', '<span class="badge b-purple">Confirmed</span>'],
    ['<b>ORD-4718</b>', 'Mediterranean Co.', '2 items', 'AED 680', '<span class="badge b-amber">Pending</span>'],
    ['<b>ORD-4717</b>', 'Gulf Foods LLC', '6 items', 'AED 3,450', '<span class="badge b-green">Matched ✓</span>'],
    ['<b>ORD-4716</b>', 'SeaFresh Imports', '2 items', 'AED 980', '<span class="badge b-green">Delivered</span>'],
    ['<b>ORD-4715</b>', 'Al Khaleej Trading', '3 items', 'AED 1,120', '<span class="badge b-green">Matched ✓</span>']
  ];
  return `<div class="g4 mb24">
    <div class="card" style="border-left:3px solid #f59e0b"><div style="font-size:11px;color:var(--fg-muted)">Pending</div><div class="stat-val">3</div></div>
    <div class="card" style="border-left:3px solid #8b5cf6"><div style="font-size:11px;color:var(--fg-muted)">Confirmed</div><div class="stat-val">8</div></div>
    <div class="card" style="border-left:3px solid #3b82f6"><div style="font-size:11px;color:var(--fg-muted)">In Transit</div><div class="stat-val">12</div></div>
    <div class="card" style="border-left:3px solid #10b981"><div style="font-size:11px;color:var(--fg-muted)">Delivered</div><div class="stat-val">24</div></div>
  </div>
  <div class="card"><div class="card-title">All Orders <button class="btn btn-primary" style="font-size:12px">+ New Order</button></div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Order</span><span>Supplier</span><span>Items</span><span>Total</span><span>Status</span></div>
    ${rows.map(r => tblRow(r, gCols)).join('')}</div></div>`;
}

function buildInventory() {
  const alerts = [
    { item: 'Fresh Salmon Fillet', detail: '2 kg left • Reorder point: 10 kg', color: '#ef4444', border: 'rgba(239,68,68,.2)', bg: 'rgba(239,68,68,.03)', btn: 'Reorder Now', btnC: '#dc2626' },
    { item: 'Chicken Breast (Halal)', detail: '8 kg left • Predicted stockout: Tomorrow', color: '#f59e0b', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.03)', btn: 'Reorder', btnC: '#d97706' },
    { item: 'Mozzarella Cheese', detail: '5 kg left • Expires in 3 days', color: '#f59e0b', border: 'rgba(245,158,11,.2)', bg: 'rgba(245,158,11,.03)', btn: 'Use First', btnC: '#d97706' },
    { item: 'Basmati Rice', detail: '45 kg left • AI reorder scheduled Tue', color: '#3b82f6', border: 'rgba(59,130,246,.15)', bg: 'rgba(59,130,246,.03)', btn: 'Auto', btnC: '#2563eb' },
  ];
  const stock = [
    ['Australian Beef Tenderloin', '18 kg', '25 kg', '72%', '#10b981'], ['Basmati Rice', '45 kg', '100 kg', '45%', '#f59e0b'],
    ['Olive Oil', '14 L', '20 L', '70%', '#10b981'], ['Fryer Oil', '32 L', '50 L', '64%', '#3b82f6'],
    ['Fresh Vegetables', '12 kg', '30 kg', '40%', '#f59e0b'], ['Saffron', '200 g', '500 g', '40%', '#ef4444']
  ];
  return `<div class="g2 mb24">
    <div class="card"><div class="card-title">🔔 Alerts (${alerts.length})</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${alerts.map(a => `<div class="alert-item" style="border:1px solid ${a.border};background:${a.bg}">
          <div style="display:flex;align-items:center;gap:10px"><div class="alert-dot" style="background:${a.color}"></div>
            <div><div style="font-size:13px;font-weight:600">${a.item}</div><div style="font-size:11px;color:var(--fg-muted)">${a.detail}</div></div></div>
          <button class="btn" style="background:${a.bg};border:1px solid ${a.border};color:${a.btnC}">${a.btn}</button></div>`).join('')}
      </div></div>
    <div class="card"><div class="card-title">📦 Stock Levels</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${stock.map(s => `<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span style="font-weight:600">${s[0]}</span><span style="color:var(--fg-muted)">${s[1]} / ${s[2]}</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${s[3]};background:${s[4]}"></div></div></div>`).join('')}
      </div></div>
  </div>`;
}

function buildInvoicesMatch() {
  return `<div class="g3 mb24">
    <div class="card" style="text-align:center"><div style="font-size:28px;font-weight:800;color:#059669">38</div><div style="font-size:12px;color:#059669;font-weight:500">Approved</div></div>
    <div class="card" style="text-align:center"><div style="font-size:28px;font-weight:800;color:#d97706">5</div><div style="font-size:12px;color:#d97706;font-weight:500">Flagged</div></div>
    <div class="card" style="text-align:center"><div style="font-size:28px;font-weight:800;color:#dc2626">2</div><div style="font-size:12px;color:#dc2626;font-weight:500">Blocked</div></div>
  </div>
  <div class="card"><div class="card-title">🔗 3-Way Match (PO ↔ GRN ↔ Invoice)</div>
    <div style="display:flex;flex-direction:column;gap:8px">${[
      { po: 'PO-0892', sup: 'Gulf Foods → Beef Tenderloin', badge: 'b-green', text: '✓ Matched' },
      { po: 'PO-0889', sup: 'SeaFresh → Salmon', badge: 'b-amber', text: '⚠ Qty ±3%' },
      { po: 'PO-0885', sup: 'Al Khaleej → Rice', badge: 'b-red', text: '✗ Missing Item' },
      { po: 'PO-0881', sup: 'Mediterranean → Olive Oil', badge: 'b-green', text: '✓ Matched' },
      { po: 'PO-0878', sup: 'Gulf Foods → Fryer Oil', badge: 'b-green', text: '✓ Matched' },
    ].map(m => `<div style="padding:10px 12px;border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:space-between">
      <div><span style="font-size:12px;font-weight:600">${m.po}</span><span style="font-size:11px;color:var(--fg-muted);margin-left:6px">${m.sup}</span></div>
      <span class="badge ${m.badge}">${m.text}</span></div>`).join('')}
    </div></div>`;
}

function buildSuppliersPanel() {
  const sups = [
    { name: 'Gulf Foods LLC', cat: 'Meat & Oils', tier: 'Tier 1 Preferred', score: 92, badge: 'b-green', tag: '★ Preferred', color: '#059669', p: 88, q: 95, s: 91, f: 96 },
    { name: 'SeaFresh Imports', cat: 'Seafood', tier: 'Tier 2', score: 85, badge: 'b-blue', tag: 'Historical', color: '#2563eb', p: 82, q: 90, s: 78, f: 88 },
    { name: 'Al Khaleej Trading', cat: 'Dry Goods', tier: 'Tier 2', score: 71, badge: 'b-amber', tag: 'Under Review', color: '#d97706', p: 90, q: 68, s: 65, f: 72 },
    { name: 'Mediterranean Co.', cat: 'Oils & Condiments', tier: 'Tier 2', score: 80, badge: 'b-blue', tag: 'Approved', color: '#2563eb', p: 85, q: 82, s: 80, f: 84 },
  ];
  function bar(label, val, color) { return `<div><div style="font-size:10px;color:var(--fg-muted);margin-bottom:2px">${label}</div><div class="progress-bar"><div class="progress-fill" style="width:${val}%;background:${color}"></div></div></div>`; }
  return `<div style="display:flex;flex-direction:column;gap:16px">${sups.map(s => `<div class="card">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div class="score-ring" style="background:linear-gradient(135deg,${s.color}24,${s.color}08);color:${s.color}">${s.score}</div>
      <div style="flex:1"><div style="font-size:14px;font-weight:600">${s.name}</div><div style="font-size:11px;color:var(--fg-muted)">${s.cat} • ${s.tier}</div></div>
      <span class="badge ${s.badge}">${s.tag}</span></div>
    <div class="g4">${bar('Price', s.p, '#3b82f6')}${bar('Quality', s.q, '#10b981')}${bar('SLA', s.s, '#8b5cf6')}${bar('Fill Rate', s.f, '#06b6d4')}</div>
  </div>`).join('')}</div>`;
}

function buildRestaurantAnalytics() {
  return `<div class="g2 mb24">
    <div class="card"><div class="card-title">💰 Weekly Savings</div><canvas id="rSavingsChart" height="200"></canvas></div>
    <div class="card"><div class="card-title">📈 AI Performance</div>
      <div style="display:flex;flex-direction:column;gap:14px;padding:10px 0">
        ${[['Cart Acceptance Rate', '89%', 89, '#3b82f6'], ['Price Beat %', '73%', 73, '#10b981'], ['Prediction Accuracy', '94%', 94, '#8b5cf6'], ['Fill Rate Improvement', '12% ↑', 67, '#06b6d4']].map(r =>
    `<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span style="font-weight:600">${r[0]}</span><span style="font-weight:700;color:${r[3]}">${r[1]}</span></div>
          <div class="progress-bar"><div class="progress-fill" style="width:${r[2]}%;background:${r[3]}"></div></div></div>`).join('')}
      </div></div>
  </div>`;
}

function buildWasteInsights() {
  const gCols = '1.5fr 1fr 1.5fr 1fr';
  const wasteLog = [
    ['Salmon Fillet', 'Expired', 'Prep error (over-portioned)', '2 kg (AED 190)'],
    ['Milk 2L', 'Spoilage', 'Left out of chiller', '6L (AED 45)'],
    ['Tomatoes', 'Quality Control', 'Arrived bruised', '4 kg (AED 32)']
  ];

  return `<div class="g4 mb24">
    ${statCard(svg('waste'), '#ef4444', 'Wasted Today', 'AED 267', 'b-red', '↑ 12%', 'vs avg')}
    ${statCard(svg('analytics'), '#f59e0b', 'Monthly Variance', '4.2%', 'b-amber', 'Target: < 3%', '')}
    ${statCard(svg('inventory'), '#3b82f6', 'Near Expiry Value', 'AED 1,200', 'b-blue', 'Action needed', '')}
    ${statCard(svg('pricing'), '#10b981', 'AI Saved Waste', 'AED 450', 'b-green', 'Predicted stockouts', '')}
  </div>
  <div class="g2 mb24">
    <div class="card"><div class="card-title">📈 Variance Trend (Theo vs Actual)</div><canvas id="rVarianceChart" height="200"></canvas></div>
    <div class="card">
      <div class="card-title">🤖 AI Corrective Actions</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="padding:14px;border:1px solid var(--border);border-radius:10px;background:#fefce8;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-weight:700;font-size:13px">Excess Salmon Fillet (3 days left)</span>
            <span class="badge b-amber">Urgent</span>
          </div>
          <div style="font-size:12px;color:var(--fg-muted);margin-bottom:10px">Recommendation: Run 'Salmon Special' promotion or adjust prep plan.</div>
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Push to POS Specials</button>
        </div>
        <div style="padding:14px;border:1px solid var(--border);border-radius:10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-weight:700;font-size:13px">Tomato Bruising Anomaly</span>
            <span class="badge b-blue">Insight</span>
          </div>
          <div style="font-size:12px;color:var(--fg-muted);margin-bottom:10px">Supplier 'Deira Produce' has 15% higher receiving waste. Compare alternatives.</div>
          <button class="btn btn-outline" style="font-size:11px;padding:4px 8px">View Supplier Alts</button>
        </div>
      </div>
    </div>
  </div>
  <div class="card"><div class="card-title">🗑️ Recent Waste Log <button class="btn btn-primary" style="font-size:12px;margin-left:auto">+ Log Waste</button></div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Item</span><span>Code</span><span>Reason Details</span><span>Value</span></div>
    ${wasteLog.map(r => tblRow([r[0], `<span class="badge b-amber">${r[1]}</span>`, `<span style="font-size:12px;color:var(--fg-muted)">${r[2]}</span>`, `<span style="font-weight:600">${r[3]}</span>`], gCols)).join('')}</div>
  </div>`;
}

function buildKitchenCopilot() {
  const prep = [
    ['Marinate Chicken Breast', '20kg', 'Priority: High', 'b-red'],
    ['Defrost Salmon', '15kg', 'Priority: Medium', 'b-amber'],
    ['Chop Onions', '10kg', 'Priority: Low', 'b-blue']
  ];
  const surplus = [
    ['Spicy Salmon Bites', 'Uses 2kg excess Salmon', 'High Margin'],
    ['Chicken Soup', 'Uses 3kg chicken cuts', 'Good Value']
  ];
  return `<div class="g2 mb24">
    <div class="card"><div class="card-title">👨‍🍳 Daily Prep Plan (FIFO)</div>
      <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:2fr 1fr 1fr"><span>Task</span><span>Qty</span><span>Priority</span></div>
      ${prep.map(p => tblRow([p[0], p[1], `<span class="badge ${p[3]}">${p[2]}</span>`], '2fr 1fr 1fr')).join('')}</div>
      <div style="margin-top:16px"><div class="card-title">💡 Surplus Recipe Ideas</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${surplus.map(s => `<div style="padding:10px;border:1px dashed var(--border);border-radius:8px;display:flex;justify-content:space-between">
            <div><span style="font-weight:600;font-size:13px">${s[0]}</span><span style="font-size:11px;color:var(--fg-muted);margin-left:8px">${s[1]}</span></div>
            <span class="badge b-green">${s[2]}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card"><div class="card-title">📊 7-Day Demand Forecast</div><canvas id="rForecastChart" height="250"></canvas></div>
  </div>`;
}

// ─── SUPPLIER PANELS ──────────────────────────

function buildSupplierDashboard() {
  const s = (c) => `<svg width="22" height="22" fill="none" stroke="${c}" viewBox="0 0 24 24">`;
  return `<div class="g4 mb24">
    ${statCard(s('#f59e0b') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>', '#f59e0b', 'Incoming POs', '23', 'b-green', '↑ 18%', 'vs last week')}
    ${statCard(s('#10b981') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v1"/></svg>', '#10b981', 'Weekly Revenue', 'AED 142,500', 'b-green', '↑ 22%', 'YoY')}
    ${statCard(s('#3b82f6') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"/></svg>', '#3b82f6', 'Active Restaurants', '18', 'b-blue', '5 new this month', '')}
    ${statCard(s('#8b5cf6') + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', '#8b5cf6', 'Fill Rate', '96.8%', 'b-green', '↑ 1.2%', 'this month')}</div>
  <div class="g2 mb24">
    <div class="card"><div class="card-title"><span>📈 Revenue Trend</span></div><canvas id="sRevenueChart" height="180"></canvas></div>
    <div class="card"><div class="card-title"><span>🏷️ Top Products</span></div><canvas id="sProductChart" height="180"></canvas></div>
  </div>`;
}

function buildIncomingPOs() {
  const gCols = '1fr 1.5fr 0.8fr 1fr 1.2fr';
  const rows = [
    ['<b>PO-4892</b>', 'Al Barsha Kitchen', '8 items', 'AED 4,200', '<div style="display:flex;gap:6px"><button class="btn btn-primary" onclick="this.textContent=\'Confirmed ✓\';this.disabled=true">Confirm</button><button class="btn btn-outline">Negotiate</button></div>'],
    ['<b>PO-4891</b>', 'Dubai Marina Bistro', '5 items', 'AED 2,100', '<div style="display:flex;gap:6px"><button class="btn btn-primary" onclick="this.textContent=\'Confirmed ✓\';this.disabled=true">Confirm</button><button class="btn btn-outline">Negotiate</button></div>'],
    ['<b>PO-4890</b>', 'JBR Seaside Grill', '3 items', 'AED 1,850', '<span class="badge b-green">✓ Confirmed</span>'],
    ['<b>PO-4889</b>', 'Deira Foodhall', '6 items', 'AED 3,400', '<span class="badge b-green">✓ Confirmed</span>'],
    ['<b>PO-4888</b>', 'Al Barsha Kitchen', '4 items', 'AED 2,750', '<span class="badge b-blue">📦 Shipped</span>'],
    ['<b>PO-4887</b>', 'Marina Bay Restaurant', '2 items', 'AED 980', '<span class="badge b-green">✓ Delivered</span>'],
  ];
  return `<div class="g3 mb24">
    <div class="card" style="border-left:3px solid #f59e0b"><div style="font-size:11px;color:var(--fg-muted)">Awaiting Confirm</div><div class="stat-val">2</div></div>
    <div class="card" style="border-left:3px solid #3b82f6"><div style="font-size:11px;color:var(--fg-muted)">In Fulfillment</div><div class="stat-val">8</div></div>
    <div class="card" style="border-left:3px solid #10b981"><div style="font-size:11px;color:var(--fg-muted)">Completed</div><div class="stat-val">13</div></div>
  </div>
  <div class="card"><div class="card-title">Incoming Purchase Orders</div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>PO #</span><span>Restaurant</span><span>Items</span><span>Value</span><span>Action</span></div>
    ${rows.map(r => tblRow(r, gCols)).join('')}</div></div>`;
}

function buildCatalogManagement() {
  const gCols = '1.5fr 1fr 1fr .8fr .8fr 1fr';
  const tools = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><input type="text" class="input" placeholder="Search products..." style="width:250px"><button class="btn btn-primary">+ Add Product</button></div>`;
  const products = [
    ['Premium Beef Tenderloin', 'Meat', 'AED 95.00/kg', 'b-green', 'In Stock (450kg)', '<button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button>'],
    ['Fresh Atlantic Salmon', 'Seafood', 'AED 82.50/kg', 'b-green', 'In Stock (120kg)', '<button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button>'],
    ['Basmati Rice (Gold)', 'Dry Goods', 'AED 8.50/kg', 'b-amber', 'Low Stock (50kg)', '<button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button>'],
    ['Olive Oil Extra Virgin', 'Oils', 'AED 34.00/L', 'b-green', 'In Stock (200L)', '<button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button>'],
    ['Yellow Onions', 'Vegetables', 'AED 4.50/kg', 'b-red', 'Out of Stock', '<button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button>']
  ];
  return `${tools}
    <div class="card mb24"><div class="card-title">📖 Product Catalog</div>
      <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Product Name</span><span>Category</span><span>Base Price</span><span>Status</span><span>Inventory</span><span>Action</span></div>
      ${products.map(r => tblRow([`<b>${r[0]}</b>`, r[1], r[2], `<span class="badge ${r[3]}">${r[4].split(' ')[0]} ${r[4].split(' ')[1] || ''}</span>`, `<span style="font-size:12px;color:var(--fg-muted)">${r[4]}</span>`, r[5]], gCols)).join('')}</div>
    </div>`;
}

function buildPricingAgent() {
  const metrics = [['Quotes Sent Today', '34', 'b-blue'], ['Win Rate', '68%', 'b-green'], ['Avg Margin', '24.5%', 'b-purple'], ['Competitive Wins', '12', 'b-green']];
  const logs = [
    { time: '10:42 AM', action: 'Auto-quoted Beef Tenderloin @ AED 95/kg', result: 'Won vs competitor (AED 98/kg)', badge: 'b-green', tag: '✓ Won' },
    { time: '10:15 AM', action: 'Price-matched Salmon Fillet @ AED 92/kg', result: 'Pending restaurant response', badge: 'b-amber', tag: '⏳ Pending' },
    { time: '09:58 AM', action: 'Bundle offer: Beef + Fryer Oil for Al Barsha', result: 'Bundle accepted — 15% margin', badge: 'b-green', tag: '✓ Won' },
    { time: '09:30 AM', action: 'Rejected low-margin Chicken quote', result: 'Below 18% floor — skipped', badge: 'b-red', tag: '✗ Skipped' },
    { time: '09:12 AM', action: 'Flash deal priced Mozzarella @ AED 28/kg', result: '3 restaurants matched', badge: 'b-blue', tag: '🔥 Flash' },
  ];
  return `<div class="g4 mb24">${metrics.map(m => `<div class="card"><div style="font-size:11px;color:var(--fg-muted)">${m[0]}</div><div class="stat-val">${m[1]}</div></div>`).join('')}</div>
  <div class="card"><div class="card-title">🤖 AI Agent Activity Log</div>
    <div style="display:flex;flex-direction:column;gap:10px">${logs.map(l => `<div style="padding:12px 14px;border:1px solid var(--border);border-radius:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><span style="font-size:12px;font-weight:600">${l.action}</span><span class="badge ${l.badge}">${l.tag}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="font-size:11px;color:var(--fg-muted)">${l.result}</span><span style="font-size:11px;color:var(--fg-muted)">${l.time}</span></div>
    </div>`).join('')}</div></div>`;
}

function buildFlashDeals() {
  const deals = [
    { item: 'Mozzarella Cheese', orig: 'AED 35/kg', flash: 'AED 28/kg', qty: '50 kg', exp: '2 days', matched: 3, total: 5 },
    { item: 'Atlantic Cod Fillet', orig: 'AED 72/kg', flash: 'AED 58/kg', qty: '30 kg', exp: '1 day', matched: 2, total: 4 },
    { item: 'Organic Tomatoes', orig: 'AED 8/kg', flash: 'AED 5/kg', qty: '100 kg', exp: '3 days', matched: 5, total: 5 },
  ];
  return `<div class="card mb24"><div class="card-title">🔥 Active Flash Deals <button class="btn btn-primary">+ Create Deal</button></div>
    <div style="display:flex;flex-direction:column;gap:14px">${deals.map(d => `<div style="padding:16px;border:1px solid rgba(245,158,11,.2);background:rgba(245,158,11,.02);border-radius:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div><span style="font-size:15px;font-weight:700">${d.item}</span><span class="badge b-amber" style="margin-left:8px">Expires in ${d.exp}</span></div>
        <div style="font-size:13px"><s style="color:var(--fg-muted)">${d.orig}</s> → <b style="color:#059669">${d.flash}</b></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--fg-muted)">Available: ${d.qty} • Matched ${d.matched}/${d.total} restaurants</span>
        <div class="progress-bar" style="width:120px"><div class="progress-fill" style="width:${(d.matched / d.total) * 100}%;background:#f59e0b"></div></div></div>
    </div>`).join('')}</div></div>`;
}

function buildOrdersDispatch() {
  const gCols = '1fr 1.5fr .8fr 1fr 1fr';
  const picks = [
    ['PO-4890', 'JBR Seaside Grill', '3 items', 'Zone A', '<span class="badge b-green">✓ Picked</span>'],
    ['PO-4889', 'Deira Foodhall', '6 items', 'Zone B', '<span class="badge b-blue">▶ Picking</span>'],
    ['PO-4891', 'Dubai Marina Bistro', '5 items', 'Zone A', '<span class="badge b-amber">Pending</span>']
  ];
  return `<div class="g4 mb24">
    <div class="card" style="border-left:3px solid #3b82f6"><div style="font-size:11px;color:var(--fg-muted)">To Dispatch Today</div><div class="stat-val">12</div></div>
    <div class="card" style="border-left:3px solid #f59e0b"><div style="font-size:11px;color:var(--fg-muted)">In Picking</div><div class="stat-val">4</div></div>
    <div class="card" style="border-left:3px solid #10b981"><div style="font-size:11px;color:var(--fg-muted)">On Route</div><div class="stat-val">5</div></div>
    <div class="card" style="border-left:3px solid #8b5cf6"><div style="font-size:11px;color:var(--fg-muted)">Delivered</div><div class="stat-val">3</div></div>
  </div>
  <div class="g2">
    <div class="card"><div class="card-title">📋 Active Picking List</div>
      <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Order</span><span>Customer</span><span>Size</span><span>Location</span><span>Status</span></div>
      ${picks.map(p => tblRow(p, gCols)).join('')}</div>
    </div>
    <div class="card"><div class="card-title">🚚 Delivery Schedule & POD</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-weight:700">Driver: Tariq M.</div><div style="font-size:12px;color:var(--fg-muted)">Zone A (Marina / JBR) • 4 Drops</div></div>
          <span class="badge b-blue">En Route (Next: JBR)</span>
        </div>
        <div style="border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-weight:700">Driver: Khalid S.</div><div style="font-size:12px;color:var(--fg-muted)">Zone B (Deira / Bur Dubai) • 2 Drops</div></div>
          <span class="badge b-amber">Loading Dock</span>
        </div>
        <div style="margin-top:12px"><button class="btn btn-outline" style="width:100%">Scan Proof of Delivery (POD)</button></div>
      </div>
    </div>
  </div>`;
}

function buildCustomers() {
  const custs = [
    { name: 'Al Barsha Kitchen Group', spend: 'AED 48,200/mo', orders: 47, tier: 'Gold', badge: 'b-amber', freq: 'Daily', churn: '🟢 Stable' },
    { name: 'Dubai Marina Bistro', spend: 'AED 22,500/mo', orders: 28, tier: 'Silver', badge: 'b-blue', freq: '3x/week', churn: '🟡 Watch (↓ orders)' },
    { name: 'JBR Seaside Grill', spend: 'AED 18,900/mo', orders: 22, tier: 'Silver', badge: 'b-blue', freq: '3x/week', churn: '🟢 Stable' },
    { name: 'Deira Foodhall', spend: 'AED 31,000/mo', orders: 35, tier: 'Gold', badge: 'b-amber', freq: 'Daily', churn: '🟢 Stable' },
    { name: 'Marina Bay Restaurant', spend: 'AED 12,400/mo', orders: 15, tier: 'Bronze', badge: 'b-purple', freq: '2x/week', churn: '🔴 At Risk (No orders 7d)' },
  ];
  const gCols = '1.8fr 1.2fr .8fr .8fr 1fr 1fr';
  return `<div class="card"><div class="card-title">🏢 Restaurant Customers</div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Restaurant</span><span>Monthly Spend</span><span>Orders</span><span>Tier</span><span>Frequency</span><span>Risk</span></div>
    ${custs.map(c => tblRow([`<b>${c.name}</b>`, c.spend, c.orders, `<span class="badge ${c.badge}">${c.tier}</span>`, c.freq, `<span style="font-size:12px">${c.churn}</span>`], gCols)).join('')}</div></div>`;
}

function buildSupplierInvoices() {
  const gCols = '1fr 1.5fr 1fr .8fr 1fr';
  const rows = [
    ['<b>INV-2024-341</b>', 'Al Barsha Kitchen', 'AED 4,200', 'Feb 17', '<span class="badge b-green">Paid</span>'],
    ['<b>INV-2024-340</b>', 'Dubai Marina Bistro', 'AED 2,100', 'Feb 16', '<span class="badge b-amber">Due in 7d</span>'],
    ['<b>INV-2024-339</b>', 'JBR Seaside Grill', 'AED 1,850', 'Feb 15', '<span class="badge b-amber">Due in 5d</span>'],
    ['<b>INV-2024-338</b>', 'Deira Foodhall', 'AED 3,400', 'Feb 14', '<span class="badge b-green">Paid</span>'],
    ['<b>INV-2024-337</b>', 'Al Barsha Kitchen', 'AED 2,750', 'Feb 13', '<span class="badge b-red">Overdue</span>'],
  ];
  return `<div class="g3 mb24">
    <div class="card"><div style="font-size:11px;color:var(--fg-muted)">Outstanding</div><div class="stat-val" style="color:#d97706">AED 6,700</div></div>
    <div class="card"><div style="font-size:11px;color:var(--fg-muted)">Collected (MTD)</div><div class="stat-val" style="color:#059669">AED 89,400</div></div>
    <div class="card"><div style="font-size:11px;color:var(--fg-muted)">Avg DSO</div><div class="stat-val">12 days</div></div>
  </div>
  <div class="card"><div class="card-title">E-Invoices <button class="btn btn-primary">+ Generate Invoice</button></div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Invoice</span><span>Restaurant</span><span>Amount</span><span>Date</span><span>Status</span></div>
    ${rows.map(r => tblRow(r, gCols)).join('')}</div></div>`;
}

function buildSupplierAnalytics() {
  return `<div class="g2 mb24">
    <div class="card"><div class="card-title">📈 Quote Win Rate</div><canvas id="sWinChart" height="200"></canvas></div>
    <div class="card"><div class="card-title">📊 Revenue by Customer</div><canvas id="sCustChart" height="200"></canvas></div>
  </div>`;
}

function buildCollectionsAgent() {
  const tasks = [
    ['JBR Seaside Grill', 'Overdue 5 days', 'Start Sequence', 'b-red'],
    ['Dubai Marina Bistro', 'Due tomorrow', 'Send Reminder', 'b-amber'],
    ['Deira Foodhall', 'Payment Promised', 'Verify Receipt', 'b-blue']
  ];
  return `<div class="card"><div class="card-title">💳 Collections Agent</div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:2fr 1fr 1.5fr"><span>Customer</span><span>Status</span><span>Action</span></div>
    ${tasks.map(t => tblRow([t[0], `<span class="badge ${t[3]}">${t[1]}</span>`, `<button class="btn btn-primary">${t[2]}</button>`], '2fr 1fr 1.5fr')).join('')}</div></div>`;
}

// ─── SALES REP PANELS ──────────────────────────

// Territory map account data
const salesTerritoryAccounts = [
  { lat: 25.0800, lng: 55.1344, name: 'Dubai Marina Bistro', status: 'active', spend: 'AED 22,500/mo', orders: 28 },
  { lat: 25.0762, lng: 55.1392, name: 'JBR Seaside Grill', status: 'hot-lead', spend: 'AED 18,900/mo', orders: 22 },
  { lat: 25.0850, lng: 55.1410, name: 'Marina Bay Restaurant', status: 'active', spend: 'AED 12,400/mo', orders: 15 },
  { lat: 25.0720, lng: 55.1325, name: 'The Walk Café', status: 'hot-lead', spend: 'AED 8,200/mo', orders: 10 },
  { lat: 25.0890, lng: 55.1480, name: 'Al Sufouh Kitchen', status: 'at-risk', spend: 'AED 5,600/mo', orders: 6 },
  { lat: 25.0830, lng: 55.1300, name: 'Porto Arabia Deli', status: 'active', spend: 'AED 15,800/mo', orders: 19 },
  { lat: 25.0775, lng: 55.1450, name: 'Bluewaters Grill', status: 'active', spend: 'AED 31,000/mo', orders: 35 },
  { lat: 25.0700, lng: 55.1380, name: 'Palm View Lounge', status: 'hot-lead', spend: 'AED 9,400/mo', orders: 8 },
  { lat: 25.0860, lng: 55.1350, name: 'Harbour Kitchen', status: 'active', spend: 'AED 19,200/mo', orders: 24 },
  { lat: 25.0740, lng: 55.1290, name: 'Sunset Terrace', status: 'at-risk', spend: 'AED 4,100/mo', orders: 4 },
  { lat: 25.0815, lng: 55.1420, name: 'Marina Promenade Eats', status: 'active', spend: 'AED 27,600/mo', orders: 32 },
  { lat: 25.0785, lng: 55.1310, name: 'Ocean Heights Bistro', status: 'hot-lead', spend: 'AED 6,700/mo', orders: 7 },
  { lat: 25.0870, lng: 55.1370, name: 'Al Emreef Grill', status: 'active', spend: 'AED 14,300/mo', orders: 17 },
  { lat: 25.0755, lng: 55.1360, name: 'The Sand Lounge', status: 'at-risk', spend: 'AED 3,800/mo', orders: 3 },
  { lat: 25.0840, lng: 55.1440, name: 'Pier 7 Seafood', status: 'active', spend: 'AED 25,100/mo', orders: 29 },
  { lat: 25.0810, lng: 55.1280, name: 'Sky Tower Kitchen', status: 'hot-lead', spend: 'AED 11,500/mo', orders: 12 },
];

const mapStatusConfig = {
  'active': { color: '#3b82f6', fillColor: '#3b82f6', label: 'Active Account', radius: 8 },
  'hot-lead': { color: '#f59e0b', fillColor: '#f59e0b', label: 'Hot Lead', radius: 10 },
  'at-risk': { color: '#ef4444', fillColor: '#ef4444', label: 'At-Risk', radius: 9 }
};

function initTerritoryMap(containerId, accounts, height) {
  setTimeout(() => {
    const container = document.getElementById(containerId);
    if (!container || container._leaflet_id) return;
    const map = L.map(containerId, { scrollWheelZoom: true, zoomControl: true }).setView([25.0800, 55.1370], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    accounts.forEach(a => {
      const cfg = mapStatusConfig[a.status];
      const marker = L.circleMarker([a.lat, a.lng], {
        radius: cfg.radius, fillColor: cfg.fillColor, color: '#fff',
        weight: 2, opacity: 1, fillOpacity: 0.85
      }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px">${a.name}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${cfg.fillColor}"></span>
            <span style="font-size:11px;font-weight:600;color:${cfg.fillColor}">${cfg.label}</span>
          </div>
          <div style="font-size:12px;color:#687076;margin-top:4px">
            <div><strong>Monthly Spend:</strong> ${a.spend}</div>
            <div><strong>Orders:</strong> ${a.orders}/month</div>
          </div>
        </div>
      `, { className: 'territory-popup' });
      // Pulse animation for hot-leads
      if (a.status === 'hot-lead') {
        L.circleMarker([a.lat, a.lng], {
          radius: cfg.radius + 6, fillColor: cfg.fillColor, color: cfg.fillColor,
          weight: 1, opacity: 0.3, fillOpacity: 0.15
        }).addTo(map);
      }
    });

    // Legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'territory-legend');
      div.innerHTML = `
        <div style="background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border:1px solid #E6E8EB;border-radius:10px;padding:10px 14px;font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.08)">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#889096;margin-bottom:6px">Legend</div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#3b82f6"></span><span style="font-size:11px;font-weight:500">Active (${accounts.filter(a => a.status === 'active').length})</span></div>
            <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#f59e0b"></span><span style="font-size:11px;font-weight:500">Hot Lead (${accounts.filter(a => a.status === 'hot-lead').length})</span></div>
            <div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#ef4444"></span><span style="font-size:11px;font-weight:500">At-Risk (${accounts.filter(a => a.status === 'at-risk').length})</span></div>
          </div>
        </div>`;
      return div;
    };
    legend.addTo(map);
    setTimeout(() => map.invalidateSize(), 200);
  }, 150);
}

function buildSalesDashboard() {
  return `<div class="g4 mb24">
    ${statCard(svg('analytics'), '#ec4899', 'My Commission', 'AED 12,450', 'b-green', '↑ 15%', 'this month')}
    ${statCard(svg('orders'), '#8b5cf6', 'AI-Closed Deals', '42', 'b-purple', '65% of total', '')}
    ${statCard(svg('suppliers'), '#3b82f6', 'Active Accounts', '28', 'b-blue', '100% retention', '')}
    ${statCard(svg('flash'), '#f59e0b', 'Interventions', '3', 'b-amber', 'This week', '')}</div>
    <div class="card mb24"><div class="card-title"><span>🗺️ Territory Pulse — Dubai Marina & JBR</span>
      <div style="display:flex;gap:6px">
        <span class="badge b-blue">28 Accounts</span>
        <span class="badge b-amber">5 Hot Leads</span>
        <span class="badge b-red">3 At-Risk</span>
      </div>
    </div>
    <div id="salesDashMap" style="height:340px;border-radius:12px;overflow:hidden;border:1px solid var(--border);z-index:1;position:relative"></div>
    </div>`;
}

function buildSalesTerritory() {
  return `<div class="card"><div class="card-title"><span>🗺️ Full Territory Map — Dubai Marina & JBR</span>
      <div style="display:flex;gap:6px">
        <span class="badge b-blue">${salesTerritoryAccounts.filter(a => a.status === 'active').length} Active</span>
        <span class="badge b-amber">${salesTerritoryAccounts.filter(a => a.status === 'hot-lead').length} Hot Leads</span>
        <span class="badge b-red">${salesTerritoryAccounts.filter(a => a.status === 'at-risk').length} At-Risk</span>
      </div>
    </div>
    <div id="salesTerritoryMap" style="height:520px;border-radius:12px;overflow:hidden;border:1px solid var(--border);z-index:1;position:relative"></div>
  </div>`;
}
function buildSalesCommissions() { return `<div class="card"><div class="card-title">💰 Commission Tracker</div><canvas id="salesCommChart" height="250"></canvas></div>`; }
function buildSalesActivity() {
  const acts = [
    ['Takeover: JBR Grill Negotiation', 'Manual Close', 'AED 15,000', '10:30 AM'],
    ['AI: Flash Deal Sent', 'Auto-distributed', '45% Open Rate', '09:15 AM'],
    ['AI: Renewed Contract', 'Al Barsha Group', 'AED 45k/mo', 'Yesterday']
  ];
  return `<div class="card"><div class="card-title">⚡ Agent Activity Stream</div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:2fr 1fr 1fr 1fr"><span>Event</span><span>Type</span><span>Value/Result</span><span>Time</span></div>
    ${acts.map(a => tblRow(a, '2fr 1fr 1fr 1fr')).join('')}</div></div>`;
}

// ─── CHART BUILDERS ──────────────────────────
function buildCharts(role) {
  if (role === 'restaurant') {
    const sp = I('rSpendChart'); if (sp) new Chart(sp, { type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Spend (AED)', data: [32000, 28000, 35000, 31000, 34820, 29000, 26000], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'AED ' + v / 1000 + 'k' } } } } });
    const ct = I('rCatChart'); if (ct) new Chart(ct, { type: 'doughnut', data: { labels: ['Meat', 'Seafood', 'Dry Goods', 'Oils', 'Dairy', 'Vegetables'], datasets: [{ data: [35, 22, 18, 12, 8, 5], backgroundColor: ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'] }] }, options: { plugins: { legend: { position: 'right' } } } });
    const sv = I('rSavingsChart'); if (sv) new Chart(sv, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Savings (AED)', data: [280, 350, 410, 290, 315, 180, 220], backgroundColor: 'rgba(16,185,129,.6)', borderRadius: 6 }] }, options: { plugins: { legend: { display: false } } } });
    const vc = I('rVarianceChart'); if (vc) new Chart(vc, { type: 'line', data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Variance %', data: [5.2, 4.8, 3.5, 4.2], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.1)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 8 } } } });
    const fc = I('rForecastChart'); if (fc) new Chart(fc, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Predicted Demand (Covers)', data: [120, 150, 140, 180, 250, 300, 280], backgroundColor: '#8b5cf6', borderRadius: 4 }] }, options: { plugins: { legend: { display: false } } } });
  } else if (role === 'supplier') {
    const rv = I('sRevenueChart'); if (rv) new Chart(rv, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Revenue (AED)', data: [98000, 112000, 105000, 128000, 135000, 142500], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'AED ' + v / 1000 + 'k' } } } } });
    const pp = I('sProductChart'); if (pp) new Chart(pp, { type: 'bar', data: { labels: ['Beef', 'Salmon', 'Rice', 'Olive Oil', 'Chicken', 'Cheese'], datasets: [{ label: 'Units Sold', data: [450, 320, 800, 200, 380, 290], backgroundColor: ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'], borderRadius: 6 }] }, options: { plugins: { legend: { display: false } } } });
    const wc = I('sWinChart'); if (wc) new Chart(wc, { type: 'line', data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Win Rate %', data: [62, 65, 68, 71], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: 50, max: 100 } } } });
    const cc = I('sCustChart'); if (cc) new Chart(cc, { type: 'doughnut', data: { labels: ['Al Barsha', 'Deira', 'Marina Bistro', 'JBR Grill', 'Others'], datasets: [{ data: [34, 22, 16, 13, 15], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#d1d5db'] }] }, options: { plugins: { legend: { position: 'right' } } } });
  } else if (role === 'sales') {
    const sc = I('salesCommChart'); if (sc) new Chart(sc, { type: 'bar', data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Direct Sales', data: [2500, 3100, 2800, 3500], backgroundColor: '#ec4899' }, { label: 'AI Commissions', data: [1200, 1500, 1800, 2200], backgroundColor: '#8b5cf6' }] }, options: { plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } } });
  }
}

// ─── ADMIN PANELS ──────────────────────────

// ─── POPULATE ALL PANELS ──────────────────────────
function populatePanels() {
  I('r-dashboard').innerHTML = buildRestaurantDashboard();
  I('r-smartcart').innerHTML = buildSmartCart();
  if (typeof buildMarketplaceRFQ === 'function') I('r-marketplace').innerHTML = buildMarketplaceRFQ();
  I('r-orders').innerHTML = buildOrders();
  if (typeof buildDeliveryTracking === 'function') I('r-delivery').innerHTML = buildDeliveryTracking();
  I('r-inventory').innerHTML = buildInventory();
  I('r-kitchen').innerHTML = buildKitchenCopilot();
  I('r-invoices').innerHTML = buildInvoicesMatch();
  I('r-suppliers').innerHTML = buildSuppliersPanel();
  if (typeof buildWasteInsights === 'function') I('r-waste').innerHTML = buildWasteInsights();
  I('r-analytics').innerHTML = buildRestaurantAnalytics();

  // Supplier
  I('s-dashboard').innerHTML = buildSupplierDashboard();
  if (typeof buildCatalogManagement === 'function') I('s-catalog').innerHTML = buildCatalogManagement();
  I('s-incoming').innerHTML = buildIncomingPOs();
  I('s-pricing').innerHTML = buildPricingAgent();
  I('s-flash').innerHTML = buildFlashDeals();
  if (typeof buildOrdersDispatch === 'function') I('s-dispatch').innerHTML = buildOrdersDispatch();
  I('s-customers').innerHTML = buildCustomers();
  I('s-collections').innerHTML = buildCollectionsAgent();
  I('s-invoices').innerHTML = buildSupplierInvoices();
  I('s-analytics').innerHTML = buildSupplierAnalytics();

  // Sales Rep
  I('sales-dashboard').innerHTML = buildSalesDashboard();
  I('sales-territory').innerHTML = buildSalesTerritory();
  I('sales-commissions').innerHTML = buildSalesCommissions();
  I('sales-activity').innerHTML = buildSalesActivity();

  // Admin
  if (typeof buildAdminDashboard === 'function') I('admin-dashboard').innerHTML = buildAdminDashboard();
  else I('admin-dashboard').innerHTML = `<div class="card"><div class="card-title">Platform Hub</div><p style="font-size:14px;color:var(--fg-muted)">Platform summary KPIs.</p></div>`;
  I('admin-verification').innerHTML = `<div class="card"><div class="card-title">Pending KYC Verification</div><div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:1fr 1fr 1fr 1fr"><span>Business</span><span>Type</span><span>Submitted</span><span>Action</span></div>${tblRow(['Gulf Foods LLC', 'Supplier', '2 hours ago', '<button class="btn btn-primary" style="padding:4px 8px;font-size:11px">Review</button>'], '1fr 1fr 1fr 1fr')}</div></div>`;
  I('admin-disputes').innerHTML = `<div class="card"><div class="card-title">Active Disputes</div><div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:1fr 1.5fr 1fr"><span>PO Number</span><span>Issue</span><span>Status</span></div>${tblRow(['PO-0885', 'Missing Item (Rice)', '<span class="badge b-amber">Awaiting Review</span>'], '1fr 1.5fr 1fr')}</div></div>`;
  I('admin-analytics').innerHTML = `<div class="card"><div class="card-title">Platform GMV</div><div style="font-size:24px;font-weight:700">AED 4.2M <span class="badge b-green" style="font-size:12px">↑ 18%</span></div></div>`;
}

function buildAdminDashboard() {
  return `<div class="g4 mb24">
    ${statCard(svg('dashboard'), '#10b981', 'Platform GMV', 'AED 4.2M', 'b-green', '↑ 18%', 'this month')}
    ${statCard(svg('suppliers'), '#3b82f6', 'Active Restaurants', '142', 'b-blue', '↑ 12 new', '')}
    ${statCard(svg('pricing'), '#8b5cf6', 'Active Suppliers', '38', 'b-purple', '↑ 3 new', '')}
    ${statCard(svg('orders'), '#f59e0b', 'Orders Processed', '8,420', 'b-amber', '↑ 24%', 'vs last month')}
  </div>
  <div class="g2">
    <div class="card"><div class="card-title">System Health</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid var(--border);border-radius:8px">
          <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:50%;background:#10b981"></div> <span style="font-weight:600;font-size:13px">API Core</span></div>
          <span style="color:var(--fg-muted);font-size:12px">99.99% Uptime</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid var(--border);border-radius:8px">
          <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:50%;background:#10b981"></div> <span style="font-weight:600;font-size:13px">AI Inference Engine</span></div>
          <span style="color:var(--fg-muted);font-size:12px">42ms avg response</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:1px solid var(--border);border-radius:8px">
          <div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:50%;background:#10b981"></div> <span style="font-weight:600;font-size:13px">Payment Gateway</span></div>
          <span style="color:var(--fg-muted);font-size:12px">Operational</span>
        </div>
      </div>
    </div>
    <div class="card"><div class="card-title">Recent Audit Logs</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="font-size:12px"><span style="color:var(--fg-muted)">10:45 AM</span> • Admin <b style="color:var(--accent)">Approved KYC</b> for 'Gulf Foods LLC'</div>
        <div style="font-size:12px"><span style="color:var(--fg-muted)">09:30 AM</span> • System <b style="color:var(--accent)">Auto-resolved Dispute</b> PO-0885 (Credit note issued)</div>
        <div style="font-size:12px"><span style="color:var(--fg-muted)">08:15 AM</span> • Supplier 'SeaFresh' <b style="color:var(--accent)">Updated Catalog Pricing</b> (+4 items)</div>
      </div>
    </div>
  </div>`;
}

// ─── INIT ──────────────────────────
populatePanels();
renderSidebar('restaurant');
showPanel('r-dashboard');
buildCharts('restaurant');

// Initialize maps when sales panels become visible
function initMapsForPanel(panelId) {
  if (panelId === 'sales-dashboard') {
    initTerritoryMap('salesDashMap', salesTerritoryAccounts);
  } else if (panelId === 'sales-territory') {
    initTerritoryMap('salesTerritoryMap', salesTerritoryAccounts);
  }
}

// Hook into showPanel to init maps
const origShowPanel = showPanel;
showPanel = function (id) {
  origShowPanel(id);
  initMapsForPanel(id);
};

// Re-build charts and init maps on role switch
const origSwitch = switchRole;
switchRole = function (role) {
  origSwitch(role);
  setTimeout(() => buildCharts(role), 100);
  if (role === 'sales') {
    const firstPanel = sidebarConfig.sales.items[0].id;
    setTimeout(() => initMapsForPanel(firstPanel), 200);
  }
};
