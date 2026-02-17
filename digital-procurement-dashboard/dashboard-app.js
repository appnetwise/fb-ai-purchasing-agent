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
    settings: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>'
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
            { id: 'r-orders', icon: 'orders', label: 'Orders' },
            { id: 'r-inventory', icon: 'inventory', label: 'Inventory' },
            { id: 'r-invoices', icon: 'invoice', label: 'Invoices & Match' },
            { id: 'r-suppliers', icon: 'suppliers', label: 'Suppliers' },
            { id: 'r-analytics', icon: 'analytics', label: 'Analytics' }
        ]
    },
    supplier: {
        title: 'Supplier Manager', avatar: 'SK', name: 'Sarah K.', subtitle: 'Sales Manager',
        gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        items: [
            { id: 's-dashboard', icon: 'dashboard', label: 'Dashboard' },
            { id: 's-incoming', icon: 'orders', label: 'Incoming POs' },
            { id: 's-pricing', icon: 'pricing', label: 'Pricing Agent' },
            { id: 's-flash', icon: 'flash', label: 'Flash Deals' },
            { id: 's-customers', icon: 'suppliers', label: 'Customers' },
            { id: 's-invoices', icon: 'invoice', label: 'Invoices' },
            { id: 's-analytics', icon: 'analytics', label: 'Analytics' }
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
    sub.textContent = role === 'restaurant' ? 'Operations Overview — Al Barsha Kitchen Group' : 'Sales Hub — Gulf Foods LLC';
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

function buildCustomers() {
    const custs = [
        { name: 'Al Barsha Kitchen Group', spend: 'AED 48,200/mo', orders: 47, tier: 'Gold', badge: 'b-amber', freq: 'Daily' },
        { name: 'Dubai Marina Bistro', spend: 'AED 22,500/mo', orders: 28, tier: 'Silver', badge: 'b-blue', freq: '3x/week' },
        { name: 'JBR Seaside Grill', spend: 'AED 18,900/mo', orders: 22, tier: 'Silver', badge: 'b-blue', freq: '3x/week' },
        { name: 'Deira Foodhall', spend: 'AED 31,000/mo', orders: 35, tier: 'Gold', badge: 'b-amber', freq: 'Daily' },
        { name: 'Marina Bay Restaurant', spend: 'AED 12,400/mo', orders: 15, tier: 'Bronze', badge: 'b-purple', freq: '2x/week' },
    ];
    const gCols = '1.8fr 1.2fr .8fr .8fr .8fr';
    return `<div class="card"><div class="card-title">🏢 Restaurant Customers</div>
    <div class="tbl"><div class="tbl-row tbl-head" style="grid-template-columns:${gCols}"><span>Restaurant</span><span>Monthly Spend</span><span>Orders</span><span>Tier</span><span>Frequency</span></div>
    ${custs.map(c => tblRow([`<b>${c.name}</b>`, c.spend, c.orders, `<span class="badge ${c.badge}">${c.tier}</span>`, c.freq], gCols)).join('')}</div></div>`;
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

// ─── CHART BUILDERS ──────────────────────────
function buildCharts(role) {
    if (role === 'restaurant') {
        const sp = I('rSpendChart'); if (sp) new Chart(sp, { type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Spend (AED)', data: [32000, 28000, 35000, 31000, 34820, 29000, 26000], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'AED ' + v / 1000 + 'k' } } } } });
        const ct = I('rCatChart'); if (ct) new Chart(ct, { type: 'doughnut', data: { labels: ['Meat', 'Seafood', 'Dry Goods', 'Oils', 'Dairy', 'Vegetables'], datasets: [{ data: [35, 22, 18, 12, 8, 5], backgroundColor: ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'] }] }, options: { plugins: { legend: { position: 'right' } } } });
        const sv = I('rSavingsChart'); if (sv) new Chart(sv, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Savings (AED)', data: [280, 350, 410, 290, 315, 180, 220], backgroundColor: 'rgba(16,185,129,.6)', borderRadius: 6 }] }, options: { plugins: { legend: { display: false } } } });
    } else {
        const rv = I('sRevenueChart'); if (rv) new Chart(rv, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Revenue (AED)', data: [98000, 112000, 105000, 128000, 135000, 142500], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'AED ' + v / 1000 + 'k' } } } } });
        const pp = I('sProductChart'); if (pp) new Chart(pp, { type: 'bar', data: { labels: ['Beef', 'Salmon', 'Rice', 'Olive Oil', 'Chicken', 'Cheese'], datasets: [{ label: 'Units Sold', data: [450, 320, 800, 200, 380, 290], backgroundColor: ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'], borderRadius: 6 }] }, options: { plugins: { legend: { display: false } } } });
        const wc = I('sWinChart'); if (wc) new Chart(wc, { type: 'line', data: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Win Rate %', data: [62, 65, 68, 71], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', fill: true, tension: .4 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { min: 50, max: 100 } } } });
        const cc = I('sCustChart'); if (cc) new Chart(cc, { type: 'doughnut', data: { labels: ['Al Barsha', 'Deira', 'Marina Bistro', 'JBR Grill', 'Others'], datasets: [{ data: [34, 22, 16, 13, 15], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#d1d5db'] }] }, options: { plugins: { legend: { position: 'right' } } } });
    }
}

// ─── POPULATE ALL PANELS ──────────────────────────
function populatePanels() {
    I('r-dashboard').innerHTML = buildRestaurantDashboard();
    I('r-smartcart').innerHTML = buildSmartCart();
    I('r-orders').innerHTML = buildOrders();
    I('r-inventory').innerHTML = buildInventory();
    I('r-invoices').innerHTML = buildInvoicesMatch();
    I('r-suppliers').innerHTML = buildSuppliersPanel();
    I('r-analytics').innerHTML = buildRestaurantAnalytics();
    I('s-dashboard').innerHTML = buildSupplierDashboard();
    I('s-incoming').innerHTML = buildIncomingPOs();
    I('s-pricing').innerHTML = buildPricingAgent();
    I('s-flash').innerHTML = buildFlashDeals();
    I('s-customers').innerHTML = buildCustomers();
    I('s-invoices').innerHTML = buildSupplierInvoices();
    I('s-analytics').innerHTML = buildSupplierAnalytics();
}

// ─── INIT ──────────────────────────
populatePanels();
renderSidebar('restaurant');
showPanel('r-dashboard');
buildCharts('restaurant');

// Re-build charts on role switch
const origSwitch = switchRole;
switchRole = function (role) {
    origSwitch(role);
    setTimeout(() => buildCharts(role), 100);
};
