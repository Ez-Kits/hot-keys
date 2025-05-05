import type { IEventListener, Listener, Listeners } from "src/types";

export class EventListenersManager<ListEvents extends { [key: string]: any[] }>
	implements IEventListener<ListEvents>
{
	private listeners: Listeners<ListEvents>;
	private eventTriggerIds: Record<string, number> = {};

	constructor() {
		this.listeners = {} as Listeners<ListEvents>;
	}

	protected trigger = <K extends keyof ListEvents>(
		event: K,
		...params: ListEvents[K]
	) => {
		this.eventTriggerIds[event as string] = this.eventTriggerIds[
			event as string
		]
			? this.eventTriggerIds[event as string]! + 1
			: 0;
		const triggerId = this.eventTriggerIds[event as string];

		const listeners = this.listeners[event];
		listeners?.forEach((listener) => {
			if (this.eventTriggerIds[event as string] !== triggerId) {
				return;
			}
			listener(...params);
		});
	};

	on = <K extends keyof ListEvents>(
		event: K,
		listener: Listener<ListEvents[K]>
	) => {
		const listeners = this.listeners[event];

		if (listeners) {
			!listeners.has(listener) && listeners?.add(listener);
		} else {
			this.listeners[event] = new Set([listener]);
		}

		return () => {
			this.off(event, listener);
		};
	};

	off = <K extends keyof ListEvents>(
		event: K,
		listener: Listener<ListEvents[K]>
	) => {
		const listeners = this.listeners[event];

		if (listeners) {
			listeners.delete(listener);
		} else {
			throw new Error(`${this} is doesn't have event "${String(event)}"`);
		}
	};

	offAll = <K extends keyof ListEvents>(event: K) => {
		this.listeners[event] = new Set();
	};
}
