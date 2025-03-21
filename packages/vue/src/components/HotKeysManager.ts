import { HotKeysManagerInstance } from "@ez-kits/hot-keys-core";
import {
	defineComponent,
	onBeforeUnmount,
	onMounted,
	watchEffect,
	type PropType,
} from "vue";

export const HotKeysManager = defineComponent({
	inheritAttrs: false,
	props: {
		getElement: {
			type: Function as PropType<() => HTMLElement | null | undefined>,
			required: false,
			default: undefined,
		},
		stopPropagation: {
			type: Boolean,
			required: false,
			default: false,
		},
		preventDefault: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	setup(props, { slots }) {
		const hotKeysManager = new HotKeysManagerInstance(props);

		watchEffect(() => {
			hotKeysManager.updateOptions(props);
		});

		onMounted(() => {
			hotKeysManager.mount();
		});

		onBeforeUnmount(() => {
			hotKeysManager.unmount();
		});

		return () => slots.default?.();
	},
});
