import {
	registerGlobalHotKeysFromRecord,
	type HotKeyHandler,
} from "@ez-kits/hot-keys-core";
import { useEffect } from "react";
import { useHotKeysManagerContext } from "src/hooks";

export interface UseGlobalHotKeysOptions {
	hotKeys: Record<string, HotKeyHandler>;
	/**
	 * The separator of the hotkeys
	 * @default ","
	 */
	hotKeysSeparator?: string;
}

export function useGlobalHotKeys({
	hotKeys,
	hotKeysSeparator = ",",
}: UseGlobalHotKeysOptions) {
	const hotKeysManager = useHotKeysManagerContext();

	useEffect(() => {
		return registerGlobalHotKeysFromRecord(
			hotKeysManager,
			hotKeys,
			hotKeysSeparator
		);
	}, [hotKeysManager, hotKeys, hotKeysSeparator]);
}
