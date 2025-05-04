---
title: Installation
description: Installation of Ez Hot Keys for React.
---

# Installation

In this page, we will guide you through the installation process of **Ez Hot Keys** for React.

## Install Dependencies

**Ez Hot Keys** can be installed using your preferred package manager. Choose one of the following methods:

```bash
# npm
npm install @ez-kits/hot-keys-react

# yarn
yarn add @ez-kits/hot-keys-react

# pnpm
pnpm add @ez-kits/hot-keys-react
```

## Setup

All main features of **Ez Hot Keys** are available in the `HotKeysManager` component. To use **Ez Hot Keys**, you need to wrap your application with the `HotKeysManager` component.

```tsx
import { HotKeysManager } from "@ez-kits/hot-keys-react";
import { createRoot } from "react-dom/client";

function App() {
	return <div>My Application</div>;
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<HotKeysManager>
		<App />
	</HotKeysManager>
);
```

That is all you need to do to setup **Ez Hot Keys** in your application.
