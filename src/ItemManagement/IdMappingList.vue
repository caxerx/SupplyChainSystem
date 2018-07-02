<template>
    <div>
        <!-- Table toolbar start -->
        <v-toolbar dark color="primary" class="elevation-0" :clipped-left="$vuetify.breakpoint.lgAndUp">
            <v-toolbar-title class="white--text">Item ID Mapping List</v-toolbar-title>
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
        <v-data-table :headers="headers" :items="itemMaps" class="elevation-1" :search="search">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>{{ props.item.virtualItemId }}</td>
                <td>{{ props.item.virtualItemName }}</td>
                <td>{{ props.item.virtualItemDescription }}</td>
                <td class="layout px-0">
                    <v-btn icon class="mx-0" @click="viewItem(props.item)">
                        <v-icon color="blue">category</v-icon>
                    </v-btn>
                </td>
            </template>

            <template slot="no-data">
                No Data!
            </template>
        </v-data-table>
        <!-- Table end -->
        <v-dialog v-model="isItemDialogShown" max-width="900">
            <v-card>
                <id-map-item-list :v-item="selectedItem"></id-map-item-list>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import IdMapItemList from "./IdMapItemList";

    export default {
        name: "IdMapping",
        components: {IdMapItemList},
        created() {
            this.loadData();
        },
        data() {
            return {
                search: '',
                isLoadingData: false, //Loading state
                isItemDialogShown: false,
                headers: [
                    //Table header data
                    {
                        text: "Id",
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
                        value: "virtualItemDescription"
                    },
                    {
                        text: "Actions",
                        value: "action",
                        sortable: false
                    }
                ],
                itemMaps: [],
                selectedItem: ''
            };
        },
        methods: {
            loadData() {
                this.isLoadingData = true;
                this.$http.get('virtualitem').then(res => {
                    if (res.data.success) {
                        setTimeout(() => this.isLoadingData = false, 300);
                        this.itemMaps = res.data.responseContent;
                        console.log('Item Map list:',this.itemMaps);
                    }
                });
            },
            viewItem(item) {
                this.selectedItem = item.virtualItemId;
                this.isItemDialogShown = true;
            }
        }
    }
</script>

<style scoped>

</style>