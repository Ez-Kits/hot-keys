import type { IEventListener } from "src/types/EventListeners";
import type {
	IHotKeyInfo,
	IHotKeyScopeEvents,
	IHotKeyScopeInstance,
} from "src/types/HotKeysScope";

export interface IHotKeysManagerInstance
	extends IEventListener<IHotKeysManagerEvents> {
	options: IHotKeysManagerOptions;
	updateOptions(options: Partial<IHotKeysManagerOptions>): void;

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	registerScope(scopeName: string): IHotKeyScopeInstance;
	unregisterScopeIfNeed(scopeName: string): void;
	activateScope(scopeName: string): void;
	deactivateScope(scopeName: string): void;
	getActiveScope(): IHotKeyScopeInstance;

	disable(): void;
	enable(): void;

	mount(): () => void;
	unmount(): void;
}

export type IHotKeysManagerEvents = {
	"scopes:register": [scope: IHotKeyScopeInstance];
	"scopes:unregister": [scope: IHotKeyScopeInstance];
	"scopes:activate": [scope: IHotKeyScopeInstance];
	"scopes:deactivate": [scope: IHotKeyScopeInstance];
	enabled: [];
	disabled: [];
} & IHotKeyScopeEvents &
	IHotKeyDelegateEvents;

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

	/**
	 * If true, the hotkeys manager will be enabled. And all hotkeys will be triggered.
	 * @default true
	 */
	enabled?: boolean;
}

export interface IHotKeyDelegate extends IEventListener<IHotKeyDelegateEvents> {
	handleKeyDown(event: KeyboardEvent): void;
	handleKeyUp?(event: KeyboardEvent): void;
	changeScope(scope: IHotKeyScopeInstance): void;
	updateOptions(options: Partial<IHotKeyDelegateOptions>): void;
}

export type IHotKeyDelegateEvents = {
	"hot-keys:trigger": [
		hotKeyInfo: Required<
			Omit<IHotKeyInfo, "handler"> & {
				scopeName: string;
			}
		>,
		event: KeyboardEvent
	];
	"hot-keys:trigger-error": [
		hotKeyInfo: Required<
			Omit<IHotKeyInfo, "handler"> & {
				scopeName: string;
			}
		>,
		event: KeyboardEvent,
		reason: {
			ignoreInput: boolean;
			disabled: boolean;
			repeat: boolean;
		}
	];
};

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
	/**
	 * If true, the hotkeys manager will log debug information to the console.
	 * @default false
	 */
	debug?: boolean;
}
