---
title: useHotKeysManagerContext
description: useHotKeysManagerContext hook is used to get the HotKeysManager instance.
---

## Usage

```tsx filename="MyComponent.tsx"
import { useHotKeysManagerContext } from "@ez-kits/hot-keys-react";

function MyComponent() {
	const HotKeysManager = useHotKeysManagerContext();
	HotKeysManager.updateOptions({ mode: "unified" });
}
```
