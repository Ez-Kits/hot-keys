import { Logger } from "src/Logger";
import {
	HotKeyHandler,
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyScopeInstance,
} from "src/types";
import {
	cloneHotKeyNode,
	debounce,
	getKeyFromEvent,
	getModifierKeysFromEvent,
	isEditableElement,
	normalizeKey,
} from "src/ultilities";

export class SeparateSequencesAndCombinationDelegate
	extends Logger
	implements IHotKeyDelegate
{
	private pressedKeys: string[] = [];
	private activeScope: IHotKeyScopeInstance | undefined;
	private repeatingHotKeyInfo:
		| {
				handler: HotKeyHandler;
				hotKey: string;
		  }
		| undefined;

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
		if (e.defaultPrevented) {
			return;
		}

		if (e.repeat) {
			if (this.repeatingHotKeyInfo) {
				return this.repeatingHotKeyInfo.handler(
					this.repeatingHotKeyInfo.hotKey,
					e
				);
			}
			return;
		}

		const activeScope = this.activeScope;
		this.resetKeyboardEventStateDebounce();

		const lastKey = this.pressedKeys[this.pressedKeys.length - 1];
		const normalizedKey = normalizeKey(getKeyFromEvent(e));
		if (lastKey !== normalizedKey) {
			this.pressedKeys.push(normalizedKey);
		}

		const pressedKeysSet = new Set([
			...getModifierKeysFromEvent(e),
			...this.pressedKeys,
		]);

		const hotKey = Array.from(pressedKeysSet).sort().join("+");

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

				const retrievedHotKey = node.hotKey || hotKey;
				node.handler(retrievedHotKey, e);

				if (node.repeatable) {
					this.repeatingHotKeyInfo = {
						handler: node.handler,
						hotKey: retrievedHotKey,
					};
				}

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

					const retrievedHotKey = globalScopeNode.hotKey || hotKey;
					globalScopeNode.handler(retrievedHotKey, e);
					if (globalScopeNode.repeatable) {
						this.repeatingHotKeyInfo = {
							handler: globalScopeNode.handler,
							hotKey: retrievedHotKey,
						};
					}

					if (globalScopeNode.nodes.size === 0) {
						this.resetKeyboardEventState();
					}
				}

				return;
			}
		}
		this.repeatingHotKeyInfo = undefined;

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
	};

	handleKeyUp = (e: KeyboardEvent): void => {
		this.pressedKeys = this.pressedKeys.filter(
			(x) => x !== normalizeKey(e.key)
		);

		if (this.pressedKeys.length === 0) {
			this.repeatingHotKeyInfo = undefined;
		}
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
