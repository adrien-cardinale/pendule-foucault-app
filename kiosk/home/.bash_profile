# Charger la config standard
[ -f "$HOME/.profile" ] && . "$HOME/.profile"

# Kiosk : démarrer labwc automatiquement sur tty1 (pas via SSH)
if [ -z "$WAYLAND_DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    exec labwc
fi
