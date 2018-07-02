<template>
    <div>
        <v-card class="pa-3" color="grey lighten-3" v-if="deliveryNote.deliveryNoteId">
            <v-layout row>
                <v-flex xs4 class="mr-3">
                    <v-card>
                        <v-card-title>
                            <h4>Delivery Note Details</h4>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Create Time:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ deliveryNote.createTime }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Status:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ this.deliveryNote.deliveryStatus }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Restaurant Name:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end">
                                    {{ deliveryNote.request.restaurant.restaurantName }}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-content>
                                    Restaurant Location:
                                </v-list-tile-content>
                                <v-list-tile-content class="align-end loc">
                                    {{ deliveryNote.request.restaurant.restaurantLocation }}
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>

                <v-flex xs8>

                    <!-- Table toolbar start -->
                    <v-toolbar dark color="primary" class="elevation-0">
                        <v-toolbar-title class="white--text">Delivery Item List</v-toolbar-title>
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
                    </v-toolbar>
                    <!-- Table toolbar end -->

                    <!-- Table start -->
                    <v-data-table v-if="deliveryNote.request"
                                  :headers="headers"
                                  :items="deliveryNote.request.requestItem"
                                  class="elevation-1"
                                  :search="search"
                    >
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.virtualItem.virtualItemId }}</td>
                            <td>{{ props.item.virtualItem.virtualItemName }}</td>
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
    export default {
        name: "DeliveryNoteDetail",
        data() {
            return {
                search: '',
                headers: [
                    {
                        text: 'Virtual Item Id',
                        value: 'virtualItem.virtualItemId'
                    },
                    {
                        text: 'Name',
                        value: 'virtualItem.virtualItemName'
                    },
                    {
                        text: 'Quantity',
                        value: 'quantity'
                    }
                ]
            }
        },
        props: ['deliveryNote']
    }
</script>

<style scoped>
    .loc {
        text-align: end;
        height: 100px;
        white-space: pre-line;
    }
</style>