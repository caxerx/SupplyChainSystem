<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Blanket Purchase Order List</v-toolbar-title>
            <v-text-field
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

        <v-dialog v-model="isDetailDialogShown" max-width="1200">
            <v-card>

            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    export default {
        name: "BlanketPurchaseOrder",
        created() {
            this.loadData();
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
                setTimeout(() => this.isLoadingData = false, 300);
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
            }
        }
    }
</script>

<style scoped>

</style>