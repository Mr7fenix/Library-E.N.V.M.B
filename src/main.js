import {createApp} from 'vue';
import {createRouter, createWebHashHistory} from "vue-router"
import App from './App.vue'
import Home from "./pages/Home.vue";
import CercaLibro from "./pages/CercaLibro.vue"
import NuovoLibro from "./pages/NuovoLibro.vue"
import CaseEditrici from "./pages/CaseEditrici.vue";

const routes = [
    {path: '/', component: Home},
    {path: '/CercaLibro', component: CercaLibro},
    {path: '/NuovoLibro', component: NuovoLibro},
    {path: '/CaseEditrici', component: CaseEditrici}

]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

const app = createApp(App);

app.use(router)

app.mount('#app')