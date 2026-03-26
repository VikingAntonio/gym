import CONFIG from './config.js';

// Inicializar Supabase (usando la librería cargada vía CDN en el HTML)
const { createClient } = window.supabase;
export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// Helper para subir a Cloudinary
export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
}

// Helper para navegación (Navbar común)
export function renderNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    nav.className = "bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg border-b border-white/5";
    nav.innerHTML = `
        <div class="container mx-auto flex justify-between items-center">
            <a href="index.html" class="text-2xl font-black tracking-tighter text-blue-500">GYM <span class="text-white">PRO</span></a>
            <ul class="hidden md:flex space-x-8 items-center font-bold text-sm uppercase tracking-widest text-slate-300">
                <li><a href="index.html" class="hover:text-blue-400 transition-colors">Inicio</a></li>
                <li><a href="nutricion.html" class="hover:text-emerald-400 transition-colors">Nutrición</a></li>
                <li><a href="rutinas.html" class="hover:text-orange-400 transition-colors">Rutinas</a></li>
                <li><a href="entrenadores.html" class="hover:text-indigo-400 transition-colors">Equipo</a></li>
                <li><a href="test.html" class="bg-blue-600 px-6 py-3 rounded-full text-white hover:bg-blue-700 transition shadow-lg shadow-blue-900/40">Hacer Test</a></li>
                <li><a href="admin.html" class="text-slate-500 hover:text-white transition-colors" title="Administración"><i class="fas fa-cog text-lg"></i></a></li>
            </ul>
            <!-- Mobile Toggle -->
            <button class="md:hidden text-white text-2xl"><i class="fas fa-bars"></i></button>
        </div>
    `;
}
