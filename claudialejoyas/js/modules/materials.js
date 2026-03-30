import * as THREE from 'three';

// Definición local de materiales (pueden ser reemplazados por datos de Supabase)
export const metalMaterials = {
    'oro-amarillo': new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.25,
        emissive: 0x000000,
        emissiveIntensity: 0,
        emissiveMap: null,
        envMapIntensity: 1.5
    }),
    'oro-rosa': new THREE.MeshStandardMaterial({
        color: 0xb76e79,
        metalness: 0.95,
        roughness: 0.28,
        emissive: 0x000000,
        envMapIntensity: 1.5
    }),
    'oro-blanco': new THREE.MeshStandardMaterial({
        color: 0xe5e4e2,
        metalness: 1.0,
        roughness: 0.22,
        emissive: 0x000000,
        envMapIntensity: 1.6
    }),
    'platino': new THREE.MeshStandardMaterial({
        color: 0xe5e4e2,
        metalness: 1.0,
        roughness: 0.18,
        emissive: 0x000000,
        envMapIntensity: 1.7
    })
};

export const gemMaterials = {
    'diamante': new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0.08,
        emissive: 0x88aaff,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.95,
        ior: 2.4,
        reflectivity: 1,
        envMapIntensity: 2.0
    }),
    'zafiro': new THREE.MeshPhysicalMaterial({
        color: 0x0f52ba,
        metalness: 0,
        roughness: 0.12,
        emissive: 0x000000,
        transparent: true,
        opacity: 0.9,
        ior: 1.77,
        reflectivity: 0.9,
        envMapIntensity: 1.8
    }),
    'esmeralda': new THREE.MeshPhysicalMaterial({
        color: 0x50c878,
        metalness: 0,
        roughness: 0.15,
        emissive: 0x224422,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.85,
        ior: 1.58,
        reflectivity: 0.85,
        envMapIntensity: 1.7
    }),
    'rubi': new THREE.MeshPhysicalMaterial({
        color: 0xe0115f,
        metalness: 0,
        roughness: 0.1,
        emissive: 0x440000,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.9,
        ior: 1.76,
        reflectivity: 0.95,
        envMapIntensity: 1.9
    })
};

// Función para aplicar material a una parte del modelo
export function applyMaterialToMesh(mesh, materialKey, type = 'metal') {
    if (!mesh) return;
    const materials = type === 'metal' ? metalMaterials : gemMaterials;
    if (materials[materialKey]) {
        mesh.material = materials[materialKey];
        mesh.material.needsUpdate = true;
    }
}