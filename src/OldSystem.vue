<template>
    <v-app id="inspire">

        <!-- Login page start -->
        <v-content v-if="token===''">
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm8 md4>
                        <v-card class="elevation-12">
                            <v-toolbar dark color="primary">
                                <v-toolbar-title>Login (Old)</v-toolbar-title>
                            </v-toolbar>
                            <v-form @submit="login" @submit.prevent="submit">
                                <v-card-text>
                                    <v-text-field prepend-icon="person" name="login" label="Login" type="text"
                                                  v-model="loginInfo.userName"></v-text-field>
                                    <v-text-field id="password" prepend-icon="lock" name="password" label="Password"
                                                  type="password" v-model="loginInfo.password"
                                                  autocomplete="current-password"></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" @click.native="login" type="submit">Login</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <!-- Login page end -->

        <!-- Main page start -->
        <div v-if="token!==''">
            <v-navigation-drawer permanent :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
                <v-toolbar flat>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title class="title">
                                Application
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-divider></v-divider>
                <v-list dense class="pt-0">
                    <v-list-tile v-for="item in navItems" :key="item.title">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>

            <!-- Top Toolbar start -->
            <div>
                <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed>
                    <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                        <span class="hidden-sm-and-down">Supply Chain System</span>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon>notifications</v-icon>
                    </v-btn>
                    <v-btn icon large>
                        <v-avatar size="32px" tile>
                            <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify">
                        </v-avatar>
                    </v-btn>
                </v-toolbar>
            </div>
            <!-- Top Toolbar end -->


            <!-- Page content start -->
            <v-content>
                <v-container>

                    <!-- Page title start -->
                    <h1 class="display-1 primary--text">User Management</h1>
                    <!-- Page title end -->

                    <!-- Breadcrumbs start -->
                    <div>
                        <v-breadcrumbs divider="/">
                            <v-breadcrumbs-item v-for="item in bc" :key="item.text" :disabled="item.disabled">
                                {{ item.text }}
                            </v-breadcrumbs-item>
                        </v-breadcrumbs>
                    </div>
                    <!-- Breadcrumbs end -->

                    <!-- Table toolbar start -->
                    <div>
                        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                            <v-toolbar-title class="white--text">User List</v-toolbar-title>
                            <v-spacer></v-spacer>

                            <v-btn icon @click="addItem()">
                                <v-icon>add</v-icon>
                            </v-btn>

                            <v-btn icon @click="loadData()">
                                <v-icon v-if="!dataLoading">refresh</v-icon>
                                <vue-simple-spinner style="transform: scale(0.65)"
                                                    v-if="dataLoading"></vue-simple-spinner>
                            </v-btn>


                        </v-toolbar>
                    </div>
                    <!-- Table toolbar end -->

                    <!-- Table start -->
                    <v-data-table :headers="headers" :items="users" hide-actions class="elevation-1">
                        <template slot="navItems" slot-scope="props">
                            <td>{{ props.item.userId }}</td>
                            <td>{{ props.item.userName }}</td>
                            <td>{{ props.item.userType }}</td>
                            <td class="layout px-0">
                                <v-btn icon class="mx-0" @click="editItem(props.item)">
                                    <v-icon color="teal">edit</v-icon>
                                </v-btn>
                                <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                                    <v-icon color="pink">delete</v-icon>
                                </v-btn>
                            </td>
                        </template>

                        <template slot="no-data">
                            No Data!
                        </template>
                    </v-data-table>
                    <!-- Table end -->

                    <!-- Edit Dialog start -->
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container fluid>
                                    <v-layout row>
                                        <v-flex xs4>
                                            <v-subheader>Username</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field v-model="editedItem.userName" label="Username"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs4>
                                            <v-subheader>User Type</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-text-field v-model="editedItem.userType"
                                                          label="User Type"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs4>
                                            <v-subheader>Password</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>

                                            <v-text-field v-model="editedItem.password" type="password" label="Password"
                                                          clearable hint="Keep empty if password not change"
                                                          persistent-hint></v-text-field>
                                        </v-flex>
                                    </v-layout>


                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- Edit Dialog end -->

                    <!-- Delete Confirm Dialog start -->
                    <v-dialog v-model="dialog2" max-width="290">
                        <v-card>
                            <v-card-title class="headline">Delete Item</v-card-title>
                            <v-card-text>Are you sure to delete this item? This action is irreversible.
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" flat @click.native="cancel">Cancel</v-btn>
                                <v-btn color="green darken-1" flat @click.native="confirm">Confirm</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- Delete Confirm Dialog start -->
                </v-container>
            </v-content>

            <!-- Page content end -->

        </div>
        <!-- Main page end -->
    </v-app>
