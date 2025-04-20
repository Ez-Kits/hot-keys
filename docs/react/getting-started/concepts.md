---
title: Concepts
description: Concepts of Ez Hot Keys for React.
---

# Concepts

Before you start using **Ez Hot Keys**, you should understand the following concepts:

## Hot Keys Manager

The `HotKeysManager` is a React component that manages hot keys (keyboard shortcuts) and hot keys scopes in your application. It provides a context for managing different scopes of hot keys.

## Hot Keys Scope

**Ez Hot Keys** manages hot keys in scopes. Each hot key is associated with a scope. You can register a hot keys scope with hooks: `useHotKeysScope`.

## Active Scope

The active scope is the scope that is currently active. There is only one active scope at a time. **Ez Hot Keys** will only trigger the hot keys of the active scope.

## Global Hot Keys

The global hot keys are hot keys that are not associated with any scope. They will be triggered if no scope handle the hot key. You can register global hot keys with `useGlobalHotKeys` hook.

## Sequences

Sequences are hot keys that are triggered by pressing keys sequentially. For example, `ctrl` then `s` is a sequence.
You can register sequences by using `_` as a separator in `hotKeys` option of `useHotKeysScope` hook.

**Example:**

```tsx
useHotKeysScope({
	hotKeys: {
		ctrl_s: () => console.log("ctrl+s"),
	},
});
```

## Combinations

Combinations are hot keys that are triggered by pressing multiple keys together. For example, `ctrl+s` is a combination.
You can register combinations by using `+` as a separator in `hotKeys` option of `useHotKeysScope` hook.

**Example:**

```tsx
useHotKeysScope({
	hotKeys: {
		"ctrl+s": () => console.log("ctrl+s"),
	},
});
```

## Modes

**Ez Hot Keys** has two modes to handle hot keys:

- `separate`: Sequences hot keys and combinations will be handled separately. Example: `ctrl_s` is different from `ctrl+s`.
- `unified`: Sequences hot keys and combinations will be handled in the same way. Example: `ctrl_s` is the same as `ctrl+s`.

**Default Mode:** The default mode is `separate`.

You can change the mode in two ways:

- By using `mode` prop of `HotKeysManager` component.

```tsx
<HotKeysManager mode="unified">
	<App />
</HotKeysManager>
```

- By using `updateOptions` function of `useHotKeysManagerContext` hook.

```tsx
const HotKeysManager = useHotKeysManagerContext();
HotKeysManager.updateOptions({ mode: "unified" });
```
