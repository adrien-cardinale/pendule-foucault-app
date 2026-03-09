import * as THREE from 'three';

export function createPendulum(anchorY: number, pendulumLength = 3) {
  const pendulumRoot = new THREE.Group();
  pendulumRoot.position.set(0, anchorY, 0);

  const pendulumPivot = new THREE.Group();

  const oscillationPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, pendulumLength + 0.8),
    new THREE.MeshBasicMaterial({
      color: 0x99c8ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  oscillationPlane.position.y = -(pendulumLength + 0.8) / 2;

  const wire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, pendulumLength, 12),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.35 })
  );
  wire.position.y = -pendulumLength / 2;

  const bob = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.25 })
  );
  bob.position.y = -pendulumLength;

  pendulumRoot.add(oscillationPlane);
  pendulumPivot.add(wire);
  pendulumPivot.add(bob);
  pendulumRoot.add(pendulumPivot);

  return { pendulumRoot, pendulumPivot, wire, bob };
}

export function updatePendulumOscillation(
  pendulumPivot: THREE.Group,
  timeSeconds: number,
  maxAngle: number,
  oscillationSpeed: number,
) {
  pendulumPivot.rotation.z = Math.sin(timeSeconds * oscillationSpeed) * maxAngle;
}