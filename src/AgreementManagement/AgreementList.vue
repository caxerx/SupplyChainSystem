<template>
    <div>
        <!-- Table toolbar start -->
        <!-- TODO bind functions -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Agreement List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
                    v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn icon>
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
                <td>{{ props.item.userName }}</td>
                <td v-if="props.item.status==='Expired'" class="red--text">{{ props.item.status }}</td>
                <td v-else-if="props.item.status==='Active'" class="green--text">{{ props.item.status }}</td>
                <td v-else>{{ props.item.status }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click.native="viewDetail(props.item)">
                        <v-icon color="blue">info</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0">
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
                <agreement-detail :agreement="selectedAgreement"></agreement-detail>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import AgreementDetail from "./AgreementDetail";

    export default {
        name: "AgreementList",
        components: {AgreementDetail},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false,
                isDetailDialogShown: false,
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
                        value: 'userName'
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
                suppliers: []
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
            }
        }
    }
</script>

<style scoped>

</style>