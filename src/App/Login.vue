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
                        this.$store.state.isLoggedIn = true;
                        // console.log(res.data.responseContent);
                    } else {
                        this.isLoginFailed = true;
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>