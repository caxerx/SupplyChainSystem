<template>
    <v-container>
        <!-- Page title start -->
        <h1 class="display-1 primary--text mb-3">Item Management</h1>
        <!-- Page title end -->

        <!-- Table toolbar start -->
        <div>
            <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                <v-toolbar-title class="white--text">Item List</v-toolbar-title>
                <v-text-field
                        flat
                        solo-inverted
                        prepend-icon="search"
                        label="Search"
                        class="ml-5"
                ></v-text-field>
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
    </v-container>
</template>

<script>
    export default {
        name: "ItemManagement",
        created() {
            this.loadData();
            console.log(this.$route.matched)
        },
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
    }
</script>

<style scoped>

</style>