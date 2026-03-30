// js/modules/cinematics.js
import * as THREE from 'three';

export function initCinematicScroll(camera, model) {
    window.addEventListener('scroll', () => {
        if (!model) return;

        // Calculamos qué porcentaje de la página (0 a 1) se ha scrolleado
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        let scrollProgress = 0;
        
        if (maxScroll > 0) {
            scrollProgress = scrollY / maxScroll;
        }

        // --- COREOGRAFÍA DEL ANILLO ---
        // 1. Zoom In al bajar
        camera.position.z = THREE.MathUtils.lerp(5, 2.5, scrollProgress);
        
        // 2. Mover hacia la izquierda (Para dejar espacio al panel de configuración)
        // Usamos Math.sin para hacer una curva suave
        model.position.x = Math.sin(scrollProgress * Math.PI) * -1.2; 
        
        // 3. Inclinar sutilmente para ver los detalles
        model.rotation.x = THREE.MathUtils.lerp(0, 0.5, scrollProgress);
    });
}

export function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;

    function checkReveals() {
        const revealPoint = 100; 
        reveals.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    // Comprobar al iniciar y al hacer scroll
    window.addEventListener('scroll', checkReveals);
    checkReveals(); // Ejecutar una vez al cargar
}