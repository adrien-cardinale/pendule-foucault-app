import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import History from "@/components/history";

import Operation from "@/components/operation";
import { useEffect, useState } from "react";
import Driven from "@/components/driven";

function App() {
	const [activeTab, setActiveTab] = useState("history");
	const operationIsActive = activeTab === "operation";

	useEffect(() => {
		if (!operationIsActive) {
			return;
		}

		// Canvases are mounted while hidden; trigger a resize after tab reveal.
		const frameId = requestAnimationFrame(() => {
			window.dispatchEvent(new Event("resize"));
		});

		return () => {
			cancelAnimationFrame(frameId);
		};
	}, [operationIsActive]);

	return (
		<div>
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Le pendule de Foucault de la HEIG-VD
			</h1>
			<Tabs
				defaultValue="history"
				value={activeTab}
				onValueChange={setActiveTab}
				className="m-12"
			>
				<TabsList>
					<TabsTrigger value="history">Histoire</TabsTrigger>
					<TabsTrigger value="operation">Fonctionnement</TabsTrigger>
					<TabsTrigger value="driven">Entretien</TabsTrigger>
				</TabsList>
				<TabsContent value="history" forceMount>
					<History />
				</TabsContent>
				<TabsContent value="operation" forceMount>
					<Operation isActive={operationIsActive}/>
				</TabsContent>
				<TabsContent value="driven">
					<Driven />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default App;
