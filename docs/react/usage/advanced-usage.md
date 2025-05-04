---
title: Advanced Usage
description: Advanced usage of Ez Hot Keys for React.
---

# Advanced Usage

Default options for each hot key are carefully designed for most cases. But sometimes you may need to customize the options for a specific hot key.

## Hot Key Options

### Ignore Input

By default, hot keys will not work when the user is typing. But sometimes you may want to work with the input. You can set the `ignoreInput` option to `false` to make the hot key work even when the user is typing.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			ctrl_k: {
				ignoreInput: false,
				handler: () => {
					console.log("ctrl+k is pressed");
				},
			},
		},
	});

	return <input type="text" />;
}
```

This is useful when you want your user to be able to trigger a hot key even when they are typing. It may help your app have a better user experience.

### Repeatable

What is a repeat? It means user press the key and hold it. For example, if the hot key is `ctrl+k`, and the user press `ctrl+k` and hold on `k` key, the hot key handler will be triggered repeatedly.

By default, hot keys will only trigger once even when the user holds down the key. But in some cases, you may want to work with the repeated key. You can set the `repeatable` option to `true` to make the hot key work even when the user is holding down the key.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			ctrl_k: {
				repeatable: true,
				handler: () => {
					console.log("ctrl+k is pressed");
				},
			},
		},
	});

	return <div>Repeatable hot key</div>;
}
```

In the above example, the hot key handler will be triggered continuously when the user holds down the `ctrl` key and the `k` key.

This is useful when you want to create a hot key that can be used to navigate through a list of items.

**Detect when hot key is triggered repeatedly**

You can detect when the hot key is triggered repeatedly by checking the `repeat` property of the `event` parameter.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			ctrl_k: {
				handler: (hotKey, event) => {
					if (event.repeat) {
						console.log("ctrl+k is pressed repeatedly");
					} else {
						console.log("ctrl+k is pressed");
					}
				},
			},
		},
	});

	return <div>Repeatable hot key</div>;
}
```

### Enable Or Disable Hot Key

You can enable or disable a hot key by passing `enabled` option to the hot key.

```tsx
import { useGlobalHotKeys } from "@ez-kits/hot-keys-react";

function MyComponent() {
	useGlobalHotKeys({
		hotKeys: {
			"ctrl+k": {
				enabled: false,
				handler: () => {
					console.log("ctrl+k is pressed");
				},
			},
		},
	});

	return <div>Enable or disable hot key</div>;
}
```

## Hot Key Manager

### Switch Mode

**Ez Hot Keys** has two modes to handle hot keys:

**_Separate Mode_**

Sequences hot keys and combinations will be handled separately.

**Example:**

- `ctrl_s` will only be triggered when user press `ctrl` then `s`.
- `ctrl+s` will only be triggered when user press `ctrl+s`.

**_Unified Mode_**

Sequences hot keys and combinations will be triggered in both ways.

**Example:**

- `ctrl_s` will be triggered when user press `ctrl+s` or `ctrl` then `s`.
- `ctrl+s` will also be triggered when user press `ctrl+s` or `ctrl` then `s`.

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

### Disable Or Enable Ez Hot Keys

You can disable or enable Ez Hot Keys by calling `disable` or `enable` function of `useHotKeysManagerContext` hook.

```tsx
const HotKeysManager = useHotKeysManagerContext();
// Disable Ez Hot Keys
HotKeysManager.disable();
// Enable Ez Hot Keys
HotKeysManager.enable();
```
