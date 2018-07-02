<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Category Item List</v-toolbar-title>
            <v-text-field
                    hide-details
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    v-model="search"
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
        <v-data-table :headers="headers" :items="categoryItems" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.virtualItemId }}</td>
                <td>{{ props.item.virtualItemName }}</td>
                <td>{{ props.item.virtualItemDescription }}</td>
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
                <virtual-item-select :channel="itemSelect"></virtual-item-select>
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
    import VirtualItemSelect from "./VirtualItemSelect";

    export default {
        name: "CategoryItemList",
        components: {VirtualItemSelect},
        created() {
            this.loadData();

            bus.$on(this.itemSelect, (data) => {
                console.log('Stock Item List received msg:', data);
                this.selectedVirtualItemId = data;
                this.save();
            });
        },
        beforeDestroy() {
            bus.$off(this.itemSelect);
        },
        data() {
            return {
                itemSelect: 'categoryitemselect',
                selectedVirtualItemId: -1,
                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
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
                        text: "Item Description",
                        value: "virtualItemDescription"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                categoryItems: [],
                virtualItems: [],
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    virtualItemId: ''
                },
                defaultItem: {
                    virtualItemId: ''
                }
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
            isRequired() {
                return this.editedItem === -1;
            }
        },

        props: ['category'],
        watch: {
            category() {
                this.loadData();
            }
        },
        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('virtualitem').then(res => {
                    if (res.data.success) {
                        this.virtualItems = res.data.responseContent;
                    }
                    if (this.category) {
                        this.$http.get(`categoryitem/${this.category}`).then(res => {
                            if (res.data.success) {
                                setTimeout(() => this.isLoadingData = false, 300);
                                this.categoryItems = [];
                                res.data.responseContent.virtualItemId.forEach(vItem => {
                                    this.categoryItems.push({virtualItemId: vItem});
                                });
                                this.categoryItems.map(cItem => {
                                        let vItems = this.virtualItems.find(vItem => vItem.virtualItemId === cItem.virtualItemId);
                                        for (let x in vItems) {
                                            cItem[x] = vItems[x];
                                        }
                                    }
                                );
                                console.log(this.categoryItems);
                            }
                        });
                    }
                });
            }
            ,

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.categoryItems.indexOf(item);
            }
            ,

            cancel() {
                this.isConfirmDialogShown = false;
            }
            ,
            confirm() {
                this.$http.delete('categoryitem', this.category, {id: this.categoryItems[this.removedIndex].virtualItemId}).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.categoryItems.splice(this.removedIndex, 1);
                    }
                });
                this.cancel();
            }
            ,

            addItem() {
                this.editedIndex = -1;
                this.isEditDialogShown = true;
            }
            ,

            close() {
                this.isEditDialogShown = false;
                setTimeout(() => {
                    this.loadData();
                }, 300);
            }
            ,

            save() {
                this.$http.post(`categoryitem/${this.category}`, {id: this.selectedVirtualItemId}).then(res => {
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