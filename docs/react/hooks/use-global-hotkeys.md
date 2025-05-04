---
title: useGlobalHotKeys
description: useGlobalHotKeys hook allows you to register global hot keys in your React application. These hot keys will work regardless of which element has focus in your application.
---

# `useGlobalHotKeys`

`useGlobalHotKeys` hook allows you to register global hot keys in your React application. These hot keys will work regardless of which element has focus in your application.

## Usage

```tsx{filename="MyComponent.tsx"}
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			// Single key combination
			"ctrl+s": (e) => {
				e.preventDefault();
				console.log("Save triggered");
			},

			// Multiple key combinations for same action
			"ctrl+z,cmd+z": (e) => {
				e.preventDefault();
				console.log("Undo triggered");
			},
		},
	});

	return <div>Press Ctrl+S to save or Ctrl+Z/Cmd+Z to undo</div>;
}
```

## Types

```typescript
interface IHotKeyInfo {
	/**
	 * If true, the hotkey will be enabled.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * If true, the hotkey will not be triggered if the input is focused.
	 * @default true
	 */
	ignoreInput?: boolean;
	/**
	 * Repeatable hotkey.
	 * @default false
	 */
	repeatable?: boolean;
	/**
	 * The handler to call when the hotkey is triggered.
	 */
	handler?: HotKeyHandler;
}

type HotKeyHandler = (hotKey: string, event: KeyboardEvent) => void;

type IHotKeyInput = IHotKeyInfo | HotKeyHandler;

interface UseGlobalHotKeysOptions {
	hotKeys: Record<string, IHotKeyInput>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;
}

export declare function useGlobalHotKeys(
	options: UseGlobalHotKeysOptions
): void;
```
