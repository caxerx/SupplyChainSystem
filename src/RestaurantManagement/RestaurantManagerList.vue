<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Restaurant Manager List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="restaurantManagers" class="elevation-1" :search="search"
                      :rows-per-page-items="this.$store.state.rowPerPage">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.userId }}</td>
                <td>{{ props.item.userName }}</td>
                <td class="layout px-0">
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
                                <v-subheader>User Id</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.id" label="User Id"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>User Name</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.userName"
                                              label="User Name"></v-text-field>
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
        <!-- Delete Confirm Dialog end -->
    </div>
</template>

<script>
    export default {
        name: "RestaurantManagerList",
        props: ['restaurant'],

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
                        text: "User Id",
                        value: "userId"
                    },
                    {
                        text: "User Name",
                        value: "userName"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                restaurantManagers: [],
                users: [],
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    id: 0,
                },
                defaultItem: {
                    id: 0,
                }
            };
        },

        computed: {
            formTitle() {
                return "New Item";
            }
        },

        watch: {
            restaurant() {
                this.loadData();
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('user').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.users = res.data.responseContent;
                    }
                    if (this.restaurant) {
                        this.$http.get(`restaurantmanager/${this.restaurant}`).then(res => {
                            console.log(res);
                            this.restaurantManagers = res.data.responseContent.restaurantManager;
                            this.restaurantManagers.map(rMgr => {
                                    let users = this.users.find(user => user.userId === rMgr.userId);
                                    for (let x in users) {
                                        rMgr[x] = users[x];
                                    }
                                }
                            );
                            console.log(this.restaurantManagers);
                        });
                    }
                });
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.restaurantManagers.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },

            confirm() {
                this.$http.delete('restaurantmanager', this.restaurant, {id: this.restaurantManagers[this.removedIndex].userId}).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.loadData();
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
                }, 300);
            },

            save() {
                this.$http.post(`restaurantmanager/${this.restaurant}`, this.editedItem).then(res => {
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.close();
            }
        }
    }
</script>

<style scoped>

</style>