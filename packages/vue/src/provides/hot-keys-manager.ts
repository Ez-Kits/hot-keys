import { HotKeysManagerInstance } from "@ez-kits/hot-keys-core";
import { inject, provide, type InjectionKey } from "vue";

export const hotKeysManagerInjectionKey = Symbol(
	"hotKeysManager"
) as InjectionKey<HotKeysManagerInstance>;

export const useInjectHotKeysManager = () => {
	const hotKeysManager = inject(hotKeysManagerInjectionKey);

	if (!hotKeysManager) {
		throw new Error("HotKeysManager not found");
	}

	return hotKeysManager;
};

export const provideHotKeysManager = (
	hotKeysManager: HotKeysManagerInstance
) => {
	provide(hotKeysManagerInjectionKey, hotKeysManager);
};
