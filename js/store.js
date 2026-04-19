import * as THREE from 'three';

// Aplicador maestro de materiales físicos
function aplicarMaterial(mesh, tipo, config, acabadoBrazo = 'pulido') {
    if (mesh.material && typeof mesh.material.dispose === 'function') {
        mesh.material.dispose();
    }

    if (tipo === 'metal') {
        let roughness = config.roughness;
        let metalness = config.metalness;

        if (acabadoBrazo === 'mate') {
            roughness = 0.40; 
            metalness = 0.90;
        } else if (acabadoBrazo === 'cepillado') {
            roughness = 0.65; 
            metalness = 0.75; 
        }

        mesh.material = new THREE.MeshStandardMaterial({
            color: config.color,
            metalness: metalness,
            roughness: roughness,
            envMapIntensity: config.envMapIntensity,
            side: THREE.DoubleSide
        });
    } else if (tipo === 'gem') {
        mesh.material = new THREE.MeshPhysicalMaterial({
            color: config.color,
            metalness: 0,
            roughness: config.roughness,
            transmission: config.transmission,
            ior: config.ior,
            thickness: 2.5, 
            envMapIntensity: config.envMapIntensity,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            dispersion: 0.04, 
            side: THREE.DoubleSide, 
            transparent: false 
        });
    }
    mesh.material.needsUpdate = true;
}

