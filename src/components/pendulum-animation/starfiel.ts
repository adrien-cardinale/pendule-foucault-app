import * as THREE from 'three';
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js';

type MilkyWayOptions = {
  lowPerformance?: boolean;
};

export function applyMilkyWayBackground(scene: THREE.Scene, options: MilkyWayOptions = {}) {
  const { lowPerformance = false } = options;

  scene.background = new THREE.Color(0x05070f);

  const lightJpgUrl = new URL('../../assets/eso0932a.jpg', import.meta.url).href;
  const tifUrl = new URL('../../assets/eso0932a.tif', import.meta.url).href;
  const textureLoader = new THREE.TextureLoader();
  const tiffLoader = new TIFFLoader();

  const applyBackgroundTexture = (texture: THREE.Texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    scene.background = texture;
  };

  if (lowPerformance) {
    textureLoader.load(
      lightJpgUrl,
      (texture: THREE.Texture) => {
        applyBackgroundTexture(texture);
      },
      undefined,
      () => {
        scene.background = new THREE.Color(0x05070f);
      }
    );
    return;
  }

  tiffLoader.load(
    tifUrl,
    (texture: THREE.Texture) => {
      applyBackgroundTexture(texture);
    },
    undefined,
    () => {
      textureLoader.load(
        lightJpgUrl,
        (texture: THREE.Texture) => {
          applyBackgroundTexture(texture);
        },
        undefined,
        () => {
          scene.background = new THREE.Color(0x05070f);
        }
      );
    }
  );
}