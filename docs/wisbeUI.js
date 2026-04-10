(function() {
    const SUPABASE_URL = 'https://wwcmtqqbxdamxebkfsqk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y210cXFieGRhbXhlYmtmc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUzNzksImV4cCI6MjA5MDA4MTM3OX0.4C5gGKxJrpF5BS8FfEAu8FLa9VudEHxCYxwwtb991Io';

    if (typeof supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        document.head.appendChild(script);
    }

    const COMMON_STYLE = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        :host {
            display: block;
            font-family: 'Inter', sans-serif;
            color: #0f172a;
            --emerald-500: #10b981;
            --emerald-600: #059669;
            --emerald-100: #d1fae5;
            --slate-50: #f8fafc;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --slate-400: #94a3b8;
            --slate-500: #64748b;
            --slate-600: #475569;
            --slate-800: #1e293b;
            --slate-900: #0f172a;
            --slate-950: #020617;
        }

        .grid-layout {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2.5rem;
            padding: 1rem;
        }

        .item-card {
            background: white;
            border-radius: 50px;
            overflow: hidden;
            border: 1px solid var(--slate-50);
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            cursor: pointer;
            height: 100%;
        }

        .item-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
        }

        .card-image-wrapper {
            height: 256px;
            position: relative;
            overflow: hidden;
            background: var(--slate-200);
        }

        .card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 1s;
            filter: grayscale(0.2);
        }

        .item-card:hover .card-image {
            transform: scale(1.25);
            filter: grayscale(0);
        }

        .card-content {
            padding: 40px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: var(--slate-800);
            margin-bottom: 24px;
            line-height: 1.2;
            letter-spacing: -0.025em;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-transform: none;
        }

        .card-macros {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
            border-top: 1px solid var(--slate-50);
            border-bottom: 1px solid var(--slate-50);
            margin-bottom: 40px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--slate-400);
        }

        .macro-item {
            text-align: center;
        }

        .macro-value {
            display: block;
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 4px;
        }

        .macro-highlight { color: var(--emerald-600); }
        .macro-dark { color: var(--slate-800); }

        .btn-action {
            width: 100%;
            padding: 20px;
            background: var(--slate-900);
            color: white;
            font-weight: 900;
            border-radius: 24px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 12px;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            margin-top: auto;
        }

        .btn-action:hover {
            background: var(--emerald-600);
            box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.2);
        }

        .btn-blue:hover {
            background: #3b82f6;
            box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.2);
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(24px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal-container {
            background: white;
            width: 100%;
            max-width: 1152px;
            max-height: 95vh;
            border-radius: 60px;
            overflow: hidden;
            display: flex;
            position: relative;
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: modalFadeIn 0.5s ease-out;
        }

        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-left {
            width: 41.666667%;
            position: relative;
            height: auto;
        }

        .modal-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .modal-image-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 48px;
        }

        .modal-badge {
            background: var(--emerald-500);
            color: white;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            padding: 8px 20px;
            border-radius: 16px;
            width: fit-content;
            margin-bottom: 16px;
            box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.4);
        }

        .modal-title {
            font-size: 3rem;
            font-weight: 900;
            color: white;
            line-height: 0.9;
            letter-spacing: -0.05em;
            text-transform: none;
        }

        .modal-right {
            width: 58.333333%;
            padding: 64px;
            overflow-y: auto;
            background: white;
            display: flex;
            flex-direction: column;
        }

        .modal-close {
            position: absolute;
            top: 32px;
            right: 32px;
            width: 48px;
            height: 48px;
            background: var(--slate-50);
            border: 1px solid var(--slate-100);
            border-radius: 50%;
            color: #cbd5e1;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            z-index: 100;
        }

        .modal-close:hover {
            color: var(--emerald-500);
            background: white;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            transform: scale(1.1);
        }

        .section-title {
            font-size: 1.25rem;
            font-weight: 900;
            color: var(--slate-800);
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: -0.05em;
        }

        .section-number {
            width: 32px;
            height: 32px;
            background: var(--emerald-100);
            color: var(--emerald-600);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin-right: 12px;
            font-weight: 900;
        }

        .macro-card {
            background: var(--slate-50);
            padding: 24px;
            border-radius: 35px;
            text-align: center;
            border: 1px solid var(--slate-100);
            transition: all 0.3s;
        }

        .macro-card:hover {
            background: #ecfdf5;
        }

        .macro-card .value {
            display: block;
            font-size: 30px;
            font-weight: 900;
            color: var(--slate-800);
        }

        .macro-card .value.highlight {
            color: var(--emerald-600);
        }

        .macro-card .label {
            font-size: 8px;
            font-weight: 900;
            color: var(--slate-400);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .bio-data-row {
            background: var(--slate-50);
            padding: 16px;
            border-radius: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--slate-400);
            margin-bottom: 16px;
            border: 1px solid var(--slate-100);
        }

        .bio-data-row .val {
            color: var(--slate-900);
            font-weight: 900;
        }

        .bio-data-row .val.highlight {
            color: var(--emerald-600);
        }

        .instructions-box {
            background: var(--slate-50);
            padding: 40px;
            border-radius: 40px;
            border: 2px dashed var(--slate-200);
            color: var(--slate-600);
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
        }

        @media (max-width: 1024px) {
            .modal-container {
                flex-direction: column;
                max-height: 95vh;
            }
            .modal-left, .modal-right {
                width: 100%;
            }
            .modal-left {
                height: 320px;
            }
            .modal-right {
                padding: 40px;
            }
            .modal-title {
                font-size: 2rem;
            }
        }
    `;

    async function getOwnerIdByDomain(supabaseClient, domain) {
        if (!domain) return null;
        const { data, error } = await supabaseClient
            .from('wisbe_users')
            .select('id')
            .ilike('domain', domain.trim())
            .maybeSingle();
        if (error || !data) return null;
        return data.id;
    }

    function cleanData(val) {
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') {
            let trimmed = val.trim();
            while ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (typeof parsed === 'string') trimmed = parsed.trim();
                    else if (Array.isArray(parsed)) return parsed.map(item => cleanData(item)).filter(i => i).join('\n');
                    else break;
                } catch (e) { break; }
            }
            return trimmed.replace(/\\"/g, '"').replace(/^"|"$/g, '').trim();
        }
        if (Array.isArray(val)) return val.map(item => cleanData(item)).filter(item => item !== '').join('\n');
        return String(val).trim();
    }

    class WisbeGymNutricion extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        async connectedCallback() {
            const domain = this.getAttribute('domain');
            this.renderLoading();
            const checkSupabase = setInterval(async () => {
                if (window.supabase) {
                    clearInterval(checkSupabase);
                    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                    const ownerId = await getOwnerIdByDomain(supabaseClient, domain);
                    if (!ownerId) { this.renderError('Dominio no configurado o no encontrado.'); return; }
                    const { data: recipes, error } = await supabaseClient.from('gym_recipes').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
                    if (error) { this.renderError('Error al cargar las recetas.'); return; }
                    this.render(recipes);
                }
            }, 100);
        }

        renderLoading() {
            this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 16px;"></i><span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #10b981;">Sincronizando Recetario...</span></div>`;
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="padding: 80px; text-align: center; color: #64748b; font-weight: 700;">${msg}</div>`;
        }

        render(recipes) {
            if (recipes.length === 0) { this.renderError('No hay recetas disponibles.'); return; }
            const gridHTML = recipes.map(r => `
                <div class="item-card" data-recipe='${JSON.stringify(r).replace(/'/g, "&apos;")}'>
                    <div class="card-image-wrapper">
                        <img class="card-image" src="${r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'}">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${r.title}</h3>
                        <div class="card-macros">
                            <div class="macro-item">
                                <span class="macro-value macro-highlight">${r.calories || 0}</span>
                                <span>Kcal</span>
                            </div>
                            <div class="macro-item">
                                <span class="macro-value macro-dark">${r.protein || 0}g</span>
                                <span>Prote</span>
                            </div>
                        </div>
                        <button class="btn-action">Receta Master</button>
                    </div>
                </div>
            `).join('');

            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="widget-container"><div class="grid-layout">${gridHTML}</div></div>
                <div class="modal-overlay" id="modal-overlay">
                    <div class="modal-container">
                        <button class="modal-close" id="modal-close"><i class="fas fa-times"></i></button>
                        <div class="modal-left"><img id="modal-img" class="modal-image" src=""><div class="modal-image-overlay"><div class="modal-badge" id="modal-badge"></div><h2 class="modal-title" id="modal-title"></h2></div></div>
                        <div class="modal-right">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px;">
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; width: 100%;">
                                    <div class="macro-card"><span class="value highlight" id="m-kcal"></span><span class="label">Kcal</span></div>
                                    <div class="macro-card"><span class="value" id="m-prote"></span><span class="label">Proteínas</span></div>
                                    <div class="macro-card"><span class="value" id="m-carbs"></span><span class="label">Carbs</span></div>
                                    <div class="macro-card"><span class="value" id="m-fats"></span><span class="label">Grasas</span></div>
                                </div>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
                                <div>
                                    <h4 class="section-title"><span class="section-number">01</span> Ingredientes</h4>
                                    <div style="color: #475569; line-height: 2; padding-left: 24px; border-left: 2px solid #ecfdf5; font-style: italic; font-size: 14px; margin-bottom: 0; white-space: pre-wrap;" id="m-ingredients"></div>
                                </div>
                                <div>
                                    <h4 class="section-title"><span class="section-number">02</span> Bio-Datos</h4>
                                    <div class="bio-data-row"><span>⏱ Tiempo</span><span class="val" id="m-time"></span></div>
                                    <div class="bio-data-row"><span>🔪 Dificultad</span><span class="val highlight" id="m-diff"></span></div>
                                    <div class="bio-data-row"><span>🥗 Estilo</span><span class="val" id="m-diet"></span></div>
                                </div>
                            </div>
                            <div style="margin-top: 64px;">
                                <h4 class="section-title"><span class="section-number">03</span> Preparación Master</h4>
                                <div class="instructions-box" id="m-instructions"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.shadowRoot.querySelectorAll('.item-card').forEach(card => card.onclick = () => this.openModal(JSON.parse(card.dataset.recipe)));
            this.shadowRoot.getElementById('modal-close').onclick = () => this.closeModal();
            this.shadowRoot.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') this.closeModal(); };
        }

        openModal(r) {
            const s = this.shadowRoot;
            s.getElementById('modal-img').src = r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
            s.getElementById('modal-title').innerText = r.title;
            s.getElementById('modal-badge').innerText = r.category || r.diet_type || 'Nutrición';
            s.getElementById('m-kcal').innerText = r.calories || 0;
            s.getElementById('m-prote').innerText = (r.protein || 0);
            s.getElementById('m-carbs').innerText = (r.carbs || 0);
            s.getElementById('m-fats').innerText = (r.fats || 0);
            s.getElementById('m-ingredients').innerText = cleanData(r.ingredients) || 'Secretos culinarios no especificados.';
            s.getElementById('m-instructions').innerText = cleanData(r.instructions) || 'Sigue los instintos maestros de un chef fitness.';
            s.getElementById('m-time').innerText = (r.prep_time || 20) + ' min';
            s.getElementById('m-diff').innerText = (r.difficulty || 'Media');
            s.getElementById('m-diet').innerText = (r.diet_type || 'Equilibrada');
            s.getElementById('modal-overlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        closeModal() { this.shadowRoot.getElementById('modal-overlay').classList.remove('active'); document.body.style.overflow = ''; }
    }

    class WisbeGymRutinas extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        async connectedCallback() {
            const domain = this.getAttribute('domain');
            this.renderLoading();
            const checkSupabase = setInterval(async () => {
                if (window.supabase) {
                    clearInterval(checkSupabase);
                    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                    const ownerId = await getOwnerIdByDomain(supabaseClient, domain);
                    if (!ownerId) { this.renderError('Dominio no configurado.'); return; }
                    const { data: routines, error } = await supabaseClient.from('gym_routines').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
                    if (error) { this.renderError('Error al cargar las rutinas.'); return; }
                    this.render(routines);
                }
            }, 100);
        }
        renderLoading() { this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 16px; color: #3b82f6;"></i><span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #3b82f6;">Sincronizando Planes...</span></div>`; }
        renderError(msg) { this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="padding: 80px; text-align: center; color: #64748b; font-weight: 700;">${msg}</div>`; }
        render(routines) {
            if (routines.length === 0) { this.renderError('No hay rutinas disponibles.'); return; }
            const gridHTML = routines.map(r => `
                <div class="item-card" data-routine='${JSON.stringify(r).replace(/'/g, "&apos;")}'>
                    <div class="card-content">
                        <div style="width: 64px; height: 64px; background: #eff6ff; color: #3b82f6; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 32px; border: 1px solid #dbeafe;"><i class="fas fa-dumbbell"></i></div>
                        <h3 class="card-title">${r.title}</h3>
                        <div style="display: flex; gap: 12px; margin-bottom: 32px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;"><span style="background: #f8fafc; padding: 4px 12px; border-radius: 8px; border: 1px solid #f1f5f9;">${r.difficulty_level}</span><span><i class="far fa-calendar-alt" style="margin-right: 6px;"></i> ${r.plan_duration_weeks} SEM</span></div>
                        <button class="btn-action btn-blue">Explorar Plan</button>
                    </div>
                </div>
            `).join('');
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="widget-container"><div class="grid-layout">${gridHTML}</div></div>
                <div class="modal-overlay" id="modal-overlay">
                    <div class="modal-container" style="flex-direction: column; max-width: 900px;">
                        <button class="modal-close" id="modal-close"><i class="fas fa-times"></i></button>
                        <div style="padding: 64px; background: #f8fafc; border-bottom: 1px solid #f1f5f9;"><span id="m-diff" style="color: #3b82f6; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;"></span><h2 id="m-title" style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin: 0; text-transform: none; letter-spacing: -0.05em;"></h2></div>
                        <div id="m-body" style="padding: 64px; overflow-y: auto; background: white;"></div>
                    </div>
                </div>
            `;
            this.shadowRoot.querySelectorAll('.item-card').forEach(card => card.onclick = () => this.openModal(JSON.parse(card.dataset.routine)));
            this.shadowRoot.getElementById('modal-close').onclick = () => this.closeModal();
            this.shadowRoot.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') this.closeModal(); };
        }
        openModal(r) {
            const s = this.shadowRoot;
            s.getElementById('m-title').innerText = r.title;
            s.getElementById('m-diff').innerText = r.difficulty_level;
            s.getElementById('m-body').innerHTML = `<div style="display: flex; gap: 24px; margin-bottom: 64px;"><div style="background: white; padding: 16px 32px; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);"><span style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block;">Duración</span><span style="font-weight: 900; color: #0f172a;">${r.plan_duration_weeks} Semanas</span></div><div style="background: white; padding: 16px 32px; border-radius: 20px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);"><span style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; display: block;">Público</span><span style="font-weight: 900; color: #0f172a;">${r.target_gender}</span></div></div><div style="display: flex; flex-direction: column; gap: 48px;">${(r.exercises || []).map(day => `<div><div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;"><span style="background: #f1f5f9; padding: 8px 24px; border-radius: 50px; font-size: 12px; font-weight: 900; text-transform: uppercase;">${day.day}</span><div style="height: 1px; background: #f1f5f9; flex-grow: 1;"></div></div><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px;">${day.exercises.map(ex => `<div style="background: #f8fafc; padding: 24px; border-radius: 24px; border: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;"><div><p style="font-weight: 900; margin: 0 0 4px 0; text-transform: uppercase; font-size: 14px;">${ex.name}</p><p style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin: 0;"><span style="color: #3b82f6;">${ex.sets}</span> Series &times; <span style="color: #3b82f6;">${ex.reps}</span> Reps</p></div>${ex.video ? `<a href="${ex.video}" target="_blank" style="width: 32px; height: 32px; background: white; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; border: 1px solid #f1f5f9; transition: all 0.3s;"><i class="fas fa-play" style="margin-left: 2px;"></i></a>` : ''}</div>`).join('')}</div></div>`).join('')}</div>`;
            s.getElementById('modal-overlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        closeModal() { this.shadowRoot.getElementById('modal-overlay').classList.remove('active'); document.body.style.overflow = ''; }
    }

    class WisbeGymEntrenadores extends HTMLElement {
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        async connectedCallback() {
            const domain = this.getAttribute('domain');
            this.renderLoading();
            const checkSupabase = setInterval(async () => {
                if (window.supabase) {
                    clearInterval(checkSupabase);
                    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                    const ownerId = await getOwnerIdByDomain(supabaseClient, domain);
                    if (!ownerId) { this.renderError('Dominio no configurado.'); return; }
                    const { data: trainers, error } = await supabaseClient.from('gym_trainers').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
                    if (error) { this.renderError('Error al cargar equipo.'); return; }
                    this.render(trainers);
                }
            }, 100);
        }
        renderLoading() { this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8;"><i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 16px; color: #3b82f6;"></i><span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em;">Sincronizando Equipo...</span></div>`; }
        renderError(msg) { this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div style="padding: 80px; text-align: center; color: #64748b; font-weight: 700;">${msg}</div>`; }
        render(trainers) {
            if (trainers.length === 0) { this.renderError('No hay entrenadores.'); return; }
            const gridHTML = trainers.map(t => `
                <div class="item-card" style="padding: 40px; align-items: center; text-align: center;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 4px solid #f8fafc; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"><img src="${t.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                    <span style="background: #eff6ff; color: #3b82f6; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px; display: inline-block; border: 1px solid #dbeafe;">${t.specialty}</span>
                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 16px 0; text-transform: none;">${t.full_name}</h3>
                    <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin-bottom: 32px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${t.bio || 'Sin descripción.'}</p>
                    <div style="margin-top: auto; width: 100%; display: flex; gap: 12px;">
                        ${t.whatsapp_url ? `<a href="${t.whatsapp_url}" target="_blank" style="flex-grow: 1; background: #3b82f6; color: white; padding: 12px; border-radius: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3); transition: all 0.3s; display: flex; align-items: center; justify-content: center;">Contactar</a>` : ''}
                        ${t.instagram_url ? `<a href="https://instagram.com/${t.instagram_url.replace('@','')}" target="_blank" style="width: 44px; height: 44px; background: #f8fafc; color: #64748b; border-radius: 12px; display: flex; align-items: center; justify-content: center; text-decoration: none; border: 1px solid #f1f5f9; transition: all 0.3s;"><i class="fab fa-instagram text-xl"></i></a>` : ''}
                    </div>
                </div>
            `).join('');
            this.shadowRoot.innerHTML = `<style>${COMMON_STYLE}</style><div class="widget-container"><div class="grid-layout">${gridHTML}</div></div>`;
        }
    }

    if (!customElements.get('wisbe-gymnutricion')) customElements.define('wisbe-gymnutricion', WisbeGymNutricion);
    if (!customElements.get('wisbe-gymrutinas')) customElements.define('wisbe-gymrutinas', WisbeGymRutinas);
    if (!customElements.get('wisbe-gymstaff')) customElements.define('wisbe-gymstaff', WisbeGymEntrenadores);

})();
