import { Card } from "@/components/ui/card";
import LenghtAnimation from "@/components/lenght-animation";

export default function Driven({ isActive = true }: { isActive?: boolean }) {
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
				La communauté scientifique connaît deux méthodes pour entretenir les
				oscillations du pendule de Foucault. La première méthode consiste à
				placer sous la masse du pendule un électroaimant qui attire la masse à
				chaque passage. La seconde plus délicate consiste à lever légèrement la
				masse du pendule à chaque passage en hissant le point d'attache situé en
				contrehaut.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				La première méthode présente l'inconvénient d'induire un mouvement
				parasite qui, s'il n'est pas compensé, génère une ellipticité de
				l'oscillation. Un dispositif mécanique, nommé anneau de Charon, est
				alors utilisé pour compenser ce mouvement parasite.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Néanmoins, c'est la seconde méthode qui a été retenue pour l'entretien
				du pendule de la HEIG-VD. Historiquement, une crémaillère couplée à un
				moteur DC a été utilisée pour lever la masse du pendule à chaque
				passage. Pour soulager le moteur, un contrepoids a été utilisé afin de
				compenser la masse du pendule.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6">
				Dans sa version actuelle, le mécanisme d'entretien du pendule de
				Foucault est assuré par des moteurs linéaires. Une caméra mesure la
				position de la sphère ; ces mesures sont utilisées pour régler le
				mouvement d'excitation du pendule.
			</p>

			<LenghtAnimation isActive={isActive} />
		</Card>
	);
}
