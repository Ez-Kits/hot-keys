import { Logger } from "src/Logger";
import {
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyInfo,
	IHotKeyNode,
	IHotKeyScopeInstance,
} from "src/types";
import {
	cloneHotKeyNode,
	debounce,
	getKeyFromEvent,
	isEditableElement,
	normalizeKey,
} from "src/ultilities";

interface IFlattenNode extends IHotKeyInfo {
	computedHotKey: string;
}

export class UnifiedSequencesAndCombinationDelegate
	extends Logger
	implements IHotKeyDelegate
{
	private pressedKeys: string[] = [];
	private activeScope: IHotKeyScopeInstance | undefined;

	constructor(
		private readonly globalScope: IHotKeyScopeInstance,
		protected options: IHotKeyDelegateOptions
	) {
		super(options);
	}

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
			if (
				node.enabled === false ||
				(node.ignoreInput !== false && isEditableElement(e.target))
			) {
				return this.resetKeyboardEventState();
			}

			if (node.handler) {
				this.debugLog("Key Down - Found Hot Key", "green", () => {
					console.log("Hot key", hotKey);
					console.log(
						"Active Scope",
						activeScope === this.globalScope
							? "EzHotKeys Global Scope"
							: activeScope?.name
					);
					console.log(
						"Root Node",
						cloneHotKeyNode(activeScope?.getRootNode()!)
					);
					console.log("Node", node);
					this.logKeyboardEventInfo(e);
				});

				if (this.options.stopPropagation) {
					e.stopPropagation();
				}
				if (this.options.preventDefault) {
					e.preventDefault();
				}

				node.handler(node.hotKey || hotKey, e);
				this.resetKeyboardEventState();
				return;
			}
		}

		// If the active scope is not the global scope, check if the hotkey is registered in the global scope
		if (activeScope !== this.globalScope) {
			const globalScopeNode = this.searchNodeByHotKey(this.globalScope, hotKey);
			if (globalScopeNode) {
				if (
					globalScopeNode.enabled === false ||
					(globalScopeNode.ignoreInput !== false && isEditableElement(e.target))
				) {
					return this.resetKeyboardEventState();
				}

				if (globalScopeNode.handler) {
					this.debugLog("Key Down - Found Global Hot Key", "green", () => {
						console.log("Hot key", hotKey);
						console.log(
							"Active Scope",
							activeScope === this.globalScope
								? "EzHotKeys Global Scope"
								: activeScope?.name
						);
						console.log(
							"Root Node",
							cloneHotKeyNode(this.globalScope.getRootNode())
						);
						console.log("Node", globalScopeNode);
						this.logKeyboardEventInfo(e);
					});

					if (this.options.stopPropagation) {
						e.stopPropagation();
					}
					if (this.options.preventDefault) {
						e.preventDefault();
					}

					globalScopeNode.handler(globalScopeNode.hotKey || hotKey, e);
					this.resetKeyboardEventState();
				}
				return;
			}
		}

		this.debugLog("Key Down - Found No Hot Key", "red", () => {
			console.log("Hot key", hotKey);
			console.log("Active Scope", activeScope?.name);
			this.logKeyboardEventInfo(e);
		});
	};

	private searchNodeByHotKey(
		scope: IHotKeyScopeInstance,
		hotKey: string
	): IFlattenNode | undefined {
		let currentNode = scope.getRootNode();

		if (!currentNode) {
			return undefined;
		}

		for (const node of this.flattenNodes(currentNode)) {
			if (hotKey.endsWith(node.computedHotKey)) {
				return node;
			}
		}

		return undefined;
	}

	private flattenNodes(node: IHotKeyNode, prefix = ""): IFlattenNode[] {
		const nodes: IFlattenNode[] = [];
		for (const [key, childNode] of node.nodes.entries()) {
			const computedKey = `${prefix}${key}`;
			if (childNode.handler) {
				nodes.push({ ...childNode, computedHotKey: computedKey });
			}
			nodes.push(...this.flattenNodes(childNode, `${computedKey}+`));
		}
		return nodes;
	}

	logKeyboardEventInfo(e: KeyboardEvent) {
		console.log("Key", e.key);
		console.log("Key code", e.keyCode || e.which || e.charCode);
		this.debugLog("Modifier keys", "blue", () => {
			console.log("Meta key", e.metaKey);
			console.log("Alt key", e.altKey);
			console.log("Shift key", e.shiftKey);
			console.log("Control key", e.ctrlKey);
		});
	}
}
