---
title: Register Sequence Hot Keys
description: Register sequence hot keys in your application.
---

# Register sequence hot keys

Sequences are hot keys that are triggered by pressing keys sequentially. For example, `ctrl` then `s` is a sequence. You can register sequence hot keys with both global and scoped hot keys.

## Register sequence hot keys with global hot keys

It is very straightforward to register sequence hot keys with global hot keys.

:::alert{color="info"}
Keys of the sequence hot key is separated by `_` in the string.
:::

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

Just same as registering global hot keys, you can register sequence hot keys with scoped hot keys.

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
