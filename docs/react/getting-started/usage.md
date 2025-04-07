---
title: Usage
description: Usage of Ez Hot Keys for React.
---

## Basic Usage

You can use `useHotKeysScope` hook to register a hot keys scope.

```tsx filename="App.tsx"
import { HotKeysManager, useHotKeysScope } from "@ez-kits/hot-keys-react";
import { createRoot } from "react-dom/client";

function App() {
	const elementRef = useRef<HTMLDivElement>(null);

	useHotKeysScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		hotKeys: {
			"ctrl+s": (e) => {
				e.preventDefault();
				console.log("Ctrl + S pressed");
			},
			"shift+a": () => {
				console.log("Shift + A pressed");
			},
		},
		getActivatorElement: () => elementRef.current,
	});

	return <div ref={elementRef}>Press some hotkeys!</div>;
}

const root = createRoot(document.getElementById("app")!);
root.render(
	<HotKeysManager>
		<App />
	</HotKeysManager>
);
```

## Supported Key Combinations

- Single keys: `a`, `b`, `1`, `2`, `enter`, `space`, etc.
- Modifier combinations:
  - `ctrl+a`
  - `shift+b`
  - `alt+c`
  - `cmd+d` (Mac Command key)
  - `meta+e` (Windows key/Command key)
- Multiple modifiers: `ctrl+shift+a`, `cmd+alt+k`
- Sequences:
  - `g_g` (press G twice)
  - `ctrl+shift+a_ctrl+shift+b` (press Ctrl+Shift+A and then Ctrl+Shift+B)

## Handler Function

The handler function receives the hot key and an event object with the following properties:

```tsx
useHotKeysScope({
	hotKeys: {
		"ctrl+s": (hotKey, event) => {
			console.log(hotKey); // "ctrl+s"

			event.key; // The pressed key
			event.code; // Key code
			event.ctrlKey; // Boolean
			event.shiftKey; // Boolean
			event.altKey; // Boolean
			event.metaKey; // Boolean
			event.preventDefault(); // Prevent default behavior
			event.stopPropagation(); // Stop event propagation
		},
	},
});
```

## Hot Keys Scope Activator

**Ez Hot Keys** only handle hot keys in the scope that is activated. There is only one active scope at a time.

There are three ways to activate a scope:

### `useActivateHotKeysScope`

If you only want to activate the scope but not register any hot keys, you can use `useActivateHotKeysScope` hook.

```tsx
import { useActivateHotKeysScope } from "@ez-kits/hot-keys-react";

function MyComponent() {
	const elementRef = useRef<HTMLDivElement>(null);

	useActivateHotKeysScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		getActivatorElement: () => elementRef.current,
	});

	return <div ref={elementRef}>Press some hotkeys!</div>;
}
```

The `getActivatorElement` function is used to get the element that will be used to activate the hot keys scope. Option `triggers` is used to specify the triggers that will be used to activate the scope. Current supported triggers are `focus` and `hover`.

### `useHotKeysScope`

If you want to register hot keys and activate a scope at the same time, you can use `useHotKeysScope` hook, then pass the `getActivatorElement` function, `triggers` and `autoFocus` to the hook, just like `useActivateHotKeysScope`.

```tsx
import { useHotKeysScope } from "@ez-kits/hot-keys-react";

function MyComponent() {
	const elementRef = useRef<HTMLDivElement>(null);

	useHotKeysScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		getActivatorElement: () => elementRef.current,
	});

	return <div ref={elementRef}>Press some hotkeys!</div>;
}
```

### `useHotKeysManagerContext`

You can also use `useHotKeysManagerContext` hook to activate a scope.

```tsx
import { useHotKeysManagerContext } from "@ez-kits/hot-keys-react";

function MyComponent() {
	const hotKeysManager = useHotKeysManagerContext();

	// Activate the scope
	hotKeysManager.activateScope("test");

	// Deactivate current active scope
	hotKeysManager.deactivateScope();
}
```

## Global Hot Keys

The `useGlobalHotKeys` hook is used to register global hot keys.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

useGlobalHotKeys({
	hotKeys: {
		"ctrl+s": (e) => {
			e.preventDefault();
			console.log("Ctrl + S pressed");
		},
	},
});
```

:::alert{type="warning"}
**Global hot keys** are only be handled when no scope handle the hot key.
:::
