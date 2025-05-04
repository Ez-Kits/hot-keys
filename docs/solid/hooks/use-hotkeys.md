---
title: useHotKeys
description: useHotKeys hook allows you to register and manage keyboard shortcuts (hot keys) in your Solid components. It's useful when you want to register hot keys in a specific scope but don't need to activate the scope.
---

# `useHotKeys`

`useHotKeys` hook allows you to register and manage hot keys in your Solid components. It's useful when you want to register hot keys in a specific scope but don't need to activate the scope.

## Usage

```tsx{filename="MyComponent.tsx"}
import { useHotKeys } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	useHotKeys({
		hotKeys: {
			"ctrl+s": () => console.log("Save"),
		},
		scopeName: "my-component",
	});

	return <div>My Component</div>;
}
```

## Types

```ts
export interface UseHotKeysOptions {
	hotKeys: MaybeAccessor<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeAccessor<string>;
	scopeName: MaybeAccessor<string>;
}

export declare function useHotKeys(options: UseHotKeysOptions): void;
```
