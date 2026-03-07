import { Card } from "@/components/ui/card"

export default function History() {
  return (
    <Card className="p-8">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Le pendule de Foucault de la HEIG-VD
      </h1>
      {/* <Card className="p-6"> */}
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {" "}
        Histoire{" "}
      </h2>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Venez voir tourner la Terre, venez la voir jeudi au Panthéon ! - Léon
        Foucault
      </blockquote>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        C'est par ces mots audacieux que le physicien Léon Foucault invita le
        public parisien en 1851 à assister à une démonstration extraordinaire :
        la preuve visuelle de la rotation de notre planète. Au Panthéon de
        Paris, sous la coupole majestueuse, un simple pendule allait révéler ce
        que les savants affirmaient depuis des siècles. Le succès fut tel que
        Louis-Napoléon Bonaparte, alors Prince-Président de la République
        française, commanda à Foucault de reproduire l'expérience dans ce lieu
        emblématique.
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Le pendule historique de Paris était composé d'une sphère de laiton et
        d'acier de 28 kg, d'un diamètre de 17 cm, suspendue à un fil de 67 m de
        long. Son oscillation lente et majestueuse, combinée à la rotation
        apparente de son plan d'oscillation, offrait au public une démonstration
        tangible d'un phénomène jusqu'alors abstrait.
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Depuis cette expérience fondatrice, des pendules de Foucault ont été
        installés dans le monde entier, permettant à chaque génération
        d'observer ce ballet cosmique. Installé en 1995, le pendule de Foucault
        de la HEIG-VD reprend vie aujourd'hui après une période d'interruption,
        offrant à nouveau cette démonstration fascinante
      </p>
      {/* </Card> */}

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
    </Card>
  )
}