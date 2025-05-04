---
title: Activate Hot Key Scope
description: Activate hot key scope in your application.
---

# Activate Hot Key Scope

In this page, we will learn how to activate hot key scope in your application.

## Why need to activate hot key scope?

In **Ez Hot Keys**, hot keys are managed in scopes. Each scope has its own hot keys. **Ez Hot Keys** will only trigger the hot keys of the active scope.

## `useActiveHotKeyScope`

Composable `useActiveHotKeyScope` is used to activate hot keys scope by element events `focus` and `hover`.

```vue
<script setup lang="ts">
import { useActiveHotKeyScope } from "@ez-kits/hot-keys-vue";
import { useTemplateRef } from "vue";

const activatorElement = useTemplateRef<HTMLDivElement>("activator");
useActiveHotKeyScope({
	scopeName: "test",
	triggers: ["focus", "hover"],
	autoFocus: true,
	getActivatorElement: () => activatorElement.value,
});
</script>

<template>
	<div ref="activator" :tab-index="0">Test</div>
</template>
```

The `scopeName` is the name of the scope that you want to activate. The `triggers` is an array of triggers that will activate the scope.

When component is unmounted, the scope will be deactivated automatically.

## `useHotKeysScope`

Composable `useHotKeysScope` is a wrapper of `useActiveHotKeyScope` and `useHotKeys`. So, you can use it to activate hot keys scope and register scoped hot keys at the same time.

```vue
<script setup lang="ts">
import { useHotKeysScope } from "@ez-kits/hot-keys-vue";
import { useTemplateRef } from "vue";

const activatorElement = useTemplateRef<HTMLDivElement>("activator");

useHotKeysScope({
	scopeName: "test",
	hotKeys: {
		"ctrl+k": () => {
			console.log("ctrl+k is pressed");
		},
	},
	triggers: ["focus", "hover"],
	autoFocus: true,
	getActivatorElement: () => activatorElement.value,
});
</script>

<template>
	<div ref="activator" :tab-index="0">Test</div>
</template>
```

## `HotKeysManager`

### Activate scope

You can use `HotKeysManager.activateScope` to activate a scope. To retrieve the `HotKeysManager` instance, you can use `useInjectHotKeysManager` composable.

```vue
<script setup lang="ts">
import { useInjectHotKeysManager } from "@ez-kits/hot-keys-vue";

const hotKeysManager = useInjectHotKeysManager();
hotKeysManager.activateScope("test");
</script>

<template>
	<div>Test</div>
</template>
```

### Deactivate scope

You can also use `HotKeysManager.deactivateScope` to deactivate a scope.

```vue
<script setup lang="ts">
import { useInjectHotKeysManager } from "@ez-kits/hot-keys-vue";

const hotKeysManager = useInjectHotKeysManager();
hotKeysManager.deactivateScope();
</script>

<template>
	<div>Test</div>
</template>
```

Method `deactivateScope` will deactivate the scope that is currently activated. So you don't need to pass any argument to it.
