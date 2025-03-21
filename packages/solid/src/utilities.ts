import type { MaybeAccessor } from "src/types";

export function getValueFromAccessor<T>(value: MaybeAccessor<T>): T {
	if (typeof value === "function") {
		return (value as Function)();
	}

	return value;
}
