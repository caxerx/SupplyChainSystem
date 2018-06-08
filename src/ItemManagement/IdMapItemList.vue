<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Mapped Items</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="mapItems" class="elevation-1" :search="search"
                      :rows-per-page-items="this.$store.state.rowPerPage">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.supplierItemId }}</td>
                <td>{{ props.item.itemName }}</td>
                <td>{{ props.item.supplierName }}</td>
                <td>{{ props.item.itemDescription }}</td>
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
        <v-dialog v-model="isEditDialogShown" max-width="1000">
            <v-card>
                <supplier-item-select :channel="itemSelect"></supplier-item-select>
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
    import {bus} from "../main";
    import SupplierItemSelect from "./SupplierItemSelect";

    export default {
        name: "IdMapItemList",
        components: {SupplierItemSelect},
        props: ['vItem'],
        created() {
            this.loadData();
            let component = this;
            bus.$on(this.itemSelect, function (item) {
                console.log('Mapped Item list received msg:', item);
                component.selectedSupplierItemId = item;
                component.save();
                // component.loadData();
            });
        },
        beforeDestroy(){
            bus.$off(this.itemSelect);
        },
        data() {
            return {
                itemSelect: 'idmapitemselect',
                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        align: "left",
                        value: "id"
                    },
                    {
                        text: "Supplier Item Id",
                        value: "supplierItemId"
                    },
                    {
                        text: "Item Name",
                        value: "itemName"
                    },
                    {
                        text: "Supplier",
                        value: "supplierName"
                    },
                    {
                        text: "Description",
                        value: "itemDescription",
                        width: "300"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                items: [], //User data, ajax fetch reserve
                suppliers: [],
                mapItems: [],
                removedIndex: -1,
                selectedSupplierItemId: '',
            };
        },
        watch: {
            vItem() {
                this.loadData();
            },
            isEditDialogShown(val) {
                val || this.close();
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('supplier').then(res => {
                    if (res.data.success) {
                        this.suppliers = res.data.responseContent;
                        // console.log(this.suppliers);
                    }
                    this.$http.get('item').then(res => {
                        setTimeout(() => {
                            this.isLoadingData = false;
                        }, 300);
                        if (res.data.success) {
                            this.items = res.data.responseContent;
                            // console.log(res.data.responseContent);
                        }
                        if (this.vItem) {
                            this.$http.get(`mapitem/${this.vItem}`).then(res => {
                                if (res.data.success) {
                                    // console.log(res.data.responseContent);
                                    this.mapItems = [];
                                    res.data.responseContent.forEach(item => {
                                        this.mapItems.push({supplierItemId: item});
                                    });
                                    this.mapItems.map(mItem => {
                                        let sItem = this.items.find(item => item.supplierItemId === mItem.supplierItemId);
                                        for (let x in sItem) {
                                            mItem[x] = sItem[x];
                                        }
                                        let supp = this.suppliers.find(supp => supp.supplierId === mItem.supplierId);
                                        for (let x in supp) {
                                            mItem[x] = supp[x];
                                        }
                                    });
                                }
                            })
                        }
                    })
                });
            },
            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.mapItems.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http.delete('mapitem', this.mapItems[this.removedIndex].supplierItemId, {id: this.vItem}).then(res => {
                    if (res.data.success) {
                        // this.mapItems.splice(this.removedIndex, 1);
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
                this.selectedSupplierItemId = '';
                this.loadData();
            },

            save() {
                console.log(`Trying to map item ${this.selectedSupplierItemId} to`, this.vItem);
                this.$http.post(`mapitem/${this.selectedSupplierItemId}`, {Id: this.vItem}).then(res => {
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.close();
            }
        }
    }
</script>
