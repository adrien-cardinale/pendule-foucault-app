import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
// import LenghtAnimation from "@/components/lenght-animation";
import Latex from "@/components/ui/Latex";
import poster from "@/assets/eso0932a.jpg";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	ChartContainer,
	type ChartConfig,
} from "@/components/ui/chart";

import mechanismeMp4 from "@/assets/mechanisme2.mp4";

export default function Driven({ isActive = true }: { isActive?: boolean }) {
	const excitationChartConfig: ChartConfig = {
		excitation: {
			label: "Excitation",
			color: "var(--chart-1)",
		},
		pendule: {
			label: "Pendule",
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;

	// Génère un jeu de données avec la phase φ ∈ [0, 2π]
	// - `excitation` : sin(φ)
	// - `pendule` : sin(φ/2) (période double par rapport à `excitation`)
	const samples = 300;
	const data: { t: number; excitation: number; pendule: number }[] = Array.from(
		{ length: samples },
		(_, i) => {
			const phi = (i / (samples - 1)) * 2.5 * Math.PI;
			const excitationVal = Math.sin(phi * 2);
			const penduleVal = Math.sin(phi);
			return {
				t: phi, // phase en radians (0 → 2π)
				excitation: Number(excitationVal.toFixed(3)),
				pendule: Number(penduleVal.toFixed(3)),
			};
		},
	);

	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		const v = videoRef.current;
		if (!v) return;
		if (isActive) {
			const p = v.play();
			if (p && typeof (p as Promise<void>).catch === "function") {
				(p as Promise<void>).catch(() => {
					/* autoplay prevented */
				});
			}
		} else {
			v.pause();
		}
	}, [isActive]);

	return (
		<Card className="p-8">
			{/* <Card className="p-6"> */}
			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Entretien de l'oscillation du pendule
			</h2>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Un pendule qui ne serait qu'une simple masse suspendue à un fil
				n'oscillerait que durant quelques heures avant de s'arrêter. Pour
				maintenir les oscillations du pendule de Foucault, il convient d'induire
				une force d'entretien qui maintient une amplitude d'oscillation
				constante.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Le mouvement du pendule de Foucault de la heig-vd est entretenu par une
				excitation paramétrique : le point de suspension subit une oscillation
				verticale synchronisée avec le mouvement du pendule. Cette modulation
				fournit de l'énergie au système pour compenser les pertes dissipatives
				(frottements de l'air, etc.). Ce transfer d'énergie est maximal lorsque
				<Latex tex={"\\omega_e = 2 \\omega_0"} />.
			</p>

			{/* <img
				src={excitation}
				alt="signal d'excitation du pendule de Foucault"
				className="my-6 rounded-md border"
			/> */}
			<Card>
				<ChartContainer config={excitationChartConfig}>
					<LineChart accessibilityLayer data={data}>
						<CartesianGrid vertical={true} />
						<XAxis
							dataKey="t"
							type="number"
							domain={[0, 2 * Math.PI]}
							interval={0}
							tickLine={{ stroke: "var(--muted-foreground)" }}
							axisLine={{ stroke: "var(--muted-foreground)" }}
							tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
							tickMargin={1}
							ticks={[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI]}
							tickFormatter={(value) => {
								const v = Number(value) - Math.PI / 2;
								const eps = 1e-6;
								if (Math.abs(v + Math.PI / 2) < eps) return "";
								if (Math.abs(v - 0) < eps) return "0";
								if (Math.abs(v - Math.PI / 2) < eps) return "π/2";
								if (Math.abs(v - Math.PI) < eps) return "π";
								if (Math.abs(v - (3 * Math.PI) / 2) < eps) return "3π/2";
								return v.toFixed(2);
							}}
						/>
						<Line
							dataKey="excitation"
							type="monotone"
							stroke="var(--color-excitation)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="pendule"
							type="monotone"
							stroke="var(--color-pendule)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</Card>

			<ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
				<li>
					Aux extrémités de l'oscillation (points les plus hauts), la vitesse
					est nulle. Abaisser le point de suspension à ces instants rallonge le
					pendule sans retirer d'énergie cinétique, ce qui augmente l'énergie
					potentielle sans coût cinétique immédiat.
				</li>
				<li>
					Au passage par la verticale (point le plus bas), la vitesse et
					l'énergie cinétique du pendule sont maximales. Si, à cet instant, on
					relève légèrement le point de suspension, la longueur effective L
					diminue. La pulsation propre{" "}
					<Latex tex={"\\omega _0 = \\sqrt{g/L}"} /> augmente alors brièvement,
					ce qui se traduit par un apport net d'énergie cinétique au pendule.
				</li>
			</ol>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				En combinant ces deux actions synchronisées — relever au passage bas et
				abaisser aux extrémités — on réalise un travail net positif sur le
				pendule à chaque oscillation. Répétée avec la bonne phase, cette
				injection d'énergie compense les pertes dissipatives et maintient
				l'amplitude de l'oscillation (c'est le principe de l'excitation
				paramétrique).
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Dans sa version actuelle, le mécanisme d'entretien du pendule de
				Foucault est assuré par des moteurs linéaires. Une caméra mesure la
				position de la sphère ; ces mesures sont utilisées pour régler le
				mouvement d'excitation du pendule.
			</p>

			{/* <Card className="my-6"> */}
			<figure>
				<video
					ref={videoRef}
					autoPlay
					muted
					loop
					preload="metadata"
					playsInline
					poster={poster}
					className="my-6 w-full rounded-md border"
				>
					<source src={mechanismeMp4} type="video/mp4" />
					Votre navigateur ne prend pas en charge les vidéos HTML5.
				</video>
				<figcaption className="sr-only">Vidéo : excitation du pendule en action</figcaption>
			</figure>
			{/* </Card> */}

			{/* <LenghtAnimation isActive={isActive} /> */}
		</Card>
	);
}
