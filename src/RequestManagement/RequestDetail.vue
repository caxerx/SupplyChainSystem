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
                }
            },
            canEditRequest() {
                if (this.$store.state.userType == 1 && (this.requestDetail.requestStatus != 0 && this.requestDetail.requestStatus != -2)) {
                    return false;
                }
                return true;
            }
        }

    }
</script>

<style scoped>

</style>