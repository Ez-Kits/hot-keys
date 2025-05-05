import { BaseDelegate } from "src/delegates/BaseDelegate";
import type {
	IHotKeyDelegate,
	IHotKeyDelegateOptions,
	IHotKeyInfo,
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

export class SeparateSequencesAndCombinationDelegate
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

		const chainNode = activeScope?.searchNodeByHotKey(hotKey);
		const combinedNode = activeScope?.searchNodeByHotKeyFromRoot(hotKey);

		const node = chainNode || combinedNode;

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
