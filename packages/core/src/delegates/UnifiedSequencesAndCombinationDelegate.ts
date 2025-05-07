import { BaseDelegate } from "src/delegates/BaseDelegate";
import type {
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyInfo,
	IHotKeyNode,
	IHotKeyScopeInstance,
	WithRequired,
} from "src/types";
import {
	cloneHotKeyNode,
	debounce,
	getKeyFromEvent,
	getModifierKeysFromEvent,
	isEditableElement,
	normalizeKey,
} from "src/ultilities";

interface IFlattenNode extends IHotKeyInfo {
	computedHotKey: string;
}

export class UnifiedSequencesAndCombinationDelegate
	extends BaseDelegate
	implements IHotKeyDelegate
{
	private pressedKeys: string[] = [];
	private activeScope: IHotKeyScopeInstance | undefined;
	private repeatingHotKeyInfo:
		| (WithRequired<IHotKeyInfo, "handler" | "hotKey"> & {
				scopeName: string;
		  })
		| undefined;

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
		if (e.defaultPrevented) {
			return;
		}

		if (e.repeat) {
			if (!this.repeatingHotKeyInfo) {
				return;
			}

			if (this.repeatingHotKeyInfo.repeatable) {
				this.repeatingHotKeyInfo.handler(this.repeatingHotKeyInfo.hotKey, e);
				this.trigger(
					"hot-keys:trigger",
					{
						hotKey: this.repeatingHotKeyInfo.hotKey,
						ignoreInput: this.repeatingHotKeyInfo.ignoreInput ?? true,
						enabled: this.repeatingHotKeyInfo.enabled ?? true,
						repeatable: this.repeatingHotKeyInfo.repeatable ?? false,
						scopeName: this.repeatingHotKeyInfo.scopeName,
					},
					e
				);
				return;
			}

			this.trigger(
				"hot-keys:trigger-error",
				{
					hotKey: this.repeatingHotKeyInfo.hotKey,
					ignoreInput: this.repeatingHotKeyInfo.ignoreInput ?? true,
					enabled: this.repeatingHotKeyInfo.enabled ?? true,
					repeatable: this.repeatingHotKeyInfo.repeatable ?? false,
					scopeName: this.repeatingHotKeyInfo.scopeName,
				},
				e,
				{
					ignoreInput: false,
					disabled: false,
					repeat: true,
				}
			);

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

		const node = activeScope
			? this.searchNodeByHotKey(activeScope, hotKey)
			: undefined;

		if (node) {
			const mergedHotKey = node.hotKey || hotKey;
			const isIgnoreInput =
				node.ignoreInput !== false && isEditableElement(e.target);
			const isDisabled = node.enabled === false;
			if (isDisabled || isIgnoreInput) {
				this.trigger(
					"hot-keys:trigger-error",
					{
						hotKey: mergedHotKey,
						ignoreInput: node.ignoreInput ?? true,
						enabled: node.enabled ?? true,
						repeatable: node.repeatable ?? false,
						scopeName:
							(activeScope === this.globalScope
								? "EzHotKeys Global Scope"
								: activeScope?.name) ?? "Unknown Scope",
					},
					e,
					{
						ignoreInput: isIgnoreInput,
						disabled: isDisabled,
						repeat: e.repeat,
					}
				);
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

				this.trigger(
					"hot-keys:trigger",
					{
						hotKey: mergedHotKey,
						ignoreInput: node.ignoreInput ?? true,
						enabled: node.enabled ?? true,
						repeatable: node.repeatable ?? false,
						scopeName:
							(activeScope === this.globalScope
								? "EzHotKeys Global Scope"
								: activeScope?.name) ?? "Unknown Scope",
					},
					e
				);
				node.handler(mergedHotKey, e);
				this.repeatingHotKeyInfo = {
					handler: node.handler,
					hotKey: mergedHotKey,
					repeatable: node.repeatable,
					ignoreInput: node.ignoreInput ?? true,
					enabled: node.enabled ?? true,
					scopeName:
						(activeScope === this.globalScope
							? "EzHotKeys Global Scope"
							: activeScope?.name) ?? "Unknown Scope",
				};

				this.resetKeyboardEventState();
				return;
			}
		}

		// If the active scope is not the global scope, check if the hotkey is registered in the global scope
		if (activeScope !== this.globalScope) {
			const globalScopeNode = this.searchNodeByHotKey(this.globalScope, hotKey);
			if (globalScopeNode) {
				const mergedHotKey = globalScopeNode.hotKey || hotKey;
				const isIgnoreInput =
					globalScopeNode.ignoreInput !== false && isEditableElement(e.target);
				const isDisabled = globalScopeNode.enabled === false;
				if (isDisabled || isIgnoreInput) {
					this.trigger(
						"hot-keys:trigger-error",
						{
							hotKey: mergedHotKey,
							ignoreInput: globalScopeNode.ignoreInput ?? true,
							enabled: globalScopeNode.enabled ?? true,
							repeatable: globalScopeNode.repeatable ?? false,
							scopeName: "EzHotKeys Global Scope",
						},
						e,
						{
							ignoreInput: isIgnoreInput,
							disabled: isDisabled,
							repeat: e.repeat,
						}
					);
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

					this.trigger(
						"hot-keys:trigger",
						{
							hotKey: mergedHotKey,
							ignoreInput: globalScopeNode.ignoreInput ?? true,
							enabled: globalScopeNode.enabled ?? true,
							repeatable: globalScopeNode.repeatable ?? false,
							scopeName: "EzHotKeys Global Scope",
						},
						e
					);
					globalScopeNode.handler(mergedHotKey, e);
					this.repeatingHotKeyInfo = {
						handler: globalScopeNode.handler,
						hotKey: mergedHotKey,
						repeatable: globalScopeNode.repeatable ?? false,
						ignoreInput: globalScopeNode.ignoreInput ?? true,
						enabled: globalScopeNode.enabled ?? true,
						scopeName: "EzHotKeys Global Scope",
					};
					this.resetKeyboardEventState();
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

	private flattenNodes(
		node: IHotKeyNode,
		prefix: string[] = []
	): IFlattenNode[] {
		const nodes: IFlattenNode[] = [];
		for (const [key, childNode] of node.nodes.entries()) {
			const computedKey = [...prefix, key].sort().join("+");
			if (childNode.handler) {
				nodes.push({ ...childNode, computedHotKey: computedKey });
			}
			nodes.push(...this.flattenNodes(childNode, [...prefix, key]));
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
