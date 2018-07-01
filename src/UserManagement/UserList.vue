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
                    v-model="search"
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
        <v-data-table :headers="headers" :items="users" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.userId }}</td>
                <td>{{ props.item.userName }}</td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.userTypeName }}</td>
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
                                <v-subheader>Name</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>User Type</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-select v-model="editedItem.userType" :items="userTypes" item-text="text"
                                          item-value="code" label="Select a user type"></v-select>
                                <!--
                                <v-text-field v-model="editedItem.userType"
                                              label="User Type"></v-text-field>
                                              -->
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
                search: '',
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
                        text: "Name",
                        value: "name"
                    },
                    {
                        text: "User Type",
                        value: "userTypeName"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                userTypes: [
                    {code: 0, text: "Administrator"},
                    {code: 1, text: "Restaurant Manager"},
                    {code: 2, text: "Category Manager"},
                    {code: 3, text: "Purchase Manager"},
                    {code: 4, text: "Warehouse Clerk"},
                    {code: 5, text: "Accounting Manager"}
                ],
                users: [], // User data from AJAX calls
                editedIndex: -1, // -1 means it is a new Item
                removedIndex: -1,
                editedItem: {
                    userId: "1",
                    userName: "",
                    name: "",
                    password: "",
                    userType: -1
                },
                defaultItem: {
                    userName: "",
                    password: "",
                    userType: -1
                },
                drawer: true
            };
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            },
        },
        watch: {
            isEditDialogShown(val) {
                val || this.close();
            }
        },
        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('user').then(res => {
                    setTimeout(() => {
                        this.isLoadingData = false;
                    }, 300);
                    if (res.data.success) {
                        this.users = res.data.responseContent;
                        this.users.map(user => user.userTypeName = this.getUserTypeName(user.userType));
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
                this.$http.delete('user', this.users[this.removedIndex].userId).then(res => {
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
                    this.$http.put('user', this.editedItem.userId, this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.loadData();
                        }
                    });
                } else {
                    console.log(this.editedItem);
                    this.$http.post('user', this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.loadData();
                        }
                    });
                }
                this.close();
            },
            getUserTypeName(id) {
                switch (id.toString()) {
                    case "0":
                        return "Administrator";
                    case "1":
                        return "Restaurant Manager";
                    case "2":
                        return "Category Manager";
                    case "3":
                        return "Purchase Manager";
                    case "4":
                        return "Warehouse Clerk";
                    case "5":
                        return "Accounting Manager";
                    case "999":
                        return "Debug user";
                    default:
                        return "User";
                }
            }
        }
    }
</script>

<style scoped>

</style>