export interface IHotKeyScope {
	currentNode: IHotKeyNode;
	root: IHotKeyNode;
}

export interface IHotKeyNode {
	nodes: Map<string, IHotKeyNode>;
	handler?: HotKeyHandler;
}

export type HotKeyHandler = (hotKey: string, event: KeyboardEvent) => void;

export interface IHotKeyScopeInstance {
	name: string;
	addHotKey(hotKey: string, callback: HotKeyHandler): void;
	removeHotKey(hotKey: string): void;
	searchNodeByHotKey(hotKey: string): IHotKeyNode | undefined;
	searchNodeByHotKeyFromRoot(hotKey: string): IHotKeyNode | undefined;
	getRootNode(): IHotKeyNode;
	isEmptyHotKey(): boolean;
	setCurrentNode(node: IHotKeyNode): void;
	getCurrentNode(): IHotKeyNode;
	resetCurrentNode(): void;
}

export interface IHotKeysManagerInstance {
	options: IHotKeysManagerOptions;
	updateOptions(options: Partial<IHotKeysManagerOptions>): void;

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	registerScope(scopeName: string): IHotKeyScopeInstance;
	unregisterScopeIfNeed(scopeName: string): void;
	activateScope(scopeName: string): void;
	deactivateScope(scopeName: string): void;
	getActiveScope(): IHotKeyScopeInstance;

	mount(): () => void;
	unmount(): void;
}

export interface IHotKeysManagerOptions extends IHotKeyDelegateOptions {
	/**
	 * Root element to listen to keyboard events.
	 * @default `document`
	 */
	getElement?: () => HTMLElement | null | undefined;

	/**
	 * The mode of the hotkeys manager.
	 * @default `separate`
	 */
	mode?: "separate" | "unified";
}

export interface IHotKeyScopeActivatorOptions {
	/**
	 * The name of the scope.
	 */
	scopeName: string;
	/**
	 * The triggers to activate the scope.
	 */
	triggers: ActivateHotKeyScopeTrigger[];
	/**
	 * If true, the scope will be activated when the element is visible.
	 * Only works with trigger "focus".
	 * @default false
	 */
	autoFocus?: boolean;
	/**
	 * The element to activate the scope.
	 */
	getActivatorElement: () => HTMLElement | null | undefined;
}

export type ActivateHotKeyScopeTrigger = "hover" | "focus";

export interface IHotKeyDelegate {
	handleKeyDown(event: KeyboardEvent): void;
	handleKeyUp?(event: KeyboardEvent): void;
	changeScope(scope: IHotKeyScopeInstance): void;
	updateOptions(options: Partial<IHotKeyDelegateOptions>): void;
}

export interface IHotKeyDelegateOptions {
	/**
	 * If true, the keyboard event will not be propagated to the element when a hotkey is triggered.
	 * @default false
	 */
	stopPropagation?: boolean;
	/**
	 * If true, the keyboard event will be prevented.
	 * @default false
	 */
	preventDefault?: boolean;
}
