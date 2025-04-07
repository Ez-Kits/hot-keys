---
title: useActivateHotKeysScope
description: `useActivateHotKeysScope` is a hook that allows you to activate and manage a specific hot key scope within your React components. This hook helps you control when certain keyboard shortcuts are active based on component lifecycle and conditions.
---

## Usage

```tsx filename="MyComponent.tsx"
import { useActivateHotKeysScope } from "@ez-kits/hot-keys-react";

function MyComponent() {
	const elementRef = useRef<HTMLDivElement>(null);

	useActivateHotKeysScope({
		scopeName: "my-component",
		triggers: ["hover", "focus"],
		autoFocus: true,
		getActivatorElement: () => elementRef.current,
	});

	return <div ref={elementRef}>My Component</div>;
}
```

## Types

```ts
interface UseActivateHotKeyScopeOptions {
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
```
