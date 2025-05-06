import {
	SeparateSequencesAndCombinationDelegate,
	UnifiedSequencesAndCombinationDelegate,
} from "src/delegates";
import { EventListenersManager } from "src/EventListenersManager";
import { HotKeyScopeInstance } from "src/HotKeyScopeInstance";
import type {
	IHotKeyDelegate,
	IHotKeyScopeInstance,
	IHotKeysManagerEvents,
	IHotKeysManagerInstance,
	IHotKeysManagerOptions,
} from "src/types";
import { isServer } from "src/ultilities";

export class HotKeysManagerInstance
	extends EventListenersManager<IHotKeysManagerEvents>
	implements IHotKeysManagerInstance
{
	private scopes: Map<string, IHotKeyScopeInstance>;
	private eventAbortController: AbortController;
	private delegate: IHotKeyDelegate;
	private enabled = true;

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	constructor(public options: IHotKeysManagerOptions) {
		super();
		this.activeScope = undefined;
		this.scopes = new Map();
		this.globalScope = new HotKeyScopeInstance("__PRIVATE_GLOBAL_SCOPE__");
		this.eventAbortController = new AbortController();
		this.delegate = this.getDelegate();
	}

	updateOptions(options: Partial<IHotKeysManagerOptions>): void {
		const isElementChanged =
			options.getElement?.() !== this.options.getElement?.();
		const isModeChanged = options.mode !== this.options.mode;

		this.toggleEnableBaseOnOptions({ ...this.options }, options);

		this.options = {
			...this.options,
			...options,
		};

		if (isModeChanged) {
			this.delegate = this.getDelegate();
		}
		this.delegate.updateOptions(options);

		if (isElementChanged) {
			this.unregisterListener();
			this.registerListener();
		}
	}

	registerScope(scopeName: string): IHotKeyScopeInstance {
		if (this.scopes.has(scopeName)) {
			return this.scopes.get(scopeName)!;
		}

		const scope = new HotKeyScopeInstance(scopeName);
		this.scopes.set(scopeName, scope);
		this.trigger("scopes:register", scope);
		scope.on("hot-keys:register", (hotKey, input, scope) => {
			this.trigger("hot-keys:register", hotKey, input, scope);
		});
		scope.on("hot-keys:unregister", (hotKey, scope) => {
			this.trigger("hot-keys:unregister", hotKey, scope);
		});
		return scope;
	}

	unregisterScopeIfNeed(scopeName: string): void {
		if (this.scopes.has(scopeName)) {
			const scope = this.scopes.get(scopeName)!;
			if (scope.isEmptyHotKey()) {
				this.scopes.delete(scopeName);
				this.trigger("scopes:unregister", scope);
			}
		}
	}

	activateScope(scopeName: string): void {
		this.activeScope = scopeName;
		this.trigger("scopes:activate", this.getActiveScope());
	}

	deactivateScope(): void {
		this.trigger("scopes:deactivate", this.getActiveScope());
		this.activeScope = undefined;
	}

	getActiveScope(): IHotKeyScopeInstance {
		if (this.activeScope) {
			return this.scopes.get(this.activeScope)!;
		}

		return this.globalScope;
	}

	disable(): void {
		this.enabled = false;
		this.trigger("disabled");
	}

	enable(): void {
		this.enabled = true;
		this.trigger("enabled");
	}

	private toggleEnableBaseOnOptions(
		oldOptions: IHotKeysManagerOptions,
		newOptions: Partial<IHotKeysManagerOptions>
	): void {
		if (oldOptions.enabled === newOptions.enabled) {
			return;
		}

		if (newOptions.enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	registerListener(): void {
		if (isServer()) {
			return;
		}

		this.eventAbortController = new AbortController();
		const element = this.options.getElement?.();

		if (element instanceof HTMLElement) {
			element.addEventListener("keydown", this.handleKeyDown, {
				capture: true,
				signal: this.eventAbortController.signal,
			});
			element.addEventListener("keyup", this.handleKeyUp, {
				capture: true,
				signal: this.eventAbortController.signal,
			});
		} else {
			document.addEventListener("keydown", this.handleKeyDown, {
				capture: true,
				signal: this.eventAbortController.signal,
			});
			document.addEventListener("keyup", this.handleKeyUp, {
				capture: true,
				signal: this.eventAbortController.signal,
			});
		}
	}

	unregisterListener(): void {
		this.eventAbortController.abort();
	}

	mount(): () => void {
		this.registerListener();

		return () => {
			this.unmount();
		};
	}

	unmount(): void {
		this.deactivateScope();
		this.unregisterListener();
	}

	private getDelegate(): IHotKeyDelegate {
		const mode = this.options.mode || "separate";
		let delegate: IHotKeyDelegate;
		if (mode === "separate") {
			delegate = new SeparateSequencesAndCombinationDelegate(
				this.globalScope,
				this.options
			);
		} else {
			delegate = new UnifiedSequencesAndCombinationDelegate(
				this.globalScope,
				this.options
			);
		}

		delegate.on("hot-keys:trigger", (hotKeyInfo, event) => {
			this.trigger("hot-keys:trigger", hotKeyInfo, event);
		});

		delegate.on("hot-keys:trigger-error", (hotKeyInfo, event, reason) => {
			this.trigger("hot-keys:trigger-error", hotKeyInfo, event, reason);
		});

		return delegate;
	}

	handleKeyDown = (e: KeyboardEvent): void => {
		if (this.enabled === false) {
			return;
		}

		this.delegate.changeScope(this.getActiveScope());
		this.delegate.handleKeyDown(e);
	};

	handleKeyUp = (e: KeyboardEvent): void => {
		if (this.enabled === false) {
			return;
		}

		this.delegate.changeScope(this.getActiveScope());
		this.delegate.handleKeyUp?.(e);
	};
}
