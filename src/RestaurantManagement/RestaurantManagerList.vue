<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Restaurant Manager List</v-toolbar-title>
            <v-text-field
                    hide-details
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
        <v-dialog v-model="isEditDialogShown" max-width="900">
            <v-card>
                <user-select :channel="managerSelect"></user-select>
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
    import UserSelect from "../UserManagement/UserSelect";
    import {bus} from "../main";

    export default {
        name: "RestaurantManagerList",
        components: {UserSelect},
        props: ['restaurant'],

        created() {
            this.loadData();
            let component = this;
            bus.$on(this.managerSelect, function (user) {
                component.selectedUser = user;
                component.save();
                component.loadData();
            });
        },
        data() {
            return {
                managerSelect: 'selectrestaurantmanager',
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

                selectedUser: '',

                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    id: '',
                },
                defaultItem: {
                    id: '',
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
                this.$http.post(`restaurantmanager/${this.restaurant}`, {id: this.selectedUser}).then(res => {
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