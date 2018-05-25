<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text">User Management</h1>
        <!-- Page title end -->

        <!-- Breadcrumbs start -->
        <div>
            <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in $store.state.breadcrumbs" :key="item.text" :disabled="item.disabled">
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
                    <v-icon v-if="!isLoadingData">refresh</v-icon>
                    <vue-simple-spinner style="transform: scale(0.65)"
                                        v-if="isLoadingData"></vue-simple-spinner>
                </v-btn>


            </v-toolbar>
        </div>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="users" hide-actions class="elevation-1">
            <template slot="items" slot-scope="props">
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
</template>

<script>
    export default {
        data() {
            return {
                isLoadingData: false, //Loading state
                dialog: false, //Edit dialog
                dialog2: false, //Confirm dialog
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

            watch() {
                return {
                    dialog(val) {
                        val || this.close();
                    }
                }
            },

            created() {
                let token = window.localStorage.getItem("token");
                this.$http({
                    //method: 'post',
                    method: "get",
                    url: "http://219.77.158.36:37370/api/token",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    if (res.data.success
                    ) {
                        this.$store.state.token = token;
                        this.loadData();
                    }
                })
                ;
            }
        },

        methods: {
            initialize() {
                this.$http({
                    method: "post",
                    url: "http://219.77.158.36:37370/api/token",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: this.loginInfo
                }).then(res => {
                    if (res.data.success
                    ) {
                        this.$store.state.token = res.data.responseContent.token;
                        window.localStorage.setItem("token", this.$store.state.token);
                        console.log(res.data.responseContent);
                        this.loadData();
                    }
                })
                ;
            },
            loadData() {
                this.isLoadingData = true;
                this.$http({
                    //method: 'post',
                    method: "get",
                    url: "http://219.77.158.36:37370/api/user",
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                }).then(res => {
                    setTimeout(() => {
                            this.isLoadingData = false;
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
                this.$http({
                    method: "delete",
                    url: `http://219.77.158.36:37370/api/user/${
                        this.users[this.removedIndex].userId
                        }`,
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
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
                    this.$http({
                        method: "put",
                        url: `http://219.77.158.36:37370/api/user/${this.editedItem.userId}`,
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`,
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
                    this.$http({
                        method: "post",
                        url: `http://219.77.158.36:37370/api/user`,
                        headers: {
                            Authorization: `Bearer ${this.$store.state.token}`,
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
