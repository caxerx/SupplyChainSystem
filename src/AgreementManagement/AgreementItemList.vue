<template>
    <div>
        <v-stepper v-model="step">
            <v-stepper-header>
                <v-stepper-step :complete="step > 1" step="1">Basic Information</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="step > 2" step="2">Detailed Information</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">Select Items</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-layout class="px-3" row>
                        <v-flex xs4 class="px-3">
                            <h3>Agreement Type</h3>
                            <v-radio-group v-model="agreementType" required>
                                <v-radio label="Blanket Purchase Agreement" value="0"></v-radio>
                                <v-radio label="Contract Purchase Agreement" value="1"></v-radio>
                                <v-radio label="Planned Purchase Agreement" value="2"></v-radio>
                            </v-radio-group>
                        </v-flex>
                        <v-flex xs4 class="px-3">
                            <h3>Currency</h3>
                            <v-text-field label="Currency" required
                                          prepend-icon="attach_money"
                                          v-model="currency"></v-text-field>
                            <v-select prepend-icon="shopping_basket"
                                      required
                                      v-model="supplierId"
                                      :items="suppliers"
                                      item-value="supplierId"
                                      item-text="supplierName"
                                      placeholder="Select a supplier"></v-select>
                        </v-flex>
                        <v-flex xs4 class="px-3">
                            <h3>Start Date</h3>
                            <v-menu
                                    ref="startDateMenu"
                                    :close-on-content-click="false"
                                    v-model="startDateMenu"
                                    :nudge-right="40"
                                    :return-value.sync="date"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        v-model="startDate"
                                        label="Start Date"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker v-model="startDate"
                                               @input="$refs.startDateMenu.save(date)"></v-date-picker>

                            </v-menu>
                            <v-menu
                                    ref="expiryDateMenu"
                                    :close-on-content-click="false"
                                    v-model="expiryDateMenu"
                                    :nudge-right="40"
                                    :return-value.sync="date"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        v-model="expiryDate"
                                        label="Expiry Date"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker v-model="expiryDate"
                                               @input="$refs.expiryDateMenu.save(date)"></v-date-picker>

                            </v-menu>
                        </v-flex>
                    </v-layout>

                    <v-btn color="primary" @click.native="step = 2">Continue</v-btn>
                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                    <v-layout>
                        <v-flex xs6 class="mx-auto">
                            <template v-if="agreementType==='0'">
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Purchase Order Revision</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Purchase Order Revision" type="number"
                                                      v-model="details.purchaseOrderRevision"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Account</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Account" v-model="details.account"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Amount Agreed</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Amount" v-model="details.amount"
                                                      type="number"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </template>
                            <template v-if="agreementType==='1'">
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Account</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Account" v-model="details.account"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </template>
                            <template v-if="agreementType==='2'">
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Purchase Order Revision</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Purchase Order Revision" type="number"
                                                      v-model="details.purchaseOrderRevision"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Account</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Account" v-model="details.account"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Period</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Period" v-model="details.period"
                                                      type="number"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-subheader>Time Unit</v-subheader>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Time Unit" v-model="details.timeUnit"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </template>
                        </v-flex>
                    </v-layout>
                    <v-btn color="primary" @click.native="step = 1">Back</v-btn>
                    <v-btn color="primary" @click.native="step = 3">Continue</v-btn>
                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
                <v-stepper-content step="3">
                    <template>
                        <v-layout row>
                            <v-flex xs4>
                                <v-toolbar dark color="primary" class="elevation-0">
                                    <v-toolbar-title class="white--text">Items</v-toolbar-title>
                                    <v-text-field
                                            flat
                                            solo-inverted
                                            prepend-icon="search"
                                            label="Search"
                                            class="ml-3"
                                            v-model="search"
                                    ></v-text-field>
                                    <v-btn icon @click.native="loadData">
                                        <v-icon v-if="!isLoadingData">refresh</v-icon>
                                        <v-progress-circular
                                                v-else size="25"
                                                indeterminate
                                                color="blue"
                                        ></v-progress-circular>
                                    </v-btn>
                                </v-toolbar>
                                <v-data-table :items="supplierItems" :headers="supplierItemHeaders">
                                    <template slot="items" slot-scope="props">
                                        <td>{{ props.item.supplierItemId }}</td>
                                        <td>{{ props.item.itemName }}</td>
                                        <td class="layout px-0">
                                            <v-btn icon class="mx-0" @click="editItem(props.item)">
                                                <v-icon color="teal">edit</v-icon>
                                            </v-btn>
                                            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                                                <v-icon color="pink">delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                            <v-flex xs8>
                                <v-toolbar dark color="primary" class="elevation-0">
                                    <v-toolbar-title class="white--text">Agreement Item List</v-toolbar-title>
                                    <v-text-field
                                            flat
                                            solo-inverted
                                            prepend-icon="search"
                                            label="Search"
                                            class="ml-5"
                                            v-model="search"
                                    ></v-text-field>
                                </v-toolbar>
                                <v-data-table :items="[]"></v-data-table>
                            </v-flex>
                        </v-layout>
                    </template>
                    <v-btn color="primary" @click.native="step = 2">Back</v-btn>
                    <v-btn color="primary" @click.native="step = 1">Continue</v-btn>
                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    export default {
        name: "AgreementItemList",
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                step: 0,
                isLoadingData: false,
                supplierItemHeaders: [
                    {
                        text: "Id",
                        value: "supplierItemId"
                    },
                    {
                        text: "Item Name",
                        value: "itemName"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                agreementType: '',
                supplierId: '',
                currency: '',
                startDateMenu: false,
                startDate: '',
                expiryDate: '',

                expiryDateMenu: false,

                details: {
                    purchaseOrderRevision: '',
                    account: '',
                    amount: '',
                    period: '',
                    timeUnit: ''
                },
                suppliers: [],
                supplierItems: []

            }
        },
        methods: {
            loadData() {
                this.$http.get('supplier').then(res => {
                    if (res.data.success) {
                        this.suppliers = res.data.responseContent;
                    }
                });
                this.$http.get('item').then(res => {
                    if (res.data.success) {
                        this.supplierItems = res.data.responseContent;
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>