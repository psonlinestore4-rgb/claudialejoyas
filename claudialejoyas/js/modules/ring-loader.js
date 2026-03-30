import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadRingModel(url, scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => {
                const model = gltf.scene;

                // Centrar y escalar automáticamente
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                model.position.x = -center.x;
                model.position.y = -center.y;
                model.position.z = -center.z;

                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 0) {
                    const scale = 2 / maxDim;
                    model.scale.set(scale, scale, scale);
                }

                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error('Error cargando el modelo:', error);
                reject(error);
            }
        );
    });
}