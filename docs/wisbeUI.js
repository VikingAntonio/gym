(function() {
    const SUPABASE_URL = 'https://wwcmtqqbxdamxebkfsqk.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y210cXFieGRhbXhlYmtmc3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDUzNzksImV4cCI6MjA5MDA4MTM3OX0.4C5gGKxJrpF5BS8FfEAu8FLa9VudEHxCYxwwtb991Io';

    // Dynamically load Supabase if not present
    if (typeof supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        document.head.appendChild(script);
    }

    const COMMON_STYLE = `
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        :host {
            display: block;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #0f172a;
        }

        .widget-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            width: 100%;
            box-sizing: border-box;
        }

        .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease forwards;
        }
        .animate-fade {
            animation: fadeIn 0.6s ease-out forwards;
        }

        /* Fix for scrollbar in modal */
        .modal-scroll::-webkit-scrollbar {
            width: 6px;
        }
        .modal-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .modal-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
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
            const trimmed = val.trim();
            if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    return cleanData(parsed);
                } catch (e) {}
            }
            // Remove escaped quotes if any remain from multiple encodings
            return trimmed.replace(/\\"/g, '"').replace(/^"|"$/g, '').trim();
        }

        if (Array.isArray(val)) {
            return val
                .map(item => cleanData(item))
                .filter(item => item !== '')
                .join('\n');
        }

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

                    if (!ownerId) {
                        this.renderError('Dominio no configurado o no encontrado.');
                        return;
                    }

                    const { data: recipes, error } = await supabaseClient
                        .from('gym_recipes')
                        .select('*')
                        .eq('owner_id', ownerId)
                        .order('created_at', { ascending: false });

                    if (error) {
                        this.renderError('Error al cargar las recetas.');
                        return;
                    }

                    this.render(recipes);
                }
            }, 100);
        }

        renderLoading() {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="flex flex-col items-center justify-center py-20 text-slate-400">
                    <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
                    <span class="text-sm font-black uppercase tracking-widest text-emerald-600">Sincronizando Recetario...</span>
                </div>
            `;
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="py-20 text-center text-slate-500 font-bold">${msg}</div>
            `;
        }

        render(recipes) {
            if (recipes.length === 0) {
                this.renderError('No hay recetas disponibles para este dominio.');
                return;
            }

            const gridHTML = recipes.map(r => `
                <div class="bg-white rounded-[50px] shadow-sm border border-slate-50 overflow-hidden group hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 animate-fade-in">
                    <div class="h-64 relative overflow-hidden bg-slate-200">
                        <img src="${r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'}"
                             class="w-full h-full object-cover group-hover:scale-125 transition duration-1000 grayscale-[0.2] group-hover:grayscale-0">
                        <div class="absolute top-6 left-6">
                            <span class="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-2xl">${r.diet_type || 'Nutrición'}</span>
                        </div>
                    </div>
                    <div class="p-10">
                        <h3 class="text-2xl font-black text-slate-800 mb-6 tracking-tight line-clamp-1">${r.title}</h3>
                        <div class="flex justify-between items-center mb-10 border-t border-b border-slate-50 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div class="text-center">
                                <span class="block text-2xl font-black text-emerald-600 mb-1">${r.calories || 0}</span>
                                <span>Kcal</span>
                            </div>
                            <div class="text-center">
                                <span class="block text-2xl font-black text-slate-800 mb-1">${r.protein || 0}g</span>
                                <span>Prote</span>
                            </div>
                        </div>
                        <button class="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-3xl transition-all shadow-xl hover:shadow-emerald-200 uppercase tracking-widest text-xs btn-open-recipe"
                                data-recipe='${JSON.stringify(r).replace(/'/g, "&apos;")}'>
                            Receta Master
                        </button>
                    </div>
                </div>
            `).join('');

            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="widget-container">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        ${gridHTML}
                    </div>
                </div>
                <div id="recipe-modal" class="fixed inset-0 bg-slate-950/95 z-[1000] hidden items-center justify-center p-4 backdrop-blur-2xl">
                    <div class="bg-white w-full max-w-6xl max-h-[95vh] rounded-[60px] overflow-hidden shadow-2xl flex flex-col xl:flex-row border border-white/10 relative animate-fade-in">
                         <button id="close-modal" class="absolute top-8 right-8 text-slate-400 hover:text-emerald-500 transition-all text-3xl z-[1050] bg-white/80 rounded-full w-12 h-12 flex items-center justify-center shadow-lg"><i class="fas fa-times-circle"></i></button>
                         <div class="xl:w-5/12 h-80 xl:h-auto relative">
                            <img id="modal-image" src="" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12">
                                <span id="modal-diet-badge" class="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-2xl w-fit shadow-xl shadow-emerald-900/40 mb-4"></span>
                                <h2 id="modal-title" class="text-5xl font-black text-white leading-[0.9] tracking-tighter"></h2>
                            </div>
                        </div>
                        <div class="xl:w-7/12 p-8 xl:p-16 overflow-y-auto bg-white flex flex-col modal-scroll">
                            <div class="flex justify-between items-start mb-12">
                                <div class="grid grid-cols-4 gap-4 w-full mr-12">
                                    <div class="bg-slate-50 p-6 rounded-[35px] text-center border border-slate-100 transition-all hover:bg-emerald-50 group">
                                        <span id="modal-calories" class="block text-3xl font-black text-emerald-600 group-hover:scale-110 transition-transform"></span>
                                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kcal</span>
                                    </div>
                                    <div class="bg-slate-50 p-6 rounded-[35px] text-center border border-slate-100 transition-all hover:bg-emerald-50 group">
                                        <span id="modal-protein" class="block text-3xl font-black text-slate-800 group-hover:scale-110 transition-transform"></span>
                                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Proteínas</span>
                                    </div>
                                    <div class="bg-slate-50 p-6 rounded-[35px] text-center border border-slate-100 transition-all hover:bg-emerald-50 group">
                                        <span id="modal-carbs" class="block text-3xl font-black text-slate-800 group-hover:scale-110 transition-transform"></span>
                                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Carbs</span>
                                    </div>
                                    <div class="bg-slate-50 p-6 rounded-[35px] text-center border border-slate-100 transition-all hover:bg-emerald-50 group">
                                        <span id="modal-fats" class="block text-3xl font-black text-slate-800 group-hover:scale-110 transition-transform"></span>
                                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grasas</span>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-16">
                                <div class="grid md:grid-cols-2 gap-12">
                                    <div>
                                        <h4 class="text-xl font-black text-slate-800 mb-6 flex items-center uppercase tracking-tighter">
                                            <span class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs mr-3 font-black">01</span> Ingredientes
                                        </h4>
                                        <div id="modal-ingredients" class="text-slate-600 leading-loose whitespace-pre-wrap pl-6 border-l-2 border-emerald-50 text-sm italic"></div>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-black text-slate-800 mb-6 flex items-center uppercase tracking-tighter">
                                            <span class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs mr-3 font-black">02</span> Bio-Datos
                                        </h4>
                                        <div class="space-y-4">
                                            <div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                                                <span>⏱ Tiempo</span> <span id="modal-time" class="text-slate-900 font-black"></span>
                                            </div>
                                            <div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                                                <span>🔪 Dificultad</span> <span id="modal-difficulty" class="text-emerald-600 font-black"></span>
                                            </div>
                                            <div class="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                                                <span>🥗 Estilo</span> <span id="modal-diet" class="text-slate-900 font-black"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-xl font-black text-slate-800 mb-8 flex items-center uppercase tracking-tighter">
                                        <span class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs mr-3 font-black">03</span> Preparación Master
                                    </h4>
                                    <div id="modal-instructions" class="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm bg-slate-50 p-10 rounded-[40px] border border-dashed border-slate-200 border-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.shadowRoot.querySelectorAll('.btn-open-recipe').forEach(btn => {
                btn.onclick = () => {
                    const r = JSON.parse(btn.dataset.recipe);
                    this.openModal(r);
                };
            });

            this.shadowRoot.getElementById('close-modal').onclick = () => this.closeModal();
        }

        openModal(r) {
            const modal = this.shadowRoot.getElementById('recipe-modal');
            this.shadowRoot.getElementById('modal-title').innerText = r.title;
            this.shadowRoot.getElementById('modal-diet-badge').innerText = r.diet_type || 'Equilibrada';
            this.shadowRoot.getElementById('modal-calories').innerText = r.calories || 0;
            this.shadowRoot.getElementById('modal-protein').innerText = r.protein || 0;
            this.shadowRoot.getElementById('modal-carbs').innerText = r.carbs || 0;
            this.shadowRoot.getElementById('modal-fats').innerText = r.fats || 0;
            this.shadowRoot.getElementById('modal-time').innerText = r.prep_time ? r.prep_time + ' min' : '20 min';
            this.shadowRoot.getElementById('modal-difficulty').innerText = r.difficulty || 'Media';
            this.shadowRoot.getElementById('modal-diet').innerText = r.diet_type || 'Equilibrada';
            this.shadowRoot.getElementById('modal-ingredients').innerText = cleanData(r.ingredients);
            this.shadowRoot.getElementById('modal-instructions').innerText = cleanData(r.instructions);
            this.shadowRoot.getElementById('modal-image').src = r.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        closeModal() {
            const modal = this.shadowRoot.getElementById('recipe-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    class WisbeGymRutinas extends HTMLElement {
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

                    if (!ownerId) {
                        this.renderError('Dominio no configurado.');
                        return;
                    }

                    const { data: routines, error } = await supabaseClient
                        .from('gym_routines')
                        .select('*')
                        .eq('owner_id', ownerId)
                        .order('created_at', { ascending: false });

                    if (error) {
                        this.renderError('Error al cargar las rutinas.');
                        return;
                    }

                    this.render(routines);
                }
            }, 100);
        }

        renderLoading() {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="flex flex-col items-center justify-center py-20 text-slate-400">
                    <i class="fas fa-spinner fa-spin text-2xl mb-4 text-blue-500"></i>
                    <span class="text-sm font-black uppercase tracking-widest">Sincronizando Planes de Entrenamiento...</span>
                </div>
            `;
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="py-20 text-center text-slate-500 font-bold">${msg}</div>
            `;
        }

        render(routines) {
            if (routines.length === 0) {
                this.renderError('No se han publicado rutinas todavía.');
                return;
            }

            const gridHTML = routines.map(r => `
                <div class="group hover:border-blue-500 transition-all cursor-pointer flex flex-col p-8 bg-white border border-slate-200 rounded-3xl btn-open-routine animate-fade shadow-sm hover:shadow-xl" data-routine='${JSON.stringify(r).replace(/'/g, "&apos;")}'>
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100">
                        <i class="fas fa-dumbbell"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">${r.title}</h3>
                    <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
                        <span class="px-2 py-0.5 bg-slate-50 rounded border border-slate-100">${r.difficulty_level}</span>
                        <span class="flex items-center"><i class="far fa-calendar-alt mr-2"></i> ${r.plan_duration_weeks} Semanas</span>
                    </div>
                    <div class="mt-auto pt-6 border-t border-slate-100 flex items-center text-blue-600 text-[10px] font-black uppercase tracking-widest">
                        Explorar Plan <i class="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                    </div>
                </div>
            `).join('');

            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="widget-container">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        ${gridHTML}
                    </div>
                </div>
                <div id="routine-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] hidden items-center justify-center p-4 overflow-y-auto">
                    <div class="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative my-10 min-h-[80vh] flex flex-col animate-fade">
                        <button id="close-modal" class="absolute top-8 right-8 w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-[1050] shadow-md">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                        <div id="modal-header" class="p-10 lg:p-16 border-b border-slate-100 bg-slate-50"></div>
                        <div id="modal-body" class="p-10 lg:p-16 flex-grow overflow-y-auto modal-scroll"></div>
                    </div>
                </div>
            `;

            this.shadowRoot.querySelectorAll('.btn-open-routine').forEach(btn => {
                btn.onclick = () => {
                    const r = JSON.parse(btn.dataset.routine);
                    this.openModal(r);
                };
            });

            this.shadowRoot.getElementById('close-modal').onclick = () => this.closeModal();
        }

        openModal(r) {
            const modal = this.shadowRoot.getElementById('routine-modal');
            const header = this.shadowRoot.getElementById('modal-header');
            const body = this.shadowRoot.getElementById('modal-body');

            header.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span class="text-blue-600 text-[10px] font-black uppercase tracking-widest block mb-2">${r.difficulty_level}</span>
                        <h2 class="text-4xl font-black text-slate-900 tracking-tight uppercase">${r.title}</h2>
                    </div>
                    <div class="flex gap-4">
                        <div class="bg-white px-6 py-3 rounded-2xl border border-slate-200">
                            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Duración</p>
                            <p class="text-slate-700 font-bold">${r.plan_duration_weeks} Semanas</p>
                        </div>
                        ${r.target_gender ? `
                            <div class="bg-white px-6 py-3 rounded-2xl border border-slate-200">
                                <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Público</p>
                                <p class="text-slate-700 font-bold">${r.target_gender}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            body.innerHTML = `
                <div class="space-y-12">
                    ${(r.exercises || []).map((day, idx) => `
                        <div class="animate-fade" style="animation-delay: ${idx * 0.1}s">
                            <div class="flex items-center gap-4 mb-8">
                                <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-6 py-2 rounded-full border border-slate-200">${day.day}</h4>
                                <div class="h-px bg-slate-100 flex-grow"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                ${day.exercises.map(ex => `
                                    <div class="card bg-slate-50 border border-slate-200 flex items-center justify-between p-6 rounded-2xl">
                                        <div>
                                            <p class="text-slate-900 font-bold uppercase tracking-tight text-sm mb-1">${ex.name}</p>
                                            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                <span class="text-blue-500">${ex.sets}</span> Series &times; <span class="text-blue-500">${ex.reps}</span> Repeticiones
                                            </p>
                                        </div>
                                        ${ex.video ? `
                                            <a href="${ex.video}" target="_blank" class="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center border border-slate-200 hover:bg-blue-500 hover:text-white transition-all shadow-sm no-underline">
                                                <i class="fas fa-play text-xs ml-0.5"></i>
                                            </a>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        closeModal() {
            const modal = this.shadowRoot.getElementById('routine-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    class WisbeGymEntrenadores extends HTMLElement {
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

                    if (!ownerId) {
                        this.renderError('Dominio no configurado.');
                        return;
                    }

                    const { data: trainers, error } = await supabaseClient
                        .from('gym_trainers')
                        .select('*')
                        .eq('owner_id', ownerId)
                        .order('created_at', { ascending: false });

                    if (error) {
                        this.renderError('Error al cargar equipo.');
                        return;
                    }

                    this.render(trainers);
                }
            }, 100);
        }

        renderLoading() {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="flex flex-col items-center justify-center py-20 text-slate-400">
                    <i class="fas fa-spinner fa-spin text-2xl mb-4 text-blue-500"></i>
                    <span class="text-sm font-black uppercase tracking-widest">Sincronizando Perfiles Profesionales...</span>
                </div>
            `;
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="py-20 text-center text-slate-500 font-bold">${msg}</div>
            `;
        }

        render(trainers) {
            if (trainers.length === 0) {
                this.renderError('No hay entrenadores registrados.');
                return;
            }

            const gridHTML = trainers.map(t => `
                <div class="group hover:border-blue-500 transition-all flex flex-col items-center text-center p-10 bg-white border border-slate-200 rounded-3xl animate-fade shadow-sm hover:shadow-xl">
                    <div class="w-28 h-28 rounded-full border-4 border-slate-50 overflow-hidden mb-8 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img src="${t.image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80'}" class="w-full h-full object-cover">
                    </div>
                    <div class="mb-6">
                        <span class="text-blue-600 text-[10px] font-black uppercase tracking-widest block mb-2 px-3 py-1 bg-blue-50 rounded-full inline-block border border-blue-100">${t.specialty}</span>
                        <h3 class="text-xl font-bold text-slate-900 tracking-tight uppercase">${t.full_name}</h3>
                    </div>
                    <p class="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">${t.bio || 'Sin descripción adicional.'}</p>
                    <div class="mt-auto w-full pt-8 border-t border-slate-100 flex gap-4">
                        ${t.whatsapp_url ? `
                            <a href="${t.whatsapp_url}" target="_blank" class="flex-grow py-3 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 bg-blue-600 text-white rounded-xl text-center no-underline hover:bg-blue-700 transition-all">
                                Contactar <i class="fab fa-whatsapp ml-2"></i>
                            </a>
                        ` : ''}
                        ${t.instagram_url ? `
                            <a href="https://instagram.com/${t.instagram_url.replace('@','')}" target="_blank" class="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 hover:text-blue-500 transition-all no-underline">
                                <i class="fab fa-instagram text-xl"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            this.shadowRoot.innerHTML = `
                <style>${COMMON_STYLE}</style>
                <div class="widget-container">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                        ${gridHTML}
                    </div>
                </div>
            `;
        }
    }

    if (!customElements.get('wisbe-gym-recetas')) customElements.define('wisbe-gym-recetas', WisbeGymNutricion);
    if (!customElements.get('wisbe-gym-rutinas')) customElements.define('wisbe-gym-rutinas', WisbeGymRutinas);
    if (!customElements.get('wisbe-gym-staff')) customElements.define('wisbe-gym-staff', WisbeGymEntrenadores);

})();
