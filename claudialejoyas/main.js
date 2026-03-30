// main.js
import { initThreeScene } from './js/modules/three-setup.js';
import { loadRingModel } from './js/modules/ring-loader.js';
import { initUIController } from './js/modules/ui-interactions.js';
import { initConfigurator } from './js/modules/configurator.js';
import { initContactForm } from './js/modules/contact-form.js'; // opcional

async function init() {
    // 1. Inicializar escena 3D (devuelve { scene, camera, renderer, controls })
    const threeEnv = await initThreeScene('canvas-container');
    
    // 2. Cargar modelo del anillo
    const model = await loadRingModel(threeEnv.scene, 'assets/models/anillo-principal.glb');
    
    // 3. Guardar referencia global para los botones (por ahora)
    window.modeloAnillo = model;
    
    // 4. Inicializar interacciones de UI (navbar, scroll, etc.)
    initUIController();
    
    // 5. Inicializar configurador (pasa el modelo para cambiar materiales)
    initConfigurator(model);
    
    // 6. Inicializar formulario de contacto (opcional)
    initContactForm();
    
    // 7. Iniciar loop de animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotación suave del anillo (opcional)
        if (model) {
            model.rotation.y += 0.002;
        }
        
        threeEnv.controls.update(); // si existen
        threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
    }
    animate();
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}