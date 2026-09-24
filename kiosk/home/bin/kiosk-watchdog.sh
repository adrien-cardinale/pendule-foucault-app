#!/bin/bash
# Surveille la page affichée par Chromium (kiosk.sh) et ferme Chromium si elle
# ne s'affiche pas ; la boucle de kiosk.sh le relance ensuite automatiquement.
# Usage : kiosk-watchdog.sh <URL de l'application>
URL="$1"
HOST=$(echo "$URL" | cut -d/ -f3)
PORT=9222          # --remote-debugging-port de kiosk.sh
INTERVAL=20        # secondes entre deux vérifications
MAX_FAILS=2        # vérifications ratées d'affilée avant de relancer

log() { logger -t kiosk-watchdog "$*"; }

# Renvoie 0 si un onglet affiche l'application.
# La page d'erreur de Chromium garde l'URL demandée mais prend comme titre le
# nom du site : on exige donc la bonne URL et un vrai titre.
page_ok() {
    curl -s --max-time 5 "http://127.0.0.1:$PORT/json/list" | python3 -c '
import json, sys
url, host = sys.argv[1], sys.argv[2]
try:
    pages = [t for t in json.load(sys.stdin) if t.get("type") == "page"]
except Exception:
    sys.exit(1)
ok = any(p.get("url", "").startswith(url) and p.get("title", "") not in ("", host)
         for p in pages)
sys.exit(0 if ok else 1)
' "$URL" "$HOST"
}

fails=0
sleep 30   # laisser Chromium démarrer
while true; do
    if ! pgrep -x chromium >/dev/null; then
        fails=0                          # kiosk.sh est en train de le relancer
    elif page_ok; then
        fails=0
    else
        fails=$((fails + 1))
    fi

    if [ "$fails" -ge "$MAX_FAILS" ]; then
        # Sans réseau, relancer ne servirait à rien : on attend qu'il revienne
        if getent hosts "$HOST" >/dev/null; then
            log "page non affichée, relance de Chromium"
            pkill -x chromium
            fails=0
            sleep 30   # laisser Chromium redémarrer
        fi
    fi
    sleep "$INTERVAL"
done
