<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Agreement List</v-toolbar-title>
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
            <v-btn icon @click.native="addItem">
                <v-icon>add</v-icon>
            </v-btn>
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
        <!-- TODO bind values -->
        <v-data-table :headers="headers"
                      :items="agreements"
                      class="elevation-1"
                      :search="search"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.agreementId }}</td>
                <td>{{ props.item.supplierName }}</td>
                <td>{{ props.item.agreementTypeName }}</td>
                <td>{{ props.item.startDate }}</td>
                <td>{{ props.item.expiryDate }}</td>
                <td>{{ props.item.name }}</td>
                <td v-if="props.item.status==='Expired'" class="red--text">{{ props.item.status }}</td>
                <td v-else-if="props.item.status==='Active'" class="green--text">{{ props.item.status }}</td>
                <td v-else>{{ props.item.status }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click.native="viewDetail(props.item)">
                        <v-icon color="blue">info</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click.native="editItem(props.item)">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click.native="deleteItem(props.item)">
                        <v-icon color="pink">delete</v-icon>
                    </v-btn>
                </td>
            </template>
            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>

        <!-- Table end -->

        <v-dialog v-model="isDetailDialogShown" max-width="1400">
            <v-card>
                <agreement-detail :agreement="selectedAgreement"></agreement-detail>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isEditDialogShown" max-width="1400">
            <v-card>
                <agreement-item-list></agreement-item-list>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isConfirmDialogShown" max-width="300">
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
    </div>
</template>

<script>
    import AgreementDetail from "./AgreementDetail";
    import AgreementItemList from "./AgreementItemList";
    import {bus} from "../main";

    export default {
        name: "AgreementList",
        components: {AgreementItemList, AgreementDetail},
        created() {
            this.loadData();
            bus.$on('closeAgreementStepper', () => {
                this.isEditDialogShown = false;
                this.loadData();
            })

        },
        destroyed() {
            bus.$off('closeAgreementStepper');
        },
        data() {
            return {
                search: '',
                isLoadingData: false,
                isDetailDialogShown: false,
                isEditDialogShown: false,
                isConfirmDialogShown: false,
                selectedAgreement: {},
                headers: [
                    {
                        text: 'Id',
                        value: 'agreementId'
                    },
                    {
                        text: 'Supplier',
                        value: 'supplierName'
                    },
                    {
                        text: 'Type',
                        value: 'agreementTypeName'
                    },
                    {
                        text: 'Start Date',
                        value: 'startDate'
                    },
                    {
                        text: 'Expiry Date',
                        value: 'expiryDate'
                    },
                    {
                        text: 'Creator',
                        value: 'name'
                    },
                    {
                        text: 'Status',
                        value: 'status'
                    },
                    {
                        text: 'Actions',
                        value: 'action'
                    }
                ],
                agreements: [],
                users: [],
                suppliers: [],
                removedIndex: -1
            }
        },
        watch: {
            isEditDialogShown(val) {
                val || this.close();
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('user').then(res => {
                    if (res.data.success) {
                        this.users = res.data.responseContent;
                    }
                    this.$http.get('supplier').then(res => {
                        if (res.data.success) {
                            this.suppliers = res.data.responseContent;
                        }
                        this.$http.get('agreement').then(res => {
                            if (res.data.success) {
                                this.agreements = res.data.responseContent;
                                this.agreements.map(ag => {
                                    let user = this.users.find(usr => ag.createBy === usr.userId);
                                    for (let x in user) {
                                        ag[x] = user[x];
                                    }
                                    let supplier = this.suppliers.find(sup => ag.supplierId === sup.supplierId);
                                    for (let x in supplier) {
                                        ag[x] = supplier[x];
                                    }
                                    ag.agreementTypeName = this.getAgreementType(ag.agreementType);
                                    ag.status = this.getStatus(ag);
                                });
                            }
                            this.isLoadingData = false;
                        });
                    })
                });
            },
            getAgreementType(id) {
                switch (id) {
                    case 0:
                        return 'Blanket';
                    case 1:
                        return 'Contract';
                    case 2:
                        return 'Planned';
                    default:
                        return '???';
                }
            },
            getStatus(item) {
                let startDate = new Date(item.startDate);
                let expiryDate = new Date(item.expiryDate);
                let sysDate = new Date();
                if (expiryDate.getTime() < sysDate.getTime()) {
                    return 'Expired';
                } else if (startDate.getTime() > sysDate.getTime()) {
                    return 'Not Started';
                } else {
                    return 'Active';
                }
            },
            viewDetail(item) {
                this.selectedAgreement = item;
                this.isDetailDialogShown = true;
            },
            addItem() {
                this.isEditDialogShown = true;
            },
            editItem(item) {
                this.isEditDialogShown = true;
                bus.$emit('editAgreementStepperData', item)
            },
            confirm() {
                this.$http.delete('agreement', this.agreements[this.removedIndex].agreementId, {}).then(res => {
                    if (res.data.success) {
                        console.log(`Agreement with id ${this.agreements[this.removedIndex].agreementId} deleted`);
                    }
                    this.loadData();
                    this.cancel();
                });
            },
            cancel() {
                this.isConfirmDialogShown = false;
                this.removedIndex = -1;
            },
            deleteItem(item) {
                this.removedIndex = this.agreements.indexOf(item);
                this.isConfirmDialogShown = true;
            },
            close() {
                this.isEditDialogShown = false;
                bus.$emit('clearAgreementStepperData');
            }
        }
    }
</script>

<style scoped>

</style>