#!/bin/bash
# Installe le kiosk du pendule de Foucault. À lancer depuis le dépôt avec :
#   sudo bash install.sh
# Peut être relancé sans risque (après une modification du dépôt, par exemple).
set -e

[ "$(id -u)" -eq 0 ] || { echo "À lancer avec sudo : sudo bash install.sh"; exit 1; }
USER_NAME="${SUDO_USER:?Lancer avec sudo depuis le compte du kiosk, pas en root direct}"
USER_HOME=$(getent passwd "$USER_NAME" | cut -d: -f6)
REPO=$(cd "$(dirname "$0")" && pwd)

# 1. Paquets
dpkg --configure -a
apt-get update
apt-get install -y --no-install-recommends labwc chromium fonts-dejavu-core
apt-get install -y wlr-randr curl python3

# 2. Connexion automatique en console sur tty1 (B2 = console autologin)
raspi-config nonint do_boot_behaviour B2

# 3. Désactiver l'économie d'énergie WiFi (2 = désactivée), de façon permanente
cat > /etc/NetworkManager/conf.d/wifi-powersave-off.conf <<'CONF'
[connection]
wifi.powersave = 2
CONF
iw dev wlan0 set power_save off || true
systemctl reload NetworkManager || true

# 4. Fichiers du compte (lancement de labwc, config labwc, scripts du kiosk)
mkdir -p "$USER_HOME/.config"
chown "$USER_NAME:" "$USER_HOME/.config"
cp -r "$REPO/home/." "$USER_HOME/"
chown -R "$USER_NAME:" "$USER_HOME/bin" "$USER_HOME/.config/labwc" "$USER_HOME/.bash_profile"
chmod +x "$USER_HOME"/bin/*.sh

echo "Installation terminée. Redémarrez avec : sudo reboot"
