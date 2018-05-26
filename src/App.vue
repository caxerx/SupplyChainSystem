<template>
    <v-app>
        <!-- IF THE USER IS LOGGED IN -->
        <template v-if="isLoggedIn">
            <!-- NAVIGATION DRAWER -->
            <v-navigation-drawer
                    fixed
                    :mini-variant="miniVariant"
                    :clipped="$vuetify.breakpoint.lgAndDown"
                    v-model="drawer"
                    app
            >
                <v-list>
                    <v-list-tile value="true"
                                 v-for="(item, i) in navItems"
                                 :key="i" :to="item.link">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>

            <!-- MAIN ACTION BAR -->

            <v-toolbar fixed app :clipped-left="$vuetify.breakpoint.lgAndDown" color="primary" dark class="pr-4">
                <v-toolbar-title>
                    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click.stop="fixed = !fixed">
                    <v-icon>notifications</v-icon>
                </v-btn>
                <v-avatar color="accent">
                    <v-icon>account_circle</v-icon>
                </v-avatar>
            </v-toolbar>

            <!-- MAIN CONTENT -->
            <v-content>
                <!-- BREADCRUMBS -->
                <v-toolbar dense flat color="grey lighten-3">
                    <v-breadcrumbs class="ml-3">
                        <v-icon slot="divider">chevron_right</v-icon>
                        <v-breadcrumbs-item v-for="item in $store.state.breadcrumbs" :key="item.text"
                                            :disabled="item.disabled">
                            {{ item.text }}
                        </v-breadcrumbs-item>
                    </v-breadcrumbs>
                    <span class="ml-3"><v-icon>arrow_left</v-icon>Well... fix this later</span>
                </v-toolbar>
                <router-view></router-view>
            </v-content>
        </template>

        <!-- IF THE USER IS NOT LOGGED IN -->

        <!-- LOGIN SCREEN -->
        <v-content v-else>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md6 lg4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Login</v-toolbar-title>
                            </v-toolbar>
                            <v-form @submit="login" @submit.prevent class="pa-3">
                                <v-card-text>
                                    <v-text-field prepend-icon="person" name="login" label="Login" type="text"
                                                  v-model="loginInfo.userName"></v-text-field>
                                    <v-text-field id="password" prepend-icon="lock" name="password" label="Password"
                                                  type="password" v-model="loginInfo.password"
                                                  autocomplete="current-password"></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <span v-if="isLoginFailed" class="red--text ml-4">Incorrect username or
                                        password
                                    </span>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" type="submit">Login</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        created() {
            this.$store.state.token = window.localStorage.getItem('token');
            this.checkLoginStatus();
        },
        data() {
            return {
                // Vuetify UI Component settings
                drawer: true,
                fixed: false,
                miniVariant: false,
                // Navigation drawer items
                navItems: [
                    {link: '/', icon: 'dashboard', title: 'Dashboard'},
                    {link: '/item', icon: 'category', title: 'Item Management'},
                    {link: '/request', icon: 'assignment', title: 'Request Management'},
                    {link: '/agreement', icon: 'description', title: 'Agreement Management'},
                    {link: '/user', icon: 'account_circle', title: 'User Management'},
                    {link: '/setting', icon: 'settings', title: 'Settings'},
                    {link: '/about', icon: 'info', title: 'About'},
                ],
                title: 'Supply Chain System',
                // Login data
                loginInfo: {
                    userName: '',
                    password: ''
                },
                isLoginFailed: false,
                isLoggedIn: false
            }
        },
        methods: {
            login() {
                this.$http({
                    method: "post",
                    url: "http://219.77.158.36:37370/api/token",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.loginInfo
                }).then(res => {
                    if (res.data.success) {
                        this.$store.state.token = res.data.responseContent.token;
                        window.localStorage.setItem("token", this.$store.state.token);
                        this.isLoggedIn = true;
                        // console.log(res.data.responseContent);
                    } else {
                        this.isLoginFailed = true;
                    }
                })
            },
            // TODO fix api get token status
            checkLoginStatus() {
                if (this.$store.state.token !== '') {
                    this.$http({
                        method: 'get',
                        url: 'http://219.77.158.36:37370/api/token',
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${this.$store.state.token}`
                        }
                    }).then(res => {
                        if (res.data.success) {
                            this.isLoggedIn = true;
                        } else {
                            this.isLoggedIn = false;
                        }
                    }).catch(err => {
                        // Error Handling
                        console.log(err.message);
                    })
                }
            }
        }
    }
</script>