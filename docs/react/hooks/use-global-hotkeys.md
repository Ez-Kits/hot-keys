---
title: useGlobalHotKeys
description: useGlobalHotKeys hook.
---

`useGlobalHotKeys` is a hook that allows you to register global keyboard shortcuts (hot keys) in your React application. These shortcuts will work regardless of which element has focus in your application.

## Usage

### Basic Usage

```tsx filename="MyComponent.tsx"
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

### Custom Separator

```tsx filename="MyComponent.tsx"
function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			"ctrl+s|cmd+s": (e) => {
				e.preventDefault();
				console.log("Save triggered");
			},
		},
		hotKeysSeparator: "|", // Change separator from default "," to "|"
	});

	return <div>Press Ctrl+S or Cmd+S to save</div>;
}
```

## Types

```typescript
interface UseGlobalHotKeysOptions {
	// Record of hotkey combinations and their handler functions
	hotKeys: Record<string, HotKeyHandler>;

	// Optional separator for defining multiple key combinations
	// Default value is ","
	hotKeysSeparator?: string;
}

type HotKeyHandler = (event: KeyboardEvent) => void;
```
