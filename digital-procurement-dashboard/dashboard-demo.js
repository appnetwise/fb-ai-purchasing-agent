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
            dur: 4000, narr: '🛒 5 items selected from best suppliers. AED 315 saved. The cart is ready for one-click approval or edits.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        {
            dur: 6000, narr: '✏️ Wait, Ahmed wants to adjust the Salmon quantity before approving.',
            fn() {
                const editBtn = findInPanel('.btn-outline');
                if (editBtn) simulateClick(editBtn);
                openDemoModal('Edit Cart Item: Fresh Salmon Fillet', [
                    { label: 'Quantity (kg)', value: '15 kg', placeholder: '' }
                ], 'Update Cart');

                setTimeout(() => {
                    simulateTyping('demoInput0', '20', 100).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Update the table
                            const rows = findAllInPanel('.tbl-row:not(.tbl-head)');
                            const targetRow = rows.find(r => r.innerHTML.includes('Fresh Salmon Fillet'));
                            if (targetRow) {
                                targetRow.innerHTML = targetRow.innerHTML.replace('15 kg', '20 kg').replace('AED 1,425', 'AED 1,900');
                                targetRow.style.transition = 'background 0.3s';
                                targetRow.style.background = 'rgba(16,185,129,0.1)';
                                setTimeout(() => { targetRow.style.background = ''; }, 1000);
                            }

                            setTimeout(closeDemoModal, 300);
                        }, 500);
                    });
                }, 1000);
            }
        },

        {
            dur: 3500, narr: '✅ Cart updated! Now Ahmed approves the cart — orders are routed instantly.',
            fn() {
                const btn = findInPanel('.btn-primary');
                if (btn) { simulateClick(btn); btn.textContent = '✓ Approved!'; btn.style.background = 'linear-gradient(135deg,#10b981,#059669)'; }
            }
        },

        /* Marketplace */
        {
            dur: 3500, narr: '🤝 Marketplace & RFQ — Ahmed needs to source a new supplier for frozen pastries.',
            fn() { showPanel('r-marketplace'); }
        },

        {
            dur: 7000, narr: '📝 Creating a new RFQ is instant with AI assistance.',
            fn() {
                const btn = findInPanel('.btn-primary');
                if (btn) simulateClick(btn);
                openDemoModal('New Bulk RFQ', [
                    { label: 'Category / Item', placeholder: 'e.g., Seafood' },
                    { label: 'Estimated Volume', placeholder: '' },
                    { label: 'Target Price (Optional)', placeholder: '' }
                ], 'Submit RFQ');

                setTimeout(() => {
                    simulateTyping('demoInput0', 'Premium Frozen Pastries', 50).then(() => {
                        return simulateTyping('demoInput1', '100 boxes/week', 50);
                    }).then(() => {
                        return simulateTyping('demoInput2', 'AED 45/box', 50);
                    }).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Update the RFQ table
                            const tbl = findInPanel('.tbl');
                            if (tbl) {
                                const newRow = document.createElement('div');
                                newRow.className = 'tbl-row';
                                newRow.style.gridTemplateColumns = '1.5fr 1fr 1fr 1fr 1.5fr';
                                newRow.innerHTML = `<span><b>RFQ-903</b> (Premium Frozen Pastries)</span><span>Active</span><span>0 Quotes</span><span>Closes in 48h</span><span><button class="btn btn-outline" style="padding:4px 8px;font-size:11px" disabled>Awaiting Quotes</button></span>`;
                                newRow.style.transition = 'background 0.3s';
                                newRow.style.background = 'rgba(16,185,129,0.1)';
                                const head = tbl.querySelector('.tbl-head');
                                if (head) {
                                    head.insertAdjacentElement('afterend', newRow);
                                    setTimeout(() => { newRow.style.background = ''; }, 1000);
                                }
                            }

                            setTimeout(closeDemoModal, 400);
                        }, 500);
                    });
                }, 800);
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
            dur: 3500, narr: '👨‍🍳 Kitchen Copilot — Daily prep lists auto-generated from order history and menu demand.',
            fn() { showPanel('r-kitchen'); }
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

        /* Waste Logging */
        {
            dur: 3500, narr: '🗑️ Waste Insights — Ahmed logs a recent spoilage event to keep inventory accurate.',
            fn() { showPanel('r-waste'); }
        },

        {
            dur: 6000, narr: '📝 He logs 3 bottles of milk that spoiled due to a fridge temperature spike.',
            fn() {
                const btn = findAllInPanel('.btn.btn-primary').find(b => b.textContent.includes('Log Waste'));
                if (btn) simulateClick(btn);

                openDemoModal('Log Waste Event', [
                    { label: 'Item Name', placeholder: 'e.g., Fresh Milk' },
                    { label: 'Quantity Wasted', placeholder: '' },
                    { label: 'Reason / Details', placeholder: '' }
                ], 'Log Event');

                setTimeout(() => {
                    simulateTyping('demoInput0', 'Fresh Milk (2L)', 50).then(() => {
                        return simulateTyping('demoInput1', '3 bottles', 50);
                    }).then(() => {
                        return simulateTyping('demoInput2', 'Fridge Temperature Spike', 50);
                    }).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Update Waste table
                            const tbl = findInPanel('.tbl');
                            if (tbl) {
                                const newRow = document.createElement('div');
                                newRow.className = 'tbl-row';
                                newRow.style.gridTemplateColumns = '1.5fr 1fr 1.5fr 1fr';
                                newRow.innerHTML = `<span>Fresh Milk (2L)</span><span><span class="badge b-amber">Spoilage</span></span><span><span style="font-size:12px;color:var(--fg-muted)">Fridge Temperature Spike</span></span><span><span style="font-weight:600">3 bottles (AED 22)</span></span>`;
                                newRow.style.transition = 'background 0.3s';
                                newRow.style.background = 'rgba(16,185,129,0.1)';
                                const head = tbl.querySelector('.tbl-head');
                                if (head) {
                                    head.insertAdjacentElement('afterend', newRow);
                                    setTimeout(() => { newRow.style.background = ''; }, 1000);
                                }
                            }

                            setTimeout(closeDemoModal, 400);
                        }, 500);
                    });
                }, 800);
            }
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

        /* Catalog Management Add */
        {
            dur: 3500, narr: '📖 Catalog Management — Sarah adds a new premium item to the digital catalog.',
            fn() { showPanel('s-catalog'); }
        },

        {
            dur: 7000, narr: '📝 She adds Wagyu Beef Striploin, and it becomes instantly available to all active restaurants.',
            fn() {
                const addBtn = findAllInPanel('.btn-primary').find(b => b.textContent.includes('+ Add Product'));
                if (addBtn) simulateClick(addBtn);

                openDemoModal('Add Catalog Item', [
                    { label: 'Product Name', placeholder: 'e.g., Premium Cut' },
                    { label: 'Category', placeholder: 'e.g., Meat' },
                    { label: 'Base Price', placeholder: 'AED / kg' }
                ], 'Publish to Catalog');

                setTimeout(() => {
                    simulateTyping('demoInput0', 'Wagyu Beef Striploin (MB4+)', 40).then(() => {
                        return simulateTyping('demoInput1', 'Meat & Poultry', 40);
                    }).then(() => {
                        return simulateTyping('demoInput2', 'AED 185/kg', 40);
                    }).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Update Catalog table
                            const tbl = findInPanel('.tbl');
                            if (tbl) {
                                const newRow = document.createElement('div');
                                newRow.className = 'tbl-row';
                                newRow.style.gridTemplateColumns = '1.5fr 1fr 1fr .8fr .8fr 1fr';
                                newRow.innerHTML = `<span><b>Wagyu Beef Striploin (MB4+)</b></span><span>Meat & Poultry</span><span>AED 185/kg</span><span><span class="badge b-green">In Stock</span></span><span><span style="font-size:12px;color:var(--fg-muted)">In Stock (50kg)</span></span><span><button class="btn btn-outline" style="font-size:11px;padding:4px 8px">Edit</button></span>`;
                                newRow.style.transition = 'background 0.3s';
                                newRow.style.background = 'rgba(16,185,129,0.1)';
                                const head = tbl.querySelector('.tbl-head');
                                if (head) {
                                    head.insertAdjacentElement('afterend', newRow);
                                    setTimeout(() => { newRow.style.background = ''; }, 1000);
                                }
                            }

                            setTimeout(closeDemoModal, 400);
                        }, 500);
                    });
                }, 800);
            }
        },

        {
            dur: 3500, narr: '📥 Incoming POs — Ahmed\'s approved order just arrived. 2 POs awaiting confirmation.',
            fn() { showPanel('s-incoming'); }
        },

        {
            dur: 4000, narr: '📥 The supplier reviews items, quantities, and delivery requirements.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        /* PO Negotiation */
        {
            dur: 7000, narr: '💬 Sarah can\'t fulfill the full order today. She sends a quick counter-offer.',
            fn() {
                const negBtn = findAllInPanel('.btn-outline').find(b => b.textContent.includes('Negotiate'));
                if (negBtn) simulateClick(negBtn);

                openDemoModal('Counter-Offer PO-4891', [
                    { label: 'Message to Restaurant', placeholder: 'e.g., Delivery delay...' }
                ], 'Send Counter-Offer');

                setTimeout(() => {
                    simulateTyping('demoInput0', 'Can deliver 4 items today, 1 on backorder for tomorrow.', 60).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Update incoming POs table (PO-4891)
                            const rows = findAllInPanel('.tbl-row:not(.tbl-head)');
                            const targetRow = rows.find(r => r.innerHTML.includes('PO-4891'));
                            if (targetRow) {
                                const actionCell = targetRow.lastElementChild;
                                if (actionCell) {
                                    actionCell.innerHTML = '<span class="badge b-amber">Counter-Offered</span>';
                                }
                                targetRow.style.transition = 'background 0.3s';
                                targetRow.style.background = 'rgba(245,158,11,0.1)';
                                setTimeout(() => { targetRow.style.background = ''; }, 1000);
                            }

                            setTimeout(closeDemoModal, 400);
                        }, 500);
                    });
                }, 800);
            }
        },

        {
            dur: 3500, narr: '✅ Sarah confirms the other standard orders — fulfillment begins immediately.',
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
            dur: 3500, narr: '🔥 Flash Deals — Near-expiry inventory can be liquidated instantly.',
            fn() { showPanel('s-flash'); }
        },

        /* Flash Deal Creation */
        {
            dur: 8000, narr: '⚡ Sarah creates a Flash Deal for Mozzarella. The AI instantly matches it to 3 interested buyers.',
            fn() {
                const btn = findAllInPanel('.btn-primary').find(b => b.textContent.includes('+ Create Deal'));
                if (btn) simulateClick(btn);

                openDemoModal('New Flash Deal', [
                    { label: 'Select Product', placeholder: '' },
                    { label: 'Original Price', placeholder: '' },
                    { label: 'Flash Price', placeholder: '' }
                ], 'Broadcast Deal (AI Matched)');

                setTimeout(() => {
                    simulateTyping('demoInput0', 'Mozzarella Block (5kg)', 40).then(() => {
                        return simulateTyping('demoInput1', 'AED 35/kg', 40);
                    }).then(() => {
                        return simulateTyping('demoInput2', 'AED 25/kg', 40);
                    }).then(() => {
                        setTimeout(() => {
                            const modalBtn = document.getElementById('demoModalBtn');
                            if (modalBtn) simulateClick(modalBtn);

                            // Insert Flash Deal
                            const container = findInPanel('.card:first-child > div:last-child');
                            if (container) {
                                const deal = document.createElement('div');
                                deal.style = 'padding:16px;border:1px solid rgba(245,158,11,.2);background:rgba(245,158,11,.02);border-radius:12px';
                                deal.innerHTML = `
                                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                                    <div><span style="font-size:15px;font-weight:700">Mozzarella Block (5kg)</span><span class="badge b-amber" style="margin-left:8px">Expires in 3 days</span></div>
                                    <div style="font-size:13px"><s style="color:var(--fg-muted)">AED 35/kg</s> → <b style="color:#059669">AED 25/kg</b></div></div>
                                  <div style="display:flex;justify-content:space-between;align-items:center">
                                    <span style="font-size:12px;color:var(--fg-muted)">Available: 100 kg • Matched 3/3 restaurants</span>
                                    <div class="progress-bar" style="width:120px"><div class="progress-fill" style="width:100%;background:#f59e0b"></div></div></div>
                                `;
                                deal.style.transition = 'all 0.4s';
                                deal.style.opacity = '0';
                                deal.style.transform = 'translateY(-10px)';
                                container.insertBefore(deal, container.firstChild);
                                setTimeout(() => {
                                    deal.style.opacity = '1';
                                    deal.style.transform = 'translateY(0)';
                                    deal.style.background = 'rgba(16,185,129,0.1)';
                                    setTimeout(() => { deal.style.background = 'rgba(245,158,11,.02)'; }, 1000);
                                }, 50);
                            }

                            setTimeout(closeDemoModal, 400);
                        }, 500);
                    });
                }, 800);
            }
        },

        {
            dur: 4000, narr: '🔥 Wagyu Trim at 30% off is also clearing inventory. Target audiences reached automatically.',
            fn() { flashElements('.card', 300); }
        },

        {
            dur: 3500, narr: '👥 Customer Directory — 28 active restaurant clients tracked with spend, frequency, and tier.',
            fn() { showPanel('s-customers'); }
        },

        {
            dur: 3500, narr: '💳 Collections Agent — Automated payment reminders and DSO tracking. 18 days avg DSO.',
            fn() { showPanel('s-collections'); }
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

        /* ─── TRANSITION ─── */
        {
            dur: 3500, narr: '🔄 Finally, the SALES REP view — empowering field teams with AI insights...',
            fn() { flashElements('.g2 .card', 200); }
        },

        /* ─── PART 3: SALES REP ─── */
        {
            dur: 4000, narr: '💼 SALES REP VIEW — Jason D. manages his Dubai Marina territory from the road.',
            fn() { switchRole('sales'); showPanel('sales-dashboard'); }
        },

        {
            dur: 4000, narr: '🗺️ Territory Pulse — 28 active accounts, 5 hot leads, and real-time commission tracking.',
            fn() { flashElements('.g4 .card', 300); }
        },

        {
            dur: 3500, narr: '⚡ Agent Activity Stream — Watch the AI close deals, send flash offers, and renew contracts.',
            fn() { showPanel('sales-activity'); }
        },

        {
            dur: 4000, narr: '⚡ "Human in the Loop" — Jason can take over any negotiation instantly if the AI needs help.',
            fn() { highlightRows('.tbl .tbl-row:not(.tbl-head)', 200); }
        },

        /* ─── CLOSING ─── */
        {
            dur: 5000, narr: '🚀 That\'s ProcureIQ — A unified platform for Restaurants, Suppliers, and Sales Teams. 30 seconds to value.',
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

    let demoModal = null;

    function openDemoModal(title, fields, btnText) {
        closeDemoModal();
        demoModal = document.createElement('div');
        demoModal.className = 'demo-modal-overlay';

        let fieldsHtml = fields.map((f, i) => `
            <div style="margin-bottom:12px">
                <div style="font-size:12px;color:var(--fg-muted);margin-bottom:4px">${f.label}</div>
                <input type="text" id="demoInput${i}" class="input" style="width:100%; transition: border-color 0.2s;" placeholder="${f.placeholder || ''}" ${f.value ? `value="${f.value}"` : ''} readonly>
            </div>
        `).join('');

        demoModal.innerHTML = `
            <div class="demo-modal">
                <div style="font-size:16px;font-weight:700;margin-bottom:16px">${title}</div>
                ${fieldsHtml}
                <div style="display:flex;justify-content:flex-end;margin-top:20px">
                    <button id="demoModalBtn" class="btn btn-primary">${btnText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(demoModal);

        if (!document.getElementById('demoModalStyles')) {
            const style = document.createElement('style');
            style.id = 'demoModalStyles';
            style.innerHTML = `
                .demo-modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.4); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(2px); animation: fadeIn 0.3s; }
                .demo-modal { background:var(--bg-base); color:var(--fg-base); border:1px solid var(--border); border-radius:12px; padding:24px; width:400px; max-width:90vw; box-shadow:0 10px 25px rgba(0,0,0,0.1); animation: slideUp 0.3s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }
    }

    function closeDemoModal() {
        if (demoModal) {
            demoModal.remove();
            demoModal = null;
        }
    }

    function simulateTyping(inputId, text, speed = 40) {
        return new Promise(resolve => {
            const input = document.getElementById(inputId);
            if (!input) { resolve(); return; }
            input.value = '';
            input.style.borderColor = 'var(--accent)';
            let i = 0;
            function typeChar() {
                if (paused) {
                    setTimeout(typeChar, 100);
                    return;
                }
                if (i < text.length) {
                    input.value += text.charAt(i);
                    i++;
                    setTimeout(typeChar, speed);
                } else {
                    input.style.borderColor = 'var(--border)';
                    resolve();
                }
            }
            setTimeout(typeChar, 400); // initial delay before typing
        });
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
          <span class="demo-step-counter" id="demoCounter">0/\${script.length}</span>
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
