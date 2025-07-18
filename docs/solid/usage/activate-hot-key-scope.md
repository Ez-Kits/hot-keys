---
title: Activate Hot Key Scope
description: Activate hot key scope in your application.
---

# Activate Hot Key Scope

In this page, we will learn how to activate hot key scope in your application.

## Why need to activate hot key scope?

In **Ez Hot Keys**, hot keys are managed in scopes. Each scope has its own hot keys. **Ez Hot Keys** will only trigger the hot keys of the active scope.

## `useActiveHotKeyScope`

Hook `useActiveHotKeyScope` is used to activate hot keys scope by element events `focus` and `hover`.

```tsx
import { useActiveHotKeyScope } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	let activatorElement: HTMLDivElement;
	useActiveHotKeyScope({
		scopeName: "test",
		triggers: ["focus", "hover"],
		autoFocus: true,
		getActivatorElement: () => activatorElement,
	});

	return (
		<div ref={activatorElement} tabIndex={0}>
			Test
		</div>
	);
}
```

The `scopeName` is the name of the scope that you want to activate. The `triggers` is an array of triggers that will activate the scope.

When component is unmounted, the scope will be deactivated automatically.

## `useHotKeysScope`

Hook `useHotKeysScope` is a wrapper of `useActiveHotKeyScope` and `useHotKeys`. So, you can use it to activate hot keys scope and register scoped hot keys at the same time.

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
		triggers: ["focus", "hover"],
		autoFocus: true,
		getActivatorElement: () => activatorElement,
	});

	return (
		<div ref={activatorElement} tabIndex={0}>
			Test
		</div>
	);
}
```

## `HotKeysManager`

### Activate scope

You can use `HotKeysManager.activateScope` to activate a scope. To retrieve the `HotKeysManager` instance, you can use `useHotKeysManagerContext` hook.

```tsx
import { useHotKeysManagerContext } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	const hotKeysManager = useHotKeysManagerContext();
	hotKeysManager.activateScope("test");

	return <div>Test</div>;
}
```

### Deactivate scope

You can also use `HotKeysManager.deactivateScope` to deactivate a scope.

```tsx
import { useHotKeysManagerContext } from "@ez-kits/hot-keys-solid";

function MyComponent() {
	const hotKeysManager = useHotKeysManagerContext();
	hotKeysManager.deactivateScope();
}
```

Method `deactivateScope` will deactivate the scope that is currently activated. So you don't need to pass any argument to it.
