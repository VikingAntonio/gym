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

    nav.className = "bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg";
    nav.innerHTML = `
        <div class="container mx-auto flex justify-between items-center">
            <a href="index.html" class="text-2xl font-bold text-blue-500">GYM <span class="text-white">PRO</span></a>
            <ul class="flex space-x-6 overflow-x-auto">
                <li><a href="index.html" class="hover:text-blue-400 transition">Inicio</a></li>
                <li><a href="nutricion.html" class="hover:text-blue-400 transition">Nutrición</a></li>
                <li><a href="rutinas.html" class="hover:text-blue-400 transition">Rutinas</a></li>
                <li><a href="entrenadores.html" class="hover:text-blue-400 transition">Entrenadores</a></li>
                <li><a href="test.html" class="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">Hacer Test</a></li>
            </ul>
        </div>
    `;
}
