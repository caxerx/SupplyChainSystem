<template>
    <div>
        <!-- Table toolbar start -->
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
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="items" hide-actions class="elevation-1">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.supplierItemId }}</td>
                <td>{{ props.item.itemName }}</td>
                <td>{{ props.item.supplier }}</td>
                <td>{{ props.item.description }}</td>
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
        name: "ItemList",
        created() {
            this.loadData();
            console.log(this.$route.matched)
        },
        data() {
            return {
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                headers: [
                    //Table header data
                    {
                        text: "Supplier Item Id",
                        align: "left",
                        value: "supplierItemId"
                    },
                    {
                        text: "Item Name",
                        value: "userName"
                    },
                    {
                        text: "Supplier",
                        value: "supplier"
                    },
                    {
                        text: "Description",
                        value: "description"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                items: [], //User data, ajax fetch reserve
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
                    url: "http://219.77.158.36:37370/api/item",
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
                        this.items = res.data.responseContent;
                        console.log(res.data.responseContent);
                    }
                })
                ;
            },
            editItem(item) {
                this.editedIndex = this.items.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },

            deleteItem(item) {
                this.dialog2 = true;
                this.removedIndex = this.items.indexOf(item);
            },

            cancel() {
                this.dialog2 = false;
            },
            confirm() {
                this.$http({
                    method: "delete",
                    url: `http://219.77.158.36:37370/api/user/${this.items[this.removedIndex].userId}`,
                    headers: {
                        Authorization: `Bearer ${this.$store.state.token}`
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.items.splice(this.removedIndex, 1);
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
                            Object.assign(this.items[this.editedIndex], this.editedItem);
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
                            this.items.push(res.data.responseContent);
                        }
                    })
                    ;
                }
                this.close();
            }
        }
    }
</script>
