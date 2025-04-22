export abstract class Logger {
	constructor(protected options: { debug?: boolean }) {}

	debugLog(groupName: string, color: "red" | "green" | "blue", fn: () => void) {
		if (this.options.debug) {
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
	}
}
