<template>
    <div>
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
        <v-data-table :headers="headers" :items="virtualItems" class="elevation-1" :search="search"
                      :rows-per-page-items="this.$store.state.rowPerPage">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.virtualItemId }}</td>
                <td>{{ props.item.virtualItemName }}</td>
                <td>{{ props.item.virtualItemDescription }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="selectItem(props.item)">
                        <v-icon color="blue">add</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->
    </div>
</template>

<script>
    import {bus} from "../main";

    export default {
        name: "VirtualItemSelect",
        created() {
            this.loadData();
        },
        props: ['channel'],
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                headers: [
                    //Table header data
                    {
                        text: "Id",
                        align: "left",
                        value: "id"
                    },
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
                        value: "virtualItemDescription",
                        width: "300"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                virtualItems: [], //User data, ajax fetch reserve
            };
        },

        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('virtualitem').then(res => {
                    if (res.data.success) {
                        this.virtualItems = res.data.responseContent;
                        setTimeout(() => this.isLoadingData = false, 300);
                    }
                });
            },
            selectItem(item) {
                console.log('Item Selected:', item.virtualItemId);
                bus.$emit(this.channel, item.virtualItemId)
            }
        }
    }
</script>