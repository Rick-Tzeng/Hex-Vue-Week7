import { createApp } from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// import CKEditor from '@ckeditor/ckeditor5-vue';
import ToastMessage from '@/components/ToastMessage.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// 全域註冊元件
app.component('ToastMessage', ToastMessage);

// Plugins
app.use(VueAxios, axios);
app.use(VueLoading, { zIndex: 1500 });
// app.use(CKEditor);

app.use(router);
app.mount('#app');
