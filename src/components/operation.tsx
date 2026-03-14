import { Card } from "@/components/ui/card";
import Latex from "@/components/ui/Latex";

export default function Operation() {
    return (
        <Card className="p-8">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {" "}
                Fonctionnement{" "}
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Un pendule de Foucault est un dispositif élégant qui rend visible
                l'invisible : la rotation de notre planète. Son principe est d'une
                simplicité trompeuse. Une masse importante est suspendue à un fil de
                grande longueur, fixé par un point d'attache permettant une oscillation
                libre dans toutes les directions. Une fois le pendule mis en
                oscillation, il conserve naturellement son plan d'oscillation dans
                l'espace absolu.
            </p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                C'est là que la magie opère : pendant que le pendule oscille fidèlement
                dans ce plan fixe, la Terre tourne sous lui. Pour un observateur
                terrestre, c'est le plan d'oscillation du pendule qui semble pivoter
                lentement, alors qu'en réalité, c'est le sol qui tourne. Cette rotation
                apparente s'effectue dans le sens horaire dans l'hémisphère nord et
                antihoraire dans l'hémisphère sud.
            </p>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                La vitesse de rotation du plan d'oscillation dépend directement de la
                latitude : aux pôles, le pendule effectue une rotation complète en 24
                heures, tandis qu'à l'équateur, aucune rotation n'est observable. À
                Yverdon-les-Bains, située à environ 47° de latitude nord, le pendule
                complète une rotation en approximativement 32 heures.
            </p>

            <div className="flex items-center justify-center">
                <Latex tex={"\\dot \\theta = \\sin(lat)"} displayMode />
            </div>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                L'animation si dessous permet de visualiser ce phénomène fascinant. En ajustant la latitude
                du pendule, vous pouvez observer comment la vitesse de rotation du plan d'oscillation change,
                offrant une démonstration interactive de la relation entre la rotation de la Terre et le mouvement du pendule.
                <br />
                Et en sélectionnant les différentes camera, vous pouvez observer le mouvement du pendule depuis différents référentiels:
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                <li>La camera "Terre" vous montre le mouvement tel qu'il est perçu depuis la surface terrestre </li>
                <li>La caméra "Pendule"vous offre une perspective centrée sur le pendule lui-même, mettant en évidence son oscillation dans l'espace.</li>
                </ul> 
            </p>
        </Card>
    )
}