<template>
    <div>
        <v-card class="pa-3" color="grey lighten-3">
            <v-layout>
                <v-flex xs4 class="mr-3">
                    <v-card>
                        <v-card-title>
                            <h4>Request Summary</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>Request ID:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ requestDetail.requestId }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Created On:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ requestDetail.createTime.replace('T',' ') }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Created By:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ requestDetail.user.name }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>Status:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ requestStatusName }}</v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>

                    <v-card class="mt-2" v-if="requestDetail.requestMap">
                        <v-card-title>
                            <h4>Delivery Summary</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>Delivery Type:</v-list-tile-content>
                                <v-list-tile-content class="align-end">{{ mapType }}
                                </v-list-tile-content>
                            </v-list-tile>

                            <div v-if="requestDetail.requestMap.mapType==0">
                                <v-list-tile>
                                    <v-list-tile-content>Order On:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.blanketRelease.createTime.replace('T',' ') }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>Supplier:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.requestMap.agreement.supplier.supplierName }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>Order Id:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.blanketRelease.orderId }}
                                    </v-list-tile-content>
                                </v-list-tile>
                            </div>


                            <div v-if="requestDetail.requestMap.mapType==1">
                                <v-list-tile>
                                    <v-list-tile-content>Order On:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.standardPurchaseOrder.createTime.replace('T',' ') }}
                                    </v-list-tile-content>
                                </v-list-tile>

                                <v-list-tile>
                                    <v-list-tile-content>Supplier:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.requestMap.agreement.supplier.supplierName }}
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-list-tile>
                                    <v-list-tile-content>Order Id:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.standardPurchaseOrder.orderId }}
                                    </v-list-tile-content>
                                </v-list-tile>
                            </div>


                            <div v-if="requestDetail.requestMap.mapType==2">
                                <v-list-tile v-if="requestDetail.despatchInstruction.despatchInstructionStatus==1">
                                    <v-list-tile-content>Delivery Note Id:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{ requestDetail.deliveryNote.deliveryNoteId
                                        }}
                                    </v-list-tile-content>
                                </v-list-tile>

                                <v-list-tile v-if="requestDetail.despatchInstruction.despatchInstructionStatus==0">
                                    <v-list-tile-content>Update On:</v-list-tile-content>
                                    <v-list-tile-content class="align-end">{{
                                        requestDetail.despatchInstruction.createTime.replace('T',' ') }}
                                    </v-list-tile-content>
                                </v-list-tile>

                                <div v-if="requestDetail.despatchInstruction.despatchInstructionStatus==1">


                                    <v-list-tile>
                                        <v-list-tile-content>Update On:</v-list-tile-content>
                                        <v-list-tile-content class="align-end">{{
                                            requestDetail.deliveryNote.createTime.replace('T',' ') }}
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-content>Delivery On:</v-list-tile-content>
                                        <v-list-tile-content class="align-end">{{
                                            requestDetail.deliveryNote.createTime.replace('T',' ') }}
                                        </v-list-tile-content>
                                    </v-list-tile>

                                </div>
                            </div>


                        </v-list>
                    </v-card>


                </v-flex>
                <v-flex xs8>
                    <!-- Table toolbar start -->
                    <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                        <v-toolbar-title class="white--text">Request Item List</v-toolbar-title>
                        <v-spacer></v-spacer>

                        <v-btn icon @click="editItem" v-if="canEditRequest">
                            <v-icon>edit</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <!-- Table toolbar end -->

                    <!-- Table start -->
                    <v-data-table :headers="requestHeaders" :items="requestItems" class="elevation-1">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.virtualItemId }}</td>
                            <td>{{ props.item.virtualItemName }}</td>
                            <td>{{ props.item.quantity }}</td>
                        </template>

                        <template slot="no-data">
                            No Data!
                        </template>
                    </v-data-table>
                    <!-- Table end -->
                </v-flex>
            </v-layout>
        </v-card>

    </div>
</template>

<script>
    import {bus} from "../main";

    export default {
        name: "RequestDetail",
        created() {
            let component = this;
            bus.$on('refreshRequestDetail', () => {
                component.loadData();
            });
        },
        beforeDestroy() {
            bus.$off('refreshRequestDetail');
        },
        props: ['request'],
        data() {
            return {
                requestHeaders: [
                    //Table header data
                    {
                        text: "Virtual Item Id",
                        value: "virtualItemId"
                    },
                    {
                        text: "Item Name",
                        value: "virtualItemName"
                    },
                    {
                        text: "Quantity",
                        value: "quantity"
                    }
                ],
                requestDetail: {
                    createTime: '',
                    user: {
                        name: ''
                    }
                },
                requestItems: []
            }
        },
        watch: {
            request() {
                this.loadData();
            }
        },
        methods: {
            loadData() {
                if (this.request) {
                    this.$http.get(`purchaserequest/${this.request}`).then(res => {
                        if (res.data.success) {
                            this.requestDetail = res.data.responseContent;
                            this.requestItems = res.data.responseContent.requestItem;
                            let req = res.data.responseContent.requestItem;
                            req.map(x => {
                                x.virtualItemId = x.requestVirtualItemId;
                            });
                        }
                    });
                }
            },
            editItem() {
                bus.$emit("requestListEditRequest");
            }
        },
        computed: {
            mapType() {
                switch (this.requestDetail.requestMap.mapType) {
                    case 0:
                        return "Blanket Release";
                    case 1:
                        return "Standard Purchase Order";
                    case 2:
                        return "Warehouse";
                }
            },
            requestStatusName() {
                switch (this.requestDetail.requestStatus) {
                    case -2:
                        return "Process Failed";
                    case -1:
                        return "Cancelled";
                    case 0:
                        return "Waiting For Process";
                    case 1:
                        return "Processing";
                    case 2:
                        return "Ordered";
                    case 3:
                        return "Delivering";
                    case 4:
                        return "Delivered";
                    case 5:
                        return "Waiting For Despatch";
                }
            },
            canEditRequest() {
                if (this.$store.state.userType == 1 && ((this.requestDetail.requestStatus != 0 && this.requestDetail.requestStatus != -2) || this.$store.state.userId != this.requestDetail.requestCreator)) {
                    return false;
                }
                return true;

            }
        }

    }
</script>

<style scoped>

</style>