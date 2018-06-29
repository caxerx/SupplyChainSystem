<template>
    <div>
        <!-- Table toolbar start -->
        <!-- TODO bind functions -->
        <v-toolbar dark color="primary" class="elevation-0">
            <v-toolbar-title class="white--text">Request List</v-toolbar-title>
            <v-text-field
                    flat
                    solo-inverted
                    prepend-icon="search"
                    label="Search"
                    class="ml-5"
                    v-model="search"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-tooltip top>
                <v-btn icon @click.native="addItem" slot="activator">
                    <v-icon>add</v-icon>
                </v-btn>
                <span>Create Request</span>
            </v-tooltip>
            <v-tooltip top>
                <v-btn icon @click.native="loadData" slot="activator">
                    <v-icon v-if="!isLoadingData">refresh</v-icon>
                    <v-progress-circular
                            v-else size="25"
                            indeterminate
                            color="blue"
                    ></v-progress-circular>
                </v-btn>
                <span>Refresh</span>
            </v-tooltip>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <!-- TODO bind values -->
        <v-data-table :headers="headers"
                      :items="requests"
                      class="elevation-1"
                      :search="search"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.requestId }}</td>
                <td>{{ props.item.restaurantName }} ({{ props.item.restaurantId }})</td>
                <td>{{ props.item.name }}</td>
                <td><span v-if="props.item.requestStatus===-1||props.item.requestStatus===-2" class="red--text">{{ props.item.requestStatusName }}</span>
                    <template v-else>{{ props.item.requestStatusName }}</template>
                </td>
                <td>{{ moment(props.item.createTime).format("YYYY-MM-DD HH:mm:ss")}}
                </td>
                <td class="layout px-0">
                    <v-tooltip top>
                        <v-btn icon class="mx-0" @click.native="viewItem(props.item)" slot="activator">
                            <v-icon color="blue">info</v-icon>
                        </v-btn>
                        <span>View Detail</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <v-btn icon class="mx-0" @click.native="editItem(props.item)" slot="activator"
                               :disabled="!canEditRequest(props.item)">
                            <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <span v-if="canEditRequest(props.item)">Edit</span>
                        <span v-else>You cannot edit this request</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <v-btn icon class="mx-0" @click.native="cancelRequest(props.item)" slot="activator"
                               :disabled="!isCancellable(props.item)">
                            <v-icon color="red">clear</v-icon>
                        </v-btn>
                        <span v-if="isCancellable(props.item)">Cancel</span>
                        <span v-else-if="props.item.requestCreator != $store.state.userId">You are not the creator</span>
                        <span v-else>Request already processed</span>
                    </v-tooltip>

                    <v-tooltip top>
                        <v-btn icon class="mx-0" @click.native="receiveConfirm(props.item)" slot="activator"
                               :disabled="!canConfirmRequest(props.item)">
                            <v-icon color="green">check</v-icon>
                        </v-btn>
                        <span v-if="canConfirmRequest(props.item)">Received Confirm</span>
                        <span v-else>Request already not processed or finished</span>
                    </v-tooltip>

                </td>
            </template>
            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>

        <!-- Table end -->
        <!-- Edit dialog start -->
        <v-dialog v-model="isEditDialogShown">
            <v-card>
                <request-item-list :request="selectedRequest"></request-item-list>
            </v-card>
        </v-dialog>
        <!-- Edit dialog end -->
        <!-- Detail dialog start -->
        <v-dialog v-model="isDetailDialogShown" max-width="1000">
            <v-card>
                <request-detail :request="selectedRequest"></request-detail>
            </v-card>
        </v-dialog>
        <!-- Detail dialog end -->
        <!-- Cancel Confirm Dialog start -->
        <v-dialog v-model="isCancelDialogShown" max-width="290">
            <v-card>
                <v-card-title class="headline">Cancel Request</v-card-title>
                <v-card-text>Are you sure to cancel the request? This action is irreversible.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click.native="cancel">Cancel</v-btn>
                    <v-btn color="green darken-1" flat @click.native="confirm">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Cancel Confirm Dialog end -->

        <!-- Delivered Confirm Dialog start -->
        <v-dialog v-model="isDeliveredDialogShown" max-width="420">
            <v-card>
                <v-card-title class="headline">Cancel Request</v-card-title>
                <v-card-text>Are you sure the delivered goods and quantity is correct?<br/> Order will sent to
                    Accounting
                    Department after confirm.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click.native="cancelDelivery">Cancel</v-btn>
                    <v-btn color="green darken-1" flat @click.native="confirmDelivery">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Delivered Confirm Dialog end -->
    </div>
</template>

