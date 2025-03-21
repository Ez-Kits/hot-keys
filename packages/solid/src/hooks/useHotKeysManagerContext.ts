import { useContext } from "solid-js";
import { HotKeysManagerContext } from "src/contexts/HotKeysManagerContext";

export function useHotKeysManagerContext() {
	const context = useContext(HotKeysManagerContext);
	if (!context) {
		throw new Error(
			"useHotKeysManagerContext must be used within a HotKeysManager"
		);
	}
	return context;
}
