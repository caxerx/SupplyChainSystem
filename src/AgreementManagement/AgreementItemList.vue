<template>
    <div>
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
                                <v-radio-group v-model="agreementType" :error-messages="agreementTypeError"
                                               required :disabled="editMode">
                                    <v-radio label="Blanket Purchase Agreement" value="0"
                                             :disabled="editMode"></v-radio>
                                    <v-radio label="Contract Purchase Agreement" value="1"
                                             :disabled="editMode"></v-radio>
                                    <v-radio label="Planned Purchase Agreement" value="2"
                                             :disabled="editMode"></v-radio>
                                </v-radio-group>
                            </v-flex>
                            <v-flex xs4 class="px-3">
                                <h3>Currency and Supplier</h3>
                                <v-text-field label="Currency"
                                              prepend-icon="attach_money"
                                              v-model="currency"
                                              :error-messages="currencyError"
                                              required
                                              @input="$v.currency.$touch()"
                                              @blur="$v.currency.$touch()"
                                              @chage="$v.currency.$touch()"
                                ></v-text-field>


                                <!--
                                <v-select prepend-icon="shopping_basket"
                                          required
                                          v-model="supplierId"
                                          :items="suppliers"
                                          item-value="supplierId"
                                          item-text="supplierName"
                                          placeholder="Select a supplier"></v-select>
                                -->


                                <v-layout>
                                    <v-flex xs6>
                                        <v-text-field prepend-icon="shopping_basket" label="Supplier Id"
                                                      required
                                                      v-model="supplierId"
                                                      readonly
                                                      :error-messages="supplierIdError"
                                                      required
                                                      @input="$v.supplierId.$touch()"
                                                      @blur="$v.supplierId.$touch()"
                                                      @chage="$v.supplierId.$touch()"
                                        ></v-text-field>
                                    </v-flex>

                                    <v-flex class="px-3" xs6>
                                        <v-btn block @click.native="selectSupplier">Select Supplier</v-btn>
                                    </v-flex>
                                </v-layout>


                            </v-flex>
                            <v-flex xs4 class="px-3">
                                <h3>Effective Period</h3>
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

                                            :error-messages="startDateError"
                                            required
                                            @input="$v.startDate.$touch()"
                                            @blur="$v.startDate.$touch()"
                                            @chage="$v.startDate.$touch()"
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

                                            :error-messages="expiryDateError"
                                            required
                                            @input="$v.expiryDate.$touch()"
                                            @blur="$v.expiryDate.$touch()"
                                            @chage="$v.expiryDate.$touch()"
                                    ></v-text-field>
                                    <v-date-picker v-model="expiryDate"
                                                   @input="$refs.expiryDateMenu.save(date)"></v-date-picker>

                                </v-menu>
                            </v-flex>
                        </v-layout>

                        <v-btn color="primary" @click.native="nextStep">Continue</v-btn>
                        <v-btn flat @click.native="close">Cancel</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-layout>
                            <v-flex xs6 class="pa-3">
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
                                            <v-text-field label="Amount" v-model="details.amountAgreed"
                                                          type="number" min="1"
                                            ></v-text-field>
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
                                                          type="number"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row>
                                        <v-flex xs4>
                                            <v-subheader>Time Unit</v-subheader>
                                        </v-flex>
                                        <v-flex xs8>
                                            <v-select v-model="details.timeUnit" :items="timeUnit" item-text="text"
                                                      item-value="code" label="Time Unit"
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </template>
                            </v-flex>
                            <v-flex xs6 class="pa-3">
                                <v-text-field multi-line label="Terms and Condition" rows="7"
                                              v-model="termsAndCondition"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-btn color="primary" @click.native="step = 1">Back</v-btn>
                        <v-btn color="primary" @click.native="nextStep">Continue</v-btn>
                        <v-btn flat @click.native="close">Cancel</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <template>
                            <v-layout row class="px-1 pb-4">
                                <v-flex xs4>
                                    <v-card>
                                        <v-toolbar dark color="primary" class="elevation-0">
                                            <v-toolbar-title class="white--text">Items</v-toolbar-title>
                                            <v-text-field
                                                    hide-details
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
                                        <v-data-table :items="filteredSupplierItems" :headers="supplierItemHeaders">
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.supplierItemId }}</td>
                                                <td>{{ props.item.itemName }}</td>
                                                <td class="layout px-0">
                                                    <v-btn icon class="mx-0" @click="addItem(props.item)">
                                                        <v-icon color="blue">add</v-icon>
                                                    </v-btn>
                                                </td>
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </v-flex>
                                <v-flex xs8 class="ml-3">
                                    <v-card>
                                        <v-toolbar dark color="primary" class="elevation-0">
                                            <v-toolbar-title class="white--text">Agreement Item List</v-toolbar-title>
                                            <v-text-field
                                                    hide-details
                                                    flat
                                                    solo-inverted
                                                    prepend-icon="search"
                                                    label="Search"
                                                    class="ml-5"
                                                    v-model="search"
                                            ></v-text-field>
                                        </v-toolbar>
                                        <v-data-table :items="agreementItems" :headers="agreementLinesHeaders">
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.supplierItemId }}</td>
                                                <td>{{ props.item.itemName }}</td>
                                                <td class="layout px-0">
                                                    <div v-if="agreementType==='1'" class="table-cell">
                                                        No line details is required
                                                    </div>

                                                    <template v-else>
                                                        <template v-if="agreementType==='0'">
                                                            <inline-input class="px-1" type="number" max-width="100px"
                                                                          label="Promised Qty"
                                                                          v-model="props.item.promisedQuantity"></inline-input>
                                                            <inline-input class="px-1" type="number" max-width="80px"
                                                                          label="Min Qty"
                                                                          v-model="props.item.minimumQuantity"></inline-input>
                                                        </template>
                                                        <template v-else-if="agreementType==='2'">
                                                            <inline-input class="px-1" type="number"
                                                                          max-width="60px" label="Qty"
                                                                          v-model="props.item.quantity"></inline-input>
                                                        </template>
                                                        <inline-input class="px-1"
                                                                      label="Unit" max-width="40px"
                                                                      v-model="props.item.unit"></inline-input>
                                                        <inline-input class="px-1" type="number" max-width="60px"
                                                                      label="Price"
                                                                      v-model="props.item.price"></inline-input>
                                                    </template>
                                                </td>
                                                <td>
                                                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                                                        <v-icon color="pink">delete</v-icon>
                                                    </v-btn>
                                                </td>
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-btn color="primary" @click.native="step = 2">Back</v-btn>
                        <v-btn color="primary" @click.native="submit">Submit</v-btn>
                        <v-btn flat @click.native="close">Cancel</v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
            <!-- Supplier Select Dialog start -->
            <v-dialog v-model="isSupplierDialogShown" max-width="900">
                <v-card>
                    <supplier-select :channel="selectChannel"></supplier-select>
                </v-card>
            </v-dialog>
            <!-- Supplier Select Dialog end -->
        </div>
    </div>
