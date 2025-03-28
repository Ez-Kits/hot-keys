<script setup lang="ts">
import {
	useGlobalHotKeys,
	useHotKeysScope,
	useInjectHotKeysManager,
} from "@ez-kits/hot-keys-vue";
import { ref, useTemplateRef, watch } from "vue";

const hotKeysManager = useInjectHotKeysManager();
const containerRef = useTemplateRef<HTMLDivElement>("container");
const mode = ref<"separate" | "unified">("separate");

watch(mode, () => {
	hotKeysManager.updateOptions({
		mode: mode.value,
	});
});

useHotKeysScope({
	scopeName: "test",
	triggers: ["focus", "hover"],
	autoFocus: true,
	hotKeys: {
		"ctrl+a, cmd+a": (_, e) => {
			e.preventDefault();
			console.log("Scope: ctrl+a");
		},
		"ctrl_b, cmd_b": () => {
			console.log("Scope: ctrl then b");
		},
	},
	getActivatorElement: () => containerRef.value,
});

useGlobalHotKeys({
	hotKeys: {
		"ctrl_b, cmd_b": () => {
			console.log("Global: ctrl then b");
		},
		"ctrl+a, cmd+a": (_, e) => {
			e.preventDefault();
			console.log("Global: ctrl+a");
		},
	},
});
</script>

<template>
	<div
		:style="{
			padding: '2rem',
			display: 'flex',
			'flex-direction': 'column',
			gap: '1rem',
		}"
	>
		<div :style="{ display: 'flex', gap: '1rem' }">
			<button @click="mode = 'separate'">Mode: Separate</button>
			<button @click="mode = 'unified'">Mode: Unified</button>
			<span>
				Current mode: <strong>{{ mode }}</strong>
			</span>
		</div>
		<div
			:style="{
				'font-style': 'italic',
			}"
		>
			<strong>Separate:</strong> Press <code>ctrl then b</code> is different
			from <code>cmd+b</code>.<br />
			<strong>Unified:</strong> Press <code>ctrl then b</code> is same as
			<code>cmd+b</code>.
		</div>
		<div
			ref="container"
			tabindex="-1"
			:style="{
				border: '2px dashed gray',
				display: 'inline-block',
				padding: '2rem',
			}"
		>
			Hover or focus to activate scope.
			<br />
			Sequence hotkeys:
			<br />
			<strong> <code>ctrl then b</code> </strong> or
			<strong>
				<code>cmd then b</code>
			</strong>
			<br />
			Combined hotkeys:
			<br />
			<strong> <code>ctrl+a</code> </strong> or
			<strong>
				<code>cmd+a</code>
			</strong>
			<br />
			(This box is auto focused.)
		</div>
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