</template>

<script>
    import axios from "axios";

    export default {
        /*
        data() {
          return {
            clipped: false,
            drawer: true,
            fixed: false,
            items: [{ icon: "bubble_chart", title: "Inspire" }],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: "Vuetify.js"
          };
        }*/
        data() {
            return {
                token: "", //Token of api auth
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                bc: [
                    //Breadcrumb data
                    {
                        text: "Dashboard",
                        disabled: false
                    },
                    {
                        text: "User Management",
                        disabled: true
                    }
                ],
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        align: "left",
                        value: "userId"
                    },
                    {
                        text: "Username",
                        value: "userName"
                    },
                    {
                        text: "User Type",
                        value: "userType"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                users: [], //User data, ajax fetch reserve
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    userId: "1",
                    userName: "",
                    password: "",
                    userType: ""
                },
                defaultItem: {
                    userName: "",
                    password: "",
                    userType: ""
                },
                loginInfo: {
                    //Object reserve to submit login request
                    userName: "",
                    password: ""
                },
                drawer: true
            };
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            },

            watch: {
                isEditDialogShown(val) {
                    val || this.close();
                }
            },

            created() {
                let token = window.localStorage.getItem("token");
                axios({
                    //method: 'post',
                    method: "get",
                    url: "http://219.77.158.36:37370/api/token",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.data.success
                    ) {
                        this.token = token;
                        this.loadData();
                    }
                })
                ;
            }
        },

        methods: {
            initialize() {
                axios({
                    method: "post",
                    url: "http://219.77.158.36:37370/api/token",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.loginInfo
                }).then(res => {
                    if (res.data.success
                    ) {
                        this.token = res.data.responseContent.token;
                        window.localStorage.setItem("token", this.token);
                        console.log(res.data.responseContent);
                        this.loadData();
                    }
                })
                ;
            },
            loadData() {
                this.dataLoading = true;
                axios({
                    //method: 'post',
                    method: "get",
                    url: "http://219.77.158.36:37370/api/user",
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then(res => {
                    setTimeout(() => {
                            this.dataLoading = false;
                        }
                        ,
                        300
                    )
                    ;
                    if (res.data.success) {
                        this.users = res.data.responseContent;
                        console.log(res.data.responseContent);
                    }
                })
                ;
            },
            login() {
                this.initialize();
            },
            editItem(item) {
                this.editedIndex = this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },

            deleteItem(item) {
                this.dialog2 = true;
                this.removedIndex = this.users.indexOf(item);
            },

            cancel() {
                this.dialog2 = false;
            },
            confirm() {
                axios({
                    method: "delete",
                    url: `http://219.77.158.36:37370/api/user/${
                        this.users[this.removedIndex].userId
                        }`,
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.users.splice(this.removedIndex, 1);
                    }
                })
                ;
                this.cancel();
            },

            addItem() {
                this.dialog = true;
            },

            close() {
                this.dialog = false;
                setTimeout(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                        this.editedIndex = -1;
                    },
                    300
                )
                ;
            },

            save() {
                if (this.editedIndex > -1) {
                    axios({
                        method: "put",
                        url: `http://219.77.158.36:37370/api/user/${this.editedItem.userId}`,
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            "Content-Type": "application/json"
                        },
                        data: this.editedItem
                    }).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            Object.assign(this.users[this.editedIndex], this.editedItem);
                        }
                    })
                    ;
                } else {
                    console.log(this.editedItem);
                    axios({
                        method: "post",
                        url: `http://219.77.158.36:37370/api/user`,
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            "Content-Type": "application/json"
                        },
                        data: this.editedItem
                    }).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.users.push(res.data.responseContent);
                        }
                    })
                    ;
                }
                this.close();
            }
        }
    };
</script>
