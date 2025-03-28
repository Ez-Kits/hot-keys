import {
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyScopeInstance,
} from "src/types";
import { debounce, normalizeKey } from "src/ultilities";

export class SeparateSequencesAndCombinationDelegate
	implements IHotKeyDelegate
{
	private pressedKeys: string[] = [];
	private activeScope: IHotKeyScopeInstance | undefined;

	constructor(
		private readonly globalScope: IHotKeyScopeInstance,
		private options: IHotKeyDelegateOptions
	) {}

	updateOptions(options: Partial<IHotKeyDelegateOptions>): void {
		this.options = {
			...this.options,
			...options,
		};
	}

	changeScope(scope: IHotKeyScopeInstance | undefined): void {
		this.activeScope = scope;
	}

	private resetKeyboardEventState() {
		this.pressedKeys = [];
		this.activeScope?.resetCurrentNode();
		this.globalScope.resetCurrentNode();
	}

	private resetKeyboardEventStateDebounce = debounce(
		() => this.resetKeyboardEventState(),
		1000
	);

	handleKeyDown = (e: KeyboardEvent): void => {
		if (e.repeat || e.defaultPrevented || !this.activeScope) {
			return;
		}

		const activeScope = this.activeScope;
		this.resetKeyboardEventStateDebounce();

		const lastKey = this.pressedKeys[this.pressedKeys.length - 1];
		const normalizedKey = normalizeKey(e.key);
		if (lastKey !== normalizedKey) {
			this.pressedKeys.push(normalizedKey);
		}

		const hotKey = this.pressedKeys.join("+");

		const chainNode = activeScope.searchNodeByHotKey(hotKey);
		const combinedNode = activeScope.searchNodeByHotKeyFromRoot(hotKey);
		const node = chainNode || combinedNode;

		if (node) {
			if (node.handler) {
				if (this.options.stopPropagation) {
					e.stopPropagation();
				}
				if (this.options.preventDefault) {
					e.preventDefault();
				}

				node.handler(hotKey, e);
				if (node.nodes.size === 0) {
					this.resetKeyboardEventState();
				}
				return;
			}

			activeScope.setCurrentNode(node);
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
					if (globalScopeNode.nodes.size === 0) {
						this.resetKeyboardEventState();
					}
					return;
				} else {
					this.globalScope.setCurrentNode(globalScopeNode);
				}
				return;
			}
		}
	};

	handleKeyUp = (e: KeyboardEvent): void => {
		this.pressedKeys = this.pressedKeys.filter(
			(x) => x !== normalizeKey(e.key)
		);
	};
}
