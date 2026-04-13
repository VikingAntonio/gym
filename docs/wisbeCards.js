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

    class WisbeCards extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._activeHandler = null;
            this._eventsBound = false;
        }

        static get observedAttributes() { return ['domain', 'username', 'user_id']; }
        attributeChangedCallback() { this.render(); }

        async render() {
            const urlParams = new URLSearchParams(window.location.search);
            const domain = this.getAttribute('domain');
            const username = this.getAttribute('username') || urlParams.get('u');
            const attrUserId = this.getAttribute('user_id');

            this.shadowRoot.innerHTML = `
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

                    :host {
                        display: block;
                        font-family: 'Poppins', sans-serif;
                        --bs-primary: #0d6efd;
                        --bs-body-bg: #212529;
                        --bs-body-color: #dee2e6;
                    }

                    .card-preview-container {
                        max-width: 450px;
                        margin: 20px auto;
                        background: var(--bs-body-bg);
                        border-radius: 30px;
                        overflow: hidden;
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: var(--bs-body-color);
                    }

                    .card-header-design {
                        height: 200px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        position: relative;
                        display: flex;
                        align-items: flex-end;
                        justify-content: center;
                        padding-bottom: 50px;
                        background-size: cover !important;
                        background-position: center !important;
                    }

                    .profile-img-container {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        border: 5px solid var(--bs-body-bg);
                        background: #eee;
                        position: absolute;
                        bottom: -50px;
                        overflow: hidden;
                    }

                    .profile-img-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .card-body-content {
                        padding: 60px 20px 20px;
                        text-align: center;
                    }

                    .portfolio-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 10px;
                        margin-top: 20px;
                    }

                    .portfolio-item {
                        aspect-ratio: 1/1;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 10px;
                        overflow: hidden;
                        position: relative;
                    }

                    .portfolio-item img, .portfolio-item video {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .ba-list {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-top: 25px;
                        padding: 0 10px;
                    }

                    .before-after-container {
                        position: relative;
                        width: 100%;
                        aspect-ratio: 1/1;
                        overflow: hidden;
                        border-radius: 20px;
                        user-select: none;
                        cursor: pointer;
                        transition: transform 0.3s;
                    }

                    .before-after-container:hover {
                        transform: scale(1.02);
                    }

                    /* Slider Core */
                    .comparison-slider .ba-before,
                    .comparison-slider .ba-after {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-size: cover;
                        background-position: center;
                    }

                    .comparison-slider .ba-after {
                        width: 50%;
                        z-index: 2;
                        overflow: hidden;
                        border-right: 3px solid white;
                    }

                    .ba-after-inner {
                        width: 100%;
                        height: 100%;
                        background-size: cover;
                        background-position: center;
                    }

                    .ba-handle {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 50%;
                        width: 4px;
                        background: white;
                        z-index: 10;
                        transform: translateX(-50%);
                        cursor: ew-resize;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .ba-handle::after {
                        content: '';
                        width: 36px;
                        height: 36px;
                        background: white;
                        border-radius: 50%;
                        box-shadow: 0 0 15px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m18 8 4 4-4 4M6 8l-4 4 4 4'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 20px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    /* Zoom Modal */
                    .ba-zoom-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.9);
                        backdrop-filter: blur(10px);
                        z-index: 9999;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }

                    .ba-zoom-content {
                        background: white;
                        border-radius: 40px;
                        padding: 10px;
                        width: 100%;
                        max-width: 600px;
                        position: relative;
                        box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                    }

                    .ba-zoom-close {
                        position: absolute;
                        top: -50px;
                        right: 0;
                        width: 40px;
                        height: 40px;
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 24px;
                        transition: all 0.3s;
                    }

                    .social-icons-container {
                        display: flex;
                        justify-content: center;
                        gap: 15px;
                        margin-top: 20px;
                    }

                    .social-icon {
                        font-size: 1.5rem;
                        color: var(--bs-primary);
                        transition: transform 0.2s;
                        text-decoration: none;
                    }

                    .social-icon:hover {
                        transform: scale(1.2);
                    }

                    hr {
                        margin: 1.5rem 0;
                        color: inherit;
                        border: 0;
                        border-top: 1px solid;
                        opacity: .1;
                    }

                    .text-primary { color: var(--bs-primary) !important; }
                    .small { font-size: .875em; }
                    .text-muted { color: #6c757d !important; }
                    .fw-bold { font-weight: 700 !important; }
                    .text-start { text-align: left !important; }
                    .mb-1 { margin-bottom: .25rem !important; }
                    .mb-3 { margin-bottom: 1rem !important; }
                    .mb-4 { margin-bottom: 1.5rem !important; }

                    .loading { padding: 5rem; text-align: center; color: #6c757d; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; }
                </style>
                <div class="widget-container"><div class="loading">Sincronizando Tarjeta...</div></div>
            `;

            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

            let userId = attrUserId;
            if (!userId && domain) {
                const { data } = await supabase.from('wisbe_users').select('id').ilike('domain', domain.trim()).maybeSingle();
                userId = data?.id;
            } else if (!userId && username) {
                const { data } = await supabase.from('wisbe_users').select('id').ilike('username', username.trim()).maybeSingle();
                userId = data?.id;
            }

            if (!userId) {
                this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">Tarjeta no encontrada</div>`;
                return;
            }

            const { data: card, error } = await supabase.from('wisbe_cards').select('*').eq('user_id', userId).maybeSingle();
            if (!card) {
                this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">Esta tarjeta aún no ha sido configurada</div>`;
                return;
            }

            this.renderCard(card);
        }

        renderCard(data) {
            const container = this.shadowRoot.querySelector('.widget-container');
            const hc = data.header_config || {};
            const sm = data.social_media || {};
            const portfolio = data.portfolio || [];
            const ba = data.before_after || [];

            // Inject Zoom Overlay
            if (!this.shadowRoot.querySelector('.ba-zoom-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'ba-zoom-overlay';
                overlay.innerHTML = `
                    <div class="ba-zoom-content">
                        <div class="ba-zoom-close">×</div>
                        <div class="ba-zoom-body" style="aspect-ratio: 1/1; width: 100%; border-radius: 30px; overflow: hidden; position: relative;"></div>
                    </div>
                `;
                overlay.querySelector('.ba-zoom-close').onclick = () => overlay.style.display = 'none';
                overlay.onclick = (e) => { if (e.target === overlay) overlay.style.display = 'none'; };
                this.shadowRoot.appendChild(overlay);
            }

            const headerBackground = hc.header_image_url
                ? `url('${hc.header_image_url}')`
                : (hc.header_color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

            container.innerHTML = `
                <div class="card-preview-container">
                    <div class="card-header-design" style="background: ${headerBackground}">
                        <div class="profile-img-container">
                            <img src="${hc.profile_url || 'https://via.placeholder.com/150'}" alt="Perfil">
                        </div>
                    </div>

                    <div class="card-body-content">
                        <h3 class="fw-bold mb-1">${hc.name || 'Tu Nombre'}</h3>
                        <p class="text-primary mb-3">${hc.title || 'Tu Profesión'}</p>
                        <p class="small text-muted mb-4">${hc.bio || ''}</p>

                        <div class="social-icons-container">
                            ${this.renderSocials(sm)}
                        </div>

                        <hr>

                        <h6 class="fw-bold text-start mb-3">Mi Portfolio</h6>
                        <div class="portfolio-grid">
                            ${this.renderPortfolio(portfolio)}
                        </div>

                        ${ba.length > 0 ? `
                            <hr>
                            <h6 class="fw-bold text-start mb-3">Trabajos Realizados</h6>
                            <div class="ba-list">
                                ${this.renderBAPairs(ba)}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        renderBAPairs(ba) {
            let pairs = ba;
            if (ba.length === 2 && typeof ba[0] === 'string') {
                pairs = [{before: ba[0], after: ba[1]}];
            }

            setTimeout(() => this.initComparisonSliders('.ba-list .comparison-slider'), 100);

            return pairs.map((pair, idx) => `
                <div class="before-after-container comparison-slider"
                     data-before="${pair.before}"
                     data-after="${pair.after}">
                    <div class="ba-before" style="background-image: url('${pair.before}')"></div>
                    <div class="ba-after" style="width: 50%;">
                        <div class="ba-after-inner" style="background-image: url('${pair.after}')"></div>
                    </div>
                    <div class="ba-handle"></div>
                </div>
            `).join('');
        }

        openZoom(pair) {
            const overlay = this.shadowRoot.querySelector('.ba-zoom-overlay');
            const body = overlay.querySelector('.ba-zoom-body');
            overlay.style.display = 'flex';
            body.innerHTML = `
                <div class="comparison-slider" style="width: 100%; height: 100%; position: relative;">
                    <div class="ba-before" style="background-image: url('${pair.before}')"></div>
                    <div class="ba-after" style="width: 50%;">
                        <div class="ba-after-inner" style="background-image: url('${pair.after}')"></div>
                    </div>
                    <div class="ba-handle"></div>
                </div>
            `;
            this.initComparisonSliders('.ba-zoom-body .comparison-slider');
        }

        initComparisonSliders(selector) {
            const sliders = this.shadowRoot.querySelectorAll(selector);

            if (!this._eventsBound) {
                window.addEventListener('mousemove', (e) => {
                    if (this._activeHandler) this._activeHandler.move(e);
                });
                window.addEventListener('touchmove', (e) => {
                    if (this._activeHandler) this._activeHandler.move(e);
                }, { passive: false });
                window.addEventListener('mouseup', () => {
                    if (this._activeHandler) this._activeHandler.isDragging = false;
                    this._activeHandler = null;
                });
                window.addEventListener('touchend', () => {
                    if (this._activeHandler) this._activeHandler.isDragging = false;
                    this._activeHandler = null;
                });
                this._eventsBound = true;
            }

            sliders.forEach(slider => {
                const after = slider.querySelector('.ba-after');
                const inner = slider.querySelector('.ba-after-inner');
                const handle = slider.querySelector('.ba-handle');

                const handler = {
                    isDragging: false,
                    move: (e) => {
                        if (!handler.isDragging) return;
                        const rect = slider.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        let x = clientX - rect.left;
                        if (x < 0) x = 0;
                        if (x > rect.width) x = rect.width;
                        const percent = (x / rect.width) * 100;
                        after.style.width = `${percent}%`;
                        handle.style.left = `${percent}%`;
                    }
                };

                const updateSizing = () => {
                    if (inner) inner.style.width = slider.offsetWidth + 'px';
                };
                window.addEventListener('resize', updateSizing);
                updateSizing();

                const start = (e) => {
                    handler.isDragging = true;
                    this._activeHandler = handler;
                    if (!e.touches) e.preventDefault();
                };

                handle.addEventListener('mousedown', start);
                handle.addEventListener('touchstart', start, { passive: false });

                if (slider.parentElement.classList.contains('ba-list')) {
                    slider.onclick = (e) => {
                        if (e.target.closest('.ba-handle')) return;
                        this.openZoom({
                            before: slider.dataset.before,
                            after: slider.dataset.after
                        });
                    };
                }
            });
        }

        renderSocials(sm) {
            const map = { facebook: 'fa-facebook-f', instagram: 'fa-instagram', linkedin: 'fa-linkedin-in', whatsapp: 'fa-whatsapp' };
            return Object.entries(sm).map(([key, val]) => {
                if (!val) return '';
                let href = val.startsWith('http') ? val : (key === 'whatsapp' ? `https://wa.me/${val.replace(/\D/g,'')}` : `https://${val}`);
                return `<a href="${href}" target="_blank" class="social-icon"><i class="fab ${map[key] || 'fa-link'}"></i></a>`;
            }).join('');
        }

        renderPortfolio(portfolio) {
            return portfolio.map(item => {
                const url = typeof item === 'string' ? item : item.url;
                const type = typeof item === 'string' ? 'image' : item.resource_type;
                if (type === 'video') {
                    return `<div class="portfolio-item"><video src="${url}" muted loop playsinline onmouseenter="this.play()" onmouseleave="this.pause()"></video></div>`;
                }
                return `<div class="portfolio-item"><img src="${url}"></div>`;
            }).join('');
        }
    }

    customElements.define('wisbe-cards', WisbeCards);
})();
