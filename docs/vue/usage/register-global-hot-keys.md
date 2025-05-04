---
title: Register Global Hot Keys
description: Register global hot keys in your application.
---

# Register Global Hot Keys

Global hot keys are hot keys that are not associated with any scope. They will be triggered if the active scope does not handle the hot key. In this page, we will guide you how to register global hot keys.

## `useGlobalHotKeys`

Register global hot keys with **Ez Hot Keys** is very simple. Just use `useGlobalHotKeys` composable to register global hot keys.

```vue
<script setup lang="ts">
import { useGlobalHotKeys } from "@ez-kits/hot-keys-vue";

useGlobalHotKeys({
	hotKeys: {
		"ctrl+k": () => {
			console.log("ctrl+k is pressed");
		},
	},
});
</script>

<template>
	<div>Register global hot keys</div>
</template>
```
