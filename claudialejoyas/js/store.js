// js/store.js
import { applyMaterialToPart } from './materials.js';
import { loadMetals, loadGems } from './supabase-client.js'; // Asumiendo que existe

export async function inicializarTienda(modeloReal) {
    if (!modeloReal) return;

    // Cargar opciones desde Supabase (opcional, si no, usar configuración local)
    let metales = [];
    let gemas = [];

    try {
        metales = await loadMetals();
        gemas = await loadGems();
    } catch (e) {
        console.warn('Usando metales por defecto', e);
        // Fallback a metales locales
        metales = [
            { slug: 'oro-amarillo', name: 'Oro Amarillo', material_config: { color: 0xffd700, metalness: 0.95, roughness: 0.25 } },
            { slug: 'oro-rosa', name: 'Oro Rosa', material_config: { color: 0xb76e79, metalness: 0.95, roughness: 0.28 } },
        ];
        gemas = [
            { slug: 'diamante', name: 'Diamante', material_config: { color: 0xffffff, roughness: 0.08, emissive: 0x88aaff, emissiveIntensity: 0.15, transparent: true, opacity: 0.95, ior: 2.4 } },
        ];
    }

    // Función para cambiar metal
    window.cambiarMetal = (slugMetal) => {
        const metal = metales.find(m => m.slug === slugMetal);
        if (!metal) return;

        modeloReal.traverse((child) => {
            if (child.isMesh && child.name.includes('Material_1_0')) {
                applyMaterialToPart(child, 'metal', metal.material_config);
            }
        });
    };

    // Función para cambiar gema
    window.cambiarGema = (slugGema) => {
        const gema = gemas.find(g => g.slug === slugGema);
        if (!gema) return;

        modeloReal.traverse((child) => {
            if (child.isMesh && child.name.includes('Object_2_Material_3_0')) {
                applyMaterialToPart(child, 'gem', gema.material_config);
            }
        });
    };

    // Podemos generar dinámicamente los botones en el HTML, o asignar eventos a elementos existentes
    document.querySelectorAll('[data-metal]').forEach(btn => {
        btn.addEventListener('click', () => window.cambiarMetal(btn.dataset.metal));
    });

    document.querySelectorAll('[data-gema]').forEach(btn => {
        btn.addEventListener('click', () => window.cambiarGema(btn.dataset.gema));
    });

    console.log('Configurador listo con', metales.length, 'metales y', gemas.length, 'gemas');
}