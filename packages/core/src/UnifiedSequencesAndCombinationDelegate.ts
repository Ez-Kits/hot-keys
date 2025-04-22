import {
	HotKeyHandler,
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyNode,
	IHotKeyScopeInstance,
} from "src/types";
import { debounce, getKeyFromEvent, normalizeKey } from "src/ultilities";

export class UnifiedSequencesAndCombinationDelegate implements IHotKeyDelegate {
	private pressedKeys: string[] = [];
	private activeScope: IHotKeyScopeInstance | undefined;

	constructor(
		private readonly globalScope: IHotKeyScopeInstance,
		private options: IHotKeyDelegateOptions
	) {}

	changeScope(scope: IHotKeyScopeInstance): void {
		this.activeScope = scope;
	}

	updateOptions(options: Partial<IHotKeyDelegateOptions>): void {
		this.options = {
			...this.options,
			...options,
		};
	}

	private resetKeyboardEventState() {
		this.pressedKeys = [];
	}

	private resetKeyboardEventStateDebounce = debounce(
		() => this.resetKeyboardEventState(),
		1000
	);

	handleKeyDown = (e: KeyboardEvent): void => {
		if (e.repeat || e.defaultPrevented) {
			return;
		}

		const activeScope = this.activeScope;
		this.resetKeyboardEventStateDebounce();

		const lastKey = this.pressedKeys[this.pressedKeys.length - 1];
		const normalizedKey = normalizeKey(getKeyFromEvent(e));
		if (lastKey !== normalizedKey) {
			this.pressedKeys.push(normalizedKey);
		}

		const hotKey = this.pressedKeys.join("+");

		const node = activeScope
			? this.searchNodeByHotKey(activeScope, hotKey)
			: undefined;

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
			const globalScopeNode = this.searchNodeByHotKey(this.globalScope, hotKey);
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
		}
	};

	private searchNodeByHotKey(
		scope: IHotKeyScopeInstance,
		hotKey: string
	): { key: string; handler: HotKeyHandler } | undefined {
		let currentNode = scope.getRootNode();

		if (!currentNode) {
			return undefined;
		}

		for (const { key, handler } of this.flattenNodes(currentNode)) {
			if (hotKey.endsWith(key)) {
				return { key, handler };
			}
		}

		return undefined;
	}

	private flattenNodes(
		node: IHotKeyNode,
		prefix = ""
	): { key: string; handler: HotKeyHandler }[] {
		const nodes: { key: string; handler: HotKeyHandler }[] = [];
		for (const [key, childNode] of node.nodes.entries()) {
			const computedKey = `${prefix}${key}`;
			if (childNode.handler) {
				nodes.push({ key: computedKey, handler: childNode.handler });
			}
			nodes.push(...this.flattenNodes(childNode, `${computedKey}+`));
		}
		return nodes;
	}

	private createHotKeyNode(
		nodes: { key: string; handler: HotKeyHandler }[]
	): IHotKeyNode {
		const node: IHotKeyNode = {
			nodes: new Map(),
		};

		for (const { key, handler } of nodes) {
			node.nodes.set(key, {
				nodes: new Map(),
				handler,
			});
		}

		return node;
	}
}
