import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import History from "@/components/history";
import PendulumAnimation from "@/components/pendulum-animiation";

function App() {
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
					<CardContent className="h-full p-0">
						<PendulumAnimation />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="about"></TabsContent>
		</Tabs>
	);
}

export default App;
