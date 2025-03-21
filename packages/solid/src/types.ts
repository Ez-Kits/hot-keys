import type { Accessor } from "solid-js";

export type MaybeAccessor<T> = T | Accessor<T>;

type ExcludeFunction<T> = T extends (...args: any[]) => any ? never : T;

export type ToMaybeAccessorObject<T> = {
	[K in keyof T as undefined extends T[K]
		? K
		: never]?: T[K] extends ExcludeFunction<T[K]> ? MaybeAccessor<T[K]> : T[K];
} & {
	[K in keyof T as undefined extends T[K]
		? never
		: K]: T[K] extends ExcludeFunction<T[K]> ? MaybeAccessor<T[K]> : T[K];
};
