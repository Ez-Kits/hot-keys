import { HotKeyScopeInstance } from "src/HotKeyScopeInstance";
import { SeparateSequencesAndCombinationDelegate } from "src/SeparateSequencesAndCombinationDelegate";
import {
	IHotKeyDelegate,
	IHotKeyScopeInstance,
	IHotKeysManagerInstance,
	IHotKeysManagerOptions,
} from "src/types";
import { UnifiedSequencesAndCombinationDelegate } from "src/UnifiedSequencesAndCombinationDelegate";

export class HotKeysManagerInstance implements IHotKeysManagerInstance {
	private scopes: Map<string, IHotKeyScopeInstance>;
	private eventAbortController: AbortController;
	private delegate: IHotKeyDelegate;

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	constructor(public options: IHotKeysManagerOptions) {
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

		this.options = {
			...this.options,
			...options,
		};

		if (isModeChanged) {
			this.delegate = this.getDelegate();
		}

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
		return scope;
	}

	unregisterScopeIfNeed(scopeName: string): void {
		if (this.scopes.has(scopeName)) {
			const scope = this.scopes.get(scopeName)!;
			if (scope.isEmptyHotKey()) {
				this.scopes.delete(scopeName);
			}
		}
	}

	activateScope(scopeName: string): void {
		this.activeScope = scopeName;
	}

	deactivateScope(): void {
		this.activeScope = undefined;
	}

	getActiveScope(): IHotKeyScopeInstance {
		if (this.activeScope) {
			return this.scopes.get(this.activeScope)!;
		}

		return this.globalScope;
	}

	registerListener(): void {
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
		if (mode === "separate") {
			return new SeparateSequencesAndCombinationDelegate(
				this.globalScope,
				this.options
			);
		}

		return new UnifiedSequencesAndCombinationDelegate(
			this.globalScope,
			this.options
		);
	}

	handleKeyDown = (e: KeyboardEvent): void => {
		this.delegate.changeScope(this.getActiveScope());
		this.delegate.handleKeyDown(e);
	};

	handleKeyUp = (e: KeyboardEvent): void => {
		this.delegate.changeScope(this.getActiveScope());
		this.delegate.handleKeyUp?.(e);
	};
}
