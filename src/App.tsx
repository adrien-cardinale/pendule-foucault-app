import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import History from "@/components/history";
import PendulumAnimation from "@/components/pendulum-animation";
import LenghtAnimation from "./components/lenght-animation";

function App() {
	return (
		<Tabs defaultValue="home" className="m-12">
			<TabsList>
				<TabsTrigger value="home">Home</TabsTrigger>
				<TabsTrigger value="about">Les pendule de Foucault</TabsTrigger>
			</TabsList>
			<TabsContent value="home">
				<History />
				<PendulumAnimation />
				<LenghtAnimation />
			</TabsContent>
			<TabsContent value="about"></TabsContent>
		</Tabs>
	);
}

export default App;
