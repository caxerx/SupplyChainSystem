<template>
    <div>
        <v-layout row>
            <v-flex xs6>
                <!-- Table toolbar start -->
                <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                    <v-toolbar-title class="white--text">Virtual Item List</v-toolbar-title>
                    <v-text-field
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
                <v-data-table :headers="headers" :items="virtualItems" class="elevation-1" :search="search">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.virtualItemId }}</td>
                        <td>{{ props.item.virtualItemName }}</td>
                        <td>{{ props.item.virtualItemDescription }}</td>
                        <td class="layout px-0" style="vertical-align: middle">
                            <!--
                            <v-text-field v-model="props.item.quantity" label="Quantity" single-line
                                          type="number" min="1"></v-text-field>
                                          -->
                            <inline-input v-model="props.item.quantity" label="Quantity" type="number"></inline-input>
                            <v-btn icon class="mx-0" @click="addItem(props.item)">
                                <v-icon color="blue">add</v-icon>
                            </v-btn>
                        </td>
                    </template>

                    <template slot="no-data">
                        No Data!
                    </template>
                </v-data-table>
                <!-- Table end -->
            </v-flex>

            <v-flex xs6>
                <!-- Table toolbar start -->
                <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
                    <v-toolbar-title class="white--text">Request Item List</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon @click="save()">
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-toolbar>
                <!-- Table toolbar end -->

                <!-- Table start -->
                <v-data-table :headers="requestHeaders" :items="requestItems" class="elevation-1" hide-actions>
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.virtualItemId }}</td>
                        <td>{{ props.item.virtualItemName }}</td>
                        <td>{{ props.item.quantity }}</td>
                        <td class="layout px-0">
                            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                                <v-icon color="pink">delete</v-icon>
                            </v-btn>
                        </td>
                    </template>

                    <template slot="no-data">
                        No Data!
                    </template>
                </v-data-table>
                <!-- Table end -->
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import {bus} from "../main";
    import VirtualItemSelect from "../ItemManagement/VirtualItemSelect";
    import InlineInput from "../ItemManagement/InlineInput";

    export default {
        name: "RequestItemList",
        components: {InlineInput, VirtualItemSelect},
        created() {
            this.loadData();
            let component = this;
            bus.$on('editRequestItem', function (data) {
                component.editMode = true;
                component.requestItems = data;
                component.loadData();
            });
            bus.$on('resetRequestItem', function () {
                component.loadData();
                component.editMode = false;
                component.requestItems = [];
            });
        },
        data() {
            return {
                editMode: false,
                search: '',
                isLoadingData: false, //Loading state
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
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                headers: [
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
                        text: "Description",
                        value: "virtualItemDescription"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                virtualItems: [],
                requestItems: [],
                editedIndex: -1,
                removedIndex: -1
            };
        },

        props: ['request'],

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? "New Item" : "Edit Item";
            }
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('virtualitem').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.virtualItems = res.data.responseContent;
                        // console.log(this.virtualItems);
                    }
                });
            },
            addItem(item) {
                // console.log('Request items:', this.requestItems);
                if (this.requestItems.find(x => x.virtualItemId === item.virtualItemId) || !item.quantity) {
                    // TODO ERROR CHECKING
                    item.quantity = undefined;
                    return false;
                }
                this.requestItems.push({
                    virtualItemId: item.virtualItemId,
                    virtualItemName: item.virtualItemName,
                    quantity: item.quantity
                });
                item.quantity = undefined;
            },
            deleteItem(item) {
                this.requestItems.splice(this.requestItems.indexOf(item), 1);
            },
            save() {
                if (this.editMode) {
                    this.$http.put(`restaurantrequest`, this.request, this.requestItems).then(res => {
                        if (res.data.success) {
                            console.log('Request Item edited');
                            bus.$emit('saveRequestItem');
                        }
                    });
                } else {
                    this.$http.post('restaurantrequest', this.requestItems).then(res => {
                        if (res.data.success) {
                            console.log('Request sent');
                        }
                        bus.$emit('saveRequestItem');
                        this.requestItems = [];
                    });
                }
                this.editMode = false;
            }
        }
    }
</script>