export async function inicializarTienda(modeloReal, threeEnv) {
    if (!modeloReal) return;

    const configMateriales = {
        'yellow-gold': { tipo: 'metal', color: 0xE1C699, metalness: 1.0, roughness: 0.05, envMapIntensity: 3.0 },
        'platinum':    { tipo: 'metal', color: 0xF4F4F4, metalness: 1.0, roughness: 0.05, envMapIntensity: 3.0 },
        'rose-gold':   { tipo: 'metal', color: 0xDDA9A0, metalness: 1.0, roughness: 0.08, envMapIntensity: 3.0 },
        'diamante':    { tipo: 'gem', color: 0xffffff, transmission: 1.0, ior: 2.417, roughness: 0, envMapIntensity: 4.0 }
    };

    let estado = {
        metalActivo: 'yellow-gold',
        acabadoActivo: 'pulido',
        precioBase: 1250,
        extraGema: 0,
        extraQuilates: 250
    };

    const precioDOM = document.getElementById('precio-actual');

    const baseGemScale = new THREE.Vector3(); 
    let escalaForma = new THREE.Vector3(1, 1, 1);
    let factorQuilate = 1.0;
    let targetScale = new THREE.Vector3(1, 1, 1);
    let lastScale = new THREE.Vector3(0, 0, 0);
    const lerpSpeed = 0.08;
    
    let pivoteCentrado = false;
    let diamanteMesh = null;
    let metalesMeshes = [];
    let centroDiamante = new THREE.Vector3();
    let radioInfluencia = 0;

    const actualizarPrecio = () => {
        if (precioDOM) {
            const total = estado.precioBase + estado.extraGema + estado.extraQuilates;
            precioDOM.innerText = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
    };

    const calcularEscalaFinal = () => {
        if (pivoteCentrado) {
            targetScale.copy(baseGemScale).multiply(escalaForma).multiplyScalar(factorQuilate);
        }
    };

    modeloReal.traverse((child) => {
        if (child.isMesh) {
            const nombre = child.name.toLowerCase();
            
            if (nombre.includes('plane') || nombre.includes('ground') || nombre.includes('base') || nombre.includes('floor')) {
                child.visible = false;
                return; 
            }

            const matNombre = child.material ? child.material.name.toLowerCase() : '';
            const esGema = child.name === "Object_2_Material_3_0" || nombre.includes('gem') || nombre.includes('diam') || matNombre.includes('gem');

            if (esGema) {
                if (!pivoteCentrado) {
                    child.geometry.computeBoundingBox();
                    child.geometry.boundingBox.getCenter(centroDiamante);
                    
                    child.geometry.translate(-centroDiamante.x, -centroDiamante.y, -centroDiamante.z);
                    child.position.add(centroDiamante);
                    
                    const gemSize = new THREE.Vector3();
                    child.geometry.boundingBox.getSize(gemSize);
                    
                    radioInfluencia = Math.max(gemSize.x, gemSize.y, gemSize.z) * 1.5;
                    
                    centroDiamante.copy(child.position);
                    baseGemScale.copy(child.scale); 
                    targetScale.copy(child.scale);
                    pivoteCentrado = true;
                }
                diamanteMesh = child;
                aplicarMaterial(child, 'gem', configMateriales['diamante']);
            } else {
                const posAttribute = child.geometry.attributes.position;
                child.geometry.userData.originalPosition = posAttribute.clone();
                metalesMeshes.push(child);
                aplicarMaterial(child, 'metal', configMateriales['yellow-gold'], estado.acabadoActivo);
            }
        }
    });

    const botonesForma = document.querySelectorAll('.btn-forma');
    botonesForma.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesForma.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const forma = btn.dataset.value;

            if (forma === 'marquis') { estado.extraGema = 500; escalaForma.set(0.70, 1.40, 0.70); } 
            else if (forma === 'drop') { estado.extraGema = 300; escalaForma.set(0.85, 1.25, 0.85); } 
            else if (forma === 'oval') { estado.extraGema = 200; escalaForma.set(0.85, 1.15, 0.85); } 
            else if (forma === 'princess') { estado.extraGema = 450; escalaForma.set(1.10, 0.90, 1.10); } 
            else if (forma === 'square') { estado.extraGema = 400; escalaForma.set(1.15, 0.85, 1.15); } 
            else { estado.extraGema = 0; escalaForma.set(1, 1, 1); }
            
            calcularEscalaFinal();
            actualizarPrecio();
        });
    });

    const botonesTamano = document.querySelectorAll('.btn-tamano');
    botonesTamano.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesTamano.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            factorQuilate = parseFloat(btn.dataset.scale); 
            estado.extraQuilates = parseFloat(btn.dataset.price); 
            
            calcularEscalaFinal();
            actualizarPrecio();
        });
    });

    const botonesBrazo = document.querySelectorAll('.btn-brazo');
    botonesBrazo.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesBrazo.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            estado.acabadoActivo = btn.dataset.finish;
            const config = configMateriales[estado.metalActivo];

            metalesMeshes.forEach(metal => {
                aplicarMaterial(metal, 'metal', config, estado.acabadoActivo);
            });
        });
    });

    const botonesMetal = document.querySelectorAll('.btn-metal');
    botonesMetal.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesMetal.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            estado.metalActivo = btn.dataset.value;
            const config = configMateriales[estado.metalActivo];

            estado.precioBase = (estado.metalActivo === 'platinum') ? 1400 : 1250;
            actualizarPrecio();

            metalesMeshes.forEach(metal => {
                aplicarMaterial(metal, 'metal', config, estado.acabadoActivo);
            });
        });
    });

    const renderAnim = () => {
        requestAnimationFrame(renderAnim);
        
        if (diamanteMesh && pivoteCentrado) {
            diamanteMesh.scale.lerp(targetScale, lerpSpeed);
            
            if (diamanteMesh.scale.distanceTo(lastScale) > 0.0001) {
                const currentScale = diamanteMesh.scale;
                
                metalesMeshes.forEach(metal => {
                    if (!metal.geometry.userData.originalPosition) return;
                    const original = metal.geometry.userData.originalPosition;
                    const position = metal.geometry.attributes.position;

                    for (let i = 0; i < original.count; i++) {
                        let x = original.getX(i);
                        let y = original.getY(i);
                        let z = original.getZ(i);

                        let vPos = new THREE.Vector3(x, y, z);
                        let dist = vPos.distanceTo(centroDiamante);
                        
                        let factor = 1.0 - (dist / radioInfluencia);
                        if (factor < 0) factor = 0;
                        if (factor > 1) factor = 1;
                        factor = Math.pow(factor, 3); 

                        let newX = x + (x - centroDiamante.x) * (currentScale.x - 1) * factor;
                        let newY = y + (y - centroDiamante.y) * (currentScale.y - 1) * factor;
                        let newZ = z + (z - centroDiamante.z) * (currentScale.z - 1) * factor;

                        position.setX(i, newX);
                        position.setY(i, newY);
                        position.setZ(i, newZ);
                    }
                    position.needsUpdate = true;
                    metal.geometry.computeVertexNormals();
                });
                lastScale.copy(currentScale);
            }
        }
    };
    renderAnim();

    actualizarPrecio();
}