import { hotKeysPlugin } from "@ez-kits/hot-keys-vue";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App)
	.use(
		hotKeysPlugin({
			debug: true,
		})
	)
	.mount("#app");
