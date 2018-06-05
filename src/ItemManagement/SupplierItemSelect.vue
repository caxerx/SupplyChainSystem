<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Supplier Item List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
                    v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>

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
                    <v-btn icon class="mx-0" @click="selectItem(props.item)">
                        <v-icon color="blue">add</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->
    </div>
</template>

<script>
    import {bus} from "../main";

    export default {
        name: "SupplierItemSelect",
        created() {
            this.loadData();
        },
        props: ['channel'],
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
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
                suppliers: []
            };
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('supplier').then(res => {
                    if (res.data.success) {
                        this.suppliers = res.data.responseContent;
                        console.log(this.suppliers);
                    }
                }).then(() => {
                    this.$http.get('item').then(res => {
                        setTimeout(() => {
                            this.isLoadingData = false;
                        }, 300);
                        if (res.data.success) {
                            this.items = res.data.responseContent;
                            console.log(res.data.responseContent);
                            this.items.map(obj =>
                                obj['supplierName'] = this.suppliers.find(supplier =>
                                    supplier.supplierId === obj.supplierId).supplierName);
                        }
                    });
                });
            },
            selectItem(item) {
                bus.$emit(this.channel, item.supplierItemId)
            }
        }
    }
</script>

<style scoped>

</style>