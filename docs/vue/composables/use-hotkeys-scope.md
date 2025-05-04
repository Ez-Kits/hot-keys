---
title: useHotKeysScope
description: useHotKeysScope composable allows you to register and manage hot keys within a specific scope in your application.
---

# `useHotKeysScope`

`useHotKeysScope` composable allows you to register and manage hot keys within a specific scope in your application.

## Usage

```vue{filename="MyComponent.vue"}
<script setup lang="ts">
import { useHotKeysScope } from "@ez-kits/hot-keys-vue";
import { useTemplateRef } from "vue";

const elementRef = useTemplateRef<HTMLDivElement>("element");

useHotKeysScope({
	scopeName: "my-component",
	hotKeys: {
		// Single key
		a: () => console.log("Pressed A"),

		// Key combination
		"ctrl+s": (e) => {
			e.preventDefault();
			console.log("Save");
		},

		// Multiple shortcuts for same action
		"ctrl+c,cmd+c": () => console.log("Copy"),

		// Sequential hotkeys
		"ctrl_k,ctrl_l": () => console.log("Go to next and previous"),
	},
	triggers: ["hover", "focus"],
	autoFocus: true,
	getActivatorElement: () => elementRef.value,
});
</script>

<template>
	<div ref="element" :tab-index="0">My Component</div>
</template>
```

## Types

```tsx
export type UseHotKeysScopeOptions = {
	hotKeys: MaybeAccessor<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeAccessor<string>;
} & UseActivateHotKeyScopeOptions;

export declare function useHotKeysScope(options: UseHotKeysScopeOptions): void;
```
