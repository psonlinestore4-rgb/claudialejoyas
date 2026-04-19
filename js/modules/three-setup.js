// js/modules/three-setup.js
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // AÑADIDO: Fundamental para rotar

export async function initThreeScene(containerId) {
    const container = document.getElementById(containerId);
    
    const scene = new THREE.Scene();
    scene.background = null; // Transparente para tu CSS
    
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    // Acercamos un poco más la cámara por defecto
    camera.position.set(0, 0, 4); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    
    // --- FOTORREALISMO (Settings Nivel Richter Phillips) ---
    renderer.toneMapping = THREE.ACESFilmicToneMapping; 
    renderer.toneMappingExposure = 1.5; // Un poco menos quemado para destacar los brillos
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // ---> NUEVO: Activar procesamiento de sombras suaves en el motor <---
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // --- ILUMINACIÓN REFLECTIVA PARA JOYAS ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    // Intensidad del entorno aumentada para que el oro brille espectacularmente
    scene.environmentIntensity = 2.5; 
    
    // Luces de estudio (Setup de Joyería)
    // 1. Luz principal fría (destellos del diamante)
    const mainLight = new THREE.SpotLight(0xffffff, 80);
    mainLight.position.set(5, 10, 5);
    mainLight.angle = Math.PI / 6;
    mainLight.penumbra = 0.2;
    
    // ---> NUEVO: Hacer que la luz principal proyecte sombras de alta calidad <---
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048; // Alta resolución para sombras nítidas
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001; // Evita artefactos visuales (shadow acne) en el metal
    
    scene.add(mainLight);

    // 2. Luz de relleno cálida (para resaltar el oro)
    const fillLight = new THREE.PointLight(0xffeebb, 40);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    container.appendChild(renderer.domElement);

    // --- CONTROLES INTERACTIVOS ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Movimiento suave
    controls.dampingFactor = 0.05;
    controls.enablePan = false; // Evita que el usuario saque el anillo de la pantalla
    controls.minDistance = 2;   // Zoom in máximo
    controls.maxDistance = 8;   // Zoom out máximo
    // Limitamos la rotación para que no lo vean por debajo si no quieres
    // controls.maxPolarAngle = Math.PI / 2 + 0.2; 

    // Ajuste al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Retornamos también los controles para que main.js los actualice
    return { scene, camera, renderer, controls };
}