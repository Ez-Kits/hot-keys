---
title: HotKeysManager
description: HotKeysManager component.
---

The `HotKeysManager` is a React component that manages keyboard shortcuts (hot keys) and their scopes in your application. It provides a context for handling keyboard events and managing different scopes of shortcuts.

## Usage

```tsx filename="App.tsx"
import { HotKeysManager } from "@ez-kits/hot-keys-react";

function App() {
	return <HotKeysManager>{/* Your application components */}</HotKeysManager>;
}
```

### Props & Types

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
