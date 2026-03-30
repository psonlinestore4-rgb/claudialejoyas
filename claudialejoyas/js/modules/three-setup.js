// js/modules/three-setup.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function initThreeScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error('Container not found');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x221d1a); // Fondo oscuro para integrarse

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2; // Limitar rotación
    controls.minDistance = 2;
    controls.maxDistance = 8;

    // Iluminación
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 1.5;

    const luzPrincipal = new THREE.SpotLight(0xffffff, 5);
    luzPrincipal.position.set(5, 5, 2);
    luzPrincipal.angle = Math.PI / 6;
    luzPrincipal.penumbra = 0.5;
    luzPrincipal.decay = 1;
    luzPrincipal.distance = 20;
    luzPrincipal.castShadow = true;
    scene.add(luzPrincipal);

    const luzRellena = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(luzRellena);

    // Pequeña luz trasera para dar brillo
    const backLight = new THREE.PointLight(0x4466aa, 0.5);
    backLight.position.set(-2, 1, -2);
    scene.add(backLight);

    return { scene, camera, renderer, controls };
}