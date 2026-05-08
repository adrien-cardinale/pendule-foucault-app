import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import History from "@/components/history";

import Operation from "@/components/operation";
import { useEffect, useState } from "react";
import Driven from "@/components/driven";
import Amplitude from "@/components/amplitude";

function App() {
	const [activeTab, setActiveTab] = useState("operation");
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
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mt-10">
				Le pendule de Foucault de la HEIG-VD
			</h1>
			<Tabs
				defaultValue="operation"
				value={activeTab}
				onValueChange={setActiveTab}
				className="m-12"
			>
				<div className="flex items-center justify-between gap-4">
					<TabsList>
						<TabsTrigger data-umami-event="tab-description" value="operation">Description</TabsTrigger>
						<TabsTrigger data-umami-event="tab-history" value="history">Histoire</TabsTrigger>
						<TabsTrigger data-umami-event="tab-driven" value="driven">Réalisation</TabsTrigger>
					</TabsList>
					<Amplitude />
				</div>
				<TabsContent value="operation" forceMount>
					<Operation isActive={operationIsActive} />
				</TabsContent>
				<TabsContent value="history" forceMount>
					<History />
				</TabsContent>
				<TabsContent value="driven">
					<Driven />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default App;
