import { IHotKeyInput, IHotKeysManagerInstance } from "src/types";

export function debounce(fn: () => void, milliseconds: number) {
	let timeoutId: NodeJS.Timeout | undefined;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(fn, milliseconds);
	};
}

export function isServer(): boolean {
	return typeof window === "undefined";
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
		case "command":
		case "win":
		case "windows":
			return "meta";
		case "return":
			return "enter";
		case "space":
		case "": // trimmed space
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

export function isEditableElement(eventTarget: EventTarget | null): boolean {
	if (!eventTarget) {
		return false;
	}

	if (!(eventTarget instanceof HTMLElement)) {
		return false;
	}

	if (eventTarget instanceof HTMLInputElement) {
		return (
			!eventTarget.type ||
			[
				"email",
				"number",
				"password",
				"search",
				"tel",
				"text",
				"url",
				"date",
				"datetime-local",
				"month",
				"time",
				"week",
			].includes(eventTarget.type.toLowerCase())
		);
	}

	if (eventTarget instanceof HTMLTextAreaElement) {
		return true;
	}

	return eventTarget.isContentEditable;
}

export function registerHotKeys(
	hotKeyManager: IHotKeysManagerInstance,
	scope: string,
	hotKeysString: string,
	hotKeysSeparator: string,
	input: IHotKeyInput
) {
	const scopeInstance = hotKeyManager.registerScope(scope);
	const hotKeys = hotKeysString
		.split(hotKeysSeparator || ",")
		.map((hotKey) => hotKey.trim());

	hotKeys.forEach((hotKey) => {
		scopeInstance.addHotKey(hotKey, input);
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
	hotKeys: Record<string, IHotKeyInput>,
	hotKeysSeparator: string
) {
	const hotKeysPairs = Object.entries(hotKeys);
	const unRegisterHotKeys = hotKeysPairs.map(([hotKey, input]) =>
		registerHotKeys(hotKeysManager, scope, hotKey, hotKeysSeparator, input)
	);

	return () => {
		unRegisterHotKeys.forEach((unRegisterHotKey) => unRegisterHotKey());
	};
}

export function registerGlobalHotKeys(
	hotKeyManager: IHotKeysManagerInstance,
	hotKeysString: string,
	hotKeysSeparator: string,
	input: IHotKeyInput
) {
	const scopeInstance = hotKeyManager.globalScope;
	const hotKeys = hotKeysString
		.split(hotKeysSeparator || ",")
		.map((hotKey) => hotKey.trim());

	hotKeys.forEach((hotKey) => {
		scopeInstance.addHotKey(hotKey, input);
	});

	return () => {
		hotKeys.forEach((hotKey) => {
			scopeInstance.removeHotKey(hotKey);
		});
	};
}

export function registerGlobalHotKeysFromRecord(
	hotKeysManager: IHotKeysManagerInstance,
	hotKeys: Record<string, IHotKeyInput>,
	hotKeysSeparator: string
) {
	const hotKeysPairs = Object.entries(hotKeys);
	const unRegisterHotKeys = hotKeysPairs.map(([hotKey, input]) =>
		registerGlobalHotKeys(hotKeysManager, hotKey, hotKeysSeparator, input)
	);

	return () => {
		unRegisterHotKeys.forEach((unRegisterHotKey) => unRegisterHotKey());
	};
}
