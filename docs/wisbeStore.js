(function() {
    const CONFIG = {
        SUPABASE_URL: 'https://wwcmtqqbxdamxebkfsqk.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y210cXFieGRhbXhlYmtmc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUzNzksImV4cCI6MjA5MDA4MTM3OX0.4C5gGKxJrpF5BS8FfEAu8FLa9VudEHxCYxwwtb991Io'
    };

    const COMMON_CSS = `
        :host {
            --store-primary: #2563eb;
            --store-secondary: #64748b;
            --store-bg: #f8fafc;
            --store-card-bg: #ffffff;
            --store-text: #0f172a;
            --store-border: #e2e8f0;
            --amber-600: #d97706;
            --amber-50: #fffbeb;
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wisbe-store-container, .wisbe-promos-container, .wisbe-auctions-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }

        .store-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
        }

        .store-product-card {
            background: var(--store-card-bg);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1px solid var(--store-border);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .store-product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .product-image-box {
            aspect-ratio: 1/1;
            background: #f1f5f9;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .product-image-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.5s;
        }

        .product-info {
            padding: 1.5rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .product-category {
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--store-primary);
            margin-bottom: 0.5rem;
        }

        .product-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: var(--store-text);
            margin: 0 0 0.75rem 0;
            line-height: 1.2;
        }

        .product-description {
            font-size: 0.85rem;
            color: var(--store-secondary);
            margin-bottom: 1.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.5;
        }

        .product-footer {
            margin-top: auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        .product-price {
            font-size: 1.2rem;
            font-weight: 900;
            color: var(--store-text);
        }

        .buy-button {
            background: var(--store-primary);
            color: white;
            border: none;
            padding: 0.75rem 1.25rem;
            border-radius: 1rem;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .buy-button:hover { opacity: 0.9; transform: scale(1.02); }

        .store-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.3rem 0.8rem;
            border-radius: 9999px;
            font-size: 0.65rem;
            font-weight: 900;
            text-transform: uppercase;
            z-index: 10;
        }

        .badge-promo { background: #fee2e2; color: #ef4444; }
        .badge-amber { background: var(--amber-50); color: var(--amber-600); border: 1px solid #fde68a; }

        .loading { text-align: center; padding: 4rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; }

        /* Auction Specifics */
        .bid-controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .bid-btn {
            background: var(--amber-50);
            color: var(--amber-600);
            border: 1px solid #fde68a;
            padding: 0.5rem;
            border-radius: 0.75rem;
            font-weight: 800;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .bid-btn:hover { background: #fef3c7; }

        .auction-status {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 1rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .winner-box {
            background: #ecfdf5;
            border: 1px solid #10b981;
            color: #065f46;
            padding: 1rem;
            border-radius: 1rem;
            text-align: center;
            font-weight: 800;
            font-size: 0.9rem;
        }
    `;

    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        document.head.appendChild(script);
    }

    async function getOwnerIdByDomain(supabase, domain) {
        const { data } = await supabase.from('wisbe_users').select('id, whatsapp_number').ilike('domain', domain).maybeSingle();
        return data;
    }

    class WisbeStore extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); ${COMMON_CSS}</style><div class="wisbe-store-container"><div class="loading">Cargando Tienda...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const user = await getOwnerIdByDomain(supabase, domain);
            if (!user) return;
            const { data: products } = await supabase.from('wisbe_store_products').select('*').eq('owner_id', user.id).eq('is_active', true).order('created_at', { ascending: false });
            this.renderProducts(products || [], user.whatsapp_number);
        }
        renderProducts(products, whatsapp) {
            const container = this.shadowRoot.querySelector('.wisbe-store-container');
            if (products.length === 0) { container.innerHTML = '<div class="loading">No hay productos.</div>'; return; }
            container.innerHTML = `<div class="store-grid">${products.map(p => `
                <div class="store-product-card">
                    <div class="product-image-box"><img src="${p.image_url || ''}"></div>
                    <div class="product-info">
                        <span class="product-category">${p.category || ''}</span>
                        <h3 class="product-title">${p.title}</h3>
                        <div class="product-footer">
                            <span class="product-price">$${p.price}</span>
                            <button class="buy-button" onclick="window.open('https://wa.me/${(whatsapp||'').replace(/\D/g,'')}?text=Interés: ${encodeURIComponent(p.title)}', '_blank')">Comprar</button>
                        </div>
                    </div>
                </div>`).join('')}</div>`;
        }
    }

    class WisbeStoreAuctions extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); ${COMMON_CSS}</style><div class="wisbe-auctions-container"><div class="loading">Sincronizando Subastas...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const user = await getOwnerIdByDomain(supabase, domain);
            if (!user) return;

            const { data: auctions } = await supabase.from('wisbe_store_auctions').select('*, bids:wisbe_store_bids(*)').eq('owner_id', user.id).eq('is_active', true);
            this.renderAuctions(auctions || [], user.whatsapp_number, supabase);
        }

        renderAuctions(auctions, whatsapp, supabase) {
            const container = this.shadowRoot.querySelector('.wisbe-auctions-container');
            if (auctions.length === 0) { container.innerHTML = '<div class="loading">No hay subastas activas.</div>'; return; }

            container.innerHTML = `<div class="store-grid"></div>`;
            const grid = container.querySelector('.store-grid');

            auctions.forEach(a => {
                const card = document.createElement('div');
                card.className = 'store-product-card';
                const now = new Date();
                const end = new Date(a.ends_at);
                const isFinished = now > end;

                const sortedBids = (a.bids || []).sort((x, y) => y.amount - x.amount);
                const currentBid = sortedBids.length > 0 ? sortedBids[0].amount : a.initial_bid;
                const winner = sortedBids.length > 0 ? sortedBids[0].bidder_name : null;

                card.innerHTML = `
                    <div class="product-image-box">
                        <img src="${a.image_url || ''}">
                        <span class="store-badge badge-amber">${isFinished ? 'Finalizada' : 'En Vivo'}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${a.title}</h3>
                        <div class="auction-status">
                            <p style="font-size:0.7rem; font-weight:800; color:var(--store-secondary); text-transform:uppercase; margin:0 0 0.25rem;">Puja Actual</p>
                            <p style="font-size:1.5rem; font-weight:900; color:var(--amber-600); margin:0;">$${parseFloat(currentBid).toFixed(2)}</p>
                            <p style="font-size:0.6rem; color:var(--store-secondary); margin-top:0.5rem;"><i class="far fa-clock"></i> ${isFinished ? 'Terminó' : 'Termina: ' + end.toLocaleString()}</p>
                        </div>

                        ${isFinished && winner ? `
                            <div class="winner-box">🏆 Ganador: ${winner}</div>
                        ` : ''}

                        ${!isFinished ? `
                            <div style="margin-top:auto;">
                                <p style="font-size:0.7rem; font-weight:800; color:var(--store-secondary); text-transform:uppercase; margin-bottom:0.5rem;">Pujar Ahora</p>
                                <div class="bid-controls">
                                    ${(a.fixed_increments || [5,10,20,50]).map(inc => `<button class="bid-btn" data-inc="${inc}">+$${inc}</button>`).join('')}
                                </div>
                                ${a.allow_free_bids ? `
                                    <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                                        <input type="number" class="free-bid-input" placeholder="Monto" style="flex-grow:1; border:1px solid var(--store-border); border-radius:0.75rem; padding:0.5rem; font-size:0.75rem;">
                                        <button class="buy-button bid-submit" style="padding:0.5rem 1rem;">Pujar</button>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;

                // Bid Handlers
                card.querySelectorAll('.bid-btn').forEach(btn => {
                    btn.onclick = () => this.placeBid(a, parseFloat(currentBid) + parseFloat(btn.dataset.inc), whatsapp, supabase);
                });
                const submitBtn = card.querySelector('.bid-submit');
                if (submitBtn) {
                    submitBtn.onclick = () => {
                        const val = card.querySelector('.free-bid-input').value;
                        if (val > currentBid) this.placeBid(a, val, whatsapp, supabase);
                        else alert('La puja debe ser mayor a la actual');
                    };
                }

                grid.appendChild(card);
            });
        }

        async placeBid(auction, amount, whatsapp, supabase) {
            const name = prompt('Tu Nombre:');
            const contact = prompt('Tu WhatsApp/Contacto (Para avisarte si ganas):');
            if (!name || !contact) return;

            const { error } = await supabase.from('wisbe_store_bids').insert([{
                auction_id: auction.id,
                bidder_name: name,
                bidder_contact: contact,
                amount: amount
            }]);

            if (error) alert('Error al pujar: ' + error.message);
            else {
                alert('¡Puja realizada con éxito!');
                this.render(); // Refresh
            }
        }
    }

    customElements.define('wisbe-store', WisbeStore);
    customElements.define('wisbe-store-auctions', WisbeStoreAuctions);
})();
