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
import UserManagement from './UserManagement.vue'
import Dashboard from './Dashboard.vue'

const routes = [
    {path: '/users', component: UserManagement},
    {path: '/dashboard', component: Dashboard}
];
const router = new VueRouter({routes});

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});
