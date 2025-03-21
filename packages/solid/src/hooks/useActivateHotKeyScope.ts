import {
	HotKeyScopeActivator,
	type IHotKeyScopeActivatorOptions,
} from "@ez-kits/hot-keys-core";
import { createEffect, onCleanup } from "solid-js";
import { useHotKeysManagerContext } from "src/hooks/useHotKeysManagerContext";
import type { ToMaybeAccessorObject } from "src/types";
import { getValueFromAccessor } from "src/utilities";

export interface UseActivateHotKeyScopeOptions
	extends ToMaybeAccessorObject<IHotKeyScopeActivatorOptions> {}

export function useActivateHotKeyScope({
	scopeName,
	triggers,
	autoFocus,
	getActivatorElement,
}: UseActivateHotKeyScopeOptions) {
	const hotKeysManager = useHotKeysManagerContext();
	const scopeActivator = new HotKeyScopeActivator(hotKeysManager, {
		scopeName: getValueFromAccessor(scopeName),
		triggers: getValueFromAccessor(triggers),
		autoFocus: getValueFromAccessor(autoFocus),
		getActivatorElement: getActivatorElement,
	});

	createEffect(() => {
		scopeActivator.updateOptions({
			scopeName: getValueFromAccessor(scopeName),
			triggers: getValueFromAccessor(triggers),
			autoFocus: getValueFromAccessor(autoFocus),
			getActivatorElement: getActivatorElement,
		});
	});

	createEffect(() => {
		scopeActivator.mount();

		onCleanup(() => {
			scopeActivator.unmount();
		});
	});
}
