#!/bin/bash
# Lance Chromium en mode kiosk sur l'application du pendule de Foucault.
URL="https://adrien-cardinale.github.io/pendule-foucault-app/"
# Profil Chromium en RAM : aucune écriture sur la carte SD, profil neuf à chaque démarrage
PROFILE="/dev/shm/chromium-kiosk"
# User agent standard + marqueur "PenduleKiosk" : l'application l'utilise pour
# afficher un QR code au lieu des liens et se recharger après inactivité
CHROME_MAJOR=$(chromium --version | grep -oE '[0-9]+' | head -1)
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME_MAJOR}.0.0.0 Safari/537.36 PenduleKiosk"

# Attendre le réseau (max ~60 s) pour éviter la page d'erreur au démarrage
for i in $(seq 1 60); do
    getent hosts adrien-cardinale.github.io >/dev/null && break
    sleep 1
done

# Surveille la page et ferme Chromium si elle ne s'affiche pas (relancé ci-dessous)
pkill -f kiosk-watchdog.sh
"$HOME/bin/kiosk-watchdog.sh" "$URL" &

# Relance Chromium s'il se ferme ou plante
while true; do
    # Profil repart de zéro à chaque lancement (pas de message de restauration)
    rm -rf "$PROFILE"
    chromium \
        --kiosk "$URL" \
        --ozone-platform=wayland \
        --user-agent="$USER_AGENT" \
        --user-data-dir="$PROFILE" \
        --disk-cache-size=52428800 \
        --noerrdialogs \
        --disable-infobars \
        --no-first-run \
        --disable-session-crashed-bubble \
        --disable-features=Translate,TranslateUI \
        --disable-pinch \
        --hide-scrollbars \
        --overscroll-history-navigation=0 \
        --touch-events=enabled \
        --check-for-update-interval=31536000 \
        --password-store=basic \
        --remote-debugging-port=9222
    sleep 2
done