<script>
    import moment from 'moment';
    import RequestItemList from "./RequestItemList";
    import {bus} from "../main";
    import RequestDetail from "./RequestDetail";

    export default {
        name: "RequestList",
        components: {RequestDetail, RequestItemList},
        created() {
            this.loadData();
            let component = this;
            bus.$on('saveRequestItem', function () {
                console.log('Msg received');
                component.isEditDialogShown = false;
                component.loadData();
            });
            bus.$on('requestListEditRequest', function () {
                console.log("edit request received");
                component.editItem(component.requests.find(i => i.requestId === component.selectedRequest));
                component.isDetailDialogShown = false;
            });
        },
        data() {
            return {
                search: '',
                isLoadingData: false,
                isEditDialogShown: false,
                isDetailDialogShown: false,
                isCancelDialogShown: false,
                isDeliveredDialogShown: false,

                selectedRequest: '',
                // Table Data
                headers: [
                    {
                        text: "Id",
                        align: "left",
                        value: "requestId"
                    },
                    {
                        text: "Restaurant (Id)",
                        value: "restaurantName"
                    },
                    {
                        text: "Creator",
                        value: "name"
                    },
                    {
                        text: "Status",
                        value: "requestStatusName"
                    },
                    {
                        text: "Create time",
                        value: "createTime"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                requests: [],
                users: [],
                restaurants: []
            }
        },
        watch: {
            isEditDialogShown(val) {
                val || bus.$emit('resetRequestItem');
            },
            isDetailDialogShown(val) {
                val || bus.$emit('refreshRequestDetail');
            }
        },
        methods: {
            getRequestType(typeId) {
                switch (typeId) {
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
            loadData() {
                this.isLoadingData = true;
                this.$http.get('user').then(res => {
                    if (res.data.success) {
                        this.users = res.data.responseContent;
                    }
                    this.$http.get('restaurant').then(res => {
                        if (res.data.success) {
                            this.restaurants = res.data.responseContent;
                        }
                        this.$http.get('restaurantrequest').then(res => {
                            if (res.data.success) {
                                this.requests = res.data.responseContent;
                                console.log('Request list:', res.data.responseContent);
                                setTimeout(() => this.isLoadingData = false, 300);
                                this.requests.map(req => {
                                    let user = this.users.find(user => user.userId === req.requestCreator);
                                    let restaurant = this.restaurants.find(rest => rest.restaurantId === req.restaurantId);
                                    for (let x in user) {
                                        req[x] = user[x];
                                    }
                                    for (let x in restaurant) {
                                        req[x] = restaurant[x];
                                    }
                                });

                                this.requests.map(req => {
                                    req.requestStatusName = this.getRequestType(req.requestStatus);
                                });
                            }
                        });
                    });
                });
            },
            addItem() {
                this.isEditDialogShown = true;
            },
            editItem(item) {
                this.selectedRequest = item.requestId;
                this.$http.get(`restaurantrequest/${item.requestId}`).then(res => {
                    if (res.data.success) {
                        console.log('Request Items:', res);
                        let req = res.data.responseContent.requestItem;
                        req.map(x => {
                            x.virtualItemId = x.requestVirtualItemId;
                        });
                        bus.$emit('editRequestItem', req);
                        this.isEditDialogShown = true;
                    }
                });

            },
            cancelRequest(item) {
                this.selectedRequest = item.requestId;
                this.isCancelDialogShown = true;
            },

            receiveConfirm(item) {
                this.selectedRequest = item.requestId;
                this.isDeliveredDialogShown = true;
            },
            confirm() {
                this.$http.post(`requeststatus/${this.selectedRequest}`, {status: -1}).then(res => {
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.isCancelDialogShown = false;
            },
            cancel() {
                this.isCancelDialogShown = false;
            },
            confirmDelivery() {
                this.$http.post(`requeststatus/${this.selectedRequest}`, {status: 4}).then(res => {
                    if (res.data.success) {
                        this.loadData();
                    }
                });
                this.isDeliveredDialogShown = false;
            },
            cancelDelivery() {
                this.isDeliveredDialogShown = false;
            },
            viewItem(item) {
                this.selectedRequest = item.requestId;
                this.isDetailDialogShown = true;
                bus.$emit('refreshRequestDetail')
            },
            isCancellable(item) {
                if (item.requestCreator == this.$store.state.userId && (item.requestStatus === 0 || item.requestStatus === -2)) {
                    return true;
                }
                return false;
            },
            canEditRequest(item) {
                if (item.requestCreator == this.$store.state.userId && (item.requestStatus === 0 || item.requestStatus === -2)) {
                    return true;
                }
                return false;
            },
            canConfirmRequest(item) {
                if (item.requestStatus === 2 || item.requestStatus === 3) {
                    return true;
                }
                return false;
            },
            moment: moment
        }
    }
</script>