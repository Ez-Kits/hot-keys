---
title: HotKeysManager
description: HotKeysManager is a React component that manages keyboard shortcuts (hot keys) and it's scopes in your application. It provides a context for managing different scopes of shortcuts.
---

## Usage

```tsx
import { HotKeysManager } from "@ez-kits/hot-keys-react";
import { createRoot } from "react-dom/client";

function App() {
	return <div>{/* Your application components */}</div>;
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<HotKeysManager>
		<App />
	</HotKeysManager>
);
```

## Props & Types

```ts
interface IHotKeysManagerOptions {
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
	 * Root element to listen to keyboard events.
	 * @default `document`
	 */
	getElement?: () => HTMLElement | null | undefined;
	/**
	 * The mode of the hotkeys manager.
	 * @default `separate`
	 */
	mode?: "separate" | "unified";
}

interface HotKeysManagerProps extends IHotKeysManagerOptions {
	children: React.ReactNode;
}
```
