---
title: useInjectHotKeysManager
description: useInjectHotKeysManager composable is used to get the HotKeysManager instance.
---

# `useInjectHotKeysManager`

`useInjectHotKeysManager` composable is used to get the `HotKeysManager` instance.

## Usage

```vue{filename="MyComponent.vue"}
<script setup lang="ts">
import { useInjectHotKeysManager } from "@ez-kits/hot-keys-vue";

const HotKeysManager = useInjectHotKeysManager();
HotKeysManager.updateOptions({ mode: "unified" });
</script>

<template>
	<div>My Component</div>
</template>
```

## Types

```ts
interface IHotKeyScopeInstance {
	name: string;
	addHotKey(hotKey: string, input: IHotKeyInput): void;
	removeHotKey(hotKey: string): void;
	searchNodeByHotKey(hotKey: string): IHotKeyNode | undefined;
	searchNodeByHotKeyFromRoot(hotKey: string): IHotKeyNode | undefined;
	getRootNode(): IHotKeyNode;
	isEmptyHotKey(): boolean;
	setCurrentNode(node: IHotKeyNode): void;
	getCurrentNode(): IHotKeyNode;
	resetCurrentNode(): void;
}

interface IHotKeyDelegateOptions {
	/**
	 * If true, the keyboard event will not be propagated to the element when a hotkey is triggered.
	 * @default false
	 */
	stopPropagation?: boolean;
	/**
	 * If true, the keyboard event will be prevented.
	 * @default false
	 */
	preventDefault?: boolean;
	/**
	 * If true, the hotkeys manager will log debug information to the console.
	 * @default false
	 */
	debug?: boolean;
}

interface IHotKeysManagerOptions extends IHotKeyDelegateOptions {
	/**
	 * Root element to listen to keyboard events.
	 * @default `document`
	 */
	getElement?: () => HTMLElement | null | undefined;

	/**
	 * The mode of the hotkeys manager.
	 * @default `separate`
	 */
	mode?: "separate" | "unified";

	/**
	 * If true, the hotkeys manager will be enabled. And all hotkeys will be triggered.
	 * @default true
	 */
	enabled?: boolean;
}

interface IHotKeysManagerInstance {
	options: IHotKeysManagerOptions;
	updateOptions(options: Partial<IHotKeysManagerOptions>): void;

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	registerScope(scopeName: string): IHotKeyScopeInstance;
	unregisterScopeIfNeed(scopeName: string): void;
	activateScope(scopeName: string): void;
	deactivateScope(scopeName: string): void;
	getActiveScope(): IHotKeyScopeInstance;

	disable(): void;
	enable(): void;

	mount(): () => void;
	unmount(): void;
}

export declare function useInjectHotKeysManager(): IHotKeysManagerInstance;
```
