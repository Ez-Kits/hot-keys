import {
	HotKeysManager,
	useGlobalHotKeys,
	useHotKeysScope,
} from "@ez-kits/hot-keys-solid";
const App = () => {
	return (
		<HotKeysManager>
			<InnerComponent />
		</HotKeysManager>
	);
};

export default App;

function InnerComponent() {
	let ref!: HTMLDivElement;

	useHotKeysScope({
		scopeName: "test",
		hotKeys: {
			"ctrl+a,cmd+a": () => {
				console.log("ctrl+a,cmd+a");
			},
		},
		triggers: ["focus", "hover"],
		autoFocus: true,
		getActivatorElement: () => ref,
	});

	useGlobalHotKeys({
		hotKeys: {
			"ctrl+b": () => {
				console.log("Global: ctrl+b");
			},
		},
	});

	return (
		<div ref={ref} tabIndex={-1}>
			Inner Component
		</div>
	);
}
