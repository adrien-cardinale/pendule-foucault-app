import * as THREE from 'three';
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js';

type CreateEarthOptions = {
  lowPerformance?: boolean;
  enableDetailMaps?: boolean;
};

export function createEarth(earthRadius = 6, options: CreateEarthOptions = {}) {
  const { lowPerformance = false, enableDetailMaps = false } = options;

  const textureQualityPrefix = lowPerformance ? '2k' : '8k';
  const textureLoader = new THREE.TextureLoader();
  const tiffLoader = new TIFFLoader();

  const dayMapUrl = new URL(`../../assets/${textureQualityPrefix}_earth_daymap.jpg`, import.meta.url).href;
  const normalMapUrl = new URL(`../../assets/${textureQualityPrefix}_earth_normal_map.tif`, import.meta.url).href;
  const specularMapUrl = new URL(`../../assets/${textureQualityPrefix}_earth_specular_map.tif`, import.meta.url).href;

  const dayMap = textureLoader.load(dayMapUrl);
  dayMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.minFilter = lowPerformance ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
  dayMap.magFilter = THREE.LinearFilter;
  dayMap.generateMipmaps = !lowPerformance;

  const material = new THREE.MeshPhongMaterial({
    map: dayMap,
    specular: new THREE.Color(0x333333),
    shininess: 25,
  });

  if (enableDetailMaps) {
    tiffLoader.load(normalMapUrl, (normalMap: THREE.Texture) => {
      normalMap.minFilter = THREE.LinearFilter;
      normalMap.magFilter = THREE.LinearFilter;
      normalMap.generateMipmaps = false;
      material.normalMap = normalMap;
      material.normalScale = new THREE.Vector2(0.85, 0.85);
      material.needsUpdate = true;
    });

    tiffLoader.load(specularMapUrl, (specularMap: THREE.Texture) => {
      specularMap.minFilter = THREE.LinearFilter;
      specularMap.magFilter = THREE.LinearFilter;
      specularMap.generateMipmaps = false;
      material.specularMap = specularMap;
      material.needsUpdate = true;
    });
  }

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, 64, 64),
    material
  );

  const northPoleMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff5555 })
  );
  northPoleMarker.position.set(0, earthRadius, 0);

  return { earth, northPoleMarker, earthRadius };
}