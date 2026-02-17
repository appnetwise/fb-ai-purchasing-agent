/* ProcureIQ Auto-Play Demo — plays like a video */
(function () {

    const script = [
        /* ─── INTRO ─── */
        {
            dur: 3500, narr: '🎬 Welcome to ProcureIQ — watch AI-powered procurement in action for both Restaurants and Suppliers.',
            fn() { switchRole('restaurant'); showPanel('r-dashboard'); }
        },

        /* ─── PART 1: RESTAURANT MANAGER ─── */
        {
            dur: 4000, narr: '🍽️ RESTAURANT VIEW — 6:00 AM. Ahmed logs in. 47 orders processed, AED 34,820 spent, 8% saved by AI.',
            fn() { flashElements('.g4 .card', 300); }
        },

        {
            dur: 3500, narr: '🛒 AI Smart Cart — Overnight, the AI analyzed POS sales and inventory to build today\'s optimal order.',
            fn() { showPanel('r-smartcart'); }
        },

        {
            dur: 4000, narr: '🛒 5 items selected from best suppliers. AED 315 saved. The cart is ready for one-click approval.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        {
            dur: 3500, narr: '✅ Ahmed approves the cart — orders are routed to suppliers instantly.',
            fn() {
                const btn = findInPanel('.btn-primary');
                if (btn) { simulateClick(btn); btn.textContent = '✓ Approved!'; btn.style.background = 'linear-gradient(135deg,#10b981,#059669)'; }
            }
        },

        {
            dur: 3500, narr: '📋 Orders Pipeline — Deliveries tracked in real-time from placement to doorstep.',
            fn() { showPanel('r-orders'); }
        },

        {
            dur: 3500, narr: '📋 ORD-4721 delivered, ORD-4720 in transit, ORD-4719 confirmed. Full supply chain visibility.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 150); }
        },

        {
            dur: 3500, narr: '🔔 Inventory Alerts — AI detects Salmon critically low at 2 kg. Chicken stockout predicted tomorrow.',
            fn() { showPanel('r-inventory'); }
        },

        {
            dur: 4000, narr: '🔔 Smart reorders triggered automatically — no manual intervention needed.',
            fn() {
                const btns = findAllInPanel('.btn');
                btns.forEach((b, i) => setTimeout(() => { if (b.textContent.includes('Reorder')) { simulateClick(b); b.textContent = '✓ Ordered'; b.style.background = 'rgba(16,185,129,.15)'; b.style.color = '#059669'; b.style.borderColor = '#10b981'; } }, i * 400));
            }
        },

        {
            dur: 3500, narr: '🔗 3-Way Match — PO ↔ GRN ↔ Invoice auto-matched when goods arrive.',
            fn() { showPanel('r-invoices'); }
        },

        {
            dur: 4000, narr: '✅ 38 auto-approved, 5 flagged for quantity variances, 2 blocked for missing items.',
            fn() { flashElements('.g3 .card', 300); }
        },

        {
            dur: 3500, narr: '⭐ Supplier Scorecards — Each supplier rated on Price, Quality, SLA, and Fill Rate.',
            fn() { showPanel('r-suppliers'); }
        },

        {
            dur: 4000, narr: '⭐ Gulf Foods leads with 92/100. These scores feed into AI Smart Cart decisions.',
            fn() { flashElements('.card', 250); }
        },

        {
            dur: 3500, narr: '📈 Restaurant Analytics — Weekly savings AED 2,045. AI cart acceptance rate: 89%.',
            fn() { showPanel('r-analytics'); }
        },

        /* ─── TRANSITION ─── */
        {
            dur: 3500, narr: '🔄 Now switching to the SUPPLIER side — let\'s see what Gulf Foods experiences...',
            fn() { flashElements('.g4 .card', 200); }
        },

        /* ─── PART 2: SUPPLIER MANAGER ─── */
        {
            dur: 4000, narr: '📦 SUPPLIER VIEW — Sarah K. at Gulf Foods logs into her Sales Hub.',
            fn() { switchRole('supplier'); showPanel('s-dashboard'); }
        },

        {
            dur: 4000, narr: '📦 12 incoming POs today, AED 284K monthly revenue, 96.2% fill rate across 28 restaurants.',
            fn() { flashElements('.g4 .card', 300); }
        },

        {
            dur: 3500, narr: '📥 Incoming POs — Ahmed\'s approved order just arrived. 2 POs awaiting confirmation.',
            fn() { showPanel('s-incoming'); }
        },

        {
            dur: 4000, narr: '📥 The supplier reviews items, quantities, and delivery requirements.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        {
            dur: 3500, narr: '✅ Sarah confirms the order — fulfillment begins immediately.',
            fn() {
                const btn = findInPanel('.btn-primary');
                if (btn) { simulateClick(btn); btn.textContent = 'Confirmed ✓'; btn.style.background = 'linear-gradient(135deg,#10b981,#059669)'; }
            }
        },

        {
            dur: 3500, narr: '🤖 AI Pricing Agent — Auto-quoting competitively based on market data and margins.',
            fn() { showPanel('s-pricing'); }
        },

        {
            dur: 4500, narr: '💰 Quoted Beef Tenderloin at AED 95/kg vs competitor\'s AED 98/kg. Win rate: 68% and climbing.',
            fn() { flashElements('.g3 .card', 250); }
        },

        {
            dur: 4000, narr: '🤖 The AI agent activity log shows won quotes, pending bids, and strategic adjustments.',
            fn() { highlightRows('.card:last-child > div > div', 150); }
        },

        {
            dur: 3500, narr: '🔥 Flash Deals — Near-expiry Mozzarella auto-listed at 20% off. Matched to 3 restaurants.',
            fn() { showPanel('s-flash'); }
        },

        {
            dur: 4000, narr: '🔥 Wagyu Trim at 30% off to clear inventory. AI finds buyers automatically — zero waste.',
            fn() { flashElements('.card', 300); }
        },

        {
            dur: 3500, narr: '👥 Customer Directory — 28 active restaurant clients tracked with spend, frequency, and tier.',
            fn() { showPanel('s-customers'); }
        },

        {
            dur: 4000, narr: '👥 Al Barsha Kitchen is the top account at AED 45K/month. Platinum tier, 12 orders per week.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 150); }
        },

        {
            dur: 3500, narr: '🧾 Supplier Invoices — AED 156K outstanding. Average DSO: 18 days. E-invoicing built in.',
            fn() { showPanel('s-invoices'); }
        },

        {
            dur: 4000, narr: '🧾 3 invoices paid, 2 pending, 1 overdue. Full payment lifecycle tracked.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        {
            dur: 3500, narr: '📊 Supplier Analytics — Quote win rate trending up. Revenue by customer visualized.',
            fn() { showPanel('s-analytics'); }
        },

        {
            dur: 4000, narr: '📊 Top customers, margin trends, and AI-driven pricing insights — all in one place.',
            fn() { flashElements('.card', 300); }
        },

        /* ─── CLOSING ─── */
        {
            dur: 5000, narr: '🚀 That\'s ProcureIQ — AI that turns 45 minutes of manual procurement into 30 seconds. For both buyers AND suppliers. Thank you for watching!',
            fn() { switchRole('restaurant'); showPanel('r-dashboard'); flashElements('.g4 .card', 200); }
        },
    ];

    let stepIdx = -1;
    let timer = null;
    let paused = false;
    let bar = null;
    let active = false;

    // ── Helpers ──
    function findInPanel(sel) {
        const p = document.querySelector('.panel.active');
        return p ? p.querySelector(sel) : document.querySelector(sel);
    }
    function findAllInPanel(sel) {
        const p = document.querySelector('.panel.active');
        return p ? [...p.querySelectorAll(sel)] : [...document.querySelectorAll(sel)];
    }

    function simulateClick(el) {
        el.style.transition = 'transform 0.2s';
        el.style.transform = 'scale(0.93)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }

    function flashElements(sel, stagger) {
        try {
            const els = findAllInPanel(sel);
            els.forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'box-shadow 0.4s, transform 0.3s';
                    el.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.4)';
                    el.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        el.style.boxShadow = '';
                        el.style.transform = '';
                    }, 1200);
                }, i * (stagger || 200));
            });
        } catch (e) { }
    }

    function highlightRows(sel, stagger) {
        try {
            const rows = findAllInPanel(sel);
            rows.forEach((row, i) => {
                setTimeout(() => {
                    row.style.transition = 'background 0.3s, transform 0.2s';
                    row.style.background = 'rgba(59,130,246,0.08)';
                    row.style.transform = 'translateX(6px)';
                    setTimeout(() => {
                        row.style.background = '';
                        row.style.transform = '';
                    }, 1200);
                }, i * (stagger || 150));
            });
        } catch (e) { }
    }

    // ── Narration Bar ──
    function createBar() {
        bar = document.createElement('div');
        bar.id = 'demoBar';
        bar.innerHTML = `
      <div class="demo-narrator">
        <div class="demo-narrator-left">
          <button class="demo-ctrl" id="demoPauseBtn" onclick="window.__demoTogglePause()">⏸</button>
          <div class="demo-narrator-text">
            <div class="demo-narrator-label" id="demoLabel">DEMO</div>
            <div class="demo-narrator-msg" id="demoMsg">Starting...</div>
          </div>
        </div>
        <div class="demo-narrator-right">
          <div class="demo-timeline">
            <div class="demo-timeline-fill" id="demoTimeline"></div>
          </div>
          <span class="demo-step-counter" id="demoCounter">0/${script.length}</span>
          <button class="demo-ctrl demo-ctrl-stop" onclick="window.__demoStop()">✕</button>
        </div>
      </div>`;
        document.body.appendChild(bar);
    }

    function updateBar(idx, narr) {
        const msg = document.getElementById('demoMsg');
        const label = document.getElementById('demoLabel');
        const counter = document.getElementById('demoCounter');
        const timeline = document.getElementById('demoTimeline');
        if (msg) { msg.style.opacity = '0'; setTimeout(() => { msg.textContent = narr; msg.style.opacity = '1'; }, 200); }
        if (label) label.textContent = paused ? 'PAUSED' : 'DEMO';
        if (counter) counter.textContent = `${idx + 1}/${script.length}`;
        if (timeline) timeline.style.width = `${((idx + 1) / script.length) * 100}%`;
    }

    // ── Playback Engine ──
    function playStep() {
        stepIdx++;
        if (stepIdx >= script.length) { endDemo(); return; }
        const step = script[stepIdx];

        // Execute the step's function (with error protection)
        try { if (step.fn) step.fn(); } catch (e) { console.warn('Demo step error:', e); }
        updateBar(stepIdx, step.narr);

        // Schedule next step
        if (!paused) {
            timer = setTimeout(playStep, step.dur);
        }
    }

    function startDemo() {
        if (active) return;
        active = true;
        paused = false;
        stepIdx = -1;
        createBar();
        playStep();
    }

    function endDemo() {
        if (timer) clearTimeout(timer);
        timer = null;
        active = false;
        paused = false;
        stepIdx = -1;
        if (bar) { bar.remove(); bar = null; }
        switchRole('restaurant');
        showPanel('r-dashboard');
    }

    function togglePause() {
        if (!active) return;
        paused = !paused;
        const btn = document.getElementById('demoPauseBtn');
        const label = document.getElementById('demoLabel');
        if (paused) {
            if (timer) clearTimeout(timer);
            if (btn) btn.textContent = '▶';
            if (label) label.textContent = 'PAUSED';
        } else {
            if (btn) btn.textContent = '⏸';
            if (label) label.textContent = 'DEMO';
            timer = setTimeout(playStep, 1500);
        }
    }

    // Global hooks
    window.startDemo = startDemo;
    window.__demoStop = endDemo;
    window.__demoTogglePause = togglePause;

    // Keyboard: Space=pause, Esc=stop
    document.addEventListener('keydown', e => {
        if (!active) return;
        if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePause(); }
        if (e.key === 'Escape') endDemo();
    });
})();
