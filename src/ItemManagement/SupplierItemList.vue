<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Supplier Item List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="items" class="elevation-1" :search="search"
                      :rows-per-page-items="this.$store.state.rowPerPage">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.supplierItemId }}</td>
                <td>{{ props.item.itemName }}</td>
                <td>{{ props.item.supplierName }}</td>
                <td>{{ props.item.itemDescription }}</td>
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


        <!-- Supplier Select Dialog start -->
        <v-dialog v-model="isSupplierDialogShown" max-width="900">
            <v-card>
                <supplier-select :channel="selectChannel"></supplier-select>
            </v-card>
        </v-dialog>
        <!-- Supplier Select Dialog end -->

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
                                <v-subheader>Supplier Item Id</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierItemId"
                                              :error-messages="supplierItemIdError"
                                              label="Supplier Item Id"
                                              required
                                              @input="$v.fvSupplierItemId.$touch()"
                                              @blur="$v.fvSupplierItemId.$touch()"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Item Name</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.itemName" label="Item Name"
                                              :error-messages="itemNameError"
                                              required
                                              @input="$v.fvItemName.$touch()"
                                              @blur="$v.fvItemName.$touch()"></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Supplier</v-subheader>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="editedItem.supplierId" label="Supplier Id"
                                              single-line
                                              :error-messages="supplierError"
                                              required
                                              @change="$v.fvSupplier.$touch()"
                                              readonly></v-text-field>
                            </v-flex>
                            <v-flex xs4 class="pl-3">
                                <v-btn block @click.native="selectSupplier">Select Supplier</v-btn>
                            </v-flex>
                        </v-layout>
                        <!--

                        <v-layout row>

                            <v-flex xs4>
                                <v-subheader>Supplier</v-subheader>
                            </v-flex>

                            <v-flex xs8>
                                <v-select v-model="editedItem.supplierId"
                                          :items="suppliers"
                                          item-text="supplierName"
                                          item-value="supplierId"
                                          label="Select a Supplier"
                                          single-line
                                          :error-messages="supplierError"
                                          required
                                          @change="$v.fvSupplier.$touch()"
                                          @blur="$v.fvSupplier.$touch()"
                                >
                                </v-select>
                            </v-flex>

                        </v-layout>
                        -->
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Description</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.itemDescription" label="Description"
                                              multi-line></v-text-field>
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
    import {bus} from "../main";
    import {validationMixin} from 'vuelidate'
    import {required} from 'vuelidate/lib/validators'
    import SupplierSelect from "./SupplierSelect";

    export default {
        name: "ItemList",
        components: {SupplierSelect},
        validations: {
            fvItemName: {
                required
            },
            fvSupplierItemId: {
                required
            },
            fvSupplier: {
                required
            }
        },
        created() {
            this.loadData();
            bus.$on(this.selectChannel, (data)=>{
                console.log('Supplier Item List received msg:', data);
                this.editedItem.supplierId = data;
                this.isSupplierDialogShown = false;
            });
        },
        beforeDestroy(){
            bus.$off(this.selectChannel)
        },
        data() {
            return {
                selectChannel:"supplierItemListSelect",
                mixins: [validationMixin],

                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isSupplierDialogShown: false,
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
                editedIndex: -1,
                removedIndex: -1,
                editedSupplierItemId: '',
                editedItem: {
                    id: '',
                    supplierItemId: '',
                    itemName: '',
                    supplierId: '',
                    itemDescription: ''
                },
                defaultItem: {
                    id: '',
                    supplierItemId: '',
                    itemName: '',
                    supplierId: '',
                    itemDescription: ''
                }
            };
        },

        computed: {
            fvItemName() {
                return this.editedItem.itemName;
            },
            fvSupplier() {
                return this.editedItem.supplierId;
            },
            fvSupplierItemId() {
                return this.editedItem.supplierItemId;
            },
            itemNameError() {
                const errors = [];
                if (!this.$v.fvItemName.$dirty) return errors;
                !this.$v.fvItemName.required && errors.push('Item Name is required');
                return errors
            },
            supplierError() {
                const errors = [];
                if (!this.$v.fvSupplier.$dirty) return errors;
                !this.$v.fvSupplier.required && errors.push('Supplier is required');
                return errors
            },
            supplierItemIdError() {
                const errors = [];
                if (!this.$v.fvSupplierItemId.$dirty) return errors;
                !this.$v.fvSupplierItemId.required && errors.push('Supplier Item ID is required');
                return errors
            },
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            }
        },
        watch: {
            isEditDialogShown: function (val) {
                val || this.close();
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('item').then(res => {
                    setTimeout(() => {
                        this.isLoadingData = false;
                    }, 300);
                    if (res.data.success) {
                        this.items = res.data.responseContent;
                        console.log(res.data.responseContent);
                    }
                });
            },
            selectSupplier() {
                this.isSupplierDialogShown = true;
            },
            editItem(item) {
                this.editedSupplierItemId = item.supplierItemId;
                this.editedIndex = this.items.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.isEditDialogShown = true;
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.items.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http.delete('item', this.items[this.removedIndex].supplierItemId).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.items.splice(this.removedIndex, 1);
                    }
                });
                this.cancel();
            },

            addItem() {
                this.isEditDialogShown = true;
            },

            close() {
                this.isEditDialogShown = false;
                this.editedSupplierItemId = '';
                setTimeout(() => {
                    this.$v.$reset();
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
            },

            save() {
                this.$v.$touch();
                if (this.$v.$invalid) return;
                if (this.editedIndex > -1) {
                    this.$http.put('item', this.editedSupplierItemId, this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.loadData();
                        }
                    });
                } else {
                    this.$http.post('item', this.editedItem).then(res => {
                        if (res.data.success) {
                            this.loadData();
                        }
                    });
                }
                this.close();
            }
        }
    }
</script>
