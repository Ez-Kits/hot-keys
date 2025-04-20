---
title: Register Global Hot Keys
description: Register global hot keys in your application.
---

# Register Global Hot Keys

Global hot keys are hot keys that are not associated with any scope. They will be triggered if no scope handle the hot key. In this page, we will guide you through the process of registering global hot keys.

## Prerequisites

Before starting, you make sure you have read [Installation](/getting-started/installation) and [Concepts](/getting-started/concepts) pages.

## `useGlobalHotKeys`

Register global hot keys with **Ez Hot Keys** is very simple. You can use `useGlobalHotKeys` hook to register global hot keys.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			"ctrl+k": () => {
				console.log("ctrl+k is pressed");
			},
		},
	});

	return <div>Register global hot keys</div>;
}
```
