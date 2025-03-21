import { HotKeysManagerInstance } from "@ez-kits/hot-keys-core";
import { createContext } from "react";

export const HotKeysManagerContext =
	createContext<HotKeysManagerInstance | null>(null);
