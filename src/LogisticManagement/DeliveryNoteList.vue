<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Delivery Note List</v-toolbar-title>
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

            <v-btn icon @click="loadData()">
                <v-icon v-if="!isLoadingData">refresh</v-icon>
                <v-progress-circular v-else size="25" indeterminate color="blue"></v-progress-circular>
            </v-btn>
        </v-toolbar>
        <!-- Table toolbar end -->

        <!-- Table start -->
        <v-data-table :headers="headers" :items="deliveryNotes" class="elevation-1" :search="search"
                      :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.deliveryNoteId }}</td>
                <td>{{ props.item.request.restaurant.restaurantName }}</td>
                <td>{{ props.item.createTime }}</td>
                <td>{{ props.item.deliveryStatus }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="viewItem(props.item)">
                        <v-icon color="blue">info</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->

        <!-- Detail Dialog -->
        <v-dialog v-model="isDetailDialogShown" max-width="1000">
            <v-card>
                <delivery-note-detail :delivery-note="selectedDeliveryNote"></delivery-note-detail>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import DeliveryNoteDetail from "./DeliveryNoteDetail";
    export default {
        name: "DeliveryNoteList",
        components: {DeliveryNoteDetail},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                isDetailDialogShown: false,
                pagination: {'sortBy': 'deliveryNoteId', 'descending': true, 'rowsPerPage': 5},
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        value: "deliveryNoteId"
                    },
                    {
                        text: "Restaurant",
                        value: "request.restaurant.restaurantName"
                    },
                    {
                        text: "Create Time",
                        value: "createTime"
                    },
                    {
                        text: "Status",
                        value: "deliveryStatus"
                    },
                    {
                        text: "Actions",
                        value: "name",
                        sortable: false
                    }
                ],
                deliveryNotes: [],
                selectedDeliveryNote: {}
            };
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('deliverynote').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.deliveryNotes = res.data.responseContent;
                        for (let i = 0; i < this.deliveryNotes.length; i++) {
                            this.deliveryNotes[i].createTime = this.deliveryNotes[i].createTime.replace('T', ' ');
                            this.deliveryNotes[i].deliveryStatus = this.getStatusName(this.deliveryNotes[i].deliveryStatus);
                        }
                    }
                });
            },
            viewItem(item) {
                this.selectedDeliveryNote = item;
                this.isDetailDialogShown = true;
            },
            getStatusName(status) {
                switch (status) {
                    case 0:
                        return 'Delivering';
                    case 1:
                        return 'Received';
                    default:
                        return 'Unknown';
                }
            }
        }
    }
</script>