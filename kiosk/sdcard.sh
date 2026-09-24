#!/bin/bash
# Réduit les écritures sur la carte SD. À lancer avec : sudo bash sdcard.sh
set -e

# 1. Logs systemd en RAM uniquement (perdus au redémarrage)
mkdir -p /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/90-kiosk-volatile.conf <<'CONF'
[Journal]
Storage=volatile
RuntimeMaxUse=30M
CONF
rm -rf /var/log/journal

# 2. Swap uniquement en RAM (zram), sans fichier de réécriture sur la SD
mkdir -p /etc/rpi/swap.conf.d
cat > /etc/rpi/swap.conf.d/90-kiosk.conf <<'CONF'
[Main]
Mechanism=zram
CONF
systemctl disable --now rpi-zram-writeback.timer 2>/dev/null || true

# 3. /tmp en RAM
grep -q '^tmpfs /tmp ' /etc/fstab || \
    echo 'tmpfs /tmp tmpfs defaults,noatime,nosuid,nodev,size=200M 0 0' >> /etc/fstab

# 4. Désactiver les tâches périodiques qui écrivent sur le disque
systemctl disable --now apt-daily.timer apt-daily-upgrade.timer \
    man-db.timer dpkg-db-backup.timer 2>/dev/null || true

systemctl restart systemd-journald
echo "Terminé. Redémarrez avec : sudo reboot"
