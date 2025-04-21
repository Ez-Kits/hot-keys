import { HotKeyHandler } from "src/types";

import { IHotKeysManagerInstance } from "src/types";

export function debounce(fn: () => void, milliseconds: number) {
	let timeoutId: NodeJS.Timeout | undefined;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(fn, milliseconds);
	};
}

export function getKeyFromEvent(e: KeyboardEvent): string {
	const keyCode = e.keyCode || e.which || e.charCode;

	if (
		(keyCode && keyCode >= 65 && keyCode <= 90) ||
		(keyCode >= 97 && keyCode <= 122)
	) {
		return String.fromCharCode(keyCode).toLowerCase();
	}

	return e.key.toLowerCase().trim();
}

export function normalizeKey(key: string): string {
	const lowerCaseKey = key.toLowerCase().trim();

	switch (lowerCaseKey) {
		case "esc":
			return "escape";
		case "ctrl":
			return "control";
		case "option":
			return "alt";
		case "cmd":
			return "meta";
		case "return":
			return "enter";
		case "space":
			return " ";
		default:
			return lowerCaseKey;
	}
}

export function normalizeHotKey(hotKey: string): string[] {
	return hotKey.split("_").map((x) =>
		x
			.split("+")
			.map((y) => normalizeKey(y))
			.join("+")
	);
}

export function registerHotKeys(
	hotKeyManager: IHotKeysManagerInstance,
	scope: string,
	hotKeysString: string,
	hotKeysSeparator: string,
	handler: HotKeyHandler
) {
	const scopeInstance = hotKeyManager.registerScope(scope);
	const hotKeys = hotKeysString
		.split(hotKeysSeparator || ",")
		.map((hotKey) => hotKey.trim());

	hotKeys.forEach((hotKey) => {
		scopeInstance.addHotKey(hotKey, handler);
	});

	return () => {
		hotKeys.forEach((hotKey) => {
			scopeInstance.removeHotKey(hotKey);
		});
		hotKeyManager.unregisterScopeIfNeed(scope);
	};
}

export function registerHotKeysFromRecord(
	hotKeysManager: IHotKeysManagerInstance,
	scope: string,
	hotKeys: Record<string, HotKeyHandler>,
	hotKeysSeparator: string
) {
	const hotKeysPairs = Object.entries(hotKeys);
	const unRegisterHotKeys = hotKeysPairs.map(([hotKey, handler]) =>
		registerHotKeys(hotKeysManager, scope, hotKey, hotKeysSeparator, handler)
	);

	return () => {
		unRegisterHotKeys.forEach((unRegisterHotKey) => unRegisterHotKey());
	};
}

export function registerGlobalHotKeys(
	hotKeyManager: IHotKeysManagerInstance,
	hotKeysString: string,
	hotKeysSeparator: string,
	handler: HotKeyHandler
) {
	const scopeInstance = hotKeyManager.globalScope;
	const hotKeys = hotKeysString
		.split(hotKeysSeparator || ",")
		.map((hotKey) => hotKey.trim());

	hotKeys.forEach((hotKey) => {
		scopeInstance.addHotKey(hotKey, handler);
	});

	return () => {
		hotKeys.forEach((hotKey) => {
			scopeInstance.removeHotKey(hotKey);
		});
	};
}

export function registerGlobalHotKeysFromRecord(
	hotKeysManager: IHotKeysManagerInstance,
	hotKeys: Record<string, HotKeyHandler>,
	hotKeysSeparator: string
) {
	const hotKeysPairs = Object.entries(hotKeys);
	const unRegisterHotKeys = hotKeysPairs.map(([hotKey, handler]) =>
		registerGlobalHotKeys(hotKeysManager, hotKey, hotKeysSeparator, handler)
	);

	return () => {
		unRegisterHotKeys.forEach((unRegisterHotKey) => unRegisterHotKey());
	};
}
