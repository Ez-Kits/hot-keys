import {
	HotKeysManager,
	useGlobalHotKeys,
	useHotKeysScope,
} from "@ez-kits/hot-keys-solid";
import { createSignal } from "solid-js";
const App = () => {
	const [mode, setMode] = createSignal<"separate" | "unified">("separate");
	return (
		<div
			style={{
				padding: "2rem",
				display: "flex",
				"flex-direction": "column",
				gap: "1rem",
			}}
		>
			<div style={{ display: "flex", gap: "1rem" }}>
				<button onClick={() => setMode("separate")}>Mode: Separate</button>
				<button onClick={() => setMode("unified")}>Mode: Unified</button>
				<span>
					Current mode: <strong>{mode()}</strong>
				</span>
			</div>
			<div
				style={{
					"font-style": "italic",
				}}
			>
				<strong>Separate:</strong> Press <code>ctrl then b</code> is different
				from <code>cmd+b</code>.<br />
				<strong>Unified:</strong> Press <code>ctrl then b</code> is same as{" "}
				<code>cmd+b</code>.
			</div>
			<HotKeysManager mode={mode()}>
				<HotKeysScope />
			</HotKeysManager>
		</div>
	);
};

export default App;

function HotKeysScope() {
	let ref!: HTMLDivElement;

	useHotKeysScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		hotKeys: {
			"ctrl+a, cmd+a": (_, e) => {
				e.preventDefault();
				console.log("Scope: ctrl+a");
			},
			"ctrl_b, cmd_b": () => {
				console.log("Scope: ctrl then b");
			},
		},
		getActivatorElement: () => ref,
	});

	useGlobalHotKeys({
		hotKeys: {
			"ctrl_b, cmd_b": () => {
				console.log("Global: ctrl then b");
			},
			"ctrl+a, cmd+a": (_, e) => {
				e.preventDefault();
				console.log("Global: ctrl+a");
			},
		},
	});

	return (
		<div
			ref={ref}
			tabIndex={-1}
			style={{
				border: "2px dashed gray",
				display: "inline-block",
				padding: "2rem",
			}}
		>
			Hover or focus to activate scope.
			<br />
			Sequence hotkeys:
			<br />
			<strong>
				<code>ctrl then b</code>
			</strong>{" "}
			or{" "}
			<strong>
				<code>cmd then b</code>
			</strong>
			<br />
			Combined hotkeys:
			<br />
			<strong>
				<code>ctrl+a</code>
			</strong>{" "}
			or{" "}
			<strong>
				<code>cmd+a</code>
			</strong>
			<br />
			(This box is auto focused.)
		</div>
	);
}
