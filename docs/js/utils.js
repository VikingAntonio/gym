import CONFIG from './config.js';

// Inicializar Supabase (usando la librería cargada vía CDN en el HTML)
const { createClient } = window.supabase;
export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

/**
 * Helper para subir a Cloudinary
 */
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

/**
 * Configura un área de Drag and Drop moderna
 * @param {HTMLElement} dropZone - El contenedor de la zona
 * @param {HTMLInputElement} fileInput - El input file oculto
 * @param {Function} callback - Función que se ejecuta al recibir el archivo
 */
export function setupDragAndDrop(dropZone, fileInput, callback) {
    if (!dropZone || !fileInput) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('border-blue-500', 'bg-blue-50', 'scale-[1.02]');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('border-blue-500', 'bg-blue-50', 'scale-[1.02]');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            callback(file);
        }
    }, false);

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) callback(file);
    });
}

/**
 * Helper para navegación (Navbar común)
 */
export function renderNavbar() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    nav.className = "bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg border-b border-white/5";
    nav.innerHTML = `
        <div class="container mx-auto flex justify-between items-center">
            <a href="index.html" class="text-2xl font-black tracking-tighter text-blue-500 italic">GYM <span class="text-white not-italic">PRO</span></a>
            <ul class="hidden md:flex space-x-8 items-center font-bold text-xs uppercase tracking-widest text-slate-300">
                <li><a href="index.html" class="hover:text-blue-400 transition-all hover:-translate-y-0.5 inline-block">Inicio</a></li>
                <li><a href="nutricion.html" class="hover:text-emerald-400 transition-all hover:-translate-y-0.5 inline-block">Nutrición</a></li>
                <li><a href="rutinas.html" class="hover:text-orange-400 transition-all hover:-translate-y-0.5 inline-block">Rutinas</a></li>
                <li><a href="entrenadores.html" class="hover:text-indigo-400 transition-all hover:-translate-y-0.5 inline-block">Equipo</a></li>
                <li><a href="test.html" class="bg-blue-600 px-6 py-2.5 rounded-full text-white hover:bg-blue-700 transition shadow-lg shadow-blue-900/40">Hacer Test</a></li>
                <li><a href="admin.html" class="text-slate-500 hover:text-white transition-colors" title="Administración"><i class="fas fa-cog text-lg"></i></a></li>
            </ul>
            <button class="md:hidden text-white text-2xl"><i class="fas fa-bars"></i></button>
        </div>
    `;
}
