---
title: Register Sequence Hot Keys
description: Register sequence hot keys in your application.
---

# Register sequence hot keys

Sequence hot keys are hot keys that are a sequence of hot keys. You can register sequence hot keys with both global and scoped hot keys.

:::alert
---
color: info
---
Keys of the sequence hot key is separated by `_` in the string.
:::

## Prerequisites

Before starting, you make sure you have read [Installation](/getting-started/installation) and [Concepts](/getting-started/concepts) pages.

## Register sequence hot keys with global hot keys

It is very str

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			ctrl_k: () => {
				console.log("ctrl_k is pressed");
			},
		},
	});
}
```

## Register sequence hot keys with scoped hot keys

```tsx
import { useHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useHotKeys({
		scopeName: "test",
		hotKeys: {
			ctrl_k: () => {
				console.log("ctrl_k is pressed");
			},
		},
	});
}
```
