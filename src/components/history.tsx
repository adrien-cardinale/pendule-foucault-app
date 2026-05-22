import { Card } from "@/components/ui/card";
import pantheon from "@/assets/pantheon.webp";

export default function History() {
	return (
		<Card className="p-8">
			{/* <Card className="p-6"> */}
			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Histoire
			</h2>
			<blockquote className="mt-6 border-l-2 pl-6 italic text-justify">
				Venez voir tourner la Terre, venez la voir jeudi au Panthéon ! - Léon
				Foucault
			</blockquote>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				C'est par ces mots audacieux que le physicien Léon Foucault invita le
				public parisien en 1851 à assister à une démonstration extraordinaire :
				la preuve visuelle de la rotation de notre planète. Au Panthéon de
				Paris, sous la coupole majestueuse, un simple pendule allait révéler ce
				que les savants affirmaient depuis des siècles. Le succès fut tel que
				Louis-Napoléon Bonaparte, alors Prince-Président de la République
				française, commanda à Foucault de reproduire l'expérience dans ce lieu
				emblématique.
			</p>

			<img
				src={pantheon}
				alt="Le Panthéon de Paris"
				className="my-6 rounded-md border"
			/>


			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Le pendule historique de Paris était composé d'une sphère de laiton et
				d'acier de 28 kg, d'un diamètre de 17 cm, suspendue à un fil de 67 m de
				long. Son oscillation lente et majestueuse, combinée à la rotation
				apparente de son plan d'oscillation, offrait au public une démonstration
				tangible d'un phénomène jusqu'alors abstrait.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Depuis cette expérience fondatrice, des pendules de Foucault ont été
				installés dans le monde entier, permettant à chaque génération
				d'observer ce ballet cosmique. Installé en 1995, le pendule de Foucault
				de la HEIG-VD reprend vie aujourd'hui après une période d'interruption,
				offrant à nouveau cette démonstration fascinante.
			</p>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Le Pendule de la HEIG-VD
			</h2>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				En 1995 naît dans l'esprit de nos professeurs l'ambitieux projet de
				réaliser un pendule de Foucault à la HEIG-VD (alors nommée l'EINEV).
				Installé dans le puits de lumière du bâtiment principal, cela fait
				maintenant plus de 25 ans que le pendule de Foucault oscille de manière
				permanente.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Par sa présence, il anime le hall de l'école et suggère quelques
				interrogations dans l'esprit des étudiants au sujet de la physique et du
				mouvement de la Terre.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Le professeur Freddy Mudry a été l’instigateur de ce projet. Il a été immédiatement
				suivi par ses collègues Éric Lambert et Georges Derron qui en ont fait l’analyse théo‐
				rique détaillée et ainsi permis sa réalisation dans le cadre des deux premiers travaux
				de diplôme en 1995.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Plusieurs travaux d'étudiants ont été réalisés sur le pendule de la
				HEIG-VD :
			</p>

			<div className=" w-full overflow-hidden rounded-md border">
				<table className="w-full">
					<tbody>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								1995
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								C. Mahon
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Conception du pendule de Foucault de l'EINEV
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								1995
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Pascal Neuwerth
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Commande, acquisition et affichage des données d'un pendule de
								Foucault
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								1997
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Giuseppe Catanese
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Visualisation et mesures du pendule de Foucault
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								1998
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Diego Gonzalez
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Entretien et contrôle du mouvement d'un pendule de Foucault à
								l'aide d'un microcontrôleur
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2000
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Vincent Mack
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Commande d'un pendule de Foucault à l'aide d'un microcontrôleur
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2004
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Daniel Greco
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Remise en service du système
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2011
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Patrick Schletti
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Conception d'un système de mesure et d'analyse de la vitesse de
								précession d'un pendule de Foucault
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2014
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Yoann Jossevel
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Système d'entretien des oscillations d'un pendule de Foucault
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2023
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Adrien Cardinale
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Pendule de Foucault de 20 mètres à la HEIG-VD dans sa version
								4.0
							</td>
						</tr>
						<tr className="m-0 border-t p-0 even:bg-muted">
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								2024
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Evan Rochat
							</td>
							<td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
								Mécanisme d'entretien d'un pendule de Foucault par lames
								flexibles
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Card>
	);
}
