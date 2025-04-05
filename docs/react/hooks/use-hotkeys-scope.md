---
title: useHotKeysScope
description: useHotKeysScope hook.
---

The `useHotKeysScope` hook allows you to register and manage keyboard shortcuts (hot keys) within a specific scope in your application.

## Usage

```tsx filename="MyComponent.tsx"
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
		},
	});

	return <div>My Component</div>;
}
```

## Props & Types

```tsx
declare interface UseHotKeysScopeOptions {
	/**
	 * The hot keys to register.
	 */
	hotKeys: Record<string, HotKeyHandler>;

	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;

	/**
	 * The name of the scope.
	 */
	scopeName: string;

	/**
	 * The triggers to activate the scope.
	 */
	triggers: ActivateHotKeyScopeTrigger[];

	/**
	 * If true, the scope will be activated when the element is visible.
	 * Only works with trigger "focus".
	 * @default false
	 */
	autoFocus?: boolean;

	/**
	 * The element to activate the scope.
	 */
	getActivatorElement: () => HTMLElement | null | undefined;
}

declare function useHotKeysScope(options: UseHotKeysScopeOptions): void;
```
