import {
	HotKeyScopeActivator,
	type IHotKeyScopeActivatorOptions,
} from "@ez-kits/hot-keys-core";
import { useEffect, useMemo } from "react";
import { useHotKeysManagerContext } from "src/hooks";

export interface UseActivateHotKeyScopeOptions
	extends IHotKeyScopeActivatorOptions {}

export function useActivateHotKeyScope(options: UseActivateHotKeyScopeOptions) {
	const hotKeysManager = useHotKeysManagerContext();
	const scopeActivator = useMemo(() => {
		return new HotKeyScopeActivator(hotKeysManager, options);
	}, [hotKeysManager]);

	scopeActivator.updateOptions(options);

	useEffect(() => {
		return scopeActivator.mount();
	}, [scopeActivator]);
}
