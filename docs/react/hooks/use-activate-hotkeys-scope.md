---
title: useActivateHotKeysScope
description: useActivateHotKeysScope is a hook that allows you to activate a specific hot key scope based on element's events.
---

# `useActivateHotKeysScope`

`useActivateHotKeysScope` is a hook that allows you to activate a specific hot key scope based on element's events.

## Usage

```tsx{filename="MyComponent.tsx"}
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

:::alert{color="info" icon="majesticons-lightbulb-shine-line"}
Checkout [Activate Hot Keys Scope](/react/usage/activate-hot-key-scope) page for more details.
:::

## Types

```ts
interface IHotKeyScopeActivatorOptions {
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

interface UseActivateHotKeyScopeOptions extends IHotKeyScopeActivatorOptions {}

export declare function useActivateHotKeyScope(
	options: UseActivateHotKeyScopeOptions
): void;
```
