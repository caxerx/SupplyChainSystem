import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueSimpleSpinner from 'vue-simple-spinner'
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'

// Set axios to handle HTTP requests
Vue.prototype.$http = axios;

Vue.use(Vuetify, {
    theme: {
        primary: colors.grey.darken4,
        secondary: colors.red.lighten1,
        accent: colors.blue.lighten3
    }
});
Vue.use(VueRouter);
Vue.use(Vuex);

// Vue Router Routes
import Dashboard from './Dashboard.vue'
import ItemManagement from './ItemManagement.vue'
import RequestManagement from './RequestManagement.vue'
import AgreementManagement from './AgreementManagement.vue'
import UserManagement from './UserManagement.vue'
import Settings from './Settings.vue'
import About from './About.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/item',
        name: 'Item Management',
        component: ItemManagement
    },
    {
        path: '/request',
        name: 'Request Management',
        component: RequestManagement
    },
    {
        path: '/agreement',
        name: 'Agreement Management',
        component: AgreementManagement
    },
    {
        path: '/user',
        name: 'User Management',
        component: UserManagement
    },
    {
        path: '/setting',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
];
const router = new VueRouter({routes});

// Register global components
Vue.component('vue-simple-spinner', VueSimpleSpinner);

// Vuex State Management
const store = new Vuex.Store({
    state: {
        isLoggedIn: false,
        token: '', // Token of api auth
        breadcrumbs: [
            {
                text: "Dashboard",
                link: "/",
                disabled: false
            }, {
                text: "Request Management",
                link: "/request",
                disabled: false
            }, {
                text: "Create Request",
                link: "#",
                disabled: false
            }],
        // Server settings
        serverUrl: 'http://219.77.158.36:37370',
    },
    mutations: {},
    getters: {
        breadcrumbs() {
            return [{text: 'hi', disabled: false}];
        }
    }
});

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});
