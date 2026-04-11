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
            --pink-50: #fdf2f8;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --slate-400: #94a3b8;
            --slate-600: #475569;
            --slate-900: #0f172a;
        }

        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }

        .step-header { margin-bottom: 2rem; }
        .step-title { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.025em; }

        .services-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

        .service-card {
            background: white; border-radius: 32px; border: 1px solid var(--slate-100); overflow: hidden;
            transition: all 0.3s; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .service-card:hover { transform: translateY(-4px); border-color: var(--pink-500); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .service-img { height: 160px; width: 100%; object-fit: cover; }
        .service-info { padding: 1.5rem; }
        .service-name { font-weight: 800; margin-bottom: 0.5rem; }
        .service-meta { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 900; color: var(--slate-400); text-transform: uppercase; }

        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-top: 1rem; }
        .day-btn {
            padding: 1rem 0.5rem; border-radius: 1rem; border: 1px solid var(--slate-200); background: white;
            text-align: center; cursor: pointer; transition: all 0.2s;
        }
        .day-btn:hover:not(:disabled) { border-color: var(--pink-500); background: var(--pink-50); }
        .day-btn.selected { background: var(--pink-600); color: white; border-color: var(--pink-600); }
        .day-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .day-name { font-size: 10px; font-weight: 900; uppercase; display: block; margin-bottom: 4px; color: inherit; }
        .day-num { font-weight: 800; font-size: 1.1rem; }

        .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.75rem; margin-top: 2rem; }
        .slot-btn {
            padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--slate-200); background: white;
            font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .slot-btn:hover:not(:disabled) { border-color: var(--pink-500); color: var(--pink-600); }
        .slot-btn.selected { background: var(--pink-600); color: white; border-color: var(--pink-600); }
        .slot-btn:disabled { opacity: 0.3; background: var(--slate-100); cursor: not-allowed; }

        .form-container { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .input {
            width: 100%; padding: 1rem 1.5rem; border-radius: 1rem; border: 1px solid var(--slate-200);
            font-family: inherit; font-size: 0.9rem; outline: none; transition: all 0.2s;
        }
        .input:focus { border-color: var(--pink-500); box-shadow: 0 0 0 4px var(--pink-50); }

        .btn {
            width: 100%; padding: 1.25rem; border-radius: 1rem; border: none; background: var(--pink-600);
            color: white; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
            cursor: pointer; transition: all 0.3s;
        }
        .btn:hover { background: var(--pink-500); transform: scale(1.02); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .back-btn { margin-bottom: 2rem; font-size: 0.75rem; font-weight: 900; color: var(--slate-400); cursor: pointer; text-transform: uppercase; }
        .back-btn:hover { color: var(--pink-600); }

        .loading { padding: 4rem; text-align: center; font-weight: 900; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; }

        .success-box {
            text-align: center; padding: 4rem; background: var(--pink-50); border-radius: 40px; border: 2px dashed var(--pink-200);
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
                this.renderError('Dominio no configurado');
                return;
            }

            this.state.owner_id = user.id;

            const [servicesRes, settingsRes] = await Promise.all([
                this.supabase.from('beauty_services').select('*').eq('owner_id', user.id),
                this.supabase.from('beauty_settings').select('*').eq('owner_id', user.id).maybeSingle()
            ]);

            this.state.services = servicesRes.data || [];
            this.state.settings = settingsRes.data || { slots_per_hour: 1, business_hours: {} };
            this.state.loading = false;
            this.render();
        }

        render() {
            if (this.state.loading) {
                this.shadowRoot.innerHTML = `<style>${styles}</style><div class="loading">Sincronizando Agenda...</div>`;
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
                <div class="step-header">
                    <h2 class="step-title">Selecciona un Servicio</h2>
                </div>
                <div class="services-grid">
                    ${this.state.services.map(s => `
                        <div class="service-card" data-id="${s.id}">
                            <img src="${s.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80'}" class="service-img">
                            <div class="service-info">
                                <div class="service-name">${s.name}</div>
                                <div class="service-meta">
                                    <span>${s.duration_minutes} MIN</span>
                                    <span style="color:var(--pink-600)">$${s.price}</span>
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
                <div class="step-header">
                    <h2 class="step-title">Fecha y Hora</h2>
                    <p style="color:var(--slate-400); font-size:0.8rem; font-weight:bold; margin-top:0.5rem">Selecciona el día de tu cita</p>
                </div>
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
                    <div class="slots-grid">
                        ${this.state.availableSlots.length > 0 ?
                            this.state.availableSlots.map(s => `
                                <button class="slot-btn ${this.state.selectedTime === s.slot_time ? 'selected' : ''}"
                                        data-time="${s.slot_time}"
                                        ${!s.is_available ? 'disabled' : ''}>
                                    ${s.slot_time.substring(0,5)}
                                </button>
                            `).join('') :
                            '<div style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--slate-400); font-weight:bold">No hay horarios disponibles para este día</div>'
                        }
                    </div>
                    <div style="margin-top: 3rem">
                        <button class="btn" id="go-to-form" ${!this.state.selectedTime ? 'disabled' : ''}>Continuar</button>
                    </div>
                ` : ''}
            `;
        }

        renderForm() {
            return `
                <div class="back-btn" id="go-back"> <i class="fas fa-arrow-left"></i> Volver al calendario</div>
                <div class="step-header">
                    <h2 class="step-title">Tus Datos</h2>
                    <p style="color:var(--slate-400); font-size:0.8rem; font-weight:bold; margin-top:0.5rem">Confirmación de cita: ${this.state.selectedService.name} - ${this.state.selectedDate} ${this.state.selectedTime}</p>
                </div>
                <form class="form-container" id="appointment-form">
                    <input type="text" id="cust-name" placeholder="Nombre completo" required class="input">
                    <input type="email" id="cust-email" placeholder="Correo electrónico" required class="input">
                    <input type="tel" id="cust-phone" placeholder="Teléfono de contacto" required class="input">
                    <button type="submit" class="btn">Confirmar Reserva</button>
                </form>
            `;
        }

        renderSuccess() {
            return `
                <div class="success-box animate-fade">
                    <div style="font-size: 4rem; color: var(--pink-500); margin-bottom: 2rem;"><i class="fas fa-check-circle"></i></div>
                    <h2 class="step-title" style="margin-bottom: 1rem">¡Cita Agendada!</h2>
                    <p style="color: var(--slate-600); font-weight: 500; line-height: 1.6">Tu solicitud ha sido recibida correctamente. Nos pondremos en contacto contigo pronto para confirmar los detalles.</p>
                    <button class="btn" style="margin-top: 3rem; width: auto; padding: 1rem 3rem" id="restart">Volver al inicio</button>
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
                        btn.innerText = 'Confirmar Reserva';
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
            const { data, error } = await this.supabase.rpc('check_beauty_availability', {
                p_owner_id: this.state.owner_id,
                p_date: this.state.selectedDate
            });

            if (error) {
                console.error("RPC Error:", error);
                this.state.availableSlots = [];
            } else {
                this.state.availableSlots = data || [];
            }
        }

        renderError(msg) {
            this.shadowRoot.innerHTML = `<style>${styles}</style><div class="loading" style="color:var(--pink-600)">${msg}</div>`;
        }
    }

    customElements.define('wisbe-beauty-citas', WisbeBeautyCitas);
})();
