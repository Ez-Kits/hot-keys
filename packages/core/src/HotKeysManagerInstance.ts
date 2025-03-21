import { HotKeyScopeInstance } from "src/HotKeyScopeInstance";
import {
	IHotKeyScopeInstance,
	IHotKeysManagerInstance,
	IHotKeysManagerOptions,
} from "src/types";
import { debounce, normalizeKey } from "src/ultilities";

export class HotKeysManagerInstance implements IHotKeysManagerInstance {
	private scopes: Map<string, IHotKeyScopeInstance>;
	private eventAbortController: AbortController;
	private pressedKeys: string[];

	activeScope?: string;
	globalScope: IHotKeyScopeInstance;

	constructor(public options: IHotKeysManagerOptions) {
		this.activeScope = undefined;
		this.scopes = new Map();
		this.globalScope = new HotKeyScopeInstance("__PRIVATE_GLOBAL_SCOPE__");
		this.eventAbortController = new AbortController();
		this.pressedKeys = [];
	}

	updateOptions(options: Partial<IHotKeysManagerOptions>): void {
		const isElementChanged =
			options.getElement?.() !== this.options.getElement?.();

		this.options = {
			...this.options,
			...options,
		};

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
		} else {
			document.addEventListener("keydown", this.handleKeyDown, {
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

	private resetKeyboardEventState() {
		this.pressedKeys = [];
	}

	private resetKeyboardEventStateDebounce = debounce(
		() => this.resetKeyboardEventState(),
		1000
	);

	private handleKeyDown = (e: KeyboardEvent): void => {
		if (e.repeat || e.defaultPrevented) {
			return;
		}

		const activeScope = this.getActiveScope();
		this.resetKeyboardEventStateDebounce();

		const lastKey = this.pressedKeys[this.pressedKeys.length - 1];
		const normalizedKey = normalizeKey(e.key);
		if (lastKey !== normalizedKey) {
			this.pressedKeys.push(normalizedKey);
		}

		const hotKey = this.pressedKeys.join("+");

		const node = activeScope.searchNodeByHotKey(hotKey);

		if (node) {
			if (node.handler) {
				if (this.options.stopPropagation) {
					e.stopPropagation();
				}
				if (this.options.preventDefault) {
					e.preventDefault();
				}

				node.handler(hotKey, e);
				this.resetKeyboardEventState();
				return;
			}
		}

		// If the active scope is not the global scope, check if the hotkey is registered in the global scope
		if (activeScope !== this.globalScope) {
			const globalScopeNode = this.globalScope.searchNodeByHotKey(hotKey);
			if (globalScopeNode) {
				if (globalScopeNode.handler) {
					if (this.options.stopPropagation) {
						e.stopPropagation();
					}
					if (this.options.preventDefault) {
						e.preventDefault();
					}

					globalScopeNode.handler(hotKey, e);
					this.resetKeyboardEventState();
					return;
				}
				return;
			}

			if (!node && !globalScopeNode) {
				this.resetKeyboardEventState();
				return;
			}
		}

		if (!node) {
			this.resetKeyboardEventState();
		}
	};
}
