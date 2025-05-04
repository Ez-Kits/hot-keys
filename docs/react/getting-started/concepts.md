---
title: Concepts
description: Concepts of Ez Hot Keys for React.
---

# Concepts

Before you start using **Ez Hot Keys**, you should understand the following concepts:

## Hot Keys Manager

The `HotKeysManager` is a React component that manages hot keys (keyboard shortcuts) and hot keys scopes in your application. It provides a context for managing different scopes of hot keys.

## Hot Keys Scope

**Ez Hot Keys** manages hot keys in scopes. Each hot key is associated with a scope. Imagine your application has several features, you can register a hot keys scope for each feature, in this way, you can manage hot keys in each feature separately without worrying about duplicate hot keys in different features.

You can register a hot keys scope with hooks: `useHotKeysScope`, `useHotKeys`.

## Active Scope

The active scope is the scope that is currently active. **Ez Hot Keys** will only trigger the hot keys of the active scope. There is only one active scope at a time.

## Global Hot Keys

The global hot keys are hot keys that are not associated with any scope. They will be triggered if the active scope does not handle the hot key. You can register global hot keys with `useGlobalHotKeys` hook.

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

### Separate Mode

Sequences hot keys and combinations will be handled separately.

**Example:**

- `ctrl_s` will only be triggered when user press `ctrl` then `s`.
- `ctrl+s` will only be triggered when user press `ctrl+s`.

### Unified Mode

Sequences hot keys and combinations will be triggered in both ways.

**Example:**

- `ctrl_s` will be triggered when user press `ctrl+s` or `ctrl` then `s`.
- `ctrl+s` will also be triggered when user press `ctrl+s` or `ctrl` then `s`.

**Default Mode:** The default mode is `separate`.
