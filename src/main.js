import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import * as api from "./api";
import mixins from "./utils/mixins";

export function createApp() {
	const app = createSSRApp(App);
	
	// 注册全局API
	app.config.globalProperties.$api = api;
	
	// 使用mixins
	app.use(mixins);
	
	return {
		app,
	};
}
