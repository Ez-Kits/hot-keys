---
title: HotKeysManager
description: HotKeysManager is a Solid component that manages keyboard shortcuts (hot keys) and it's scopes in your application. It provides a context for managing different scopes of shortcuts.
---

# HotKeysManager

`HotKeysManager` is a Solid component that manages hot keys and it's scopes in your application. It provides a context for managing different scopes of hot keys.

## Usage

```tsx
import { HotKeysManager } from "@ez-kits/hot-keys-solid";
import { render } from "solid-js/web";

function App() {
	return <div>{/* Your application components */}</div>;
}

const root = document.getElementById("root");
render(
	() => (
		<HotKeysManager>
			<App />
		</HotKeysManager>
	),
	root!
);
```

## Props & Types

```ts
interface IHotKeyDelegateOptions {
	/**
	 * If true, the keyboard event will not be propagated to the element when a hotkey is triggered.
	 * @default false
	 */
	stopPropagation?: boolean;
	/**
	 * If true, the keyboard event will be prevented.
	 * @default false
	 */
	preventDefault?: boolean;
	/**
	 * If true, the hotkeys manager will log debug information to the console.
	 * @default false
	 */
	debug?: boolean;
}

interface IHotKeysManagerOptions extends IHotKeyDelegateOptions {
	/**
	 * Root element to listen to keyboard events.
	 * @default `document`
	 */
	getElement?: () => HTMLElement | null | undefined;

	/**
	 * The mode of the hotkeys manager.
	 * @default `separate`
	 */
	mode?: "separate" | "unified";

	/**
	 * If true, the hotkeys manager will be enabled. And all hotkeys will be triggered.
	 * @default true
	 */
	enabled?: boolean;
}

interface HotKeysManagerProps extends IHotKeysManagerOptions {
	children: JSX.Element;
}

export declare function HotKeysManager(props: HotKeysManagerProps): JSX.Element;
```
