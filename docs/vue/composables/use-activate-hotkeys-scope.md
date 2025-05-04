---
title: useActivateHotKeysScope
description: useActivateHotKeysScope is a composable that allows you to activate a specific hot key scope based on element's events.
---

# `useActivateHotKeysScope`

`useActivateHotKeysScope` is a composable that allows you to activate a specific hot key scope based on element's events.

## Usage

```vue{filename="MyComponent.vue"}
<script setup lang="ts">
import { useActivateHotKeysScope } from "@ez-kits/hot-keys-vue";
import { useTemplateRef } from "vue";

const elementRef = useTemplateRef<HTMLDivElement>("element");

useActivateHotKeysScope({
	scopeName: "my-component",
	triggers: ["hover", "focus"],
	autoFocus: true,
	getActivatorElement: () => elementRef.value,
});
</script>

<template>
	<div ref="element" :tab-index="0">My Component</div>
</template>
```

:::alert{color="info" icon="majesticons-lightbulb-shine-line"}
Checkout [Activate Hot Keys Scope](/vue/usage/activate-hot-key-scope) page for more details.
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

export interface UseActivateHotKeyScopeOptions
	extends ToMaybeRefObject<IHotKeyScopeActivatorOptions> {}

export declare function useActivateHotKeyScope(
	options: UseActivateHotKeyScopeOptions
): void;
```
