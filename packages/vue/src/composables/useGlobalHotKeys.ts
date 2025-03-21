import {
	registerGlobalHotKeysFromRecord,
	type HotKeyHandler,
} from "@ez-kits/hot-keys-core";
import { useInjectHotKeysManager } from "src/provides";
import type { MaybeRef } from "vue";
import { toValue, watchEffect } from "vue";

export interface UseGlobalHotKeysOptions {
	hotKeys: MaybeRef<Record<string, HotKeyHandler>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeRef<string>;
}

export function useGlobalHotKeys(options: UseGlobalHotKeysOptions) {
	const hotKeysManager = useInjectHotKeysManager();

	watchEffect((onCleanup) => {
		const hotKeys = toValue(options.hotKeys);

		const unregister = registerGlobalHotKeysFromRecord(
			hotKeysManager,
			hotKeys,
			toValue(options.hotKeysSeparator) || ","
		);

		onCleanup(() => {
			unregister();
		});
	});
}
