// js/modules/ui-controller.js
import * as THREE from 'three';

export function initUIController(camera, model) {
    // Efecto de scroll en la cámara (opcional, similar a about.js)
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const fraction = Math.min(scrollY / maxScroll, 1);

        // Efecto sutil: la cámara se acerca ligeramente al bajar
        // Rango de distancia: de 5 a 3.5
        const targetZ = THREE.MathUtils.lerp(5, 3.5, fraction);
        camera.position.z = targetZ;
        
        // También podemos mover el modelo ligeramente
        if (model) {
            model.rotation.y = 0.002 * scrollY * 0.1; // Rotación basada en scroll
        }
    });

    // Opcional: efectos de aparición de textos con scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.tarjeta-info, .tarjeta-coleccion').forEach(el => {
        observer.observe(el);
    });
}