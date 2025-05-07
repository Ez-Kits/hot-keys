import { EventListenersManager } from "src/EventListenersManager";
import type { IHotKeyDelegateEvents, IHotKeyDelegateOptions } from "src/types";
import { debugLog } from "src/ultilities";

export class BaseDelegate extends EventListenersManager<IHotKeyDelegateEvents> {
	constructor(protected options: IHotKeyDelegateOptions) {
		super();
	}

	debugLog(groupName: string, color: "red" | "green" | "blue", fn: () => void) {
		if (this.options.debug) {
			debugLog(groupName, color, fn);
		}
	}
}
