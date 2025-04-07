---
title: useHotKeys
description: useHotKeys hook allows you to register and manage keyboard shortcuts (hot keys) in your React components. It's useful when you want to register hot keys in a specific scope but don't need to activate the scope.
---

## Usage

```tsx filename="MyComponent.tsx"
import { useHotKeys } from "@ez-kits/hot-keys-react";

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
