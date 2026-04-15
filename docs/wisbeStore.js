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
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wisbe-store-container, .wisbe-promos-container {
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

        .store-product-card:hover .product-image-box img {
            transform: scale(1.05);
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
            transition: opacity 0.2s, transform 0.2s;
            white-space: nowrap;
        }

        .buy-button:hover {
            opacity: 0.9;
            transform: scale(1.02);
        }

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
            letter-spacing: 0.05em;
        }

        .badge-promo { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; }
        .badge-out { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

        .loading { text-align: center; padding: 4rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; }
    `;

    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        document.head.appendChild(script);
    }

    class WisbeStore extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }

        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
                    ${COMMON_CSS}
                </style>
                <div class="wisbe-store-container">
                    <div class="loading"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando Tienda...</div>
                </div>
            `;

            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

            const { data: user } = await supabase.from('wisbe_users').select('id, whatsapp_number').ilike('domain', domain).maybeSingle();
            if (!user) {
                this.shadowRoot.querySelector('.loading').innerText = 'Tienda no encontrada';
                return;
            }

            this.whatsappNumber = user.whatsapp_number || '';

            const { data: products } = await supabase.from('wisbe_store_products')
                .select('*')
                .eq('owner_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            this.renderProducts(products || []);
        }

        renderProducts(products) {
            const container = this.shadowRoot.querySelector('.wisbe-store-container');
            if (products.length === 0) {
                container.innerHTML = '<div class="loading">No hay productos disponibles actualmente.</div>';
                return;
            }

            container.innerHTML = `
                <div class="store-grid">
                    ${products.map(p => `
                        <div class="store-product-card">
                            <div class="product-image-box">
                                <img src="${p.image_url || 'https://via.placeholder.com/300'}" alt="${p.title}">
                                ${p.stock <= 0 ? '<span class="store-badge badge-out">Agotado</span>' : ''}
                            </div>
                            <div class="product-info">
                                <span class="product-category">${p.category || 'Producto'}</span>
                                <h3 class="product-title">${p.title}</h3>
                                <p class="product-description">${p.description || ''}</p>
                                <div class="product-footer">
                                    <span class="product-price">$${parseFloat(p.price).toFixed(2)}</span>
                                    <button class="buy-button" onclick="window.open('https://wa.me/${this.whatsappNumber.replace(/\D/g,'')}?text=Hola, me interesa el producto: ${encodeURIComponent(p.title)}', '_blank')">
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    class WisbeStorePromos extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }

        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
                    ${COMMON_CSS}
                </style>
                <div class="wisbe-promos-container">
                    <div class="loading">Buscando ofertas...</div>
                </div>
            `;

            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

            const { data: user } = await supabase.from('wisbe_users').select('id, whatsapp_number').ilike('domain', domain).maybeSingle();
            if (!user) return this.shadowRoot.innerHTML = '';

            this.whatsappNumber = user.whatsapp_number || '';

            const { data: promos } = await supabase.from('wisbe_store_promos')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            this.renderPromos(promos || []);
        }

        renderPromos(promos) {
            const container = this.shadowRoot.querySelector('.wisbe-promos-container');
            if (promos.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = `
                <div class="store-grid">
                    ${promos.map(p => `
                        <div class="store-product-card" style="border-color: #f472b6;">
                            <div class="product-image-box" style="background: #fdf2f8;">
                                <img src="${p.image_url || 'https://via.placeholder.com/300'}" alt="${p.title}">
                                <span class="store-badge badge-promo">${p.type === 'promo' ? 'OFERTA' : 'PACK'}</span>
                            </div>
                            <div class="product-info">
                                <h3 class="product-title">${p.title}</h3>
                                <p class="product-description">${p.description || ''}</p>
                                <div class="product-footer">
                                    <span class="product-price" style="color: #db2777;">$${parseFloat(p.price).toFixed(2)}</span>
                                    <button class="buy-button" style="background: #db2777;" onclick="window.open('https://wa.me/${this.whatsappNumber.replace(/\D/g,'')}?text=Hola, me interesa esta oferta: ${encodeURIComponent(p.title)}', '_blank')">
                                        Aprovechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    if (!customElements.get('wisbe-store')) {
        customElements.define('wisbe-store', WisbeStore);
    }
    if (!customElements.get('wisbe-store-promos')) {
        customElements.define('wisbe-store-promos', WisbeStorePromos);
    }
})();
