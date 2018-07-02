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
                      :pagination.sync="pagination"
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
                               :disabled="props.item.requestStatus==-1">
                            <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <span v-if="props.item.requestStatus==-1">Request Cancelled</span>
                        <span v-else>Edit</span>
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
    </div>
</template>

<script>
    import moment from 'moment';
    import RequestItemList from "./RequestItemList";
    import {bus} from "../main";
    import RequestDetail from "./RequestDetail";

    export default {
        name: "FullRequestList",
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
        beforeDestroy() {
            bus.$off('saveRequestItem');
            bus.$off('requestListEditRequest');
        },
        data() {
            return {
                pagination: {'sortBy': 'requestId', 'descending': true, 'rowsPerPage': 5},
                search: '',
                isLoadingData: false,
                isEditDialogShown: false,
                isDetailDialogShown: false,

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
                    case 5:
                        return "Waiting For Despatch";
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
                        this.$http.get('purchaserequest').then(res => {
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
                this.$http.get(`purchaserequest/${item.requestId}`).then(res => {
                    if (res.data.success) {
                        console.log('Request Items:', res);
                        let req = res.data.responseContent.requestItem;
                        req.map(x => {
                            x.virtualItemId = x.requestVirtualItemId;
                        });
                        //bus.$emit('requestListEditRequest', req);
                        this.isEditDialogShown = true;
                    }
                });

            },
            viewItem(item) {
                this.selectedRequest = item.requestId;
                this.isDetailDialogShown = true;
                bus.$emit('refreshRequestDetail')
            },
            moment: moment
        }
    }
</script>