<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Blanket Purchase Order List</v-toolbar-title>
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

                    <v-btn icon class="mx-0" @click="pay(props.item)" v-if="userCanPay"
                           :disabled="!orderCanPay(props.item)">
                        <v-icon color="green">check</v-icon>
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


        <v-dialog v-model="isPayDialogShown" max-width="420">
            <v-card>
                <v-card-title class="headline">Pay Order</v-card-title>
                <v-card-text>Are you sure to paid the Purchase Order? Amount of the order will pay to supplier.<br/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click.native="cancel">Cancel</v-btn>
                    <v-btn color="green darken-1" flat @click.native="confirmPay">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import PurchaseOrderDetail from "./PurchaseOrderDetail";

    export default {
        name: "BlanketPurchaseOrder",
        components: {PurchaseOrderDetail},
        created() {
            this.loadData();
        },
        data() {
            return {
                isPayDialogShown: false,
                search: '',
                isLoadingData: false,
                isDetailDialogShown: false,
                pagination: {'sortBy': 'orderId', 'descending': true, 'rowsPerPage': 5},
                selectedPurchaseOrder: {},
                selectedPurchaseOrderId: 0,
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
                purchaseOrders: []
            }
        },
        computed: {
            userCanPay() {
                return this.$store.state.userType == 5 || this.$store.state.userType == 999
            }
        },
        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('blanketpurchaseorder').then(res => {
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
            orderCanPay(item) {
                return item.purchaseOrderStatus == "Received";
            },
            pay(item) {
                this.selectedPurchaseOrderId = item.orderId;
                this.isPayDialogShown = true;
            },
            confirmPay() {
                this.$http.put("blanketpurchaseorder", this.selectedPurchaseOrderId, {purchaseOrderStatus: 2}).then(res => {
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.isPayDialogShown = false;
            },
            cancel() {
                this.isPayDialogShown = false;
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