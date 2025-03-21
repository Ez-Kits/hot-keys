import type { MaybeRef } from "vue";

type ExcludeFunction<T> = T extends (...args: any[]) => any ? never : T;

export type ToMaybeRefObject<T> = {
	[K in keyof T as undefined extends T[K]
		? K
		: never]?: T[K] extends ExcludeFunction<T[K]> ? MaybeRef<T[K]> : T[K];
} & {
	[K in keyof T as undefined extends T[K]
		? never
		: K]: T[K] extends ExcludeFunction<T[K]> ? MaybeRef<T[K]> : T[K];
};
