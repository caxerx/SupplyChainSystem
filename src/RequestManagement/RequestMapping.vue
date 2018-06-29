<template>
    <v-container>
        <h1 class="display-1 primary--text mb-2">Request Mapping</h1>
        <v-layout align-center>
            <v-subheader>Filter</v-subheader>
            <v-checkbox label="BPA" v-model="filter.bpa" hide-details></v-checkbox>
            <v-checkbox label="Warehouse" v-model="filter.warehouse" hide-details></v-checkbox>
            <v-checkbox label="Failed" v-model="filter.failed" hide-details></v-checkbox>
        </v-layout>
        <v-layout align-center class="mb-3">
            <v-subheader>Last success mapping time:</v-subheader>
            <div>{{ lastSuccess }}</div>
            <v-spacer/>
            <v-btn color="primary" @click.native="execute">Execute Request Mapping</v-btn>
        </v-layout>
        <v-expansion-panel v-for="(requestMap,i) in filteredRequestMaps" :key="i" class="mb-3">
            <v-expansion-panel-content>
                <v-divider/>
                <div slot="header" class="mr-3">
                    <v-layout>
                        <v-flex xs10 class="text">Request ID: {{requestMap.requestId}}</v-flex>
                        <v-flex xs2 style="text-align: center">
                            {{ requestMap.mapStatus.success?requestMap.mapStatus.type:'Failed' }}
                        </v-flex>
                    </v-layout>
                </div>
                <v-card>
                    <template v-if="!requestMap.mapStatus.success">
                        <v-card-title class="title">Requested Items</v-card-title>
                        <v-divider/>
                        <v-data-table hide-actions :items="requestMap.requestMap.request.requestItem"
                                      :headers="headers">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.virtualItem.virtualItemId }}</td>
                                <td>{{ props.item.virtualItem.virtualItemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                            </template>
                        </v-data-table>
                    </template>
                    <template v-else-if="requestMap.mapStatus.type==='Warehouse'">
                        <v-card-title class="title">Despatch Instruction Lines</v-card-title>
                        <v-divider/>
                        <v-data-table hide-actions :items="requestMap.requestMap.request.requestItem"
                                      :headers="headers">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.virtualItem.virtualItemId }}</td>
                                <td>{{ props.item.virtualItem.virtualItemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                            </template>
                        </v-data-table>
                    </template>
                    <template v-else-if="requestMap.mapStatus.type==='BPA'">
                        <v-card-title class="title">Blanket Purchase Agreement Lines</v-card-title>
                        <v-divider/>
                        <v-data-table hide-actions
                                      :items="requestMap.requestMap.request.blanketRelease.blanketReleaseLine"
                                      :headers="bpaHeaders">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.item.supplierItemId }}</td>
                                <td>{{ props.item.item.itemName }}</td>
                                <td>{{ props.item.quantity }}</td>
                                <td>{{ props.item.price }}</td>
                            </template>
                        </v-data-table>
                    </template>

                    <v-divider/>

                    <v-list dense v-if="requestMap.mapStatus.type==='BPA'">
                        <v-list-tile>
                            <v-list-tile-content>Agreement ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.requestMap.agreementId}}
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>Supplier:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.supplier.supplierName}}
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-list dense v-else-if="requestMap.mapStatus.type==='Warehouse'">
                        <v-list-tile>
                            <v-list-tile-content>Despatch Instruction ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.requestMap.despatchInstructionId}}
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-card v-else-if="!requestMap.mapStatus.success">
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary" @click.native="createPurchaseOrder(requestMap)">
                                Create Standard Purchase Order
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-dialog v-model="isCreateDialogShown" max-width="1000">
            <v-card>
                <v-toolbar prominent color="primary" dark>
                    <v-toolbar-title>Contracts</v-toolbar-title>
                </v-toolbar>
                <v-data-table :items="createContracts" :headers="cpaHeaders">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.agreementId }}</td>
                        <td>{{ props.item.supplier.supplierName }}</td>
                        <td>{{ props.item.startDate }}</td>
                        <td>{{ props.item.expiryDate }}</td>
                        <td>
                            <v-btn icon @click.native="mapRequest(props.item)">
                                <v-icon color="blue">check</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-card>
        </v-dialog>
        <v-snackbar right bottom v-model="snackbar">
            {{ message }}
            <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-container>

</template>

<script>
    import moment from 'moment'

    export default {
        name: "RequestMapping",
        created() {
            this.loadData();
        },
        data() {
            return {
                message: '',
                snackbar: false,
                lastSuccess: '',
                requestMaps: [],
                createContracts: [],
                createRequestId: 0,
                isCreateDialogShown: false,
                headers:
                    [
                        {
                            text: 'id',
                            value: 'id'
                        },
                        {
                            text: 'Name',
                            value: 'name'
                        },
                        {
                            text: 'Qty',
                            value: 'qty'
                        }],
                cpaHeaders:
                    [
                        {
                            text: 'Agreement Id',
                            value: 'agreementId'
                        },
                        {
                            text: 'Supplier',
                            value: 'supplierName'
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
                            text: 'Actions',
                            value: 'action',
                            sortable: false
                        }
                    ],
                bpaHeaders:
                    [
                        {
                            text: 'id',
                            value: 'id'
                        },
                        {
                            text: 'Name',
                            value: 'name'
                        },
                        {
                            text: 'Qty',
                            value: 'qty'
                        },
                        {
                            text: 'Price',
                            value: 'price'
                        }],
                filter:
                    {
                        bpa: false,
                        warehouse:
                            false,
                        failed:
                            false
                    }
            }
        },
        computed: {
            filteredRequestMaps() {
                if (this.requestMaps.length === 0) return [];
                if (this.filter.bpa || this.filter.warehouse || this.filter.failed) {
                    let result = [];
                    this.requestMaps.forEach(req => {
                        if (this.filter.failed && !req.mapStatus.success) {
                            result.push(req);
                        } else if (this.filter.bpa && req.mapStatus.type === 'BPA') {
                            result.push(req);
                        } else if (this.filter.warehouse && req.mapStatus.type === 'Warehouse') {
                            result.push(req);
                        }
                    });
                    return result;
                }
                return this.requestMaps;
            }
        },
        methods: {
            loadData() {
                this.$http.get('maprequest').then(res => {
                    if (res.data.success) {
                        this.lastSuccess = moment(res.data.responseContent.lastSuccess).format('YYYY-MM-DD HH:mm:ss');
                        this.requestMaps = res.data.responseContent.maps;
                        console.log('Maps:', this.requestMaps);
                        console.log('Filtered maps:', this.filteredRequestMaps);
                    }
                })
            },
            createPurchaseOrder(map) {
                console.log('Created:', map);
                this.createContracts = map.contractMatched;
                this.createRequestId = map.requestId;
                console.log('Matched Contracts:', this.createContracts);
                this.isCreateDialogShown = true;
            },
            mapRequest(item) {
                this.$http.post(`maprequest/${this.createRequestId}`, {agreementId: item.agreementId}).then(res => {
                    if (res.data.success) {
                        console.log('Request mapped successfully');
                        this.message = 'Standard Purchase Order created successfully';
                        this.snackbar = true;
                    }
                });
                this.isCreateDialogShown = false;
            },
            execute() {
                this.$http.post('maprequest').then(res => {
                    if (res.data.success) {
                        this.loadData();
                        this.message = 'Request mapped successfully';
                        this.snackbar = true;
                    }
                })
            }
        }
    }
</script>