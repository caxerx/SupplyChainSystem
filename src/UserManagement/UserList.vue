<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">User List</v-toolbar-title>
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
                <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
            </v-btn>
        </v-toolbar>
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
        <v-dialog v-model="isEditDialogShown" max-width="500px">
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
        <v-dialog v-model="isConfirmDialogShown" max-width="290">
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
    </div>
</template>

<script>
    export default {
        name: "UserList",
        created() {
            this.loadData();
        },
        data() {
            return {
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
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
                drawer: true
            };
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            },

            watch() {
                return {
                    isEditDialogShown(val) {
                        val || this.close();
                    }
                }
            },
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http({
                    //method: 'post',
                    method: "get",
                    url: `${this.$store.state.serverUrl}/api/user`,
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
                });
            },
            editItem(item) {
                this.editedIndex = this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.isEditDialogShown = true;
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.users.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http({
                    method: "delete",
                    url: `${this.$store.state.serverUrl}/api/user/${this.users[this.removedIndex].userId}`,
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.users.splice(this.removedIndex, 1);
                    }
                });
                this.cancel();
            },

            addItem() {
                this.isEditDialogShown = true;
            },

            close() {
                this.isEditDialogShown = false;
                setTimeout(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                        this.editedIndex = -1;
                    },
                    300
                );
            },

            save() {
                if (this.editedIndex > -1) {
                    this.$http({
                        method: "put",
                        url: `${this.$store.state.serverUrl}/api/user/${this.editedItem.userId}`,
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
                    });
                } else {
                    console.log(this.editedItem);
                    this.$http({
                        method: "post",
                        url: `${this.$store.state.serverUrl}/api/user`,
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
                    });
                }
                this.close();
            }
        }
    }
</script>

<style scoped>

</style>