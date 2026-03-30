// main.js
import { initThreeScene } from './js/modules/three-setup.js';
import { loadRingModel } from './js/modules/ring-loader.js';
import { initScrollReveals } from './js/modules/cinematics.js';

// Importamos la lógica que controla los botones del panel en customize.html
import { inicializarTienda } from './js/store.js';

// --- DETECTAR PÁGINA ACTUAL ---
const isCustomizePage = window.location.pathname.toLowerCase().includes('customize.html');

// --- EFECTO DEL NAVBAR ---
function initNavbarEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

async function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    initNavbarEffect();

    // Animaciones de texto solo si NO estamos en el Atelier
    if (typeof initScrollReveals === 'function' && !isCustomizePage) {
        initScrollReveals();
    }

    try {
        // 1. Inicializar Escena (Cámara, Luces, Render)
        const threeEnv = await initThreeScene('canvas-container');
        
        // 2. Cargar el Modelo Base
        const model = await loadRingModel(threeEnv.scene, 'assets/models/anillo_real.glb');
        
        if (isCustomizePage) {
            /* --- CONFIGURACIÓN PARA EL ATELIER (customize.html) --- */
            
            // Posicionamos el anillo a la izquierda (X = -1.2) para no chocar con el panel
            model.position.set(-1.2, 0, 0); 
            threeEnv.camera.position.set(0, 0, 5);

            // Activamos la lógica de los botones (Metal, Piedra, Pasos)
            if (typeof inicializarTienda === 'function') {
                inicializarTienda(model, threeEnv);
            }
            
        } else {
            /* --- CONFIGURACIÓN PARA EL INDEX / OTROS --- */
            model.position.set(0, 0, 0);
            threeEnv.camera.position.set(0, 0, 4.5);
        }

        // 3. Bucle de Animación
        function animate() {
            requestAnimationFrame(animate);
            
            // Si estamos en el Atelier, la rotación automática es casi imperceptible
            // para que no moleste mientras el usuario elige opciones.
            if (model) {
                if (isCustomizePage) {
                    model.rotation.y += 0.001; 
                } else {
                    model.rotation.y += 0.005; // Rotación más rápida en el Index
                }
            }
            
            // Actualizar controles de cámara si existen (OrbitControls)
            if (threeEnv.controls) {
                threeEnv.controls.update();
            }
            
            threeEnv.renderer.render(threeEnv.scene, threeEnv.camera);
        }
        animate();

        // 4. Manejo de Redimensionamiento
        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            threeEnv.camera.aspect = width / height;
            threeEnv.camera.updateProjectionMatrix();
            threeEnv.renderer.setSize(width, height);
        });

    } catch (error) {
        console.error("Error en la experiencia 3D de Claudiale:", error);
    }
}

document.addEventListener('DOMContentLoaded', init);