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

            <v-toolbar fixed app :clipped-left="$vuetify.breakpoint.lgAndDown" color="primary" dark class="pr-4"
                       style="z-index: 100">
                <v-toolbar-title>
                    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <v-badge color="red" overlap>
                    <span slot="badge">1</span>
                    <v-btn icon>
                        <v-icon>notifications</v-icon>
                    </v-btn>
                </v-badge>

                <!-- Avatar icon menu start -->
                <v-menu offset-y>
                    <v-btn fab slot="activator">
                        <v-avatar color="accent">
                            <v-icon>account_circle</v-icon>
                        </v-avatar>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click.stop="logout">
                            <v-list-tile-action>
                                <v-icon>exit_to_app</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Logout</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile @click.stop="invalid">
                            <v-list-tile-action>
                                <v-icon>close</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Make token invalid</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
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
                    this.$http.get('token').then(res => {
                        this.$store.commit('setLoginState', !!res.data.success);
                        this.$store.commit('setTokenValidState', true);
                    }).catch(err => {
                        // Error Handling
                        console.log(err.message);
                        this.$store.commit('setLoginState', false);
                    })
                }
            },
            logout() {
                window.localStorage.setItem('token', '');
                this.$store.commit('setToken', '');
                this.$store.commit('setLoginState', false);
            },
            // For testing purpose only
            invalid() {
                window.localStorage.setItem('token', 'apple');
                this.$store.commit('setToken', 'apple');
                this.$store.commit('setTokenValidState', false);
            }
        }
    }
</script>