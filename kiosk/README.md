# Kiosk – Pendule de Foucault

Raspberry Pi qui affiche en plein écran, sur un écran tactile, l'application web :
<https://adrien-cardinale.github.io/pendule-foucault-app/>

## Matériel et système

| Élément        | Valeur                                         |
|----------------|------------------------------------------------|
| Carte          | Raspberry Pi 4 Model B                         |
| Système        | Raspberry Pi OS Lite 64 bits (Debian 13 trixie)|
| Utilisateur    | `pendule-foucault`                             |
| Écran          | Tactile, sur la sortie HDMI-A-1                |
| Réseau         | WiFi `Devices` (NetworkManager), pays CH       |

## Fonctionnement

```
Démarrage
  └─ connexion automatique de pendule-foucault sur tty1
       └─ ~/.bash_profile  → lance labwc (compositeur Wayland)
            └─ ~/.config/labwc/autostart → lance ~/bin/kiosk.sh
                 ├─ attend le réseau, puis Chromium --kiosk (relancé s'il se ferme)
                 └─ ~/bin/kiosk-watchdog.sh : ferme Chromium si la page ne s'affiche pas
```

Les connexions SSH ne lancent pas l'interface graphique : seule la console tty1 le fait.

## Contenu du dépôt

| Fichier du dépôt                  | Installé dans                 | Rôle                                                   |
|-----------------------------------|-------------------------------|--------------------------------------------------------|
| `install.sh`                      | –                             | Installation complète (paquets, connexion automatique, WiFi, fichiers ci-dessous) |
| `sdcard.sh`                       | –                             | Réduction des écritures sur la carte SD                |
| `home/bin/kiosk.sh`               | `~/bin/kiosk.sh`              | Lance Chromium en kiosk et le relance en cas de fermeture |
| `home/bin/kiosk-watchdog.sh`      | `~/bin/kiosk-watchdog.sh`     | Surveille la page affichée et fait relancer Chromium si elle ne s'affiche pas |
| `home/.bash_profile`              | `~/.bash_profile`             | Lance `labwc` sur tty1                                 |
| `home/.config/labwc/autostart`    | `~/.config/labwc/autostart`   | Rotation de l'écran, lance `kiosk.sh` au démarrage de labwc |
| `home/.config/labwc/rc.xml`       | `~/.config/labwc/rc.xml`      | Écran tactile mappé sur HDMI-A-1, pas de barre de titre |
| `home/.config/labwc/environment`  | `~/.config/labwc/environment` | Clavier suisse (`ch`)                                  |

Fichiers système créés par les scripts :

| Fichier                                                   | Rôle                                   |
|-----------------------------------------------------------|----------------------------------------|
| `/etc/NetworkManager/conf.d/wifi-powersave-off.conf`      | Désactive l'économie d'énergie WiFi    |
| `/etc/systemd/journald.conf.d/90-kiosk-volatile.conf`     | Logs en RAM (30 Mo max)                |
| `/etc/rpi/swap.conf.d/90-kiosk.conf`                      | Swap zram uniquement, sans écriture SD |
| `/etc/fstab` (ligne `tmpfs /tmp`)                         | `/tmp` en RAM (200 Mo)                 |

## Installation sur un nouveau Pi

1. Avec **Raspberry Pi Imager**, flasher **Raspberry Pi OS Lite (64 bits)** sur la carte SD. Dans les réglages d'Imager, définir :
   - l'utilisateur (par exemple `pendule-foucault`) et son mot de passe ;
   - le WiFi (`Devices`, pays CH) ;
   - SSH activé.
2. Brancher l'écran sur la prise **HDMI 0** (la plus proche de l'alimentation), qui correspond à la sortie `HDMI-A-1`, puis démarrer le Pi.
3. Se connecter en SSH avec cet utilisateur, puis :

```bash
sudo apt update && sudo apt install -y git
git clone <URL-du-dépôt> ~/pendule-foucault-kiosk
cd ~/pendule-foucault-kiosk
sudo bash install.sh
sudo bash sdcard.sh
sudo reboot
```

`install.sh` doit se terminer par « Installation terminée ». Sinon, lire l'erreur affichée avant de redémarrer. Les deux scripts peuvent être relancés sans risque ; une installation interrompue est reprise.

## Modifier le kiosk

Le dépôt est la référence : les fichiers de `~/bin` et `~/.config/labwc` sont des copies écrasées à chaque installation. Pour modifier le kiosk (URL, options de Chromium, rotation…) :

```bash
cd ~/pendule-foucault-kiosk
nano home/bin/kiosk.sh        # par exemple
sudo bash install.sh          # recopie les fichiers
git commit -am "Description de la modification" && git push
sudo reboot
```

## Options de Chromium

Définies dans `home/bin/kiosk.sh` :

