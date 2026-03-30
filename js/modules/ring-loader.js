import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadRingModel(scene, url) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            url, 
            (gltf) => {
                const model = gltf.scene;
                
                // Centramos el modelo automáticamente
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                model.position.set(-center.x, -center.y, -center.z);
                
                // Lo hacemos un poco más grande (escala 2.5) para que impacte en la portada
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 0) {
                    const scale = 2.5 / maxDim; 
                    model.scale.set(scale, scale, scale);
                }

                scene.add(model);
                resolve(model); // ¡Éxito!
            },
            undefined, 
            (error) => {
                console.error("Error interno de Three.js:", error);
                reject(error);
            }
        );
    });
}