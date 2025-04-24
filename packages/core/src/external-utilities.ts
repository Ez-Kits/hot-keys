import {
	IHotKeyInput,
	IHotKeyScopeInstance,
	IHotKeysManagerInstance,
} from "src/types";

export function registerHotKeysOnScope(
	hotKeyManager: IHotKeysManagerInstance,
	scopeInstance: IHotKeyScopeInstance,
	hotKeysString: string,
	hotKeysSeparator: string,
	input: IHotKeyInput,
	removeScopeIfNeed: boolean = true
) {
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
		if (removeScopeIfNeed) {
			hotKeyManager.unregisterScopeIfNeed(scopeInstance.name);
		}
	};
}

export function registerHotKeys(
	hotKeyManager: IHotKeysManagerInstance,
	scope: string,
	hotKeysString: string,
	hotKeysSeparator: string,
	input: IHotKeyInput
) {
	const scopeInstance = hotKeyManager.registerScope(scope);
	return registerHotKeysOnScope(
		hotKeyManager,
		scopeInstance,
		hotKeysString,
		hotKeysSeparator,
		input
	);
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
	return registerHotKeysOnScope(
		hotKeyManager,
		scopeInstance,
		hotKeysString,
		hotKeysSeparator,
		input,
		false
	);
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
