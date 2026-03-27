import { Card } from "@/components/ui/card";
import Latex from "@/components/ui/Latex";
import PendulumAnimation from "@/components/pendulum-animation";

export default function Operation({ isActive = true }: { isActive?: boolean }) {
	return (
		<Card className="p-8">
			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				{" "}
				Fonctionnement{" "}
			</h2>
			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Un pendule de Foucault est un dispositif élégant qui rend visible
				l'invisible : la rotation de notre planète. Son principe est d'une
				simplicité trompeuse. Une masse importante est suspendue à un fil de
				grande longueur, fixé par un point d'attache permettant une oscillation
				libre dans toutes les directions. Une fois le pendule mis en
				oscillation, il conserve naturellement son plan d'oscillation dans un
				référentiel galiléen.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				C'est là que la magie opère : pendant que le pendule oscille fidèlement
				dans ce plan fixe, la Terre tourne sous lui. Pour un observateur
				terrestre, c'est le plan d'oscillation du pendule qui semble pivoter
				lentement, alors qu'en réalité, c'est le sol qui tourne. Cette rotation
				apparente s'effectue dans le sens horaire dans l'hémisphère nord et
				antihoraire dans l'hémisphère sud.
			</p>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				La vitesse de rotation du plan d'oscillation, appelée précession, dépend
				directement de la latitude : aux pôles, le pendule effectue une rotation
				complète en 24 heures, tandis qu'à l'équateur, aucune rotation n'est
				observable. À Yverdon-les-Bains, située à environ 47° de latitude nord,
				le pendule complète une rotation en environ 32 heures.
			</p>

			<div className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				L'animation ci‑dessous permet de visualiser ce phénomène fascinant. En
				ajustant la latitude du pendule, vous pouvez observer comment la vitesse
				de rotation du plan d'oscillation change, offrant une démonstration
				interactive de la relation entre la rotation de la Terre et le mouvement
				du pendule.
				<br />
				En sélectionnant les différentes caméras, vous pouvez observer le
				mouvement du pendule depuis différents référentiels :
				<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
					<li>
						La caméra "Terre" vous montre le mouvement tel qu'il est perçu
						depuis la surface terrestre.
					</li>
					<li>
						La caméra "Pendule" vous offre une perspective centrée sur le
						pendule lui-même, mettant en évidence son oscillation dans l'espace.
					</li>
				</ul>
			</div>

			<PendulumAnimation isActive={isActive} />

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Dans le référentiel terrestre, ce comportement s'explique par la force
				de Coriolis. Lorsque la masse du pendule se déplace avec une vitesse
				instantanée <Latex tex={"\(\\mathbf{v}\)"} />, une force fictive
				proportionnelle à la vitesse angulaire de la Terre{" "}
				<Latex tex={"\\boldsymbol{\\Omega}"} /> apparaît :
			</p>

			<Latex
				tex={"\\mathbf{F}_C = -2m\\,\\boldsymbol{\\Omega} \\times \\mathbf{v}"}
				displayMode={true}
			/>

			<p className="leading-7 [&:not(:first-child)]:mt-6 text-justify">
				Cette force est toujours perpendiculaire à la vitesse du pendule et
				induira à chaque passage une petite déviation. C'est l'accumulation de
				ces effets au fil des oscillations qui provoque la rotation lente du
				plan d'oscillation. Seule la composante verticale de
				<Latex tex={"\\boldsymbol{\\Omega}"} /> — proportionnelle à{" "}
				<Latex tex={"\\sin(\\varphi)"} /> — contribue à la précession du plan,
				d'où la relation
				<Latex tex={"\\dot{\\theta} = \\Omega\\,\\sin(\\varphi)"} /> .
			</p>

			<Latex
				tex={"\\dot{\\theta} = \\Omega\\,\\sin(\\varphi)"}
				displayMode={true}
			/>
		</Card>
	);
}
