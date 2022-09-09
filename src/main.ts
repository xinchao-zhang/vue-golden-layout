import type { RootItemConfig } from 'golden-layout';
import { createApp, reactive } from 'vue';
import GoldenLayout from './components/GoldenLayout.vue';
import App from './App.vue';
import App1 from './App1.vue';
import App2 from './App2.vue';
import App3 from './App3.vue';

import './assets/main.css';

const portals = reactive<{ [index: string]: HTMLElement }>({});
const config = reactive<RootItemConfig>({ type: 'row', content: [] });

createApp(App, { config: config }).provide("portals", portals).mount('#gl');
createApp(App1, { state: "app1" }).provide("portals", portals).mount('#app1');
createApp(App2, { state: "app2" }).provide("portals", portals).mount('#app2');
createApp(App3, { state: "app3" }).provide("config", config).mount('#app3');

export  {GoldenLayout, App, App1, App2, App3 };