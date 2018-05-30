import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'

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

// Vuex State Management
const store = new Vuex.Store({
    state: {
        isLoggedIn: false,
        isTokenValid: false,
        token: '', // Token of api auth
        // Server settings
        serverUrl: 'https://sapi.caxerx.com/api',
        rowPerPage: [15, 30, 60, {text: 'All', value: -1}],
        // Error Dialog
        isErrorDialogShown: false,
        errorMessage: '',
    },
    mutations: {
        setLoginState(state, payload) {
            state.isLoggedIn = payload;
        },
        setToken(state, payload) {
            state.token = payload;
        },
        setTokenValidState(state, payload) {
            state.isTokenValid = payload;
        },
        setErrorDialogState(state, payload) {
            state.isErrorDialogShown = payload;
        },
        setErrorMessage(state, payload) {
            state.errorMessage = payload;
        },
        closeErrorDialog(state) {
            state.isErrorDialogShown = false;
            setTimeout(() => state.errorMessage = '', 1000);
        }
    },
    getters: {
        breadcrumbs() {
            return [
                {
                    text: 'hi',
                    disabled: false
                },
                {
                    text: 'hello',
                    disabled: false
                }, {
                    text: 'bonjour',
                    disabled: false
                }];
        }
    }
});

// Use interceptors to do extra stuff when handling things
axios.interceptors.request.use(config => {
    // Something to do before request
    return config;
}, error => {
    // Errors at sending a request
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    if (!response.data.success) {
        store.commit('setErrorMessage', response.data.responseContent);
        store.commit('setErrorDialogState', true);
    }
    return response;
}, error => {
    // Errors from server response
    // Something to do after receiving response
    // If it returns 401(Unauthorized), the token becomes invalid
    // console.log('err');
    if (error.response) {
        if (error.response.status === 401) {
            // alert("Invalid token");
            console.log('Invalid token');
            store.commit('setTokenValidState', false);
        }
        if (error.response.status === 404) {
            console.log('404');
        }
    } else {
        console.log('Network Error');
    }
    return Promise.reject(error);
    // Make it resolve the Promise so no catch() is needed
    // Temporary disable this to remain compatibility
    // return Promise.resolve(error.response);
});
/**
 *
 * @type {{getToken(*, *=): *, get(string): *, post(string, object): *, put(string, string, object): *, delete(*, *): *}}
 */
Vue.prototype.$http = {
    getToken(loginData) {
        return axios({
            method: "post",
            url: `${store.state.serverUrl}/token`,
            headers: {
                "Content-Type": "application/json"
            },
            data: loginData
        });
    },
    get(url) {
        return axios({
            method: "get",
            url: `${store.state.serverUrl}/${url}`,
            headers: {
                Authorization: `Bearer ${store.state.token}`
            }
        });
    },
    post(url, data) {
        return axios({
            method: "post",
            url: `${store.state.serverUrl}/${url}`,
            headers: {
                Authorization: `Bearer ${store.state.token}`,
                "Content-Type": "application/json"
            },
            data: data
        });
    },
    put(url, param, data) {
        return axios({
            method: "put",
            url: `${store.state.serverUrl}/${url}/${param}`,
            headers: {
                Authorization: `Bearer ${store.state.token}`,
                "Content-Type": "application/json"
            },
            data: data
        });
    },
    delete(url, param) {
        return axios({
            method: "delete",
            url: `${store.state.serverUrl}/${url}/${param}`,
            headers: {
                Authorization: `Bearer ${store.state.token}`
            }
        });
    }
};


new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});
