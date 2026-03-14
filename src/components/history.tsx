import { Card } from "@/components/ui/card"

export default function History() {
  return (
    <Card className="p-8">

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


    </Card>
  )
}