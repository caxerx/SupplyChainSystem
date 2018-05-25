import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueSimpleSpinner from 'vue-simple-spinner'
import axios from 'axios'

// Set axios to handle HTTP requests
Vue.prototype.$http = axios;

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(Vuex);

// Register global components
Vue.component('vue-simple-spinner', VueSimpleSpinner);

// Vuex State Management
const store = new Vuex.Store({
    state: {
        token: '', // Token of api auth
        breadcrumbs: [
            {
                text: "Dashboard",
                disabled: false
            }]
    },
    mutations: {}
});

// Vue Router Routes
import Dashboard from './Dashboard.vue'
import ItemManagement from './ItemManagement.vue'
import RequestManagement from './RequestManagement.vue'
import AgreementManagement from './AgreementManagement.vue'
import UserManagement from './UserManagement.vue'
import Settings from './Settings.vue'
import About from './About.vue'

const routes = [
    {path: '/', component: Dashboard},
    {path: '/item', component: ItemManagement},
    {path: '/request', component: RequestManagement},
    {path: '/agreement', component: AgreementManagement},
    {path: '/user', component: UserManagement},
    {path: '/setting', component: Settings},
    {path: '/about', component: About}
];
const router = new VueRouter({routes});

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});
