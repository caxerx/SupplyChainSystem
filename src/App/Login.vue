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
                                              v-model="userName"
                                              required
                                              :error-messages="userNameError"
                                              @input="$v.userName.$touch()"
                                              @blur="$v.userName.$touch()"></v-text-field>
                                <v-text-field id="password" prepend-icon="lock" name="password" label="Password"
                                              type="password" v-model="password"
                                              autocomplete="current-password"
                                              :error-messages="passwordError"
                                              required
                                              @input="$v.password.$touch()"
                                              @blur="$v.password.$touch()"></v-text-field>
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
    import {validationMixin} from 'vuelidate'
    import {required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: "Login",
        data() {
            return {
                mixins: [validationMixin],

                // Login data
                userName: '',
                password: '',

                isLoginFailed: false,
                loginFailMessage: ""
            }
        },
        validations: {
            userName: {
                required
            },
            password: {
                required
            }
        },
        methods: {
            login() {
                this.$v.$touch();
                if (this.$v.$invalid) return;
                this.$http.getToken({userName: this.userName, password: this.password}).then(res => {
                    if (res.data.success) {
                        this.$store.commit('setToken', res.data.responseContent.token);
                        window.localStorage.setItem("token", this.$store.state.token);
                        this.$store.commit('setLoginState', true);
                        this.$store.commit('setTokenValidState', true);
                        this.$store.commit('setUserId', res.data.responseContent.user.userId);
                        this.$store.commit('setUserName', res.data.responseContent.user.name);
                        this.$store.commit('setUserType', res.data.responseContent.user.userType);
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

                        console.log('Login data:', res.data.responseContent);
                        window.location.reload();
                    } else {
                        this.isLoginFailed = true;
                        this.loginFailMessage = "Incorrect username or password";
                    }
                }).catch(err => {
                    this.isLoginFailed = true;
                    this.loginFailMessage = "Network Error";
                });
            },
        }, computed: {
            userNameError() {
                const errors = [];
                if (!this.$v.userName.$dirty) return errors;
                !this.$v.userName.required && errors.push('Username is required');
                return errors
            },
            passwordError() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.required && errors.push('Password is required');
                return errors
            }
        }
    }
</script>

<style scoped>

</style>