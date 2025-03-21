import {
	HotKeysManagerInstance,
	type IHotKeysManagerOptions,
} from "@ez-kits/hot-keys-core";
import { hotKeysManagerInjectionKey } from "src/provides";
import type { Plugin } from "vue";

export const hotKeysPlugin: (options?: IHotKeysManagerOptions) => Plugin<[]> = (
	options
) => {
	return {
		install(app) {
			const hotKeysManager = new HotKeysManagerInstance(options ?? {});
			hotKeysManager.mount();
			app.provide(hotKeysManagerInjectionKey, hotKeysManager);
			app.onUnmount(() => {
				hotKeysManager.unmount();
			});
		},
	};
};
