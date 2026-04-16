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
            --pink-600: #db2777;
            --pink-50: #fdf2f8;
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wisbe-store-container, .wisbe-promos-container, .wisbe-auctions-container {
            max-width: 1200px;
            margin: 4rem auto;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .store-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2.5rem;
            width: 100%;
            justify-content: center;
        }

        .store-product-card {
            background: var(--store-card-bg);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1px solid var(--store-border);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
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
        .badge-pink { background: var(--pink-50); color: var(--pink-600); border: 1px solid #fbcfe8; }

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

        /* Cart UI */
        #wisbe-cart-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 25px;
            box-shadow: 10px 10px 20px #bebebe, -10px -10px 20px #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s;
            border: none;
            color: var(--store-primary);
            font-size: 1.5rem;
        }
        #wisbe-cart-btn:hover { transform: scale(1.1); }
        #wisbe-cart-btn .count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            font-size: 0.7rem;
            font-weight: 900;
            padding: 0.2rem 0.5rem;
            border-radius: 999px;
            min-width: 20px;
            text-align: center;
        }

        #wisbe-cart-modal {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        #wisbe-cart-modal.open { display: flex; animation: fadeIn 0.3s ease; }

        .cart-content {
            background: #f8fafc;
            width: 100%;
            max-width: 500px;
            border-radius: 40px;
            padding: 2.5rem;
            box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
            position: relative;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .cart-header h2 { margin: 0; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; font-size: 1.2rem; }
        .close-cart { background: none; border: none; cursor: pointer; color: #64748b; font-size: 1.2rem; }

        .cart-items { flex-grow: 1; overflow-y: auto; margin-bottom: 2rem; padding-right: 0.5rem; }
        .cart-items::-webkit-scrollbar { width: 5px; }
        .cart-items::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: white;
            padding: 1rem;
            border-radius: 20px;
            margin-bottom: 1rem;
            border: 1px solid #e2e8f0;
        }
        .cart-item img { width: 50px; height: 50px; object-fit: cover; border-radius: 10px; }
        .cart-item-info { flex-grow: 1; }
        .cart-item-title { font-weight: 800; font-size: 0.85rem; margin-bottom: 0.2rem; }
        .cart-item-price { font-weight: 700; font-size: 0.8rem; color: var(--store-primary); }
        .cart-item-remove { background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.5rem; }

        .cart-footer { border-top: 1px dashed #cbd5e1; padding-top: 1.5rem; }
        .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-weight: 900; font-size: 1.1rem; }

        .checkout-btn {
            width: 100%;
            background: var(--store-primary);
            color: white;
            border: none;
            padding: 1.2rem;
            border-radius: 20px;
            font-weight: 800;
            font-size: 0.9rem;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
        }
        .checkout-btn:hover { opacity: 0.9; transform: translateY(-2px); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;

    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        document.head.appendChild(script);
    }

    async function getOwnerIdByDomain(supabase, domain) {
        if (!domain) return null;
        try {
            const { data, error } = await supabase.from('wisbe_users').select('id').ilike('domain', domain.trim()).maybeSingle();
            if (error || !data) {
                if (error) console.error('Error fetching user by domain:', error);
                return null;
            }

            // Fetch Store Settings
            const { data: settings } = await supabase.from('wisbe_store_settings').select('whatsapp_number, whatsapp_country_code, messenger_username').eq('owner_id', data.id).maybeSingle();
            data.settings = settings || {};

            return data;
        } catch (e) {
            console.error('Exception fetching user by domain:', e);
            return null;
        }
    }

    const WisbeCart = {
        items: JSON.parse(localStorage.getItem('wisbe_cart') || '[]'),
        whatsapp: '',
        messenger: '',

        init() {
            if (document.getElementById('wisbe-cart-root')) return;
            const root = document.createElement('div');
            root.id = 'wisbe-cart-root';
            root.attachShadow({ mode: 'open' });
            document.body.appendChild(root);
            this.render();
        },

        addItem(item) {
            this.items.push(item);
            this.save();
            this.render();
            this.showToast('Added to cart!');
        },

        removeItem(index) {
            this.items.splice(index, 1);
            this.save();
            this.render();
        },

        save() {
            localStorage.setItem('wisbe_cart', JSON.stringify(this.items));
        },

        toggle() {
            const root = document.getElementById('wisbe-cart-root');
            const modal = root?.shadowRoot?.getElementById('wisbe-cart-modal');
            if (modal) modal.classList.toggle('open');
        },

        showToast(msg) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:100px; right:2rem; background:#1e293b; color:white; padding:1rem 2rem; border-radius:15px; font-weight:800; font-size:0.7rem; text-transform:uppercase; z-index:10001; animation:fadeIn 0.3s ease;';
            toast.innerText = msg;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                toast.style.transition = 'all 0.5s';
                setTimeout(() => toast.remove(), 500);
            }, 2000);
        },

        checkout(channel = 'whatsapp') {
            if (this.items.length === 0) return;

            const total = this.items.reduce((sum, i) => sum + i.price, 0);
            let text = `🛍️ *New Order - Wisbe Store*\n\n`;
            this.items.forEach((item, index) => {
                text += `${index + 1}. *${item.title}* - $${item.price.toFixed(2)}\n`;
            });
            text += `\n💰 *Total: $${total.toFixed(2)}*`;

            if (channel === 'whatsapp') {
                if (!this.whatsapp) {
                    this.showToast('WhatsApp not configured.');
                    return;
                }
                const cleanNumber = this.whatsapp.replace(/\D/g, '');
                const countryCode = this.whatsapp_country_code || '1';
                const waUrl = `https://wa.me/${countryCode}${cleanNumber}?text=${encodeURIComponent(text)}`;
                window.open(waUrl, '_blank');
            } else {
                if (!this.messenger) {
                    this.showToast('Messenger not configured.');
                    return;
                }
                let cleanMessenger = this.messenger.replace(/^(https?:\/\/)?(www\.)?m\.me\//, '');
                const messengerUrl = `https://m.me/${cleanMessenger}?text=${encodeURIComponent(text)}`;
                window.open(messengerUrl, '_blank');
            }
        },

        render() {
            const root = document.getElementById('wisbe-cart-root');
            if (!root || !root.shadowRoot) return;

            const total = this.items.reduce((sum, i) => sum + i.price, 0);

            root.shadowRoot.innerHTML = `
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    ${COMMON_CSS.replace(':host', '.cart-scope')}
                    .cart-scope {
                        --store-primary: #2563eb;
                        --store-secondary: #64748b;
                        --store-bg: #f8fafc;
                        --store-card-bg: #ffffff;
                        --store-text: #0f172a;
                        --store-border: #e2e8f0;
                    }
                </style>
                <div class="cart-scope">
                <button id="wisbe-cart-btn" onclick="window.WisbeCart.toggle()">
                    <i class="fas fa-shopping-cart"></i>
                    ${this.items.length > 0 ? `<span class="count">${this.items.length}</span>` : ''}
                </button>

                <div id="wisbe-cart-modal">
                    <div class="cart-content">
                        <div class="cart-header">
                            <h2>Your Cart</h2>
                            <button class="close-cart" onclick="window.WisbeCart.toggle()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="cart-items">
                            ${this.items.length === 0 ? `
                                <div style="text-align:center; padding:3rem; color:#94a3b8;">
                                    <i class="fas fa-shopping-basket" style="font-size:3rem; margin-bottom:1rem; opacity:0.3;"></i>
                                    <p style="font-weight:700;">Your cart is empty</p>
                                </div>
                            ` : this.items.map((item, index) => `
                                <div class="cart-item">
                                    <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.title}">
                                    <div class="cart-item-info">
                                        <div class="cart-item-title">${item.title}</div>
                                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                                    </div>
                                    <button class="cart-item-remove" onclick="window.WisbeCart.removeItem(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>

                        <div class="cart-footer">
                            <div class="cart-total">
                                <span>Total</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                            <div style="display:grid; gap:1rem;">
                                <button class="checkout-btn" onclick="window.WisbeCart.checkout('whatsapp')" ${this.items.length === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                    <i class="fab fa-whatsapp"></i> Checkout via WhatsApp
                                </button>
                                ${this.messenger ? `
                                    <button class="checkout-btn" style="background:#0084ff;" onclick="window.WisbeCart.checkout('messenger')" ${this.items.length === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                        <i class="fab fa-facebook-messenger"></i> Checkout via Messenger
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            `;
        }
    };
    window.WisbeCart = WisbeCart; // Make it global for onclick handlers

    class WisbeStore extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); ${COMMON_CSS}</style><div class="wisbe-store-container"><div class="loading">Loading Store...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const user = await getOwnerIdByDomain(supabase, domain);

            const container = this.shadowRoot.querySelector('.wisbe-store-container');
            if (!user) {
                container.innerHTML = `<div class="loading">Domain not found or not configured.</div>`;
                return;
            }

            // Init Global Cart
            WisbeCart.whatsapp = user.settings?.whatsapp_number || '';
            WisbeCart.whatsapp_country_code = user.settings?.whatsapp_country_code || '1';
            WisbeCart.messenger = user.settings?.messenger_username || '';
            WisbeCart.init();

            const { data: products } = await supabase.from('wisbe_store_products').select('*').eq('owner_id', user.id).eq('is_active', true).order('created_at', { ascending: false });
            this.renderProducts(products || []);
        }
        renderProducts(products) {
            const container = this.shadowRoot.querySelector('.wisbe-store-container');
            if (products.length === 0) { container.innerHTML = '<div class="loading">No products available.</div>'; return; }
            container.innerHTML = `<div class="store-grid">${products.map(p => `
                <div class="store-product-card">
                    <div class="product-image-box"><img src="${p.image_url || ''}"></div>
                    <div class="product-info">
                        <span class="product-category">${p.category || 'PRODUCT'}</span>
                        <h3 class="product-title">${p.title}</h3>
                        ${p.description ? `<p class="product-description">${p.description}</p>` : ''}
                        <div class="product-footer">
                            <span class="product-price">$${parseFloat(p.price).toFixed(2)}</span>
                            <button class="buy-button" onclick="WisbeCart.addItem({id: '${p.id}', title: '${p.title.replace(/'/g, "\\'")}', price: ${p.price}, image: '${p.image_url}'})">Add to Cart</button>
                        </div>
                    </div>
                </div>`).join('')}</div>`;
        }
    }

    class WisbeStorePromos extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); ${COMMON_CSS}</style><div class="wisbe-promos-container"><div class="loading">Loading Promotions...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const user = await getOwnerIdByDomain(supabase, domain);

            const container = this.shadowRoot.querySelector('.wisbe-promos-container');
            if (!user) {
                container.innerHTML = `<div class="loading">Domain not found or not configured.</div>`;
                return;
            }

            // Init Global Cart
            WisbeCart.whatsapp = user.settings?.whatsapp_number || '';
            WisbeCart.whatsapp_country_code = user.settings?.whatsapp_country_code || '1';
            WisbeCart.messenger = user.settings?.messenger_username || '';
            WisbeCart.init();

            const { data: promos } = await supabase.from('wisbe_store_promos').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
            this.renderPromos(promos || []);
        }

        renderPromos(promos) {
            const container = this.shadowRoot.querySelector('.wisbe-promos-container');
            const now = new Date();
            const validPromos = promos.filter(p => !p.expires_at || new Date(p.expires_at) > now);

            if (validPromos.length === 0) {
                container.innerHTML = '<div class="loading">No active promotions at the moment.</div>';
                return;
            }

            container.innerHTML = `<div class="store-grid">${validPromos.map(p => `
                <div class="store-product-card">
                    <div class="product-image-box">
                        <img src="${p.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80'}">
                        <span class="store-badge badge-pink">${p.type === 'promo' ? 'DISCOUNT' : 'BUNDLE'}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.title}</h3>
                        ${p.description ? `<p class="product-description">${p.description}</p>` : ''}
                        <div class="product-footer">
                            <span class="product-price">$${parseFloat(p.price).toFixed(2)}</span>
                            <button class="buy-button" style="background:var(--pink-600);" onclick="WisbeCart.addItem({id: '${p.id}', title: '${p.title.replace(/'/g, "\\'")}', price: ${p.price}, image: '${p.image_url}'})">Add to Cart</button>
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
            this.shadowRoot.innerHTML = `<style>@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'); ${COMMON_CSS}</style><div class="wisbe-auctions-container"><div class="loading">Synchronizing Auctions...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const user = await getOwnerIdByDomain(supabase, domain);

            const container = this.shadowRoot.querySelector('.wisbe-auctions-container');
            if (!user) {
                container.innerHTML = `<div class="loading">Domain not found or not configured.</div>`;
                return;
            }

            // Init Global Cart (even if just for centering consistency)
            WisbeCart.whatsapp = user.settings?.whatsapp_number || '';
            WisbeCart.whatsapp_country_code = user.settings?.whatsapp_country_code || '1';
            WisbeCart.messenger = user.settings?.messenger_username || '';
            WisbeCart.init();

            const { data: auctions } = await supabase.from('wisbe_store_auctions').select('*, bids:wisbe_store_bids(*)').eq('owner_id', user.id).eq('is_active', true);
            this.renderAuctions(auctions || [], user.settings?.whatsapp_number || '', supabase);
        }

        renderAuctions(auctions, whatsapp, supabase) {
            const container = this.shadowRoot.querySelector('.wisbe-auctions-container');
            if (auctions.length === 0) { container.innerHTML = '<div class="loading">No active auctions.</div>'; return; }

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
                        <span class="store-badge badge-amber">${isFinished ? 'Finished' : 'Live'}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${a.title}</h3>
                        <div class="auction-status">
                            <p style="font-size:0.7rem; font-weight:800; color:var(--store-secondary); text-transform:uppercase; margin:0 0 0.25rem;">Current Bid</p>
                            <p style="font-size:1.5rem; font-weight:900; color:var(--amber-600); margin:0;">$${parseFloat(currentBid).toFixed(2)}</p>
                            <p style="font-size:0.6rem; color:var(--store-secondary); margin-top:0.5rem;"><i class="far fa-clock"></i> ${isFinished ? 'Finished' : 'Ends: ' + end.toLocaleString()}</p>
                        </div>

                        ${isFinished && winner ? `
                            <div class="winner-box">🏆 Winner: ${winner}</div>
                        ` : ''}

                        ${!isFinished ? `
                            <div style="margin-top:auto;">
                                <p style="font-size:0.7rem; font-weight:800; color:var(--store-secondary); text-transform:uppercase; margin-bottom:0.5rem;">Bid Now</p>
                                <div class="bid-controls">
                                    ${(a.fixed_increments || [5,10,20,50]).map(inc => `<button class="bid-btn" data-inc="${inc}">+$${inc}</button>`).join('')}
                                </div>
                                ${a.allow_free_bids ? `
                                    <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                                        <input type="number" class="free-bid-input" placeholder="Amount" style="flex-grow:1; border:1px solid var(--store-border); border-radius:0.75rem; padding:0.5rem; font-size:0.75rem;">
                                        <button class="buy-button bid-submit" style="padding:0.5rem 1rem;">Bid</button>
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
                        const val = parseFloat(card.querySelector('.free-bid-input').value);
                        if (!isNaN(val) && val > currentBid) this.placeBid(a, val, whatsapp, supabase);
                        else alert('Bid must be a valid number and greater than the current bid');
                    };
                }

                grid.appendChild(card);
            });
        }

        async placeBid(auction, amount, whatsapp, supabase) {
            const name = prompt('Your Name:');
            const contact = prompt('Your WhatsApp/Contact (To notify you if you win):');
            if (!name || !contact) return;

            const { error } = await supabase.from('wisbe_store_bids').insert([{
                auction_id: auction.id,
                bidder_name: name,
                bidder_contact: contact,
                amount: amount
            }]);

            if (error) alert('Error bidding: ' + error.message);
            else {
                alert('Bid placed successfully!');
                this.render(); // Refresh
            }
        }
    }

    customElements.define('wisbe-store', WisbeStore);
    customElements.define('wisbe-store-promos', WisbeStorePromos);
    customElements.define('wisbe-store-auctions', WisbeStoreAuctions);
})();
