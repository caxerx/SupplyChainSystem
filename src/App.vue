<template>
    <v-app>
        <!-- IF THE USER IS LOGGED IN -->
        <template v-if="this.$store.state.isLoggedIn">
            <!-- Navigation drawer start -->
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
            <!-- Navigation drawer end -->

            <!-- Title toolbar start -->

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

            <!-- Title toolbar end -->

            <!-- Main content start -->
            <v-content>
                <!-- Breadcrumbs start -->
                <v-toolbar dense flat color="grey lighten-3">
                    <v-breadcrumbs class="ml-3">
                        <v-icon slot="divider">chevron_right</v-icon>
                        <v-breadcrumbs-item v-for="item in $store.getters.breadcrumbs" :key="item.text" :to="item.link"
                                            :disabled="item.disabled">
                            {{ item.text }}
                        </v-breadcrumbs-item>
                    </v-breadcrumbs>
                    <span class="ml-3"><v-icon>arrow_left</v-icon>Well... fix this later</span>
                </v-toolbar>
                <router-view></router-view>
                <!-- Breadcrumbs end -->
            </v-content>
            <!-- Main content end -->
        </template>

        <!-- If the user is NOT logged in -->

        <login v-else></login>


    </v-app>
</template>

<script>
    import Login from "./App/Login";

    export default {
        components: {Login},
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
            }
        },
        methods: {
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
                        this.$store.state.isLoggedIn = !!res.data.success;
                    }).catch(err => {
                        // Error Handling
                        console.log(err.message);
                        this.$store.state.isLoggedIn = false;
                    })
                }
            }
        }
    }
</script>