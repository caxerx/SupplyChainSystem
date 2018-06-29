<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Supplier List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="suppliers" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.supplierId }}</td>
                <td>{{ props.item.supplierName }}</td>
                <td>{{ props.item.supplierEmail }}</td>
                <td>{{ props.item.supplierPhoneNumber }}</td>
                <td>{{ props.item.supplierAddress }}</td>
                <td>{{ props.item.supplierContactPerson }}</td>
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
                                <v-subheader>Supplier Name</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierName" label="Supplier Name"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>E-Mail</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierEmail" type="email"
                                              label="E-Mail"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Phone Number</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierPhoneNumber"
                                              label="Phone Number"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Address</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierAddress" multi-line
                                              label="Address"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4>
                                <v-subheader>Contact Person</v-subheader>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field v-model="editedItem.supplierContactPerson"
                                              label="Contact Person"></v-text-field>
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
        name: "SupplierList",
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
                        text: "Supplier Id",
                        value: "supplierId"
                    },
                    {
                        text: "Supplier Name",
                        value: "supplierName"
                    },
                    {
                        text: "E-Mail",
                        value: "supplierEmail"
                    },
                    {
                        text: "Phone Number",
                        value: "supplierPhoneNumber"
                    },
                    {
                        text: "Address",
                        value: "supplierAddress"
                    },
                    {
                        text: "Contact Person",
                        value: "supplierContactPerson"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                suppliers: [],
                editedIndex: -1,
                removedIndex: -1,
                editedItem: {
                    supplierId: '',
                    supplierName: '',
                    supplierEmail: '',
                    supplierPhoneNumber: '',
                    supplierAddress: '',
                    supplierContactPerson: ''
                },
                defaultItem: {
                    supplierId: '',
                    supplierName: '',
                    supplierEmail: '',
                    supplierPhoneNumber: '',
                    supplierAddress: '',
                    supplierContactPerson: ''
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

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('supplier').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.suppliers = res.data.responseContent;
                        console.log(this.suppliers);
                    }
                });
            },
            editItem(item) {
                this.editedIndex = this.suppliers.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.isEditDialogShown = true;
            },

            deleteItem(item) {
                this.isConfirmDialogShown = true;
                this.removedIndex = this.suppliers.indexOf(item);
            },

            cancel() {
                this.isConfirmDialogShown = false;
            },
            confirm() {
                this.$http.delete('supplier', this.suppliers[this.removedIndex].supplierId).then(res => {
                    console.log(res);
                    if (res.data.success) {
                        this.suppliers.splice(this.removedIndex, 1);
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
                if (this.editedIndex > -1) {
                    this.$http.put('supplier', this.editedItem.supplierId, this.editedItem).then(res => {
                        console.log(res);
                        if (res.data.success) {
                            this.loadData();
                        }
                    });
                } else {
                    this.$http.post('supplier', this.editedItem).then(res => {
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