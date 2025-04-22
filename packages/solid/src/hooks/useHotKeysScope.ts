import { registerHotKeys, type IHotKeyInput } from "@ez-kits/hot-keys-core";
import { createEffect, onCleanup } from "solid-js";
import { useHotKeysManagerContext } from "src/hooks";
import {
	useActivateHotKeyScope,
	type UseActivateHotKeyScopeOptions,
} from "src/hooks/useActivateHotKeyScope";
import type { MaybeAccessor } from "src/types";
import { getValueFromAccessor } from "src/utilities";

export type UseHotKeysScopeOptions = {
	hotKeys: MaybeAccessor<Record<string, IHotKeyInput>>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: MaybeAccessor<string>;
} & UseActivateHotKeyScopeOptions;

export function useHotKeysScope({
	scopeName,
	hotKeys,
	hotKeysSeparator,
	...activatorOptions
}: UseHotKeysScopeOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	createEffect(() => {
		const hotKeysPairs = Object.entries(getValueFromAccessor(hotKeys));
		const unRegisterHotKeys = hotKeysPairs.map(([hotKey, handler]) =>
			registerHotKeys(
				hotKeysManager,
				getValueFromAccessor(scopeName),
				hotKey,
				getValueFromAccessor(hotKeysSeparator) || ",",
				handler
			)
		);

		onCleanup(() => {
			unRegisterHotKeys.forEach((unRegisterHotKey) => unRegisterHotKey());
		});
	});

	useActivateHotKeyScope({
		scopeName: getValueFromAccessor(scopeName),
		...activatorOptions,
	});
}
