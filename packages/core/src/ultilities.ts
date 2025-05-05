import type { IHotKeyNode } from "src/types";

export function debounce(fn: () => void, milliseconds: number) {
	let timeoutId: NodeJS.Timeout | undefined;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(fn, milliseconds);
	};
}

export function isServer(): boolean {
	return typeof window === "undefined";
}

export function getKeyFromEvent(e: KeyboardEvent): string {
	const keyCode = e.keyCode || e.which || e.charCode;

	if (
		(keyCode && keyCode >= 65 && keyCode <= 90) ||
		(keyCode >= 97 && keyCode <= 122)
	) {
		return String.fromCharCode(keyCode).toLowerCase();
	}

	return e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase().trim();
}

export function normalizeKey(key: string): string {
	if (key.length === 1) {
		return key.toLowerCase();
	}

	const lowerCaseKey = key.toLowerCase().trim();

	switch (lowerCaseKey) {
		case "esc":
			return "escape";
		case "ctrl":
			return "control";
		case "option":
			return "alt";
		case "cmd":
		case "command":
		case "win":
		case "windows":
			return "meta";
		case "return":
			return "enter";
		case "space":
			return " ";
		default:
			return lowerCaseKey;
	}
}

export function normalizeHotKey(hotKey: string): string[] {
	return hotKey.split("_").map((x) =>
		x
			.split("+")
			.map((y) => normalizeKey(y))
			.sort()
			.join("+")
	);
}

export function getModifierKeysFromEvent(e: KeyboardEvent): string[] {
	const modifierKeys: string[] = [];

	if (e.altKey) {
		modifierKeys.push("alt");
	}

	if (e.ctrlKey) {
		modifierKeys.push("control");
	}

	if (e.metaKey) {
		modifierKeys.push("meta");
	}

	if (e.shiftKey) {
		modifierKeys.push("shift");
	}

	return modifierKeys.sort();
}

export function cloneHotKeyNode<T extends IHotKeyNode | undefined>(node: T): T {
	if (!node) {
		return undefined as T;
	}

	return {
		...node,
		nodes: new Map(
			Array.from(node.nodes.entries()).map(([key, value]) => [
				key,
				cloneHotKeyNode(value),
			])
		),
	};
}

export function isEditableElement(eventTarget: EventTarget | null): boolean {
	if (!eventTarget) {
		return false;
	}

	if (!(eventTarget instanceof HTMLElement)) {
		return false;
	}

	if (eventTarget instanceof HTMLInputElement) {
		return (
			!eventTarget.type ||
			[
				"email",
				"number",
				"password",
				"search",
				"tel",
				"text",
				"url",
				"date",
				"datetime-local",
				"month",
				"time",
				"week",
			].includes(eventTarget.type.toLowerCase())
		);
	}

	if (eventTarget instanceof HTMLTextAreaElement) {
		return true;
	}

	return eventTarget.isContentEditable;
}

export function debugLog(
	groupName: string,
	color: "red" | "green" | "blue",
	fn: () => void
) {
	let colorCode = "\u001b[0m";
	if (color === "red") {
		colorCode = "\u001b[31m";
	} else if (color === "green") {
		colorCode = "\u001b[32m";
	} else if (color === "blue") {
		colorCode = "\u001b[34m";
	}

	console.group(colorCode + "[Ez Hot Keys] " + groupName + "\u001b[0m");
	fn();
	console.groupEnd();
}
