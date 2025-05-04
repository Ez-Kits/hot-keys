---
title: Register Scoped Hot Keys
description: Register scoped hot keys in your application.
---

# Register Scoped Hot Keys

Scoped hot keys are hot keys that are associated with a specific scope. In this page, we will guide you through the process of registering scoped hot keys.

## What Is Hot Keys Scope?

**Ez Hot Keys** manages hot keys in scopes. Each hot key is associated with a scope. Imagine your application has several features, you can register a hot keys scope for each feature, in this way, you can manage hot keys in each feature separately without worrying about duplicate hot keys in different features.

## `useHotKeys`

You can register scoped hot keys with `useHotKeys` hook. It is very simple, you just need to provide the scope name and the hot keys. Take a look at the example below:

```tsx
import { useHotKeys } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	useHotKeys({
		scopeName: "test",
		hotKeys: {
			"ctrl+k": () => {
				console.log("ctrl+k is pressed");
			},
		},
	});
}
```

The `scopeName` is the name of the scope that the hot keys associated with. The `hotKeys` is an object that maps hot keys to their handlers.

You can also register multiple hot keys with one handler.

```tsx
import { useHotKeys } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	useHotKeys({
		scopeName: "test",
		hotKeys: {
			"ctrl+k,ctrl+l": (hotKey) => {
				console.log("User pressed", hotKey);
				// Log: User pressed ctrl+k
				// Log: User pressed ctrl+l
			},
		},
	});
}
```

## `useHotKeysScope`

You can also register scoped hot keys with `useHotKeysScope` hook. It is a wrapper of `useHotKeys` and `useActiveHotKeyScope`.

```tsx
import { useHotKeysScope } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	let activatorElement: HTMLDivElement;
	useHotKeysScope({
		scopeName: "test",
		hotKeys: {
			"ctrl+k": () => {
				console.log("ctrl+k is pressed");
			},
		},
		triggers: ["focus"],
		autoFocus: true,
		getActivatorElement: () => activatorElement,
	});

	return (
		<div ref={activatorElement} tabIndex={0}>
			Click me to activate hot keys scope
		</div>
	);
}
```
