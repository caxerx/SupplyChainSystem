import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
import colors from 'vuetify/es5/util/colors'
import Vuelidate from 'vuelidate'

Vue.use(Vuetify, {
    theme: {
        primary: colors.grey.darken4,
        secondary: colors.red.lighten1,
        accent: colors.blue.darken2
    }
});
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuelidate);

// Vue Router Routes
import Dashboard from './Dashboard.vue'
import ItemManagement from './ItemManagement.vue'
import RequestManagement from './RequestManagement.vue'
import PurchaseRequestManagement from './PurchaseRequestManagement.vue'
import AgreementManagement from './AgreementManagement.vue'
import RestaurantManagement from './RestaurantManagement'
import SupplierManagement from './SupplierManagement'
import PurchaseOrderManagement from './PurchaseOrderManagement'
import LogisticManagement from './LogisticManagement'
import UserManagement from './UserManagement.vue'
import Settings from './Settings.vue'
import About from './About.vue'

// Sub routes
// Item Management
import ItemList from './ItemManagement/SupplierItemList'
import VirtualItemList from './ItemManagement/VirtualItemList'
import IdMappingList from './ItemManagement/IdMappingList'
import StockList from './ItemManagement/StockList'
import CategoryList from './ItemManagement/CategoryList'
// Restaurant Management
import RestaurantList from './RestaurantManagement/RestaurantList'
import RestaurantTypeList from './RestaurantManagement/RestaurantTypeList'
import RestaurantManagerList from './RestaurantManagement/RestaurantManagerList'

// Request Mapping
import RequestMapping from './RequestManagement/RequestMapping'

// Purchase Order Management
import BlanketPurchaseOrder from './PurchaseOrderManagement/BlanketPurchaseOrder'
import StandardPurchaseOrder from './PurchaseOrderManagement/StandardPurchaseOrder'
import ScheduledRelease from './PurchaseOrderManagement/ScheduledRelease'

// Logistic Management
import DespatchInstructionList from './LogisticManagement/DespatchInstructionList'
import DeliveryNoteList from './LogisticManagement/DeliveryNoteList'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/item',
        name: 'Item Management',
        component: ItemManagement,
        children: [
            {
                path: 'supplieritem',
                name: 'Supplier Item',
                component: ItemList
            }, {
                path: 'virtualitem',
                name: 'Virtual Item',
                component: VirtualItemList
            }, {
                path: 'idmapping',
                name: 'Item ID Mapping',
                component: IdMappingList
            }, {
                path: 'stock',
                name: 'Stock',
                component: StockList
            },
            {
                path: 'category',
                name: 'Category',
                component: CategoryList
            }
        ]
    },
    {
        path: '/request',
        name: 'Request Management',
        component: RequestManagement
    },
    {
        path: '/purchaserequest',
        name: 'Request Management',
        component: PurchaseRequestManagement
    },
    {
        path: '/requestmapping',
        name: 'Request Mapping',
        component: RequestMapping
    }
    ,
    {
        path: '/agreement',
        name: 'Agreement Management',
        component: AgreementManagement
    },
    {
        path: '/restaurant',
        name: 'Restaurant Management',
        component: RestaurantManagement,
        children: [
            {
                path: 'list',
                name: 'Restaurant List',
                component: RestaurantList
            },
            {
                path: 'type',
                name: 'Restaurant Type List',
                component: RestaurantTypeList
            }, {
                path: 'manager',
                name: 'Restaurant Manager List',
                component: RestaurantManagerList
            }
        ]
    },
    {
        path: '/supplier',
        name: 'Supplier Management',
        component: SupplierManagement
    },
    {
        path: '/user',
        name: 'User Management',
        component: UserManagement
    },
    {
        path: '/purchaseorder',
        name: 'Purchase Order Management',
        component: PurchaseOrderManagement,
        children: [
            {
                path: 'blanketpurchaseorder',
                name: 'Blanket Purchase Order',
                component: BlanketPurchaseOrder
            },
            {
                path: 'standardpurchaseorder',
                name: 'Standard Purchase Order',
                component: StandardPurchaseOrder
            },
            {
                path: 'scheduledrelease',
                name: 'Scheduled Release',
                component: ScheduledRelease
            }
        ]
    },
    {
        path: '/logistic',
        name: 'Logistic Management',
        component: LogisticManagement,
        children: [
            {
                path: 'despatchinstruction',
                name: 'Despatch Instruction',
                component: DespatchInstructionList
            },
            {
                path: 'deliverynote',
                name: 'Delivery Note',
                component: DeliveryNoteList
            }
        ]
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
            devMode: false,
            isLoggedIn: false,
            isTokenValid: false,
            // User data start
            userId: 0,
            userName: '',
            userType: 999,
            workingRestaurant: -1,
            workingRestaurantStock: -1,
            // User data end
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
            setUserId(state, payload) {
                state.userId = payload;
            },
            setUserType(state, payload) {
                state.userType = payload;
            },
            setUserName(state, payload) {
                state.userName = payload;
            },
            setWorkingRestaurant(state, payload) {
                state.workingRestaurant = payload;
            },
            setWorkingRestaurantStock(state, payload) {
                state.workingRestaurantStock = payload;
            },
            closeErrorDialog(state) {
                state.isErrorDialogShown = false;
                setTimeout(() => state.errorMessage = '', 1000);
            }
        },
        getters: {
            getUserType(state) {
                switch (state.userType.toString()) {
                    case "0":
                        return "Administrator";
                    case "1":
                        return "Restaurant Manager";
                    case "2":
                        return "Category Manager";
                    case "3":
                        return "Purchase Manager";
                    case "999":
                        return "Debug user";
                    default:
                        return "User";
                }
            }
        }
    })
;

// Use interceptors to do extra stuff when handling things
axios.interceptors.request.use(config => {
    // Something to do before request
    return config;
}, error => {
    // Errors at sending a request
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // If the operation is unsuccessful (e.g. return 200 but success = false)
    // Show up the error dialog
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
    get(url, param) {
        let reqUrl;
        if (param) {
            reqUrl = `${store.state.serverUrl}/${url}/${param}`;
        } else {
            reqUrl = `${store.state.serverUrl}/${url}`;
        }
        return axios({
            method: "get",
            url: reqUrl,
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
    delete(url, param, data) {
        if (data) {
            return axios({
                method: "delete",
                url: `${store.state.serverUrl}/${url}/${param}`,
                headers: {
                    Authorization: `Bearer ${store.state.token}`
                },
                data: data
            });
        } else {
            return axios({
                method: "delete",
                url: `${store.state.serverUrl}/${url}/${param}`,
                headers: {
                    Authorization: `Bearer ${store.state.token}`
                }
            });
        }

    }
};


new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
});

export const bus = new Vue();
