// js/index.js

export function inicializarPortada() {
    const botonEntrar = document.getElementById('cartel-open');
    
    if(botonEntrar) {
        botonEntrar.addEventListener('click', () => {
            // Abre las puertas
            document.getElementById('puerta-contenedor').classList.add('abierta');
            
            // Después de la animación, muestra la tienda
            setTimeout(() => {
                document.body.style.overflowY = 'auto'; // Permite el scroll
                document.getElementById('espacio-configurador').classList.remove('oculto');
                document.getElementById('espacio-detalles').classList.remove('oculto');
                document.getElementById('puerta-contenedor').style.pointerEvents = 'none';
            }, 1500);
        });
    }
}