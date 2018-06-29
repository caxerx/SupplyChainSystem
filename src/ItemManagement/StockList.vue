<template>
    <div>
        <stock-item-list :stock="myStock"></stock-item-list>
    </div>
</template>

<script>
    import StockItemList from "./StockItemList";

    export default {
        name: "StockList",
        components: {StockItemList},
        created() {
            this.loadData();
        },
        data() {
            return {
                myStock: 0,
                search: '',
                isLoadingData: false, //Loading state
                isEditDialogShown: false, //Edit dialog
                isConfirmDialogShown: false, //Confirm dialog
                isItemDialogShown: false,
                headers: [
                    //Table header data
                    {
                        text: "Stock Id",
                        align: "left",
                        value: "stockId"
                    },
                    {
                        text: "Stock Type",
                        value: "stockType"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                stockItems: [], //User data, ajax fetch reserve
                selectedStock: '',
                editedIndex: -1,
                removedIndex: -1,
                editedSupplierItemId: '',
                editedItem: {
                    stockId: '',
                    stockType: ''
                },
                defaultItem: {
                    stockId: '',
                    stockType: ''
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

                this.$http.get('mystock').then(res => {
                    this.myStock = res.data.responseContent.stock;
                }).then(() => {

                    this.$http.get('stockitem').then(res => {
                        setTimeout(() => {
                            this.isLoadingData = false;
                        }, 300);
                        if (res.data.success) {
                            this.stockItems = res.data.responseContent;
                            console.log(res.data.responseContent);
                        }
                    });
                });

            },
            viewItem(item) {
                this.selectedStock = item.stockId;
                this.isItemDialogShown = true;
            },
            close() {
                this.isItemDialogShown = false;
            }
        }
    }
</script>

<style scoped>
    /*
    <!-- Table toolbar start -->
            <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                <v-toolbar-title class="white--text">Stock List</v-toolbar-title>
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
            <v-data-table :headers="headers" :items="stockItems" class="elevation-1" :search="search"
                          :rows-per-page-items="this.$store.state.rowPerPage">
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.stockId }}</td>
                    <td>{{ props.item.stockType }}</td>
                    <td class="layout px-0">
                        <v-btn icon class="mx-0" @click="viewItem(props.item)">
                            <v-icon color="blue">category</v-icon>
                        </v-btn>
                        <!-- You should not be able to delete a stock directly ?
                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                            <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn>
                        -->
                    </td>
                </template>

                <template slot="no-data">
                    No Data!
                </template>
            </v-data-table>
            <!-- Table end -->
     */
</style>