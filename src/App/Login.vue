<template>
    <!-- Login screen start -->
    <v-content>
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
                                    <span v-if="isLoginFailed" class="red--text ml-4">
                                        {{ loginFailMessage }}
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
    <!-- Login screen end -->
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                // Login data
                loginInfo: {
                    userName: '',
                    password: ''
                },
                isLoginFailed: false,
                loginFailMessage: ""
            }
        },
        methods: {
            login() {
                this.$http.getToken(this.loginInfo).then(res => {
                    if (res.data.success) {
                        this.$store.commit('setToken', res.data.responseContent.token);
                        window.localStorage.setItem("token", this.$store.state.token);
                        this.$store.commit('setLoginState', true);
                        this.$store.commit('setTokenValidState', true);
                        this.$store.commit('setUserType', res.data.responseContent.user.userType);
                        this.$store.commit('setUserName', res.data.responseContent.user.name);
                        window.localStorage.setItem("userType", this.$store.state.userType);
                        window.localStorage.setItem("userName", this.$store.state.userName);
                        console.log('Login data:', res.data.responseContent);
                    } else {
                        this.isLoginFailed = true;
                        this.loginFailMessage = "Incorrect username or password";
                    }
                }).catch(err => {
                    this.isLoginFailed = true;
                    this.loginFailMessage = "Network Error";
                });
            },
        }
    }
</script>

<style scoped>

</style>