// js/personalizador.js
export function inicializarPersonalizador(model, threeEnv) {
    
    // Escuchar cambios de metal
    document.querySelectorAll('#paso-2 .opt-visual-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const metal = btn.dataset.value;
            aplicarMaterialMetal(model, metal);
            
            // Actualizar UI
            document.querySelectorAll('#paso-2 .opt-visual-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Escuchar cambios de gema (Esto es lo que hace Richter Phillips)
    document.querySelectorAll('#paso-1 .opt-visual-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const forma = btn.dataset.value;
            cambiarFormaGema(model, forma);
            
            document.querySelectorAll('#paso-1 .opt-visual-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function aplicarMaterialMetal(model, metal) {
    model.traverse(node => {
        if (node.isMesh && node.name.includes('Banda')) {
            if (metal === 'yellow-gold') node.material.color.setHex(0xD4AF37);
            if (metal === 'platinum') node.material.color.setHex(0xE5E4E2);
            node.material.roughness = 0.1;
            node.material.metalness = 1;
        }
    });
}

function cambiarFormaGema(model, forma) {
    // Aquí ocultas todas las gemas y solo muestras la que coincide con 'forma'
    model.traverse(node => {
        if (node.name.includes('Gema')) {
            node.visible = node.name.toLowerCase().includes(forma.toLowerCase());
        }
    });
}