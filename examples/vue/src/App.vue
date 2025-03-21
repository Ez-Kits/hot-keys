<script setup lang="ts">
import { useGlobalHotKeys, useHotKeysScope } from "@ez-kits/hot-keys-vue";
import { useTemplateRef } from "vue";

const containerRef = useTemplateRef<HTMLDivElement>("container");

useHotKeysScope({
	scopeName: "test",
	hotKeys: {
		"ctrl+a,cmd+a": (_, event) => {
			event.preventDefault();
			console.log("ctrl+a,cmd+a", event);
		},
	},
	triggers: ["focus", "hover"],
	autoFocus: true,
	getActivatorElement: () => containerRef.value,
});

useGlobalHotKeys({
	hotKeys: {
		"ctrl+b,cmd+b": (_, event) => {
			event.preventDefault();
			console.log("Global: ctrl+b,cmd+b", event);
		},
		"shift+a": (_, event) => {
			event.preventDefault();
			console.log("Global: shift+a", event);
		},
	},
});
</script>

<template>
	<div ref="container" tabindex="-1">
		<h1>Hello World</h1>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
