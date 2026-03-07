import * as THREE from 'three';
import { createSceneContext, attachResize } from './src/setupScene.js';
import { createEarth } from './src/earth.js';
import { createPendulum } from './src/pendulum.js';
import { animateScene } from './src/animation.js';
import { applyMilkyWayBackground } from './src/starfield.js';

const lowPerformanceMode = (navigator.deviceMemory && navigator.deviceMemory <= 2)
  || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

const { scene, camera, renderer, controls } = createSceneContext();
applyMilkyWayBackground(scene, { lowPerformance: lowPerformanceMode });

const { earth, northPoleMarker, earthRadius } = createEarth(6, { lowPerformance: lowPerformanceMode });
scene.add(earth);
scene.add(northPoleMarker);

const latitudeSlider = document.getElementById('latitude-slider');
const latitudeValue = document.getElementById('latitude-value');
const longitudeSlider = document.getElementById('longitude-slider');
const longitudeValue = document.getElementById('longitude-value');
const resetYverdonButton = document.getElementById('reset-yverdon-button');
const cameraModeInputs = document.querySelectorAll('input[name="camera-mode"]');

const yverdonLatitude = 46.7785;
const yverdonLongitude = 6.6412;

const pendulumLength = 3;
const anchorOffsetAboveSurface = pendulumLength + 0.4;
const { pendulumRoot, pendulumPivot } = createPendulum(0, pendulumLength);
scene.add(pendulumRoot);

const clock = new THREE.Clock();
const maxAngle = THREE.MathUtils.degToRad(14);
const oscillationSpeed = 1.4;
const earthSpinSpeed = 0.0015;

let cameraMode = 'free';

let latitude = Number(latitudeSlider?.value ?? 47);
let longitude = Number(longitudeSlider?.value ?? 0);

const yAxis = new THREE.Vector3(0, 1, 0);
const fallbackAxis = new THREE.Vector3(0, 0, 1);
const fixedWorldReference = new THREE.Vector3(1, 0, 0);
const localNormal = new THREE.Vector3();
const worldNormal = new THREE.Vector3();
const worldTangent = new THREE.Vector3();
const worldBinormal = new THREE.Vector3();
const basisMatrix = new THREE.Matrix4();
const lockedCameraPosition = new THREE.Vector3();
const cameraViewDirection = new THREE.Vector3();
const cameraUpVector = new THREE.Vector3();

const cameraOffsetNormal = 5;
const cameraOffsetTangent = 0;
const cameraOffsetBinormal = 0.5;

function updateControlLabels() {
  if (latitudeValue) {
    latitudeValue.textContent = `${latitude.toFixed(2)}°`;
  }

  if (longitudeValue) {
    longitudeValue.textContent = `${longitude.toFixed(2)}°`;
  }
}

function setCoordinates(nextLatitude, nextLongitude) {
  latitude = nextLatitude;
  longitude = nextLongitude;

  if (latitudeSlider) {
    latitudeSlider.value = String(nextLatitude);
  }

  if (longitudeSlider) {
    longitudeSlider.value = String(nextLongitude);
  }

  updateControlLabels();
}

if (latitudeSlider) {
  latitudeSlider.addEventListener('input', (event) => {
    latitude = Number(event.target.value);
    updateControlLabels();
  });
}

if (longitudeSlider) {
  longitudeSlider.addEventListener('input', (event) => {
    longitude = Number(event.target.value);
    updateControlLabels();
  });
}

cameraModeInputs.forEach((input) => {
  if (input.checked) {
    cameraMode = input.value;
  }

  input.addEventListener('change', (event) => {
    if (!event.target.checked) {
      return;
    }

    cameraMode = event.target.value;
    controls.enabled = cameraMode !== 'pendulum';
  });
});

if (resetYverdonButton) {
  resetYverdonButton.addEventListener('click', () => {
    setCoordinates(yverdonLatitude, yverdonLongitude);
  });
}

controls.enabled = cameraMode !== 'pendulum';

updateControlLabels();

function updatePendulumPlacement() {
  const latitudeRad = THREE.MathUtils.degToRad(latitude);
  const longitudeRad = THREE.MathUtils.degToRad(-longitude);
  const cosLat = Math.cos(latitudeRad);

  localNormal.set(
    cosLat * Math.cos(longitudeRad),
    Math.sin(latitudeRad),
    cosLat * Math.sin(longitudeRad)
  );

  worldNormal.copy(localNormal).applyAxisAngle(yAxis, earth.rotation.y).normalize();

  const anchorDistance = earthRadius + anchorOffsetAboveSurface;
  pendulumRoot.position.copy(worldNormal).multiplyScalar(anchorDistance);

  worldTangent.copy(fixedWorldReference).addScaledVector(worldNormal, -fixedWorldReference.dot(worldNormal));
  if (worldTangent.lengthSq() < 1e-8) {
    worldTangent.copy(fallbackAxis).addScaledVector(worldNormal, -fallbackAxis.dot(worldNormal));
  }
  worldTangent.normalize();

  worldBinormal.crossVectors(worldTangent, worldNormal).normalize();
  basisMatrix.makeBasis(worldTangent, worldNormal, worldBinormal);
  pendulumRoot.quaternion.setFromRotationMatrix(basisMatrix);

  northPoleMarker.position.copy(worldNormal).multiplyScalar(earthRadius);
}

function updateLockedCameraFromPendulum() {
  lockedCameraPosition
    .copy(pendulumRoot.position)
    .addScaledVector(worldNormal, cameraOffsetNormal)
    .addScaledVector(worldTangent, cameraOffsetTangent)
    .addScaledVector(worldBinormal, cameraOffsetBinormal);

  camera.position.copy(lockedCameraPosition);

  cameraViewDirection.copy(pendulumRoot.position).sub(lockedCameraPosition).normalize();
  cameraUpVector.copy(worldNormal);

  if (Math.abs(cameraViewDirection.dot(cameraUpVector)) > 0.95) {
    cameraUpVector.copy(worldBinormal);
  }

  camera.up.copy(cameraUpVector).normalize();
  camera.lookAt(pendulumRoot.position);
  controls.target.copy(pendulumRoot.position);
}

attachResize(camera, renderer);

animateScene({
  clock,
  earth,
  pendulumPivot,
  maxAngle,
  oscillationSpeed,
  earthSpinSpeed,
  shouldLockCamera: () => cameraMode === 'pendulum',
  shouldFollowEarthRotation: () => cameraMode === 'earth',
  onLockedCameraUpdate: updateLockedCameraFromPendulum,
  onFrame: updatePendulumPlacement,
  controls,
  renderer,
  scene,
  camera,
});