import {
	HotKeysManagerInstance,
	type IHotKeysManagerOptions,
} from "@ez-kits/hot-keys-core";
import { createEffect, onCleanup, splitProps, type JSX } from "solid-js";
import { HotKeysManagerContext } from "src/contexts/HotKeysManagerContext";

interface HotKeysManagerProps extends IHotKeysManagerOptions {
	children: JSX.Element;
}

export function HotKeysManager(props: HotKeysManagerProps) {
	const [, otherProps] = splitProps(props, ["children"]);
	const hotKeysManager = new HotKeysManagerInstance(otherProps);

	hotKeysManager.updateOptions(otherProps);

	createEffect(() => {
		hotKeysManager.updateOptions(otherProps);
	});

	createEffect(() => {
		hotKeysManager.mount();

		onCleanup(() => {
			hotKeysManager.unmount();
		});
	});

	return (
		<HotKeysManagerContext.Provider value={hotKeysManager}>
			{props.children}
		</HotKeysManagerContext.Provider>
	);
}
