import {
	HotKeysManagerInstance,
	type IHotKeysManagerOptions,
} from "@ez-kits/hot-keys-core";
import { useEffect, useState } from "react";
import { HotKeysManagerContext } from "src/contexts/HotKeysManagerContext";

interface HotKeysManagerProps extends IHotKeysManagerOptions {
	children: React.ReactNode;
}

export function HotKeysManager({ children, ...options }: HotKeysManagerProps) {
	const [hotKeysManager] = useState(() => new HotKeysManagerInstance(options));
	hotKeysManager.updateOptions(options);

	useEffect(() => {
		return hotKeysManager.mount();
	}, [hotKeysManager]);

	return (
		<HotKeysManagerContext.Provider value={hotKeysManager}>
			{children}
		</HotKeysManagerContext.Provider>
	);
}
