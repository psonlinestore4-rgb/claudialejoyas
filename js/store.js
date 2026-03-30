// js/store.js
import * as THREE from 'three';

// Aplicador maestro de materiales físicos
function aplicarMaterial(mesh, tipo, config) {
    if (tipo === 'metal') {
        if (!mesh.material.isMeshStandardMaterial) {
            mesh.material = new THREE.MeshStandardMaterial();
        }
        mesh.material.color.setHex(config.color);
        mesh.material.metalness = config.metalness;
        mesh.material.roughness = config.roughness;
        mesh.material.envMapIntensity = config.envMapIntensity;
    } else if (tipo === 'gem') {
        mesh.material = new THREE.MeshPhysicalMaterial({
            color: config.color,
            metalness: 0,
            roughness: config.roughness,
            transmission: config.transmission,
            ior: config.ior,
            thickness: 1.5,
            envMapIntensity: config.envMapIntensity,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            transparent: true
        });
    }
    mesh.material.needsUpdate = true;
}

export async function inicializarTienda(modeloReal, threeEnv) {
    if (!modeloReal) return;

    // --- DIAGNÓSTICO INTERNO ---
    console.log("🔍 ESTRUCTURA DE TU ANILLO 3D:");
    modeloReal.traverse((child) => {
        if (child.isMesh) {
            console.log(`- Malla encontrada: "${child.name}"`);
        }
    });
    console.log("-----------------------------------");

    const configMateriales = {
        'yellow-gold': { tipo: 'metal', color: 0xd4af37, metalness: 1.0, roughness: 0.1, envMapIntensity: 2.5 },
        'rose-gold':   { tipo: 'metal', color: 0xb76e79, metalness: 1.0, roughness: 0.1, envMapIntensity: 2.5 },
        'platinum':    { tipo: 'metal', color: 0xe5e4e2, metalness: 1.0, roughness: 0.08, envMapIntensity: 2.5 },
        'diamante':    { tipo: 'gem', color: 0xffffff, transmission: 1.0, ior: 2.417, roughness: 0, envMapIntensity: 3.5 }
    };

    let precioBase = 1250;
    let extraGema = 0;
    let extraQuilates = 0;
    const precioDOM = document.getElementById('precio-actual');

    // Variables para animación suave (Lerp)
    let targetScale = new THREE.Vector3(1, 1, 1);
    const lerpSpeed = 0.08;

    const actualizarPrecio = () => {
        if (precioDOM) {
            precioDOM.innerText = `$${(precioBase + extraGema + extraQuilates).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
    };

    // --- 1. LÓGICA DE METALES (Ajustada a tus nombres técnicos) ---
    const botonesMetal = document.querySelectorAll('#paso-2 .opt-visual-btn');
    botonesMetal.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesMetal.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const metalType = btn.dataset.value;
            const config = configMateriales[metalType];

            precioBase = (metalType === 'platinum') ? 1400 : 1250;
            actualizarPrecio();

            modeloReal.traverse((child) => {
                // Buscamos cualquier malla que contenga "Material_1_0" (el nombre de tu metal)
                if (child.isMesh && child.name.includes('Material_1_0')) {
                    aplicarMaterial(child, 'metal', config);
                }
            });
        });
    });

    // --- 2. LÓGICA DE FORMA DE GEMA (Simulación Suave) ---
    const botonesGema = document.querySelectorAll('#paso-1 .opt-visual-btn');
    botonesGema.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesGema.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const forma = btn.dataset.value.toLowerCase();

            // Definimos la deformación según la forma elegida
            if (forma === 'marquise') {
                extraGema = 500;
                targetScale.set(0.65, 1.4, 0.65); // Estira la gema
            } else if (forma === 'pear') {
                extraGema = 300;
                targetScale.set(0.8, 1.25, 0.8);  // Forma de gota
            } else if (forma === 'emerald') {
                extraGema = 450;
                targetScale.set(1.1, 0.9, 1.1);   // Más ancha/achatada
            } else {
                extraGema = 0;
                targetScale.set(1, 1, 1);         // Redonda original
            }
            actualizarPrecio();

            modeloReal.traverse((child) => {
                // Apuntamos a tu gema específica "Object_2_Material_3_0"
                if (child.isMesh && child.name === "Object_2_Material_3_0") {
                    aplicarMaterial(child, 'gem', configMateriales['diamante']);
                }
            });
        });
    });

    // --- 3. LÓGICA DE QUILATES (TAMAÑO) ---
    const botonesQuilates = document.querySelectorAll('.opt-quilates-btn');
    botonesQuilates.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesQuilates.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const escalaFactor = parseFloat(btn.dataset.scale); 
            extraQuilates = parseFloat(btn.dataset.price); 
            actualizarPrecio();

            // Multiplicamos la escala objetivo por el tamaño seleccionado
            targetScale.multiplyScalar(escalaFactor);
        });
    });

    // --- 4. INICIALIZACIÓN POR DEFECTO ---
    modeloReal.traverse((child) => {
        if (child.isMesh && child.name.includes('Material_1_0')) {
            aplicarMaterial(child, 'metal', configMateriales['yellow-gold']);
        }
        if (child.isMesh && child.name === "Object_2_Material_3_0") {
            aplicarMaterial(child, 'gem', configMateriales['diamante']);
        }
    });

    // Loop interno para suavizar la transición de escala (Lerp)
    const renderAnim = () => {
        requestAnimationFrame(renderAnim);
        modeloReal.traverse((child) => {
            if (child.isMesh && child.name === "Object_2_Material_3_0") {
                child.scale.lerp(targetScale, lerpSpeed);
            }
        });
    };
    renderAnim();

    actualizarPrecio();
    console.log('Atelier 3D inicializado con éxito.');
}