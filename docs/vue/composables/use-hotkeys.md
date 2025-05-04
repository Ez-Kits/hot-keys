---
title: useHotKeys
description: useHotKeys composable allows you to register and manage keyboard shortcuts (hot keys) in your Vue components. It's useful when you want to register hot keys in a specific scope but don't need to activate the scope.
---

# `useHotKeys`

`useHotKeys` composable allows you to register and manage hot keys in your Vue components. It's useful when you want to register hot keys in a specific scope but don't need to activate the scope.

## Usage

```vue{filename="MyComponent.vue"}
<script setup lang="ts">
import { useHotKeys } from "@ez-kits/hot-keys-vue";

useHotKeys({
	hotKeys: {
		"ctrl+s": () => console.log("Save"),
	},
	scopeName: "my-component",
});
</script>

<template>
	<div>My Component</div>
</template>
```

## Types

```ts
export interface UseHotKeysOptions {
	hotKeys: MaybeRef<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeRef<string>;
	scopeName?: MaybeRef<string>;
}

export declare function useHotKeys(options: UseHotKeysOptions): void;
```
