import {
	HotKeysManager,
	useGlobalHotKeys,
	useHotKeysScope,
} from "@ez-kits/hot-keys-react";
import { useRef, useState } from "react";

const App = () => {
	const [mode, setMode] = useState<"separate" | "unified">("separate");
	return (
		<div
			style={{
				padding: "2rem",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			<div style={{ display: "flex", gap: "1rem" }}>
				<button onClick={() => setMode("separate")}>Mode: Separate</button>
				<button onClick={() => setMode("unified")}>Mode: Unified</button>
				<span>
					Current mode: <strong>{mode}</strong>
				</span>
			</div>
			<div
				style={{
					fontStyle: "italic",
				}}
			>
				<strong>Separate:</strong> Press <code>ctrl then b</code> is different
				from <code>cmd+b</code>.<br />
				<strong>Unified:</strong> Press <code>ctrl then b</code> is same as{" "}
				<code>cmd+b</code>.
			</div>
			<HotKeysManager mode={mode} debug={true}>
				<HotKeysScope />
			</HotKeysManager>
		</div>
	);
};

export default App;

function HotKeysScope() {
	const elementRef = useRef<HTMLDivElement>(null);
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
		getActivatorElement: () => elementRef.current,
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
			ref={elementRef}
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
