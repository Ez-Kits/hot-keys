import type { IEventListener } from "src/types";

export interface IHotKeyScope {
	currentNode: IHotKeyNode;
	root: IHotKeyNode;
}

export interface IHotKeyNode extends IHotKeyInfo {
	nodes: Map<string, IHotKeyNode>;
}

export interface IHotKeyInfo {
	/**
	 * The hotkey to trigger.
	 */
	hotKey?: string;
	/**
	 * If true, the hotkey will be enabled.
	 * @default true
	 */
	enabled?: boolean;
	/**
	 * If true, the hotkey will not be triggered if the input is focused.
	 * @default true
	 */
	ignoreInput?: boolean;
	/**
	 * Repeatable hotkey.
	 * @default false
	 */
	repeatable?: boolean;
	/**
	 * The handler to call when the hotkey is triggered.
	 */
	handler?: HotKeyHandler;
}

export type HotKeyHandler = (hotKey: string, event: KeyboardEvent) => void;

export type IHotKeyInput = Omit<IHotKeyInfo, "hotKey"> | HotKeyHandler;

export interface IHotKeyScopeInstance
	extends IEventListener<IHotKeyScopeEvents> {
	name: string;
	addHotKey(hotKey: string, input: IHotKeyInput): void;
	removeHotKey(hotKey: string): void;
	searchNodeByHotKey(hotKey: string): IHotKeyNode | undefined;
	searchNodeByHotKeyFromRoot(hotKey: string): IHotKeyNode | undefined;
	getRootNode(): IHotKeyNode;
	isEmptyHotKey(): boolean;
	setCurrentNode(node: IHotKeyNode): void;
	getCurrentNode(): IHotKeyNode;
	resetCurrentNode(): void;
}

export type IHotKeyScopeEvents = {
	"hot-keys:register": [
		hotKey: string,
		hotKeyInfo: Omit<IHotKeyInfo, "hotKey">,
		scope: IHotKeyScopeInstance
	];
	"hot-keys:unregister": [hotKey: string, scope: IHotKeyScopeInstance];
};
