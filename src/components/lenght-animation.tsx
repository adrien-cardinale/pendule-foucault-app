import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createSceneContext } from "@/components/pendulum-animation/setup-scene";
import { createPendulum } from "@/components/pendulum-animation/pendulum";

export default function LenghtAnimation() {
	const [pendulumLenght, setPendulumLenght] = useState(10);
	const [oscillationSpeed, setOscillationSpeed] = useState(1);
	const oscillationSpeedRef = useRef(oscillationSpeed);
	const initialPendulumLengthRef = useRef(pendulumLenght);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const pendulumRef = useRef<{
		pendulumRoot: THREE.Group;
		pendulumPivot: THREE.Group;
		wire: THREE.Mesh;
		bob: THREE.Mesh;
	} | null>(null);

	useEffect(() => {
		const period = 2 * Math.PI * Math.sqrt(pendulumLenght / 9.81);
		setOscillationSpeed((2 * Math.PI) / period);
		console.log("Pendulum period:", period.toFixed(2), "seconds");
	}, [pendulumLenght]);

	useEffect(() => {
		oscillationSpeedRef.current = oscillationSpeed;
	}, [oscillationSpeed]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const { scene, camera, renderer, controls, cubeCamera } =
			createSceneContext();

		// create pendulum once and keep refs to its parts
		const pendulum = createPendulum(5, initialPendulumLengthRef.current, false);
		pendulumRef.current = pendulum;

		controls.enabled = false;

		//center camera
		camera.position.set(0, 8, 18);

		if (renderer.domElement.parentElement) {
			renderer.domElement.parentElement.removeChild(renderer.domElement);
		}
		container.appendChild(renderer.domElement);

		// Make the renderer fit the container instead of the window
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.domElement.style.width = "100%";
		renderer.domElement.style.height = "100%";

		const onResize = () => {
			if (!container) return;
			const w = container.clientWidth;
			const h = container.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
		};

		window.addEventListener("resize", onResize);

		scene.add(pendulum.pendulumRoot);

		const applyShinyMetal = (mesh?: THREE.Mesh) => {
			if (!mesh) return;
			const material = mesh.material as THREE.MeshStandardMaterial;
			material.metalness = 1;
			material.roughness = 0.04;
			material.envMap = cubeCamera.renderTarget.texture;
			material.envMapIntensity = 1;
			material.needsUpdate = true;
		};

		applyShinyMetal(pendulum.wire);
		applyShinyMetal(pendulum.bob);

		const timer = new THREE.Timer();
		timer.connect(document);

		let animationFrameId = 0;

		const resize = () => {
			const width = Math.max(container.clientWidth, 1);
			const height = Math.max(container.clientHeight, 1);
			const aspect = width / height;
			camera.aspect = aspect;
			renderer.setSize(width, height);
		};

		const animate = (timestamp?: number) => {
			animationFrameId = requestAnimationFrame(animate);
			timer.update(timestamp);
			const t = timer.getElapsed();
			const p = pendulumRef.current;
			if (p) {
				p.pendulumPivot.rotation.z =
					Math.sin(t * oscillationSpeedRef.current) * 0.2;
			}
			renderer.render(scene, camera);
		};
		resize();
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);

			if (renderer.domElement.parentElement) {
				renderer.domElement.parentElement.removeChild(renderer.domElement);
			}

			controls.dispose();
			timer.dispose();
			renderer.dispose();

			window.removeEventListener("resize", onResize);
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

			pendulumRef.current = null;
		};
	}, []);

	// Update pendulum parts when length changes without recreating the whole pendulum
	useEffect(() => {
		const p = pendulumRef.current;
		if (!p) return;
		// update wire geometry and position
		if (p.wire.geometry) p.wire.geometry.dispose();
		p.wire.geometry = new THREE.CylinderGeometry(
			0.01,
			0.01,
			pendulumLenght,
			12,
		);
		p.wire.position.y = -pendulumLenght / 2;
		// update bob position
		p.bob.position.y = -pendulumLenght;
	}, [pendulumLenght]);

	return (
		<Card
			className="w-full overflow-hidden py-0"
			style={{ aspectRatio: "3 / 2" }}
		>
			<CardContent className="relative min-h-0 flex-1 p-0">
				<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
			</CardContent>
			<CardFooter className="flex-col items-stretch gap-3 border-t p-4">
				<div className="grid gap-3 md:grid-cols-1">
					<label className="flex flex-col gap-1">
						<span className="text-xs text-muted-foreground">
							Longueur: {pendulumLenght.toFixed(2)} m
						</span>
						<input
							type="range"
							min={1}
							max={15}
							step={0.01}
							value={pendulumLenght}
							onChange={(event) =>
								setPendulumLenght(Number(event.target.value))
							}
						/>
					</label>
				</div>
			</CardFooter>
		</Card>
	);
}
