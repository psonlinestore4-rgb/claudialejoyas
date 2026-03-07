import { metalMaterials, gemMaterials, applyMaterialToMesh } from './materials.js';
import { loadMetals, loadGems } from './db-service.js';

let currentModel = null;
let metals = [];
let gems = [];

export async function initConfigurator(model) {
    currentModel = model;

    // Intentar cargar desde Supabase, si falla usar locales
    try {
        metals = await loadMetals();
        gems = await loadGems();
    } catch (e) {
        console.warn('Usando materiales locales');
        metals = Object.keys(metalMaterials).map(key => ({
            slug: key,
            name: key.replace('-', ' '),
            material_config: metalMaterials[key]
        }));
        gems = Object.keys(gemMaterials).map(key => ({
            slug: key,
            name: key,
            material_config: gemMaterials[key]
        }));
    }

    // Generar botones en el panel
    renderOptions('opciones-metal', metals, 'metal');
    renderOptions('opciones-gema', gems, 'gema');

    // Asignar eventos a los botones (ya se hace en renderOptions)
}

function renderOptions(containerId, items, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => {
        if (type === 'metal') {
            // Botones circulares de color
            const color = item.material_config.color ? '#' + item.material_config.color.toString(16).padStart(6, '0') : '#cccccc';
            return `<button class="btn-color" data-${type}="${item.slug}" style="background: ${color};" title="${item.name}"></button>`;
        } else {
            // Botones de texto para gemas
            return `<button class="btn-texto" data-${type}="${item.slug}">${item.name}</button>`;
        }
    }).join('');

    // Añadir event listeners
    container.querySelectorAll('[data-metal]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase activo de otros metales
            container.querySelectorAll('.btn-color').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            cambiarMetal(btn.dataset.metal);
        });
    });

    container.querySelectorAll('[data-gema]').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.btn-texto').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            cambiarGema(btn.dataset.gema);
        });
    });
}

function cambiarMetal(slug) {
    if (!currentModel) return;
    currentModel.traverse(child => {
        if (child.isMesh && child.name.includes('Material_1_0')) { // Ajusta según tu modelo
            applyMaterialToMesh(child, slug, 'metal');
        }
    });
}

function cambiarGema(slug) {
    if (!currentModel) return;
    currentModel.traverse(child => {
        if (child.isMesh && child.name.includes('Object_2_Material_3_0')) { // Ajusta según tu modelo
            applyMaterialToMesh(child, slug, 'gem');
        }
    });
}

// Exponer globalmente para los botones onclick (si se usara así)
window.cambiarMetal = cambiarMetal;
window.cambiarGema = cambiarGema;