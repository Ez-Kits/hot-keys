import {
	registerGlobalHotKeysFromRecord,
	type HotKeyHandler,
} from "@ez-kits/hot-keys-core";
import { createEffect, onCleanup } from "solid-js";
import { useHotKeysManagerContext } from "src/hooks";
import type { MaybeAccessor } from "src/types";
import { getValueFromAccessor } from "src/utilities";

export interface UseGlobalHotKeysOptions {
	hotKeys: MaybeAccessor<Record<string, HotKeyHandler>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeAccessor<string>;
}

export function useGlobalHotKeys(options: UseGlobalHotKeysOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	createEffect(() => {
		const unregister = registerGlobalHotKeysFromRecord(
			hotKeysManager,
			getValueFromAccessor(options.hotKeys),
			getValueFromAccessor(options.hotKeysSeparator) || ","
		);

		onCleanup(() => {
			unregister();
		});
	});
}
