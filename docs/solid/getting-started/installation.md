---
title: Installation
description: Installation of Ez Hot Keys for Solid.
---

# Installation

In this page, we will guide you through the installation process of **Ez Hot Keys** for Solid.

## Install Dependencies

**Ez Hot Keys** can be installed using your preferred package manager. Choose one of the following methods:

```bash
# npm
npm install @ez-kits/hot-keys-solid

# yarn
yarn add @ez-kits/hot-keys-solid

# pnpm
pnpm add @ez-kits/hot-keys-solid
```

## Setup

All main features of **Ez Hot Keys** are available in the `HotKeysManager` component. To use **Ez Hot Keys**, you need to wrap your application with the `HotKeysManager` component.

```tsx
import { HotKeysManager } from "@ez-kits/hot-keys-solid";
import { render } from "solid-js/web";

function App() {
	return <div>My Application</div>;
}

const root = document.getElementById("root");
render(
	() => (
		<HotKeysManager>
			<App />
		</HotKeysManager>
	),
	root!
);
```

That is all you need to do to setup **Ez Hot Keys** in your application.
