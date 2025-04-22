import {
	registerHotKeysFromRecord,
	type IHotKeyInput,
} from "@ez-kits/hot-keys-core";
import { useEffect } from "react";
import { useHotKeysManagerContext } from "src/hooks";

export interface UseHotKeysOptions {
	hotKeys: Record<string, IHotKeyInput>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;
	scopeName: string;
}

export function useHotKeys(options: UseHotKeysOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	useEffect(() => {
		return registerHotKeysFromRecord(
			hotKeysManager,
			options.scopeName,
			options.hotKeys,
			options.hotKeysSeparator || ","
		);
	}, [
		hotKeysManager,
		options.hotKeys,
		options.scopeName,
		options.hotKeysSeparator,
	]);
}
