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

    const commonStyles = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');

        :host {
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #0f172a;
            --emerald-600: #059669;
            --emerald-500: #10b981;
            --emerald-100: #d1fae5;
            --emerald-50: #ecfdf5;
            --slate-50: #f8fafc;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --slate-400: #94a3b8;
            --slate-600: #475569;
            --slate-800: #1e293b;
            --slate-900: #0f172a;
            --slate-950: #020617;
        }

        * { box-sizing: border-box; }

        .widget-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .grid {
            display: grid;
            gap: 2.5rem;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .card {
            background: white;
            border-radius: 50px;
            border: 1px solid var(--slate-50);
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
            box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
            position: relative;
        }

        .card:hover {
            transform: translateY(-8px);
            box-shadow: 12px 12px 24px #c2cbd9, -12px -12px 24px #ffffff;
        }

        .card-image {
            height: 256px;
            position: relative;
            background: var(--slate-200);
            overflow: hidden;
        }

        .card-image img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 1s;
        }

        .card:hover .card-image img {
            transform: scale(1.1);
        }

        .badge {
            position: absolute; top: 1.5rem; left: 1.5rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            padding: 0.5rem 1rem; border-radius: 1rem;
            font-size: 10px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.1em; color: var(--emerald-600);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .card-content { padding: 2.5rem; flex-grow: 1; display: flex; flex-direction: column; }

        .card-title {
            font-size: 1.5rem; font-weight: 900; color: var(--slate-800);
            margin-bottom: 1.5rem; line-height: 1.2; letter-spacing: -0.025em;
            display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
        }

        .card-stats {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.5rem 0; margin-bottom: 2.5rem;
            border-top: 1px solid var(--slate-50); border-bottom: 1px solid var(--slate-50);
            font-size: 10px; font-weight: 900; text-transform: uppercase;
            letter-spacing: 0.1em; color: var(--slate-400);
        }

        .stat-item { text-align: center; }
        .stat-val { font-size: 1.5rem; color: var(--emerald-600); display: block; margin-bottom: 0.25rem; font-weight: 900; }
        .stat-val.dark { color: var(--slate-800); }

        .btn {
            width: 100%; padding: 1.25rem; border-radius: 24px;
            font-size: 12px; font-weight: 900; text-transform: uppercase;
            letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s;
            border: none; text-align: center; background: var(--slate-900); color: white;
            box-shadow: 4px 4px 8px #d1d9e6;
        }

        .btn:hover {
            background: var(--emerald-600);
            box-shadow: 6px 6px 12px rgba(16, 185, 129, 0.3);
        }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(8px); z-index: 10000;
            display: none; align-items: center; justify-content: center; padding: 20px;
        }

        .modal-container {
            background: white; width: 100%; max-width: 1050px; height: auto; max-height: 90vh;
            border-radius: 50px; overflow: hidden; display: flex; flex-direction: column;
            position: relative; animation: modalIn 0.4s ease-out;
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
        }

        @keyframes modalIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 1024px) { .modal-container { flex-direction: row; } }

        .modal-image-side {
            width: 100%; height: 300px; position: relative;
            flex-shrink: 0;
        }
        @media (min-width: 1024px) { .modal-image-side { width: 45%; height: auto; } }

        .modal-image-side img { width: 100%; height: 100%; object-fit: cover; }

        .modal-image-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%);
            padding: 2.5rem; display: flex; flex-direction: column; justify-content: flex-end;
        }

        .modal-content-side {
            flex-grow: 1; padding: 2rem; overflow-y: auto; background: white; position: relative;
            display: flex; flex-direction: column;
        }
        @media (min-width: 1024px) { .modal-content-side { width: 55%; padding: 3rem; } }

        .close-btn {
            position: absolute; top: 1.5rem; right: 1.5rem;
            width: 42px; height: 42px; border-radius: 50%;
            background: #dbeafe; color: #1e40af; border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .close-btn:hover {
            background: #bfdbfe;
            color: #1e3a8a;
            transform: scale(1.1) rotate(90deg);
        }

        .macro-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;
            width: 100%;
        }
        .macro-card { background: var(--slate-50); padding: 1.25rem 0.5rem; border-radius: 24px; text-align: center; border: 1px solid var(--slate-100); }
        .macro-val { display: block; font-size: 1.5rem; font-weight: 900; color: var(--emerald-600); margin-bottom: 0.25rem; }
        .macro-val.dark { color: var(--slate-800); }
        .macro-lbl { font-size: 8px; font-weight: 900; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; }

        .section-title {
            font-size: 1rem; font-weight: 900; color: var(--slate-800); text-transform: uppercase;
            letter-spacing: -0.01em; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem;
        }
        .section-num {
            width: 1.75rem; height: 1.75rem; background: var(--emerald-100); color: var(--emerald-600);
            border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 900;
        }

        .ingredients-list {
            padding: 1.25rem; background: white; border-radius: 1rem; color: var(--slate-600);
            font-size: 13px; line-height: 1.6; margin-bottom: 2rem; white-space: pre-wrap;
            border: 1px solid var(--slate-50);
        }

        .bio-datos-grid { display: grid; gap: 0.75rem; margin-bottom: 2rem; }
        .bio-item {
            background: var(--slate-50); padding: 0.75rem 1rem; border-radius: 12px;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;
            color: var(--slate-400); border: 1px solid var(--slate-100);
        }
        .bio-val { color: var(--slate-900); font-weight: 900; }
        .bio-val.emerald { color: var(--emerald-600); }

        .instructions-box {
            background: var(--slate-50); padding: 2rem; border-radius: 30px;
            border: 2px dashed var(--slate-200); color: var(--slate-600); font-size: 13px; line-height: 1.6;
            white-space: pre-wrap;
        }

        .loading { padding: 5rem; text-align: center; color: var(--slate-400); font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; }
    `;

    function cleanData(data) {
        if (!data) return [];
        if (typeof data === 'string') {
            let trimmed = data.trim();
            if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    return cleanData(parsed);
                } catch (e) {
                    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                        trimmed = trimmed.substring(1, trimmed.length - 1);
                    }
                }
            }
            return trimmed.split('\n')
                .map(x => x.trim().replace(/^"(.*)"$/, '$1').replace(/\\"/g, '"'))
                .filter(x => x && x !== 'null');
        }
        if (Array.isArray(data)) {
            return data.flatMap(item => cleanData(item));
        }
        return [String(data)];
    }

    async function getOwnerIdByDomain(supabase, domain) {
        if (!domain) return null;
        const { data } = await supabase.from('wisbe_users').select('id').ilike('domain', domain.trim()).maybeSingle();
        return data ? data.id : null;
    }

    class WisbeGymRecetas extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="widget-container"><div class="loading">Sincronizando Nutrición...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) { this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">Dominio no configurado (${domain})</div>`; return; }

            const { data: recipes } = await supabase.from('gym_recipes').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!recipes || recipes.length === 0) { this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">Aún no hay recetas disponibles.</div>`; return; }

            const container = this.shadowRoot.querySelector('.widget-container');
            container.innerHTML = '';
            const grid = document.createElement('div'); grid.className = 'grid';
            recipes.forEach(r => {
                const card = document.createElement('div'); card.className = 'card';
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'}">
                        <div class="badge">${r.category || 'Nutrición'}</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${r.title}</h3>
                        <div class="card-stats">
                            <div class="stat-item"><span class="stat-val">${r.calories || 0}</span>Kcal</div>
                            <div class="stat-item"><span class="stat-val dark">${r.protein || 0}g</span>Prote</div>
                        </div>
                        <button class="btn">Receta Master</button>
                    </div>
                `;
                card.querySelector('.btn').onclick = () => this.openModal(r);
                grid.appendChild(card);
            });
            container.appendChild(grid);
            this.shadowRoot.appendChild(Object.assign(document.createElement('div'), { id: 'modal-root' }));
        }
        openModal(r) {
            const root = this.shadowRoot.getElementById('modal-root');
            root.innerHTML = `
                <div class="modal-overlay" id="overlay" style="display:flex">
                    <div class="modal-container">
                        <button class="close-btn" id="close-modal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div class="modal-image-side">
                            <img src="${r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}">
                            <div class="modal-image-overlay">
                                <span style="background:var(--emerald-500); color:white; padding:0.4rem 1rem; border-radius:2rem; font-size:9px; font-weight:900; text-transform:uppercase; margin-bottom:0.75rem; width:fit-content; letter-spacing:0.15em;">${r.category || 'CENA'}</span>
                                <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0; line-height:1; letter-spacing:-0.04em;">${r.title}</h2>
                            </div>
                        </div>
                        <div class="modal-content-side">
                            <div class="macro-grid">
                                <div class="macro-card"><span class="macro-val">${r.calories || 0}</span><span class="macro-lbl">Kcal</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.protein || 0}</span><span class="macro-lbl">Proteínas</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.carbs || 0}</span><span class="macro-lbl">Carbs</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.fats || 0}</span><span class="macro-lbl">Grasas</span></div>
                            </div>

                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2.5rem;">
                                <div>
                                    <h4 class="section-title"><div class="section-num">01</div> Ingredientes</h4>
                                    <div class="ingredients-list">${cleanData(r.ingredients).join('<br>')}</div>
                                </div>
                                <div>
                                    <h4 class="section-title"><div class="section-num">02</div> Bio-Datos</h4>
                                    <div class="bio-datos-grid">
                                        <div class="bio-item"><span>⏱ Tiempo</span> <span class="bio-val">${r.prep_time || '20 min'}</span></div>
                                        <div class="bio-item"><span>🔪 Dificultad</span> <span class="bio-val emerald">${r.difficulty || 'Media'}</span></div>
                                        <div class="bio-item"><span>🥗 Estilo</span> <span class="bio-val">${r.diet_type || 'Equilibrada'}</span></div>
                                    </div>
                                </div>
                            </div>

                            <h4 class="section-title"><div class="section-num">03</div> Preparación Master</h4>
                            <div class="instructions-box">${cleanData(r.instructions).join('<br>')}</div>
                        </div>
                    </div>
                </div>
            `;
            root.querySelector('#close-modal').onclick = () => root.innerHTML = '';
            root.querySelector('#overlay').onclick = (e) => { if(e.target.id === 'overlay') root.innerHTML = ''; };
        }
    }

    class WisbeGymRutinas extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="widget-container"><div class="loading">Cargando Rutinas...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) return;
            const { data } = await supabase.from('gym_routines').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!data || data.length === 0) { this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">No hay rutinas publicadas</div>`; return; }

            const container = this.shadowRoot.querySelector('.widget-container');
            container.innerHTML = '';
            const grid = document.createElement('div'); grid.className = 'grid';
            data.forEach(r => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.padding = '2.5rem';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <div style="width:4rem; height:4rem; background:var(--emerald-50); color:var(--emerald-600); border-radius:1.25rem; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:2rem; border:1px solid var(--emerald-100);"><i class="fas fa-dumbbell"></i></div>
                    <h3 class="card-title" style="margin-bottom:0.5rem">${r.title}</h3>
                    <div style="font-size:10px; font-weight:900; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:2rem;">
                        <span style="background:var(--slate-50); padding:0.25rem 0.5rem; border-radius:4px; border:1px solid var(--slate-100); margin-right:1rem">${r.difficulty_level}</span>
                        <span>${r.plan_duration_weeks} Semanas</span>
                    </div>
                    <div style="margin-top:auto; padding-top:1.5rem; border-top:1px solid var(--slate-50); color:var(--emerald-600); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.1em;">Explorar Plan <i class="fas fa-chevron-right" style="margin-left:0.5rem"></i></div>
                `;
                grid.appendChild(card);
            });
            container.appendChild(grid);
        }
    }

    class WisbeGymStaff extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="widget-container"><div class="loading">Cargando Staff...</div></div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) return;
            const { data } = await supabase.from('gym_trainers').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!data || data.length === 0) { this.shadowRoot.querySelector('.widget-container').innerHTML = `<div class="loading">No hay staff registrado</div>`; return; }

            const container = this.shadowRoot.querySelector('.widget-container');
            container.innerHTML = '';
            const grid = document.createElement('div'); grid.className = 'grid';
            data.forEach(t => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.alignItems = 'center';
                card.style.textAlign = 'center';
                card.style.padding = '3rem';
                card.innerHTML = `
                    <div style="width:7rem; height:7rem; border-radius:50%; border:4px solid var(--slate-50); overflow:hidden; margin-bottom:2rem; box-shadow:0 10px 20px rgba(0,0,0,0.05)">
                        <img src="${t.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}" style="width:100%; height:100%; object-fit:cover">
                    </div>
                    <div style="margin-bottom:1.5rem">
                        <span style="background:var(--emerald-50); color:var(--emerald-600); padding:0.25rem 1rem; border-radius:1rem; font-size:10px; font-weight:900; text-transform:uppercase; border:1px solid var(--emerald-100); letter-spacing:0.1em;">${t.specialty}</span>
                        <h3 class="card-title" style="margin-top:1.5rem; margin-bottom:0">${t.full_name}</h3>
                    </div>
                    <p style="color:var(--slate-600); font-size:14px; line-height:1.6; margin-bottom:2.5rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden">${t.bio || 'Sin descripción.'}</p>
                    <div style="margin-top:auto; width:100%">${t.whatsapp_url ? `<a href="${t.whatsapp_url}" target="_blank" class="btn" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.75rem"><i class="fab fa-whatsapp"></i> Contactar</a>` : ''}</div>
                `;
                grid.appendChild(card);
            });
            container.appendChild(grid);
        }
    }

    customElements.define('wisbe-gym-recetas', WisbeGymRecetas);
    customElements.define('wisbe-gym-rutinas', WisbeGymRutinas);
    customElements.define('wisbe-gym-staff', WisbeGymStaff);
})();
