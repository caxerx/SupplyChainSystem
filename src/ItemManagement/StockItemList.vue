<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Stock Item List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="stockItems" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.virtualItemId }}</td>
                <td>{{ props.item.virtualItemName }}</td>
                <td>{{ props.item.virtualItemDescription }}</td>
                <td>{{ props.item.quantity}}</td>
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
                        <!-- Edit Item -->
                        <template v-if="editedIndex>-1">
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Quantity</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field v-model="editedItem.quantity" type="number"
                                                  label="Quantity" min="1"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </template>
                        <!-- Add Item -->
                        <template v-else>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Virtual Item Id</v-subheader>
                                </v-flex>
                                <v-flex xs4>
                                    <v-text-field v-model="editedItem.virtualItemId" label="Virtual Item Id"
                                                  readonly></v-text-field>
                                </v-flex>
                                <v-flex xs4 class="pl-3">
                                    <v-btn block @click.native="selectItem">Select Item</v-btn>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Quantity</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field v-model="editedItem.quantity" type="number" min="1"
                                                  label="Quantity"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </template>
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

        <!-- Item Select Dialog start -->
        <v-dialog v-model="isItemDialogShown" max-width="900">
            <v-card>
                <virtual-item-select :channel="selectChannel"></virtual-item-select>
            </v-card>
        </v-dialog>
        <!-- Item Select Dialog end -->
    </div>
</template>

<script>
    import {bus} from "../main";
    import VirtualItemSelect from "./VirtualItemSelect";

    export default {
        name: "StockItemList",
        components: {VirtualItemSelect},
        beforeDestroy(){
            bus.$off(this.selectChannel)
        },
        created() {
            this.loadData();
            let component = this;
            bus.$on(this.selectChannel, function (data) {
                console.log('Stock Item List received msg:', data);
                component.editedItem.virtualItemId = data;
                component.isItemDialogShown = false;
            });
        },
        data() {
            return {
                selectChannel: 'stockItemSelect',
                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                isItemDialogShown: false,
                headers: [
                    //Table header data
                    {
                        text: "Virtual Item Id",
                        value: "virtualItemId"
                    },
                    {
                        text: "Item Name",
                        value: "virtualItemName"
                    },
                    {
                        text: "Description",
                        value: "virtualItemDescription"
                    },
                    {
                        text: "Quantity",
                        value: "quantity"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                virtualItems: [],
                stockItems: [],
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    virtualItemId: '',
                    quantity: 0
                },
                defaultItem: {
                    virtualItemId: '',
                    quantity: 0
                }
            };
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            },
            isRequired() {
                return this.editedItem === -1;
            }
        },
        props: ['stock'],
        watch: {
            stock() {
                this.loadData();
            },
            isEditDialogShown(val) {
                val || this.close();
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('virtualitem').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.virtualItems = res.data.responseContent;
                        console.log(this.virtualItems);
                    }
                    if (this.stock) {
                        this.$http.get('stockitem', this.stock).then(res => {
                            this.stockItems = res.data.responseContent.stockItem;
                            this.stockItems.map(sItems => {
                                    let vItems = this.virtualItems.find(item => item.id === sItems.virtualItemId);
                                    for (let x in vItems) {
                                        sItems[x] = vItems[x];
                                    }
                                }
                            );
                            console.log(this.stockItems);

                        });
                    }
                });
            },
            editItem(item) {
                this.editedIndex = this.stockItems.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.isEditDialogShown = true;
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.stockItems.indexOf(item);
            },

            selectItem() {
                this.isItemDialogShown = true;
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http.delete('stockitem', this.stock, {id: this.stockItems[this.removedIndex].virtualItemId}).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.cancel();
            },

            addItem() {
                this.editedIndex = -1;
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
                if (this.editedIndex > -1) {
                    this.$http.put('stockitem', this.stock, this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.editedItem = Object.assign({}, this.defaultItem);
                            this.loadData();
                        }
                    });
                } else {
                    this.$http.post(`stockitem/${this.stock}`, this.editedItem).then(res => {
                        if (res.data.success) {
                            this.editedItem = Object.assign({}, this.defaultItem);
                            this.loadData();
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