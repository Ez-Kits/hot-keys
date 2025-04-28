import {
	registerHotKeysFromRecord,
	type IHotKeyInput,
} from "@ez-kits/hot-keys-core";
import { useInjectHotKeysManager } from "src/provides";
import { toValue, watchEffect, type MaybeRef } from "vue";

export interface UseHotKeysOptions {
	hotKeys: MaybeRef<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeRef<string>;
	scopeName: MaybeRef<string>;
}

export function useHotKeys(options: UseHotKeysOptions) {
	const hotKeysManager = useInjectHotKeysManager();

	watchEffect((onCleanup) => {
		const unregister = registerHotKeysFromRecord(
			hotKeysManager,
			toValue(options.scopeName),
			toValue(options.hotKeys),
			toValue(options.hotKeysSeparator) || ","
		);

		onCleanup(() => {
			unregister();
		});
	});
}
