<template>
    <v-app>
        <!--
        <div v-if="!isReady"></div>
        -->
        <!-- IF THE USER IS LOGGED IN -->
        <template v-if="this.$store.state.isLoggedIn">
            <!-- Navigation drawer start -->
            <v-navigation-drawer
                    fixed
                    :mini-variant="miniVariant"
                    :clipped="$vuetify.breakpoint.smAndUp"
                    v-model="drawer"
                    app
            >
                <v-list>
                    <template v-for="(item, i) in nav">

                        <v-divider v-if="item.divider"></v-divider>

                        <v-list-group v-else-if="item.children"
                                      v-model="item.model"
                                      :key="i"
                        >
                            <v-list-tile slot="activator">
                                <v-list-tile-action>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile
                                    v-for="(child, j) in item.children"
                                    :key="j"
                                    :to="child.to"
                            >
                                <v-list-tile-action>
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>

                        <v-list-tile v-else :to="item.to" :key="i">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.text }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>

                    </template>
                </v-list>
            </v-navigation-drawer>
            <!-- Navigation drawer end -->

            <!-- Title toolbar start -->

            <v-toolbar fixed app :clipped-left="$vuetify.breakpoint.smAndUp" color="primary" dark class="pr-4"
                       style="z-index: 100" prominent>
                <v-toolbar-title>
                    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>


                <template>
                    <div class="text-xs-center">

                        <v-menu offset-y max-height="400px">
                            <v-btn icon slot="activator">
                                <v-badge color="red" overlap>
                                    <span slot="badge" v-if="notifications.length>0">{{notifications.length}}</span>
                                    <v-icon>notifications</v-icon>
                                </v-badge>
                            </v-btn>

                            <v-list two-line subheader v-if="notifications.length>0">
                                <v-subheader>Notifications
                                    <v-spacer/>

                                    <v-chip @click.native="clearNotification">
                                        Clear
                                    </v-chip>

                                </v-subheader>
                                <v-list-tile
                                        v-for="noti in notifications"
                                        @click=""
                                >
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ noti.title }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ noti.time }}</v-list-tile-sub-title>
                                    </v-list-tile-content>

                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </div>
                </template>


                <!-- Avatar icon menu start -->
                <v-menu offset-y>
                    <v-btn fab slot="activator">
                        <v-avatar color="accent">
                            <v-icon>account_circle</v-icon>
                        </v-avatar>
                    </v-btn>
                    <v-list>
                        <v-list-tile avatar>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ $store.state.userName }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ $store.getters.getUserType }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-tooltip top>
                                    <v-btn icon slot="activator"
                                           @click="logout">
                                        <v-icon>exit_to_app</v-icon>
                                    </v-btn>
                                    <span>Logout</span>
                                </v-tooltip>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                    <template v-if="$store.state.devMode">
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-tile @click.stop="invalid">
                                <v-list-tile-action>
                                    <v-icon>close</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>Make token invalid</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </template>
                </v-menu>
                <!-- Avatar icon menu end -->

            </v-toolbar>

            <!-- Title toolbar end -->

            <!-- Main content start -->
            <v-content>
                <!-- Breadcrumbs start -->
                <v-toolbar dense flat color="grey lighten-3">
                    <v-breadcrumbs class="ml-3">
                        <v-icon slot="divider">chevron_right</v-icon>
                        <v-breadcrumbs-item v-for="item in breadcrumbs" :key="item.text" :to="item.to"
                                            :disabled="item.disabled">
                            {{ item.text }}
                        </v-breadcrumbs-item>
                    </v-breadcrumbs>
                    <v-spacer></v-spacer>
                    <span class="mr-3">{{ datetime }}</span>
                </v-toolbar>
                <router-view></router-view>
                <!-- Breadcrumbs end -->
            </v-content>
            <!-- Main content end -->
        </template>

        <!-- If the user is NOT logged in -->

        <login v-else></login>

        <!-- Session expiry dialog start -->

        <v-dialog v-model="this.$store.state.isLoggedIn&&!this.$store.state.isTokenValid" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                        Session expired
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="logout">Logout</v-btn>
                    </v-card-actions>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Session expiry dialog end -->

        <!-- Error dialog start -->

        <v-dialog v-model="this.$store.state.isErrorDialogShown" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Error - {{ this.$store.state.errorMessage.failType }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                        {{ this.$store.state.errorMessage.message }}
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="$store.commit('closeErrorDialog')">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Error dialog end -->

        <!--notification snack bar start-->
        <v-snackbar
                :timeout="6000"
                :bottom="true"
                :right="true"
                v-model="snackbar"
        >
            {{ notificationMessage }}
            <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
        <!--notification snack bar end-->

    </v-app>
</template>

<script>
    import {HubConnectionBuilder, LogLevel} from '@aspnet/signalr';
    import Login from "./App/Login";
    import moment from "moment";

    export default {
        components: {Login},
        created() {
            setInterval(this.updateTime, 1000);
            this.$store.state.token = window.localStorage.getItem('token');
            this.checkLoginStatus();
            console.log('Computed nav', this.nav);

            const connection = new HubConnectionBuilder()
                .withUrl(this.$store.state.serverUrl + "/notification")
                .configureLogging(LogLevel.Information)
                .build();
            connection.start().catch(err => console.error(err.toString()));
            connection.on("ReceiveMessage", (user, message) => {
                if (user == "Warehouse" && (this.$store.state.userType === 4 || this.$store.state.userType === 999)) {
                    this.notifyMessage(message);
                }

                if (user == "Purchase" && (this.$store.state.userType === 3 || this.$store.state.userType === 999)) {
                    this.notifyMessage(message);
                }

                if (user == "All") {
                    this.notifyMessage(message);
                }
            });
        },
        data() {
            return {
                notificationClosed: "test",
                notifications: [],
                isReady: false,
                snackbar: false,
                notificationMessage: '',
                datetime: '',
                // Vuetify UI Component settings
                drawer: true,
                fixed: false,
                miniVariant: false,
                // Navigation drawer items
                navItems: [
                    {
                        to: '/',
                        icon: 'dashboard',
                        text: 'Dashboard',
                    },
                    {
                        to: '/item',
                        icon: 'category',
                        text: 'Item Management',
                        model: false,
                        access: [1, 2, 3, 4],
                        children:
                            [
                                {
                                    text: 'Supplier Item',
                                    to: '/item/supplieritem',
                                    access: [2, 3]
                                },
                                {
                                    text: 'Virtual Item',
                                    to: '/item/virtualitem',
                                    access: [2, 3]
                                },
                                {
                                    text: 'ID Mapping',
                                    to: '/item/idmapping',
                                    access: [2]
                                },
                                {
                                    text: 'Stock',
                                    to: '/item/stock',
                                    access: [1, 4]
                                },
                                {
                                    text: 'Category',
                                    to: '/item/category',
                                    access: [2, 3]
                                }
                            ]
                    },
                    {
                        to: '/request',
                        icon: 'assignment',
                        text: 'Request Management',
                        children: [
                            {
                                to: '/request',
                                text: 'Request List',
                                access: [1]
                            },
                            {
                                to: '/requestmapping',
                                text: 'Request Mapping',
                                access: [3]
                            }
                            ,
                            {
                                to: '/purchaserequest',
                                text: 'Request Queue',
                                access: [3]
                            }
                        ],
                        access: [1, 3]
                    },
                    {
                        to: '/agreement',
                        icon: 'description',
                        text: 'Agreement Management',
                        access: [3]
                    },
                    {
                        to: '/restaurant',
                        icon: 'restaurant',
                        text: 'Restaurant Management',
                        model: false,
                        access: [0, 2, 3],
                        children:
                            [
                                {
                                    text: 'Restaurant List',
                                    to: '/restaurant/list'
                                },
                                {
                                    text: 'Restaurant Type',
                                    to: '/restaurant/type',
                                    access: [0]
                                }
                            ]
                    },
                    {
                        to: '/supplier',
                        icon: 'shopping_basket',
                        text: 'Supplier Management',
                        access: [0]
                    },
                    {
                        to: '/user',
                        icon: 'account_circle',
                        text: 'User Management',
                        access: [0]
                    },
                    {
                        to: '/purchaseorder',
                        icon: 'receipt',
                        text: 'Order Management',
                        children: [
                            {
                                to: '/purchaseorder/blanketpurchaseorder',
                                text: 'Blanket Purchase Order',
                                access: [3, 5]
                            },
                            {
                                to: '/purchaseorder/standardpurchaseorder',
                                text: 'Standard Purchase Order',
                                access: [3]
                            },
                            {
                                to: '/purchaseorder/scheduledrelease',
                                text: 'Scheduled Release',
                                access: [3]
                            }
                        ],
                        access: [3, 5]
                    },
                    {
                        to: '/logistic',
                        icon: 'local_shipping',
                        text: 'Logistic Management',
                        children: [
                            {
                                to: '/logistic/despatchinstruction',
                                text: 'Despatch Instruction'
                            },
                            {
                                to: '/logistic/deliverynote',
                                text: 'Delivery Notes'
                            }
                        ],
                        access: [3, 4]
                    },
                    {
                        divider: true
                    },
                    {
                        to: '/announcement',
                        icon: 'notification_important',
                        text: 'Announcement',
                        access: [0]
                    },
                    {
                        to: '/about',
                        icon: 'info',
                        text: 'About'
                    },
                ],
                title: 'Supply Chain System',
            }
        },
        computed: {
            breadcrumbs() {
                let routes = [];
                this.$route.matched.forEach(r => {
                    routes.push({text: r.name, to: r.path, disabled: false});
                });
                console.log('Current route:', routes);
                return routes;
            },
            nav() {
                if (this.$store.state.userType === 999) {
                    return this.navItems;
                }
                let items = [];
                this.navItems.forEach(item => {
                    if (item.children) {
                        item.children = item.children.filter(child => {
                            if (this.$store.state.userType === 999) {
                                return true;
                            }
                            if (child.access) {
                                return child.access.includes(Number.parseInt(this.$store.state.userType));
                            }
                            return true;
                        });
                    }
                    if (item.access === undefined) {
                        items.push(item);
                    } else if (item.access.includes(Number.parseInt(this.$store.state.userType))) {
                        items.push(item);
                    }
                });
                return items;
            }
        },
        methods: {
            clearNotification() {
                this.notifications = [];
            },
            notifyMessage(message) {
                this.notificationMessage = message;
                this.notifications.push({time: moment().format('hh:mm'), title: message});
                this.snackbar = true;
            },
            updateTime() {
                this.datetime = moment().format('DD MMM, Y hh:mm:ss');
            },
            checkLoginStatus() {
                if (this.$store.state.token !== '') {
                    this.$http.get('token').then(res => {
                        console.log('Auto Login:', res);
                        this.$store.commit('setToken', res.data.responseContent.token);
                        window.localStorage.setItem("token", this.$store.state.token);
                        this.$store.commit('setLoginState', true);
                        this.$store.commit('setTokenValidState', true);
                        this.$store.commit('setUserId', res.data.responseContent.dbUser.userId);
                        this.$store.commit('setUserName', res.data.responseContent.dbUser.name);
                        this.$store.commit('setUserType', res.data.responseContent.dbUser.userType);
                        window.localStorage.setItem("userId", this.$store.state.userId);
                        window.localStorage.setItem("userName", this.$store.state.userName);
                        window.localStorage.setItem("userType", this.$store.state.userType);
                        if (res.data.responseContent.workplace) {
                            this.$store.commit('setWorkingRestaurant', res.data.responseContent.workplace.restaurantId);
                            this.$store.commit('setWorkingRestaurantStock', res.data.responseContent.workplace.stockId);
                            window.localStorage.setItem("workingRestaurant", this.$store.state.workingRestaurant);
                            window.localStorage.setItem("workingRestaurantStock", this.$store.state.workingRestaurantStock);
                        } else {

                            this.$store.commit('setWorkingRestaurant', '-1');
                            this.$store.commit('setWorkingRestaurantStock', '-1');
                            window.localStorage.setItem("workingRestaurant", '-1');
                            window.localStorage.setItem("workingRestaurantStock", '-1');
                        }
                        this.isReady = true;
                        // console.log('Login data:', res.data.responseContent);
                    }).catch(err => {
                        // Error Handling
                        console.log(err.message);
                        this.isReady = true;
                        this.$store.commit('setLoginState', false);
                    })
                }
            },
            logout() {
                window.localStorage.setItem('token', '');
                this.$store.commit('setToken', '');
                this.$store.commit('setLoginState', false);
                this.$router.push('/');
                window.location.reload();
            },
            // For testing purpose only
            invalid() {
                window.localStorage.setItem('token', 'apple');
                this.$store.commit('setToken', 'apple');
                this.$store.commit('setTokenValidState', false);
            },
            isAccessible(access) {
                return access.includes(Number.parseInt(this.$store.state.userType)) || access.includes(-1);
            }
        },
        watch: {
            returnValue() {
                console.log("show")
            }
        }
    }
</script>