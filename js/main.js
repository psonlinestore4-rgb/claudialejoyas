import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { inicializarTienda } from './store.js';

let scene, camera, renderer, controls, environment, composer;

function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 4.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const luzPrincipal = new THREE.PointLight(0xffffff, 8, 20);
    luzPrincipal.position.set(2, 4, 3);
    scene.add(luzPrincipal);

    const luzSecundaria = new THREE.PointLight(0xffeedd, 3, 20);
    luzSecundaria.position.set(-3, 2, -2);
    scene.add(luzSecundaria);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 1.0;  
    bloomPass.strength = 0.6;   
    bloomPass.radius = 0.5;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 0.8;
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controls.enablePan = false;
    controls.enableZoom = false;

    const loader = new GLTFLoader();
    
    // RUTA CORREGIDA: Se lee desde la raíz donde está el index.html
    loader.load('assets/models/anillo_real.glb', (gltf) => {
        const modelo = gltf.scene;
        
        const basura = [];
        modelo.traverse((child) => {
            if (child.isLight || child.isCamera) {
                basura.push(child);
            }
        });
        basura.forEach(b => b.removeFromParent());

        const boxEscala = new THREE.Box3();
        modelo.traverse((child) => {
            if (child.isMesh) {
                const n = child.name.toLowerCase();
                if (!n.includes('plane') && !n.includes('ground') && !n.includes('base') && !n.includes('floor')) {
                    boxEscala.expandByObject(child);
                }
            }
        });
        
        const size = new THREE.Vector3();
        boxEscala.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        
        const scale = 1.5 / (maxDim === 0 ? 1 : maxDim);
        modelo.scale.setScalar(scale);

        const boxFinal = new THREE.Box3().setFromObject(modelo);
        const center = new THREE.Vector3();
        boxFinal.getCenter(center);
        modelo.position.sub(center);
        
        modelo.position.y -= 0.5;
        
        scene.add(modelo);
        
        inicializarTienda(modelo, { scene, camera, renderer });

    }, undefined, (error) => {
        console.error('Error cargando anillo_real.glb:', error);
    });

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render(); 
}

init();