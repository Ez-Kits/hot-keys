export type Listeners<T> = {
	[P in keyof T]?: Set<
		(...param: T[P] extends Array<any> ? T[P] : any[]) => void
	>;
};

export type Listener<E> = (...param: E extends Array<any> ? E : any[]) => void;

export interface IEventListener<Events extends { [key: string]: any[] }> {
	on<K extends keyof Events>(
		event: K,
		listener: Listener<Events[K]>
	): () => void;
	on<K extends keyof Events>(
		event: K,
		listener: Listener<Events[K]>,
		options: {
			signal?: AbortSignal;
		}
	): void;
	off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void;
	offAll<K extends keyof Events>(event: K): void;
}
