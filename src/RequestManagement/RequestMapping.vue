<template>
    <v-container>
        <h1 class="display-1 primary--text mb-2">Request Mapping</h1>
        <v-layout align-center>
            <v-subheader>Filter</v-subheader>
            <v-checkbox label="BPA" v-model="filter.bpa" hide-details></v-checkbox>
            <v-checkbox label="Warehouse" v-model="filter.warehouse" hide-details></v-checkbox>
            <v-checkbox label="Failed" v-model="filter.failed" hide-details></v-checkbox>
        </v-layout>
        <v-expansion-panel v-for="(requestMap,i) in filteredRequestMaps" :key="i" class="mb-3">
            <v-expansion-panel-content>
                <v-divider/>
                <div slot="header" class="mr-3">
                    <v-layout>
                        <v-flex xs10 class="text">Request ID: {{requestMap.requestId}}</v-flex>
                        <v-flex xs2 style="text-align: center">{{requestMap.requestType}}</v-flex>
                    </v-layout>
                </div>
                <v-card>
                    <v-card-title class="title">Items</v-card-title>
                    <v-divider/>
                    <v-data-table hide-actions :items="requestMap.requestItems"
                                  :headers="headers">
                        <template slot="items" slot-scope="props">
                            <td>{{props.item.id}}</td>
                            <td>{{props.item.name}}</td>
                            <td>{{props.item.qty}}</td>
                        </template>
                    </v-data-table>
                    <v-divider/>
                    <v-list dense v-if="requestMap.requestType==='BPA'">
                        <v-list-tile>
                            <v-list-tile-content>Agreement ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.agreementId}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>Supplier:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.supplierName}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-list dense v-else-if="requestMap.requestType==='Warehouse'">
                        <v-list-tile>
                            <v-list-tile-content>Despatch Instruction ID:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{requestMap.despatchInstructionId}}
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                    <v-card v-else-if="requestMap.requestType==='Failed'">
                        <v-card-actions>
                            <v-spacer/>
                            <v-btn color="primary">
                                Create Standard Purchase Order
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-card>

            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-container>

</template>

<script>
    export default {
        name: "RequestMapping",
        created() {
            // SAMPLE DATA - FOR TESTING PURPOSE ONLY
            this.requestMaps = [{
                requestId: 'ANI1',
                requestType: 'BPA',
                agreementId: '41313',
                supplierName: 'ufotable',
                requestItems: [{
                    id: '123',
                    name: 'Fate/Stay Night Unlimited Blade Works',
                    qty: '122'
                },]
            }, {
                requestId: 'ANI2',
                requestType: 'Failed',
                requestItems: [{
                    id: '323',
                    name: 'Accel World',
                    qty: '122'
                },]
            }, {
                requestId: 'ANI3',
                requestType: 'Warehouse',
                despatchInstructionId: '123',
                requestItems: [{
                    id: '123',
                    name: 'POP TEAM EPIC',
                    qty: '122'
                },]
            }]
        },
        data() {
            return {
                requestMaps: [],
                headers: [
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
                filter: {
                    bpa: false,
                    warehouse: false,
                    failed: false
                }
            }
        },
        computed: {
            filteredRequestMaps() {
                if (this.filter.bpa || this.filter.warehouse || this.filter.failed) {
                    let result = [];
                    this.requestMaps.forEach(req => {
                        if (this.filter.bpa && req.requestType === 'BPA') {
                            result.push(req);
                        } else if (this.filter.warehouse && req.requestType === 'Warehouse') {
                            result.push(req);
                        } else if (this.filter.failed && req.requestType === 'Failed') {
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
                this.$http.get('')
            }
        }
    }
</script>

<style scoped>
    .v-center {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
    }
</style>