(function() {
    const CONFIG = {
        SUPABASE_URL: 'https://wwcmtqqbxdamxebkfsqk.supabase.co',
        SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y210cXFieGRhbXhlYmtmc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUzNzksImV4cCI6MjA5MDA4MTM3OX0.4C5gGKxJrpF5BS8FfEAu8FLa9VudEHxCYxwwtb991Io'
    };

    // Load Supabase and FontAwesome if not present
    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        document.head.appendChild(script);
    }

    const commonStyles = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        :host {
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #0f172a;
        }
        * { box-sizing: border-box; }
        .grid {
            display: grid;
            gap: 2.5rem;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .card {
            background: white;
            border-radius: 50px;
            border: 1px solid #f1f5f9;
            overflow: hidden;
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
        }
        .card:hover {
            transform: translateY(-12px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border-color: #10b981;
        }
        .card-image {
            height: 256px;
            position: relative;
            background: #f1f5f9;
            overflow: hidden;
        }
        .card-image img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 1s;
        }
        .card:hover .card-image img { transform: scale(1.1); }
        .badge {
            position: absolute; top: 1.5rem; left: 1.5rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            padding: 0.5rem 1rem; border-radius: 1rem;
            font-size: 10px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.1em; color: #059669;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .card-content { padding: 2.5rem; flex-grow: 1; display: flex; flex-direction: column; }
        .card-title {
            font-size: 1.5rem; font-weight: 900; color: #1e293b;
            margin-bottom: 1.5rem; line-height: 1.2; letter-spacing: -0.025em;
        }
        .card-stats {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.5rem 0; margin-bottom: 2rem;
            border-top: 1px solid #f8fafc; border-bottom: 1px solid #f8fafc;
            font-size: 10px; font-weight: 900; text-transform: uppercase;
            letter-spacing: 0.1em; color: #94a3b8;
        }
        .stat-val { font-size: 1.5rem; color: #059669; display: block; margin-bottom: 0.25rem; }
        .stat-val.dark { color: #1e293b; }
        .btn {
            width: 100%; padding: 1.25rem; border-radius: 30px;
            font-size: 12px; font-weight: 900; text-transform: uppercase;
            letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s;
            border: none; text-align: center; background: #0f172a; color: white;
        }
        .btn:hover { background: #059669; box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.2); }

        /* Modal */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px); z-index: 10000;
            display: none; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-container {
            background: white; width: 100%; max-width: 1100px; max-height: 95vh;
            border-radius: 60px; overflow: hidden; display: flex; flex-direction: column;
            position: relative; animation: modalIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (min-width: 1024px) { .modal-container { flex-direction: row; } }
        .modal-image { width: 100%; height: 320px; position: relative; }
        @media (min-width: 1024px) { .modal-image { width: 42%; height: auto; } }
        .modal-image img { width: 100%; height: 100%; object-fit: cover; }
        .modal-image-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 3rem; display: flex; flex-direction: column; justify-content: flex-end;
        }
        .modal-content { flex-grow: 1; padding: 3rem; overflow-y: auto; background: white; position: relative; }
        @media (min-width: 1024px) { .modal-content { width: 58%; padding: 4rem; } }
        .close-btn {
            position: absolute; top: 2rem; right: 2rem; width: 3rem; height: 3rem;
            background: #f8fafc; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; cursor: pointer; color: #94a3b8; border: none;
            font-size: 1.5rem; transition: all 0.3s; z-index: 10;
        }
        .close-btn:hover { background: #fee2e2; color: #ef4444; }

        .macro-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 4rem; }
        .macro-card { background: #f8fafc; padding: 1.5rem; border-radius: 35px; text-align: center; border: 1px solid #f1f5f9; }
        .macro-val { display: block; font-size: 1.75rem; font-weight: 900; color: #059669; margin-bottom: 0.25rem; }
        .macro-val.dark { color: #1e293b; }
        .macro-lbl { font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }

        .section-title { font-size: 1.25rem; font-weight: 900; color: #1e293b; text-transform: uppercase; letter-spacing: -0.025em; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .section-num { width: 2rem; height: 2rem; background: #ecfdf5; color: #059669; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
        .ingredients-list { padding-left: 1.5rem; border-left: 2px solid #ecfdf5; color: #475569; font-style: italic; font-size: 14px; line-height: 1.8; margin-bottom: 4rem; }
        .instructions-box { background: #f8fafc; padding: 2.5rem; border-radius: 40px; border: 2px dashed #e2e8f0; color: #475569; font-size: 14px; line-height: 1.6; }

        .loading { padding: 5rem; text-align: center; color: #94a3b8; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; }
    `;

    function cleanData(data) {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return data.split('\n').filter(x => x.trim());
        }
    }

    async function getOwnerIdByDomain(supabase, domain) {
        if (!domain) return null;
        const { data } = await supabase.from('wisbe_users').select('id').ilike('domain', domain.trim()).maybeSingle();
        return data ? data.id : null;
    }

    class WisbeGymNutricion extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="loading">Sincronizando Nutrición...</div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) { this.shadowRoot.innerHTML = `<div class="loading">Dominio no configurado (${domain})</div>`; return; }

            const { data: recipes } = await supabase.from('gym_recipes').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!recipes || recipes.length === 0) { this.shadowRoot.innerHTML = `<div class="loading">Aún no hay recetas disponibles.</div>`; return; }

            this.shadowRoot.querySelector('.loading').remove();
            const grid = document.createElement('div'); grid.className = 'grid';
            recipes.forEach(r => {
                const card = document.createElement('div'); card.className = 'card';
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${r.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80'}">
                        <div class="badge">${r.diet_type || 'Nutrición'}</div>
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
            this.shadowRoot.appendChild(grid);
            this.shadowRoot.appendChild(Object.assign(document.createElement('div'), { id: 'modal-root' }));
        }
        openModal(r) {
            const root = this.shadowRoot.getElementById('modal-root');
            root.innerHTML = `
                <div class="modal-overlay" id="overlay" style="display:flex">
                    <div class="modal-container">
                        <button class="close-btn" id="close-modal">&times;</button>
                        <div class="modal-image">
                            <img src="${r.image_url || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80'}">
                            <div class="modal-image-overlay">
                                <div style="background:#10b981; color:white; padding:0.5rem 1rem; border-radius:1rem; font-size:10px; font-weight:900; text-transform:uppercase; margin-bottom:1rem; width:fit-content;">${r.diet_type || 'Maestro'}</div>
                                <h2 style="font-size:3rem; font-weight:900; color:white; margin:0; line-height:0.9;">${r.title}</h2>
                            </div>
                        </div>
                        <div class="modal-content">
                            <div class="macro-grid">
                                <div class="macro-card"><span class="macro-val">${r.calories || 0}</span><span class="macro-lbl">Kcal</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.protein || 0}</span><span class="macro-lbl">Proteinas</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.carbs || 0}</span><span class="macro-lbl">Carbs</span></div>
                                <div class="macro-card"><span class="macro-val dark">${r.fats || 0}</span><span class="macro-lbl">Grasas</span></div>
                            </div>
                            <div class="section-title"><div class="section-num">01</div>Ingredientes</div>
                            <div class="ingredients-list">${cleanData(r.ingredients).join('<br>')}</div>
                            <div class="section-title"><div class="section-num">02</div>Preparación</div>
                            <div class="instructions-box">${cleanData(r.instructions).join('<br><br>')}</div>
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
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="loading">Cargando Rutinas...</div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) return;
            const { data } = await supabase.from('gym_routines').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!data || data.length === 0) { this.shadowRoot.innerHTML = `<div class="loading">No hay rutinas publicadas</div>`; return; }
            this.shadowRoot.querySelector('.loading').remove();
            const grid = document.createElement('div'); grid.className = 'grid';
            data.forEach(r => {
                grid.innerHTML += `
                    <div class="card" style="padding: 2.5rem; cursor:pointer">
                        <div style="width:4rem; height:4rem; background:#eff6ff; color:#3b82f6; border-radius:1.25rem; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:2rem; border:1px solid #dbeafe;"><i class="fas fa-dumbbell"></i></div>
                        <h3 class="card-title" style="margin-bottom:0.5rem">${r.title}</h3>
                        <div style="font-size:10px; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:2rem;">
                            <span style="background:#f8fafc; padding:0.25rem 0.5rem; border-radius:4px; border:1px solid #f1f5f9; margin-right:1rem">${r.difficulty_level}</span>
                            <span>${r.plan_duration_weeks} Semanas</span>
                        </div>
                        <div style="margin-top:auto; padding-top:1.5rem; border-top:1px solid #f8fafc; color:#3b82f6; font-size:10px; font-weight:900; text-transform:uppercase;">Explorar Plan <i class="fas fa-chevron-right"></i></div>
                    </div>
                `;
            });
            this.shadowRoot.appendChild(grid);
        }
    }

    class WisbeGymStaff extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        static get observedAttributes() { return ['domain']; }
        attributeChangedCallback() { this.render(); }
        async render() {
            const domain = this.getAttribute('domain');
            this.shadowRoot.innerHTML = `<style>${commonStyles}</style><div class="loading">Cargando Staff...</div>`;
            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            const supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
            const ownerId = await getOwnerIdByDomain(supabase, domain);
            if (!ownerId) return;
            const { data } = await supabase.from('gym_trainers').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
            if (!data || data.length === 0) { this.shadowRoot.innerHTML = `<div class="loading">No hay staff registrado</div>`; return; }
            this.shadowRoot.querySelector('.loading').remove();
            const grid = document.createElement('div'); grid.className = 'grid';
            data.forEach(t => {
                grid.innerHTML += `
                    <div class="card" style="align-items:center; text-align:center; padding:2.5rem">
                        <div style="width:7rem; height:7rem; border-radius:50%; border:4px solid #f8fafc; overflow:hidden; margin-bottom:2rem; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)">
                            <img src="${t.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}" style="width:100%; height:100%; object-fit:cover">
                        </div>
                        <div style="margin-bottom:1.5rem">
                            <span style="background:#eff6ff; color:#3b82f6; padding:0.25rem 1rem; border-radius:1rem; font-size:10px; font-weight:900; text-transform:uppercase; border:1px solid #dbeafe;">${t.specialty}</span>
                            <h3 class="card-title" style="margin-top:0.5rem">${t.full_name}</h3>
                        </div>
                        <p style="color:#64748b; font-size:14px; line-height:1.6; margin-bottom:2rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden">${t.bio || 'Sin descripción.'}</p>
                        <div style="margin-top:auto; width:100%">${t.whatsapp_url ? `<a href="${t.whatsapp_url}" target="_blank" class="btn" style="text-decoration:none; background:#3b82f6; display:flex; align-items:center; justify-content:center; gap:0.5rem"><i class="fab fa-whatsapp"></i> Contactar</a>` : ''}</div>
                    </div>
                `;
            });
            this.shadowRoot.appendChild(grid);
        }
    }

    customElements.define('wisbe-gymnutricion', WisbeGymNutricion);
    customElements.define('wisbe-gymrutinas', WisbeGymRutinas);
    customElements.define('wisbe-gymstaff', WisbeGymStaff);
})();
