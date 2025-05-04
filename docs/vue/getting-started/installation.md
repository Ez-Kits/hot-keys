---
title: Installation
description: Installation of Ez Hot Keys for Vue.
---

# Installation

In this page, we will guide you through the installation process of **Ez Hot Keys** for Vue.

## Install Dependencies

**Ez Hot Keys** can be installed using your preferred package manager. Choose one of the following methods:

```bash
# npm
npm install @ez-kits/hot-keys-vue

# yarn
yarn add @ez-kits/hot-keys-vue

# pnpm
pnpm add @ez-kits/hot-keys-vue
```

## Setup

All main features of **Ez Hot Keys** are available in the `HotKeysManager` component. To use **Ez Hot Keys**, you need to wrap your application with the `HotKeysManager` component.

```tsx
import { hotKeysPlugin } from "@ez-kits/hot-keys-vue";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(hotKeysPlugin()).mount("#app");
```

That is all you need to do to setup **Ez Hot Keys** in your application.
