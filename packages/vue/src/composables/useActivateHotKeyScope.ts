import {
	HotKeyScopeActivator,
	type IHotKeyScopeActivatorOptions,
} from "@ez-kits/hot-keys-core";
import { useInjectHotKeysManager } from "src/provides";
import type { ToMaybeRefObject } from "src/types";
import { onMounted, onUnmounted, toValue, watchEffect } from "vue";

export interface UseActivateHotKeyScopeOptions
	extends ToMaybeRefObject<IHotKeyScopeActivatorOptions> {}

export function useActivateHotKeyScope({
	scopeName,
	triggers,
	autoFocus,
	getActivatorElement,
}: UseActivateHotKeyScopeOptions) {
	const hotKeysManager = useInjectHotKeysManager();
	const scopeActivator = new HotKeyScopeActivator(hotKeysManager, {
		scopeName: toValue(scopeName),
		triggers: toValue(triggers),
		autoFocus: toValue(autoFocus),
		getActivatorElement,
	});

	watchEffect(() => {
		scopeActivator.updateOptions({
			scopeName: toValue(scopeName),
			triggers: toValue(triggers),
			autoFocus: toValue(autoFocus),
			getActivatorElement,
		});
	});

	onMounted(() => {
		scopeActivator.mount();
	});

	onUnmounted(() => {
		scopeActivator.unmount();
	});
}
