import {
	registerHotKeysFromRecord,
	type IHotKeyInput,
} from "@ez-kits/hot-keys-core";
import { createEffect, onCleanup } from "solid-js";
import { useHotKeysManagerContext } from "src/hooks";
import type { MaybeAccessor } from "src/types";
import { getValueFromAccessor } from "src/utilities";

export interface UseHotKeysOptions {
	hotKeys: MaybeAccessor<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeAccessor<string>;
	scopeName: MaybeAccessor<string>;
}

export function useHotKeys(options: UseHotKeysOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	createEffect(() => {
		const unregister = registerHotKeysFromRecord(
			hotKeysManager,
			getValueFromAccessor(options.scopeName),
			getValueFromAccessor(options.hotKeys),
			getValueFromAccessor(options.hotKeysSeparator) || ","
		);

		onCleanup(() => {
			unregister();
		});
	});
}
