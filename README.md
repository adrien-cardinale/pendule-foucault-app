# Le Pendule de Foucault de la HEIG-VD

Application web interactive présentant le pendule de Foucault installé à la HEIG-VD (Haute École d'Ingénierie et de Gestion du Canton de Vaud) à Yverdon-les-Bains.

## Le pendule de Foucault

En 1851, le physicien Léon Foucault invita le public parisien au Panthéon pour lui offrir la preuve visuelle de la rotation de la Terre. Un simple pendule — une sphère de laiton et d'acier de 28 kg suspendue à un fil de 67 m — révélait ce que les savants affirmaient depuis des siècles.

Le principe est d'une simplicité trompeuse : une masse importante suspendue à un long fil conserve naturellement son plan d'oscillation dans un référentiel galiléen. Pendant que le pendule oscille dans ce plan fixe, la Terre tourne sous lui. Pour un observateur terrestre, c'est le plan d'oscillation qui semble pivoter lentement — dans le sens horaire dans l'hémisphère nord, antihoraire dans l'hémisphère sud.

Cette rotation apparente, appelée **précession**, dépend de la latitude φ selon la relation :

$$\dot{\theta} = \Omega \sin(\varphi)$$

où Ω est la vitesse angulaire de la Terre. Aux pôles, le pendule effectue une rotation complète en 24 heures ; à l'équateur, aucune précession n'est observable. À Yverdon-les-Bains (≈ 47° N), le pendule complète une rotation en environ **32 heures**.

Dans le référentiel terrestre, ce phénomène s'explique par la **force de Coriolis** :

$$\mathbf{F}_C = -2m\,\boldsymbol{\Omega} \times \mathbf{v}$$

Seule la composante verticale de Ω — proportionnelle à sin(φ) — contribue à la précession.

## Le pendule de la HEIG-VD

Installé en 1995 dans le puits de lumière du bâtiment principal (alors l'EINEV), le pendule de Foucault de la HEIG-VD oscille de manière permanente depuis plus de 25 ans. Le projet a été initié par le professeur Freddy Mudry, avec l'analyse théorique d'Éric Lambert et Georges Derron.

L'oscillation est entretenue par **excitation paramétrique** : le point de suspension subit une oscillation verticale synchronisée avec le mouvement du pendule, à une fréquence double (ωₑ = 2ω₀), compensant les pertes dissipatives.

### Travaux d'étudiants

| Année | Auteur | Travail |
|-------|--------|---------|
| 1995 | C. Mahon | Conception du pendule de Foucault de l'EINEV |
| 1995 | Pascal Neuwerth | Commande, acquisition et affichage des données |
| 1997 | Giuseppe Catanese | Visualisation et mesures du pendule |
| 1998 | Diego Gonzalez | Entretien et contrôle du mouvement par microcontrôleur |
| 2000 | Vincent Mack | Commande par microcontrôleur |
| 2004 | Daniel Greco | Remise en service du système |
| 2011 | Patrick Schletti | Mesure et analyse de la vitesse de précession |
| 2014 | Yoann Jossevel | Système d'entretien des oscillations |
| 2023 | Adrien Cardinale | Pendule de Foucault 20 m — version 4.0 |
| 2024 | Evan Rochat | Mécanisme d'entretien par lames flexibles |

## L'application

L'interface propose quatre onglets :

- **Description** — explication du fonctionnement avec une animation 3D interactive (Three.js) permettant d'ajuster la latitude et d'observer le pendule depuis différents référentiels (Terre ou pendule).
- **Histoire** — contexte historique de l'expérience originale de Foucault au Panthéon et histoire du pendule de la HEIG-VD.
- **Réalisation** — description du mécanisme d'entretien paramétrique avec visualisation du signal d'excitation.
- **Documents** — accès au document de référence publié sur Zenodo.

L'amplitude du pendule est affichée en temps réel via une connexion **MQTT** (topic `foucault/data/amplitude`).

## Stack technique

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Three.js](https://threejs.org/) — animation 3D
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/)
- [KaTeX](https://katex.org/) — formules mathématiques
- [MQTT.js](https://github.com/mqttjs/MQTT.js) — données temps réel

## Lancer localement

```bash
npm install
npm run dev
```

### Variable d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_MQTT_URL` | URL du broker MQTT (WebSocket) | `wss://gd7d6227.ala.eu-central-1.emqxsl.com:8084/mqtt` |
