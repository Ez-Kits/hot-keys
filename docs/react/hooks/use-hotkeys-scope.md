---
title: useHotKeysScope
description: useHotKeysScope hook allows you to register and manage hot keys within a specific scope in your application.
---

# `useHotKeysScope`

`useHotKeysScope` hook allows you to register and manage hot keys within a specific scope in your application.

## Usage

```tsx{filename="MyComponent.tsx"}
import { useHotKeysScope } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useHotKeysScope({
		scopeName: "my-component",
		hotKeys: {
			// Single key
			a: () => console.log("Pressed A"),

			// Key combination
			"ctrl+s": (e) => {
				e.preventDefault();
				console.log("Save");
			},

			// Multiple shortcuts for same action
			"ctrl+c,cmd+c": () => console.log("Copy"),

			// Sequential hotkeys
			"ctrl_k,ctrl_l": () => console.log("Go to next and previous"),
		},
	});

	return <div>My Component</div>;
}
```

## Types

```tsx
type UseHotKeysScopeOptions = {
	hotKeys: Record<string, IHotKeyInput>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;
} & UseActivateHotKeyScopeOptions;

export declare function useHotKeysScope(options: UseHotKeysScopeOptions): void;
```
