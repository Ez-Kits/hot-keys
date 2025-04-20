---
title: Register Scoped Hot Keys
description: Register scoped hot keys in your application.
---

# Register Scoped Hot Keys

Scoped hot keys are hot keys that are associated with a specific scope. In this page, we will guide you through the process of registering scoped hot keys.

## Prerequisites

Before starting, you make sure you have read [Installation](/getting-started/installation) and [Concepts](/getting-started/concepts) pages.

## `useHotKeys`

In case you don't have to activate hot keys scope, you can use `useHotKeys` hook to register scoped hot keys.

```tsx
import { useHotKeys } from "@ez-kits/hot-keys-react";

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

The `scopeName` is the name of the scope that the hot keys will be registered to. The `hotKeys` is an object that maps hot keys to their handlers.

## `useHotKeysScope`

If you have to activate hot keys scope, you can use `useHotKeysScope` hook to register scoped hot keys.

Hook `useHotKeysScope` is a wrapper of `useHotKeys` and `useActiveHotKeyScope`.

```tsx
import { useHotKeysScope } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useHotKeysScope("test", () => {
		useHotKeys({
			scopeName: "test",
			hotKeys: {
				"ctrl+k": () => {
					console.log("ctrl+k is pressed");
				},
			},
		});
	});
}
```
