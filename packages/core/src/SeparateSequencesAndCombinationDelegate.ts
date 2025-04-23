import { Logger } from "src/Logger";
import {
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyScopeInstance,
} from "src/types";
import {
	cloneHotKeyNode,
	debounce,
	getKeyFromEvent,
	isEditableElement,
	normalizeKey,
} from "src/ultilities";

export class SeparateSequencesAndCombinationDelegate
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

		const chainNode = activeScope?.searchNodeByHotKey(hotKey);
		const combinedNode = activeScope?.searchNodeByHotKeyFromRoot(hotKey);

		const node = chainNode || combinedNode;

		if (node) {
			if (
				node.enabled === false ||
				(node.ignoreInput !== false && isEditableElement(e.target))
			) {
				return this.resetKeyboardEventState();
			}

			activeScope?.setCurrentNode(node);
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

				if (node.nodes.size === 0) {
					this.resetKeyboardEventState();
				}
				return;
			}
		}

		// If the active scope is not the global scope, check if the hotkey is registered in the global scope
		if (activeScope !== this.globalScope) {
			const globalScopeChainNode = this.globalScope.searchNodeByHotKey(hotKey);
			const globalScopeCombinedNode =
				this.globalScope.searchNodeByHotKeyFromRoot(hotKey);

			const globalScopeNode = globalScopeChainNode || globalScopeCombinedNode;

			if (globalScopeNode) {
				if (
					globalScopeNode.enabled === false ||
					(globalScopeNode.ignoreInput !== false && isEditableElement(e.target))
				) {
					return this.resetKeyboardEventState();
				}

				this.globalScope.setCurrentNode(globalScopeNode);
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
					if (globalScopeNode.nodes.size === 0) {
						this.resetKeyboardEventState();
					}
				}

				return;
			}
		}

		this.debugLog("Key Down - Found No Hot Key", "red", () => {
			console.log("Hot key", hotKey);
			console.log(
				"Active Scope",
				activeScope === this.globalScope
					? "EzHotKeys Global Scope"
					: activeScope?.name
			);
			console.log("Root Node", cloneHotKeyNode(activeScope?.getRootNode()!));
			this.logKeyboardEventInfo(e);
		});
		this.resetKeyboardEventState();
	};

	handleKeyUp = (e: KeyboardEvent): void => {
		this.pressedKeys = this.pressedKeys.filter(
			(x) => x !== normalizeKey(e.key)
		);
	};

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
