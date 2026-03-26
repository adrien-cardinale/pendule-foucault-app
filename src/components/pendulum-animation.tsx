import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createSceneContext } from "@/components/pendulum-animation/setup-scene";
import { createEarth } from "@/components/pendulum-animation/earth";
import { createPendulum } from "@/components/pendulum-animation/pendulum";
import { applyMilkyWayBackground } from "@/components/pendulum-animation/starfiel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NavigatorWithDeviceMemory = Navigator & { deviceMemory?: number };

type CameraMode = "free" | "earth" | "pendulum";

type PendulumAnimationProps = {
	isActive?: boolean;
};

export default function PendulumAnimation({
	isActive = true,
}: PendulumAnimationProps) {
	const yverdonLatitude = 46.7785;
	const yverdonLongitude = 6.6412;

	const [latitude, setLatitude] = useState(yverdonLatitude);
	const [longitude, setLongitude] = useState(yverdonLongitude);
	const [cameraMode, setCameraMode] = useState<CameraMode>("free");

	const containerRef = useRef<HTMLDivElement | null>(null);
	const widgetTimeValueRef = useRef<HTMLDivElement | null>(null);
	const widgetPrecessionValueRef = useRef<HTMLDivElement | null>(null);
	const widgetPeriodValueRef = useRef<HTMLDivElement | null>(null);
	const latitudeRef = useRef(latitude);
	const longitudeRef = useRef(longitude);
	const cameraModeRef = useRef<CameraMode>(cameraMode);
	const isActiveRef = useRef(isActive);
	const earthPlacementRequestedRef = useRef(false);

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
		isActiveRef.current = isActive;
	}, [isActive]);

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

		const enableReflections = !lowPerformanceMode;
		const { scene, camera, renderer, controls, cubeCamera } =
			createSceneContext({
				lowPerformance: lowPerformanceMode,
				enableReflections,
			});
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
		const { pendulumRoot, pendulumPivot, wire, bob } = createPendulum(
			0,
			pendulumLength,
		);
		scene.add(pendulumRoot);

		// Apply a shiny metallic look using the cube camera env map
		const applyShinyMetal = (mesh?: THREE.Mesh) => {
			if (!mesh) return;
			const material = mesh.material as THREE.MeshStandardMaterial;
			material.metalness = 1;
			material.roughness = 0.04;
			if (cubeCamera) {
				material.envMap = cubeCamera.renderTarget.texture;
				material.envMapIntensity = 1;
			} else {
				material.envMap = null;
				material.envMapIntensity = 0;
			}
			material.needsUpdate = true;
		};

		applyShinyMetal(wire);
		applyShinyMetal(bob);

		// Initial update so reflections are available immediately.
		if (cubeCamera) {
			cubeCamera.update(renderer, scene);
		}

		const timer = new THREE.Timer();
		timer.connect(document);
		const maxAngle = THREE.MathUtils.degToRad(14);
		const oscillationSpeed = 1.4;
		const simulatedDayDurationSeconds = 70;
		const earthAngularSpeed = (Math.PI * 2) / simulatedDayDurationSeconds;

		const yAxis = new THREE.Vector3(0, 1, 0);
		const northLocal = new THREE.Vector3();
		const tangentLocal = new THREE.Vector3();
		const localPrecessionRotation = new THREE.Quaternion();
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
			renderer.setPixelRatio(
				Math.min(window.devicePixelRatio || 1, lowPerformanceMode ? 1 : 1.5),
			);
			renderer.setSize(width, height);

			// Compute distance so the Earth (radius = earthRadius) fits comfortably
			const padding = 1.2; // slight padding around the earth
			const vfov = (camera.fov * Math.PI) / 180; // vertical fov in radians
			const halfV = Math.tan(vfov / 2);
			const dv = (earthRadius * padding) / halfV;
			const halfH = Math.tan(vfov / 2) * aspect;
			const dh = (earthRadius * padding) / Math.max(halfH, 1e-6);
			const distance = Math.max(dv, dh);
			const orbitDistance = distance + 0.5;

			// Keep free-camera initial placement aligned with the pendulum side,
			// including current Earth rotation.
			updatePendulumPlacement();

			camera.up.set(0, 1, 0);
			camera.position.copy(worldNormal).multiplyScalar(orbitDistance);
			camera.lookAt(0, 0, 0);
			controls.target.set(0, 0, 0);
			controls.update();
		};

		const updatePendulumPlacement = () => {
			const latitudeRad = THREE.MathUtils.degToRad(latitudeRef.current);
			const longitudeRad = THREE.MathUtils.degToRad(-longitudeRef.current);
			const cosLat = Math.cos(latitudeRad);
			const sinLat = Math.sin(latitudeRad);
			const sinLon = Math.sin(longitudeRad);
			const cosLon = Math.cos(longitudeRad);

			localNormal.set(
				cosLat * cosLon,
				sinLat,
				cosLat * sinLon,
			);

			northLocal.set(-sinLat * cosLon, cosLat, -sinLat * sinLon).normalize();

			localPrecessionRotation.setFromAxisAngle(localNormal, precessionAngle);
			tangentLocal.copy(northLocal).applyQuaternion(localPrecessionRotation);

			worldNormal
				.copy(localNormal)
				.applyAxisAngle(yAxis, earth.rotation.y)
				.normalize();

			worldTangent
				.copy(tangentLocal)
				.applyAxisAngle(yAxis, earth.rotation.y)
				.normalize();

			const anchorDistance = earthRadius + anchorOffsetAboveSurface;
			pendulumRoot.position.copy(worldNormal).multiplyScalar(anchorDistance);

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
		const fullTurn = Math.PI * 2;
		let precessionAngle = 0;

		const formatClock = (hoursValue: number) => {
			const wrappedHours = ((hoursValue % 24) + 24) % 24;
			const totalSeconds = Math.floor(wrappedHours * 3600);
			const hours = Math.floor(totalSeconds / 3600)
				.toString()
				.padStart(2, "0");
			const minutes = Math.floor((totalSeconds % 3600) / 60)
				.toString()
				.padStart(2, "0");
			const seconds = (totalSeconds % 60).toString().padStart(2, "0");
			return `${hours}:${minutes}:${seconds}`;
		};

		const updateInfoWidget = () => {
			const normalizedRotation =
				((earth.rotation.y % fullTurn) + fullTurn) % fullTurn;
			const utcHours = (normalizedRotation / fullTurn) * 24;
			const localHours = utcHours + longitudeRef.current / 15;

			const latitudeRad = THREE.MathUtils.degToRad(latitudeRef.current);
			const sinLatitude = Math.sin(latitudeRad);
			const precessionDegPerHour = 15 * sinLatitude;
			const absSinLatitude = Math.abs(sinLatitude);

			if (widgetTimeValueRef.current) {
				widgetTimeValueRef.current.textContent = formatClock(localHours);
			}

			if (widgetPrecessionValueRef.current) {
				if (absSinLatitude < 1e-4) {
					widgetPrecessionValueRef.current.textContent = "0.00°/h";
					if (widgetPeriodValueRef.current) {
						widgetPeriodValueRef.current.textContent = "infinie (équateur)";
					}
				} else {
					const periodHours = 24 / absSinLatitude;
					const direction =
						precessionDegPerHour >= 0 ? "antihoraire" : "horaire";
					widgetPrecessionValueRef.current.textContent = `${Math.abs(precessionDegPerHour).toFixed(2)}°/h (${direction})`;
					if (widgetPeriodValueRef.current) {
						widgetPeriodValueRef.current.textContent = `${periodHours.toFixed(1)} h`;
					}
				}
			}
		};

		let previousCameraMode: CameraMode = cameraModeRef.current;
		let lastEarthCameraLatitude = latitudeRef.current;
		let lastEarthCameraLongitude = longitudeRef.current;

		let animationFrameId = 0;
		let lastRenderedAt = 0;
		let previousElapsed = 0;
		let reflectionTick = 0;
		const minFrameIntervalMs = lowPerformanceMode ? 1000 / 30 : 0;
		const animate = (timestamp?: number) => {
			animationFrameId = requestAnimationFrame(animate);

			if (!isActiveRef.current) {
				return;
			}

			const now = timestamp ?? performance.now();
			if (minFrameIntervalMs > 0 && now - lastRenderedAt < minFrameIntervalMs) {
				return;
			}
			lastRenderedAt = now;

			timer.update(timestamp);

			const t = timer.getElapsed();
			const deltaSeconds = Math.max(0, t - previousElapsed);
			previousElapsed = t;
			const latitudeRad = THREE.MathUtils.degToRad(latitudeRef.current);
			const earthDeltaAngle = earthAngularSpeed * deltaSeconds;
			precessionAngle += earthDeltaAngle * Math.sin(latitudeRad);
			const currentCameraMode = cameraModeRef.current;
			// Restore default orbit camera pose whenever user returns to free mode.
			if (previousCameraMode !== "free" && currentCameraMode === "free") {
				camera.up.set(0, 1, 0);
				resize();
			}

			controls.enabled = currentCameraMode !== "pendulum";
			earth.rotation.y += earthDeltaAngle;
			updatePendulumPlacement();
			pendulumPivot.rotation.z = Math.sin(t * oscillationSpeed) * maxAngle;

			const earthCameraNeedsPlacement =
				currentCameraMode === "earth" &&
				(earthPlacementRequestedRef.current ||
					latitudeRef.current !== lastEarthCameraLatitude ||
					longitudeRef.current !== lastEarthCameraLongitude);

			if (earthCameraNeedsPlacement) {
				// Keep earth-camera aligned with the pendulum when position changes.
				updateLockedCameraFromPendulum();
				earthPlacementRequestedRef.current = false;
				lastEarthCameraLatitude = latitudeRef.current;
				lastEarthCameraLongitude = longitudeRef.current;
				controls.update();
			}

			const lockCamera = currentCameraMode === "pendulum";
			if (currentCameraMode === "earth" && !lockCamera) {
				camera.position.applyAxisAngle(cameraModeAxis, earthDeltaAngle);
				camera.up.applyAxisAngle(cameraModeAxis, earthDeltaAngle);
				controls.target.applyAxisAngle(cameraModeAxis, earthDeltaAngle);
				camera.lookAt(controls.target);
			}

			if (lockCamera) {
				updateLockedCameraFromPendulum();
			}

			if (controls.enabled) {
				controls.update();
			}
			updateInfoWidget();
			previousCameraMode = currentCameraMode;
			// Update reflections at a lower cadence to avoid GPU stalls.
			if (cubeCamera) {
				reflectionTick += 1;
				if (reflectionTick % 20 === 0) {
					cubeCamera.update(renderer, scene);
				}
			}
			renderer.render(scene, camera);
		};

		resize();
		updateInfoWidget();
		window.addEventListener("resize", resize);
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", resize);
			timer.dispose();
			controls.dispose();
			renderer.dispose();

			scene.traverse((object: THREE.Object3D) => {
				const mesh = object as THREE.Mesh;
				if (mesh.geometry) {
					mesh.geometry.dispose();
				}

				const material = mesh.material;
				if (Array.isArray(material)) {
					material.forEach((mat) => {
						mat.dispose();
					});
				} else if (material) {
					material.dispose();
				}
			});

			if (renderer.domElement.parentElement === container) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<Card
			className="w-full overflow-hidden py-0"
			style={{ aspectRatio: "3 / 2" }}
		>
			<CardContent className="relative min-h-0 flex-1 p-0">
				<div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-black/55 px-3 py-2 text-xs text-white backdrop-blur-sm">
					<div className="grid grid-cols-[auto_1fr] gap-x-3 font-mono">
						<div>Heure :</div>
						<div ref={widgetTimeValueRef}>--:--:--</div>
						<div>Précession :</div>
						<div ref={widgetPrecessionValueRef}>--</div>
						<div>Période :</div>
						<div ref={widgetPeriodValueRef}>--</div>
					</div>
				</div>
				<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-3 border-t p-4">
				<div className="grid gap-3 md:grid-cols-1">
					<label className="flex flex-col gap-1">
						<span className="text-xs text-muted-foreground">
							Latitude: {latitude.toFixed(2)}°
						</span>
						<input
							type="range"
							min={-90}
							max={90}
							step={0.01}
							value={latitude}
							onChange={(event) => setLatitude(Number(event.target.value))}
						/>
					</label>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant={cameraMode === "free" ? "default" : "outline"}
							size="sm"
							onClick={() => setCameraMode("free")}
						>
							Caméra libre
						</Button>
						<Button
							variant={cameraMode === "earth" ? "default" : "outline"}
							size="sm"
							onClick={() => {
								earthPlacementRequestedRef.current = true;
								setCameraMode("earth");
							}}
						>
							Caméra Terre
						</Button>
						<Button
							variant={cameraMode === "pendulum" ? "default" : "outline"}
							size="sm"
							onClick={() => setCameraMode("pendulum")}
						>
							Caméra pendule
						</Button>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								setLatitude(90);
								setLongitude(0);
							}}
						>
							Pôle Nord
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								setLatitude(0);
								setLongitude(0);
							}}
						>
							Équateur
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {
								setLatitude(yverdonLatitude);
								setLongitude(yverdonLongitude);
							}}
						>
							Yverdon-les-bains
						</Button>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
