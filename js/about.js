// js/about.js
import * as THREE from 'three'; // Necesitamos Three para calcular vectores

export function inicializarAbout(camera, modeloReal) {
    // Escuchamos cada vez que el usuario mueve la rueda del ratón
    window.addEventListener('scroll', () => {
        
        // Calculamos qué porcentaje de la página ha scrolleado el usuario (de 0 a 1)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = scrollY / maxScroll;

        // --- EFECTO CINEMÁTICO 1: ACERCAR LA CÁMARA ---
        // La cámara empieza en Z=4 y termina en Z=2 (hace zoom in)
        camera.position.z = THREE.MathUtils.lerp(4, 2, scrollFraction);
        
        // --- EFECTO CINEMÁTICO 2: MOVER EL ANILLO AL LADO ---
        // Si hay un modelo cargado, lo movemos hacia la izquierda a medida que bajamos
        // Empieza en X=0 (centro) y se mueve hasta X=-1.5 (izquierda)
        if (modeloReal) {
            modeloReal.position.x = THREE.MathUtils.lerp(0, -1.5, scrollFraction);
            
            // También podemos inclinarlo un poco hacia arriba para que se vea más imponente
            modeloReal.rotation.x = THREE.MathUtils.lerp(0, 0.5, scrollFraction);
        }
        
    });

    console.log("Módulo Scrollytelling activado.");
}