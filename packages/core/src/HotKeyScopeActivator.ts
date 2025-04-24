import { HotKeysManagerInstance } from "src/HotKeysManagerInstance";
import { IHotKeyScopeActivatorOptions } from "src/types";
import { isServer } from "src/ultilities";

export class HotKeyScopeActivator {
	private eventAbortController?: AbortController;

	constructor(
		private readonly hotKeysManager: HotKeysManagerInstance,
		private options: IHotKeyScopeActivatorOptions
	) {
		this.hotKeysManager = hotKeysManager;
	}

	updateOptions(options: Partial<IHotKeyScopeActivatorOptions>) {
		const isElementChanged =
			this.options.getActivatorElement() !== options.getActivatorElement?.();
		const isAutoFocusChanged = this.options.autoFocus !== options.autoFocus;

		this.options = {
			...this.options,
			...options,
			autoFocus: options.autoFocus ?? false,
		};

		if (isElementChanged) {
			this.removeEventListeners();
			this.addEventListeners();
		}

		if (isAutoFocusChanged || isElementChanged) {
			this.focusElement();
		}
	}

	mount() {
		this.addEventListeners();
		this.focusElement();

		// If the element is already the active element or contains the active element, activate the scope
		if (this.shouldFocusElement() && !isServer()) {
			const element = this.options.getActivatorElement();
			const activeElement = document.activeElement;
			if (element === activeElement || element?.contains(activeElement)) {
				this.hotKeysManager.activateScope(this.options.scopeName);
			}
		}

		return () => {
			this.unmount();
		};
	}

	unmount() {
		this.removeEventListeners();
	}

	private getEventAbortController() {
		if (
			!this.eventAbortController ||
			this.eventAbortController.signal.aborted
		) {
			this.eventAbortController = new AbortController();
		}

		return this.eventAbortController;
	}

	private addEventListeners() {
		if (this.options.triggers.includes("hover")) {
			this.addHoverEventListeners();
		}

		if (this.options.triggers.includes("focus")) {
			this.addFocusEventListeners();
		}
	}

	private removeEventListeners() {
		this.getEventAbortController().abort();
	}

	private addHoverEventListeners() {
		const element = this.options.getActivatorElement();
		if (!element) {
			return;
		}

		const eventAbortController = this.getEventAbortController();

		element.addEventListener(
			"mouseenter",
			(event) => {
				if (
					event.target === element ||
					(event.target instanceof Node && element.contains(event.target))
				) {
					this.hotKeysManager.activateScope(this.options.scopeName);
				}
			},
			{
				signal: eventAbortController.signal,
				capture: true,
				passive: true,
			}
		);
		element.addEventListener(
			"mouseleave",
			(event) => {
				if (event.target === element) {
					this.hotKeysManager.deactivateScope();
				}
			},
			{
				signal: eventAbortController.signal,
				capture: true,
				passive: true,
			}
		);
	}

	private addFocusEventListeners() {
		const element = this.options.getActivatorElement();
		if (!element) {
			return;
		}

		const eventAbortController = this.getEventAbortController();

		element.addEventListener(
			"focusin",
			(event) => {
				if (
					event.target === element ||
					(event.target instanceof Node && element.contains(event.target))
				) {
					this.hotKeysManager.activateScope(this.options.scopeName);
				}
			},
			{
				signal: eventAbortController.signal,
				capture: true,
				passive: true,
			}
		);

		element.addEventListener(
			"focusout",
			(event) => {
				if (event.target === element) {
					this.hotKeysManager.deactivateScope();
				}
			},
			{
				signal: eventAbortController.signal,
				capture: true,
				passive: true,
			}
		);
	}

	private focusElement() {
		const element = this.options.getActivatorElement();
		if (!this.shouldFocusElement() || !element) {
			return;
		}

		element.focus();
	}

	private shouldFocusElement() {
		return (
			this.options.getActivatorElement() &&
			this.options.autoFocus &&
			this.options.triggers.includes("focus")
		);
	}
}
