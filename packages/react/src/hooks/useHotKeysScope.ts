import {
	registerHotKeysFromRecord,
	type IHotKeyInput,
} from "@ez-kits/hot-keys-core";
import { useEffect } from "react";
import { useHotKeysManagerContext } from "src/hooks";
import {
	useActivateHotKeyScope,
	type UseActivateHotKeyScopeOptions,
} from "src/hooks/useActivateHotKeyScope";

export type UseHotKeysScopeOptions = {
	hotKeys: Record<string, IHotKeyInput>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;
} & UseActivateHotKeyScopeOptions;

export function useHotKeysScope({
	scopeName,
	hotKeys,
	hotKeysSeparator = ",",
	...options
}: UseHotKeysScopeOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	useEffect(() => {
		return registerHotKeysFromRecord(
			hotKeysManager,
			scopeName,
			hotKeys,
			hotKeysSeparator
		);
	}, [hotKeysManager, scopeName, hotKeys, hotKeysSeparator]);

	useActivateHotKeyScope({
		scopeName,
		...options,
	});
}
