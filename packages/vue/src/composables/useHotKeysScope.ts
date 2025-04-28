import {
	registerHotKeysFromRecord,
	type IHotKeyInput,
} from "@ez-kits/hot-keys-core";
import {
	useActivateHotKeyScope,
	type UseActivateHotKeyScopeOptions,
} from "src/composables/useActivateHotKeyScope";
import { useInjectHotKeysManager } from "src/provides";
import { toValue, watchEffect, type MaybeRef } from "vue";

export type UseHotKeysScopeOptions = {
	hotKeys: MaybeRef<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeRef<string>;
} & UseActivateHotKeyScopeOptions;

export function useHotKeysScope({
	scopeName,
	hotKeys,
	hotKeysSeparator,
	...activatorOptions
}: UseHotKeysScopeOptions) {
	const hotKeysManager = useInjectHotKeysManager();

	watchEffect((onCleanup) => {
		const unRegisterHotKeys = registerHotKeysFromRecord(
			hotKeysManager,
			toValue(scopeName),
			toValue(hotKeys),
			toValue(hotKeysSeparator) || ","
		);

		onCleanup(() => {
			unRegisterHotKeys();
		});
	});

	useActivateHotKeyScope({
		scopeName: toValue(scopeName),
		...activatorOptions,
	});
}
