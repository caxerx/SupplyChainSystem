<template>
    <div>
        <v-card class="pa-3" color="grey lighten-3">
            <v-layout row>
                <v-flex xs4 class="mr-3">
                    <v-card>
                        <v-card-title>
                            <h4>Agreement Details</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Agreement Id:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ agreement.agreementId }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Agreement Type:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ agreementTypeName }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Terms and Condition:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    <v-btn @click.native="isTermsAndConditionShown=true" small depressed color="grey lighten-2">View</v-btn>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-divider></v-divider>
                            <!-- Blanket Purchase Agreement -->
                            <template v-if="agreement.agreementType===0">
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Purchase Order Revision:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.blanketPurchaseAgreementDetails.purchaseOrderRevision }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Account:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.blanketPurchaseAgreementDetails.account }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Amount agreed:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.blanketPurchaseAgreementDetails.amountAgreed }}
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                            <!-- Contract Purchase Agreement -->
                            <template v-else-if="agreement.agreementType===1">
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Account:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.contractPurchaseAgreementDetails.account }}
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                            <!-- Planned Purchase Agreement -->
                            <template v-else-if="agreement.agreementType===2">
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Purchase Order Revision:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.plannedPurchaseAgreementDetails.purchaseOrderRevision }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Account:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.plannedPurchaseAgreementDetails.account }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Period:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.plannedPurchaseAgreementDetails.period }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>
                                        Time Unit:
                                    </v-list-tile-content>
                                    <v-list-tile-content class="align-end">
                                        {{ agreement.plannedPurchaseAgreementDetails.timeUnit }}
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                        </v-list>
                    </v-card>
                </v-flex>

                <v-flex xs8>
                    <template v-if="agreement.agreementType===0">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title class="white--text">BPA Lines</v-toolbar-title>
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
                        <v-data-table :headers="bpaHeaders"
                                      :items="agreement.blanketPurchaseAgreementLines"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.supplierItemId }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.promisedQuantity }}</td>
                                <td>{{ props.item.minimumQuantity }}</td>
                                <td>{{ props.item.unit }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                    <template v-else-if="agreement.agreementType===1">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title class="white--text">CPA Lines</v-toolbar-title>
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
                        <v-data-table :headers="cpaHeaders"
                                      :items="agreement.contractPurchaseAgreementLines"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.supplierItemId }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.item.itemDescription }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                    <template v-else-if="agreement.agreementType===2">
                        <v-toolbar dark color="primary" class="elevation-0">
                            <v-toolbar-title class="white--text">PPA Lines</v-toolbar-title>
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
                        <v-data-table :headers="ppaHeaders"
                                      :items="agreement.plannedPurchaseAgreementLines"
                                      class="elevation-1"
                                      :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.supplierItemId }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.item.itemDescription }}</td>
                                <td>{{ props.item.quantity }}</td>
                                <td>{{ props.item.unit }}</td>
                                <td>{{ props.item.price }}</td>
                            </template>
                            <template slot="no-data">
                                No Data!
                            </template>
                        </v-data-table>
                    </template>

                </v-flex>
            </v-layout>
        </v-card>
        <v-dialog v-model="isTermsAndConditionShown" max-width="700">
            <v-card class="pa-4">
                <h1>Terms and Condtion</h1>
                <v-divider></v-divider>
                <div class="pa-2">
                    {{ agreement.termsAndCondition }}
                </div>
            </v-card>

        </v-dialog>
    </div>
</template>

<script>
    export default {
        name: "AgreementDetail",
        props: ['agreement'],
        data() {
            return {
                search: '',
                isLoadingData: false,
                isTermsAndConditionShown: false,
                bpaHeaders: [
                    {
                        text: 'Item Id',
                        value: 'item.supplierItemId'
                    },
                    {
                        text: 'Name',
                        value: 'item.itemName'
                    },
                    {
                        text: 'Promised Quantity',
                        value: 'promisedQuantity'
                    },
                    {
                        text: 'Minimum Quantity',
                        value: 'minimumQuantity'
                    },
                    {
                        text: 'Unit',
                        value: 'unit'
                    }
                ],
                cpaHeaders: [
                    {
                        text: 'Item Id',
                        value: 'item.supplierItemId'
                    },
                    {
                        text: 'Name',
                        value: 'item.itemName'
                    },
                    {
                        text: 'Description',
                        value: 'item.itemDescription'
                    }
                ],
                ppaHeaders: [
                    {
                        text: 'Item Id',
                        value: 'item.supplierItemId'
                    },
                    {
                        text: 'Name',
                        value: 'item.itemName'
                    },
                    {
                        text: 'Description',
                        value: 'item.itemDescription'
                    },
                    {
                        text: 'Quantity',
                        value: 'quantity'
                    },
                    {
                        text: 'Unit',
                        value: 'unit'
                    },
                    {
                        text: 'Price',
                        value: 'price'
                    }
                ],
            }
        },
        computed: {
            agreementTypeName() {
                switch (this.agreement.agreementType) {
                    case 0:
                        return 'Blanket Purchase Agreement';
                    case 1:
                        return 'Contract Purchase Agreement';
                    case 2:
                        return 'Planned Purchase Agreement';
                    default:
                        return 'Unknown';
                }

            }
        }
    }
</script>

<style scoped>

</style>