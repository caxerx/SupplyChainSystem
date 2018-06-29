<template>
    <div>
        <v-card class="pa-3" color="grey lighten-3" v-if="purchaseOrder.orderId">
            <v-layout row>
                <v-flex xs4 class="mr-3">
                    <v-card>
                        <v-card-title>
                            <h4>Purchase Order Details</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Agreement Id:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ purchaseOrder.agreementId }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="purchaseOrder.request">
                                <v-list-tile-content>
                                    Create Time:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ purchaseOrder.request.createTime.replace('T',' ') }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="purchaseOrder.request && purchaseOrder.request.restaurant">
                                <v-list-tile-content>
                                    Restaurant:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ purchaseOrder.request.restaurant.restaurantName }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Supplier:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ purchaseOrder.agreement.supplier.supplierName }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="!purchaseOrder.agreement.plannedPurchaseAgreementLines">
                                <v-list-tile-content>
                                    Status:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ purchaseOrderStatusName }}
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>

                <v-flex xs8>
                    <template v-if="purchaseOrder.blanketReleaseLine">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title>Blanket Release Line</v-toolbar-title>
                            <v-text-field
                                    flat
                                    solo-inverted
                                    prepend-icon="search"
                                    label="Search"
                                    class="ml-5"
                                    v-model="search"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-data-table :headers="headers"
                                      :items="purchaseOrder.blanketReleaseLine"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.id }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                    <template v-else-if="purchaseOrder.standardPurchaseOrderLine">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title>Standard Purchase Order Line</v-toolbar-title>
                            <v-text-field
                                    flat
                                    solo-inverted
                                    prepend-icon="search"
                                    label="Search"
                                    class="ml-5"
                                    v-model="search"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-data-table :headers="headers"
                                      :items="purchaseOrder.standardPurchaseOrderLine"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.id }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                    <template v-else-if="purchaseOrder.agreement.plannedPurchaseAgreementLines">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title>Planned Purchase Order Line</v-toolbar-title>
                            <v-text-field
                                    flat
                                    solo-inverted
                                    prepend-icon="search"
                                    label="Search"
                                    class="ml-5"
                                    v-model="search"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-data-table :headers="headers"
                                      :items="purchaseOrder.agreement.plannedPurchaseAgreementLines"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.id }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "PurchaseOrderDetail",
        props: ['purchaseOrder'],
        data() {
            return {
                search: '',
                isLoadingData: false,
                headers: [
                    {
                        text: 'Item Id',
                        value: 'item.supplierItemId'
                    },
                    {
                        text: 'Item Name',
                        value: 'item.itemName'
                    },
                    {
                        text: 'Quantity',
                        value: 'quantity'
                    }
                ],
            }
        },
        computed: {
            purchaseOrderStatusName() {
                switch (this.purchaseOrder.purchaseOrderStatus) {
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
        },
        watch: {
            purchaseOrder() {
                console.log(this.purchaseOrder);
            }
        }
    }
</script>

<style scoped>

</style>