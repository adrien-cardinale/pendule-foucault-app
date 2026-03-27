import mqtt from "mqtt";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function Amplitude() {
    const [amplitude, setAmplitude] = useState<number | null>(null);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const defaultMqttUrl = "wss://gd7d6227.ala.eu-central-1.emqxsl.com:8084/mqtt";
        const mqttUrl = import.meta.env.VITE_MQTT_URL?.trim() || defaultMqttUrl;
        const isHttpsPage = window.location.protocol === "https:";
        const isInsecureWebsocket = mqttUrl.startsWith("ws://");

        // Browsers block ws:// from https:// pages (mixed content / insecure operation).
        if (isHttpsPage && isInsecureWebsocket) {
            console.warn(
                "MQTT disabled: insecure ws:// endpoint on an https:// page. Configure VITE_MQTT_URL with wss://",
            );
            setStatus(false);
            return;
        }

        const client = mqtt.connect(mqttUrl, {
            clientId: `foucault-web-${Math.random().toString(16).slice(2, 8)}`,
            username: "user",
            password: "user",
            reconnectPeriod: 1000,
            connectTimeout: 30_000,
        });

        const handleConnect = () => {
            console.log("connecté MQTT");
            setStatus(true);
            client.subscribe("foucault/data/amplitude", { qos: 0 }, (err) => {
                if (err) {
                    console.error("subscribe failed", err);
                }
            });
        };

        const handleError = (err: Error) => {
            console.error("MQTT erreur", err);
            setStatus(false);
        };

        const handleClose = () => {
            console.warn("MQTT déconnecté");
            setStatus(false);
        };

        const handleMessage = (topic: string, payload: Buffer) => {
            if (topic !== "foucault/data/amplitude") return;
            try {
                const data = JSON.parse(payload.toString());
                const amplitudeValue =
                    typeof data.amplitude === "number"
                        ? data.amplitude
                        : typeof data.amplitude === "string"
                            ? parseFloat(data.amplitude)
                            : NaN;

                if (!Number.isFinite(amplitudeValue)) {
                    console.warn("Amplitude invalide", data);
                    return;
                }

                setAmplitude(amplitudeValue);
            } catch (e) {
                console.error("JSON parse error", e, payload.toString());
            }
        };

        client.on("connect", handleConnect);
        client.on("reconnect", () => console.log("reconnexion MQTT"));
        client.on("close", handleClose);
        client.on("error", handleError);
        client.on("message", handleMessage);

        return () => {
            client.off("connect", handleConnect);
            client.off("close", handleClose);
            client.off("error", handleError);
            client.off("message", handleMessage);
            client.end(true);
        };
    }, []);

    return (
        <>
            {status && (
                <Badge variant="secondary" className="ml-auto">
                    Amplitude du pendule: {amplitude !== null ? amplitude.toFixed(1) : "---"}
                </Badge>
            )}
        </>
    );
}
