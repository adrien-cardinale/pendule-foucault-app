import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createSceneContext } from "@/components/pendulum-animation/setup-scene";
import { createEarth } from "@/components/pendulum-animation/earth";
import { createPendulum } from "@/components/pendulum-animation/pendulum";
import { applyMilkyWayBackground } from "@/components/pendulum-animation/starfiel";

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number };

type CameraMode = "free" | "earth" | "pendulum";

type PendulumAnimationProps = {
	latitude: number;
	longitude: number;
	cameraMode: CameraMode;
};

export default function PendulumAnimation({
	latitude,
	longitude,
	cameraMode,
}: PendulumAnimationProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const latitudeRef = useRef(latitude);
	const longitudeRef = useRef(longitude);
	const cameraModeRef = useRef<CameraMode>(cameraMode);

	useEffect(() => {
		latitudeRef.current = latitude;
	}, [latitude]);

	useEffect(() => {
		longitudeRef.current = longitude;
	}, [longitude]);

	useEffect(() => {
		cameraModeRef.current = cameraMode;
	}, [cameraMode]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const navigatorInfo = navigator as NavigatorWithDeviceMemory;
		const lowPerformanceMode =
			(navigatorInfo.deviceMemory !== undefined &&
				navigatorInfo.deviceMemory <= 2) ||
			(navigator.hardwareConcurrency !== undefined &&
				navigator.hardwareConcurrency <= 4);

		const { scene, camera, renderer, controls } = createSceneContext();
		applyMilkyWayBackground(scene, { lowPerformance: lowPerformanceMode });

		if (renderer.domElement.parentElement) {
			renderer.domElement.parentElement.removeChild(renderer.domElement);
		}
		container.appendChild(renderer.domElement);

		const { earth, northPoleMarker, earthRadius } = createEarth(6, {
			lowPerformance: lowPerformanceMode,
		});
		scene.add(earth);
		scene.add(northPoleMarker);

		const pendulumLength = 3;
		const anchorOffsetAboveSurface = pendulumLength + 0.4;
		const { pendulumRoot, pendulumPivot } = createPendulum(0, pendulumLength);
		scene.add(pendulumRoot);

		const clock = new THREE.Clock();
		const maxAngle = THREE.MathUtils.degToRad(14);
		const oscillationSpeed = 1.4;
		const earthSpinSpeed = 0.0015;

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

		controls.enabled = cameraModeRef.current !== "pendulum";

		const resize = () => {
			const width = Math.max(container.clientWidth, 1);
			const height = Math.max(container.clientHeight, 1);
			const aspect = width / height;
			camera.aspect = aspect;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);

			// Compute distance so the Earth (radius = earthRadius) fits comfortably
			const padding = 1.2; // slight padding around the earth
			const vfov = (camera.fov * Math.PI) / 180; // vertical fov in radians
			const halfV = Math.tan(vfov / 2);
			const dv = (earthRadius * padding) / halfV;
			const halfH = Math.tan(vfov / 2) * aspect;
			const dh = (earthRadius * padding) / Math.max(halfH, 1e-6);
			const distance = Math.max(dv, dh);

			camera.position.set(0, 0, distance + 0.5);
			camera.lookAt(0, 0, 0);
			controls.target.set(0, 0, 0);
		};

		const updatePendulumPlacement = () => {
			const latitudeRad = THREE.MathUtils.degToRad(latitudeRef.current);
			const longitudeRad = THREE.MathUtils.degToRad(-longitudeRef.current);
			const cosLat = Math.cos(latitudeRad);

			localNormal.set(
				cosLat * Math.cos(longitudeRad),
				Math.sin(latitudeRad),
				cosLat * Math.sin(longitudeRad),
			);

			worldNormal
				.copy(localNormal)
				.applyAxisAngle(yAxis, earth.rotation.y)
				.normalize();

			const anchorDistance = earthRadius + anchorOffsetAboveSurface;
			pendulumRoot.position.copy(worldNormal).multiplyScalar(anchorDistance);

			worldTangent
				.copy(fixedWorldReference)
				.addScaledVector(worldNormal, -fixedWorldReference.dot(worldNormal));
			if (worldTangent.lengthSq() < 1e-8) {
				worldTangent
					.copy(fallbackAxis)
					.addScaledVector(worldNormal, -fallbackAxis.dot(worldNormal));
			}
			worldTangent.normalize();

			worldBinormal.crossVectors(worldTangent, worldNormal).normalize();
			basisMatrix.makeBasis(worldTangent, worldNormal, worldBinormal);
			pendulumRoot.quaternion.setFromRotationMatrix(basisMatrix);

			northPoleMarker.position.copy(worldNormal).multiplyScalar(earthRadius);
		};

		const updateLockedCameraFromPendulum = () => {
			lockedCameraPosition
				.copy(pendulumRoot.position)
				.addScaledVector(worldNormal, cameraOffsetNormal)
				.addScaledVector(worldTangent, cameraOffsetTangent)
				.addScaledVector(worldBinormal, cameraOffsetBinormal);

			camera.position.copy(lockedCameraPosition);

			cameraViewDirection
				.copy(pendulumRoot.position)
				.sub(lockedCameraPosition)
				.normalize();
			cameraUpVector.copy(worldNormal);

			if (Math.abs(cameraViewDirection.dot(cameraUpVector)) > 0.95) {
				cameraUpVector.copy(worldBinormal);
			}

			camera.up.copy(cameraUpVector).normalize();
			camera.lookAt(pendulumRoot.position);
			controls.target.copy(pendulumRoot.position);
		};

		const cameraModeAxis = new THREE.Vector3(0, 1, 0);

		let animationFrameId = 0;
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);

			const t = clock.getElapsedTime();
			controls.enabled = cameraModeRef.current !== "pendulum";
			earth.rotation.y += earthSpinSpeed;
			updatePendulumPlacement();
			pendulumPivot.rotation.z = Math.sin(t * oscillationSpeed) * maxAngle;

			const lockCamera = cameraModeRef.current === "pendulum";
			if (cameraModeRef.current === "earth" && !lockCamera) {
				camera.position.applyAxisAngle(cameraModeAxis, earthSpinSpeed);
				camera.up.applyAxisAngle(cameraModeAxis, earthSpinSpeed);
				controls.target.applyAxisAngle(cameraModeAxis, earthSpinSpeed);
				camera.lookAt(controls.target);
			}

			if (lockCamera) {
				updateLockedCameraFromPendulum();
			}

			if (controls.enabled) {
				controls.update();
			}
			renderer.render(scene, camera);
		};

		resize();
		window.addEventListener("resize", resize);
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", resize);
			controls.dispose();
			renderer.dispose();

			scene.traverse((object: THREE.Object3D) => {
				const mesh = object as THREE.Mesh;
				if (mesh.geometry) {
					mesh.geometry.dispose();
				}

				const material = mesh.material;
				if (Array.isArray(material)) {
					material.forEach((mat) => mat.dispose());
				} else if (material) {
					material.dispose();
				}
			});

			if (renderer.domElement.parentElement === container) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
