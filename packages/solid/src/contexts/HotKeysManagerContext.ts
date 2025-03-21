import { HotKeysManagerInstance } from "@ez-kits/hot-keys-core";
import { createContext } from "solid-js";

export const HotKeysManagerContext =
	createContext<HotKeysManagerInstance | null>(null);
