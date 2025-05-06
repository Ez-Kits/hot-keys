---
title: Listen Events
description: Listen to events from the HotKeysManager
---

# Listen Events

**Ez Hot Keys** provides events that you can listen to.

## Listen to event

You can listen to events from the `HotKeysManager` by using the `on` method.

```tsx
import { useHotKeysManagerContext } from "@ez-kits/hot-keys-react";
import { useEffect } from "react";

function MyComponent() {
	const hotKeysManager = useHotKeysManagerContext();

	useEffect(() => {
		return hotKeysManager.on("hot-keys:trigger", (hotKeyInfo, event) => {
			console.log("hot-keys:trigger", hotKeyInfo, event);
		});
	}, [hotKeysManager]);

	return <div>My Component</div>;
}
```

## Supported Events

### `hot-keys:trigger`

Triggered when a hotkey is triggered.

#### Parameters

- hotKeyInfo: `IHotKeyInfo`. _The hotkey info._
  - hotKey: `string`. _The hotkey._
  - scopeName: `string`. _Name of the scope where the hot key associated with._
  - ignoreInput: `boolean`. _If true, hot key will not be triggered if user is typing in input or textarea._
  - enabled: `boolean`. _If false, hot key will not be triggered._
  - repeatable: `boolean`. _If true, hot key can be triggered repeatedly._
- event: `KeyboardEvent`.

### `hot-keys:trigger-error`

Triggered when a hotkey is found but it cannot be triggered.

#### Parameters

- hotKeyInfo: `IHotKeyInfo`. _The hotkey info._
  - hotKey: `string`. _The hotkey._
  - scopeName: `string`. _Name of the scope where the hot key associated with._
  - ignoreInput: `boolean`. _If true, hot key will not be triggered if user is typing in input or textarea._
  - enabled: `boolean`. _If false, hot key will not be triggered._
  - repeatable: `boolean`. _If true, hot key can be triggered repeatedly._
- event: `KeyboardEvent`.
- reason: `object`. _The reason why the hotkey cannot be triggered._
  - disabled: `boolean`. _The hotkey is disabled._
  - ignoreInput: `boolean`. _The hotkey is ignored because the user is typing in input or textarea._
  - repeat: `boolean`. _Repeat is detected but hot key is not repeatable._

### `hot-keys:register`

Triggered when a hotkey is registered.

#### Parameters

- hotKey: `string`. _The hot key that is registered._
- hotKeyInfo: `Omit<IHotKeyInfo, "hotKey">`. _The hot key information._
  - enabled: `boolean`. _If false, hot key will not be triggered._
  - ignoreInput: `boolean`. _If true, hot key will not be triggered if user is typing in input or textarea._
  - repeatable: `boolean`. _If true, hot key can be triggered repeatedly._
  - handler: `HotKeyHandler`. _The handler to call when the hot key is triggered._
- scope: `IHotKeyScopeInstance`. _The scope that the hot key is registered in._

### `hot-keys:unregister`

Triggered when a hotkey is unregistered.

#### Parameters

- hotKey: `string`. _The hotkey._
- scope: `IHotKeyScopeInstance`. _The scope that the hot key is unregistered from._

### `scopes:register`

Triggered when a scope is registered.

#### Parameters

- scope: `IHotKeyScopeInstance`. _The scope that is registered._

### `scopes:unregister`

Triggered when a scope is unregistered.

#### Parameters

- scope: `IHotKeyScopeInstance`. _The scope that is unregistered._

### `scopes:activate`

Triggered when a scope is activated.

#### Parameters

- scope: `IHotKeyScopeInstance`. _The scope that is activated._

### `scopes:deactivate`

Triggered when a scope is deactivated.

#### Parameters

- scope: `IHotKeyScopeInstance`. _The scope that is deactivated._

### `enabled`

Triggered when the hotkeys manager is enabled.

#### Parameters

No parameters.

### `disabled`

Triggered when the hotkeys manager is disabled.

#### Parameters

No parameters.
