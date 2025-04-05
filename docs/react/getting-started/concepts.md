---
title: Concepts
description: Concepts of Ez Hot Keys for React.
---

## Hot Keys Manager

The `HotKeysManager` is a React component that manages keyboard shortcuts (hot keys) and their scopes in your application. It provides a context for handling keyboard events and managing different scopes of shortcuts.

## Hot Keys Scope

Ez Hot Keys manages hot keys in scopes. You can register a hot keys scope with `useHotKeysScope` hook.

## Active Scope

The active scope is the scope that is currently active. There is only one active scope at a time.

## Global Hot Keys

The global hot keys are hot keys that are not associated with any scope. They will be triggered if no scope handle the hot key. You can register global hot keys with `useGlobalHotKeys` hook.