| Option                                      | Effet                                              |
|---------------------------------------------|----------------------------------------------------|
| `--kiosk`                                   | Plein écran, sans barre d'adresse ni onglets       |
| `--ozone-platform=wayland`                  | Affichage natif sous labwc                         |
| `--user-data-dir=/dev/shm/chromium-kiosk`   | Profil en RAM, recréé à chaque lancement           |
| `--disk-cache-size=52428800`                | Cache limité à 50 Mo (en RAM)                      |
| `--touch-events=enabled`                    | Saisie tactile                                     |
| `--disable-pinch`                           | Pas de zoom à deux doigts                          |
| `--hide-scrollbars`                         | Barres de défilement masquées (le défilement tactile reste possible) |
| `--overscroll-history-navigation=0`         | Pas de retour arrière par glissement               |
| `--noerrdialogs`, `--disable-infobars`, `--disable-session-crashed-bubble` | Aucune fenêtre ni bannière parasite |
| `--no-first-run`, `--disable-features=Translate,TranslateUI` | Pas d'écran d'accueil ni de proposition de traduction |
| `--remote-debugging-port=9222`              | Permet au chien de garde de lire la page affichée (écoute seulement en local, 127.0.0.1) |

## Chien de garde (rechargement automatique)

`~/bin/kiosk-watchdog.sh`, lancé par `kiosk.sh`, vérifie toutes les 20 s, via le port 9222, que Chromium affiche bien l'application :

- l'URL de l'onglet doit commencer par l'URL de l'application ;
- son titre ne doit être ni vide ni égal au nom du site : c'est le titre que prend la page d'erreur « pas de connexion » de Chromium, qui garde l'URL demandée.

Après 2 vérifications ratées d'affilée (environ 40 s), et seulement si le réseau répond, il ferme Chromium ; `kiosk.sh` le relance alors avec une page neuve. Sans réseau, il attend que le réseau revienne. Il n'agit pas pendant les 30 s qui suivent son démarrage ou une relance.

Chaque relance est notée dans le journal : `journalctl -b -t kiosk-watchdog`.

Limite : une page blanche dont l'URL et le titre sont corrects (par exemple une erreur JavaScript dans l'application) n'est pas détectée.

## Protection de la carte SD

Appliquée par `sdcard.sh` :

- `/` monté avec `noatime` (déjà présent par défaut).
- Swap compressé en RAM (zram), sans recopie vers la carte.
- Logs systemd en RAM : **ils sont perdus au redémarrage**.
- `/tmp` en RAM.
- Profil et cache Chromium en RAM : les données enregistrées par l'application dans le navigateur (localStorage, cookies) sont **perdues à chaque relance de Chromium**.
- Tâches périodiques désactivées : `apt-daily`, `apt-daily-upgrade`, `man-db`, `dpkg-db-backup`.

### Option : carte SD en lecture seule

Protection maximale, à activer seulement quand tout fonctionne :

```bash
sudo raspi-config nonint do_overlayfs 0   # activer
sudo reboot
```

Toute modification (configuration, mises à jour, `git pull`) est alors **perdue au redémarrage**. Pour intervenir :

```bash
sudo raspi-config nonint do_overlayfs 1   # désactiver
sudo reboot
# … faire les modifications …
sudo raspi-config nonint do_overlayfs 0   # réactiver
sudo reboot
```

## Maintenance courante

Se connecter en SSH : `ssh pendule-foucault@<adresse-du-pi>`

| Action                           | Commande                                                   |
|----------------------------------|------------------------------------------------------------|
| Recharger la page                | `pkill chromium` (relancé automatiquement en ~2 s)         |
| Changer l'URL affichée           | modifier `URL=` dans `home/bin/kiosk.sh` (voir « Modifier le kiosk ») |
| Redémarrer le Pi                 | `sudo reboot`                                              |
| Mettre à jour le système         | `sudo apt update && sudo apt full-upgrade` (pas automatique) |
| Voir les logs depuis le démarrage| `journalctl -b`                                            |
| Voir les relances du chien de garde | `journalctl -b -t kiosk-watchdog`                       |
| Voir la page affichée            | `curl -s http://127.0.0.1:9222/json/list`                  |

## Vérifications

```bash
iw dev wlan0 get power_save          # attendu : Power save: off
nmcli -f IN-USE,SSID,SIGNAL dev wifi # réseau utilisé et qualité du signal
pgrep -a labwc; pgrep -a chromium    # interface et navigateur lancés
pgrep -af kiosk-watchdog             # chien de garde lancé
findmnt /tmp                         # attendu : tmpfs
swapon --show                        # attendu : /dev/zram0 uniquement
journalctl --header | grep -i path   # journal dans /run (RAM)
```

## Dépannage

| Symptôme                                   | Piste                                                                 |
|--------------------------------------------|-----------------------------------------------------------------------|
| Écran noir ou console au démarrage         | Connexion automatique inactive : `sudo raspi-config nonint do_boot_behaviour B2` |
| Écran pas tourné, toucher inactif          | Écran branché sur l'autre prise HDMI : le brancher sur HDMI 0, ou remplacer `HDMI-A-1` dans `autostart` et `rc.xml` (nom de sortie via `wlr-randr`) |
| Labwc démarre mais pas Chromium            | Lancer `~/bin/kiosk.sh` à la main depuis l'écran pour voir l'erreur   |
| Page d'erreur « pas de connexion »         | Vérifier le WiFi (`nmcli dev`), puis `pkill chromium`                 |
| Toucher décalé ou inversé                  | Ajuster `mapToOutput` dans `~/.config/labwc/rc.xml` (nom de sortie via `wlr-randr`) |
| Coupures WiFi                              | Vérifier que `power_save` est bien `off`                              |
| Revenir à un Pi « normal »                 | Supprimer le bloc `exec labwc` de `~/.bash_profile` et redémarrer     |
