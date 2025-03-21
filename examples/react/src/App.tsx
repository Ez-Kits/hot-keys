import {
	HotKeysManager,
	useGlobalHotKeys,
	useHotKeysScope,
} from "@ez-kits/hot-keys-react";
import { useRef } from "react";

const App = () => {
	return (
		<HotKeysManager>
			<InnerComponent />
		</HotKeysManager>
	);
};

export default App;

function InnerComponent() {
	const elementRef = useRef<HTMLDivElement>(null);
	useHotKeysScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		hotKeys: {
			"ctrl+a": () => {
				console.log("ctrl+a");
			},
		},
		getActivatorElement: () => elementRef.current,
	});

	useGlobalHotKeys({
		hotKeys: {
			"ctrl+b": () => {
				console.log("Global: ctrl+b");
			},
		},
	});
	return (
		<div ref={elementRef} tabIndex={-1}>
			Inner Component
		</div>
	);
}
