<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Restaurant List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="restaurants" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.restaurantId }}</td>
                <td>{{ props.item.restaurantName }}</td>
                <td>{{ props.item.restaurantLocation }}</td>
                <td>{{ props.item.restaurantTypeName }}</td>
                <td>{{ props.item.stockId }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="viewItem(props.item)">
                        <v-icon color="blue">category</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="viewManager(props.item)">
                        <v-icon color="orange">account_circle</v-icon>
                    </v-btn>
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
                                <v-subheader>Restaurant Name</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.restaurantName"
                                              label="Restaurant Name"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Restaurant Type</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-select v-model="editedItem.restaurantTypeId"
                                          :items="restaurantTypes"
                                          item-value="restaurantTypeId"
                                          item-text="restaurantTypeName"
                                          single-line
                                          label="Select a type"></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Restaurant Location</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.restaurantLocation"
                                              label="Restaurant Location" multi-line></v-text-field>
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

        <v-dialog v-model="isItemDialogShown" max-width="900">
            <v-card>
                <stock-item-list :stock="selectedStock"></stock-item-list>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isManagerDialogShown" max-width="900">
            <v-card>
                <restaurant-manager-list :restaurant="selectedRestaurant"></restaurant-manager-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import StockItemList from '../ItemManagement/StockItemList'
    import RestaurantManagerList from "./RestaurantManagerList";

    export default {
        name: "RestaurantList",
        components: {RestaurantManagerList, StockItemList},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                isItemDialogShown: false,
                isManagerDialogShown: false,
                headers: [
                    //Table header data
                    {
                        text: "Restaurant Id",
                        value: "restaurantId"
                    },
                    {
                        text: "Restaurant Name",
                        value: "restaurantName"
                    },
                    {
                        text: "Location",
                        value: "restaurantLocation"
                    },
                    {
                        text: "Restaurant Type",
                        value: "restaurantTypeName"
                    },
                    {
                        text: "Stock Id",
                        value: "stockId"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                restaurants: [],
                restaurantTypes: [],
                selectedStock: '',
                selectedRestaurant: '',
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    id: '',
                    restaurantId: '',
                    restaurantName: '',
                    restaurantLocation: '',
                    restaurantType: '',
                    stockId: ''
                },
                defaultItem: {
                    id: '',
                    restaurantId: '',
                    restaurantName: '',
                    restaurantLocation: '',
                    restaurantType: '',
                    stockId: ''
                }
            };
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('restauranttype').then(res => {
                    if (res.data.success) {
                        this.restaurantTypes = res.data.responseContent;
                    }
                }).then(() => {
                    this.$http.get('restaurant').then(res => {
                        if (res.data.success) {
                            setTimeout(() => this.isLoadingData = false, 300);
                            this.restaurants = res.data.responseContent;
                            console.log(this.restaurants);
                            this.restaurants.map(obj =>
                                obj.restaurantTypeName = this.restaurantTypes.find(type =>
                                    type.restaurantTypeId === obj.restaurantTypeId).restaurantTypeName);
                        }
                    });
                })
            },
            editItem(item) {
                this.editedIndex = this.restaurants.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.isEditDialogShown = true;
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.restaurants.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http.delete('restaurant', this.restaurants[this.removedIndex].restaurantId).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.restaurants.splice(this.removedIndex, 1);
                    }
                });
                this.cancel();
            },

            addItem() {
                this.isEditDialogShown = true;
            },

            viewItem(item) {
                this.selectedStock = item.stockId;

                this.isItemDialogShown = true;
            },
            viewManager(item) {
                this.selectedRestaurant = item.restaurantId;
                this.isManagerDialogShown = true;
            },

            close() {
                this.isEditDialogShown = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
            },

            save() {
                if (this.editedIndex > -1) {
                    this.$http.put('restaurant', this.editedItem.restaurantId, this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            Object.assign(this.restaurants[this.editedIndex], this.editedItem);
                        }
                    });
                } else {
                    this.$http.post('restaurant', this.editedItem).then(res => {
                        if (res.data.success) {
                            this.restaurants.push(res.data.responseContent);
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