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

    const styles = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');

        :host {
            display: block;
            font-family: 'Inter', system-ui, sans-serif;
            color: #0f172a;
            --pink-600: #db2777;
            --pink-500: #ec4899;
            --pink-100: #fce7f3;
            --pink-50: #fdf2f8;
            --slate-50: #f8fafc;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --slate-400: #94a3b8;
            --slate-600: #475569;
            --slate-900: #0f172a;
        }

        * { box-sizing: border-box; }

        .container { max-width: 1000px; margin: 0 auto; }

        .step-header { margin-bottom: 3rem; text-align: center; }
        .step-title { font-size: 2rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.04em; color: var(--slate-900); }
        .step-subtitle { font-size: 0.875rem; color: var(--slate-400); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; }

        .services-grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

        .service-card {
            background: white; border-radius: 40px; border: 1px solid var(--slate-100); overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; position: relative;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .service-card:hover { transform: translateY(-10px); border-color: var(--pink-200); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .service-img-wrapper { height: 200px; width: 100%; overflow: hidden; position: relative; }
        .service-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; }
        .service-card:hover .service-img { transform: scale(1.1); }

        .service-badge {
            position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.9);
            backdrop-filter: blur(8px); padding: 0.4rem 1rem; border-radius: 1rem;
            font-size: 10px; font-weight: 900; color: var(--pink-600);
        }

        .service-info { padding: 2rem; }
        .service-name { font-size: 1.25rem; font-weight: 900; margin-bottom: 1rem; color: var(--slate-900); }
        .service-meta { display: flex; align-items: center; gap: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 900; color: var(--slate-400); text-transform: uppercase; }
        .meta-item i { color: var(--pink-500); }

        /* Calendar */
        .calendar-wrapper { background: var(--slate-50); padding: 3rem; border-radius: 50px; border: 1px solid var(--slate-100); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .calendar-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.75rem; }

        .day-btn {
            aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
            border-radius: 24px; border: 1px solid transparent; background: white;
            cursor: pointer; transition: all 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .day-btn:hover:not(:disabled) { background: var(--pink-50); border-color: var(--pink-100); transform: scale(1.05); }
        .day-btn.selected { background: var(--pink-600); color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .day-btn:disabled { opacity: 0.2; cursor: not-allowed; background: transparent; border: 1px dashed var(--slate-200); box-shadow: none; }

        .day-name { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; opacity: 0.6; }
        .day-num { font-weight: 900; font-size: 1.25rem; }

        .slots-section { margin-top: 4rem; }
        .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 1rem; }
        .slot-btn {
            padding: 1rem; border-radius: 1.25rem; border: 1px solid var(--slate-200); background: white;
            font-weight: 900; font-size: 0.875rem; cursor: pointer; transition: all 0.3s; text-align: center;
            color: var(--slate-600);
        }
        .slot-btn:hover:not(:disabled) { border-color: var(--pink-500); color: var(--pink-600); background: var(--pink-50); }
        .slot-btn.selected { background: var(--pink-600); color: white; border-color: var(--pink-600); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .slot-btn:disabled { opacity: 0.3; background: var(--slate-100); cursor: not-allowed; border-color: transparent; }

        .form-container {
            max-width: 550px;
            margin: 0 auto;
            background: white;
            padding: 3rem;
            border-radius: 50px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--slate-100);
        }
        .input-group { margin-bottom: 1.5rem; }
        .label { font-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block; }
        .input {
            width: 100%; padding: 1.25rem 1.5rem; border-radius: 1.25rem; border: 1px solid var(--slate-200);
            font-family: inherit; font-size: 0.95rem; font-weight: 600; outline: none; transition: all 0.3s;
            background: var(--slate-50);
        }
        .input:focus { border-color: var(--pink-500); background: white; box-shadow: 0 0 0 5px var(--pink-50); }

        .btn {
            width: 100%; padding: 1.5rem; border-radius: 1.25rem; border: none; background: var(--pink-600);
            color: white; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.8rem;
            cursor: pointer; transition: all 0.4s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn:hover:not(:disabled) { background: var(--pink-500); transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

        .back-btn { margin-bottom: 2.5rem; font-size: 0.7rem; font-weight: 900; color: var(--slate-400); cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; display: inline-flex; align-items: center; gap: 0.5rem; transition: color 0.3s; }
        .back-btn:hover { color: var(--pink-600); }

        .loading { padding: 6rem; text-align: center; }
        .spinner { width: 40px; height: 40px; border: 4px solid var(--pink-50); border-top-color: var(--pink-500); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1.5rem; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .success-box {
            text-align: center;
            padding: 5rem;
            background: white;
            border-radius: 60px;
            border: 1px solid var(--slate-100);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .success-icon { width: 100px; height: 100px; background: var(--pink-50); color: var(--pink-500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 2.5rem; border: 4px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }

        @media (max-width: 768px) {
            .container { padding: 0 10px; }
            .step-title { font-size: 1.5rem; }
            .calendar-wrapper { padding: 1.5rem; border-radius: 30px; }
            .calendar-grid { gap: 0.4rem; }
            .day-btn { border-radius: 12px; }
            .day-num { font-size: 1rem; }
            .day-name { font-size: 7px; }
            .slots-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.75rem; }
            .slot-btn { padding: 0.75rem 0.5rem; font-size: 0.75rem; border-radius: 12px; }
            .form-container {
                padding: 2rem;
                border-radius: 30px;
                width: 100%;
                margin: 0 auto;
            }
            .success-box { padding: 3rem 1.5rem; border-radius: 40px; width: 100%; margin: 0 auto; }
            .btn { padding: 1.25rem; font-size: 0.75rem; }
        }
    `;

    class WisbeBeautyCitas extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.state = {
                step: 'services',
                owner_id: null,
                services: [],
                settings: null,
                selectedService: null,
                selectedDate: null,
                selectedTime: null,
                availableSlots: [],
                loading: true
            };
        }

        static get observedAttributes() { return ['domain']; }

        async connectedCallback() {
            await this.init();
        }

        async init() {
            const domain = this.getAttribute('domain');
            if (!domain) return;

            while (!window.supabase) await new Promise(r => setTimeout(r, 100));
            this.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

            const { data: user } = await this.supabase.from('wisbe_users').select('id').ilike('domain', domain).maybeSingle();
            if (!user) {
                this.renderError('Establecimiento no encontrado');
                return;
            }

            this.state.owner_id = user.id;

            const [servicesRes, settingsRes] = await Promise.all([
                this.supabase.from('beauty_services').select('*').eq('owner_id', user.id).order('name'),
                this.supabase.from('beauty_settings').select('*').eq('owner_id', user.id).maybeSingle()
            ]);

            this.state.services = servicesRes.data || [];
            this.state.settings = settingsRes.data || { slots_per_hour: 1, business_hours: {} };
            this.state.loading = false;
            this.render();
        }

        render() {
            if (this.state.loading) {
                this.shadowRoot.innerHTML = `<style>${styles}</style><div class="loading"><div class="spinner"></div><div style="font-weight:900; color:var(--slate-400); text-transform:uppercase; letter-spacing:0.2em; font-size:10px">Preparando Agenda Profesional...</div></div>`;
                return;
            }

            let content = '';
            if (this.state.step === 'services') content = this.renderServices();
            else if (this.state.step === 'datetime') content = this.renderDateTime();
            else if (this.state.step === 'form') content = this.renderForm();
            else if (this.state.step === 'success') content = this.renderSuccess();

            this.shadowRoot.innerHTML = `<style>${styles}</style><div class="container">${content}</div>`;
            this.setupListeners();
        }

        renderServices() {
            return `
                <div class="step-header animate-fade">
                    <span class="step-subtitle">Paso 01</span>
                    <h2 class="step-title">Selecciona tu experiencia</h2>
                </div>
                <div class="services-grid">
                    ${this.state.services.map(s => `
                        <div class="service-card animate-fade" data-id="${s.id}">
                            <div class="service-img-wrapper">
                                <img src="${s.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'}" class="service-img">
                                <div class="service-badge">$${s.price}</div>
                            </div>
                            <div class="service-info">
                                <div class="service-name">${s.name}</div>
                                <div class="service-meta">
                                    <span class="meta-item"><i class="far fa-clock"></i> ${s.duration_minutes} MIN</span>
                                    <span class="meta-item"><i class="fas fa-magic"></i> Premium</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        renderDateTime() {
            const days = [];
            const today = new Date();
            const daysNames = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
            const daysKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            for (let i = 0; i < 14; i++) {
                const date = new Date();
                date.setDate(today.getDate() + i);
                const dayKey = daysKeys[date.getDay()];
                const isWorking = this.state.settings.business_hours[dayKey]?.active;
                days.push({
                    date: date.toISOString().split('T')[0],
                    dayName: daysNames[date.getDay()],
                    dayNum: date.getDate(),
                    active: isWorking
                });
            }

            return `
                <div class="back-btn" id="go-back"> <i class="fas fa-arrow-left"></i> Volver a servicios</div>
                <div class="step-header animate-fade">
                    <span class="step-subtitle">Paso 02</span>
                    <h2 class="step-title">Fecha y Horario</h2>
                    <p style="color:var(--pink-600); font-size:0.7rem; font-weight:900; text-transform:uppercase; margin-top:1rem; letter-spacing:0.1em">Servicio: ${this.state.selectedService.name}</p>
                </div>

                <div class="calendar-wrapper animate-fade">
                    <div class="calendar-grid">
                        ${days.map(d => `
                            <button class="day-btn ${this.state.selectedDate === d.date ? 'selected' : ''}"
                                    data-date="${d.date}"
                                    ${!d.active ? 'disabled' : ''}>
                                <span class="day-name">${d.dayName}</span>
                                <span class="day-num">${d.dayNum}</span>
                            </button>
                        `).join('')}
                    </div>

                    ${this.state.selectedDate ? `
                        <div class="slots-section animate-fade">
                            <div class="flex items-center gap-4 mb-8">
                                <span class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Horarios disponibles</span>
                                <div class="h-px bg-slate-200 flex-grow"></div>
                            </div>
                            <div class="slots-grid">
                                ${this.state.availableSlots.length > 0 ?
                                    this.state.availableSlots.map(s => `
                                        <button class="slot-btn ${this.state.selectedTime === s.slot_time ? 'selected' : ''}"
                                                data-time="${s.slot_time}"
                                                ${!s.is_available ? 'disabled' : ''}>
                                            ${s.slot_time.substring(0,5)}
                                        </button>
                                    `).join('') :
                                    '<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--slate-400); font-weight:bold">No hay horarios disponibles para el servicio solicitado.</div>'
                                }
                            </div>
                            <div style="margin-top: 4rem; text-align:center">
                                <button class="btn" style="max-width:300px" id="go-to-form" ${!this.state.selectedTime ? 'disabled' : ''}>Continuar Reserva</button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        renderForm() {
            return `
                <div class="back-btn" id="go-back"> <i class="fas fa-arrow-left"></i> Volver al calendario</div>
                <div class="step-header animate-fade">
                    <span class="step-subtitle">Paso 03</span>
                    <h2 class="step-title">Datos de Contacto</h2>
                    <div style="margin-top:1.5rem; background:var(--pink-50); padding:1rem; border-radius:1rem; display:inline-block">
                        <p style="color:var(--pink-600); font-size:0.75rem; font-weight:900; text-transform:uppercase; letter-spacing:0.05em">
                            <i class="far fa-calendar-alt mr-2"></i> ${this.state.selectedDate} @ ${this.state.selectedTime.substring(0,5)}
                        </p>
                    </div>
                </div>
                <form class="form-container animate-fade" id="appointment-form">
                    <div class="input-group">
                        <label class="label">Nombre Completo</label>
                        <input type="text" id="cust-name" placeholder="Tu nombre..." required class="input">
                    </div>
                    <div class="input-group">
                        <label class="label">Correo Electrónico</label>
                        <input type="email" id="cust-email" placeholder="ejemplo@correo.com" required class="input">
                    </div>
                    <div class="input-group">
                        <label class="label">Teléfono / WhatsApp</label>
                        <input type="tel" id="cust-phone" placeholder="+00 000 000 000" required class="input">
                    </div>
                    <div style="margin-top:2rem">
                        <button type="submit" class="btn">Confirmar Cita Profesional</button>
                    </div>
                </form>
            `;
        }

        renderSuccess() {
            return `
                <div class="success-box animate-fade">
                    <div class="success-icon"><i class="fas fa-check"></i></div>
                    <h2 class="step-title" style="margin-bottom: 1rem">¡Cita Reservada!</h2>
                    <p style="color: var(--slate-500); font-weight: 600; font-size: 1.125rem; margin-bottom: 3rem">Hemos recibido tu solicitud. Te enviaremos una confirmación por whatsapp pronto.</p>
                    <button class="btn" style="width: auto; padding: 1.25rem 4rem" id="restart">Finalizar</button>
                </div>
            `;
        }

        setupListeners() {
            const root = this.shadowRoot;

            root.querySelectorAll('.service-card').forEach(card => {
                card.onclick = () => {
                    this.state.selectedService = this.state.services.find(s => s.id === card.dataset.id);
                    this.state.step = 'datetime';
                    this.render();
                };
            });

            root.querySelectorAll('.day-btn').forEach(btn => {
                btn.onclick = async () => {
                    this.state.selectedDate = btn.dataset.date;
                    this.state.selectedTime = null;
                    await this.calculateSlots();
                    this.render();
                };
            });

            root.querySelectorAll('.slot-btn').forEach(btn => {
                btn.onclick = () => {
                    this.state.selectedTime = btn.dataset.time;
                    this.render();
                };
            });

            const backBtn = root.getElementById('go-back');
            if (backBtn) {
                backBtn.onclick = () => {
                    if (this.state.step === 'datetime') this.state.step = 'services';
                    else if (this.state.step === 'form') this.state.step = 'datetime';
                    this.render();
                };
            }

            const nextBtn = root.getElementById('go-to-form');
            if (nextBtn) {
                nextBtn.onclick = () => {
                    this.state.step = 'form';
                    this.render();
                };
            }

            const form = root.getElementById('appointment-form');
            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const btn = form.querySelector('button');
                    btn.disabled = true;
                    btn.innerText = 'PROCESANDO...';

                    const { error } = await this.supabase.from('beauty_appointments').insert({
                        owner_id: this.state.owner_id,
                        service_id: this.state.selectedService.id,
                        customer_name: root.getElementById('cust-name').value,
                        customer_email: root.getElementById('cust-email').value,
                        customer_phone: root.getElementById('cust-phone').value,
                        appointment_date: this.state.selectedDate,
                        appointment_time: this.state.selectedTime
                    });

                    if (error) {
                        alert('Error al reservar: ' + error.message);
                        btn.disabled = false;
                        btn.innerText = 'Confirmar Cita';
                    } else {
                        this.state.step = 'success';
                        this.render();
                    }
                };
            }

            const restart = root.getElementById('restart');
            if (restart) {
                restart.onclick = () => {
                    this.state.step = 'services';
                    this.state.selectedService = null;
                    this.state.selectedDate = null;
                    this.state.selectedTime = null;
                    this.render();
                };
            }
        }

        async calculateSlots() {
            // SEGURIZADO: Usamos el RPC para no exponer datos de otros clientes
            // La lógica del RPC en Abeauty.txt ya maneja la duración de los servicios
            const { data, error } = await this.supabase.rpc('check_beauty_availability', {
                p_owner_id: this.state.owner_id,
                p_date: this.state.selectedDate
            });

            if (error) {
                console.error("RPC Error:", error);
                this.state.availableSlots = [];
            } else {
                // Filtrado adicional: Si el servicio seleccionado dura más de 30 min,
                // debemos asegurar que los slots consecutivos también estén disponibles.
                const duration = this.state.selectedService.duration_minutes || 30;
                const slotsNeeded = Math.ceil(duration / 30);

                if (slotsNeeded <= 1) {
                    this.state.availableSlots = data || [];
                } else {
                    const refined = (data || []).map((slot, index, arr) => {
                        if (!slot.is_available) return slot;

                        // Verificar slots consecutivos
                        let canFit = true;
                        for (let j = 0; j < slotsNeeded; j++) {
                            const futureSlot = arr[index + j];
                            if (!futureSlot || !futureSlot.is_available) {
                                canFit = false;
                                break;
                            }
                        }
                        return { ...slot, is_available: canFit };
                    });
                    this.state.availableSlots = refined;
                }
            }
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `<style>${styles}</style><div class="loading" style="color:var(--pink-600); font-weight:900; text-transform:uppercase">${msg}</div>`;
        }
    }

    customElements.define('wisbe-beauty-citas', WisbeBeautyCitas);
})();
