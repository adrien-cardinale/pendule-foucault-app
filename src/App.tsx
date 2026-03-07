import "./App.css";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import History from "@/components/history";
import PendulumAnimation from "@/components/pendulum-animiation";

function App() {
	const yverdonLatitude = 46.7785;
	const yverdonLongitude = 6.6412;

	const [latitude, setLatitude] = useState(yverdonLatitude);
	const [longitude, setLongitude] = useState(yverdonLongitude);
	const [cameraMode, setCameraMode] = useState<"free" | "earth" | "pendulum">(
		"free",
	);

	return (
		<Tabs defaultValue="home" className="m-12">
			<TabsList>
				<TabsTrigger value="home">Home</TabsTrigger>
				<TabsTrigger value="about">Les pendule de Foucault</TabsTrigger>
			</TabsList>
			<TabsContent value="home">
				<History />
				<Card
					className="w-full overflow-hidden py-0"
					style={{ aspectRatio: "3 / 2" }}
				>
					<CardContent className="min-h-0 flex-1 p-0">
						<PendulumAnimation
							latitude={latitude}
							longitude={longitude}
							cameraMode={cameraMode}
						/>
					</CardContent>
					<CardFooter className="flex-col items-stretch gap-3 border-t p-4">
						<div className="grid gap-3 md:grid-cols-2">
							<label className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									Latitude: {latitude.toFixed(2)}°
								</span>
								<input
									type="range"
									min={-90}
									max={90}
									step={0.01}
									value={latitude}
									onChange={(event) => setLatitude(Number(event.target.value))}
								/>
							</label>
							<label className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									Longitude: {longitude.toFixed(2)}°
								</span>
								<input
									type="range"
									min={-180}
									max={180}
									step={0.01}
									value={longitude}
									onChange={(event) => setLongitude(Number(event.target.value))}
								/>
							</label>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<Button
								variant={cameraMode === "free" ? "default" : "outline"}
								size="sm"
								onClick={() => setCameraMode("free")}
							>
								Caméra libre
							</Button>
							<Button
								variant={cameraMode === "earth" ? "default" : "outline"}
								size="sm"
								onClick={() => setCameraMode("earth")}
							>
								Suivre la Terre
							</Button>
							<Button
								variant={cameraMode === "pendulum" ? "default" : "outline"}
								size="sm"
								onClick={() => setCameraMode("pendulum")}
							>
								Caméra pendule
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									setLatitude(yverdonLatitude);
									setLongitude(yverdonLongitude);
								}}
							>
								Reset Yverdon
							</Button>
						</div>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="about"></TabsContent>
		</Tabs>
	);
}

export default App;