</template>

<script>
    import InlineInput from "../ItemManagement/InlineInput";
    import SupplierSelect from "../ItemManagement/SupplierSelect";
    import {bus} from "../main";
    import moment from "moment"

    import {validationMixin} from 'vuelidate'
    import {required, minValue} from 'vuelidate/lib/validators'

    export default {
        name: "AgreementItemList",
        components: {InlineInput, SupplierSelect},
        created() {
            this.loadData();
            let component = this;
            bus.$on('clearAgreementStepperData', () => {
                component.agreementType = '';
                component.supplierId = '';
                component.currency = '';
                component.startDate = '';
                component.expiryDate = '';
                component.termsAndCondition = '';
                component.details.purchaseOrderRevision = '';
                component.details.account = '';
                component.details.amountAgreed = '';
                component.details.period = '';
                component.details.timeUnit = '';
                component.step = 1;
                component.agreementId = '';
                component.agreementItems = [];
                component.editMode = false;
                console.log("stepper data cleared.");
                this.$v.$reset();
            });

            bus.$on('editAgreementStepperData', (data) => {
                console.log('Edit Agreement data:', data);
                component.editMode = true;
                component.agreementType = data.agreementType.toString();
                component.supplierId = data.supplierId;
                component.currency = data.currency;
                component.startDate = data.startDate;
                component.expiryDate = data.expiryDate;

                component.startDate = moment(component.startDate).format('YYYY-MM-DD');
                component.expiryDate = moment(component.expiryDate).format('YYYY-MM-DD');

                component.termsAndCondition = data.termsAndCondition;
                component.agreementId = data.agreementId;
                switch (component.agreementType) {
                    case '0':
                        component.details.purchaseOrderRevision = data.blanketPurchaseAgreementDetails.purchaseOrderRevision;
                        component.details.account = data.blanketPurchaseAgreementDetails.account;
                        component.details.amountAgreed = data.blanketPurchaseAgreementDetails.amountAgreed;
                        console.log('BPA Lines:', data.blanketPurchaseAgreementLines);
                        data.blanketPurchaseAgreementLines.map(bpaItem => {
                            for (let x in bpaItem.item) {
                                bpaItem[x] = bpaItem.item[x];
                            }
                        });
                        component.agreementItems = data.blanketPurchaseAgreementLines;
                        console.log('Agreement Items:', component.agreementItems);
                        break;
                    case '1':
                        component.details.account = data.contractPurchaseAgreementDetails.account;
                        data.contractPurchaseAgreementLines.map(cpaItem => {
                            for (let x in cpaItem.item) {
                                cpaItem[x] = cpaItem.item[x];
                            }
                        });
                        component.agreementItems = data.contractPurchaseAgreementLines;
                        break;
                    case '2':
                        component.details.purchaseOrderRevision = data.plannedPurchaseAgreementDetails.purchaseOrderRevision;
                        component.details.account = data.plannedPurchaseAgreementDetails.account;
                        component.details.period = data.plannedPurchaseAgreementDetails.period;
                        component.details.timeUnit = data.plannedPurchaseAgreementDetails.timeUnit;
                        data.plannedPurchaseAgreementLines.map(ppaItem => {
                            for (let x in ppaItem.item) {
                                ppaItem[x] = ppaItem.item[x];
                            }
                        });
                        component.agreementItems = data.plannedPurchaseAgreementLines;
                }
                component.step = 1;
                this.$v.$reset();
            });

            bus.$on(this.selectChannel, (data) => {
                console.log('Supplier Item List received msg:', data);
                this.supplierId = data;
                this.isSupplierDialogShown = false;
            });

        },
        destroyed() {
            bus.$off('clearAgreementStepperData');
            bus.$off('editAgreementStepperData');
            bus.$off(this.selectChannel)
        },
        validations: {
            agreementType: {
                required
            },
            currency: {
                required
            },
            supplierId: {
                required
            },
            startDate: {
                required
            },
            expiryDate: {
                required
            }
        },
        data() {
            return {
                isSupplierDialogShown: false,

                selectChannel: "agreementItemListSupplierSelect",

                mixins: [validationMixin],

                editMode: false,

                search: '',
                date: '',
                step: 1,
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
                agreementLinesHeaders: [
                    {
                        text: "Id",
                        value: "supplierItemId"
                    },
                    {
                        text: "Item Name",
                        value: "itemName"
                    },
                    {
                        text: "Line Detail",
                        align: "left",
                        value: "lineDetail"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                agreementId: '',
                agreementType: '',
                supplierId: '',
                currency: '',
                startDate: '',
                expiryDate: '',
                termsAndCondition: '',

                details: {
                    purchaseOrderRevision: '',
                    account: '',
                    amountAgreed: '',
                    period: '',
                    timeUnit: ''
                },


                timeUnit: [
                    {code: "day", text: "Day(s)"},
                    {code: "month", text: "Month(s)"},
                ],

                startDateMenu: false,
                expiryDateMenu: false,

                suppliers: [],
                supplierItems: [],
                agreementItems: []

            }
        },
        computed: {
            step1Invalid() {
                this.$v.agreementType.$touch();
                this.$v.currency.$touch();
                this.$v.supplierId.$touch();
                this.$v.startDate.$touch();
                this.$v.expiryDate.$touch();
                return this.$v.currency.$invalid || this.$v.supplierId.$invalid || this.$v.startDate.$invalid || this.$v.expiryDate.$invalid || this.$v.agreementType.$invalid;
            },
            agreementTypeError() {
                const errors = [];
                if (!this.$v.agreementType.$dirty) return errors;
                !this.$v.agreementType.required && errors.push('Agreement Type is required');
                return errors
            },
            currencyError() {
                const errors = [];
                if (!this.$v.currency.$dirty) return errors;
                !this.$v.currency.required && errors.push('Currency is required');
                return errors
            },
            supplierIdError() {
                const errors = [];
                if (!this.$v.supplierId.$dirty) return errors;
                !this.$v.supplierId.required && errors.push('Supplier Id is required');
                return errors
            },
            startDateError() {
                const errors = [];
                if (!this.$v.startDate.$dirty) return errors;
                !this.$v.startDate.required && errors.push('Start Date is required');
                return errors
            },
            expiryDateError() {
                const errors = [];
                if (!this.$v.expiryDate.$dirty) return errors;
                !this.$v.expiryDate.required && errors.push('Expiry Date is required');
                return errors
            },
            filteredSupplierItems() {
                return this.supplierItems.filter(supp => supp.supplierId === this.supplierId);
            }
        },
        methods: {
            selectSupplier() {
                this.isSupplierDialogShown = true;
            },
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
            },
            addItem(item) {
                this.agreementItems.push(item);
            },
            deleteItem(item) {
                this.agreementItems.splice(this.agreementItems[this.agreementItems.indexOf(item)], 1);
            },
            submit() {
                if (this.editMode) {
                    this.$http.put('agreement', this.agreementId, {
                        agreementType: this.agreementType,
                        currency: this.currency,
                        supplierId: this.supplierId,
                        startDate: this.startDate,
                        expiryDate: this.expiryDate,
                        termsAndCondition: this.termsAndCondition,
                        details: this.details,
                        items: this.agreementItems
                    }).then(res => {
                        if (res.data.success) {
                            console.log('Agreement saved successfully:', res);
                        } else {
                            console.log('Failed to save agreement:', res)
                        }
                        this.close();
                    });
                } else {
                    this.$http.post('agreement', {
                        agreementType: this.agreementType,
                        currency: this.currency,
                        supplierId: this.supplierId,
                        startDate: this.startDate,
                        expiryDate: this.expiryDate,
                        termsAndCondition: this.termsAndCondition,
                        details: this.details,
                        items: this.agreementItems
                    }).then(res => {
                        if (res.data.success) {
                            console.log('Agreement saved successfully:', res);
                        } else {
                            console.log('Failed to save agreement:', res)
                        }
                        this.close();
                    });
                }

            },
            close() {
                this.editMode = false;
                bus.$emit('closeAgreementStepper');
                this.$v.$reset();
            },
            nextStep() {
                if (this.step === 1 && this.step1Invalid) {
                    return;
                }
                this.step++;
            }
        }
    }
</script>

<style scoped>
    .table-cell {
        height: 100%;
        font-style: italic;
        color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>