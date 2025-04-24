import { normalizeHotKey } from "src/ultilities";
import {
	IHotKeyInput,
	IHotKeyNode,
	IHotKeyScope,
	IHotKeyScopeInstance,
} from "./types";

export class HotKeyScopeInstance implements IHotKeyScopeInstance {
	name: string;
	private scope: IHotKeyScope;

	constructor(name: string) {
		this.name = name;

		const rootNode = { nodes: new Map() };
		this.scope = {
			root: rootNode,
			currentNode: rootNode,
		};
	}

	getRootNode(): IHotKeyNode {
		return this.scope.root;
	}

	setCurrentNode(node: IHotKeyNode): void {
		this.scope.currentNode = node;
	}

	getCurrentNode(): IHotKeyNode {
		return this.scope.currentNode;
	}

	resetCurrentNode(): void {
		this.scope.currentNode = this.scope.root;
	}

	addHotKey(hotKey: string, hotKeyInput: IHotKeyInput): void {
		const normalizedHotKey = normalizeHotKey(hotKey);
		let node = this.scope.root;

		for (const key of normalizedHotKey) {
			if (!node.nodes.has(key)) {
				node.nodes.set(key, { nodes: new Map() });
			}

			node = node.nodes.get(key)!;
		}

		if (typeof hotKeyInput === "function") {
			node.handler = hotKeyInput;
			node.hotKey = hotKey;
		} else {
			node.hotKey = hotKey;
			node.enabled = hotKeyInput.enabled;
			node.ignoreInput = hotKeyInput.ignoreInput;
			node.handler = hotKeyInput.handler;
			node.repeatable = hotKeyInput.repeatable;
		}
	}

	removeHotKey(hotKey: string): void {
		const normalizedHotKey = normalizeHotKey(hotKey);

		let workingNode: IHotKeyNode = this.scope.root;
		const chain: IHotKeyNode[] = [];

		for (const hotkey of normalizedHotKey) {
			const { nodes } = workingNode;
			if (!nodes) {
				return;
			}

			const childNode: IHotKeyNode | undefined = nodes.get(hotkey);
			if (!childNode) {
				return;
			}

			chain.push(workingNode);
			workingNode = childNode;
		}

		if (chain.length === 0) {
			return;
		}

		let lastNode: IHotKeyNode = chain.pop()!;

		if (
			lastNode.nodes.get(normalizedHotKey[normalizedHotKey.length - 1]!)!.nodes
				.size > 0
		) {
			return;
		}

		for (let i = normalizedHotKey.length - 1; i >= 0; i--) {
			lastNode.nodes.delete(normalizedHotKey[i]!);

			if (lastNode.nodes.size > 0) {
				return;
			}

			lastNode = chain.pop()!;
		}
	}

	searchNodeByHotKey(hotKey: string): IHotKeyNode | undefined {
		let currentNode = this.getCurrentNode();

		if (!currentNode) {
			return undefined;
		}

		const normalizedHotKey = normalizeHotKey(hotKey);

		for (const key of normalizedHotKey) {
			const node = currentNode.nodes.get(key);
			if (!node) {
				return undefined;
			}

			currentNode = node;
		}

		return currentNode;
	}

	searchNodeByHotKeyFromRoot(hotKey: string): IHotKeyNode | undefined {
		let currentNode = this.scope.root;

		const normalizedHotKey = normalizeHotKey(hotKey);

		for (const key of normalizedHotKey) {
			const node = currentNode.nodes.get(key);
			if (!node) {
				return undefined;
			}

			currentNode = node;
		}

		return currentNode;
	}

	isEmptyHotKey(): boolean {
		return this.scope.root.nodes.size === 0;
	}
}
