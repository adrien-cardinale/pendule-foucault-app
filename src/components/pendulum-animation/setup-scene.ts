import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type SceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  cubeCamera: THREE.CubeCamera | null;
};

type SceneContextOptions = {
  lowPerformance?: boolean;
  enableReflections?: boolean;
};

export function createSceneContext(options: SceneContextOptions = {}): SceneContext {
  const { lowPerformance = false, enableReflections = true } = options;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070f);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 16);

  const renderer = new THREE.WebGLRenderer({
    antialias: !lowPerformance,
    powerPreference: lowPerformance ? 'low-power' : 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerformance ? 1 : 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Cube camera used to generate an environment map for reflective materials.
  // It is disabled on low-power devices because it is expensive to update.
  let cubeCamera: THREE.CubeCamera | null = null;
  if (enableReflections && !lowPerformance) {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBAFormat,
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 8);
  sunLight.position.set(10, 6, 8);
  scene.add(sunLight);

  return { scene, camera, renderer, controls, cubeCamera };
}

export function attachResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}