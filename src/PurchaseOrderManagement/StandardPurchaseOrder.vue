<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Standard Purchase Order List</v-toolbar-title>
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
            <v-btn icon @click.native="loadData">
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular
                        v-else size="25"
                        indeterminate
                        color="blue"
                ></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers"
                      :items="purchaseOrders"
                      class="elevation-1"
                      :search="search"
                      :pagination.sync="pagination"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.orderId }}</td>
                <td>{{ props.item.agreementId }}</td>
                <td>{{ props.item.request.restaurant.restaurantName }}</td>
                <td>{{ props.item.createTime }}</td>
                <td>{{ props.item.purchaseOrderStatus }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click.native="viewDetail(props.item)">
                        <v-icon color="blue">info</v-icon>
                    </v-btn>
                </td>
            </template>
            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>

        <!-- Table end -->

        <v-dialog v-model="isDetailDialogShown" max-width="1200">
            <v-card>
                <purchase-order-detail :purchase-order="selectedPurchaseOrder"></purchase-order-detail>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import PurchaseOrderDetail from "./PurchaseOrderDetail";

    export default {
        name: "StandardPurchaseOrder",
        components: {PurchaseOrderDetail},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false,
                isDetailDialogShown: false,
                selectedPurchaseOrder: {},
                pagination: {'sortBy': 'orderId', 'descending': true, 'rowsPerPage': 5},
                headers: [
                    {
                        text: 'Id',
                        value: 'orderId'
                    },
                    {
                        text: 'Agreement Id',
                        value: 'agreementId'
                    },
                    {
                        text: 'Restaurant',
                        value: 'request.restaurant.restaurantName'
                    },
                    {
                        text: 'Create Time',
                        value: 'createTime'
                    },
                    {
                        text: 'Status',
                        value: 'purchaseOrderStatus'
                    },
                    {
                        text: 'Actions',
                        value: 'action'
                    }
                ],
                purchaseOrders: [],
                removedIndex: -1
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('standardpurchaseorder').then(res => {
                    if (res.data.success) {
                        this.purchaseOrders = res.data.responseContent;
                        this.purchaseOrders.map(i => {
                            i.purchaseOrderStatus = this.getStatusName(i.purchaseOrderStatus);
                        });
                    }
                });
                setTimeout(() => this.isLoadingData = false, 300);
            },
            viewDetail(item) {
                this.selectedPurchaseOrder = item;
                this.isDetailDialogShown = true;
            },
            getStatusName(status) {
                switch (status) {
                    case 0:
                        return "Ordered";
                    case 1:
                        return "Received";
                    case 2:
                        return "Paid";
                    default:
                        return "Unknown";
                }
            }
        }
    }
</script>

<style scoped>

</style>