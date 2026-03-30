// js/materials.js
import * as THREE from 'three';

// --- PALETA DE METALES (MeshStandardMaterial) ---
export const metalMaterials = {
    oroAmarillo: {
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.15,
        envMapIntensity: 2.0, // Multiplica el reflejo de la luz del entorno
        name: 'Oro Amarillo 18k'
    },
    oroRosa: {
        color: 0xb76e79,
        metalness: 1.0,
        roughness: 0.18,
        envMapIntensity: 2.0,
        name: 'Oro Rosa 18k'
    },
    oroBlanco: {
        color: 0xe5e4e2,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.2,
        name: 'Oro Blanco / Platino'
    }
};

// --- PALETA DE GEMAS (MeshPhysicalMaterial) ---
// Aquí está la magia: Transmisión (cristal) + IOR (Índice de Refracción Real)
export const gemMaterials = {
    diamante: {
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 1.0,     // Totalmente transparente como cristal
        ior: 2.417,            // Índice físico real de un diamante
        thickness: 0.5,        // Ayuda a calcular la distorsión de la luz adentro
        envMapIntensity: 3.0,  // Captura muchísimos reflejos
        transparent: true,
        name: 'Diamante Corte Brillante'
    },
    esmeralda: {
        color: 0x50c878,
        metalness: 0,
        roughness: 0.05,
        transmission: 0.9,
        ior: 1.57,             // Índice físico de la esmeralda
        thickness: 0.8,
        envMapIntensity: 2.0,
        transparent: true,
        name: 'Esmeralda Colombiana'
    },
    zafiro: {
        color: 0x0f52ba,
        metalness: 0,
        roughness: 0.02,
        transmission: 0.95,
        ior: 1.77,
        thickness: 0.5,
        envMapIntensity: 2.5,
        transparent: true,
        name: 'Zafiro Azul'
    }
};

// --- FUNCIÓN APLICADORA PROFESIONAL ---
export function applyMaterialToPart(partMesh, materialType, materialKey) {
    if (!partMesh) return;

    if (materialType === 'metal' && metalMaterials[materialKey]) {
        // Asignamos el material estándar para metales
        partMesh.material = new THREE.MeshStandardMaterial(metalMaterials[materialKey]);
    } 
    else if (materialType === 'gem' && gemMaterials[materialKey]) {
        // Asignamos el material físico avanzado para cristales
        partMesh.material = new THREE.MeshPhysicalMaterial(gemMaterials[materialKey]);
    }
    
    // Le decimos a Three.js que renderice el nuevo material
    partMesh.material.needsUpdate = true;
}