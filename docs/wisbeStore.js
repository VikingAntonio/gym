(function() {
    const CONFIG = {
        SUPABASE_URL: 'https://wwcmtqqbxdamxebkfsqk.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y210cXFieGRhbXhlYmtmc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUzNzksImV4cCI6MjA5MDA4MTM3OX0.4C5gGKxJrpF5BS8FfEAu8FLa9VudEHxCYxwwtb991Io'
    };

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
                    @import url('https://wisbe.xyz/wisbeStore.css');
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    :host { display: block; min-height: 200px; }
                    .loading { text-align: center; padding: 4rem; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
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
                                    <button class="buy-button" onclick="window.open('https://wa.me/${this.whatsappNumber}?text=Hola, me interesa el producto: ${p.title}', '_blank')">
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
                    @import url('https://wisbe.xyz/wisbeStore.css');
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    :host { display: block; }
                    .loading { text-align: center; padding: 2rem; color: #64748b; font-size: 0.75rem; font-weight: 800; }
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
                                    <button class="buy-button" style="background: #db2777;" onclick="window.open('https://wa.me/${this.whatsappNumber}?text=Hola, me interesa esta oferta: ${p.title}', '_blank')">
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
